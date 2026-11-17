"""Lecture des liens d'abonnement (.ics) par le serveur, à la place du navigateur (pas de CORS), avec un cache court."""
from __future__ import annotations

import time

import httpx

MAX_BYTES = 10 * 1024 * 1024
CACHE_SECONDS = 10 * 60
_cache: dict[str, tuple[float, str]] = {}


class IcsError(Exception):
    """Message en français, affiché tel quel dans l'agenda."""


async def fetch_ics(url: str, client: httpx.AsyncClient | None = None) -> str:
    url = url.strip()
    if url.lower().startswith(('webcal://', 'webcals://')):
        url = 'https://' + url.split('://', 1)[1]
    if not url.lower().startswith(('http://', 'https://')):
        raise IcsError('l’adresse doit commencer par https:// ou webcal://')
    hit = _cache.get(url)
    if hit and time.monotonic() - hit[0] < CACHE_SECONDS:
        return hit[1]
    own = client is None
    client = client or httpx.AsyncClient(timeout=httpx.Timeout(20.0, connect=10.0), follow_redirects=True,
                                         headers={'User-Agent': 'Agenda-Radicale/1.0'})
    try:
        async with client.stream('GET', url) as r:
            if r.status_code != 200:
                raise IcsError(f'le lien répond « {r.status_code} » (adresse privée, ou introuvable)')
            chunks, size = [], 0
            async for chunk in r.aiter_bytes():
                size += len(chunk)
                if size > MAX_BYTES:
                    raise IcsError('ce lien renvoie un fichier trop gros (plus de 10 Mo)')
                chunks.append(chunk)
            text = b''.join(chunks).decode(r.encoding or 'utf-8', errors='replace')
    except httpx.HTTPError as e:
        raise IcsError(f'le serveur de l’agenda n’a pas pu lire ce lien ({type(e).__name__})') from e
    finally:
        if own:
            await client.aclose()
    if 'BEGIN:VCALENDAR' not in text.upper():
        raise IcsError('ce lien ne renvoie pas un agenda (.ics)')
    _cache[url] = (time.monotonic(), text)
    for k in [k for k, (t, _) in _cache.items() if time.monotonic() - t > CACHE_SECONDS]:
        _cache.pop(k, None)
    return text
