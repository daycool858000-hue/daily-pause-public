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
    await page.locator('[data-view="palette"]').click();
    await page.locator('#worldMoods button').first().waitFor();
    assert.equal(await page.locator('[data-mood]').count(),24);
    assert.equal(await page.locator('[data-brush]').count(),8);
    const rendered=await page.evaluate(()=>new Promise(resolve=>{
      const image=new Image();
      image.onload=()=>resolve(image.naturalWidth>0&&image.naturalHeight>0);
      image.onerror=()=>resolve(false);
      image.src=window.PauseMoodScenes.imageUrl('安靜');
    }));
    assert.ok(rendered,'SVG mood illustration must load as a real image');
    await page.locator('[data-mood="安靜"]').click();
    await page.locator('[data-mood="孤單"]').click();
    const png=await page.locator('#worldCanvas').evaluate(c=>c.toDataURL('image/png'));
    assert.ok(png.startsWith('data:image/png;base64,'));
    await page.locator('[data-view="garden"]').click();
    await page.locator('#gardenSkipGate').click();
    await page.locator('#gardenWorldChoices').waitFor();
    assert.equal(await page.locator('[data-choose-world]').count(),5);
    await page.locator('[data-choose-world="farm"]').click();
    await page.locator('.garden-environment-art').waitFor();
    await page.locator('#gardenPlants').selectOption('稻米');
    await page.locator('#gardenAddPlant').click();
    assert.equal(await page.locator('[data-stage-resident]').count(),1);
    await page.locator('[data-garden-hotspot="crop"]').click();
    assert.ok((await page.locator('#gardenExploreMessage').textContent()).length>5);
    await page.locator('[data-garden-light="night"]').click();
    assert.equal(await page.locator('.garden-landscape').getAttribute('data-light'),'night');
    await page.reload({waitUntil:'load'});
    await page.locator('[data-view="garden"]').click();
    await page.locator('#gardenSkipGate').click();
    await page.locator('[data-choose-world="farm"]').click();
    assert.equal(await page.locator('[data-stage-resident]').count(),1);
    const width=await page.evaluate(()=>({
      scrollWidth:document.documentElement.scrollWidth,viewport:window.innerWidth
    }));
    assert.ok(width.scrollWidth<=width.viewport+3,
      'Page must not horizontally overflow: '+JSON.stringify(width));
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
