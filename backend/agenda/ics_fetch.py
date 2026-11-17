"""Lecture des liens d'abonnement (.ics) par le serveur, à la place du navigateur (pas de CORS), avec un cache court.

Sécurité : seules les adresses PUBLIQUES d'Internet sont lues. Un lien vers le réseau local, un conteneur
(http://radicale:5232…), localhost ou Tailscale est refusé — y compris s'il y mène par une redirection —
pour qu'un lien piégé ne fasse pas lire au serveur des services internes.
"""
from __future__ import annotations

import asyncio
import ipaddress
import time
from urllib.parse import urljoin

import httpx

MAX_BYTES = 10 * 1024 * 1024
CACHE_SECONDS = 10 * 60
CACHE_MAX = 50
MAX_REDIRECTS = 5
_cache: dict[str, tuple[float, str]] = {}


async def _resolve(host: str) -> set[str]:
    infos = await asyncio.get_running_loop().getaddrinfo(host, None)
    return {i[4][0] for i in infos}


class IcsError(Exception):
    """Message en français, affiché tel quel dans l'agenda."""


async def check_public(url: str, resolve=_resolve) -> None:
    """Refuse une adresse qui n'est pas publique (réseau local, conteneur, localhost, Tailscale…)."""
    host = httpx.URL(url).host
    if not host:
        raise IcsError('adresse incomplète')
    try:
        ips = {host.strip('[]')}
        ipaddress.ip_address(host.strip('[]'))
    except ValueError:
        try:
            ips = await resolve(host)
        except OSError:
            raise IcsError(f'le nom « {host} » est introuvable')
    for ip in ips:
        a = ipaddress.ip_address(ip.split('%')[0])
        if getattr(a, 'ipv4_mapped', None):
            a = a.ipv4_mapped
        if not a.is_global:
            raise IcsError('adresse privée refusée : seuls les liens publics d’Internet peuvent être suivis')


async def fetch_ics(url: str, client: httpx.AsyncClient | None = None, resolve=_resolve) -> str:
    url = url.strip()
    if url.lower().startswith(('webcal://', 'webcals://')):
        url = 'https://' + url.split('://', 1)[1]
    if not url.lower().startswith(('http://', 'https://')):
        raise IcsError('l’adresse doit commencer par https:// ou webcal://')
    hit = _cache.get(url)
    if hit and time.monotonic() - hit[0] < CACHE_SECONDS:
        return hit[1]
    own = client is None
    client = client or httpx.AsyncClient(timeout=httpx.Timeout(20.0, connect=10.0), follow_redirects=False,
                                         headers={'User-Agent': 'Agenda-Radicale/1.0'})
    try:
        target = url
        for _ in range(MAX_REDIRECTS + 1):       # redirections suivies à la main : chaque étape est vérifiée
            await check_public(target, resolve)
            async with client.stream('GET', target) as r:
                if r.is_redirect and r.headers.get('location'):
                    target = urljoin(target, r.headers['location'])
                    if not target.lower().startswith(('http://', 'https://')):
                        raise IcsError('le lien redirige vers une adresse non web')
                    continue
                if r.status_code != 200:
                    raise IcsError(f'le lien répond « {r.status_code} » (adresse privée, ou introuvable)')
                chunks, size = [], 0
                async for chunk in r.aiter_bytes():
                    size += len(chunk)
                    if size > MAX_BYTES:
                        raise IcsError('ce lien renvoie un fichier trop gros (plus de 10 Mo)')
                    chunks.append(chunk)
                text = b''.join(chunks).decode(r.encoding or 'utf-8', errors='replace')
                break
        else:
            raise IcsError('le lien redirige trop de fois')
    except httpx.HTTPError as e:
        raise IcsError(f'le serveur de l’agenda n’a pas pu lire ce lien ({type(e).__name__})') from e
    finally:
        if own:
            await client.aclose()
    if 'BEGIN:VCALENDAR' not in text.upper():
        raise IcsError('ce lien ne renvoie pas un agenda (.ics)')
    now = time.monotonic()
    for k in [k for k, (t, _) in _cache.items() if now - t > CACHE_SECONDS]:
        _cache.pop(k, None)
    while len(_cache) >= CACHE_MAX:
        _cache.pop(next(iter(_cache)))
    _cache[url] = (now, text)
    return text
