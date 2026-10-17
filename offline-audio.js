// Standalone PWA registration; optional per-track music download.
// No automatic audio downloads or telemetry; private locker data is not accessed.
(() => {
  'use strict';
  if(!('serviceWorker' in navigator))return;
  window.addEventListener('load',()=>{
    navigator.serviceWorker.register('./sw.js',{scope:'./'}).catch(()=>{
      // Site remains fully usable online even when PWA install is unavailable.
    });
  },{once:true});
  async function save(track){
    if(!track||typeof track.src!=='string')throw Error('請先選擇一首站內配樂');
    const url=new URL(track.src,document.baseURI);
    if(url.origin!==location.origin||!url.pathname.includes('/media/audio/')){
      throw Error('這首外部自然聲目前不提供離線下載');
    }
    const reg=await navigator.serviceWorker.ready;
    const worker=navigator.serviceWorker.controller||reg.active;
    if(!worker)throw Error('離線功能還在準備中，請稍後再試');
    return new Promise((resolve,reject)=>{
      const channel=new MessageChannel();
      const timeout=setTimeout(()=>{
        channel.port1.close();
        reject(Error('下載等候時間較長，請稍後再試'));
      },60000);
      channel.port1.onmessage=e=>{
        clearTimeout(timeout);channel.port1.close();
        if(e.data?.ok)resolve(e.data);
        else reject(Error(e.data?.error||'離線下載未成功'));
      };
      worker.postMessage({type:'SAVE_OFFLINE_AUDIO',url:url.href},[channel.port2]);
    });
  }
  window.PauseOfflineMusic={save};
})();
