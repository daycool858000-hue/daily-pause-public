// Optional, non-diagnostic site-wide companionship. Never records feelings or visitor content.
(() => {
  const names = [
    ['light', '這裡可以留一點空白。'],
    ['leaf', '葉子會慢慢移動，你也可以。'],
    ['rain', '有些時候，聽著就好。'],
    ['steam', '杯裡的熱氣還在。'],
    ['moon', '今天的步調，由你決定。'],
    ['paper', '一張紙，可以先空著。'],
    ['wave', '海浪走到岸邊，又回去。'],
    ['window', '外面的光慢慢換了方向。']
  ];
  let previous = -1, muted = false, toastTimer = null, lastEvent = 0;
  const pick = () => {
    const opts=names.map((_,i)=>i).filter(i=>i!==previous);
    previous=opts[Math.floor(Math.random()*opts.length)];
    return names[previous];
  };
  function init() {
    const root=document.getElementById('globalCompanion');if(!root)return;
    const bubble=root.querySelector('.companion-bubble');
    const button=root.querySelector('.companion-orb');
    const close=root.querySelector('.companion-close');
    const turnOff=root.querySelector('.companion-disable');
    const icon=root.querySelector('.companion-scene');
    const message=root.querySelector('.companion-line');
    let removed=false;
    function show(text,kind) {
      if(muted||removed||document.hidden)return;
      const selection=pick();
      icon.dataset.scene=kind||selection[0];
      message.textContent=text||selection[1];
      bubble.hidden=false;
      root.classList.remove('companion-enter');void root.offsetWidth;
      root.classList.add('companion-enter');
      clearTimeout(toastTimer);
      toastTimer=setTimeout(()=>{bubble.hidden=true},7000);
    }
    button.addEventListener('click',()=>show());
    close.addEventListener('click',()=>{bubble.hidden=true;clearTimeout(toastTimer)});
    turnOff.addEventListener('click',()=>{
      muted=true;removed=true;root.hidden=true;clearTimeout(toastTimer);
      // Page-only choice; refresh restores the option. No profile/tracking is saved.
    });
    window.addEventListener('pause:companion',event=>{
      if(Date.now()-lastEvent<1400)return;
      lastEvent=Date.now();
      const d=event.detail||{};
      show(d.text,d.kind);
    });
    window.addEventListener('pause:companion-close',()=>{bubble.hidden=true});
    document.addEventListener('visibilitychange',()=>{
      if(document.hidden){bubble.hidden=true;clearTimeout(toastTimer)}
    });
    // First display is user-initiated by tapping the icon or using a feature.
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);
  else init();
})();