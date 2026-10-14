// 今日一息｜五個世界各自獨立的慢速環境動畫，不讀取私人資料。
(() => {
  'use strict';
  const presets={
    flowers:()=>Array.from({length:11},(_,i)=>{
      const left=8+i*8.5,delay=(i%5)*-.8,scale=.65+(i%3)*.18;
      return '<span class="garden-ambient-petal" style="left:'+left+'%;--delay:'+delay+'s;--scale:'+scale+'"></span>';
    }).join(''),
    farm:()=>Array.from({length:9},(_,i)=>{
      const left=4+i*11,delay=i%4*-.7;
      return '<span class="garden-ambient-stem" style="left:'+left+'%;--delay:'+delay+'s"></span>';
    }).join(''),
    forest:()=>Array.from({length:4},(_,i)=>{
      return '<span class="garden-ambient-sunray" style="left:'+(13+i*23)+'%;--delay:'+(-i*.7)+'s"></span>';
    }).join(''),
    coast:()=>Array.from({length:5},(_,i)=>
      '<span class="garden-ambient-wave" style="top:'+(62+i*5)+'%;--delay:'+(-i*1.3)+'s"></span>'
    ).join(''),
    park:()=>Array.from({length:4},(_,i)=>{
      return '<span class="garden-ambient-ripple" style="left:'+(72+i%2*10)+'%;top:'+
        (70+Math.floor(i/2)*10)+'%;--delay:'+(-i*1.5)+'s"></span>';
    }).join('')
  };
  const cached=new Map();
  function render(name){
    if(!Object.hasOwn(presets,name))return '';
    if(!cached.has(name))cached.set(name,presets[name]());
    return cached.get(name);
  }
  window.PauseGardenMotion={render};
})();