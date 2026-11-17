/* ===================== Icônes ===================== */
const ICON = {
  left: '<path d="M15 6l-6 6 6 6"/>', right: '<path d="M9 6l6 6-6 6"/>', plus: '<path d="M12 5v14M5 12h14"/>',
  menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
  x: '<path d="M6.5 6.5l11 11M17.5 6.5l-11 11"/>',
  trash: '<path d="M4.5 7h15M10 11v6M14 11v6M6.5 7l.8 11.5a2 2 0 0 0 2 1.5h5.4a2 2 0 0 0 2-1.5L17.5 7M9.5 7V4.5h5V7"/>',
  pin: '<path d="M12 21s-6.5-5.8-6.5-11a6.5 6.5 0 0 1 13 0c0 5.2-6.5 11-6.5 11z"/><circle cx="12" cy="10" r="2.4"/>',
  clock: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>',
  lock: '<path d="M8 10.5V7a4 4 0 0 1 8 0v3.5" stroke-width="2.2"/><path fill="currentColor" stroke="none" fill-rule="evenodd" d="M7.5 10h9A2.5 2.5 0 0 1 19 12.5v6a2.5 2.5 0 0 1-2.5 2.5h-9A2.5 2.5 0 0 1 5 18.5v-6A2.5 2.5 0 0 1 7.5 10zM12 13.6a1.6 1.6 0 1 0 0 3.2a1.6 1.6 0 1 0 0-3.2z"/>',   /* cadenas plein, anse haute : lisible à 11 px */
  repeat: '<path d="M17 3l3 3-3 3"/><path d="M4 12v-1a5 5 0 0 1 5-5h11"/><path d="M7 21l-3-3 3-3"/><path d="M20 12v1a5 5 0 0 1-5 5H4"/>',
  bell: '<path d="M6 16v-5a6 6 0 1 1 12 0v5l1.5 2h-15z"/><path d="M10 20.5a2 2 0 0 0 4 0"/>',
  text: '<path d="M5 7h14M5 12h14M5 17h9"/>',
  cal: '<rect x="3.5" y="5" width="17" height="15.5" rx="3.5"/><path d="M3.5 10h17M8 3v4M16 3v4"/>',
  link: '<path d="M10 14a4.5 4.5 0 0 0 6.4 0l3-3a4.5 4.5 0 0 0-6.4-6.4l-1.1 1.1"/><path d="M14 10a4.5 4.5 0 0 0-6.4 0l-3 3a4.5 4.5 0 0 0 6.4 6.4l1.1-1.1"/>',
  crown: '<path d="M3.5 8.2l4.4 3.9L12 5l4.1 7.1 4.4-3.9-1.7 10.3H5.2z"/>',
  home: '<path d="M4 11.2L12 4.5l8 6.7"/><path d="M6.2 9.6V20h11.6V9.6"/><path d="M10 20v-5.2h4V20"/>',
  gift: '<rect x="3.5" y="8.5" width="17" height="4" rx="1"/><path d="M5.2 12.5V20h13.6v-7.5M12 8.5V20"/><path d="M12 8.5C10.8 5 7 4.4 7 6.6c0 1.4 2.3 1.9 5 1.9zM12 8.5c1.2-3.5 5-4.1 5-1.9 0 1.4-2.3 1.9-5 1.9z"/>',
  unlink: '<path d="M13.4 5.7l1.1-1.1a4.5 4.5 0 0 1 6.4 6.4l-2.2 2.2"/><path d="M10.6 18.3l-1.1 1.1a4.5 4.5 0 0 1-6.4-6.4l2.2-2.2"/><path d="M8 3v2.5M3 8h2.5M16 21v-2.5M21 16h-2.5"/>',
  import: '<path d="M12 4v10.5M7.5 10l4.5 4.5 4.5-4.5"/><path d="M4.5 14.5v3a2.5 2.5 0 0 0 2.5 2.5h10a2.5 2.5 0 0 0 2.5-2.5v-3"/>',
  dots: '<circle cx="5.5" cy="12" r="1.2" fill="currentColor"/><circle cx="12" cy="12" r="1.2" fill="currentColor"/><circle cx="18.5" cy="12" r="1.2" fill="currentColor"/>',
  check: '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
  eye: '<path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z"/><circle cx="12" cy="12" r="3"/>',
  eyeoff: '<path d="M3 3l18 18"/><path d="M10.6 5.6A9.6 9.6 0 0 1 12 5.5c6 0 9.5 6.5 9.5 6.5a16 16 0 0 1-3 3.8M6.6 6.6C4 8.3 2.5 12 2.5 12S6 18.5 12 18.5a9 9 0 0 0 4.4-1.1"/><path d="M9.9 9.9a3 3 0 0 0 4.2 4.2"/>',
  logout: '<path d="M14 4h3.5A2.5 2.5 0 0 1 20 6.5v11a2.5 2.5 0 0 1-2.5 2.5H14"/><path d="M10 16l-4-4 4-4M6 12h10"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M5.3 18.7l1.4-1.4M17.3 6.7l1.4-1.4"/>',
  moon: '<path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z"/>',
  monitor: '<rect x="3" y="4.5" width="18" height="12" rx="2.5"/><path d="M9 20h6M12 16.5V20"/>',
  cake: '<path d="M4 20.5h16v-6.5a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2z"/><path d="M4 16c2 1.2 3.3 1.2 5.3 0s3.4-1.2 5.4 0 3.3 1.2 5.3 0"/><path d="M12 12V8"/><path d="M12 3.5c.8.9 1.2 1.6 1.2 2.2a1.2 1.2 0 0 1-2.4 0c0-.6.4-1.3 1.2-2.2z"/>',
  history: '<path d="M3.5 12a8.5 8.5 0 1 0 2.6-6.1"/><path d="M3.5 4.5v4h4"/><path d="M12 8v4l3 2"/>',
  down: '<path d="M6 9l6 6 6-6"/>',
  up: '<path d="M6 15l6-6 6 6"/>',
  search: '<circle cx="11" cy="11" r="6.5"/><path d="M20 20l-4.2-4.2"/>',
  copy: '<rect x="8.5" y="8.5" width="11" height="11" rx="2.5"/><path d="M15.5 8.5V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v7.5a2 2 0 0 0 2 2h2.5"/>',
  alert: '<path d="M12 4l9 15.5H3z"/><path d="M12 10v4M12 17h.01"/>',
  flag: '<path d="M5 21V4"/><path d="M5 4h12l-2.5 4.5L17 13H5"/>',
  list: '<path d="M9 6h11M9 12h11M9 18h11"/><path d="M4.5 6h.01M4.5 12h.01M4.5 18h.01" stroke-width="3"/>',
  gear: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/>'
};
const svg = (n, cls = '') => `<svg class="ic ${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICON[n]}</svg>`;
function paintIcons(root = document) { root.querySelectorAll('[data-ic]').forEach(el => {
  el.insertAdjacentHTML('afterbegin', svg(el.dataset.ic)); el.removeAttribute('data-ic');
  if (el.tagName === 'SPAN' && !el.className && /^(BUTTON|A)$/.test(el.parentElement?.tagName)) el.classList.add('ic-wrap');   // icône devant un libellé : centrée sur le texte
}); }
paintIcons();

/* ===================== Dates ===================== */
/* TODAY suit le calendrier réel : l'horloge (voir « Horloge », en bas) le fait passer au lendemain à minuit.
   Pour l'heure, chaque fonction lit new Date() au moment où elle en a besoin. */
let TODAY = (d => new Date(d.getFullYear(), d.getMonth(), d.getDate()))(new Date());
const DAY = 864e5;
const pad = n => String(n).padStart(2, '0');
const key = d => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const hm = d => `${pad(d.getHours())}:${pad(d.getMinutes())}`;
const toStr = (d, allDay) => allDay ? key(d) : `${key(d)}T${hm(d)}`;
function parse(s) { const [a, b] = s.split('T'); const [y, m, d] = a.split('-').map(Number); if (!b) return new Date(y, m - 1, d); const [h, mi] = b.split(':').map(Number); return new Date(y, m - 1, d, h, mi); }
const addDays = (d, n) => { const x = new Date(d); x.setDate(x.getDate() + n); return x; };
const sod = d => new Date(d.getFullYear(), d.getMonth(), d.getDate());
const isoDow = d => (d.getDay() + 6) % 7 + 1;
const daysBetween = (a, b) => Math.round((sod(b) - sod(a)) / DAY);
const dim = d => new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate(); // jours dans le mois
function durText(ms) {
  const m = Math.round(ms / 60e3); if (m < 60) return `${m} min`;
  const h = Math.floor(m / 60), r = m % 60;
  if (r === 0 && h >= 24 && h % 24 === 0) { const d = h / 24; return `${d} jour${d > 1 ? 's' : ''}`; }
  return r ? `${h} h ${pad(r)}` : `${h} h`;
}
function inText(ms) {
  const m = Math.round(ms / 60e3); if (m < 1) return 'maintenant'; if (m < 60) return `dans ${m} min`;
  if (m < 1440) { const h = Math.floor(m / 60), r = m % 60; return r ? `dans ${h} h ${pad(r)}` : `dans ${h} h`; }
  const d = Math.round(m / 1440); return `dans ${d} jour${d > 1 ? 's' : ''}`;
}
function isoWeek(date) { const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())); const day = d.getUTCDay() || 7; d.setUTCDate(d.getUTCDate() + 4 - day); const y0 = new Date(Date.UTC(d.getUTCFullYear(), 0, 1)); return Math.ceil(((d - y0) / DAY + 1) / 7); }
const F = (o) => new Intl.DateTimeFormat('fr-FR', o);
const fDow = F({ weekday: 'short' }), fDowL = F({ weekday: 'long' }), fD = F({ day: 'numeric' }), fDM = F({ day: 'numeric', month: 'long' }),
  fDMs = F({ day: 'numeric', month: 'short' }), fMY = F({ month: 'long', year: 'numeric' }), fM = F({ month: 'long' }), fMs = F({ month: 'short' }),
  fWDM = F({ weekday: 'long', day: 'numeric', month: 'long' }), fWDMY = F({ weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }), fWDMs = F({ weekday: 'short', day: 'numeric', month: 'short' });
const cap = s => s.charAt(0).toUpperCase() + s.slice(1);
const fold = s => String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();   // sans accents, en minuscules
const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const DOW_LETTERS = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];
const DOW_NAMES = ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche'];
const fmtT = d => d.getMinutes() ? `${d.getHours()}h${pad(d.getMinutes())}` : `${d.getHours()}h`;
/* Jours fériés en France (Pâques par l'algorithme de Meeus) */
const _hol = {};
function holidays(y) {
  if (_hol[y]) return _hol[y];
  const a = y % 19, b = Math.floor(y / 100), c = y % 100, d = Math.floor(b / 4), e = b % 4, f = Math.floor((b + 8) / 25), g = Math.floor((b - f + 1) / 3),
    h = (19 * a + b - d - g + 15) % 30, i = Math.floor(c / 4), k = c % 4, l = (32 + 2 * e + 2 * i - h - k) % 7, m = Math.floor((a + 11 * h + 22 * l) / 451),
    n = h + l - 7 * m + 114, E = new Date(y, Math.floor(n / 31) - 1, n % 31 + 1);
  return (_hol[y] = { [`${y}-01-01`]: "Jour de l'an", [key(addDays(E, 1))]: 'Lundi de Pâques', [`${y}-05-01`]: 'Fête du Travail', [`${y}-05-08`]: 'Victoire 1945',
    [key(addDays(E, 39))]: 'Ascension', [key(addDays(E, 50))]: 'Lundi de Pentecôte', [`${y}-07-14`]: 'Fête nationale', [`${y}-08-15`]: 'Assomption',
    [`${y}-11-01`]: 'Toussaint', [`${y}-11-11`]: 'Armistice 1918', [`${y}-12-25`]: 'Noël' });
}
const hol = d => holidays(d.getFullYear())[key(d)];

/* ===================== Données ===================== */
/* Rangées par teinte, de 20° en 20° environ : deux calendriers voisins restent distincts même en pastel */
const COLORS = [['red', 'Rouge'], ['orange', 'Orange'], ['amber', 'Ambre'], ['olive', 'Olive'], ['green', 'Vert'], ['mint', 'Menthe'], ['teal', 'Turquoise'], ['sky', 'Ciel'],
  ['blue', 'Bleu'], ['violet', 'Violet'], ['plum', 'Prune'], ['fuchsia', 'Fuchsia'], ['pink', 'Rose'], ['brown', 'Brun'], ['slate', 'Ardoise'], ['graphite', 'Graphite']];
const S = {
  dues: [],   // échéances : un titre rattaché à un événement (voir « Échéances »)
  calendars: [],
  events: []
};
S.events.forEach(norm);
function norm(e) { e.rrule = e.rrule || { freq: 'none' }; e.exdates = e.exdates || []; e.loc = e.loc || ''; e.desc = e.desc || ''; e.rem = e.rem || 'none'; e.allDay = !!e.allDay; return e; }
/* Recherche par id, indexée : l'index est refait quand la liste change (dirty(), autre tableau, autre longueur) */
let _evIdx = null, _evArr = null, _evLen = -1;
const getEv = id => {
  if (!_evIdx || _evArr !== S.events || _evLen !== S.events.length) { _evIdx = new Map(S.events.map(e => [e.id, e])); _evArr = S.events; _evLen = S.events.length; }
  return _evIdx.get(id);
};
const getCal = id => S.calendars.find(c => c.id === id);
const isRec = e => e.rrule && e.rrule.freq !== 'none';
const isSub = ev => !!getCal(ev?.cal)?.sub;   // événement d'un abonnement : lecture seule
/* Fin inconnue : l'événement occupe une heure dans la grille pour rester lisible, mais s'efface vers le bas
   et n'affiche que son heure de début — aucune heure de fin n'est inventée */
const OPEN_LEN = 3600e3;
const isOpen = ev => !!ev?.openEnd && !ev.allDay;
const endTxt = (ev, end) => isOpen(ev) ? ' · fin inconnue' : ` – ${hm(end)}`;
const calVar = calId => `var(--cal-${(getCal(calId) || { color: 'slate' }).color})`;
let uidN = 100; const uid = p => `${p}${++uidN}`;
/* ===================== Échéances =====================
   Une échéance, c'est un titre (« Dossier marketing ») rattaché à un événement : le cours où on le rend, l'oral, le partiel…
   Elle prend la date de l'événement et s'affiche dessus, à gauche du titre, avec le compte à rebours ; on la coche quand c'est fait.
   Rangée à part des événements : un cours d'abonnement (lecture seule) peut en porter, et sa mise à jour ne les efface pas.
   Statuts : later (plus tard), soon (≤ 7 jours), today, late (en retard), done. */
function dueInfo(ev) {
  const s = parse(ev.start), now = new Date(), n = daysBetween(TODAY, s), pl = k => k > 1 ? 's' : '';
  if (ev.done) return { st: 'done', n, short: 'Fait', long: 'Fait' };
  if (ev.allDay ? n < 0 : s <= now) {
    const k = Math.max(0, daysBetween(s, TODAY));
    return { st: 'late', n, short: k ? `J+${k}` : 'Passée', long: k ? `En retard de ${k} jour${pl(k)}` : 'Heure passée' };
  }
  if (n === 0) return { st: 'today', n, short: 'Auj.', long: ev.allDay ? 'Aujourd’hui' : `Aujourd’hui, ${inText(s - now)}` };
  return { st: n <= 7 ? 'soon' : 'later', n, short: `J-${n}`, long: n === 1 ? 'Demain' : `Dans ${n} jours` };
}
/* L'occurrence visée, à jour : un événement qu'on déplace emmène ses échéances. S'il a disparu (supprimé, ou déplacé
   par sa source), on cherche le même titre le même jour ; sinon on garde la dernière date connue. */
function dueAt(d) {
  let ev = getEv(d.ev);
  if (!ev) { ev = S.events.find(e => !isRec(e) && e.title === d.title && e.cal === d.cal && key(parse(e.start)) === key(parse(d.start))) || null; if (ev) d.ev = ev.id; }
  if (ev && isRec(ev) && !occExists(ev, d.occ)) ev = null;   // occurrence supprimée, ou hors de la série coupée
  if (ev) {
    const o = isRec(ev) ? occurrenceOf(ev, d.occ) : { start: parse(ev.start), occKey: key(parse(ev.start)) };
    return { ev, start: o.start, occ: o.occKey, allDay: ev.allDay, title: ev.title, cal: ev.cal };
  }
  return { ev: null, start: parse(d.start), occ: d.occ, allDay: d.allDay, title: d.title, cal: d.cal };
}
const dueState = d => { const x = dueAt(d); return { d, x, s: x.start, i: dueInfo({ start: toStr(x.start, x.allDay), allDay: x.allDay, done: d.done }) }; };
const dueList = () => S.dues.map(dueState).filter(o => !o.x.ev || getCal(o.x.cal)?.visible);
let _dueOn = null;   // « idÉvénement » ou « idSérie@jour » → son échéance (une seule par événement) ; vidé par dirty()
function dueFor(ev, occKey) {
  if (!_dueOn) {
    _dueOn = new Map();
    S.dues.forEach(d => { const x = dueAt(d); if (!x.ev) return; const k = isRec(x.ev) ? `${x.ev.id}@${x.occ}` : x.ev.id; if (!_dueOn.has(k)) _dueOn.set(k, d); });
  }
  return _dueOn.get(isRec(ev) ? `${ev.id}@${occKey}` : ev.id) || null;
}
/* La pastille, à gauche du titre : drapeau + J-n, de la couleur de l'urgence */
function dueBadge(d) {
  const { i } = dueState(d);
  return { st: i.st, html: `<span class="due-b ${i.st}" title="${esc(`Échéance : ${d.t} — ${i.long.toLowerCase()}`)}">${svg(i.st === 'done' ? 'check' : 'flag')}<span>${i.short}</span></span>` };
}
/* Une échéance suit son occurrence quand celle-ci change d'événement (déplacée seule, série coupée) ou de jour */
function moveDues(fromId, keep, toId, dDays = 0) {
  S.dues.forEach(d => { if (d.ev === fromId && keep(d.occ)) { d.ev = toId; d.occ = key(addDays(parse(d.occ), dDays)); } });
}
function addDue(t, ev, occKey) {
  const had = dueFor(ev, occKey); if (had) { renameDue(had.id, t); return had; }   // une seule par événement : on renomme
  const o = isRec(ev) ? occurrenceOf(ev, occKey) : { start: parse(ev.start), occKey: key(parse(ev.start)) };
  const d = { id: uid('k'), t, ev: ev.id, occ: o.occKey, title: ev.title, start: toStr(o.start, ev.allDay), allDay: ev.allDay, cal: ev.cal };
  const snap = snapshot(); S.dues.push(d); refreshData(dueCals(d));
  toast('Échéance ajoutée', snap, { title: t, rest: `${dueState(d).i.long.toLowerCase()} · ${ev.title}` });
  return d;
}
function toggleDone(id) {
  const d = S.dues.find(x => x.id === id); if (!d) return;
  const snap = snapshot(); if (d.done) delete d.done; else d.done = key(TODAY);
  refreshData(dueCals(d));
  toast(d.done ? 'Échéance faite' : 'Échéance rouverte', snap, { title: d.t, rest: d.done ? 'marquée comme faite' : `à refaire · ${dueState(d).i.long.toLowerCase()}` });
}
function deleteDue(id) {
  const d = S.dues.find(x => x.id === id); if (!d) return;
  const snap = snapshot(); S.dues = S.dues.filter(x => x !== d); refreshData(dueCals(d));
  toast('Échéance supprimée', snap, { title: d.t, rest: 'supprimée' });
}
const dueCals = d => [getEv(d.ev)?.cal].filter(Boolean);   // seul le calendrier de l'événement se redessine : les autres ne clignent pas
function renameDue(id, t) {
  const d = S.dues.find(x => x.id === id); t = t.trim();
  if (!d || !t || t === d.t) return;
  const snap = snapshot(); d.t = t; refreshData(dueCals(d)); toast('Échéance renommée', snap, { title: t, rest: 'renommée' });
}
const isBday = ev => ev.rrule?.freq === 'yearly' && ev.allDay && (!!ev.person || ev.cal === 'anniv');
const ageAt = (ev, d) => { if (!ev.born) return null; const a = d.getFullYear() - ev.born; return a > 0 ? a : null; };
const personOf = ev => ev.person || ev.title.replace(/^Anniversaire (de |d’|d')/i, '');
/* Anniversaires : favoris (couronne, rappel la veille en plus), groupes (pour filtrer), idées cadeaux (rappelées quand l'anniversaire approche) */
const BD_GROUPS = ['Famille', 'Amis', 'Promo', 'Travail'];
const GRP_COL = { famille: 'red', amis: 'sky', promo: 'violet', travail: 'slate' }, GRP_MORE = ['teal', 'olive', 'amber', 'mint', 'plum', 'brown', 'orange', 'green'];
const grpCol = g => `var(--cal-${GRP_COL[fold(g)] || GRP_MORE[[...fold(g)].reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 7) % GRP_MORE.length]})`;
const isFam = ev => fold(ev.group || '') === 'famille';
const bdIcon = (ev, cls = 'ev-ic') => svg(ev.fav ? 'crown' : isFam(ev) ? 'home' : 'cake', cls + (ev.fav ? ' crown' : ''));
const giftIdeas = ev => (ev.gifts || []).filter(g => !g.y);
const bdGroups = () => { const seen = new Map(); [...BD_GROUPS, ...S.events.filter(isBday).map(e => e.group).filter(Boolean)].forEach(g => { if (!seen.has(fold(g))) seen.set(fold(g), g); }); return [...seen.values()]; };
const dueShort = n => n === 0 ? "Aujourd'hui" : n === 1 ? 'Demain' : `Dans ${n} j`;
function relShort(n) {
  if (n === 0) return "Aujourd'hui"; if (n === 1) return 'Demain'; if (n === -1) return 'Hier';
  const a = Math.abs(n), t = a >= 365 ? `${Math.floor(a / 365)} an${a >= 730 ? 's' : ''}` : a >= 60 ? `${Math.round(a / 30)} mois` : `${a} j`;
  return n > 0 ? `Dans ${t}` : `Il y a ${t}`;
}

/* Développe un événement (récurrent ou non) sur une plage */
/* La fin d'une occurrence : une journée se compte en jours (le jour du changement d'heure dure 23 ou 25 h), une heure en durée */
const occEnd = (ev, os, s, e) => ev.allDay ? addDays(os, daysBetween(s, e)) : new Date(os.getTime() + (e - s));
const monthsBetween = (a, b) => (b.getFullYear() - a.getFullYear()) * 12 + b.getMonth() - a.getMonth();
function expand(ev, rs, re) {
  const s = parse(ev.start), e = parse(ev.end), dur = e - s, out = [];
  const mk = os => ({ ev, occKey: key(os), start: os, end: occEnd(ev, os, s, e) });
  if (!isRec(ev)) { if (s < re && e > rs) out.push(mk(s)); return out; }
  const r = ev.rrule;
  const limit = r.until ? Math.min(addDays(parse(r.until), 1).getTime(), re.getTime()) : re.getTime();
  let d = sod(new Date(Math.max(s.getTime(), rs.getTime() - dur - DAY)));
  if (d < sod(s)) d = sod(s);
  const days = r.days && r.days.length ? r.days : [isoDow(s)], n = r.interval > 1 ? r.interval : 1, mon0 = addDays(sod(s), 1 - isoDow(s));
  for (; d.getTime() < limit; d = addDays(d, 1)) {
    let ok = false;
    if (r.freq === 'daily') ok = daysBetween(s, d) % n === 0;
    else if (r.freq === 'weekly') ok = days.includes(isoDow(d)) && Math.floor(daysBetween(mon0, d) / 7) % n === 0;   // « une semaine sur deux »
    else if (r.freq === 'monthly') ok = d.getDate() === Math.min(s.getDate(), dim(d)) && monthsBetween(s, d) % n === 0; // le 31 → dernier jour des mois courts
    else if (r.freq === 'yearly') ok = d.getMonth() === s.getMonth() && d.getDate() === Math.min(s.getDate(), dim(d)) && (d.getFullYear() - s.getFullYear()) % n === 0; // 29 févr. → 28 les années non bissextiles
    if (!ok || ev.exdates.includes(key(d))) continue;
    const os = new Date(d); os.setHours(s.getHours(), s.getMinutes());
    const o = mk(os); if (o.end > rs && o.start < re) out.push(o);
  }
  return out;
}
function occurrences(rs, re, { all = false } = {}) {
  const out = [];
  S.events.forEach(ev => { const c = getCal(ev.cal); if (!c || (!all && !c.visible)) return; out.push(...expand(ev, rs, re)); });
  return out.sort((a, b) => a.start - b.start);
}
function occurrenceOf(ev, occKey) {
  const s = parse(ev.start), e = parse(ev.end);
  const os = parse(occKey); os.setHours(s.getHours(), s.getMinutes());
  return { ev, occKey, start: os, end: occEnd(ev, os, s, e) };
}
/* Cette date est-elle bien une occurrence de l'événement (pas supprimée, pas hors de la série) ? */
function occExists(ev, occKey) {
  if (!isRec(ev)) return key(parse(ev.start)) === occKey;
  const d = parse(occKey); return expand(ev, d, addDays(d, 1)).some(o => o.occKey === occKey);
}
function ruleText(ev) {
  const r = ev.rrule; if (!isRec(ev)) return '';
  const s = parse(ev.start); let t = '';
  if (r.interval > 1) {
    const u = { daily: 'jours', weekly: 'semaines', monthly: 'mois', yearly: 'ans' }[r.freq];
    t = `Tous les ${r.interval} ${u}`;
    if (r.freq === 'weekly') t += ' : ' + (r.days && r.days.length ? r.days : [isoDow(s)]).slice().sort().map(d => DOW_NAMES[d - 1]).join(', ');
  } else if (r.freq === 'daily') t = 'Chaque jour';
  else if (r.freq === 'weekly') {
    const days = (r.days && r.days.length ? r.days : [isoDow(s)]).slice().sort();
    if (days.length === 1) t = `Chaque ${DOW_NAMES[days[0] - 1]}`;
    else if (days.join() === '1,2,3,4,5') t = 'Chaque jour de semaine';
    else t = 'Chaque semaine : ' + days.map(d => DOW_NAMES[d - 1].slice(0, 3) + '.').join(', ');
  } else if (r.freq === 'monthly') t = `Chaque mois, le ${s.getDate()}`;
  else if (r.freq === 'yearly') t = `Chaque année, le ${fDM.format(s)}`;
  if (r.until) t += ` · jusqu'au ${fDM.format(parse(r.until))} ${parse(r.until).getFullYear()}`;
  return t;
}
function whenText(o) {
  const { start: s, end: e } = o; const allDay = o.ev.allDay;
  if (isOpen(o.ev)) return `${cap(fWDMY.format(s))}\n${hm(s)} · heure de fin inconnue`;
  if (allDay) { const last = addDays(e, -1); return key(s) === key(last) ? cap(fWDMY.format(s)) : `${cap(fWDM.format(s))} – ${fWDMY.format(last)}`; }
  if (key(s) === key(e) || (e - s < DAY && e.getHours() === 0 && e.getMinutes() === 0 && daysBetween(s, e) === 1)) return `${cap(fWDMY.format(s))}\n${hm(s)} – ${hm(e)}`;
  return `${cap(fWDMs.format(s))} ${hm(s)} – ${fWDMs.format(e)} ${hm(e)}`;
}
const REM = { none: 'Aucun rappel', '-540': 'Le jour même à 9 h', '360': 'La veille à 18 h', '0': "Au début de l'événement", '10': '10 minutes avant', '30': '30 minutes avant', '60': '1 heure avant', '1440': '1 jour avant', '2880': '2 jours avant', '10080': '1 semaine avant' };
function agoText(y) { return y <= 0 ? 'Cette année' : `Il y a ${y} an${y > 1 ? 's' : ''}`; }

/* ===================== État de l'interface ===================== */
const UP_DAYS = 30;
const UI = { view: 'week', upStart: new Date(TODAY), upLen: UP_DAYS, blQ: '', miniMonth: new Date(TODAY.getFullYear(), TODAY.getMonth(), 1),
  selectedEl: null, sel: null, lastCal: null, qcTitle: '', popAt: 0 };
try { UI.lastCal = localStorage.getItem('agenda-last-cal'); } catch (e) {}
let popEl = null, qcEl = null, popScrim = null, _past = null, _mem = null;
function dirty() { _past = null; _mem = null; _dueOn = null; _evIdx = null; } // à appeler après toute modification des données
const $ = id => document.getElementById(id);
UI.year = TODAY.getFullYear();
const isPage = () => UI.view === 'upcoming' || UI.view === 'birthdays' || UI.view === 'memories' || UI.view === 'due' || UI.view === 'year';
const isSidePage = v => v === 'birthdays' || v === 'memories' || v === 'due';
const pageEl = () => $('page');
const mqPhone = matchMedia('(max-width: 720px)');
const fcViewFor = v => ({ month: 'dayGridMonth', week: mqPhone.matches ? 'timeGrid3' : 'timeGridWeek', day: 'timeGridDay' }[v]);
function savedView() { let v = 'week'; try { v = localStorage.getItem('agenda-view') || 'week'; } catch (e) {} return ['day', 'week', 'month', 'year', 'upcoming', 'birthdays', 'memories', 'due'].includes(v) ? v : 'week'; }
/* Le brouillon (et la date de la fenêtre de création) prennent la couleur du calendrier choisi */
function setDraftCal(id) { const v = id ? calVar(id) : ''; [calEl, qcEl].forEach(el => el && (v ? el.style.setProperty('--draft-c', v) : el.style.removeProperty('--draft-c'))); }
function defaultCal() { const c = getCal(UI.lastCal); return c && c.visible && !c.sub ? c.id : (S.calendars.find(x => x.visible && x.id !== 'anniv' && !x.sub) || S.calendars.find(x => x.visible && !x.sub) || S.calendars.find(x => !x.sub) || S.calendars[0])?.id; }
function rememberCal(id) { UI.lastCal = id; try { localStorage.setItem('agenda-last-cal', id); } catch (e) {} }
/* Préférences d'affichage, gardées dans le navigateur */
const PREFS = { weekends: true, rem: 'none', notif: true, evStyle: 'pastel', dayStart: '08' };
try { Object.assign(PREFS, JSON.parse(localStorage.getItem('agenda-prefs') || '{}')); } catch (e) {}
const savePrefs = () => { try { localStorage.setItem('agenda-prefs', JSON.stringify(PREFS)); } catch (e) {} };
function applyEvStyle() { ['solid', 'light'].forEach(k => document.body.classList.toggle('ev-' + k, PREFS.evStyle === k)); }
applyEvStyle();
const shortName = n => n.split(/\s*[\/&]\s*|\s+et\s+/).map(p => p.trim().split(/\s+/)[0]).filter(Boolean).join(' & ');
/* Fenêtres : focus rendu à l'élément d'origine à la fermeture */
const MODAL_RET = {};
function showModal(id) { MODAL_RET[id] = document.activeElement; $(id).hidden = false; }
function hideModal(id) { if ($(id).contains(document.activeElement)) document.activeElement.blur(); $(id).hidden = true; const r = MODAL_RET[id]; MODAL_RET[id] = null; if (r && r.isConnected && r.focus) r.focus({ preventScroll: true }); }

/* ===================== FullCalendar ===================== */
/* Une source d'événements par calendrier : cocher/décocher un calendrier n'ajoute ou ne retire
   que ses propres événements, sans re-dessiner les autres. */
function sourceFor(calId) {
  return { id: calId, events: (info, ok) => {
    const out = [];
    S.events.filter(ev => ev.cal === calId).forEach(ev => expand(ev, info.start, info.end).forEach(o => out.push({
      id: `${ev.id}@${o.occKey}`, title: ev.title, start: o.start, end: o.end, allDay: ev.allDay,
      durationEditable: !isBday(ev),   // un anniversaire dure un jour : on le déplace, on ne l'étire pas
      classNames: [...(getCal(ev.cal)?.sub ? ['ro-ev'] : []), ...(isOpen(ev) ? ['open-end'] : [])],
      ...(getCal(ev.cal)?.sub ? { startEditable: false, durationEditable: false } : {}),   // abonnement : la source fait foi (durationEditable explicite passerait avant editable)
      extendedProps: { evId: ev.id, occKey: o.occKey }
    })));
    ok(out);
  } };
}
/* Jours fériés dans la ligne « Journée » de Jour et Semaine (dans le Mois, ils sont à côté du numéro) */
const HOL_SOURCE = { id: 'hol', events: (info, ok) => {
  const out = [];
  if (['day', 'week'].includes(UI.view)) for (let d = sod(info.start); d < info.end; d = addDays(d, 1)) {
    const h = hol(d); if (h) out.push({ id: `hol@${key(d)}`, title: h, start: key(d), allDay: true, editable: false, classNames: ['hol-ev'], extendedProps: { hol: true } });
  }
  ok(out);
} };
function syncSources(refetch = 'all') {
  const want = new Set(S.calendars.filter(c => c.visible).map(c => c.id));
  cal.batchRendering(() => {
    cal.getEventSources().forEach(src => { if (src.id !== 'hol' && !want.has(src.id)) src.remove(); });
    want.forEach(id => {
      const src = cal.getEventSourceById(id);
      if (!src) cal.addEventSource(sourceFor(id));
      else if (refetch === 'all' || refetch.includes(id)) src.refetch();
    });
  });
}
const calEl = $('cal');
const scrollNow = () => `${pad(Math.max(0, Math.min(new Date().getHours() - 1, 15)))}:00:00`; // on ouvre sur l'heure en cours
const goDay = d => { setView('day'); cal.gotoDate(d); };
/* La grille commence à l'heure choisie dans les Réglages, ou plus tôt si un événement de la période commence avant */
function dayStartFor(v) {
  let h = +PREFS.dayStart;
  if (h > 0) occurrences(v.activeStart, v.activeEnd).forEach(o => {
    if (o.ev.allDay || !getCal(o.ev.cal)?.visible) return;
    const crosses = sod(new Date(o.end.getTime() - 1)) > sod(o.start);   // passe minuit : la suite commence à 0 h
    h = Math.min(h, crosses || o.start < v.activeStart ? 0 : o.start.getHours());
  });
  return `${pad(h)}:00:00`;
}
const DAY_END = 23;
function dayEndFor(v) {
  let h = DAY_END;
  occurrences(v.activeStart, v.activeEnd).forEach(o => {
    if (o.ev.allDay || !getCal(o.ev.cal)?.visible) return;
    const crosses = sod(new Date(o.end.getTime() - 1)) > sod(o.start);
    const endH = crosses ? 24 : o.end.getHours() + (o.end.getMinutes() ? 1 : 0);
    h = Math.max(h, Math.min(24, endH));
  });
  return `${pad(h)}:00:00`;
}
function syncDayStart() {
  if (isPage() || !cal.view.type.startsWith('timeGrid')) return;
  const t = dayStartFor(cal.view), e = dayEndFor(cal.view);
  if (cal.getOption('slotMinTime') !== t) cal.setOption('slotMinTime', t);
  if (cal.getOption('slotMaxTime') !== e) cal.setOption('slotMaxTime', e);
  requestAnimationFrame(updateHrNav);
}
/* L'heure affichée sur la ligne « maintenant » masque l'étiquette d'heure qu'elle chevaucherait */
function markNearNow(d) {
  document.querySelectorAll('.fc-timegrid-slot-label.near-now').forEach(x => x.classList.remove('near-now'));
  const hourPx = (document.querySelector('#cal .fc-timegrid-slot')?.offsetHeight || 24) * 2, after = 17 / hourPx * 60, before = 17 / hourPx * 60, m = d.getMinutes();
  const h = m < after ? d.getHours() : 60 - m < before ? d.getHours() + 1 : null;
  if (h != null && h < 24) document.querySelectorAll(`.fc-timegrid-slot-label[data-time="${pad(h)}:00:00"]`).forEach(x => x.classList.add('near-now'));
}
const cal = new FullCalendar.Calendar(calEl, {
  locale: 'fr', firstDay: 1, initialView: fcViewFor('week'), initialDate: new Date(), weekends: PREFS.weekends,
  headerToolbar: false, height: '100%', nowIndicator: true,
  views: {
    timeGrid3: { type: 'timeGrid', duration: { days: 3 } },
    dayGridMonth: { dayMaxEvents: true }       // s'adapte à la hauteur disponible
  },
  slotDuration: '00:30:00', slotLabelInterval: '01:00', scrollTime: scrollNow(), snapDuration: '00:15:00',
  slotMinTime: `${pad(+PREFS.dayStart)}:00:00`, slotMaxTime: '23:00:00', expandRows: true,   // la journée tient sur l'écran
  allDayText: 'Journée', eventTimeFormat: { hour: '2-digit', minute: '2-digit', hour12: false },
  dayMaxEvents: 3, eventDisplay: 'block', eventMinHeight: 22,   // ajusté à l'écran : voir fitEventMinHeight
  slotEventOverlap: false,   // deux cours en même temps : côte à côte, sans que l'un recouvre le texte de l'autre
  selectAllow: a => a.allDay || sod(new Date(a.end.getTime() - 1)).getTime() === sod(a.start).getTime(),
  editable: true, eventResizableFromStart: true, selectable: true, selectMirror: true,
  forceEventDuration: true, defaultTimedEventDuration: '01:00',   // un élément « journée » posé dans la grille dure 1 h
  /* Un anniversaire reste un événement « journée » : on peut changer son jour, pas lui donner une heure */
  eventAllow: (drop, dragged) => { const ev = getEv(dragged.extendedProps.evId); return !!ev && !(isBday(ev) && !drop.allDay); }, unselectCancel: '.qc, #nlh-scrim', longPressDelay: 350, selectLongPressDelay: 350,
  slotLabelContent: a => ({ html: `<span class="hl">${a.date.getHours()} h</span>` }),
  nowIndicatorContent: a => { if (!a.isAxis) return; requestAnimationFrame(() => markNearNow(a.date)); return { html: `<span class="now-pill">${hm(a.date)}</span>` }; },
  allDayContent: () => ({ html: '<span class="ad">Journée</span>' }),
  moreLinkContent: a => `+${a.num} autre${a.num > 1 ? 's' : ''}`,
  dayHeaderContent: a => {
    if (a.view.type === 'dayGridMonth') return { html: `<span class="dh-dow">${cap(fDow.format(a.date).replace('.', ''))}</span>` };
    const past = a.date < TODAY;
    const ho = hol(a.date);
    return { html: `<span class="dh${a.isToday ? ' is-today' : ''}${past ? ' is-past' : ''}${ho ? ' is-hol' : ''}"${ho ? ` title="${esc(ho)}"` : ''}><span class="dh-dow">${cap(fDow.format(a.date).replace('.', ''))}</span><span class="dh-num" title="Afficher ce jour">${a.date.getDate()}</span></span>` };
  },
  dayCellDidMount: a => {
    if (a.view.type !== 'dayGridMonth') return;
    const h = hol(a.date); if (!h) return;
    a.el.classList.add('is-hol');
    a.el.querySelector('.fc-daygrid-day-top')?.insertAdjacentHTML('beforeend', `<span class="mhol" title="${esc(h)}">${esc(h)}</span>`);
  },
  eventSources: [...S.calendars.filter(c => c.visible).map(c => sourceFor(c.id)), HOL_SOURCE],
  eventContent: a => {
    const e = a.event, ev = getEv(e.extendedProps.evId);
    const eEnd = e.end || new Date(e.start.getTime() + (e.allDay ? DAY : 3600e3));
    const ro = ev && isSub(ev), lock = ro ? svg('lock', 'ev-lock') : '', roT = ro ? ' · lecture seule' : '';   // abonnement : ni déplacer ni étirer
    /* Échéances : leur pastille passe devant le titre (on la voit même quand l'événement est étroit), et un liseré si c'est pour bientôt */
    const dd = ev && !isBday(ev) ? dueFor(ev, e.extendedProps.occKey) : null, db = dd ? dueBadge(dd) : null;
    const du = db ? db.html : '', dc = db && /^(late|today|soon)$/.test(db.st) ? ` du-${db.st}` : '';
    if (e.extendedProps.hol) return { html: `<div class="evbox one hol" title="Jour férié · ${esc(e.title)}">${svg('flag', 'ev-ic')}<span class="ev-t">${esc(e.title)}</span></div>` };
    if (!ev) {
      if (!a.isMirror) return;
      const clash = !e.allDay && clashes(e.start, eEnd).length > 0;
      return { html: `<div class="evbox mirror${e.allDay ? ' one' : ''}${clash ? ' clash' : ''}"><span class="mir-pill">${clash ? svg('alert', 'ev-ic') : ''}<span class="ev-t">${esc(UI.qcTitle || '')}</span>${e.allDay ? '' : `<span class="ev-m">${hm(e.start)} – ${hm(eEnd)}</span>`}</span></div>` };
    }
    if (e.allDay) {
      const bd = isBday(ev), age = bd ? ageAt(ev, e.start) : null;
      return { html: `<div class="evbox one${dc}" title="${esc(e.title)}${age ? ` · ${age} ans` : ''}${bd && ev.fav ? ' · favori' : ''}${roT}">${bd ? bdIcon(ev) : ''}<span class="ev-t">${esc(bd ? (mqPhone.matches || a.view.type === 'dayGridMonth' || (age && a.view.type === 'timeGridWeek') ? shortName(personOf(ev)) : personOf(ev)) : e.title)}</span>${age ? `<span class="ev-age">${age}\u00a0ans</span>` : ''}${du}${lock}</div>` };
    }
    if (a.view.type === 'dayGridMonth') return { html: `<div class="evbox one dot${dc}"${ro ? ` title="${esc(e.title)}${roT}"` : ''}><span class="ev-time">${fmtT(e.start)}</span><span class="ev-t">${esc(e.title)}</span>${du}${lock}</div>` };
    const rep = isRec(ev) && ev.rrule.freq !== 'yearly' ? svg('repeat', 'ev-rep') : '';
    if (eEnd - e.start < 45 * 60e3) // événement court : une seule ligne lisible
      return { html: `<div class="evbox one short${dc}" title="${esc(e.title)} · ${hm(e.start)}${endTxt(ev, eEnd)}${roT}"><span class="ev-t">${esc(e.title)}</span><span class="ev-time">${hm(e.start)}</span>${rep}${du}${lock}</div>` };
    const loc = ev.loc ? `<div class="ev-loc">${svg('pin')}<span>${esc(ev.loc)}</span></div>` : '', op = isOpen(ev);
    return { html: `<div class="evbox stack${dc}${ro ? ' ro' : ''}${du ? ' has-du' : ''}" title="${esc(e.title)} · ${hm(e.start)}${endTxt(ev, eEnd)}${ev.loc ? ` · ${esc(ev.loc)}` : ''}${roT}"><div class="ev-t">${du}${esc(e.title)}${rep}</div><div class="ev-m">${hm(e.start)}${op ? '<span class="ev-open"> → ?</span>' : `<span class="ev-end"> – ${hm(eEnd)}</span>`}</div>${loc}${lock}</div>` };
  },
  eventDidMount: a => {
    const ev = getEv(a.event.extendedProps.evId); if (!ev) return;
    a.el.style.setProperty('--c', calVar(ev.cal)); a.el.dataset.occ = a.event.id;
    if (!a.event.allDay && a.event.end) { a.el._t = [a.event.start.getTime(), a.event.end.getTime()]; markNow(a.el); }   // « en cours », tenu à jour par l'horloge
    const di = Math.max(0, Math.min(41, daysBetween(a.view.activeStart, a.event.start)));
    a.el.style.setProperty('--d', (a.view.type === 'dayGridMonth' ? di * 4 : di * 25) + 'ms');
  },
  eventClick: info => { info.jsEvent.preventDefault(); if (info.event.extendedProps.hol) return; openPopover(info.event.extendedProps.evId, info.event.extendedProps.occKey, info.el); },
  eventDragStart: info => { closePopover(); closeQuick(); UI.dragging = true;
    document.body.classList.add('grabbing');
    const dev = getEv(info.event.extendedProps.evId); calEl.classList.add('ev-dragging'); if (dev) calEl.style.setProperty('--drag-c', calVar(dev.cal)); const j = info.jsEvent; setDupDrag(j && (j.ctrlKey || j.metaKey || j.altKey)); },
  eventDragStop: () => { UI.dragging = false; setDupDrag(false); calEl.classList.remove('ev-dragging'); document.body.classList.remove('grabbing'); },
  select: info => {
    if (UI.tgSelecting) return;
    const js = info.jsEvent || UI.selJs; UI.selJs = null;
    const tgt = info.jsEvent && info.jsEvent.target;
    if (tgt && tgt.closest && tgt.closest('.fc-daygrid-day-number')) { cal.unselect(); goDay(info.start); return; } // clic sur un numéro → vue Jour
    let s = info.start, e = info.end, allDay = info.allDay;
    // dans le mois, un clic donne une journée : l'heure s'ajoute avec « Horaire » ou dans le titre (« 15h »)
    if (!allDay && e - s <= 30 * 60e3 && info.jsEvent) { // clic simple : on étend visuellement le créneau à 1 h
      UI.selJs = info.jsEvent; cal.select({ start: s, end: new Date(s.getTime() + 3600e3), allDay: false }); return;
    }
    openQuick({ start: s, end: e, allDay, pickTime: info.view.type === 'dayGridMonth' && daysBetween(s, e) === 1 }, js);
  },
  unselect: () => { if (qcEl) closeQuick(false); },
  eventDrop: info => { const j = info.jsEvent; if (j && (j.ctrlKey || j.metaKey || j.altKey)) dupDrop(info); else moveOccurrence(info); },
  eventResizeStart: info => { UI.resizing = true; closePopover(); closeQuick(); setResizing(info.el.classList.contains('fc-timegrid-event') ? 'v' : 'h'); },
  eventResizeStop: () => { UI.resizing = false; setResizing(null); },
  eventResize: info => moveOccurrence(info, true),
  datesSet: a => {
    updateTitle(); syncMini(); closeQuick(false); syncDayStart(); hideGhost(); requestAnimationFrame(() => { updateHrNav(); fitEventMinHeight(); });
    const tg = a.view.type.startsWith('timeGrid'); if (UI.holTg !== tg) { UI.holTg = tg; cal.getEventSourceById('hol')?.refetch(); }
  },
  eventsSet: () => { syncDayStart(); ghostTd = null; requestAnimationFrame(fitEventMinHeight); }
});
/* Le premier affichage se fait au démarrage, tout en bas : avant, une fonction définie plus loin dans le fichier
   (ex. pour un anniversaire de la semaine) n'existait pas encore et tout l'agenda s'arrêtait. */

/* ===================== Vues & navigation ===================== */
function setView(v) {
  const changed = v !== UI.view;
  setViewCore(v);
  if (changed) animateSheet('fade');
  updateSegThumbs();
}
function setViewCore(v) {
  UI.view = v;
  try { localStorage.setItem('agenda-view', v); } catch (e) {}
  document.querySelectorAll('.topbar .seg button').forEach(b => b.setAttribute('aria-selected', String(b.dataset.view === v)));
  document.querySelector('.plan-btn')?.setAttribute('aria-pressed', String(v === 'upcoming'));
  const custom = isPage();
  document.body.classList.toggle('no-nav', isSidePage(v));
  if (!isSidePage(v)) UI.lastCalView = v;
  $('side-bdays').setAttribute('aria-current', v === 'birthdays' ? 'page' : 'false');
  $('side-mem').setAttribute('aria-current', v === 'memories' ? 'page' : 'false');
  if (v === 'memories') { try { localStorage.setItem('agenda-mem-seen', key(TODAY)); } catch (e) {} updateMemBadge(); }
  $('side-due').setAttribute('aria-current', v === 'due' ? 'page' : 'false');
  $('cal').hidden = custom; $('page').hidden = !custom;
  closePopover(); closeQuick();
  if (custom) { updateHrNav(); renderPage(); updateTitle(); renderMini(); $('page').scrollTop = 0; return; }
  cal.changeView(fcViewFor(v));
  requestAnimationFrame(() => cal.updateSize());
}
function nav(dir) {
  if (UI.view === 'memories') { memStep(dir); return; }
  if (isSidePage(UI.view)) return;
  navCore(dir); animateSheet(dir);
  if (dir === 'today') requestAnimationFrame(() => popIn(document.querySelector('.dh.is-today .dh-num, .fc-day-today .fc-daygrid-day-number, .ag-date.today, .yd.today'), 'ping'));
}
/* Glissement dans le sens de la navigation, puis vague d'apparition (courte) des événements */
function animateSheet(dir) {
  const page = isPage();
  if (page && dir === 'fade') return;
  const el = page ? pageEl() : $('cal');
  const cls = dir === 'next' ? 'slide-l' : dir === 'prev' ? 'slide-r' : 'fade-up';
  el.classList.remove('slide-l', 'slide-r', 'fade-up', 'enter'); void el.offsetWidth;
  el.classList.add(cls); if (!page) el.classList.add('enter');
  clearTimeout(el._anim); el._anim = setTimeout(() => el.classList.remove(cls, 'enter'), 700);
}
/* Pastille glissante des sélecteurs */
function updateSegThumbs() {
  document.querySelectorAll('.seg').forEach(seg => {
    let t = seg.querySelector('.seg-thumb');
    if (!t) { t = document.createElement('span'); t.className = 'seg-thumb'; t.setAttribute('aria-hidden', 'true'); seg.prepend(t); }
    const b = seg.querySelector('button[aria-selected="true"]');
    if (!b || !b.offsetWidth) { t.style.opacity = '0'; t.classList.remove('ready'); return; }
    const first = !t.classList.contains('ready');
    Object.assign(t.style, { left: b.offsetLeft + 'px', top: b.offsetTop + 'px', width: b.offsetWidth + 'px', height: b.offsetHeight + 'px', opacity: '1' });
    if (first) requestAnimationFrame(() => t.classList.add('ready'));
  });
}
addEventListener('resize', () => requestAnimationFrame(() => { updateSegThumbs(); updateHrNav(); fitEventMinHeight(); }));
function staggerIn(root) {
  if (UI.quiet) return;
  root.querySelectorAll('.ag-week, .ag-day').forEach((el, i) => { el.style.setProperty('--d', Math.min(i, 18) * 18 + 'ms'); el.classList.add('st-in'); });
}
function navCore(dir) {
  closePopover(); closeQuick();
  if (UI.view === 'year') {
    UI.year = dir === 'today' ? TODAY.getFullYear() : UI.year + (dir === 'next' ? 1 : -1);
    renderYear(); updateTitle(); pageEl().scrollTop = 0; return;
  }
  if (UI.view === 'upcoming') {
    UI.upLen = UP_DAYS;
    UI.upStart = dir === 'today' ? new Date(TODAY) : addDays(UI.upStart, dir === 'next' ? UP_DAYS : -UP_DAYS);
    renderUpcoming(); updateTitle(); pageEl().scrollTop = 0; return;
  }
  if (dir === 'today') { cal.today(); cal.scrollToTime(scrollNow()); } else cal[dir]();
}
/* Le titre : le mois en grand, l'année en léger ; le détail de la période en dessous */
function setTitle(main, light) { $('p-title').innerHTML = esc(main) + (light ? ` <em>${esc(light)}</em>` : ''); }
function monthTitle(s, e) {
  if (s.getFullYear() !== e.getFullYear()) return [`${cap(fMs.format(s))} ${s.getFullYear()} – ${cap(fMs.format(e))}`, String(e.getFullYear())];
  if (s.getMonth() !== e.getMonth()) return [`${cap(fMs.format(s))} – ${cap(fMs.format(e))}`, String(e.getFullYear())];
  return [cap(fM.format(s)), String(s.getFullYear())];
}
function updateTitle() {
  const Sub = $('p-sub');
  if (UI.view === 'due') {
    const open = dueList().filter(x => x.i.st !== 'done'), late = open.filter(x => x.i.st === 'late').length, week = open.filter(x => x.i.st === 'today' || x.i.st === 'soon').length;
    setTitle('Échéances'); Sub.textContent = open.length ? [late && `${late} en retard`, week && `${week} dans les 7 jours`, `${open.length} à rendre en tout`].filter(Boolean).join(' · ') : 'Rien à rendre pour l’instant'; return;
  }
  if (UI.view === 'memories') { setTitle('Souvenirs'); Sub.textContent = 'Ce qui s’est passé ce jour-là, les années d’avant'; return; }
  if (UI.view === 'birthdays') { const n = allBirthdays().length; setTitle('Anniversaires'); Sub.textContent = `Les ${n} anniversaires de tes proches, chaque année`; return; }
  if (UI.view === 'year') {
    const st = UI.yStats || { total: 0, hol: 0 }; setTitle(String(UI.year));
    Sub.textContent = `${st.total} événement${st.total > 1 ? 's' : ''} · ${st.hol} jours fériés`; return;
  }
  if (UI.view === 'upcoming') {
    const e = addDays(UI.upStart, UI.upLen - 1); setTitle(...monthTitle(UI.upStart, e));
    Sub.textContent = `Du ${fDM.format(UI.upStart)} au ${fDM.format(e)}`; return;
  }
  const v = cal.view, s = v.activeStart, e = addDays(v.activeEnd, -1);
  if (v.type === 'dayGridMonth') { setTitle(cap(fM.format(v.currentStart)), String(v.currentStart.getFullYear())); Sub.textContent = ''; }
  else if (v.type === 'timeGridDay') {
    setTitle(cap(fM.format(s)), String(s.getFullYear()));
    Sub.textContent = `${cap(fDowL.format(s))} ${s.getDate()} · Semaine ${isoWeek(s)}`;
  } else {
    setTitle(...monthTitle(s, e));
    Sub.textContent = `${s.getMonth() === e.getMonth() ? `${s.getDate()} – ${fDM.format(e)}` : `${fDMs.format(s)} – ${fDMs.format(e)}`} · Semaine ${isoWeek(s)}`;
  }
  const back = TODAY.getFullYear() - (v.type === 'dayGridMonth' ? v.currentStart : e).getFullYear();   // semaine du Nouvel An : l'année du dernier jour
  if (back > 0) Sub.textContent += `${Sub.textContent ? ' · ' : ''}${agoText(back).toLowerCase()}`;
}
mqPhone.addEventListener('change', () => { if (UI.view === 'week') cal.changeView(fcViewFor('week')); closePopover(); closeQuick(); requestAnimationFrame(updateSegThumbs); });

/* --- Création à la souris dans Jour et Semaine ---
   Le créneau reste dans le jour où l'on a cliqué : la souris peut sortir de la colonne,
   seule sa hauteur compte, jusqu'à ce qu'on relâche le bouton. */
const TG = { sel: null };
const minOf = t => { const [h, m] = String(t).split(':').map(Number); return h * 60 + (m || 0); };
function tgMinuteAt(y) {
  const lanes = calEl.querySelectorAll('.fc-timegrid-slot-lane'); if (!lanes.length) return null;
  const top = lanes[0].getBoundingClientRect().top, bot = lanes[lanes.length - 1].getBoundingClientRect().bottom;
  const lo = minOf(cal.getOption('slotMinTime')), hi = minOf(cal.getOption('slotMaxTime'));
  return lo + Math.min(Math.max((y - top) / (bot - top), 0), .9999) * (hi - lo);
}
function tgRange(sel, y) {
  const m = Math.floor(tgMinuteAt(y) / 15) * 15, a = sel.anchor;
  const [s, e] = m >= a ? [a, m + 15] : [m, a + 15];
  return { start: new Date(sel.day.getTime() + s * 60e3), end: new Date(sel.day.getTime() + Math.min(e, minOf(cal.getOption('slotMaxTime'))) * 60e3) };
}
calEl.addEventListener('mousedown', () => { if (!qcEl) setDraftCal(defaultCal()); });   // pendant le glisser, avant que la fenêtre s'ouvre
calEl.addEventListener('mousedown', e => {
  if (e.button !== 0 || isPage() || !cal.view.type.startsWith('timeGrid')) return;
  if (!e.target.closest('.fc-timegrid-body') || e.target.closest('.fc-event, .fc-timegrid-axis, .fc-timegrid-now-indicator-arrow')) return;
  const col = [...calEl.querySelectorAll('.fc-timegrid-col[data-date]')].find(c => { const r = c.getBoundingClientRect(); return e.clientX >= r.left && e.clientX < r.right; });
  const min = tgMinuteAt(e.clientY); if (!col || min == null) return;
  e.stopPropagation(); e.preventDefault();          // on prend la main sur la sélection de FullCalendar
  closePopover();
  TG.sel = { day: parse(col.dataset.date), anchor: Math.floor(min / 15) * 15, x: e.clientX, y: e.clientY, moved: false, last: '' };
  document.body.classList.add('tg-selecting');
}, true);
addEventListener('mousemove', e => {
  const sel = TG.sel; if (!sel) return;
  if (!sel.moved && Math.hypot(e.clientX - sel.x, e.clientY - sel.y) < 5) return;
  if (!sel.moved) { sel.moved = true; closeQuick(false); UI.tgSelecting = true; }
  const r = tgRange(sel, e.clientY), k = r.start.getTime() + '-' + r.end.getTime();
  if (k !== sel.last) { sel.last = k; cal.select({ ...r, allDay: false }); }
});
addEventListener('mouseup', e => {
  const sel = TG.sel; if (!sel) return;
  TG.sel = null; UI.tgSelecting = false; document.body.classList.remove('tg-selecting');
  let r;
  if (sel.moved) r = tgRange(sel, e.clientY);
  else {                                              // simple clic : une heure à partir de la demi-heure cliquée
    const s = Math.min(Math.floor(sel.anchor / 30) * 30, minOf(cal.getOption('slotMaxTime')) - 60);
    r = { start: new Date(sel.day.getTime() + s * 60e3), end: new Date(sel.day.getTime() + (s + 60) * 60e3) };
  }
  UI.selJs = e;
  setTimeout(() => cal.select({ ...r, allDay: false }), 0);
});

/* --- Mois : au survol d'un jour, un emplacement en pointillés montre où l'événement se créera --- */
var ghost = document.createElement('div');   // var : les rappels de FullCalendar peuvent passer avant cette ligne
ghost.className = 'mghost'; ghost.setAttribute('aria-hidden', 'true');
ghost.innerHTML = `${svg('plus')}<span>Nouvel événement</span>`;
calEl.closest('.sheet').append(ghost);
var ghostTd = null;
function hideGhost() { if (ghost) ghost.classList.remove('on'); ghostTd = null; }
calEl.addEventListener('mousemove', e => {
  if (!matchMedia('(hover: hover)').matches || isPage() || cal.view.type !== 'dayGridMonth' || UI.dragging) return hideGhost();
  const td = e.target.closest('.fc-daygrid-day');
  if (!td || e.target.closest('.fc-event, .fc-daygrid-more-link, .fc-daygrid-day-number, .fc-popover')) return hideGhost();
  if (td === ghostTd) return;
  ghostTd = td;
  const sheet = calEl.closest('.sheet'), sr = sheet.getBoundingClientRect(), r = td.getBoundingClientRect();
  let low = td.querySelector('.fc-daygrid-day-top')?.getBoundingClientRect().bottom || r.top;
  td.querySelectorAll('.fc-daygrid-day-events > *').forEach(x => { const b = x.getBoundingClientRect(); if (b.height || x.matches('.fc-daygrid-day-bottom')) low = Math.max(low, b.bottom); });
  const ox = sr.left + sheet.clientLeft, oy = sr.top + sheet.clientTop, fits = r.bottom - 6 - (low + 3) >= 22;
  ghost.classList.toggle('compact', !fits);
  ghost.classList.toggle('short', fits && r.width < 120);
  const er = td.querySelector('.fc-daygrid-day-events')?.getBoundingClientRect() || r;   // mêmes bords que les événements
  Object.assign(ghost.style, fits
    ? { left: er.left + 3 - ox + 'px', top: low + 2 - oy + 'px', width: er.width - 6 + 'px' }
    : { left: r.right - 30 - ox + 'px', top: r.top + 5 - oy + 'px', width: '' });
  ghost.classList.remove('on'); void ghost.offsetWidth; ghost.classList.add('on');
});
calEl.addEventListener('mouseleave', hideGhost);
calEl.addEventListener('mousedown', hideGhost);

/* --- Défilement des heures (boutons ↑ ↓ et flèches du clavier) --- */
const hrScroller = () => isPage() ? null : document.querySelector('#cal .fc-timegrid-body')?.closest('.fc-scroller');
function updateHrNav() {
  const sc = hrScroller();
  document.body.classList.toggle('tg', !!sc && sc.scrollHeight > sc.clientHeight + 1);
  if (!sc) return;
  if (!sc._hr) { sc._hr = true; sc.addEventListener('scroll', updateHrNav, { passive: true }); }
  const [up, down] = document.querySelectorAll('.hr-nav button');
  up.disabled = sc.scrollTop <= 1; down.disabled = sc.scrollTop + sc.clientHeight >= sc.scrollHeight - 1;
}
function scrollHours(h) {
  const sc = hrScroller(); if (!sc) return;
  const hour = (document.querySelector('#cal .fc-timegrid-slot')?.offsetHeight || 24) * 2;
  sc.scrollBy({ top: h * hour, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
}

/* ===================== Mini-calendrier ===================== */
function syncMini() { const d = cal.getDate(); UI.miniMonth = new Date(d.getFullYear(), d.getMonth(), 1); renderMini(); }
function renderMini(focusKey) {
  const m = UI.miniMonth, first = addDays(m, -(isoDow(m) - 1));
  let rs = null, re = null;
  if (!isPage() && ['timeGridWeek', 'timeGrid3', 'timeGridDay'].includes(cal.view.type)) { rs = cal.view.activeStart; re = cal.view.activeEnd; }
  const tab = focusKey || (key(TODAY).slice(0, 7) === key(m).slice(0, 7) ? key(TODAY) : key(m));
  const gridEnd = addDays(first, 42), busy = new Map();   // nombre d'événements par jour
  occurrences(first, gridEnd).forEach(o => {
    const last = o.ev.allDay ? addDays(o.end, -1) : new Date(o.end.getTime() - 1);
    for (let d = sod(o.start < first ? first : o.start); d <= last && d < gridEnd; d = addDays(d, 1)) busy.set(key(d), (busy.get(key(d)) || 0) + 1);
  });
  let h = `<div class="mini-head"><b>${fMY.format(m)}</b><span class="nav"><button class="icon-btn flat sm" data-mini="-1" aria-label="Mois précédent">${svg('left')}</button><button class="icon-btn flat sm" data-mini="1" aria-label="Mois suivant">${svg('right')}</button></span></div><div class="mini-grid">`;
  DOW_LETTERS.forEach(l => h += `<span class="h">${l}</span>`);
  for (let i = 0; i < 42; i++) {
    const d = addDays(first, i), k = key(d);
    const inR = rs && d >= rs && d < re;
    const n = busy.get(k) || 0, cnt = n ? `${n} événement${n > 1 ? 's' : ''}` : 'Rien de prévu';
    const ho = hol(d);
    const cls = [n && 'busy', ho && 'hol', d.getMonth() !== m.getMonth() && 'out', k === key(TODAY) && 'today', inR && 'in-range', inR && (k === key(rs) || isoDow(d) === 1) && 'rs', inR && (key(addDays(d, 1)) === key(re) || isoDow(d) === 7) && 're'].filter(Boolean).join(' ');
    h += `<button class="${cls}" data-day="${k}" tabindex="${k === tab ? 0 : -1}" title="${cap(fWDM.format(d))}${ho ? ` · ${ho}` : ''} · ${cnt}" aria-label="${fWDMY.format(d)}, ${cnt.toLowerCase()}"><span>${d.getDate()}</span></button>`;
  }
  $('mini').innerHTML = h + '</div>';
}
$('mini').addEventListener('click', e => {
  const b = e.target.closest('button'); if (!b) return;
  if (b.dataset.mini) { const d = Number(b.dataset.mini); UI.miniMonth = new Date(UI.miniMonth.getFullYear(), UI.miniMonth.getMonth() + d, 1); renderMini(); document.querySelector('.mini-grid').classList.add(d > 0 ? 'slide-l' : 'slide-r'); return; }
  const d = parse(b.dataset.day);
  if (UI.view === 'upcoming') { UI.upStart = d; UI.upLen = UP_DAYS; renderUpcoming(); updateTitle(); }
  else if (isSidePage(UI.view) || UI.view === 'year') { setView('week'); cal.gotoDate(d); }
  else { cal.gotoDate(d); animateSheet('fade'); }
  document.body.classList.remove('side-on');
});
/* Navigation au clavier dans le mini-calendrier (flèches) */
$('mini').addEventListener('keydown', e => {
  const b = e.target.closest('[data-day]'), step = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -7, ArrowDown: 7 }[e.key];
  if (!b || !step) return;
  e.preventDefault();
  const d = addDays(parse(b.dataset.day), step);
  if (d.getMonth() !== UI.miniMonth.getMonth()) UI.miniMonth = new Date(d.getFullYear(), d.getMonth(), 1);
  renderMini(key(d));
  document.querySelector(`#mini [data-day="${key(d)}"]`)?.focus();
});

/* ===================== Liste des calendriers ===================== */
function renderCalList() {
  $('cal-list').innerHTML = S.calendars.map(c => `
    <div class="cal-row" style="--c:var(--cal-${c.color})">
      <label><input type="checkbox" data-vis="${c.id}" ${c.visible ? 'checked' : ''}><span class="cbox">${svg('check')}</span><span class="cal-name">${esc(c.name)}</span>${c.sub ? `<span class="cal-sub${c.sub.err ? ' err' : ''}" title="${esc(c.sub.err ? `Abonnement : échec de la mise à jour (${c.sub.err})` : `Abonnement · mis à jour ${c.sub.at ? agoTxt(c.sub.at) : '—'}`)}">${svg(c.sub.err ? 'alert' : 'link')}</span>` : ''}</label>
      <button class="icon-btn flat sm more" data-cal-edit="${c.id}" aria-label="Gérer ${esc(c.name)}" title="Gérer">${svg('dots')}</button>
    </div>`).join('');
  calListFade();
}
function calListFade() { const l = $('cal-list'); l.classList.toggle('fade-b', l.scrollTop + l.clientHeight < l.scrollHeight - 2); }
$('cal-list').addEventListener('scroll', calListFade, { passive: true });
addEventListener('resize', calListFade);
function calsChanged() { dirty(); closePopover(); closeQuick(); syncSources([]); renderMini(); updateMemBadge(); updateSideBdays(); updateSideDue(); if (isPage()) { renderPage(); updateTitle(); } }
$('cal-list').addEventListener('change', e => {
  const c = getCal(e.target.dataset.vis); if (!c) return; c.visible = e.target.checked;
  popIn(e.target.nextElementSibling); calsChanged();
});
$('cal-list').addEventListener('click', e => { const b = e.target.closest('[data-cal-edit]'); if (b) openCalEditor(b.dataset.calEdit); });

/* ===================== Vues annexes ===================== */
function renderPage() { UI.view === 'birthdays' ? renderBirthdays() : UI.view === 'memories' ? renderMemories() : UI.view === 'due' ? renderDue() : UI.view === 'year' ? renderYear() : renderUpcoming(); }
const relDays = n => n === 0 ? "Aujourd'hui" : n === 1 ? 'Demain' : `Dans ${n} jours`;

/* --- Planning --- */
function renderUpcoming() {
  const s = UI.upStart, e = addDays(s, UI.upLen), now = new Date();
  const occ = occurrences(s, e);
  const more = `<button class="btn ghost more-btn" data-more>${svg('down')}Afficher les ${UP_DAYS} jours suivants</button>`;
  if (!occ.length) { pageEl().innerHTML = `<div class="ax ax-narrow"><div class="ax-empty">Aucun événement du ${fDM.format(s)} au ${fDM.format(addDays(e, -1))}.</div>${more}</div>`; return; }
  const byDay = new Map();
  occ.forEach(o => { const k = key(o.start < s ? s : o.start); if (!byDay.has(k)) byDay.set(k, []); byDay.get(k).push(o); });
  let h = '', wk = null;
  [...byDay.keys()].sort().forEach(k => {
    const d = parse(k), w = isoWeek(d);
    if (w !== wk) {
      wk = w; const mon = addDays(d, 1 - isoDow(d)), sun = addDays(mon, 6);
      h += `<div class="ag-week"><span>Semaine ${w}</span><span>${mon.getMonth() === sun.getMonth() ? fD.format(mon) : fDMs.format(mon)} – ${fDM.format(sun)}</span></div>`;
    }
    const n = daysBetween(TODAY, d);
    h += `<div class="ag-day"><button class="ag-date${n === 0 ? ' today' : ''}" data-goday="${k}" title="Afficher ce jour"><small>${fDow.format(d).replace('.', '')}</small><b>${d.getDate()}</b><span>${n === 0 || n === 1 ? relDays(n) : fMs.format(d).replace('.', '')}</span></button><div class="ag-evs">`;
    byDay.get(k).forEach(o => {
      const c = getCal(o.ev.cal), days = daysBetween(o.start, o.end), bd = isBday(o.ev), age = bd ? ageAt(o.ev, o.start) : null;
      const t = o.ev.allDay ? (days > 1 ? `${days} jours` : 'Journée') : `${hm(o.start)}${endTxt(o.ev, o.end)}`;
      const dd = dueFor(o.ev, o.occKey), dx = dd && dueState(dd);
      const extra = [dx && `<span class="due-t ${dx.i.st}">${svg('flag')}${esc(dd.t)} · ${esc(dx.i.short)}</span>`, o.ev.loc && esc(o.ev.loc), age && `${age} ans`].filter(Boolean).join(' · ');
      h += `<button class="ag-ev${o.end <= now ? ' past' : ''}" style="--c:${calVar(o.ev.cal)}" data-open="${o.ev.id}|${o.occKey}"><i></i><span class="t">${t}</span>`
        + `<span style="min-width:0"><b>${esc(o.ev.title)}</b>${extra ? `<span class="m lc">${extra}</span>` : ''}<span class="m tm">${t}${extra ? ' · ' + extra : ''}</span></span>`
        + `<span class="cal-tag">${esc(c.name)}</span></button>`;
    });
    h += `</div></div>`;
  });
  pageEl().innerHTML = `<div class="ax ax-narrow"><div>${h}</div>${more}</div>`;
  staggerIn(pageEl());
}

/* --- Année : douze mois d'un coup d'œil ---
   Chaque jour est teinté selon le nombre d'événements (légende en haut) ; fériés en rouge.
   Un clic sur un jour ouvre la vue Jour, un clic sur un mois ouvre la vue Mois. */
function renderYear() {
  const Y = UI.year, ys = new Date(Y, 0, 1), ye = new Date(Y + 1, 0, 1), cnt = new Map();
  const occ = occurrences(ys, ye);
  occ.forEach(o => {
    const last = o.ev.allDay ? addDays(o.end, -1) : new Date(o.end.getTime() - 1);
    for (let d = sod(o.start < ys ? ys : o.start); d <= last && d < ye; d = addDays(d, 1)) cnt.set(key(d), (cnt.get(key(d)) || 0) + 1);
  });
  const H = holidays(Y);
  UI.yStats = { total: occ.length, hol: Object.keys(H).length };
  let h = `<div class="ax yr-page"><div class="yr-top"><div class="yr-legend" aria-hidden="true"><span>Calme</span><i data-l="0"></i><i data-l="1"></i><i data-l="2"></i><i data-l="3"></i><span>Chargé</span></div></div><div class="yr-grid">`;
  for (let m = 0; m < 12; m++) {
    const first = new Date(Y, m, 1), last = new Date(Y, m + 1, 0), done = last < TODAY;
    h += `<section class="ym${done ? ' done' : ''}"><button class="ym-h" data-gomonth="${Y}-${pad(m + 1)}" title="Ouvrir ${fMY.format(first)}">${cap(fM.format(first))}</button><div class="yg">`;
    DOW_LETTERS.forEach(l => h += `<span class="yh">${l}</span>`);
    for (let i = 1; i < isoDow(first); i++) h += '<span></span>';
    const lead = isoDow(first) - 1;
    for (let d = 1; d <= last.getDate(); d++) {
      const dt = new Date(Y, m, d), k = key(dt), c = cnt.get(k) || 0, ho = H[k], lvl = c === 0 ? 0 : c <= 2 ? 1 : c <= 4 ? 2 : 3;
      const cls = ['yd', k === key(TODAY) && 'today', ho && 'hol'].filter(Boolean).join(' ');
      const tip = `${cap(fWDM.format(dt))}${ho ? ` · ${ho}` : ''} · ${c ? `${c} événement${c > 1 ? 's' : ''}` : 'Rien de prévu'}`;
      h += `<button class="${cls}" data-l="${lvl}" data-goday="${k}" title="${esc(tip)}" aria-label="${esc(tip)}"><span>${d}</span></button>`;
    }
    for (let i = lead + last.getDate(); i < 42; i++) h += '<span></span>';
    h += '</div></section>';
  }
  pageEl().innerHTML = h + '</div></div>';
  // Sur un petit écran, on amène le mois en cours dans la vue
  requestAnimationFrame(() => {
    if (Y !== TODAY.getFullYear()) return;
    const cur = pageEl().querySelectorAll('.ym')[TODAY.getMonth()], pr = pageEl().getBoundingClientRect();
    if (cur && cur.getBoundingClientRect().bottom > pr.bottom) pageEl().scrollTop += cur.getBoundingClientRect().top - pr.top - 12;
  });
}

/* --- Anniversaires : façon bloc-notes ---
   Une ligne « 21 février  Claudette Sedro » par personne, dans l'ordre du calendrier.
   Repères : dates passées grisées, ligne « Aujourd'hui », décompte pour les 60 prochains jours.
   L'ajout passe par un bouton clair en haut, qui ouvre une petite fenêtre dédiée. */
const MONTHS_FR = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];
function allBirthdays() {
  return S.events.filter(ev => isBday(ev) && getCal(ev.cal)?.visible)
    .map(ev => expand(ev, TODAY, addDays(TODAY, 367))[0]).filter(Boolean).sort((a, b) => a.start - b.start);
}
function bnItems() {
  const y = TODAY.getFullYear();
  return S.events.filter(ev => isBday(ev) && getCal(ev.cal)?.visible).map(ev => {
    const s0 = parse(ev.start), m = s0.getMonth(), day = s0.getDate();
    const date = new Date(y, m, Math.min(day, dim(new Date(y, m, 1)))), n = daysBetween(TODAY, date);
    return { ev, m, day, date, n, past: n < 0, name: personOf(ev), occKey: key(date) };
  }).sort((a, b) => a.m - b.m || a.day - b.day || a.name.localeCompare(b.name, 'fr'));
}
function spyMonths() {
  if (UI.view !== 'birthdays') return;
  const pr = (document.querySelector('.bd-main') || pageEl()).getBoundingClientRect(), top = pr.top + 40;
  let cur = null; document.querySelectorAll('.bn-mh').forEach(h => { if (h.getBoundingClientRect().top <= top) cur = h.id.slice(3); });
  // le mois qu'on vient de demander reste allumé tant qu'il est à l'écran (utile en bas de liste)
  const tg = UI.bmTarget != null && $(`bm-${UI.bmTarget}`);
  if (tg) { const r = tg.getBoundingClientRect(); if (r.top >= pr.top - 4 && r.bottom <= pr.bottom) cur = String(UI.bmTarget); }
  if (cur === null) cur = document.querySelector('.bn-mh')?.id.slice(3);
  document.querySelectorAll('#bl-index [data-bm]').forEach(b => b.classList.toggle('on', b.dataset.bm === cur));
}
pageEl().addEventListener('scroll', () => requestAnimationFrame(spyMonths), { passive: true, capture: true });   // capture : la liste des anniversaires défile dans sa colonne
['wheel', 'touchmove', 'keydown'].forEach(t => pageEl().addEventListener(t, () => { UI.bmTarget = null; }, { passive: true }));
function renderBirthdays() {
  const a = document.activeElement, keep = a?.id === 'bl-q' ? [a.selectionStart, a.selectionEnd] : null;   // un nouveau rendu (mise à jour d'abonnement…) ne coupe pas la frappe
  const old = pageEl().querySelector('.bd-main'), oldTop = old ? old.scrollTop : null, flashing = !!UI.bnFlash?.size;   // ni ne ramène la liste en haut
  pageEl().innerHTML = `<div class="ax bd2">
    <aside class="bd-side">
      <div class="bl-tools"><input class="field" id="bl-q" placeholder="Rechercher un nom" aria-label="Rechercher un nom" autocomplete="off" value="${esc(UI.blQ)}"><button class="btn primary bd-add" data-add-bday title="Ajouter un anniversaire" aria-label="Ajouter un anniversaire">${svg('plus')}</button></div>
      <section class="bd-soon" id="bl-next" aria-label="Bientôt"></section>
      <label class="bd-sel" id="bl-fwrap"><span>Afficher</span><select class="field" id="bl-f" aria-label="Afficher"></select></label>
      <nav class="bd-index" id="bl-index" aria-label="Aller au mois"></nav>
    </aside>
    <div class="bd-main"><div id="bl-list"></div></div></div>`;
  $('bl-f').addEventListener('change', e => { UI.bdF = e.target.value; renderBlList(); });
  $('bl-q').addEventListener('input', e => { UI.blQ = e.target.value; renderBlList(); });
  renderBlList(oldTop == null || flashing);
  if (oldTop != null && !flashing) pageEl().querySelector('.bd-main').scrollTop = oldTop;
  if (keep) { const q = $('bl-q'); q.focus({ preventScroll: true }); q.setSelectionRange(...keep); }
}
const foldQ = q => fold(q.trim());
/* La prochaine fois qu'on le fête (cette année, ou l'an prochain s'il est passé) */
function nextOf(o) {
  if (!o.past) return o;
  const y = TODAY.getFullYear() + 1, date = new Date(y, o.m, Math.min(o.day, dim(new Date(y, o.m, 1))));
  return { ...o, date, n: daysBetween(TODAY, date), past: false, occKey: key(date) };
}
const whenBd = n => n === 0 ? "Aujourd'hui" : n === 1 ? 'Demain' : n < 60 ? `Dans ${n} jours` : `Dans ${Math.round(n / 30)} mois`;
function renderBlList(first) {
  const q = foldQ(UI.blQ), all = bnItems(), F = UI.bdF || 'all';
  const inF = o => F === 'all' || (F === 'fav' ? o.ev.fav : F === 'none' ? !o.ev.group : fold(o.ev.group || '') === fold(F.slice(2)));
  const list = all.filter(o => inF(o) && (!q || fold(o.name).includes(q) || fold(o.ev.group || '').includes(q)));
  /* Un seul menu pour filtrer (favoris, groupes) : il ne prend qu'une ligne, et seulement s'il y a de quoi filtrer */
  const groups = bdGroups().filter(g => all.some(o => fold(o.ev.group || '') === fold(g))), nFav = all.filter(o => o.ev.fav).length, nNone = all.filter(o => !o.ev.group).length;
  const opt = (k, label, n) => `<option value="${esc(k)}"${F === k ? ' selected' : ''}>${esc(label)} (${n})</option>`;
  $('bl-f').innerHTML = opt('all', 'Tous', all.length) + (nFav ? opt('fav', 'Favoris', nFav) : '')
    + groups.map(g => opt(`g:${g}`, g, all.filter(o => fold(o.ev.group || '') === fold(g)).length)).join('') + (nNone && groups.length ? opt('none', 'Sans groupe', nNone) : '');
  $('bl-fwrap').hidden = !nFav && !groups.length;
  /* Bientôt : les 2 prochains, dans les 30 jours. C'est là, et seulement là, qu'on rappelle les idées cadeaux :
     elles servent quand l'anniversaire approche. */
  const nx = all.map(nextOf).sort((a, b) => a.n - b.n), soon = nx.filter(o => o.n <= 30).slice(0, 2), shown = soon.length ? soon : nx.slice(0, 1);
  $('bl-next').innerHTML = !nx.length ? '' : `<h4>Bientôt</h4>` + shown.map(o => {
    const a = ageAt(o.ev, o.date), ideas = giftIdeas(o.ev).length;
    return `<button class="bs-it${o.n === 0 ? ' now' : ''}" data-open="${o.ev.id}|${o.occKey}"><b>${esc(o.name)}${o.ev.fav ? svg('crown', 'bn-ic crown') : ''}</b>`
      + `<small><span class="bs-when">${o.n === 0 ? "Aujourd'hui" : o.n === 1 ? 'Demain' : `${cap(fDMs.format(o.date))} · ${o.n}\u00a0j`}</span>${a ? ` · ${a}\u00a0ans` : ''}${ideas ? ` · ${svg('gift', 'bs-gift')}${ideas}\u00a0idée${ideas > 1 ? 's' : ''}` : ''}</small></button>`;
  }).join('');
  $('bl-index').innerHTML = MONTHS_FR.map((name, m) => {
    const n = list.filter(o => o.m === m).length;
    return `<button data-bm="${m}" class="${m === TODAY.getMonth() ? 'cur' : ''}" ${n ? '' : 'disabled'}><span>${cap(name)}</span><i>${n || ''}</i></button>`;
  }).join('');
  // À droite : toute l'année, en liste
  if (!all.length) { $('bl-list').innerHTML = `<div class="bd-empty">${svg('cake')}<b>Aucun anniversaire pour l’instant</b><span>Ajoute ceux de tes proches : ils reviendront chaque année dans ton agenda, avec leur âge.</span></div>`; return; }
  if (!list.length) { $('bl-list').innerHTML = `<div class="bn-empty">${q ? `Aucun nom ne correspond à « ${esc(UI.blQ.trim())} »${F !== 'all' ? ' dans ce filtre' : ''}.` : 'Personne dans ce filtre pour l’instant.'}</div>`; return; }
  const flash = UI.bnFlash || new Set();
  let h = '<div class="bn-list">', lastM = null;
  list.forEach(o => {
    const head = lastM !== o.m ? `<h4 class="bn-mh${o.m === TODAY.getMonth() ? ' cur' : ''}" id="bm-${o.m}">${cap(MONTHS_FR[o.m])}</h4>` : '';
    lastM = o.m;
    h += head;
    const age = ageAt(o.ev, o.date);   // l'âge de cette année : déjà atteint si c'est passé, à venir sinon
    const meta = o.past || o.n > 60 ? '' : relDays(o.n);   // décompte sur les deux mois qui viennent
    h += `<button class="bn-row${o.past ? ' past' : ''}${o.n === 0 ? ' now' : ''}${flash.has(o.ev.id) ? ' bn-flash' : ''}" data-open="${o.ev.id}|${o.occKey}" title="${cap(fWDM.format(o.date))}${age ? ` · ${age} ans` : ''}">`
      + `<span class="bn-date">${o.day}</span><span class="bn-name">${esc(o.name)}${o.ev.fav ? svg('crown', 'bn-ic crown') : ''}${age ? `<small>${age} ans</small>` : ''}</span><span class="bn-meta">${meta}</span></button>`;   // groupe et cadeaux : dans l'aperçu
  });
  $('bl-list').innerHTML = h + '</div>';
  requestAnimationFrame(spyMonths);
  if (!first) return;
  requestAnimationFrame(() => {
    // sur grand écran on ouvre la liste au niveau d'aujourd'hui ; sur téléphone, « Bientôt » est déjà en haut
    const target = flash.size ? document.querySelector('.bn-flash') : !q && !matchMedia('(max-width: 860px)').matches && document.querySelector('.bn-mh.cur');
    if (!flash.size && target) UI.bmTarget = TODAY.getMonth();
    UI.bnFlash = null;
    if (target) target.scrollIntoView({ block: flash.size ? 'center' : 'start', behavior: flash.size ? 'smooth' : 'auto' });
  });
}

/* Entrée du bandeau : rappelle le prochain anniversaire */
/* « Échéances » dans la barre latérale : la plus proche, ou combien sont en retard */
function updateSideDue() {
  const el = $('side-due-sub'), link = $('side-due'); if (!el) return;
  const open = dueList().filter(x => x.i.st !== 'done').sort((a, b) => a.s - b.s), late = open.filter(x => x.i.st === 'late').length, next = open.find(x => x.i.st !== 'late');
  link.dataset.st = late ? 'late' : next ? next.i.st : ''; link.querySelector('.side-ic').dataset.n = late || (next?.i.st === 'soon' ? next.i.short : '');   // 2 en retard, ou J-3
  el.textContent = late ? `${late} en retard` : next ? (next.i.st === 'today' ? 'aujourd’hui' : next.i.short) : '';
  link.title = `Échéances (E) — ${[late && `${late} en retard`, next && `prochaine : ${next.d.t} (${next.x.title}), ${next.i.long.toLowerCase()}`].filter(Boolean).join(' · ') || 'rien à rendre'}`;
}
function updateSideBdays() {
  const next = allBirthdays()[0], el = $('side-bdays-next'); if (!el) return;
  if (!next) { el.textContent = ''; return; }
  const n = daysBetween(TODAY, next.start), same = allBirthdays().filter(o => key(o.start) === key(next.start));
  $('side-bdays').classList.toggle('today', n === 0);
  const who = o => { const a = ageAt(o.ev, o.start); return shortName(personOf(o.ev)) + (a ? `, ${a}\u00a0ans` : ''); };
  el.textContent = n === 0 ? (same.length === 1 ? who(next) : same.map(o => shortName(personOf(o.ev))).join(', ')) : `${shortName(personOf(next.ev))} · ${n === 1 ? 'demain' : `${n} j`}`;
  $('side-bdays').title = `Anniversaires (B) — ${n === 0 ? `aujourd'hui : ${same.map(who).join(', ')}` : `prochain : ${who(next)}, ${n === 1 ? 'demain' : `dans ${n} jours`}`}`;
}
function toggleBdays() {
  document.body.classList.remove('side-on');
  if (UI.view === 'birthdays') backToCal(); else setView('birthdays');
}
function backToCal() { setView(UI.lastCalView && !isSidePage(UI.lastCalView) ? UI.lastCalView : 'week'); }
function toggleDue() { document.body.classList.remove('side-on'); if (UI.view === 'due') backToCal(); else setView('due'); }
/* La page : une ligne pour ajouter (le titre, puis l'événement), puis les échéances par urgence.
   On coche à gauche ; un clic sur la ligne montre l'événement dans le calendrier. */
function dueWhen(x) {
  const d = cap(fWDM.format(x.start)) + (x.start.getFullYear() === TODAY.getFullYear() ? '' : ` ${x.start.getFullYear()}`);
  return x.allDay ? d : `${d}, ${hm(x.start)}`;
}
function dueCount(i, x) {   // la colonne de droite
  if (i.st === 'done') return svg('check');
  if (i.st === 'late') { const k = Math.max(0, daysBetween(x.start, TODAY)); return k ? `+${k} j` : 'Passée'; }
  if (i.st === 'today') return x.allDay ? 'Auj.' : hm(x.start);
  return `J-${i.n}`;
}
function renderDue() {
  const keep = document.activeElement?.id === 'du-q';
  const all = dueList(), open = all.filter(x => x.i.st !== 'done').sort((a, b) => a.s - b.s), done = all.filter(x => x.i.st === 'done').sort((a, b) => b.s - a.s);
  const groups = [['late', 'En retard', open.filter(x => x.i.st === 'late')], ['week', 'Dans les 7 jours', open.filter(x => x.i.st === 'today' || x.i.st === 'soon')],
    ['later', 'Plus tard', open.filter(x => x.i.st === 'later')]];
  const row = ({ d, x, i }) => `<div class="du-it ${i.st}" style="--c:${calVar(x.cal)}">
      <button class="du-chk" data-done="${d.id}" aria-pressed="${!!d.done}" title="${d.done ? 'Remettre à faire' : 'Marquer comme faite'}" aria-label="${d.done ? 'Remettre à faire' : 'Marquer comme faite'} : ${esc(d.t)}">${svg('check')}</button>
      <button class="du-main" data-goto="${d.id}"${x.ev ? ' title="Voir l’événement dans le calendrier"' : ' disabled'}><b>${esc(d.t)}</b>
        <span class="du-l2"><span class="du-ev"><i></i>${esc(x.title)}</span><span>${dueWhen(x)}</span>${x.ev ? '' : '<span class="du-gone">l’événement n’est plus dans l’agenda</span>'}</span></button>
      <span class="du-cd ${i.st}" title="${esc(i.long)}">${dueCount(i, x)}</span>
      <button class="du-x" data-dux="${d.id}" aria-label="Supprimer : ${esc(d.t)}" title="Supprimer">${svg('x')}</button>
    </div>`;
  const sec = ([k, t, xs]) => `<section class="du-g ${k}"><h3>${t}<span>${xs.length}</span></h3><div class="du-list">${xs.map(row).join('')}</div></section>`;
  pageEl().innerHTML = `<div class="ax du-page">
    <form class="du-add" id="du-add" novalidate>
      <span class="du-add-ic">${svg('flag')}</span>
      <input id="du-q" autocomplete="off" placeholder="Nouvelle échéance — ex. Dossier marketing" aria-label="Nouvelle échéance : ce qu’il y a à rendre" aria-describedby="du-hint">
      <span id="du-ev-chip"></span>
      <button type="button" class="btn ghost sm" data-du="pick" title="L’événement où on la rend : un cours, un oral, un partiel…">${svg('cal')}<span>Événement</span></button>
      <button type="submit" class="btn primary sm">Ajouter</button>
    </form>
    <p class="du-hint" id="du-hint"></p>
    ${all.length ? groups.filter(g => g[2].length).map(sec).join('') + (done.length ? `<details class="du-g done"${UI.duDone ? ' open' : ''}><summary><h3>Faites<span>${done.length}</span></h3></summary><div class="du-list">${done.map(row).join('')}</div></details>` : '')
      : `<div class="mm-empty">${svg('flag')}<b>Aucune échéance</b><span>Un dossier, un exposé, des révisions ? Écris-le au-dessus et choisis l’événement où tu le rends. Ou clique sur un événement dans le calendrier.</span></div>`}
  </div>`;
  const q = $('du-q'); q.value = UI.duQ || ''; duPreview(); if (keep || UI.duFocus) { q.focus(); UI.duFocus = false; }
}
function duPreview() {
  const h = $('du-hint'); if (!h) return;
  const t = $('du-q').value.trim(), f = UI.duEv, ev = f && getEv(f.id);
  $('du-ev-chip').innerHTML = ev ? `<span class="du-chip" style="--c:${calVar(ev.cal)}"><i></i>${esc(ev.title)}<button type="button" data-du="unev" aria-label="Choisir un autre événement">${svg('x')}</button></span>` : '';
  h.classList.remove('err');
  if (!ev) { h.innerHTML = t ? `<kbd>Entrée</kbd> puis choisis l’événement où tu la rends.` : `Ou depuis le calendrier : clique sur un événement, puis <b>Ajouter une échéance</b>.`; return; }
  const o = isRec(ev) ? occurrenceOf(ev, f.occ) : { start: parse(ev.start) }, i = dueInfo({ start: toStr(o.start, ev.allDay), allDay: ev.allDay });
  h.innerHTML = `${svg('flag')}${t ? `<b>${esc(t)}</b> · ` : ''}pour ${esc(ev.title)}, ${cap(fWDM.format(o.start))}${ev.allDay ? '' : ` à ${hm(o.start)}`} · <span class="due-t ${i.st}">${esc(i.long)}</span>${t ? ' — <kbd>Entrée</kbd> pour ajouter' : ''}`;
}
function duAdd() {
  const q = $('du-q'), t = q.value.trim(), h = $('du-hint');
  if (!t) { h.classList.add('err'); h.textContent = 'Écris d’abord ce qu’il y a à rendre.'; q.focus(); return; }
  const f = UI.duEv, ev = f && getEv(f.id);
  if (!ev) { openPicker($('du-add').querySelector('[data-du="pick"]'), null, g => { UI.duEv = g; duAdd(); }); return; }
  UI.duQ = ''; UI.duEv = null; UI.duFocus = true;
  addDue(t, ev, f.occ);
}
pageEl().addEventListener('input', e => { if (e.target.id === 'du-q') { UI.duQ = e.target.value; duPreview(); } });
pageEl().addEventListener('submit', e => { if (e.target.id === 'du-add') { e.preventDefault(); duAdd(); } });
pageEl().addEventListener('click', e => {
  if (UI.view !== 'due') return;
  const pk = e.target.closest('[data-du="pick"]');
  if (pk) { openPicker(pk, UI.duEv, f => { UI.duEv = f; duPreview(); $('du-q').focus(); }); return; }
  if (e.target.closest('[data-du="unev"]')) { UI.duEv = null; duPreview(); $('du-q').focus(); return; }
  const go = e.target.closest('[data-goto]'); if (go) { const d = S.dues.find(x => x.id === go.dataset.goto), x = d && dueAt(d); if (x?.ev) revealOcc(x.ev.id, x.occ); return; }
  const dx = e.target.closest('[data-dux]'); if (dx) { deleteDue(dx.dataset.dux); return; }
  const sm = e.target.closest('.du-g.done > summary'); if (sm) UI.duDone = !sm.parentElement.open;
});

/* --- Choisir l'événement : ceux des 8 prochaines semaines, cherchables ; abonnements compris --- */
let pickEl = null;
function closePicker() { pickEl?.remove(); pickEl = null; }
function upcomingEvents(q = '') {
  const f = fold(q.trim()), now = new Date();
  return occurrences(TODAY, addDays(TODAY, 57)).filter(o => !isBday(o.ev) && (o.ev.allDay ? o.end > TODAY : o.end > now) && (!f || fold(o.ev.title).includes(f)))
    .sort((a, b) => a.start - b.start || a.ev.allDay - b.ev.allDay).slice(0, 80);
}
function openPicker(anchor, sel, onPick) {
  closePicker();
  pickEl = document.createElement('div'); pickEl.className = 'cpick'; pickEl.setAttribute('role', 'dialog'); pickEl.setAttribute('aria-label', 'Choisir l’événement');
  pickEl.innerHTML = `<div class="cp-head">${svg('search')}<input class="cp-q" placeholder="Chercher un événement…" autocomplete="off" aria-label="Chercher un événement"></div><div class="cp-list"></div>`;
  document.body.append(pickEl);
  const q = pickEl.querySelector('.cp-q'), list = pickEl.querySelector('.cp-list');
  const draw = () => {
    const xs = upcomingEvents(q.value); let last = '';
    list.innerHTML = xs.length ? xs.map(o => { const d = key(o.start), head = d !== last ? `<div class="cp-day">${cap(fWDM.format(o.start))}</div>` : ''; last = d;
      const has = dueFor(o.ev, o.occKey);
      return `${head}<button type="button" class="cp-it${sel && sel.id === o.ev.id && sel.occ === o.occKey ? ' on' : ''}" data-cp="${o.ev.id}|${o.occKey}" style="--c:${calVar(o.ev.cal)}"${has ? ' disabled' : ''}><span class="cp-h">${o.ev.allDay ? 'Journée' : hm(o.start)}</span><i></i><b>${esc(o.ev.title)}</b><small>${has ? `${svg('flag')}Déjà une échéance : ${esc(has.t)}` : esc(getCal(o.ev.cal).name)}</small></button>`; }).join('')
      : `<p class="cp-empty">${q.value.trim() ? 'Aucun événement à ce nom dans les 8 prochaines semaines' : 'Aucun événement dans les 8 prochaines semaines'}</p>`;
  };
  draw();
  const r = anchor.getBoundingClientRect(), W = Math.min(360, innerWidth - 24), below = innerHeight - r.bottom - 16, above = r.top - 16;
  pickEl.style.width = W + 'px'; pickEl.style.left = Math.max(12, Math.min(r.right - W, innerWidth - W - 12)) + 'px';
  if (below >= 260 || below >= above) { pickEl.style.top = r.bottom + 6 + 'px'; pickEl.style.maxHeight = Math.min(420, below) + 'px'; }
  else { pickEl.style.bottom = innerHeight - r.top + 6 + 'px'; pickEl.style.maxHeight = Math.min(420, above) + 'px'; }
  q.addEventListener('input', draw);
  pickEl.addEventListener('keydown', e => {
    const its = [...list.querySelectorAll('[data-cp]:not(:disabled)')], i = its.indexOf(document.activeElement);
    if (e.key === 'Enter' && e.target === q) { e.preventDefault(); its[0]?.click(); }
    else if (e.key === 'ArrowDown') { e.preventDefault(); (its[i + 1] || its[0])?.focus(); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); i <= 0 ? q.focus() : its[i - 1].focus(); }
  });
  list.addEventListener('click', e => {
    const b = e.target.closest('[data-cp]'); if (!b || b.disabled) return;
    const [id, occ] = b.dataset.cp.split('|');
    closePicker(); onPick({ id, occ });
  });
  setTimeout(() => q.focus(), 20);
}
document.addEventListener('pointerdown', e => { if (pickEl && !pickEl.contains(e.target) && !e.target.closest('[data-du="pick"]')) closePicker(); }, true);
function toggleMem() { document.body.classList.remove('side-on'); if (UI.view === 'memories') backToCal(); else { UI.memDay = new Date(TODAY); setView('memories'); } }

/* --- Souvenirs --- */
function pastSingles() { // mis en cache, invalidé par dirty()
  if (_past) return _past;
  const out = [], from = new Date(1990, 0, 1);
  S.events.forEach(ev => { const c = getCal(ev.cal); if (!c || !c.visible || c.sub || isRec(ev)) return; out.push(...expand(ev, from, TODAY)); });   // un cours ou un trajet d'abonnement n'est pas un souvenir
  return (_past = out.sort((a, b) => a.start - b.start));
}
/* --- Souvenirs : une page façon bloc-notes ---
   Chaque événement passé d'une année précédente revient à sa date, comme un anniversaire :
   « 14 novembre  Voyage à Lisbonne  · il y a 3 ans ». Seuls les jours pour jour comptent. */
function memItems() {   // mis en cache, invalidé par dirty()
  if (_mem) return _mem;
  const Y = TODAY.getFullYear();
  return _mem = pastSingles().filter(o => o.start.getFullYear() < Y).map(o => {
    const m = o.start.getMonth(), day = o.start.getDate();
    const date = new Date(Y, m, Math.min(day, dim(new Date(Y, m, 1)))), n = daysBetween(TODAY, date);
    return { o, m, day, date, n, past: n < 0, yrs: Y - o.start.getFullYear(), days: Math.max(1, daysBetween(o.start, o.end)) };
  }).sort((a, b) => a.m - b.m || a.day - b.day || a.yrs - b.yrs);
}
function updateMemBadge() {
  const link = $('side-mem'), sub = $('side-mem-sub'); if (!link) return;
  const all = memItems(), today = all.filter(x => x.n === 0), next = all.filter(x => x.n > 0).sort((a, b) => a.n - b.n)[0];
  let seen = ''; try { seen = localStorage.getItem('agenda-mem-seen') || ''; } catch (e) {}
  link.classList.toggle('has', today.length > 0 && seen !== key(TODAY));   // comme une notification : vue, elle s'éteint jusqu'aux souvenirs du lendemain
  sub.textContent = today.length ? today.map(x => x.o.ev.title).join(', ') : next ? `${next.n} j` : '';
  link.title = `Souvenirs (O) — ${today.length ? `aujourd'hui : ${today.map(x => x.o.ev.title).join(', ')}` : next ? `prochain : ${next.o.ev.title}, dans ${next.n} jours` : 'jour pour jour, d’une année sur l’autre'}`;
}
function memByDay() {
  const map = new Map();
  memItems().forEach(x => { const k = `${x.m}-${x.day}`; if (!map.has(k)) map.set(k, []); map.get(k).push(x); });
  return map;
}
/* Flèches : on saute au jour précédent / suivant qui a des souvenirs (en boucle sur l'année) */
/* Les jours qui ont des souvenirs, de l'an dernier à aujourd'hui (plus aujourd'hui) */
function memDays() {
  const out = new Map([[key(TODAY), sod(TODAY)]]);
  for (const k of memByDay().keys()) {
    const [m, d] = k.split('-').map(Number), Y = TODAY.getFullYear();
    let dt = new Date(Y, m, Math.min(d, dim(new Date(Y, m, 1))));
    if (dt > TODAY) dt = new Date(Y - 1, m, Math.min(d, dim(new Date(Y - 1, m, 1))));
    out.set(key(dt), dt);
  }
  const cur = UI.memDay || TODAY; out.set(key(cur), sod(cur));
  return [...out.values()].sort((a, b) => a - b);
}
function memStep(dir) {
  const cur = UI.memDay || TODAY;
  if (dir === 'today') { UI.memDay = new Date(TODAY); renderMemories('next'); return; }
  if (dir === 'prev' || dir === 'next') {                       // d'un jour à souvenirs au suivant, jamais après aujourd'hui
    const list = memDays(), i = list.findIndex(d => key(d) === key(cur)), d = list[i + (dir === 'next' ? 1 : -1)];
    if (!d) return;
    UI.memDay = d; renderMemories(dir); return;
  }
  // « souvenir précédent / suivant » : le premier jour qui en a, sans dépasser aujourd'hui
  const has = memByDay(), step = dir === 'jump-next' ? 1 : -1;
  for (let i = 1, d = addDays(cur, step); i <= 366 && d <= TODAY; i++, d = addDays(d, step)) {
    if (has.has(`${d.getMonth()}-${d.getDate()}`)) { UI.memDay = d; renderMemories(step > 0 ? 'next' : 'prev'); return; }
  }
}
function renderMemories(dir) {
  const day = UI.memDay || TODAY, Y = TODAY.getFullYear(), isToday = key(day) === key(TODAY);
  if (isToday) UI.memDay = new Date(TODAY);
  const items = memItems().filter(x => x.m === day.getMonth() && x.day === day.getDate()).sort((a, b) => a.yrs - b.yrs || a.o.start - b.o.start);
  const years = [...new Set(items.map(x => x.yrs))];
  const agoList = years.length ? years.join(', ').replace(/, (\d+)$/, ' et $1') + ` an${years.length > 1 || years[0] > 1 ? 's' : ''}` : '';
  const sub = items.length ? `${items.length} souvenir${items.length > 1 ? 's' : ''} · il y a ${agoList}` : 'Rien ce jour-là les années précédentes';
  let body = '';
  if (items.length) {
    body = '<div class="mm-list">' + years.map(yr => {
      const g = items.filter(x => x.yrs === yr);
      return `<section class="mm-year"><div class="mm-yh"><b>${Y - yr}</b><span>il y a ${yr} an${yr > 1 ? 's' : ''}</span></div><div class="mm-ycards">` + g.map(x => {
        const ev = x.o.ev;
        const when = ev.allDay ? (x.days > 1 ? `${x.days} jours, jusqu'au ${fDM.format(addDays(x.o.end, -1))}` : 'Toute la journée') : `${hm(x.o.start)}${endTxt(ev, x.o.end)}`;
        return `<article class="mm-card" style="--c:${calVar(ev.cal)}"><button class="mm-main" data-open="${ev.id}|${x.o.occKey}"><b>${esc(ev.title)}</b><span>${svg('clock')}${when}</span>${ev.loc ? `<span>${svg('pin')}${esc(ev.loc)}</span>` : ''}${ev.desc ? `<p>${esc(ev.desc)}</p>` : ''}</button>`
          + `<button class="mm-go" data-goday="${key(x.o.start)}" title="Ouvrir cette journée dans le calendrier"><span>${cap(fWDMY.format(x.o.start))}</span>${svg('right')}</button></article>`;
      }).join('') + '</div></section>';
    }).join('') + '</div>';
  } else {
    const hasAny = memByDay().size > 0;
    body = `<div class="mm-empty">${svg('history')}<b>${isToday ? "Pas de souvenir aujourd'hui" : 'Pas de souvenir ce jour-là'}</b><span>Tes événements reviennent ici un an après, jour pour jour.</span>${hasAny ? `<div class="mm-jumps"><button class="btn" data-mm="jump-prev">${svg('left')} Souvenir précédent</button>${isToday ? '' : `<button class="btn" data-mm="jump-next">Souvenir suivant ${svg('right')}</button>`}</div>` : ''}</div>`;
  }
  // Frise : seulement les jours qui ont des souvenirs, autour du jour affiché
  const days = memDays(), at = days.findIndex(d => key(d) === key(day)), from = Math.max(0, Math.min(at - 4, days.length - 9));
  const strip = days.slice(from, from + 9).map((d, j) => {
    const on = key(d) === key(day), td = key(d) === key(TODAY), far = Math.abs(from + j - at) > 2;
    const n = memItems().filter(x => x.m === d.getMonth() && x.day === d.getDate()).length;
    return `<button class="mm-d${far ? ' far' : ''}${on ? ' on' : ''}${td ? ' today' : ''}${n ? '' : ' none'}" data-mm-key="${key(d)}" aria-label="${cap(fWDM.format(d))}${n ? `, ${n} souvenir${n > 1 ? 's' : ''}` : ''}" ${on ? 'aria-current="date"' : ''}><b>${d.getDate()}</b><small>${td ? 'auj.' : fMs.format(d)}</small></button>`;
  });
  const isFirst = at <= 0;
  pageEl().innerHTML = `<div class="ax mm-page">
    <div class="mm-hero">
      <div class="mm-title"><small><span class="mm-k">Ce jour-là</span></small><h2>${cap(fWDM.format(day))}</h2><span>${sub}</span></div>
      <div class="mm-strip-wrap">
        <button class="icon-btn flat" data-mm="prev" aria-label="Souvenir précédent" title="Souvenir précédent  ←" ${isFirst ? 'disabled' : ''}>${svg('left')}</button>
        <div class="mm-strip" role="group" aria-label="Jours avec des souvenirs">${strip.join('')}</div>
        <button class="icon-btn flat" data-mm="next" aria-label="Souvenir suivant" title="Souvenir suivant  →" ${isToday ? 'disabled' : ''}>${svg('right')}</button>
      </div>
      ${isToday ? '' : `<button class="mm-back" data-mm="today">Revenir à aujourd'hui</button>`}
    </div>
    <div class="mm-body${dir === 'next' ? ' slide-l' : dir === 'prev' ? ' slide-r' : ''}">${body}</div>
  </div>`;
}

$('page').addEventListener('click', e => {
  const bm = e.target.closest('[data-bm]'); if (bm) { UI.bmTarget = +bm.dataset.bm; $(`bm-${bm.dataset.bm}`)?.scrollIntoView({ block: 'start', behavior: 'smooth' }); spyMonths(); return; }
  const mm = e.target.closest('[data-mm]'); if (mm) { memStep(mm.dataset.mm); return; }
  const mk = e.target.closest('[data-mm-key]'); if (mk) { const d = parse(mk.dataset.mmKey), cur = UI.memDay || TODAY; if (key(d) !== key(cur)) { UI.memDay = d; renderMemories(d > cur ? 'next' : 'prev'); } return; }
  const dn = e.target.closest('[data-done]'); if (dn) { toggleDone(dn.dataset.done); return; }
  if (e.target.closest('[data-more]')) { UI.upLen += UP_DAYS; UI.quiet = true; renderUpcoming(); UI.quiet = false; updateTitle(); return; }
  const gm = e.target.closest('[data-gomonth]'); if (gm) { const [y, mo] = gm.dataset.gomonth.split('-').map(Number); setView('month'); cal.gotoDate(new Date(y, mo - 1, 1)); return; }
  const g = e.target.closest('[data-goday]'); if (g) { goDay(parse(g.dataset.goday)); return; }
  const b = e.target.closest('[data-open]'); if (b) { const [id, k] = b.dataset.open.split('|'); openPopover(id, k, b); }
});

/* ===================== Aperçu rapide ===================== */
/* Sur téléphone, les fenêtres flottantes deviennent des feuilles du bas avec un voile */
function scrimOn() { if (!mqPhone.matches || popScrim) return; popScrim = document.createElement('div'); popScrim.className = 'pop-scrim'; document.body.appendChild(popScrim); }
function scrimOff() { if (popEl || qcEl || !popScrim) return; popScrim.remove(); popScrim = null; }
function placeNear(el, r) {
  if (mqPhone.matches) return;
  const pw = el.offsetWidth, ph = el.offsetHeight, W = innerWidth, H = innerHeight;
  let left = r.right + 10; if (left + pw > W - 12) left = r.left - pw - 10; if (left < 12) left = Math.max(12, Math.min(W - pw - 12, r.left));
  const top = Math.min(Math.max(12, r.top), H - ph - 12);
  el.style.left = left + 'px'; el.style.top = top + 'px';
}
function closePopover() {
  if (popEl) { popEl.remove(); popEl = null; }
  UI.sel = null;
  if (UI.selectedEl) { UI.selectedEl.classList.remove('is-selected'); UI.selectedEl = null; }
  scrimOff();
}
function openPopover(evId, occKey, anchor) {
  closePopover(); closeQuick();
  const ev = getEv(evId); if (!ev) return;
  const o = occurrenceOf(ev, occKey), c = getCal(ev.cal), bd = isBday(ev), age = bd ? ageAt(ev, o.start) : null;
  if (anchor.classList.contains('fc-event')) { anchor.classList.add('is-selected'); UI.selectedEl = anchor; }
  popEl = document.createElement('div');
  popEl.className = 'pop pv'; popEl.setAttribute('role', 'dialog'); popEl.setAttribute('aria-label', ev.title);
  popEl.style.setProperty('--c', calVar(ev.cal));
  const ro = isSub(ev);
  /* Le contenu (titre, lignes) se redessine sur place : la couronne, par exemple, ne ferme pas l'aperçu */
  const body = () => {
  const rows = [];
  if (age) { const n = daysBetween(TODAY, o.start); rows.push(['cake', n === 0 ? `Fête ses ${age} ans aujourd'hui` : n > 0 ? `Fêtera ses ${age} ans` : `A fêté ses ${age} ans`]); }
  if (bd) {
    if (ev.group) rows.push([isFam(ev) ? 'home' : 'list', `<span class="grp" style="--c:${grpCol(ev.group)}">${esc(ev.group)}</span>${ev.fav ? ' · favori' : ''}`]);
    else if (ev.fav) rows.push(['crown', 'Favori']);
    const ideas = giftIdeas(ev), given = (ev.gifts || []).filter(g => g.y).sort((a, b) => b.y - a.y)[0];
    rows.push(['gift', ideas.length ? `${ideas.length > 1 ? `${ideas.length} idées` : '1 idée'} : ${ideas.map(g => esc(g.t)).join(', ')}` : '<span class="muted">Pas encore d’idée cadeau</span>']);
    if (given) rows.push(['history', `Offert en ${given.y} : ${esc(given.t)}`]);
  }
  if (isRec(ev) && !bd) rows.push(['repeat', ruleText(ev)]);
  if (ev.repNote) rows.push(['alert', `<span class="muted">${esc(ev.repNote)}</span>`]);   // abonnement : répétition que l'agenda ne sait pas suivre
  if (ev.loc) rows.push(['pin', esc(ev.loc)]);
  if (ev.rem !== 'none' && REM[ev.rem]) rows.push(['bell', REM[ev.rem]]);
  if (ev.desc) rows.push(['text', esc(ev.desc)]);
  rows.push(['cal', esc(c.name)]);
  if (ro) rows.push(['link', `Abonnement · lecture seule${c.sub.at ? ` · mis à jour ${agoTxt(c.sub.at)}` : ''}`]);
  return `<div class="pop-title"><i></i><div><h3>${esc(ev.title)}</h3><p style="white-space:pre-line">${whenText(o)}</p></div></div>
    ${rows.map(([i, t]) => `<div class="pop-row">${svg(i)}<p>${t}</p></div>`).join('')}`;
  };
  /* En haut : seulement fermer. En bas : une seule barre — Supprimer (et la couronne d'un anniversaire) à gauche, « Modifier » à droite.
     Copier un événement : Ctrl + glisser dans la grille. */
  const ib = (p, ic, label, extra = '') => `<button class="icon-btn flat pb-ic" data-p="${p}" aria-label="${label}" title="${label}"${extra}>${svg(ic)}</button>`;
  const bar = ro ? '' : `<div class="pop-bar">${ib('delete', 'trash', 'Supprimer  (Suppr)')}`
    + `${bd ? ib('fav', 'crown', ev.fav ? 'Retirer des favoris' : 'Mettre en favori : une couronne, et un rappel la veille en plus', ` aria-pressed="${!!ev.fav}"`) : ''}`
    + `<span class="spacer"></span><button class="btn primary pb-edit" data-p="edit">Modifier</button></div>`;
  popEl.innerHTML = `<div class="pop-actions"><button class="icon-btn flat sm" data-p="close" aria-label="Fermer" title="Fermer  (Échap)">${svg('x')}</button></div>
    <div class="pop-body">${body()}</div>
    ${bd ? '' : '<div class="pop-dues"></div>'}
    ${bar}`;
  document.body.appendChild(popEl);
  UI.sel = { evId, occKey }; UI.popAt = Date.now(); scrimOn();
  placeNear(popEl, anchor.getBoundingClientRect());
  popEl.addEventListener('click', e => {
    const pc = e.target.closest('[data-pdc]'); if (pc) { toggleDone(pc.dataset.pdc); popDues(ev, o.occKey); return; }
    const px = e.target.closest('[data-pdx]'); if (px) { deleteDue(px.dataset.pdx); popDues(ev, o.occKey); popEl?.querySelector('.pd-new')?.focus(); return; }   // place libre : on peut en remettre une
    const b = e.target.closest('[data-p]'); if (!b) return;
    if (b.dataset.p === 'close') closePopover();
    else if (b.dataset.p === 'fav') {   // l'aperçu reste ouvert : la couronne et la ligne « favori » changent sur place
      toggleFav(evId);
      b.setAttribute('aria-pressed', String(!!ev.fav)); b.title = b.ariaLabel = ev.fav ? 'Retirer des favoris' : 'Mettre en favori : une couronne, et un rappel la veille en plus';
      popEl.querySelector('.pop-body').innerHTML = body(); popIn(b, 'pop-b');
    }
    else if (b.dataset.p === 'edit') { closePopover(); openEditor({ mode: 'edit', evId, occKey }); }
    else if (b.dataset.p === 'delete') { closePopover(); deleteFlow(evId, occKey); }
  });
  if (!bd) {   // échéances : ajouter (Entrée), cocher, retirer
    popDues(ev, o.occKey);
    popEl.addEventListener('submit', e => { e.preventDefault(); const inp = e.target.querySelector('.pd-new'), t = inp?.value.trim(); if (!t) return; addDue(t, ev, o.occKey); popDues(ev, o.occKey); });
  }
  (popEl.querySelector('.pop-bar [data-p="edit"]') || popEl.querySelector('[data-p="close"]')).focus({ preventScroll: true, focusVisible: false });   // Entrée = Modifier, sans anneau au clic   // abonnement : pas de « Modifier »
}
/* Les échéances d'un événement, dans son aperçu : même pour un cours d'abonnement */
function popDues(ev, occKey) {
  const box = popEl?.querySelector('.pop-dues'); if (!box) return;
  const d = dueFor(ev, occKey), i = d && dueState(d).i;
  box.innerHTML = d ? `<div class="pd-row${d.done ? ' done' : ''}">
      <button class="pd-chk" data-pdc="${d.id}" aria-pressed="${!!d.done}" title="${d.done ? 'Remettre à faire' : 'Marquer comme faite'}" aria-label="${d.done ? 'Remettre à faire' : 'Marquer comme faite'} : ${esc(d.t)}">${svg('check')}</button>
      <span class="pd-t" title="${esc(d.t)}">${esc(d.t)}</span>
      <span class="due-b ${i.st}" title="${esc(i.long)}">${svg(i.st === 'done' ? 'check' : 'flag')}<span>${esc(i.short)}</span></span>
      <button class="pd-x" data-pdx="${d.id}" aria-label="Supprimer l’échéance ${esc(d.t)}" title="Supprimer">${svg('x')}</button></div>`
    : `<form class="pd-add">${svg('flag')}<input class="pd-new" placeholder="Ajouter une échéance…" aria-label="Ajouter une échéance à ${esc(ev.title)}" autocomplete="off" spellcheck="false"></form>`;
}
function toggleFav(id) {
  const ev = getEv(id); if (!ev) return;
  const snap = snapshot(); if (ev.fav) delete ev.fav; else ev.fav = true;
  refreshData([ev.cal]); toast(ev.fav ? 'Ajouté aux favoris' : 'Retiré des favoris', snap, { title: personOf(ev), rest: ev.fav ? 'en favori : couronne, et un rappel la veille' : 'n’est plus en favori' });
}
/* Va jusqu'à une occurrence (même dans un calendrier masqué) et ouvre son aperçu */
function revealOcc(id, k) {
  const ev = getEv(id); if (!ev) return;
  const c = getCal(ev.cal);
  if (c && !c.visible) { c.visible = true; renderCalList(); calsChanged(); }
  if (isPage()) setView('week');
  const o = occurrenceOf(ev, k);
  cal.gotoDate(o.start);
  if (!ev.allDay) cal.scrollToTime(`${pad(Math.max(0, o.start.getHours() - 1))}:00:00`);
  requestAnimationFrame(() => requestAnimationFrame(() => {
    const el = document.querySelector(`.fc-event[data-occ="${id}@${k}"]`);
    openPopover(id, k, el || document.querySelector('.sheet'));
  }));
}

/* --- Création rapide : un titre, Entrée, c'est fait --- */
/* ===================== Langage naturel =====================
   Le titre peut dire quand, combien de temps, à quelle fréquence, où et dans quel calendrier :
   « Dentiste mardi 15h », « Foot tous les jeudis 20h-21h30 @Gymnase », « Partiels du 14 au 18 déc. #cours ».
   Chaque morceau compris garde sa place dans le texte (a, b) : on le surligne, et il sort du titre à l'enregistrement. */
const NL_WD = '(lundi|mardi|mercredi|jeudi|vendredi|samedi|dimanche)';
const NL_MO = '(janv(?:ier)?|fevr?(?:ier)?|mars|avr(?:il)?|mai|juin|juil(?:let)?|aout|sept(?:embre)?|oct(?:obre)?|nov(?:embre)?|dec(?:embre)?)\\.?';
const NL_N = '(\\d{1,3}|une?|deux|trois|quatre|cinq|six|sept|huit|neuf|dix|quinze)';
const NL_T = '(?:\\d{1,2}\\s?h(?:\\s?\\d{2})?|\\d{1,2}:\\d{2}|midi|minuit)';          // 15h, 15h30, 15 h 30, 15:30, midi
const NL_NUM = { un: 1, une: 1, deux: 2, trois: 3, quatre: 4, cinq: 5, six: 6, sept: 7, huit: 8, neuf: 9, dix: 10, quinze: 15 };
const NL_PART = { matin: [9, 'Matin'], matinee: [9, 'Matinée'], 'apres-midi': [14, 'Après-midi'], aprem: [14, 'Après-midi'], soir: [19, 'Soir'], soiree: [19, 'Soirée'] };
const WD_JS = w => ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'].indexOf(w);
const nlNum = w => /^\d+$/.test(w) ? +w : NL_NUM[w];
const nlHM = t => `${pad(t.h)}:${pad(t.mi)}`;
function nlT(t) {
  if (t === 'midi') return { h: 12, mi: 0 }; if (t === 'minuit') return { h: 0, mi: 0 };
  const m = t.match(/(\d{1,2})\s?(?:h\s?(\d{2})?|:(\d{2}))/); if (!m) return null;
  const h = +m[1], mi = +(m[2] || m[3] || 0); return h < 24 && mi < 60 ? { h, mi } : null;
}
function nextDow(js, from = TODAY, same = false) { let k = (js - from.getDay() + 7) % 7; if (!k && !same) k = 7; return addDays(sod(from), k); }
function monthIdx(w) { const f = fold(w); if (f.startsWith('juil')) return 6; if (f.startsWith('juin')) return 5; return MONTHS_FR.findIndex(x => fold(x).startsWith(f.slice(0, 3))); }
function nlDM(d, mo, y) {           // jour + mois (+ année) ; sans année, la prochaine fois que cette date revient
  const m = typeof mo === 'number' ? mo : monthIdx(mo); if (m < 0) return null;
  const yr = y ? +(String(y).length === 2 ? '20' + y : y) : TODAY.getFullYear();
  let r = new Date(yr, m, +d); if (r.getMonth() !== m) return null;
  if (!y && r < TODAY) r = new Date(yr + 1, m, +d);
  return r;
}
function nlDay(n) { for (let i = 0; i < 3; i++) { const c = new Date(TODAY.getFullYear(), TODAY.getMonth() + i, n); if (c.getDate() === n && c >= TODAY) return c; } return null; }
function nlDayLabel(d) { const n = daysBetween(TODAY, d); return n === 0 ? 'Aujourd’hui' : n === 1 ? 'Demain' : cap(fWDMs.format(d)) + (d.getFullYear() !== TODAY.getFullYear() ? ` ${d.getFullYear()}` : ''); }

function parseNL(text, opt = {}) {
  const dates = opt.dates !== false, ign = opt.ignore || new Set();
  const parts = [], W = {}, R = { parts, when: null, rep: null, loc: null, cal: null };
  const f = fold(text);
  let lo = f.length === text.length ? f : text.toLowerCase(), up = text;   // texte restant : sans accents en minuscules, et tel quel
  const B = "(?<![\\p{L}\\p{N}@#\\-'’])", E = '(?![\\p{L}\\p{N}])';
  /* Cherche `body` dans ce qui reste ; fn(m) renvoie l'étiquette de la puce, ou false pour laisser le mot au titre */
  const taken = new Uint8Array(text.length);   // positions déjà comprises
  /* end(m, a, b) peut raccourcir le morceau trouvé (le lieu après @ s'arrête au premier morceau déjà compris) */
  const take = (kind, body, fn, cased = false, end = null) => {
    const re = new RegExp(B + '(?:' + body + ')' + E, 'gu');
    for (let from = 0; ;) {
      re.lastIndex = from; const m = re.exec(cased ? up : lo); if (!m) return false;
      const a = m.index, b = end ? end(m, a, a + m[0].length) : a + m[0].length, raw = text.slice(a, b); from = a + m[0].length;
      if (b <= a || ign.has(kind + ':' + fold(raw))) continue;
      const label = fn(m, raw); if (label === false || label == null) continue;
      parts.push({ kind, a, b, raw, label }); taken.fill(1, a, b);
      const blank = ' '.repeat(b - a); lo = lo.slice(0, a) + blank + lo.slice(b); up = up.slice(0, a) + blank + up.slice(b);
      return true;
    }
  };
  // --- Calendrier : « #cours »
  take('cal', '#([\\p{L}\\p{N}_-]+)', m => { const t = fold(m[1]), c = S.calendars.find(c => fold(c.name).startsWith(t) || c.id === t); if (!c) return false; R.cal = c.id; return c.name; });
  // --- Répétition
  const repOf = (freq, days, label) => { R.rep = { freq, days: days || null, until: null }; return label; };
  const dows = t => [...new Set([...t.matchAll(new RegExp(NL_WD, 'g'))].map(x => WD_JS(x[1]) || 7))].sort();
  take('rep', '(?:tous les jours|chaque jour)\\s+(?:de (?:la )?semaine|ouvres?)|en semaine', () => repOf('weekly', [1, 2, 3, 4, 5], 'Chaque jour de semaine'))
  || take('rep', 'tous les jours|chaque jour', () => repOf('daily', null, 'Chaque jour'))
  || take('rep', `(?:tous les|chaque)\\s+${NL_WD}s?(?:\\s*(?:,|et)\\s*(?:les?\\s+)?${NL_WD}s?)*|les\\s+${NL_WD}s(?:\\s*(?:,|et)\\s*(?:les\\s+)?${NL_WD}s)*`, m => {
       const d = dows(m[0]); return repOf('weekly', d, 'Chaque ' + (d.length === 1 ? DOW_NAMES[d[0] - 1] : d.map(x => DOW_NAMES[x - 1].slice(0, 3) + '.').join(' ')));
     })
  || take('rep', '(?:toutes les|chaque)\\s+semaines?', () => repOf('weekly', null, 'Chaque semaine'))
  || take('rep', '(?:tous les|chaque)\\s+mois', () => repOf('monthly', null, 'Chaque mois'))
  || take('rep', 'tous les ans|chaque annee', () => repOf('yearly', null, 'Chaque année'));
  if (R.rep) take('until', `jusqu['’]?\\s?(?:au|a)\\s+(?:le\\s+)?(?:(\\d{1,2})(?:er)?\\s+${NL_MO}(?:\\s+(\\d{4}))?|(\\d{1,2})[/.](\\d{1,2})(?:[/.](\\d{2,4}))?)`, m => {
    const d = m[2] ? nlDM(m[1], m[2], m[3]) : nlDM(m[4], +m[5] - 1, m[6]); if (!d) return false; R.rep.until = key(d); return `Jusqu’au ${fDM.format(d)}`;
  });
  // --- Jours
  if (dates) {
    take('date', `du\\s+(\\d{1,2})(?:er)?(?:\\s+${NL_MO})?\\s+au\\s+(\\d{1,2})(?:er)?\\s+${NL_MO}(?:\\s+(\\d{4}))?`, m => {
      const e = nlDM(m[3], m[4], m[5]); if (!e) return false;
      let d = nlDM(m[1], m[2] || m[4], e.getFullYear()); if (!d) return false;
      if (d > e) d = new Date(d.getFullYear() - 1, d.getMonth(), d.getDate());   // « du 28 déc. au 3 janv. »
      W.date = d; W.endDate = addDays(e, 1); return `${cap(fWDMs.format(d))} → ${fWDMs.format(e)}`;
    })
    || take('date', '(?:du\\s+)?(\\d{1,2})[/.](\\d{1,2})\\s+au\\s+(\\d{1,2})[/.](\\d{1,2})', m => {
      const d = nlDM(m[1], +m[2] - 1), e = nlDM(m[3], +m[4] - 1); if (!d || !e || e < d) return false;
      W.date = d; W.endDate = addDays(e, 1); return `${cap(fWDMs.format(d))} → ${fWDMs.format(e)}`;
    })
    || take('date', `du\\s+${NL_WD}\\s+au\\s+${NL_WD}`, m => {
      const d = nextDow(WD_JS(m[1])), e = nextDow(WD_JS(m[2]), d, true);
      W.date = d; W.endDate = addDays(e, 1); return `${cap(fWDMs.format(d))} → ${fWDMs.format(e)}`;
    })
    || take('date', "aujourd['’]?\\s?hui|auj", () => { W.date = new Date(TODAY); return 'Aujourd’hui'; })
    || take('date', 'apres[- ]demain', () => { W.date = addDays(TODAY, 2); return nlDayLabel(W.date); })
    || take('date', 'demain', () => { W.date = addDays(TODAY, 1); return 'Demain'; })
    || take('date', 'ce\\s+week-?end', () => { W.weekend = true; if (TODAY.getDay() === 0) { W.date = new Date(TODAY); W.days = 1; } else W.date = nextDow(6, TODAY, true); return 'Ce week-end'; })   // le dimanche : ce qu'il en reste
    || take('date', '(?:la\\s+)?semaine\\s+prochaine', () => { W.date = nextDow(1); return `Semaine du ${fDM.format(W.date)}`; })
    || take('date', `dans\\s+${NL_N}\\s+(jours?|semaines?|mois)`, m => {
      const n = nlNum(m[1]); if (!n) return false;
      if (m[2].startsWith('mois')) { const t = new Date(TODAY.getFullYear(), TODAY.getMonth() + n, 1); t.setDate(Math.min(TODAY.getDate(), dim(t))); W.date = t; }   // le 31 janv. + 1 mois → 28 févr.
      else W.date = addDays(TODAY, m[2].startsWith('sem') ? 7 * n : n);
      return nlDayLabel(W.date);
    })
    || take('date', `(?:(?:le|ce)\\s+)?(?:${NL_WD}\\s+)?(?:le\\s+)?(\\d{1,2})(?:er)?\\s+${NL_MO}(?:\\s+(\\d{4}))?`, m => { const d = nlDM(m[2], m[3], m[4]); if (!d) return false; W.date = d; return nlDayLabel(d); })
    /* 3/12, 3/12/2026, 3.12.2026 — mais pas « 3.5 km » ni « version 2.1 » : avec des points, l'année est obligatoire */
    || take('date', '(?:le\\s+)?(?:(\\d{1,2})/(\\d{1,2})(?:/(\\d{4}|\\d{2}))?|(\\d{1,2})\\.(\\d{1,2})\\.(\\d{4}|\\d{2}))', m => { const d = m[1] ? nlDM(m[1], +m[2] - 1, m[3]) : nlDM(m[4], +m[5] - 1, m[6]); if (!d) return false; W.date = d; return nlDayLabel(d); })
    || take('date', `(?:(ce|le)\\s+)?${NL_WD}(?:\\s+prochain)?(?:\\s+(\\d{1,2})(?:er)?)?`, m => {
      if (!m[1] && /\b(?:de|du|d['’])\s*$/.test(lo.slice(Math.max(0, m.index - 4), m.index))) return false;   // « le cours de mardi » : un nom, pas une date
      const d = m[3] ? nlDay(+m[3]) : nextDow(WD_JS(m[2]), TODAY, m[1] === 'ce'); if (!d) return false; W.date = d; return nlDayLabel(d);
    })
    || take('date', 'le\\s+(\\d{1,2})(?:er)?', m => { const d = nlDay(+m[1]); if (!d) return false; W.date = d; return nlDayLabel(d); });
    // « dans 2 h », « dans 30 min » : une heure précise
    take('time', `dans\\s+${NL_N}\\s?(h|heures?|min(?:utes?)?)`, m => {
      const n = nlNum(m[1]); if (!n) return false;
      const t = new Date(Date.now() + n * (m[2][0] === 'h' ? 3600e3 : 60e3)); t.setMinutes(Math.ceil(t.getMinutes() / 5) * 5, 0, 0);
      W.rel = t; return `${nlDayLabel(sod(t))} · ${hm(t)}`;
    });
  }
  // --- Moment de la journée : « ce soir », « demain matin », « l'après-midi »
  take('part', "(?:(ce|cet)\\s+|le\\s+|l['’])?(matin|apres-midi|aprem|soir)|en\\s+(soiree|matinee)", m => {
    const [h, label] = NL_PART[m[2] || m[3]];
    if (m[1] && dates && !W.date && !W.rel) W.date = new Date(TODAY);
    W.part = { h, mi: 0 }; return `${label} · ${nlHM(W.part)}`;
  });
  // --- Durée : « pendant 2h », « pour 45 min », « pendant 3 jours »
  take('dur', `(?:pendant|durant|pour)\\s+(?:\\d{1,2}\\s?h(?:\\s?\\d{2})?|\\d{1,2}\\s?heures?|\\d{1,3}\\s?min(?:utes?)?|une?\\s+heure(?:\\s+et\\s+demie)?|une\\s+demi-heure|${NL_N}\\s+jours?)`, m => {
    const t = m[0]; let x, min = null, days = null;
    if ((x = t.match(/(\d{1,2})\s?h(?:\s?(\d{2}))?/))) min = +x[1] * 60 + +(x[2] || 0);
    else if ((x = t.match(/(\d{1,3})\s?min/))) min = +x[1];
    else if (/demi-heure/.test(t)) min = 30;
    else if (/heure et demie/.test(t)) min = 90;
    else if (/heure/.test(t)) min = 60;
    else if ((x = t.match(/(\S+)\s+jours?/))) days = nlNum(x[1]);
    if (min) { W.dur = min; return durText(min * 60e3); }
    if (days) { W.days = days; return `${days} jour${days > 1 ? 's' : ''}`; }
    return false;
  });
  // --- Heures : « de 14h à 16h », « 14h-16h », « 14-16h », « jusqu'à 18h », « à 15h », « midi »
  take('time', `(?:de\\s+|entre\\s+)?(${NL_T})\\s*(?:-|–|a|et|jusqu['’]?a)\\s*(${NL_T})`, m => {
    const a = nlT(m[1]), b = nlT(m[2]); if (!a || !b) return false; W.time = a; W.end = b; return `${nlHM(a)} – ${nlHM(b)}`;
  })
  || take('time', '(?:de\\s+|entre\\s+)?(\\d{1,2})\\s*(?:-|–|a|et)\\s*(\\d{1,2})\\s?h(?:\\s?(\\d{2}))?', m => {
    if (+m[1] > 23 || +m[2] > 23 || +(m[3] || 0) > 59) return false;
    W.time = { h: +m[1], mi: 0 }; W.end = { h: +m[2], mi: +(m[3] || 0) }; return `${nlHM(W.time)} – ${nlHM(W.end)}`;
  });
  if (!W.end) take('time', `jusqu['’]?\\s?(?:a|vers)\\s+(${NL_T})`, m => { const b = nlT(m[1]); if (!b) return false; W.end = b; return `Jusqu’à ${nlHM(b)}`; });
  if (!W.time && !W.rel) take('time', `(?:(?:a|vers|des)\\s+)?(${NL_T})|(?:a|vers)\\s+(\\d{1,2})\\s+heures?(?:\\s+(\\d{2}))?`, m => {
    const t = m[1] ? nlT(m[1]) : (+m[2] < 24 && +(m[3] || 0) < 60 ? { h: +m[2], mi: +(m[3] || 0) } : null);
    if (!t) return false; W.time = t; return nlHM(t);
  });
  // --- Journée entière
  take('allday', 'toute\\s+la\\s+journee|journee\\s+entiere', () => { W.allDay = true; return 'Journée entière'; });
  // --- Lieu : « @Studio Bleu », « salle B204 », « amphi A », « chez Paul » (pris en dernier : le reste du texte après @)
  /* Après @, le lieu va jusqu'à une virgule (avalée), au prochain morceau compris (heure, jour, #…) ou à la fin */
  take('loc', '@\\s?[^@#,;\\s][^@#,;]*', (m, raw) => (R.loc = raw.replace(/^@\s?/, '').replace(/[,;]$/, '').replace(/\s+/g, ' ').trim()) || false, true, (m, a, b) => {
    let e = b; for (let i = a + 1; i < b; i++) if (taken[i]) { e = i; break; }
    while (e > a + 1 && /\s/.test(text[e - 1])) e--;
    return e === b && /[,;]/.test(text[b] || '') ? b + 1 : e;
  })
  || take('loc', "(?:(?:en|dans\\s+la|a\\s+la|a\\s+l['’]|au|a)\\s+)?(?:salle|amphi(?:theatre)?|bureau)\\s+(?:\\p{L}?\\p{N}+\\p{L}?|\\p{L}\\p{N}*)", (m, raw) => (R.loc = cap(raw.replace(/^(?:en|dans la|à la|a la|à l['’]|a l['’]|au|à|a)\s+/i, ''))))
  || take('loc', "[Cc]hez\\s+\\p{Lu}[\\p{L}'’-]*(?:\\s+\\p{Lu}[\\p{L}'’-]*)*", (m, raw) => (R.loc = cap(raw)), true);

  // --- Titre : le texte sans les morceaux compris, ni les petits mots qui les reliaient
  let t = '', last = 0;
  [...parts].sort((x, y) => x.a - y.a).forEach(p => { t += text.slice(last, p.a) + ' '; last = p.b; });
  t += text.slice(last);
  const J = /^(?:le|la|les|l['’]|à|a|au|aux|de|du|des|d['’]|pour|et|ou|,|-|–|:|·)$/i;
  let w = t.replace(/\s+/g, ' ').replace(/\s+([,.;:!?])/g, '$1').trim().split(' ').filter(Boolean);
  const lead = parts.length && !text.slice(0, Math.min(...parts.map(p => p.a))).trim();
  while (w.length && J.test(w[w.length - 1])) w.pop();
  if (lead) while (w.length && J.test(w[0])) w.shift();
  t = w.join(' ').replace(/[\s,;:–-]+$/, '');
  R.title = parts.length ? (lead ? cap(t) : t) : text.trim();
  // --- Quand : ce qui a été compris (résolu plus tard, avec les valeurs par défaut de la fenêtre)
  if (R.rep?.days && !W.date) W.dows = R.rep.days;   // « tous les mardis » : on commence un mardi
  if (Object.keys(W).length) R.when = W;
  return R;
}
/* Ce que le texte dit de « quand » → { s, e, allDay } ; ce qu'il ne dit pas vient de `base` ({ s, e, allDay }).
   fixedDay : le jour vient d'ailleurs (clic dans la grille), on ne le change pas. */
function nlResolve(W, base, fixedDay = false) {
  const at = (d, x) => new Date(d.getFullYear(), d.getMonth(), d.getDate(), x.h, x.mi);
  const timed = !!(W.time || W.part || W.rel || W.end);
  const b0 = sod(base.s);
  const from = b0 < TODAY ? TODAY : b0;
  let day = W.rel ? sod(W.rel) : W.date ? sod(W.date) : W.dows ? [...Array(7).keys()].map(k => addDays(from, k)).find(d => W.dows.includes(isoDow(d))) : b0;
  if (!timed && (W.allDay || W.date || W.endDate || W.days || W.weekend || base.allDay)) {
    return { s: day, e: W.endDate || addDays(day, W.days || (W.weekend ? 2 : base.allDay && !W.date ? Math.max(1, daysBetween(base.s, base.e)) : 1)), allDay: true };
  }
  const t = W.rel ? { h: W.rel.getHours(), mi: W.rel.getMinutes() } : W.time || W.part || { h: base.allDay ? 9 : base.s.getHours(), mi: base.allDay ? 0 : base.s.getMinutes() };
  let s = at(day, t);
  if (!fixedDay && !W.date && !W.rel && !W.dows && key(day) === key(TODAY) && s < new Date() && (W.time || W.part)) s = addDays(s, 1);   // « 9h » déjà passé → demain
  const dur = W.dur ? W.dur * 60e3 : base.allDay ? 3600e3 : Math.max(15 * 60e3, base.e - base.s);
  let e = W.end ? at(W.endDate ? addDays(W.endDate, -1) : s, W.end) : new Date(s.getTime() + dur);
  if (e <= s) e = addDays(e, 1);   // « 22h-1h »
  return { s, e, allDay: false };
}
/* Calque de surlignage derrière un champ titre */
function nlMarks(input) {
  const wrap = document.createElement('span'), mirror = document.createElement('span'), inner = document.createElement('span');
  wrap.className = 'nl-wrap'; mirror.className = 'title-input nl-mirror'; mirror.setAttribute('aria-hidden', 'true'); mirror.append(inner);
  input.before(wrap); wrap.append(mirror, input);
  const sync = () => { inner.style.transform = `translateX(${-input.scrollLeft}px)`; };
  ['scroll', 'keyup', 'select', 'click', 'focus'].forEach(t => input.addEventListener(t, () => requestAnimationFrame(sync)));
  return {
    paint(parts) {
      const text = input.value; let h = '', last = 0;
      [...parts].sort((x, y) => x.a - y.a).forEach(p => { h += esc(text.slice(last, p.a)) + `<mark>${esc(text.slice(p.a, p.b))}</mark>`; last = p.b; });
      inner.innerHTML = h + esc(text.slice(last)); requestAnimationFrame(sync);
    }
  };
}
const NL_IC = { date: 'cal', time: 'clock', part: 'clock', dur: 'clock', allday: 'cal', rep: 'repeat', until: 'repeat', loc: 'pin' };
const NL_GROUP = { when: ['date', 'time', 'part', 'dur', 'allday'], rep: ['rep', 'until'], loc: ['loc'], cal: ['cal'] };
/* Les puces « compris » ; un clic garde le mot dans le titre (on ne l'interprète plus) */
function nlChips(row, R, hint) {
  row.classList.remove('need');
  if (!R.parts.length) { row.innerHTML = hint || ''; row.hidden = !hint; return; }
  row.hidden = false;
  row.innerHTML = [...R.parts].sort((x, y) => x.a - y.a).map(p => {
    const c = p.kind === 'cal' ? getCal(R.cal) : null;
    return `<button type="button" class="nl-chip" data-nl-ig="${esc(p.kind + ':' + fold(p.raw))}" title="Garder « ${esc(p.raw.trim())} » dans le titre" aria-label="${esc(p.label)} : garder « ${esc(p.raw.trim())} » dans le titre">`
      + `${c ? `<i style="--c:${calVar(c.id)}"></i>` : svg(NL_IC[p.kind])}<span>${esc(p.label)}</span>${svg('x', 'nl-x')}</button>`;
  }).join('') + '<button type="button" class="nl-q" data-nl-help title="Entrées rapides : tout ce qui est compris" aria-label="Entrées rapides : la notice">?</button>';
}
/* ===================== Notice « Entrées rapides » =====================
   Les exemples passent par le vrai parseur : la notice montre exactement ce qui sera compris */
const NLH_EX = ['Foot tous les jeudis 20h-21h30 @Gymnase #sport', 'Dentiste @Clinique du Parc, contrôle annuel mardi 15h', 'Partiels du 14 au 18 déc. #cours', 'Appeler maman dans 2h'];
function nlMarked(text, parts) {
  let h = '', last = 0;
  [...parts].sort((x, y) => x.a - y.a).forEach(p => { h += esc(text.slice(last, p.a)) + `<mark>${esc(text.slice(p.a, p.b))}</mark>`; last = p.b; });
  return h + esc(text.slice(last));
}
function openNLHelp() {
  $('nlh-ex').innerHTML = NLH_EX.map(t => {
    const R = parseNL(t);
    const chips = [...R.parts].sort((x, y) => x.a - y.a).map(p => { const c = p.kind === 'cal' ? getCal(R.cal) : null; return `<span class="nl-chip static">${c ? `<i style="--c:${calVar(c.id)}"></i>` : svg(NL_IC[p.kind])}<span>${esc(p.label)}</span></span>`; }).join('');
    return `<div class="nlh-ex"><q>${nlMarked(t, R.parts)}</q><div class="nlh-res"><span class="nlh-t">${svg('right')}<b>${esc(R.title)}</b></span>${chips}</div></div>`;
  }).join('');
  $('nlh-cals').innerHTML = S.calendars.map(c => `<code>#${esc(fold(c.name).split(/\s+/)[0])}</code>`).join(' ');
  showModal('nlh-scrim'); setTimeout(() => $('nlh-scrim').querySelector('[data-close]').focus(), 30);
}
function closeNLHelp() { if (!$('nlh-scrim').hidden) hideModal('nlh-scrim'); }
/* Applique un groupe (quand, répétition, lieu, calendrier) seulement s'il a changé dans le texte :
   une retouche à la main dans la fenêtre n'est pas écrasée à la frappe suivante */
function nlSync(st, R, apply) {
  Object.keys(NL_GROUP).forEach(g => { const v = R[g] ?? null, sg = JSON.stringify(v); if (sg !== st.sig[g]) { st.sig[g] = sg; apply[g]?.(v); } });
}
const nlState = () => ({ sig: { when: 'null', rep: 'null', loc: 'null', cal: 'null' }, ignore: new Set(), R: { parts: [], title: '', when: null, rep: null, loc: null, cal: null } });

function closeQuick(unsel = true) {
  if (!qcEl) return;
  qcEl.remove(); qcEl = null; UI.qcTitle = ''; scrimOff(); setDraftCal(null);
  if (unsel) cal.unselect();
}
function openQuick(sel, js) {
  closePopover(); closeQuick(false);
  const q = { start: sel.start, end: sel.end, allDay: sel.allDay, cal: defaultCal() };
  UI.qcTitle = '';
  const remOpts = (q.allDay ? REM_ALLDAY : REM_TIMED).filter(([v]) => v !== 'none');
  const del = k => `<button type="button" class="qx-del" data-del="${k}" aria-label="Retirer">${svg('x')}</button>`;
  qcEl = document.createElement('div');
  qcEl.className = 'pop qc'; qcEl.setAttribute('role', 'dialog'); qcEl.setAttribute('aria-label', 'Nouvel événement');
  qcEl.innerHTML = `<div class="qc-kick"></div>
    <div class="pop-body">
      <input class="title-input" placeholder="Ajouter un titre" aria-label="Titre" autocomplete="off" enterkeyhint="done">
      <div class="nl-row" hidden></div>
      <div class="chips cals" role="radiogroup" aria-label="Calendrier"></div>
      <div class="qc-warn" hidden></div>
      <div class="qx" data-x="time" hidden>${svg('clock')}<div class="qx-f qx-time"><input class="field" type="time" step="900" data-f="ts" aria-label="Début"><span>–</span><input class="field" type="time" step="900" data-f="te" aria-label="Fin"></div>${del('time')}</div>
      <div class="qx" data-x="loc" hidden>${svg('pin')}<div class="qx-f"><input class="field" data-f="loc" placeholder="Lieu" aria-label="Lieu" autocomplete="off"></div>${del('loc')}</div>
      <div class="qx" data-x="desc" hidden>${svg('text')}<div class="qx-f"><textarea class="field" data-f="desc" rows="2" placeholder="Note" aria-label="Note"></textarea></div>${del('desc')}</div>
      <div class="qx" data-x="rem" hidden>${svg('bell')}<div class="qx-f"><select class="field" data-f="rem" aria-label="Rappel">${remOpts.map(([v, t]) => `<option value="${v}">${t}</option>`).join('')}</select></div>${del('rem')}</div>
      <div class="qx" data-x="rep" hidden>${svg('repeat')}<div class="qx-f qx-rep"><select class="field" data-f="freq" aria-label="Répétition"><option value="weekly">Toutes les semaines</option><option value="daily">Tous les jours</option><option value="monthly">Tous les mois</option><option value="yearly">Tous les ans</option></select><label>Jusqu’au <input class="field" type="date" data-f="until" min="${key(q.start)}" aria-label="Jusqu’au (facultatif)"></label></div>${del('rep')}</div>
      <div class="qc-add">${sel.pickTime ? `<button type="button" data-add="time">${svg('clock')}Horaire</button>` : ''}<button type="button" data-add="loc">${svg('pin')}Lieu</button><button type="button" data-add="desc">${svg('text')}Note</button><button type="button" data-add="rem">${svg('bell')}Rappel</button><button type="button" data-add="rep">${svg('repeat')}Répéter</button></div>
    </div>
    <div class="pop-foot"><button type="button" class="btn ghost" data-q="close">Annuler</button><span class="spacer"></span><button type="button" class="btn primary" data-q="save">Créer</button></div>`;
  const $q = sel => qcEl.querySelector(sel), f = k => $q(`[data-f="${k}"]`);
  const input = $q('.title-input'), kick = $q('.qc-kick'), chips = $q('.chips'), warnEl = $q('.qc-warn'), nlRow = $q('.nl-row');
  const qn = nlState(), marks = nlMarks(input), own = {};   // own : ce que le texte a ouvert (répétition, lieu)
  q.baseCal = q.cal;
  const tInit = () => { f('ts').value = q.allDay ? '' : hm(q.start); f('te').value = q.allDay ? '' : hm(q.end); };   // une journée : l'heure reste à choisir
  tInit();
  f('rem').value = q.allDay ? '-540' : '30';
  const shown = k => !$q(`[data-x="${k}"]`).hidden;
  /* Le jour vient du clic ; l'heure, la durée, la répétition, le lieu et le calendrier peuvent venir du titre */
  const parsed = () => {
    const R = qn.R;
    if (shown('time') && f('ts').value) {
      const [h1, m1] = f('ts').value.split(':').map(Number), s = new Date(q.start.getFullYear(), q.start.getMonth(), q.start.getDate(), h1, m1);
      const [h2, m2] = (f('te').value || '').split(':').map(Number); let e = f('te').value ? new Date(s.getFullYear(), s.getMonth(), s.getDate(), h2, m2) : new Date(s.getTime() + 3600e3);
      if (e <= s) e = new Date(s.getTime() + 3600e3);
      return { s, e, allDay: false, title: R.title };
    }
    if (R.when) return { ...nlResolve(R.when, { s: q.start, e: q.end, allDay: q.allDay }, true), title: R.title };
    return { s: q.start, e: q.end, allDay: q.allDay, title: R.title };
  };
  const QN_APPLY = {
    rep: v => {
      if (v) { $q('[data-x="rep"]').hidden = false; f('freq').value = v.freq; f('until').value = v.until || ''; own.rep = v; }
      else if (own.rep) { $q('[data-x="rep"]').hidden = true; f('until').value = ''; own.rep = null; }
    },
    loc: v => {
      if (v) { $q('[data-x="loc"]').hidden = false; f('loc').value = v; own.loc = true; }
      else if (own.loc) { $q('[data-x="loc"]').hidden = true; f('loc').value = ''; own.loc = false; }
    },
    cal: v => { q.cal = v || q.baseCal; paintChips(); },

  };
  const readNL = () => {
    qn.R = parseNL(input.value, { dates: false, ignore: qn.ignore });
    nlSync(qn, qn.R, QN_APPLY); marks.paint(qn.R.parts); nlChips(nlRow, qn.R); syncAdd();
  };
  const paintChips = () => { setDraftCal(q.cal); chips.innerHTML = S.calendars.filter(c => !c.sub).map(c => `<button type="button" role="radio" style="--c:var(--cal-${c.color})" data-cal="${c.id}" aria-checked="${c.id === q.cal}">${svg('check', 'chk')}${esc(c.name)}</button>`).join(''); };
  const paint = () => {
    const w = parsed();
    kick.textContent = w.allDay ? (daysBetween(w.s, w.e) > 1 ? `${cap(fWDMs.format(w.s))} → ${fWDMs.format(addDays(w.e, -1))}` : cap(fWDM.format(w.s))) : `${cap(fWDMs.format(w.s))} · ${hm(w.s)} – ${hm(w.e)}`;
    UI.qcTitle = w.title;
    calEl.style.setProperty('--qc-t', JSON.stringify(w.title || 'Nouvel événement'));
    document.querySelectorAll('.evbox.mirror .ev-t').forEach(x => x.textContent = w.title || '');
    const cl = w.allDay ? [] : clashes(w.s, w.e);
    warnEl.innerHTML = cl.length ? `${svg('alert')}<span>${clashText(cl)}</span>` : ''; warnEl.hidden = !cl.length;
  };
  const syncAdd = () => { qcEl.querySelectorAll('.qc-add [data-add]').forEach(b => b.hidden = shown(b.dataset.add)); $q('.qc-add').hidden = [...qcEl.querySelectorAll('.qc-add [data-add]')].every(b => b.hidden); };
  const save = () => {
    if (q.cal === 'anniv') { const w = parsed(); openBday(null, { name: w.title, date: w.s }); return; }   // « #anniversaires » dans le titre
    if (!parsed().title.trim()) { needTitle(input, qcEl); return; }
    const w = parsed(), snap = snapshot(), c = getCal(q.cal);
    rememberCal(q.cal); UI.hlBurst = true; UI.hlShow = true;
    if (c && !c.visible) c.visible = true;
    const ev = { id: (UI.hl = uid('e')), cal: q.cal, title: w.title || 'Sans titre', allDay: w.allDay, start: toStr(w.s, w.allDay), end: toStr(w.e, w.allDay),
      rem: shown('rem') ? f('rem').value : newRem(w.allDay) };
    if (shown('loc')) ev.loc = f('loc').value.trim();
    if (shown('desc')) ev.desc = f('desc').value.trim();
    if (shown('rep')) { const fr = f('freq').value, u = f('until').value; ev.rrule = { freq: fr, days: fr === 'weekly' ? (own.rep?.freq === 'weekly' && own.rep.days || [isoDow(w.s)]) : undefined, until: u && u >= key(w.s) ? u : null }; }
    S.events.push(norm(ev));
    closeQuick(); refreshData([q.cal]); toast('Événement créé', snap);
  };
  paintChips(); paint(); syncAdd();
  input.addEventListener('input', () => { input.classList.remove('need'); readNL(); paint(); });
  qcEl.addEventListener('input', e => { if (e.target.matches('[data-f="ts"], [data-f="te"]')) paint(); });
  qcEl.addEventListener('keydown', e => { if (e.key === 'Enter' && e.target.matches('input')) { e.preventDefault(); save(); } });
  qcEl.addEventListener('click', e => {
    const b = e.target.closest('[data-q], [data-cal], [data-add], [data-del], [data-nl-ig]'); if (!b) return;
    if (b.dataset.nlIg) { qn.ignore.add(b.dataset.nlIg); readNL(); paint(); placeQuick(); input.focus(); return; }
    if (b.dataset.cal === 'anniv') { const w = parsed(); openBday(null, { name: w.title, date: w.s }); return; }   // un anniversaire n'a pas de durée : sa propre fenêtre
    if (b.dataset.cal) { q.cal = q.baseCal = b.dataset.cal; paintChips(); popIn(chips.querySelector(`[data-cal="${q.cal}"]`)); input.focus(); return; }
    if (b.dataset.add) {
      const row = $q(`[data-x="${b.dataset.add}"]`); row.hidden = false; syncAdd(); paint();
      row.querySelector('input, textarea, select')?.focus(); placeQuick(); return;
    }
    if (b.dataset.del) {
      const k = b.dataset.del;
      if (own[k]) { qn.R.parts.filter(p => NL_GROUP[k].includes(p.kind)).forEach(p => qn.ignore.add(p.kind + ':' + fold(p.raw))); readNL(); }   // retirer ce que le titre avait mis : le mot y reste, tel quel
      $q(`[data-x="${k}"]`).hidden = true;
      if (k === 'loc' || k === 'desc') f(k).value = '';
      if (k === 'time') tInit();
      if (k === 'rep') f('until').value = '';
      syncAdd(); paint(); input.focus(); return;
    }
    if (b.dataset.q === 'close') closeQuick();
    else if (b.dataset.q === 'save') save();
  });
  document.body.appendChild(qcEl); scrimOn();
  /* La fenêtre se place à côté du créneau, jamais dessus : on voit ce qu'on crée */
  const placeQuick = () => {
    const anchors = [...document.querySelectorAll('#cal .fc-event-mirror, #cal .fc-daygrid-body .fc-highlight')].map(x => x.getBoundingClientRect()).filter(r => r.width);
    if (anchors.length) {
      const r = anchors.reduce((a, b) => ({ left: Math.min(a.left, b.left), right: Math.max(a.right, b.right), top: Math.min(a.top, b.top) }));
      placeNear(qcEl, { left: r.left, right: r.right, top: r.top });
    } else {
      const x = js && js.clientX != null ? js.clientX : innerWidth / 2, y = js && js.clientY != null ? js.clientY : innerHeight / 3;
      placeNear(qcEl, { left: x - 6, right: x + 6, top: y - 30 });
    }
  };
  placeQuick(); requestAnimationFrame(placeQuick);
  setTimeout(() => input.focus({ preventScroll: true }), 20);
}

document.addEventListener('pointerdown', e => {
  if (popEl && !popEl.contains(e.target) && !e.target.closest('.fc-event, [data-open]')) closePopover();
  if (qcEl && !qcEl.contains(e.target) && !e.target.closest('.fc-view, #nlh-scrim')) closeQuick();
});
/* Un aperçu ne reste pas « décroché » quand on fait défiler la grille */
document.addEventListener('scroll', e => {
  if (Date.now() - UI.popAt < 500 || (e.target.closest && e.target.closest('.pop, .modal'))) return;
  if (popEl) closePopover();
}, true);

/* ===================== Juice ===================== */
function popIn(el, cls = 'pop-b') { if (!el) return; el.classList.remove(cls); void el.offsetWidth; el.classList.add(cls); el.addEventListener('animationend', () => el.classList.remove(cls), { once: true }); }
function burst(x, y, color, n = 10) {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  for (let i = 0; i < n; i++) {
    const p = document.createElement('span'); p.className = 'particle';
    const a = (Math.PI * 2 * i) / n + Math.random() * .5, d = 12 + Math.random() * 10;
    p.style.cssText = `left:${x}px;top:${y}px;background:${color};--tx:${Math.cos(a) * d}px;--ty:${Math.sin(a) * d}px;width:${3 + Math.random() * 2}px;height:${3 + Math.random() * 2}px;opacity:.8`;
    document.body.appendChild(p); setTimeout(() => p.remove(), 700);
  }
}
function highlight(evId, withBurst, scroll) {
  const els = document.querySelectorAll(`.fc-event[data-occ^="${evId}@"]`);
  if (scroll && els[0]) els[0].scrollIntoView({ block: 'nearest', behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });   // un soir à 21 h, la grille descend jusqu'à lui
  els.forEach(el => { el.classList.add('just'); setTimeout(() => el.classList.remove('just'), 2100); });
  const first = els[0], ev = getEv(evId);
  if (withBurst && first && ev) { const r = first.getBoundingClientRect(); burst(r.left + r.width / 2, r.top + Math.min(r.height, 40) / 2, calVar(ev.cal), 6); }
}
function vanish(evId, occKey, from = false) {
  const els = [...document.querySelectorAll(`.fc-event[data-occ^="${evId}@"]`)].filter(el => { const k = el.dataset.occ.split('@')[1]; return !occKey || (from ? k >= occKey : k === occKey); });
  if (!els.length) return Promise.resolve();
  els.forEach(el => el.classList.add('gone'));
  return new Promise(r => setTimeout(r, 220));
}
/* Onde au point de clic sur les boutons */
document.addEventListener('pointerdown', e => {
  const b = e.target.closest('.btn, .icon-btn, .chips button, .days button, .seg button, .theme-sw button, .fab, .navgroup button');
  if (!b || b.disabled) return;
  const r = b.getBoundingClientRect(), d = Math.max(r.width, r.height) * 2.2, sp = document.createElement('span');
  sp.className = 'rip'; sp.style.cssText = `width:${d}px;height:${d}px;left:${e.clientX - r.left - d / 2}px;top:${e.clientY - r.top - d / 2}px`;
  b.appendChild(sp); setTimeout(() => sp.remove(), 600);
}, true);

/* ===================== Annuler (toast) ===================== */
let toastTimer = null;
function snapshot() { return JSON.stringify({ c: S.calendars, e: S.events, d: S.dues }); }
const UNDO = [];                                   // les 20 dernières modifications
const REDO = [];                                   // ce qu'on vient d'annuler, à rétablir (vidé dès qu'on fait autre chose)
const MAC = /Mac|iPhone|iPad/.test(navigator.platform);
const UNDO_KEY = MAC ? '⌘ Z' : 'Ctrl Z', REDO_KEY = MAC ? '⇧ ⌘ Z' : 'Ctrl Y';
let REDOING = false;
const UNDO_LABEL = [
  [/^Calendrier créé/, 'Création du calendrier annulée'], [/^Calendrier mis à jour/, 'Modification du calendrier annulée'], [/^«/, 'Suppression du calendrier annulée'],
  [/^Durée/, 'Durée rétablie'], [/^Échéance ajoutée/, 'Création annulée'], [/^Échéance renommée/, 'Modification annulée'], [/^Échéance supprimée/, 'Suppression annulée'], [/^Échéance/, 'Statut rétabli'], [/import/i, 'Import annulé'], [/^Abonnement ajouté/, 'Abonnement retiré'], [/^Désabonné/, 'Abonnement rétabli'], [/^Abonnement arrêté/, 'Abonnement repris'], [/favoris$/, 'Favori rétabli'], [/dupliqué/, 'Duplication annulée'], [/supprimé/i, 'Suppression annulée'], [/déplacé/i, 'Déplacement annulé'],
  [/créé|^Ajouté|^Créé/i, 'Création annulée'], [/modifi|enregistr/i, 'Modification annulée']
];
function undoLast() {
  const u = UNDO.pop(); if (!u) { toast('Rien à annuler'); return; }
  closePopover(); closeQuick(); if (!$('ed-scrim').hidden) closeEditor();
  REDO.push({ snap: snapshot(), msg: u.msg, t: u.t, d: u.d }); if (REDO.length > 20) REDO.shift();
  const before = new Map(S.events.map(e => [e.id, e])), s = JSON.parse(u.snap);
  S.calendars = s.c; S.events = s.e; S.dues = s.d || [];
  const after = new Map(S.events.map(e => [e.id, e]));
  // Ce qui change en revenant en arrière : rétabli, retiré ou remis comme avant
  const back = [...after.values()].filter(e => !before.has(e.id)), gone = [...before.values()].filter(e => !after.has(e.id));
  const changed = [...after.values()].filter(e => before.has(e.id) && JSON.stringify(e) !== JSON.stringify(before.get(e.id)));
  const label = (UNDO_LABEL.find(([re]) => re.test(u.msg)) || [0, 'Action annulée'])[1];
  const more = list => list.length > 1 ? ` (et ${list.length - 1} autre${list.length > 2 ? 's' : ''})` : '';
  let line = { title: null, rest: label };
  if (/^Échéance/.test(u.msg)) line = { title: u.t, rest: /ajoutée/.test(u.msg) ? 'retirée' : /supprimée/.test(u.msg) ? 'rétablie' : /faite/.test(u.msg) ? 'de nouveau à faire' : /rouverte/.test(u.msg) ? 'de nouveau faite' : 'remise comme avant' };
  else if (!/calendrier/.test(label)) {
    if (/Suppression/.test(label) && back[0]) line = { title: back[0].title, rest: 'rétabli' + more(back) };
    else if (/Création|Duplication|Import/.test(label) && gone[0]) line = { title: gone[0].title, rest: 'retiré' + more(gone) };
    else if (/Déplacement|Modification|Durée/.test(label)) {
      const main = changed.find(e => !isRec(e)) || changed[0], dur = /Durée/.test(label);
      const exKey = main && isRec(main) && (before.get(main.id)?.exdates || []).find(k => !main.exdates.includes(k));
      if (exKey) { const o = occurrenceOf(main, exKey); line = { title: main.title, rest: dur ? `remis comme avant, ${spanTxt(o.start, o.end, main.allDay)}` : `remis au ${dateTxt(o.start, main.allDay)}` }; }
      else if (main) line = { title: main.title, rest: isBday(main) ? `remis au ${fDM.format(parse(main.start))}`
        : dur ? `remis comme avant, ${spanTxt(parse(main.start), parse(main.end), main.allDay, isRec(main))}`
        : isRec(main) ? `remis comme avant, ${ruleAt(main)}` : `remis au ${dateTxt(parse(main.start), main.allDay)}` };
      else if (gone[0]) line = { title: gone[0].title, rest: 'retiré' };
    }
  }
  UI.hl = (back[0] || changed[0])?.id || null;
  refreshData(); UI.toastEv = null;
  toast(label, null, line, { redo: true });
}
/* Ctrl Y : refait ce qu'on vient d'annuler, avec le même message qu'à l'origine (et de nouveau « Annuler ») */
function redoLast() {
  const r = REDO.pop(); if (!r) { toast('Rien à rétablir'); return; }
  closePopover(); closeQuick(); if (!$('ed-scrim').hidden) closeEditor();
  const before = new Map(S.events.map(e => [e.id, JSON.stringify(e)])), cur = snapshot(), s = JSON.parse(r.snap);
  S.calendars = s.c; S.events = s.e; S.dues = s.d || [];
  UI.hl = S.events.find(e => before.get(e.id) !== JSON.stringify(e))?.id || null;   // ajouté ou modifié : surligné
  refreshData(); UI.toastEv = null;
  REDOING = true; toast(r.msg, cur, r.d); REDOING = false;
}
/* Notification d'action : en bas à droite de la feuille, ce qui a changé et « Annuler » */
/* Une phrase : « Café avec Léa déplacé au sam. 14 nov. à 18:15 » */
const dateTxt = (d, allDay) => (allDay ? fWDMs.format(d) : `${fWDMs.format(d)} à ${hm(d)}`).replace(/ /g, '\u00a0');   // la date ne se coupe pas en fin de ligne
const ruleAt = ev => `${ruleText(ev).toLowerCase()}${ev.allDay ? '' : ` à ${hm(parse(ev.start))}`}`;
/* Plage horaire ou de jours : « 14:00 – 15:30 », « le sam. 14 nov. », « du sam. 14 au lun. 16 nov. » (série : « sur 2 jours ») */
function spanTxt(s, e, allDay, series = false) {
  if (allDay) { const n = Math.max(1, daysBetween(s, e)); return series ? `sur ${n} jour${n > 1 ? 's' : ''}` : n > 1 ? `du ${s.getMonth() === addDays(e, -1).getMonth() ? `${fDow.format(s)} ${s.getDate()}` : fWDMs.format(s)} au ${dateTxt(addDays(e, -1), true)}` : `le ${dateTxt(s, true)}`; }
  return key(s) === key(new Date(e - 1)) || series ? `${hm(s)}\u00a0– ${hm(e)}` : `${dateTxt(s)} – ${dateTxt(e)}`;
}
/* Ce que le glisser a changé : « déplacé au… », « placé sur toute la journée du… », « allongé de 30 min, jusqu'à 16:30 »… */
function gestureTxt(os, oe, ns, ne, allDay, wasAllDay, resized) {
  if (!resized) return allDay && !wasAllDay ? `placé sur toute la journée du ${dateTxt(ns, true)}` : `déplacé au ${dateTxt(ns, allDay)}`;
  const d = (ne - ns) - (oe - os); if (!d) return 'modifié';
  const n = Math.round(Math.abs(d) / 864e5), by = allDay ? (n === 1 ? "d'un jour" : `de ${n} jours`) : `de ${durText(Math.abs(d))}`;
  const what = `${d > 0 ? 'allongé' : 'raccourci'} ${by}`;
  if (+ns !== +os) return `${what}, commence ${allDay ? `le ${dateTxt(ns, true)}` : `à ${hm(ns)}`}`;   // tiré par le haut
  return `${what}, ${allDay ? `jusqu'au ${dateTxt(addDays(ne, -1), true)}` : `jusqu'à ${hm(ne)}`}`;
}
const TOAST_VERB = {
  'Événement créé': ['ajouté', 'le'], 'Événement dupliqué': ['dupliqué', 'au'], 'Événement déplacé': ['déplacé', 'au'],
  'Occurrence déplacée': ['déplacé', 'au', ', cette fois seulement'], 'Occurrences suivantes déplacées': ['déplacé', 'from'], 'Série déplacée': ['déplacé', 'rule'],
  'Modifications enregistrées': ['modifié'], 'Occurrence modifiée': ['modifié', null, ', cette fois seulement'],
  'Occurrences suivantes modifiées': ['modifié', 'from'], 'Série modifiée': ['modifié', null, ', toute la série']
};
function evPhrase(ev, verb, prep, tail = '') {
  const st = parse(ev.start);
  if (prep === 'rule' || (prep && prep !== 'from' && isRec(ev))) return `${verb}, ${prep === 'rule' ? 'désormais ' : ''}${ruleAt(ev)}`;
  if (prep === 'from') return `${verb} à partir du ${dateTxt(st, ev.allDay)}`;
  return prep ? `${verb} ${prep} ${dateTxt(st, ev.allDay)}${tail}` : verb + tail;
}
function toast(msg, undoSnap, detail, opts = {}) {
  document.querySelector('.toast')?.remove(); clearTimeout(toastTimer);
  let line = null;                                   // { title, rest } → « <b>titre</b> reste »
  if (detail && typeof detail === 'object') line = detail;
  else if (UI.toastEv && TOAST_VERB[msg]) { const ev = getEv(UI.toastEv); if (ev) line = { title: ev.title, rest: evPhrase(ev, ...TOAST_VERB[msg]) }; }
  if (undoSnap) {   // on garde la phrase affichée : « Rétablir » la redira telle quelle
    UNDO.push({ snap: undoSnap, msg, t: line?.title ?? detail?.title, d: line || (typeof detail === 'string' ? detail : undefined) }); if (UNDO.length > 20) UNDO.shift();
    if (!REDOING) REDO.length = 0;   // une nouvelle action : ce qui avait été annulé ne se rétablit plus
  }
  UI.toastEv = null;
  const html = line ? `${line.title ? `<b>${esc(line.title)}</b> ` : ''}${esc(line.rest)}` : `${esc(msg)}${typeof detail === 'string' && detail ? ` · ${esc(detail)}` : ''}`;
  const t = document.createElement('div'); t.className = 'toast'; t.setAttribute('role', 'status');
  const ms = 4000;   // la même durée pour toutes les notifications
  t.style.setProperty('--life', ms + 'ms');
  t.innerHTML = `<span class="t-ic${undoSnap ? ' ok' : ''}">${svg(undoSnap ? 'check' : 'history')}</span>
    <span class="t-txt">${html}</span>
    ${undoSnap ? `<button type="button" class="t-undo" title="Annuler (${UNDO_KEY})">Annuler</button>` : ''}${opts.redo && REDO.length ? `<button type="button" class="t-undo t-redo" title="Rétablir (${REDO_KEY})">Rétablir</button>` : ''}
    <button type="button" class="t-x" aria-label="Fermer">${svg('x')}</button>
    <i class="t-life" aria-hidden="true"></i>`;
  document.body.appendChild(t);
  let left = ms, startedAt = Date.now();
  const arm = () => { startedAt = Date.now(); clearTimeout(toastTimer); toastTimer = setTimeout(() => { t.classList.add('out'); setTimeout(() => t.remove(), 220); }, left); };
  t.addEventListener('mouseenter', () => { clearTimeout(toastTimer); left = Math.max(1200, left - (Date.now() - startedAt)); t.classList.add('hold'); }); // la notification attend qu'on ait fini de la lire
  t.addEventListener('mouseleave', () => { t.classList.remove('hold'); arm(); });
  t.querySelector('.t-undo:not(.t-redo)')?.addEventListener('click', undoLast);
  t.querySelector('.t-redo')?.addEventListener('click', redoLast);
  t.querySelector('.t-x').addEventListener('click', () => { clearTimeout(toastTimer); t.classList.add('out'); setTimeout(() => t.remove(), 220); });
  arm();
}
function refreshData(ids = 'all') {
  const show = UI.hlShow && UI.hl && getEv(UI.hl); UI.hlShow = false;
  if (show) { const c = getCal(show.cal); if (c && !c.visible) c.visible = true; }   // créé dans un calendrier masqué : on le rend visible
  dirty(); syncSources(ids); renderCalList(); renderMini(); updateMemBadge(); updateSideBdays(); updateSideDue();
  if (show) goToNew(show);
  if (UI.hl) UI.toastEv = UI.hl;
  if (UI.hl) { const id = UI.hl, b = UI.hlBurst; UI.hl = null; UI.hlBurst = false; requestAnimationFrame(() => requestAnimationFrame(() => highlight(id, b, !!show))); }
  if (isPage()) { renderPage(); updateTitle(); }
  if (typeof onDataChanged === 'function') onDataChanged();   // sync.js : compare au dernier état connu du serveur
}
/* Après création (ou modification dans la fenêtre) : la page va là où l'événement se trouve.
   Le Planning le garde s'il y figure ; une autre page rend la main au calendrier ; puis le bon jour, et l'heure à l'écran. */
function goToNew(ev) {
  const s = parse(ev.start);
  if (UI.view === 'upcoming' && s >= UI.upStart && s < addDays(UI.upStart, UI.upLen)) return;
  if (isPage()) setView(['day', 'week', 'month'].includes(UI.lastCalView) ? UI.lastCalView : 'week');
  const v = cal.view;
  if (!(s >= v.activeStart && s < v.activeEnd)) cal.gotoDate(s);
}

/* ===================== Question récurrence ===================== */
function askScope(kind, occKey, ev) {
  return new Promise(res => {
    const T = { edit: ['Modifier un événement récurrent', 'Enregistrer'], delete: ['Supprimer un événement récurrent', 'Supprimer'], move: ['Déplacer un événement récurrent', 'Déplacer'], resize: ['Changer la durée d’un événement récurrent', 'Appliquer'] }[kind];
    const form = $('sc'), ok = $('sc-ok'), scrim = $('sc-scrim'), cancel = $('sc-cancel');
    $('sc-title').textContent = T[0];
    $('sc-date').textContent = `Seulement le ${fWDM.format(parse(occKey))}`;
    $('sc-future').textContent = `À partir du ${fWDM.format(parse(occKey))}`;
    // « et les suivantes » n'a pas de sens sur la première occurrence (c'est toute la série)
    form.querySelector('[value="future"]').closest('label').hidden = !!ev && occKey <= key(parse(ev.start));
    ok.textContent = T[1]; ok.className = 'btn ' + (kind === 'delete' ? 'danger' : 'primary');
    form.scope.value = 'this';
    showModal('sc-scrim'); ok.focus();
    const done = v => { hideModal('sc-scrim'); form.onsubmit = null; cancel.onclick = null; scrim.onclick = null; scrim._esc = null; res(v); };
    form.onsubmit = e => { e.preventDefault(); done(form.scope.value); };
    cancel.onclick = () => done(null);
    scrim.onclick = e => { if (e.target === scrim) done(null); };
    scrim._esc = () => done(null);
  });
}

/* ===================== Suppression / déplacement ===================== */
const SCOPE_MSG = {
  delete: { this: 'Occurrence supprimée', future: 'Occurrences suivantes supprimées', all: 'Série supprimée' },
  move: { this: 'Occurrence déplacée', future: 'Occurrences suivantes déplacées', all: 'Série déplacée' },
  edit: { this: 'Occurrence modifiée', future: 'Occurrences suivantes modifiées', all: 'Série modifiée' }
};
/* FullCalendar compte la hauteur minimale d'un événement pour savoir s'il en chevauche un autre : si une demi-heure
   fait moins de 22 px à l'écran, un 17:30–18:00 « déborde » sur 18:00 et l'événement de 18:00 est mis de côté (moitié de colonne).
   On garde donc la hauteur minimale sous la hauteur d'une demi-heure. */
function fitEventMinHeight() {
  const slot = document.querySelector('.fc-timegrid-slot-lane'); if (!slot) return;
  const m = Math.max(12, Math.min(22, Math.floor(slot.getBoundingClientRect().height)));
  if (cal.getOption('eventMinHeight') !== m) cal.setOption('eventMinHeight', m);
}
/* Étirer : la double flèche est posée dès l'appui sur la poignée (avant que FullCalendar ne démarre le geste)
   et retirée au relâchement */
function setResizing(dir) { document.body.classList.toggle('resizing-v', dir === 'v'); document.body.classList.toggle('resizing-h', dir === 'h'); }
document.addEventListener('pointerdown', e => { const r = e.target.closest?.('.fc-event-resizer'); if (r && e.button === 0) setResizing(r.closest('.fc-timegrid-event') ? 'v' : 'h'); }, true);
['pointerup', 'pointercancel'].forEach(t => addEventListener(t, () => { if (!UI.resizing) setResizing(null); }, true));
/* Glisser en gardant Ctrl (Cmd ou Alt) enfoncé : une copie est posée, l'original ne bouge pas */
function setDupDrag(on) { document.body.classList.toggle('dup-drag', !!on); }
['keydown', 'keyup'].forEach(t => addEventListener(t, e => { if (UI.dragging && ['Control', 'Meta', 'Alt'].includes(e.key)) setDupDrag(e.ctrlKey || e.metaKey || e.altKey); }));
addEventListener('pointermove', e => { if (UI.dragging) setDupDrag(e.ctrlKey || e.metaKey || e.altKey); }, true);
function dupDrop(info) {
  closePopover(); closeQuick();
  const ev = getEv(info.event.extendedProps.evId); if (!ev || isSub(ev)) { info.revert(); return; }   // abonnement : la source fait foi
  const ns = info.event.start, allDay = info.event.allDay;
  const ne = info.event.end || (allDay ? addDays(ns, 1) : new Date(ns.getTime() + 3600e3));
  info.revert();
  const snap = snapshot();
  const copy = norm({ ...JSON.parse(JSON.stringify(ev)), id: (UI.hl = uid('e')), rrule: { freq: 'none' }, exdates: [], start: toStr(ns, allDay), end: toStr(ne, allDay), allDay });
  delete copy.person; delete copy.born;
  S.events.push(copy); UI.hlBurst = true;
  refreshData([ev.cal]); toast('Événement dupliqué', snap);
}
/* Coupe une série : l'original s'arrête la veille de occKey, la suite repart de occKey */
function splitAt(ev, occKey, patch) {
  const tail = norm({ ...JSON.parse(JSON.stringify(ev)), id: uid('e'), exdates: ev.exdates.filter(k => k >= occKey), ...patch });
  ev.rrule.until = key(addDays(parse(occKey), -1));
  ev.exdates = ev.exdates.filter(k => k < occKey);
  S.events.push(tail); moveDues(ev.id, k => k >= occKey, tail.id);
  return tail;
}
async function deleteFlow(evId, occKey) {
  const ev = getEv(evId); if (!ev) return;
  const snap = snapshot();
  if (!isRec(ev) || isBday(ev)) { // un anniversaire se supprime en entier
    closeEditor(); closeBday(); await vanish(evId);
    S.events = S.events.filter(e => e.id !== evId); refreshData([ev.cal]); toast(isBday(ev) ? 'Anniversaire supprimé' : 'Événement supprimé', snap, { title: ev.title, rest: 'supprimé' });
    return;
  }
  const scope = await askScope('delete', occKey, ev); if (!scope) return;
  closeEditor(); await vanish(evId, scope === 'all' ? null : occKey, scope === 'future');
  if (scope === 'this') ev.exdates.push(occKey);
  else if (scope === 'future') ev.rrule.until = key(addDays(parse(occKey), -1));
  else S.events = S.events.filter(e => e.id !== evId);
  refreshData([ev.cal]); toast(SCOPE_MSG.delete[scope], snap, { title: ev.title, rest: scope === 'this' ? `supprimé le ${fWDMs.format(parse(occKey))}, cette fois seulement` : scope === 'future' ? `supprimé à partir du ${fWDMs.format(parse(occKey))}` : 'supprimé, toute la série' });
}
async function moveOccurrence(info, resized = false) {
  closePopover(); closeQuick();
  const ev = getEv(info.event.extendedProps.evId); if (!ev || isSub(ev)) { info.revert(); return; }   // abonnement : la source fait foi
  const ns = info.event.start, allDay = info.event.allDay, occKey = info.event.extendedProps.occKey;
  const ne = info.event.end || (allDay ? addDays(ns, 1) : new Date(ns.getTime() + 3600e3));
  const os = info.oldEvent.start, oe = info.oldEvent.end || (info.oldEvent.allDay ? addDays(os, 1) : new Date(os.getTime() + 3600e3));
  const what = () => gestureTxt(os, oe, ns, ne, allDay, info.oldEvent.allDay, resized);
  const snap = snapshot();
  if (resized || allDay) delete ev.openEnd;   // étiré à la main : la fin est désormais connue
  if (isBday(ev)) {   // un anniversaire n'a qu'une date : elle change pour toutes les années, sans question
    const n = daysBetween(os, ns); UI.hl = ev.id;
    ev.start = toStr(addDays(parse(ev.start), n), true); ev.end = toStr(addDays(parse(ev.end), n), true);
    refreshData([ev.cal]); toast('Anniversaire déplacé', snap, { title: ev.title, rest: `désormais le ${fDM.format(ns)}` }); return;
  }
  if (!isRec(ev)) {
    UI.hl = ev.id; ev.start = toStr(ns, allDay); ev.end = toStr(ne, allDay); ev.allDay = allDay;
    refreshData([ev.cal]); toast(resized ? 'Durée modifiée' : 'Événement déplacé', snap, { title: ev.title, rest: what() }); return;
  }
  const scope = await askScope(resized ? 'resize' : 'move', occKey, ev);
  if (!scope) { info.revert(); return; }
  if (scope === 'this') {
    ev.exdates.push(occKey);
    S.events.push(norm({ ...JSON.parse(JSON.stringify(ev)), id: (UI.hl = uid('e')), rrule: { freq: 'none' }, exdates: [], start: toStr(ns, allDay), end: toStr(ne, allDay), allDay }));
    moveDues(ev.id, k => k === occKey, UI.hl, daysBetween(os, ns));
  } else {
    const shift = ns - os, dDays = daysBetween(os, ns), stretch = (ne - ns) - (oe - os);
    /* Toute la série glisse : ses jours répétés, ses dates supprimées et ses échéances avec elle */
    const shifted = src => {
      const ms = parse(src.start), me = parse(src.end), r = src.rrule;
      return { start: toStr(new Date(ms.getTime() + shift), allDay), end: toStr(new Date(me.getTime() + shift + stretch), allDay), allDay,
        exdates: src.exdates.map(k => key(addDays(parse(k), dDays))),
        rrule: { ...r, days: r.freq === 'weekly' && r.days ? r.days.map(d => ((d - 1 + dDays) % 7 + 7) % 7 + 1) : r.days } };
    };
    if (scope === 'all') { UI.hl = ev.id; Object.assign(ev, shifted(ev)); moveDues(ev.id, () => true, ev.id, dDays); }
    else {
      const occ = occurrenceOf(ev, occKey), t = splitAt(ev, occKey, { start: toStr(occ.start, ev.allDay), end: toStr(occ.end, ev.allDay) });
      Object.assign(t, shifted(t)); moveDues(t.id, () => true, t.id, dDays); UI.hl = t.id;
    }
  }
  refreshData([ev.cal]);
  if (resized) toast('Durée modifiée', snap, { title: ev.title, rest: what() + (scope === 'this' ? ', cette fois seulement' : scope === 'future' ? `, à partir du ${dateTxt(parse(occKey), true)}` : ', toute la série') });
  else toast(SCOPE_MSG.move[scope], snap);
}

/* ===================== Fenêtre événement ===================== */
let ED = null, edCal = 'perso', edFreq = 'none', edDays = new Set(), edLast = null;
const REM_TIMED = [['none', 'Aucun rappel'], ['0', "Au début de l'événement"], ['10', '10 minutes avant'], ['30', '30 minutes avant'], ['60', '1 heure avant'], ['1440', '1 jour avant'], ['10080', '1 semaine avant']];
const REM_ALLDAY = [['none', 'Aucun rappel'], ['-540', 'Le jour même à 9 h'], ['360', 'La veille à 18 h'], ['1440', '1 jour avant'], ['10080', '1 semaine avant']];
/* Rappel d'un nouvel événement : celui des Réglages (aucun par défaut) */
const newRem = allDay => PREFS.rem === 'none' ? 'none' : allDay ? '-540' : PREFS.rem;
function fillRem(allDay, val) {
  const opts = allDay ? REM_ALLDAY : REM_TIMED;
  $('f-rem').innerHTML = opts.map(([v, t]) => `<option value="${v}">${t}</option>`).join('');
  $('f-rem').value = opts.some(([v]) => v === val) ? val : (allDay ? '-540' : '30');
}
/* Jour par défaut : aujourd'hui, ou le premier jour affiché si aujourd'hui n'est pas à l'écran.
   Créneau proposé si l'on décoche « Journée » : prochain quart d'heure aujourd'hui, sinon 9:00. */
function defaultSlot() {
  const now = new Date();
  let base = TODAY;
  if (!isPage()) { const v = cal.view; if (!(now >= v.activeStart && now < v.activeEnd)) base = sod(v.type === 'dayGridMonth' ? v.currentStart : v.activeStart); }
  const at = (d, h, mi = 0) => new Date(d.getFullYear(), d.getMonth(), d.getDate(), h, mi);
  let s;
  if (key(base) === key(TODAY)) {
    const q = Math.ceil((now.getHours() * 60 + now.getMinutes() + 5) / 15) * 15;
    s = q < 8 * 60 ? at(base, 9) : q > 21 * 60 ? at(addDays(base, 1), 9) : at(base, Math.floor(q / 60), q % 60);
  } else s = at(base, 9);
  return { day: base, start: s, end: new Date(s.getTime() + 3600e3) };
}
function renderEdCals() {
  $('f-cals').innerHTML = S.calendars.filter(c => (!c.sub || c.id === edCal) && (c.id !== 'anniv' || ED?.mode !== 'edit')).map(c => `<button type="button" role="radio" style="--c:var(--cal-${c.color})" data-cal="${c.id}" aria-checked="${c.id === edCal}">${svg('check', 'chk')}${esc(c.name)}</button>`).join('');
}
function renderEdRec() {
  $('f-freq').value = edFreq;
  $('f-days').hidden = edFreq !== 'weekly';
  $('f-until-row').hidden = edFreq === 'none';
  $('f-days').innerHTML = DOW_LETTERS.map((l, i) => `<button type="button" data-d="${i + 1}" aria-pressed="${edDays.has(i + 1)}" aria-label="${DOW_NAMES[i]}">${l}</button>`).join('');
  $('f-until').disabled = !$('f-until-date').checked;
}
function edStart() { const sd = $('f-sd').value; if (!sd) return null; return $('f-allday').checked ? parse(sd) : parse(`${sd}T${$('f-st').value || '09:00'}`); }
function edEnd() {
  if (!$('f-allday').checked && !$('f-et').value) { const s = edStart(); return s && new Date(s.getTime() + 3600e3); }   // pas d'heure de fin : 1 h
  const ed = $('f-ed').value; if (!ed) return null; return $('f-allday').checked ? addDays(parse(ed), 1) : parse(`${ed}T${$('f-et').value}`);
}
function setEdEnd(d) { if ($('f-allday').checked) $('f-ed').value = key(addDays(d, -1)); else { $('f-ed').value = key(d); $('f-et').value = hm(d); } }
function edSnap() { edLast = { s: edStart(), e: edEnd() }; }
/* Résumé lisible, durée, chevauchements : mis à jour à chaque changement */
/* Événements horaires qui chevauchent un créneau */
function clashes(s, e, exceptId) { return occurrences(s, e).filter(o => !o.ev.allDay && o.ev.id !== exceptId && o.start < e && o.end > s); }
function clashText(list) {
  return `Chevauche ${list.slice(0, 2).map(o => `« ${esc(o.ev.title)} »`).join(' et ')}${list.length > 2 ? ` et ${list.length - 2} autre${list.length > 3 ? 's' : ''}` : ''}`;
}
function updateWhen() {
  const s = edStart(), e = edEnd(), allDay = $('f-allday').checked, ok = !!(s && e && e > s);
  $('f-err').hidden = !s || !e || ok;
  let sum = '';
  if (ok) {
    if (allDay) { const n = daysBetween(s, e); sum = n === 1 ? cap(fWDMY.format(s)) : `Du ${fWDM.format(s)} au ${fWDMY.format(addDays(e, -1))} · ${n} jours`; }
    else sum = key(s) === key(e) ? `${cap(fWDMY.format(s))} · ${durText(e - s)}` : `${cap(fWDMs.format(s))} ${hm(s)} → ${fWDMs.format(e)} ${hm(e)} · ${durText(e - s)}`;
  }
  $('f-sum').textContent = sum; $('f-sum').hidden = !sum;
  let warn = '';
  if (ok && !allDay) {
    const clash = clashes(s, e, ED?.evId);
    if (clash.length) warn = clashText(clash) + '.';
  }
  $('f-warn').innerHTML = warn ? `${svg('alert')}<span>${warn}</span>` : ''; $('f-warn').hidden = !warn;
}
function syncAllDay(changed = true) {
  const a = $('f-allday').checked; $('f-st').hidden = a; $('f-et').hidden = a; document.querySelector('.when').classList.toggle('allday', a);
  if (changed) { fillRem(a, $('f-rem').value); edSnap(); updateWhen(); }
}
function openEditor(o) {
  closePopover(); closeQuick();
  if (o.mode === 'edit') { const ev0 = getEv(o.evId); if (ev0 && isBday(ev0)) return openBday(ev0); if (isSub(ev0)) return; }
  ED = o; $('f-err').hidden = true;
  let s, e, allDay, ev = null, kicker;
  if (o.mode === 'edit') {
    ev = getEv(o.evId); const occ = occurrenceOf(ev, o.occKey);
    s = occ.start; e = occ.end; allDay = ev.allDay;
    edCal = ev.cal; edFreq = ev.rrule.freq; edDays = new Set(ev.rrule.days && ev.rrule.days.length ? ev.rrule.days : [isoDow(parse(ev.start))]);
    $('f-title').value = ev.title; $('f-loc').value = ev.loc; $('f-desc').value = ev.desc;
    $('f-until-never').checked = !ev.rrule.until; $('f-until-date').checked = !!ev.rrule.until;
    $('f-until').value = ev.rrule.until || key(addDays(s, 90));
    kicker = isRec(ev) ? `Série · occurrence du ${fWDM.format(parse(o.occKey))}` : "Modifier l'événement";
  } else {
    const d = defaultSlot();
    s = o.start || d.start; e = o.end || (o.start ? new Date(s.getTime() + 3600e3) : d.end); allDay = !!o.allDay;
    /* Sans créneau ni heure donnés : une journée (une heure inconnue reste inconnue). L'heure proposée attend qu'on décoche « Journée ». */
    if (!o.start) { allDay = true; s = d.day; e = addDays(d.day, 1); ED.slot = d; }
    edCal = o.cal || defaultCal(); edFreq = o.freq || 'none'; edDays = new Set([isoDow(s)]);
    $('f-title').value = o.title || ''; $('f-loc').value = o.loc || ''; $('f-desc').value = o.desc || '';
    $('f-until-never').checked = true; $('f-until').value = key(addDays(s, 90));
    kicker = o.kicker || 'Nouvel événement';
  }
  $('f-kicker').textContent = kicker;
  $('f-allday').checked = allDay;
  $('f-sd').value = key(s); $('f-ed').value = key(allDay ? addDays(e, -1) : e);
  $('f-st').value = allDay ? (ED.slot ? hm(ED.slot.start) : '09:00') : hm(s); $('f-et').value = allDay ? (ED.slot ? hm(ED.slot.end) : '10:00') : hm(e);
  fillRem(allDay, ev ? ev.rem : (o.rem || newRem(allDay)));
  $('f-delete').hidden = o.mode !== 'edit';
  $('f-title').classList.remove('need');
  syncExtras();
  renderEdCals(); renderEdRec(); syncAllDay(false); edSnap(); updateWhen();
  edNLStart(!!o.nl);
  ED.sig = edSig(); $('f-leave').hidden = true;
  showModal('ed-scrim');
  setTimeout(() => { const t = $('f-title'); t.focus(); t.setSelectionRange(t.value.length, t.value.length); }, 30);
}
/* Nouvel événement : le titre se lit en langage naturel (pas en modification, ni pour une copie) */
const EDN = nlState(), edMarks = nlMarks($('f-title'));
const edWhenNow = () => ({ s: edStart() || TODAY, e: edEnd() || addDays(TODAY, 1), allDay: $('f-allday').checked });
const edRepNow = () => ({ freq: edFreq, days: [...edDays], until: $('f-until-date').checked ? $('f-until').value : null });
function setEdWhen(w) {
  const was = $('f-allday').checked;
  $('f-allday').checked = w.allDay; $('f-sd').value = key(w.s); $('f-ed').value = key(w.allDay ? addDays(w.e, -1) : w.e);
  if (!w.allDay) { $('f-st').value = hm(w.s); $('f-et').value = hm(w.e); }
  syncAllDay(false); if (was !== w.allDay) fillRem(w.allDay, $('f-rem').value);
  edSnap(); updateWhen();
}
const ED_NL = {
  when: v => setEdWhen(v ? nlResolve(v, EDN.base.when) : EDN.base.when),
  rep: v => {
    const r = v || EDN.base.rep; edFreq = r.freq; edDays = new Set(r.days?.length ? r.days : [isoDow(edStart() || TODAY)]);
    $('f-until-date').checked = !!r.until; $('f-until-never').checked = !r.until; if (r.until) $('f-until').value = r.until;
    renderEdRec(); syncExtras();
  },
  loc: v => { $('f-loc').value = v ?? EDN.base.loc; syncExtras(); },
  cal: v => { edCal = v || EDN.base.cal; renderEdCals(); },
};
function edNLStart(on) {
  Object.assign(EDN, nlState(), { on, base: { when: edWhenNow(), rep: edRepNow(), loc: $('f-loc').value, cal: edCal } });
  edNL();
}
function edNL() {
  const row = $('f-nl');
  if (!EDN.on) { row.hidden = true; edMarks.paint([]); return; }
  EDN.R = parseNL($('f-title').value, { ignore: EDN.ignore });
  nlSync(EDN, EDN.R, ED_NL); edMarks.paint(EDN.R.parts);
  nlChips(row, EDN.R, $('f-title').value.trim() ? '' : '<span class="nl-hint">Ex. <b>Ciné vendredi 20h @Pathé</b></span><button type="button" class="nl-q" data-nl-help title="Entrées rapides : tout ce qui est compris" aria-label="Entrées rapides : la notice">?</button>');
}
$('f-title').addEventListener('input', edNL);
$('f-nl').addEventListener('click', e => { const b = e.target.closest('[data-nl-ig]'); if (!b) return; EDN.ignore.add(b.dataset.nlIg); edNL(); $('f-title').focus(); });
/* Une retouche à la main devient la nouvelle base : si le mot disparaît du titre, on revient à elle */
/* (après les autres écouteurs du même événement : la fin recalculée, le jour répété… sont déjà à jour) */
const edKeep = (ids, type, k, read) => ids.forEach(id => $(id).addEventListener(type, () => queueMicrotask(() => { if (EDN.on) EDN.base[k] = read(); })));
edKeep(['f-sd', 'f-st', 'f-ed', 'f-et', 'f-allday'], 'change', 'when', edWhenNow);
edKeep(['f-freq', 'f-until-row'], 'change', 'rep', edRepNow);
edKeep(['f-days', 'f-add'], 'click', 'rep', edRepNow);
edKeep(['f-loc'], 'input', 'loc', () => $('f-loc').value);
edKeep(['f-cals'], 'click', 'cal', () => edCal);
const edTitle = () => EDN.on ? EDN.R.title : $('f-title').value.trim();

/* Pas d'événement sans titre : la fenêtre tremble, le champ titre passe en rouge */
function needTitle(input, box) {
  input.classList.add('need'); input.placeholder = 'Ajouter un titre';
  /* on secoue avec la propriété translate : l'animation d'ouverture de la fenêtre n'est pas rejouée */
  if (!matchMedia('(prefers-reduced-motion: reduce)').matches) box.animate([{ translate: '0' }, { translate: '-7px' }, { translate: '6px' }, { translate: '-4px' }, { translate: '2px' }, { translate: '0' }], { duration: 380, easing: 'ease-out' });
  input.focus();
}
$('f-title').addEventListener('input', () => $('f-title').classList.remove('need'));
function closeEditor() { if ($('ed-scrim').hidden) return; hideModal('ed-scrim'); ED = null; }
/* Échap ou clic à côté : si quelque chose a été saisi, on prévient d'abord ; un second geste abandonne (« Annuler » ferme toujours) */
const edSig = () => JSON.stringify([...['f-title', 'f-sd', 'f-st', 'f-ed', 'f-et', 'f-loc', 'f-desc', 'f-rem', 'f-until'].map(id => $(id).value), $('f-allday').checked, $('f-until-date').checked, edCal, edFreq, [...edDays].sort()]);
function edLeave() {
  if (ED && edSig() !== ED.sig && !(ED.warned && Date.now() - ED.warned < 5000)) { ED.warned = Date.now(); $('f-leave').hidden = false; popIn($('f-leave'), 'shake'); return; }
  closeEditor();
}
/* Lieu et note n'apparaissent que s'ils sont remplis, ou à la demande */
const EXTRAS = ['rep', 'rem', 'loc', 'desc'];
function syncExtras() {
  $('f-rep-row').hidden = edFreq === 'none';
  $('f-rem-row').hidden = $('f-rem').value === 'none';
  $('f-loc-row').hidden = !$('f-loc').value.trim(); $('f-desc-row').hidden = !$('f-desc').value.trim();
  EXTRAS.forEach(k => $('f-add').querySelector(`[data-add="${k}"]`).hidden = !$(`f-${k}-row`).hidden);
  $('f-add').hidden = EXTRAS.every(k => !$(`f-${k}-row`).hidden);
}
$('f-add').addEventListener('click', e => {
  const b = e.target.closest('[data-add]'); if (!b) return;
  const row = $(`f-${b.dataset.add}-row`); row.hidden = false; b.hidden = true;
  if (b.dataset.add === 'rem' && $('f-rem').value === 'none') $('f-rem').value = $('f-allday').checked ? '-540' : '30';
  if (b.dataset.add === 'rep') { edFreq = 'weekly'; const st = edStart(); if (st) edDays = new Set([isoDow(st)]); renderEdRec(); syncExtras(); }
  $('f-add').hidden = EXTRAS.every(k => !$(`f-${k}-row`).hidden);
  $(b.dataset.add === 'rep' ? 'f-freq' : `f-${b.dataset.add}`).focus();
});
/* Changer le début décale la fin (durée conservée) et, en hebdo, le jour répété */
function onStartChange() {
  const s = edStart(); if (!s) return;
  if (edLast && edLast.s && edLast.e && edLast.e > edLast.s) setEdEnd(new Date(s.getTime() + (edLast.e - edLast.s)));
  if (edFreq === 'weekly' && edLast?.s && isoDow(edLast.s) !== isoDow(s) && edDays.size === 1 && edDays.has(isoDow(edLast.s))) { edDays = new Set([isoDow(s)]); renderEdRec(); }
  edSnap(); updateWhen();
}
$('f-sd').addEventListener('change', onStartChange);
$('f-st').addEventListener('change', onStartChange);
['f-ed', 'f-et'].forEach(id => $(id).addEventListener('change', () => { if (id === 'f-et' && !$('f-et').value && edStart()) setEdEnd(edEnd()); edSnap(); updateWhen(); }));   // heure de fin effacée : on remet 1 h, visible
$('f-cals').addEventListener('click', e => { const b = e.target.closest('[data-cal]'); if (b?.dataset.cal === 'anniv' && ED?.mode !== 'edit') { openBday(null, { name: edTitle(), date: edStart() || TODAY }); return; } if (b) { edCal = b.dataset.cal; renderEdCals(); popIn($('f-cals').querySelector(`[data-cal="${edCal}"]`)); } });
$('f-freq').addEventListener('change', e => { edFreq = e.target.value; renderEdRec(); syncExtras(); });
$('f-days').addEventListener('click', e => { const b = e.target.closest('[data-d]'); if (!b) return; const d = Number(b.dataset.d); if (edDays.has(d) && edDays.size > 1) edDays.delete(d); else edDays.add(d); renderEdRec(); popIn($('f-days').querySelector(`[data-d="${d}"]`)); });
$('f-until-row').addEventListener('change', renderEdRec);
$('f-allday').addEventListener('change', () => syncAllDay(true));
$('f-delete').addEventListener('click', () => { if (ED) deleteFlow(ED.evId, ED.occKey); });
$('ed').addEventListener('submit', async e => {
  e.preventDefault(); if (!ED) return;
  const allDay = $('f-allday').checked, s = edStart(), en = edEnd();
  if (edCal === 'anniv') { openBday(null, { name: edTitle(), date: s || TODAY }); return; }   // un anniversaire n'a pas de durée
  if (!edTitle()) { if (EDN.on && EDN.R.parts.length) $('f-nl').classList.add('need'); needTitle($('f-title'), $('ed')); return; }
  if (!s || !en || !(en > s)) { $('f-err').hidden = false; popIn($('f-err'), 'shake'); return; }
  const ev0 = ED.mode === 'edit' ? getEv(ED.evId) : null, iv = ev0?.rrule.freq === edFreq && ev0.rrule.interval;   // « toutes les 2 semaines » (import) : gardé tant que la fréquence ne change pas
  const rrule = edFreq === 'none' ? { freq: 'none' } : { freq: edFreq, days: edFreq === 'weekly' ? [...edDays].sort() : undefined, until: $('f-until-date').checked ? $('f-until').value : null, ...(iv ? { interval: iv } : {}) };
  if (rrule.until && rrule.until < key(s)) { $('f-until').focus(); popIn($('f-until'), 'shake'); return; }   // fin de répétition avant le début : rien ne s'afficherait
  const data = { title: edTitle() || 'Sans titre', cal: edCal, allDay, loc: $('f-loc').value.trim(), desc: $('f-desc').value.trim(), rem: $('f-rem').value };
  const was = ED.mode !== 'create' && getEv(ED.evId);   // fin inconnue gardée tant qu'on ne touche pas à l'heure de fin
  data.openEnd = was && isOpen(was) && !allDay && en - s === OPEN_LEN ? true : undefined;
  const snap = snapshot(), moved = { start: toStr(s, allDay), end: toStr(en, allDay) };
  rememberCal(edCal);
  UI.hlShow = true;   // ensuite, la page montre l'événement (voir goToNew)
  if (ED.mode === 'create') {
    UI.hlBurst = true;
    S.events.push(norm({ id: (UI.hl = uid('e')), ...data, ...moved, rrule }));
    closeEditor(); refreshData([data.cal]); toast('Événement créé', snap); return;
  }
  const ev = getEv(ED.evId), ids = [ev.cal, data.cal];
  if (ev.person && data.title !== ev.title) data.person = personOf({ title: data.title });
  if (!isRec(ev)) { UI.hl = ev.id; Object.assign(ev, data, moved, { rrule }); closeEditor(); refreshData(ids); toast('Modifications enregistrées', snap); return; }
  const scope = await askScope('edit', ED.occKey, ev); if (!scope) return;
  const dDays = daysBetween(occurrenceOf(ev, ED.occKey).start, s);
  if (scope === 'this') {
    ev.exdates.push(ED.occKey);
    S.events.push(norm({ ...JSON.parse(JSON.stringify(ev)), ...data, ...moved, id: (UI.hl = uid('e')), rrule: { freq: 'none' }, exdates: [] }));
    moveDues(ev.id, k => k === ED.occKey, UI.hl, dDays);
  } else if (scope === 'future') {
    UI.hl = splitAt(ev, ED.occKey, { ...data, ...moved, rrule }).id;
    moveDues(UI.hl, () => true, UI.hl, dDays);
  } else {
    UI.hl = ev.id; const occ = occurrenceOf(ev, ED.occKey);
    const ms = new Date(parse(ev.start).getTime() + (s - occ.start));
    Object.assign(ev, data, { start: toStr(ms, allDay), end: toStr(new Date(ms.getTime() + (en - s)), allDay), rrule, exdates: ev.exdates.map(k => key(addDays(parse(k), dDays))) });
    moveDues(ev.id, () => true, ev.id, dDays);
  }
  closeEditor(); refreshData(ids); toast(SCOPE_MSG.edit[scope], snap);
});

/* ===================== Fenêtre anniversaire ===================== */
let BD = null;
$('bd-day').innerHTML = [...Array(31)].map((_, i) => `<option value="${i + 1}">${i + 1}</option>`).join('');
$('bd-month').innerHTML = [...Array(12)].map((_, i) => `<option value="${i}">${cap(fM.format(new Date(2020, i, 1)))}</option>`).join('');
function bdYear() { const y = parseInt($('bd-year').value, 10); return y > 1900 && y <= TODAY.getFullYear() ? y : null; }
function bdPreview() {
  const d = +$('bd-day').value, m = +$('bd-month').value, valid = d <= dim(new Date(2020, m, 1));
  $('bd-derr').hidden = valid;
  if (!valid) { $('bd-prev').innerHTML = ''; return; }
  const y = bdYear(), tmp = { rrule: { freq: 'yearly' }, start: key(new Date(2020, m, d)), end: key(new Date(2020, m, d + 1)), allDay: true, exdates: [], born: y };
  const next = expand(tmp, TODAY, addDays(TODAY, 367))[0], n = daysBetween(TODAY, next.start), age = ageAt(tmp, next.start);
  $('bd-prev').innerHTML = `${svg('cake')}<span>Prochain : <b>${cap(fWDMY.format(next.start))}</b> · ${dueShort(n).toLowerCase()}${age ? ` · ${age} ans` : ''}</span>`;
}
let BDX = null;   // ce qu'on règle dans la fenêtre avant d'enregistrer : favori, groupe, idées cadeaux
function bdGrp() {
  const cur = fold(BDX.group || '');
  $('bd-grp').innerHTML = bdGroups().map(g => `<button type="button" role="radio" data-grp="${esc(g)}" aria-checked="${fold(g) === cur}" style="--c:${grpCol(g)}">${fold(g) === 'famille' ? svg('home') : ''}${esc(g)}</button>`).join('')
    + `<input class="field bd-grp-new" id="bd-grp-new" placeholder="Autre…" aria-label="Autre groupe" autocomplete="off" value="${cur && !bdGroups().some(g => fold(g) === cur) ? esc(BDX.group) : ''}">`;
}
function bdGifts() {
  const gs = BDX.gifts.map((g, i) => ({ ...g, i })), ideas = gs.filter(g => !g.y), given = gs.filter(g => g.y).sort((a, b) => b.y - a.y);
  const it = g => `<div class="bg-it${g.y ? ' given' : ''}">${svg(g.y ? 'check' : 'gift')}<span>${esc(g.t)}${g.y ? `<small>offert en ${g.y}</small>` : ''}</span>`
    + (g.y ? `<button type="button" class="btn ghost sm" data-gift-back="${g.i}" title="Remettre dans les idées">Remettre</button>` : `<button type="button" class="btn ghost sm" data-gift-off="${g.i}" title="Marquer comme offert cette année">Offert</button>`)
    + `<button type="button" class="icon-btn flat sm" data-gift-x="${g.i}" aria-label="Retirer : ${esc(g.t)}" title="Retirer">${svg('x')}</button></div>`;
  $('bd-gifts').innerHTML = ideas.map(it).join('') + (given.length ? `<div class="bg-h">Déjà offert</div>${given.map(it).join('')}` : '');
}
$('bd-grp').addEventListener('click', e => {
  const b = e.target.closest('[data-grp]'); if (!b) return;
  BDX.group = fold(b.dataset.grp) === fold(BDX.group || '') ? '' : b.dataset.grp; bdGrp(); popIn($('bd-grp').querySelector(`[data-grp="${CSS.escape(b.dataset.grp)}"]`));
});
$('bd-grp').addEventListener('input', e => { if (e.target.id !== 'bd-grp-new') return; BDX.group = e.target.value.trim(); $('bd-grp').querySelectorAll('[data-grp]').forEach(x => x.setAttribute('aria-checked', String(!!BDX.group && fold(x.dataset.grp) === fold(BDX.group)))); });
$('bd-gifts').addEventListener('click', e => {
  const off = e.target.closest('[data-gift-off]'), back = e.target.closest('[data-gift-back]'), x = e.target.closest('[data-gift-x]');
  if (off) BDX.gifts[+off.dataset.giftOff].y = TODAY.getFullYear();
  else if (back) delete BDX.gifts[+back.dataset.giftBack].y;
  else if (x) BDX.gifts.splice(+x.dataset.giftX, 1);
  else return;
  bdGifts();
});
$('bd-gift').addEventListener('keydown', e => {
  if (e.key !== 'Enter') return; e.preventDefault();
  const t = e.target.value.trim(); if (!t) return;
  BDX.gifts.push({ t }); e.target.value = ''; bdGifts();
});
$('bd-fav').addEventListener('click', () => { BDX.fav = !BDX.fav; $('bd-fav').setAttribute('aria-pressed', String(BDX.fav)); popIn($('bd-fav')); });
function openBday(ev, pre = {}) {   // pre : { name, date } quand on vient d'un autre formulaire
  closePopover(); closeQuick(); closeEditor();
  BD = ev || null;
  BDX = { fav: !!ev?.fav, group: ev?.group || (UI.bdF?.startsWith('g:') ? UI.bdF.slice(2) : ''), gifts: (ev?.gifts || []).map(g => ({ ...g })) };
  $('bd-fav').setAttribute('aria-pressed', String(BDX.fav)); $('bd-gift').value = ''; bdGrp(); bdGifts();
  const s = ev ? parse(ev.start) : pre.date || TODAY;
  $('bd-title').textContent = ev ? "Modifier l'anniversaire" : 'Nouvel anniversaire';
  $('bd-name').value = ev ? personOf(ev) : pre.name ? personOf({ title: pre.name.trim() }) : '';
  $('bd-day').value = s.getDate(); $('bd-month').value = s.getMonth(); $('bd-year').value = ev?.born || '';
  $('bd-rem').value = ev && [...$('bd-rem').options].some(x => x.value === ev.rem) ? ev.rem : '1440';
  $('bd-err').hidden = true; $('bd-delete').hidden = !ev; $('bd-more').hidden = !!ev;
  bdPreview(); showModal('bd-scrim'); setTimeout(() => $('bd-name').focus(), 30);
}
function closeBday() { if ($('bd-scrim').hidden) return; hideModal('bd-scrim'); BD = null; }
['bd-day', 'bd-month', 'bd-year'].forEach(id => $(id).addEventListener('input', bdPreview));
$('bd-delete').addEventListener('click', () => { if (BD) deleteFlow(BD.id, key(parse(BD.start))); });
function saveBday(keepOpen) {
  const name = $('bd-name').value.trim(), d = +$('bd-day').value, m = +$('bd-month').value, y = bdYear();
  if (!name) { $('bd-err').textContent = 'Indique un nom.'; $('bd-err').hidden = false; $('bd-name').focus(); return; }
  if (d > dim(new Date(2020, m, 1))) return;
  const dup = S.events.find(ev => isBday(ev) && ev !== BD && fold(personOf(ev)) === fold(name) && parse(ev.start).getMonth() === m && parse(ev.start).getDate() === d);
  if (dup) { $('bd-err').textContent = `${name} est déjà dans la liste au ${d} ${MONTHS_FR[m]}.`; $('bd-err').hidden = false; $('bd-name').focus(); return; }
  const st = new Date(2020, m, d);
  const pending = $('bd-gift').value.trim(); if (pending) BDX.gifts.push({ t: pending });   // idée tapée sans Entrée
  const data = { title: `Anniversaire ${/^[aeiouyhàâäéèêëîïôöûüœ]/i.test(name) ? 'd’' : 'de '}${name}`, person: name, allDay: true, start: key(st), end: key(addDays(st, 1)), rrule: { freq: 'yearly' }, rem: $('bd-rem').value,
    fav: BDX.fav || undefined, group: BDX.group || undefined, gifts: BDX.gifts.length ? BDX.gifts : undefined };
  Object.keys(data).forEach(k => data[k] === undefined && delete data[k]);
  const snap = snapshot(), was = !!BD;
  let id;
  if (BD) { ['fav', 'group', 'gifts'].forEach(k => delete BD[k]); Object.assign(BD, data); if (y) BD.born = y; else delete BD.born; id = BD.id; }
  else {
    const bc = getCal('anniv') || S.calendars[0];
    if (!bc) { toast("Crée d'abord un calendrier"); return; }
    bc.visible = true;
    const ev = norm({ id: uid('b'), cal: bc.id, ...data }); if (y) ev.born = y;
    S.events.push(ev); id = ev.id;
  }
  UI.hl = id; UI.bnFlash = new Set([id]);
  const msg = was ? 'Anniversaire mis à jour' : `${name} · ${d} ${MONTHS_FR[m]}`;
  if (keepOpen && !was) {            // on enchaîne : même mois gardé, nom vidé
    refreshData(); toast(`Ajouté : ${msg}`, snap);
    $('bd-name').value = ''; $('bd-year').value = ''; $('bd-err').hidden = true; BDX = { fav: false, group: BDX.group, gifts: [] }; $('bd-fav').setAttribute('aria-pressed', 'false'); $('bd-gift').value = ''; bdGrp(); bdGifts(); bdPreview(); $('bd-name').focus();
    return;
  }
  closeBday(); refreshData(); toast(was ? msg : `Ajouté : ${msg}`, snap);
}
$('bd').addEventListener('submit', e => { e.preventDefault(); saveBday(false); });
$('bd-more').addEventListener('click', () => saveBday(true));
$('bd-name').addEventListener('input', () => { $('bd-err').hidden = true; });

/* ===================== Gestion d'un calendrier ===================== */
let CE = null, ceColor = 'blue';
function renderCe() {
  $('ce-sw').innerHTML = COLORS.map(([k, n]) => `<button type="button" role="radio" style="--c:var(--cal-${k})" data-col="${k}" aria-checked="${k === ceColor}" aria-label="${n}" title="${n}">${svg('check')}</button>`).join('');
  $('ce-prev').innerHTML = `<div class="evbox" style="--c:var(--cal-${ceColor})"><div class="ev-t">${esc($('ce-name').value || 'Événement')}</div><div class="ev-m">09:00 – 10:00</div></div>`;
}
function openCalEditor(id) {
  closePopover(); closeQuick();
  CE = id ? getCal(id) : null;
  $('ce-title').textContent = CE ? (CE.sub ? 'Abonnement' : 'Modifier le calendrier') : 'Nouveau calendrier';
  $('ce-name').value = CE ? CE.name : '';
  // le lien : pour un nouveau calendrier, ou un abonnement existant (un calendrier normal ne devient pas un abonnement : ses événements seraient remplacés)
  $('ce-sub').hidden = !!CE && !CE.sub; $('ce-url').value = CE?.sub?.url || ''; $('ce-url-err').hidden = true; subStatus();
  $('ce-name').placeholder = CE ? '' : 'Nom (sinon celui du lien)';
  $('ce-url-k').textContent = CE?.sub ? 'adresse iCal (.ics)' : 'facultatif · adresse iCal (.ics)';
  $('ce-del').lastChild.textContent = CE?.sub ? 'Se désabonner' : 'Supprimer';
  ceColor = CE ? CE.color : COLORS.find(([k]) => !S.calendars.some(c => c.color === k))?.[0] || 'violet';
  $('ce-del').hidden = !CE || S.calendars.length < 2; $('ce-err').hidden = true;
  renderCe(); showModal('ce-scrim'); setTimeout(() => $('ce-name').focus(), 30);
}
function closeCalEditor() { if ($('ce-scrim').hidden) return; hideModal('ce-scrim'); CE = null; }
$('ce-sw').addEventListener('click', e => { const b = e.target.closest('[data-col]'); if (b) { ceColor = b.dataset.col; renderCe(); popIn($('ce-sw').querySelector(`[data-col="${ceColor}"]`)); popIn($('ce-prev').firstElementChild, 'pop-b'); } });
$('ce-name').addEventListener('input', renderCe);
$('ce').addEventListener('submit', async e => {
  e.preventDefault();
  const name = $('ce-name').value.trim(), url = $('ce-sub').hidden ? '' : $('ce-url').value.trim();
  if (!name && !url) { $('ce-err').hidden = false; $('ce-name').focus(); return; }
  if (url && !/^(https?|webcals?):\/\//i.test(url)) { subFail('Colle une adresse qui commence par https:// ou webcal://'); return; }
  // Nouvel abonnement : on lit le lien avant de créer quoi que ce soit
  if (!CE && url) {
    const btn = $('ce').querySelector('[type="submit"]'); btn.disabled = true; btn.textContent = 'Connexion…';
    let feed = null; try { feed = await fetchICS(url); } catch (err) { subFail(subErr(err)); } finally { btn.disabled = false; btn.textContent = 'Enregistrer'; }
    if (!feed) return;
    const snap = snapshot();
    const c = { id: uid('c'), name: name || feed.name || new URL(subURL(url)).hostname, color: ceColor, visible: true, sub: { url: subURL(url), at: new Date().toISOString(), n: 0, err: null } };
    S.calendars.push(c); const evs = subEvents(c, feed); S.events.push(...evs); c.sub.n = evs.length;
    closeCalEditor(); refreshData([c.id]);
    toast('Abonnement ajouté', snap, { title: c.name, rest: `${evs.length} événement${evs.length > 1 ? 's' : ''}, mis à jour toutes les 30 min` });
    return;
  }
  const snap = snapshot();
  if (CE?.sub && url && subURL(url) !== CE.sub.url) { CE.sub.url = subURL(url); CE.sub.at = null; setTimeout(() => syncSub(getCal(CE?.id) || S.calendars.find(c => c.sub?.url === subURL(url))), 0); }
  if (CE) { CE.name = name || CE.name; CE.color = ceColor; } else S.calendars.push({ id: uid('c'), name, color: ceColor, visible: true });
  const was = !!CE, ids = CE ? [CE.id] : []; closeCalEditor(); refreshData(ids); toast(was ? 'Calendrier mis à jour' : 'Calendrier créé', snap);
});
/* Suppression directe : le toast « Annuler » remplace la confirmation */
$('ce-del').addEventListener('click', () => {
  const snap = snapshot(), id = CE.id, name = CE.name, n = S.events.filter(e => e.cal === id).length;
  const wasSub = !!CE.sub;
  S.calendars = S.calendars.filter(c => c.id !== id); S.events = S.events.filter(e => e.cal !== id);
  if (UI.lastCal === id) UI.lastCal = null;
  if (wasSub) { closeCalEditor(); refreshData([]); toast(`Désabonné de « ${name} »`, snap); return; }
  closeCalEditor(); refreshData([]); toast(`« ${name} » supprimé${n ? ` avec ${n} événement${n > 1 ? 's' : ''}` : ''}`, snap);
});

/* ===================== Abonnements (lien iCal) =====================
   Un calendrier peut suivre une adresse .ics (emploi du temps, agenda partagé publié…) : ses événements sont relus
   à l'ouverture, toutes les 30 min et au retour sur l'onglet. Ils sont en lecture seule : la source fait foi.
   Le navigateur ne peut lire que les liens qui l'autorisent (CORS) ; sinon on le dit, et le fichier reste possible. */
const SUB_EVERY = 30 * 60e3, SUB_BUSY = new Set();
const subURL = u => u.trim().replace(/^webcals?:\/\//i, 'https://');
const subErr = e => e instanceof TypeError ? 'le navigateur n’a pas pu lire ce lien (le site ne l’autorise pas depuis une page web, ou pas de connexion)' : e.message;
async function fetchICS(url) {
  const r = await fetch(subURL(url), { cache: 'no-store', redirect: 'follow' });
  if (!r.ok) throw new Error(`le lien répond « ${r.status} » (adresse privée, ou introuvable)`);
  const txt = await r.text();
  if (!/BEGIN:VCALENDAR/i.test(txt)) throw new Error('ce lien ne renvoie pas un agenda (.ics)');
  return parseICS(txt);
}
/* Identité d'un événement de flux d'une lecture à l'autre : son UID et son début ; sans UID, titre, horaires et lieu */
const subId = e => `${e.icsUid ?? `~${e.title}|${e.end}|${e.loc}`}|${e.start}`;
/* Les événements du flux, dans ce calendrier ; un événement déjà connu garde son id (aperçu, échéances, surlignage).
   Une occurrence modifiée (RECURRENCE-ID) remplace la date d'origine de sa série. */
function subEvents(c, feed) {
  const known = new Map(S.events.filter(e => e.cal === c.id).map(e => [subId(e), e.id])), used = new Set();
  const live = feed.events.filter(v => v.start && v.status !== 'CANCELLED');
  const out = live.filter(v => !v.recId).map(v => {
    const { ev, note } = icsEvent(v), k = subId(ev);
    let id = known.get(k); if (!id || used.has(id)) id = uid('e'); used.add(id);
    return { ...ev, id, cal: c.id, ...(note ? { repNote: note } : {}) };
  });
  feed.events.filter(v => v.recId && v.start).forEach(v => {
    const orig = v.recId.date, series = orig && out.find(e => e.icsUid === v.uid && isRec(e));
    if (series && !series.exdates.includes(key(orig))) series.exdates.push(key(orig));
    if (v.status === 'CANCELLED') return;
    const { ev } = icsEvent({ ...v, rrule: null }), k = subId(ev);
    let id = known.get(k); if (!id || used.has(id)) id = uid('e'); used.add(id);
    out.push({ ...ev, id, cal: c.id });
  });
  return out;
}
/* Le passé reste : la source peut retirer ses vieux événements (fenêtre glissante) ou disparaître en fin d'année,
   ce qui a déjà eu lieu ne s'efface pas pour autant. L'avenir, lui, suit la source.
   Une série retirée garde ses dates passées : on l'arrête à hier.
   Un événement dont l'UID est encore dans le flux (déplacé, modifié, annulé) suit le flux : pas de doublon de l'ancienne version. */
function subKeep(c, fresh, at = new Date(), feedUids = new Set()) {
  const uids = new Set([...feedUids, ...fresh.map(e => e.icsUid).filter(Boolean)]), seen = new Set(fresh.map(subId)), cut = key(addDays(at, -1));
  return S.events.filter(e => e.cal === c.id && !(e.icsUid ? uids.has(e.icsUid) : seen.has(subId(e)))).flatMap(e =>
    !isRec(e) ? (parse(e.end) <= at ? [e] : [])
    : e.start.slice(0, 10) > cut ? []
    : [{ ...e, rrule: { ...e.rrule, until: e.rrule.until && e.rrule.until <= cut ? e.rrule.until : cut } }]);
}
async function syncSub(c) {
  if (!c?.sub || SUB_BUSY.has(c.id)) return;   // une lecture à la fois par calendrier
  SUB_BUSY.add(c.id);
  const sig = () => JSON.stringify(S.events.filter(e => e.cal === c.id).sort((a, b) => a.id < b.id ? -1 : 1)), before = sig();
  try {
    const feed = await fetchICS(c.sub.url), evs = subEvents(c, feed), kept = subKeep(c, evs, new Date(), new Set(feed.events.map(v => v.uid).filter(Boolean)));
    for (let i = S.events.length - 1; i >= 0; i--) if (S.events[i].cal === c.id) S.events.splice(i, 1);
    S.events.push(...kept, ...evs);
    Object.assign(c.sub, { at: new Date().toISOString(), n: kept.length + evs.length, err: null });
  } catch (err) { c.sub.err = subErr(err); }
  finally { SUB_BUSY.delete(c.id); }
  /* Rien de changé : on ne redessine que la ligne du calendrier (l'heure de mise à jour), sans déranger ce qu'on fait */
  if (sig() === before) { dirty(); renderCalList(); } else refreshData([c.id]);
  if (CE === c) subStatus();
}
async function syncSubs(force = false) {
  for (const c of S.calendars.filter(c => c.sub)) if (force || !c.sub.at || Date.now() - new Date(c.sub.at) > SUB_EVERY - 60e3) await syncSub(c);
}
const agoTxt = iso => { const m = Math.round((Date.now() - new Date(iso)) / 60e3); return m < 1 ? 'à l’instant' : m < 60 ? `il y a ${m} min` : m < 1440 ? `il y a ${Math.round(m / 60)} h` : `le ${fDM.format(new Date(iso))}`; };
function subStatus() {
  const st = $('ce-sub-st'), c = CE?.sub ? CE : null;
  if (!c) { st.innerHTML = 'Les événements de ce lien s’ajoutent ici et se mettent à jour tout seuls.'; st.className = 'ce-sub-st'; return; }
  const n = S.events.filter(e => e.cal === c.id).length, s = n > 1 ? 's' : '';
  st.className = `ce-sub-st${c.sub.err ? ' err' : ''}`;
  st.innerHTML = `<span>${c.sub.err
      ? `Échec de la dernière mise à jour : ${esc(c.sub.err)}${n ? `<span class="keep">${n > 1 ? `Les ${n} événements déjà récupérés restent` : 'L’événement déjà récupéré reste'} dans l’agenda.</span>` : ''}`
      : `${n} événement${s} · mis à jour ${c.sub.at ? agoTxt(c.sub.at) : '—'}`}</span>
    <span class="ce-sub-acts"><button type="button" class="btn ghost sm" id="ce-sync">${svg('repeat')}${c.sub.err ? 'Réessayer' : 'Actualiser'}</button><button type="button" class="btn ghost sm" id="ce-keep" title="Le calendrier et ses événements restent, modifiables ; le lien n’est plus relu">${svg('unlink')}Ne plus suivre le lien</button></span>`;
}
function subFail(msg) { $('ce-url-err').textContent = cap(msg); $('ce-url-err').hidden = false; $('ce-url').focus(); }
$('ce-sub').addEventListener('click', async e => {
  if (!CE?.sub) return;
  const sy = e.target.closest('#ce-sync'); if (sy) { sy.lastChild.textContent = 'Mise à jour…'; sy.disabled = true; await syncSub(CE); return; }
  // Fin d'année, lien mort… : le calendrier devient un calendrier normal, ses événements restent et se modifient
  if (e.target.closest('#ce-keep')) {
    const snap = snapshot(), c = CE, n = S.events.filter(x => x.cal === c.id).length;
    delete c.sub; closeCalEditor(); refreshData([c.id]);
    toast('Abonnement arrêté', snap, { title: c.name, rest: `ne suit plus le lien${n ? ` · ${n} événement${n > 1 ? 's' : ''} gardé${n > 1 ? 's' : ''}` : ''}` });
  }
});
$('ce-url').addEventListener('input', () => { $('ce-url-err').hidden = true; });
setInterval(() => { if ($('login').hidden) syncSubs(); }, SUB_EVERY);
addEventListener('focus', () => { if ($('login').hidden) syncSubs(); });

/* ===================== Connexion ===================== */
function showLogin() { closePopover(); $('app').hidden = true; $('login').hidden = false; $('l-pass').value = ''; document.querySelector('.fab').hidden = true; setTimeout(() => $('l-pass').focus(), 30); }
function showApp() { setTimeout(() => syncSubs(), 400); $('login').hidden = true; $('app').hidden = false; $('app').classList.remove('app-in'); void $('app').offsetWidth; $('app').classList.add('app-in'); requestAnimationFrame(updateSegThumbs); document.querySelector('.fab').hidden = false; requestAnimationFrame(() => cal.updateSize()); }
$('l-eye').addEventListener('click', () => {
  const p = $('l-pass'), show = p.type === 'password'; p.type = show ? 'text' : 'password';
  $('l-eye').innerHTML = svg(show ? 'eyeoff' : 'eye'); $('l-eye').setAttribute('aria-label', show ? 'Masquer le mot de passe' : 'Afficher le mot de passe');
});
$('login-form').addEventListener('submit', e => {
  e.preventDefault();
  const u = $('l-user'), p = $('l-pass'); let bad = false;
  $('l-pass-err').textContent = 'Saisis ton mot de passe.';   // le message a pu servir à une erreur de connexion
  [[u, 'l-user-err'], [p, 'l-pass-err']].forEach(([el, err]) => { const miss = !el.value.trim(); $(err).hidden = !miss; el.setAttribute('aria-invalid', String(miss)); if (miss && !bad) { el.focus(); bad = true; } });
  if (bad) { const c = $('login-form'); c.classList.remove('shake'); void c.offsetWidth; c.classList.add('shake'); return; }
  const b = $('l-submit'); b.textContent = 'Connexion…'; b.disabled = true;
  serverLogin(u.value.trim(), p.value, $('l-keep').checked);   // sync.js : vérifié auprès de Radicale
});

/* ===================== Thème ===================== */
function setTheme(t, anim) {
  const r = document.documentElement;
  if (anim) { r.classList.add('theme-anim'); clearTimeout(r._ta); r._ta = setTimeout(() => r.classList.remove('theme-anim'), 450); } if (t === 'system') delete r.dataset.theme; else r.dataset.theme = t;
  document.querySelectorAll('[data-theme-set]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.themeSet === t)));
  try { localStorage.setItem('agenda-theme', t); } catch (e) {}
}
let savedTheme = 'system'; try { savedTheme = localStorage.getItem('agenda-theme') || 'system'; } catch (e) {}
setTheme(savedTheme);

/* ===================== Recherche ===================== */
const SR = { items: [], i: 0 };
function bestOcc(ev) {
  if (!isRec(ev)) return occurrenceOf(ev, key(parse(ev.start)));
  const now = new Date();
  return expand(ev, now, addDays(TODAY, 800))[0] || expand(ev, addDays(TODAY, -800), now).pop() || null;
}
function searchItems(q) {
  const f = fold(q.trim()), now = new Date();
  if (!f) return occurrences(now, addDays(TODAY, 60)).filter(o => !isBday(o.ev)).slice(0, 6);
  const words = f.split(/\s+/);
  const hit = t => { const hay = fold(t); return words.every(w => hay.includes(w)); };
  const out = S.events.filter(ev => hit([ev.title, ev.loc, ev.desc, ev.person, getCal(ev.cal)?.name].join(' '))).map(bestOcc).filter(Boolean);
  /* Les échéances aussi : « fiche de lecture » mène au cours où on la rend */
  const have = new Set(out.map(o => `${o.ev.id}@${o.occKey}`));
  S.dues.forEach(d => { if (!hit(d.t)) return; const x = dueAt(d); if (!x.ev || !getCal(x.cal)?.visible) return;
    const o = occurrenceOf(x.ev, x.occ), k = `${x.ev.id}@${o.occKey}`; if (!have.has(k)) { have.add(k); out.push(o); } });
  const fut = out.filter(o => o.end > now).sort((a, b) => a.start - b.start), past = out.filter(o => o.end <= now).sort((a, b) => b.start - a.start);
  return [...fut, ...past].slice(0, 40);
}
function hl(text, f) { // surligne les mots cherchés, sans tenir compte des accents
  const t = String(text || ''); if (!f) return esc(t);
  const ft = fold(t), mark = new Array(t.length).fill(false);
  if (ft.length !== t.length) return esc(t);
  f.split(/\s+/).filter(Boolean).forEach(w => { let i = ft.indexOf(w); while (i >= 0) { for (let k = i; k < i + w.length; k++) mark[k] = true; i = ft.indexOf(w, i + w.length); } });
  let out = '', on = false;
  for (let k = 0; k < t.length; k++) { if (mark[k] !== on) { out += on ? '</mark>' : '<mark>'; on = mark[k]; } out += esc(t[k]); }
  return out + (on ? '</mark>' : '');
}
function renderSearch() {
  const q = $('sr-q').value, f = fold(q.trim()), now = new Date();
  SR.items = searchItems(q);
  SR.i = Math.min(SR.i, Math.max(0, SR.items.length - 1));
  const nRes = SR.items.length;
  $('sr-label').textContent = f ? `${nRes} résultat${nRes > 1 ? 's' : ''}` : 'Prochainement';
  $('sr-list').innerHTML = SR.items.length ? SR.items.map((o, i) => {
    const live = o.start <= now && o.end > now, rel = live ? 'En cours' : relShort(daysBetween(TODAY, o.start));
    const when = o.ev.allDay ? cap(fWDMs.format(o.start)) + ` ${o.start.getFullYear()}` : `${cap(fWDMs.format(o.start))} ${o.start.getFullYear()} · ${hm(o.start)}`;
    return `<button class="sr-it${i === SR.i ? ' on' : ''}" role="option" aria-selected="${i === SR.i}" id="sr-${i}" data-i="${i}" style="--c:${calVar(o.ev.cal)}"><i></i><span class="sr-main"><b>${hl(o.ev.title, f)}</b><span>${(dd => dd ? `${svg('flag', 'sr-due')}${hl(dd.t, f)} · ` : '')(dueFor(o.ev, o.occKey))}${when}${o.ev.loc ? ' · ' + hl(o.ev.loc, f) : ''}${isRec(o.ev) ? ' · ' + esc(ruleText(o.ev)) : ''}${isBday(o.ev) && ageAt(o.ev, o.start) ? ` · ${ageAt(o.ev, o.start)}\u00a0ans` : ''}</span></span><span class="chip${live || daysBetween(TODAY, o.start) === 0 ? ' hot' : ''}">${rel}</span></button>`;
  }).join('') : `<div class="sr-empty">Aucun événement ne correspond à « ${esc(q.trim())} ».</div>`;
  $('sr-q').setAttribute('aria-activedescendant', SR.items.length ? `sr-${SR.i}` : '');
}
function moveSearch(d) {
  if (!SR.items.length) return;
  SR.i = (SR.i + d + SR.items.length) % SR.items.length;
  $('sr-list').querySelectorAll('.sr-it').forEach((b, i) => { b.classList.toggle('on', i === SR.i); b.setAttribute('aria-selected', String(i === SR.i)); });
  $(`sr-${SR.i}`)?.scrollIntoView({ block: 'nearest' }); $('sr-q').setAttribute('aria-activedescendant', `sr-${SR.i}`);
}
function openSearch() { closePopover(); closeQuick(); document.body.classList.remove('side-on'); SR.i = 0; $('sr-q').value = ''; renderSearch(); showModal('sr-scrim'); setTimeout(() => $('sr-q').focus(), 30); }
function closeSearch() { if (!$('sr-scrim').hidden) hideModal('sr-scrim'); }
function pickSearch(i) { const o = SR.items[i]; if (!o) return; closeSearch(); revealOcc(o.ev.id, o.occKey); }
$('sr-q').addEventListener('input', () => { SR.i = 0; renderSearch(); });
$('sr-q').addEventListener('keydown', e => {
  if (e.key === 'ArrowDown') { e.preventDefault(); moveSearch(1); }
  else if (e.key === 'ArrowUp') { e.preventDefault(); moveSearch(-1); }
  else if (e.key === 'Enter') { e.preventDefault(); pickSearch(SR.i); }
});
$('sr-list').addEventListener('click', e => { const b = e.target.closest('[data-i]'); if (b) pickSearch(+b.dataset.i); });

/* ===================== Importer un fichier .ics =====================
   Glisser le fichier sur l'agenda, ou le bouton à côté de « Calendriers ». On montre d'abord ce qui sera ajouté
   et dans quel calendrier ; une fois ajouté, « Annuler » (Ctrl Z) défait tout l'import. */
const ICS_DAYS = { MO: 1, TU: 2, WE: 3, TH: 4, FR: 5, SA: 6, SU: 7 };
/* Texte iCalendar : « \n » = saut de ligne, « \, » = virgule… (certains fichiers doublent la barre : « \\n ») */
const icsText = v => v.replace(/\\\\n|\\n/gi, '\n').replace(/\\([,;\\])/g, '$1').trim();
/* Une heure « murale » dans un fuseau (TZID=Europe/Rome) → l'instant correspondant */
function tzWall(y, mo, d, h, mi, s, tz) {
  const utc = Date.UTC(y, mo, d, h, mi, s);
  try {
    const fmt = new Intl.DateTimeFormat('en-US', { timeZone: tz, hourCycle: 'h23', year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' });
    const off = t => { const p = Object.fromEntries(fmt.formatToParts(t).map(x => [x.type, x.value])); return Date.UTC(+p.year, +p.month - 1, +p.day, +p.hour, +p.minute, +p.second) - t; };
    let t = utc - off(utc); t = utc - off(t); return new Date(t);
  } catch (e) { return new Date(y, mo, d, h, mi, s); }   // fuseau inconnu : on garde l'heure telle quelle
}
function icsDate(v, p = {}) {
  const m = v.trim().match(/^(\d{4})(\d{2})(\d{2})(?:T(\d{2})(\d{2})(\d{2})?(Z)?)?$/); if (!m) return null;
  const [, Y, M, D, h, mi, sec = '0', z] = m;
  if (h == null || p.VALUE === 'DATE') return { date: new Date(+Y, +M - 1, +D), allDay: true };
  if (z) return { date: new Date(Date.UTC(+Y, +M - 1, +D, +h, +mi, +sec)), allDay: false };
  if (p.TZID) return { date: tzWall(+Y, +M - 1, +D, +h, +mi, +sec, p.TZID.replace(/^"|"$/g, '')), allDay: false };
  return { date: new Date(+Y, +M - 1, +D, +h, +mi, +sec), allDay: false };   // heure « flottante » : heure locale
}
function icsDur(v) {
  const m = v.trim().match(/^([+-])?P(?:(\d+)W)?(?:(\d+)D)?(?:T(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?)?$/); if (!m) return null;
  const ms = ((((+m[2] || 0) * 7 + (+m[3] || 0)) * 24 + (+m[4] || 0)) * 60 + (+m[5] || 0)) * 60e3 + (+m[6] || 0) * 1e3;
  return m[1] === '-' ? -ms : ms;
}
function parseICS(text) {
  const lines = text.replace(/\r\n?/g, '\n').replace(/\n[ \t]/g, '').split('\n');   // lignes repliées → une seule
  const out = { name: null, events: [] }, stack = []; let cur = null;
  for (const line of lines) {
    const i = line.indexOf(':'); if (i < 0) continue;
    const [nm, ...ps] = line.slice(0, i).split(';'), name = nm.toUpperCase(), value = line.slice(i + 1);
    const p = Object.fromEntries(ps.map(x => { const j = x.indexOf('='); return [x.slice(0, j).toUpperCase(), x.slice(j + 1)]; }));
    if (name === 'BEGIN') { stack.push(value.trim().toUpperCase()); if (stack.at(-1) === 'VEVENT') cur = { exdates: [] }; continue; }
    if (name === 'END') { if (stack.pop() === 'VEVENT' && cur) { out.events.push(cur); cur = null; } continue; }
    if (stack.at(-1) === 'VCALENDAR' && name === 'X-WR-CALNAME') out.name = icsText(value) || null;
    if (!cur || stack.at(-1) !== 'VEVENT') continue;   // on ignore l'intérieur des alarmes (VALARM)
    if (name === 'SUMMARY') cur.title = icsText(value);
    else if (name === 'DTSTART') cur.start = icsDate(value, p);
    else if (name === 'DTEND') cur.end = icsDate(value, p);
    else if (name === 'DURATION') cur.dur = icsDur(value);
    else if (name === 'LOCATION') cur.loc = icsText(value);
    else if (name === 'DESCRIPTION') cur.desc = icsText(value);
    else if (name === 'UID') cur.uid = value.trim();
    else if (name === 'STATUS') cur.status = value.trim().toUpperCase();
    else if (name === 'RECURRENCE-ID') cur.recId = icsDate(value, p) || true;   // la date d'origine de l'occurrence remplacée
    else if (name === 'RRULE') cur.rrule = Object.fromEntries(value.trim().split(';').map(x => x.split('=')).map(([k, v]) => [k.toUpperCase(), v]));
    else if (name === 'EXDATE') value.split(',').forEach(v => { const d = icsDate(v, p); if (d) cur.exdates.push(d.date); });
  }
  return out;
}
/* Un VEVENT → un événement de l'agenda (la répétition est reprise si l'agenda sait l'afficher) */
function icsEvent(v) {
  const allDay = v.start.allDay, s = v.start.date;
  let e = v.end ? v.end.date : v.dur != null ? new Date(s.getTime() + v.dur) : null;
  const open = !allDay && !(e > s);   // la source ne donne que l'heure de début (ex. un billet de train sans heure d'arrivée)
  if (!e || !(e > s)) e = allDay ? addDays(s, 1) : new Date(s.getTime() + OPEN_LEN);
  const ev = norm({ title: v.title || 'Sans titre', allDay, start: toStr(s, allDay), end: toStr(e, allDay), loc: v.loc || '', desc: v.desc || '', rem: newRem(allDay), icsUid: v.uid || null, ...(open ? { openEnd: true } : {}) });
  let note = '';
  if (v.rrule) {
    const r = v.rrule, by = r.BYDAY ? r.BYDAY.split(',') : null, days = by && by.every(d => ICS_DAYS[d]) ? by.map(d => ICS_DAYS[d]).sort() : null;
    let freq = { DAILY: 'daily', WEEKLY: 'weekly', MONTHLY: 'monthly', YEARLY: 'yearly' }[r.FREQ];
    if (freq === 'daily' && days) freq = 'weekly';   // « chaque jour, du lundi au vendredi »
    const iv = Math.max(1, parseInt(r.INTERVAL, 10) || 1);
    const ok = freq && !r.BYSETPOS && !r.BYWEEKNO && !r.BYYEARDAY && (!by || (days && freq === 'weekly'))
      && (!r.BYMONTHDAY || +r.BYMONTHDAY === s.getDate()) && (!r.BYMONTH || +r.BYMONTH === s.getMonth() + 1);
    if (ok) {
      ev.rrule = { freq, days: freq === 'weekly' ? (days || [isoDow(s)]) : undefined, until: null, ...(iv > 1 ? { interval: iv } : {}) };
      ev.exdates = v.exdates.map(key);
      if (r.UNTIL) { const u = icsDate(r.UNTIL); if (u) ev.rrule.until = key(u.date); }
      else if (r.COUNT) { const occ = expand({ ...ev, id: 'tmp' }, s, addDays(s, 366 * 30)); const last = occ[+r.COUNT - 1] || occ.at(-1); if (last) ev.rrule.until = key(last.start); }
    } else note = 'Répétition non reprise : seulement la première date';
  }
  return { ev, note };
}
let IMP = null;
/* Ce qu'un fichier .ics peut changer d'un événement déjà importé (le calendrier, le rappel, l'échéance restent ceux de l'agenda) */
const ICS_KEYS = ['title', 'start', 'end', 'allDay', 'loc', 'desc', 'rrule', 'exdates', 'openEnd'];
async function importFiles(files) {
  files = [...files]; if (!files.length) return;
  let raw = [], name = null, skipped = 0;
  for (const f of files) {
    let txt = ''; try { txt = await f.text(); } catch (e) {}
    if (!/BEGIN:VCALENDAR/i.test(txt)) continue;
    const c = parseICS(txt); name = name || c.name;
    c.events.forEach(v => { if (!v.start || v.status === 'CANCELLED' || v.recId) skipped++; else raw.push(v); });
  }
  if (!raw.length) { toast(skipped ? 'Rien à ajouter : les événements du fichier sont annulés' : 'Aucun événement à ajouter dans ce fichier (.ics attendu)'); return; }
  const items = raw.map(icsEvent).map(x => {
    const old = x.ev.icsUid && S.events.find(e => e.icsUid === x.ev.icsUid);
    return { ...x, old, kind: !old ? 'new' : ICS_KEYS.every(k => JSON.stringify(old[k] ?? null) === JSON.stringify(x.ev[k] ?? null)) ? 'same' : 'upd' };
  }).sort((a, b) => a.ev.start.localeCompare(b.ev.start));
  items.forEach(x => { x.on = x.kind !== 'same'; });
  const same = name && S.calendars.find(c => c.id !== 'anniv' && fold(c.name) === fold(name));
  IMP = { items, file: files.length === 1 ? files[0].name : `${files.length} fichiers`, calName: same ? null : name, cal: same ? same.id : (defaultCal() === 'anniv' ? 'perso' : defaultCal()), skipped,
    newColor: COLORS.find(([k]) => !S.calendars.some(c => c.color === k))?.[0] || 'slate' };
  closePopover(); closeQuick(); closeSearch(); document.body.classList.remove('side-on');
  renderImport(); showModal('imp-scrim'); setTimeout(() => $('imp-ok').focus(), 30);
}
function impWhen(e) {
  const s = parse(e.start), en = parse(e.end);
  if (isOpen(e)) return `${cap(fWDMY.format(s))} · ${hm(s)} · heure de fin inconnue`;
  if (e.allDay) { const last = addDays(en, -1); return key(s) === key(last) ? cap(fWDMY.format(s)) : `${cap(fWDMs.format(s))} → ${fWDMs.format(last)} ${last.getFullYear()}`; }
  return key(s) === key(new Date(en - 1)) ? `${cap(fWDMY.format(s))} · ${hm(s)} – ${hm(en)}` : `${cap(fWDMs.format(s))} ${s.getFullYear()} ${hm(s)} → ${fWDMs.format(en)} ${hm(en)}`;
}
function syncImpFoot() {
  const I = IMP, on = I.items.filter(x => x.on), add = on.filter(x => x.kind === 'new').length, upd = on.length - add, same = I.items.filter(x => x.kind === 'same').length;
  $('imp-ok').disabled = !on.length;
  $('imp-ok').textContent = !on.length ? (same ? 'Déjà à jour' : 'Ajouter') : [add && `Ajouter${I.items.length > 1 ? ` ${add}` : ''}`, upd && `${add ? 'mettre' : 'Mettre'} à jour${I.items.length > 1 ? ` ${upd}` : ''}`].filter(Boolean).join(' · ');
  $('imp-to').hidden = !I.items.some(x => x.kind === 'new');   // le calendrier ne compte que pour les nouveaux
  const notes = [];
  if (same && I.items.length > 1) notes.push(`${same} déjà à jour`);
  if (I.skipped) notes.push(`${I.skipped} annulé${I.skipped > 1 ? 's' : ''} ou modifié${I.skipped > 1 ? 's' : ''} ignoré${I.skipped > 1 ? 's' : ''}`);
  $('imp-note').textContent = notes.join(' · '); $('imp-note').hidden = !notes.length;
}
function renderImport() {
  const I = IMP, n = I.items.length, color = I.cal === '__new' ? `var(--cal-${I.newColor})` : calVar(I.cal);
  $('imp-kicker').textContent = `Importer · ${I.file}`;
  const k1 = I.items[0].kind;
  $('imp-title').textContent = n === 1 ? (k1 === 'same' ? 'Déjà dans l’agenda' : k1 === 'upd' ? 'Mettre à jour cet événement' : 'Ajouter cet événement') : `${n} événements dans ce fichier`;
  $('imp-list').innerHTML = I.items.map((x, i) => { const e = x.ev;
    return `<label class="imp-it${n === 1 ? ' one' : ''}${x.on ? '' : ' off'}" style="--c:${color}">${n > 1 ? `<input type="checkbox" data-imp="${i}"${x.on ? ' checked' : ''} aria-label="Ajouter « ${esc(e.title)} »">` : ''}<i></i>`
      + `<span class="imp-main"><b>${esc(e.title)}</b><span>${svg('clock')}${impWhen(e)}${x.kind === 'upd' && impWhen(x.old) !== impWhen(e) ? ` <s>${impWhen(x.old)}</s>` : ''}</span>${isRec(e) ? `<span>${svg('repeat')}${esc(ruleText(e))}</span>` : ''}`
      + `${e.loc ? `<span>${svg('pin')}${esc(e.loc)}</span>` : ''}${x.note ? `<span class="imp-warn">${esc(x.note)}</span>` : ''}${n === 1 && e.desc ? `<p>${esc(e.desc)}</p>` : ''}</span>`
      + `${x.kind === 'same' ? '<span class="chip">Déjà à jour</span>' : x.kind === 'upd' ? `<span class="chip upd" title="Avant : ${esc(impWhen(x.old))}">Modifié</span>` : ''}</label>`; }).join('');
  const chip = (id, col, label, cls = '') => `<button type="button" role="radio" class="${cls}" style="--c:var(--cal-${col})" data-cal="${id}" aria-checked="${id === I.cal}">${id === '__new' && id !== I.cal ? svg('plus') : svg('check', 'chk')}${esc(label)}</button>`;
  $('imp-cals').innerHTML = S.calendars.filter(c => c.id !== 'anniv' && !c.sub).map(c => chip(c.id, c.color, c.name)).join('') + (I.calName ? chip('__new', I.newColor, `Nouveau : ${I.calName}`, 'new-c') : '');
  syncImpFoot();
}
function closeImport() { if (!$('imp-scrim').hidden) hideModal('imp-scrim'); IMP = null; }
function doImport() {
  const I = IMP; if (!I) return;
  const pick = I.items.filter(x => x.on); if (!pick.length) return;
  const snap = snapshot();
  let calId = I.cal;
  if (calId === '__new') { calId = uid('c'); S.calendars.push({ id: calId, name: I.calName, color: I.newColor, visible: true }); }
  const c = getCal(calId); if (c) c.visible = true; else return;
  const added = pick.filter(x => x.kind === 'new').map(x => { const ev = { ...x.ev, id: uid('e'), cal: calId }; S.events.push(ev); return ev; });
  const updated = pick.filter(x => x.kind === 'upd').map(x => { ICS_KEYS.forEach(k => { x.old[k] = x.ev[k]; }); return x.old; });
  if (added.length && I.cal !== '__new') rememberCal(calId);
  if (I.cal === '__new' && !added.length) S.calendars.pop();   // rien de nouveau : pas de calendrier vide
  closeImport();
  // on va voir : le premier à venir, sinon le plus récent
  const all = [...added, ...updated].sort((a, b) => a.start.localeCompare(b.start)), first = all.find(e => parse(e.end) > new Date()) || all.at(-1), st = parse(first.start);
  if (isPage()) setView('week');
  cal.gotoDate(st); if (!first.allDay) cal.scrollToTime(`${pad(Math.max(0, st.getHours() - 1))}:00:00`);
  UI.hl = first.id; UI.hlBurst = true; refreshData();
  const pl = n => n > 1 ? 's' : '';
  toast(all.length === 1 ? 'Événement importé' : 'Événements importés', snap,
    all.length === 1 ? { title: first.title, rest: added.length ? `ajouté le ${dateTxt(st, first.allDay)}` : `mis à jour : ${dateTxt(st, first.allDay)}` }
      : { title: null, rest: [added.length && `${added.length} ajouté${pl(added.length)} à « ${c.name} »`, updated.length && `${updated.length} mis à jour`].filter(Boolean).join(', ') });
}
$('imp-list').addEventListener('change', e => {
  const b = e.target.closest('[data-imp]'); if (!b) return;
  IMP.items[+b.dataset.imp].on = b.checked; b.closest('.imp-it').classList.toggle('off', !b.checked); syncImpFoot();
});
$('imp-cals').addEventListener('click', e => { const b = e.target.closest('[data-cal]'); if (!b) return; IMP.cal = b.dataset.cal; renderImport(); popIn($('imp-cals').querySelector(`[data-cal="${IMP.cal}"]`)); });
$('imp-ok').addEventListener('click', doImport);
$('ics-file').addEventListener('change', e => { importFiles(e.target.files); e.target.value = ''; });
/* Glisser-déposer : un fichier qui survole la fenêtre fait apparaître la zone de dépôt */
let dropN = 0;
const hasFiles = e => [...(e.dataTransfer?.types || [])].includes('Files');
addEventListener('dragenter', e => { if (!hasFiles(e) || !$('login').hidden) return; e.preventDefault(); if (dropN++ === 0) $('drop-ics').hidden = false; });
addEventListener('dragover', e => { if (hasFiles(e)) { e.preventDefault(); e.dataTransfer.dropEffect = 'copy'; } });
addEventListener('dragleave', e => { if (hasFiles(e) && --dropN <= 0) { dropN = 0; $('drop-ics').hidden = true; } });
addEventListener('drop', e => { if (!hasFiles(e)) return; e.preventDefault(); dropN = 0; $('drop-ics').hidden = true; if ($('login').hidden) importFiles(e.dataTransfer.files); });

/* ===================== Réglages ===================== */
function syncSettings() {
  $('set-start').querySelectorAll('[data-start]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.start === PREFS.dayStart)));
  $('set-evstyle').querySelectorAll('[data-evstyle]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.evstyle === PREFS.evStyle)));
  $('set-weekends').checked = PREFS.weekends; $('set-rem').value = PREFS.rem; $('set-notif').checked = PREFS.notif;
}
function openSettings() { closePopover(); closeQuick(); syncSettings(); showModal('set-scrim'); setTimeout(() => $('set-scrim').querySelector('[data-close]').focus(), 30); }
function closeSettings() { if (!$('set-scrim').hidden) hideModal('set-scrim'); }
$('set-evstyle').addEventListener('click', e => {
  const b = e.target.closest('[data-evstyle]'); if (!b) return;
  PREFS.evStyle = b.dataset.evstyle; savePrefs(); applyEvStyle(); syncSettings(); popIn(b);
});
$('set-start').addEventListener('click', e => {
  const b = e.target.closest('[data-start]'); if (!b) return;
  PREFS.dayStart = b.dataset.start; savePrefs(); syncSettings(); popIn(b);
  syncDayStart(); requestAnimationFrame(updateHrNav);
});
$('set-weekends').addEventListener('change', e => { PREFS.weekends = e.target.checked; savePrefs(); cal.setOption('weekends', PREFS.weekends); });
$('set-rem').addEventListener('change', e => { PREFS.rem = e.target.value; savePrefs(); });
$('set-notif').addEventListener('change', e => { PREFS.notif = e.target.checked; savePrefs(); });
$('set-test').addEventListener('click', () => {
  const now = new Date(), o = occurrences(now, addDays(TODAY, 30)).find(x => !x.ev.allDay) || occurrences(now, addDays(TODAY, 30))[0];
  if (o) showNotif(o, true);
});

/* ===================== Notifications de rappel ===================== */
/* Un rappel tombé pendant que la page était fermée (jusqu'à 12 h avant) s'affiche à l'ouverture, une seule fois :
   les rappels déjà montrés sont notés dans le navigateur. */
const LOADED_AT = Date.now(), MISSED = 12 * 3600e3, SHOWN = new Set();
try { JSON.parse(localStorage.getItem('agenda-rem-seen') || '[]').forEach(k => SHOWN.add(k)); } catch (e) {}
function remSeen(k) {
  SHOWN.add(k);
  const old = key(addDays(TODAY, -3));   // on oublie ce qui est passé depuis longtemps
  try { localStorage.setItem('agenda-rem-seen', JSON.stringify([...SHOWN].filter(x => x.split('@')[1]?.slice(0, 10) >= old))); } catch (e) {}
}
function remindAt(o) {
  const r = o.ev.rem; if (!r || r === 'none') return null;
  return new Date(o.start.getTime() - Number(r) * 60e3);   // « -540 » = le jour même à 9 h
}
function showNotif(o, test) {
  const box = $('notifs'), bd = isBday(o.ev), now = new Date(), mins = Math.round((o.start - now) / 60e3);
  const lead = bd ? (daysBetween(now, o.start) === 0 ? "Anniversaire aujourd'hui" : 'Anniversaire demain')
    : o.ev.allDay ? (daysBetween(now, o.start) === 0 ? "Aujourd'hui" : 'Demain') : mins <= 0 ? 'Maintenant' : `Rappel · ${inText(o.start - now)}`;
  const age = bd ? ageAt(o.ev, o.start) : null;
  const detail = bd ? (age ? `Fête ses ${age} ans` : cap(fWDM.format(o.start))) : o.ev.allDay ? cap(fWDM.format(o.start)) : `${hm(o.start)}${endTxt(o.ev, o.end)}${o.ev.loc ? ' · ' + esc(o.ev.loc) : ''}`;
  const n = document.createElement('div');
  n.className = 'notif'; n.setAttribute('role', 'alert'); n.style.setProperty('--c', calVar(o.ev.cal));
  n.innerHTML = `<span class="nt-ic">${svg(bd ? 'cake' : 'bell')}</span><div class="nt-b"><small>${test ? 'Aperçu · ' : ''}${lead}</small><b>${esc(bd ? personOf(o.ev) : o.ev.title)}</b><span>${detail}</span><div class="nt-act"><button data-n="open">Ouvrir</button>${bd ? '' : '<button data-n="snooze">Dans 10 min</button>'}</div></div><button class="icon-btn flat sm" data-n="close" aria-label="Fermer">${svg('x')}</button>`;
  const bye = () => { n.classList.add('out'); setTimeout(() => n.remove(), 250); };
  n.addEventListener('click', e => {
    const b = e.target.closest('[data-n]'); if (!b) return;
    bye();
    if (b.dataset.n === 'open') revealOcc(o.ev.id, o.occKey);
    if (b.dataset.n === 'snooze') { setTimeout(() => showNotif(o), 10 * 60e3); toast('Rappel reporté de 10 minutes'); }
  });
  box.prepend(n);
  [...box.children].slice(3).forEach(x => x.remove());
}   // la carte reste jusqu'à ce qu'on la ferme : un rappel ne se rate pas parce qu'on regardait ailleurs
function checkReminders() {
  if (!PREFS.notif) return;
  const now = Date.now();
  occurrences(addDays(TODAY, -1), addDays(TODAY, 9)).forEach(o => {
    const ats = [[remindAt(o), '']];
    if (o.ev.fav && isBday(o.ev) && o.ev.rem !== '360') ats.push([new Date(o.start.getTime() - 360 * 60e3), '+veille']);   // favori : la veille aussi
    ats.forEach(([at, sfx]) => {
      const k = `${o.ev.id}@${o.occKey}${sfx}`;
      if (!at || SHOWN.has(k) || at.getTime() > now || at.getTime() < LOADED_AT - MISSED || o.end.getTime() < now) return;
      remSeen(k); showNotif(o);
    });
  });
}
setInterval(checkReminders, 15e3); setTimeout(checkReminders, 1500);
/* ===================== Aide clavier ===================== */
function openHelp() { closePopover(); closeQuick(); showModal('kb-scrim'); setTimeout(() => $('kb-scrim').querySelector('[data-close]').focus(), 30); }
function closeHelp() { if (!$('kb-scrim').hidden) hideModal('kb-scrim'); }

/* ===================== Événements globaux ===================== */
function newEvent() { document.body.classList.remove('side-on'); if (UI.view === 'birthdays') openBday(null); else if (UI.view === 'due') { setTimeout(() => $('du-q')?.focus(), 0); } else openEditor({ mode: 'create', nl: true }); }   // le « + » suit la page
document.addEventListener('click', e => {
  const n = e.target.closest('[data-nav]'); if (n) { nav(n.dataset.nav); return; }
  const hr = e.target.closest('[data-hr]'); if (hr) { scrollHours(+hr.dataset.hr); return; }
  const v = e.target.closest('.seg [data-view], .plan-btn'); if (v) { setView(v.dataset.view); return; }
  const t = e.target.closest('[data-theme-set]'); if (t) { setTheme(t.dataset.themeSet, true); popIn(t.querySelector('.ic'), 'spin-in'); return; }
  if (e.target.closest('[data-nl-help]')) { openNLHelp(); return; }
  const c = e.target.closest('[data-close]'); if (c) { ({ ed: closeEditor, ce: closeCalEditor, bd: closeBday, kb: closeHelp, set: closeSettings, nlh: closeNLHelp, imp: closeImport })[c.dataset.close]?.(); return; }
  const dn = e.target.closest('.dh-num'); if (dn) { const th = dn.closest('[data-date]'); if (th && cal.view.type !== 'timeGridDay') goDay(parse(th.dataset.date)); return; }
  if (e.target.closest('[data-add-bday]')) { document.body.classList.remove('side-on'); openBday(null); return; }
  const a = e.target.closest('[data-act]'); if (!a) return;
  const act = a.dataset.act;
  if (act === 'new') newEvent();
  else if (act === 'new-cal') openCalEditor(null);
  else if (act === 'import') { document.body.classList.remove('side-on'); $('ics-file').click(); }
  else if (act === 'open-side') document.body.classList.add('side-on');
  else if (act === 'close-side' || act === 'close-drawers') document.body.classList.remove('side-on');
  else if (act === 'bdays') toggleBdays();
  else if (act === 'back-cal') backToCal();
  else if (act === 'logout') serverLogout();
  else if (act === 'search') openSearch();
  else if (act === 'help') { document.body.classList.remove('side-on'); closeSettings(); openHelp(); }
  else if (act === 'memories') toggleMem();
  else if (act === 'due') toggleDue();
  else if (act === 'settings') { document.body.classList.remove('side-on'); openSettings(); }
});
const SCRIM_CLOSE = { 'ed-scrim': () => edLeave(), 'ce-scrim': () => closeCalEditor(), 'bd-scrim': () => closeBday(), 'sr-scrim': () => closeSearch(), 'kb-scrim': () => closeHelp(), 'set-scrim': () => closeSettings(), 'nlh-scrim': () => closeNLHelp(), 'imp-scrim': () => closeImport() };
Object.entries(SCRIM_CLOSE).forEach(([id, fn]) => $(id).addEventListener('pointerdown', e => { if (e.target.id === id) fn(); }));

/* Clavier : Échap, piège à focus dans les fenêtres, raccourcis */
document.addEventListener('keydown', e => {
  const open = [...document.querySelectorAll('.scrim')].filter(s => !s.hidden);
  if (e.key === 'Tab' && pickEl?.contains(document.activeElement)) return;   // la liste des cours est hors de la fenêtre
  if (e.key === 'Tab' && open.length) {
    const top = open.find(s => s.id === 'sc-scrim') || open[open.length - 1];
    const f = [...top.querySelectorAll('button, input, select, textarea')].filter(x => !x.disabled && x.offsetParent !== null && !x.closest('[hidden]'));
    if (!f.length) return;
    const i = f.indexOf(document.activeElement);
    if (e.shiftKey && i <= 0) { e.preventDefault(); f[f.length - 1].focus(); }
    else if (!e.shiftKey && (i === f.length - 1 || i < 0)) { e.preventDefault(); f[0].focus(); }
    return;
  }
  if (e.key === 'Escape') {
    if (!$('sc-scrim').hidden) { $('sc-scrim')._esc?.(); return; }
    if (pickEl) { closePicker(); $('du-q')?.focus(); return; }
    for (const id of ['nlh-scrim', 'imp-scrim', 'sr-scrim', 'kb-scrim', 'set-scrim', 'bd-scrim', 'ce-scrim', 'ed-scrim']) if (!$(id).hidden) { SCRIM_CLOSE[id](); return; }
    if (qcEl) { closeQuick(); return; }
    if (popEl) { const r = UI.selectedEl; closePopover(); r?.focus?.(); return; }
    if (document.body.classList.contains('side-on')) { document.body.classList.remove('side-on'); return; }
    if (isSidePage(UI.view) && !e.target.closest?.('input, textarea, select')) backToCal();
    return;
  }
  if (!$('login').hidden) return;
  const tf = e.target.closest?.('input, textarea, select, [contenteditable="true"]'), typing = tf && tf.offsetParent !== null;
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); if ($('sr-scrim').hidden) openSearch(); return; }
  if ((e.ctrlKey || e.metaKey) && !e.shiftKey && e.key.toLowerCase() === 'z' && !typing && !open.length) { e.preventDefault(); undoLast(); return; }
  if ((e.ctrlKey || e.metaKey) && (e.key.toLowerCase() === 'y' || (e.shiftKey && e.key.toLowerCase() === 'z')) && !typing && !open.length) { e.preventDefault(); redoLast(); return; }   // Ctrl Y ou Ctrl Maj Z
  if (typing || open.length || e.ctrlKey || e.metaKey || e.altKey || qcEl) return;
  if (e.target.closest('#mini')) return;
  if ((e.key === 'Delete' || e.key === 'Backspace') && UI.sel && !isSub(getEv(UI.sel.evId))) { e.preventDefault(); const { evId, occKey } = UI.sel; closePopover(); deleteFlow(evId, occKey); return; }
  const k = e.key.toLowerCase();
  const map = { t: () => nav('today'), arrowleft: () => nav('prev'), arrowright: () => nav('next'), arrowup: () => scrollHours(-1), arrowdown: () => scrollHours(1), j: () => setView('day'), s: () => setView('week'), m: () => setView('month'), a: () => setView('year'), l: () => setView('upcoming'), b: toggleBdays, o: toggleMem, e: toggleDue, n: newEvent, '/': openSearch, '?': openHelp, ',': openSettings };
  if (!map[k]) return;
  e.preventDefault(); map[k]();
});

/* Téléphone : balayer la feuille pour changer de période */
(() => {
  let x0 = null, y0 = 0, t0 = 0;
  const sheet = document.querySelector('.sheet');
  sheet.addEventListener('touchstart', e => {
    if (e.touches.length !== 1 || e.target.closest('.fc-event, input, textarea, .bl-tools, .fc-daygrid-more-link')) { x0 = null; return; }
    x0 = e.touches[0].clientX; y0 = e.touches[0].clientY; t0 = Date.now();
  }, { passive: true });
  sheet.addEventListener('touchend', e => {
    if (x0 == null || UI.view === 'birthdays' || qcEl) { x0 = null; return; }
    const t = e.changedTouches[0], dx = t.clientX - x0, dy = t.clientY - y0; x0 = null;
    if (Date.now() - t0 < 600 && Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.8) nav(dx < 0 ? 'next' : 'prev');
  }, { passive: true });
})();

/* ===================== Horloge =====================
   Un onglet reste ouvert des jours : chaque minute, « en cours » suit l'heure ; à minuit, tout passe au lendemain
   (logo, surlignage du jour, mini-calendrier, comptes à rebours, pages). Au retour sur l'onglet aussi. */
function markNow(el) {
  const t = Date.now(), on = el => el._t && el._t[0] <= t && el._t[1] > t;
  (el ? [el] : document.querySelectorAll('#cal .fc-event')).forEach(x => x.classList.toggle('is-now', !!on(x)));
}
function paintLogo() {
  document.querySelectorAll('.mark span, .tb-s').forEach(el => el.textContent = TODAY.getDate());   // le logo affiche la date du jour
  document.querySelectorAll('.mark-m').forEach(el => el.textContent = fMs.format(TODAY).replace('.', ''));
}
function tick() {
  const was = TODAY, now = new Date();
  if (key(now) === key(was)) { markNow(); return; }
  TODAY = sod(now);
  /* Ce qui montrait « aujourd'hui » suit le nouveau jour ; une période choisie à la main ne bouge pas */
  const v = cal.view, inView = d => d >= v.activeStart && d < v.activeEnd;
  if (inView(was) && !inView(TODAY)) cal.today();   // (même derrière une page : on la retrouve à jour en revenant)
  if (key(UI.upStart) === key(was)) UI.upStart = new Date(TODAY);
  if (UI.memDay && key(UI.memDay) === key(was)) UI.memDay = new Date(TODAY);
  if (UI.year === was.getFullYear()) UI.year = TODAY.getFullYear();
  if (UI.miniMonth.getFullYear() === was.getFullYear() && UI.miniMonth.getMonth() === was.getMonth()) UI.miniMonth = new Date(TODAY.getFullYear(), TODAY.getMonth(), 1);
  paintLogo();
  cal.setOption('nowIndicator', false); cal.setOption('nowIndicator', true);   // FullCalendar redessine alors en-têtes et « aujourd'hui »
  refreshData('all'); updateTitle();
}
setInterval(tick, 20e3);
document.addEventListener('visibilitychange', () => { if (!document.hidden) tick(); });
addEventListener('focus', tick);

/* ===================== Démarrage ===================== */
cal.render();
paintLogo();
renderCalList(); updateMemBadge(); updateSideBdays(); updateSideDue();
{ const v0 = savedView(); if (v0 !== 'week') { UI.quiet = true; setViewCore(v0); UI.quiet = false; } }
updateTitle(); renderMini();
updateSegThumbs();
if (document.fonts) document.fonts.ready.then(updateSegThumbs);
