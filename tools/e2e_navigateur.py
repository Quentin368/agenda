"""Test de bout en bout : vrai navigateur (Chromium sans fenêtre) ⇄ vrai backend ⇄ Radicale jetable.

Chromium est piloté par le protocole DevTools ; ses requêtes vers http://agenda.test/ sont interceptées et
transmises au backend (TestClient), lui-même branché sur un Radicale temporaire (jamais la vraie pile).
Lancer depuis la racine du dépôt :   .venv/bin/python tools/e2e_navigateur.py
Prérequis : chromium installé, `pip install -r requirements-dev.txt`.
Note : --password-store=basic est indispensable sur le Pi (sinon Chromium attend le trousseau système).
"""
import asyncio, base64, dataclasses, json, os, pathlib, shutil, subprocess, sys, tempfile, time, urllib.request
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path[:0] = [os.path.join(ROOT, 'backend'), os.path.join(ROOT, 'tests')]
import httpx, websockets
import conftest
from conftest import USER, PASSWORD, mkcalendar, put
from fastapi.testclient import TestClient
from agenda.config import Settings
from agenda.main import create_app
T = tempfile.mkdtemp(prefix='e2e-')
ok = []
def check(name, cond, info=''):
    ok.append(bool(cond)); print(('OK   ' if cond else 'ÉCHEC') + ' ' + name + ('' if cond else f'  [{info}]'), flush=True)

class F:
    def mktemp(self, n): return pathlib.Path(tempfile.mkdtemp(prefix=n))
gen = conftest.radicale.__wrapped__(F()); URL = next(gen)
mkcalendar(URL, f'{USER}/dev-agenda/', 'dev-agenda', '#13747f'); mkcalendar(URL, f'{USER}/perso/', 'Perso', '#3b82f6')
put(URL, f'{USER}/perso/p.ics', 'BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//t//FR\nBEGIN:VEVENT\nUID:perso-1\nDTSTART;TZID=Europe/Paris:20261118T180000\nDTEND;TZID=Europe/Paris:20261118T190000\nSUMMARY:Ciné (test)\nEND:VEVENT\nEND:VCALENDAR\n')
put(URL, f'{USER}/dev-agenda/serie.ics', 'BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//Telephone//FR\nBEGIN:VEVENT\nUID:serie-1\nDTSTART;TZID=Europe/Paris:20261116T090000\nDTEND;TZID=Europe/Paris:20261116T100000\nRRULE:FREQ=WEEKLY;BYDAY=MO\nSUMMARY:Cours\nX-INCONNU:garde-moi\nEND:VEVENT\nEND:VCALENDAR\n')
raw = lambda p: httpx.get(URL + p, auth=(USER, PASSWORD))
cfg = dataclasses.replace(Settings(), radicale_url=URL, static_dir=pathlib.Path(ROOT, 'static'), writable_calendars=('dev-agenda', 'dev-*'))
client = TestClient(create_app(cfg), base_url='http://agenda.test'); client.__enter__()

class CDP:
    def __init__(s, ws): s.ws, s.n, s.wait, s.events, s.handlers = ws, 0, {}, [], []
    async def pump(s):
        async for m in s.ws:
            m = json.loads(m)
            if 'id' in m and m['id'] in s.wait: s.wait.pop(m['id']).set_result(m)
            elif m.get('method') == 'Fetch.requestPaused': asyncio.ensure_future(s.on_request(m['params']))
            elif 'method' in m: s.events.append(m)
    async def __call__(s, method, **params):
        s.n += 1; f = asyncio.get_event_loop().create_future(); s.wait[s.n] = f
        await s.ws.send(json.dumps({'id': s.n, 'method': method, 'params': params}))
        r = await asyncio.wait_for(f, 60)
        if 'error' in r: raise RuntimeError(f'{method}: {r["error"]}')
        return r.get('result', {})
    async def js(s, expr):
        r = await s('Runtime.evaluate', expression=expr, awaitPromise=True, returnByValue=True)
        if 'exceptionDetails' in r: raise RuntimeError(json.dumps(r['exceptionDetails'])[:500])
        return r['result'].get('value')
    async def on_request(s, p):
        try: await s._on_request(p)
        except Exception as e:
            import traceback; print('ERREUR interception', p['request']['url'], traceback.format_exc()[-600:], flush=True)
    async def _on_request(s, p):
        req = p['request']; path = req['url'].split('agenda.test', 1)[1] or '/'
        client.cookies.clear()
        h = {k: v for k, v in req['headers'].items() if k.lower() not in ('host', 'content-length')}
        h['Origin'] = h.get('Origin', 'http://agenda.test') if req['method'] != 'GET' else h.get('Origin', '')
        if not h['Origin']: h.pop('Origin')
        body = base64.b64decode(req['postDataEntries'][0]['bytes']) if req.get('postDataEntries') else (req.get('postData') or '').encode() or None
        r = await asyncio.to_thread(client.request, req['method'], path, headers=h, content=body)
        hdrs = [{'name': k, 'value': v} for k, v in r.headers.multi_items() if k.lower() not in ('content-length', 'content-encoding', 'transfer-encoding')]
        await s('Fetch.fulfillRequest', requestId=p['requestId'], responseCode=r.status_code, responseHeaders=hdrs, body=base64.b64encode(r.content).decode())

async def settle(c, t=1.2):
    await asyncio.sleep(t)
    for _ in range(40):
        if await c.js("!SENDING && !PENDING && !LOADING"): return
        await asyncio.sleep(0.2)

async def main():
    br = subprocess.Popen(['chromium', '--headless=new', '--remote-debugging-port=9335', f'--user-data-dir={T}/p-e2e', '--disable-gpu', '--password-store=basic', '--no-first-run', 'about:blank'],
                          stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, env={**os.environ, 'TZ': 'Europe/Paris'})
    try:
        for _ in range(50):
            try: tabs = json.load(urllib.request.urlopen('http://127.0.0.1:9335/json')); break
            except Exception: time.sleep(0.2)
        async with websockets.connect(next(t for t in tabs if t['type'] == 'page')['webSocketDebuggerUrl'], max_size=2**27, ping_interval=None) as ws:
            c = CDP(ws); asyncio.ensure_future(c.pump())
            for d in ('Page', 'Runtime'): await c(f'{d}.enable')
            await c('Fetch.enable', patterns=[{'urlPattern': 'http://agenda.test/*'}])
            await c('Emulation.setDeviceMetricsOverride', width=1440, height=900, deviceScaleFactor=1, mobile=False)
            await c('Page.navigate', url='http://agenda.test/'); await asyncio.sleep(2.5)
            check('page servie par le vrai backend : écran de connexion', await c.js("!$('login').hidden"))
            await c.js(f"$('l-user').value = 'quentin'; $('l-pass').value = {json.dumps(PASSWORD)}; $('login-form').requestSubmit(); true"); await settle(c, 2)
            check('connexion réelle', await c.js("API.user === 'quentin' && !$('app').hidden"))
            check('préfixe des calendriers reçu', await c.js("CAL_PREFIX") == 'dev-')
            check('calendriers + verrou', await c.js("S.calendars.map(c => c.id + (SRV_META.calendars[c.id].writable ? '✎' : '🔒')).join(' ')") == 'dev-agenda✎ perso🔒')
            # 1. créer
            await c.js("{ const snap = snapshot(); S.events.push(norm({ id: (UI.hl = uid('e')), cal: 'dev-agenda', title: 'Dentiste', start: '2026-11-20T17:30', end: '2026-11-20T18:00', allDay: false, rem: '60' })); refreshData(['dev-agenda']); toast('Événement créé', snap); } true")
            await settle(c)
            nid = await c.js("S.events.find(e => e.title === 'Dentiste').id")
            r = raw(f'{USER}/dev-agenda/{nid}.ics')
            check('création écrite dans Radicale', r.status_code == 200 and 'SUMMARY:Dentiste' in r.text and 'TRIGGER:-PT1H' in r.text, r.status_code)
            check('id aléatoire, sûr', nid.startswith('e-') and len(nid) == 26, nid)
            # 2. modifier puis annuler
            await c.js(f"{{ const snap = snapshot(); getEv('{nid}').title = 'Dentiste (contrôle)'; refreshData(); toast('Modifications enregistrées', snap); }} true"); await settle(c)
            check('modification écrite', 'SUMMARY:Dentiste (contrôle)' in raw(f'{USER}/dev-agenda/{nid}.ics').text)
            await c.js("undoLast(); true"); await settle(c)
            check('« Annuler » synchronisé', 'SUMMARY:Dentiste\r\n' in raw(f'{USER}/dev-agenda/{nid}.ics').text)
            # 3. supprimer puis annuler : à l'octet près
            before = raw(f'{USER}/dev-agenda/serie.ics').text
            await c.js("{ const snap = snapshot(); S.events = S.events.filter(e => e.id !== 'serie-1'); refreshData(); toast('Événement supprimé', snap); } true"); await settle(c)
            check('suppression écrite', raw(f'{USER}/dev-agenda/serie.ics').status_code == 404)
            await c.js("undoLast(); true"); await settle(c)
            check('« Annuler » la suppression : fichier identique à l’octet', raw(f'{USER}/dev-agenda/serie.ics').text == before)
            # 4. cette occurrence seulement (même code que la maquette)
            await c.js("""{ const ev = getEv('serie-1'), snap = snapshot(); ev.exdates.push('2026-11-30');
                 S.events.push(norm({ ...JSON.parse(JSON.stringify(ev)), title: 'Cours en amphi', start: '2026-11-30T10:00', end: '2026-11-30T11:00', id: (UI.hl = uid('e')), rrule: { freq: 'none' }, exdates: [] }));
                 refreshData(); toast('Occurrence modifiée', snap); } true"""); await settle(c)
            t = raw(f'{USER}/dev-agenda/serie.ics').text
            check('occurrence → RECURRENCE-ID, propriété inconnue gardée', 'RECURRENCE-ID;TZID=Europe/Paris:20261130T090000' in t and 'X-INCONNU:garde-moi' in t and 'EXDATE' not in t)
            await c.js("undoLast(); true"); await settle(c)
            t = raw(f'{USER}/dev-agenda/serie.ics').text
            check('annuler l’occurrence modifiée', 'RECURRENCE-ID' not in t and 'EXDATE' not in t)
            # 5. calendrier verrouillé
            await c.js("{ const snap = snapshot(); getEv('perso-1').title = 'Piraté'; refreshData(); toast('Modifications enregistrées', snap); } true"); await settle(c)
            check('verrou : refusé, état remis, message', await c.js("getEv('perso-1').title === 'Ciné (test)' && /lecture seule/.test(document.querySelector('.toast').textContent) && UNDO.every(u => !/Piraté/.test(u.snap))"))
            check('verrou : Radicale intact', 'SUMMARY:Ciné (test)' in raw(f'{USER}/perso/p.ics').text)
            # 6. conflit
            put(URL, f'{USER}/dev-agenda/{nid}.ics', raw(f'{USER}/dev-agenda/{nid}.ics').text.replace('\r\n', '\n').replace('SUMMARY:Dentiste', 'SUMMARY:Changé sur le téléphone'))
            await c.js(f"{{ const snap = snapshot(); getEv('{nid}').loc = 'Cabinet'; refreshData(); toast('Modifications enregistrées', snap); }} true"); await settle(c, 2)
            check('conflit : rien écrasé', 'SUMMARY:Changé sur le téléphone' in raw(f'{USER}/dev-agenda/{nid}.ics').text and 'Cabinet' not in raw(f'{USER}/dev-agenda/{nid}.ics').text)
            check('conflit : message et version de Radicale affichée', await c.js(f"getEv('{nid}').title === 'Changé sur le téléphone' && /ailleurs/.test(document.querySelector('.toast').textContent)"))
            # 7. nouveau calendrier
            await c.js("{ const snap = snapshot(); S.calendars.push({ id: uid('c'), name: 'Projets', color: 'olive', visible: true }); refreshData(); toast('Calendrier créé', snap); } true"); await settle(c)
            cid = await c.js("S.calendars.find(x => x.name === 'Projets').id")
            check('calendrier créé (préfixe dev-)', cid.startswith('dev-c-') and httpx.request('PROPFIND', URL + f'{USER}/{cid}/', auth=(USER, PASSWORD), headers={'Depth': '0'}).status_code == 207, cid)
            # 8. échéance : pas encore
            await c.js("{ const snap = snapshot(); S.dues.push({ id: uid('k'), t: 'x', ev: 'serie-1', occ: '2026-11-23', title: 'Cours', start: '2026-11-23T09:00', allDay: false, cal: 'dev-agenda' }); refreshData(); toast('Échéance ajoutée', snap); } true"); await settle(c)
            check('échéances : refusées pour l’instant', await c.js("S.dues.length === 0 && /Échéances/.test(document.querySelector('.toast').textContent)"))
            # 8b. vrai glisser à la souris : « Ciné » ne bouge pas (verrouillé), « Dentiste » descend d'une heure
            await c.js("cal.gotoDate('2026-11-16'); cal.changeView('timeGridWeek'); true"); await asyncio.sleep(1)
            box = await c.js(f"""(() => {{ const el = document.querySelector('.fc-event[data-occ^="{nid}@"]'); const r = el.getBoundingClientRect();
                const slot = document.querySelector('.fc-timegrid-slot-lane').getBoundingClientRect().height;
                return [r.x + r.width / 2, r.y + 6, slot]; }})()""")
            x, y, slot = box
            await c('Input.dispatchMouseEvent', type='mousePressed', x=x, y=y, button='left', clickCount=1)
            for i in range(1, 11):
                await c('Input.dispatchMouseEvent', type='mouseMoved', x=x, y=y + slot * 2 * i / 10, button='left'); await asyncio.sleep(0.05)
            await c('Input.dispatchMouseEvent', type='mouseReleased', x=x, y=y + slot * 2, button='left', clickCount=1)
            await settle(c, 1.5)
            r = raw(f'{USER}/dev-agenda/{nid}.ics').text
            check('glisser à la souris : nouvelle heure écrite (18:30 Paris)', 'DTSTART;TZID=Europe/Paris:20261120T183000' in r, [l for l in r.split() if l.startswith('DTSTART')])
            # 9. rechargement : tout correspond au serveur
            await c.js("loadData().then(() => window.__r = canonState() === SERVER.canon); true"); await settle(c)
            check('après rechargement : S identique au serveur', await c.js("window.__r"))
            errs = [e for e in c.events if e['method'] == 'Runtime.exceptionThrown' or (e['method'] == 'Runtime.consoleAPICalled' and e['params']['type'] == 'error')]
            check('aucune erreur JavaScript', not errs, [json.dumps(e['params'])[:300] for e in errs])
    finally:
        br.terminate(); client.__exit__(None, None, None); next(gen, None); shutil.rmtree(T, ignore_errors=True)
    print(f'{sum(ok)}/{len(ok)} vérifications réussies')
    return all(ok)

sys.exit(0 if asyncio.run(main()) else 1)
