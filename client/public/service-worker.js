const CACHE_VERSION = "v10";
const CACHE_NAME = `animal-quiz-${CACHE_VERSION}`;

// Core app shell files that should always be cached
const coreFilesToCache = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./favicon.ico",
  "./packs-config.json",
  "./images/placeholder.png",
];

// Install event - cache core resources
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("[SW] Caching app shell");
      return cache.addAll(coreFilesToCache);
    })
  );
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log("[SW] Removing old cache:", cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Helper to check if URL is a pack or media file
function shouldCacheResource(url) {
  const pathname = new URL(url).pathname;
  
  // Always cache pack JSON files
  if (pathname.includes("/packs/") && pathname.endsWith(".json")) {
    return true;
  }
  
  // Always cache media files (images, videos, sounds)
  if (pathname.includes("/media/")) {
    return true;
  }
  
  // Cache the config file
  if (pathname.endsWith("packs-config.json")) {
    return true;
  }
  
  return false;
}

// Fetch event - network first for packs/media, cache first for app shell
self.addEventListener("fetch", (event) => {
  // Skip cross-origin requests
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }

  const url = new URL(event.request.url);
  
  // For pack and media files: try network first, fall back to cache
  if (shouldCacheResource(event.request.url)) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          if (!response || response.status !== 200) {
            // Network failed, try cache
            return caches.match(event.request).then((cached) => {
              return cached || response;
            });
          }
          
          // Cache the fresh response
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
          
          return response;
        })
        .catch(() => {
          // Network error, serve from cache
          return caches.match(event.request).then((cached) => {
            if (cached) return cached;
            
            // Return placeholder for images
            if (event.request.destination === "image") {
              const placeholderUrl = new URL("./images/placeholder.png", self.registration.scope).toString();
              return caches.match(placeholderUrl);
            }
            
            return new Response("Resource not available offline", { status: 503 });
          });
        })
    );
    return;
  }

  // For app shell: cache first, network fallback
  event.respondWith(
    caches.match(event.request).then((response) => {
      if (response) {
        return response;
      }

      return fetch(event.request)
        .then((response) => {
          if (!response || response.status !== 200) {
            return response;
          }

          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });

          return response;
        })
        .catch((error) => {
          console.log("[SW] Fetch failed for:", event.request.url);
          if (event.request.destination === "image") {
            const placeholderUrl = new URL("./images/placeholder.png", self.registration.scope).toString();
            return caches.match(placeholderUrl);
          }
          throw error;
        });
    })
  );
});

// Listen for skip waiting message
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});
