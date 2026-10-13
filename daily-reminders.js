// One local-date reminder per visitor; no repeat until the entire pool is seen.
// The browser retains selection history. No accounts, server requests or analytics.
(() => {
  'use strict';
  const KEY='daily-pause-reminder-cycle-v1';
  function hash(input){
    let n=2166136261;
    for(const ch of input){n^=ch.charCodeAt(0);n=Math.imul(n,16777619)}
    n^=n<<13;n^=n>>>17;n^=n<<5;
    return n>>>0;
  }
  function select(lines,day,installSeed,storage){
    if(!Array.isArray(lines)||lines.length===0)return null;
    const all=new Set(lines.map(x=>x.reminder));
    let history=[];
    try{
      const stored=JSON.parse(storage.getItem(KEY)||'null');
      if(stored&&Array.isArray(stored.history))
        history=stored.history.filter(x=>x&&typeof x.day==='string'
          &&typeof x.reminder==='string'&&all.has(x.reminder));
    }catch(_){}
    // Same day stays fixed, including a reload or a newly deployed content batch.
    const earlier=history.find(x=>x.day===day);
    if(earlier)return lines.find(x=>x.reminder===earlier.reminder);
    let used=new Set(history.map(x=>x.reminder));
    const previous=history.at(-1)?.reminder||null;
    // All 55 messages participate from the very first visit. The next cycle
    // starts only after every reminder has appeared at least once.
    const restarting=used.size>=all.size;
    if(restarting){history=[];used=new Set()}
    let pool=lines.filter(x=>!used.has(x.reminder));
    // Avoid seeing yesterday's sentence again exactly at a cycle boundary.
    if(restarting&&previous&&pool.length>1)
      pool=pool.filter(x=>x.reminder!==previous);
    const idx=hash(installSeed+'|'+day+'|reminder-cycle-v2')%pool.length;
    const selected=pool[idx];
    history.push({day,reminder:selected.reminder});
    try{storage.setItem(KEY,JSON.stringify({history}))}catch(_){}
    return selected;
  }
  window.PauseDailyReminders={select};
})();
