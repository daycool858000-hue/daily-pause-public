'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const root=path.resolve(__dirname,'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const loaded={};
const load=(name,context)=>vm.runInNewContext(read(name),context,{filename:name,timeout:5000});
// Artistic proof requires human review. This regexp only verifies that the
// app references real bundled files, including the image studies and 2x crops.
const bundledArtwork=/^\.\/media\/palette-paper\/\d{2}\.webp$/;

test('new modules parse and site branding stays unchanged',()=>{
 for(const name of ['mood-scenery.js','mood-atmospheres.js','palette-world.js',
                      'garden-scenes.js','garden.js','garden-sprites.js']){
   assert.doesNotThrow(()=>new Function(read(name)),name);
 }
 const html=read('index.html');
 assert.match(html,/<strong>今日一息<\/strong>/);
 assert.match(html,/<title>今日一息/);
 for(const src of ['mood-scenery.js','mood-atmospheres.js','palette-world.js',
                   'garden-scenes.js','garden-sprites.js','garden.js']){
   assert.ok(html.includes('"./'+src+'?v='),src+' must be linked');
 }
 assert.ok(html.indexOf('mood-scenery.js')<html.indexOf('palette-world.js'));
 assert.ok(html.indexOf('garden-scenes.js')<html.indexOf('garden.js'));
});

test('24 independent authored backgrounds correspond to 24 dynamic effects',()=>{
 const win={};const context={window:win};
 load('mood-scenery.js',context);load('mood-atmospheres.js',context);
 const scenes=win.PauseMoodScenes,fx=win.PauseMoodAtmospheres;
 assert.equal(scenes.entries.length,24);
 assert.equal(fx.profiles.length,24);
 assert.equal(new Set(scenes.entries.map(x=>x[0])).size,24);
 assert.equal(new Set(scenes.entries.map(x=>x[1])).size,24);
 assert.equal(new Set(fx.profiles.map(x=>x[1])).size,24);
 for(const [name] of scenes.entries){
   const markup=scenes.svg(name);
   assert.match(markup,/<svg/);assert.match(markup,/<\/svg>/);
   assert.ok(markup.length>1800,name+' is missing meaningful environment layers');
   const url=scenes.imageUrl(name);
   assert.ok(url.startsWith('data:image/svg+xml;charset=utf-8,')||
      bundledArtwork.test(url),
      name+' must use an authored SVG or a bundled generated WebP scene');
   if(url.startsWith('./')){
     assert.ok(fs.existsSync(path.join(root,url.slice(2))),name+' scene file missing: '+url);
   }
   assert.ok(fx.byName[name],name+' lacks animation');
 }
});


test('24 different numbered paper artworks, never legacy photography',()=>{
  const win={};load('mood-scenery.js',{window:win});
  const art=win.PauseMoodScenes.realisticMoodScenes;
  const names=win.PauseMoodScenes.entries.map(x=>x[0]);
  const urls=Object.values(art);
  assert.equal(urls.length,24);
  assert.equal(new Set(urls).size,24);
  names.forEach((name,i)=>{
    const expected='./media/palette-paper/'+String(i+1).padStart(2,'0')+'.webp';
    assert.equal(win.PauseMoodScenes.imageUrl(name),expected);
    assert.ok(fs.existsSync(path.join(root,expected.slice(2))),expected+' missing');
    assert.ok(!expected.includes('generated/'),'Old scenery must stay retired');
  });
  const manifest=JSON.parse(read('media/palette-paper/manifest.json'));
  assert.equal(manifest.length,24);
  assert.equal(new Set(manifest.map(item=>item.sha256)).size,24);
  for(const item of manifest){

    assert.match(item.path,/^media\/palette-paper\/\d{2}\.webp$/);
    const sum=require('node:crypto').createHash('sha256').update(
      fs.readFileSync(path.join(root,item.path))).digest('hex');
    assert.equal(sum,item.sha256);
  }
  const palette=read('palette-world.js');
  assert.ok(!palette.includes('palette-morning-bedroom-sr-v2'));
  assert.ok(!palette.includes("room:'./media/generated/"));
});
test('old studies remain archived, but never used as new canvas backgrounds',()=>{
  const report=JSON.parse(read('docs/PALETTE_MOOD_STUDIES_MANIFEST_20261015.json'));
  assert.equal(report.scenes.length,11);
  for(const image of report.scenes)assert.equal(typeof image.sha256,'string');
});

test('eight independent generated scenery files replace all retired SVG image sources and thumbnails',()=>{
  const win={};load('palette-place-scenes.js',{window:win});
  const scenes=win.PausePlaceScenes;
  assert.equal(scenes.items.length,8);
  const ids=scenes.items.map(item=>item[0]);
  assert.equal(new Set(ids).size,8);
  const urls=ids.map(id=>scenes.imageUrl(id));
  assert.equal(new Set(urls).size,8,'Each scene must have its own bitmap');
  for(const id of ids){
    const expected='./media/palette-scenes/'+id+'.webp';
    assert.equal(scenes.imageUrl(id),expected);
    assert.equal(scenes.thumbnailUrl(id),expected,'Thumbnail must show the same new scene, never an old SVG');
  }
  assert.equal(scenes.imageUrl('unavailable'),'');
  assert.equal(scenes.thumbnailUrl('unavailable'),'');
  const source=read('palette-place-scenes.js');
  assert.ok(!source.includes('data:image/svg+xml'),'Old scenery generators must stay retired');
  const manifest=JSON.parse(read('media/palette-scenes/manifest.json'));
  assert.equal(manifest.length,8);
  assert.deepEqual(manifest.map(s=>s.id).sort(),Array.from(ids).sort());
  const hashes=new Set();
  for(const scene of manifest){
    assert.ok(scene.path.startsWith('media/palette-scenes/') && scene.path.endsWith('.webp'));
    const raw=fs.readFileSync(path.join(root,scene.path));
    assert.equal(raw.subarray(0,4).toString('ascii'),'RIFF');
    assert.equal(raw.subarray(8,12).toString('ascii'),'WEBP');
    assert.equal(raw.length,scene.size);
    assert.equal(require('node:crypto').createHash('sha256').update(raw).digest('hex'),scene.sha256);
    hashes.add(scene.sha256);
    assert.equal(scene.width,960);assert.equal(scene.height,630);
  }
  assert.equal(hashes.size,8,'All eight images must contain unique content');
  assert.ok(read('palette-world.js').includes('./media/palette-scenes/'));
});

test('natural shape marks move subtly, freeze when paused, and preserve mark input',()=>{
  const win={};load('world-art.js',{window:win});
  const brushes=win.PauseWorldArt;
  function trace(type,time,still=false){
    const calls=[],target={};
    const ctx=new Proxy(target,{
      set(o,key,value){o[key]=value;calls.push(['style',key,String(value)]);return true;},
      get(o,key){
        if(key in o)return o[key];
        if(key==='createRadialGradient'||key==='createLinearGradient')
          return (...args)=>{calls.push([key,...args]);return {addColorStop(){}}};
        return (...args)=>{calls.push([key,...args]);};
      }
    });
    const mark={kind:'element',type,x:400,y:300,color:'#a6b88d',size:39,seed:.4,speed:.85};
    const before=JSON.stringify(mark);
    brushes.drawElement(ctx,mark,time,still);
    assert.equal(JSON.stringify(mark),before,'Animation must not mutate saved artwork');
    return JSON.stringify(calls);
  }
  const animated=['tree','wave','leaf','cloud','petal','flower','star','rain','ripples',
    'moon','sun','grass','bird','steam','butterfly','fish','shell','pebble','lantern',
    'dandelion','firefly','paper'];
  for(const type of animated){
    assert.notEqual(trace(type,0),trace(type,2600),type+' lacks visible animated drawing');
    assert.equal(trace(type,0,true),trace(type,2600,true),
      type+' must freeze under pause/reduced motion');
  }
});
test('five worlds have correct geographic visual references',()=>{
 const win={};load('garden-scenes.js',{window:win});
 const sketch=win.PauseGardenScenes;
 assert.equal(sketch.draw('unknown'),'');
 for(const id of ['flowers','farm','park']){
   assert.match(sketch.draw(id),/<svg/);
   assert.ok(sketch.thumbnail(id).startsWith('data:image/svg+xml'));
 }
 assert.notEqual(sketch.draw('flowers'),sketch.draw('farm'));
 assert.notEqual(sketch.draw('farm'),sketch.draw('park'));
 const js=read('garden.js');
 assert.match(js,/scene-03\.webp/); // forest
 assert.match(js,/scene-02\.webp/); // coast
 assert.match(js,/id:'farm'[^]*?image:null/); // no greenhouse pretending to be a field
});

function harness(saved){
 class FakeNode{
   constructor(id){this.id=id;this.value='';this.textContent='';this.innerHTML='';
      this.hidden=false;this.dataset={};this.style={};this.listeners={};
      this.parentElement=null;this.isConnected=true;
      this.classList={add(){},remove(){},toggle(){}};}
   addEventListener(key,fn){this.listeners[key]=fn}
   appendChild(node){node.parentElement=this}
   get firstElementChild(){return this.innerHTML.includes('<svg')?{}:null}
   getBoundingClientRect(){return {left:0,top:0,width:600,height:400}}
   querySelector(selector){if(selector==='.garden-landscape')return el('landscape');return el('child')}
   focus(){}scrollIntoView(){}setPointerCapture(){}releasePointerCapture(){}
   click(){}setAttribute(){}remove(){}insertAdjacentHTML(){}
   closest(){return this}
 }
 const elements=new Map();const el=id=>{
   if(!elements.has(id))elements.set(id,new FakeNode(id));
   return elements.get(id);
 };
 const storage=new Map();if(saved!==null)storage.set('daily-pause-garden-v1',saved);
 const localStorage={getItem:k=>storage.get(k)||null,setItem:(k,v)=>storage.set(k,v)};
 const document={body:new FakeNode('body'),getElementById:el,createElement:()=>new FakeNode('a')};
 const events={};const window={
   addEventListener:(name,fn)=>{events[name]=fn},
   matchMedia:()=>({matches:true}),confirm:()=>true};
 const context={document,window,localStorage,matchMedia:()=>({matches:true}),
   URL:{createObjectURL:()=>'/test',revokeObjectURL(){}},
   setTimeout:(fn)=>{fn();return 1},Blob:class BlobFake{constructor(parts){this.parts=parts}},
   Date,Math,JSON,Number,String,Array,Object,Set,Map,globalThis:{}};
 load('garden-sprites.js',context);load('garden-scenes.js',context);
 load('garden.js',context);
 const click=(id,dataset={})=>{
   const node=new FakeNode(id);node.dataset=dataset;
   el('gardenWorld').listeners.click({target:{closest:()=>node}});
 };
 return {el,storage,click,window,events};
}
test('five worlds and nonpunitive animal/plant interactions persist locally',()=>{
 const h=harness(null);
 const cases=[['flowers','玫瑰'],['farm','稻米'],['forest','松樹'],['coast','馬鞍藤'],['park','榕樹']];
 for(const [id,species] of cases){
   h.click('',{chooseWorld:id});h.el('gardenPlants').value=species;
   h.click('gardenAddPlant');
   assert.ok(h.el('gardenResidentsStage').innerHTML.includes('garden-stage-plant'));
   assert.equal((h.el('gardenHotspots').innerHTML.match(/data-garden-hotspot/g)||[]).length,3);
 }
 const items=JSON.parse(h.storage.get('daily-pause-garden-v1')).items;
 assert.equal(items.length,5);
 assert.deepEqual(items.map(x=>x.species),cases.map(x=>x[1]));
 assert.equal(h.el('gardenRecovery').hidden,true);
 h.click('',{gardenLight:'night'});
 assert.equal(JSON.parse(h.storage.get('daily-pause-garden-v1')).lighting.park,'night');
});

test('broken save is preserved exactly until explicitly restored or discarded',()=>{
 const broken='{"invalid":';
 const h=harness(broken);
 assert.equal(h.storage.get('daily-pause-garden-v1'),broken);
 assert.equal(h.el('gardenRecovery').hidden,false);
 h.click('',{chooseWorld:'flowers'});h.el('gardenPets').value='貓';
 h.click('gardenAddPet');
 assert.equal(h.storage.get('daily-pause-garden-v1'),broken);
});

test('private care text is never persisted in a garden record',()=>{
 const h=harness(null);
 h.click('',{chooseWorld:'flowers'});h.el('gardenPets').value='貓';
 h.click('gardenAddPet');
 const item=JSON.parse(h.storage.get('daily-pause-garden-v1')).items[0];
 h.click('',{resident:item.id});
 h.el('gardenWords').value='私人文字不應該儲存';
 h.click('',{gardenAction:'feed'});
 assert.ok(!h.storage.get('daily-pause-garden-v1').includes('私人文字'));
});

test('mobile and backup controls present and reduced-motion style exists',()=>{
 const html=read('index.html'),css=read('garden.css');
 for(const id of ['gardenGate','gardenWorldChoices','gardenBackup','gardenImport',
     'gardenRecovery','gardenExportRecovery','gardenLightChoices',
     'worldExportEditable','worldImportEditable','worldImportFile']){
   assert.ok(html.includes('id="'+id+'"'),id);
 }
 assert.match(css,/prefers-reduced-motion/);
 assert.match(css,/garden-backdrop\.garden-has-original-art/);
});
test('all five worlds have unique native motion and approved scene decoration sets',()=>{
 const win={};
 load('garden-motion.js',{window:win});
 load('garden-decor.js',{window:win});
 assert.equal(Object.keys(win.PauseGardenMotion).includes('render'),true);
 const worlds=['flowers','farm','forest','coast','park'];
 const allMotion=worlds.map(key=>win.PauseGardenMotion.render(key));
 assert.equal(new Set(allMotion).size,5);
 for(const key of worlds){
   assert.ok(allMotion[worlds.indexOf(key)].length>150);
   const list=win.PauseGardenDecor.worlds[key];
   assert.equal(list.length,4,key+' should have four curated decorations');
   for(const type of list){
     assert.ok(win.PauseGardenDecor.markup({type}).includes('<svg'),type);
   }
 }
});

test('offline shell includes current versioned scripts and verified assets',()=>{
 const html=read('index.html'),sw=read('sw.js');
 const match=sw.match(/const CORE=(\[[\s\S]*?\]);/);
 assert.ok(match,'offline cache manifest must be an explicit JSON array');
 const core=JSON.parse(match[1]);
 const assets=[...html.matchAll(/<(?:script|link)\b[^>]*(?:src|href)="(\.\/[^"]+)"/g)]
   .map(m=>m[1]);
 for(const src of [...assets,'./manifest.webmanifest']){
   assert.ok(core.includes(src),'Stale or absent offline path: '+src);
 }
 for(const asset of core){
   assert.ok(asset.startsWith('./'),'Only same-scope local resources may be precached');
   const local=asset.slice(2).split('?')[0];
   assert.ok(!local.includes('..')&&!local.includes(':'),'Unsafe precache path: '+asset);
   assert.ok(fs.existsSync(path.join(root,local)),'Missing asset: '+local);
 }
});

test('background micro-motion belongs to the background, not the user artwork',()=>{
  const win={};load('palette-background-breath.js',{window:win});
  const breath=win.PauseCanvasBreathe;
  assert.deepEqual(Object.keys(breath.profiles).sort(),
    ['forest','ocean','room','living','cafe','park','street','mountain'].sort());
  assert.ok(read('palette-world.js').includes('./media/palette-scenes/'));
  const trace=(scene,mood,t)=>{
    const ops=[];
    const ctx={
      save(){},restore(){},translate(x,y){ops.push(['translate',x,y])},
      scale(x,y){ops.push(['scale',x,y])},beginPath(){},arc(){},
      moveTo(x,y){ops.push(['move',x,y])},
      quadraticCurveTo(x,y,z){ops.push(['curve',x,y,z])},
      fill(){},stroke(){},
      createRadialGradient(){return {addColorStop(at,c){ops.push(['stop',at,c])}}}
    };
    breath.paint(ctx,scene,mood,t);
    return JSON.stringify(ops);
  };
  for(const scene of ['forest','ocean','room','living','cafe','park','street','mountain','paper']){
    assert.notEqual(trace(scene,'安靜',0),trace(scene,'安靜',12000),
      scene+' must have gentle native background motion');
    assert.equal(trace(scene,'安靜',0),trace(scene,'安靜',0),
      scene+' must be exactly deterministic when paused or reduced motion');
  }
  assert.equal(trace('blank','安靜',12000),'[]','Blank canvas stays blank');
});
