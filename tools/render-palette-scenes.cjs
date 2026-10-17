'use strict';
// Render original painted SVG locations once in Chromium instead of running the
// SVG turbulence/displacement filter every time a visitor changes scenery.
const {chromium}=require('playwright');
const fs=require('node:fs/promises');
const path=require('node:path');
const crypto=require('node:crypto');
const output=path.resolve(__dirname,'..','media','palette-scenes');
const subjects=['forest','ocean','room','living','cafe','park','street','mountain'];
(async()=>{
 await fs.mkdir(output,{recursive:true});
 const browser=await chromium.launch({headless:true});
 try {
  const page=await browser.newPage({viewport:{width:960,height:630},reducedMotion:'reduce'});
  await page.goto('about:blank');
  await page.addScriptTag({path:path.resolve(__dirname,'..','palette-place-scenes.js')});
  const manifest=[];
  for(const id of subjects){
   const base64=await page.evaluate(async sceneId=>{
    const source=window.PausePlaceScenes.imageUrl(sceneId);
    if(!source)throw Error('Missing source scenery: '+sceneId);
    const image=new Image();
    image.src=source;
    await image.decode();
    const c=document.createElement('canvas');
    c.width=960;c.height=630;
    const ctx=c.getContext('2d',{alpha:false});
    ctx.fillStyle='#f8f2e9';ctx.fillRect(0,0,c.width,c.height);
    ctx.drawImage(image,0,0,c.width,c.height);
    const data=c.toDataURL('image/webp',.85);
    if(!data.startsWith('data:image/webp;base64,'))throw Error('Browser WebP export unavailable');
    return data.slice('data:image/webp;base64,'.length);
   },id);
   const bin=Buffer.from(base64,'base64');
   if(bin.length<3000||bin.length>850000)throw Error('Unexpected painted scene size: '+id+' '+bin.length);
   const file=id+'.webp';
   await fs.writeFile(path.join(output,file),bin);
   manifest.push({id,path:'media/palette-scenes/'+file,sha256:crypto.createHash('sha256').update(bin).digest('hex'),size:bin.length,width:960,height:630});
   console.log(id,bin.length,manifest[manifest.length-1].sha256);
  }
  await fs.writeFile(path.join(output,'manifest.json'),JSON.stringify(manifest,null,2)+'\n');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1});
