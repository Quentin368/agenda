/* ===================== Serveur : connexion, chargement, lecture seule (phase 2) =====================
   Radicale reste l'unique source de vérité. L'interface garde le « dernier état connu du serveur » (SERVER) ;
   après chaque modification (refreshData → onDataChanged), elle compare S à cet état.
   Phase 2 : toute différence est annulée avec un message (lecture seule). Phase 3 : elle sera envoyée au serveur.
   Ne comptent pas : la visibilité des calendriers (préférence locale) et les abonnements (jamais écrits dans Radicale). */
const API = { user: null, csrf: null };
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
function canon(cals, evs, dues) {
  const sub = new Set(cals.filter(c => c.sub).map(c => c.id));
  return JSON.stringify(sortKeys({
    c: cals.filter(c => !c.sub).map(({ visible, ...c }) => c),
    e: evs.filter(e => !sub.has(e.cal)),
    d: dues
  }));
}
const canonState = () => canon(S.calendars, S.events, S.dues);
const clone = v => JSON.parse(JSON.stringify(v));
const canonData = d => canon(d.calendars, d.events.map(e => norm(clone(e))), d.dues || []);

/* Met les données du serveur dans S : la visibilité choisie et les abonnements restent tels quels */
function applyServer(data) {
  const vis = new Map(S.calendars.map(c => [c.id, c.visible]));
  const subs = S.calendars.filter(c => c.sub), subIds = new Set(subs.map(c => c.id));
  const subEvs = S.events.filter(e => subIds.has(e.cal));
  S.calendars = [...clone(data.calendars).map(c => ({ ...c, visible: vis.has(c.id) ? vis.get(c.id) : true })), ...subs];
  S.events = [...clone(data.events).map(norm), ...subEvs];
  S.dues = clone(data.dues || []);
  SERVER = { data, canon: canonData(data) };
  SRV_META = data.meta || { events: {}, calendars: {} };
  APPLYING = true; try { refreshData(); } finally { APPLYING = false; }
}

/* Après chaque refreshData() : une modification de l'utilisateur ? (phase 2 : refusée) */
function onDataChanged() {
  if (APPLYING || !SERVER) return;
  const n = UNDO.length;                    // toast(…, snap) ajoute « Annuler » juste après refreshData()
  queueMicrotask(() => {
    if (!SERVER || canonState() === SERVER.canon) return;
    applyServer(SERVER.data);
    UNDO.length = Math.min(UNDO.length, n); REDO.length = 0;
    toast('Lecture seule pour l’instant', null, 'modification non enregistrée dans Radicale');
  });
}

async function loadData() {
  if (LOADING) return false;
  LOADING = true;
  try {
    const r = await api('/api/data');
    if (!r.ok) {
      if (r.status !== 401) toast('Impossible de lire les calendriers', null, r.status === 502 ? 'Radicale ne répond pas' : 'le serveur ne répond pas');
      return false;
    }
    const firstLoad = !SERVER;
    if (firstLoad || canonData(r.body) !== SERVER.canon) {
      applyServer(r.body);
      if (!firstLoad) { UNDO.length = 0; REDO.length = 0; }   // l'historique décrit un état qui n'existe plus
    }
    const bad = (r.body.errors || []).length;
    if (bad && firstLoad) toast(`${bad} événement${bad > 1 ? 's' : ''} illisible${bad > 1 ? 's' : ''} ignoré${bad > 1 ? 's' : ''}`, null, 'voir le journal du serveur');
    return true;
  } finally { LOADING = false; }
}

/* Rechargement (changements faits sur le téléphone…) : jamais pendant une saisie ou un glisser */
const busy = () => !!document.querySelector('.pop, .fc-event-dragging, .fc-event-resizing, .fc-event-mirror')
  || [...document.querySelectorAll('[id$="-scrim"]')].some(el => !el.hidden);
function reloadSoon() { if (API.user && !document.hidden && !busy()) loadData(); }
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
  API.user = r.body.user; API.csrf = r.body.csrf;
  if (!(await loadData())) { API.user = null; return fail('Connexion réussie, mais les calendriers sont illisibles.'); }
  b.textContent = 'Se connecter'; b.disabled = false; $('l-pass').value = '';
  showUser(API.user); showApp();
}

async function serverLogout() {
  if (API.user) await api('/api/logout', { method: 'POST' });
  clearData(); showLogin();
}

/* Démarrage : session encore valide (« Rester connecté ») → directement l'agenda */
(async () => {
  $('app').hidden = true; document.querySelector('.fab').hidden = true;   // rien d'affiché tant qu'on ne sait pas
  const r = await api('/api/session');
  if (r.ok) {
    API.user = r.body.user; API.csrf = r.body.csrf;
    if (await loadData()) { showUser(API.user); showApp(); return; }
    API.user = null;
  }
  showLogin();
})();
