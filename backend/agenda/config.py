"""Réglages lus dans les variables d'environnement (fichier .env de la pile Docker)."""
import os
from dataclasses import dataclass, field
from pathlib import Path


def _bool(name: str, default: bool) -> bool:
    v = os.environ.get(name)
    return default if v is None else v.strip().lower() in ('1', 'true', 'yes', 'oui', 'on')


def _int(name: str, default: int) -> int:
    try:
        return int(os.environ.get(name, default))
    except ValueError:
        return default


@dataclass(frozen=True)
class Settings:
    # Adresse de Radicale vue depuis le conteneur (réseau Docker partagé)
    radicale_url: str = field(default_factory=lambda: os.environ.get('RADICALE_URL', 'http://radicale:5232/').rstrip('/') + '/')
    # Fuseau de l'agenda : toutes les heures envoyées à l'interface sont dans ce fuseau
    timezone: str = field(default_factory=lambda: os.environ.get('AGENDA_TZ', os.environ.get('TZ', 'Europe/Paris')))
    # Sessions : durée d'inactivité avant déconnexion (heures), sans / avec « Rester connecté »
    session_hours: int = field(default_factory=lambda: _int('SESSION_HOURS', 12))
    remember_days: int = field(default_factory=lambda: _int('REMEMBER_DAYS', 30))
    # Cookie « Secure » : à activer seulement derrière HTTPS (ici, accès en HTTP via Tailscale)
    cookie_secure: bool = field(default_factory=lambda: _bool('COOKIE_SECURE', False))
    # Limitation des tentatives de connexion
    login_max_failures: int = field(default_factory=lambda: _int('LOGIN_MAX_FAILURES', 5))
    login_window_minutes: int = field(default_factory=lambda: _int('LOGIN_WINDOW_MINUTES', 15))
    # Verrou d'écriture : motifs des collections modifiables (« dev-agenda,dev-* », « * » = toutes).
    # Vide (par défaut) : aucune écriture, l'agenda est en lecture seule.
    writable_calendars: tuple = field(default_factory=lambda: tuple(
        p.strip() for p in os.environ.get('WRITABLE_CALENDARS', '').split(',') if p.strip()))
    # Fichiers de l'interface
    static_dir: Path = field(default_factory=lambda: Path(os.environ.get('STATIC_DIR', Path(__file__).resolve().parents[2] / 'static')))


    def writable(self, collection: str) -> bool:
        from fnmatch import fnmatchcase
        return any(fnmatchcase(collection, p) for p in self.writable_calendars)

    @property
    def cal_prefix(self) -> str:
        """Préfixe imposé aux calendriers créés depuis l'agenda tant que l'écriture est limitée (« dev- »)."""
        return '' if '*' in self.writable_calendars else 'dev-'


settings = Settings()
