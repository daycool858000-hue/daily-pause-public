// 今日一息｜畫布本身的低幅度動態（與使用者加入的動態形狀分離）。
// Only paint on the background layer. Never mutate marks, props, history or storage.
(function(){
  'use strict';
  const W=960,H=630,PI=Math.PI;
  const profiles=Object.freeze({
    forest:'mist', ocean:'sea', room:'window', living:'window',
    cafe:'warm', park:'leaves', street:'lamps', mountain:'lake'
  });
  const positions={
    forest:[650,245], ocean:[680,285], room:[720,170], living:[750,160],
    cafe:[790,205], park:[700,150], street:[740,240], mountain:[650,195]
  };
  function wash(ctx,x,y,rx,ry,color,strength){
    if(strength<=0)return;
    ctx.save();
    ctx.translate(x,y);ctx.scale(rx,ry);
    const g=ctx.createRadialGradient(0,0,.001,0,0,1);
    g.addColorStop(0,color.replace('{a}',String(strength)));
    g.addColorStop(.54,color.replace('{a}',String(strength*.42)));
    g.addColorStop(1,color.replace('{a}','0'));
    ctx.fillStyle=g;ctx.beginPath();ctx.arc(0,0,1,0,2*PI);ctx.fill();ctx.restore();
  }
  function water(ctx,t,baseY,lines,color,spread){
    ctx.save();ctx.strokeStyle=color;ctx.lineWidth=1.1;
    for(let i=0;i<lines;i++){
      const y=baseY+i*spread;
      const x=115+(i*151)%705+Math.sin(t*.11+i*.83)*9;
      const len=32+(i*41)%95;
      ctx.globalAlpha=.035+(i%3)*.012;
      ctx.beginPath();ctx.moveTo(x-len*.5,y);ctx.quadraticCurveTo(x,y+Math.sin(t*.19+i)*1.5,x+len*.5,y);
      ctx.stroke();
    }
    ctx.restore();
  }
  // All motions are slower than interactive stamps: 25–60 seconds per cycle.
  function paint(ctx,scene,mood,time){
    if(!ctx||scene==='blank')return;
    const t=Math.max(0,time)*.001;
    const drift=Math.sin(t*.17),breath=Math.sin(t*.115),slow=Math.cos(t*.095);
    const type=profiles[scene];
    ctx.save();
    if(!type){
      // 24 independent paper backgrounds: a barely perceptible variation in
      // reflected ambient light, not motion of the paper texture or brushstrokes.
      const seed=Array.from(mood||'').reduce((n,c)=>n+c.codePointAt(0),0);
      const x=650+(seed%7)*24,y=160+(seed%5)*20;
      wash(ctx,x+drift*14,y+slow*5,355,270,'rgba(255,239,215,{a})',.022+.007*breath);
      wash(ctx,170,495,250,180,'rgba(169,183,170,{a})',.008+.003*slow);
      ctx.restore();return;
    }
    const [x,y]=positions[scene];
    switch(type){
      case 'mist':
        wash(ctx,x+drift*25,360+slow*7,415,160,'rgba(243,247,236,{a})',.055+.015*breath);
        wash(ctx,250-slow*20,250,330,145,'rgba(244,246,236,{a})',.043+.009*drift);
        wash(ctx,740,120,260,280,'rgba(251,225,184,{a})',.018+.007*slow);
        break;
      case 'sea':
        wash(ctx,x+slow*18,y,325,245,'rgba(255,242,221,{a})',.035+.009*breath);
        wash(ctx,200-drift*18,415,410,110,'rgba(231,252,250,{a})',.04+.01*slow);
        water(ctx,t,402,9,'#fff9e6',22);break;
      case 'lake':
        wash(ctx,490+drift*28,337,460,135,'rgba(245,249,246,{a})',.067+.008*breath);
        wash(ctx,x+slow*15,y,310,285,'rgba(246,244,230,{a})',.025+.007*drift);
        water(ctx,t,468,6,'#fffdf4',24);break;
      case 'window':
        wash(ctx,x+drift*11,y+slow*6,340,370,'rgba(255,236,194,{a})',.05+.013*breath);
        // Shifting very faint curtain/window shadow; no crisp graphical edges.
        wash(ctx,400+slow*19,470,200,255,'rgba(186,177,156,{a})',.017+.003*drift);
        break;
      case 'warm':
        wash(ctx,x+drift*9,y,260,250,'rgba(255,222,162,{a})',.063+.011*slow);
        wash(ctx,260,430,390,155,'rgba(255,242,219,{a})',.022+.005*breath);
        break;
      case 'leaves':
        wash(ctx,x+drift*18,y,350,350,'rgba(255,243,206,{a})',.028+.012*breath);
        wash(ctx,235+slow*23,375,275,265,'rgba(167,187,156,{a})',.019+.006*drift);
        break;
      case 'lamps':
        wash(ctx,740,255,255,255,'rgba(255,196,139,{a})',.055+.013*breath);
        wash(ctx,285,280,205,275,'rgba(255,211,155,{a})',.035+.007*slow);
        wash(ctx,540+drift*7,505,310,90,'rgba(255,219,186,{a})',.016+.004*slow);
        break;
    }
    ctx.restore();
  }
  window.PauseCanvasBreathe=Object.freeze({paint,profiles});
})();