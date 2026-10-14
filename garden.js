// 今日一息｜陪伴花園第一階段：本機單人照顧與五個世界。
// This is a development preview. Landscape images are existing on-site artwork,
// pending original dedicated assets, rights verification and owner visual acceptance.
(() => {
  'use strict';
  const root=document.getElementById('gardenWorld');
  if(!root)return;
  const by=id=>document.getElementById(id);
  const storageKey='daily-pause-garden-v1';
  const worlds=[
    {id:'flowers',name:'花園',sub:'為自己種一片花與樹',image:'./media/generated/scene-04.webp',
      plants:['玫瑰','向日葵','繡球花','薰衣草','蘋果樹'],pets:['貓','狗','兔子','天竺鼠']},
    {id:'farm',name:'田間',sub:'慢慢耕種，等果實長大',image:'./media/generated/scene-11.webp',
      plants:['草莓','番茄','稻米','南瓜','橘子樹'],pets:['雞','鴨','牛','狗']},
    {id:'forest',name:'森林',sub:'沿著樹影走一會兒',image:'./media/generated/scene-03.webp',
      plants:['松樹','楓樹','蕨類','野花','香草'],pets:['貓','狗','兔子']},
    {id:'coast',name:'海邊',sub:'聽風來，陪海浪待一下',image:'./media/generated/scene-02.webp',
      plants:['海濱木槿','馬鞍藤','濱刺麥','椰子樹'],pets:['狗','貓']},
    {id:'park',name:'公園',sub:'留一張椅子給今天',image:'./media/generated/scene-08.webp',
      plants:['櫻花樹','榕樹','雛菊','玫瑰','杜鵑'],pets:['狗','貓','兔子']}
  ];
  const ICONS={'玫瑰':'🌹','向日葵':'🌻','繡球花':'🌸','薰衣草':'🪻','蘋果樹':'🌳',
    '草莓':'🍓','番茄':'🍅','稻米':'🌾','南瓜':'🎃','橘子樹':'🍊','松樹':'🌲',
    '楓樹':'🍁','蕨類':'🌿','野花':'🌼','香草':'🌱','海濱木槿':'🌺','馬鞍藤':'🌿',
    '濱刺麥':'🌾','椰子樹':'🌴','櫻花樹':'🌸','榕樹':'🌳','雛菊':'🌼','杜鵑':'🌺',
    '狗':'🐕','貓':'🐈','兔子':'🐇','天竺鼠':'🐹','雞':'🐓','鴨':'🦆','牛':'🐄'};
  const actions={
    pet:[['feed','餵食','吃飽後，牠在你身邊舒服地休息。'],['play','玩耍','牠朝你靠近，像是想再玩一下。'],['wash','洗澡','水珠輕輕落下，牠甩了甩身體。'],['rest','陪牠休息','牠找到舒服的位置，慢慢安靜下來。']],
    plant:[['water','澆水','泥土吸收了水分，葉子在微風裡搖晃。'],['care','整理','你替它整理周圍的空間。'],['watch','看看它','它照自己的速度生長。'],['rest','坐在旁邊','你和它一起待了一會兒。']]
  };
  const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','"':'&quot;',"'":'&#39;'}[c]));
  const newState=()=>({version:1,world:'flowers',items:[]});
  const speciesValid=item=>worlds.some(w=>w.id===item.world &&
    (item.kind==='pet'?w.pets:w.plants).includes(item.species));
  function sanitize(input){
    const clean=newState();
    if(input && worlds.some(w=>w.id===input.world))clean.world=input.world;
    if(Array.isArray(input?.items))clean.items=input.items.slice(0,160).filter(item=>
      item && typeof item==='object' &&
      ['pet','plant'].includes(item.kind) && speciesValid(item) &&
      typeof item.id==='string' && /^[a-z0-9-]{1,48}$/i.test(item.id) &&
      Number.isFinite(item.createdAt) && item.createdAt>0 && item.createdAt<Date.now()+86400000 &&
      Number.isInteger(item.care)&&item.care>=0&&item.care<100000
    ).map(item=>({id:item.id,world:item.world,kind:item.kind,species:item.species,
      createdAt:item.createdAt,care:item.care,lastAction:typeof item.lastAction==='string' ?
        item.lastAction.slice(0,30):''}));
    return clean;
  }
  let state;
  try{state=sanitize(JSON.parse(localStorage.getItem(storageKey)||'null'));}catch(_){state=newState();}
  function save(){
    try{localStorage.setItem(storageKey,JSON.stringify(state));by('gardenSaveState').textContent='保存在此裝置';}
    catch(_){by('gardenSaveState').textContent='儲存空間不足，請匯出備份';}
  }
  function currentWorld(){return worlds.find(w=>w.id===state.world)||worlds[0]}
  function itemsHere(){return state.items.filter(x=>x.world===state.world)}
  const day=86400000;
  function growth(item){
    if(item.kind!=='plant')return '';
    const age=Math.max(0,Math.floor((Date.now()-item.createdAt)/day));
    return ['種子','發芽','長葉','長成'][Math.min(3,Math.floor(age/2)+Math.floor(item.care/3))];
  }
  function renderWorlds(){
    by('gardenWorldChoices').innerHTML=worlds.map(w=>
      '<button type="button" class="garden-world-choice" data-choose-world="'+w.id+'" aria-pressed="'+(w.id===state.world)+'">'+
      '<img src="'+w.image+'" alt="" loading="lazy"><span><strong>'+w.name+'</strong><small>'+w.sub+'</small></span></button>'
    ).join('');
  }
  function renderCollection(){
    const w=currentWorld(),items=itemsHere();
    by('gardenWorldTitle').textContent=w.name;
    by('gardenWorldSubtitle').textContent=w.sub;
    by('gardenBackdrop').style.backgroundImage='url("'+w.image+'")';
    by('gardenWorldCount').textContent=items.length+' 位小生命在這裡';
    by('gardenPets').innerHTML=w.pets.map(s=>'<option value="'+s+'">'+s+'</option>').join('');
    by('gardenPlants').innerHTML=w.plants.map(s=>'<option value="'+s+'">'+s+'</option>').join('');
    by('gardenResidents').innerHTML=items.length?items.map(item=>
      '<button type="button" class="garden-resident" data-resident="'+item.id+'" aria-label="照顧'+esc(item.species)+'">'+
      '<span class="garden-resident-icon" aria-hidden="true">'+(ICONS[item.species]||'🌱')+'</span>'+
      '<strong>'+esc(item.species)+'</strong><small>'+(item.kind==='pet'?'我的陪伴':'植物 · '+growth(item))+'</small></button>'
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
  }
  function add(kind){
    const world=currentWorld();
    const name=by(kind==='pet'?'gardenPets':'gardenPlants').value;
    if(!(kind==='pet'?world.pets:world.plants).includes(name))return;
    if(state.items.length>=160){
      by('gardenFeedback').textContent='這片花園已經很熱鬧，先照顧現在的夥伴吧。';return;
    }
    const id=(globalThis.crypto?.randomUUID?.() || Date.now().toString(36)+'-'+Math.random().toString(36).slice(2)).replace(/[^a-z0-9-]/gi,'').slice(0,48);
    const item={id,world:state.world,kind,species:name,createdAt:Date.now(),care:0,lastAction:''};
    state.items.push(item);save();renderCollection();
    by('gardenFeedback').textContent=kind==='pet'?name+'來到這裡了。慢慢認識牠也很好。':name+'已經種下，會按自己的步調長大。';
    by('gardenWorldRoom').classList.remove('garden-pop');void by('gardenWorldRoom').offsetWidth;by('gardenWorldRoom').classList.add('garden-pop');
  }
  function selectItem(id){
    const item=itemsHere().find(x=>x.id===id);if(!item)return;
    const panel=by('gardenCarePanel');panel.dataset.selected=id;panel.hidden=false;
    by('gardenCareName').textContent=(ICONS[item.species]||'🌱')+' '+item.species;
    by('gardenCareActions').innerHTML=actions[item.kind].map(([action,label])=>
      '<button type="button" data-garden-action="'+action+'">'+label+'</button>').join('');
    by('gardenWords').value='';
    by('gardenCareFeedback').textContent='可以只做一個動作，也能留一句話。這裡不會替心情打分數。';
    panel.scrollIntoView({block:'nearest',behavior:'smooth'});
  }
  function care(action){
    const panel=by('gardenCarePanel'),item=itemsHere().find(x=>x.id===panel.dataset.selected);
    if(!item)return;
    const found=actions[item.kind].find(x=>x[0]===action);if(!found)return;
    item.care+=1;item.lastAction=action;
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
      // Do not silently merge into an existing garden.
      if(!window.confirm('匯入將取代這台裝置目前的陪伴花園。確定要繼續嗎？'))return;
      state=clean;save();renderCollection();by('gardenFeedback').textContent='備份已匯入。';
    }).catch(()=>{by('gardenFeedback').textContent='這份檔案無法讀取，現有花園沒有變更。';});
  }
  function openGate(){
    const gate=by('gardenGate');
    gate.hidden=false;by('gardenChoicesPage').hidden=true;by('gardenWorldRoom').hidden=true;
    gate.classList.remove('garden-door-open');by('gardenEnter').focus({preventScroll:true});
  }
  function enter(){
    const gate=by('gardenGate');gate.classList.add('garden-door-open');
    const finish=()=>{gate.hidden=true;by('gardenChoicesPage').hidden=false;renderWorlds();};
    if(matchMedia('(prefers-reduced-motion: reduce)').matches)finish();
    else setTimeout(finish,700);
  }
  root.addEventListener('click',e=>{
    const b=e.target.closest('button');if(!b)return;
    if(b.id==='gardenEnter'||b.id==='gardenSkipGate')enter();
    else if(b.dataset.chooseWorld)setWorld(b.dataset.chooseWorld);
    else if(b.id==='gardenChangeWorld'){by('gardenWorldRoom').hidden=true;by('gardenChoicesPage').hidden=false;}
    else if(b.id==='gardenAddPet')add('pet');
    else if(b.id==='gardenAddPlant')add('plant');
    else if(b.dataset.resident)selectItem(b.dataset.resident);
    else if(b.dataset.gardenAction)care(b.dataset.gardenAction);
    else if(b.id==='gardenCloseCare')by('gardenCarePanel').hidden=true;
    else if(b.id==='gardenBackup')backup();
    else if(b.id==='gardenImport')by('gardenImportFile').click();
  });
  by('gardenImportFile').addEventListener('change',e=>{restore(e.target.files?.[0]);e.target.value='';});
  window.addEventListener('pause:view-change',e=>{
    if(e.detail?.view==='garden')openGate();
  });
  renderCollection();
  save();
})();