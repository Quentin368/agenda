# Avancement du projet Agenda

## Phase en cours
**Phase 1 validée** (17/11/2026) et envoyée sur GitHub. **Phase 2 en cours** (backend en lecture seule) :
questions posées et décisions reportées dans CLAUDE.md (« Décisions validées »).

## Fait

### Phase 1 — Préparation, sans changement de comportement
- Dépôt git créé dans `~/projets/agenda`, branche `main`, relié à GitHub (dépôt **privé**
  `Chewbacca-368/agenda`, envoi après validation de la phase). Auteur des commits : `Quentin <74560823+Chewbacca-368@users.noreply.github.com>`
  (adresse anonyme GitHub, réglée pour ce dépôt seulement). Outil `gh` installé sur le Pi (`apt install gh`).
- `.gitignore` : `.env` et secrets, caches Python.
- `maquette.html` conservée **intacte** à la racine, comme référence.
- Découpage en :
  - `static/index.html` : la page (HTML de la maquette, à l'identique)
  - `static/app.css` : tout le CSS
  - `static/app.js` : tout le JavaScript, sans les données de démo
  - `static/demo.js` : les données de démo (calendriers, événements, anniversaires, groupes, favoris,
    cadeaux, échéances), dans une fonction `loadDemo()` appelée par `app.js` au même endroit qu'avant
    (juste après les fonctions des échéances). Sans `demo.js`, l'agenda démarre vide.
- Dépendances embarquées, plus aucun CDN :
  - `static/vendor/fullcalendar/` : FullCalendar 6.1.15 + locale `fr` (pris sur le registre npm, empreinte
    sha512 vérifiée, identiques octet pour octet aux fichiers du CDN), licence MIT.
  - `static/fonts/` : Bricolage Grotesque et Figtree (polices variables woff2, sous-ensembles latin,
    latin-ext, vietnamese comme chez Google), `fonts.css` = la feuille de Google avec les adresses
    réécrites en local, licences OFL.

### Vérification de la phase 1
Comparaison automatique maquette ⇄ nouvelle version dans Chromium sans fenêtre (outillage jetable, hors dépôt) :
8 vues (jour, semaine, mois, année, à venir, anniversaires, souvenirs, échéances) × thème clair et sombre
en 1440×900, plus 4 vues en mobile 390×844 :
- données chargées (`S`) identiques dans tous les cas ;
- mêmes polices chargées ; aucune erreur JavaScript ;
- aucune requête vers Internet (seulement les fichiers locaux) ;
- captures identiques au pixel près, sauf l'écart décrit dans « Problèmes connus » (préexistant).

## Reste à faire
- Phase 2 — Backend en lecture seule (FastAPI, login réel, lecture Radicale, suppression de `demo.js`, Docker port 8090).
- Phase 3 — Écriture (synchronisation par différence, ETag).
- Phase 4 — Spécificités (anniversaires X-AGENDA-*, VTODO, VALARM, abonnements, import .ics).
- Phase 5 — Finitions (revues, README, bascule sur les vrais calendriers).

## Problèmes connus
- **Largeur de la colonne des heures (vues Jour/Semaine) : ±2 px selon le moment où les polices finissent de
  charger.** FullCalendar mesure cette colonne au premier affichage ; si les polices ne sont pas encore prêtes,
  il mesure avec la police de secours. Existe déjà dans la maquette (même résultat aléatoire d'un chargement à
  l'autre). Correction possible plus tard, si tu le souhaites : redessiner le calendrier quand
  `document.fonts.ready` est résolu.
- Chromium sans fenêtre sur le Pi n'arrive pas à charger de pages http (même locales) : les tests visuels se
  font en ouvrant les fichiers directement (`file://`). Sans effet sur l'application.

## Décisions prises
- Pas de mot de passe ni d'identité personnelle dans git ; dépôt GitHub privé (CLAUDE.md décrit l'infrastructure).
- Données de démo isolées dans `static/demo.js` (phase 1), pour les retirer proprement en phase 2.
- La balise `<meta name="claude:viewport-fit-sides">` de la maquette est conservée telle quelle (sans effet
  dans un navigateur).
