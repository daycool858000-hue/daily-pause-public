// Original procedural editorial illustrations for the 2026 emotion world.
// No third-party images, tracking, or network requests.
(function () {
  const W = 960, H = 630;
  const col = {
    sea:['#d5e5df','#b8d6d6','#527b90','#e9ccaa'],
    island:['#e9dfcf','#8cb5b8','#3c8492','#e7bd8a'],
    garden:['#f2e5d6','#ccdbbf','#7a9a81','#e0ab8b'],
    room:['#f2dfd0','#d8b59a','#947b6f','#f3cd86'],
    rain:['#d7dfe1','#9faeb7','#687e8d','#eedac6'],
    night:['#283c58','#415875','#202f49','#eed8b3'],
    hill:['#e5ddd2','#b2c3b5','#687d77','#f1d7ad'],
    lake:['#dce6e0','#b1cbcb','#719eae','#d9bba0'],
    balcony:['#f3dec8','#dbb5a3','#788f87','#ecc18d'],
    library:['#e5d5c3','#b7ad99','#695b52','#f2ca8d'],
    cloud:['#e7e4e6','#cfced8','#a6bcc2','#f4e1ce'],
    sunrise:['#fae9d8','#e9c6a6','#a2b6ab','#f5ce8c']
  };
  const rad=(x,y,r,a=0,b=Math.PI*2)=>({x,y,r,a,b});
  function path(ctx,points,fill,stroke,width=2) {
    ctx.beginPath(); points.forEach((p,i)=>i ? ctx.lineTo(p[0],p[1]) : ctx.moveTo(p[0],p[1]));
    ctx.closePath(); if(fill){ctx.fillStyle=fill;ctx.fill()} if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=width;ctx.stroke()}
  }
  function ellipse(ctx,x,y,rx,ry,fill,rotation=0) {
    ctx.beginPath();ctx.ellipse(x,y,rx,ry,rotation,0,Math.PI*2);
    ctx.fillStyle=fill;ctx.fill();
  }
  function line(ctx,coords,color,width=2) {
    ctx.beginPath();ctx.moveTo(coords[0],coords[1]);for(let i=2;i<coords.length;i+=2)ctx.lineTo(coords[i],coords[i+1]);
    ctx.strokeStyle=color;ctx.lineWidth=width;ctx.lineCap='round';ctx.lineJoin='round';ctx.stroke();
  }
  function rounded(ctx,x,y,w,h,r,fill,stroke) {
    ctx.beginPath();ctx.roundRect(x,y,w,h,r);if(fill){ctx.fillStyle=fill;ctx.fill()}if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=2;ctx.stroke()}
  }
  function flower(ctx,x,y,size,color,phase=0) {
    for(let i=0;i<6;i++){let a=i*Math.PI/3+phase;ellipse(ctx,x+Math.cos(a)*size*.42,y+Math.sin(a)*size*.42,size*.24,size*.42,color,a)}
    ellipse(ctx,x,y,size*.25,size*.25,'#f0ce8d');
  }
  function tree(ctx,x,y,size,t=0) {
    ctx.save();ctx.translate(x,y);ctx.scale(size,size);
    line(ctx,[0,0,0,-112], '#736458', 14);
    for(let i=0;i<5;i++) {
      const a=i*2.2, dx=Math.sin(a)*34,dy=-100+Math.cos(a)*18;
      line(ctx,[0,-64,dx,dy],'#7b6656',5);
      ellipse(ctx,dx+Math.sin(t*.0007+i)*2,dy,40-i*2,45,'#74967d',i*.2);
      ellipse(ctx,dx-9,dy-10,23,24,'#9cb69a',-.3);
    }
    ctx.restore();
  }
  function room(ctx,pal,t) {
    ctx.fillStyle=pal[0];ctx.fillRect(0,0,W,H);
    path(ctx,[[0,455],[960,434],[960,H],[0,H]],'#c4a58c');
    for(let i=0;i<9;i++)line(ctx,[i*140,457,i*140-25,630],'rgba(114,98,82,.1)',1);
    rounded(ctx,95,68,410,345,12,'#f6e8d6','#c9ac96');
    rounded(ctx,117,86,366,309,6,'#c8d6d0');
    const sky=ctx.createLinearGradient(120,85,470,355);sky.addColorStop(0,pal[1]);sky.addColorStop(1,'#f6e7d7');
    ctx.fillStyle=sky;ctx.fillRect(123,92,355,296);
    ellipse(ctx,398,159,48,48,pal[3]);
    path(ctx,[[123,330],[240,249],[347,330],[478,280],[478,389],[123,389]],'#a4b7aa');
    line(ctx,[295,87,295,389],'#eee1d0',12);line(ctx,[120,258,479,258],'#eee1d0',8);
    ctx.fillStyle='rgba(247,235,213,.85)';ctx.fillRect(90,67,22,350);ctx.fillRect(495,67,25,350);
    ctx.save();ctx.globalAlpha=.23;ctx.fillStyle='#fff1cb';path(ctx,[[500,120],[700,280],[770,434],[500,420]],'#fff1cb');ctx.restore();
    rounded(ctx,580,412,260,33,8,'#ae7c62');rounded(ctx,610,437,17,115,6,'#8e6a57');rounded(ctx,797,437,17,115,6,'#8e6a57');
    drawProp(ctx,{type:'cup',x:694,y:393,scale:.8,angle:0},t);
    drawProp(ctx,{type:'plant',x:860,y:478,scale:1.1,angle:0},t);
    drawProp(ctx,{type:'book',x:797,y:395,scale:.7,angle:0},t);
  }
  function sea(ctx,pal,t,mode) {
    const sky=ctx.createLinearGradient(0,0,0,420);
    sky.addColorStop(0,pal[0]);sky.addColorStop(1,pal[1]);ctx.fillStyle=sky;ctx.fillRect(0,0,W,H);
    ellipse(ctx,725,122,61,61,pal[3]);
    for(let i=0;i<5;i++)ellipse(ctx,160+i*170,150+(i%3)*35,115,19,'rgba(255,250,240,.35)');
    const horizon=mode==='island'?350:390;
    ctx.fillStyle=pal[2];ctx.fillRect(0,horizon,W,H-horizon);
    if(mode==='island'){path(ctx,[[130,400],[265,308],[450,310],[565,390],[700,415]],'#a6ae8d');path(ctx,[[300,368],[438,308],[560,395]],'#c9cba8');}
    for(let i=0;i<12;i++) {
      const y=horizon+23+i*24,shift=Math.sin(t*.0003+i)*7;
      ctx.beginPath();ctx.moveTo(35+(i%2)*28,y);
      ctx.bezierCurveTo(220+shift,y-12,410,y+9,605+shift,y);
      ctx.bezierCurveTo(760,y-12,840,y+5,952,y-2);
      ctx.strokeStyle=i%3===0?'rgba(247,241,225,.65)':'rgba(223,235,226,.24)';
      ctx.lineWidth=i%3===0?3:1.5;ctx.stroke();
    }
    if(mode!=='island') {
      ctx.save();ctx.globalAlpha=.88;
      path(ctx,[[0,572],[135,551],[267,565],[421,581],[550,593],[710,605],[960,606],[960,H],[0,H]],'#e8d2b9');
      ctx.restore();for(let i=0;i<13;i++)ellipse(ctx,40+i*78,594+Math.sin(i*6)*13,1.5,2,'#b49b85');
    }
  }
  function landscape(ctx,pal,t,mode) {
    const g=ctx.createLinearGradient(0,0,0,H);
    g.addColorStop(0,pal[0]);g.addColorStop(1,pal[1]);
    ctx.fillStyle=g;ctx.fillRect(0,0,W,H);
    ellipse(ctx,748,135,64,64,pal[3]);
    if(mode==='cloud'){
      for(let i=0;i<12;i++){let x=((i*139+Math.sin(t*.0002+i)*18)%1100)-80,y=135+(i%5)*73;
        ellipse(ctx,x,y,130,28,'rgba(255,255,255,.35)');
        ellipse(ctx,x+20,y-13,55,27,'rgba(255,255,255,.25)');}
      return;
    }
    path(ctx,[[0,385],[135,278],[290,380],[495,239],[650,371],[796,295],[960,357],[960,H],[0,H]],'#a8b9aa');
    path(ctx,[[0,484],[150,411],[330,491],[500,389],[731,460],[960,384],[960,H],[0,H]],pal[2]);
    path(ctx,[[0,577],[190,524],[350,562],[571,491],[739,543],[960,473],[960,H],[0,H]],'#789a83');
    if(mode==='lake'){
      path(ctx,[[0,518],[236,509],[543,520],[960,495],[960,H],[0,H]],'#83a9b0');
      for(let i=0;i<8;i++)line(ctx,[130+i*97,543+i%4*18,185+i*97,543+i%4*18],'rgba(250,243,218,.5)',2);
    }
    else if(mode==='garden'){
      for(let i=0;i<24;i++){const x=15+i*41,y=568+Math.sin(i*3.5)*35;
        line(ctx,[x,y+30,x+Math.sin(i)*6,y-16],'#6a8d6f',2);
        flower(ctx,x,y-15,10+(i%4)*2,i%3===0?'#dca38e':'#ede0c7');}
      tree(ctx,125,492,.84,t);
    } else {tree(ctx,90,525,.95,t);tree(ctx,870,512,.7,t);}
  }
  function night(ctx,pal,t) {
    const g=ctx.createLinearGradient(0,0,0,H);g.addColorStop(0,pal[0]);g.addColorStop(1,pal[2]);ctx.fillStyle=g;ctx.fillRect(0,0,W,H);
    ellipse(ctx,755,136,60,60,'#f1e3c8');
    ellipse(ctx,774,116,53,53,pal[0]);
    for(let i=0;i<57;i++){const x=(i*181)%960,y=(i*79)%390,r=1+(i%4)*.7;
      ellipse(ctx,x,y,r,r,'rgba(246,233,203,'+(0.37+Math.sin(t*.0006+i)*.17)+')');}
    path(ctx,[[0,470],[150,400],[340,466],[529,388],[739,463],[960,406],[960,H],[0,H]],'#394f58');
    path(ctx,[[0,554],[180,506],[420,553],[620,477],[960,529],[960,H],[0,H]],'#283d4a');
    rounded(ctx,660,470,240,14,6,'#66594f');
    drawProp(ctx,{type:'lamp',x:770,y:434,scale:.75,angle:0},t);
  }
  function balcony(ctx,pal,t) {
    sea(ctx,pal,t,'sea');
    ctx.fillStyle='#f0dec8';ctx.fillRect(0,0,75,H);ctx.fillRect(895,0,65,H);
    path(ctx,[[0,464],[960,464],[960,H],[0,H]],'#c6a992');
    for(let i=0;i<8;i++)rounded(ctx,i*133,438,8,172,3,'#887b73');
    rounded(ctx,0,427,W,18,3,'#9e8171');
    drawProp(ctx,{type:'chair',x:310,y:505,scale:1.7,angle:0},t);
    drawProp(ctx,{type:'plant',x:808,y:504,scale:1.45,angle:0},t);
  }
  function rain(ctx,pal,t) {
    room(ctx,pal,t);
    ctx.save();ctx.beginPath();ctx.rect(123,92,355,297);ctx.clip();
    for(let i=0;i<55;i++){const x=123+(i*73)%352,y=90+((i*53+(t*.025))%350);
      line(ctx,[x,y,x-9,y+23],'rgba(244,249,250,.5)',1.6);}
    ctx.restore();rounded(ctx,120,91,359,298,4,null,'rgba(92,114,126,.3)');
  }
  function drawScene(ctx,kind,t) {
    const pal=col[kind]||col.room;
    if(kind==='sea'||kind==='island')sea(ctx,pal,t,kind);
    else if(kind==='night') night(ctx,pal,t);
    else if(kind==='room'||kind==='library'||kind==='sunrise') room(ctx,pal,t);
    else if(kind==='rain')rain(ctx,pal,t);
    else if(kind==='balcony')balcony(ctx,pal,t);
    else landscape(ctx,pal,t,kind);
    ctx.save();ctx.globalAlpha=.055;
    for(let i=0;i<70;i++){const x=(i*139.7)%W,y=(i*173.3)%H;ellipse(ctx,x,y,1.2,1.2,'#765c48');}
    ctx.restore();
  }
  function drawElement(ctx,el,t,still) {
    const a=still?0:t*.001,wiggle=Math.sin(a*(el.speed||.8)+(el.seed||0));
    const {type,x,y,size=38,color='#7e9e8f'}=el;
    ctx.save();ctx.translate(x,y);ctx.rotate(el.angle||0);ctx.scale(size/40,size/40);
    ctx.shadowColor='rgba(50,65,64,.14)';ctx.shadowBlur=4;ctx.shadowOffsetY=2;
    if(type==='tree'){ctx.restore();tree(ctx,x,y+55,size/64,t);return;}
    if(type==='wave'){for(let k=0;k<3;k++){ctx.beginPath();ctx.moveTo(-50,k*17-16);ctx.bezierCurveTo(-26+wiggle*3,k*17-32,2,k*17+3,50,k*17-16);ctx.strokeStyle=k?'#c9e4df':color;ctx.lineWidth=k?3:5;ctx.stroke()}}
    else if(type==='leaf'){ctx.rotate(wiggle*.08);ellipse(ctx,0,0,20,37,color,.55);line(ctx,[-18,30,16,-27],'#e8e1c0',2);}
    else if(type==='cloud'){for(let i=0;i<4;i++)ellipse(ctx,-24+i*16,(i%2)*-8,27,17,'#f5efe2');}
    else if(type==='petal'){ctx.rotate(wiggle*.16);ellipse(ctx,0,0,17,31,color,.45);}
    else if(type==='flower'){flower(ctx,0,0,50,color,wiggle*.04);}
    else if(type==='star'){for(let i=0;i<8;i++){const v=i*Math.PI/4;line(ctx,[0,0,Math.cos(v)*32,Math.sin(v)*32],'#f4dfaa',2.5)}ellipse(ctx,0,0,7,7,'#ffedcc');}
    else if(type==='rain'){for(let i=0;i<5;i++){let xx=i*17-34;line(ctx,[xx,-26+wiggle*2,xx-11,23+wiggle*2],'#a6c8d4',2.5);}}
    else if(type==='ripples'){for(let i=0;i<3;i++){ctx.beginPath();ctx.ellipse(0,0,16+i*15,5+i*5,0,0,Math.PI*2);ctx.strokeStyle=color;ctx.lineWidth=2.5;ctx.stroke()}}
    else if(type==='moon'){ellipse(ctx,0,0,28,28,'#eee1c4');ellipse(ctx,10,-9,28,28,'#9aabb4');}
    else if(type==='sun'){const g=ctx.createRadialGradient(0,0,8,0,0,48);g.addColorStop(0,'#f8e6ad');g.addColorStop(1,'rgba(250,215,138,0)');ellipse(ctx,0,0,48,48,g);ellipse(ctx,0,0,18,18,'#f7d995');}
    else if(type==='grass'){for(let i=0;i<9;i++)line(ctx,[i*9-40,32,i*9-45+wiggle*2,-18-(i%3)*6],'#7d9d79',2.5);}
    else if(type==='bird'){line(ctx,[-34,3,-12,-10,0,-4,10,-12,31,1],'#566e74',3);}
    else if(type==='steam'){for(let i=0;i<3;i++){ctx.beginPath();ctx.moveTo(i*18-18,30);ctx.bezierCurveTo(i*18-28+wiggle*5,0,i*18-8,-16,i*18-16,-44);ctx.strokeStyle='rgba(255,250,243,.78)';ctx.lineWidth=4;ctx.stroke()}}
    else if(type==='butterfly'){ctx.rotate(wiggle*.16);ellipse(ctx,-13,-8,17,22,color,-.35);ellipse(ctx,13,-8,17,22,color,.35);ellipse(ctx,-9,12,12,15,color,-.4);ellipse(ctx,9,12,12,15,color,.4);line(ctx,[0,-15,0,18],'#62554d',3);}
    else if(type==='fish'){ellipse(ctx,0,0,30,14,color);path(ctx,[[20,0],[49,-17],[49,17]],color);ellipse(ctx,-12,-3,2.5,2.5,'#f8eee0');}
    else if(type==='shell'){ellipse(ctx,0,0,30,22,'#e7bdb0');for(let i=-2;i<=2;i++)line(ctx,[0,-10,i*11,17],'#f6e6d7',2);}
    else if(type==='pebble'){ellipse(ctx,0,0,30,20,color,.12);ellipse(ctx,-10,-6,11,4,'rgba(255,255,255,.22)');}
    else if(type==='lantern'){rounded(ctx,-24,-35,48,72,8,'#bd8e6e','#816d61');ellipse(ctx,0,0,18,23,'#f6d9a4');line(ctx,[-18,-23,18,24],'rgba(255,242,200,.6)',1);}
    else if(type==='dandelion'){line(ctx,[0,34,0,-18],'#8fa480',3);for(let i=0;i<12;i++){let a=i*Math.PI/6;line(ctx,[0,-19,Math.cos(a)*28,Math.sin(a)*28-19],'#e9e5d2',1.6);}}
    else if(type==='firefly'){const g=ctx.createRadialGradient(0,0,0,0,0,30);g.addColorStop(0,'#f8ebb8');g.addColorStop(1,'rgba(251,220,145,0)');ellipse(ctx,0,0,30+wiggle*4,30+wiggle*4,g);}
    else if(type==='paper'){ctx.rotate(.12);rounded(ctx,-30,-24,60,49,3,'#f7efdf','#dacbbb');for(let i=0;i<3;i++)line(ctx,[-20,-10+i*12,20,-10+i*12],'#cbbcb2',1.5);}
    ctx.restore();
  }
  function drawProp(ctx,obj,t) {
    const x=obj.x,y=obj.y,s=obj.scale||1,type=obj.type;
    ctx.save();ctx.translate(x,y);ctx.rotate(obj.angle||0);ctx.scale(s,s);
    ctx.shadowColor='rgba(33,40,34,.19)';ctx.shadowBlur=12;ctx.shadowOffsetY=7;
    // Every prop has a physical base with material/texture, not a flat icon.
    const wood='#9c7a64',cream='#eee2d1',dark='#655f58',sage='#869d82';
    if(['cup','mug','teapot','glass','bottle'].includes(type)){
      rounded(ctx,-26,-24,52,50,7,type==='glass'?'rgba(224,245,244,.6)':'#d5ad94','#8d746b');
      ctx.beginPath();ctx.ellipse(0,-24,26,7,0,0,Math.PI*2);ctx.fillStyle='#f7ede4';ctx.fill();
      if(type!=='bottle'){ctx.beginPath();ctx.ellipse(26,0,14,17,0,-Math.PI/2,Math.PI/2);ctx.strokeStyle='#9f796b';ctx.lineWidth=7;ctx.stroke();}
      if(type==='teapot'){ellipse(ctx,0,-28,17,7,'#af8a78');line(ctx,[-26,-10,-43,-19,-49,-9],'#ad8578',7);}
      if(type==='bottle'){rounded(ctx,-12,-53,24,35,4,'#b5c2bb');}
      if(type==='cup'||type==='teapot'||type==='mug'){ctx.shadowBlur=0;for(let i=0;i<2;i++){ctx.beginPath();ctx.moveTo(-10+i*18,-30);ctx.bezierCurveTo(-24+i*18,-45,0+i*18,-57,-8+i*18,-76);ctx.strokeStyle='rgba(255,244,224,.82)';ctx.lineWidth=3;ctx.stroke();}}
    } else if(['book','notebook','letter','frame','painting'].includes(type)){
      rounded(ctx,-43,-42,86,85,5,type==='book'?'#b08b83':'#e8dfd0','#897367');
      rounded(ctx,-31,-36,64,72,4,cream);
      for(let i=0;i<5;i++)line(ctx,[-19,-18+i*11,22,-18+i*11],'#baae9d',1.5);
      if(type==='frame'||type==='painting'){path(ctx,[[-21,22],[-2,-3],[15,9],[28,-13],[31,27]],'#91aca0');ellipse(ctx,17,-14,7,7,'#e6c78f');}
      if(type==='letter')path(ctx,[[-29,-31],[0,-6],[30,-31]],null,'#bca996');
      if(type==='book')rounded(ctx,-42,-42,10,84,3,'#937164');
    } else if(['plant','vase','flowerpot'].includes(type)){
      path(ctx,[[-29,8],[29,8],[20,52],[-19,52]],type==='vase'?'#cad2c8':'#ad7964','#896b5f');
      line(ctx,[0,12,0,-55],'#69826c',5);
      for(let i=0;i<7;i++){const a=i*2.399,x=Math.sin(a)*35,yy=-30-Math.cos(a)*18;
        ellipse(ctx,x,yy,17,27,i%2?'#799b7d':'#a1b69a',a);}
      if(type==='vase')flower(ctx,4,-58,16,'#dca99d');
    } else if(['lamp','candle','lantern'].includes(type)){
      rounded(ctx,-22,41,44,9,5,dark);
      line(ctx,[0,40,0,-12],'#726359',6);
      path(ctx,[[-34,-12],[-20,-52],[20,-52],[35,-12]],'#d4b995','#826e5c');
      ellipse(ctx,0,-12,20,11,'rgba(252,219,142,.7)');
      if(type==='candle') {rounded(ctx,-14,-25,28,61,6,'#eee6cf');ellipse(ctx,0,-38,10,16,'#f8ce81');}
    } else if(['sofa','chair','cushion','pillow','blanket','rug','bed'].includes(type)){
      rounded(ctx,-60,-30,120,65,18,type==='rug'?'#c9a89b':'#b8b8a9','#877f73');
      rounded(ctx,-55,-35,110,43,13,'#d7c5b5');
      if(type==='sofa'||type==='bed'){rounded(ctx,-65,-10,130,55,12,'#b0a393');rounded(ctx,-77,-9,20,55,9,'#9b958e');rounded(ctx,57,-9,20,55,9,'#9b958e');}
      if(type==='blanket'||type==='rug'){for(let i=0;i<5;i++)line(ctx,[-49,-12+i*10,51,-12+i*10],'rgba(255,247,232,.28)',2);}
      if(type==='cushion'||type==='pillow'){rounded(ctx,-45,-28,90,55,15,'#dbc5bc');}
    } else if(['table','desk','shelf','basket'].includes(type)){
      if(type==='basket'){rounded(ctx,-47,-18,94,62,12,'#b8956e','#957654');for(let i=0;i<7;i++)line(ctx,[-40,-11+i*8,39,-11+i*8],'#d7b28b',2);}
      else {rounded(ctx,-72,-20,144,17,6,'#b18a6b');rounded(ctx,-55,-3,12,58,3,wood);rounded(ctx,43,-3,12,58,3,wood);
        if(type==='shelf')for(let i=0;i<4;i++)rounded(ctx,-55+i*26,-43,20,22,3,i%2?'#b98978':'#8c9e87');}
    } else if(['radio','clock','music'].includes(type)){
      rounded(ctx,-50,-34,100,74,13,'#9b826e','#69594e');
      rounded(ctx,-34,-17,52,40,6,'#e5d0ad');
      if(type==='clock'){ellipse(ctx,-8,2,20,20,cream);line(ctx,[-8,2,-8,-12,-1,-7],dark,2);}
      else {for(let i=0;i<6;i++)line(ctx,[-28,-10+i*5,8,-10+i*5],wood,2);}
      ellipse(ctx,33,3,8,8,'#e9caa0');
    } else if(['window','curtain'].includes(type)){
      rounded(ctx,-65,-70,130,145,6,'#e5ddce','#a58b78');
      rounded(ctx,-52,-57,104,117,2,'#adc6c2');
      line(ctx,[0,-57,0,60],'#ede8dd',10);line(ctx,[-52,0,52,0],'#ede8dd',9);
      if(type==='curtain'){path(ctx,[[-57,-62],[-12,-60],[-35,60],[-60,62]],'#cfb9aa');path(ctx,[[57,-62],[12,-60],[37,60],[60,62]],'#cfb9aa');}
    } else if(type==='fruit') {
      ellipse(ctx,0,14,56,20,'#e6d6c3');ellipse(ctx,-21,2,19,19,'#cf947a');ellipse(ctx,19,-3,20,21,'#d5b46b');ellipse(ctx,3,8,17,16,'#a3b38a');
    } else if(type==='cat'){
      ellipse(ctx,0,21,35,31,'#ba9e84');ellipse(ctx,3,-21,29,29,'#c5ab91');
      path(ctx,[[-22,-36],[-17,-64],[-1,-46]],'#c5ab91');path(ctx,[[9,-46],[23,-64],[28,-31]],'#c5ab91');
      ellipse(ctx,-9,-21,3,4,dark);ellipse(ctx,12,-21,3,4,dark);line(ctx,[0,-8,5,-6,10,-9],dark,1.5);
    } else if(type==='umbrella'){ctx.beginPath();ctx.arc(0,-25,53,Math.PI,Math.PI*2);ctx.fillStyle='#b2b7b5';ctx.fill();line(ctx,[0,-25,0,53,18,58],wood,5);}
    else {rounded(ctx,-43,-34,86,70,10,'#c8baa8');rounded(ctx,-28,-19,56,42,6,'#eee0d0');}
    ctx.restore();
  }
  window.PauseWorldArt={drawScene,drawElement,drawProp,palettes:col,W,H};
})();