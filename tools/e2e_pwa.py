"""Test de l'application installable (PWA) dans un vrai Chromium : vrai serveur (uvicorn) sur localhost, Radicale jetable.

Vérifie : installabilité (avis de Chrome), service worker actif, cache = interface seulement (jamais /api),
mise à jour prise au rechargement, ouverture hors connexion sur « Pi injoignable », retour quand le Pi revient.
Lancer depuis la racine du dépôt :   .venv/bin/python tools/e2e_pwa.py
"""
import asyncio, json, os, pathlib, shutil, socket, subprocess, sys, tempfile, time, urllib.request
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path[:0] = [os.path.join(ROOT, 'backend'), os.path.join(ROOT, 'tests')]
import httpx, websockets
import conftest
from conftest import USER, PASSWORD, mkcalendar
T = tempfile.mkdtemp(prefix='pwa-')
ok = []
def check(name, cond, info=''):
    ok.append(bool(cond)); print(('OK   ' if cond else 'ÉCHEC') + ' ' + name + ('' if cond else f'  [{info}]'), flush=True)

class F:
    def mktemp(self, n): return pathlib.Path(tempfile.mkdtemp(prefix=n))
gen = conftest.radicale.__wrapped__(F()); RAD = next(gen)
mkcalendar(RAD, f'{USER}/perso/', 'Perso', '#3b82f6')
STATIC = pathlib.Path(T, 'static'); shutil.copytree(os.path.join(ROOT, 'static'), STATIC)   # copie : on simule une mise à jour
with socket.socket() as s:
    s.bind(('127.0.0.1', 0)); PORT = s.getsockname()[1]
BASE = f'http://localhost:{PORT}'

def start_server():
    env = {**os.environ, 'PYTHONPATH': os.path.join(ROOT, 'backend'), 'RADICALE_URL': RAD, 'STATIC_DIR': str(STATIC), 'WRITABLE_CALENDARS': '*'}
    p = subprocess.Popen([sys.executable, '-m', 'uvicorn', 'agenda.main:app', '--host', '127.0.0.1', '--port', str(PORT)],
                         env=env, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    for _ in range(100):
        try:
            httpx.get(BASE + '/healthz', timeout=0.5); return p
        except httpx.HTTPError:
            time.sleep(0.1)
    raise RuntimeError('serveur non démarré')

async def main():
    srv = start_server()
    br = subprocess.Popen(['chromium', '--headless=new', '--remote-debugging-port=9337', f'--user-data-dir={T}/profil', '--disable-gpu',
                           '--password-store=basic', '--no-first-run', 'about:blank'], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL,
                          env={**os.environ, 'TZ': 'Europe/Paris'})
    try:
        for _ in range(50):
            try: tabs = json.load(urllib.request.urlopen('http://127.0.0.1:9337/json')); break
            except Exception: time.sleep(0.2)
        async with websockets.connect(next(t for t in tabs if t['type'] == 'page')['webSocketDebuggerUrl'], max_size=2**27, ping_interval=None) as ws:
            n = 0; events = []
            async def call(m, **p):
                nonlocal n; n += 1; i = n; await ws.send(json.dumps({'id': i, 'method': m, 'params': p}))
                while True:
                    r = json.loads(await asyncio.wait_for(ws.recv(), 60))
                    if r.get('id') == i:
                        if 'error' in r: raise RuntimeError(r['error'])
                        return r.get('result', {})
                    if 'method' in r: events.append(r)
            async def js(e):
                r = await call('Runtime.evaluate', expression=e, awaitPromise=True, returnByValue=True)
                if 'exceptionDetails' in r: raise RuntimeError(json.dumps(r['exceptionDetails'])[:400])
                return r['result'].get('value')
            for d in ('Page', 'Runtime'): await call(f'{d}.enable')
            await call('Emulation.setDeviceMetricsOverride', width=412, height=915, deviceScaleFactor=2, mobile=True)
            await call('Page.navigate', url=BASE + '/'); await asyncio.sleep(3)
            # 1. installable ?
            errs = (await call('Page.getInstallabilityErrors')).get('installabilityErrors', [])
            check('Chrome juge l’application installable', not errs, errs)
            man = await call('Page.getAppManifest')
            check('manifeste lu sans erreur', man.get('url', '').endswith('/manifest.webmanifest') and not man.get('errors'), man.get('errors'))
            # 2. service worker actif, cache = interface seulement
            for _ in range(30):
                if await js("!!navigator.serviceWorker.controller"): break
                await js("navigator.serviceWorker.ready.then(() => true)"); await asyncio.sleep(0.5)
                await call('Page.reload'); await asyncio.sleep(2)
            check('service worker actif sur la page', await js("!!navigator.serviceWorker.controller"))
            await js(f"(async () => {{ $('l-pass').value = {json.dumps(PASSWORD)}; $('login-form').requestSubmit(); return true; }})()"); await asyncio.sleep(2.5)
            check('connexion réelle', await js("API.user === 'quentin' && !$('app').hidden"))
            keys = await js("caches.keys().then(ks => Promise.all(ks.map(k => caches.open(k).then(c => c.keys()).then(rs => rs.map(r => new URL(r.url).pathname))))).then(a => a.flat())")
            check('cache : l’interface y est', '/app.js' in keys and '/sync.js' in keys and '/' in keys, keys)
            check('cache : aucune donnée /api', not any(k.startswith('/api') for k in keys), [k for k in keys if k.startswith('/api')])
            # 3. mise à jour : un fichier change sur le Pi → pris au rechargement
            with open(STATIC / 'app.css', 'a') as f: f.write('\n/* version-2 */\n')
            await call('Page.reload'); await asyncio.sleep(3)
            css = await js("fetch('/app.css').then(r => r.text()).then(t => t.includes('version-2'))")
            cached = await js("caches.match('/app.css').then(r => r && r.text()).then(t => !!t && t.includes('version-2'))")
            check('mise à jour : nouvelle version prise au rechargement (et copie rafraîchie)', css and cached, [css, cached])
            # 4. Pi injoignable : serveur arrêté, l'appli s'ouvre quand même
            srv.terminate(); srv.wait(5)
            await call('Page.reload'); await asyncio.sleep(3)
            st = await js("({ off: !$('offline').hidden, app: !$('app').hidden, login: !$('login').hidden, titre: document.querySelector('#offline h1').textContent })")
            check('hors connexion : l’appli s’ouvre sur « Pi injoignable »', st['off'] and not st['app'] and not st['login'] and st['titre'] == 'Pi injoignable', st)
            png = await call('Page.captureScreenshot', format='png')
            import base64; open(os.path.join(ROOT, 'tools', '.pwa-hors-ligne.png'), 'wb').write(base64.b64decode(png['data']))
            # 5. le Pi revient : Réessayer → l'agenda (session « Rester connecté » toujours valide ? non : serveur redémarré)
            srv = start_server()
            await js("$('off-retry').click(); true"); await asyncio.sleep(2.5)
            st = await js("({ off: !$('offline').hidden, login: !$('login').hidden })")
            check('le Pi revient : « Réessayer » ramène à la connexion', not st['off'] and st['login'], st)
            errs = [e for e in events if e['method'] == 'Runtime.exceptionThrown']
            check('aucune erreur JavaScript', not errs, [json.dumps(e['params'])[:300] for e in errs])
    finally:
        br.terminate(); srv.terminate(); next(gen, None); shutil.rmtree(T, ignore_errors=True)
    print(f'{sum(ok)}/{len(ok)} vérifications réussies')
    return all(ok)

sys.exit(0 if asyncio.run(main()) else 1)
