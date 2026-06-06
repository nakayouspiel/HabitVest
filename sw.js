const CACHE_NAME = 'habitvest-v11';
const ASSETS = [
  '/',
  'index.html',
  'manifest.json',
  'icon-192.png',
  'icon-512.png'
];

// インストール時にリソースをキャッシュ
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    }).then(() => self.skipWaiting())
  );
});

// アクティベート時に古いキャッシュをクリーンアップ
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// ローカルホスト開発時はキャッシュをバイパスし、通常はキャッシュファースト
self.addEventListener('fetch', (e) => {
  const isLocal = e.request.url.includes('localhost') || e.request.url.includes('127.0.0.1') || e.request.url.startsWith('file:///');
  
  if (isLocal) {
    e.respondWith(
      fetch(e.request).catch(() => caches.match(e.request))
    );
    return;
  }

  e.respondWith(
    caches.match(e.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(e.request).then((response) => {
        return response;
      });
    })
  );
});

