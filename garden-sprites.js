// 今日一息｜陪伴花園：第一階段的原創向量生物。
// Artwork is a lightweight interim scene renderer, not the approved realistic final art.
(() => {
  'use strict';
  const animalProfiles={
    '貓':{type:'cat',body:'#bc997d',light:'#efdbbe',dark:'#72564a'},
    '狗':{type:'dog',body:'#b88a66',light:'#ebcdaa',dark:'#6e503f'},
    '兔子':{type:'rabbit',body:'#f0e5d5',light:'#fff9ef',dark:'#a69b92'},
    '天竺鼠':{type:'guinea',body:'#c39b76',light:'#f7e0bd',dark:'#845d48'},
    '雞':{type:'chicken',body:'#f5e6cf',light:'#fff8e9',dark:'#ba9575'},
    '鴨':{type:'duck',body:'#f3dfb1',light:'#fff6da',dark:'#be945d'},
    '牛':{type:'cow',body:'#faf1e3',light:'#fffdfa',dark:'#564b47'}
  };
  const plantProfiles={
    '玫瑰':['#c26d73','#49765f','flower'],'向日葵':['#e7b850','#64804c','flower'],
    '繡球花':['#a6b5cc','#718567','flower'],'薰衣草':['#a68aa9','#6e8068','spike'],
    '蘋果樹':['#ca7760','#6e916f','tree'],'草莓':['#c8504d','#709756','fruit'],
    '番茄':['#d66d4d','#6c8d59','fruit'],'稻米':['#ddbc6f','#8e9c6a','spike'],
    '南瓜':['#d58c50','#6e8d59','fruit'],'橘子樹':['#e3a150','#769570','tree'],
    '松樹':['#71936e','#597b62','pine'],'楓樹':['#d69c66','#6d8d68','tree'],
    '蕨類':['#8bb295','#669170','leaf'],'野花':['#e5bd93','#6e966a','flower'],
    '香草':['#b9cda4','#78996d','leaf'],'海濱木槿':['#d7a1a0','#699477','flower'],
    '馬鞍藤':['#b5a0bc','#6a9b82','flower'],'濱刺麥':['#d4c090','#8da07d','spike'],
    '椰子樹':['#7fa979','#63906e','palm'],'櫻花樹':['#ddb5bc','#799676','tree'],
    '榕樹':['#86a17b','#72916a','tree'],'雛菊':['#f2e6cf','#73976c','flower'],
    '杜鵑':['#d790a2','#79976c','flower']
  };
  const defs='<defs><linearGradient id="body" x1="0" x2=".8" y1="0" y2="1"><stop stop-color="var(--light)"/><stop offset=".65" stop-color="var(--body)"/><stop offset="1" stop-color="var(--dark)"/></linearGradient><linearGradient id="leaf" x1="0" x2="1" y1="0" y2="1"><stop stop-color="#c1d3ae"/><stop offset="1" stop-color="var(--leaf)"/></linearGradient></defs>';
  function animal(species){
    const p=animalProfiles[species]||animalProfiles['貓'];
    const palettes='--body:'+p.body+';--light:'+p.light+';--dark:'+p.dark+';';
    const shadow='<ellipse cx="76" cy="119" rx="52" ry="7" fill="#243b29" opacity=".15"/>';
    const eyes='<circle cx="61" cy="58" r="2.6" fill="#3e413c"/><circle cx="90" cy="58" r="2.6" fill="#3e413c"/>';
    const nose='<path d="M72 68q4 4 8 0" fill="none" stroke="#675b55" stroke-width="2" stroke-linecap="round"/>';
    let shape='';
    if(p.type==='cat'){
      shape='<path class="garden-tail" d="M105 90Q145 89 134 54Q129 42 119 47" fill="none" stroke="var(--body)" stroke-width="12" stroke-linecap="round"/>'+
      '<ellipse cx="76" cy="91" rx="38" ry="22" fill="url(#body)"/>'+
      '<path d="M49 43L47 17Q48 10 56 19L64 28Q77 23 91 30L106 15Q113 12 110 43Z" fill="var(--body)" stroke="var(--dark)" stroke-width="1.5"/>'+
      '<ellipse cx="77" cy="53" rx="31" ry="28" fill="url(#body)"/><path d="M52 23L54 34 64 29M103 24L100 34 89 29" fill="#cf9b99"/>'+
      eyes+nose+'<path d="M75 63l5 0-3 4z" fill="#a47c76"/>'+
      '<path d="M51 68L34 65M51 73L33 76M99 68L115 65M99 73L115 76" stroke="#a58d7c" stroke-width="1.2"/>';
    }else if(p.type==='dog'){
      shape='<path class="garden-tail" d="M106 90Q142 67 132 52" fill="none" stroke="var(--body)" stroke-width="12" stroke-linecap="round"/>'+
      '<ellipse cx="76" cy="91" rx="42" ry="23" fill="url(#body)"/><ellipse cx="70" cy="60" rx="32" ry="30" fill="url(#body)"/>'+
      '<path d="M46 45Q19 35 31 75Q35 84 45 70M93 45Q124 31 108 78Q103 85 94 67" fill="var(--dark)"/>'+
      '<ellipse cx="74" cy="75" rx="17" ry="13" fill="var(--light)"/>'+eyes+
      '<ellipse cx="74" cy="68" rx="6" ry="4" fill="#554941"/><path d="M73 74q6 9 12 0" stroke="#6b5749" stroke-width="1.5" fill="none"/>';
    }else if(p.type==='rabbit'){
      shape='<ellipse cx="78" cy="94" rx="41" ry="24" fill="url(#body)"/>'+
      '<path d="M55 39Q39 -13 51 2Q63 15 65 37M84 38Q84 -11 97 2Q106 17 94 43" fill="var(--light)" stroke="var(--dark)" stroke-width="1.4"/>'+
      '<path d="M56 12Q58 22 59 34M94 11Q93 24 91 35" stroke="#d7b8ae" stroke-width="4" fill="none"/>'+
      '<ellipse cx="74" cy="59" rx="31" ry="28" fill="url(#body)"/>'+eyes+nose+
      '<circle cx="116" cy="95" r="10" fill="var(--light)"/>';
    }else if(p.type==='guinea'){
      shape='<ellipse cx="77" cy="88" rx="54" ry="31" fill="url(#body)"/><ellipse cx="47" cy="68" rx="12" ry="12" fill="var(--dark)"/>'+
      '<ellipse cx="105" cy="68" rx="12" ry="12" fill="var(--dark)"/>'+
      '<ellipse cx="76" cy="79" rx="41" ry="25" fill="var(--light)" opacity=".5"/>'+eyes+nose;
    }else if(p.type==='chicken'||p.type==='duck'){
      const comb=p.type==='chicken'?'<path d="M69 37Q63 19 72 22Q75 10 83 21Q96 17 87 39" fill="#bd6255"/>':'';
      const bill='<path d="M84 61L105 67 83 72Z" fill="#d7a05c"/>';
      shape='<ellipse cx="76" cy="87" rx="40" ry="28" fill="url(#body)"/>'+
        '<ellipse cx="69" cy="55" rx="25" ry="29" fill="url(#body)"/>'+comb+bill+
        '<ellipse cx="76" cy="84" rx="24" ry="14" fill="var(--light)" opacity=".65"/>'+
        '<circle cx="73" cy="55" r="3" fill="#493e39"/>'+
        '<path d="M59 105l-4 12m22-10 4 11" stroke="#a57e58" stroke-width="3" fill="none"/>';
    }else if(p.type==='cow'){
      shape='<path class="garden-tail" d="M117 83q27 10 20 30" stroke="#a99f90" stroke-width="5" fill="none"/>'+
        '<rect x="30" y="68" width="88" height="41" rx="19" fill="url(#body)"/>'+
        '<path d="M43 103v18m57-18v18" stroke="var(--dark)" stroke-width="8" stroke-linecap="round"/>'+
        '<ellipse cx="73" cy="55" rx="31" ry="29" fill="url(#body)"/>'+
        '<path d="M49 39l-26-10 6 23 21 2M93 39l28-10-7 23-21 2" fill="var(--dark)"/>'+
        '<path d="M75 76q-16 9-22-4q-1-18 17-17q28-4 31 14q-2 12-26 7" fill="#d9b8ae"/>'+
        '<circle cx="70" cy="69" r="3" fill="#99776d"/><circle cx="87" cy="69" r="3" fill="#99776d"/>'+
        '<circle cx="62" cy="47" r="3" fill="#3f423f"/><circle cx="89" cy="47" r="3" fill="#3f423f"/>'+
        '<path d="M40 82q15-18 25-1q-7 22-25 1M96 82q13-10 16 4q-14 9-16-4" fill="#7b726c"/>';
    }
    return '<svg class="garden-animal" viewBox="0 0 150 130" style="'+palettes+'" aria-hidden="true">'+defs+shadow+shape+'</svg>';
  }
  function plant(species,stage){
    const p=plantProfiles[species]||['#ddb7a5','#749c7c','flower'];
    const flower=p[0],leaf=p[1],kind=p[2];
    const level=Math.max(0,Math.min(3,Number(stage)||0));
    if(level===0)return '<svg class="garden-plant" viewBox="0 0 130 150" aria-hidden="true"><ellipse cx="65" cy="137" rx="45" ry="8" fill="#503f30" opacity=".2"/><path d="M55 127q10-10 20 0q-9 15-20 0" fill="#86694c"/><path d="M43 141q22-6 45 0" stroke="#8c785d" stroke-width="6" fill="none"/></svg>';
    let petals='';
    if(level>=3&&['flower','fruit','tree','spike'].includes(kind)){
      if(kind==='fruit'||kind==='tree'){
        petals=[[-19,-41],[13,-65],[24,-32]].map(([x,y])=>'<circle cx="'+(65+x)+'" cy="'+(92+y)+'" r="7" fill="'+flower+'"/>').join('');
      }else if(kind==='spike'){
        petals=Array.from({length:6},(_,i)=>'<ellipse cx="'+(64+(i%2?6:-6))+'" cy="'+(37+i*7)+'" rx="5" ry="8" fill="'+flower+'"/>').join('');
      }else{
        petals=Array.from({length:7},(_,i)=>{const a=i*Math.PI*2/7;return '<ellipse cx="'+(65+Math.cos(a)*13)+'" cy="'+(35+Math.sin(a)*13)+'" rx="10" ry="13" fill="'+flower+'"/>'}).join('')+'<circle cx="65" cy="35" r="8" fill="#e1bc70"/>';
      }
    }
    const scale=level===1?.56:level===2?.8:1;
    const branches=level===1?'':'<path d="M65 91Q42 80 39 55M65 80Q89 61 94 49" fill="none" stroke="'+leaf+'" stroke-width="4"/>';
    const leafMarkup='<ellipse cx="46" cy="87" rx="21" ry="10" transform="rotate(23 46 87)" fill="'+leaf+'"/><ellipse cx="84" cy="71" rx="21" ry="10" transform="rotate(-24 84 71)" fill="#a1b99b"/>';
    const trunk=kind==='tree'||kind==='pine'||kind==='palm'?7:4;
    const pine=kind==='pine'&&level>=2?'<path d="M65 22 29 78h72Z" fill="#6c926e" opacity=".9"/><path d="M65 37 20 104h90Z" fill="#568067" opacity=".9"/>':'';
    return '<svg class="garden-plant" viewBox="0 0 130 150" aria-hidden="true">'+
      '<ellipse cx="65" cy="139" rx="44" ry="8" fill="#4d654b" opacity=".2"/>'+
      '<g transform="translate(65 137) scale('+scale+') translate(-65 -137)">'+
      '<path d="M65 139Q57 81 65 39" fill="none" stroke="#7d7653" stroke-width="'+trunk+'" stroke-linecap="round"/>'+
      branches+leafMarkup+pine+petals+'</g></svg>';
  }
  function markup(item,stage){return item.kind==='pet'?animal(item.species):plant(item.species,stage)}
  window.PauseGardenSprites={markup,animal,plant};
})();
