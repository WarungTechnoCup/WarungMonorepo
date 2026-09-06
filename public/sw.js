/*
 * Warung Cek Harga service worker.
 *
 * Privacy rule: only public, aggregate responses are ever stored. Anything
 * tied to one warung (reports, commitments, receipts, session, Passport) is
 * passed straight through to the network and never written to a cache.
 */

const VERSION = "v1";
const SHELL_CACHE = `shell-${VERSION}`;
const DATA_CACHE = `public-data-${VERSION}`;
const OFFLINE_URL = "/offline";

const SHELL_ASSETS = [
  "/",
  "/cek-harga",
  "/kulakan-bareng",
  "/cara-kerja",
  "/privasi",
  OFFLINE_URL,
  "/icon.svg",
];

// Public aggregate endpoints. Everything else under /api stays uncached.
const CACHEABLE_API = [
  "/api/products",
  "/api/benchmarks",
  "/api/buying-opportunities",
];

// Routes that render data belonging to one signed-in user.
const PRIVATE_ROUTES = [
  "/aktivitas",
  "/passport",
  "/admin",
  "/lapor-harga",
  "/masuk",
];

function isPrivateRoute(pathname) {
  return PRIVATE_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );
}

function isCacheableApi(pathname) {
  return CACHEABLE_API.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );
}

function stamp(response) {
  const headers = new Headers(response.headers);
  headers.set("x-cached-at", new Date().toISOString());
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(SHELL_CACHE)
      .then((cache) => cache.addAll(SHELL_ASSETS))
      .catch(() => undefined),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(
        keys
          .filter((key) => key !== SHELL_CACHE && key !== DATA_CACHE)
          .map((key) => caches.delete(key)),
      );
      await self.clients.claim();
    })(),
  );
});

self.addEventListener("message", (event) => {
  if (event.data === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

self.addEventListener("fetch", (event) => {
  const { request } = event;

  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  // Navigations: network first, then cached shell, then the offline page.
  if (request.mode === "navigate") {
    event.respondWith(
      (async () => {
        try {
          const fresh = await fetch(request);
          if (!isPrivateRoute(url.pathname)) {
            const cache = await caches.open(SHELL_CACHE);
            cache.put(request, fresh.clone());
          }
          return fresh;
        } catch {
          if (!isPrivateRoute(url.pathname)) {
            const cached = await caches.match(request);
            if (cached) return cached;
          }
          const offline = await caches.match(OFFLINE_URL);
          return offline ?? Response.error();
        }
      })(),
    );
    return;
  }

  // Build output is content hashed, so it is safe to serve cache first.
  if (url.pathname.startsWith("/_next/static/")) {
    event.respondWith(
      (async () => {
        const cached = await caches.match(request);
        if (cached) return cached;
        const fresh = await fetch(request);
        const cache = await caches.open(SHELL_CACHE);
        cache.put(request, fresh.clone());
        return fresh;
      })(),
    );
    return;
  }

  // Public aggregates: serve cached copy immediately, refresh in background.
  if (isCacheableApi(url.pathname)) {
    event.respondWith(
      (async () => {
        const cache = await caches.open(DATA_CACHE);
        const cached = await cache.match(request);

        const network = fetch(request)
          .then((fresh) => {
            if (fresh.ok) cache.put(request, stamp(fresh.clone()));
            return fresh;
          })
          .catch(() => undefined);

        if (cached) {
          void network;
          return cached;
        }

        const fresh = await network;
        if (fresh) return fresh;

        return new Response(
          JSON.stringify({
            code: "OFFLINE",
            message: "Data tidak tersedia saat offline.",
          }),
          { status: 503, headers: { "Content-Type": "application/json" } },
        );
      })(),
    );
  }
});
