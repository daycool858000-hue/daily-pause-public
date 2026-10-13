// A single roaming companion for the entire visit. It never interrupts navigation.
// Tap to converse; no automatic speech bubbles, tracking, analytics or diagnosis.
(() => {
  const thoughts=[
    '我剛剛經過那張畫，發現樹和海浪放在一起也沒有什麼不可以。',
    '你有沒有一個很喜歡、卻不知道為什麼喜歡的地方？',
    '同一扇窗，晴天和下雨天看起來會像不同的房間。',
    '你想不想知道，一個平常的物件為什麼能讓人想起很多年前？',
    '我看到有人把葉子留在畫裡。你會想把哪種聲音也留在那裡？',
    '有些人喜歡熱鬧，有些人會在熱鬧過後才聽見自己的想法。',
    '剛翻過的文章，有沒有一句你不同意？那也很值得想想。',
    '如果把今天當成一張照片，鏡頭會朝向哪裡？',
    '你喜歡山裡的霧，還是海邊的風？我很好奇原因。',
    '有時候，人會記住一個地方的氣味，比記住它的名字還久。',
    '書裡的人物做了你不會做的決定，你會想問他什麼？',
    '那盞小燈亮著的房間，讓你想到誰的家？',
    '一個人說「我知道了」，有時代表理解，有時只是想結束對話。',
    '如果窗邊能放一樣東西，你第一個想到的是書、花，還是杯子？',
    '好奇心有個奇怪的地方：問題常常比答案待得更久。',
    '我們看見別人的一個片刻，卻很容易忘記他有一整天。',
    '有時我飛過一段文字，會好奇作者為什麼選了這個詞。',
    '把一段話換個語氣念，意思會不會跟著改變？',
    '你今天有沒有看見一件別人可能不會特別注意的小事？',
    '我不急著替畫取名字。說不定畫完以後，名字才會出現。',
    '為什麼同一首歌，在不同年紀聽起來會不一樣？',
    '你可以不同意任何一張小卡。它只是邀請你看看另一種說法。',
    '若今天只能保留一個聲音，你想留下雨、笑聲，還是水流？',
    '有些問題可以沿著不同方向思考；我喜歡這種沒有急著關門的感覺。'
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