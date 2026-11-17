"""Sessions en mémoire et limitation des tentatives de connexion.

Les identifiants Radicale ne sont gardés QUE dans la mémoire du serveur, liés à une session
(jamais écrits sur disque). Conséquence assumée : un redémarrage du conteneur déconnecte tout le monde.
"""
from __future__ import annotations

import secrets
import threading
import time
from collections import defaultdict, deque
from dataclasses import dataclass, field


@dataclass
class Session:
    sid: str
    user: str
    password: str = field(repr=False)
    csrf: str
    remember: bool
    ttl: float                 # durée d'inactivité autorisée (secondes)
    expires: float
    # État serveur de la session : dossier des calendriers, « meta » (id → ressource, ETag…), corbeille pour « Annuler »
    home: str | None = None
    meta_events: dict = field(default_factory=dict)
    meta_cals: dict = field(default_factory=dict)
    trash: dict = field(default_factory=dict)
    trash_cals: dict = field(default_factory=dict)
    meta_dues: dict = field(default_factory=dict)
    tasks_href: str | None = None

    def __repr__(self) -> str:  # jamais le mot de passe dans un journal
        return f'Session(user={self.user!r}, remember={self.remember})'


class SessionStore:
    def __init__(self, session_hours: int, remember_days: int, clock=time.time):
        self.short = session_hours * 3600
        self.long = remember_days * 86400
        self.clock = clock
        self._s: dict[str, Session] = {}
        self._lock = threading.Lock()

    def create(self, user: str, password: str, remember: bool) -> Session:
        ttl = self.long if remember else self.short
        s = Session(sid=secrets.token_urlsafe(32), user=user, password=password, csrf=secrets.token_urlsafe(32),
                    remember=remember, ttl=ttl, expires=self.clock() + ttl)
        with self._lock:
            self._purge()
            self._s[s.sid] = s
        return s

    def get(self, sid: str | None) -> Session | None:
        """Session valide (et prolongée : expiration glissante), ou None."""
        if not sid:
            return None
        with self._lock:
            s = self._s.get(sid)
            if s is None:
                return None
            now = self.clock()
            if s.expires <= now:
                del self._s[sid]
                return None
            s.expires = now + s.ttl
            return s

    def delete(self, sid: str | None) -> None:
        with self._lock:
            self._s.pop(sid or '', None)

    def _purge(self) -> None:
        now = self.clock()
        for k in [k for k, s in self._s.items() if s.expires <= now]:
            del self._s[k]

    def __len__(self) -> int:
        return len(self._s)


class RateLimiter:
    """Au-delà de N échecs dans la fenêtre (par adresse IP et par identifiant), on refuse jusqu'à ce qu'elle se libère."""

    def __init__(self, max_failures: int, window_minutes: int, clock=time.time):
        self.max = max_failures
        self.window = window_minutes * 60
        self.clock = clock
        self._f: dict[str, deque] = defaultdict(deque)
        self._lock = threading.Lock()

    def _clean(self, key: str, now: float) -> deque:
        q = self._f[key]
        while q and q[0] <= now - self.window:
            q.popleft()
        return q

    def retry_after(self, *keys: str) -> int:
        """0 si on peut essayer ; sinon le nombre de secondes à attendre."""
        now = self.clock()
        wait = 0
        with self._lock:
            for k in keys:
                q = self._clean(k, now)
                if len(q) >= self.max:
                    wait = max(wait, int(q[0] + self.window - now) + 1)
        return wait

    def failure(self, *keys: str) -> None:
        now = self.clock()
        with self._lock:
            for k in keys:
                self._clean(k, now).append(now)

    def success(self, *keys: str) -> None:
        with self._lock:
            for k in keys:
                self._f.pop(k, None)
