// Daily Pause real field recordings. CC0/PD records from Wikimedia Commons;
// source information is shown in the menu; no generated white noise is used.
// Only user-initiated playback, low volume, fade in/out, and stop on navigation.
// Handpan is an explicitly user-initiated Freesound CC0 external embed.
(() => {
  'use strict';
  const streams={
    stream:{title:'森林溪流',url:'https://upload.wikimedia.org/wikipedia/commons/transcoded/9/9e/Forest_lawn_creek.ogg/Forest_lawn_creek.ogg.mp3',
      page:'https://commons.wikimedia.org/wiki/File:Forest_lawn_creek.ogg',credit:'Dsw4／公有領域｜溪流實景錄音約 7 分半',gain:.092},
    forest:{title:'森林黃昏',url:'https://upload.wikimedia.org/wikipedia/commons/transcoded/f/fe/Nature_sounds_ambience_in_a_Dordogne_pond.ogg/Nature_sounds_ambience_in_a_Dordogne_pond.ogg.mp3',
      page:'https://commons.wikimedia.org/wiki/File:Nature_sounds_ambience_in_a_Dordogne_pond.ogg',credit:'Glaneur de sons／CC BY 3.0｜池邊蛙鳴與蟲鳴',gain:.075},
    ocean:{title:'水岸波浪',url:'https://upload.wikimedia.org/wikipedia/commons/transcoded/1/1f/Waves.ogg/Waves.ogg.mp3',
      page:'https://commons.wikimedia.org/wiki/File:Waves.ogg',credit:'Dsw4／公有領域｜安大略湖畔實景浪聲約 4 分半',gain:.08},
    rain:{title:'小雨聲',url:'https://upload.wikimedia.org/wikipedia/commons/transcoded/1/15/Sound_of_light_rainfall.ogg/Sound_of_light_rainfall.ogg.mp3',
      page:'https://commons.wikimedia.org/wiki/File:Sound_of_light_rainfall.ogg',credit:'Mijesty／CC BY-SA 4.0｜真實小雨錄音，來源頁載明授權',gain:.085},
    handpan:{title:'手碟真人演奏',page:'https://freesound.org/people/HECKFRICKER/sounds/625312/',
      credit:'HECKFRICKER／CC0；Freesound 外部播放器',external:true}
  };
  const sections=[['today','stream'],['read','forest'],['curiosity','rain'],['palette','handpan'],['holding','ocean']];
  const selects=new Map(),panels=new Map();
  const prefs=new Map(sections);
  let view='today',player=null,iframe=null,playing=null,animation=null,context=null;
  const fadeMillis=950;
  function clearAnimation(){if(animation){cancelAnimationFrame(animation);animation=null}}
  function updateButtons(){
    for(const [id,bar] of panels){
      const button=bar.querySelector('[data-sound-toggle]');
      const on=playing===id;
      button.textContent=on?'停止播放 Ⅱ':'聽聽這裡的聲音 ▷';
      button.setAttribute('aria-pressed',String(on));
    }
  }
  function stop(instant=false){
    clearAnimation();
    const old=player;
    player=null;
    if(iframe){iframe.remove();iframe=null}
    if(old){
      if(instant){old.pause();old.removeAttribute('src');old.load()}
      else {
        const start=performance.now(),initial=old.volume;
        const fade=t=>{
          const progress=Math.min(1,(t-start)/fadeMillis);
          old.volume=Math.max(0,initial*(1-progress));
          if(progress<1)animation=requestAnimationFrame(fade);
          else {old.pause();old.removeAttribute('src');old.load();animation=null}
        };
        animation=requestAnimationFrame(fade);
      }
    }
    playing=null;updateButtons();
  }
  function fadeUp(audio,target) {
    const started=performance.now();
    const animate=t=>{
      if(player!==audio){animation=null;return}
      const p=Math.min(1,(t-started)/1300);
      audio.volume=target*(.5-.5*Math.cos(Math.PI*p));
      animation=p<1?requestAnimationFrame(animate):null;
    };
    clearAnimation();animation=requestAnimationFrame(animate);
  }
  function updateCredit(bar,mode){
    const data=streams[mode],label=bar.querySelector('[data-sound-credit]');
    label.textContent=data.credit+' · ';
    const a=bar.querySelector('[data-sound-credit-link]');
    a.href=data.page;
  }
  function fail(bar){
    stop(true);
    const hint=bar.querySelector('[data-sound-hint]');
    hint.textContent='目前無法讀取音源。請查看原始錄音或稍後再試；不會切換成電子雜訊。';
  }
  function play(id){
    if(view!==id)return;
    const bar=panels.get(id),mode=prefs.get(id),data=streams[mode];
    stop(true);updateCredit(bar,mode);
    const hint=bar.querySelector('[data-sound-hint]');
    if(data.external){
      hint.textContent='CC0 真人手碟演奏。點下方播放器的播放鍵；若播放器無法顯示，可開啟原站。';
      const frame=document.createElement('iframe');
      frame.title='Freesound：真人手碟演奏公開試聽（CC0）';
      frame.src='https://freesound.org/embed/sound/iframe/625312/simple/medium/';
      frame.loading='lazy';frame.referrerPolicy='no-referrer';
      frame.setAttribute('allow','autoplay');
      frame.className='pause-handpan-frame';
      bar.appendChild(frame);iframe=frame;playing=id;updateButtons();
      return;
    }
    hint.textContent='低音量播放真實環境錄音，可隨時停止。';
    const audio=new Audio();
    audio.preload='none';audio.loop=true;audio.volume=0;
    audio.src=data.url;
    // Commons MP3 transcodes are usually available; try the original OGG as fallback.
    // This is the same recording, not an alternative synthesized noise source.
    let originalFallback=false;
    audio.addEventListener('error',()=>{
      if(player!==audio)return;
      if(!originalFallback){
        originalFallback=true;
        const original=data.page.slice(data.page.indexOf('File:')+5);
        const path=decodeURIComponent(original).replaceAll(' ','_');
        audio.src='https://commons.wikimedia.org/wiki/Special:Redirect/file/'+encodeURIComponent(path);
        audio.play().catch(()=>{if(player===audio)fail(bar)});
      }else fail(bar);
    });
    audio.addEventListener('ended',()=>{if(player===audio){audio.currentTime=0;audio.play().catch(()=>fail(bar))}});
    player=audio;playing=id;updateButtons();
    // A deliberate button click is required before reaching play().
    const promise=audio.play();
    if(promise && typeof promise.then==='function')promise.then(()=>{
      if(player===audio)fadeUp(audio,data.gain);
      else audio.pause();
    }).catch(()=>{if(player===audio)fail(bar)});
    else fadeUp(audio,data.gain);
  }
  function changeView(next){
    view=sections.some(([x])=>x===next)?next:'today';
    stop(true);
  }
  // Preserve the already-approved soft creature chime; never play ambient sounds for it.
  let bellContext=null;
  function bell() {
    const AudioContext=window.AudioContext||window.webkitAudioContext;
    if(!AudioContext||document.hidden)return;
    try {
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
    } catch(_){}
  }
  function init(){
    for(const [id,initial] of sections){
      const section=document.getElementById(id);if(!section)continue;
      const bar=document.createElement('div');bar.className='pause-soundbar';
      bar.innerHTML='<span class="pause-soundbar-label">♫ 這裡的聲音</span>'
        +'<label class="pause-sound-select-label">選擇聲景 <select data-sound-select aria-label="選擇環境聲"></select></label>'
        +'<button type="button" data-sound-toggle aria-pressed="false">聽聽這裡的聲音 ▷</button>'
        +'<div class="pause-sound-meta"><span data-sound-hint>不會自動播放，音量保持輕柔。</span>'
        +'<small><span data-sound-credit></span><a data-sound-credit-link target="_blank" rel="noopener noreferrer">原始錄音與授權 ↗</a></small></div>';
      const select=bar.querySelector('select');
      for(const [key,data] of Object.entries(streams)){
        const option=document.createElement('option');option.value=key;option.textContent=data.title;select.appendChild(option);
      }
      select.value=initial;updateCredit(bar,initial);
      selects.set(id,select);panels.set(id,bar);
      select.addEventListener('change',()=>{prefs.set(id,select.value);updateCredit(bar,select.value);stop(true);
        bar.querySelector('[data-sound-hint]').textContent='已更換聲景。點播放鍵才會發出聲音。'});
      bar.querySelector('[data-sound-toggle]').addEventListener('click',()=>{
        if(playing===id){stop(true);return}play(id);
      });
      section.prepend(bar);
    }
    document.addEventListener('visibilitychange',()=>{if(document.hidden)stop(true)});
    window.addEventListener('pagehide',()=>stop(true));
    window.addEventListener('pause:view-change',e=>changeView(e.detail?.view||'today'));
  }
  window.PauseSound={bell,stop,switchTo:changeView,get active(){return playing},tracks:streams};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();