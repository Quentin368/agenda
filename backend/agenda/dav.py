"""Client CalDAV minimal (lecture) pour Radicale : découverte des calendriers, lecture des événements avec ETag.

Requêtes WebDAV directes (PROPFIND / REPORT) avec httpx : peu de code, et l'iCal brut est gardé tel quel.
"""
from __future__ import annotations

import asyncio
import xml.etree.ElementTree as ET
from dataclasses import dataclass
from urllib.parse import unquote, urljoin, urlsplit

import httpx

NS = {'d': 'DAV:', 'c': 'urn:ietf:params:xml:ns:caldav', 'cs': 'http://calendarserver.org/ns/', 'ic': 'http://apple.com/ns/ical/'}
TIMEOUT = httpx.Timeout(15.0, connect=5.0)


class AuthError(Exception):
    """Identifiants refusés par Radicale (401/403)."""


class DavError(Exception):
    """Radicale injoignable ou réponse inattendue."""


@dataclass
class Collection:
    href: str             # chemin absolu, ex. /quentin/perso/
    name: str             # dernier segment, ex. perso
    displayname: str
    color: str | None
    components: list[str]
    ctag: str | None


@dataclass
class Item:
    href: str
    etag: str | None
    data: str


def _propfind_body(*props: str) -> bytes:
    inner = ''.join(f'<{p}/>' for p in props)
    return (f'<?xml version="1.0" encoding="utf-8"?><d:propfind xmlns:d="DAV:" xmlns:c="urn:ietf:params:xml:ns:caldav" '
            f'xmlns:cs="http://calendarserver.org/ns/" xmlns:ic="http://apple.com/ns/ical/"><d:prop>{inner}</d:prop></d:propfind>').encode()


REPORT_ALL = b'''<?xml version="1.0" encoding="utf-8"?>
<c:calendar-query xmlns:d="DAV:" xmlns:c="urn:ietf:params:xml:ns:caldav">
  <d:prop><d:getetag/><c:calendar-data/></d:prop>
  <c:filter><c:comp-filter name="VCALENDAR"/></c:filter>
</c:calendar-query>'''

REPORT_EVENTS = b'''<?xml version="1.0" encoding="utf-8"?>
<c:calendar-query xmlns:d="DAV:" xmlns:c="urn:ietf:params:xml:ns:caldav">
  <d:prop><d:getetag/><c:calendar-data/></d:prop>
  <c:filter><c:comp-filter name="VCALENDAR"><c:comp-filter name="VEVENT"/></c:comp-filter></c:filter>
</c:calendar-query>'''


def _responses(xml_bytes: bytes):
    try:
        root = ET.fromstring(xml_bytes)
    except ET.ParseError as e:
        raise DavError(f'réponse XML illisible : {e}') from e
    for resp in root.findall('d:response', NS):
        href = unquote(resp.findtext('d:href', default='', namespaces=NS))
        props = {}
        for ps in resp.findall('d:propstat', NS):
            if '200' not in (ps.findtext('d:status', default='', namespaces=NS)):
                continue
            prop = ps.find('d:prop', NS)
            if prop is not None:
                for child in prop:
                    props[child.tag] = child
        yield href, props


def _q(ns: str, tag: str) -> str:
    return f'{{{NS[ns]}}}{tag}'


class DavClient:
    def __init__(self, base_url: str, user: str, password: str, client: httpx.AsyncClient | None = None):
        self.base = base_url
        self.user = user
        self._auth = httpx.BasicAuth(user, password)     # passée à chaque requête : le client HTTP est partagé
        self._client = client or httpx.AsyncClient(timeout=TIMEOUT, follow_redirects=False)

    async def aclose(self):
        await self._client.aclose()

    def _url(self, href: str) -> str:
        return urljoin(self.base, href)

    async def _request(self, method: str, href: str, body: bytes | None = None, depth: str = '0') -> httpx.Response:
        try:
            r = await self._client.request(method, self._url(href), content=body, auth=self._auth,
                                           headers={'Depth': depth, 'Content-Type': 'application/xml; charset=utf-8'})
        except httpx.HTTPError as e:
            raise DavError(f'Radicale injoignable ({type(e).__name__})') from e
        if r.status_code in (401, 403):
            raise AuthError()
        if r.status_code != 207:
            raise DavError(f'{method} {href} : réponse {r.status_code}')
        return r

    async def check_login(self) -> None:
        """Vérifie les identifiants (lève AuthError s'ils sont refusés)."""
        await self.home()

    async def home(self) -> str:
        """Dossier des calendriers de l'utilisateur (calendar-home-set), via current-user-principal."""
        r = await self._request('PROPFIND', '/', _propfind_body('d:current-user-principal'))
        principal = None
        for _, props in _responses(r.content):
            el = props.get(_q('d', 'current-user-principal'))
            if el is not None and el.findtext('d:href', namespaces=NS):
                principal = unquote(el.findtext('d:href', namespaces=NS))
        if not principal:
            raise DavError('principal introuvable')
        r = await self._request('PROPFIND', principal, _propfind_body('c:calendar-home-set'))
        for _, props in _responses(r.content):
            el = props.get(_q('c', 'calendar-home-set'))
            if el is not None and el.findtext('d:href', namespaces=NS):
                return unquote(el.findtext('d:href', namespaces=NS))
        return principal

    async def collections(self, home: str | None = None) -> list[Collection]:
        home = home or await self.home()
        r = await self._request('PROPFIND', home, _propfind_body(
            'd:resourcetype', 'd:displayname', 'ic:calendar-color', 'c:supported-calendar-component-set', 'cs:getctag', 'd:sync-token'), depth='1')
        out = []
        for href, props in _responses(r.content):
            rt = props.get(_q('d', 'resourcetype'))
            if rt is None or rt.find('c:calendar', NS) is None:
                continue
            path = urlsplit(href).path
            name = path.rstrip('/').rsplit('/', 1)[-1]
            comp_el = props.get(_q('c', 'supported-calendar-component-set'))
            comps = [c.get('name', '').upper() for c in comp_el.findall('c:comp', NS)] if comp_el is not None else ['VEVENT', 'VTODO']
            dn = props.get(_q('d', 'displayname'))
            col = props.get(_q('ic', 'calendar-color'))
            ctag = props.get(_q('cs', 'getctag'))
            st = props.get(_q('d', 'sync-token'))
            out.append(Collection(href=path, name=name, displayname=(dn.text or '').strip() if dn is not None else '',
                                  color=(col.text or '').strip() or None if col is not None else None, components=comps,
                                  ctag=(ctag.text if ctag is not None else None) or (st.text if st is not None else None)))
        return out

    async def all_items(self, collection_href: str) -> list[Item]:
        """Tout le contenu d'une collection (événements ET tâches), pour pouvoir le remettre à l'identique."""
        return await self.events(collection_href, REPORT_ALL)

    async def events(self, collection_href: str, query: bytes = REPORT_EVENTS) -> list[Item]:
        r = await self._request('REPORT', collection_href, query, depth='1')
        out = []
        for href, props in _responses(r.content):
            data = props.get(_q('c', 'calendar-data'))
            if data is None or not (data.text or '').strip():
                continue
            et = props.get(_q('d', 'getetag'))
            out.append(Item(href=urlsplit(href).path, etag=et.text if et is not None else None, data=data.text))
        return out

    async def all_events(self, cols: list[Collection]) -> dict[str, list[Item]]:
        res = await asyncio.gather(*(self.events(c.href) for c in cols))
        return {c.href: items for c, items in zip(cols, res)}


# ---------------------------------------------------------------- écriture
class Conflict(Exception):
    """La ressource a changé (ou existe déjà / n'existe plus) depuis la dernière lecture : rien n'est écrasé."""


def _etag(r: httpx.Response) -> str | None:
    return r.headers.get('etag')


async def _write(self: DavClient, method: str, href: str, *, body: bytes | None = None, headers: dict | None = None,
                 ok=(200, 201, 204)) -> httpx.Response:
    try:
        r = await self._client.request(method, self._url(href), content=body, auth=self._auth, headers=headers or {})
    except httpx.HTTPError as e:
        raise DavError(f'Radicale injoignable ({type(e).__name__})') from e
    if r.status_code in (401, 403):
        raise AuthError()
    if r.status_code in (409, 412):
        raise Conflict(f'{method} {href} : {r.status_code}')
    if r.status_code not in ok:
        raise DavError(f'{method} {href} : réponse {r.status_code}')
    return r


async def get(self: DavClient, href: str) -> Item:
    """iCal brut + ETag actuels d'une ressource (404 → Conflict : elle a disparu entre-temps)."""
    try:
        r = await self._client.get(self._url(href), auth=self._auth)
    except httpx.HTTPError as e:
        raise DavError(f'Radicale injoignable ({type(e).__name__})') from e
    if r.status_code in (401, 403):
        raise AuthError()
    if r.status_code == 404:
        raise Conflict(f'GET {href} : 404')
    if r.status_code != 200:
        raise DavError(f'GET {href} : réponse {r.status_code}')
    return Item(href=href, etag=_etag(r), data=r.text)


async def put(self: DavClient, href: str, ics: str, etag: str | None) -> str | None:
    """Écrit une ressource. etag=None : création (If-None-Match: *) ; sinon remplacement si inchangée (If-Match)."""
    h = {'Content-Type': 'text/calendar; charset=utf-8', **({'If-Match': etag} if etag else {'If-None-Match': '*'})}
    r = await _write(self, 'PUT', href, body=ics.encode(), headers=h)
    return _etag(r)


async def delete(self: DavClient, href: str, etag: str | None) -> None:
    await _write(self, 'DELETE', href, headers={'If-Match': etag} if etag else {})


def _xml(s: str) -> str:
    return s.replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;')


async def mkcalendar(self: DavClient, href: str, name: str, color: str) -> None:
    body = (f'<?xml version="1.0" encoding="utf-8"?><c:mkcalendar xmlns:d="DAV:" xmlns:c="urn:ietf:params:xml:ns:caldav" '
            f'xmlns:ic="http://apple.com/ns/ical/"><d:set><d:prop><d:displayname>{_xml(name)}</d:displayname>'
            f'<ic:calendar-color>{_xml(color)}</ic:calendar-color><c:supported-calendar-component-set>'
            f'<c:comp name="VEVENT"/><c:comp name="VTODO"/></c:supported-calendar-component-set></d:prop></d:set></c:mkcalendar>')
    r = await _write(self, 'MKCALENDAR', href, body=body.encode(), headers={'Content-Type': 'application/xml; charset=utf-8'}, ok=(201,))
    del r


async def proppatch(self: DavClient, href: str, name: str | None = None, color: str | None = None) -> None:
    props = (f'<d:displayname>{_xml(name)}</d:displayname>' if name is not None else '') + \
            (f'<ic:calendar-color>{_xml(color)}</ic:calendar-color>' if color is not None else '')
    if not props:
        return
    body = (f'<?xml version="1.0" encoding="utf-8"?><d:propertyupdate xmlns:d="DAV:" xmlns:ic="http://apple.com/ns/ical/">'
            f'<d:set><d:prop>{props}</d:prop></d:set></d:propertyupdate>')
    r = await _write(self, 'PROPPATCH', href, body=body.encode(), headers={'Content-Type': 'application/xml; charset=utf-8'}, ok=(207,))
    if '200' not in r.text and 'HTTP/1.1 2' not in r.text:
        raise DavError(f'PROPPATCH {href} refusé')


DavClient.get = get
DavClient.put = put
DavClient.delete = delete
DavClient.mkcalendar = mkcalendar
DavClient.proppatch = proppatch
