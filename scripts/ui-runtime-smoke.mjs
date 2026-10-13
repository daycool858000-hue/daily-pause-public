// Simulate browser interaction paths to catch errors beyond string-based audits.
// Not a substitute for physical Windows/iPhone listening and visual acceptance.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

const root=path.resolve(process.argv[2]||'.');
const read=name=>fs.readFileSync(path.join(root,name),'utf8');

function testWorldMotion(){
  const drawCalls=[];
  const gradient={addColorStop(){}};
  const ctx=new Proxy({
    createLinearGradient(){return gradient},
    createRadialGradient(){return gradient},
    fillRect(...args){drawCalls.push(args)}
  },{get(target,key){return key in target?target[key]:(()=>{})},set(target,key,v){target[key]=v;return true}});
  const w={};
  vm.runInNewContext(read('world-art.js'),{window:w},{filename:'world-art.js:motion',timeout:5000});
  assert.equal(typeof w.PauseWorldArt?.drawScene,'function');
  w.PauseWorldArt.drawScene(ctx,'room',0);
  const before=JSON.stringify(drawCalls);
  drawCalls.length=0;
  w.PauseWorldArt.drawScene(ctx,'room',4700);
  assert.notEqual(JSON.stringify(drawCalls),before,'room scene does not move over time');
}

function testPaletteColorAndFrames(){
  const nodes=new Map(),rootListeners={},canvasListeners={},winEvents={};
  let time=900,frameId=0;
  const frames=new Map();
  const raf=fn=>{const id=++frameId;frames.set(id,fn);return id};
  const classList={add(){},remove(){},toggle(){}};
  const makeNode=id=>({
    id,dataset:{},style:{},hidden:id==='palette',value:'',textContent:'',
    disabled:false,innerHTML:'',classList,
    addEventListener(type,handler){if(id==='paletteWorld')rootListeners[type]=handler;else if(id==='worldCanvas')canvasListeners[type]=handler},
    getBoundingClientRect(){return {width:960,height:630,left:0,top:0}},
    querySelectorAll(){return []},setAttribute(){},setPointerCapture(){},releasePointerCapture(){},click(){}
  });
  const getNode=id=>{if(!nodes.has(id))nodes.set(id,makeNode(id));return nodes.get(id)};
  const drawn=[],marked=[];
  const canvas=getNode('worldCanvas');
  const gradient={addColorStop(){}};
  const ctx=new Proxy({
    createRadialGradient(){return gradient},
    fillRect(){},save(){},restore(){},setTransform(){}
  },{get(t,k){return k in t?t[k]:(()=>{})},set(t,k,v){t[k]=v;return true}});
  canvas.getContext=()=>ctx;
  const doc={
    hidden:false,
    getElementById:getNode,
    addEventListener(){},
    createElement(){return makeNode('a')}
  };
  const w={
    devicePixelRatio:1,
    PauseWorldArt:{W:960,H:630,drawScene(ctx,scene,t){drawn.push({scene,t})},
      drawElement(ctx,mark){marked.push({...mark})},drawProp(){}},
    createPaletteHistory({onChange}){
      onChange({canUndo:false,canRedo:false});
      return {record(){},undo(){return false},redo(){return false}};
    },
    dispatchEvent(){},
    addEventListener(event,handler){winEvents[event]=handler}
  };
  const sandbox={
    window:w,document:doc,matchMedia:()=>({matches:false}),
    performance:{now:()=>time},
    requestAnimationFrame:raf,
    cancelAnimationFrame:id=>frames.delete(id),
    CustomEvent:class {constructor(type,options){this.type=type;this.detail=options?.detail}}
  };
  vm.runInNewContext(read('palette-world.js'),sandbox,{filename:'palette-world.js:controls',timeout:5000});
  w.setupPaletteNew();
  assert.equal(frames.size,0,'hidden palette should not consume animation frames');
  getNode('palette').hidden=false;
  winEvents['palette-view-change']();
  assert.ok(frames.size>0,'palette did not resume frames when made visible');
  const [frame,callback]=frames.entries().next().value;
  frames.delete(frame);callback(1200);
  assert.ok(drawn.some(x=>x.t>0),'canvas stayed in still-frame rendering');
  const pickColor='#78aaba';
  rootListeners.click({target:{closest:()=>({dataset:{color:pickColor}})}});
  assert.equal(getNode('worldCustomColor').value,pickColor,'swatch does not sync color picker');
  assert.equal(getNode('worldActiveColorPreview').style.backgroundColor,pickColor,'swatch visual preview did not update');
  assert.match(getNode('worldColorStatus').textContent,/#78AABA/,'color feedback text absent');
  const event={button:0,clientX:230,clientY:170,pointerId:4,preventDefault(){}};
  canvasListeners.pointerdown(event);
  assert.equal(marked.at(-1)?.color,pickColor,'selected swatch did not affect new element');
  canvasListeners.pointerup({pointerId:4});
  const newColor='#c2a5ad';
  rootListeners.click({target:{closest:()=>({dataset:{color:newColor}})}});
  canvasListeners.pointerdown({...event,pointerId:5,clientX:270,clientY:220});
  assert.equal(marked.at(-1)?.color,newColor,'second color swatch was ignored');
  assert.equal(marked.at(0)?.color,pickColor,'old painted element was unexpectedly recolored');
}

async function testDesktopAudio(){
  const handlers={},sections=new Map(),storage=new Map();
  const bars=[];
  let allowPlay=false,now=100;
  const scheduled=[];
  const listeners={};
  const makeSub=()=>({
    dataset:{},textContent:'',href:'',title:'',
    addEventListener(event,fn){this.listeners??={};this.listeners[event]=fn},
    removeAttribute(name){delete this[name]},setAttribute(){}
  });
  const makeBar=()=>{
    const children=new Map();
    const bar={dataset:{},innerHTML:'',setAttribute(){},
      querySelector(selector){if(!children.has(selector))children.set(selector,makeSub());return children.get(selector)}
    };
    bars.push(bar);return bar;
  };
  const doc={
    hidden:false,readyState:'complete',
    getElementById(id){
      if(!['today','read','curiosity','palette','holding'].includes(id))return null;
      if(!sections.has(id))sections.set(id,{prepend(){}});
      return sections.get(id);
    },
    createElement:()=>makeBar(),
    addEventListener(name,fn){(handlers[name]??=[]).push(fn)}
  };
  const instances=[];
  class FakeAudio{
    constructor(){this.paused=true;this.volume=0;this.duration=180;this.currentTime=0;this.listeners={};instances.push(this)}
    addEventListener(type,fn){this.listeners[type]=fn}
    play(){
      if(!allowPlay){
        const error=new Error('Autoplay prevented');error.name='NotAllowedError';
        return Promise.reject(error);
      }
      this.paused=false;
      this.listeners.playing?.();
      return Promise.resolve();
    }
    pause(){this.paused=true}
    removeAttribute(){}
    load(){}
  }
  const w={
    matchMedia:(query)=>({matches:query.includes('(pointer: fine)')}),
    crypto:{getRandomValues(a){a[0]=42;return a}},
    addEventListener(event,fn){listeners[event]=fn},
    Audio:FakeAudio
  };
  const sandbox={
    window:w,document:doc,Audio:FakeAudio,
    navigator:{userAgent:'Mozilla/5.0 Windows NT 10.0 Chrome/125'},
    sessionStorage:{getItem:key=>storage.get(key)||null,setItem:(key,v)=>storage.set(key,v),removeItem:key=>storage.delete(key)},
    performance:{now:()=>now},
    requestAnimationFrame:fn=>{scheduled.push(fn);return scheduled.length},
    cancelAnimationFrame(){},setTimeout(){return 1},clearTimeout(){},
    Uint32Array,Math
  };
  vm.runInNewContext(read('soundscape.js'),sandbox,{filename:'soundscape.js:desktop-audio',timeout:5000});
  assert.equal(bars.length,5,'site-wide music bar missing on desktop');
  await Promise.resolve();await Promise.resolve();
  assert.equal(w.PauseSound.waitingForGesture,true,'blocked desktop autoplay must expose retry state');
  allowPlay=true;
  handlers.pointerdown[0]({target:{closest:()=>null}});
  await Promise.resolve();await Promise.resolve();
  assert.ok(w.PauseSound.active,'first desktop click did not start music');
  const active=instances.at(-1);
  now+=2500;
  if(scheduled.length)scheduled.shift()(now);
  assert.ok(active.volume>0,'desktop sound is still muted after fade-in');
  w.PauseSound.stop();
  assert.equal(storage.get('daily-pause-audio-paused-v1'),'yes','intentional pause not preserved');
  handlers.pointerdown[0]({target:{closest:()=>null}});
  assert.equal(w.PauseSound.active,null,'manual pause overridden by generic click');
}
testWorldMotion();
testPaletteColorAndFrames();
await testDesktopAudio();
console.log('UI runtime smoke passed: flowing room, active swatches, desktop audio gesture and pause.');
