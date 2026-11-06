const CACHE_NAME = 'v1_cache_notas_pwa';
const ASSETS_TO_CACHE = [
'./',
'./index.html',
'./manifest.json'
];

// Evento de instalación: Guarda la interfaz en la memoria interna del teléfono
self.addEventListener('install', (e) => {
e.waitUntil(
caches.open(CACHE_NAME).then((cache) => {
console.log('Archivos guardados en caché local');
return cache.addAll(ASSETS_TO_CACHE);
}).then(() => self.skipWaiting())
);
});

// Evento de activación: Elimina versiones viejas si editas tu app en el futuro
self.addEventListener('activate', (e) => {
e.waitUntil(
caches.keys().then((cacheNames) => {
return Promise.all(
cacheNames.map((cache) => {
if (cache !== CACHE_NAME) {
console.log('Borrando caché antigua:', cache);
return caches.delete(cache);
}
})
);
}).then(() => self.clients.claim())
);
});

// Evento fetch: Abre la app instantáneamente incluso si estás en Modo Avión
self.addEventListener('fetch', (e) => {
e.respondWith(
caches.match(e.request).then((res) => {
return res || fetch(e.request);
}).catch(() => caches.match('./index.html'))
);
});
