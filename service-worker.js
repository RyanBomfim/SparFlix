const CACHE_NAME = "sparflix-cache-v1";
const urlsToCache = [
  "/",
  "/index.html",
  "/about.html",
  "/dbz-movies.html",
  "/dbz-news.html",
  "/assets/css/style.css",
  "/assets/img/logo.png",
  "/assets/vendor/bootstrap/css/bootstrap.min.css"
  // Adicione aqui outros assets importantes
];

// Instalação: cache dos arquivos
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

// Ativação
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.map(key => {
        if (key !== CACHE_NAME) return caches.delete(key);
      }))
    )
  );
});

// Interceptação de requisições
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});
