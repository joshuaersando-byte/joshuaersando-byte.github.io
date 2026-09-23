const CACHE='rpm-2027-pages-v2';
const ASSETS=[
  './','./index.html','./manifest.webmanifest',
  './icons/icon-192.png','./icons/icon.svg',
  './payload/data-01.b64','./payload/data-02.b64','./payload/data-03.b64','./payload/data-04.b64','./payload/data-05.b64','./payload/data-06.b64','./payload/data-07.b64',
  './payload/app-01.b64','./payload/app-02.b64','./payload/app-03.b64',
  './payload/css-01.b64','./payload/css-02.b64'
];
self.addEventListener('install',e=>{
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)));
});
self.addEventListener('activate',e=>{
  e.waitUntil(Promise.all([
    caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))),
    self.clients.claim()
  ]));
});
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET') return;
  e.respondWith(
    caches.match(e.request).then(cached=>cached||fetch(e.request).then(resp=>{
      const copy=resp.clone();
      caches.open(CACHE).then(c=>c.put(e.request,copy));
      return resp;
    }).catch(()=>caches.match('./index.html')))
  );
});