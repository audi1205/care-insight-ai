const CACHE_NAME =
  "care-insight-v2";

const APP_FILES = [
  "./",
  "./index.html",
  "./style.css",
  "./mobile.css",
  "./manifest.json",
  "./icons/icon-192.png",
  "./icons/icon-512.png"
];

self.addEventListener(
  "activate",
  (event) => {
    event.waitUntil(
      caches
        .keys()
        .then((cacheNames) => {
          return Promise.all(
            cacheNames
              .filter(
                (cacheName) =>
                  cacheName !== CACHE_NAME
              )
              .map(
                (cacheName) =>
                  caches.delete(cacheName)
              )
          );
        })
        .then(() => self.clients.claim())
    );
  }
);

self.addEventListener(
  "activate",
  (event) => {
    event.waitUntil(
      self.clients.claim()
    );
  }
);

self.addEventListener(
  "fetch",
  (event) => {
    event.respondWith(
      caches
        .match(event.request)
        .then((cachedResponse) => {
          return (
            cachedResponse ||
            fetch(event.request)
          );
        })
    );
  }
);