const CACHE_NAME = 'urban-harvest-v1';
const urlsToCache = ['/', '/index.html'];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((names) =>
      Promise.all(names.filter((n) => n !== CACHE_NAME).map((n) => caches.delete(n)))
    ).then(() => self.clients.claim())
  );
});

// Stale-while-revalidate: return cached response if available, revalidate in background; offline fallback
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  if (event.request.mode !== 'navigate' && !url.origin.startsWith(self.location.origin)) return;
  const isSameOriginGet = url.origin === self.location.origin && event.request.method === 'GET';

  if (isSameOriginGet) {
    event.respondWith(
      caches.match(event.request).then((cached) => {
        const fetchAndCache = () =>
          fetch(event.request).then((res) => {
            if (res.ok) {
              const clone = res.clone();
              caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
            }
            return res;
          });
        if (cached) {
          fetchAndCache();
          return cached;
        }
        return fetchAndCache().catch(() =>
          caches.match(event.request).then((r) => r || (event.request.mode === 'navigate' ? caches.match('/index.html') : null))
        );
      })
    );
  } else {
    event.respondWith(
      fetch(event.request)
        .then((res) => {
          if (res.ok && event.request.method === 'GET' && url.origin === self.location.origin) {
            const clone = res.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          }
          return res;
        })
        .catch(() => caches.match(event.request).then((r) => r || (event.request.mode === 'navigate' ? caches.match('/index.html') : null)))
    );
  }
});

self.addEventListener('push', (event) => {
  const data = event.data ? event.data.json() : { title: 'Urban Harvest Hub', body: 'New update available.' };
  event.waitUntil(
    self.registration.showNotification(data.title || 'Urban Harvest Hub', {
      body: data.body || 'Check out the latest updates.',
      icon: '/vite.svg',
      badge: '/vite.svg',
      tag: 'urban-harvest-notification',
      requireInteraction: false,
    })
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(self.clients.openWindow('/'));
});
