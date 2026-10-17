// Daily Pause - discreet background listening, 2026-10-13.
// No iframe, synthesized rain or stand-alone music service. Approved CC0 audio is
// served locally, with the accepted forest ambience streamed from Wikimedia Commons.
// Soft autoplay is best-effort: Safari/iOS/Chrome can block until user interaction.
(() => {
  'use strict';
  // The 13 music tracks were suspended at the site owner's request; see MUSIC_RIGHTS_REVIEW_20261013.md.
  // Four personally approved CC0 pieces + gentle-rain replacement, all hosted within this repo.
  // License proof and conversion checksums: media/audio/SOURCES.json.
  // Six site-approved CC0 music tracks, one CC0 river sound and accepted forest ambience.
  // Original files, licenses and conversion SHA-256: media/audio/SOURCES.json.
  const tracks = [
    {
      id:'first-light',title:'晨光的微粒',kind:'music',
      src:'./media/audio/first-light.mp3',
      page:'https://opengameart.org/content/first-light-particles-%E2%80%93-cc0-atmospheric-pianoambient-track',
      license:'CC0 1.0',artist:'Yoiyami',work:'晨光的微粒',level:0.082
    },
    {
      id:'vaporware',title:'柔光鋼琴',kind:'music',
      src:'./media/audio/vaporware.mp3',
      page:'https://opengameart.org/content/calm-piano-1-vaporware',
      license:'CC0 1.0',artist:'The Cynic Project',work:'柔光鋼琴',level:0.082
    },
    {
      id:'forget-me-not',title:'別忘了這一刻',kind:'music',
      src:'./media/audio/forget-me-not.mp3',
      page:'https://opengameart.org/content/forget-me-not',
      license:'CC0 1.0',artist:'Kistol',work:'別忘了這一刻',level:0.079
    },
    {
      id:'lifewave',title:'安靜的光',kind:'music',
      src:'./media/audio/lifewave.mp3',
      page:'https://opengameart.org/content/calm-ambient-3-lifewave-2k',
      license:'CC0 1.0',artist:'The Cynic Project',work:'安靜的光',level:0.080
    },
    {
      id:'forest',title:'森林黃昏',kind:'nature',
      src:'https://upload.wikimedia.org/wikipedia/commons/transcoded/f/fe/Nature_sounds_ambience_in_a_Dordogne_pond.ogg/Nature_sounds_ambience_in_a_Dordogne_pond.ogg.mp3',
      page:'https://commons.wikimedia.org/wiki/File:Nature_sounds_ambience_in_a_Dordogne_pond.ogg',
      license:'CC BY 3.0',artist:'Glaneur de sons',work:'Nature sounds ambience in a Dordogne pond',level:.052
    },
    {id:'budding',title:'意識初醒',kind:'music',src:'./media/audio/budding.mp3',page:'https://opengameart.org/content/the-budding-of-consciousness-%E2%80%93-cc0-ambient-minimalist-theme-yoiyami-blue-series-%E2%80%93-no4',license:'CC0 1.0',artist:'Yoiyami',work:'意識初醒',level:0.08},
    {id:'somnium',title:'夢境輕語',kind:'music',src:'./media/audio/somnium.mp3',page:'https://opengameart.org/content/somnium',license:'CC0 1.0',artist:'Adiutorium',work:'夢境輕語',level:0.078},
    {id:'river-lapping',title:'細流輕拍',kind:'nature',src:'./media/audio/river-lapping.mp3',page:'https://opengameart.org/content/sea-and-river-wave-sounds',license:'CC0 1.0',artist:'RandomMind',work:'細流輕拍',level:0.055}
  ];
  const areas=['today','read','curiosity','palette','garden','holding'];
  // Keep existing desktop output behavior. Audio files are now pre-normalized for softer iOS playback.
  // Desktop fine-pointer devices previously had volume levels as low as 0.052.
  const desktopAudio=window.matchMedia?.('(pointer: fine)')?.matches
    && !/iPhone|iPad|iPod|Android/i.test(navigator.userAgent||'');
  const phoneAudio=/iPhone|iPod|Android.*Mobile/i.test(navigator.userAgent||'') ||
    (window.matchMedia?.('(pointer: coarse) and (max-width: 700px)')?.matches ?? false);
  function audibleLevel(track) {
    // Local CC0 files are normalized softly; laptops need more output than the previous external mix.
    // Keep the user's accepted forest-ambience desktop level untouched.
    if(desktopAudio && track.src.startsWith('./media/audio/'))
      return Math.min(track.kind==='nature' ? .31 : .55, track.level*(track.kind==='nature' ? 5.6 : 6.6));
    if(desktopAudio)return Math.min(track.kind==='nature' ? .32 : .34, track.level*(track.kind==='nature' ? 4 : 3.4));
    return track.level;
  }
  let ambientContext=null;
  function unlockAmbientContext(){
    const Constructor=window.AudioContext||window.webkitAudioContext;
    if(!Constructor)return null;
    try{
      if(!ambientContext)ambientContext=new Constructor();
      if(ambientContext.state==='suspended')ambientContext.resume().catch(()=>{});
      return ambientContext;
    }catch(_){return null}
  }
  // Companion nature audio is processed with its own GainNode, so iOS can keep
  // ambience genuinely quieter than the melody even where media.volume is ignored.
  function addSoftNature(entry){
    if(!entry.track.nature)return;
    const bg=tracks.find(t=>t.id===entry.track.nature),ctx=unlockAmbientContext();
    if(!bg||!ctx||ctx.state==='suspended')return;
    const audio=new Audio();
    audio.crossOrigin='anonymous';audio.src=bg.src;audio.preload='auto';audio.loop=true;audio.volume=1;
    try{
      const source=ctx.createMediaElementSource(audio),gain=ctx.createGain();
      const soften=ctx.createBiquadFilter();
      soften.type='lowpass';soften.frequency.value=1350;soften.Q.value=.55;
      gain.gain.value=0;
      source.connect(soften);soften.connect(gain);gain.connect(ctx.destination);
      const target=desktopAudio ? .043 : .025;
      gain.gain.setTargetAtTime(target,ctx.currentTime,.9);
      entry.audio.natureLayer={audio,source,soften,gain,context:ctx};
      audio.play().catch(()=>{releaseNature(entry.audio)});
    }catch(_){try{audio.pause();audio.removeAttribute('src')}catch(__){}}
  }
  function releaseNature(primary){
    const layer=primary?.natureLayer;if(!layer)return;
    delete primary.natureLayer;
    try{layer.gain.gain.cancelScheduledValues(layer.context.currentTime);
      layer.gain.gain.setValueAtTime(0,layer.context.currentTime)}catch(_){}
    try{layer.audio.pause();layer.audio.removeAttribute('src');layer.audio.load()}catch(_){}
    try{layer.source.disconnect();layer.soften.disconnect();layer.gain.disconnect()}catch(_){}
  }
  // Keep primary tracks on native audio playback for Safari compatibility.
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
    const eligible=tracks.map(t=>t.id);
    queue=queue.filter(id=>eligible.includes(id));
    if(!queue.length)queue=shuffled(eligible);
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
        label.textContent=waiting?'點播放，開啟聲音':'點 ▶ 播放聲音';
        label.removeAttribute('href');label.removeAttribute('title');
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
    releaseNature(audio);
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
    const from=performance.now(),length=reduceMotion?700:1900,el=entry.audio,volume=audibleLevel(entry.track);
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
    if(chosen.nature)unlockAmbientContext();
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
    audio.addEventListener('playing',()=>{if(active===entry){waiting=false;updateBar()}});
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
      fadeIn(entry);addSoftNature(entry);scheduleEnd(entry);updateBar();
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
    if(stoppedByVisitor||document.hidden)return;
    if(event?.target?.closest?.('.pause-soundbar'))return;
    // Desktop autoplay may be blocked even before its Promise rejection is delivered.
    // Retry on a real gesture; an intentional pause still remains respected.
    if(active){
      if(!active.audio.paused)return;
      const entry=active;
      const result=entry.audio.play();
      if(result?.then)result.then(()=>{
        if(active===entry){waiting=false;fadeIn(entry);updateBar()}
      }).catch(()=>{if(active===entry)startNext(true)});
      return;
    }
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
        +'<button data-sound-save-offline type="button" aria-label="下載目前配樂供離線播放" title="儲存目前配樂供離線播放">↓</button>'
        +'<span class="pause-sound-error">音源目前無法播放，按隨機換一首。</span>'
        +'<span class="pause-sound-offline-hint" role="status" aria-live="polite"></span>';
      bar.querySelector('[data-sound-shuffle]').addEventListener('click',randomNext);
      bar.querySelector('[data-sound-save-offline]').addEventListener('click',async e=>{
        const button=e.currentTarget,status=bar.querySelector('.pause-sound-offline-hint');
        const track=nowTrack()||tracks[0];
        if(!window.PauseOfflineMusic){status.textContent='此瀏覽器暫不支援離線配樂';return;}
        button.disabled=true;status.textContent='正在儲存「'+track.title+'」供離線播放…';
        try{
          await window.PauseOfflineMusic.save(track);
          status.textContent='「'+track.title+'」已保留供這台裝置離線播放';
        }catch(error){
          status.textContent=error?.message||'離線儲存未成功，請重試';
        }finally{button.disabled=false;}
      });
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
    get active(){return active?.track.id||null},get waitingForGesture(){return waiting},tracks};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();