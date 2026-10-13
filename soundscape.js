// Daily Pause — original, locally synthesized soundscapes.
// No third-party recordings, instruments, tracks, trackers, external services or audio files.
// Every ambience starts from a deliberate user gesture. One shared Web Audio context.
(() => {
  'use strict';
  const presets = [
    ['stream','溪流聲'], ['forest','森林微風'], ['ocean','海浪聲'],
    ['rain','細雨聲'], ['handpan','手碟感合成音']
  ];
  const sections = [
    ['today','stream'],['read','forest'],['curiosity','rain'],
    ['palette','handpan'],['holding','ocean']
  ];
  let ctx=null, active=null, currentView='today', noiseBuffer=null, stopped=false;
  const sources=[], nodes=[];
  let pulseId=null, step=0;
  const buttons=new Map();
  const selections=new Map(sections);
  const AudioEngine=window.AudioContext||window.webkitAudioContext;
  function noteSupported(view) {
    const c=buttons.get(view);if(!c)return;
    const btn=c.querySelector('[data-sound-toggle]');
    btn.textContent=(active===view?'關閉聲音':'播放聲景')+' '+(active===view?'Ⅱ':'▷');
    btn.setAttribute('aria-pressed',String(active===view));
  }
  function bufferNoise(){
    if(noiseBuffer||!ctx)return;
    const rate=ctx.sampleRate,length=Math.round(rate*4);
    noiseBuffer=ctx.createBuffer(1,length,rate);
    const a=noiseBuffer.getChannelData(0);
    let prev=0;for(let i=0;i<length;i++){
      const white=(Math.random()*2-1);
      prev=.975*prev+.025*white;
      a[i]=Math.max(-1,Math.min(1,prev*4));
    }
  }
  function track(node){nodes.push(node);return node}
  function startSource(node){sources.push(node);node.start();return node}
  function connectNoise({freq,q=0.7,kind='lowpass',level=.13,rate=.1,depth=.3}) {
    bufferNoise();
    const src=track(ctx.createBufferSource());src.buffer=noiseBuffer;src.loop=true;
    const filt=track(ctx.createBiquadFilter());filt.type=kind;filt.frequency.value=freq;filt.Q.value=q;
    const gain=track(ctx.createGain());gain.gain.value=level;
    const osc=track(ctx.createOscillator());osc.type='sine';osc.frequency.value=rate;
    const mod=track(ctx.createGain());mod.gain.value=depth*level;
    const base=track(ctx.createConstantSource());base.offset.value=level;
    // Modulation is always nonnegative for the selected shallow depth.
    gain.gain.value=level;
    src.connect(filt);filt.connect(gain);gain.connect(ctx.destination);
    osc.connect(mod);mod.connect(gain.gain);
    startSource(src);startSource(osc);
    // base is intentionally not started; gain retains static baseline.
    return {src,filt,gain,osc};
  }
  function chirp(freq,duration=.3,volume=.010){
    if(!ctx)return;
    const now=ctx.currentTime;
    const osc=ctx.createOscillator(),envelope=ctx.createGain();
    osc.type='sine';osc.frequency.setValueAtTime(freq,now);
    osc.frequency.exponentialRampToValueAtTime(freq*1.28,now+duration*.8);
    envelope.gain.setValueAtTime(.0001,now);
    envelope.gain.exponentialRampToValueAtTime(volume,now+.04);
    envelope.gain.exponentialRampToValueAtTime(.0001,now+duration);
    osc.connect(envelope);envelope.connect(ctx.destination);
    osc.start(now);osc.stop(now+duration+.03);
    osc.onended=()=>{osc.disconnect();envelope.disconnect()};
  }
  function handpanTone(freq,volume=.046){
    if(!ctx)return;
    const now=ctx.currentTime;
    const partials=[[1,1],[2.01,.25],[3.89,.055]];
    for(const [ratio,mult] of partials){
      const osc=ctx.createOscillator(),gain=ctx.createGain();
      osc.type='sine';osc.frequency.value=freq*ratio;
      gain.gain.setValueAtTime(.0001,now);
      gain.gain.linearRampToValueAtTime(volume*mult,now+.025);
      gain.gain.exponentialRampToValueAtTime(.0001,now+2.5);
      osc.connect(gain);gain.connect(ctx.destination);
      osc.start(now);osc.stop(now+2.55);
      osc.onended=()=>{osc.disconnect();gain.disconnect()};
    }
  }
  function startMode(mode) {
    if(mode==='handpan') {
      const tones=[293.66,369.99,440,587.33,493.88,369.99,329.63,220,293.66,440];
      step=0;handpanTone(tones[0],.035);
      pulseId=window.setInterval(()=>{if(ctx&&document.visibilityState==='visible'){step=(step+1)%tones.length;handpanTone(tones[step],.034)}},1470);
    } else if(mode==='stream'){
      connectNoise({freq:1100,kind:'bandpass',q:.37,level:.16,rate:.13,depth:.21});
      connectNoise({freq:320,kind:'lowpass',level:.12,rate:.27,depth:.12});
    } else if(mode==='forest'){
      connectNoise({freq:550,kind:'lowpass',level:.095,rate:.12,depth:.31});
      connectNoise({freq:2300,kind:'bandpass',q:.42,level:.065,rate:.06,depth:.22});
      let n=0;pulseId=window.setInterval(()=>{if(document.visibilityState==='visible'&&(n++%2===0))chirp(760+(n%4)*110,.3,.009)},5500);
    } else if(mode==='ocean'){
      connectNoise({freq:780,kind:'lowpass',level:.14,rate:.095,depth:.65});
      connectNoise({freq:1500,kind:'bandpass',q:.42,level:.045,rate:.12,depth:.52});
    } else if(mode==='rain'){
      connectNoise({freq:2300,kind:'bandpass',q:.42,level:.115,rate:.36,depth:.13});
      connectNoise({freq:4300,kind:'lowpass',level:.067,rate:.21,depth:.18});
    }
  }
  function stop(){
    if(pulseId!==null){clearInterval(pulseId);pulseId=null}
    for(const s of sources.splice(0)){try{s.stop()}catch(_){}}
    for(const n of nodes.splice(0)){try{n.disconnect()}catch(_){}}
    const previous=active;active=null;
    if(previous)noteSupported(previous);
  }
  async function play(view) {
    if(!AudioEngine){return}
    if(!ctx)ctx=new AudioEngine();
    try{await ctx.resume()}catch(_){return}
    if(document.hidden||currentView!==view)return;
    stop();
    active=view;
    startMode(selections.get(view)||'stream');
    noteSupported(view);
  }
  function bell(){
    if(!AudioEngine)return;
    if(!ctx)ctx=new AudioEngine();
    ctx.resume().then(()=>{
      if(document.hidden)return;
      const t=ctx.currentTime;
      for(const [f,vol,offset] of [[783.99,.017,0],[1174.66,.006,.04]]){
        const osc=ctx.createOscillator(),g=ctx.createGain();
        osc.type='sine';osc.frequency.value=f;
        g.gain.setValueAtTime(.0001,t+offset);
        g.gain.linearRampToValueAtTime(vol,t+offset+.016);
        g.gain.exponentialRampToValueAtTime(.0001,t+offset+.45);
        osc.connect(g);g.connect(ctx.destination);
        osc.start(t+offset);osc.stop(t+offset+.49);
        osc.onended=()=>{osc.disconnect();g.disconnect()};
      }
    }).catch(()=>{});
  }
  function switchTo(view) {currentView=view;stop()}
  function init(){
    for(const [view,initial] of sections) {
      const section=document.getElementById(view);
      if(!section)continue;
      const wrap=document.createElement('div');wrap.className='pause-soundbar';
      wrap.innerHTML='<span class="pause-soundbar-label" aria-hidden="true">♫ <span>這裡的聲音</span></span>'
       +'<label class="pause-sound-select-label">選擇聲景 <select data-sound-select aria-label="選擇此區域的背景聲"></select></label>'
       +'<button data-sound-toggle type="button" aria-pressed="false">播放聲景 ▷</button>';
      const select=wrap.querySelector('select');
      for(const [id,label] of presets){
        const opt=document.createElement('option');opt.value=id;opt.textContent=label;
        select.appendChild(opt);
      }
      select.value=initial;
      select.addEventListener('change',()=>{
        selections.set(view,select.value);
        if(active===view)play(view);
      });
      wrap.querySelector('button').addEventListener('click',()=>{
        if(active===view)stop();else play(view);
      });
      section.prepend(wrap);
      buttons.set(view,wrap);
      if(!AudioEngine){
        wrap.querySelector('button').disabled=true;
        wrap.querySelector('button').textContent='此瀏覽器不支援聲音';
        select.disabled=true;
      }
    }
    document.addEventListener('visibilitychange',()=>{if(document.hidden)stop()});
    window.addEventListener('pagehide',stop);
    window.addEventListener('pause:view-change',event=>switchTo(event.detail?.view||'today'));
    // The welcome screen starts on today's view, but never starts audio.
  }
  window.PauseSound={bell,stop,switchTo,get active(){return active}};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();