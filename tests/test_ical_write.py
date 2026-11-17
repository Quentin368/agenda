"""Écriture modèle → iCalendar : aller-retour exact, fidélité (seuls les champs modifiés sont réécrits)."""
from datetime import date

import pytest

from agenda.ical_read import Reader
from agenda.ical_write import Writer
from test_ical_read import ics

TODAY = date(2026, 11, 17)
W = Writer('Europe/Paris')


def read_all(text, cal='perso'):
    res = Reader('Europe/Paris', TODAY).read_resource(text, cal, '/q/perso/x.ics', '"e"')
    return {e['id']: e for e in res.events}


def roundtrip(model):
    text = W.new_resource(model['id'], model)
    evs = read_all(text)
    return evs[model['id']], text


BASE = {'id': 'e-1', 'cal': 'perso', 'title': 'Ciné', 'start': '2026-11-18T18:00', 'end': '2026-11-18T20:30',
        'allDay': False, 'loc': '', 'desc': '', 'rem': 'none', 'rrule': {'freq': 'none'}, 'exdates': []}


@pytest.mark.parametrize('model', [
    BASE,
    {**BASE, 'loc': 'UGC, salle 3; rang B', 'desc': 'Ligne 1\nLigne 2', 'rem': '10'},
    {**BASE, 'start': '2026-12-05', 'end': '2026-12-07', 'allDay': True, 'rem': '-540'},
    {**BASE, 'start': '2026-12-05', 'end': '2026-12-06', 'allDay': True, 'rem': '360'},
    {**BASE, 'rrule': {'freq': 'weekly', 'days': [1, 4], 'until': '2027-06-30', 'interval': 2}, 'exdates': ['2026-11-19', '2026-12-17']},
    {**BASE, 'start': '2026-03-23T09:00', 'end': '2026-03-23T10:00', 'rrule': {'freq': 'weekly', 'days': [1], 'until': None}, 'exdates': ['2026-03-30']},
    {**BASE, 'start': '2026-01-15', 'end': '2026-01-16', 'allDay': True, 'rrule': {'freq': 'monthly', 'until': '2026-12-15'}, 'exdates': ['2026-04-15']},
    {**BASE, 'start': '2026-11-16T08:00', 'end': '2026-11-16T08:30', 'rrule': {'freq': 'daily', 'until': None, 'interval': 3}},
    {**BASE, 'cal': 'anniv', 'title': 'Anniversaire d’Isabelle', 'start': '2020-11-18', 'end': '2020-11-19', 'allDay': True,
     'rrule': {'freq': 'yearly', 'until': None}, 'person': 'Isabelle, la « tante »', 'born': 1962, 'fav': True, 'group': 'Famille',
     'gifts': [{'t': 'Plaid; laine, rouge'}, {'t': 'Livre', 'y': 2025}], 'rem': '1440'},
    {**BASE, 'openEnd': True, 'end': '2026-11-18T19:00'},
])
def test_aller_retour_exact(model):
    model = W.first_occurrence(model)
    back, text = roundtrip(model)
    if model['cal'] == 'anniv':
        back['cal'] = 'anniv'
    assert back == model
    assert 'BEGIN:VTIMEZONE' in text or model['allDay']


def test_journee_sans_vtimezone_et_heure_avec_tzid():
    _, t1 = roundtrip({**BASE, 'start': '2026-12-05', 'end': '2026-12-06', 'allDay': True})
    assert 'DTSTART;VALUE=DATE:20261205' in t1 and 'VTIMEZONE' not in t1
    _, t2 = roundtrip(BASE)
    assert 'DTSTART;TZID=Europe/Paris:20261118T180000' in t2 and t2.count('BEGIN:VTIMEZONE') == 1


def test_until_en_utc_pour_une_serie_avec_fuseau():
    _, t = roundtrip({**BASE, 'rrule': {'freq': 'weekly', 'days': [3], 'until': '2027-06-30'}})
    assert 'UNTIL=20270630T160000Z' in t           # 18:00 à Paris en été = 16:00 UTC


RICH = ics("""
    BEGIN:VEVENT
    UID:rich
    DTSTAMP:20261101T100000Z
    SEQUENCE:3
    DTSTART:20261118T170000Z
    DTEND:20261118T190000Z
    SUMMARY:Réunion
    LOCATION:Salle 1
    ORGANIZER;CN=Chef:mailto:chef@example.org
    ATTENDEE;CN=Moi;PARTSTAT=ACCEPTED:mailto:moi@example.org
    CATEGORIES:Travail,Important
    X-MOZ-GENERATION:4
    X-INCONNU;PARAM=valeur:quelque chose
    BEGIN:VALARM
    ACTION:DISPLAY
    DESCRIPTION:dans 10 min
    TRIGGER:-PT10M
    END:VALARM
    BEGIN:VALARM
    ACTION:AUDIO
    TRIGGER;VALUE=DATE-TIME:20261118T080000Z
    END:VALARM
    END:VEVENT""")


def patched(raw, uid, changes):
    cal = W.parse(raw)
    before = read_all(raw)[uid]
    after = {**before, **changes}
    W.patch(W.master(cal, uid), before, after)
    text = W.finish(cal)
    return text, read_all(text)[uid], after


def test_modifier_le_titre_ne_touche_a_rien_d_autre():
    text, back, after = patched(RICH, 'rich', {'title': 'Réunion d’équipe'})
    assert back == after
    for keep in ('ORGANIZER;CN=Chef:mailto:chef@example.org', 'ATTENDEE;CN=Moi;PARTSTAT=ACCEPTED:mailto:moi@example.org',
                 'CATEGORIES:Travail,Important', 'X-MOZ-GENERATION:4', 'X-INCONNU;PARAM=valeur:quelque chose',
                 'TRIGGER:-PT10M', 'TRIGGER;VALUE=DATE-TIME:20261118T080000Z', 'DTSTART:20261118T170000Z',
                 'LOCATION:Salle 1', 'SEQUENCE:3'):
        assert keep in text, keep
    assert 'SUMMARY:Réunion d’équipe' in text and 'DTSTAMP:20261101T100000Z' not in text


def test_deplacer_garde_la_forme_utc_et_incremente_sequence():
    text, back, after = patched(RICH, 'rich', {'start': '2026-11-19T09:00', 'end': '2026-11-19T10:30'})
    assert back == after
    assert 'DTSTART:20261119T080000Z' in text and 'DTEND:20261119T093000Z' in text and 'SEQUENCE:4' in text


def test_changer_le_rappel_garde_les_autres_alarmes():
    text, back, after = patched(RICH, 'rich', {'rem': '60'})
    assert back['rem'] == '60' and 'TRIGGER:-PT1H' in text and 'TRIGGER:-PT10M' not in text
    assert 'TRIGGER;VALUE=DATE-TIME:20261118T080000Z' in text
    text, back, _ = patched(RICH, 'rich', {'rem': 'none'})
    assert back['rem'] == 'none' and text.count('BEGIN:VALARM') == 1


def test_vider_le_lieu_retire_la_propriete():
    text, back, _ = patched(RICH, 'rich', {'loc': ''})
    assert 'LOCATION' not in text and back['loc'] == ''


SERIE = ics("""
    BEGIN:VEVENT
    UID:s
    DTSTART;TZID=Europe/Paris:20261116T090000
    DTEND;TZID=Europe/Paris:20261116T100000
    RRULE:FREQ=WEEKLY;COUNT=10
    EXDATE;TZID=Europe/Paris:20261123T090000
    SUMMARY:Cours
    END:VEVENT""", """
    BEGIN:VEVENT
    UID:s
    RECURRENCE-ID;TZID=Europe/Paris:20261130T090000
    DTSTART;TZID=Europe/Paris:20261201T140000
    DTEND;TZID=Europe/Paris:20261201T150000
    SUMMARY:Cours (déplacé)
    END:VEVENT""")


def test_exdate_ajoutee_sans_toucher_count_ni_l_occurrence_modifiee():
    cal = W.parse(SERIE)
    evs = read_all(SERIE)
    before = evs['s']
    after = {**before, 'exdates': sorted(before['exdates'] + ['2026-12-07'])}
    W.patch(W.master(cal, 's'), before, after, exdates_skip=W.overrides_days(cal, 's'))
    text = W.finish(cal)
    assert 'COUNT=10' in text
    assert 'EXDATE;TZID=Europe/Paris:20261123T090000,20261207T090000' in text      # pas le 30 (occurrence modifiée)
    assert read_all(text) == {'s': after, 's~r20261130T0900': evs['s~r20261130T0900']}


def test_cette_occurrence_seulement_devient_recurrence_id():
    cal = W.parse(SERIE)
    evs = read_all(SERIE)
    occ = {**W.occurrence_model(evs['s'], '2026-12-14'), 'title': 'Cours en amphi', 'start': '2026-12-14T10:00', 'end': '2026-12-14T11:00'}
    W.add_override(cal, 's', '2026-12-14', evs['s'], occ)
    text = W.finish(cal)
    back = read_all(text)
    assert 'RECURRENCE-ID;TZID=Europe/Paris:20261214T090000' in text
    o = back['s~r20261214T0900']
    assert (o['title'], o['start'], o['end']) == ('Cours en amphi', '2026-12-14T10:00', '2026-12-14T11:00')
    assert '2026-12-14' in back['s']['exdates']


def test_supprimer_une_occurrence_modifiee_ajoute_une_exdate():
    cal = W.parse(SERIE)
    assert W.remove_override(cal, 's', '2026-11-30')
    W.add_exdate(cal, 's', '2026-11-30')
    back = read_all(W.finish(cal))
    assert set(back) == {'s'} and back['s']['exdates'] == ['2026-11-23', '2026-11-30']


def test_serie_entiere_deplacee_les_occurrences_modifiees_suivent():
    cal = W.parse(SERIE)
    evs = read_all(SERIE)
    before = evs['s']
    after = {**before, 'start': '2026-11-17T09:00', 'end': '2026-11-17T10:00', 'exdates': ['2026-11-24', '2026-12-01'],
             'rrule': {**before['rrule'], 'days': [2]}}
    W.shift_overrides(cal, 's', before, after)
    W.patch(W.master(cal, 's'), before, after, exdates_skip=W.overrides_days(cal, 's'))
    text = W.finish(cal)
    assert 'RECURRENCE-ID;TZID=Europe/Paris:20261201T090000' in text
    assert 'EXDATE;TZID=Europe/Paris:20261124T090000' in text
    back = read_all(text)
    assert back['s']['start'] == '2026-11-17T09:00' and back['s']['exdates'] == ['2026-11-24', '2026-12-01']


def test_serie_redevient_simple():
    cal = W.parse(SERIE)
    before = read_all(SERIE)['s']
    after = {**before, 'rrule': {'freq': 'none'}, 'exdates': []}
    W.patch(W.master(cal, 's'), before, after)
    text = W.finish(cal)
    assert 'RRULE' not in W.master(W.parse(text), 's').to_ical().decode() and 'EXDATE' not in text


def test_journee_vers_heure_utilise_paris():
    raw = ics("""
        BEGIN:VEVENT
        UID:j
        DTSTART;VALUE=DATE:20261205
        DTEND;VALUE=DATE:20261206
        END:VEVENT""", tz=False)
    text, back, after = patched(raw, 'j', {'allDay': False, 'start': '2026-12-05T14:00', 'end': '2026-12-05T15:00'})
    assert back == after and 'DTSTART;TZID=Europe/Paris:20261205T140000' in text and text.count('BEGIN:VTIMEZONE') == 1


def test_heure_flottante_reste_flottante():
    raw = ics("""
        BEGIN:VEVENT
        UID:f
        DTSTART:20261118T093000
        DTEND:20261118T100000
        END:VEVENT""", tz=False)
    text, back, after = patched(raw, 'f', {'start': '2026-11-18T11:00', 'end': '2026-11-18T12:00'})
    assert back == after and 'DTSTART:20261118T110000' in text and 'VTIMEZONE' not in text


def test_duree_gardee_comme_duree():
    raw = ics("""
        BEGIN:VEVENT
        UID:d
        DTSTART;TZID=Europe/Paris:20261118T090000
        DURATION:PT1H
        END:VEVENT""")
    text, back, after = patched(raw, 'd', {'end': '2026-11-18T10:30'})
    assert back == after and 'DURATION:PT1H30M' in text and 'DTEND' not in text


def test_serie_commencant_hors_de_ses_jours():
    m = {**BASE, 'rrule': {'freq': 'weekly', 'days': [1, 4], 'until': None}}          # le 18/11/2026 est un mercredi
    n = W.first_occurrence(m)
    assert (n['start'], n['end']) == ('2026-11-19T18:00', '2026-11-19T20:30')
    m2 = {**m, 'rrule': {'freq': 'weekly', 'days': [1], 'until': None, 'interval': 2}}
    assert W.first_occurrence(m2)['start'] == '2026-11-30T18:00'                       # semaine suivante sautée
    assert W.first_occurrence(BASE) is BASE
