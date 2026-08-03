/* ToyTools service worker.
 *
 * Two jobs:
 *   1. Offline caching — so installed tools keep working with no network.
 *      Strategy is NETWORK-FIRST for same-origin GETs: prefer the live response
 *      (and refresh the cache with it), fall back to cache only when the network
 *      fails. Navigations are fetched with cache:'no-store' so the browser's
 *      HTTP cache can never serve a stale page — a freshly deployed page shows up
 *      on the very next load. Hashed assets keep the normal (cacheable) request.
 *   2. Notification clicks — focus/open the right tab (used by the Pomodoro
 *      timer's break/finish notifications).
 *
 * It calls clients.claim() on activate so it CONTROLS the current page right
 * away. That control is what makes Chrome consider the site installable and fire
 * beforeinstallprompt — without it, a fresh visit (every incognito session) has
 * no controlling worker and the native install prompt never appears. Registration
 * is skipped under automation, so test runs never register a claiming worker.
 * Bump CACHE whenever the caching behaviour changes so activate() purges the old
 * store. Everything is wrapped so a failure can never surface an error to the page.
 */

var CACHE = 'toytools-cache-v3';

// Runtime cache ceiling. Every successful same-origin GET is cached, which over time means the
// whole site plus every asset. Trimming oldest-first keeps that bounded; the Cache API preserves
// insertion order, so the first keys are the least recently added.
var MAX_ENTRIES = 150;

self.addEventListener('install', function (event) {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE).then(function (cache) {
      // '/offline/' is the navigation fallback and must be present before it is ever needed.
      return cache.addAll(['/', '/offline/']).catch(function () { /* offline at install — fine */ });
    })
  );
});

self.addEventListener('activate', function (event) {
  // Drop stale caches, then take control of open pages so this visit is
  // controlled (required for Chrome's install prompt) instead of only the next.
  event.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(
        keys.map(function (key) {
          return key !== CACHE ? caches.delete(key) : Promise.resolve();
        })
      );
    }).then(function () {
      return self.clients.claim();
    })
  );
});

function isCacheable(response) {
  return response && response.status === 200 && response.type === 'basic'; // same-origin, non-opaque
}

// Keep the runtime cache from growing without limit. Never trims the two precached entries.
function trim(cache) {
  return cache.keys().then(function (keys) {
    if (keys.length <= MAX_ENTRIES) return;
    var excess = keys.length - MAX_ENTRIES;
    var kills = [];
    for (var i = 0; i < keys.length && kills.length < excess; i++) {
      var path = new URL(keys[i].url).pathname;
      if (path === '/' || path === '/offline/') continue;
      kills.push(cache.delete(keys[i]));
    }
    return Promise.all(kills);
  }).catch(function () {});
}

self.addEventListener('fetch', function (event) {
  var request = event.request;

  // Only same-origin GETs. Everything else (POST, cross-origin analytics/CDN,
  // non-http) goes straight to the network untouched.
  if (request.method !== 'GET') return;
  var url;
  try { url = new URL(request.url); } catch (e) { return; }
  if (url.origin !== self.location.origin) return;
  if (url.protocol !== 'http:' && url.protocol !== 'https:') return;

  var isNav = request.mode === 'navigate';
  // Navigations bypass the HTTP cache so a new deploy is always visible; hashed
  // assets are immutable, so the normal (cache-friendly) request is fine.
  var networkReq = isNav
    ? new Request(url.href, { cache: 'no-store', credentials: 'same-origin', redirect: 'follow' })
    : request;

  event.respondWith(
    fetch(networkReq)
      .then(function (response) {
        if (isCacheable(response)) {
          var copy = response.clone();
          caches.open(CACHE).then(function (cache) {
            cache.put(request, copy).then(function () { return trim(cache); }).catch(function () {});
          }).catch(function () {});
        }
        return response;
      })
      .catch(function () {
        // Offline: serve the cached copy, then the cached root for navigations.
        return caches.match(request).then(function (cached) {
          if (cached) return cached;
          // Falling back to '/' made a failed tool navigation look like the tool had moved.
          // The offline page says what actually happened and lists what still opens.
          if (isNav) {
            return caches.match('/offline/').then(function (page) {
              return page || caches.match('/').then(function (root) { return root || Response.error(); });
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
