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
        console.log('Cache inicial criado');
        return cache.addAll(urlsToCache).catch(error => {
          console.error('Erro ao cachear arquivos:', error);
        });
      })
  );
  self.skipWaiting();
});

// Evento de fetch - Estratégia Cache First
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response; // Cache hit
        }
        
        return fetch(event.request).then(fetchResponse => {
          // Não cachear respostas com erro
          if (!fetchResponse || fetchResponse.status !== 200 || fetchResponse.type !== 'basic') {
            return fetchResponse;
          }

          return caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, fetchResponse.clone());
            return fetchResponse;
          });
        }).catch(() => {
          // Retornar uma resposta offline personalizada se necessário
          return new Response('Offline - Conteúdo não disponível');
        });
      })
  );
});

// Evento de ativação - Limpeza de caches antigos
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Removendo cache antigo:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      return self.clients.claim();
    })
  );
});