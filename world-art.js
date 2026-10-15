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
    // Thin curtains move slowly. Window light breathes; neither animation shifts existing marks.
    const curtainBreeze=Math.sin(t*.00039)*4;
    ctx.fillStyle='rgba(247,235,213,.85)';
    ctx.fillRect(90+curtainBreeze,67,22,350);
    ctx.fillRect(495-curtainBreeze*.65,67,25,350);
    ctx.save();ctx.globalAlpha=.19+Math.sin(t*.00043)*.09;
    path(ctx,[[500,120],[700+Math.sin(t*.00032)*10,280],[770+Math.sin(t*.00032)*8,434],[500,420]],'#fff1cb');
    ctx.restore();
    ctx.save();ctx.globalAlpha=.11+Math.sin(t*.00036+1)*.05;
    const light=ctx.createRadialGradient(618,290,20,618,290,265);
    light.addColorStop(0,'#fff1cb');light.addColorStop(1,'rgba(255,241,203,0)');
    ctx.fillStyle=light;ctx.fillRect(430,100,390,340);ctx.restore();
    rounded(ctx,580,412,260,33,8,'#ae7c62');rounded(ctx,610,437,17,115,6,'#8e6a57');rounded(ctx,797,437,17,115,6,'#8e6a57');
    drawProp(ctx,{type:'cup',x:694,y:393,scale:.8,angle:0},t);
    drawProp(ctx,{type:'plant',x:860,y:478,scale:1.1,angle:0},t);
    drawProp(ctx,{type:'book',x:797,y:395,scale:.7,angle:0},t);
  }
  function sea(ctx,pal,t,mode) {
    const sky=ctx.createLinearGradient(0,0,0,420);
    sky.addColorStop(0,pal[0]);sky.addColorStop(1,pal[1]);ctx.fillStyle=sky;ctx.fillRect(0,0,W,H);
    ellipse(ctx,725,122,61,61,pal[3]);
    for(let i=0;i<5;i++)ellipse(ctx,160+i*170+Math.sin(t*.00013+i)*9,150+(i%3)*35,115,19,'rgba(255,250,240,.35)');
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
      for(let i=0;i<12;i++){let x=((i*139+Math.sin(t*.00048+i)*32)%1100)-80,y=135+(i%5)*73+Math.cos(t*.00028+i)*5;
        ellipse(ctx,x,y,130,28,'rgba(255,255,255,.35)');
        ellipse(ctx,x+20,y-13,55,27,'rgba(255,255,255,.25)');}
      return;
    }
    path(ctx,[[0,385],[135,278],[290,380],[495,239],[650,371],[796,295],[960,357],[960,H],[0,H]],'#a8b9aa');
    path(ctx,[[0,484],[150,411],[330,491],[500,389],[731,460],[960,384],[960,H],[0,H]],pal[2]);
    path(ctx,[[0,577],[190,524],[350,562],[571,491],[739,543],[960,473],[960,H],[0,H]],'#789a83');
    if(mode==='lake'){
      path(ctx,[[0,518],[236,509],[543,520],[960,495],[960,H],[0,H]],'#83a9b0');
      for(let i=0;i<8;i++){
        const drift=Math.sin(t*.00047+i)*7;
        line(ctx,[130+i*97+drift,543+i%4*18,185+i*97+drift,543+i%4*18],'rgba(250,243,218,.5)',2);
      }
    }
    else if(mode==='garden'){
      for(let i=0;i<24;i++){const x=15+i*41,y=568+Math.sin(i*3.5)*35;
        const drift=Math.sin(t*.00062+i*.62)*5;
        line(ctx,[x,y+30,x+Math.sin(i)*6+drift,y-16],'#6a8d6f',2);
        flower(ctx,x+drift,y-15+Math.cos(t*.0005+i)*2,10+(i%4)*2,i%3===0?'#dca38e':'#ede0c7');}
      tree(ctx,125,492,.84,t);
    } else {
      tree(ctx,90,525,.95,t);tree(ctx,870,512,.7,t);
      if(mode==='hill'){
        ctx.save();ctx.globalAlpha=.12+Math.sin(t*.0003)*.035;
        for(let i=0;i<4;i++)ellipse(ctx,120+i*240+Math.sin(t*.00027+i)*34,394+i%2*79,160,22,'#fff9ed');
        ctx.restore();
      }
    }
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
  function library(ctx,pal,t){
    room(ctx,pal,t);
    rounded(ctx,816,61,122,345,7,'#896f5e','#735d51');
    for(let level=0;level<4;level++){
      rounded(ctx,826,131+level*72,100,7,3,'#b9957e');
      for(let i=0;i<6;i++){
        const h=30+((i*11+level*7)%18);
        rounded(ctx,833+i*15,125+level*72-h,11,h,2,
          (i+level)%3===0?'#b9b6a7':(i+level)%3===1?'#d1b7a0':'#9fab99');
      }
    }
    const glow=ctx.createRadialGradient(680,300,20,680,300,195);
    glow.addColorStop(0,'rgba(255,231,177,'+(.18+Math.sin(t*.00036)*.035)+')');
    glow.addColorStop(1,'rgba(255,231,177,0)');
    ctx.fillStyle=glow;ctx.fillRect(505,115,365,340);
  }
  function sunrise(ctx,pal,t){
    room(ctx,pal,t);
    ctx.save();ctx.beginPath();ctx.rect(123,92,355,297);ctx.clip();
    const glow=ctx.createRadialGradient(400,220,12,400,220,240);
    glow.addColorStop(0,'rgba(255,220,143,'+(.46+Math.sin(t*.00045)*.09)+')');
    glow.addColorStop(1,'rgba(255,220,143,0)');
    ctx.fillStyle=glow;ctx.fillRect(123,92,355,297);ctx.restore();
    ctx.save();ctx.globalAlpha=.13+Math.sin(t*.00029)*.04;
    path(ctx,[[478,147],[820,440],[744,518],[471,289]],'#ffe5b5');ctx.restore();
  }
  const asRgba=(hex,alpha)=>{
    const raw=/^#([0-9a-f]{6})$/i.exec(hex||'');
    if(!raw)return 'rgba(190,166,144,'+alpha+')';
    const x=raw[1],r=parseInt(x.slice(0,2),16),g=parseInt(x.slice(2,4),16),b=parseInt(x.slice(4,6),16);
    return 'rgba('+r+','+g+','+b+','+alpha+')';
  };
  // Mood changes the natural atmosphere; the chosen color is soft reflected
  // light and applies to future brush marks, never rewriting existing marks.
  function drawAtmosphere(ctx,profile,t){
    if(!profile||profile.scene==='blank')return;
    const {moodTone='#c4a390',accent='#b78072',index=0,effect='light'}=profile;
    const x=170+(index%4)*187,y=112+(index%3)*64;
    const motion=Math.sin(t*.00062+index*.7);
    ctx.save();
    const aura=ctx.createRadialGradient(x,y,15,x,y,255);
    aura.addColorStop(0,asRgba(moodTone,.16+motion*.025));
    aura.addColorStop(.42,asRgba(accent,.11+motion*.018));
    aura.addColorStop(1,asRgba(accent,0));
    ctx.fillStyle=aura;ctx.fillRect(Math.max(0,x-265),Math.max(0,y-255),530,510);
    for(let i=0;i<5;i++){
      const phase=t*.00052+i*1.7+index*.4;
      const drift=Math.sin(phase)*15,rise=Math.cos(phase*.75)*9;
      ctx.save();ctx.globalAlpha=.18+Math.sin(phase)*.055;
      if(effect==='ripples'){
        ctx.beginPath();ctx.ellipse(170+i*145+drift,515+i%2*39,38+i*5,10+i,0,0,Math.PI*2);
        ctx.strokeStyle=asRgba(accent,.8);ctx.lineWidth=2;ctx.stroke();
      }else if(effect==='petals'||effect==='leaves'){
        ellipse(ctx,135+i*162+drift,208+i%3*107+rise,7,13,effect==='petals'?moodTone:accent,.3);
      }else if(effect==='sparkle'||effect==='fireflies'){
        const px=142+i*154+drift,py=175+i%3*83+rise;
        const glow=ctx.createRadialGradient(px,py,0,px,py,26);
        glow.addColorStop(0,asRgba(effect==='sparkle'?'#fff2c5':moodTone,.55));
        glow.addColorStop(1,asRgba(accent,0));
        ctx.fillStyle=glow;ctx.fillRect(px-27,py-27,54,54);
      }else if(effect==='mist'||effect==='breeze'){
        ellipse(ctx,80+i*210+drift*1.5,370+i%2*58+rise,135,20,'#fff7ea');
      }else if(effect==='rain'){
        const px=105+i*170+drift,py=135+(i*73+t*.025)%260;
        line(ctx,[px,py,px-10,py+27],asRgba(accent,.85),1.5);
      }else{
        ellipse(ctx,180+i*155+drift,230+i%2*94+rise,55,16,moodTone);
      }
      ctx.restore();
    }
    ctx.restore();
  }
  function drawScene(ctx,kind,t) {
    const pal=col[kind]||col.room;
    if(kind==='sea'||kind==='island')sea(ctx,pal,t,kind);
    else if(kind==='night') night(ctx,pal,t);
    else if(kind==='room')room(ctx,pal,t);
    else if(kind==='library')library(ctx,pal,t);
    else if(kind==='sunrise')sunrise(ctx,pal,t);
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
    else if(type==='cloud'){ctx.translate(wiggle*7,Math.cos(a)*3);for(let i=0;i<4;i++)ellipse(ctx,-24+i*16,(i%2)*-8,27,17,'#f5efe2');}
    else if(type==='petal'){ctx.rotate(wiggle*.16);ellipse(ctx,0,0,17,31,color,.45);}
    else if(type==='flower'){flower(ctx,0,0,50,color,wiggle*.04);}
    else if(type==='star'){for(let i=0;i<8;i++){const v=i*Math.PI/4;line(ctx,[0,0,Math.cos(v)*32,Math.sin(v)*32],'#f4dfaa',2.5)}ellipse(ctx,0,0,7,7,'#ffedcc');}
    else if(type==='rain'){for(let i=0;i<5;i++){let xx=i*17-34;line(ctx,[xx,-26+wiggle*2,xx-11,23+wiggle*2],'#a6c8d4',2.5);}}
    else if(type==='ripples'){for(let i=0;i<3;i++){const ripple=Math.sin(a*.8+i*.7)*4;ctx.beginPath();ctx.ellipse(0,0,16+i*15+ripple,5+i*5+ripple*.2,0,0,Math.PI*2);ctx.strokeStyle=color;ctx.lineWidth=2.5;ctx.stroke()}}
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
      // Distinct silhouettes: a cup, taller mug, spouted kettle, narrow glass and bottle.
      if(type==='cup'){
        ctx.beginPath();ctx.moveTo(-37,-19);ctx.lineTo(31,-19);ctx.lineTo(25,25);ctx.quadraticCurveTo(0,43,-25,25);ctx.closePath();ctx.fillStyle='#eee5da';ctx.fill();
        ellipse(ctx,-2,-20,36,10,'#b98c75');line(ctx,[29,-10,48,-4,45,17,27,18],'#bd9c8b',6);
      }else if(type==='mug'){
        rounded(ctx,-28,-38,57,81,11,'#b5c4b6','#81988d');rounded(ctx,-12,-36,18,55,6,'rgba(255,255,255,.19)');
        ctx.beginPath();ctx.ellipse(30,-2,17,23,0,-Math.PI/2,Math.PI/2);ctx.strokeStyle='#7e9487';ctx.lineWidth=8;ctx.stroke();
      }else if(type==='teapot'){
        ellipse(ctx,0,3,45,34,'#c9a38a');ellipse(ctx,0,-28,27,11,'#ddbaa2');
        ellipse(ctx,0,-39,8,7,'#9f8069');line(ctx,[-33,-4,-58,-25,-67,-17],'#b08d78',10);
        ctx.beginPath();ctx.ellipse(39,-4,17,22,0,-1.5,1.5);ctx.strokeStyle='#ac8b77';ctx.lineWidth=10;ctx.stroke();
      }else if(type==='glass'){
        ctx.beginPath();ctx.moveTo(-28,-39);ctx.lineTo(28,-39);ctx.lineTo(18,41);ctx.lineTo(-18,41);ctx.closePath();
        ctx.fillStyle='rgba(183,216,213,.31)';ctx.fill();ctx.strokeStyle='#d4e9e5';ctx.lineWidth=5;ctx.stroke();
        ctx.fillStyle='rgba(140,178,174,.36)';ctx.fillRect(-19,5,39,24);line(ctx,[-23,-39,23,-39],'#c8e1db',5);
      }else if(type==='bottle'){
        rounded(ctx,-26,-7,52,63,14,'rgba(147,172,154,.7)','#779387');
        rounded(ctx,-12,-57,24,54,5,'rgba(147,172,154,.7)');
        rounded(ctx,-14,-64,28,11,3,'#9d866e');
        rounded(ctx,-21,13,42,23,6,'#e7d9c6');
      }
      if(['cup','mug','teapot'].includes(type)){
        ctx.save();ctx.globalAlpha=.6;ctx.shadowBlur=0;
        for(let i=0;i<2;i++){const x=-12+i*19,shift=Math.sin(t*.0004+i)*3;line(ctx,[x,-55,x+shift-6,-69,x+shift+2,-85],'#f7f0e0',2);}
        ctx.restore();
      }
    } else if(['book','notebook','letter','frame','painting'].includes(type)){
      if(type==='book'){
        path(ctx,[[-62,-31],[-8,-40],[0,-27],[52,-39],[52,34],[0,47],[-9,38],[-62,32]],'#e7d5c1','#9b8270');
        path(ctx,[[-55,-25],[-12,-31],[-8,29],[-55,23]],'#bd8e80');
        line(ctx,[-8,-31,-8,38],'#886a5a',4);
      }else if(type==='notebook'){
        rounded(ctx,-41,-55,82,110,6,'#e9e0cf','#bcb29f');
        rounded(ctx,-31,-43,63,86,3,'#f9f2e3');
        for(let k=0;k<7;k++)ellipse(ctx,-39,-39+k*14,3,3,'#93887a');
        for(let k=0;k<6;k++)line(ctx,[-23,-28+k*14,24,-28+k*14],'#d1cabc',1.4);
      }else if(type==='letter'){
        path(ctx,[[-61,-33],[61,-33],[61,36],[-61,36]],'#f2e5d1','#baa894');
        path(ctx,[[-61,-33],[0,11],[61,-33]],'#f8eee0','#baa894');
        line(ctx,[-60,35,-7,-2,0,4,8,-2,60,35],'#c9b7a0',2);
      }else if(type==='frame'){
        rounded(ctx,-54,-57,108,114,4,'#8e755d','#675848');
        rounded(ctx,-45,-48,90,96,3,'#e8dbc5');
        ellipse(ctx,8,-9,30,30,'#eacfa5');
        path(ctx,[[-37,36],[-8,-14],[19,17],[36,-4],[36,39],[-37,39]],'#87a58c');
      }else if(type==='painting'){
        rounded(ctx,-62,-44,124,91,6,'#efe0cb','#a78c75');
        path(ctx,[[-49,22],[-17,-12],[8,9],[31,-27],[51,17],[51,34],[-49,34]],'#89aaa2');
        ellipse(ctx,-25,-20,9,9,'#e7c48e');
        line(ctx,[-26,47,-44,71,43,71,28,47],'#ad8f73',4);
      }
    } else if(['plant','vase','flowerpot'].includes(type)){
      if(type==='vase'){
        path(ctx,[[-17,-38],[17,-38],[13,-21],[30,13],[18,54],[-18,54],[-30,13],[-13,-21]],'#d0d6ce','#9daaa1');
        line(ctx,[0,-36,0,-80],'#6c9279',3);
        flower(ctx,0,-84,22,'#deb2ab');
      }else if(type==='flowerpot'){
        path(ctx,[[-46,-10],[46,-10],[32,46],[-32,46]],'#ac8067','#8a654f');
        rounded(ctx,-52,-15,104,12,5,'#ba9374');
        for(let k=0;k<5;k++){const x=-35+k*17;line(ctx,[x,-16,x+(k%2?7:-6),-48-(k%2)*15],'#628b69',4);ellipse(ctx,x,-47-(k%2)*14,13,17,k%2?'#739b7b':'#9ab796');}
      }else{
        path(ctx,[[-32,9],[32,9],[24,58],[-24,58]],'#c09a7a','#94765f');
        line(ctx,[0,12,0,-78],'#5e896e',7);
        for(let k=0;k<9;k++){const yy=-20-k*8,x=(k%2?1:-1)*(17+(k%3)*9);
          line(ctx,[0,yy,x,yy-18],'#709875',4);ellipse(ctx,x+(k%2?8:-7),yy-20,23,11,k%2?'#7ca987':'#a0bfa0',k%2?-.35:.35);}
      }
    } else if(['lamp','candle','lantern'].includes(type)){
      if(type==='lamp'){
        path(ctx,[[-44,-15],[-30,-65],[29,-65],[44,-15]],'#e4cfaf','#b89c7b');
        ellipse(ctx,0,-13,30,12,'rgba(255,225,158,.8)');
        line(ctx,[0,-10,0,67],'#8f7865',8);ellipse(ctx,0,69,39,7,'#98765b');
      }else if(type==='candle'){
        rounded(ctx,-18,-19,36,77,6,'#f2e5ce','#c9bba7');
        ellipse(ctx,0,-19,18,7,'#fff5df');
        path(ctx,[[0,-29],[-8,-44],[0,-63],[8,-44]],'#edb06b');
        ellipse(ctx,0,-44,5,13,'#fff0b9');
        ellipse(ctx,0,61,31,6,'#ae9480');
      }else{
        rounded(ctx,-30,-35,60,91,4,'#947b64','#6d665b');
        rounded(ctx,-23,-29,46,73,2,'rgba(247,224,168,.63)');
        line(ctx,[0,-37,0,-62],'#786a5a',7);
        ctx.beginPath();ctx.arc(0,-62,15,Math.PI,0);ctx.strokeStyle='#6a5d50';ctx.lineWidth=6;ctx.stroke();
        path(ctx,[[0,-29],[-9,-7],[0,8],[9,-7]],'#ffe1a1');
        line(ctx,[-29,3,29,3],'#7f6e5f',4);
      }
    } else if(['sofa','chair','cushion','pillow','blanket','rug','bed'].includes(type)){
      if(type==='sofa'){
        rounded(ctx,-80,-52,160,88,24,'#92a69e','#798c80');
        rounded(ctx,-93,-1,186,48,18,'#a8b5a7','#819183');
        rounded(ctx,-102,-8,29,55,12,'#829a91');rounded(ctx,72,-8,30,55,12,'#829a91');
        rounded(ctx,-63,-41,53,45,13,'#e1c9ac');rounded(ctx,13,-41,49,45,13,'#d2bea8');
        line(ctx,[-70,48,-70,62,67,62,67,48],'#806c58',8);
      }else if(type==='chair'){
        rounded(ctx,-43,-71,85,69,15,'#bda88f','#8b735e');
        rounded(ctx,-54,-8,108,24,8,'#a18a6f');
        line(ctx,[-43,17,-53,76,43,76,38,17],'#806a55',10);
      }else if(type==='cushion'){
        ellipse(ctx,0,0,57,43,'#d6b8ab');
        ellipse(ctx,0,0,49,35,'#ead0c3');
        ellipse(ctx,0,0,9,9,'#b98e83');
        for(let k=0;k<4;k++)line(ctx,[0,0,Math.cos(k*Math.PI/2)*39,Math.sin(k*Math.PI/2)*25],'#cdafa5',2);
      }else if(type==='pillow'){
        rounded(ctx,-69,-32,138,64,22,'#efe2ce','#cebda9');
        rounded(ctx,-58,-23,116,47,19,'#e2d3c0');
        line(ctx,[-47,0,47,0],'#f7ecdb',2);
      }else if(type==='blanket'){
        path(ctx,[[-79,-44],[65,-44],[80,-10],[52,67],[-64,56]],'#bea6a0','#a18c8a');
        for(let i=0;i<7;i++)line(ctx,[-58,-30+i*13,57,-30+i*13],'rgba(255,243,229,.35)',2);
        for(let j=0;j<10;j++)line(ctx,[-62+j*12,58,-64+j*12,71],'#d4c1b4',2);
      }else if(type==='rug'){
        ellipse(ctx,0,13,86,32,'#c4a397');
        ellipse(ctx,0,13,72,21,'#e4c7b9');
        for(let i=0;i<6;i++)line(ctx,[-44+i*17,7,-44+i*17,17],'#bd9b92',2);
      }else{
        rounded(ctx,-79,-68,158,42,10,'#998573');
        rounded(ctx,-83,-36,167,88,14,'#d8c7b5','#a98e77');
        rounded(ctx,-73,-25,148,67,13,'#efddc8');
        rounded(ctx,-63,-26,50,28,13,'#f9ebd9');rounded(ctx,13,-26,49,28,13,'#f9ebd9');
        line(ctx,[-72,52,-72,70,72,70,72,52],'#8f7867',8);
      }
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
  window.PauseWorldArt={drawScene,drawAtmosphere,drawElement,drawProp,palettes:col,W,H};
})();