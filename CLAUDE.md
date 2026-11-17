# Projet « Agenda » — interface web personnelle pour Radicale

## Objectif
Transformer la maquette `maquette.html` (agenda complet, autonome, données de démo en mémoire)
en une vraie application auto-hébergée, livrée en Docker, branchée sur mon serveur CalDAV Radicale.
**Radicale reste l'unique source de vérité** : l'application ne stocke jamais les événements elle-même.
Le design et le comportement de la maquette sont VALIDÉS : on les conserve à l'identique
(ne pas « améliorer » l'interface sans me le demander).

## Qui je suis / comment travailler avec moi
- Je débute en administration Linux : explique simplement, en français, ce que tu fais et pourquoi.
- Avant toute commande `sudo`, explique pourquoi elle est nécessaire.
- Ne modifie rien en dehors de `~/projets/agenda` et `~/docker/agenda` sans me demander.
  En particulier, ne touche pas à la pile `~/docker/test-radicale` ni aux autres services.
- Ne m'affiche jamais de mot de passe ou de secret ; génère les secrets directement dans des fichiers (`.env`, chmod 600).
- Avance par phases (voir plus bas). À la fin de chaque phase : tests, démonstration, commit git,
  mise à jour de `PROGRESS.md`, puis tu attends mon retour.
- Pose-moi tes questions structurantes AVANT de coder une phase (5 maximum).

## Environnement
- Raspberry Pi 5, 8 Go, arm64, Debian 13 (trixie), Docker + Compose. Utilisateur `quentin` (uid/gid 1000).
- Accès uniquement via Tailscale en HTTP simple : `http://raspberryquentin:<port>` (pas de TLS, pas de reverse proxy).
  Le cookie de session ne peut donc pas exiger HTTPS (le rendre configurable).
- Radicale : pile `~/docker/test-radicale`, conteneur `test-radicale`, service `radicale`, port 5232,
  réseau Docker `test-radicale_default` (l'agenda doit le rejoindre en réseau externe et appeler `http://radicale:5232/`).
  Auth htpasswd bcrypt, utilisateur `quentin`, rights `owner_only`.
  Calendriers existants : `/quentin/perso/`, `/quentin/anniversaires/`, `/quentin/cours/` (VEVENT,VTODO),
  avec des événements « (test) ». Un événement a aussi été créé depuis AgenDAV.
- AgenDAV (port 8086) et WebCalDav (port 8088) tournent aussi sur ces mêmes données : ils servent de témoin
  pour vérifier que l'agenda n'abîme rien. Mon téléphone (DAVx⁵) y sera branché aussi.
- Conventions des piles Docker : un dossier par pile dans `~/docker/<nom>/`, volumes en CHEMINS ABSOLUS
  (Dockge transforme mal les chemins relatifs), fichiers appartenant à quentin (PUID/PGID 1000),
  `TZ=Europe/Paris`, secrets dans `.env`. Port proposé pour l'agenda : **8090** (vérifier qu'il est libre).
- Code dans `~/projets/agenda` (git, dépôt GitHub **privé** `Chewbacca-368/agenda`, envoi via `gh`/HTTPS ;
  auteur des commits = adresse noreply GitHub, réglée localement), déploiement dans `~/docker/agenda`.
- Frontend : `static/index.html`, `static/app.css`, `static/app.js` (la maquette), `static/sync.js` (lien avec
  le serveur : connexion, chargement, état serveur, synchronisation) ; dépendances embarquées dans
  `static/vendor/` et `static/fonts/`. Backend : `backend/agenda/` (`ical_read`/`ical_write`/`ical_todo` conversions,
  `changes` écriture, `dav` CalDAV, `ics_fetch` abonnements) ; tests : `tests/` (`.venv/bin/pytest`) et
  `tools/e2e_navigateur.py` (vrai Chromium ⇄ backend ⇄ Radicale jetable).
- Image Docker : `python:3.13-alpine`, construite par GitHub Actions (`.github/workflows/image.yml`).

## La maquette : ce qu'il faut savoir (`maquette.html`, ~4 900 lignes, tout-en-un)
- Dépendances externes : FullCalendar 6.1.15 + locale fr (jsdelivr), polices Google Fonts
  (Bricolage Grotesque, Figtree). → À embarquer localement (aucun CDN en production).
- État global `S = { calendars, events, dues }` (ligne ~1973). Données de démo de la section
  « Données fictives » (~1958) jusqu'au bloc « Démo : … échéances » (~2185) : `S.calendars`/`S.events` de démo,
  `BORN`, la liste d'anniversaires ajoutés par `forEach`, `DEMO_BD`, favoris, cadeaux, échéances de démo.
  Les jours fériés (calculés) ne sont PAS de la démo : à garder.
- Modèle d'un événement (après `norm()`) :
  `{ id, cal, title, start, end, allDay, loc, desc, rem, rrule:{freq:'none'|'daily'|'weekly'|'monthly'|'yearly', days?:[1..7 ISO], until?:'YYYY-MM-DD', interval?}, exdates:['YYYY-MM-DD'] }`
  Dates = chaînes locales sans fuseau : `'YYYY-MM-DD'` (journée) ou `'YYYY-MM-DDTHH:MM'`. Fin exclusive.
  Champs optionnels : `person`, `born`, `fav`, `group`, `gifts:[{t, y?}]` (anniversaires), `openEnd`,
  `icsUid`, `repNote` (abonnements).
  `rem` : minutes avant le début (`'10'`, `'1440'`…), `'none'`, ou cas spéciaux journée :
  `'-540'` = le jour même à 9 h, `'360'` = la veille à 18 h.
- Le calendrier des anniversaires a l'id spécial `'anniv'` (le code s'y réfère en dur) ;
  `isBday(ev)` = répétition annuelle + journée + (`person` ou cal `'anniv'`).
- Échéances `S.dues` : `{ id, t, ev, occ, title, start, allDay, cal, done? }` rattachées à une occurrence
  (`ev` = id d'événement, `occ` = jour de l'occurrence). Peuvent viser un événement d'abonnement (lecture seule).
- « Cette occurrence seulement » est modélisé par une `exdate` sur la série + un événement autonome
  (pas de RECURRENCE-ID). « Et les suivantes » coupe la série (`splitAt`).
- Circuit de toute modification : `const snap = snapshot()` → mutation de `S` → `refreshData(ids)` → `toast(msg, snap)`.
  `undoLast()` restaure un snapshot complet. `calsChanged()` gère la visibilité (sans snapshot).
- Abonnements iCal : `fetchICS` côté navigateur (bloqué par CORS sur la plupart des sites), `parseICS`/`icsEvent`
  convertissent un .ics vers le modèle ; calendriers avec `c.sub = { url, at, n, err }`, événements en lecture seule.
- Connexion factice (`login-form` → `setTimeout` → `showApp`). Préférences en `localStorage`
  (`agenda-prefs`, `agenda-theme`, `agenda-view`, `agenda-last-cal`, `agenda-mem-seen`, `agenda-rem-seen`) : à garder ainsi.

## Architecture retenue (propose mieux seulement avec une bonne raison)
- **Backend** Python (FastAPI) + bibliothèques éprouvées (`caldav` ou requêtes WebDAV directes, `icalendar`,
  `recurring-ical-events` si besoin d'expansion côté serveur). Sert aussi les fichiers statiques.
- **Auth** : formulaire → identifiants vérifiés auprès de Radicale ; gardés uniquement en mémoire serveur,
  liés à une session (jamais sur disque) ; expiration, « Rester connecté » = durée de session plus longue ;
  protection CSRF ; limitation des tentatives.
- **API au format de la maquette** : le backend convertit iCalendar ⇄ modèle JSON de la maquette, pour que le
  frontend change le moins possible. Chargement initial de TOUT (calendriers, événements, échéances) :
  la recherche, les Souvenirs et la vue Année en ont besoin et le volume reste petit pour un usage perso.
- **Synchronisation par différence** : garder dans le frontend un état « dernier état connu du serveur » ;
  après chaque `refreshData()`, comparer `S` à cet état et envoyer uniquement les créations / modifications /
  suppressions. Ainsi « Annuler » (restauration de snapshot) se synchronise tout seul.
  Exclure de l'envoi : la visibilité des calendriers (préférence locale) et les calendriers d'abonnement.
- **Rechargement** des données serveur au retour sur l'onglet / périodiquement, pour voir les changements
  faits sur le téléphone, sans écraser une saisie en cours.
- **Abonnements** : lus par le backend (pas de CORS), mis en cache côté backend ; jamais écrits dans Radicale.
- Image Docker multi-arch arm64, utilisateur non-root, healthcheck, la plus légère possible.

## Décisions validées (17/11/2026, début de phase 2)
- Phase 2 (lecture seule) : toute tentative de création / modification / suppression est **bloquée avec un message**
  (« l'écriture arrive en phase 3 ») ; ce blocage temporaire sera retiré en phase 3.
- Sessions : 12 h sans « Rester connecté », 30 jours glissants avec ; durées réglables dans le `.env`.
- Image Docker **construite par GitHub Actions** (multi-arch, au moins arm64) et publiée en privé sur
  `ghcr.io/chewbacca-368/agenda` ; le Pi la télécharge (docker login ghcr.io avec un jeton `read:packages`).
- Répétitions non représentables / RECURRENCE-ID : proposition ci-dessous **validée**.

## Décisions validées (17/11/2026, début de phase 3)
- Calendrier de test créé dans Radicale **depuis l'agenda** (nom affiché « dev-agenda », collection `dev-c-…`). **Verrou côté serveur** : variable
  `WRITABLE_CALENDARS` du `.env` (motifs, ex. `dev-agenda,dev-*`) ; toute écriture ailleurs est refusée par
  le backend, les autres calendriers restent visibles en lecture seule (message si on essaie).
  Un calendrier créé depuis l'agenda reçoit un nom de collection `dev-<aléatoire>` tant que le verrou est actif.
  Ouverture à tous les calendriers en phase 5, avec mon accord.
- « Cette occurrence seulement » ⇄ **RECURRENCE-ID** dans la même ressource que la série (format standard),
  pas un événement séparé ; côté interface, le modèle de la maquette (exdate + événement lié) ne change pas.
- Suppression : immédiate dans Radicale ; le serveur garde en mémoire (session) l'**iCal brut** supprimé, et
  « Annuler » le remet tel quel (If-None-Match).
- Séries non représentables (occurrences calculées) : modifier une occurrence = **cette occurrence seulement**
  (RECURRENCE-ID) ; la répétition elle-même n'est pas modifiable dans l'agenda.

## Décisions validées (17/11/2026, début de phase 4)
- Abonnements : la LISTE est gardée dans Radicale comme **calendriers abonnés** (collection `CS:subscribed` avec
  `CS:source` = l'adresse, nom, couleur) ; leurs événements sont lus par le backend (cache), jamais copiés.
- Échéances : calendrier de tâches dédié (VTODO seulement), créé automatiquement à la première échéance,
  **invisible** dans la liste des calendriers de l'agenda.
- Import .ics : **tout le contenu** de l'événement importé est gardé (iCal brut du fichier), pas seulement les
  champs affichés.
- Rappels : pas de notifications système en plus (comme la maquette ; le téléphone lit les VALARM).

## Correspondances iCalendar (validées le 17/11/2026)
- Événement ⇄ VEVENT ; `id` ⇄ UID (si l'UID contient des caractères non sûrs — `@`, `/`… — l'id est une
  empreinte stable `h…` ; le vrai UID, la ressource et l'ETag sont dans `meta`, hors de `S`) ;
  calendrier ⇄ collection Radicale (mapper `anniversaires` → id `'anniv'`).
- Couleurs : palette de 16 noms de la maquette (`COLORS`) ⇄ `ICAL:calendar-color` (hex). Écrire le hex de la palette ;
  à la lecture, prendre la couleur de palette la plus proche.
- `rem` ⇄ VALARM (minutes avant le début ; `'-540'` / `'360'` en déclencheurs relatifs pour les journées).
- Anniversaires : `person`, `born`, `fav`, `group`, `gifts` ⇄ propriétés `X-AGENDA-*`
  (le téléphone les ignore sans les effacer). Idem `openEnd`.
- Échéances ⇄ **VTODO** (avec `RELATED-TO` vers l'UID de l'événement + le jour d'occurrence en `X-AGENDA-OCC`,
  `STATUS:COMPLETED` pour « faite »), dans un calendrier dédié aux tâches, pour pouvoir viser aussi
  des événements d'abonnement. Bonus : elles apparaissent comme tâches sur le téléphone.
- Occurrences modifiées venant d'ailleurs (RECURRENCE-ID) : affichées à leur vraie date comme événements liés à la
  série (la série reçoit une exdate pour ce jour côté JSON), et réécrites dans la même ressource iCal.
- Répétitions que la maquette ne sait pas représenter (BYSETPOS, « 2ᵉ mardi », etc.) : occurrences calculées par
  le backend et envoyées comme événements liés ; jamais affichées fausses ni écrasées. La modification de la
  répétition est bloquée ; les autres champs (titre, lieu…) restent modifiables (phase 3).

## Règles d'or (non négociables)
1. **Fidélité** : en modifiant un événement existant, ne réécrire QUE les champs modifiés ; conserver tout le reste
   (alarmes, X-*, ATTENDEE, propriétés inconnues, VTIMEZONE…). Partir de l'iCal brut stocké, jamais d'une reconstruction.
2. **Concurrence** : ETag / If-Match à chaque écriture ; en cas de conflit, prévenir (toast) et recharger, ne jamais écraser.
3. **Fuseaux** : Europe/Paris, changements d'heure corrects, TZID respectés.
4. **Données réelles protégées** : pendant le développement, écrire uniquement dans un calendrier de test dédié
   (ex. `dev-agenda`) ; jamais dans perso / anniversaires / cours sans mon accord explicite.
5. **Tests automatisés** (pytest) sur la conversion iCal ⇄ JSON dans les deux sens : récurrences, exdates,
   journées entières, changement d'heure, alarmes, propriétés inconnues conservées, X-AGENDA-*, VTODO.

## Phases
- **Phase 1 — Préparation, sans changement de comportement** : git init ; découper `maquette.html` en
  `static/index.html`, `static/app.css`, `static/app.js` ; embarquer FullCalendar 6.1.15 et les polices en local ;
  vérifier que tout s'affiche à l'identique (données de démo encore présentes).
- **Phase 2 — Backend en lecture seule** : login/logout réels, chargement des vrais calendriers et événements
  depuis Radicale, suppression des données de démo ; aucune écriture encore. Conteneur Docker sur le port 8090.
- **Phase 3 — Écriture** : synchronisation par différence (créer, modifier, déplacer, supprimer, séries,
  « cette occurrence / les suivantes / toutes »), calendriers (créer, renommer, couleur, supprimer), conflits ETag.
- **Phase 4 — Spécificités** : anniversaires (X-AGENDA-*), échéances (VTODO), rappels (VALARM),
  abonnements côté backend, import .ics.
- **Phase 5 — Finitions** : revue de code et revue de sécurité, README en français (installation, mise à jour,
  sauvegarde, dépannage), puis bascule sur mes vrais calendriers avec mon accord.

## Fichiers à tenir à jour
- `PROGRESS.md` : fait / reste à faire / problèmes connus / décisions prises (pour reprendre dans une nouvelle session).
- Ce `CLAUDE.md` : si une décision change l'architecture ou une correspondance, mets-le à jour (et dis-le-moi).
