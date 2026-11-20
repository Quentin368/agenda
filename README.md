# Agenda — interface web personnelle pour Radicale

Un agenda complet (semaine, mois, année, anniversaires, souvenirs, échéances, abonnements…) branché sur
**Radicale**, ton serveur de calendriers. Radicale reste **l'unique source de vérité** : l'agenda ne garde
aucun événement de son côté. Ce que tu fais dans l'agenda se voit aussitôt dans AgenDAV et sur ton
téléphone (DAVx⁵), et inversement.

- Adresse : **https://raspberryquentin.tail340eef.ts.net** (HTTPS via Tailscale Serve, installable sur le
  téléphone) — ou http://raspberryquentin:8090 (accès direct)
- Identifiants : ceux de Radicale
- Code : `~/projets/agenda` (GitHub privé `Quentin368/agenda`) — Déploiement : `~/docker/agenda`

---

## Comment ça marche (en bref)

```
navigateur ──HTTP──▶ conteneur « agenda » (port 8090) ──CalDAV──▶ conteneur « radicale » (port 5232)
                      │ FastAPI (Python) + fichiers de l'interface        │ tes calendriers (fichiers .ics)
```

- **L'interface** (`static/`) est la maquette validée. `sync.js` la relie au serveur : après chaque action,
  il compare l'agenda au dernier état connu de Radicale et envoie seulement la différence.
- **Le serveur** (`backend/agenda/`) traduit iCalendar ⇄ format de l'interface. En modification, il repart
  toujours du fichier de Radicale et ne réécrit que ce qui a changé : alarmes du téléphone, participants,
  propriétés inconnues… sont conservés.
- **Concurrence** : chaque écriture vérifie que le fichier n'a pas changé entre-temps (ETag). Sinon, rien
  n'est écrasé : un message « Modifié ailleurs » s'affiche et l'agenda recharge la version de Radicale.
- **Connexion** : ton mot de passe est vérifié par Radicale et gardé seulement en mémoire, jamais sur disque.
  Conséquence : redémarrer le conteneur te déconnecte.
- **Ce qui est rangé où dans Radicale** :

| Dans l'agenda | Dans Radicale |
| --- | --- |
| Calendrier | collection de calendrier |
| Événement, répétition, rappel | `VEVENT`, `RRULE`/`EXDATE`, `VALARM` |
| « Cette occurrence seulement » | occurrence modifiée (`RECURRENCE-ID`) dans le même fichier |
| Anniversaire (personne, année, favori, groupe, cadeaux) | propriétés `X-AGENDA-*` (ignorées sans perte par le téléphone) |
| Échéance | tâche `VTODO` dans la collection `echeances` (visible comme tâche sur le téléphone) |
| Abonnement (lien .ics) | calendrier portant son lien (`CS:source`) ; ses événements y sont **copiés** à chaque lecture du lien (gardés si le lien disparaît, sauvegardés, visibles sur le téléphone) |

---

## Installation (sur un Pi neuf ou après une réinstallation)

Prérequis : Docker + Compose, la pile Radicale (`~/docker/radicale`) déjà lancée, et l'outil GitHub `gh`.

1. **Autoriser le Pi à télécharger l'image privée** (une seule fois) :
   ```sh
   gh auth login                                   # connexion à GitHub (navigateur)
   gh auth refresh -s read:packages                # droit de lire les images
   gh auth token | docker login ghcr.io -u Quentin368 --password-stdin
   ```
   Le jeton passe directement de `gh` à Docker sans s'afficher ; Docker le garde dans `~/.docker/config.json`.

2. **Créer la pile** :
   ```sh
   mkdir -p ~/docker/agenda && cd ~/docker/agenda
   cp ~/projets/agenda/deploy/compose.yaml .
   cp ~/projets/agenda/deploy/.env.example .env && chmod 600 .env   # puis relire/ajuster .env
   docker compose pull && docker compose up -d
   ```
   Le conteneur rejoint le réseau Docker de Radicale (`radicale_default`) et l'appelle à `http://radicale:5232/`.

3. **Vérifier** : `docker ps` doit montrer `agenda` « (healthy) », puis ouvre http://raspberryquentin:8090.

4. **Sauvegarde automatique** (voir plus bas) :
   ```sh
   cp ~/projets/agenda/deploy/sauvegarde.sh ~/docker/agenda/ && chmod 755 ~/docker/agenda/sauvegarde.sh
   crontab -e     # ajouter la ligne :
   0 3 * * * /home/quentin/docker/agenda/sauvegarde.sh >> /home/quentin/docker/agenda/sauvegardes/sauvegarde.log 2>&1
   ```

---

## Application sur le téléphone (Android)

L'agenda s'installe comme une application (PWA) — **seulement depuis l'adresse HTTPS** (le navigateur refuse en
HTTP simple). Tailscale doit être actif sur le téléphone.

1. Dans Chrome, ouvrir **https://raspberryquentin.tail340eef.ts.net** et se connecter (« Rester connecté »).
2. Menu ⋮ → **Installer l'application** (ou « Ajouter à l'écran d'accueil »).
3. L'icône « Agenda » apparaît ; l'appli s'ouvre en plein écran, sans barre d'adresse.

- **Hors connexion** (Pi éteint, Tailscale coupé…) : l'appli s'ouvre quand même sur l'écran « Pi injoignable »,
  et réessaie seule quand le réseau revient. Aucune donnée n'est gardée sur le téléphone : seule l'interface
  (pages, styles, polices) est mise en cache par le *service worker* (`static/sw.js`), jamais `/api`.
- **Mises à jour** : rien à faire, une nouvelle version déployée est prise au prochain lancement / rechargement.
- **Désinstaller** : appui long sur l'icône → Désinstaller (ou Paramètres → Applications).
- Pour **DAVx⁵**, l'adresse HTTPS de Radicale est `https://raspberryquentin.tail340eef.ts.net:8443`.

---

## Réglages (`~/docker/agenda/.env`)

| Variable | Rôle | Valeur |
| --- | --- | --- |
| `RADICALE_URL` | adresse de Radicale vue du conteneur | `http://radicale:5232/` |
| `SESSION_HOURS` / `REMEMBER_DAYS` | durée de session sans activité, sans / avec « Rester connecté » | `12` / `30` |
| `COOKIE_SECURE` | cookie réservé à HTTPS (laisser `false` en HTTP simple) | `false` |
| `LOGIN_MAX_FAILURES` / `LOGIN_WINDOW_MINUTES` | limitation des essais de connexion | `5` / `15` |
| `TRUSTED_PROXIES` | proxy dont on croit `X-Forwarded-For` (vraie adresse derrière Tailscale Serve, pour la limitation des essais). `auto` = passerelle Docker du conteneur | `auto` |
| `WRITABLE_CALENDARS` | **verrou d'écriture** : collections modifiables. `*` = toutes ; `dev-agenda,dev-*` = essais seulement ; vide = lecture seule | `*` |

Après une modification du `.env` : `cd ~/docker/agenda && docker compose up -d` (le conteneur est recréé).

---

## Mise à jour

Chaque envoi de code sur GitHub lance les tests puis construit l'image (onglet *Actions* du dépôt, ou
`gh run list`). Quand c'est vert :

```sh
cd ~/docker/agenda
docker compose pull        # télécharge la nouvelle image
docker compose up -d       # recrée le conteneur avec (tu seras déconnecté : connexion à refaire)
docker image prune -f      # facultatif : supprime les anciennes images
```

Dans Dockge : bouton « Mettre à jour » de la pile `agenda`.

**Revenir à une version précédente** : chaque image a aussi une étiquette courte égale au commit
(`sha-1a2b3c4`). Dans `compose.yaml`, remplace `:latest` par cette étiquette, puis `docker compose up -d`.

---

## Sauvegarde et restauration

- Chaque nuit à 3 h, `~/docker/agenda/sauvegarde.sh` archive `data/` et `config/` de la pile Radicale dans
  `~/docker/agenda/sauvegardes/radicale-AAAAMMJJ-HHMMSS.tar.gz` (les 14 dernières sont gardées ; lisibles par
  toi seul, car `config/` contient les comptes). Journal : `sauvegardes/sauvegarde.log`.
- Sauvegarde à la main, à tout moment : `~/docker/agenda/sauvegarde.sh`
- Lister le contenu d'une archive : `tar -tzf ~/docker/agenda/sauvegardes/radicale-….tar.gz`

**Restaurer** (remet Radicale dans l'état de l'archive ; ce qui a été fait depuis est perdu) :
```sh
cd ~/docker/radicale
docker compose stop                                   # arrêter Radicale pendant la copie
mv data data.avant-restauration                       # garder l'état actuel, au cas où
tar -xzf ~/docker/agenda/sauvegardes/radicale-AAAAMMJJ-HHMMSS.tar.gz data
docker compose start
```
(Remplacer aussi `config` seulement si les comptes ou la configuration sont à restaurer.)

L'agenda lui-même n'a rien à sauvegarder : tout est dans Radicale (ses réglages sont dans `.env`, son code
sur GitHub).

---

## Dépannage

| Symptôme | Que faire |
| --- | --- |
| L'appli affiche « Pi injoignable » | Tailscale est-il activé sur le téléphone ? Le Pi est-il allumé ? `tailscale serve status` sur le Pi doit montrer le relais vers `localhost:8090`. |
| « Installer l'application » n'apparaît pas | passer par l'adresse **https://…ts.net** (pas http), puis recharger une fois la page. |
| La page ne s'ouvre pas | `docker ps` : le conteneur `agenda` tourne-t-il ? `docker logs --tail 50 agenda` pour voir ses messages. Tailscale est-il connecté sur ton appareil ? |
| « Radicale ne répond pas » | `docker ps` : `radicale` tourne-t-il ? Les deux conteneurs sont-ils sur le réseau `radicale_default` (`docker network inspect radicale_default`) ? |
| « Identifiant ou mot de passe incorrect » | ce sont ceux de Radicale (les mêmes que dans AgenDAV / DAVx⁵). |
| « Trop d'essais » | attendre le délai indiqué (15 min), ou redémarrer le conteneur (`docker compose restart` dans `~/docker/agenda`). |
| Déconnecté sans raison | normal après une mise à jour ou un redémarrage du conteneur ou du Pi (mot de passe gardé en mémoire seulement). |
| « Calendrier en lecture seule » | le verrou `WRITABLE_CALENDARS` du `.env` ne l'autorise pas. |
| « Modifié ailleurs entre-temps » | quelqu'un (le téléphone, AgenDAV) a modifié le même élément : la version de Radicale est affichée, refais ta modification. |
| Un abonnement est en erreur | le message dit pourquoi (lien mort, pas un .ics…). Seules les adresses publiques d'Internet sont acceptées (pas le réseau local). Les événements déjà copiés restent affichés. |
| Un abonnement n'est plus à jour sur le téléphone | la copie n'est mise à jour que quand l'agenda est ouvert (il relit le lien à l'ouverture puis toutes les 30 min). |
| « N événements illisibles ignorés » | un fichier de Radicale est mal formé : `docker logs agenda` donne son nom ; il n'est pas modifié. |
| `docker compose pull` refusé (`denied`) | refaire l'étape 1 de l'installation (droit `read:packages` et `docker login ghcr.io`). |
| La sauvegarde ne se fait pas | `crontab -l` doit montrer la ligne ; lire `~/docker/agenda/sauvegardes/sauvegarde.log`. |

---

## Développement

```sh
cd ~/projets/agenda
python3 -m venv .venv && .venv/bin/pip install -r requirements-dev.txt
.venv/bin/pytest                        # tests (conversions iCal, sessions, API contre un Radicale jetable)
.venv/bin/python tools/e2e_navigateur.py   # vrai Chromium ⇄ serveur ⇄ Radicale jetable (≈ 1 min)
```

- Lancer le serveur en local : `PYTHONPATH=backend RADICALE_URL=http://127.0.0.1:5232/ WRITABLE_CALENDARS='dev-*' .venv/bin/uvicorn agenda.main:app --port 8091`
- Les tests ne touchent jamais la vraie pile Radicale : ils lancent leur propre Radicale dans un dossier temporaire.
- `maquette.html` est la maquette d'origine, gardée intacte comme référence.
- Suivi du projet : `PROGRESS.md` (fait, reste à faire, problèmes connus, décisions) et `CLAUDE.md` (consignes).
- Régénérer `requirements.txt` après une mise à jour des bibliothèques : installer les dépendances de production
  dans un environnement propre puis `pip freeze > requirements.txt` (voir l'historique git).

### Sécurité (résumé)

Mot de passe en mémoire seulement ; cookie `HttpOnly` + `SameSite=Strict` ; jeton CSRF + en-tête maison +
contrôle d'origine sur toute écriture ; limitation des essais de connexion ; taille des requêtes limitée ;
politique de sécurité de contenu stricte (aucun script ni ressource externe) ; la correspondance
« événement → fichier Radicale » est gardée côté serveur (l'interface ne peut pas désigner un autre fichier) ;
verrou d'écriture configurable ; liens d'abonnement limités aux adresses publiques ; conteneur non-root, en
lecture seule, sans privilèges.
