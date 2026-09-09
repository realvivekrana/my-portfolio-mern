/*
|--------------------------------------------------------------------------
| SERVICE WORKER
|--------------------------------------------------------------------------
|
| Strategy:
|  - Navigations (HTML page loads)  -> network-first, falling back to
|    a cached copy, and finally to /offline.html when totally offline.
|  - Same-origin static assets (JS/CSS/fonts/images built by Vite)
|    -> stale-while-revalidate: serve from cache instantly, refresh
|    the cache in the background.
|  - Backend/API requests (anything under /api or a different origin,
|    e.g. Cloudinary or the Render backend) -> ALWAYS network, never
|    cached. Portfolio content must stay live/fresh; caching it would
|    show visitors stale project/blog data.
|
|--------------------------------------------------------------------------
*/

const CACHE_VERSION = 'v1';
const STATIC_CACHE = `portfolio-static-${CACHE_VERSION}`;
const PAGES_CACHE = `portfolio-pages-${CACHE_VERSION}`;

const OFFLINE_URL = '/offline.html';

const PRECACHE_URLS = [
  '/',
  OFFLINE_URL,
  '/manifest.webmanifest',
  '/apple-touch-icon.png',
  '/icon-192.png',
  '/icon-512.png',
];

/* =========================================================
   INSTALL — precache the app shell + offline fallback
========================================================= */

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(STATIC_CACHE)
      .then((cache) => cache.addAll(PRECACHE_URLS))
      .then(() => self.skipWaiting())
  );
});

/* =========================================================
   ACTIVATE — drop old cache versions
========================================================= */

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter(
              (key) =>
                key !== STATIC_CACHE && key !== PAGES_CACHE
            )
            .map((key) => caches.delete(key))
        )
      )
      .then(() => self.clients.claim())
  );
});

/* =========================================================
   HELPERS
========================================================= */

function isApiRequest(url) {
  return (
    url.pathname.startsWith('/api') ||
    url.pathname.startsWith('/uploads') ||
    url.hostname.includes('cloudinary.com') ||
    url.hostname.includes('onrender.com')
  );
}

function isNavigationRequest(request) {
  return (
    request.mode === 'navigate' ||
    (request.method === 'GET' &&
      request.headers.get('accept')?.includes('text/html'))
  );
}

/* =========================================================
   FETCH
========================================================= */

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Only handle GET; let POST/PUT/DELETE etc pass straight through.
  if (request.method !== 'GET') {
    return;
  }

  // Never intercept API / backend / third-party media requests —
  // portfolio content must always be fetched live.
  if (isApiRequest(url) || url.origin !== self.location.origin) {
    return;
  }

  // -----------------------------------------------------
  // NAVIGATIONS — network-first, cache fallback, offline page
  // -----------------------------------------------------

  if (isNavigationRequest(request)) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const responseClone = response.clone();

          caches
            .open(PAGES_CACHE)
            .then((cache) => cache.put(request, responseClone));

          return response;
        })
        .catch(async () => {
          const cachedResponse = await caches.match(request);

          return (
            cachedResponse ||
            (await caches.match(OFFLINE_URL))
          );
        })
    );

    return;
  }

  // -----------------------------------------------------
  // STATIC ASSETS — stale-while-revalidate
  // -----------------------------------------------------

  event.respondWith(
    caches.open(STATIC_CACHE).then(async (cache) => {
      const cachedResponse = await cache.match(request);

      const networkFetch = fetch(request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            cache.put(request, networkResponse.clone());
          }

          return networkResponse;
        })
        .catch(() => cachedResponse);

      return cachedResponse || networkFetch;
    })
  );
});