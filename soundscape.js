// Daily Pause - discreet background listening, 2026-10-13.
// No iframe, synthesized rain or stand-alone music service. All recordings are
// streamed from Wikimedia Commons MP3 transcodes. Attribution is linked in the UI.
// Soft autoplay is best-effort: Safari/iOS/Chrome can block until user interaction.
(() => {
  'use strict';
  const tracks = [
    {
      id:'sleep',title:'夢裡的鋼琴',kind:'music',
      src:'https://upload.wikimedia.org/wikipedia/commons/transcoded/d/d0/Scott_Buckley_-_Sleep_(piano-only_mix).oga/Scott_Buckley_-_Sleep_(piano-only_mix).oga.mp3',
      page:'https://www.scottbuckley.com.au/library/sleep/',
      license:'CC BY 4.0',artist:'Scott Buckley',work:'Sleep (Piano Only Mix)',level:.075
    },{
      id:'home',title:'溫柔的歸途',kind:'music',
      src:'https://upload.wikimedia.org/wikipedia/commons/transcoded/f/f7/Scott_Buckley_-_The_Long_Way_Home.oga/Scott_Buckley_-_The_Long_Way_Home.oga.mp3',
      page:'https://www.scottbuckley.com.au/library/the-long-way-home/',
      license:'CC BY 4.0',artist:'Scott Buckley',work:'The Long Way Home',level:.065
    },{
      id:'mountains',title:'安靜的琴聲',kind:'music',
      src:'https://upload.wikimedia.org/wikipedia/commons/transcoded/6/6c/Scott_Buckley_-_She_Moved_Mountains.oga/Scott_Buckley_-_She_Moved_Mountains.oga.mp3',
      page:'https://www.scottbuckley.com.au/library/she-moved-mountains/',
      license:'CC BY 4.0',artist:'Scott Buckley',work:'She Moved Mountains',level:.065
    },{
      id:'creek',title:'森林溪流',kind:'nature',
      src:'https://upload.wikimedia.org/wikipedia/commons/transcoded/9/9e/Forest_lawn_creek.ogg/Forest_lawn_creek.ogg.mp3',
      page:'https://commons.wikimedia.org/wiki/File:Forest_lawn_creek.ogg',
      license:'Public domain',artist:'Dsw4',work:'Forest lawn creek',level:.06
    },{
      id:'forest',title:'森林黃昏',kind:'nature',
      src:'https://upload.wikimedia.org/wikipedia/commons/transcoded/f/fe/Nature_sounds_ambience_in_a_Dordogne_pond.ogg/Nature_sounds_ambience_in_a_Dordogne_pond.ogg.mp3',
      page:'https://commons.wikimedia.org/wiki/File:Nature_sounds_ambience_in_a_Dordogne_pond.ogg',
      license:'CC BY 3.0',artist:'Glaneur de sons',work:'Nature sounds ambience in a Dordogne pond',level:.052
    }
  ];
  const areas=['today','read','curiosity','palette','holding'];
  const bars=new Map();
  let activeArea='today',active=null,waiting=false,stoppedByVisitor=false;
  let queue=[],raf=null,advanceTimer=null,sequence=0,fadeOutSet=new Set();
  const reduceMotion=window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches;
  // Silence after explicit pause lasts in this tab, including page reload.
  try{stoppedByVisitor=sessionStorage.getItem('daily-pause-audio-paused-v1')==='yes'}catch(_){}
  function rememberPause(value) {
    stoppedByVisitor=value;
    try{if(value)sessionStorage.setItem('daily-pause-audio-paused-v1','yes');
      else sessionStorage.removeItem('daily-pause-audio-paused-v1')}catch(_){}
  }
  const random=()=>{
    if(window.crypto?.getRandomValues) {
      const num=new Uint32Array(1);window.crypto.getRandomValues(num);return num[0]/4294967296;
    }
    return Math.random();
  };
  function shuffled(items){
    const copy=items.slice();
    for(let i=copy.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[copy[i],copy[j]]=[copy[j],copy[i]]}
    return copy;
  }
  function nextTrack(skipId){
    if(!queue.length)queue=shuffled(tracks.map(t=>t.id));
    if(queue.length>1 && queue[0]===skipId)queue.push(queue.shift());
    const chosen=queue.shift();
    return tracks.find(t=>t.id===chosen)||tracks[0];
  }
  function nowTrack(){return active?.track||null}
  function updateBar(){
    const track=nowTrack(),playback=Boolean(active&&!active.audio.paused);
    for(const [area,bar] of bars){
      const label=bar.querySelector('.pause-sound-name');
      const play=bar.querySelector('[data-sound-toggle]');
      const shuffle=bar.querySelector('[data-sound-shuffle]');
      const shown=track;
      if(shown){
        label.textContent=shown.title;
        label.href=shown.page;
        label.title=shown.work+' — '+shown.artist+' · '+shown.license+' (查看來源)';
      }else{
        label.textContent='輕柔聲景';label.removeAttribute('href');label.removeAttribute('title');
      }
      play.textContent=playback?'Ⅱ':'▷';
      play.setAttribute('aria-label',playback?'暫停背景聲':'播放背景聲');
      play.setAttribute('aria-pressed',String(playback));
      shuffle.setAttribute('aria-label','隨機換一首背景聲');
      bar.dataset.playing=String(playback&&area===activeArea);
      bar.dataset.waiting=String(waiting&&area===activeArea);
    }
  }
  function cancelFade(){if(raf!==null)cancelAnimationFrame(raf);raf=null}
  function release(audio){
    try{audio.pause();audio.removeAttribute('src');audio.load()}catch(_){}
  }
  function fadeOut(audio,ms=550){
    if(!audio||fadeOutSet.has(audio))return;
    fadeOutSet.add(audio);
    const start=performance.now(),from=audio.volume;
    const fade=t=>{
      const k=Math.min(1,(t-start)/ms);
      if(!audio.paused)audio.volume=Math.max(0,from*(1-k));
      if(k<1)requestAnimationFrame(fade);
      else{release(audio);fadeOutSet.delete(audio)}
    };
    requestAnimationFrame(fade);
  }
  function fadeIn(entry){
    cancelFade();
    const from=performance.now(),length=reduceMotion?700:1900,el=entry.audio,volume=entry.track.level;
    const f=t=>{
      if(active!==entry){raf=null;return}
      const x=Math.min(1,(t-from)/length);
      el.volume=Math.max(0,volume*(.5-.5*Math.cos(Math.PI*x)));
      raf=x<1?requestAnimationFrame(f):null;
    };
    raf=requestAnimationFrame(f);
  }
  function cancelAdvance(){if(advanceTimer!==null){clearTimeout(advanceTimer);advanceTimer=null}}
  function teardown({fade=false}={}){
    ++sequence;waiting=false;cancelFade();cancelAdvance();
    const before=active;active=null;
    if(before){if(fade)fadeOut(before.audio);else release(before.audio)}
    updateBar();
  }
  function canAdvance(entry){
    return active===entry&&!document.hidden&&!stoppedByVisitor;
  }
  function scheduleEnd(entry){
    cancelAdvance();
    if(!Number.isFinite(entry.audio.duration))return;
    const remaining=Math.max(0,entry.audio.duration-entry.audio.currentTime);
    // Slightly overlap the end of the current selection, avoiding abrupt gaps.
    advanceTimer=setTimeout(()=>{if(canAdvance(entry))startNext(false)},Math.max(0,(remaining-2.4)*1000));
  }
  function startNext(userGesture=false){
    if(stoppedByVisitor||document.hidden)return;
    const previous=active,chosen=nextTrack(previous?.track.id);
    cancelAdvance();cancelFade();
    if(previous)fadeOut(previous.audio,1700);
    const audio=new Audio();
    audio.preload='auto';
    audio.volume=0;
    audio.loop=false;
    audio.src=chosen.src;
    audio.playsInline=true;
    const entry={audio,track:chosen,id:++sequence,gesture:userGesture};
    active=entry;
    waiting=false;
    audio.addEventListener('loadedmetadata',()=>{if(canAdvance(entry))scheduleEnd(entry)});
    audio.addEventListener('timeupdate',()=>{
      if(canAdvance(entry)&&Number.isFinite(audio.duration)&&audio.duration-audio.currentTime<2.5){
        startNext(false);
      }
    });
    audio.addEventListener('ended',()=>{if(canAdvance(entry))startNext(false)});
    audio.addEventListener('error',()=>{
      if(active!==entry)return;
      // A broken remote file is reported, never replaced with synthetic noise.
      waiting=false;release(entry.audio);active=null;updateBar();
      const bar=bars.get(activeArea);if(bar)bar.dataset.error='true';
    });
    updateBar();
    const promise=audio.play();
    if(promise&&typeof promise.then==='function')promise.then(()=>{
      if(active!==entry){release(audio);return}
      fadeIn(entry);scheduleEnd(entry);updateBar();
    }).catch(err=>{
      if(active!==entry)return;
      release(audio);active=null;
      if(err?.name==='NotAllowedError'){waiting=true;updateBar()}
      else{const bar=bars.get(activeArea);if(bar)bar.dataset.error='true';updateBar()}
    });
  }
  function onView(view) {
    if(!areas.includes(view))return;
    activeArea=view;
    // Keep the same sound gently playing throughout the site's five sections.
    // Music does not restart or overlap every time the user changes pages.
    updateBar();
    if(!active&&!stoppedByVisitor)startNext();
  }
  function enable(){
    rememberPause(false);
    const bar=bars.get(activeArea);if(bar)bar.dataset.error='false';
    if(active){
      if(active.audio.paused){
        const promise=active.audio.play();if(promise?.then)promise.then(()=>fadeIn(active)).catch(()=>startNext(true));
      }
    }else startNext(true);
  }
  function pause(){
    rememberPause(true);
    teardown({fade:false});
  }
  function randomNext(){
    rememberPause(false);
    const bar=bars.get(activeArea);if(bar)bar.dataset.error='false';
    startNext(true);
  }
  function firstGesture(event){
    if(!waiting||stoppedByVisitor||active||document.hidden)return;
    if(event?.target?.closest?.('.pause-soundbar'))return;
    // Autoplay is retried synchronously during the user's first interaction.
    startNext(true);
  }
  function init(){
    for(const area of areas){
      const section=document.getElementById(area);if(!section)continue;
      const bar=document.createElement('div');bar.className='pause-soundbar';
      bar.setAttribute('aria-label','網站背景聲');
      bar.innerHTML='<span class="pause-sound-icon" aria-hidden="true">♫</span>'
        +'<a class="pause-sound-name" target="_blank" rel="noopener noreferrer">輕柔聲景</a>'
        +'<button data-sound-shuffle type="button" aria-label="隨機換一首背景聲" title="隨機">⤨</button>'
        +'<button data-sound-toggle type="button" aria-label="播放背景聲" title="播放或暫停" aria-pressed="false">▷</button>'
        +'<span class="pause-sound-error">音源目前無法播放，按隨機換一首。</span>';
      bar.querySelector('[data-sound-shuffle]').addEventListener('click',randomNext);
      bar.querySelector('[data-sound-toggle]').addEventListener('click',()=>{
        if(active&&!active.audio.paused)pause();else enable();
      });
      section.prepend(bar);bars.set(area,bar);
    }
    updateBar();
    document.addEventListener('pointerdown',firstGesture,{capture:true});
    document.addEventListener('click',firstGesture,{capture:true});
    document.addEventListener('touchend',firstGesture,{capture:true,passive:true});
    document.addEventListener('keydown',firstGesture,{capture:true});
    window.addEventListener('pause:view-change',e=>onView(e.detail?.view||'today'));
    document.addEventListener('visibilitychange',()=>{
      if(document.hidden){teardown();return}
      if(!stoppedByVisitor)startNext();
    });
    window.addEventListener('pagehide',()=>teardown());
    if(!stoppedByVisitor)startNext();
  }
  // Preserve the existing user-approved little spirit bell as-is.
  let bellContext=null;
  function bell(){
    const AudioContext=window.AudioContext||window.webkitAudioContext;
    if(!AudioContext||document.hidden)return;
    try{
      bellContext=bellContext||new AudioContext();
      Promise.resolve(bellContext.resume()).then(()=>{
        const t=bellContext.currentTime;
        for(const [freq,volume,offset] of [[783.99,.014,0],[1174.66,.005,.04]]){
          const osc=bellContext.createOscillator(),gain=bellContext.createGain();
          osc.type='sine';osc.frequency.value=freq;
          gain.gain.setValueAtTime(.0001,t+offset);
          gain.gain.linearRampToValueAtTime(volume,t+offset+.016);
          gain.gain.exponentialRampToValueAtTime(.0001,t+offset+.45);
          osc.connect(gain);gain.connect(bellContext.destination);
          osc.start(t+offset);osc.stop(t+offset+.49);
          osc.onended=()=>{osc.disconnect();gain.disconnect()};
        }
      }).catch(()=>{});
    }catch(_){}
  }
  window.PauseSound={bell,stop:pause,shuffle:randomNext,switchTo:onView,
    get active(){return active?.track.id||null},tracks};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();