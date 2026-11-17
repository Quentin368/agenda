# Avancement du projet Agenda

## Phase en cours
**Phase 3 terminée** (17/11/2026), en attente de validation : conteneur `agenda` sur le port 8090 avec l'image
construite sur le Pi (`AGENDA_IMAGE=agenda:dev` dans `.env`, temporaire) et le verrou d'écriture actif
(`WRITABLE_CALENDARS=dev-agenda,dev-*`). Pas encore envoyée sur GitHub. Après validation : envoi sur GitHub, attendre
le workflow, `docker compose pull`, retirer la ligne `AGENDA_IMAGE` du `.env`, `docker compose up -d`.

**Mettre à jour le conteneur** (après un envoi sur GitHub et la fin du workflow) :
`cd ~/docker/agenda && docker compose pull && docker compose up -d`

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

### Phase 2 — Backend en lecture seule
- **Backend** `backend/agenda/` (FastAPI) :
  - `config.py` réglages (variables d'environnement) ; `auth.py` sessions en mémoire (expiration glissante
    12 h / 30 j), limitation des tentatives (5 échecs / 15 min par IP et par identifiant) ;
  - `dav.py` client CalDAV minimal (PROPFIND current-user-principal → calendar-home-set → collections ;
    REPORT calendar-query VEVENT avec ETag), identifiants passés à chaque requête ;
  - `ical_read.py` conversion iCal → modèle de la maquette (+ « meta » à part : ressource, ETag, UID, nature) ;
  - `recurrence.py` le calcul des répétitions de la maquette reproduit en Python ;
  - `palette.py` hex ⇄ 16 couleurs (plus proche en teinte OKLCH) ;
  - `main.py` API : `POST /api/login`, `POST /api/logout`, `GET /api/session`, `GET /api/data`, `/healthz`,
    + fichiers de l'interface. CSP stricte, cookie HttpOnly SameSite=Strict (Secure réglable), CSRF
    (jeton de session + en-tête maison + contrôle d'Origin), API jamais en cache, interface revalidée.
- **Interface** : `static/demo.js` supprimé ; nouveau `static/sync.js` (connexion réelle, chargement,
  « dernier état connu du serveur », lecture seule, rechargement toutes les 5 min et au retour sur l'onglet,
  hors saisie en cours). `app.js` : 4 retouches (appel de `serverLogin`, `serverLogout`, message d'erreur
  remis à zéro, point d'accroche `onDataChanged` à la fin de `refreshData`).
- **Docker** : `Dockerfile` (python:3.13-alpine, 2 étapes, 102 Mo, uid 1000, healthcheck), `.dockerignore`,
  `.github/workflows/image.yml` (tests puis image arm64 sur ghcr.io/chewbacca-368/agenda).
  Pile `~/docker/agenda` : `compose.yaml` (réseau externe `test-radicale_default`, conteneur en lecture seule,
  sans privilèges), `.env` (chmod 600).
- **Tests** (58, `pytest`) : conversion (fuseaux, UTC, flottant, journées, durées et changement d'heure, fin
  inconnue, rappels, X-AGENDA-*, répétitions représentables ou calculées, RECURRENCE-ID, ids, couleurs),
  sessions et limitation, API de bout en bout contre un Radicale jetable. Ils passent aussi dans l'image Alpine.

### Vérifications de la phase 2
- Calcul des répétitions Python ⇄ vrai code JavaScript de la maquette (exécuté dans Chromium) : 1 000 séries
  tirées au hasard, 307 000 occurrences, 0 différence.
- Scénario d'interface dans Chromium avec les vraies réponses de l'API (Radicale jetable chargé avec des copies
  des événements de test) : 25/25 vérifications (connexion, erreurs, données, lecture seule, visibilité
  conservée au rechargement, déconnexion avec CSRF, reprise de session, aucune erreur JavaScript).
- Conteneur : en bonne santé, joint `http://radicale:5232/`, refuse l'API sans connexion.

### Phase 3 — Écriture
- **Backend** :
  - `ical_write.py` : écriture en partant de l'iCal brut, seuls les champs modifiés sont réécrits (titre, lieu,
    notes, dates en gardant leur forme TZID/UTC/flottante, DURATION gardée, répétition, EXDATE, rappel, X-AGENDA-*),
    DTSTAMP/LAST-MODIFIED mis à jour, SEQUENCE +1 pour un changement de date ou de répétition ; VTIMEZONE de Paris
    compacte (par règles) ajoutée si besoin ; occurrences modifiées (RECURRENCE-ID) créées/modifiées/supprimées,
    décalées avec la série, retirées si la série est coupée avant elles.
  - `changes.py` + `POST /api/changes` : applique un lot (calendriers créés/renommés/supprimés, événements
    créés/modifiés/supprimés). La correspondance id → ressource/ETag est gardée dans la SESSION (jamais fournie par
    l'interface) ; verrou vérifié avant toute écriture ; une ressource = une lecture (ETag comparé) + une écriture
    (If-Match / If-None-Match) ; conflit → 409, rien n'est écrasé. Corbeille de session (iCal brut) : « Annuler »
    une suppression remet le fichier à l'octet près, y compris un calendrier entier.
  - `dav.py` : GET, PUT, DELETE, MKCALENDAR, PROPPATCH, lecture de tout le contenu d'une collection.
  - Verrou `WRITABLE_CALENDARS` (vide par défaut = lecture seule), préfixe `dev-` des nouveaux calendriers.
- **Interface** : `sync.js` calcule la différence avec le dernier état connu du serveur après chaque action et
  l'envoie (une requête à la fois, la suivante après) ; reconnaît « cette occurrence seulement » (une date exclue +
  un événement simple dans le même calendrier) pour l'écrire en RECURRENCE-ID ; refuse avec un message : calendrier
  verrouillé, échéances (phase 4), répétition d'une série « spéciale » ; conflit/refus/panne → message + rechargement.
  `app.js` : `uid()` produit des identifiants aléatoires (`e-` + 24 hexadécimaux, `dev-c-…` pour un calendrier).
- **Tests** : 95 pytest (dont 24 d'écriture : aller-retour exact, fidélité, formes de dates, occurrences, et 12 de
  bout en bout contre un Radicale jetable : verrou, CSRF, création/modification/suppression/annulation, conflit,
  occurrences, séries spéciales, changement de calendrier, calendriers).
  Nouveau `tools/e2e_navigateur.py` : vrai Chromium ⇄ vrai backend ⇄ Radicale jetable, 21/21 (dont un vrai
  glisser-déposer à la souris).

## Reste à faire
- Phase 4 — Spécificités (anniversaires X-AGENDA-*, VTODO, VALARM, abonnements, import .ics).
- Phase 5 — Finitions (revues, README, bascule sur les vrais calendriers).

## Problèmes connus
- **Largeur de la colonne des heures (vues Jour/Semaine) : ±2 px selon le moment où les polices finissent de
  charger.** FullCalendar mesure cette colonne au premier affichage ; si les polices ne sont pas encore prêtes,
  il mesure avec la police de secours. Existe déjà dans la maquette (même résultat aléatoire d'un chargement à
  l'autre). Correction possible plus tard, si tu le souhaites : redessiner le calendrier quand
  `document.fonts.ready` est résolu.
- Événements annulés (`STATUS:CANCELLED`) : masqués. Occurrences « calculées » : fenêtre de 10 ans avant à
  2 ans après aujourd'hui (au plus 1 500 par série).
- Rappels : seul le premier rappel relatif au début est repris (un rappel à heure fixe ou relatif à la fin
  s'affiche « aucun ») ; ils restent intacts dans Radicale.
- Une modification refusée (calendrier verrouillé, échéance, conflit) est annulée après coup : la fenêtre
  d'édition s'est déjà fermée, la saisie est perdue.
- Après « cette occurrence seulement », l'occurrence garde jusqu'au prochain rechargement l'id donné par
  l'interface ; au rechargement elle prend son id définitif (`…~r…`) et l'historique « Annuler » est vidé.
- Échéances : pas encore enregistrées (phase 4) ; les ajouter est refusé avec un message.
- Chromium sans fenêtre sur le Pi : il faut `--password-store=basic`, sinon il attend indéfiniment le trousseau
  système avant toute requête http (c'était la cause des blocages des phases 1 et 2).

## Décisions prises
- Pas de mot de passe ni d'identité personnelle dans git ; dépôt GitHub privé (CLAUDE.md décrit l'infrastructure).
- Données de démo isolées dans `static/demo.js` (phase 1), retirées en phase 2.
- **id d'événement = UID** s'il ne contient que des caractères sûrs (`A-Z a-z 0-9 . _ : -`), sinon une empreinte
  stable (`h` + sha256). Raison : l'interface fabrique des clés `id@jour` et des sélecteurs CSS avec l'id ;
  un UID comme `…@google.com` les casserait. Le vrai UID est dans « meta ». Occurrence modifiée :
  `id~rAAAAMMJJ[THHMM]` ; occurrence calculée : `id~oAAAAMMJJ[THHMM]`.
- Répétitions : une série est confiée à l'interface seulement si les occurrences selon la maquette et selon la
  norme sont identiques sur 6 ans (ou jusqu'à sa fin) ; sinon le serveur envoie les occurrences calculées
  (note « Répétition personnalisée… »).
- Événement sans fin ni durée → `openEnd` (une heure à l'écran), comme l'import .ics de la maquette.
- Image Alpine plutôt que Debian slim (102 Mo au lieu de 229 Mo), tests identiques.
- Pas de `--proxy-headers` (pas de reverse proxy) : l'adresse IP utilisée pour la limitation est la vraie.
- Phase 3 : le calendrier de test se crée depuis l'agenda lui-même (bouton +) ; sa collection s'appelle
  `dev-c-…` (le verrou l'autorise), son nom affiché est libre (ex. « dev-agenda »).
- Une série hebdomadaire qui commence un jour hors de ses jours est enregistrée à partir de sa première vraie
  occurrence (sinon la norme compterait un jour que la maquette n'affiche pas).
- Les rappels (VALARM) et propriétés X-AGENDA-* sont déjà écrits (phase 3) : plus simple que de les ignorer ;
  la phase 4 garde les échéances (VTODO), les abonnements côté serveur et l'import.
- La balise `<meta name="claude:viewport-fit-sides">` de la maquette est conservée telle quelle (sans effet
  dans un navigateur).
