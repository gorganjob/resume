// Gorgan Job PWA service worker (offline-first).
// To force an update for every user, change the version below (gj-v2 -> gj-v3).
const V='gj-v3';
const SHELL=['./','index.html','azmoon.html','manifest.webmanifest','pwa.js','icon-192.png','icon-512.png','apple-touch-icon.png','logo.png'];
const FONTS=['https://fonts.googleapis.com/css2?family=Vazirmatn:wght@400;600;800&display=swap','https://fonts.googleapis.com/css2?family=Vazirmatn:wght@400;700;900&display=swap'];
const FONT_HOST=/fonts\.(googleapis|gstatic)\.com$/;
function tf(u,ms){const c=new AbortController();const t=setTimeout(()=>c.abort(),ms);return fetch(u,{mode:'cors',signal:c.signal}).finally(()=>clearTimeout(t))}
// Download the Persian font once so the app looks the same offline. Never blocks install.
async function warmFonts(c){
  for(const u of FONTS){
    try{
      const res=await tf(u,5000);if(!res.ok)continue;
      const css=await res.clone().text();await c.put(u,res);
      const files=[...css.matchAll(/url\((https:[^)]+)\)/g)].map(m=>m[1]);
      await Promise.all(files.map(async f=>{try{const r=await tf(f,8000);if(r.ok)await c.put(f,r)}catch(e){}}));
    }catch(e){}
  }
}
self.addEventListener('install',e=>{
  e.waitUntil(caches.open(V).then(async c=>{await c.addAll(SHELL);await warmFonts(c)}).then(()=>self.skipWaiting()));
});
self.addEventListener('activate',e=>{
  e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==V).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));
});
self.addEventListener('fetch',e=>{
  const r=e.request;if(r.method!=='GET')return;
  const u=new URL(r.url);
  if(r.mode==='navigate'){
    // pages: try the network (fresh version), fall back to the saved copy when offline
    e.respondWith(fetch(r).then(res=>{const cp=res.clone();caches.open(V).then(c=>c.put(r,cp));return res})
      .catch(()=>caches.match(r,{ignoreSearch:true}).then(m=>m||caches.match('index.html'))));
    return;
  }
  if(u.origin===location.origin||FONT_HOST.test(u.hostname)){
    // assets + fonts: serve the saved copy instantly, refresh it in the background
    e.respondWith(caches.match(r,{ignoreVary:true}).then(m=>{
      const f=fetch(r).then(res=>{if(res&&(res.ok||res.type==='opaque')){const cp=res.clone();caches.open(V).then(c=>c.put(r,cp))}return res}).catch(()=>m||Response.error());
      return m||f;
    }));
  }
});
