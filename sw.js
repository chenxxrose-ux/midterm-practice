const C='lele-202610111848';
const CORE=['./','index.html','manifest.webmanifest','icon-192.png','icon-512.png','icon-180.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(CORE)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==C).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{const r=e.request;if(r.method!=='GET')return;
 const u=new URL(r.url);const page=r.mode==='navigate';
 if(page){ // 有網路就拿最新題目，沒網路用存好的
  e.respondWith(fetch(r).then(res=>{const cp=res.clone();caches.open(C).then(c=>c.put('index.html',cp));return res}).catch(()=>caches.match('index.html',{ignoreSearch:true})));return}
 e.respondWith(caches.match(r).then(hit=>hit||fetch(r).then(res=>{if(u.origin===location.origin||u.hostname.includes('fonts.')){const cp=res.clone();caches.open(C).then(c=>c.put(r,cp))}return res}).catch(()=>hit)))});
