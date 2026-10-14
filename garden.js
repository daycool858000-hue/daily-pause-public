// 今日一息｜陪伴花園第一階段：本機單人照顧與五個世界。
// Development preview: existing AI-generated landscapes, rights still under review.
// pending original dedicated assets, rights verification and owner visual acceptance.
(() => {
  'use strict';
  const root=document.getElementById('gardenWorld');
  if(!root)return;
  const by=id=>document.getElementById(id);
  // A transformed/animated page section breaks position:fixed on iPhone.
  // Mount the full-screen door under body, independent of the main page width.
  const gateOverlay=by('gardenGate');
  if(gateOverlay && gateOverlay.parentElement!==document.body)document.body.appendChild(gateOverlay);
  gateOverlay?.addEventListener('click',e=>{
    const pressed=e.target.closest?.('#gardenEnter, #gardenSkipGate');
    if(pressed)enter(pressed.id==='gardenSkipGate');
  });
  gateOverlay?.addEventListener('keydown',e=>{
    if(e.key==='Escape'){e.preventDefault();enter(true);}
  });
  const storageKey='daily-pause-garden-v1';
  const sprites=window.PauseGardenSprites;
  const decor=window.PauseGardenDecor;
  const clamp=(n,min,max)=>Math.max(min,Math.min(max,n));
  const reduceMotion=window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches??false;
  const hash=id=>{let n=2166136261;for(const c of id){n=Math.imul(n^c.charCodeAt(0),16777619)}return n>>>0};
  function defaultPosition(item){
    const h=hash(item.id),index=h%24;
    return {x:clamp(12+(index%6)*14+((h>>>8)%5)-2,8,92),
      y:clamp(58+Math.floor(index/6)*10+((h>>>12)%5)-2,48,90)};
  }
  function position(item){
    const d=defaultPosition(item);
    return {x:Number.isFinite(item.x)?clamp(item.x,8,92):d.x,
      y:Number.isFinite(item.y)?clamp(item.y,45,90):d.y};
  }
  const worlds=[
    {id:'flowers',name:'花園',sub:'為自己種一片花與樹',image:null,visual:'pending',
      plants:['玫瑰','向日葵','繡球花','薰衣草','蘋果樹'],pets:['貓','狗','兔子','天竺鼠']},
    {id:'farm',name:'田間',sub:'慢慢耕種，等果實長大',image:null,visual:'pending',
      plants:['草莓','番茄','稻米','南瓜','橘子樹'],pets:['雞','鴨','牛','狗']},
    {id:'forest',name:'森林',sub:'沿著樹影走一會兒',image:'./media/generated/scene-03.webp',visual:'reference',
      plants:['松樹','楓樹','蕨類','野花','香草'],pets:['貓','狗','兔子']},
    {id:'coast',name:'海邊',sub:'聽風來，陪海浪待一下',image:'./media/generated/scene-02.webp',visual:'reference',
      plants:['海濱木槿','馬鞍藤','濱刺麥','椰子樹'],pets:['狗','貓']},
    {id:'park',name:'公園',sub:'留一張椅子給今天',image:null,visual:'pending',
      plants:['櫻花樹','榕樹','雛菊','玫瑰','杜鵑'],pets:['狗','貓','兔子']}
  ];
  // Two site-existing AI-generated scenes can be reviewed alongside the
  // authored vector environment. These are already in this repo, not scraped photos.
  const sceneVariants={
    flowers:[
      {id:'open',title:'戶外花園構圖',image:null},
      {id:'greenhouse',title:'玻璃花房（既有生成圖）',image:'./media/generated/scene-11.webp'}
    ],
    park:[
      {id:'open',title:'公園構圖',image:null},
      {id:'gardenpond',title:'靜謐庭園（既有生成圖）',image:'./media/generated/scene-08.webp'}
    ]
  };
  function activeVisual(){
    const world=currentWorld(),list=sceneVariants[world.id];
    if(!list)return {image:world.image,legacy:world.visual==='reference'};
    const selected=state.backgrounds?.[world.id]||'open';
    const variant=list.find(x=>x.id===selected)||list[0];
    return {image:variant.image,legacy:Boolean(variant.image),variant};
  }
  function renderSceneVariants(){
    const root=by('gardenSceneVariant'),options=by('gardenSceneVariantOptions');
    const list=sceneVariants[state.world];
    if(!root||!options)return;
    root.hidden=!list;
    if(!list){options.innerHTML='';return;}
    const current=state.backgrounds?.[state.world]||'open';
    options.innerHTML=list.map(v=>'<button type="button" data-scene-variant="'+v.id+
      '" aria-pressed="'+(current===v.id)+'">'+v.title+'</button>').join('');
  }
  function setSceneVariant(id){
    if(!sceneVariants[state.world]?.some(v=>v.id===id))return;
    state.backgrounds[state.world]=id;
    save();renderCollection();
    by('gardenFeedback').textContent='已切換這個地方的景觀樣式。寵物與植物的位置都會保留。';
  }
  const ICONS={'玫瑰':'🌹','向日葵':'🌻','繡球花':'🌸','薰衣草':'🪻','蘋果樹':'🌳',
    '草莓':'🍓','番茄':'🍅','稻米':'🌾','南瓜':'🎃','橘子樹':'🍊','松樹':'🌲',
    '楓樹':'🍁','蕨類':'🌿','野花':'🌼','香草':'🌱','海濱木槿':'🌺','馬鞍藤':'🌿',
    '濱刺麥':'🌾','椰子樹':'🌴','櫻花樹':'🌸','榕樹':'🌳','雛菊':'🌼','杜鵑':'🌺',
    '狗':'🐕','貓':'🐈','兔子':'🐇','天竺鼠':'🐹','雞':'🐓','鴨':'🦆','牛':'🐄'};
  const harvestable=new Set(['草莓','番茄','稻米','南瓜','橘子樹','蘋果樹']);
  const actions={
    pet:[['feed','餵食','吃飽後，牠在你身邊舒服地休息。'],['play','玩耍','牠朝你靠近，像是想再玩一下。'],['wash','洗澡','水珠輕輕落下，牠甩了甩身體。'],['rest','陪牠休息','牠找到舒服的位置，慢慢安靜下來。']],
    plant:[['water','澆水','泥土吸收了水分，葉子在微風裡搖晃。'],['care','整理','你替它整理周圍的空間。'],['watch','看看它','它照自己的速度生長。'],['rest','坐在旁邊','你和它一起待了一會兒。'],['harvest','收成','你收下成熟的果實，植物還會繼續生長。']]
  };
  // Simple, non-competitive exploration. Each response has a visible scene effect.
  const hotspots={
    flowers:[
      ['petal','看花朵','花開在不同的時間，也可以慢慢看。',27,78,'flower'],
      ['walk','走上花徑','你沿著花徑往前走，看看光從哪裡落下。',52,67,'light'],
      ['tree','坐在樹下','樹影替這個下午留下一點空間。',13,49,'leaf']
    ],
    farm:[
      ['crop','看看農作物','田裡的作物還在慢慢長大。',43,81,'leaf'],
      ['barn','走近農舍','你走到農舍旁，停下來望著田野。',79,48,'light'],
      ['wind','聽田間的風','細細的風穿過田間，帶來一點晃動。',20,49,'breeze']
    ],
    forest:[
      ['trail','沿小徑散步','小徑延伸到樹木更深的地方。',55,69,'leaf'],
      ['listen','聽森林','樹葉與風帶來細小的聲音。',20,42,'breeze'],
      ['rest','看看天空','樹冠之間留了一道光。',69,32,'light']
    ],
    coast:[
      ['wave','看看浪花','一道浪湧來，又慢慢退去。',45,77,'water'],
      ['breeze','感受海風','海風吹過，遠方的景色還很寬。',71,43,'breeze'],
      ['horizon','望向遠方','你可以看得更遠一些。',30,39,'light']
    ],
    park:[
      ['pond','觀察池塘','池塘輕輕泛起了幾道水波。',81,76,'water'],
      ['bench','坐在長椅','你可以在這裡坐一會兒，不需要做什麼。',49,77,'light'],
      ['shade','走進樹蔭','葉影輕輕晃動，這裡有個能停下來的角落。',13,51,'leaf']
    ]
  };
  function renderHotspots(){
    const area=by('gardenHotspots');if(!area)return;
    area.innerHTML=(hotspots[state.world]||[]).map(([id,name,description,x,y,effect])=>
      '<button type="button" class="garden-hotspot" data-garden-hotspot="'+id+
      '" style="left:'+x+'%;top:'+y+'%" aria-label="'+name+'" title="'+name+'">'+
      '<span aria-hidden="true">✧</span><small>'+name+'</small></button>'
    ).join('');
  }
  function explore(id){
    const item=(hotspots[state.world]||[]).find(x=>x[0]===id);
    if(!item)return;
    const button=by('gardenHotspots').querySelector('[data-garden-hotspot="'+id+'"]');
    if(!button)return;
    button.classList.remove('garden-hotspot-active');
    void button.offsetWidth;
    button.classList.add('garden-hotspot-active');
    const effect=item[5];
    const symbols={flower:'❀',leaf:'❧',water:'◌',breeze:'〰',light:'✦'};
    button.dataset.effect=effect;
    button.setAttribute('data-effect-label',symbols[effect]||'✦');
    by('gardenFeedback').textContent=item[2];
    const hint=by('gardenExploreMessage');
    if(hint){hint.textContent=item[2];hint.hidden=false;}
  }
  // A small optional self-care corner; never records answers or attendance.
  const selfCareOptions={
    water:'喝一點水，慢慢喝就好。你也值得被照顧。',
    stretch:'伸展一下肩膀和手臂，找到舒服的角度就好。',
    eyes:'看看遠處的景色，讓眼睛暫時離開眼前的文字。',
    pause:'坐著休息一會兒，沒有什麼任務需要完成。',
    feelings:'留意現在身體的感覺；可以說出來，也可以留在心裡。',
    outside:'如果方便，去看看窗外的天色，感受一下空氣。'
  };
  function chooseSelfCare(id){
    if(!Object.prototype.hasOwnProperty.call(selfCareOptions,id))return;
    const feedback=by('gardenSelfCareFeedback');
    if(!feedback)return;
    feedback.textContent=selfCareOptions[id];
    const options=by('gardenSelfCareOptions');
    options?.querySelectorAll('[data-self-care]').forEach(b=>
      b.setAttribute('aria-pressed',String(b.dataset.selfCare===id)));
    feedback.classList.remove('garden-selfcare-appear');
    void feedback.offsetWidth;
    feedback.classList.add('garden-selfcare-appear');
    // Intentionally do not write choice, text, or timestamp to localStorage.
  }
  const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','"':'&quot;',"'":'&#39;'}[c]));
  const lightingChoices=[['morning','晨光'],['day','白天'],['dusk','黃昏'],['night','夜晚']];
  const allowedLighting=new Set(lightingChoices.map(x=>x[0]));
  const newState=()=>({version:1,world:'flowers',items:[],lighting:{},backgrounds:{},decorations:[]});
  function renderLighting(){
    const selected=state.lighting[state.world]||'day';
    const root=by('gardenLightChoices');
    if(root)root.innerHTML=lightingChoices.map(([id,name])=>
      '<button type="button" data-garden-light="'+id+'" aria-pressed="'+(selected===id)+'">'+name+'</button>'
    ).join('');
    const stage=by('gardenWorldRoom')?.querySelector('.garden-landscape');
    if(stage)stage.dataset.light=selected;
  }
  function chooseLighting(name){
    if(!allowedLighting.has(name))return;
    state.lighting[state.world]=name;save();renderLighting();
    by('gardenFeedback').textContent='光線已換成'+lightingChoices.find(x=>x[0]===name)[1]+'。這個選擇只影響畫面。';
  }
  const speciesValid=item=>worlds.some(w=>w.id===item.world &&
    (item.kind==='pet'?w.pets:w.plants).includes(item.species));
  function sanitize(input){
    const clean=newState();
    if(input && worlds.some(w=>w.id===input.world))clean.world=input.world;
    if(input?.lighting&&typeof input.lighting==='object'&&!Array.isArray(input.lighting)){
      for(const w of worlds){
        if(allowedLighting.has(input.lighting[w.id]))clean.lighting[w.id]=input.lighting[w.id];
      }
    }
    if(Array.isArray(input?.items))clean.items=input.items.slice(0,160).filter(item=>
      item && typeof item==='object' &&
      ['pet','plant'].includes(item.kind) && speciesValid(item) &&
      typeof item.id==='string' && /^[a-z0-9-]{1,48}$/i.test(item.id) &&
      Number.isFinite(item.createdAt) && item.createdAt>0 && item.createdAt<Date.now()+86400000 &&
      Number.isInteger(item.care)&&item.care>=0&&item.care<100000
    ).map(item=>({id:item.id,world:item.world,kind:item.kind,species:item.species,
      createdAt:item.createdAt,care:item.care,lastAction:typeof item.lastAction==='string' ?
        item.lastAction.slice(0,30):'',
      name:typeof item.name==='string'?item.name.slice(0,20):'',
      harvests:Number.isInteger(item.harvests)&&item.harvests>=0&&item.harvests<100000?item.harvests:0,
      lastHarvestAt:Number.isFinite(item.lastHarvestAt)&&item.lastHarvestAt>=0&&
        item.lastHarvestAt<=Date.now()+86400000?item.lastHarvestAt:0,
      ...position(item)}));
    if(input?.backgrounds && typeof input.backgrounds==='object'&&!Array.isArray(input.backgrounds)){
      for(const [world,options] of Object.entries(sceneVariants)){
        if(options.some(v=>v.id===input.backgrounds[world]))clean.backgrounds[world]=input.backgrounds[world];
      }
    }
    if(input?.decorations!==undefined){
      if(!Array.isArray(input.decorations)||input.decorations.length>65)throw Error('invalid decorations');
      clean.decorations=input.decorations.filter(item=>
        item&&typeof item==='object'&&
        worlds.some(w=>w.id===item.world) &&
        decor?.worlds[item.world]?.includes(item.type) &&
        typeof item.id==='string' && /^[a-z0-9-]{1,48}$/i.test(item.id) &&
        Number.isFinite(item.x) && item.x>=8 && item.x<=92 &&
        Number.isFinite(item.y) && item.y>=45 && item.y<=90
      ).map(item=>({id:item.id,world:item.world,type:item.type,x:item.x,y:item.y}));
    }
    return clean;
  }
  let state,loadError=false,recoverableRaw=null,storeAvailable=true;
  try{
    const stored=localStorage.getItem(storageKey);
    if(stored===null)state=newState();
    else{
      const parsed=JSON.parse(stored);
      const checked=sanitize(parsed);
      if(!parsed||parsed.version!==1||
         !worlds.some(w=>w.id===parsed.world)||
         !Array.isArray(parsed.items)||parsed.items.length>160||
         checked.items.length!==parsed.items.length||
         new Set(checked.items.map(x=>x.id)).size!==checked.items.length||
         (parsed.decorations!==undefined && 
           (!Array.isArray(parsed.decorations) || checked.decorations.length!==parsed.decorations.length))||
         new Set(checked.decorations.map(x=>x.id)).size!==checked.decorations.length){
        throw Error('Invalid saved garden');
      }
      state=checked;
    }
  }catch(_){
    // Never overwrite an unknown/corrupt previous garden automatically.
    try{recoverableRaw=localStorage.getItem(storageKey)}catch(_){storeAvailable=false}
    loadError=true;state=newState();
  }
  function recoveryUI(){
    const el=by('gardenRecovery');
    if(!el)return;
    el.hidden=!loadError;
    if(loadError){
      by('gardenSaveState').textContent='原本的花園資料暫時無法讀取；為避免覆蓋，已停止自動儲存';
    }
  }
  function save(){
    if(loadError){recoveryUI();return false;}
    try{
      localStorage.setItem(storageKey,JSON.stringify(state));
      by('gardenSaveState').textContent='保存在此裝置';
      return true;
    }catch(_){
      by('gardenSaveState').textContent='此裝置無法儲存，請立即匯出花園備份';
      return false;
    }
  }
  function exportRecovery(){
    if(!loadError||typeof recoverableRaw!=='string')return;
    const blob=new Blob([recoverableRaw],{type:'text/plain;charset=utf-8'});
    const url=URL.createObjectURL(blob);
    const a=document.createElement('a');a.href=url;
    a.download='今日一息-花園原始資料-待修復.txt';a.click();
    setTimeout(()=>URL.revokeObjectURL(url),3000);
  }
  function resetBrokenGarden(){
    if(!loadError)return;
    if(!window.confirm('原本的花園資料仍在這台裝置。重新開始會覆蓋它，請先匯出「原始資料」。確定要重新開始嗎？'))return;
    try{
      // If storage is unavailable, do not claim that we can reset safely.
      localStorage.setItem(storageKey,JSON.stringify(newState()));
      state=newState();loadError=false;recoverableRaw=null;
      recoveryUI();renderCollection();
      by('gardenFeedback').textContent='已重新建立花園。';
    }catch(_){by('gardenSaveState').textContent='無法寫入此裝置，原始資料未被更動';}
  }
  function currentWorld(){return worlds.find(w=>w.id===state.world)||worlds[0]}
  function itemsHere(){return state.items.filter(x=>x.world===state.world)}
  function decorsHere(){return state.decorations.filter(x=>x.world===state.world)}
  const day=86400000;
  function growth(item){
    if(item.kind!=='plant')return '';
    return ['種子','發芽','長葉','長成'][growthLevel(item)];
  }
  function renderWorlds(){
    by('gardenWorldChoices').innerHTML=worlds.map(w=>
      '<button type="button" class="garden-world-choice" data-choose-world="'+w.id+'" aria-pressed="'+(w.id===state.world)+'">'+
      (w.image?'<img src="'+w.image+'" alt="" loading="lazy">':
      (window.PauseGardenScenes?.thumbnail(w.id)
       ?'<img src="'+window.PauseGardenScenes.thumbnail(w.id)+'" alt="" loading="lazy">'
       :'<span class="garden-world-preview garden-world-preview-'+w.id+'" aria-hidden="true"><span>專屬場景製作中</span></span>'))+
      '<span><strong>'+w.name+'</strong><small>'+w.sub+'</small></span></button>'
    ).join('');
  }
  function renderResidentsStage(){
    const area=by('gardenResidentsStage');if(!area)return;
    const items=itemsHere();
    area.innerHTML=items.slice(0,30).map(item=>{
      const p=position(item),stage=growthLevel(item);
      const label=esc(item.name||item.species)+'，'+(item.kind==='pet'?'點擊照顧':growth(item)+'，點擊照顧');
      const svg=sprites?.markup(item,stage)||'<span aria-hidden="true">'+(ICONS[item.species]||'🌱')+'</span>';
      return '<button type="button" class="garden-stage-resident garden-stage-'+item.kind+
        '" data-stage-resident="'+item.id+'" style="left:'+p.x+'%;top:'+p.y+'%" aria-label="'+label+
        '" title="'+esc(item.species)+'">'+svg+'</button>';
    }).join('');
    area.innerHTML+=decorsHere().slice(0,24).map(item=>{
      const point=position(item);
      const art=decor?.markup(item)||'';
      const name=decor?.defs[item.type]?.[0]||'擺設';
      return '<button type="button" class="garden-stage-resident garden-stage-decor" data-stage-decor="'+item.id+
        '" style="left:'+point.x+'%;top:'+point.y+'%" aria-label="移動或整理'+name+'" title="'+name+'">'+art+'</button>';
    }).join('');
    by('gardenStageHint').textContent=items.length>30
      ?'場景先顯示 30 位夥伴，其餘可在下方清單找到。點一下照顧，按住拖曳可移動。'
      :'點一下照顧小生命，按住拖曳可以替牠們換個位置。';
  }
  function growthLevel(item){
    if(item.kind!=='plant')return 3;
    const days=Math.max(0,Math.floor((Date.now()-item.createdAt)/day));
    const level=Math.min(3,Math.floor(days/2)+(item.care>=2?1:0));
    if(item.lastHarvestAt && Date.now()-item.lastHarvestAt<2*day)return Math.min(level,2);
    return level;
  }
  function renderCollection(){
    const w=currentWorld(),items=itemsHere();
    by('gardenWorldTitle').textContent=w.name;
    by('gardenWorldSubtitle').textContent=w.sub;
    const backdrop=by('gardenBackdrop'),stage=by('gardenWorldRoom').querySelector('.garden-landscape');
    const variant=activeVisual();
    backdrop.style.backgroundImage=variant.image?'url("'+variant.image+'")':'none';
    backdrop.innerHTML=variant.image?'':(window.PauseGardenScenes?.draw(w.id)||'');
    backdrop.classList.toggle('garden-has-original-art',!!backdrop.firstElementChild);
    backdrop.dataset.area=w.id;
    const motion=by('gardenSceneFX');
    if(motion){motion.dataset.world=w.id;motion.innerHTML=window.PauseGardenMotion?.render(w.id)||'';}
    stage.classList.toggle('garden-scene-pending',!variant.image&&!backdrop.firstElementChild);
    const sceneNotice=by('gardenSceneNotice');
    if(sceneNotice)sceneNotice.textContent=variant.legacy
      ?'開發預覽：此景觀沿用網站現有的 AI 生成素材，與你喜歡的原站圖片一致；仍須完成來源與使用權利查核。'
      :'開發預覽：'+w.name+'目前使用原創 SVG 空間構圖，專屬寫實景觀仍待完成。';
    by('gardenWorldCount').textContent=items.length+' 位小生命在這裡，'+decorsHere().length+' 件擺設';
    renderSceneVariants();
    const decorSelect=by('gardenDecorTypes');
    if(decorSelect)decorSelect.innerHTML=(decor?.worlds[state.world]||[]).map(id=>
      '<option value="'+id+'">'+esc(decor.defs[id][0])+'</option>').join('');
    by('gardenDecorCount').textContent='目前有 '+decorsHere().length+' 件小擺設';
    renderLighting();
    renderHotspots();
    const exploreNotice=by('gardenExploreMessage');
    if(exploreNotice){exploreNotice.textContent='';exploreNotice.hidden=true;}
    renderResidentsStage();
    by('gardenPets').innerHTML=w.pets.map(s=>'<option value="'+s+'">'+s+'</option>').join('');
    by('gardenPlants').innerHTML=w.plants.map(s=>'<option value="'+s+'">'+s+'</option>').join('');
    by('gardenResidents').innerHTML=items.length?items.map(item=>
      '<button type="button" class="garden-resident" data-resident="'+item.id+'" aria-label="照顧'+esc(item.species)+'">'+
      '<span class="garden-resident-icon" aria-hidden="true">'+(ICONS[item.species]||'🌱')+'</span>'+
      '<strong>'+esc(item.name||item.species)+'</strong><small>'+(item.kind==='pet'?esc(item.species)+' · 我的陪伴':'植物 · '+growth(item))+'</small></button>'
    ).join(''):'<p class="garden-empty">這裡還有很多空間。你可以先種一朵花，或邀請一個小夥伴。</p>';
    const sel=by('gardenCarePanel').dataset.selected;
    if(!items.some(x=>x.id===sel))by('gardenCarePanel').hidden=true;
    renderWorlds();
  }
  function setWorld(id){
    if(!worlds.some(w=>w.id===id))return;
    state.world=id;save();renderCollection();
    by('gardenWorldRoom').hidden=false;
    by('gardenChoicesPage').hidden=true;
    by('gardenCarePanel').hidden=true;
    by('gardenDecorSelection').hidden=true;
  }
  function add(kind){
    const world=currentWorld();
    const name=by(kind==='pet'?'gardenPets':'gardenPlants').value;
    if(!(kind==='pet'?world.pets:world.plants).includes(name))return;
    if(state.items.length>=160){
      by('gardenFeedback').textContent='這片花園已經很熱鬧，先照顧現在的夥伴吧。';return;
    }
    const id=(globalThis.crypto?.randomUUID?.() || Date.now().toString(36)+'-'+Math.random().toString(36).slice(2)).replace(/[^a-z0-9-]/gi,'').slice(0,48);
    const occupied=itemsHere();
    const slot=occupied.length%24;
    const item={id,world:state.world,kind,species:name,createdAt:Date.now(),care:0,lastAction:'',
      x:clamp(13+(slot%6)*14,8,92),y:clamp(57+Math.floor(slot/6)*10,45,90),name:'',
      harvests:0,lastHarvestAt:0};
    state.items.push(item);save();renderCollection();
    by('gardenFeedback').textContent=kind==='pet'?name+'來到這裡了。慢慢認識牠也很好。':name+'已經種下，會按自己的步調長大。';
    by('gardenWorldRoom').classList.remove('garden-pop');void by('gardenWorldRoom').offsetWidth;by('gardenWorldRoom').classList.add('garden-pop');
  }
  function createDecoration(){
    const type=by('gardenDecorTypes').value;
    if(!decor?.worlds[state.world]?.includes(type))return;
    if(state.decorations.length>=65 || decorsHere().length>=24){
      by('gardenFeedback').textContent='這個區域已經擺滿了，先整理原有的擺設吧。';return;
    }
    const id=(globalThis.crypto?.randomUUID?.()||Date.now().toString(36)+'-'+Math.random().toString(36).slice(2))
      .replace(/[^a-z0-9-]/gi,'').slice(0,48);
    const slot=decorsHere().length;
    state.decorations.push({id,world:state.world,type,
      x:clamp(20+slot%5*14,8,92),y:clamp(70+Math.floor(slot/5)*6,45,90)});
    save();renderCollection();
    by('gardenFeedback').textContent='已放入'+decor.defs[type][0]+'。可以直接拖曳到喜歡的位置。';
  }
  function selectDecoration(id){
    const item=decorsHere().find(x=>x.id===id);if(!item)return;
    by('gardenDecorSelection').dataset.selected=id;
    by('gardenDecorSelection').hidden=false;
    by('gardenDecorSelectedName').textContent=decor.defs[item.type][0];
    by('gardenDecorSelection').scrollIntoView({block:'nearest',behavior:'smooth'});
  }
  function removeDecoration(){
    const id=by('gardenDecorSelection').dataset.selected;
    const current=state.decorations.find(x=>x.id===id && x.world===state.world);
    if(!current)return;
    if(!window.confirm('確定要收起這件擺設嗎？不會影響寵物或植物。'))return;
    state.decorations=state.decorations.filter(x=>x.id!==id);save();renderCollection();
    by('gardenDecorSelection').hidden=true;
    by('gardenFeedback').textContent='已收起'+decor.defs[current.type][0]+'。';
  }
  function refreshCareOptions(item){
    const available=actions[item.kind].filter(([action])=>
      action!=='harvest'||(harvestable.has(item.species)&&growthLevel(item)===3));
    by('gardenCareActions').innerHTML=available.map(([action,label])=>
      '<button type="button" data-garden-action="'+action+'">'+label+'</button>').join('');
    const progress=by('gardenCareGrowth');
    if(progress)progress.textContent=item.kind==='plant'
      ?growth(item)+(harvestable.has(item.species)?
        ' · 已收成 '+item.harvests+' 次'+(growthLevel(item)<3?' · 長成後可以收成':' · 現在可以收成'):' · 隨時間慢慢生長')
      :'陪牠休息、玩耍或照顧，不需要每天回來。';
  }
  function selectItem(id){
    const item=itemsHere().find(x=>x.id===id);if(!item)return;
    const panel=by('gardenCarePanel');panel.dataset.selected=id;panel.hidden=false;
    by('gardenDecorSelection').hidden=true;
    by('gardenCareName').textContent=(ICONS[item.species]||'🌱')+' '+(item.name||item.species);
    by('gardenNickname').value=item.name||'';
    refreshCareOptions(item);
    by('gardenWords').value='';
    by('gardenCareFeedback').textContent='可以只做一個動作，也能留一句話。這裡不會替心情打分數。';
    panel.scrollIntoView({block:'nearest',behavior:'smooth'});
  }
  function rename(){
    const panel=by('gardenCarePanel');
    const item=itemsHere().find(x=>x.id===panel.dataset.selected);
    if(!item)return;
    const name=by('gardenNickname').value.trim().replace(/[\u0000-\u001f\u007f]/g,'').slice(0,20);
    item.name=name;save();renderCollection();
    by('gardenCarePanel').hidden=false;
    by('gardenCareName').textContent=(ICONS[item.species]||'🌱')+' '+(name||item.species);
    by('gardenCareFeedback').textContent=name?'你替這位小夥伴取了名字：「'+name+'」。':'已使用原本的物種名稱。';
  }
  function care(action){
    const panel=by('gardenCarePanel'),item=itemsHere().find(x=>x.id===panel.dataset.selected);
    if(!item)return;
    const found=actions[item.kind].find(x=>x[0]===action);if(!found)return;
    if(action==='harvest'){
      if(item.kind!=='plant'||!harvestable.has(item.species)||growthLevel(item)<3)return;
      item.harvests+=1;item.lastHarvestAt=Date.now();
    }else item.care+=1;
    item.lastAction=action;
    const words=by('gardenWords').value.trim().slice(0,120);
    // Intentionally DO NOT persist or transmit private words; they're only displayed transiently.
    by('gardenCareFeedback').textContent=found[2]+(words?' 你留下：「'+words+'」':'');
    by('gardenCareFeedback').classList.remove('garden-pulse');void by('gardenCareFeedback').offsetWidth;
    by('gardenCareFeedback').classList.add('garden-pulse');
    by('gardenWords').value='';
    save();
    // Preserve panel; re-render resident growth without scrolling elsewhere.
    const selected=item.id;renderCollection();by('gardenCarePanel').dataset.selected=selected;
    by('gardenCarePanel').hidden=false;
    refreshCareOptions(item);
    const currentStage=by('gardenResidentsStage');
    if(words&&currentStage){
      // Ephemeral visual only. Never store input text in JSON, URLs or external services.
      currentStage.querySelector('.garden-word-trail')?.remove();
      const spark=document.createElement('span');
      spark.className='garden-word-trail';
      spark.textContent=words.slice(0,35);
      spark.dataset.action=action;
      const p=position(item);
      spark.style.left=p.x+'%';
      spark.style.top=clamp(p.y-18,18,75)+'%';
      currentStage.appendChild(spark);
      setTimeout(()=>spark.remove(),reduceMotion?3000:1900);
    }
    const marker=by('gardenResidentsStage')?.querySelector('[data-stage-resident="'+item.id+'"]');
    if(marker){
      marker.dataset.activity=action;
      marker.querySelector('.garden-action-vfx')?.remove();
      if(!reduceMotion){
        marker.insertAdjacentHTML('beforeend',sprites?.effect(action)||'');
        setTimeout(()=>{if(marker.isConnected){
          delete marker.dataset.activity;
          marker.querySelector('.garden-action-vfx')?.remove();
        }},1400);
      }else delete marker.dataset.activity;
    }
  }
  function backup(){
    const b=new Blob([JSON.stringify({exportedAt:new Date().toISOString(),...state},null,2)],{type:'application/json'});
    const url=URL.createObjectURL(b);
    const a=document.createElement('a');a.href=url;a.download='今日一息-陪伴花園備份.json';a.click();
    setTimeout(()=>URL.revokeObjectURL(url),1000);
  }
  function restore(file){
    if(!file||file.size>400000){by('gardenFeedback').textContent='檔案太大，沒有匯入。';return;}
    file.text().then(text=>{
      const raw=JSON.parse(text);
      if(raw.version!==1||!Array.isArray(raw.items)||raw.items.length>160)throw Error('invalid');
      const clean=sanitize(raw);
      // Reject invalid backups rather than silently discarding residents.
      if(clean.items.length!==raw.items.length || clean.items.length>160)throw Error('invalid residents');
      if(new Set(clean.items.map(x=>x.id)).size!==clean.items.length)throw Error('duplicate ids');
      if(raw.decorations!==undefined &&
         (!Array.isArray(raw.decorations)||clean.decorations.length!==raw.decorations.length||
          new Set(clean.decorations.map(x=>x.id)).size!==clean.decorations.length))throw Error('invalid decorations');
      // Do not silently merge into an existing garden.
      if(!window.confirm('匯入將取代這台裝置目前的陪伴花園。確定要繼續嗎？'))return;
      // A verified manual restore is allowed even if the existing stored data
      // could not be read; otherwise the damaged record remains untouched.
      try{
        localStorage.setItem(storageKey,JSON.stringify(clean));
      }catch(_){throw Error('cannot persist restored data');}
      state=clean;loadError=false;recoverableRaw=null;
      recoveryUI();renderCollection();by('gardenFeedback').textContent='備份已匯入並儲存在此裝置。';
    }).catch(()=>{by('gardenFeedback').textContent='這份檔案無法讀取，現有花園沒有變更。';});
  }
  function openGate(){
    const gate=by('gardenGate');
    gate.hidden=false;by('gardenChoicesPage').hidden=true;by('gardenWorldRoom').hidden=true;
    gate.classList.remove('garden-door-open');by('gardenEnter').focus({preventScroll:true});
  }
  function enter(skip=false){
    const gate=by('gardenGate');gate.classList.add('garden-door-open');
    const finish=()=>{gate.hidden=true;by('gardenChoicesPage').hidden=false;renderWorlds();};
    if(skip||matchMedia('(prefers-reduced-motion: reduce)').matches)finish();
    else setTimeout(finish,700);
  }
  let drag=null,lastDragEnded=0;
  const stage=by('gardenResidentsStage');
  if(stage){
    stage.addEventListener('pointerdown',e=>{
      const button=e.target.closest?.('[data-stage-resident], [data-stage-decor]');
      if(!button||e.button>0)return;
      const item=button.dataset.stageDecor
        ?decorsHere().find(x=>x.id===button.dataset.stageDecor)
        :itemsHere().find(x=>x.id===button.dataset.stageResident);
      if(!item)return;
      const rect=stage.getBoundingClientRect(),point=position(item);
      drag={button,id:e.pointerId,item,rect,startX:e.clientX,startY:e.clientY,x:point.x,y:point.y,moved:false};
      try{button.setPointerCapture(e.pointerId)}catch(_){}
    });
    stage.addEventListener('pointermove',e=>{
      if(!drag||drag.id!==e.pointerId)return;
      const d=drag;
      if(!d.moved&&Math.hypot(e.clientX-d.startX,e.clientY-d.startY)<6)return;
      d.moved=true;e.preventDefault();
      const x=clamp(d.x+(e.clientX-d.startX)/(d.rect.width||1)*100,8,92);
      const y=clamp(d.y+(e.clientY-d.startY)/(d.rect.height||1)*100,45,90);
      d.button.style.left=x+'%';d.button.style.top=y+'%';
    });
    const end=e=>{
      if(!drag||drag.id!==e.pointerId)return;
      if(drag.moved){
        const d=drag;d.item.x=clamp(d.x+(e.clientX-d.startX)/(d.rect.width||1)*100,8,92);
        d.item.y=clamp(d.y+(e.clientY-d.startY)/(d.rect.height||1)*100,45,90);
        lastDragEnded=Date.now();save();
      }
      try{drag.button.releasePointerCapture(e.pointerId)}catch(_){}
      drag=null;
    };
    stage.addEventListener('pointerup',end);
    stage.addEventListener('pointercancel',end);
    stage.addEventListener('keydown',e=>{
      if(!['ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(e.key))return;
      const b=e.target.closest?.('[data-stage-resident], [data-stage-decor]');if(!b)return;
      const item=b.dataset.stageDecor
        ?decorsHere().find(x=>x.id===b.dataset.stageDecor)
        :itemsHere().find(x=>x.id===b.dataset.stageResident);
      if(!item)return;
      const old=position(item);item.x=clamp(old.x+(e.key==='ArrowLeft'?-3:e.key==='ArrowRight'?3:0),8,92);
      item.y=clamp(old.y+(e.key==='ArrowUp'?-3:e.key==='ArrowDown'?3:0),45,90);
      b.style.left=item.x+'%';b.style.top=item.y+'%';e.preventDefault();save();
    });
  }
  root.addEventListener('click',e=>{
    const b=e.target.closest('button');if(!b)return;
    if(b.id==='gardenEnter'||b.id==='gardenSkipGate')enter(b.id==='gardenSkipGate');
    else if(b.dataset.stageResident){
      if(Date.now()-lastDragEnded<350)return;
      selectItem(b.dataset.stageResident);
    }
    else if(b.dataset.stageDecor){
      if(Date.now()-lastDragEnded<350)return;
      selectDecoration(b.dataset.stageDecor);
    }
    else if(b.id==='gardenAddDecor')createDecoration();
    else if(b.id==='gardenRemoveDecor')removeDecoration();
    else if(b.id==='gardenCloseDecor')by('gardenDecorSelection').hidden=true;
    else if(b.dataset.selfCare)chooseSelfCare(b.dataset.selfCare);
    else if(b.dataset.gardenHotspot)explore(b.dataset.gardenHotspot);
    else if(b.dataset.gardenLight)chooseLighting(b.dataset.gardenLight);
    else if(b.dataset.sceneVariant)setSceneVariant(b.dataset.sceneVariant);
    else if(b.dataset.chooseWorld)setWorld(b.dataset.chooseWorld);
    else if(b.id==='gardenChangeWorld'){by('gardenWorldRoom').hidden=true;by('gardenChoicesPage').hidden=false;}
    else if(b.id==='gardenAddPet')add('pet');
    else if(b.id==='gardenAddPlant')add('plant');
    else if(b.dataset.resident)selectItem(b.dataset.resident);
    else if(b.dataset.gardenAction)care(b.dataset.gardenAction);
    else if(b.id==='gardenCloseCare')by('gardenCarePanel').hidden=true;
    else if(b.id==='gardenSaveName')rename();
    else if(b.id==='gardenBackup')backup();
    else if(b.id==='gardenImport')by('gardenImportFile').click();
    else if(b.id==='gardenExportRecovery')exportRecovery();
    else if(b.id==='gardenResetBroken')resetBrokenGarden();
  });
  by('gardenImportFile').addEventListener('change',e=>{restore(e.target.files?.[0]);e.target.value='';});
  window.addEventListener('pause:view-change',e=>{
    if(e.detail?.view==='garden')openGate();
  });
  renderCollection();
  recoveryUI();
  if(!loadError)save();
})();