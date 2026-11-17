"""Écriture : modèle JSON de la maquette → iCalendar, en partant TOUJOURS de l'iCal brut stocké.

Règle d'or 1 (fidélité) : on ne réécrit que les propriétés des champs qui ont changé entre « avant » (ce que
l'interface avait reçu) et « après » ; tout le reste (alarmes, participants, X-*, propriétés inconnues, VTIMEZONE,
ordre des propriétés…) est conservé tel quel. Une propriété modifiée garde sa forme (TZID, UTC, heure flottante).
"""
from __future__ import annotations

import copy
import json
from datetime import date, datetime, timedelta, timezone
from zoneinfo import ZoneInfo

import icalendar
from icalendar import vText

from .recurrence import expand_like_mockup, parse_local

UTC = ZoneInfo('UTC')
PRODID = '-//Agenda pour Radicale//FR'
ICS_DAY = {1: 'MO', 2: 'TU', 3: 'WE', 4: 'TH', 5: 'FR', 6: 'SA', 7: 'SU'}
FREQ = {'daily': 'DAILY', 'weekly': 'WEEKLY', 'monthly': 'MONTHLY', 'yearly': 'YEARLY'}
TIME_FIELDS = ('start', 'end', 'allDay', 'openEnd')

# Définition compacte (par règles) du fuseau de Paris, valable sans limite de date
VTIMEZONE_PARIS = """BEGIN:VTIMEZONE
TZID:Europe/Paris
BEGIN:DAYLIGHT
TZOFFSETFROM:+0100
TZOFFSETTO:+0200
TZNAME:CEST
DTSTART:19700329T020000
RRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=-1SU
END:DAYLIGHT
BEGIN:STANDARD
TZOFFSETFROM:+0200
TZOFFSETTO:+0100
TZNAME:CET
DTSTART:19701025T030000
RRULE:FREQ=YEARLY;BYMONTH=10;BYDAY=-1SU
END:STANDARD
END:VTIMEZONE
"""


class Unsupported(ValueError):
    """Modification que l'agenda refuse d'écrire (ex. changer une répétition qu'il ne sait pas représenter)."""


def _now() -> datetime:
    return datetime.now(timezone.utc).replace(microsecond=0)


def _set(comp, name: str, value, **params) -> None:
    """Remplace (ou ajoute) une propriété en gardant sa place dans le composant."""
    tmp = icalendar.Event()
    tmp.add(name, value, parameters=params or None)
    comp[name] = tmp[name]


def _del(comp, *names: str) -> None:
    for n in names:
        if n in comp:
            del comp[n]


class Form:
    """Forme des dates d'un composant : fuseau (TZID), UTC, ou heure flottante — gardée quand on les réécrit."""

    def __init__(self, tz: ZoneInfo, kind: str = 'tzid', zone: ZoneInfo | None = None):
        self.tz, self.kind, self.zone = tz, kind, zone or tz

    @classmethod
    def of(cls, comp, tz: ZoneInfo) -> 'Form':
        p = comp.get('DTSTART')
        v = p.dt if p is not None else None
        if isinstance(v, datetime):
            if v.tzinfo is None:
                return cls(tz, 'floating')
            key = getattr(v.tzinfo, 'key', None)
            if key == 'UTC' or v.utcoffset() == timedelta(0) and key in (None, 'UTC', 'Etc/UTC'):
                return cls(tz, 'utc')
            if key:
                return cls(tz, 'tzid', ZoneInfo(key))
        return cls(tz, 'tzid', tz)          # journée, ou rien : heure de Paris pour une heure à venir

    def value(self, local: str, all_day: bool):
        """'YYYY-MM-DD[THH:MM]' (heure locale de l'agenda) → valeur iCal sous cette forme."""
        d = parse_local(local)
        if all_day:
            return d.date()
        if self.kind == 'floating':
            return d
        aware = d.replace(tzinfo=self.tz)
        aware = aware.astimezone(UTC).astimezone(self.tz)          # 2 h 30 inexistant → 3 h 30, comme l'interface
        return aware.astimezone(UTC) if self.kind == 'utc' else aware.astimezone(self.zone)


def _occ_value(form: Form, day: str, start_local: str, all_day: bool):
    """Valeur d'une occurrence (EXDATE, RECURRENCE-ID) : le jour donné à l'heure de début de la série."""
    if all_day:
        return date.fromisoformat(day)
    return form.value(f'{day}T{start_local[11:16]}', False)


def _until_value(form: Form, until: str, start_local: str, all_day: bool):
    """UNTIL inclusif : le dernier jour à l'heure de début (en UTC si la série a un fuseau, norme RFC 5545)."""
    if all_day:
        return date.fromisoformat(until)
    v = form.value(f'{until}T{start_local[11:16]}', False)
    return v if form.kind == 'floating' else v.astimezone(UTC)


def _rrule_value(rr: dict, form: Form, start_local: str, all_day: bool, old=None) -> dict:
    out = {'FREQ': FREQ[rr['freq']]}
    if (rr.get('interval') or 1) > 1:
        out['INTERVAL'] = rr['interval']
    if rr['freq'] == 'weekly':
        out['BYDAY'] = [ICS_DAY[d] for d in sorted(rr.get('days') or [parse_local(start_local).isoweekday()])]
    if rr.get('until'):
        out['UNTIL'] = _until_value(form, rr['until'], start_local, all_day)
    if old is not None and 'WKST' in old:
        out['WKST'] = old['WKST']
    return out


def _first_alarm(comp):
    """L'alarme que la lecture a reprise comme « rem » : la première relative au début."""
    for a in comp.subcomponents:
        if a.name != 'VALARM':
            continue
        t = a.get('TRIGGER')
        if t is not None and isinstance(t.dt, timedelta) and str(t.params.get('RELATED', 'START')).upper() == 'START':
            return a
    return None


def _alarm(rem: str, title: str):
    a = icalendar.Alarm()
    a.add('ACTION', 'DISPLAY')
    a.add('DESCRIPTION', title or 'Rappel')
    a.add('TRIGGER', timedelta(minutes=-int(rem)))
    return a


def _override_dates(cal, uid: str, tz: ZoneInfo) -> set[str]:
    out = set()
    for c in cal.walk('VEVENT'):
        if str(c.get('UID', '')) == uid and c.get('RECURRENCE-ID') is not None:
            v = c['RECURRENCE-ID'].dt
            out.add((v.astimezone(tz) if isinstance(v, datetime) and v.tzinfo else v).strftime('%Y-%m-%d'))
    return out


def _rid_local_date(comp, tz) -> str:
    v = comp['RECURRENCE-ID'].dt
    return (v.astimezone(tz) if isinstance(v, datetime) and v.tzinfo else v).strftime('%Y-%m-%d')


class Writer:
    def __init__(self, tz: str = 'Europe/Paris'):
        self.tz = ZoneInfo(tz)

    def first_occurrence(self, model: dict) -> dict:
        """Série hebdomadaire qui commence un jour hors de ses jours (« lun. et jeu. » à partir d'un mercredi) :
        la maquette n'affiche pas ce premier jour, la norme si. On avance le début à la première vraie occurrence."""
        rr = model.get('rrule') or {}
        if rr.get('freq') != 'weekly':
            return model
        start = parse_local(model['start'])
        horizon = (start + timedelta(days=7 * (rr.get('interval') or 1) + 7)).date()
        occ = expand_like_mockup({**model, 'exdates': []}, horizon, self.tz, limit=1)
        if not occ or occ[0][0] == model['start']:
            return model
        return {**model, 'start': occ[0][0], 'end': occ[0][1]}

    # ------------------------------------------------------------ un composant
    def patch(self, comp, before: dict, after: dict, *, exdates_skip: set[str] = frozenset(), force_time=False) -> None:
        """Applique au composant les champs qui diffèrent entre before et after."""
        ch = lambda k: before.get(k) != after.get(k)
        form = Form.of(comp, self.tz)
        significant = False

        if ch('title'):
            _set(comp, 'SUMMARY', after.get('title') or '')
        for field, prop in (('loc', 'LOCATION'), ('desc', 'DESCRIPTION')):
            if ch(field):
                (_set(comp, prop, after[field]) if after.get(field) else _del(comp, prop))

        all_day = bool(after.get('allDay'))
        time_changed = force_time or any(ch(k) for k in TIME_FIELDS)
        if time_changed:
            significant = True
            if bool(before.get('allDay')) != all_day and not all_day:
                form = Form(self.tz)                                  # journée → heure : à l'heure de Paris
            _set(comp, 'DTSTART', form.value(after['start'], all_day))
            open_end = bool(after.get('openEnd')) and not all_day
            if 'DURATION' in comp and not open_end:
                end = parse_local(after['end']) - parse_local(after['start'])
                _set(comp, 'DURATION', end if not all_day else timedelta(days=end.days))
            elif 'DTEND' in comp or not open_end:
                _set(comp, 'DTEND', form.value(after['end'], all_day))
            if open_end and ('DTEND' in comp or 'DURATION' in comp):
                _set(comp, 'X-AGENDA-OPENEND', 'TRUE')
            elif not open_end:
                _del(comp, 'X-AGENDA-OPENEND')

        rr_b, rr_a = before.get('rrule') or {'freq': 'none'}, after.get('rrule') or {'freq': 'none'}
        is_series = rr_a.get('freq', 'none') != 'none'
        if rr_b != rr_a or (time_changed and is_series):
            significant = True
            if is_series:
                old = comp.get('RRULE')
                _set(comp, 'RRULE', _rrule_value(rr_a, Form.of(comp, self.tz), after['start'], all_day,
                                                 {k.upper(): v for k, v in dict(old).items()} if old is not None else None))
            else:
                _del(comp, 'RRULE', 'RDATE', 'EXDATE')
        if is_series and (ch('exdates') or time_changed or rr_b != rr_a):
            significant = True
            form_now = Form.of(comp, self.tz)
            days = sorted(set(after.get('exdates') or []) - set(exdates_skip))
            _del(comp, 'EXDATE')
            if days:
                comp.add('EXDATE', [_occ_value(form_now, d, after['start'], all_day) for d in days])

        if ch('rem'):
            old = _first_alarm(comp)
            if old is not None:
                comp.subcomponents.remove(old)
            if after.get('rem') not in (None, '', 'none'):
                comp.add_component(_alarm(after['rem'], after.get('title', '')))

        for field, prop in (('person', 'X-AGENDA-PERSON'), ('group', 'X-AGENDA-GROUP')):
            if ch(field):
                (_set(comp, prop, vText(after[field])) if after.get(field) else _del(comp, prop))
        if ch('icsUid'):
            (_set(comp, 'X-AGENDA-ICSUID', vText(after['icsUid'])) if after.get('icsUid') else _del(comp, 'X-AGENDA-ICSUID'))
        if ch('born'):
            (_set(comp, 'X-AGENDA-BORN', str(after['born'])) if after.get('born') else _del(comp, 'X-AGENDA-BORN'))
        if ch('fav'):
            (_set(comp, 'X-AGENDA-FAV', 'TRUE') if after.get('fav') else _del(comp, 'X-AGENDA-FAV'))
        if ch('gifts'):
            g = after.get('gifts')
            (_set(comp, 'X-AGENDA-GIFTS', vText(json.dumps(g, ensure_ascii=False, separators=(',', ':')))) if g else _del(comp, 'X-AGENDA-GIFTS'))

        now = _now()
        _set(comp, 'DTSTAMP', now)
        _set(comp, 'LAST-MODIFIED', now)
        if significant and 'SEQUENCE' in comp:
            _set(comp, 'SEQUENCE', int(comp['SEQUENCE']) + 1)

    # ------------------------------------------------------------ ressources entières
    def new_resource(self, uid: str, model: dict) -> str:
        cal = icalendar.Calendar()
        cal.add('VERSION', '2.0')
        cal.add('PRODID', PRODID)
        ev = icalendar.Event()
        ev.add('UID', uid)
        now = _now()
        ev.add('DTSTAMP', now)
        ev.add('CREATED', now)
        ev.add('LAST-MODIFIED', now)
        self.patch(ev, {}, model, force_time=True)
        ev.add('SEQUENCE', 0)
        cal.add_component(ev)
        return self.finish(cal)

    def import_resource(self, uid: str, raw: dict, model: dict) -> str:
        """Événement importé d'un fichier .ics : son VEVENT tel quel (participants, alarmes, X-*…), avec un UID neuf
        (l'id de l'agenda ; l'UID d'origine est gardé en X-AGENDA-ICSUID pour reconnaître un réimport), puis les
        choix faits dans l'agenda (calendrier, rappel…) appliqués comme une modification."""
        from .ical_read import Reader
        cal = icalendar.Calendar()
        cal.add('VERSION', '2.0')
        cal.add('PRODID', PRODID)
        used = set()
        for tz_text in raw.get('vtimezones') or []:
            tzc = icalendar.Timezone.from_ical(tz_text)
            if str(tzc.get('TZID')) not in used:
                used.add(str(tzc.get('TZID')))
                cal.add_component(tzc)
        ev = icalendar.Event.from_ical(raw['vevent'])
        if not isinstance(ev, icalendar.Event):
            raise Unsupported('le fichier importé ne contient pas un événement')
        original = str(ev.get('UID') or '')
        _set(ev, 'UID', uid)
        _del(ev, 'RECURRENCE-ID')
        if original:
            _set(ev, 'X-AGENDA-ICSUID', vText(original))
        cal.add_component(ev)
        before = Reader(self.tz.key).read_resource(cal.to_ical().decode(), model['cal'], '', None).events
        if before and before[0]['id'] == uid:
            b = {**before[0]}
            b.pop('repNote', None)
            after = {k: v for k, v in model.items() if k not in ('icsUid', 'repNote')}
            self.patch(ev, b, {**b, **after})
        else:                       # répétition que l'agenda ne sait pas suivre : gardée telle quelle
            self.patch(ev, {}, {k: model[k] for k in ('rem',) if k in model})
        return self.finish(cal)

    def finish(self, cal) -> str:
        """Sérialise ; ajoute la définition de Paris si une date y fait référence et qu'elle manque."""
        text = cal.to_ical().decode()
        if 'TZID=Europe/Paris' in text and not any(str(t.get('TZID')) == 'Europe/Paris' for t in cal.walk('VTIMEZONE')):
            i = text.index('BEGIN:VEVENT') if 'BEGIN:VEVENT' in text else text.index('END:VCALENDAR')
            text = text[:i] + VTIMEZONE_PARIS.replace('\n', '\r\n') + text[i:]
        return text

    @staticmethod
    def parse(raw: str):
        return icalendar.Calendar.from_ical(raw)

    @staticmethod
    def master(cal, uid: str):
        for c in cal.walk('VEVENT'):
            if str(c.get('UID', '')) == uid and c.get('RECURRENCE-ID') is None:
                return c
        raise Unsupported(f'série {uid!r} introuvable dans la ressource')

    def find_override(self, cal, uid: str, day: str):
        for c in cal.walk('VEVENT'):
            if str(c.get('UID', '')) == uid and c.get('RECURRENCE-ID') is not None and _rid_local_date(c, self.tz) == day:
                return c
        return None

    def add_override(self, cal, uid: str, day: str, series_model: dict, model: dict):
        """« Cette occurrence seulement » : copie de la série (alarmes, X-*, participants…) avec RECURRENCE-ID."""
        m = self.master(cal, uid)
        comp = self.find_override(cal, uid, day)
        occ_before = self.occurrence_model(series_model, day)
        if comp is None:
            comp = copy.deepcopy(m)
            _del(comp, 'RRULE', 'RDATE', 'EXDATE', 'RECURRENCE-ID')
            form = Form.of(m, self.tz)
            _set(comp, 'RECURRENCE-ID', _occ_value(form, day, series_model['start'], series_model['allDay']))
            cal.add_component(comp)
            self.patch(comp, occ_before, model, force_time=True)
        else:
            self.patch(comp, occ_before, model)
        return comp

    def add_override_from(self, cal, uid: str, day: str, before: dict, after: dict):
        """Modifier une occurrence déjà affichée seule (occurrence modifiée, ou calculée par le serveur)."""
        comp = self.find_override(cal, uid, day)
        if comp is not None:
            self.patch(comp, before, after)
            return comp
        m = self.master(cal, uid)
        comp = copy.deepcopy(m)
        _del(comp, 'RRULE', 'RDATE', 'EXDATE', 'RECURRENCE-ID')
        st = m['DTSTART'].dt
        all_day = not isinstance(st, datetime)
        loc = st.astimezone(self.tz) if not all_day and st.tzinfo else st
        _set(comp, 'RECURRENCE-ID', _occ_value(Form.of(m, self.tz), day, loc.strftime('%Y-%m-%dT%H:%M') if not all_day else day, all_day))
        cal.add_component(comp)
        self.patch(comp, before, after, force_time=True)
        return comp

    @staticmethod
    def occurrence_model(series: dict, day: str) -> dict:
        """L'occurrence du jour `day` telle que l'interface la voit (pour savoir ce que l'utilisateur a changé)."""
        s, e = parse_local(series['start']), parse_local(series['end'])
        ns = datetime.fromisoformat(day + (series['start'][10:] if 'T' in series['start'] else 'T00:00'))
        fmt = (lambda d: d.strftime('%Y-%m-%d')) if series['allDay'] else (lambda d: d.strftime('%Y-%m-%dT%H:%M'))
        return {**series, 'start': fmt(ns), 'end': fmt(ns + (e - s)), 'rrule': {'freq': 'none'}, 'exdates': []}

    def remove_override(self, cal, uid: str, day: str) -> bool:
        comp = self.find_override(cal, uid, day)
        if comp is not None:
            cal.subcomponents.remove(comp)
            return True
        return False

    def add_exdate(self, cal, uid: str, day: str) -> None:
        m = self.master(cal, uid)
        form = Form.of(m, self.tz)
        start = m['DTSTART'].dt
        all_day = not isinstance(start, datetime)
        st_local = (start.astimezone(self.tz) if not all_day and start.tzinfo else start)
        st = st_local.strftime('%Y-%m-%d') if all_day else st_local.strftime('%Y-%m-%dT%H:%M')
        have = set()
        ex = m.get('EXDATE')
        for prop in (ex if isinstance(ex, list) else [ex] if ex is not None else []):
            for d in prop.dts:
                v = d.dt
                have.add((v.astimezone(self.tz) if isinstance(v, datetime) and v.tzinfo else v).strftime('%Y-%m-%d'))
        if day in have:
            return
        m.add('EXDATE', [_occ_value(form, day, st, all_day)])
        _set(m, 'DTSTAMP', _now())
        _set(m, 'LAST-MODIFIED', _now())

    def remove_exdate(self, cal, uid: str, day: str) -> None:
        m = self.master(cal, uid)
        ex = m.get('EXDATE')
        if ex is None:
            return
        keep = []
        for prop in (ex if isinstance(ex, list) else [ex]):
            for d in prop.dts:
                v = d.dt
                if (v.astimezone(self.tz) if isinstance(v, datetime) and v.tzinfo else v).strftime('%Y-%m-%d') != day:
                    keep.append(v)
        _del(m, 'EXDATE')
        if keep:
            m.add('EXDATE', keep)

    def drop_overrides_after(self, cal, uid: str, until: str | None) -> None:
        """Série coupée : ses occurrences modifiées au-delà de la nouvelle fin n'ont plus de sens."""
        if not until:
            return
        for c in list(cal.walk('VEVENT')):
            if str(c.get('UID', '')) == uid and c.get('RECURRENCE-ID') is not None and _rid_local_date(c, self.tz) > until:
                cal.subcomponents.remove(c)

    def shift_overrides(self, cal, uid: str, before: dict, after: dict) -> None:
        """Toute la série déplacée : les RECURRENCE-ID de ses occurrences modifiées suivent le même décalage."""
        if before.get('allDay') != after.get('allDay'):
            return
        delta = parse_local(after['start']) - parse_local(before['start'])
        if not delta:
            return
        m = self.master(cal, uid)
        form = Form.of(m, self.tz)
        for c in cal.walk('VEVENT'):
            if str(c.get('UID', '')) == uid and c.get('RECURRENCE-ID') is not None:
                v = c['RECURRENCE-ID'].dt
                if isinstance(v, datetime):
                    loc = (v.astimezone(self.tz) if v.tzinfo else v).replace(tzinfo=None) + delta
                    _set(c, 'RECURRENCE-ID', form.value(loc.strftime('%Y-%m-%dT%H:%M'), False))
                else:
                    _set(c, 'RECURRENCE-ID', v + delta)

    def overrides_days(self, cal, uid: str) -> set[str]:
        return _override_dates(cal, uid, self.tz)
