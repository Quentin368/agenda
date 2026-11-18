/* Service worker de l'agenda (application installable).
   Il ne garde que l'INTERFACE (HTML, CSS, JS, polices, bibliothèques, icônes) pour que l'appli s'ouvre même sans
   réseau. Il ne touche JAMAIS à /api : tes données personnelles ne sont jamais mises en cache sur le téléphone.
   Réseau d'abord : en ligne, chaque fichier vient du Pi (une nouvelle version déployée est prise au rechargement)
   et sa copie est rafraîchie ; hors ligne seulement, la copie sert. */
const CACHE = 'agenda-interface-v1';
const SHELL = [
  '/', 'index.html', 'app.css', 'app.js', 'sync.js', 'manifest.webmanifest',
  'fonts/fonts.css', 'fonts/bricolage-grotesque-latin.woff2', 'fonts/bricolage-grotesque-latin-ext.woff2',
  'fonts/bricolage-grotesque-vietnamese.woff2', 'fonts/figtree-latin.woff2', 'fonts/figtree-latin-ext.woff2',
  'vendor/fullcalendar/index.global.min.js', 'vendor/fullcalendar/fr.global.min.js',
  'favicon.svg', 'favicon.ico', 'favicon-32.png', 'icons/icon-192.png', 'icons/icon-512.png'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL.map(u => new Request(u, { cache: 'reload' })))).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});

const isShell = url => url.origin === self.location.origin && !url.pathname.startsWith('/api/') && url.pathname !== '/healthz';

self.addEventListener('fetch', e => {
  const req = e.request, url = new URL(req.url);
  if (req.method !== 'GET' || !isShell(url)) return;                 // /api, écritures, autres sites : jamais touchés
  e.respondWith((async () => {
    try {
      const fresh = await fetch(req, { cache: 'no-cache' });
      if (fresh.ok && fresh.type === 'basic') {
        const copy = fresh.clone();
        caches.open(CACHE).then(c => c.put(req.mode === 'navigate' ? '/' : req, copy));
      }
      return fresh;
    } catch (err) {                                                    // hors connexion : la copie de l'interface
      const c = await caches.open(CACHE);
      const hit = await c.match(req.mode === 'navigate' ? '/' : req, { ignoreSearch: true });
      if (hit) return hit;
      throw err;
    }
  })());
});
