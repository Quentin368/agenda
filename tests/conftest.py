"""Radicale jetable pour les tests d'intégration (dossier temporaire, utilisateur de test).

Jamais la pile ~/docker/radicale : les tests fabriquent leurs propres calendriers.
"""
import os
import socket
import subprocess
import sys
import time
from pathlib import Path

import httpx
import pytest

USER, PASSWORD = 'quentin', 'mot-de-passe-de-test'


def _free_port() -> int:
    with socket.socket() as s:
        s.bind(('127.0.0.1', 0))
        return s.getsockname()[1]


@pytest.fixture(scope='session')
def radicale(tmp_path_factory):
    root = tmp_path_factory.mktemp('radicale')
    (root / 'users').write_text(f'{USER}:{PASSWORD}\nautre:autre-mdp\n')
    port = _free_port()
    (root / 'config').write_text(f"""
[server]
hosts = 127.0.0.1:{port}
[auth]
type = htpasswd
htpasswd_filename = {root / 'users'}
htpasswd_encryption = plain
delay = 0
[rights]
type = owner_only
[storage]
filesystem_folder = {root / 'collections'}
[logging]
level = warning
""")
    proc = subprocess.Popen([sys.executable, '-m', 'radicale', '--config', str(root / 'config')],
                            stdout=subprocess.DEVNULL, stderr=subprocess.PIPE, env={**os.environ, 'PYTHONWARNINGS': 'ignore'})
    url = f'http://127.0.0.1:{port}/'
    for _ in range(100):
        try:
            httpx.get(url, timeout=0.5)
            break
        except httpx.HTTPError:
            time.sleep(0.1)
    else:
        proc.kill()
        raise RuntimeError(proc.stderr.read().decode())
    yield url
    proc.terminate()
    proc.wait(5)


def mkcalendar(url: str, path: str, name: str, color: str | None = None, comps=('VEVENT', 'VTODO')):
    color_xml = f'<ic:calendar-color>{color}</ic:calendar-color>' if color else ''
    comp_xml = ''.join(f'<c:comp name="{c}"/>' for c in comps)
    body = f'''<?xml version="1.0" encoding="utf-8"?>
<c:mkcalendar xmlns:d="DAV:" xmlns:c="urn:ietf:params:xml:ns:caldav" xmlns:ic="http://apple.com/ns/ical/">
 <d:set><d:prop><d:displayname>{name}</d:displayname>{color_xml}
 <c:supported-calendar-component-set>{comp_xml}</c:supported-calendar-component-set></d:prop></d:set>
</c:mkcalendar>'''
    r = httpx.request('MKCALENDAR', url + path, content=body.encode(), auth=(USER, PASSWORD))
    assert r.status_code == 201, r.text


def put(url: str, path: str, ics: str):
    r = httpx.put(url + path, content=ics.replace('\n', '\r\n').encode(), auth=(USER, PASSWORD),
                  headers={'Content-Type': 'text/calendar; charset=utf-8'})
    assert r.status_code in (201, 204), r.text
