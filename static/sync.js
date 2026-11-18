/* ===================== Serveur : connexion, chargement, synchronisation par différence =====================
   Radicale reste l'unique source de vérité. L'interface garde le « dernier état connu du serveur » (SERVER) ;
   après chaque modification (refreshData → onDataChanged), elle compare S à cet état et envoie la différence
   (créations / modifications / suppressions). « Annuler » restaure un instantané : la différence repart d'elle-même.
   Ne comptent pas : la visibilité des calendriers (préférence locale) et les ÉVÉNEMENTS des abonnements : ils sont relus
   depuis leur lien, puis leur COPIE est mise à niveau dans Radicale (mirrorSub), à part ; la liste des abonnements
   (nom, couleur, adresse) passe par la différence comme les autres calendriers.
   En cas de conflit (modifié ailleurs) ou de refus, rien n'est écrasé : message, puis rechargement depuis Radicale. */
const API = { user: null, csrf: null };
let CAL_PREFIX = '';                                 // imposé par le serveur aux nouveaux calendriers (« dev- » pendant les essais)
let SENDING = false, PENDING = false;
const IMPORT_RAW = new Map();
const MIRRORED = new Set(), MIRROR_BUSY = new Set();   // abonnements dont la copie est à jour / en cours d'envoi                        // id → iCal brut d'un événement importé (gardé en entier dans Radicale)
let SERVER = null;                                  // { data, canon } : dernières données reçues du serveur
let SRV_META = { events: {}, calendars: {} };       // ressource, ETag, UID… de chaque événement (hors de S : une copie ne les emporte pas)
let APPLYING = false, LOADING = false;
const RELOAD_EVERY = 5 * 60e3;

async function api(path, opts = {}) {
  const headers = { 'X-Requested-With': 'agenda', ...(API.csrf ? { 'X-CSRF-Token': API.csrf } : {}), ...(opts.body ? { 'Content-Type': 'application/json' } : {}) };
  let r;
  try { r = await fetch(path, { credentials: 'same-origin', cache: 'no-store', ...opts, headers }); }
  catch (e) { return { ok: false, status: 0, body: null }; }   // réseau coupé
  let body = null; try { body = await r.json(); } catch (e) {}
  if (r.status === 401 && path !== '/api/login') sessionLost();
  return { ok: r.ok, status: r.status, body, retryAfter: +(r.headers.get('Retry-After') || 0) };
}

/* Forme comparable (clés triées) : seulement ce qui vit dans Radicale */
const sortKeys = v => Array.isArray(v) ? v.map(sortKeys) : v && typeof v === 'object'
  ? Object.fromEntries(Object.keys(v).sort().filter(k => v[k] !== undefined).map(k => [k, sortKeys(v[k])])) : v;
const calShape = c => ({ id: c.id, name: c.name, color: c.color, ...(c.sub ? { sub: c.sub.url } : {}) });
function canon(cals, evs, dues) {
  const sub = new Set(cals.filter(c => c.sub).map(c => c.id));
  return JSON.stringify(sortKeys({ c: cals.map(calShape), e: evs.filter(e => !sub.has(e.cal)), d: dues }));
}
const canonState = () => canon(S.calendars, S.events, S.dues);
const clone = v => JSON.parse(JSON.stringify(v));
const canonData = d => canon(d.calendars, d.events.map(e => norm(clone(e))), d.dues || []);

/* Met les données du serveur dans S : la visibilité choisie et les abonnements restent tels quels */
function applyServer(data) {
  const vis = new Map(S.calendars.map(c => [c.id, c.visible]));
  const was = new Map(S.calendars.filter(c => c.sub).map(c => [c.id, c]));
  const cals = clone(data.calendars).map(c => {
    const old = was.get(c.id);
    if (c.sub && old && old.sub.url === c.sub.url) c.sub = { ...old.sub };   // déjà lu : on garde son état
    return { ...c, visible: vis.has(c.id) ? vis.get(c.id) : true };
  });
  // Abonnement déjà relu dans cette page : ses événements frais restent ; sinon, ceux de la copie gardée dans Radicale
  const subIds = new Set(cals.filter(c => c.sub && was.has(c.id) && was.get(c.id).sub.url === c.sub.url).map(c => c.id));
  const subEvs = S.events.filter(e => subIds.has(e.cal));
  S.calendars = cals;
  S.events = [...clone(data.events).filter(e => !subIds.has(e.cal)).map(norm), ...subEvs];
  S.dues = clone(data.dues || []);
  SERVER = { data, canon: canonData(data) };
  SRV_META = data.meta || { events: {}, calendars: {} };
  APPLYING = true; try { refreshData(); } finally { APPLYING = false; }
  if (S.calendars.some(c => c.sub && !c.sub.at) && !$('app').hidden) setTimeout(() => syncSubs(), 0);   // abonnements à lire
}

/* Après chaque refreshData() : une modification de l'utilisateur ? → envoyée (après la fin de l'action en cours) */
function onDataChanged() {
  if (APPLYING || !SERVER) return;
  const n = UNDO.length;                    // toast(…, snap) ajoute « Annuler » juste après refreshData()
  queueMicrotask(() => sync(n));
}

/* Revenir à l'état du serveur (modification refusée avant envoi) : l'« Annuler » de l'action disparaît aussi */
function refuse(n, msg, detail) {
  applyServer(SERVER.data);
  UNDO.length = Math.min(UNDO.length, n); REDO.length = 0;
  toast(msg, null, detail);
}

const rec = e => (e.rrule || {}).freq && e.rrule.freq !== 'none';
const same = (a, b) => JSON.stringify(sortKeys(a)) === JSON.stringify(sortKeys(b));

/* Ce qui a changé entre l'état du serveur et S */
function diff() {
  const subIds = new Set(S.calendars.filter(c => c.sub).map(c => c.id));
  const cals = S.calendars.map(c => clone(calShape(c)));
  const evs = S.events.filter(e => !subIds.has(e.cal)).map(clone);
  const sc = new Map(SERVER.data.calendars.map(c => [c.id, calShape(c)]));
  const srvSub = new Set(SERVER.data.calendars.filter(c => c.sub).map(c => c.id));
  const se = new Map(SERVER.data.events.filter(e => !srvSub.has(e.cal)).map(e => [e.id, norm(clone(e))]));
  const nowC = new Map(cals.map(c => [c.id, c])), nowE = new Map(evs.map(e => [e.id, e]));
  const out = { calendars: { create: [], update: [], delete: [] }, events: [] };
  const shape = ({ id, ...c }) => c;
  for (const c of cals) {
    const b = sc.get(c.id);
    if (!b) out.calendars.create.push(c);
    else if (!same(b, c)) out.calendars.update.push({ id: c.id, before: shape(b), after: shape(c) });
  }
  for (const id of sc.keys()) if (!nowC.has(id)) out.calendars.delete.push({ id });
  for (const e of evs) {
    const b = se.get(e.id);
    if (!b) out.events.push({ op: 'create', id: e.id, after: e, ...(IMPORT_RAW.has(e.id) ? { raw: IMPORT_RAW.get(e.id) } : {}) });
    else if (!same(b, e)) out.events.push({ op: 'update', id: e.id, before: b, after: e });
  }
  for (const [id, b] of se) if (!nowE.has(id)) out.events.push({ op: 'delete', id, before: b });
  /* « Cette occurrence seulement » : la série gagne UNE date exclue et UN événement simple apparaît dans le même
     calendrier → c'est une occurrence modifiée (RECURRENCE-ID), écrite dans la ressource de la série. */
  const added = out.events.filter(c => c.op === 'update' && rec(c.before) && rec(c.after) && c.before.cal === c.after.cal)
    .map(c => ({ c, days: c.after.exdates.filter(k => !c.before.exdates.includes(k)) })).filter(x => x.days.length === 1);
  const singles = out.events.filter(c => c.op === 'create' && !rec(c.after));
  if (added.length === 1 && singles.length === 1 && singles[0].after.cal === added[0].c.after.cal)
    singles[0].overrideOf = { series: added[0].c.id, day: added[0].days[0], seriesModel: added[0].c.before };
  // Échéances : tâches VTODO ; « evUid » = l'UID d'un cours d'abonnement (le serveur connaît les autres)
  out.dues = [];
  const sd = new Map((SERVER.data.dues || []).map(d => [d.id, d])), nd = new Map(S.dues.map(d => [d.id, clone(d)]));
  for (const [id, d] of nd) {
    const b = sd.get(id), evUid = getEv(d.ev)?.icsUid;
    if (!b) out.dues.push({ op: 'create', id, after: { ...d, ...(evUid ? { evUid } : {}) } });
    else if (!same(b, d)) out.dues.push({ op: 'update', id, before: b, after: { ...d, ...(evUid ? { evUid } : {}) } });
  }
  for (const [id, b] of sd) if (!nd.has(id)) out.dues.push({ op: 'delete', id, before: b });
  const empty = !out.events.length && !out.dues.length && !out.calendars.create.length && !out.calendars.update.length && !out.calendars.delete.length;
  return { batch: out, empty, target: { calendars: S.calendars.map(clone).map(({ visible, ...c }) => c), events: evs, dues: [...nd.values()] } };
}

function writable(calId, batch) {
  if (batch.calendars.create.some(c => c.id === calId)) return true;
  return !!(SRV_META.calendars[calId] || {}).writable;
}

async function sync(n = UNDO.length) {
  if (!SERVER || APPLYING) return;
  if (SENDING) { PENDING = true; return; }
  const d = diff();
  if (d.empty) return;
  if (d.batch.dues.length && !(SRV_META.tasks || {}).writable)
    return refuse(n, 'Échéances en lecture seule', 'le calendrier des tâches n’est pas modifiable');
  const touched = new Set([...d.batch.calendars.update, ...d.batch.calendars.delete].map(c => c.id));
  d.batch.events.forEach(c => [c.before, c.after].forEach(e => e && touched.add(e.cal)));
  const locked = [...touched].filter(id => !writable(id, d.batch));
  if (locked.length) {
    const names = locked.map(id => (SERVER.data.calendars.find(c => c.id === id) || {}).name || id).join(', ');
    return refuse(n, 'Calendrier en lecture seule', `${names} : modification non enregistrée (essais en cours sur un calendrier de test)`);
  }
  const series = d.batch.events.find(c => c.op === 'update' && ['override', 'occurrence'].includes((SRV_META.events[c.id] || {}).kind) && rec(c.after));
  if (series) return refuse(n, 'Répétition non modifiable ici', 'cette série a été créée sur un autre appareil : change sa répétition depuis le téléphone');

  SENDING = true;
  const r = await api('/api/changes', { method: 'POST', body: JSON.stringify(d.batch) });
  SENDING = false;
  if (r.ok) {
    const removed = new Set(r.body.removed || []);
    d.target.events = d.target.events.filter(e => !removed.has(e.id));
    SERVER.data = { ...SERVER.data, calendars: d.target.calendars.map(c => ({ ...c, visible: true })), events: d.target.events, dues: d.target.dues };
    d.batch.events.forEach(c => IMPORT_RAW.delete(c.id));
    SERVER.canon = canonData(SERVER.data);
    d.batch.calendars.create.forEach(c => { SRV_META.calendars[c.id] = { writable: true, kind: c.sub ? 'subscribed' : 'calendar' }; });
    d.batch.calendars.update.filter(c => c.before.sub && !c.after.sub).forEach(c => { SRV_META.calendars[c.id] = { writable: true, kind: 'calendar' }; });
    d.batch.events.filter(c => c.op === 'create').forEach(c => { SRV_META.events[c.id] = { kind: c.overrideOf ? 'override' : rec(c.after) ? 'series' : 'single' }; });
    d.batch.calendars.create.filter(c => c.sub).forEach(c => { const cal = getCal(c.id); if (cal) mirrorSub(cal); });
    if (removed.size && S.events.some(e => removed.has(e.id))) {   // occurrences parties avec leur série
      S.events = S.events.filter(e => !removed.has(e.id));
      APPLYING = true; try { refreshData(); } finally { APPLYING = false; }
    }
  } else if (r.status !== 401) {
    const why = r.status === 409 ? ['Modifié ailleurs entre-temps', 'rien n’a été écrasé : voici la version de Radicale']
      : r.status === 422 ? ['Modification refusée', (r.body && r.body.error && r.body.error.refused) || 'donnée invalide']
      : ['Radicale injoignable', 'modification non enregistrée'];
    // On recharge la version de Radicale ; si même ça échoue, on remet l'écran dans le dernier état connu du
    // serveur : ce qui n'a pas été enregistré ne doit pas rester affiché (ni repartir plus tard en douce).
    if (!(await loadData({ force: true }))) applyServer(SERVER.data);
    UNDO.length = 0; REDO.length = 0;
    toast(why[0], null, why[1]);
  }
  if (PENDING) { PENDING = false; sync(); }
}

/* Copie d'un abonnement dans Radicale : les événements affichés (passé gardé compris) deviennent son contenu */
async function mirrorSub(c) {
  const m = SRV_META.calendars[c.id];
  if (!c.sub || !m || !['subscribed', 'mirror'].includes(m.kind) || !m.writable || MIRROR_BUSY.has(c.id)) return;
  MIRROR_BUSY.add(c.id);
  try {
    const r = await api('/api/subs/mirror', { method: 'POST', body: JSON.stringify({ cal: c.id, events: S.events.filter(e => e.cal === c.id).map(clone) }) });
    if (r.ok) { MIRRORED.add(c.id); m.kind = 'mirror'; }
  } finally { MIRROR_BUSY.delete(c.id); }
}
function onSubSynced(c, changed) {
  if (!API.user || c.sub.err) return;          // lien en erreur : la copie garde l'état précédent
  if (changed || !MIRRORED.has(c.id)) mirrorSub(c);
}

async function loadData({ force = false } = {}) {
  if (LOADING) return false;
  LOADING = true;
  try {
    const r = await api('/api/data');
    if (!r.ok) {
      if (r.status !== 401) toast('Impossible de lire les calendriers', null, r.status === 502 ? 'Radicale ne répond pas' : 'le serveur ne répond pas');
      return false;
    }
    const firstLoad = !SERVER;
    if (firstLoad || force || canonData(r.body) !== SERVER.canon) {
      applyServer(r.body);
      if (!firstLoad) { UNDO.length = 0; REDO.length = 0; }   // l'historique décrit un état qui n'existe plus
    }
    const bad = (r.body.errors || []).length;
    if (!force && bad && firstLoad) toast(`${bad} événement${bad > 1 ? 's' : ''} illisible${bad > 1 ? 's' : ''} ignoré${bad > 1 ? 's' : ''}`, null, 'voir le journal du serveur');
    return true;
  } finally { LOADING = false; }
}

/* Rechargement (changements faits sur le téléphone…) : jamais pendant une saisie ou un glisser */
const busy = () => !!document.querySelector('.pop, .fc-event-dragging, .fc-event-resizing, .fc-event-mirror')
  || [...document.querySelectorAll('[id$="-scrim"]')].some(el => !el.hidden);
function reloadSoon() { if (API.user && !document.hidden && !busy() && !SENDING && !PENDING) loadData(); }
setInterval(reloadSoon, RELOAD_EVERY);
document.addEventListener('visibilitychange', () => { if (!document.hidden) reloadSoon(); });

function showUser(user) {
  const who = document.querySelector('.who'), av = document.querySelector('.avatar');
  if (who && who.firstChild) who.firstChild.textContent = user;
  if (av) av.textContent = (user[0] || '?').toUpperCase();
}
function clearData() {
  API.user = null; API.csrf = null; SERVER = null; SRV_META = { events: {}, calendars: {} };
  S.calendars = []; S.events = []; S.dues = []; UNDO.length = 0; REDO.length = 0;
  APPLYING = true; try { refreshData(); } finally { APPLYING = false; }
}
function sessionLost() {
  if (!API.user) return;
  clearData(); showLogin(); toast('Session expirée', null, 'reconnecte-toi pour retrouver tes calendriers');
}

async function serverLogin(user, password, remember) {
  const b = $('l-submit'), err = $('l-pass-err');
  const fail = msg => {
    b.textContent = 'Se connecter'; b.disabled = false;
    err.textContent = msg; err.hidden = false; $('l-pass').setAttribute('aria-invalid', 'true');
    const c = $('login-form'); c.classList.remove('shake'); void c.offsetWidth; c.classList.add('shake');
    $('l-pass').select();
  };
  const r = await api('/api/login', { method: 'POST', body: JSON.stringify({ user, password, remember }) });
  if (!r.ok) {
    if (r.status === 401) return fail('Identifiant ou mot de passe incorrect.');
    if (r.status === 429) return fail(`Trop d’essais. Réessaie dans ${Math.max(1, Math.ceil(r.retryAfter / 60))} min.`);
    return fail(r.status === 502 ? 'Radicale ne répond pas. Réessaie dans un instant.' : 'Serveur injoignable. Réessaie dans un instant.');
  }
  API.user = r.body.user; API.csrf = r.body.csrf; CAL_PREFIX = r.body.calPrefix || '';
  if (!(await loadData())) { API.user = null; return fail('Connexion réussie, mais les calendriers sont illisibles.'); }
  b.textContent = 'Se connecter'; b.disabled = false; $('l-pass').value = '';
  showUser(API.user); showApp();
}

async function serverLogout() {
  if (API.user) await api('/api/logout', { method: 'POST' });
  clearData(); showLogin();
}

/* Démarrage : session encore valide (« Rester connecté ») → directement l'agenda ; Pi injoignable → écran dédié */
const unreachable = r => r.status === 0 || r.status === 502 || r.status === 503 || r.status === 504;
let BOOTING = false, OFF_TIMER = null;
function showOffline() {
  $('app').hidden = true; $('login').hidden = true; document.querySelector('.fab').hidden = true;
  $('offline').hidden = false; $('off-st').textContent = 'Nouvel essai automatique dès que le réseau revient.';
  clearInterval(OFF_TIMER); OFF_TIMER = setInterval(() => { if (!document.hidden) boot(); }, 20e3);
}
async function boot() {
  if (BOOTING) return;
  BOOTING = true;
  try {
    $('app').hidden = true; document.querySelector('.fab').hidden = true;   // rien d'affiché tant qu'on ne sait pas
    if (!$('offline').hidden) $('off-st').textContent = 'Connexion au Pi…';
    const r = await api('/api/session');
    if (unreachable(r)) return showOffline();
    $('offline').hidden = true; clearInterval(OFF_TIMER);
    if (r.ok) {
      API.user = r.body.user; API.csrf = r.body.csrf; CAL_PREFIX = r.body.calPrefix || '';
      if (await loadData()) { showUser(API.user); showApp(); return; }
      API.user = null;
    }
    showLogin();
  } finally { BOOTING = false; }
}
$('off-retry').addEventListener('click', boot);
addEventListener('online', () => { if (!$('offline').hidden) boot(); });
boot();

/* Appli installable : le service worker garde l'interface (jamais les données) pour s'ouvrir hors connexion.
   Seulement en HTTPS (adresse Tailscale) : le navigateur le refuse en HTTP simple. */
if ('serviceWorker' in navigator && window.isSecureContext)
  addEventListener('load', () => navigator.serviceWorker.register('/sw.js').catch(() => {}));
