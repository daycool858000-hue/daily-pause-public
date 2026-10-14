// 今日一息｜陪伴花園的環境互動。
// 互動不需要登入、沒有計分，也不會保存個人的句子。
(() => {
  'use strict';
  const descriptions={
    flowers:{
      intro:'花草間有一些可以慢慢發現的小動靜。',
      spots:[
        {id:'butterfly',title:'看看蝴蝶',x:28,y:32,glyph:'🦋',effect:'flutter',say:'蝴蝶繞過花叢，輕輕停了一會兒。'},
        {id:'scent',title:'聞一朵花',x:73,y:58,glyph:'✿',effect:'petals',say:'靠近一朵花，空氣像是也柔軟了一點。'},
        {id:'light',title:'迎著陽光',x:66,y:20,glyph:'☀',effect:'glow',say:'光落在葉子邊緣，像是替今天留了一小段空白。'}
      ]
    },
    farm:{
      intro:'看看田裡的變化，也可以什麼都不做。',
      spots:[
        {id:'soil',title:'摸摸泥土',x:28,y:78,glyph:'🌱',effect:'seeds',say:'土壤裡藏著細小的生命，生長不用著急。'},
        {id:'harvest',title:'看看收成',x:70,y:65,glyph:'🍓',effect:'harvest',say:'有些果實還沒熟，等待也是種照顧。'},
        {id:'breeze',title:'讓風吹過',x:53,y:30,glyph:'〰',effect:'breeze',say:'風吹過田畦，草葉往同一個方向輕輕低頭。'}
      ]
    },
    forest:{
      intro:'沿著樹影慢慢走，看看森林裡的小事。',
      spots:[
        {id:'bird',title:'聽聽鳥聲',x:68,y:26,glyph:'♬',effect:'birds',say:'樹梢傳來幾聲鳥鳴，又回到安靜。'},
        {id:'fern',title:'看看蕨葉',x:22,y:74,glyph:'🌿',effect:'leaves',say:'一片蕨葉安靜展開，不需要有人催促。'},
        {id:'sunbeam',title:'走進光裡',x:48,y:42,glyph:'✦',effect:'glow',say:'陽光穿過樹冠，在地面留下零碎的光影。'}
      ]
    },
    coast:{
      intro:'潮水來了又退，你可以在這裡停留。',
      spots:[
        {id:'shell',title:'看看貝殼',x:34,y:78,glyph:'◡',effect:'shells',say:'潮水退去，留下幾枚不同形狀的貝殼。'},
        {id:'tide',title:'看一段浪',x:65,y:60,glyph:'≈',effect:'waves',say:'海浪向岸邊靠近，又慢慢退回去。'},
        {id:'sea-air',title:'感受海風',x:52,y:27,glyph:'〰',effect:'breeze',say:'遠方的風剛好吹來，帶著一點鹹鹹的氣息。'}
      ]
    },
    park:{
      intro:'在公園裡散步，走累了也能坐下。',
      spots:[
        {id:'bench',title:'坐一下',x:34,y:70,glyph:'⌑',effect:'rest',say:'這張椅子現在沒有人坐，剛好留給你。'},
        {id:'pond',title:'看看池塘',x:67,y:63,glyph:'◌',effect:'ripples',say:'水面起了一圈細小的波紋，然後慢慢散開。'},
        {id:'falling',title:'接一片葉子',x:72,y:25,glyph:'♧',effect:'leaves',say:'一片葉子沿著風的方向，慢慢落到地面。'}
      ]
    }
  };
  const escape=s=>String(s).replace(/[&<>"']/g,c=>({
    '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','"':'&quot;',"'":'&#39;'
  }[c]));
  const root=document.getElementById('gardenWorldExperiences');
  const feedback=document.getElementById('gardenExploreFeedback');
  if(!root||!feedback)return;
  let current='flowers',pending=null,activeTimer=null;
  function clear(){
    root.querySelectorAll('.garden-spot-spark').forEach(x=>x.remove());
    if(activeTimer){clearTimeout(activeTimer);activeTimer=null;}
    feedback.textContent='';
  }
  function render(world){
    if(!descriptions[world])return;
    current=world;clear();
    const data=descriptions[world];
    feedback.textContent=data.intro;
    root.innerHTML=data.spots.map(p=>
      '<button type="button" class="garden-hotspot" data-garden-spot="'+p.id+'" '+
      'style="left:'+p.x+'%;top:'+p.y+'%" '+
      'aria-label="'+escape(p.title)+'" title="'+escape(p.title)+'">'+
      '<span class="garden-hotspot-glyph" aria-hidden="true">'+p.glyph+'</span>'+
      '<span class="garden-hotspot-label">'+escape(p.title)+'</span></button>').join('');
  }
  function interact(id){
    const item=descriptions[current]?.spots.find(p=>p.id===id);
    if(!item)return;
    clear();
    feedback.textContent=item.say;
    const button=[...root.querySelectorAll('[data-garden-spot]')].find(b=>b.dataset.gardenSpot===id);
    if(!button)return;
    const sparkle=document.createElement('span');
    sparkle.className='garden-spot-spark garden-spot-'+item.effect;
    sparkle.setAttribute('aria-hidden','true');
    sparkle.textContent=({flutter:'✦　✿',petals:'❀　❀',glow:'✧　✧',seeds:'✿　✿',
      harvest:'✧　✧',breeze:'〜　〜',birds:'♪　♬',leaves:'❧　❧',
      shells:'◡　◡',waves:'〜　≈',rest:'✧　✧',ripples:'◌　◌'}[item.effect]||'✧　✧');
    button.appendChild(sparkle);
    activeTimer=setTimeout(()=>{sparkle.remove();activeTimer=null;},1700);
  }
  root.addEventListener('click',e=>{
    const target=e.target.closest?.('[data-garden-spot]');
    if(!target)return;
    e.stopPropagation();
    interact(target.dataset.gardenSpot);
  });
  window.PauseGardenExplore={render,spotsFor:id=>descriptions[id]?.spots.map(s=>({id:s.id,title:s.title}))||[]};
})();