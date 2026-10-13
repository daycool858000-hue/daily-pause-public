// Balanced visit-level photography: preserve all 15 original media files and credits.
// Each reading gets a stable image per visit; article readers slowly rotate the whole pool.
(() => {
  let photos=[], titles=new Map(),order=[],timer=null,rotation=0;
  const shuffled = values => {
    const copy=values.slice();
    for(let i=copy.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[copy[i],copy[j]]=[copy[j],copy[i]]}
    return copy;
  };
  const esc=s=>String(s||'').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  function register(entries) {
    photos=shuffled((window.mediaData||[]).filter(item=>item?.file&&item.credit&&item.license&&item.sourceUrl));
    order=photos.map((_,i)=>i);
    titles=new Map();
    for(const item of shuffled(entries)){
      const n=titles.size;
      if(!titles.has(item.title))titles.set(item.title,order[n%order.length]);
    }
    // Shuffling titles and cycling all images gives near-equal counts, including original and newly appended media.
  }
  function imageFor(item,index=0) {
    if(!photos.length)return null;
    const start=titles.get(item.title);
    const index0=Number.isInteger(start)?start:(index%photos.length);
    return photos[(index0+index+photos.length)%photos.length];
  }
  function label(photo) {
    if(!photo)return'';
    const source=/^https:\/\//.test(photo.sourceUrl)
      ?'<a href="'+esc(photo.sourceUrl)+'" target="_blank" rel="noopener noreferrer">原始來源與授權</a>'
      :'<span>素材來源證據待補，詳見內容原則</span>';
    return esc(photo.title)+' · '+esc(photo.credit)+' · '+source;
  }
  function coverMarkup(item) {
    const photo=imageFor(item);
    if(!photo)return'';
    return '<div class="editorial-thumb photo-thumb"><img src="'+esc(photo.file)+'" alt="'+esc(photo.alt)+'" loading="lazy"></div>';
  }
  function readerMarkup(item) {
    const photo=imageFor(item);if(!photo)return'';
    return '<figure class="reader-media photo-reader" data-photo-rotation="true"><img src="'+esc(photo.file)+'" alt="'+esc(photo.alt)+'" loading="eager"><figcaption>'+label(photo)+'</figcaption></figure>';
  }
  function stop(){if(timer!==null){clearInterval(timer);timer=null;}}
  function start(item) {
    stop();const host=document.querySelector('#articleReaderBody .photo-reader');if(!host)return;
    const img=host.querySelector('img'),caption=host.querySelector('figcaption');
    if(!img||!caption)return;rotation=0;
    const cycle=()=>{
      if(document.hidden||document.getElementById('articleReader')?.hidden)return;
      const p=imageFor(item,++rotation);if(!p)return;
      img.src=p.file;img.alt=p.alt;caption.innerHTML=label(p);
    };
    if(photos.length>1)timer=setInterval(cycle,12000);
  }
  document.addEventListener('visibilitychange',()=>{if(document.hidden)stop()});
  window.PausePhotos={register,coverMarkup,readerMarkup,start,stop,get count(){return photos.length},get assignments(){return titles.size}};
})();