"""Lecture des liens d'abonnement par le serveur (faux site, sans Internet)."""
import asyncio

import httpx
import pytest

from agenda import ics_fetch
from agenda.ics_fetch import IcsError, fetch_ics

ICS = 'BEGIN:VCALENDAR\r\nVERSION:2.0\r\nEND:VCALENDAR\r\n'


def client(handler):
    return httpx.AsyncClient(transport=httpx.MockTransport(handler), follow_redirects=True)


def run(url, handler):
    ics_fetch._cache.clear()
    return asyncio.run(fetch_ics(url, client(handler)))


def test_webcal_devient_https_et_cache():
    seen = []

    def h(req):
        seen.append(str(req.url))
        return httpx.Response(200, text=ICS)
    assert run('webcal://fac.example/edt.ics', h) == ICS
    assert seen == ['https://fac.example/edt.ics']
    asyncio.run(fetch_ics('webcal://fac.example/edt.ics', client(h)))      # deuxième lecture : en cache
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
