"""Écriture de bout en bout : POST /api/changes contre un Radicale jetable (verrou « dev-* »)."""
import dataclasses
import itertools

import httpx
import pytest
from fastapi.testclient import TestClient

from agenda.config import Settings
from agenda.main import create_app
from conftest import PASSWORD, USER, mkcalendar, put

H = {'X-Requested-With': 'agenda'}
N = itertools.count()
RICH = '''BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Telephone//FR
BEGIN:VEVENT
UID:{uid}
DTSTAMP:20261101T100000Z
DTSTART:20261118T170000Z
DTEND:20261118T190000Z
SUMMARY:Réunion
ATTENDEE;CN=Moi;PARTSTAT=ACCEPTED:mailto:moi@example.org
X-INCONNU;PARAM=valeur:quelque chose
BEGIN:VALARM
ACTION:AUDIO
TRIGGER;VALUE=DATE-TIME:20261118T080000Z
END:VALARM
END:VEVENT
END:VCALENDAR
'''
SERIE = '''BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Telephone//FR
BEGIN:VEVENT
UID:{uid}
DTSTART;TZID=Europe/Paris:20261116T090000
DTEND;TZID=Europe/Paris:20261116T100000
RRULE:FREQ=WEEKLY;BYDAY=MO
SUMMARY:Cours
END:VEVENT
END:VCALENDAR
'''
SPECIALE = '''BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Telephone//FR
BEGIN:VEVENT
UID:{uid}
DTSTART;TZID=Europe/Paris:20261110T190000
DTEND;TZID=Europe/Paris:20261110T200000
RRULE:FREQ=MONTHLY;BYDAY=2TU;COUNT=4
SUMMARY:Club lecture
END:VEVENT
END:VCALENDAR
'''


@pytest.fixture()
def env(radicale, tmp_path):
    """Un calendrier de test neuf (dev-…) et un calendrier protégé, un client connecté."""
    n = next(N)
    dev, locked = f'dev-t{n}', f'perso{n}'
    mkcalendar(radicale, f'{USER}/{dev}/', 'Test', '#3a62d6')
    mkcalendar(radicale, f'{USER}/{locked}/', 'Perso', '#c4366f')
    cfg = dataclasses.replace(Settings(), radicale_url=radicale, static_dir=tmp_path, writable_calendars=('dev-agenda', 'dev-*'))
    with TestClient(create_app(cfg), base_url='http://raspberryquentin:8090') as c:
        csrf = c.post('/api/login', json={'user': USER, 'password': PASSWORD}, headers=H).json()['csrf']
        e = type('Env', (), {})()
        e.c, e.url, e.dev, e.locked, e.h = c, radicale, dev, locked, {**H, 'X-CSRF-Token': csrf}
        e.data = lambda: c.get('/api/data').json()
        e.send = lambda batch: c.post('/api/changes', json=batch, headers=e.h)
        e.raw = lambda path: httpx.get(radicale + path, auth=(USER, PASSWORD))
        e.put = lambda path, text: put(radicale, path, text)
        yield e


def evs(d, cal=None):
    return {x['id']: x for x in d['events'] if cal is None or x['cal'] == cal}


NEW = {'id': 'e-0a1b2c', 'title': 'Dentiste', 'start': '2026-11-20T17:30', 'end': '2026-11-20T18:00', 'allDay': False,
       'loc': 'Cabinet', 'desc': '', 'rem': '60', 'rrule': {'freq': 'none'}, 'exdates': []}


def test_calendrier_verrouille_refuse_sans_rien_ecrire(env):
    env.data()
    r = env.send({'events': [{'op': 'create', 'id': 'e-x', 'after': {**NEW, 'id': 'e-x', 'cal': env.locked}}]})
    assert r.status_code == 422 and 'lecture seule' in r.json()['error']['refused']
    assert env.raw(f'{USER}/{env.locked}/e-x.ics').status_code == 404
    d = env.data()
    assert d['meta']['calendars'][env.dev]['writable'] and not d['meta']['calendars'][env.locked]['writable']


def test_csrf_obligatoire(env):
    assert env.c.post('/api/changes', json={}, headers=H).status_code == 403


def test_creer_modifier_supprimer_puis_annuler(env):
    env.data()
    ev = {**NEW, 'cal': env.dev}
    assert env.send({'events': [{'op': 'create', 'id': ev['id'], 'after': ev}]}).json()['ok']
    assert evs(env.data(), env.dev)[ev['id']] == ev
    raw = env.raw(f'{USER}/{env.dev}/{ev["id"]}.ics').text
    assert 'UID:e-0a1b2c' in raw and 'TRIGGER:-PT1H' in raw
    after = {**ev, 'title': 'Dentiste (contrôle)', 'start': '2026-11-21T09:00', 'end': '2026-11-21T09:30'}
    assert env.send({'events': [{'op': 'update', 'id': ev['id'], 'before': ev, 'after': after}]}).json()['ok']
    assert evs(env.data(), env.dev)[ev['id']] == after
    before_delete = env.raw(f'{USER}/{env.dev}/{ev["id"]}.ics').text
    assert env.send({'events': [{'op': 'delete', 'id': ev['id'], 'before': after}]}).json()['ok']
    assert env.raw(f'{USER}/{env.dev}/{ev["id"]}.ics').status_code == 404
    assert env.send({'events': [{'op': 'create', 'id': ev['id'], 'after': after}]}).json()['ok']     # « Annuler »
    assert env.raw(f'{USER}/{env.dev}/{ev["id"]}.ics').text == before_delete                          # à l'octet près
    assert evs(env.data(), env.dev)[ev['id']] == after


def test_fidelite_sur_un_evenement_du_telephone(env):
    env.put(f'{USER}/{env.dev}/tel.ics', RICH.format(uid='tel-1'))
    before = evs(env.data(), env.dev)['tel-1']
    after = {**before, 'title': 'Réunion d’équipe'}
    assert env.send({'events': [{'op': 'update', 'id': 'tel-1', 'before': before, 'after': after}]}).json()['ok']
    raw = env.raw(f'{USER}/{env.dev}/tel.ics').text.replace('\r\n ', '')
    for keep in ('PRODID:-//Telephone//FR', 'ATTENDEE;CN=Moi;PARTSTAT=ACCEPTED:mailto:moi@example.org',
                 'X-INCONNU;PARAM=valeur:quelque chose', 'TRIGGER;VALUE=DATE-TIME:20261118T080000Z', 'DTSTART:20261118T170000Z'):
        assert keep in raw, keep
    assert 'SUMMARY:Réunion d’équipe' in raw


def test_conflit_etag_ne_rien_ecraser(env):
    env.put(f'{USER}/{env.dev}/conf.ics', RICH.format(uid='conf-1'))
    before = evs(env.data(), env.dev)['conf-1']
    env.put(f'{USER}/{env.dev}/conf.ics', RICH.format(uid='conf-1').replace('SUMMARY:Réunion', 'SUMMARY:Changé sur le téléphone'))
    r = env.send({'events': [{'op': 'update', 'id': 'conf-1', 'before': before, 'after': {**before, 'title': 'Depuis l’agenda'}}]})
    assert r.status_code == 409
    assert 'SUMMARY:Changé sur le téléphone' in env.raw(f'{USER}/{env.dev}/conf.ics').text


def test_cette_occurrence_seulement_puis_annuler(env):
    env.put(f'{USER}/{env.dev}/serie.ics', SERIE.format(uid='serie-1'))
    series = evs(env.data(), env.dev)['serie-1']
    occ = {**series, 'id': 'e-occ1', 'rrule': {'freq': 'none'}, 'exdates': [], 'title': 'Cours en amphi',
           'start': '2026-11-30T10:00', 'end': '2026-11-30T11:00'}
    s2 = {**series, 'exdates': ['2026-11-30']}
    r = env.send({'events': [{'op': 'update', 'id': 'serie-1', 'before': series, 'after': s2},
                             {'op': 'create', 'id': 'e-occ1', 'after': occ,
                              'overrideOf': {'series': 'serie-1', 'day': '2026-11-30', 'seriesModel': series}}]})
    assert r.json()['ok']
    raw = env.raw(f'{USER}/{env.dev}/serie.ics').text
    assert 'RECURRENCE-ID;TZID=Europe/Paris:20261130T090000' in raw and 'EXDATE' not in raw
    # « Annuler » tout de suite : la série reprend sa forme, l'occurrence modifiée disparaît
    r = env.send({'events': [{'op': 'update', 'id': 'serie-1', 'before': s2, 'after': series},
                             {'op': 'delete', 'id': 'e-occ1', 'before': occ}]})
    assert r.json()['ok']
    raw = env.raw(f'{USER}/{env.dev}/serie.ics').text
    assert 'RECURRENCE-ID' not in raw and 'EXDATE' not in raw
    assert set(evs(env.data(), env.dev)) == {'serie-1'}
    # Refaire, recharger (ids définitifs), puis supprimer l'occurrence modifiée : la date devient exclue
    assert env.send({'events': [{'op': 'update', 'id': 'serie-1', 'before': series, 'after': s2},
                                {'op': 'create', 'id': 'e-occ2', 'after': {**occ, 'id': 'e-occ2'},
                                 'overrideOf': {'series': 'serie-1', 'day': '2026-11-30', 'seriesModel': series}}]}).json()['ok']
    d = evs(env.data(), env.dev)
    assert d['serie-1']['exdates'] == ['2026-11-30'] and d['serie-1~r20261130T0900']['title'] == 'Cours en amphi'
    o = d['serie-1~r20261130T0900']
    assert env.send({'events': [{'op': 'delete', 'id': o['id'], 'before': o}]}).json()['ok']
    raw = env.raw(f'{USER}/{env.dev}/serie.ics').text
    assert 'RECURRENCE-ID' not in raw and 'EXDATE;TZID=Europe/Paris:20261130T090000' in raw
    assert set(evs(env.data(), env.dev)) == {'serie-1'}


def test_supprimer_cette_occurrence_et_les_suivantes(env):
    env.put(f'{USER}/{env.dev}/s2.ics', SERIE.format(uid='serie-2'))
    series = evs(env.data(), env.dev)['serie-2']
    s2 = {**series, 'exdates': ['2026-11-23']}
    assert env.send({'events': [{'op': 'update', 'id': 'serie-2', 'before': series, 'after': s2}]}).json()['ok']
    s3 = {**s2, 'rrule': {**s2['rrule'], 'until': '2026-12-06'}}
    assert env.send({'events': [{'op': 'update', 'id': 'serie-2', 'before': s2, 'after': s3}]}).json()['ok']
    assert evs(env.data(), env.dev)['serie-2'] == s3
    raw = env.raw(f'{USER}/{env.dev}/s2.ics').text
    assert 'UNTIL=20261206T080000Z' in raw and 'EXDATE;TZID=Europe/Paris:20261123T090000' in raw


def test_serie_speciale_occurrence_modifiee_puis_supprimee(env):
    env.put(f'{USER}/{env.dev}/sp.ics', SPECIALE.format(uid='sp-1'))
    d = evs(env.data(), env.dev)
    occ = d['sp-1~o20261208T1900']
    r = env.send({'events': [{'op': 'update', 'id': occ['id'], 'before': occ, 'after': {**occ, 'title': 'Club (Noël)'}}]})
    assert r.json()['ok']
    raw = env.raw(f'{USER}/{env.dev}/sp.ics').text
    assert 'RECURRENCE-ID;TZID=Europe/Paris:20261208T190000' in raw and 'BYDAY=2TU' in raw
    d = evs(env.data(), env.dev)
    assert d['sp-1~o20261208T1900']['title'] == 'Club (Noël)' and d['sp-1~o20261110T1900']['title'] == 'Club lecture'
    r = env.send({'events': [{'op': 'update', 'id': 'sp-1~o20270112T1900', 'before': d['sp-1~o20270112T1900'],
                              'after': {**d['sp-1~o20270112T1900'], 'rrule': {'freq': 'weekly', 'days': [2], 'until': None}}}]})
    assert r.status_code == 422                                     # la répétition ne se change pas ici
    assert env.send({'events': [{'op': 'delete', 'id': 'sp-1~o20270112T1900', 'before': d['sp-1~o20270112T1900']}]}).json()['ok']
    assert 'sp-1~o20270112T1900' not in evs(env.data(), env.dev)
    assert 'EXDATE;TZID=Europe/Paris:20270112T190000' in env.raw(f'{USER}/{env.dev}/sp.ics').text


def test_deplacer_vers_un_autre_calendrier(env):
    other = f'{env.dev}-b'
    mkcalendar(env.url, f'{USER}/{other}/', 'Test B', '#1f7a52')
    env.put(f'{USER}/{env.dev}/mv.ics', RICH.format(uid='mv-1'))
    before = evs(env.data(), env.dev)['mv-1']
    assert env.send({'events': [{'op': 'update', 'id': 'mv-1', 'before': before, 'after': {**before, 'cal': other}}]}).json()['ok']
    assert env.raw(f'{USER}/{env.dev}/mv.ics').status_code == 404
    raw = env.raw(f'{USER}/{other}/mv.ics').text
    assert 'X-INCONNU;PARAM=valeur:quelque chose' in raw
    assert evs(env.data(), other)['mv-1']['cal'] == other


def test_calendriers_creer_renommer_supprimer_et_restaurer(env):
    env.data()
    cid = 'dev-c-0123456789abcdef'
    assert env.send({'calendars': {'create': [{'id': cid, 'name': 'Projets', 'color': 'teal'}]}}).json()['ok']
    ev = {**NEW, 'cal': cid, 'id': 'e-in-cal'}
    assert env.send({'events': [{'op': 'create', 'id': ev['id'], 'after': ev}]}).json()['ok']
    d = env.data()
    assert {'id': cid, 'name': 'Projets', 'color': 'teal', 'visible': True} in d['calendars']
    assert env.send({'calendars': {'update': [{'id': cid, 'before': {'name': 'Projets', 'color': 'teal'},
                                               'after': {'name': 'Projets perso', 'color': 'olive'}}]}}).json()['ok']
    assert {'id': cid, 'name': 'Projets perso', 'color': 'olive', 'visible': True} in env.data()['calendars']
    r = env.send({'calendars': {'delete': [{'id': cid}]}, 'events': [{'op': 'delete', 'id': ev['id'], 'before': ev}]})
    assert r.json()['ok'] and not any(c['id'] == cid for c in env.data()['calendars'])
    r = env.send({'calendars': {'create': [{'id': cid, 'name': 'Projets perso', 'color': 'olive'}]},
                  'events': [{'op': 'create', 'id': ev['id'], 'after': ev}]})
    assert r.json()['ok']
    d = env.data()
    assert {'id': cid, 'name': 'Projets perso', 'color': 'olive', 'visible': True} in d['calendars'] and evs(d, cid)[ev['id']] == ev


def test_nom_de_calendrier_sans_prefixe_refuse(env):
    env.data()
    r = env.send({'calendars': {'create': [{'id': 'c-123', 'name': 'X', 'color': 'red'}]}})
    assert r.status_code == 422


def test_evenement_inconnu_refuse(env):
    env.data()
    r = env.send({'events': [{'op': 'delete', 'id': 'nexiste-pas', 'before': {**NEW, 'cal': env.dev}}]})
    assert r.status_code == 422


# ---------------------------------------------------------------- phase 4 : échéances, abonnements, import
def test_echeances_creer_faire_supprimer_annuler(env):
    env.put(f'{USER}/{env.dev}/serie.ics', SERIE.format(uid=f'serie-k{env.dev}'))
    d0 = env.data()
    sid = f'serie-k{env.dev}'
    due = {'id': 'k-0123456789ab', 't': 'Fiche de lecture', 'ev': sid, 'occ': '2026-11-23', 'title': 'Cours',
           'start': '2026-11-23T09:00', 'allDay': False, 'cal': env.dev}
    assert env.send({'dues': [{'op': 'create', 'id': due['id'], 'after': due}]}).json()['ok']
    d = env.data()
    assert due in d['dues']
    tasks = [c for c in d['calendars'] if 'echeances' in c['id']]
    assert tasks == []                                                    # calendrier de tâches invisible
    raw = env.raw(f'{USER}/dev-echeances/{due["id"]}.ics').text
    assert f'RELATED-TO:{sid}' in raw and 'X-AGENDA-OCC:2026-11-23' in raw
    done = {**due, 'done': '2026-11-20'}
    assert env.send({'dues': [{'op': 'update', 'id': due['id'], 'before': due, 'after': done}]}).json()['ok']
    assert done in env.data()['dues']
    before_del = env.raw(f'{USER}/dev-echeances/{due["id"]}.ics').text
    assert env.send({'dues': [{'op': 'delete', 'id': due['id'], 'before': done}]}).json()['ok']
    assert env.raw(f'{USER}/dev-echeances/{due["id"]}.ics').status_code == 404
    assert env.send({'dues': [{'op': 'create', 'id': due['id'], 'after': done}]}).json()['ok']
    assert env.raw(f'{USER}/dev-echeances/{due["id"]}.ics').text == before_del
    del d0


def test_abonnement_garde_dans_radicale_puis_arrete(env):
    env.data()
    sid = f'dev-c-sub{env.dev}'
    url = 'https://example.org/fac.ics'
    assert env.send({'calendars': {'create': [{'id': sid, 'name': 'Fac', 'color': 'sky', 'sub': url}]}}).json()['ok']
    d = env.data()
    cal = next(c for c in d['calendars'] if c['id'] == sid)
    assert cal['sub']['url'] == url and cal['name'] == 'Fac' and d['meta']['calendars'][sid]['kind'] == 'subscribed'
    pf = httpx.request('PROPFIND', env.url + f'{USER}/{sid}/', auth=(USER, PASSWORD), headers={'Depth': '0'}).text
    assert 'subscribed' in pf
    r = env.send({'events': [{'op': 'create', 'id': 'e-in-sub', 'after': {**NEW, 'id': 'e-in-sub', 'cal': sid}}]})
    assert r.status_code == 422                                           # rien d'écrit dans un abonnement
    url2 = 'https://example.org/fac2.ics'
    assert env.send({'calendars': {'update': [{'id': sid, 'before': {'name': 'Fac', 'color': 'sky', 'sub': url},
                                                'after': {'name': 'Fac S2', 'color': 'blue', 'sub': url2}}]}}).json()['ok']
    cal = next(c for c in env.data()['calendars'] if c['id'] == sid)
    assert (cal['name'], cal['color'], cal['sub']['url']) == ('Fac S2', 'blue', url2)
    # « Arrêter l'abonnement » en gardant ses événements : devient un calendrier normal
    ev = {**NEW, 'id': 'e-garde', 'cal': sid}
    r = env.send({'calendars': {'update': [{'id': sid, 'before': {'name': 'Fac S2', 'color': 'blue', 'sub': url2},
                                             'after': {'name': 'Fac S2', 'color': 'blue'}}]},
                  'events': [{'op': 'create', 'id': ev['id'], 'after': ev}]})
    assert r.json()['ok']
    d = env.data()
    cal = next(c for c in d['calendars'] if c['id'] == sid)
    assert 'sub' not in cal and evs(d, sid)['e-garde'] == ev
    assert env.send({'calendars': {'delete': [{'id': sid}]}, 'events': [{'op': 'delete', 'id': ev['id'], 'before': ev}]}).json()['ok']


def test_desabonnement(env):
    env.data()
    sid = f'dev-c-unsub{env.dev}'
    assert env.send({'calendars': {'create': [{'id': sid, 'name': 'Fériés', 'color': 'red', 'sub': 'https://example.org/f.ics'}]}}).json()['ok']
    env.data()
    assert env.send({'calendars': {'delete': [{'id': sid}]}}).json()['ok']
    assert not any(c['id'] == sid for c in env.data()['calendars'])


def test_import_garde_le_fichier(env):
    from test_ical_todo import FICHIER_TZ, FICHIER_VEVENT
    env.data()
    model = {'id': 'e-imp-api', 'cal': env.dev, 'title': 'Concert', 'start': '2026-12-06T02:00', 'end': '2026-12-06T05:00',
             'allDay': False, 'loc': '', 'desc': '', 'rem': 'none', 'rrule': {'freq': 'none'}, 'exdates': [],
             'icsUid': 'billet-42@billetterie.example'}
    r = env.send({'events': [{'op': 'create', 'id': model['id'], 'after': model,
                              'raw': {'vevent': FICHIER_VEVENT, 'vtimezones': [FICHIER_TZ]}}]})
    assert r.json()['ok']
    raw = env.raw(f'{USER}/{env.dev}/e-imp-api.ics').text
    assert 'X-BILLET-PLACE:Fosse' in raw and 'ORGANIZER' in raw
    assert evs(env.data(), env.dev)['e-imp-api'] == model


def test_proxy_ics(env, monkeypatch):
    from agenda import ics_fetch, main

    async def fake(url, client=None):
        if 'bad' in url:
            raise ics_fetch.IcsError('le lien répond « 404 » (adresse privée, ou introuvable)')
        return 'BEGIN:VCALENDAR\r\nEND:VCALENDAR\r\n'
    monkeypatch.setattr(main, 'fetch_ics', fake)
    r = env.c.get('/api/ics', params={'url': 'https://example.org/ok.ics'})
    assert r.status_code == 200 and r.text.startswith('BEGIN:VCALENDAR') and r.headers['content-type'].startswith('text/calendar')
    r = env.c.get('/api/ics', params={'url': 'https://example.org/bad.ics'})
    assert r.status_code == 502 and '404' in r.json()['error']
