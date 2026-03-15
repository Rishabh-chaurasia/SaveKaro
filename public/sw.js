/* DealKaro Service Worker — PWA offline support */
const CACHE = "dealkaro-v1";
const ASSETS = ["/", "/index.html", "/static/js/main.chunk.js", "/static/css/main.chunk.css"];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))));
  self.clients.claim();
});

self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  e.respondWith(
    caches.match(e.request).then(cached => {
      const network = fetch(e.request).then(res => {
        if (res.ok) caches.open(CACHE).then(c => c.put(e.request, res.clone()));
        return res;
      });
      return cached || network;
    })
  );
});

/* Push notifications support */
self.addEventListener("push", e => {
  const data = e.data?.json() || { title: "DealKaro", body: "New deal alert! 🔥" };
  e.waitUntil(self.registration.showNotification(data.title, {
    body: data.body, icon: "/logo192.png", badge: "/logo192.png",
    data: { url: data.url || "/" },
    actions: [{ action: "view", title: "View Deal" }, { action: "close", title: "Dismiss" }]
  }));
});

self.addEventListener("notificationclick", e => {
  e.notification.close();
  if (e.action === "view") e.waitUntil(clients.openWindow(e.notification.data.url));
});