// 今日一息：只快取網站程式與使用者主動選擇的離線聲音。
// Never touch localStorage, IndexedDB or the Holding Place's private records.
'use strict';
const VERSION='20261015-15';
const SHELL='todaypause-shell-'+VERSION;
const MEDIA='todaypause-audio-v1';
const CORE=[
  "./index.html",
  "./icons/today-pause-180.png",
  "./manifest.webmanifest",
  "./styles.css?v=20261013-3",
  "./world-style.css?v=20261013-7",
  "./surprise-style.css?v=20261013-2",
  "./sound-style.css?v=20261013-3",
  "./garden.css?v=20261015-2",
  "./media.js?v=20261010-7",
  "./long-articles.js?v=20261012-7",
  "./short-articles.js?v=20261010-4",
  "./cards-data.js?v=20261013-2",
  "./card-originals.js?v=20261013-3",
  "./card-sourced.js?v=20261013-3",
  "./fresh-cards.js?v=20261013-5",
  "./curiosity.js?v=20261012-5",
  "./daily-reminders.js?v=20261013-2",
  "./daily-content.js?v=20261013-2",
  "./reading-20261013.js?v=20261013-2",
  "./palette-history.js?v=20261013-1",
  "./world-art.js?v=20261015-3",
  "./mood-scenery.js?v=20261015-6",
  "./mood-atmospheres.js?v=20261014-1",
  "./palette-place-scenes.js?v=20261015-3",
  "./palette-world.js?v=20261015-11",
  "./photo-rotation.js?v=20261013-1",
  "./offline-audio.js?v=20261014-1",
  "./soundscape.js?v=20261014-2",
  "./companion-site.js?v=20261013-5",
  "./rest-stage.js?v=20261013-5",
  "./surprise-visit.js?v=20261013-4",
  "./app.js?v=20261013-10",
  "./quiet-spaces.js?v=20261012-8",
  "./garden-scenes.js?v=20261014-1",
  "./garden-motion.js?v=20261014-1",
  "./garden-decor.js?v=20261014-1",
  "./garden-sprites.js?v=20261015-1",
  "./garden.js?v=20261015-2",
  "./media/generated/scene-01.webp",
  "./media/generated/scene-02.webp",
  "./media/generated/scene-03.webp",
  "./media/generated/scene-04.webp",
  "./media/generated/scene-06.webp",
  "./media/generated/scene-07.webp",
  "./media/generated/scene-08.webp",
  "./media/generated/scene-10.webp",
  "./media/generated/scene-11.webp",
  "./icons/today-pause-192.png",
  "./media/palette-scenes/forest.webp",
  "./media/palette-scenes/ocean.webp",
  "./media/palette-scenes/room.webp",
  "./media/palette-scenes/living.webp",
  "./media/palette-scenes/cafe.webp",
  "./media/palette-scenes/park.webp",
  "./media/palette-scenes/street.webp",
  "./media/palette-scenes/mountain.webp",
  "./icons/today-pause-512.png"
];
const scopeURL=new URL(self.registration.scope);
const localURL=path=>new URL(path,self.registration.scope).href;
self.addEventListener('install',event=>{
  event.waitUntil((async()=>{
    const cache=await caches.open(SHELL);
    // If an optional file is missing, leave other known-good files cached.
    // Cache the main shell first; failures should surface in browser QA.
    await cache.add(localURL('./index.html'));
    await Promise.allSettled(CORE.filter(path=>path!=='./index.html'&&path!=='./').map(async path=>{
      const response=await fetch(new Request(localURL(path),{cache:'reload'}));
      if(response.ok)await cache.put(localURL(path),response.clone());
    }));
    await self.skipWaiting();
  })());
});
self.addEventListener('activate',event=>{
  event.waitUntil((async()=>{
    const names=await caches.keys();
    await Promise.all(names.filter(n=>n.startsWith('todaypause-shell-')&&n!==SHELL)
      .map(n=>caches.delete(n)));
    await self.clients.claim();
  })());
});
const sameScope=u=>u.origin===scopeURL.origin&&u.pathname.startsWith(scopeURL.pathname);
const isAudio=u=>sameScope(u)&&u.pathname.includes('/media/audio/')&&u.pathname.endsWith('.mp3');
async function serveAudio(request){
  const cache=await caches.open(MEDIA),url=request.url;
  const stored=await cache.match(url,{ignoreSearch:false});
  if(!stored)return fetch(request); // Fresh online stream, original Range rules.
  const range=request.headers.get('Range');
  if(!range)return stored;
  const match=/^bytes=(\d*)-(\d*)$/.exec(range);
  if(!match)return fetch(request);
  const full=await stored.arrayBuffer(),length=full.byteLength;
  const suffix=match[1]===''?Number(match[2]):null;
  const start=suffix===null?Number(match[1]):Math.max(0,length-suffix);
  const end=match[1]===''?length-1:match[2]?Math.min(length-1,Number(match[2])):length-1;
  if(!Number.isFinite(start)||!Number.isFinite(end)||start>length-1||start>end)
    return new Response('',{status:416,headers:{'Content-Range':'bytes */'+length}});
  const data=full.slice(start,end+1);
  return new Response(data,{status:206,headers:{
    'Accept-Ranges':'bytes','Content-Range':'bytes '+start+'-'+end+'/'+length,
    'Content-Length':String(data.byteLength),
    'Content-Type':stored.headers.get('Content-Type')||'audio/mpeg'
  }});
}
self.addEventListener('fetch',event=>{
  const req=event.request;
  if(req.method!=='GET')return;
  const url=new URL(req.url);
  if(!sameScope(url))return;
  if(isAudio(url)){event.respondWith(serveAudio(req));return;}
  if(req.mode==='navigate'){
    event.respondWith(fetch(req).then(async response=>{
      if(response.ok){const cache=await caches.open(SHELL);await cache.put(localURL('./index.html'),response.clone())}
      return response;
    }).catch(()=>caches.match(localURL('./index.html'))));
    return;
  }
  if(!/\.(?:js|css|webp|jpg|jpeg|png|svg|json|webmanifest)$/i.test(url.pathname))return;
  event.respondWith((async()=>{
    const existing=await caches.match(req,{ignoreVary:true});
    if(existing)return existing;
    const response=await fetch(req);
    if(response.ok&&response.type==='basic'){
      const cache=await caches.open(SHELL);
      cache.put(req,response.clone()).catch(()=>{});
    }
    return response;
  })());
});
self.addEventListener('message',event=>{
  const port=event.ports?.[0];
  if(event.data?.type!=='SAVE_OFFLINE_AUDIO'||!port)return;
  event.waitUntil((async()=>{
    const u=new URL(event.data.url,self.registration.scope);
    if(!isAudio(u)||u.origin!==self.location.origin){port.postMessage({ok:false,error:'僅支援站內已確認的音檔'});return;}
    try{
      const response=await fetch(u.href,{cache:'reload',headers:{'Accept':'audio/mpeg'}});
      if(!response.ok||response.status!==200)throw Error('音檔無法完整下載');
      const length=Number(response.headers.get('Content-Length')||0);
      if(length>25*1024*1024)throw Error('音檔過大，請改用線上播放');
      const bytes=await response.arrayBuffer();
      if(bytes.byteLength>25*1024*1024)throw Error('音檔過大');
      const clone=new Response(bytes,{status:200,headers:{'Content-Type':'audio/mpeg','Content-Length':String(bytes.byteLength),'Accept-Ranges':'bytes'}});
      const cache=await caches.open(MEDIA);await cache.put(u.href,clone);
      port.postMessage({ok:true,size:bytes.byteLength});
    }catch(_){port.postMessage({ok:false,error:'下載或儲存失敗，請檢查網路及可用空間'});}
  })());
});