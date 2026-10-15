// 今日一息｜獨立景觀畫作。自製水墨、淡彩及畫布筆觸，不使用第三方圖像。
// 景觀在載入時先繪成圖片；動畫只在使用者加入的形狀層發生。
(function(){
'use strict';
const items=[
 ['forest','森林','水墨霧林與林間小路'],
 ['ocean','海洋','淡彩海浪與沙灘'],
 ['room','房間','窗光與柔和室內'],
 ['living','客廳','午後光影與亞麻沙發'],
 ['cafe','咖啡廳','窗外城市與暖光'],
 ['park','公園','河畔樹蔭與長椅'],
 ['street','街道','雨後暖燈的油畫街景'],
 ['mountain','山水湖景','雲霧遠山與水面']
];
const esc=s=>String(s).replace(/&/g,'&amp;').replace(/"/g,'&quot;');
const rect=(x,y,w,h,fill,extra='')=>'<rect x="'+x+'" y="'+y+'" width="'+w+'" height="'+h+'" fill="'+fill+'" '+extra+'/>';
const path=(d,fill,extra='')=>'<path d="'+d+'" fill="'+fill+'" '+extra+'/>';
const ellipse=(x,y,rx,ry,fill,extra='')=>'<ellipse cx="'+x+'" cy="'+y+'" rx="'+rx+'" ry="'+ry+'" fill="'+fill+'" '+extra+'/>';
const line=(d,color,width,extra='')=>path(d,'none','stroke="'+color+'" stroke-width="'+width+'" stroke-linecap="round" '+extra);
const gr=(id,stops,attrs='x1="0" y1="0" x2="0" y2="1"')=>'<linearGradient id="'+id+'" '+attrs+'>'+stops.map(([at,color,alpha])=>'<stop offset="'+at+'" stop-color="'+color+'"'+(alpha===undefined?'':' stop-opacity="'+alpha+'"')+'/>').join('')+'</linearGradient>';
const wash=(d,color,opacity=.65)=>path(d,color,'opacity="'+opacity+'"');
function rand(seed){let v=seed>>>0;return()=>((v=(Math.imul(1664525,v)+1013904223)>>>0)/4294967296)}
function marks(seed,n,area,colors,kind='dabs'){
  const r=rand(seed);let output='';
  for(let i=0;i<n;i++){
    const x=Math.round(area[0]+r()*area[2]),y=Math.round(area[1]+r()*area[3]);
    const sx=(2+r()*28).toFixed(1),sy=(kind==='streak'?(.7+r()*3.5):(1.2+r()*13)).toFixed(1);
    const turn=((r()-.5)*75).toFixed(1),tone=colors[i%colors.length];
    output+=ellipse(x,y,sx,sy,tone,'opacity="'+(.09+r()*.26).toFixed(2)+'" transform="rotate('+turn+' '+x+' '+y+')"');
  }
  return output;
}
function trees(seed,count,minx,maxx,baseline,scale=1){
  let s='',r=rand(seed);
  for(let i=0;i<count;i++){
    const x=minx+(maxx-minx)*(i+r()*.3)/count,y=baseline+(r()-.5)*38;
    const height=(40+r()*95)*scale,wide=(15+r()*27)*scale;
    s+=line('M'+x.toFixed(1)+' '+y.toFixed(1)+'q'+(-5-r()*8).toFixed(0)+' -'+(height*.38).toFixed(0)+' 0 -'+height.toFixed(0),'#50665b',(2+r()*3)*scale,'opacity=".48"');
    for(let q=0;q<3;q++){
      const cy=y-height*(.45+q*.18),offset=(r()-.5)*17;
      s+=ellipse((x+offset).toFixed(1),cy.toFixed(1),wide*(1-q*.13),height*(.32-q*.045),['#617f75','#7e9885','#a4b6a0'][(i+q)%3],'opacity="'+(.30+r()*.24).toFixed(2)+'"');
    }
  }
  return s;
}
function farMountains(){
 return wash('M0 389Q34 336 68 361Q102 314 132 342Q169 282 201 338Q248 236 291 310Q327 262 352 300Q393 192 433 277Q478 236 511 290Q574 178 619 272Q662 211 707 280Q749 240 792 304Q835 249 875 305Q927 243 960 283L960 630H0Z','#9baea7',.34)+
 wash('M0 455Q88 361 144 408Q214 315 275 377Q331 304 374 362Q457 275 512 357Q578 288 642 374Q719 321 766 372Q843 315 900 369L960 362V630H0Z','#829a90',.34);
}
function forest(){
 let s=farMountains();
 s+=wash('M0 477Q140 408 281 469Q424 404 572 447Q772 372 960 422V630H0Z','#69877b',.51);
 s+=wash('M0 541Q185 472 359 519Q563 464 711 497Q861 460 960 491V630H0Z','#426b60',.63);
 s+=path('M331 630Q410 533 510 468Q540 492 570 630Z','#d0c8ae','opacity=".53"');
 s+=ellipse(468,439,314,51,'#f5f3e7','opacity=".46" filter="url(#fog)"');
 s+=trees(22,21,0,960,475,1.65);
 s+=marks(180,165,[0,285,960,305],['#305d55','#76927f','#bed1b8','#f2eee0']);
 return s;
}
function mountain(){
 let s=farMountains();
 s+=wash('M0 460Q130 382 210 441Q360 330 480 436Q618 325 730 413Q835 354 960 389V630H0Z','#507c73',.53);
 s+=wash('M0 530Q178 475 366 496Q538 441 716 467Q855 425 960 443V630H0Z','#6e9a8c',.48);
 s+=rect(0,469,960,161,'url(#lake)','opacity=".83"');
 s+=marks(473,124,[10,476,943,144],['#e6eee7','#f8f3e5','#5a857d'],'streak');
 s+=ellipse(494,453,420,42,'#f8f6e8','opacity=".48" filter="url(#fog)"');
 s+=trees(171,18,0,960,491,.72);
 s+=path('M35 493Q190 457 316 493Q340 505 360 510L0 544Z','#456b5f','opacity=".56"');
 s+=marks(872,98,[0,330,960,160],['#f6f5ee','#a4c0b4'],'streak');
 return s;
}
function ocean(){
 let s=rect(0,0,960,630,'url(#sea)');
 s+=ellipse(731,166,62,62,'#fff0c9','opacity=".50" filter="url(#fog)"');
 s+=path('M0 372Q240 368 460 374T960 363L960 630H0Z','url(#water)');
 for(let i=0;i<7;i++){
  const y=405+i*32;
  s+=line('M'+(-30+i%2*39)+' '+y+'Q224 '+(y-14)+' 460 '+(y+5)+'T995 '+(y-4),i%2?'#9fc5c7':'#f8f0df',1.5+i%3,'opacity="'+(.2+i*.048).toFixed(2)+'"');
 }
 s+=path('M0 527Q137 499 266 534Q439 549 565 522Q756 480 960 519V630H0Z','url(#sand)');
 s+=line('M-10 528Q122 511 270 540Q417 560 566 532Q753 496 980 533','#fff8e8',10,'opacity=".58"');
 s+=marks(221,135,[0,389,960,161],['#fff9e9','#d7e7df','#8cafb8'],'streak');
 s+=marks(19,69,[0,540,960,80],['#d9baa0','#eed8b9','#fff3db'],'streak');
 return s;
}
function windowView(x,y,w,h,seed){
 let s=rect(x,y,w,h,'#bacdc4');
 s+=path('M'+x+' '+(y+h*.65)+'Q'+(x+w*.33)+' '+(y+h*.40)+' '+(x+w*.57)+' '+(y+h*.62)+'Q'+(x+w*.78)+' '+(y+h*.45)+' '+(x+w)+' '+(y+h*.57)+'V'+(y+h)+'H'+x+'Z','#94a99b','opacity=".60"');
 s+=line('M'+(x+w*.5)+' '+y+'V'+(y+h),'#f7efe2',13);
 s+=line('M'+x+' '+(y+h*.54)+'H'+(x+w),'#f7efe2',10);
 s+=marks(seed,32,[x,y,w,h],['#f7f7e6','#829f93'],'streak');
 return s;
}
function curtains(x,y,h){
 return path('M'+x+' '+y+'q42 2 56 0l-18 '+h+'q-20 24-46 1Z','#faf2e1','opacity=".70"')+
 path('M'+(x+40)+' '+y+'q39 0 61 0l21 '+h+'q-31 23-54 0Z','#ede1d0','opacity=".42"');
}
function room(){
 let s=rect(0,0,960,630,'url(#wall)');
 s+=path('M0 454L960 431V630H0Z','url(#floor)');
 s+=rect(97,76,416,334,'#d1c0a9','rx="8"');
 s+=windowView(111,92,387,300,73);
 s+=curtains(100,81,319);
 s+=wash('M465 392L705 276L882 538L690 608Z','#fff1cf',.23);
 s+=ellipse(740,526,219,60,'#e1ccb5','opacity=".58"');
 s+=rect(539,411,352,103,'#c1b2a0','rx="31"');
 s+=rect(552,394,329,87,'#eee1ce','rx="32"');
 s+=rect(537,482,351,52,'#a08a79','rx="9"');
 s+=rect(661,343,139,67,'#d6c4b5','rx="24"');
 s+=marks(31,87,[540,386,335,137],['#fff3e4','#b69e8f','#e1c5b6']);
 s+=marks(57,38,[0,443,960,160],['#dec4a6','#f9f3e6'],'streak');
 return s;
}
function living(){
 let s=rect(0,0,960,630,'url(#wall)');
 s+=rect(0,453,960,177,'url(#floor)');
 s+=rect(78,71,331,342,'#d9c4ae','rx="12"');
 s+=windowView(94,83,300,318,117);
 s+=curtains(84,72,344);
 s+=ellipse(529,556,320,72,'#ddd1bf','opacity=".78"');
 s+=rect(356,337,430,165,'#a7b9ad','rx="43"');
 s+=rect(370,317,403,113,'#bacbb9','rx="31"');
 s+=rect(355,426,440,71,'#9eaa9f','rx="14"');
 s+=rect(408,353,118,76,'#ecd8bc','rx="20"');
 s+=rect(613,352,113,75,'#d3c2b3','rx="20"');
 s+=line('M263 448H362M284 448V529M344 448V529','#8d765e',12);
 s+=ellipse(308,446,70,19,'#bea78e');
 s+=rect(846,295,10,214,'#978878');
 s+=path('M802 300L887 300L876 223L814 223Z','#e7ccae');
 s+=ellipse(852,289,78,59,'#fff4c7','opacity=".35" filter="url(#fog)"');
 s+=marks(355,126,[0,85,960,465],['#fdf5e7','#c3b7a9','#a1b7a5'],'streak');
 return s;
}
function cafe(){
 let s=rect(0,0,960,630,'url(#wall)');
 s+=rect(0,479,960,151,'url(#floor)');
 s+=rect(54,67,413,378,'#bda993','rx="7"');
 s+=windowView(68,81,385,348,209);
 s+=rect(85,84,8,340,'#e8decd','opacity=".6"');
 s+=curtains(63,73,347);
 for(let i=0;i<2;i++){
 const x=599+i*177;
 s+=line('M'+x+' 0V110','#907d68',7);
 s+=path('M'+(x-40)+' 112L'+(x+41)+' 112L'+(x+64)+' 189L'+(x-62)+' 189Z','#a78669');
 s+=ellipse(x,192,91,65,'#ffe8bd','opacity=".19" filter="url(#fog)"');
 }
 s+=rect(465,361,434,30,'#87684f','rx="12"');
 s+=rect(487,388,23,183,'#9c8064');
 s+=rect(852,388,23,183,'#9c8064');
 s+=ellipse(566,433,69,21,'#c6ad8d');s+=line('M566 433V524','#95755a',23);
 s+=ellipse(753,431,68,22,'#bfa585');s+=line('M753 431V521','#947660',23);
 s+=rect(647,324,57,43,'#f5eddf','rx="8"');
 s+=ellipse(674,324,32,8,'#c6a58d');
 s+=marks(94,113,[70,64,822,501],['#f9f0da','#ba9a7c','#91ad98'],'streak');
 return s;
}
function park(){
 let s=farMountains();
 s+=path('M0 416Q215 334 434 395Q700 336 960 354V630H0Z','#9daf92','opacity=".82"');
 s+=path('M0 492Q189 450 349 488Q617 443 960 450V630H0Z','#729787','opacity=".81"');
 s+=path('M0 527Q181 484 379 529T960 493V630H0Z','#aec4b6','opacity=".7"');
 s+=ellipse(240,477,220,48,'#82b8af','opacity=".68"');
 s+=path('M312 630Q440 506 564 429Q613 500 761 630Z','#d6caaf','opacity=".85"');
 s+=trees(39,25,0,960,403,1.6);
 s+=rect(682,448,171,15,'#8d755b','rx="5"');
 s+=rect(692,418,152,28,'#a28d74','rx="8"');
 s+=line('M704 467L690 541M831 467L840 541','#88715a',9);
 s+=marks(72,180,[0,235,960,357],['#d2dcb8','#faf1d8','#6b9681','#c3b7a0']);
 return s;
}
function street(){
 let s=rect(0,0,960,630,'url(#evening)');
 s+=path('M0 354L365 211V630H0Z','#ac8e82','opacity=".95"');
 s+=path('M960 346L639 188V630H960Z','#928784','opacity=".91"');
 s+=path('M352 630L462 326L552 326L673 630Z','#899398','opacity=".45"');
 s+=path('M0 630L409 357L543 357L960 630Z','#999ca0','opacity=".68"');
 s+=path('M0 630L390 371L563 371L960 630Z','#aaa4a1','opacity=".37"');
 for(let i=0;i<5;i++){
  let y=240+i*61;
  s+=rect(62,y,226-23*i,20,'#c4b5a0','opacity=".65"');
  s+=rect(718+6*i,y,180-18*i,16,'#c0ae9a','opacity=".64"');
  s+=rect(97+i*4,y+22,49,31,'#e5c6aa','opacity=".60"');
  s+=rect(765-i*3,y+19,38,29,'#f3d3a8','opacity=".55"');
 }
 s+=line('M196 353L175 560M776 335L797 535','#655f61',10);
 for(let i=0;i<4;i++){
  let x=206+i*215,scale=1-i*.15;
  s+=ellipse(x,292-i*15,17*scale,22*scale,'#ffcb7b','opacity=".90" filter="url(#fog)"');
  s+=ellipse(x,292-i*15,6*scale,9*scale,'#fff0ba');
 }
 s+=marks(89,160,[30,332,900,295],['#f9d293','#aab8bb','#c78d68','#eee1c9','#716e70'],'streak');
 s+=line('M286 630Q420 474 465 374M676 630Q549 468 524 374','#f2c88d',9,'opacity=".37"');
 s+=marks(143,145,[0,430,960,200],['#f2c58c','#fff0c9','#aabfd1','#cd9c7a'],'streak');
 return s;
}
const subjects={forest,mountain,ocean,room,living,cafe,park,street};
function svg(id){
 if(!subjects[id])return '';
 const indoor=['room','living','cafe'].includes(id),seed=items.findIndex(a=>a[0]===id)+5;
 const defs='<defs>'+
 gr('paper',[['0','#faf7ed'],['.56','#e7e7df'],['1','#dedfd6']])+
 gr('sky',[['0',indoor?'#f4e7d3':'#e1edf0'],['.66',indoor?'#eee2d4':'#eee6d6'],['1','#e4d9c9']])+
 gr('lake',[['0','#8faeac'],['1','#c4d1bf']])+
 gr('sea',[['0','#b6d2db'],['.58','#e9dfc9'],['1','#c4c5bb']])+
 gr('water',[['0','#7ca9b3'],['1','#b8caca']])+
 gr('sand',[['0','#e7d4b8'],['1','#f7e9d0']])+
 gr('wall',[['0','#f3e8db'],['1','#dacbbd']])+
 gr('floor',[['0','#b9a189'],['1','#a88c77']])+
 gr('evening',[['0','#bbc5d1'],['.55','#edcdb4'],['1','#aca9a7']])+
 '<filter id="fog" x="-45%" y="-70%" width="190%" height="240%"><feGaussianBlur stdDeviation="25"/></filter>'+
 '<filter id="pigment" x="-4%" y="-4%" width="108%" height="108%"><feTurbulence type="fractalNoise" baseFrequency=".009" numOctaves="2" seed="'+seed+'" result="rough"/><feDisplacementMap in="SourceGraphic" in2="rough" scale="10" xChannelSelector="R" yChannelSelector="G"/></filter>'+
 '<filter id="grain" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".35" numOctaves="2" seed="'+(seed+11)+'" stitchTiles="stitch"/><feColorMatrix type="saturate" values="0"/></filter>'+
 '<radialGradient id="illum"><stop stop-color="#fffaf0" stop-opacity=".54"/><stop offset="1" stop-color="#fffaf0" stop-opacity="0"/></radialGradient>'+
 '<linearGradient id="glaze" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#fff9ee" stop-opacity=".28"/><stop offset=".5" stop-color="#f7efe4" stop-opacity=".10"/><stop offset="1" stop-color="#f4f0e6" stop-opacity=".24"/></linearGradient>'+
 '</defs>';
 return '<svg xmlns="http://www.w3.org/2000/svg" width="960" height="630" viewBox="0 0 960 630">'+defs+
 rect(0,0,960,630,'url(#sky)')+
 '<g filter="url(#pigment)">'+subjects[id]()+'</g>'+
 ellipse(indoor?370:650,indoor?175:205,475,355,'url(#illum)')+
 rect(0,0,960,630,'url(#glaze)')+
 rect(0,0,960,630,'#fffaf0','opacity=".057" filter="url(#grain)"')+
 '</svg>';
}
const cache=new Map();
function imageUrl(id){if(!cache.has(id)){const art=svg(id);if(!art)return '';cache.set(id,'data:image/svg+xml;charset=utf-8,'+encodeURIComponent(art));}return cache.get(id);}
window.PausePlaceScenes=Object.freeze({items,svg,imageUrl});
})();