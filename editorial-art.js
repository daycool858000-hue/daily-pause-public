// Twelve original, procedural editorial illustrations, composed locally.
// No external assets, fonts, generated-image services, or visitor content are used.
(function(){
  const scenes=['room','sea','garden','rain','night','hill','lake','balcony','library','cloud','sunrise','island'];
  const arrangements=[
    [['book',.25,.77,.9],['cup',.72,.65,.7]], [['umbrella',.19,.72,.7],['shell',.75,.83,.7]],
    [['plant',.2,.73,1.2],['chair',.78,.81,.75]], [['lamp',.76,.73,.75],['book',.33,.82,.6]],
    [['candle',.24,.82,.8],['cat',.77,.8,.72]], [['basket',.2,.84,.65],['plant',.84,.79,.8]],
    [['teapot',.25,.8,.75],['book',.73,.79,.68]], [['chair',.24,.83,.86],['plant',.75,.75,.75]],
    [['book',.2,.77,.82],['lamp',.77,.76,.75]], [['letter',.25,.78,.75],['cup',.78,.81,.68]],
    [['notebook',.24,.8,.7],['vase',.8,.77,.8]], [['basket',.22,.85,.7],['plant',.77,.8,.95]]
  ];
  const cache=new Map();
  function indexFor(item) {
    const text=(typeof item==='string'?item:(item.title||''))+'|'+(typeof item==='string'?'':(item.category||''));
    let hash=0;for(let i=0;i<text.length;i++)hash=(hash*31+text.charCodeAt(i))>>>0;
    return hash%scenes.length;
  }
  function imageFor(item) {
    const key='scene-'+indexFor(item);
    if(cache.has(key))return cache.get(key);
    if(!window.PauseWorldArt)return'';
    const canvas=document.createElement('canvas');canvas.width=720;canvas.height=472;
    const ctx=canvas.getContext('2d');if(!ctx)return'';
    const art=window.PauseWorldArt;
    ctx.save();ctx.scale(canvas.width/art.W,canvas.height/art.H);
    const i=indexFor(item);art.drawScene(ctx,scenes[i],0);
    for(const [type,x,y,scale] of arrangements[i])art.drawProp(ctx,{type,x:x*art.W,y:y*art.H,scale,angle:0},0);
    ctx.restore();
    const src=canvas.toDataURL('image/png');cache.set(key,src);
    return src;
  }
  function markup(item,forReader=false){
    const src=imageFor(item);if(!src)return'';
    const alt='本站原創場景插畫：'+scenes[indexFor(item)]+'的生活空間與自然物件';
    const escape=s=>String(s).replace(/[&"<]/g,c=>({'&':'&amp;','"':'&quot;','<':'&lt;'}[c]));
    if(forReader)return'<figure class="editorial-reader-image"><img src="'+src+'" alt="'+escape(alt)+'" /><figcaption>今日一息原創場景插畫，供閱讀陪伴與氣氛呈現</figcaption></figure>';
    return'<div class="editorial-thumb"><img loading="lazy" src="'+src+'" alt="'+escape(alt)+'"></div>';
  }
  window.PauseEditorialArt={imageFor,markup,sceneFor:item=>scenes[indexFor(item)]};
})();