"""Application FastAPI : API (connexion, données) + fichiers de l'interface."""
from __future__ import annotations

import logging
import secrets
import unicodedata
from contextlib import asynccontextmanager

import httpx
from fastapi import Depends, FastAPI, HTTPException, Request, Response
from fastapi.responses import JSONResponse, PlainTextResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel, Field

from . import palette
from .auth import RateLimiter, Session, SessionStore
from .config import Settings, settings as default_settings
from .changes import Applier, Refused, mirror
from .dav import TIMEOUT, AuthError, Conflict, DavClient, DavError
from .ical_write import Unsupported
from .ical_read import Reader, calendar_id
from .ical_todo import read_todo
from .ics_fetch import IcsError, fetch_ics
from .proxy import client_ip, trusted_networks

TASKS = 'echeances'               # collection des échéances (préfixée « dev- » pendant les essais)

log = logging.getLogger('agenda')
COOKIE = 'agenda_sid'
MAX_LOGIN = 16 * 1024                    # formulaire de connexion
MAX_BODY = 20 * 1024 * 1024              # lot de modifications (un gros import .ics)
CSRF_HEADER = 'x-csrf-token'
CLIENT_HEADER = 'x-requested-with'      # en-tête maison : une page d'un autre site ne peut pas l'envoyer sans autorisation CORS
CSP = ("default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; "
       "connect-src 'self'; object-src 'none'; base-uri 'none'; form-action 'self'; frame-ancestors 'none'")


class LoginIn(BaseModel):
    user: str = Field(min_length=1, max_length=128)
    password: str = Field(min_length=1, max_length=1024)
    remember: bool = False


def create_app(cfg: Settings = default_settings, transport: httpx.AsyncBaseTransport | None = None) -> FastAPI:
    trusted = trusted_networks(cfg.trusted_proxies)      # proxy local (Tailscale Serve) dont on croit X-Forwarded-For
    sessions = SessionStore(cfg.session_hours, cfg.remember_days)
    limiter = RateLimiter(cfg.login_max_failures, cfg.login_window_minutes)
    state: dict = {}

    @asynccontextmanager
    async def lifespan(_app):
        # Pas de connexions gardées ouvertes : Radicale peut fermer une connexion inactive, et la réutiliser
        # donnerait de fausses erreurs « injoignable ». Radicale est sur la même machine : le coût est négligeable.
        state['http'] = httpx.AsyncClient(timeout=TIMEOUT, transport=transport, follow_redirects=False,
                                          limits=httpx.Limits(max_keepalive_connections=0))
        yield
        await state['http'].aclose()

    app = FastAPI(lifespan=lifespan, docs_url=None, redoc_url=None, openapi_url=None)
    app.state.sessions = sessions
    app.state.limiter = limiter

    def dav(user: str, password: str) -> DavClient:
        return DavClient(cfg.radicale_url, user, password, client=state['http'])

    # ---------- taille des requêtes : pas de corps énorme (surtout avant d'être connecté)
    @app.middleware('http')
    async def body_limit(request: Request, call_next):
        limit = MAX_LOGIN if request.url.path == '/api/login' else MAX_BODY
        try:
            declared = int(request.headers.get('content-length') or 0)
        except ValueError:
            declared = limit + 1
        if declared > limit or (request.method in ('POST', 'PUT') and 'content-length' not in request.headers
                                and request.headers.get('transfer-encoding')):
            return JSONResponse({'error': 'requête trop grosse'}, status_code=413)
        return await call_next(request)

    # ---------- en-têtes de sécurité et de cache
    @app.middleware('http')
    async def headers(request: Request, call_next):
        resp = await call_next(request)
        h = resp.headers
        h.setdefault('X-Content-Type-Options', 'nosniff')
        h.setdefault('Referrer-Policy', 'same-origin')
        h.setdefault('X-Frame-Options', 'DENY')
        h.setdefault('Content-Security-Policy', CSP)
        h.setdefault('Permissions-Policy', 'camera=(), microphone=(), geolocation=()')
        # API : jamais en cache ; interface : revalidée à chaque chargement (mise à jour visible tout de suite)
        h['Cache-Control'] = 'no-store' if request.url.path.startswith('/api/') else 'no-cache'
        return resp

    # ---------- garde-fous
    def same_origin(request: Request):
        """Requêtes qui modifient quelque chose : en-tête maison obligatoire, et Origin (s'il est là) = notre hôte."""
        if request.headers.get(CLIENT_HEADER) != 'agenda':
            raise HTTPException(403, 'requête refusée')
        origin = request.headers.get('origin')
        if origin and origin.split('://', 1)[-1] != request.headers.get('host'):
            raise HTTPException(403, 'origine refusée')

    def current(request: Request) -> Session:
        s = sessions.get(request.cookies.get(COOKIE))
        if s is None:
            raise HTTPException(401, 'non connecté')
        return s

    def current_csrf(request: Request, s: Session = Depends(current)) -> Session:
        same_origin(request)
        if not secrets.compare_digest(request.headers.get(CSRF_HEADER, ''), s.csrf):
            raise HTTPException(403, 'jeton CSRF invalide')
        return s

    def session_info(s: Session) -> dict:
        return {'user': s.user, 'csrf': s.csrf, 'calPrefix': cfg.cal_prefix}

    def set_cookie(resp: Response, s: Session):
        resp.set_cookie(COOKIE, s.sid, max_age=int(s.ttl) if s.remember else None, httponly=True,
                        samesite='strict', secure=cfg.cookie_secure, path='/')

    # ---------- API
    @app.post('/api/login')
    async def login(body: LoginIn, request: Request, response: Response):
        same_origin(request)
        ip = client_ip(request.client.host if request.client else None, request.headers.get('x-forwarded-for'), trusted)
        keys = (f'ip:{ip}', f'user:{body.user.strip().lower()}')
        wait = limiter.retry_after(*keys)
        if wait:
            raise HTTPException(429, detail={'retryAfter': wait}, headers={'Retry-After': str(wait)})
        user = body.user.strip()
        try:
            await dav(user, body.password).check_login()
        except AuthError:
            limiter.failure(*keys)
            log.warning('connexion refusée pour %r depuis %s', user, ip)
            raise HTTPException(401, 'identifiants refusés')
        except DavError as e:
            log.error('Radicale injoignable pendant la connexion : %s', e)
            raise HTTPException(502, 'Radicale injoignable')
        limiter.success(*keys)
        s = sessions.create(user, body.password, body.remember)
        set_cookie(response, s)
        log.info('connexion de %r depuis %s', user, ip)
        return session_info(s)

    @app.post('/api/logout')
    async def logout(response: Response, s: Session = Depends(current_csrf)):
        sessions.delete(s.sid)
        response.delete_cookie(COOKIE, path='/')
        return {'ok': True}

    @app.get('/api/session')
    async def session(response: Response, s: Session = Depends(current)):
        set_cookie(response, s)          # « Rester connecté » : le cookie est prolongé à chaque visite
        return session_info(s)

    @app.get('/api/data')
    async def data(s: Session = Depends(current)):
        client = dav(s.user, s.password)
        try:
            s.home = s.home or await client.home()
            allc = await client.collections(s.home)
            cols = [c for c in allc if c.kind == 'calendar' and 'VEVENT' in c.components]   # dont les copies d'abonnement
            subs = [c for c in allc if c.kind == 'subscribed' and c.source]
            tasks = next((c for c in allc if c.kind == 'calendar' and c.components == ['VTODO'] and c.name == cfg.cal_prefix + TASKS), None)
            items = await client.all_events(cols)
            todo_items = await client.all_items(tasks.href) if tasks else []
        except AuthError:            # mot de passe changé entre-temps : on déconnecte
            sessions.delete(s.sid)
            raise HTTPException(401, 'identifiants refusés')
        except DavError as e:
            log.error('lecture Radicale impossible : %s', e)
            raise HTTPException(502, 'Radicale injoignable')
        out = build_data(cols, items, cfg.timezone, cfg, subs=subs, tasks=tasks, todo_items=todo_items)
        s.meta_events = {k: dict(v) for k, v in out['meta']['events'].items()}
        s.meta_cals = {k: dict(v) for k, v in out['meta']['calendars'].items()}
        s.meta_dues = {k: dict(v) for k, v in out['meta']['dues'].items()}
        s.tasks_href = tasks.href if tasks else None
        return out

    @app.post('/api/subs/mirror')
    async def subs_mirror(body: dict, s: Session = Depends(current_csrf)):
        """Copie d'un abonnement dans Radicale (gardée même si le lien disparaît, sauvegardée chaque nuit)."""
        try:
            return await mirror(cfg, s, dav(s.user, s.password), str(body.get('cal', '')), list(body.get('events') or []))
        except Refused as e:
            raise HTTPException(422, {'refused': str(e)})
        except AuthError:
            sessions.delete(s.sid)
            raise HTTPException(401, 'identifiants refusés')
        except DavError as e:
            log.error('copie d’abonnement impossible : %s', e)
            raise HTTPException(502, 'Radicale injoignable')

    @app.get('/api/ics')
    async def ics(url: str, s: Session = Depends(current)):
        """Lit le lien d'un abonnement à la place du navigateur (pas de blocage CORS), avec un cache court."""
        try:
            text = await fetch_ics(url)
        except IcsError as e:
            raise HTTPException(502, str(e))
        return Response(text, media_type='text/calendar; charset=utf-8')

    @app.post('/api/changes')
    async def changes(body: dict, s: Session = Depends(current_csrf)):
        client = dav(s.user, s.password)
        ap = Applier(cfg, s, client)
        try:
            if not s.home:
                s.home = await client.home()
            ap.plan(body)
        except (Refused, Unsupported, KeyError, TypeError) as e:
            log.warning('lot refusé pour %r : %s', s.user, e)
            raise HTTPException(422, {'refused': str(e)})
        try:
            return await ap.run(body)
        except Conflict as e:
            log.info('conflit pour %r : %s', s.user, e)
            raise HTTPException(409, {'conflict': str(e)})
        except AuthError:
            sessions.delete(s.sid)
            raise HTTPException(401, 'identifiants refusés')
        except DavError as e:
            log.error('écriture Radicale impossible : %s', e)
            raise HTTPException(502, 'Radicale injoignable')
        except (Unsupported, KeyError, ValueError) as e:
            log.exception('écriture impossible')
            raise HTTPException(422, {'refused': str(e)})

    @app.get('/healthz', include_in_schema=False)
    async def healthz():
        return PlainTextResponse('ok')

    @app.exception_handler(HTTPException)
    async def http_error(_request: Request, exc: HTTPException):
        return JSONResponse({'error': exc.detail}, status_code=exc.status_code, headers=getattr(exc, 'headers', None))

    if cfg.static_dir.is_dir():
        app.mount('/', StaticFiles(directory=cfg.static_dir, html=True), name='static')
    return app


def _sort_key(name: str) -> str:
    return ''.join(c for c in unicodedata.normalize('NFD', name.casefold()) if not unicodedata.combining(c))


def build_data(cols, items, tz: str, cfg: Settings | None = None, subs=(), tasks=None, todo_items=()) -> dict:
    """Collections + ressources Radicale → { calendars, events, dues, meta, errors } au format de la maquette."""
    reader = Reader(tz)
    calendars, events, meta_ev, meta_cal, errors = [], [], {}, {}, []
    writable = lambda name: bool(cfg and cfg.writable(name))
    for c in sorted([*cols, *subs], key=lambda c: _sort_key(c.displayname or c.name)):
        cid = calendar_id(c.name)
        if cid in meta_cal:          # deux collections au même nom réduit : on garde la première
            continue
        cal = {'id': cid, 'name': c.displayname or c.name, 'color': palette.nearest(c.color), 'visible': True}
        kind = c.kind
        if c.source:                 # abonnement : relu depuis son lien par l'interface (via /api/ics)
            cal['sub'] = {'url': c.source, 'at': None, 'n': 0, 'err': None}
            if kind == 'calendar':   # calendrier « miroir » : ses événements sont la copie gardée dans Radicale
                kind = 'mirror'
        calendars.append(cal)
        meta_cal[cid] = {'href': c.href, 'ctag': c.ctag, 'colorHex': c.color, 'writable': writable(c.name), 'kind': kind}
    by_href = {meta_cal[k]['href']: k for k in meta_cal}
    for c in cols:
        cid = by_href.get(c.href)
        if cid is None:
            continue
        for it in items.get(c.href, []):
            try:
                res = reader.read_resource(it.data, cid, it.href, it.etag)
            except Exception as e:     # une ressource illisible ne doit pas empêcher d'afficher les autres
                log.warning('ressource illisible %s : %s', it.href, e)
                errors.append({'href': it.href, 'error': type(e).__name__})
                continue
            events.extend(res.events)
            meta_ev.update(res.meta)
    uid_to_id = {m['uid']: i for i, m in meta_ev.items() if m.get('kind') in ('single', 'series')}
    dues, meta_due = [], {}
    for it in todo_items:
        try:
            d = read_todo(it.data, tz, uid_to_id)
        except Exception as e:
            log.warning('tâche illisible %s : %s', it.href, e)
            errors.append({'href': it.href, 'error': type(e).__name__})
            continue
        if d:
            dues.append(d)
            meta_due[d['id']] = {'href': it.href, 'etag': it.etag}
    return {'calendars': calendars, 'events': events, 'dues': dues,
            'meta': {'events': meta_ev, 'calendars': meta_cal, 'dues': meta_due,
                     'tasks': {'writable': writable(((cfg.cal_prefix if cfg else '') + TASKS))}},
            'errors': errors}


app = create_app()
