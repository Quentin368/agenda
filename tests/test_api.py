"""API de bout en bout contre un Radicale jetable : connexion, sessions, CSRF, données, fichiers."""
import dataclasses

import pytest
from fastapi.testclient import TestClient

from agenda.config import Settings
from agenda.main import create_app
from conftest import PASSWORD, USER, mkcalendar, put

H = {'X-Requested-With': 'agenda'}


@pytest.fixture(scope='module')
def seeded(radicale):
    mkcalendar(radicale, f'{USER}/perso/', 'Perso', '#3b82f6')
    mkcalendar(radicale, f'{USER}/anniversaires/', 'Anniversaires', '#ec4899')
    mkcalendar(radicale, f'{USER}/taches/', 'Tâches', comps=('VTODO',))
    put(radicale, f'{USER}/perso/a.ics', 'BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//t//FR\nBEGIN:VEVENT\nUID:abc@google.com\n'
        'DTSTART:20261114T190000Z\nDTEND:20261115T010000Z\nSUMMARY:Finale\nEND:VEVENT\nEND:VCALENDAR\n')
    put(radicale, f'{USER}/anniversaires/b.ics', 'BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//t//FR\nBEGIN:VEVENT\nUID:lea\n'
        'DTSTART;VALUE=DATE:20201202\nDTEND;VALUE=DATE:20201203\nRRULE:FREQ=YEARLY\nSUMMARY:Anniversaire de Léa\n'
        'X-AGENDA-PERSON:Léa\nEND:VEVENT\nEND:VCALENDAR\n')
    return radicale


@pytest.fixture()
def client(seeded, tmp_path):
    (tmp_path / 'index.html').write_text('<!doctype html><title>Agenda</title>')
    cfg = dataclasses.replace(Settings(), radicale_url=seeded, static_dir=tmp_path, login_max_failures=3)
    with TestClient(create_app(cfg), base_url='http://raspberryquentin:8090') as c:
        yield c


def login(c, password=PASSWORD, remember=False, user=USER):
    return c.post('/api/login', json={'user': user, 'password': password, 'remember': remember}, headers=H)


def test_page_et_en_tetes(client):
    r = client.get('/')
    assert r.status_code == 200 and 'Agenda' in r.text
    assert r.headers['cache-control'] == 'no-cache'
    assert "script-src 'self'" in r.headers['content-security-policy']
    assert r.headers['x-frame-options'] == 'DENY'
    assert client.get('/healthz').text == 'ok'


def test_donnees_refusees_sans_session(client):
    assert client.get('/api/data').status_code == 401
    assert client.get('/api/session').status_code == 401


def test_connexion_et_lecture(client):
    r = login(client)
    assert r.status_code == 200 and r.json()['user'] == USER
    ck = r.headers['set-cookie'].lower()
    assert 'httponly' in ck and 'samesite=strict' in ck and 'secure' not in ck and 'max-age' not in ck
    assert PASSWORD not in r.text
    d = client.get('/api/data').json()
    assert d['calendars'] == [{'id': 'anniv', 'name': 'Anniversaires', 'color': 'pink', 'visible': True},
                              {'id': 'perso', 'name': 'Perso', 'color': 'blue', 'visible': True}]
    by = {e['title']: e for e in d['events']}
    assert by['Finale']['start'] == '2026-11-14T20:00' and '@' not in by['Finale']['id']
    assert by['Anniversaire de Léa']['person'] == 'Léa' and by['Anniversaire de Léa']['cal'] == 'anniv'
    m = d['meta']['events'][by['Finale']['id']]
    assert m['uid'] == 'abc@google.com' and m['href'] == f'/{USER}/perso/a.ics' and m['etag']
    assert d['dues'] == [] and d['errors'] == []
    assert client.get('/api/data').headers['cache-control'] == 'no-store'


def test_rester_connecte_cookie_durable(client):
    r = login(client, remember=True)
    assert 'max-age=2592000' in r.headers['set-cookie'].lower()


def test_mauvais_mot_de_passe_puis_limitation(client):
    for _ in range(3):
        assert login(client, 'faux', user='autre').status_code == 401
    r = login(client, 'autre-mdp', user='autre')          # même le bon mot de passe est refusé pendant le blocage
    assert r.status_code == 429 and int(r.headers['retry-after']) > 0


def test_connexion_exige_l_en_tete_maison_et_la_meme_origine(client):
    r = client.post('/api/login', json={'user': USER, 'password': PASSWORD})
    assert r.status_code == 403
    r = client.post('/api/login', json={'user': USER, 'password': PASSWORD}, headers={**H, 'Origin': 'http://evil.example'})
    assert r.status_code == 403


def test_deconnexion_avec_csrf(client):
    csrf = login(client).json()['csrf']
    assert client.post('/api/logout', headers=H).status_code == 403                       # sans jeton
    assert client.post('/api/logout', headers={**H, 'X-CSRF-Token': 'faux'}).status_code == 403
    assert client.post('/api/logout', headers={**H, 'X-CSRF-Token': csrf}).status_code == 200
    assert client.get('/api/data').status_code == 401


def test_session_redonne_le_jeton(client):
    csrf = login(client).json()['csrf']
    assert client.get('/api/session').json() == {'user': USER, 'csrf': csrf, 'calPrefix': 'dev-'}


def test_radicale_injoignable(seeded, tmp_path):
    cfg = dataclasses.replace(Settings(), radicale_url='http://127.0.0.1:9/', static_dir=tmp_path)
    with TestClient(create_app(cfg)) as c:
        assert login(c).status_code == 502


def test_ressource_illisible_n_empeche_pas_le_reste():
    from agenda.dav import Collection, Item
    from agenda.main import build_data
    col = Collection(href='/q/perso/', name='perso', displayname='Perso', color=None, components=['VEVENT'], ctag='1')
    ok = 'BEGIN:VCALENDAR\r\nBEGIN:VEVENT\r\nUID:ok\r\nDTSTART;VALUE=DATE:20261118\r\nEND:VEVENT\r\nEND:VCALENDAR\r\n'
    d = build_data([col], {'/q/perso/': [Item('/q/perso/casse.ics', '"1"', 'BEGIN:VCALENDAR\r\nBEGIN:VEVENT\r\nDTSTART:zz\r\nEND:VEVENT\r\nEND:VCALENDAR\r\n'),
                                         Item('/q/perso/ok.ics', '"2"', ok)]}, 'Europe/Paris')
    assert [e['id'] for e in d['events']] == ['ok'] and [e['href'] for e in d['errors']] == ['/q/perso/casse.ics']
    assert d['calendars'][0]['color'] == 'slate'
