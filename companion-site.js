// A single roaming companion for the entire visit. It never interrupts navigation.
// Tap to converse; no automatic speech bubbles, tracking, analytics or diagnosis.
(() => {
  const thoughts=[
  "嗨，今天的天氣適合來一杯喜歡的飲料嗎？",
  "你吃過飯了嗎？希望今天有一道菜，是你真心喜歡的。",
  "如果剛剛經歷不太愉快的事，我可以陪你安靜地待一下。",
  "我想送你一個小小的祝福：今晚睡前，能想起一個溫暖的片刻。",
  "今天有沒有聞到很好聞的味道？麵包、雨後的空氣，或是一碗熱湯。",
  "我覺得，被記住喜歡吃什麼，是一件很甜的事。",
  "有時候一句「要不要一起吃飯」，比很多漂亮的話更讓人安心。",
  "外面如果在下雨，希望你有一雙乾乾的襪子，和一個能好好休息的地方。",
  "你不用向我報告今天的成績。我只是飛過來陪你一下。",
  "心情好的時候可以分享；心情不好的時候，也可以只看我飛一小圈。",
  "我喜歡想像窗邊有一盆植物，等著下一次陽光照進來。",
  "如果今天很辛苦，我希望你晚餐能吃得舒服一些。",
  "我不會問你為什麼還沒有振作。你可以照自己的速度待在這裡。",
  "你最近有吃到讓你忍不住想再吃一口的甜點嗎？",
  "有個很小的快樂：回家時剛好遇到一陣舒服的風。",
  "想念某個人的時候，或許也會突然想起他最常說的一句話。",
  "若今天沒人問你累不累，就讓我輕輕問一次：累了嗎？",
  "被理解是很舒服的事。希望你身邊也有不用解釋太多的人。",
  "一碗熱湯、乾淨的枕頭、一首老歌，有時能把普通的晚上變得溫柔。",
  "如果有人惹你生氣，我先不勸你原諒。要不要先喝杯水？",
  "今天有沒有一件事讓你偷偷笑了一下？我很好奇。",
  "有些日子不用安排特別的收穫。好好吃飯，已經很實在。",
  "你喜歡的那家小店還在嗎？熟悉的味道，總能讓人想起一些故事。",
  "如果一張卡片沒有說進你心裡，沒關係。你可以把它留在這裡。",
  "有些思念是甜的，有些會酸酸的。它們都可能來自珍惜過的人。",
  "我今天想送你一朵想像中的小花。你可以把它放在喜歡的地方。",
  "不必一直說話。你想安靜時，我就安靜地發一點光。",
  "忙完以後，記得看看今天的天空。就算是陰天，也可能有好看的雲。",
  "如果現在很開心，我也想替你高興；不用擔心快樂顯得太小。",
  "今天若沒有誰能陪你吃飯，希望那一餐依然有你喜歡的味道。",
  "一塊蛋糕無法替你解決難題，但好吃的那一口，可以好好享受。",
  "對自己好一點，有時只是願意承認：我今天需要睡早一點。",
  "你的情緒可以留在這裡，不需要畫得漂亮，也不需要說明。",
  "如果等一下還有很多事情要忙，希望中間會有一點不用趕的時間。",
  "你喜歡早晨陽光照進房間，還是晚上只留一盞小燈？",
  "晚安不是催你趕快睡著。我只是希望你今天能有個舒服的晚上。"
];
  const styles=['butterfly','firefly'];
  function shuffle(list){const result=list.slice();for(let i=result.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[result[i],result[j]]=[result[j],result[i]]}return result}
  let queue=shuffle(thoughts),previous=null,off=false;
  function next(){if(!queue.length){queue=shuffle(thoughts);if(queue[0]===previous)queue.push(queue.shift())}return previous=queue.shift()}
  function init(){
    const root=document.getElementById('globalCompanion');if(!root)return;
    const bubble=root.querySelector('.companion-bubble'),button=root.querySelector('.companion-orb');
    const close=root.querySelector('.companion-close'),disable=root.querySelector('.companion-disable');
    const icon=root.querySelector('.companion-scene'),message=root.querySelector('.companion-line');
    // One tiny animated companion persists on all page sections, never respawns on navigation.
    const style=styles[Math.floor(Math.random()*styles.length)];
    root.dataset.creature=style;
    button.innerHTML=style==='butterfly'
      ?'<span class="sprite-butterfly" aria-hidden="true"><i></i><i></i><b></b></span>'
      :'<span class="sprite-firefly" aria-hidden="true"><i></i><b></b></span>';
    button.setAttribute('aria-label','和網站的小'+(style==='butterfly'?'蝴蝶':'光點')+'說一句話');
    let hideTimer=null;
    const hide=()=>{bubble.hidden=true;clearTimeout(hideTimer)};
    button.addEventListener('click',()=>{
      if(off)return;
      icon.dataset.scene=style==='butterfly'?'leaf':'light';
      message.textContent=next();
      bubble.hidden=false;root.classList.remove('companion-enter');void root.offsetWidth;root.classList.add('companion-enter');
      clearTimeout(hideTimer);hideTimer=setTimeout(hide,12000);
    });
    close.addEventListener('click',hide);
    disable.addEventListener('click',()=>{off=true;hide();root.hidden=true});
    // Legacy prompts from page actions are intentionally ignored:
    // opening reading, changing canvas tools and navigation must never pop up speech.
    window.addEventListener('pause:companion-close',hide);
    document.addEventListener('visibilitychange',()=>{if(document.hidden)hide()});
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();