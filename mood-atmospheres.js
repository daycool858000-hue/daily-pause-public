// 今日一息：24 種情緒的個別環境動態。輕量 Canvas 疊層，不含心理診斷或遠端資料。
(() => {
  'use strict';
  const W=960,H=630,T=Math.PI*2;
  // Each mood has a distinct, named visual motion — no repeated default effect table.
  const profiles=[
    ['安靜','still-window','#f3d8b9'],['疲倦','resting-haze','#d9d6d1'],
    ['悶住','opening-gap','#c5c5c9'],['混亂','crossed-currents','#b5c5bf'],
    ['想哭','trailing-rain','#aec6d0'],['孤單','single-beacon','#f0d5a8'],
    ['想被陪著','paired-lights','#e7c8ab'],['想躲起來','sheltered-corner','#cbbbac'],
    ['煩躁','gusts','#d9bcab'],['害怕','protected-ring','#f4dcc2'],
    ['想念','distant-reflection','#d6c5b4'],['心裡很滿','overlapping-orbits','#e6d2b5'],
    ['希望','rising-glow','#f0d1a3'],['期待','approaching-glints','#f5dab3'],
    ['放空','slow-clouds','#e6eaeb'],['好奇','wandering-dots','#d6ddbd'],
    ['安心','steady-halo','#e0d8bf'],['溫柔','soft-petals','#ecd4c9'],
    ['想重新開始','new-page','#f3ddba'],['想看海','shore-breath','#b3d6d3'],
    ['想接近自然','living-leaves','#c3d4bc'],['需要勇氣','forward-steps','#f1d0a9'],
    ['想慢一點','spaced-ripples','#bdd1d0'],['想暖一點','hearth-glow','#f5c899']
  ];
  const byName=Object.fromEntries(profiles.map(([name,kind,color],index)=>[name,{name,kind,color,index}]));
  const color=(hex,alpha)=>{
    const x=/^#([0-9a-f]{6})$/i.exec(hex)?.[1]||'eed7ba';
    return 'rgba('+parseInt(x.slice(0,2),16)+','+parseInt(x.slice(2,4),16)+','+parseInt(x.slice(4),16)+','+alpha+')';
  };
  function ellipse(ctx,x,y,rx,ry,rgba){
    ctx.beginPath();ctx.ellipse(x,y,Math.max(0.1,rx),Math.max(0.1,ry),0,0,T);
    ctx.fillStyle=rgba;ctx.fill();
  }
  function line(ctx,a,b,rgba,w=2){
    ctx.beginPath();ctx.moveTo(...a);ctx.lineTo(...b);ctx.strokeStyle=rgba;ctx.lineWidth=w;ctx.stroke();
  }
  function glow(ctx,x,y,r,paint,opacity){
    const g=ctx.createRadialGradient(x,y,1,x,y,r);
    g.addColorStop(0,color(paint,opacity));g.addColorStop(1,color(paint,0));
    ctx.fillStyle=g;ctx.fillRect(x-r,y-r,r*2,r*2);
  }
  function rings(ctx,x,y,size,stroke,count=3,stretch=.38){
    ctx.strokeStyle=stroke;ctx.lineWidth=2;
    for(let i=0;i<count;i++){ctx.beginPath();ctx.ellipse(x,y,size*(i+1),size*(i+1)*stretch,0,0,T);ctx.stroke();}
  }
  function petal(ctx,x,y,a,r,c){
    ctx.save();ctx.translate(x,y);ctx.rotate(a);
    ctx.beginPath();ctx.ellipse(0,0,r*.38,r,0,0,T);ctx.fillStyle=c;ctx.fill();ctx.restore();
  }
  function paint(ctx,name,time=0,scene='room'){
    const p=byName[name];if(!p||scene==='blank')return;
    const t=time*.001,cycle=Math.sin(t*.41+p.index*.32),c=p.color;
    const alpha=color(c,.14),soft=color(c,.10),faint=color(c,.07);
    ctx.save();
    switch(p.kind){
      case 'still-window':
        glow(ctx,780,190,220,c,.12+.03*cycle);
        line(ctx,[610,0],[690+cycle*7,370],faint,23);
        break;
      case 'resting-haze':
        for(let i=0;i<4;i++)ellipse(ctx,130+i*260+Math.sin(t*.14+i)*28,440+i%2*45,150,32,color(c,.08));
        break;
      case 'opening-gap':
        ctx.fillStyle='rgba(85,92,104,.05)';ctx.fillRect(0,0,W,H);
        glow(ctx,840,315,180,'#fff1d8',.14+.06*Math.sin(t*.3));
        line(ctx,[785,150],[785,560],color('#fff1d8',.16),7);
        break;
      case 'crossed-currents':
        for(let i=0;i<7;i++){
          const x=80+i*140,y=185+i%3*110;
          line(ctx,[x+Math.sin(t*.7+i)*24,y],[x+Math.cos(t*.46+i)*26,y+70],soft,2);
        }break;
      case 'trailing-rain':
        for(let i=0;i<14;i++){
          const x=(i*89+29)%W,y=80+(i*61+t*35)%440;
          line(ctx,[x,y],[x-7,y+23],color(c,.15),1.5);
        }break;
      case 'single-beacon':
        glow(ctx,725,355,125,c,.19+.04*cycle);
        ellipse(ctx,725,355,9,12,alpha);
        break;
      case 'paired-lights':
        glow(ctx,340+cycle*7,330,135,c,.13);
        glow(ctx,560-cycle*7,330,135,c,.15);
        break;
      case 'sheltered-corner':
        ctx.fillStyle='rgba(65,58,54,.055)';
        ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(230,0);ctx.lineTo(0,370);ctx.closePath();ctx.fill();
        glow(ctx,480,370,190,c,.08+.015*cycle);
        break;
      case 'gusts':
        for(let i=0;i<5;i++){
          const x=(140+i*202+Math.sin(t*.9+i)*36)%W,y=170+i%3*123;
          line(ctx,[x-44,y+9],[x+58,y],soft,2.4);
        }break;
      case 'protected-ring':
        glow(ctx,500,320,170,'#ffe4bf',.105);
        ctx.strokeStyle=color(c,.13);ctx.lineWidth=4;
        ctx.beginPath();ctx.arc(500,320,92+cycle*4,0,T);ctx.stroke();
        break;
      case 'distant-reflection':
        glow(ctx,790,175,120,c,.12);
        for(let i=0;i<5;i++)line(ctx,[540+i*32,515+i*14],[685-i*8,515+i*14],faint,2);
        break;
      case 'overlapping-orbits':
        for(let i=0;i<3;i++){
          ctx.beginPath();ctx.ellipse(460+i*48,320,175,110,i*.39,0,T);
          ctx.strokeStyle=color(c,.06+i*.018);ctx.lineWidth=5;ctx.stroke();
        }break;
      case 'rising-glow':
        glow(ctx,740,500+cycle*5,310,c,.13);
        line(ctx,[710,510],[722,300],soft,20);break;
      case 'approaching-glints':
        for(let i=0;i<6;i++){
          const x=140+i*126+Math.sin(t*.4+i)*11,y=235+(i%3)*89;
          glow(ctx,x,y,28,c,.11+Math.sin(t*.9+i)*.025);
        }break;
      case 'slow-clouds':
        for(let i=0;i<4;i++)ellipse(ctx,120+i*260+Math.sin(t*.12+i)*45,250+i%2*95,150,21,color(c,.09));
        break;
      case 'wandering-dots':
        for(let i=0;i<9;i++)glow(ctx,75+i*105+Math.cos(t*.48+i)*13,170+i%4*97+Math.sin(t*.54+i)*16,23,c,.11);
        break;
      case 'steady-halo':
        glow(ctx,480,310,260,c,.15);
        ellipse(ctx,480,315,115,89,color(c,.032));
        break;
      case 'soft-petals':
        for(let i=0;i<9;i++)petal(ctx,110+i*92+Math.sin(t*.42+i)*25,120+(i*63+t*7)%380,i*.62+t*.07,8,c===undefined?soft:color(c,.14));
        break;
      case 'new-page':
        ctx.fillStyle=color('#fff3d8',.075);
        ctx.beginPath();ctx.moveTo(20,500);ctx.lineTo(360,500);ctx.lineTo(620,110);ctx.lineTo(490,110);ctx.closePath();ctx.fill();
        glow(ctx,670,170,180,c,.1+.03*cycle);
        break;
      case 'shore-breath':
        for(let i=0;i<4;i++)rings(ctx,470+i*165,520+Math.sin(t*.25+i)*6,14,color(c,.1),2,.18);
        break;
      case 'living-leaves':
        for(let i=0;i<10;i++)petal(ctx,65+i*98+Math.sin(t*.4+i)*17,150+i%3*140+Math.cos(t*.45+i)*16,.5+Math.sin(t*.35+i)*.4,7,color(c,.11));
        break;
      case 'forward-steps':
        for(let i=0;i<6;i++)glow(ctx,190+i*101,475-i*48,24+i*3,c,.065+.025*Math.sin(t*.7-i*.55));
        break;
      case 'spaced-ripples':
        for(let i=0;i<3;i++)rings(ctx,250+i*220,505+i%2*45,11+Math.sin(t*.15+i)*3,color(c,.11),2,.21);
        break;
      case 'hearth-glow':
        glow(ctx,650,405,265,c,.12+.04*Math.sin(t*.57));
        glow(ctx,650,405,110,'#ffd8a0',.09+.03*Math.sin(t*.36));
        break;
    }
    ctx.restore();
  }
  window.PauseMoodAtmospheres={profiles,byName,paint};
})();
