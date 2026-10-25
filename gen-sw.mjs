import fs from 'fs';
const sw = `
self.addEventListener('install', (e) => {
  self.skipWaiting();
});
self.addEventListener('activate', (e) => {
  e.waitUntil(self.clients.claim());
});
self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  e.respondWith(
    caches.open('bizim-v3').then(async (cache) => {
      try {
        const res = await fetch(req);
        if (res.ok && req.url.startsWith(self.location.origin)) cache.put(req, res.clone());
        return res;
      } catch {
        const cached = await cache.match(req);
        if (cached) return cached;
        const root = await cache.match('/');
        if (root) return root;
        return new Response('Çevrimdışı', { status: 503 });
      }
    })
  );
});
`;
fs.writeFileSync('/root/bizim-app/public/sw.js', sw);
console.log('ok');
