"""Lecture iCalendar → modèle JSON de la maquette."""
from datetime import date
from textwrap import dedent

import pytest

from agenda.ical_read import REP_NOTE, Reader, calendar_id, safe_id
from agenda.palette import nearest
from agenda.recurrence import expand_like_mockup
from zoneinfo import ZoneInfo

TODAY = date(2026, 11, 17)
VTZ = dedent("""\
    BEGIN:VTIMEZONE
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
    """)


def ics(*vevents: str, tz: bool = True) -> str:
    body = ''.join(dedent(v).strip() + '\n' for v in vevents)
    return 'BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//test//FR\n' + (VTZ if tz else '') + body + 'END:VCALENDAR\n'


def read(text: str, cal='perso'):
    res = Reader('Europe/Paris', TODAY).read_resource(text.replace('\n', '\r\n'), cal, '/quentin/perso/x.ics', '"etag1"')
    return res.events, res.meta


def one(text: str, cal='perso'):
    evs, meta = read(text, cal)
    assert len(evs) == 1, evs
    return evs[0], meta[evs[0]['id']]


# ---------------- événements simples
def test_evenement_avec_fuseau():
    ev, meta = one(ics("""
        BEGIN:VEVENT
        UID:a1
        DTSTART;TZID=Europe/Paris:20261118T180000
        DTEND;TZID=Europe/Paris:20261118T203000
        SUMMARY:Ciné
        LOCATION:UGC
        DESCRIPTION:Ligne 1\\nLigne 2
        END:VEVENT"""))
    assert ev == {'id': 'a1', 'cal': 'perso', 'title': 'Ciné', 'start': '2026-11-18T18:00', 'end': '2026-11-18T20:30',
                  'allDay': False, 'loc': 'UGC', 'desc': 'Ligne 1\nLigne 2', 'rem': 'none', 'rrule': {'freq': 'none'}, 'exdates': []}
    assert meta == {'cal': 'perso', 'href': '/quentin/perso/x.ics', 'etag': '"etag1"', 'uid': 'a1', 'kind': 'single'}


def test_heure_utc_convertie_en_heure_de_paris_hiver_et_ete():
    evs, _ = read(ics("""
        BEGIN:VEVENT
        UID:hiver
        DTSTART:20261114T190000Z
        DTEND:20261115T010000Z
        END:VEVENT""", """
        BEGIN:VEVENT
        UID:ete
        DTSTART:20260714T190000Z
        DTEND:20260714T200000Z
        END:VEVENT"""))
    by = {e['id']: e for e in evs}
    assert (by['hiver']['start'], by['hiver']['end']) == ('2026-11-14T20:00', '2026-11-15T02:00')
    assert (by['ete']['start'], by['ete']['end']) == ('2026-07-14T21:00', '2026-07-14T22:00')
    assert by['hiver']['title'] == 'Sans titre'


def test_heure_flottante_gardee_telle_quelle():
    ev, _ = one(ics("""
        BEGIN:VEVENT
        UID:f
        DTSTART:20261118T093000
        DTEND:20261118T100000
        END:VEVENT"""))
    assert (ev['start'], ev['end']) == ('2026-11-18T09:30', '2026-11-18T10:00')


def test_autre_fuseau_converti():
    ev, _ = one(ics("""
        BEGIN:VEVENT
        UID:ny
        DTSTART;TZID=America/New_York:20261118T090000
        DTEND;TZID=America/New_York:20261118T100000
        END:VEVENT"""))
    assert (ev['start'], ev['end']) == ('2026-11-18T15:00', '2026-11-18T16:00')


def test_journee_entiere_et_plusieurs_jours():
    ev, _ = one(ics("""
        BEGIN:VEVENT
        UID:j
        DTSTART;VALUE=DATE:20261205
        DTEND;VALUE=DATE:20261207
        SUMMARY:Lyon
        END:VEVENT"""))
    assert (ev['start'], ev['end'], ev['allDay']) == ('2026-12-05', '2026-12-07', True)


def test_journee_sans_fin_dure_un_jour():
    ev, _ = one(ics("""
        BEGIN:VEVENT
        UID:j
        DTSTART;VALUE=DATE:20261205
        END:VEVENT"""))
    assert (ev['start'], ev['end']) == ('2026-12-05', '2026-12-06')


def test_duree_au_lieu_de_fin():
    ev, _ = one(ics("""
        BEGIN:VEVENT
        UID:d
        DTSTART;TZID=Europe/Paris:20261118T090000
        DURATION:PT1H30M
        END:VEVENT"""))
    assert ev['end'] == '2026-11-18T10:30' and 'openEnd' not in ev


def test_duree_traversant_le_changement_d_heure():
    # 25 octobre 2026 : 3 h → 2 h. Deux heures « réelles » à partir de 1 h du matin finissent à 2 h (heure d'hiver).
    ev, _ = one(ics("""
        BEGIN:VEVENT
        UID:dst
        DTSTART;TZID=Europe/Paris:20261025T010000
        DURATION:PT2H
        END:VEVENT"""))
    assert ev['end'] == '2026-10-25T02:00'


def test_sans_fin_heure_inconnue():
    ev, _ = one(ics("""
        BEGIN:VEVENT
        UID:o
        DTSTART;TZID=Europe/Paris:20261118T090000
        END:VEVENT"""))
    assert ev['openEnd'] is True and ev['end'] == '2026-11-18T10:00'


def test_evenement_annule_ignore():
    evs, _ = read(ics("""
        BEGIN:VEVENT
        UID:c
        STATUS:CANCELLED
        DTSTART;TZID=Europe/Paris:20261118T090000
        END:VEVENT"""))
    assert evs == []


# ---------------- rappels
@pytest.mark.parametrize('trigger,expected', [
    ('-PT10M', '10'), ('-P1D', '1440'), ('-PT1H', '60'), ('PT0S', '0'),
    ('PT9H', '-540'),            # journée : le jour même à 9 h
    ('-PT6H', '360'),            # journée : la veille à 18 h
])
def test_rappel_relatif(trigger, expected):
    ev, _ = one(ics(f"""
        BEGIN:VEVENT
        UID:r
        DTSTART;VALUE=DATE:20261118
        BEGIN:VALARM
        ACTION:DISPLAY
        DESCRIPTION:Rappel
        TRIGGER:{trigger}
        END:VALARM
        END:VEVENT"""))
    assert ev['rem'] == expected


def test_rappel_absolu_ou_relatif_a_la_fin_non_repris():
    ev, _ = one(ics("""
        BEGIN:VEVENT
        UID:r
        DTSTART;TZID=Europe/Paris:20261118T090000
        BEGIN:VALARM
        ACTION:DISPLAY
        TRIGGER;VALUE=DATE-TIME:20261117T080000Z
        END:VALARM
        BEGIN:VALARM
        ACTION:DISPLAY
        TRIGGER;RELATED=END:-PT5M
        END:VALARM
        END:VEVENT"""))
    assert ev['rem'] == 'none'


# ---------------- propriétés X-AGENDA-*
def test_proprietes_anniversaire():
    ev, _ = one(ics("""
        BEGIN:VEVENT
        UID:b
        DTSTART;VALUE=DATE:20201118
        DTEND;VALUE=DATE:20201119
        RRULE:FREQ=YEARLY
        SUMMARY:Anniversaire d’Isabelle
        X-AGENDA-PERSON:Isabelle Moreau
        X-AGENDA-BORN:1962
        X-AGENDA-FAV:TRUE
        X-AGENDA-GROUP:Famille
        X-AGENDA-GIFTS:[{"t":"Plaid en laine"}\\,{"t":"Livre"\\,"y":2025}]
        END:VEVENT"""), cal='anniv')
    assert ev['person'] == 'Isabelle Moreau' and ev['born'] == 1962 and ev['fav'] is True and ev['group'] == 'Famille'
    assert ev['gifts'] == [{'t': 'Plaid en laine'}, {'t': 'Livre', 'y': 2025}]
    assert ev['rrule'] == {'freq': 'yearly', 'until': None}


def test_x_agenda_invalides_ignores():
    ev, _ = one(ics("""
        BEGIN:VEVENT
        UID:b
        DTSTART;VALUE=DATE:20201118
        X-AGENDA-BORN:inconnu
        X-AGENDA-GIFTS:pas du json
        X-AGENDA-FAV:FALSE
        END:VEVENT"""))
    assert not {'born', 'gifts', 'fav'} & set(ev)


def test_fin_inconnue_x_agenda():
    ev, _ = one(ics("""
        BEGIN:VEVENT
        UID:o
        DTSTART;TZID=Europe/Paris:20261118T090000
        DTEND;TZID=Europe/Paris:20261118T100000
        X-AGENDA-OPENEND:TRUE
        END:VEVENT"""))
    assert ev['openEnd'] is True


# ---------------- répétitions représentables
def test_hebdo_jusqu_a_utc_et_exdates():
    ev, meta = one(ics("""
        BEGIN:VEVENT
        UID:maths
        DTSTART;TZID=Europe/Paris:20260907T090000
        DTEND;TZID=Europe/Paris:20260907T110000
        RRULE:FREQ=WEEKLY;BYDAY=MO;UNTIL=20270630T220000Z
        EXDATE;TZID=Europe/Paris:20261026T090000,20261102T090000
        EXDATE:20261228T080000Z
        END:VEVENT"""))
    assert ev['rrule'] == {'freq': 'weekly', 'days': [1], 'until': '2027-06-30'}
    assert ev['exdates'] == ['2026-10-26', '2026-11-02', '2026-12-28']
    assert meta['kind'] == 'series'


def test_until_avant_l_heure_du_jour_exclut_ce_jour():
    ev, _ = one(ics("""
        BEGIN:VEVENT
        UID:u
        DTSTART;TZID=Europe/Paris:20260907T180000
        DTEND;TZID=Europe/Paris:20260907T190000
        RRULE:FREQ=DAILY;UNTIL=20260910T100000Z
        END:VEVENT"""))
    assert ev['rrule']['until'] == '2026-09-09'


def test_plusieurs_jours_intervalle_et_count():
    ev, _ = one(ics("""
        BEGIN:VEVENT
        UID:w
        DTSTART;TZID=Europe/Paris:20261116T180000
        DTEND;TZID=Europe/Paris:20261116T190000
        RRULE:FREQ=WEEKLY;INTERVAL=2;BYDAY=MO,TH;COUNT=4
        END:VEVENT"""))
    # lun. 16, jeu. 19, (semaine sautée), lun. 30 nov., jeu. 3 déc.
    assert ev['rrule'] == {'freq': 'weekly', 'days': [1, 4], 'until': '2026-12-03', 'interval': 2}


def test_quotidien_jours_ouvres_devient_hebdo():
    ev, _ = one(ics("""
        BEGIN:VEVENT
        UID:w
        DTSTART;TZID=Europe/Paris:20261116T080000
        DTEND;TZID=Europe/Paris:20261116T083000
        RRULE:FREQ=DAILY;BYDAY=MO,TU,WE,TH,FR
        END:VEVENT"""))
    assert ev['rrule'] == {'freq': 'weekly', 'days': [1, 2, 3, 4, 5], 'until': None}


def test_mensuel_le_15_et_annuel_simple():
    evs, _ = read(ics("""
        BEGIN:VEVENT
        UID:m
        DTSTART;VALUE=DATE:20260115
        RRULE:FREQ=MONTHLY
        END:VEVENT""", """
        BEGIN:VEVENT
        UID:y
        DTSTART;VALUE=DATE:20200314
        RRULE:FREQ=YEARLY;BYMONTH=3;BYMONTHDAY=14
        END:VEVENT"""))
    by = {e['id']: e for e in evs}
    assert by['m']['rrule'] == {'freq': 'monthly', 'until': None}
    assert by['y']['rrule'] == {'freq': 'yearly', 'until': None}


def test_serie_avec_fuseau_traverse_le_changement_d_heure():
    ev, meta = one(ics("""
        BEGIN:VEVENT
        UID:tz
        DTSTART;TZID=Europe/Paris:20261019T090000
        DTEND;TZID=Europe/Paris:20261019T100000
        RRULE:FREQ=WEEKLY
        END:VEVENT"""))
    assert ev['rrule']['freq'] == 'weekly' and meta['kind'] == 'series'


# ---------------- répétitions que la maquette afficherait faux → occurrences calculées
def _occ(evs):
    assert all(e['rrule'] == {'freq': 'none'} and e['repNote'] == REP_NOTE for e in evs)
    return [e['start'] for e in evs]


def test_deuxieme_mardi_du_mois_occurrences_calculees():
    evs, meta = read(ics("""
        BEGIN:VEVENT
        UID:2tu
        DTSTART;TZID=Europe/Paris:20261110T190000
        DTEND;TZID=Europe/Paris:20261110T200000
        RRULE:FREQ=MONTHLY;BYDAY=2TU;COUNT=3
        END:VEVENT"""))
    assert _occ(evs) == ['2026-11-10T19:00', '2026-12-08T19:00', '2027-01-12T19:00']
    assert {m['kind'] for m in meta.values()} == {'occurrence'}
    assert len({m['series'] for m in meta.values()}) == 1
    assert len({e['id'] for e in evs}) == 3


def test_le_31_du_mois_n_est_pas_ramene_au_30():
    evs, _ = read(ics("""
        BEGIN:VEVENT
        UID:31
        DTSTART;VALUE=DATE:20261031
        RRULE:FREQ=MONTHLY;COUNT=3
        END:VEVENT"""))
    assert _occ(evs) == ['2026-10-31', '2026-12-31', '2027-01-31']


def test_serie_en_utc_qui_glisse_au_changement_d_heure():
    # 19:00 UTC chaque semaine = 20:00 l'hiver, 21:00 l'été : la maquette garderait 20:00
    evs, _ = read(ics("""
        BEGIN:VEVENT
        UID:utc
        DTSTART:20270318T190000Z
        DTEND:20270318T200000Z
        RRULE:FREQ=WEEKLY;COUNT=3
        END:VEVENT"""))
    assert _occ(evs) == ['2027-03-18T20:00', '2027-03-25T20:00', '2027-04-01T21:00']


def test_serie_en_utc_sans_changement_d_heure_reste_une_serie():
    ev, _ = one(ics("""
        BEGIN:VEVENT
        UID:utc2
        DTSTART:20261116T190000Z
        DTEND:20261116T200000Z
        RRULE:FREQ=WEEKLY;COUNT=4
        END:VEVENT"""))
    assert ev['rrule'] == {'freq': 'weekly', 'days': [1], 'until': '2026-12-07'}


def test_rdate_et_bysetpos_calcules():
    evs, _ = read(ics("""
        BEGIN:VEVENT
        UID:rd
        DTSTART;TZID=Europe/Paris:20261118T090000
        DTEND;TZID=Europe/Paris:20261118T100000
        RDATE;TZID=Europe/Paris:20261125T090000
        END:VEVENT"""))
    assert _occ(evs) == ['2026-11-18T09:00', '2026-11-25T09:00']


# ---------------- occurrences modifiées (RECURRENCE-ID)
def test_occurrence_modifiee_liee_a_sa_serie():
    evs, meta = read(ics("""
        BEGIN:VEVENT
        UID:s
        DTSTART;TZID=Europe/Paris:20261116T090000
        DTEND;TZID=Europe/Paris:20261116T100000
        RRULE:FREQ=WEEKLY
        SUMMARY:Cours
        END:VEVENT""", """
        BEGIN:VEVENT
        UID:s
        RECURRENCE-ID;TZID=Europe/Paris:20261123T090000
        DTSTART;TZID=Europe/Paris:20261124T140000
        DTEND;TZID=Europe/Paris:20261124T150000
        SUMMARY:Cours (déplacé)
        END:VEVENT""", """
        BEGIN:VEVENT
        UID:s
        RECURRENCE-ID;TZID=Europe/Paris:20261130T090000
        DTSTART;TZID=Europe/Paris:20261130T090000
        STATUS:CANCELLED
        END:VEVENT"""))
    by = {e['id']: e for e in evs}
    assert set(by) == {'s', 's~r20261123T0900'}
    assert by['s']['exdates'] == ['2026-11-23', '2026-11-30']
    o = by['s~r20261123T0900']
    assert (o['title'], o['start'], o['rrule']) == ('Cours (déplacé)', '2026-11-24T14:00', {'freq': 'none'})
    assert meta[o['id']] == {'cal': 'perso', 'href': '/quentin/perso/x.ics', 'etag': '"etag1"', 'uid': 's',
                             'kind': 'override', 'series': 's', 'rid': '20261123T090000'}


def test_occurrence_orpheline_affichee_seule():
    ev, meta = one(ics("""
        BEGIN:VEVENT
        UID:inv
        RECURRENCE-ID:20261123T080000Z
        DTSTART:20261123T080000Z
        DTEND:20261123T090000Z
        SUMMARY:Réunion
        END:VEVENT"""))
    assert ev['start'] == '2026-11-23T09:00' and meta['kind'] == 'override' and meta['series'] is None


# ---------------- identifiants
def test_uid_avec_arobase_remplace_par_empreinte_stable():
    a = safe_id('abc@google.com')
    assert a == safe_id('abc@google.com') and a.startswith('h') and '@' not in a
    assert safe_id('71893be7-e07f-4f7c-8e4c-403f410bf2c8') == '71893be7-e07f-4f7c-8e4c-403f410bf2c8'
    ev, meta = one(ics("""
        BEGIN:VEVENT
        UID:abc@google.com
        DTSTART;VALUE=DATE:20261118
        END:VEVENT"""))
    assert ev['id'] == a and meta['uid'] == 'abc@google.com'


def test_meme_uid_dans_deux_calendriers_ids_distincts():
    r = Reader('Europe/Paris', TODAY)
    t = ics("""
        BEGIN:VEVENT
        UID:same
        DTSTART;VALUE=DATE:20261118
        END:VEVENT""")
    a = r.read_resource(t, 'perso', '/a.ics', None).events[0]['id']
    b = r.read_resource(t, 'cours', '/b.ics', None).events[0]['id']
    assert a == 'same' and b == 'same-cours'


def test_calendrier_anniversaires():
    assert calendar_id('anniversaires') == 'anniv' and calendar_id('perso') == 'perso'


# ---------------- couleurs
@pytest.mark.parametrize('hex_,name', [('#ec4899', 'pink'), ('#22c55e', 'green'), ('#3b82f6', 'blue'),
                                       ('#3a62d6', 'blue'), ('#3B82F6FF', 'blue'), ('#64748b', 'slate'), (None, 'slate')])
def test_couleur_la_plus_proche(hex_, name):
    assert nearest(hex_) == name


# ---------------- le calcul des répétitions de la maquette, reproduit
def test_expansion_maquette_mois_court_et_29_fevrier():
    tz = ZoneInfo('Europe/Paris')
    m = {'start': '2026-01-31', 'end': '2026-02-01', 'allDay': True, 'rrule': {'freq': 'monthly'}, 'exdates': []}
    assert [s for s, _ in expand_like_mockup(m, date(2026, 5, 1), tz)] == ['2026-01-31', '2026-02-28', '2026-03-31', '2026-04-30']
    y = {'start': '2024-02-29', 'end': '2024-03-01', 'allDay': True, 'rrule': {'freq': 'yearly'}, 'exdates': ['2026-02-28']}
    assert [s for s, _ in expand_like_mockup(y, date(2028, 3, 1), tz)] == ['2024-02-29', '2025-02-28', '2027-02-28', '2028-02-29']
