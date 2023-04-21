// Establish a cache name
const CACHE_PREFIX = 'sw-cache';
const CACHE_VERSION = '1.0.1';
const CACHE_NAME = CACHE_PREFIX + '-' + CACHE_VERSION;
const CACHE_TYPES = {
  cache_only: 1,
  network_only: 2,
  cache_first: 3,
  network_first: 4,
  stale_while_revalidate: 5
};
const getCacheType = request => {
  if (
    /(\.woff2|\.ttf|\.woff)(\?+|$)/gi.test(request.url)
  ) {
    // return CACHE_TYPES.cache_first;
    return CACHE_TYPES.stale_while_revalidate;
  } else if (
    /^((?!api).)*\/admin\/(?!api)[^?]*$/g.test(request.url)
  ) {
    return CACHE_TYPES.stale_while_revalidate;
  } else if (request.url.indexOf('/api/i18n?app=') > -1) {
    return CACHE_TYPES.network_first;
  }
  return CACHE_TYPES.network_only;
};

const deleteOldCaches = () => {
  return caches.keys().then(function(keys) {
    const all = keys.map(function(key) {
      if (key.indexOf(CACHE_PREFIX) !== -1 && key.indexOf(CACHE_VERSION) === -1) {
        console.log('[SW]: Delete cache:' + key);
        return caches.delete(key);
      }
    });
    return Promise.all(all);
  });
};

// Clear cache
self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches
      .keys()
      .then(deleteOldCaches)
      .then(function() {
        return self.clients.claim();
      })
  );
});

// Prefetch
// self.addEventListener('install', event => {
//   self.skipWaiting();
//   event.waitUntil(
//     caches.open(CACHE_NAME).then(function(cache) {
//       return cache.addAll(/*MANIFEST*/);
//     })
//   );
// });

// Runtime cache
self.addEventListener('fetch', event => {
//   const CACHES = caches.open(CACHE_NAME);
//   // Check if this is a request for an hash js
//   if (event.request.method !== 'GET') return;
//   const CACHE_TYPE = getCacheType(event.request);
//   if (CACHE_TYPE === CACHE_TYPES.network_only) return;
//   if (CACHE_TYPE === CACHE_TYPES.cache_first) {
//     event.respondWith(
//       CACHES.then(cache => {
//         // Go to the cache first
//         return cache.match(event.request).then(cachedResponse => {
//           // Return a cached response if we have one
//           if (cachedResponse) {
//             return cachedResponse;
//           }
//           // Otherwise, hit the network
//           return fetch(event.request).then(fetchedResponse => {
//             // Add the network response to the cache for later visits
//             cache.put(event.request, fetchedResponse.clone());
//             // Return the network response
//             return fetchedResponse;
//           });
//         });
//       })
//     );
//   } else if (CACHE_TYPE === CACHE_TYPES.stale_while_revalidate) {
//     event.respondWith(
//       CACHES.then(cache => {
//         return cache.match(event.request).then(cachedResponse => {
//           const fetchedResponse = fetch(event.request).then(networkResponse => {
//             cache.put(event.request, networkResponse.clone());
//             return networkResponse;
//           });
//           return cachedResponse || fetchedResponse;
//         });
//       })
//     );
//   } else if (CACHE_TYPE === CACHE_TYPES.network_first) {
//     event.respondWith(
//       fetch(event.request)
//         .then(networkResponse => {
//           CACHES.then(cache => cache.put(event.request, networkResponse.clone()));
//           return networkResponse;
//         })
//         .catch(() => CACHES.then(cache => cache.match(event.request)))
//     );
//   }
});