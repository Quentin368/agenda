"""Applique à Radicale un lot de modifications calculé par l'interface (synchronisation par différence).

Lot reçu :
  calendars: { create: [{id, name, color}], update: [{id, before:{name, color}, after:{…}}], delete: [{id}] }
  events:    [ {op:'create', id, after, overrideOf?: {series, day, seriesModel}},
               {op:'update', id, before, after},
               {op:'delete', id, before} ]
« before » = ce que l'interface avait reçu du serveur ; « after » = l'état voulu.

Principes : la correspondance id → ressource/ETag vient de la SESSION (jamais de l'interface) ; le verrou
d'écriture est vérifié avant tout envoi ; chaque ressource est relue (ETag comparé), modifiée en place,
puis réécrite une seule fois avec If-Match. Un conflit arrête tout : l'interface rechargera.
"""
from __future__ import annotations

import logging
import re
from dataclasses import dataclass, field

from . import palette
from .auth import Session
from .config import Settings
from .dav import Conflict, DavClient
from .ical_read import Reader, calendar_id
from .ical_todo import TodoWriter
from .ical_write import Unsupported, Writer

log = logging.getLogger('agenda')
SAFE = re.compile(r'^[A-Za-z0-9._:-]{1,120}$')
TASKS = 'echeances'
TRASH_MAX = 100


class Refused(Exception):
    """Lot refusé avant toute écriture (verrou, donnée invalide) : rien n'a été modifié."""


@dataclass
class Work:
    """Ce qu'il faut faire sur UNE ressource existante."""
    href: str
    etag: str | None
    steps: list = field(default_factory=list)       # fonctions (cal) -> None, appliquées dans l'ordre
    masters: list = field(default_factory=list)     # (uid, before, after) : patch de la série, après les étapes
    delete: bool = False
    move_to: str | None = None                       # nouvelle ressource (changement de calendrier)
    ids: set = field(default_factory=set)            # ids de l'interface qui vivent dans cette ressource


def _collection(href: str) -> str:
    return href.rstrip('/').rsplit('/', 1)[-1]


def _cal_of_href(href: str) -> str:
    return href.rstrip('/').rsplit('/', 2)[-2]


class Applier:
    def __init__(self, cfg: Settings, s: Session, dav: DavClient):
        self.cfg, self.s, self.dav = cfg, s, dav
        self.w = Writer(cfg.timezone)
        self.works: dict[str, Work] = {}
        self.creates: list[tuple[str, str, str]] = []    # (href, ics, id)
        self.removed: set[str] = set()                   # ids supprimés en plus (occurrences d'une série supprimée)

    # ------------------------------------------------------------ contrôles
    def cal_href(self, cal_id: str) -> str:
        m = self.s.meta_cals.get(cal_id)
        if not m:
            raise Refused(f'calendrier inconnu : {cal_id}')
        return m['href']

    def check_writable(self, cal_id: str) -> None:
        href = self.cal_href(cal_id)
        if not self.cfg.writable(_collection(href)):
            raise Refused(f'calendrier en lecture seule : {cal_id}')

    def work(self, href: str) -> Work:
        if href not in self.works:
            etag = next((m['etag'] for m in self.s.meta_events.values() if m['href'] == href), None)
            self.works[href] = Work(href, etag)
        return self.works[href]

    # ------------------------------------------------------------ préparation (rien n'est écrit ici)
    def plan(self, batch: dict) -> None:
        cals = batch.get('calendars') or {}
        for c in cals.get('create', []):
            if not SAFE.match(c['id']) or not c['id'].startswith(self.cfg.cal_prefix) or not self.cfg.writable(c['id']):
                raise Refused(f'nom de calendrier refusé : {c["id"]}')
        for c in cals.get('update', []) + cals.get('delete', []):
            self.check_writable(c['id'])
        # Abonnement arrêté (« garder les événements ») : la collection abonnée devient un vrai calendrier
        converted = {c['id'] for c in cals.get('update', []) if c['before'].get('sub') and not c['after'].get('sub')}
        new_cals = {c['id'] for c in cals.get('create', []) if not c.get('sub')} | converted
        gone_cals = {c['id'] for c in cals.get('delete', [])}

        for ch in batch.get('events', []):
            for cid in {(ch.get('before') or {}).get('cal'), (ch.get('after') or {}).get('cal')} - {None}:
                if cid not in new_cals:
                    self.check_writable(cid)
                    if self.s.meta_cals[cid].get('kind') == 'subscribed':
                        raise Refused('les événements d’un abonnement ne s’écrivent pas dans Radicale')
            if ch['op'] != 'create' and ch['id'] not in self.s.meta_events:
                raise Refused(f'événement inconnu du serveur : {ch["id"]}')
            if ch['op'] == 'create' and not SAFE.match(ch['id']):
                raise Refused(f'identifiant refusé : {ch["id"]}')

        self.new_cals, self.gone_cals = new_cals, gone_cals
        self.restored = set()
        for c in cals.get('create', []):
            if c['id'] in self.s.trash_cals:                      # « Annuler » une suppression de calendrier
                self.restored |= self.s.trash_cals[c['id']]['ids']
        evs = batch.get('events', [])
        first = lambda ch: (ch['op'] != 'delete', ch['op'] != 'update',              # suppressions, modifications, puis créations :
                            not (ch['op'] == 'create' and (self.s.trash.get(ch['id']) or {}).get('kind') in ('single', 'series')))
        for ch in sorted(evs, key=first):                                           # une série restaurée avant ses occurrences
            getattr(self, 'plan_' + ch['op'])(ch)
        self.dues = batch.get('dues') or []
        if self.dues:
            name = self.cfg.cal_prefix + TASKS
            if not self.cfg.writable(name):
                raise Refused('les échéances ne peuvent pas être enregistrées (calendrier de tâches verrouillé)')
            for d in self.dues:
                if d['op'] == 'create' and not SAFE.match(d['id']):
                    raise Refused(f'identifiant refusé : {d["id"]}')
                if d['op'] != 'create' and d['id'] not in self.s.meta_dues:
                    raise Refused(f'échéance inconnue du serveur : {d["id"]}')

    def plan_create(self, ch):
        id_, after = ch['id'], ch['after']
        if id_ in self.restored:
            return
        ov = ch.get('overrideOf')
        sm = self.s.meta_events.get(ov['series']) if ov else None
        if sm and sm['kind'] == 'series' and sm['cal'] == after['cal']:
            wk = self.work(sm['href'])
            uid, day, series = sm['uid'], ov['day'], ov['seriesModel']
            wk.steps.append(lambda cal: self.w.add_override(cal, uid, day, series, after))
            wk.ids.add(id_)
            self.s.meta_events[id_] = {**sm, 'kind': 'override', 'series': ov['series'], 'rid': day, 'day': day}
            return
        t = self.s.trash.get(id_)
        if t and t['kind'] in ('override', 'occurrence') and t['cal'] == after['cal']:
            wk = self.work(t['href'])
            wk.steps.append(lambda cal, t=t: self.restore_component(cal, t))
            if t['before'] != after:
                wk.steps.append(lambda cal, t=t: self.w.patch(self.w.find_override(cal, t['uid'], t['day']), t['before'], after))
            wk.ids.add(id_)
            self.s.meta_events[id_] = t['meta']
            return
        cal_href = self.cal_href(after['cal']) if after['cal'] not in self.new_cals else self.new_cal_href(after['cal'])
        if ch.get('raw'):                                          # import .ics : tout le contenu du fichier est gardé
            href = f'{cal_href}{id_}.ics'
            self.creates.append((href, self.w.import_resource(id_, ch['raw'], after), id_))
            self.s.meta_events[id_] = {'cal': after['cal'], 'href': href, 'etag': None, 'uid': id_, 'kind':
                                       'series' if (after.get('rrule') or {}).get('freq', 'none') != 'none' else 'single'}
            return
        if t and t['kind'] in ('single', 'series'):                # « Annuler » une suppression : l'iCal brut revient
            raw = t['raw']
            if t['before'] != after:
                cal = self.w.parse(raw)
                self.patch_master(cal, t['meta']['uid'], t['before'], after)
                raw = self.w.finish(cal)
            href = t['href'] if _cal_of_href(t['href']) == _collection(cal_href) else cal_href + t['href'].rsplit('/', 1)[-1]
            self.creates.append((href, raw, id_))
            self.s.meta_events[id_] = {**t['meta'], 'href': href, 'cal': after['cal']}
            for oid in t.get('others', []):
                self.restored.add(oid)
            return
        href = f'{cal_href}{id_}.ics'
        self.creates.append((href, self.w.new_resource(id_, self.w.first_occurrence(after)), id_))
        self.s.meta_events[id_] = {'cal': after['cal'], 'href': href, 'etag': None, 'uid': id_, 'kind':
                                   'series' if (after.get('rrule') or {}).get('freq', 'none') != 'none' else 'single'}

    def plan_update(self, ch):
        id_, before, after = ch['id'], ch['before'], ch['after']
        m = self.s.meta_events[id_]
        if m['kind'] in ('override', 'occurrence'):
            if (after.get('rrule') or {}).get('freq', 'none') != 'none':
                raise Refused('la répétition de cette occurrence ne peut pas être changée ici')
            day = m.get('day') or self.rid_day(m)
            wk = self.work(m['href'])
            wk.ids.add(id_)
            if after['cal'] != before['cal']:                      # vers un autre calendrier : l'occurrence quitte la série
                wk.steps.append(lambda cal: (self.w.remove_override(cal, m['uid'], day), self.w.add_exdate(cal, m['uid'], day)))
                self.plan_create({'op': 'create', 'id': id_, 'after': after})
                return
            wk.steps.append(lambda cal: self.w.add_override_from(cal, m['uid'], day, before, after))
            self.s.meta_events[id_] = {**m, 'kind': 'override', 'day': day}
            return
        wk = self.work(m['href'])
        wk.ids.add(id_)
        if after['cal'] != before['cal']:
            wk.move_to = self.cal_href(after['cal']) + m['href'].rsplit('/', 1)[-1]
            self.s.meta_events[id_] = {**m, 'cal': after['cal'], 'href': wk.move_to}
        wk.masters.append((m['uid'], before, self.w.first_occurrence(after)))

    def plan_delete(self, ch):
        id_, before = ch['id'], ch['before']
        m = self.s.meta_events[id_]
        if before['cal'] in self.gone_cals:
            return                                                   # parti avec son calendrier
        wk = self.work(m['href'])
        wk.ids.add(id_)
        if m['kind'] in ('single', 'series'):
            wk.delete = True
            others = [i for i, x in self.s.meta_events.items() if x['href'] == m['href'] and i != id_]
            self.removed |= set(others)
            self.trash(id_, {'kind': m['kind'], 'before': before, 'meta': m, 'href': m['href'], 'cal': before['cal'],
                             'others': others, 'raw': None})
            return
        day = m.get('day') or self.rid_day(m)

        def step(cal, m=m, day=day, id_=id_):
            comp = self.w.find_override(cal, m['uid'], day)
            self.trash(id_, {'kind': m['kind'], 'before': before, 'meta': m, 'href': m['href'], 'cal': before['cal'],
                             'uid': m['uid'], 'day': day, 'comp': comp.to_ical().decode() if comp is not None else None})
            self.w.remove_override(cal, m['uid'], day)
            self.w.add_exdate(cal, m['uid'], day)
        wk.steps.append(step)

    # ------------------------------------------------------------ outils
    def rid_day(self, m) -> str:
        from icalendar import vDDDTypes
        v = vDDDTypes.from_ical(m['rid'])
        from datetime import datetime
        if isinstance(v, datetime) and v.tzinfo:
            v = v.astimezone(self.w.tz)
        return v.strftime('%Y-%m-%d')

    def new_cal_href(self, cal_id: str) -> str:
        return f'{self.s.home}{cal_id}/'

    def trash(self, id_, entry):
        self.s.trash[id_] = entry
        while len(self.s.trash) > TRASH_MAX:
            self.s.trash.pop(next(iter(self.s.trash)))

    def restore_component(self, cal, t):
        import icalendar
        if t.get('comp'):
            comp = icalendar.Event.from_ical(t['comp'])
            self.w.remove_override(cal, t['uid'], t['day'])
            cal.add_component(comp)
        self.w.remove_exdate(cal, t['uid'], t['day'])

    def patch_master(self, cal, uid, before, after):
        master = self.w.master(cal, uid)
        if (before.get('rrule') or {}).get('freq', 'none') != 'none' and before.get('start') != after.get('start'):
            self.w.shift_overrides(cal, uid, before, after)
        if (after.get('rrule') or {}).get('freq', 'none') == 'none':
            for c in list(cal.walk('VEVENT')):
                if str(c.get('UID', '')) == uid and c.get('RECURRENCE-ID') is not None:
                    cal.subcomponents.remove(c)
        else:
            self.w.drop_overrides_after(cal, uid, (after.get('rrule') or {}).get('until'))
        self.w.patch(master, before, after, exdates_skip=self.w.overrides_days(cal, uid))

    # ------------------------------------------------------------ exécution
    async def run(self, batch: dict) -> dict:
        cals = batch.get('calendars') or {}
        for c in cals.get('create', []):
            await self.create_calendar(c)
        for c in cals.get('update', []):
            b, a = c['before'], c['after']
            if b.get('sub') and not a.get('sub'):                      # abonnement arrêté : devient un calendrier
                await self.dav.delete(self.cal_href(c['id']), None)
                self.s.meta_cals.pop(c['id'], None)
                await self.create_calendar({'id': c['id'], 'name': a['name'], 'color': a['color']})
                continue
            await self.dav.proppatch(self.cal_href(c['id']), name=a['name'] if a['name'] != b['name'] else None,
                                     color=palette.to_hex(a['color']) if a['color'] != b['color'] else None,
                                     source=a['sub'] if a.get('sub') and a.get('sub') != b.get('sub') else None)
        for href, wk in self.works.items():
            await self.apply_work(wk)
        for href, ics, id_ in self.creates:
            etag = await self.dav.put(href, ics, None)
            self.s.meta_events[id_] = {**self.s.meta_events.get(id_, {}), 'href': href, 'etag': etag}
        for c in cals.get('delete', []):
            await self.delete_calendar(c['id'])
        for d in self.dues:
            await self.apply_due(d)
        for i in self.removed:
            self.s.meta_events.pop(i, None)
        return {'ok': True, 'removed': sorted(self.removed)}

    async def apply_work(self, wk: Work):
        item = await self.dav.get(wk.href)
        if wk.etag and item.etag and item.etag != wk.etag:
            raise Conflict(f'{wk.href} modifié ailleurs')
        if wk.delete:
            for id_, t in self.s.trash.items():
                if t.get('href') == wk.href and t.get('raw') is None:
                    t['raw'] = item.data
            await self.dav.delete(wk.href, item.etag)
            for i in wk.ids | self.removed:
                if self.s.meta_events.get(i, {}).get('href') == wk.href:
                    self.s.meta_events.pop(i, None)
            return
        cal = self.w.parse(item.data)
        for step in wk.steps:
            step(cal)
        for uid, before, after in wk.masters:
            self.patch_master(cal, uid, before, after)
        text = self.w.finish(cal)
        if wk.move_to:
            new_etag = await self.dav.put(wk.move_to, text, None)
            await self.dav.delete(wk.href, item.etag)
            href = wk.move_to
        else:
            new_etag = await self.dav.put(wk.href, text, item.etag)
            href = wk.href
        for m in self.s.meta_events.values():
            if m['href'] in (wk.href, href):
                m['href'], m['etag'] = href, new_etag

    async def tasks_href(self) -> str:
        """Le calendrier des échéances (VTODO seulement), créé à la première échéance."""
        if not self.s.tasks_href:
            href = f'{self.s.home}{self.cfg.cal_prefix}{TASKS}/'
            await self.dav.mkcalendar(href, 'Échéances', palette.to_hex('slate'), comps=('VTODO',))
            self.s.tasks_href = href
        return self.s.tasks_href

    async def apply_due(self, d):
        tw = TodoWriter(self.cfg.timezone)
        id_ = d['id']
        if d['op'] == 'create':
            after = {**d['after'], 'evUid': self.ev_uid(d['after'])}
            t = self.s.trash.get('due:' + id_)
            href = f'{await self.tasks_href()}{id_}.ics'
            raw = tw.apply(t['raw'], t['before'], after) if t else tw.new_resource(after)
            if t and t['before'] == d['after']:
                raw = t['raw']                                          # « Annuler » : la tâche revient à l'identique
            etag = await self.dav.put(href, raw, None)
            self.s.meta_dues[id_] = {'href': href, 'etag': etag}
            return
        m = self.s.meta_dues[id_]
        item = await self.dav.get(m['href'])
        if m.get('etag') and item.etag and item.etag != m['etag']:
            raise Conflict(f'{m["href"]} modifié ailleurs')
        if d['op'] == 'delete':
            self.trash('due:' + id_, {'kind': 'todo', 'raw': item.data, 'before': d['before']})
            await self.dav.delete(m['href'], item.etag)
            self.s.meta_dues.pop(id_, None)
            return
        after = {**d['after'], 'evUid': self.ev_uid(d['after'])}
        before = {**d['before'], 'evUid': self.ev_uid(d['before'])}
        etag = await self.dav.put(m['href'], tw.apply(item.data, before, after), item.etag)
        m['etag'] = etag

    def ev_uid(self, due: dict) -> str:
        """Le vrai UID de l'événement visé (RELATED-TO) : connu du serveur, ou donné par l'interface (abonnement)."""
        m = self.s.meta_events.get(due['ev'])
        return (m or {}).get('uid') or due.get('evUid') or due['ev']

    async def create_calendar(self, c):
        href = self.new_cal_href(c['id'])
        if c.get('sub'):                                                # abonnement : gardé dans Radicale, sans événements
            await self.dav.mksubscribed(href, c['name'], palette.to_hex(c['color']), c['sub'])
            self.s.meta_cals[c['id']] = {'href': href, 'ctag': None, 'colorHex': palette.to_hex(c['color']), 'writable': True,
                                         'kind': 'subscribed'}
            return
        t = self.s.trash_cals.pop(c['id'], None)
        await self.dav.mkcalendar(href, c['name'], palette.to_hex(c['color']))
        self.s.meta_cals[c['id']] = {'href': href, 'ctag': None, 'colorHex': palette.to_hex(c['color']), 'writable': True,
                                     'kind': 'calendar'}
        if t:
            for it in t['items']:
                etag = await self.dav.put(href + it['name'], it['data'], None)
                for i, m in it['meta'].items():
                    self.s.meta_events[i] = {**m, 'href': href + it['name'], 'etag': etag}

    async def delete_calendar(self, cal_id: str):
        href = self.cal_href(cal_id)
        if self.s.meta_cals[cal_id].get('kind') == 'subscribed':        # désabonnement : rien d'autre à garder
            await self.dav.delete(href, None)
            self.s.meta_cals.pop(cal_id, None)
            return
        items = await self.dav.all_items(href)
        metas = {}
        for i, m in self.s.meta_events.items():
            if m['href'].startswith(href):
                metas.setdefault(m['href'], {})[i] = m
        self.s.trash_cals[cal_id] = {
            'items': [{'name': it.href.rsplit('/', 1)[-1], 'data': it.data, 'meta': metas.get(it.href, {})} for it in items],
            'ids': {i for d in metas.values() for i in d}}
        while len(self.s.trash_cals) > 5:                          # garder les 5 dernières suppressions
            self.s.trash_cals.pop(next(iter(self.s.trash_cals)))
        await self.dav.delete(href, None)
        for i in self.s.trash_cals[cal_id]['ids']:
            self.s.meta_events.pop(i, None)
        self.s.meta_cals.pop(cal_id, None)
