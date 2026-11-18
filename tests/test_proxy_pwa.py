"""Adresse réelle derrière Tailscale Serve, et fichiers de l'application installable (PWA)."""
import dataclasses
import json
from pathlib import Path

import pytest
from fastapi.testclient import TestClient

from agenda.config import Settings
from agenda.main import create_app
from agenda.proxy import client_ip, default_gateway, trusted_networks

STATIC = Path(__file__).resolve().parents[1] / 'static'
H = {'X-Requested-With': 'agenda'}


def test_passerelle_lue_dans_la_table_de_routage(tmp_path):
    route = tmp_path / 'route'
    route.write_text('Iface\tDestination\tGateway \tFlags\tRefCnt\tUse\tMetric\tMask\n'
                     'eth0\t00000000\t010017AC\t0003\t0\t0\t0\t00000000\n'
                     'eth0\t000017AC\t00000000\t0001\t0\t0\t0\t0000FFFF\n')
    assert default_gateway(str(route)) == '172.23.0.1'
    assert [str(n) for n in trusted_networks('auto', str(route))] == ['172.23.0.1/32']
    assert [str(n) for n in trusted_networks('auto, 10.0.0.0/8', str(route))] == ['172.23.0.1/32', '10.0.0.0/8']
    assert trusted_networks('none', str(route)) == []
    assert default_gateway(str(tmp_path / 'absent')) is None


@pytest.mark.parametrize('peer,xff,expected', [
    ('172.23.0.1', '100.73.82.49', '100.73.82.49'),                 # via le proxy : la vraie adresse
    ('172.23.0.1', '6.6.6.6, 100.73.82.49', '100.73.82.49'),        # le client a mis la sienne : seule la dernière compte
    ('172.23.0.1', 'nimporte quoi', '172.23.0.1'),                  # valeur invalide : ignorée
    ('172.23.0.1', None, '172.23.0.1'),
    ('100.73.82.49', '1.2.3.4', '100.73.82.49'),                    # accès direct : l'en-tête est ignoré
    (None, '1.2.3.4', '?'),
])
def test_x_forwarded_for_seulement_depuis_le_proxy(peer, xff, expected):
    import ipaddress
    assert client_ip(peer, xff, [ipaddress.ip_network('172.23.0.1')]) == expected


def app_via(radicale, tmp_path, peer):
    cfg = dataclasses.replace(Settings(), radicale_url=radicale, static_dir=STATIC, login_max_failures=2,
                              trusted_proxies='172.23.0.1')
    return TestClient(create_app(cfg), base_url='https://raspberryquentin.tail340eef.ts.net', client=(peer, 40000))


def test_limitation_par_appareil_derriere_le_proxy(radicale, tmp_path):
    with app_via(radicale, tmp_path, '172.23.0.1') as c:
        def essai(ip, user):
            return c.post('/api/login', json={'user': user, 'password': 'faux'}, headers={**H, 'X-Forwarded-For': ip}).status_code
        assert [essai('100.0.0.1', 'a1'), essai('100.0.0.1', 'a2')] == [401, 401]
        assert essai('100.0.0.1', 'a3') == 429                          # le 1er appareil est bloqué…
        assert essai('100.0.0.2', 'b1') == 401                          # …pas le second


def test_client_direct_ne_peut_pas_inventer_son_adresse(radicale, tmp_path):
    with app_via(radicale, tmp_path, '100.73.82.49') as c:
        codes = [c.post('/api/login', json={'user': f'x{i}', 'password': 'faux'},
                        headers={**H, 'X-Forwarded-For': f'9.9.9.{i}'}).status_code for i in range(3)]
        assert codes == [401, 401, 429]


def test_fichiers_pwa_servis(radicale, tmp_path):
    with app_via(radicale, tmp_path, '100.73.82.49') as c:
        m = c.get('/manifest.webmanifest')
        assert m.status_code == 200
        man = json.loads(m.text)
        assert man['display'] == 'standalone' and man['start_url'] == '/' and man['scope'] == '/'
        purposes = {(i['sizes'], i['purpose']) for i in man['icons']}
        assert {('192x192', 'any'), ('512x512', 'any'), ('192x192', 'maskable'), ('512x512', 'maskable')} <= purposes
        for i in man['icons']:
            assert c.get('/' + i['src']).status_code == 200
        sw = c.get('/sw.js')
        assert sw.status_code == 200 and 'javascript' in sw.headers['content-type'] and sw.headers['cache-control'] == 'no-cache'
        assert "'/api/'" in sw.text                                     # /api jamais mis en cache
        page = c.get('/').text
        assert 'rel="manifest"' in page and 'name="theme-color"' in page and 'id="offline"' in page


def test_le_service_worker_ne_garde_que_l_interface():
    sw = (STATIC / 'sw.js').read_text()
    shell = sw[sw.index('const SHELL = ['):sw.index('];', sw.index('const SHELL = ['))]
    assert '/api' not in shell
    for f in [x.strip(" '\n") for x in shell.split('[', 1)[1].split(',')]:
        if f and f != '/':
            assert (STATIC / f).exists(), f
