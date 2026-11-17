"""Lecture des liens d'abonnement par le serveur (faux site, sans Internet)."""
import asyncio

import httpx
import pytest

from agenda import ics_fetch
from agenda.ics_fetch import IcsError, fetch_ics

ICS = 'BEGIN:VCALENDAR\r\nVERSION:2.0\r\nEND:VCALENDAR\r\n'


def client(handler):
    return httpx.AsyncClient(transport=httpx.MockTransport(handler))


DNS = {'fac.example': {'93.184.216.34'}, 'x.example': {'93.184.216.35'}, 'radicale': {'172.18.0.2'},
       'box.lan': {'192.168.1.10'}, 'v6.example': {'2606:4700::1111'}, 'piege.example': {'::ffff:127.0.0.1'}}


async def resolve(host):
    if host not in DNS:
        raise OSError('introuvable')
    return DNS[host]


def run(url, handler):
    ics_fetch._cache.clear()
    return asyncio.run(fetch_ics(url, client(handler), resolve=resolve))


def test_webcal_devient_https_et_cache():
    seen = []

    def h(req):
        seen.append(str(req.url))
        return httpx.Response(200, text=ICS)
    assert run('webcal://fac.example/edt.ics', h) == ICS
    assert seen == ['https://fac.example/edt.ics']
    asyncio.run(fetch_ics('webcal://fac.example/edt.ics', client(h), resolve=resolve))      # deuxième lecture : en cache
    assert len(seen) == 1


@pytest.mark.parametrize('url,handler,msg', [
    ('file:///etc/passwd', lambda r: httpx.Response(200, text=ICS), 'https://'),
    ('https://x.example/a.ics', lambda r: httpx.Response(404), '404'),
    ('https://x.example/a.ics', lambda r: httpx.Response(200, text='<html>'), 'pas un agenda'),
    ('https://x.example/a.ics', lambda r: httpx.Response(200, content=b'B' * (ics_fetch.MAX_BYTES + 10)), 'trop gros'),
])
def test_erreurs_en_francais(url, handler, msg):
    with pytest.raises(IcsError) as e:
        run(url, handler)
    assert msg in str(e.value)


@pytest.mark.parametrize('url', ['http://radicale:5232/quentin/', 'http://127.0.0.1/a.ics', 'http://box.lan/a.ics',
                                 'http://[::1]/a.ics', 'http://100.74.253.116:8090/', 'http://piege.example/a.ics',
                                 'http://169.254.169.254/latest/meta-data'])
def test_adresses_privees_refusees(url):
    called = []
    with pytest.raises(IcsError) as e:
        run(url, lambda r: called.append(r) or httpx.Response(200, text=ICS))
    assert 'privée' in str(e.value) and not called


def test_redirection_vers_le_reseau_local_refusee():
    def h(req):
        if req.url.host == 'fac.example':
            return httpx.Response(302, headers={'Location': 'http://radicale:5232/quentin/perso/'})
        return httpx.Response(200, text=ICS)
    with pytest.raises(IcsError) as e:
        run('https://fac.example/edt.ics', h)
    assert 'privée' in str(e.value)


def test_redirection_publique_suivie_et_ipv6_publique():
    def h(req):
        if req.url.host == 'fac.example':
            return httpx.Response(301, headers={'Location': 'https://v6.example/edt.ics'})
        return httpx.Response(200, text=ICS)
    assert run('https://fac.example/edt.ics', h) == ICS


def test_nom_introuvable():
    with pytest.raises(IcsError) as e:
        run('https://inconnu.example/a.ics', lambda r: httpx.Response(200, text=ICS))
    assert 'introuvable' in str(e.value)
