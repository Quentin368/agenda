"""Échéances de la maquette ⇄ tâches VTODO (calendrier de tâches dédié, invisible dans l'agenda).

Échéance (S.dues) : { id, t, ev, occ, title, start, allDay, cal, done? }
  id      ⇄ UID                   t     ⇄ SUMMARY
  ev      ⇄ X-AGENDA-EV (id de l'événement dans l'agenda) + RELATED-TO (son vrai UID, pour les autres applications)
  occ     ⇄ X-AGENDA-OCC (jour de l'occurrence visée)
  start   ⇄ DUE (journée : date ; sinon heure de Paris) ; allDay ⇄ forme de DUE
  title, cal ⇄ X-AGENDA-EV-TITLE, X-AGENDA-EV-CAL (dernière version connue de l'événement, s'il disparaît)
  done    ⇄ STATUS:COMPLETED + COMPLETED (jour) + PERCENT-COMPLETE:100 ; sinon STATUS:NEEDS-ACTION
Comme pour les événements : une modification ne réécrit que les champs changés (le téléphone peut ajouter les siens).
"""
from __future__ import annotations

import re
from datetime import date, datetime, time
from zoneinfo import ZoneInfo

import icalendar
from icalendar import vText

from .ical_write import PRODID, UTC, Form, _del, _now, _set
from .recurrence import fmt_local

FIELDS = ('t', 'ev', 'occ', 'title', 'start', 'allDay', 'cal', 'done', 'evUid')


def _x(comp, name: str) -> str:
    v = comp.get(name)
    if v is None:
        return ''
    raw = v.to_ical().decode() if hasattr(v, 'to_ical') else str(v)
    return re.sub(r'\\([\\;,nN])', lambda m: '\n' if m.group(1) in 'nN' else m.group(1), raw)


def read_todo(ics_text: str, tz: str = 'Europe/Paris', uid_to_id: dict | None = None) -> dict | None:
    """Une ressource VTODO → échéance, ou None si ce n'est pas une échéance de l'agenda (tâche ordinaire)."""
    z = ZoneInfo(tz)
    cal = icalendar.Calendar.from_ical(ics_text)
    todos = list(cal.walk('VTODO'))
    if not todos:
        return None
    td = todos[0]
    ev = _x(td, 'X-AGENDA-EV')
    rel = str(td.get('RELATED-TO') or '')
    if not ev and rel and uid_to_id:
        ev = uid_to_id.get(rel, '')
    if not ev or td.get('DUE') is None:
        return None
    due = td['DUE'].dt
    if isinstance(due, datetime):
        due = due.astimezone(z).replace(tzinfo=None) if due.tzinfo else due
        all_day, start = False, fmt_local(due.replace(second=0, microsecond=0), False)
    else:
        all_day, start = True, due.isoformat()
    out = {'id': str(td.get('UID')), 't': str(td.get('SUMMARY') or ''), 'ev': ev,
           'occ': _x(td, 'X-AGENDA-OCC') or start[:10], 'title': _x(td, 'X-AGENDA-EV-TITLE'),
           'start': start, 'allDay': all_day, 'cal': _x(td, 'X-AGENDA-EV-CAL')}
    if str(td.get('STATUS', '')).upper() == 'COMPLETED':
        c = td.get('COMPLETED')
        cd = c.dt if c is not None else None
        if isinstance(cd, datetime):
            cd = (cd.astimezone(z) if cd.tzinfo else cd).date()
        out['done'] = (cd or datetime.now(z).date()).isoformat()
    return out


class TodoWriter:
    def __init__(self, tz: str = 'Europe/Paris'):
        self.tz = ZoneInfo(tz)

    def patch(self, td, before: dict, after: dict) -> None:
        ch = lambda k: before.get(k) != after.get(k)
        if ch('t'):
            _set(td, 'SUMMARY', after.get('t') or '')
        if ch('ev') or ch('evUid'):
            _set(td, 'X-AGENDA-EV', vText(after['ev']))
            _set(td, 'RELATED-TO', after.get('evUid') or after['ev'])
        if ch('occ'):
            _set(td, 'X-AGENDA-OCC', vText(after['occ']))
        if ch('title'):
            (_set(td, 'X-AGENDA-EV-TITLE', vText(after['title'])) if after.get('title') else _del(td, 'X-AGENDA-EV-TITLE'))
        if ch('cal'):
            (_set(td, 'X-AGENDA-EV-CAL', vText(after['cal'])) if after.get('cal') else _del(td, 'X-AGENDA-EV-CAL'))
        if ch('start') or ch('allDay'):
            _set(td, 'DUE', Form(self.tz).value(after['start'], bool(after.get('allDay'))))
        if ch('done'):
            if after.get('done'):
                _set(td, 'STATUS', 'COMPLETED')
                d = date.fromisoformat(after['done'])
                _set(td, 'COMPLETED', datetime.combine(d, time(12, 0), self.tz).astimezone(UTC))
                _set(td, 'PERCENT-COMPLETE', 100)
            else:
                _set(td, 'STATUS', 'NEEDS-ACTION')
                _del(td, 'COMPLETED', 'PERCENT-COMPLETE')
        now = _now()
        _set(td, 'DTSTAMP', now)
        _set(td, 'LAST-MODIFIED', now)

    def new_resource(self, due: dict) -> str:
        cal = icalendar.Calendar()
        cal.add('VERSION', '2.0')
        cal.add('PRODID', PRODID)
        td = icalendar.Todo()
        td.add('UID', due['id'])
        now = _now()
        td.add('DTSTAMP', now)
        td.add('CREATED', now)
        td.add('STATUS', 'NEEDS-ACTION')
        self.patch(td, {}, due)
        cal.add_component(td)
        from .ical_write import Writer
        return Writer(self.tz.key).finish(cal)

    def apply(self, raw: str, before: dict, after: dict) -> str:
        cal = icalendar.Calendar.from_ical(raw)
        self.patch(next(iter(cal.walk('VTODO'))), before, after)
        from .ical_write import Writer
        return Writer(self.tz.key).finish(cal)
