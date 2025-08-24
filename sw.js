const CACHE = 'tg-static-v4';
const CDN_CACHE = 'tg-cdn-v1';
const ASSETS = [
  '.',
  './index.html',
  './styles.css',
  './script.js',
  './manifest.webmanifest',
  './icon.svg',
];
const CDN_HOSTS = ['cdn.jsdelivr.net', 'fonts.googleapis.com', 'fonts.gstatic.com'];

self.addEventListener('install', (e)=>{
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)));
});
self.addEventListener('activate', (e)=>{
  e.waitUntil(
    caches.keys().then(keys=>Promise.all(keys.map(k=> (k!==CACHE && k!==CDN_CACHE) ? caches.delete(k) : Promise.resolve())))
  );
  self.clients.claim();
});
self.addEventListener('fetch', (e)=>{
  const url = new URL(e.request.url);
  // Network-first for same-origin to always show latest on phones
  if(url.origin === location.origin && e.request.method === 'GET'){
    e.respondWith((async()=>{
      try{
        const res = await fetch(e.request, {cache:'no-store'});
        const copy = res.clone();
        const cache = await caches.open(CACHE);
        cache.put(e.request, copy);
        return res;
      }catch(err){
        const cached = await caches.match(e.request);
        return cached || caches.match('/index.html');
      }
    })());
  } else if (CDN_HOSTS.includes(url.hostname)) {
    e.respondWith((async()=>{
      const cache = await caches.open(CDN_CACHE);
      const cached = await cache.match(e.request);
      try{
        const res = await fetch(e.request, { mode: 'cors' });
        cache.put(e.request, res.clone());
        return res;
      }catch(err){
        return cached || new Response('', {status: 504, statusText: 'Offline'});
      }
    })());
  }
});

// Allow page to trigger skipWaiting
self.addEventListener('message', (e)=>{
  if(e.data && e.data.type === 'SKIP_WAITING'){
    self.skipWaiting();
  }
  if(e.data && e.data.type === 'CLEAR_ALL_CACHES'){
    caches.keys().then(keys=> keys.forEach(k=> caches.delete(k)));
  }
});
