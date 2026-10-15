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
      /^\.\/media\/generated\/(?:scene-\d{2}|palette-[a-z-]+-v1)\.webp$/.test(url),
      name+' must use an authored SVG or a bundled generated WebP scene');
   if(url.startsWith('./')){
     assert.ok(fs.existsSync(path.join(root,url.slice(2))),name+' scene file missing: '+url);
   }
   assert.ok(fx.byName[name],name+' lacks animation');
 }
});


test('all photograph-backed emotions have distinct existing local assets',()=>{
 const win={};load('mood-scenery.js',{window:win});
 const art=win.PauseMoodScenes.realisticMoodScenes;
 const urls=Object.values(art);
 assert.ok(urls.length>=11,'Existing photo-backed emotions unexpectedly lost');
 assert.equal(new Set(urls).size,urls.length,
   'Different emotions must not silently reuse the same photograph');
 for(const url of urls){
   assert.match(url,/^\.\/media\/generated\/(?:scene-\d{2}|palette-[a-z-]+-v1)\.webp$/);
   assert.ok(fs.existsSync(path.join(root,url.slice(2))),url+' missing');
 }
});

test('draft indoor scenes remain standalone and correctly match indoor labels',()=>{
 const win={};load('mood-scenery.js',{window:win});
 const mappings=[
   ['安靜','palette-morning-bedroom-v1.webp'],
   ['想被陪著','palette-warm-living-room-v1.webp'],
   ['想哭','palette-rain-window-v1.webp'],
   ['想躲起來','palette-quiet-study-v1.webp']
 ];
 const names=new Set();
 for(const [mood,file] of mappings){
   const url=win.PauseMoodScenes.imageUrl(mood);
   assert.equal(url,'./media/generated/'+file);
   assert.ok(fs.existsSync(path.join(root,'media/generated',file)),mood+' background asset missing');
   names.add(url);
 }
 assert.equal(names.size,4,'Indoor scenes must remain visually independent');
 const palette=read('palette-world.js');
 for(const [scene,file] of [
   ['room','palette-morning-bedroom-v1.webp'],
   ['living','palette-warm-living-room-v1.webp'],
   ['rain','palette-rain-window-v1.webp'],
   ['library','palette-quiet-study-v1.webp']]){
   assert.ok(palette.includes(scene+':\'./media/generated/'+file+'\''));
 }
});

test('mood photo assignments never mislabel an exterior as an indoor room',()=>{
 const win={};
 load('mood-scenery.js',{window:win});
 const scenes=win.PauseMoodScenes;
 // No photograph of a garden, flower or greenhouse can stand in for a
 // room, study or the unique fern trail promised by its composition.
 for(const name of ['安心','溫柔','想重新開始','好奇']){
   assert.ok(scenes.imageUrl(name).startsWith('data:image/svg+xml;charset=utf-8,'),
     name+' must await matching original scenery rather than use a mislabeled photo');
 }
 for(const name of ['孤單','想念','想看海','想接近自然']){
   assert.match(scenes.imageUrl(name),/^\.\/media\/generated\/scene-\d{2}\.webp$/);
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
