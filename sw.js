const CACHE_NAME = 'kivo-notes-v2'; // Nome atualizado
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  'https://fonts.googleapis.com/css2?family=Caveat:wght@700&family=Patrick+Hand&display=swap'
];

// Instala e salva os arquivos no celular
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(ASSETS);
    })
  );
  // Força o Service Worker a assumir o controle imediatamente
  self.skipWaiting(); 
});

// Ativa e APAGA os caches antigos (Isso resolve o problema de o celular não atualizar)
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Apagando cache antigo:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Entrega os arquivos salvos se o usuário estiver offline
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});