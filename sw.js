const C="bgc-v1",A=["./","index.html","style.css","script.js","logo.png"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(A)).then(()=>self.skipWaiting()))});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!=C).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
// Network first, so new versions always show up. The cache is only used when offline.
self.addEventListener("fetch",e=>{const r=e.request;if(r.method!="GET"||new URL(r.url).origin!=location.origin)return;
 e.respondWith(fetch(r).then(res=>{const cp=res.clone();caches.open(C).then(c=>c.put(r,cp));return res}).catch(()=>caches.match(r).then(m=>m||caches.match("index.html"))))});
