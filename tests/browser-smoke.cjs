'use strict';
// Browser smoke test: optional Playwright job for desktop Chrome and iPhone-like WebKit.
const {chromium,webkit}=require('playwright');
const http=require('node:http');
const fs=require('node:fs/promises');
const path=require('node:path');
const assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..');
const types={'.html':'text/html;charset=utf-8','.js':'text/javascript;charset=utf-8',
 '.css':'text/css;charset=utf-8','.svg':'image/svg+xml','.webp':'image/webp','.jpg':'image/jpeg',
 '.png':'image/png','.json':'application/json','.mp3':'audio/mpeg','.webmanifest':'application/manifest+json'};
const server=http.createServer(async(req,res)=>{
 try{
  const pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);
  const full=path.resolve(root,'.'+pathname);
  if(!full.startsWith(root+path.sep)&&full!==root){res.writeHead(403);res.end();return}
  const file=await fs.stat(full).then(s=>s.isDirectory()?path.join(full,'index.html'):full);
  const contents=await fs.readFile(file);
  res.writeHead(200,{'Content-Type':types[path.extname(file)]||'application/octet-stream',
      'Content-Length':contents.length,'Cache-Control':'no-store'});
  res.end(contents);
 }catch(_){res.writeHead(404);res.end();}
});
(async()=>{
 await new Promise((resolve)=>server.listen(0,'127.0.0.1',resolve));
 const port=server.address().port;
 const scenarios=[
  {name:'desktop Chromium',engine:chromium,viewport:{width:1280,height:900},touch:false},
  {name:'mobile WebKit',engine:webkit,viewport:{width:390,height:844},touch:true}
 ];
 let failed=false;
 for(const scenario of scenarios){
  let browser;
  try{
    browser=await scenario.engine.launch({headless:true});
    const context=await browser.newContext({viewport:scenario.viewport,isMobile:scenario.touch,
      hasTouch:scenario.touch,reducedMotion:'reduce',acceptDownloads:true});
    const page=await context.newPage();
    const errors=[];
    page.on('pageerror',e=>errors.push(e.message));
    await page.goto('http://127.0.0.1:'+port+'/',{waitUntil:'load',timeout:30000});
    const manifest=await page.locator('link[rel="manifest"]').getAttribute('href');
    assert.equal(manifest,'./manifest.webmanifest');
    assert.equal(await page.locator('link[rel="apple-touch-icon"]').count(),1);
    const icon=await page.evaluate(()=>new Promise(resolve=>{
      const image=new Image();
      image.onload=()=>resolve([image.naturalWidth,image.naturalHeight]);
      image.onerror=()=>resolve([]);
      image.src='./icons/today-pause-180.png';
    }));
    assert.deepEqual(icon,[180,180],'iPhone home-screen icon must be a valid 180x180 PNG');
    const install=await page.evaluate(async()=>{
      if(!('serviceWorker' in navigator))return 'not-supported';
      await navigator.serviceWorker.ready;
      return 'registered';
    });
    assert.ok(['registered','not-supported'].includes(install));

    await page.waitForTimeout(500);
    if(await page.locator('#welcomeModal').isVisible())
      await page.locator('#closeWelcome').click();
    await page.locator('[data-view="palette"]').click();
    await page.locator('#worldMoods button').first().waitFor();
    assert.equal(await page.locator('#worldMoods [data-mood]').count(),24);
    assert.equal(await page.locator('[data-brush]').count(),8);
    const rendered=await page.evaluate(()=>new Promise(resolve=>{
      const image=new Image();
      image.onload=()=>resolve(image.naturalWidth>0&&image.naturalHeight>0);
      image.onerror=()=>resolve(false);
      image.src=window.PauseMoodScenes.imageUrl('安靜');
    }));
    assert.ok(rendered,'SVG mood illustration must load as a real image');
    await fs.mkdir(path.join(__dirname,'screenshots'),{recursive:true});
    const screenshotId=scenario.name.toLowerCase().replace(/[^a-z]+/g,'-');
    await page.locator('#worldCanvas').screenshot({
      path:path.join(__dirname,'screenshots',screenshotId+'-mood-canvas.png')
    });
    const living=await page.evaluate(()=>new Promise(resolve=>{
      const image=new Image();
      image.onload=()=>resolve({ok:image.naturalWidth===960,distinct:
        window.PauseMoodScenes.livingRoomSvg()!==window.PauseMoodScenes.svg('安靜')});
      image.onerror=()=>resolve({ok:false,distinct:false});
      image.src=window.PauseMoodScenes.livingRoomUrl();
    }));
    assert.ok(living.ok&&living.distinct,'Living room must render separately from the bedroom');
    await page.locator('[data-world-tab="scene"]').click();
    await page.locator('[data-scene="living"]').click();
    await page.locator('[data-mood="安靜"]').click();
    await page.locator('[data-mood="孤單"]').click();
    const png=await page.locator('#worldCanvas').evaluate(c=>c.toDataURL('image/png'));
    assert.ok(png.startsWith('data:image/png;base64,'));

    // Palette editing regression: object mode must never create a brush stroke;
    // brush mode must draw even over an existing furniture hitbox.
    await page.locator('[data-world-tab="object"]').click();
    await page.locator('[data-prop="cup"]').click();
    const stage=page.locator('#worldCanvas');
    await stage.scrollIntoViewIfNeeded();
    let bounds=await stage.boundingBox();
    const pos={x:bounds.x+bounds.width*.365,y:bounds.y+bounds.height*.57};
    await page.mouse.move(pos.x,pos.y);
    await page.mouse.down();
    await page.mouse.move(pos.x+Math.min(45,bounds.width*.12),pos.y+10,{steps:7});
    await page.mouse.up();
    await page.locator('[data-world-tab="brush"]').click();
    await page.locator('[data-brush="pencil"]').click();
    await stage.scrollIntoViewIfNeeded();
    bounds=await stage.boundingBox();
    const draw={x:bounds.x+bounds.width*.365,y:bounds.y+bounds.height*.57};
    await page.mouse.move(draw.x,draw.y);
    await page.mouse.down();
    await page.mouse.move(draw.x+Math.min(38,bounds.width*.1),draw.y+12,{steps:8});
    await page.mouse.up();
    await page.locator('[data-world-tab="scene"]').click();
    await page.locator('[data-scene="sea"]').click();
    assert.equal(await page.locator('[data-scene="sea"]').getAttribute('aria-pressed'),'true');
    await page.locator('[data-scene-default]').click();
    assert.equal(await page.locator('[data-scene-default]').getAttribute('aria-pressed'),'true');
    const [backupDownload]=await Promise.all([
      page.waitForEvent('download'),page.locator('#worldExportEditable').click()
    ]);
    const backup=JSON.parse(await fs.readFile(await backupDownload.path(),'utf8'));
    assert.equal(backup.canvases.length,24);
    const lonely=backup.canvases.find(m=>m.mood==='孤單');
    assert.equal(lonely.props.length,1,'Furniture must stay editable after landscape switch');
    assert.equal(lonely.marks.length,1,'Object mode must not paint; brush must paint over furniture');
    assert.equal(lonely.customScene,false,'Reset should restore the independent mood preset');
    await page.locator('[data-view="garden"]').click();
    assert.equal(await page.locator('#garden .pause-soundbar').count(),1,
      'The garden must share the existing playback and offline sound controls');
    await page.locator('#gardenSkipGate').click();
    await page.locator('#gardenWorldChoices').waitFor();
    assert.equal(await page.locator('[data-choose-world]').count(),5);
    // Environmental motion must be specific to the chosen place.
    const worldMotions=[
      ['flowers','.garden-ambient-petal',11],
      ['farm','.garden-ambient-stem',9],
      ['forest','.garden-ambient-sunray',4],
      ['coast','.garden-ambient-wave',5],
      ['park','.garden-ambient-ripple',4]
    ];
    for(let i=0;i<worldMotions.length;i++){
      const [world,selector,count]=worldMotions[i];
      if(i>0)await page.locator('#gardenChangeWorld').click();
      await page.locator('[data-choose-world="'+world+'"]').click();
      assert.equal(await page.locator('#gardenSceneFX').getAttribute('data-world'),world);
      assert.equal(await page.locator(selector).count(),count,world+' has wrong environment motion');
      if(world==='flowers'){
        await page.locator('[data-scene-variant="greenhouse"]').click();
        assert.ok((await page.locator('#gardenBackdrop').getAttribute('style')).includes('scene-11.webp'));
        await page.locator('[data-scene-variant="open"]').click();
        assert.equal(await page.locator('.garden-environment-art').count(),1);
      }
      if(world==='park'){
        await page.locator('[data-scene-variant="gardenpond"]').click();
        assert.ok((await page.locator('#gardenBackdrop').getAttribute('style')).includes('scene-08.webp'));
        await page.locator('[data-scene-variant="open"]').click();
        assert.equal(await page.locator('.garden-environment-art').count(),1);
      }
    }
    await page.locator('#gardenChangeWorld').click();
    await page.locator('[data-choose-world="farm"]').click();
    await page.locator('.garden-environment-art').waitFor();
    await page.locator('#gardenPlants').selectOption('稻米');
    await page.locator('#gardenAddPlant').click();
    assert.equal(await page.locator('[data-stage-resident]').count(),1);
    await page.locator('#gardenDecorTypes').selectOption('scarecrow');
    await page.locator('#gardenAddDecor').click();
    assert.equal(await page.locator('[data-stage-decor]').count(),1);
    const decoration=page.locator('[data-stage-decor]').first();
    const previousX=await page.evaluate(()=>{
      const data=JSON.parse(localStorage.getItem('daily-pause-garden-v1'));
      return data.decorations[0].x;
    });
    await decoration.focus();
    await decoration.press('ArrowRight');
    const nextX=await page.evaluate(()=>{
      const data=JSON.parse(localStorage.getItem('daily-pause-garden-v1'));
      return data.decorations[0].x;
    });
    assert.ok(nextX>previousX,'Decor furniture keyboard movement should persist');
    await page.locator('.garden-landscape').screenshot({
      path:path.join(__dirname,'screenshots',screenshotId+'-farm-scene.png')
    });
    await page.locator('[data-garden-hotspot="crop"]').click();
    assert.ok((await page.locator('#gardenExploreMessage').textContent()).length>5);
    await page.locator('[data-self-care="water"]').click();
    assert.ok((await page.locator('#gardenSelfCareFeedback').textContent()).includes('喝一點水'),
      'Optional self-care needs a visible response');
    const storedBefore=await page.evaluate(()=>localStorage.getItem('daily-pause-garden-v1'));
    await page.locator('[data-self-care="feelings"]').click();
    const storedAfter=await page.evaluate(()=>localStorage.getItem('daily-pause-garden-v1'));
    assert.equal(storedAfter,storedBefore,'Self-care selections must never be tracked');
    await page.locator('[data-garden-light="night"]').click();
    assert.equal(await page.locator('.garden-landscape').getAttribute('data-light'),'night');
    await page.reload({waitUntil:'load'});
    await page.waitForTimeout(500);
    if(await page.locator('#welcomeModal').isVisible())
      await page.locator('#closeWelcome').click();
    await page.locator('[data-view="garden"]').click();
    await page.locator('#gardenSkipGate').click();
    await page.locator('[data-choose-world="farm"]').click();
    assert.equal(await page.locator('[data-stage-resident]').count(),1);
    assert.equal(await page.locator('[data-stage-decor]').count(),1,'Decoration must survive reload');
    await page.locator('[data-resident]').first().click();
    assert.equal(await page.locator('[data-garden-action="harvest"]').count(),0,
      'Freshly planted crops must not be harvestable immediately');
    // Simulate a visitor returning a week later; never require a daily login streak.
    await page.evaluate(()=>{
      const key='daily-pause-garden-v1';
      const state=JSON.parse(localStorage.getItem(key));
      state.items[0].createdAt=Date.now()-9*86400000;
      localStorage.setItem(key,JSON.stringify(state));
    });
    await page.reload({waitUntil:'load'});
    await page.waitForTimeout(500);
    if(await page.locator('#welcomeModal').isVisible())
      await page.locator('#closeWelcome').click();
    await page.locator('[data-view="garden"]').click();
    await page.locator('#gardenSkipGate').click();
    await page.locator('[data-choose-world="farm"]').click();
    await page.locator('[data-resident]').first().click();
    await page.locator('[data-garden-action="harvest"]').click();
    const grown=await page.evaluate(()=>{
      const item=JSON.parse(localStorage.getItem('daily-pause-garden-v1')).items[0];
      return {harvests:item.harvests,lastHarvestAt:item.lastHarvestAt};
    });
    assert.equal(grown.harvests,1,'Mature plant must record harvest');
    assert.ok(grown.lastHarvestAt>0);
    assert.equal(await page.locator('[data-garden-action="harvest"]').count(),0,
      'Plant must need time to regrow after harvest');
    const width=await page.evaluate(()=>({
      scrollWidth:document.documentElement.scrollWidth,viewport:window.innerWidth
    }));
    assert.ok(width.scrollWidth<=width.viewport+3,
      'Page must not horizontally overflow: '+JSON.stringify(width));

    if(scenario.engine===chromium){
      const offline=await page.evaluate(async()=>{
        const reg=await navigator.serviceWorker.ready;
        if(!reg.active)throw Error('No active service worker');
        const track=window.PauseSound.tracks.find(t=>t.src.includes('first-light.mp3'));
        if(!track)throw Error('Local track missing');
        const saved=await window.PauseOfflineMusic.save(track);
        if(!saved.ok||saved.size<1000)throw Error('Offline music not cached');
        return saved.size;
      });
      assert.ok(offline>1000);
      await page.reload({waitUntil:'load'});
      await page.waitForTimeout(500);
      await context.setOffline(true);
      const result=await page.evaluate(async()=>{
        const audio=await fetch('./media/audio/first-light.mp3',{
          headers:{Range:'bytes=0-1023'}
        });
        return {status:audio.status,length:(await audio.arrayBuffer()).byteLength,
          range:audio.headers.get('Content-Range')};
      });
      assert.equal(result.status,206,'Offline audio must support HTML5 Range');
      assert.equal(result.length,1024);
      assert.ok(result.range?.startsWith('bytes 0-1023/'));
      await page.reload({waitUntil:'domcontentloaded'});
      assert.ok(await page.locator('.site-header').count()>0,'Offline app shell must render');
      await context.setOffline(false);
    }
        assert.deepEqual(errors,[],'No browser page errors expected');
    await context.close();
    console.log('PASS',scenario.name,'24 moods, scene image, drawing export, farm interaction, persistent data, no overflow');
  }catch(e){
    console.error('FAIL',scenario.name,e.stack||e);failed=true;
  }finally{if(browser)await browser.close()}
 }
 server.close();
 if(failed)process.exitCode=1;
})().catch(e=>{console.error(e);server.close();process.exitCode=1});
