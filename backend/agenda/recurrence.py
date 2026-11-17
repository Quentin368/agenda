"""Le calcul des répétitions de la maquette (fonction expand() de static/app.js), reproduit en Python.

Il sert à décider si une série iCalendar peut être confiée telle quelle à l'interface :
on compare ses occurrences selon la maquette à ses occurrences selon la norme (recurring-ical-events).
Si elles diffèrent (le 31 du mois, le 29 février, une heure UTC qui glisse au changement d'heure,
un DTSTART hors de la règle…), le serveur envoie les occurrences déjà calculées.
"""
import calendar
from datetime import date, datetime, timedelta
from zoneinfo import ZoneInfo


def parse_local(s: str) -> datetime:
    """'YYYY-MM-DD' ou 'YYYY-MM-DDTHH:MM' → datetime naïf (heure locale)."""
    return datetime.fromisoformat(s if 'T' in s else s + 'T00:00')


def fmt_local(d: datetime, all_day: bool) -> str:
    return d.strftime('%Y-%m-%d') if all_day else d.strftime('%Y-%m-%dT%H:%M')


def _iso_dow(d: date) -> int:
    return d.isoweekday()


def _dim(d: date) -> int:
    return calendar.monthrange(d.year, d.month)[1]


def _months_between(a: date, b: date) -> int:
    return (b.year - a.year) * 12 + b.month - a.month


def _normalize(d: datetime, tz: ZoneInfo) -> datetime:
    """Heure inexistante (passage à l'heure d'été, 2 h 30 → 3 h 30), comme new Date(…) en JavaScript."""
    return d.replace(tzinfo=tz).astimezone(ZoneInfo('UTC')).astimezone(tz).replace(tzinfo=None)


def _wall_add(start: datetime, delta: timedelta, tz: ZoneInfo) -> datetime:
    """Ajout d'une durée exacte à une heure locale (comme new Date(os.getTime() + (e - s)) en JS)."""
    aware = start.replace(tzinfo=tz)
    return (aware.astimezone(ZoneInfo('UTC')) + delta).astimezone(tz).replace(tzinfo=None)


def _exact_delta(s: datetime, e: datetime, tz: ZoneInfo) -> timedelta:
    return e.replace(tzinfo=tz).astimezone(ZoneInfo('UTC')) - s.replace(tzinfo=tz).astimezone(ZoneInfo('UTC'))


def expand_like_mockup(ev: dict, range_end: date, tz: ZoneInfo, limit: int = 20000) -> list[tuple[str, str]]:
    """Occurrences (début, fin) selon la maquette, du début de la série jusqu'à range_end (exclu)."""
    all_day = ev['allDay']
    s, e = parse_local(ev['start']), parse_local(ev['end'])
    if not all_day:
        s, e = _normalize(s, tz), _normalize(e, tz)
    r = ev['rrule']
    exd = set(ev.get('exdates') or [])
    dur = _exact_delta(s, e, tz)
    out = []

    def occ_end(os: datetime) -> datetime:
        if all_day:
            return os + timedelta(days=(e.date() - s.date()).days)
        return _wall_add(os, dur, tz)

    if r.get('freq', 'none') == 'none':
        return [(fmt_local(s, all_day), fmt_local(e, all_day))]
    end = range_end
    if r.get('until'):
        end = min(end, date.fromisoformat(r['until']) + timedelta(days=1))
    days = r.get('days') or [_iso_dow(s.date())]
    n = r.get('interval') or 1
    n = n if n > 1 else 1
    s0 = s.date()
    mon0 = s0 - timedelta(days=_iso_dow(s0) - 1)
    d = s0
    while d < end and len(out) < limit:
        f = r['freq']
        if f == 'daily':
            ok = (d - s0).days % n == 0
        elif f == 'weekly':
            ok = _iso_dow(d) in days and ((d - mon0).days // 7) % n == 0
        elif f == 'monthly':
            ok = d.day == min(s0.day, _dim(d)) and _months_between(s0, d) % n == 0
        elif f == 'yearly':
            ok = d.month == s0.month and d.day == min(s0.day, _dim(d)) and (d.year - s0.year) % n == 0
        else:
            ok = False
        if ok and d.isoformat() not in exd:
            os = datetime(d.year, d.month, d.day, s.hour, s.minute)
            if not all_day:
                os = _normalize(os, tz)
            out.append((fmt_local(os, all_day), fmt_local(occ_end(os), all_day)))
        d += timedelta(days=1)
    return out
