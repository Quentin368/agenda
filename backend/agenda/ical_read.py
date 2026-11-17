"""Lecture : iCalendar (ressources Radicale) → modèle JSON de la maquette.

Modèle d'un événement (cf. norm() dans static/app.js) :
  { id, cal, title, start, end, allDay, loc, desc, rem, rrule:{freq, days?, until?, interval?}, exdates:[…] }
  + champs facultatifs : person, born, fav, group, gifts, openEnd, repNote.
Dates : chaînes locales (fuseau de l'agenda) 'YYYY-MM-DD' ou 'YYYY-MM-DDTHH:MM', fin exclusive.

Les informations propres au serveur (ressource, ETag, UID, nature de l'événement) ne vont PAS dans
l'événement : elles sont renvoyées à part (« meta »), pour qu'une copie d'événement dans l'interface
ne pointe jamais vers la ressource de l'original.
"""
from __future__ import annotations

import hashlib
import json
import re
from dataclasses import dataclass, field
from datetime import date, datetime, timedelta
from zoneinfo import ZoneInfo

import icalendar
import recurring_ical_events
from dateutil.rrule import rrulestr

from .recurrence import expand_like_mockup, fmt_local, parse_local

ANNIV_COLLECTION = 'anniversaires'
ANNIV_ID = 'anniv'
OPEN_LEN = timedelta(hours=1)          # « fin inconnue » : une heure dans la grille (OPEN_LEN de la maquette)
REP_NOTE = 'Répétition personnalisée (créée sur un autre appareil) : dates affichées telles quelles'
ICS_DAYS = {'MO': 1, 'TU': 2, 'WE': 3, 'TH': 4, 'FR': 5, 'SA': 6, 'SU': 7}
FREQS = {'DAILY': 'daily', 'WEEKLY': 'weekly', 'MONTHLY': 'monthly', 'YEARLY': 'yearly'}
COMPARE_YEARS = 6                       # horizon de comparaison maquette ⇄ norme
EXPAND_PAST_YEARS, EXPAND_FUTURE_YEARS, EXPAND_MAX = 10, 2, 1500

# Un id d'événement apparaît dans des clés « id@jour » et dans des sélecteurs CSS : on n'y garde que des
# caractères sûrs. Un UID qui en contient d'autres (« …@google.com ») est remplacé par une empreinte stable.
_SAFE_ID = re.compile(r'^[A-Za-z0-9._:-]{1,120}$')


def safe_id(raw: str) -> str:
    if _SAFE_ID.match(raw):
        return raw
    return 'h' + hashlib.sha256(raw.encode()).hexdigest()[:24]


def calendar_id(collection_name: str) -> str:
    return ANNIV_ID if collection_name == ANNIV_COLLECTION else safe_id(collection_name)


def _stamp(local: datetime, all_day: bool) -> str:
    return local.strftime('%Y%m%d') if all_day else local.strftime('%Y%m%dT%H%M')


@dataclass
class Result:
    events: list[dict] = field(default_factory=list)
    meta: dict[str, dict] = field(default_factory=dict)


class Reader:
    """Convertit les ressources d'un chargement complet (garde la trace des ids déjà pris)."""

    def __init__(self, tz: str = 'Europe/Paris', today: date | None = None):
        self.tz = ZoneInfo(tz)
        self.today = today or datetime.now(self.tz).date()
        self.used: set[str] = set()

    # ---------- dates
    def local(self, v) -> tuple[datetime, bool]:
        """Valeur iCal (date / datetime avec ou sans fuseau) → (datetime local naïf, journée entière ?)."""
        if isinstance(v, datetime):
            if v.tzinfo is not None:
                v = v.astimezone(self.tz).replace(tzinfo=None)
            return v.replace(second=0, microsecond=0), False
        if isinstance(v, date):
            return datetime(v.year, v.month, v.day), True
        raise ValueError(f'date iCal inattendue : {v!r}')

    def _aware(self, v) -> datetime:
        if isinstance(v, datetime):
            return v if v.tzinfo else v.replace(tzinfo=self.tz)
        return datetime(v.year, v.month, v.day, tzinfo=self.tz)

    def _span(self, comp) -> tuple[datetime, datetime, bool, bool] | None:
        """Début, fin, journée entière, fin inconnue — comme icsEvent() de la maquette."""
        if comp.get('DTSTART') is None:
            return None
        raw_s = comp['DTSTART'].dt
        s, all_day = self.local(raw_s)
        e = None
        if comp.get('DTEND') is not None:
            raw_e = comp['DTEND'].dt
            if all_day and isinstance(raw_e, datetime):
                raw_e = raw_e.date()
            e, _ = self.local(raw_e) if not all_day else (datetime(raw_e.year, raw_e.month, raw_e.day), True)
        elif comp.get('DURATION') is not None:
            dur = comp['DURATION'].dt
            if all_day:
                e = s + timedelta(days=max(1, dur.days))
            else:                       # jours : nominaux (heure de calendrier) ; heures : durée exacte
                nominal = self._aware(raw_s) + timedelta(days=dur.days)
                e = self.local(nominal.astimezone(ZoneInfo('UTC')) + timedelta(seconds=dur.seconds))[0]
        open_end = False
        if e is None or e <= s:
            if all_day:
                e = s + timedelta(days=1)
            else:
                e, open_end = s + OPEN_LEN, True
        return s, e, all_day, open_end

    # ---------- champs simples
    @staticmethod
    def _text(comp, name: str) -> str:
        v = comp.get(name)
        return str(v) if v is not None else ''

    def _rem(self, comp) -> str:
        """Premier rappel relatif au début → minutes avant le début ('-540' = le jour même à 9 h…)."""
        for alarm in comp.walk('VALARM'):
            trig = alarm.get('TRIGGER')
            if trig is None or not isinstance(trig.dt, timedelta):
                continue
            if str(trig.params.get('RELATED', 'START')).upper() != 'START':
                continue
            minutes = -trig.dt.total_seconds() / 60
            if minutes == int(minutes):
                return str(int(minutes))
        return 'none'

    @staticmethod
    def _xtext(comp, name: str) -> str:
        """Propriété X-* (non typée par la bibliothèque) : on défait l'échappement TEXT d'iCalendar."""
        v = comp.get(name)
        if v is None:
            return ''
        raw = v.to_ical().decode() if hasattr(v, 'to_ical') else str(v)
        return re.sub(r'\\([\\;,nN])', lambda m: '\n' if m.group(1) in 'nN' else m.group(1), raw)

    def _agenda_props(self, comp) -> dict:
        out = {}
        x = lambda n: self._xtext(comp, n)
        if x('X-AGENDA-PERSON'):
            out['person'] = x('X-AGENDA-PERSON')
        if x('X-AGENDA-BORN'):
            try:
                out['born'] = int(x('X-AGENDA-BORN'))
            except ValueError:
                pass
        if x('X-AGENDA-FAV').upper() in ('1', 'TRUE'):
            out['fav'] = True
        if x('X-AGENDA-GROUP'):
            out['group'] = x('X-AGENDA-GROUP')
        if x('X-AGENDA-GIFTS'):
            try:
                gifts = json.loads(x('X-AGENDA-GIFTS'))
                if isinstance(gifts, list):
                    out['gifts'] = [g for g in gifts if isinstance(g, dict) and isinstance(g.get('t'), str)]
            except ValueError:
                pass
        if x('X-AGENDA-ICSUID'):
            out['icsUid'] = x('X-AGENDA-ICSUID')
        if x('X-AGENDA-OPENEND').upper() in ('1', 'TRUE'):
            out['openEnd'] = True
        return out

    def _base_event(self, comp, ev_id: str, cal_id: str, span) -> dict:
        s, e, all_day, open_end = span
        ev = {
            'id': ev_id, 'cal': cal_id, 'title': self._text(comp, 'SUMMARY') or 'Sans titre',
            'start': fmt_local(s, all_day), 'end': fmt_local(e, all_day), 'allDay': all_day,
            'loc': self._text(comp, 'LOCATION'), 'desc': self._text(comp, 'DESCRIPTION'),
            'rem': self._rem(comp), 'rrule': {'freq': 'none'}, 'exdates': [],
        }
        ev.update(self._agenda_props(comp))
        if open_end:
            ev['openEnd'] = True
        return ev

    def _take_id(self, wanted: str, cal_id: str) -> str:
        i, cand = 1, wanted
        while cand in self.used:
            cand = f'{wanted}-{cal_id}' if i == 1 else f'{wanted}-{cal_id}-{i}'
            i += 1
        self.used.add(cand)
        return cand

    # ---------- répétitions
    def _model_rrule(self, comp, s: datetime, all_day: bool) -> dict | None:
        """RRULE → rrule de la maquette, ou None si la maquette ne sait pas l'écrire."""
        rules = comp.get('RRULE')
        if isinstance(rules, list) or comp.get('RDATE') is not None:
            return None
        if rules is None:
            return {'freq': 'none'}
        r = {k.upper(): v for k, v in dict(rules).items()}
        allowed = {'FREQ', 'INTERVAL', 'UNTIL', 'COUNT', 'BYDAY', 'BYMONTHDAY', 'BYMONTH', 'WKST'}
        if set(r) - allowed:
            return None
        freq = FREQS.get(str(r['FREQ'][0]).upper())
        if not freq:
            return None
        interval = int(r.get('INTERVAL', [1])[0] or 1)
        days = None
        if 'BYDAY' in r:
            by = [str(d).upper() for d in r['BYDAY']]
            if not all(d in ICS_DAYS for d in by):      # « 2TU », « -1FR » : pas de jour ordinal dans la maquette
                return None
            days = sorted(ICS_DAYS[d] for d in by)
            if freq == 'daily' and interval == 1:
                freq = 'weekly'
            elif freq != 'weekly':
                return None
        if 'BYMONTHDAY' in r and (freq not in ('monthly', 'yearly') or [int(x) for x in r['BYMONTHDAY']] != [s.day]):
            return None
        if 'BYMONTH' in r and (freq != 'yearly' or [int(x) for x in r['BYMONTH']] != [s.month]):
            return None
        out = {'freq': freq}
        if freq == 'weekly':
            out['days'] = days or [s.isoweekday()]
        out['until'] = None
        if 'UNTIL' in r:
            u = r['UNTIL'][0]
            if isinstance(u, datetime):
                ul, _ = self.local(u)
                ud = ul.date() if (all_day or ul.time() >= s.time()) else ul.date() - timedelta(days=1)
            else:
                ud = u
            out['until'] = ud.isoformat()
        elif 'COUNT' in r:
            n = int(r['COUNT'][0])
            if n < 1:
                return None
            dt0 = self._aware(comp['DTSTART'].dt)
            rule = rrulestr(rules.to_ical().decode(), dtstart=dt0)
            last = None
            for i, occ in enumerate(rule):
                last = occ
                if i + 1 >= n:
                    break
            if last is None:
                return None
            out['until'] = self.local(last if isinstance(comp['DTSTART'].dt, datetime) else last.date())[0].date().isoformat()
        if interval > 1:
            out['interval'] = interval
        return out

    def _standard_occurrences(self, comp, until: date) -> list[tuple[str, str]]:
        """Occurrences selon la norme (série seule, avec ses EXDATE, sans les occurrences modifiées)."""
        cal = icalendar.Calendar()
        cal.add_component(comp)
        s, all_day = self.local(comp['DTSTART'].dt)
        out = []
        for occ in recurring_ical_events.of(cal).between(s.date(), until):
            sp = self._span(occ)
            if sp:
                out.append((fmt_local(sp[0], sp[2]), fmt_local(sp[1], sp[2])))
        return sorted(out)

    def _supported(self, comp, ev: dict) -> bool:
        s = parse_local(ev['start'])
        horizon = max(self.today, s.date()) + timedelta(days=366 * COMPARE_YEARS)
        if ev['rrule'].get('until'):
            horizon = min(horizon, date.fromisoformat(ev['rrule']['until']) + timedelta(days=1))
        mine = expand_like_mockup(ev, horizon, self.tz)
        return mine == self._standard_occurrences(comp, horizon)

    # ---------- une ressource
    def read_resource(self, ics_text: str, cal_id: str, href: str, etag: str | None) -> Result:
        res = Result()
        cal = icalendar.Calendar.from_ical(ics_text)
        vevents = list(cal.walk('VEVENT'))
        if not vevents:
            return res
        masters = [c for c in vevents if c.get('RECURRENCE-ID') is None]
        overrides = [c for c in vevents if c.get('RECURRENCE-ID') is not None]
        srv = lambda kind, uid, **kw: {'cal': cal_id, 'href': href, 'etag': etag, 'uid': uid, 'kind': kind, **kw}

        for master in masters:
            uid = str(master.get('UID') or '') or href
            span = self._span(master)
            if span is None or str(master.get('STATUS', '')).upper() == 'CANCELLED':
                continue
            base_id = safe_id(uid)
            own_overrides = [o for o in overrides if str(o.get('UID') or '') == str(master.get('UID') or '')]
            rr = self._model_rrule(master, span[0], span[2])
            if rr is not None and rr['freq'] != 'none':
                ev = self._base_event(master, '', cal_id, span)
                ev['rrule'] = rr
                ev['exdates'] = self._exdates(master)
                if not self._supported(master, ev):
                    rr = None
            if rr is None:                                   # répétition que la maquette ne sait pas suivre
                self._expanded(cal, master, own_overrides, base_id, cal_id, srv(None, uid), res)
                continue
            ev_id = self._take_id(base_id, cal_id)
            ev = self._base_event(master, ev_id, cal_id, span)
            ev['rrule'] = rr
            if rr['freq'] != 'none':
                ev['exdates'] = self._exdates(master)
            res.events.append(ev)
            res.meta[ev_id] = srv('series' if rr['freq'] != 'none' else 'single', uid)
            for o in own_overrides:
                rid, rid_all_day = self.local(o['RECURRENCE-ID'].dt)
                day = rid.date().isoformat()
                if rr['freq'] != 'none' and day not in ev['exdates']:
                    ev['exdates'].append(day)
                if str(o.get('STATUS', '')).upper() == 'CANCELLED':
                    continue
                osp = self._span(o)
                if osp is None:
                    continue
                oid = self._take_id(f'{base_id}~r{_stamp(rid, rid_all_day)}', cal_id)
                res.events.append(self._base_event(o, oid, cal_id, osp))
                res.meta[oid] = srv('override', uid, series=ev_id, rid=o['RECURRENCE-ID'].to_ical().decode())
            ev['exdates'].sort()

        # Occurrences modifiées dont la série n'est pas dans la ressource (invitation partielle) : événements seuls
        master_uids = {str(m.get('UID') or '') for m in masters}
        for o in overrides:
            uid = str(o.get('UID') or '') or href
            if str(o.get('UID') or '') in master_uids or str(o.get('STATUS', '')).upper() == 'CANCELLED':
                continue
            osp = self._span(o)
            if osp is None:
                continue
            rid, rid_all_day = self.local(o['RECURRENCE-ID'].dt)
            oid = self._take_id(f'{safe_id(uid)}~r{_stamp(rid, rid_all_day)}', cal_id)
            res.events.append(self._base_event(o, oid, cal_id, osp))
            res.meta[oid] = srv('override', uid, series=None, rid=o['RECURRENCE-ID'].to_ical().decode())
        return res

    def _exdates(self, comp) -> list[str]:
        out = set()
        ex = comp.get('EXDATE')
        if ex is None:
            return []
        for prop in ex if isinstance(ex, list) else [ex]:
            for d in prop.dts:
                out.add(self.local(d.dt)[0].date().isoformat())
        return sorted(out)

    def _expanded(self, cal, master, own_overrides, base_id, cal_id, meta_base, res: Result):
        """La série est envoyée occurrence par occurrence, calculées selon la norme (lecture fidèle)."""
        sub = icalendar.Calendar()
        sub.add_component(master)
        for o in own_overrides:
            sub.add_component(o)
        start = max(self.local(master['DTSTART'].dt)[0].date(), self.today - timedelta(days=round(365.25 * EXPAND_PAST_YEARS)))
        end = self.today + timedelta(days=round(365.25 * EXPAND_FUTURE_YEARS))
        series_id = self._take_id(base_id, cal_id)        # réservé : identifie la série dans « meta »
        n = 0
        for occ in recurring_ical_events.of(sub).between(start, end):
            if n >= EXPAND_MAX:
                break
            if str(occ.get('STATUS', '')).upper() == 'CANCELLED':
                continue
            sp = self._span(occ)
            if sp is None:
                continue
            rid_v = occ.get('RECURRENCE-ID')
            rid, rid_all_day = self.local(rid_v.dt) if rid_v is not None else (sp[0], sp[2])
            oid = self._take_id(f'{base_id}~o{_stamp(rid, rid_all_day)}', cal_id)
            ev = self._base_event(occ, oid, cal_id, sp)
            ev['repNote'] = REP_NOTE
            res.events.append(ev)
            res.meta[oid] = {**meta_base, 'kind': 'occurrence', 'series': series_id,
                             'rid': rid_v.to_ical().decode() if rid_v is not None else None}
            n += 1
