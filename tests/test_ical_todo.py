"""Échéances ⇄ VTODO, et import .ics fidèle."""
from datetime import date

from agenda.ical_read import Reader
from agenda.ical_todo import TodoWriter, read_todo
from agenda.ical_write import Writer

TW = TodoWriter('Europe/Paris')
DUE = {'id': 'k-01', 't': 'Dossier marketing', 'ev': 'cours-1', 'occ': '2026-11-24', 'title': 'TD Anglais',
       'start': '2026-11-24T13:30', 'allDay': False, 'cal': 'cours'}


def test_aller_retour_echeance():
    text = TW.new_resource({**DUE, 'evUid': 'cours-1@fac.example'})
    assert read_todo(text) == DUE
    assert 'RELATED-TO:cours-1@fac.example' in text and 'DUE;TZID=Europe/Paris:20261124T133000' in text
    assert 'STATUS:NEEDS-ACTION' in text


def test_echeance_journee_et_faite():
    d = {**DUE, 'start': '2026-12-14', 'allDay': True, 'done': '2026-12-10'}
    text = TW.new_resource(d)
    assert read_todo(text) == d
    assert 'STATUS:COMPLETED' in text and 'PERCENT-COMPLETE:100' in text and 'DUE;VALUE=DATE:20261214' in text


def test_rouvrir_retire_completed_et_garde_le_reste():
    text = TW.new_resource({**DUE, 'done': '2026-11-20'}).replace('END:VTODO', 'X-TELEPHONE:garde\r\nPRIORITY:1\r\nEND:VTODO')
    out = TW.apply(text, {**DUE, 'done': '2026-11-20'}, DUE)
    assert 'COMPLETED:' not in out and 'PERCENT-COMPLETE' not in out and 'STATUS:NEEDS-ACTION' in out
    assert 'X-TELEPHONE:garde' in out and 'PRIORITY:1' in out
    assert read_todo(out) == DUE


def test_tache_cochee_sur_le_telephone():
    text = TW.new_resource(DUE).replace('STATUS:NEEDS-ACTION', 'STATUS:COMPLETED\r\nCOMPLETED:20261121T183000Z')
    assert read_todo(text)['done'] == '2026-11-21'


def test_tache_ordinaire_ignoree_et_lien_par_related_to():
    plain = 'BEGIN:VCALENDAR\r\nVERSION:2.0\r\nBEGIN:VTODO\r\nUID:t\r\nSUMMARY:Courses\r\nEND:VTODO\r\nEND:VCALENDAR\r\n'
    assert read_todo(plain) is None
    rel = ('BEGIN:VCALENDAR\r\nVERSION:2.0\r\nBEGIN:VTODO\r\nUID:t2\r\nSUMMARY:Rendre\r\nRELATED-TO:abc@x\r\n'
           'DUE;VALUE=DATE:20261201\r\nEND:VTODO\r\nEND:VCALENDAR\r\n')
    assert read_todo(rel, uid_to_id={'abc@x': 'h123'})['ev'] == 'h123'


FICHIER_VEVENT = '''BEGIN:VEVENT
UID:billet-42@billetterie.example
DTSTAMP:20261101T100000Z
DTSTART;TZID=America/New_York:20261205T200000
DTEND;TZID=America/New_York:20261205T230000
SUMMARY:Concert
ORGANIZER;CN=Billetterie:mailto:contact@billetterie.example
URL:https://billetterie.example/42
X-BILLET-PLACE:Fosse
BEGIN:VALARM
ACTION:DISPLAY
TRIGGER;VALUE=DATE-TIME:20261205T120000Z
END:VALARM
END:VEVENT'''.replace('\n', '\r\n')
FICHIER_TZ = '''BEGIN:VTIMEZONE
TZID:America/New_York
BEGIN:STANDARD
DTSTART:19701101T020000
RRULE:FREQ=YEARLY;BYMONTH=11;BYDAY=1SU
TZOFFSETFROM:-0400
TZOFFSETTO:-0500
END:STANDARD
BEGIN:DAYLIGHT
DTSTART:19700308T020000
RRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=2SU
TZOFFSETFROM:-0500
TZOFFSETTO:-0400
END:DAYLIGHT
END:VTIMEZONE'''.replace('\n', '\r\n')


def test_import_garde_tout_le_contenu():
    model = {'id': 'e-imp1', 'cal': 'perso', 'title': 'Concert', 'start': '2026-12-06T02:00', 'end': '2026-12-06T05:00',
             'allDay': False, 'loc': '', 'desc': '', 'rem': '60', 'rrule': {'freq': 'none'}, 'exdates': [],
             'icsUid': 'billet-42@billetterie.example'}
    text = Writer().import_resource('e-imp1', {'vevent': FICHIER_VEVENT, 'vtimezones': [FICHIER_TZ]}, model)
    for keep in ('ORGANIZER;CN=Billetterie:mailto:contact@billetterie.example', 'URL:https://billetterie.example/42',
                 'X-BILLET-PLACE:Fosse', 'TRIGGER;VALUE=DATE-TIME:20261205T120000Z',
                 'DTSTART;TZID=America/New_York:20261205T200000', 'TZID:America/New_York',
                 'X-AGENDA-ICSUID:billet-42@billetterie.example', 'UID:e-imp1'):
        assert keep in text, keep
    assert 'TRIGGER:-PT1H' in text                       # le rappel choisi dans l'agenda est ajouté
    back = Reader('Europe/Paris', date(2026, 11, 17)).read_resource(text, 'perso', '/x', None).events
    assert back == [model]
