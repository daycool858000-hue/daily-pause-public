// Emotion Palette v2 — handmade scenes, independent natural elements and quiet presence.
// All state is in memory. No network calls, analytics, or diagnoses.
(function () {
  'use strict';
  const $=id=>document.getElementById(id);
  const moods=[
    ['安靜','room','微光停在房間裡。','☕','#c6a18d'],['疲倦','rain','外面的雨替屋內留了安靜。','☁','#9aa9b2'],
    ['悶住','cloud','窗外仍有空氣在流動。','◌','#b7bbc3'],['混亂','hill','風可以先吹過山坡。','≈','#a6b3aa'],
    ['想哭','rain','雨聲不要求你解釋。','☂','#94a9b9'],['孤單','night','燈還亮著，你可以待在這裡。','☾','#8499b4'],
    ['想被陪著','room','這張椅子為你留著。','♡','#d3aa8a'],['想躲起來','library','角落裡有自己的距離。','▤','#aa9b8c'],
    ['煩躁','balcony','風吹過陽台，沒有催促。','↝','#b49c8c'],['害怕','room','門和窗都能依自己的步調打開。','⌂','#cab8a7'],
    ['想念','lake','有些想念像水面，會慢慢散開。','○','#a6b5b5'],['心裡很滿','garden','花園留有尚未種滿的角落。','❀','#b8aa9b'],
    ['希望','sunrise','晨光總是從邊緣慢慢走進來。','☼','#d9b38a'],['期待','balcony','遠方的風剛好吹過。','✦','#dcb595'],
    ['放空','cloud','雲沒有要趕去哪裡。','☁','#b8c3c7'],['好奇','garden','沿著小路，看看下一片葉子。','✳','#95aa90'],
    ['安心','library','書頁翻到這裡就好。','⌑','#c5ab94'],['溫柔','room','桌上的茶還溫著。','✿','#d8b8a5'],
    ['想重新開始','sunrise','今天可以從一扇窗開始。','↗','#d8bc96'],['想看海','sea','潮水來去，不催你說話。','≈','#8caeb7'],
    ['想接近自然','garden','把目光借給一棵樹。','♧','#88a18d'],['需要勇氣','hill','路很長，也有停下的地方。','△','#c0aa93'],
    ['想慢一點','lake','湖面有自己的速度。','〜','#9ebbb7'],['想暖一點','room','有一盞燈為你亮著。','☀','#d2a780']
  ];
  const scenes=[
    ['room','晨光房間','窗光、茶與植物'],['living','溫暖客廳','沙發、地毯、桌燈與綠植'],['sea','海邊','潮線與海風'],['rain','窗邊雨天','雨線與木桌'],
    ['garden','小花園','草葉與細花'],['night','月光夜晚','夜色與微燈'],['island','慢慢的小島','海面與山影'],
    ['balcony','黃昏陽台','藤椅與遠方'],['hill','霧中的山坡','山線與老樹'],
    ['lake','湖邊','水面與山影'],['library','安靜書房','閱讀與溫熱茶氣'],
    ['cloud','雲上','柔軟的空氣'],['sunrise','初醒時','窗與第一道光'],['blank','空白畫布','暖白紙張，自由創作']
  ];
  const elements=[
    ['tree','樹木','♧'],['wave','海浪','≈'],['cloud','雲','☁'],['leaf','葉片','♧'],
    ['flower','小花','✿'],['petal','飄落花瓣','❀'],['star','星光','✧'],['rain','細雨','☂'],
    ['ripples','水波','◌'],['grass','草叢','〃'],['bird','飛鳥','⌁'],['steam','蒸氣','♨'],
    ['butterfly','蝴蝶','⋈'],['fish','小魚','⌁'],['moon','月亮','☾'],['sun','暖陽','☼'],
    ['shell','貝殼','◡'],['pebble','石頭','●'],['lantern','燈火','✦'],
    ['dandelion','蒲公英','✳'],['firefly','螢光','·'],['paper','小紙條','▤']
  ];
  const props=[
    ['cup','茶杯','☕'],['mug','馬克杯','◡'],['teapot','茶壺','♨'],['glass','玻璃杯','◌'],
    ['bottle','水瓶','◫'],['book','一本書','▣'],['notebook','筆記本','▤'],['letter','信封','✉'],
    ['frame','相框','▢'],['painting','小畫作','▧'],['plant','盆栽','♧'],['vase','花瓶','❀'],
    ['flowerpot','小花盆','✿'],['lamp','桌燈','☀'],['candle','蠟燭','✦'],['lantern','提燈','◉'],
    ['sofa','沙發','▰'],['chair','椅子','⌑'],['cushion','靠枕','▱'],['pillow','枕頭','▬'],
    ['blanket','毛毯','▤'],['rug','地毯','▭'],['bed','床','▰'],['table','木桌','▱'],
    ['desk','書桌','▤'],['shelf','書架','▥'],['basket','籃子','▣'],['radio','收音機','◉'],
    ['clock','時鐘','◷'],['music','播放器','♫'],['window','窗','▢'],['curtain','窗簾','▥'],
    ['fruit','水果盤','●'],['cat','小貓','♣'],['umbrella','雨傘','☂']
  ];
  const swatches=['#b78072','#e0b08d','#f0d7ae','#b7c6ad','#799f96','#78aaba','#6b8298','#77718b','#c2a5ad','#9c776a','#dac8b0','#f6eadb'];
  const notes=['我在這裡。','可以只看著，不必做什麼。','這裡沒有完成期限。','今天畫到這裡也可以。','你可以換一種顏色。','沒有誰會替你的作品打分數。','想停一下，就停一下。','可以留一點空白。'];
  function init() {
    const root=$('paletteWorld'), canvas=$('worldCanvas'),wrap=$('worldStage'); if(!root||!canvas)return;
    const ctx=canvas.getContext('2d',{alpha:false}); if(!ctx)return;
    const art=window.PauseWorldArt; if(!art)return;
    const W=art.W,H=art.H, motionPreference=matchMedia('(prefers-reduced-motion: reduce)');
    let reduce=motionPreference.matches;
    const model={mood:'安靜',scene:'room',marks:[],props:[],color:'#b78072',tool:'pencil',size:1,velocity:.5,paused:false,selected:null,customScene:false};
    const effects=['light','mist','breeze','mist','rain','fireflies','light','light','breeze','light','ripples','petals',
      'sparkle','breeze','mist','leaves','light','petals','sparkle','ripples','leaves','breeze','ripples','light'];
    let activeTab='brush',pointer=null,frames=null,lastMoment=0;
    let lastBrush='pencil',lastElement='leaf';
    const brushTools=[
      ['pencil','鉛筆'],['ink','細線'],['wash','水彩'],['crayon','蠟筆'],
      ['pastel','粉彩'],['marker','麥克筆'],['glow','柔光筆'],['eraser','橡皮擦']
    ];
    const brushTypes=new Set(brushTools.map(x=>x[0]));
    const brushName=type=>brushTools.find(x=>x[0]===type)?.[1] || elements.find(x=>x[0]===type)?.[1] || type;
    // Existing AI-generated images already published on this site. Only use where the
    // geography is accurate; never show a mountain for a room or an ocean for a library.
    // Dedicated artwork for all 24 emotions and all indoor scenes remains to be produced.
    const landscapeArt={
      living:window.PauseMoodScenes?.livingRoomUrl()||null,
      sea:'./media/generated/scene-02.webp',
      garden:'./media/generated/scene-04.webp',
      hill:'./media/generated/scene-01.webp',
      lake:'./media/generated/scene-10.webp',
      night:'./media/generated/scene-07.webp'
    };
    const landscapeCache=new Map();
    function drawLandscape(scene,t){
      const src=landscapeArt[scene];
      if(!src){art.drawScene(ctx,scene,t);return;}
      let asset=landscapeCache.get(scene);
      if(!asset){
        const img=new Image();
        asset={img,ready:false,error:false};
        landscapeCache.set(scene,asset);
        img.onload=()=>{asset.ready=true;if(model.scene===scene)paint(performance.now(),true)};
        img.onerror=()=>{asset.error=true};
        img.src=src;
      }
      if(!asset.ready){art.drawScene(ctx,scene,t);return;}
      const img=asset.img,scale=Math.max(W/img.naturalWidth,H/img.naturalHeight);
      const width=img.naturalWidth*scale,height=img.naturalHeight*scale;
      ctx.drawImage(img,(W-width)/2,(H-height)/2,width,height);
      // Small animated light cues sit behind the visitor's marks.
      const a=.04+(Math.sin(t*.00035)+1)*.015;
      const fog=ctx.createLinearGradient(0,0,W,H);
      fog.addColorStop(0,'rgba(249,236,221,'+a+')');
      fog.addColorStop(1,'rgba(99,127,126,0)');
      ctx.fillStyle=fog;ctx.fillRect(0,0,W,H);
    }

    const moodImageCache=new Map();
    function moodImageState(name){
      if(!window.PauseMoodScenes?.imageUrl)return null;
      if(moodImageCache.has(name))return moodImageCache.get(name);
      const src=window.PauseMoodScenes.imageUrl(name);if(!src)return null;
      const image=new Image();
      const state={image,ready:false,failed:false};
      moodImageCache.set(name,state);
      image.onload=()=>{state.ready=true;if(model.mood===name&&!model.customScene)paint(performance.now(),true)};
      image.onerror=()=>{state.failed=true;};
      image.src=src;return state;
    }
    function drawMoodBackground(name,t){
      const state=moodImageState(name);
      if(!state||state.failed){drawLandscape(model.scene,t);return;}
      if(!state.ready){drawLandscape(model.scene,t);return;}
      const image=state.image;
      const scale=Math.max(W/image.naturalWidth,H/image.naturalHeight);
      const width=image.naturalWidth*scale,height=image.naturalHeight*scale;
      ctx.drawImage(image,(W-width)/2,(H-height)/2,width,height);
    }
    const safeHtml=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
    const moodFor=()=>moods.find(x=>x[0]===model.mood)||moods[0];
    const currentProp=()=>model.props.find(x=>x.id===model.selected);
    const stampMessage=(message)=>window.dispatchEvent(new CustomEvent('pause:companion',{detail:{text:message,kind:'light'}}));
    // Every emotion owns its own composition and brush marks. Drawings are deliberately
    // memory-only, matching the existing privacy contract: nothing is auto-uploaded or saved.
    const workspaces=new Map();
    const histories=new Map();
    const snapshot=()=>({
      scene:model.scene,customScene:model.customScene,marks:model.marks,props:model.props,
      color:model.color,size:model.size
    });
    let history;
    function createHistory(){return window.createPaletteHistory({
      read:()=>JSON.parse(JSON.stringify(model)),
      write:old=>{
        Object.assign(model,JSON.parse(JSON.stringify(old)));
        updateSelections();paint(performance.now(),true);
        
      },
      onChange:state=>{ for(const id of ['worldUndo','worldQuickUndo']) $(id).disabled=!state.canUndo; for(const id of ['worldRedo','worldQuickRedo']) $(id).disabled=!state.canRedo; },
      limit:20
    });}
    history=createHistory();
    histories.set(model.mood,history);
    function switchMood(name){
      if(name===model.mood)return;
      const entry=moods.find(x=>x[0]===name);
      if(!entry)return;
      workspaces.set(model.mood,snapshot());
      const next=workspaces.get(name) || {
        scene:entry[1],customScene:false,marks:[],props:[],color:entry[4],size:1
      };
      Object.assign(model,{...next,mood:name,selected:null});
      if(!histories.has(name))histories.set(name,createHistory());
      history=histories.get(name);
      updateSelections();
      paint(performance.now(),true);
    }
    const change=fn=>{history.record();fn();updateSelections();paint(performance.now(),true);};
    function drawStroke(stroke) {
      if(!stroke.coords?.length||stroke.type==='eraser')return;
      const pts=stroke.coords;
      const unit=Math.max(.5,stroke.size);
      ctx.save();ctx.lineCap='round';ctx.lineJoin='round';
      ctx.strokeStyle=stroke.color;
      const widths={ink:3,pencil:3.4,wash:24,crayon:12,pastel:22,marker:15,glow:20};
      const alpha={ink:.95,pencil:.65,wash:.19,crayon:.84,pastel:.3,marker:.82,glow:.37};
      ctx.lineWidth=(widths[stroke.type]||4)*unit;
      ctx.globalAlpha=alpha[stroke.type]??.9;
      if(stroke.type==='glow'){ctx.shadowColor=stroke.color;ctx.shadowBlur=24*unit;}
      if(stroke.type==='pastel'){ctx.shadowColor=stroke.color;ctx.shadowBlur=11*unit;}
      ctx.beginPath();ctx.moveTo(pts[0][0],pts[0][1]);
      for(const [x,y] of pts.slice(1))ctx.lineTo(x,y);
      if(pts.length===1)ctx.lineTo(pts[0][0]+.1,pts[0][1]+.1);
      ctx.stroke();
      if(stroke.type==='wash'){
        ctx.lineWidth=unit*39;ctx.globalAlpha=.053;ctx.stroke();
        ctx.lineWidth=unit*9;ctx.globalAlpha=.1;ctx.stroke();
      }
      // Deterministic rough pigment, not freshly randomized on every animation frame.
      if(stroke.type==='crayon'||stroke.type==='pastel'){
        let tick=0;ctx.globalAlpha=stroke.type==='crayon'?.22:.12;
        for(let k=0;k<pts.length;k++){
          const [x,y]=pts[k],r=(stroke.type==='crayon'?8:17)*unit;
          for(let n=0;n<5;n++){
            const a=(tick*2.3999632297)%6.28318530718;
            const d=Math.sqrt((tick*0.61803398875)%1)*r;
            ctx.fillStyle=stroke.color;
            ctx.fillRect(x+Math.cos(a)*d,y+Math.sin(a)*d,stroke.type==='crayon'?2:3,2);
            tick++;
          }
        }
      }
      ctx.restore();
    }
    function eraseAt(p){
      const radius=16*model.size;
      const next=[];
      const near=([x,y])=>Math.hypot(x-p.x,y-p.y)<=radius;
      for(const mark of model.marks){
        if(mark.kind==='element'){
          if(Math.hypot(mark.x-p.x,mark.y-p.y)>radius+(mark.size||0)*.25)next.push(mark);
          continue;
        }
        const pts=mark.coords||[];
        if(!pts.length)continue;
        if(pts.length===1){if(!near(pts[0]))next.push(mark);continue;}
        // Keep untouched segments as separate strokes. Sample long spans so
        // a quick pointer gesture removes only the contacted part of the line.
        let chunk=[];
        const flush=()=>{
          if(chunk.length)next.push({...mark,coords:chunk});
          chunk=[];
        };
        for(let i=0;i<pts.length;i++){
          if(i===0){
            if(!near(pts[0]))chunk.push(pts[0]);
            continue;
          }
          const a=pts[i-1],b=pts[i],length=Math.hypot(b[0]-a[0],b[1]-a[1]);
          const steps=Math.max(1,Math.ceil(length/Math.max(3,radius*.38)));
          for(let k=1;k<=steps;k++){
            const fraction=k/steps;
            const point=[a[0]+(b[0]-a[0])*fraction,a[1]+(b[1]-a[1])*fraction];
            if(near(point))flush();
            else chunk.push(point);
          }
        }
        flush();
      }
      // Never discard unrelated artwork if a heavily segmented erasure would
      // exceed the editable-backup schema limit.
      if(next.length<=500)model.marks=next;
    }
    function selectTool(tool){
      if(brushTypes.has(tool)){lastBrush=tool;activeTab='brush'}
      else{lastElement=tool;activeTab='element'}
      model.tool=tool;updateSelections();
    }
    function paint(time=0,still=false,hideSelection=false) {
      const t=reduce||model.paused||still?0:time*model.velocity;
      ctx.save();ctx.setTransform(canvas.width/W,0,0,canvas.height/H,0,0);
      if(model.scene==='blank'){
        ctx.fillStyle='#faf7f1';ctx.fillRect(0,0,W,H);
        ctx.save();ctx.globalAlpha=.15;ctx.fillStyle='#b4aa99';
        for(let j=0;j<80;j++){let x=(j*139.7)%W,y=(j*187.1)%H;ctx.fillRect(x,y,1.2,1.2)}ctx.restore();
      }else if(!model.customScene)drawMoodBackground(model.mood,t);
      else drawLandscape(model.scene,t);
      const m=moodFor(),special=m[0];
      const moodIndex=Math.max(0,moods.findIndex(item=>item[0]===special));
      if(window.PauseMoodAtmospheres?.paint){
        window.PauseMoodAtmospheres.paint(ctx,model.mood,t,model.scene);
      }else{
        // Keep a fallback for loading errors; this is not the intended final renderer.
        art.drawAtmosphere?.(ctx,{
          scene:model.scene,moodTone:m[4],accent:model.color,index:moodIndex,
          effect:effects[moodIndex]
        },t);
      }
      if(model.scene!=='blank' && ['想哭','疲倦','悶住','孤單'].includes(special)){
        ctx.fillStyle='rgba(60,72,86,.11)';ctx.fillRect(0,0,W,H);
      }
      if(model.scene!=='blank' && ['期待','希望','想暖一點','想重新開始'].includes(special)){
        const glow=ctx.createRadialGradient(730,120,5,720,150,450);
        glow.addColorStop(0,'rgba(255,231,165,.24)');glow.addColorStop(1,'rgba(255,231,165,0)');
        ctx.fillStyle=glow;ctx.fillRect(0,0,W,H);
      }
      for(const mark of model.marks) {
        if(mark.kind==='stroke')drawStroke(mark);
        else art.drawElement(ctx,mark,t,still||model.paused||reduce);
      }
      for(const item of model.props.slice().sort((a,b)=>a.z-b.z)) {
        art.drawProp(ctx,item,t);
        if(item.id===model.selected && !still && !hideSelection){
          ctx.save();ctx.strokeStyle='rgba(84,107,97,.55)';ctx.setLineDash([6,6]);ctx.lineWidth=1.5;
          ctx.strokeRect(item.x-66*item.scale,item.y-82*item.scale,132*item.scale,164*item.scale);ctx.restore();
        }
      }
      ctx.restore();
    }
    const schedule=()=>{
      if(pointer||frames!==null||document.hidden||$('palette').hidden||model.paused||reduce)return;
      frames=requestAnimationFrame(t=>{frames=null;if(t-lastMoment>32){paint(t);lastMoment=t}schedule()});
    };
    const stop=()=>{if(frames!==null){cancelAnimationFrame(frames);frames=null}};
    function sizeCanvas(){
      const bounds=canvas.getBoundingClientRect();if(!bounds.width||!bounds.height)return;
      const dpr=Math.min(window.devicePixelRatio||1,1.6);
      canvas.width=Math.round(bounds.width*dpr);canvas.height=Math.round(bounds.height*dpr);
      paint(performance.now(),true);
    }
    function renderChoices(){
      // Scene thumbnails preview the bundled scene itself, never an unrelated mood.
      const sceneThumbnail=id=>{
        const src=landscapeArt[id];
        return typeof src==='string'&&/^\.\/media\/generated\/scene-\d{2}\.webp$/.test(src)
          ? ' style="background-image:url('+src+');background-size:cover;background-position:center"' : '';
      };
      $('worldMoods').innerHTML=moods.map(([name,scene,description,symbol,color])=>
        '<button class="world-mood" type="button" data-mood="'+safeHtml(name)+'" style="--tone:'+color+'" aria-pressed="false"><span class="world-mood-symbol">'+symbol+'</span><strong>'+name+'</strong></button>'
      ).join('');
      $('worldScenes').innerHTML='<button type="button" class="world-scene-button" data-scene-default="true" aria-pressed="true"><strong>情緒預設景觀</strong><small>回到這種心情原本的畫面</small></button>'+
        scenes.map(([id,name,description])=>
        '<button type="button" class="world-scene-button" data-scene="'+id+'" aria-pressed="false"><span class="scene-thumb scene-'+id+'"'+sceneThumbnail(id)+'></span><strong>'+name+'</strong><small>'+description+'</small></button>'
      ).join('');
      $('worldElements').innerHTML=elements.map(([id,name,symbol])=>'<button type="button" data-element="'+id+'" aria-pressed="false"><span>'+symbol+'</span>'+name+'</button>').join('');
      $('worldProps').innerHTML=props.map(([id,name,symbol])=>'<button type="button" data-prop="'+id+'" aria-label="加入'+name+'"><span>'+symbol+'</span>'+name+'</button>').join('');
      const brushPanel=$('worldBrushPalette');
      if(brushPanel)brushPanel.innerHTML=brushTools.map(([id,name])=>
        '<button type="button" data-brush="'+id+'" aria-pressed="false">'+name+'</button>').join('');
      $('worldColors').innerHTML=swatches.map(c=>'<button type="button" data-color="'+c+'" style="--c:'+c+'" aria-label="選擇顏色 '+c+'" title="套用至下一筆 '+c+'"></button>').join('');
    }
    function updateSelections(){
      root.querySelectorAll('[data-mood]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.mood===model.mood)));
      root.querySelectorAll('[data-scene]').forEach(b=>b.setAttribute('aria-pressed',String(model.customScene&&b.dataset.scene===model.scene)));
      root.querySelectorAll('[data-scene-default]').forEach(b=>b.setAttribute('aria-pressed',String(!model.customScene)));
      root.querySelectorAll('[data-element]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.element===model.tool)));
      root.querySelectorAll('[data-brush]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.brush===model.tool)));
      const currentTool=$('worldCurrentTool');
      if(currentTool)currentTool.textContent='目前工具：'+brushName(model.tool);
      root.querySelectorAll('[data-color]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.color===model.color)));
      $('worldCustomColor').value=model.color;
      $('worldActiveColorPreview').style.backgroundColor=model.color;
      $('worldColorStatus').textContent='目前選色 '+model.color.toUpperCase()+' · 用於下一筆或下一個元素';
      root.querySelectorAll('[data-world-tab]').forEach(b=>{
        const v=b.dataset.worldTab===activeTab;b.setAttribute('aria-selected',String(v));b.classList.toggle('active',v);
      });
      root.querySelectorAll('[data-world-panel]').forEach(p=>p.hidden=p.dataset.worldPanel!==activeTab);
      const selection=currentProp();$('worldPropEditor').hidden=!selection;
      if(selection) $('worldPropName').textContent=props.find(p=>p[0]===selection.type)?.[1]||'生活物件';
      $('worldSceneLabel').textContent=moodFor()[2];
      const workspaceStatus=$('worldWorkspaceStatus');
      if(workspaceStatus)workspaceStatus.textContent='目前畫布：'+model.mood+'｜切換情緒會保留這次開啟時各自的創作';
      $('worldPause').textContent=model.paused?'恢復流動':'暫停流動';
      $('worldBrushSize').value=String(model.size);
      // Each mood has a separate undo stack. Recalculate controls after switching,
      // not just after drawing, or old mood history leaks into the current UI.
      if(history) {
        const canUndo=history.canUndo(),canRedo=history.canRedo();
        for(const id of ['worldUndo','worldQuickUndo']) $(id).disabled=!canUndo;
        for(const id of ['worldRedo','worldQuickRedo']) $(id).disabled=!canRedo;
      }
      // No large tool drawer: each category is an inline collapsible panel.
    }
    function screenPosition(e){
      const rect=canvas.getBoundingClientRect();
      // Captured touches can drift outside the canvas. Keep exported coordinates valid.
      const clamp=(v,limit)=>Math.max(0,Math.min(limit,v));
      return {x:clamp((e.clientX-rect.left)/rect.width*W,W),
        y:clamp((e.clientY-rect.top)/rect.height*H,H)};
    }
    function hitProp(pos){
      return model.props.slice().sort((a,b)=>b.z-a.z).find(item=>Math.abs(item.x-pos.x)<70*item.scale&&Math.abs(item.y-pos.y)<85*item.scale);
    }
    function createMark(pos){
      const t=model.tool;
      if(brushTypes.has(t)&&t!=='eraser'){
        const stroke={kind:'stroke',type:t,coords:[[pos.x,pos.y]],color:model.color,size:model.size};
        model.marks.push(stroke);return stroke;
      }
      const mark={kind:'element',type:t,x:pos.x,y:pos.y,size:Math.max(14,38*model.size),color:model.color,seed:Math.random()*9,speed:.6+Math.random()*.4};
      model.marks.push(mark);return mark;
    }
    const canMark=()=>model.marks.length<500;
    canvas.addEventListener('pointerdown',e=>{
      if(pointer||e.button>0)return;e.preventDefault();
      const p=screenPosition(e);// Furniture is draggable only while editing objects, so drawing over a sofa
      // or cup remains a continuous brush stroke on mobile and desktop.
      const prop=activeTab==='object' && model.tool!=='eraser'?hitProp(p):null;
      if(prop){model.selected=prop.id;pointer={id:e.pointerId,mode:'move',from:p,old:{...prop},recorded:false};}
      else if(model.tool==='eraser'){
        history.record();model.selected=null;eraseAt(p);
        pointer={id:e.pointerId,mode:'erase',from:p,last:p};
      } else if(activeTab==='object'){
        // Empty space in the object panel deselects; it must not stamp a brush.
        model.selected=null;
      } else if(canMark()){
        history.record();model.selected=null;let mark=createMark(p);
        pointer={id:e.pointerId,mode:'mark',from:p,mark,last:p};
      }
      if(pointer)stop(); // Avoid competing background frames while a finger or pen is drawing.
      try{canvas.setPointerCapture(e.pointerId)}catch(_){}
      updateSelections();paint(performance.now(),true);
    });
    canvas.addEventListener('pointermove',e=>{
      if(!pointer||pointer.id!==e.pointerId)return;e.preventDefault();
      // On iPhone, touchmove events may jump many pixels in one frame. Interpolate
      // each segment so lines stay continuous and the eraser cannot skip a gap.
      const events=typeof e.getCoalescedEvents==='function' ? e.getCoalescedEvents() : [];
      const samples=events.length?events:[e];
      for(const sample of samples){
        const p=screenPosition(sample);
        if(pointer.mode==='move'){
          const item=currentProp();if(!item)return;
          if(!pointer.recorded){if(Math.hypot(p.x-pointer.from.x,p.y-pointer.from.y)<5)continue;
            history.record();pointer.recorded=true;}
          item.x=pointer.old.x+p.x-pointer.from.x;item.y=pointer.old.y+p.y-pointer.from.y;
        } else {
          const from=pointer.last;
          const length=Math.hypot(p.x-from.x,p.y-from.y);
          const spacing=pointer.mode==='erase'?7:pointer.mark.kind==='stroke'?5:23;
          if(length<spacing*.45)continue;
          const steps=Math.ceil(length/spacing);
          for(let i=1;i<=steps;i++){
            const part={x:from.x+(p.x-from.x)*i/steps,y:from.y+(p.y-from.y)*i/steps};
            if(pointer.mode==='erase')eraseAt(part);
            else if(pointer.mark.kind==='stroke'){
              if(pointer.mark.coords.length<3000)pointer.mark.coords.push([part.x,part.y]);
            }else if(canMark())pointer.mark=createMark(part);
          }
          pointer.last=p;
        }
      }
      paint(performance.now(),true);
    });
    const release=e=>{if(pointer?.id===e.pointerId){pointer=null;try{canvas.releasePointerCapture(e.pointerId)}catch(_){}updateSelections();schedule()}};
    canvas.addEventListener('pointerup',release);canvas.addEventListener('pointercancel',release);
    function addProp(type){
      if(model.props.length>=45){return}
      change(()=>{
        const id='prop-'+Date.now()+'-'+Math.round(Math.random()*1e5);
        model.props.push({id,type,x:W*.48+(model.props.length%4-2)*55,y:H*.57+(model.props.length%3)*25,scale:1,angle:0,z:model.props.length});
        model.selected=id;
      });
      
    }
    function editProp(action){
      const p=currentProp();if(!p)return;
      if(action==='deselect'){model.selected=null;updateSelections();paint(performance.now(),true);return;}
      change(()=>{
        if(action==='smaller')p.scale=Math.max(.45,p.scale*.86);
        if(action==='larger')p.scale=Math.min(2.3,p.scale*1.15);
        if(action==='left')p.angle-=Math.PI/12;
        if(action==='right')p.angle+=Math.PI/12;
        if(action==='front')p.z=Math.max(0,...model.props.map(x=>x.z))+1;
        if(action==='back')p.z=Math.min(0,...model.props.map(x=>x.z))-1;
        if(action==='delete'){model.props=model.props.filter(x=>x.id!==p.id);model.selected=null;}
      });
    }
    root.addEventListener('click',e=>{
      const b=e.target.closest('button');if(!b)return;
      if(b.dataset.mood){
        const name=b.dataset.mood;
        switchMood(name);
        stampMessage(moodFor()[2]);return;
      }
      if(b.dataset.sceneDefault){change(()=>{model.scene=moodFor()[1];model.customScene=false;});return;}
      if(b.dataset.scene){change(()=>{model.scene=b.dataset.scene;model.customScene=true;});return;}
      if(b.dataset.element){selectTool(b.dataset.element);return;}
      if(b.dataset.brush){selectTool(b.dataset.brush);return;}
      if(b.dataset.prop){addProp(b.dataset.prop);activeTab='object';updateSelections();return;}
      if(b.dataset.color){
        model.color=b.dataset.color;
        updateSelections();paint(performance.now(),true);return;
      }
      if(b.dataset.worldTab){
        const next=activeTab===b.dataset.worldTab?null:b.dataset.worldTab;
        activeTab=next;
        if(next==='element')model.tool=lastElement;
        if(next==='brush')model.tool=lastBrush;
        updateSelections();return;
      }
      if(b.dataset.propAction){editProp(b.dataset.propAction);return;}
    });
    $('worldBrushSize').addEventListener('input',e=>model.size=Number(e.target.value));
    $('worldCustomColor').addEventListener('input',e=>{model.color=e.target.value;updateSelections();paint(performance.now(),true)});
    // Brush selection is delegated to the [data-brush] tools.
    $('worldUndo').addEventListener('click',()=>history.undo());
    $('worldQuickUndo').addEventListener('click',()=>history.undo());
    $('worldRedo').addEventListener('click',()=>history.redo());
    $('worldQuickRedo').addEventListener('click',()=>history.redo());
    const clearWorld=()=>change(()=>{model.marks=[];model.props=[];model.selected=null});
    const clearMarks=()=>change(()=>{model.marks=[];});
    $('worldClear').addEventListener('click',clearWorld);
    $('worldQuickClear').addEventListener('click',clearWorld);
    $('worldClearMarks')?.addEventListener('click',clearMarks);
    $('worldPause').addEventListener('click',()=>{
      model.paused=!model.paused;updateSelections();
      if(model.paused){stop();paint(performance.now(),true)}else schedule();
    });
    // Portable editable backup: manually exported, never persisted or uploaded.
    // PNG remains a separate final image, while JSON retains all 24 editable layers.
    const backupStatus=$('worldBackupStatus');
    const sayBackup=text=>{if(backupStatus)backupStatus.textContent=text};
    const validColor=x=>typeof x==='string'&&/^#[0-9a-f]{6}$/i.test(x);
    const finite=(x,min,max)=>Number.isFinite(x)&&x>=min&&x<=max;
    const moodNames=new Set(moods.map(x=>x[0]));
    const sceneNames=new Set(scenes.map(x=>x[0]));
    const elementNames=new Set(elements.map(x=>x[0]));
    const propNames=new Set(props.map(x=>x[0]));
    const strokeNames=new Set(brushTools.filter(x=>x[0]!=='eraser').map(x=>x[0]));
    function cleanCanvas(raw){
      if(!raw||typeof raw!=='object'||!sceneNames.has(raw.scene)||
        !Array.isArray(raw.marks)||raw.marks.length>500||
        !Array.isArray(raw.props)||raw.props.length>45||
        !validColor(raw.color)||!finite(raw.size,.5,2.4))throw Error('invalid canvas');
      const marks=raw.marks.map(mark=>{
        if(!mark||typeof mark!=='object'||!validColor(mark.color))throw Error('invalid mark');
        if(mark.kind==='stroke'){
          if(!strokeNames.has(mark.type)||!finite(mark.size,.5,2.4)||
            !Array.isArray(mark.coords)||mark.coords.length===0||mark.coords.length>3000||
            !mark.coords.every(p=>Array.isArray(p)&&p.length===2&&
              finite(p[0],-200,W+200)&&finite(p[1],-200,H+200)))throw Error('invalid stroke');
          return {kind:'stroke',type:mark.type,color:mark.color,size:mark.size,
            coords:mark.coords.map(p=>[p[0],p[1]])};
        }
        if(mark.kind==='element'){
          if(!elementNames.has(mark.type)||!finite(mark.x,-200,W+200)||
            !finite(mark.y,-200,H+200)||!finite(mark.size,1,150)||
            !finite(mark.seed,0,10)||!finite(mark.speed,.1,2))throw Error('invalid element');
          return {kind:'element',type:mark.type,x:mark.x,y:mark.y,size:mark.size,
            color:mark.color,seed:mark.seed,speed:mark.speed};
        }
        throw Error('unsupported mark');
      });
      const cleanProps=raw.props.map(p=>{
        if(!p||typeof p!=='object'||!propNames.has(p.type)||
          typeof p.id!=='string'||p.id.length>90||p.id.length===0||
          !finite(p.x,-1000,W+1000)||!finite(p.y,-1000,H+1000)||
          !finite(p.scale,.1,3)||!finite(p.angle,-100,100)||
          !finite(p.z,-100000,100000))throw Error('invalid object');
        return {id:p.id,type:p.type,x:p.x,y:p.y,scale:p.scale,angle:p.angle,z:p.z};
      });
      if(new Set(cleanProps.map(p=>p.id)).size!==cleanProps.length)throw Error('duplicate objects');
      return {scene:raw.scene,customScene:typeof raw.customScene==='boolean'?raw.customScene:true,marks,props:cleanProps,color:raw.color,size:raw.size};
    }
    function exportEditable(){
      try{
        const all=new Map(workspaces);
        all.set(model.mood,snapshot());
        const canvases=moods.map(([name])=>
          ({mood:name,...cleanCanvas(all.get(name)||{
            scene:moods.find(x=>x[0]===name)[1],customScene:false,marks:[],props:[],
            color:moods.find(x=>x[0]===name)[4],size:1
          })}));
        const doc={format:'today-pause-editable-palette',version:1,
          exportedAt:new Date().toISOString(),activeMood:model.mood,canvases};
        const blob=new Blob([JSON.stringify(doc)],{type:'application/json'});
        const url=URL.createObjectURL(blob),a=document.createElement('a');
        a.href=url;a.download='今日一息-24種情緒可編輯畫布.json';
        a.click();setTimeout(()=>URL.revokeObjectURL(url),3000);
        sayBackup('已準備下載 24 張可編輯畫布備份；請確認檔案已儲存。');
      }catch(_){sayBackup('備份沒有成功。請先保留頁面，不要重新整理。')}
    }
    function importEditable(file){
      if(!file||file.size>12*1024*1024){
        sayBackup('檔案超過 12 MB，未讀取也未更動現有畫布。');return;
      }
      file.text().then(raw=>{
        const doc=JSON.parse(raw);
        if(doc?.format!=='today-pause-editable-palette'||doc.version!==1||
          !Array.isArray(doc.canvases)||doc.canvases.length!==24||
          !moodNames.has(doc.activeMood))throw Error('wrong file');
        const imported=new Map();
        for(const item of doc.canvases){
          if(!item||!moodNames.has(item.mood)||imported.has(item.mood))throw Error('duplicate mood');
          imported.set(item.mood,cleanCanvas(item));
        }
        if(!window.confirm('匯入會取代這次開啟期間的 24 張畫布。請先匯出目前作品備份。確定匯入嗎？'))return;
        workspaces.clear();histories.clear();
        for(const [key,value] of imported)workspaces.set(key,value);
        const selected=workspaces.get(doc.activeMood);
        Object.assign(model,selected,{mood:doc.activeMood,selected:null});
        history=createHistory();histories.set(doc.activeMood,history);
        updateSelections();paint(performance.now(),true);schedule();
        sayBackup('匯入成功：24 張情緒畫布已恢復，可繼續編輯。');
      }).catch(()=>sayBackup('檔案內容不符或無法讀取；現有畫布保持不變。'));
    }
    $('worldExportEditable')?.addEventListener('click',exportEditable);
    $('worldImportEditable')?.addEventListener('click',()=>$('worldImportFile')?.click());
    $('worldImportFile')?.addEventListener('change',e=>{
      const file=e.target.files?.[0];if(file)importEditable(file);
      e.target.value='';
    });
    const downloadWorld=()=>{
      // Export the same animation phase the visitor just saw; hide selection
      // affordances only, then restore the interactive canvas immediately.
      const originalSelection=model.selected;
      model.selected=null;
      try{
        const captureTime=lastMoment||performance.now();
        paint(captureTime,false,true);
        const a=document.createElement('a');a.href=canvas.toDataURL('image/png');
        a.download='今日一息-情緒畫室-'+Date.now()+'.png';a.click();
      }catch(_){stampMessage('圖片匯出沒有成功，請確認瀏覽器下載權限。')}
      finally{model.selected=originalSelection;paint(lastMoment||performance.now())}
    };
    $('worldDownload').addEventListener('click',downloadWorld);
    $('worldQuickSave').addEventListener('click',downloadWorld);
    // Inline accordion tool categories: never cover the canvas with a modal sheet.
    // The categories are independently selectable and their controls live below the artwork.
    const onVisible=()=>{
      if(document.hidden||$('palette').hidden){stop();return}
      sizeCanvas();schedule();
    };
    // Match the device's current accessibility setting without needing a reload.
    motionPreference.addEventListener?.('change',event=>{
      reduce=event.matches;
      if(reduce){stop();paint(performance.now(),true)}
      else {paint(performance.now(),true);schedule()}
    });
    document.addEventListener('visibilitychange',onVisible);
    window.addEventListener('palette-view-change',onVisible);
    window.addEventListener('resize',onVisible);
    if('ResizeObserver' in window)new ResizeObserver(onVisible).observe(wrap);
    renderChoices();updateSelections();sizeCanvas();schedule();
  }
  window.setupPaletteNew=init;
})();