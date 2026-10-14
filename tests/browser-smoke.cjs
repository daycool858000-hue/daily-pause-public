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
    const living=await page.evaluate(()=>new Promise(resolve=>{
      const image=new Image();
      image.onload=()=>resolve({ok:image.naturalWidth===960,distinct:
        window.PauseMoodScenes.livingRoomSvg()!==window.PauseMoodScenes.svg('安靜')});
      image.onerror=()=>resolve({ok:false,distinct:false});
      image.src=window.PauseMoodScenes.livingRoomUrl();
    }));
    assert.ok(living.ok&&living.distinct,'Living room must render separately from the bedroom');
    await page.locator('[data-scene="living"]').click();
    await page.locator('[data-mood="安靜"]').click();
    await page.locator('[data-mood="孤單"]').click();
    const png=await page.locator('#worldCanvas').evaluate(c=>c.toDataURL('image/png'));
    assert.ok(png.startsWith('data:image/png;base64,'));
    await page.locator('[data-view="garden"]').click();
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
    await page.locator('[data-garden-hotspot="crop"]').click();
    assert.ok((await page.locator('#gardenExploreMessage').textContent()).length>5);
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
