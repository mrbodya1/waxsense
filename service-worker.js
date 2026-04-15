// WaxSense Service Worker
const CACHE_NAME = 'waxsense-v1';
const urlsToCache = [
  '/ski-wax-crowd/',
  '/ski-wax-crowd/index.html',
  '/ski-wax-crowd/auth.html',
  '/ski-wax-crowd/report.html',
  '/ski-wax-crowd/find.html',
  '/ski-wax-crowd/profile.html',
  '/ski-wax-crowd/admin.html',
  '/ski-wax-crowd/manifest.json'
];

// Установка Service Worker
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
      .then(() => self.skipWaiting())
  );
});

// Активация и очистка старых кэшей
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.filter(cacheName => cacheName !== CACHE_NAME)
          .map(cacheName => caches.delete(cacheName))
      );
    }).then(() => self.clients.claim())
  );
});

// Перехват запросов (сначала кэш, потом сеть)
self.addEventListener('fetch', event => {
  // Не кэшируем API-запросы к Supabase
  if (event.request.url.includes('supabase.co')) {
    return;
  }
  
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});
