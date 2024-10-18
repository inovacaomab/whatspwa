const CACHE_NAME = 'whats-go-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/styles.css',
  '/script.js',
  '/iconeprincipal.jpg',
  '/qricon.jpg',
  '/icon-72x72.png',
  '/icon-96x96.png',
  '/icon-128x128.png',
  '/icon-144x144.png',
  '/icon-152x152.png',
  '/icon-192x192.png',
  '/icon-384x384.png',
  '/icon-512x512.png'
];

// Evento de instalação - Cache inicial
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Arquivos em cache durante a instalação: ', urlsToCache);
        return cache.addAll(urlsToCache);
      })
  );
});

// Evento de fetch - Servir do cache, ou fazer fetch da rede
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Retorna o recurso em cache, ou faz uma requisição à rede
        return response || fetch(event.request).then(fetchResponse => {
          return caches.open(CACHE_NAME).then(cache => {
            // Clona a resposta e armazena no cache para futuras requisições
            cache.put(event.request, fetchResponse.clone());
            return fetchResponse;
          });
        });
      })
  );
});

// Evento de ativação - Limpeza de caches antigos, se houver
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (!cacheWhitelist.includes(cacheName)) {
            // Remove caches antigos que não estão na lista atual
            console.log('Removendo cache antigo: ', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
