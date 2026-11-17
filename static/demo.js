/* ===================== Données de démonstration =====================
   Extraites telles quelles de la maquette (phase 1). Ce fichier disparaîtra en phase 2,
   quand les vraies données viendront de Radicale. loadDemo() est appelée par app.js
   juste après la définition des échéances : S, norm, getEv, uid… existent déjà. */
function loadDemo() {
  const LY = new Date(TODAY.getFullYear() - 1, TODAY.getMonth(), TODAY.getDate()); // « il y a un an jour pour jour » pour la démo des Souvenirs
  const Y2 = new Date(TODAY.getFullYear() - 2, TODAY.getMonth(), TODAY.getDate()), Y3 = new Date(TODAY.getFullYear() - 3, TODAY.getMonth(), TODAY.getDate());
  /* Semestre : du lundi 7 septembre au vendredi 11 décembre, sans cours pendant les vacances de la Toussaint ni le 11 novembre */
  const SEM_START = new Date(2026, 8, 7), SEM_END = '2026-12-11';
  const SEM_OFF = ['2026-10-26', '2026-10-27', '2026-10-28', '2026-10-29', '2026-10-30', '2026-11-11'];
  const weekly = (id, cal, title, dow, from, to, loc = '', extra = {}) => {
    const d = key(addDays(SEM_START, dow - 1));
    return { id, cal, title, start: `${d}T${from}`, end: `${d}T${to}`, loc, rrule: { freq: 'weekly', days: [dow], until: null }, ...extra };
  };
  const course = (id, title, dow, from, to, loc) => weekly(id, 'cours', title, dow, from, to, loc, { rrule: { freq: 'weekly', days: [dow], until: SEM_END }, exdates: SEM_OFF.slice() });
  const NEXT_TUE = addDays(TODAY, (9 - isoDow(TODAY)) % 7 || 7);   // pour la démo : mardi prochain
  Object.assign(S, {
    calendars: [
      { id: 'perso', name: 'Perso', color: 'blue', visible: true },
      { id: 'anniv', name: 'Anniversaires', color: 'pink', visible: true },
      { id: 'cours', name: 'Cours', color: 'green', visible: true },
      { id: 'sport', name: 'Sport', color: 'orange', visible: true },
      { id: 'job', name: 'Job', color: 'violet', visible: true }
    ],
    events: [
      /* Trois cours chaque semaine, le reste est ponctuel */
      course('c1', 'CM Algorithmique', 1, '08:30', '10:30', 'Amphi B'),
      course('e2', 'TD Anglais', 2, '13:30', '15:30', 'Salle A03'),
      course('c10', 'TP Développement web', 4, '14:00', '17:00', 'Salle info 2'),
      { id: 'c20', cal: 'cours', title: 'RDV tuteur de stage', start: '2026-11-13T11:00', end: '2026-11-13T11:30', loc: 'Bureau 214' },
      { id: 'c21', cal: 'cours', title: 'Réunion projet', start: '2026-11-16T13:00', end: '2026-11-16T14:00', loc: 'Salle C01' },
      { id: 'c22', cal: 'cours', title: 'Exposé réseaux', start: '2026-11-17T10:00', end: '2026-11-17T11:30', loc: 'Salle info 3' },
      { id: 'c23', cal: 'cours', title: 'Partiel blanc de stats', start: '2026-11-20T09:00', end: '2026-11-20T11:00', loc: 'Amphi A' },
      { id: 'c24', cal: 'cours', title: 'Conférence IA', start: '2026-11-25T18:00', end: '2026-11-25T19:30', loc: 'Amphi C' },
      { id: 'c14', cal: 'cours', title: 'Partiels', allDay: true, start: '2026-12-14', end: '2026-12-19', desc: 'Planning détaillé sur l’ENT.' },
      { id: 'c15', cal: 'cours', title: 'Rendu projet tutoré', start: '2026-11-27T18:00', end: '2026-11-27T18:30', desc: 'Dépôt du rapport et du code sur Moodle.', rem: '1440' },
      /* Sport et job étudiant, chaque semaine */
      weekly('s3', 'sport', 'Foot en salle', 4, '20:00', '21:30', 'Gymnase universitaire'),
      weekly('j2', 'job', 'Librairie', 6, '10:00', '14:00', 'Librairie du Centre'),
      { id: 's4', cal: 'sport', title: 'Escalade', start: '2026-11-11T14:00', end: '2026-11-11T16:00', loc: 'Salle d’escalade' },
      { id: 's5', cal: 'sport', title: 'Course à pied', start: '2026-11-19T18:30', end: '2026-11-19T19:30', loc: 'Bords de Saône' },
      { id: 'j3', cal: 'job', title: 'Babysitting', start: '2026-11-17T18:00', end: '2026-11-17T20:00', loc: 'Chez les Martin' },
      { id: 'e3', cal: 'anniv', title: 'Anniversaire d’Isabelle Moreau', person: 'Isabelle Moreau', allDay: true, start: '2020-11-18', end: '2020-11-19', rem: '1440', rrule: { freq: 'yearly' } },
      { id: 'e4', cal: 'anniv', title: 'Anniversaire de Léa Fontaine', person: 'Léa Fontaine', allDay: true, start: '2020-12-02', end: '2020-12-03', rem: '1440', rrule: { freq: 'yearly' } },
      { id: 'b1', cal: 'anniv', title: 'Anniversaire de Philippe Moreau', person: 'Philippe Moreau', allDay: true, start: '2020-03-14', end: '2020-03-15', rem: '1440', rrule: { freq: 'yearly' } },
      { id: 'b2', cal: 'anniv', title: 'Anniversaire de Hugo Bertrand', person: 'Hugo Bertrand', allDay: true, start: '2020-11-12', end: '2020-11-13', rem: '1440', rrule: { freq: 'yearly' } },
      { id: 'b3', cal: 'anniv', title: 'Anniversaire de Camille Rousseau', person: 'Camille Rousseau', allDay: true, start: '2020-11-27', end: '2020-11-28', rem: '1440', rrule: { freq: 'yearly' } },
      { id: 'b4', cal: 'anniv', title: 'Anniversaire de Thomas Girard', person: 'Thomas Girard', allDay: true, start: '2020-12-19', end: '2020-12-20', rem: '1440', rrule: { freq: 'yearly' } },
      { id: 'b5', cal: 'anniv', title: 'Anniversaire de Jeanne Moreau', person: 'Jeanne Moreau', allDay: true, start: '2020-12-24', end: '2020-12-25', rem: '1440', rrule: { freq: 'yearly' } },
      { id: 'b6', cal: 'anniv', title: 'Anniversaire d’Inès Haddad', person: 'Inès Haddad', allDay: true, start: '2020-01-08', end: '2020-01-09', rem: '1440', rrule: { freq: 'yearly' } },
      { id: 'b7', cal: 'anniv', title: 'Anniversaire de Julien Mercier', person: 'Julien Mercier', allDay: true, start: '2020-01-23', end: '2020-01-24', rem: '1440', rrule: { freq: 'yearly' } },
      { id: 'b8', cal: 'anniv', title: 'Anniversaire de Sarah Lambert', person: 'Sarah Lambert', allDay: true, start: '2020-02-11', end: '2020-02-12', rem: '1440', rrule: { freq: 'yearly' } },
      { id: 'b9', cal: 'anniv', title: 'Anniversaire de Nathan Chevalier', person: 'Nathan Chevalier', allDay: true, start: '2020-02-24', end: '2020-02-25', rem: '1440', rrule: { freq: 'yearly' } },
      { id: 'b10', cal: 'anniv', title: 'Anniversaire de Chloé Garnier', person: 'Chloé Garnier', allDay: true, start: '2020-03-30', end: '2020-03-31', rem: '1440', rrule: { freq: 'yearly' } },
      { id: 'b11', cal: 'anniv', title: 'Anniversaire de Tom Faure', person: 'Tom Faure', allDay: true, start: '2020-04-17', end: '2020-04-18', rem: '1440', rrule: { freq: 'yearly' } },
      { id: 'b12', cal: 'anniv', title: 'Anniversaire d’Emma Blanc', person: 'Emma Blanc', allDay: true, start: '2020-05-06', end: '2020-05-07', rem: '1440', rrule: { freq: 'yearly' } },
      { id: 'b13', cal: 'anniv', title: 'Anniversaire de Lucas Perrin', person: 'Lucas Perrin', allDay: true, start: '2020-05-21', end: '2020-05-22', rem: '1440', rrule: { freq: 'yearly' } },
      { id: 'b14', cal: 'anniv', title: 'Anniversaire de Manon Robin', person: 'Manon Robin', allDay: true, start: '2020-06-13', end: '2020-06-14', rem: '1440', rrule: { freq: 'yearly' } },
      { id: 'b15', cal: 'anniv', title: 'Anniversaire d’Antoine Clément', person: 'Antoine Clément', allDay: true, start: '2020-07-02', end: '2020-07-03', rem: '1440', rrule: { freq: 'yearly' } },
      { id: 'b16', cal: 'anniv', title: 'Anniversaire de Clara Morel', person: 'Clara Morel', allDay: true, start: '2020-07-28', end: '2020-07-29', rem: '1440', rrule: { freq: 'yearly' } },
      { id: 'b17', cal: 'anniv', title: 'Anniversaire de Maxime Gauthier', person: 'Maxime Gauthier', allDay: true, start: '2020-08-19', end: '2020-08-20', rem: '1440', rrule: { freq: 'yearly' } },
      { id: 'b18', cal: 'anniv', title: 'Anniversaire de Zoé Lemoine', person: 'Zoé Lemoine', allDay: true, start: '2020-09-05', end: '2020-09-06', rem: '1440', rrule: { freq: 'yearly' } },
      { id: 'b19', cal: 'anniv', title: 'Anniversaire de Louis Marchand', person: 'Louis Marchand', allDay: true, start: '2020-09-26', end: '2020-09-27', rem: '1440', rrule: { freq: 'yearly' } },
      { id: 'b20', cal: 'anniv', title: 'Anniversaire de Sophie Lefèvre', person: 'Sophie Lefèvre', allDay: true, start: '2020-10-15', end: '2020-10-16', rem: '1440', rrule: { freq: 'yearly' } },
      { id: 'b21', cal: 'anniv', title: 'Anniversaire d’Arthur Dumas', person: 'Arthur Dumas', allDay: true, start: '2020-10-31', end: '2020-11-01', rem: '1440', rrule: { freq: 'yearly' } },
      { id: 'e5', cal: 'perso', title: 'Concert', start: '2026-11-14T20:30', end: '2026-11-14T23:00', loc: 'Zénith', desc: 'Billets dans l’appli.\nOuverture des portes à 19:30.', rem: '60' },
      { id: 'e6', cal: 'perso', title: 'Ciné avec les amis', start: '2026-11-21T18:00', end: '2026-11-21T20:00' },
      { id: 'e7', cal: 'perso', title: 'Week-end à Lyon', allDay: true, start: '2026-12-05', end: '2026-12-07', desc: 'Train samedi à 08:12.' },
      { id: 'e8', cal: 'perso', title: 'Randonnée Fontainebleau', allDay: true, start: '2025-10-12', end: '2025-10-13', loc: 'Forêt de Fontainebleau' },
      { id: 'e9', cal: 'perso', title: "Festival d'été", allDay: true, start: '2026-07-15', end: '2026-07-18' },
      /* Souvenirs d'exemple ajoutés pour remplir la vue Souvenirs */
      { id: 'e10', cal: 'perso', title: 'Brunch chez Camille', start: `${key(LY)}T11:00`, end: `${key(LY)}T14:00` },
      { id: 'e11', cal: 'perso', title: 'Vacances en Bretagne', allDay: true, start: '2025-08-04', end: '2025-08-11' },
      { id: 'e12', cal: 'perso', title: 'Réveillon chez Tom', start: '2025-12-31T20:00', end: '2026-01-01T03:00' },
      { id: 'e13', cal: 'perso', title: 'Soirée jeux', start: '2026-03-21T19:00', end: '2026-03-21T23:30' },
      /* Démo : un rendez-vous court aujourd'hui et une réunion demain */
      { id: 'e14', cal: 'perso', title: 'Dentiste', start: `${key(TODAY)}T17:30`, end: `${key(TODAY)}T18:00`, loc: 'Cabinet Dr Martin', rem: '60' },
      { id: 'p1', cal: 'perso', title: 'Brunch avec la coloc', start: '2026-11-11T11:00', end: '2026-11-11T12:30', loc: 'Café des Arts' },
      { id: 'p3', cal: 'perso', title: 'Apéro de la promo', start: '2026-11-13T19:00', end: '2026-11-13T22:00', loc: 'Le Comptoir' },
      { id: 'p4', cal: 'perso', title: 'Café avec Léa', start: '2026-11-14T16:00', end: '2026-11-14T17:30' },
      { id: 'p5', cal: 'perso', title: 'Déjeuner chez les parents', start: '2026-11-15T12:30', end: '2026-11-15T15:30' },
      { id: 'p7', cal: 'perso', title: 'Coiffeur', start: '2026-11-10T17:30', end: '2026-11-10T18:15' },
      { id: 'p8', cal: 'perso', title: 'Soirée jeux', start: '2026-11-18T20:00', end: '2026-11-18T23:00', loc: 'Chez Tom' },
      { id: 'p9', cal: 'perso', title: 'Médecin', start: '2026-11-17T17:45', end: '2026-11-17T18:15', loc: 'Cabinet Dr Lambert' },
      { id: 'p10', cal: 'perso', title: 'Marché de Noël', start: '2026-11-29T15:00', end: '2026-11-29T18:00' },
      /* Démo Souvenirs : des événements d'il y a 2 et 3 ans */
      { id: 'e16', cal: 'perso', title: 'Atelier poterie', start: `${key(Y2)}T15:00`, end: `${key(Y2)}T17:00`, loc: 'Atelier du Panier' },
      { id: 'e17', cal: 'perso', title: 'Voyage à Lisbonne', allDay: true, start: key(addDays(Y3, 4)), end: key(addDays(Y3, 8)) },
      { id: 'e18', cal: 'perso', title: 'Mariage de Julie', allDay: true, start: `${TODAY.getFullYear() - 2}-06-15`, end: `${TODAY.getFullYear() - 2}-06-16`, loc: 'Aix-en-Provence' },
      { id: 'e19', cal: 'perso', title: 'Premier jour au nouveau job', start: `${TODAY.getFullYear() - 2}-09-02T09:00`, end: `${TODAY.getFullYear() - 2}-09-02T18:00` },
      { id: 'e20', cal: 'perso', title: 'Concert de jazz', start: `${TODAY.getFullYear() - 3}-02-18T20:30`, end: `${TODAY.getFullYear() - 3}-02-18T23:00`, loc: 'Le Cri du Port' },
      { id: 'e21', cal: 'perso', title: 'Dîner chez Léa et Tom', start: `${key(addDays(Y2, 23))}T20:00`, end: `${key(addDays(Y2, 23))}T23:30` }
    ]
  });
  S.events.forEach(norm);
  /* Années de naissance (facultatives) : elles permettent d'afficher l'âge */
  const BORN = { e3: 1962, e4: 1999, b1: 1960, b2: 2001, b3: 1998, b4: 1995, b5: 1934, b6: 2000, b7: 1997, b9: 2003, b11: 2010, b12: 1999, b14: 2002, b16: 1993, b18: 2004, b20: 1987, b21: 1996 };
  Object.entries(BORN).forEach(([id, y]) => { const ev = getEv(id); if (ev) ev.born = y; });
  /* D'autres anniversaires pour la démo */
  [
      ['Paul Girard', '01-03', 1998],
      ['Margaux Petit', '01-17', 2001],
      ['Hélène Moreau', '02-02', 1965],
      ['Yanis Belkacem', '02-19', 2000],
      ['Lina Rossi', '03-06', 2002],
      ['Victor Leroy', '03-22', null],
      ['Anaïs Robert', '04-04', 1999],
      ['Mathis Bonnet', '04-09', 2001],
      ['Jade Fournier', '04-28', 1997],
      ['Romain Dubois', '05-11', 1994],
      ['Léonie Garcia', '05-30', 2003],
      ['Mamie Odette', '06-02', 1941],
      ['Adam Lefort', '06-21', 2001],
      ['Inès Morel', '06-27', null],
      ['Noah Lambert', '07-09', 2005],
      ['Eva Chevalier', '07-19', 2000],
      ['Papa', '08-03', 1966],
      ['Lou Martin', '08-11', 2002],
      ['Gabriel Roux', '08-27', 1999],
      ['Juliette Fabre', '09-12', 2001],
      ['Hugo Mercier', '09-18', null],
      ['Maman', '10-07', 1969],
      ['Elsa Henry', '10-22', 2000],
      ['Nolan Perret', '11-05', 2002],
      ['Alice Bertin', '12-10', 1998]
  ].forEach(([name, md, y], i) => {
    const st = `2020-${md}`, ev = norm({ id: `bx${i}`, cal: 'anniv', title: `Anniversaire ${/^[aeiouyhàâäéèêëîïôöûüœ]/i.test(name) ? 'd’' : 'de '}${name}`, person: name, allDay: true, start: st, end: key(addDays(parse(st), 1)), rem: '1440', rrule: { freq: 'yearly' } });
    if (y) ev.born = y; S.events.push(ev);
  });
  /* Démo : groupes, favoris (couronne) et idées cadeaux */
  const DEMO_BD = { Famille: ['Maman', 'Papa', 'Mamie Odette', 'Isabelle Moreau', 'Philippe Moreau', 'Jeanne Moreau'],
    Amis: ['Hugo Bertrand', 'Camille Rousseau', 'Léa Fontaine', 'Thomas Girard', 'Inès Haddad', 'Julien Mercier', 'Lou Martin', 'Gabriel Roux'],
    Promo: ['Nolan Perret', 'Alice Bertin', 'Elsa Henry', 'Juliette Fabre', 'Adam Lefort', 'Noah Lambert', 'Mathis Bonnet', 'Jade Fournier'], Travail: ['Sophie Lefèvre', 'Arthur Dumas'] };
  const demoBd = n => S.events.find(e => e.person === n);
  Object.entries(DEMO_BD).forEach(([g, names]) => names.forEach(n => { const ev = demoBd(n); if (ev) ev.group = g; }));
  ['Maman', 'Papa', 'Mamie Odette', 'Hugo Bertrand'].forEach(n => { const ev = demoBd(n); if (ev) ev.fav = true; });
  demoBd('Hugo Bertrand').gifts = [{ t: 'Place de concert' }, { t: 'Le Problème à trois corps (livre)' }, { t: 'Casquette', y: 2025 }];
  demoBd('Maman').gifts = [{ t: 'Atelier poterie à deux' }, { t: 'Bouquet et resto', y: 2025 }];
  demoBd('Isabelle Moreau').gifts = [{ t: 'Plaid en laine' }];
  { /* Démo : un rendu en retard, un pour aujourd'hui, une fiche pour mardi, des révisions, une échéance déjà faite */
    const thu = addDays(TODAY, (11 - isoDow(TODAY)) % 7), D = (t, ev, occ, done) => { const d = { id: uid('k'), t, ev, occ };
      const e = S.events.find(x => x.id === ev), st = occ ? parse(`${occ}T${parse(e.start).toTimeString().slice(0, 5)}`) : parse(e.start);
      Object.assign(d, { occ: key(st), title: e.title, start: toStr(st, e.allDay), allDay: e.allDay, cal: e.cal }); if (done) d.done = done; S.dues.push(d); };
    D('Essay « Leadership »', 'e2', key(addDays(NEXT_TUE, -7)));
    D('Maquette du site', 'c10', key(thu));
    D('Fiche de lecture', 'e2', key(NEXT_TUE));
    D('Slides de l’exposé', 'c22');
    D('Réviser les chapitres 1 à 4', 'c23');
    D('Rapport et code sur Moodle', 'c15');
    D('Fiches de révision', 'c14');
    D('Préparer le CV', 'c20', null, key(addDays(TODAY, -1)));
  }
}
