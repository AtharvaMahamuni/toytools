/* ToyTools service worker.
 *
 * Two jobs:
 *   1. Offline caching — so installed tools keep working with no network. The
 *      strategy is NETWORK-FIRST for same-origin GETs: always prefer the live
 *      response (and refresh the cache with it), fall back to cache only when
 *      the network fails. That means an online session never sees stale content
 *      — important for tests and for freshly deployed pages alike.
 *   2. Notification clicks — focus/open the right tab (used by the Pomodoro
 *      timer's break/finish notifications).
 *
 * Deliberately conservative: it does NOT call clients.claim(), so it only
 * controls pages loaded after it activates (standard PWA behaviour, and it
 * keeps automated test runs — which register but never re-navigate — untouched).
 * Everything is wrapped so a failure can never surface an error to the page.
 */

var CACHE = 'toytools-cache-v1';

self.addEventListener('install', function (event) {
  // Activate the new worker as soon as it finishes installing.
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE).then(function (cache) {
      // Warm the cache with the site root so a cold offline launch has a shell.
      return cache.addAll(['/']).catch(function () { /* offline at install — fine */ });
    })
  );
});

self.addEventListener('activate', function (event) {
  event.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(
        keys.map(function (key) {
          if (key !== CACHE) return caches.delete(key);
          return Promise.resolve();
        })
      );
    })
  );
});

function isCacheable(request, response) {
  return (
    response &&
    response.status === 200 &&
    response.type === 'basic' // same-origin, non-opaque
  );
}

self.addEventListener('fetch', function (event) {
  var request = event.request;

  // Only same-origin GET navigations/assets. Everything else (POST, cross-origin
  // analytics/CDN, non-http) goes straight to the network untouched.
  if (request.method !== 'GET') return;
  var url;
  try { url = new URL(request.url); } catch (e) { return; }
  if (url.origin !== self.location.origin) return;
  if (url.protocol !== 'http:' && url.protocol !== 'https:') return;

  event.respondWith(
    fetch(request)
      .then(function (response) {
        if (isCacheable(request, response)) {
          var copy = response.clone();
          caches.open(CACHE).then(function (cache) {
            cache.put(request, copy).catch(function () {});
          }).catch(function () {});
        }
        return response;
      })
      .catch(function () {
        // Offline: serve the cached copy, then the cached root as a last resort.
        return caches.match(request).then(function (cached) {
          if (cached) return cached;
          if (request.mode === 'navigate') {
            return caches.match('/').then(function (root) {
              return root || Response.error();
            });
          }
          return Response.error();
        });
      })
  );
});

self.addEventListener('notificationclick', function (event) {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function (list) {
      for (var i = 0; i < list.length; i++) {
        var c = list[i];
        if (c.url.includes('pomodoro-timer') && 'focus' in c) return c.focus();
      }
      var target = (event.notification.data && event.notification.data.url) || '/';
      return clients.openWindow(target);
    })
  );
});
