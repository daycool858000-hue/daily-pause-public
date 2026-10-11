const companionLines = (window.dailyContent && window.dailyContent.companionLines) || [];
const dailyExperiences = (window.dailyContent && window.dailyContent.experiences) || [];

const cards = [
  { type: '經典引文', text: '有些事在我們的掌握之中，有些事不在。', source: '愛比克泰德《手冊》1｜本站依古典思想自行概述，非逐字譯文；連結為參考譯本', sourceLink: 'https://en.wikisource.org/wiki/Epictetus,_the_Discourses_as_reported_by_Arrian,_the_Manual,_and_Fragments/Manual', tag: '分辨能掌握的事', art: 'sun' },
  { type: '覺察', text: '我現在最需要的，不一定是更多力氣，也可能是一點理解。', source: '今日一息｜原創陪伴文字', tag: '給情緒一個位置', art: 'leaf' },
  { type: '呼吸', text: '把注意力放回呼吸：吸氣數四拍，吐氣數六拍，重複三次。', source: '今日一息｜日常練習，非醫療建議', tag: '一分鐘練習', art: 'cloud' },
  { type: '身體', text: '讓下巴鬆開，肩膀往下。身體知道的事，有時比腦袋更早。', source: '今日一息｜原創身體覺察文字', tag: '回到身體', art: 'flower' },
  { type: '經典引文', text: '向內探看；善的泉源就在內心，只要你願意挖掘，它總會湧出。', source: '馬可·奧理略《沉思錄》7.59｜本站依古典思想自行概述，非逐字譯文；連結為參考譯本', sourceLink: 'https://en.wikisource.org/wiki/The_Meditations_of_the_Emperor_Marcus_Antoninus/Book_7', tag: '往內留一點空間', art: 'star' }
];
cards.push(...(window.extraCards || []));
function localDateKey(date = new Date()) {
  const pad = value => String(value).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}
function dateOrdinal(key) {
  const [year, month, day] = key.split('-').map(Number);
  return Math.floor((Date.UTC(year, month - 1, day) - Date.UTC(1970, 0, 1)) / 86400000);
}
const todayKey = localDateKey();
const todayOrdinal = dateOrdinal(todayKey);
function pickRandomCards() {
  const pool = cards.slice();
  for (let index = pool.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [pool[index], pool[swapIndex]] = [pool[swapIndex], pool[index]];
  }
  return pool.slice(0, Math.min(5, pool.length));
}
const dailyCardsKey = `xinli-daily-cards-${todayKey}`;
const dailyProgressKey = `xinli-progress-${todayKey}`;
function loadDailyCards() {
  try {
    const storedIndexes = JSON.parse(localStorage.getItem(dailyCardsKey) || 'null');
    if (Array.isArray(storedIndexes) && storedIndexes.length === Math.min(5, cards.length)
      && new Set(storedIndexes).size === storedIndexes.length
      && storedIndexes.every(index => Number.isInteger(index) && cards[index])) {
      return storedIndexes.map(index => cards[index]);
    }
  } catch (_) { /* ignore malformed local storage and create a fresh daily set */ }
  const selected = pickRandomCards();
  localStorage.setItem(dailyCardsKey, JSON.stringify(selected.map(card => cards.indexOf(card))));
  localStorage.removeItem(dailyProgressKey);
  return selected;
}
const dailyCards = loadDailyCards();

const articles = [
  { title: '壓力來的時候，先做一件能讓自己回到當下的事', category: '壓力', language: '中文', source: '今日一息｜原創短文', description: '一份不追求完美的日常練習：辨認身體訊號、縮小下一步，讓壓力不再一次佔滿整個視野。', url: '#', status: '原創內容', rights: '本站原創', art: 'leaf' },
  { title: '一份給忙碌日子的呼吸與休息提醒', category: '呼吸', language: '中文', source: '今日一息｜原創短文', description: '休息不是把事情丟著不管，而是讓注意力重新有選擇。從一個短暫停頓開始。', url: '#', status: '原創內容', rights: '本站原創', art: 'cloud' },
  { title: '睡前，把明天交還給明天', category: '睡眠', language: '中文', source: '今日一息｜原創短文', description: '試著在睡前寫下腦中掛念的事，替今天畫一道柔軟的句點，再把未完留到明天。', url: '#', status: '原創內容', rights: '本站原創', art: 'moon' },
  { title: '為自己留一條不必立刻回覆的界線', category: '界線', language: '中文', source: '今日一息｜原創短文', description: '界線不等於冷漠。它可以是一句清楚、尊重自己也尊重對方的「我晚一點回覆你」。', url: '#', status: '原創內容', rights: '本站原創', art: 'flower' },
  { title: 'Doing What Matters in Times of Stress', category: '壓力', language: 'English', source: 'World Health Organization', description: '世界衛生組織提供的壓力調適指南，包含 grounding、與價值連結等可日常練習的方法。', url: 'https://www.who.int/publications/i/item/9789240003927', status: '公開指南索引', rights: '外部指南參考連結；本站未轉載指南', art: 'sun' },
  { title: 'Every Mind Matters: Sleep', category: '睡眠', language: 'English', source: 'NHS', description: '英國 NHS 的睡眠與身心健康建議頁面，從規律作息與睡前環境提供溫和的自我照顧方向。', url: 'https://www.nhs.uk/every-mind-matters/mental-health-issues/sleep/', status: '公開文章索引', rights: 'Crown Copyright；本站未複製全文', art: 'moon' },
  { title: 'Mindfulness and mental wellbeing', category: '正念', language: 'English', source: 'Mental Health Foundation', description: '介紹正念如何成為日常覺察練習，並提醒使用者依自己的狀態選擇適合的方式。', url: 'https://www.mentalhealth.org.uk/explore-mental-health/a-z-topics/mindfulness', status: '公開文章索引', rights: '本站僅作來源索引，請依原站條款使用', art: 'star' },
  { title: '心理健康資源與支持', category: '心理', language: '中文', source: '衛生福利部心理健康司', description: '台灣官方心理健康資源入口，提供心理健康、支持與求助資訊的公開索引。', url: 'https://dep.mohw.gov.tw/DOMHAOH/', status: '官方資源索引', rights: '官方來源索引；請依原站資訊使用', art: 'heart' },
  { title: '正念', category: '正念', language: '中文', source: '中文維基百科', description: '介紹將注意力集中於當下的心理過程，以及它與禪、冥想和現代心理健康實踐的關聯。', url: 'https://zh.wikipedia.org/wiki/%E6%AD%A3%E5%BF%B5', status: '外部參考連結', rights: '外部百科參考連結；本站另撰簡介，未轉載條目', art: 'leaf' },
  { title: '森林浴', category: '自然', language: '中文', source: '中文維基百科', description: '從感官體驗與自然接觸的角度，認識森林浴與森林療癒的概念、活動方式與研究脈絡。', url: 'https://zh.wikipedia.org/wiki/%E6%A3%AE%E6%9E%97%E6%B5%B4', status: '外部參考連結', rights: '外部百科參考連結；本站另撰簡介，未轉載條目', art: 'tree' },
  { title: '園藝療法', category: '身體', language: '繁體中文', source: '中文維基百科', description: '了解透過園藝活動支持身心效益的輔助治療專業，以及它的發展與常見操作方式。', url: 'https://zh.wikipedia.org/wiki/%E5%9C%92%E8%97%9D%E6%B2%BB%E7%99%82', status: '外部參考連結', rights: '外部百科參考連結；本站另撰簡介，未轉載條目', art: 'flower' },
  { title: '旅行', category: '旅行', language: '中文', source: '中文維基百科', description: '從位移、交通方式與旅遊概念切入，讀一篇不急著抵達目的地的知識小文。', url: 'https://zh.wikipedia.org/wiki/%E6%97%85%E8%A1%8C', status: '外部參考連結', rights: '外部百科參考連結；本站另撰簡介，未轉載條目', art: 'plane' },
  { title: '哲學', category: '哲學', language: '中文', source: '中文維基百科', description: '哲學的主題概覽，包含主要分支、歷史時期與思想家，適合想慢慢思考一個問題的時候。', url: 'https://zh.wikipedia.org/wiki/%E5%93%B2%E5%AD%B8', status: '外部參考連結', rights: '外部百科參考連結；本站另撰簡介，未轉載條目', art: 'book' },
  { title: '佛教', category: '佛學', language: '中文', source: '中文維基百科', description: '認識源於古印度的宗教與思想傳統，從基本教義、歷史發展到不同地區的傳播。', url: 'https://zh.wikipedia.org/wiki/%E4%BD%9B%E6%95%99', status: '外部參考連結', rights: '外部百科參考連結；本站另撰簡介，未轉載條目', art: 'lotus' },
  { title: '宗教', category: '宗教', language: '中文', source: '中文維基百科', description: '以百科概覽的方式，認識宗教的定義、教儀、教團、起源理論與社會影響。', url: 'https://zh.wikipedia.org/wiki/%E5%AE%97%E6%95%99', status: '外部參考連結', rights: '外部百科參考連結；本站另撰簡介，未轉載條目', art: 'sun' },
  { title: '海洋', category: '自然', language: '中文', source: '中文維基百科', description: '從海水、氣候與生態到人類利用，讀一篇把視線帶向更大尺度的自然知識。', url: 'https://zh.wikipedia.org/wiki/%E6%B5%B7%E6%B4%8B', status: '外部參考連結', rights: '外部百科參考連結；本站另撰簡介，未轉載條目', art: 'wave' },
  { title: '曼陀羅', category: '心靈', language: '中文', source: '中文維基百科', description: '從植物、佛教術語到文學作品，認識「曼陀羅」這個詞在不同脈絡裡的含義。', url: 'https://zh.wikipedia.org/wiki/%E6%9B%BC%E9%99%80%E7%BE%85', status: '外部參考連結', rights: '外部百科參考連結；本站另撰簡介，未轉載條目', art: 'mandala' },
  { title: '音樂治療', category: '身體', language: '中文', source: '中文維基百科', description: '介紹以樂音與節奏回應生理或心理需求的有計畫療程，並認識它的不同治療取向。', url: 'https://zh.wikipedia.org/wiki/%E9%9F%B3%E6%A8%82%E6%B2%BB%E7%99%82', status: '外部參考連結', rights: '外部百科參考連結；本站另撰簡介，未轉載條目', art: 'music' },
  { title: 'Stress, Lifestyle, and Health', category: '壓力', language: 'English', source: 'OpenStax Psychology 2e', description: '從心理與生理面向介紹壓力、生活型態、健康影響與因應方式，適合想多了解背景知識時閱讀。', url: 'https://openstax.org/books/psychology-2e/pages/14-introduction', status: '外部教材連結', rights: '外部教材參考連結；本站未轉載教材', art: 'sun' },
  { title: 'Consciousness, Sleep and Dreams', category: '睡眠', language: 'English', source: 'OpenStax Psychology 2e', description: '介紹意識狀態、睡眠階段、夢境與睡眠障礙，作為睡眠主題的基礎知識閱讀。', url: 'https://openstax.org/books/psychology-2e/pages/4-introduction', status: '外部教材連結', rights: '外部教材參考連結；本站未轉載教材', art: 'moon' }
];
articles.push(...(window.shortArticlesData || []));

const articleBodies = {
  '壓力來的時候，先做一件能讓自己回到當下的事': ['壓力很大時，腦中常常同時出現很多待辦事項。先不用急著解決全部，找一個感覺得到的東西：腳踩著地面的重量、手心的溫度，或眼前一個顏色。', '當注意力回到當下，事情不一定立刻變少，但你會多一點選擇。接著只問自己：「下一個最小、最溫柔的動作是什麼？」喝水、伸展，或把一件事寫下來，都算是開始。'],
  '一份給忙碌日子的呼吸與休息提醒': ['忙碌不代表你必須一直緊繃。把肩膀放下，讓吸氣自然進來，再讓吐氣比吸氣稍微長一點。你不需要做得很標準，只要感覺自己正在停留。', '休息也可以只有一分鐘。離開螢幕、看一眼窗外，或把雙手覆在胸口，都是在告訴身體：「現在可以不用趕路。」'],
  '睡前，把明天交還給明天': ['睡前的腦袋喜歡把未完成的事重新播放。拿一張紙寫下三件掛念的事，再在旁邊寫一句：「我明天會再處理。」這不是逃避，而是替今天畫出邊界。', '接著把房間的光線調暗，讓身體知道一天正在收尾。如果還睡不著，也不必責怪自己；安靜地躺著、聽呼吸，本身就是休息的一部分。'],
  '為自己留一條不必立刻回覆的界線': ['訊息出現時，你不一定要立刻回覆。可以先說：「我看到了，晚一點整理好再回你。」清楚的時間界線，往往比勉強自己答應更多事情更溫柔。', '界線不是把人推開，而是讓關係有足夠空間呼吸。當你知道自己的容量，也比較能用真實而穩定的方式陪伴別人。'],
  'Doing What Matters in Times of Stress': ['When stress fills the whole room, choose one small anchor. Notice five things you can see, four things you can feel, or one sound that is already here. The aim is not to force calm, but to reconnect with the present moment.', 'Then choose one action that reflects what matters to you today: kindness, steadiness, rest, or connection. A small action can be enough when the day feels too large.'],
  'Every Mind Matters: Sleep': ['睡眠不是一場需要完美達成的考試。比起突然改變所有習慣，可以先固定一個「準備睡覺」的訊號，例如同一盞燈、幾頁書，或一段安靜音樂。', '如果今晚沒有睡得理想，明天也不需要用責備補償。回到規律的起床時間、白天接觸自然光，並把注意力放在可調整的一小步。'],
  'Mindfulness and mental wellbeing': ['正念可以很生活化：刷牙時感覺水流，走路時感覺腳步，喝茶時留意溫度。當思緒跑遠了，發現它，再把注意力帶回來，就已經完成一次練習。', '正念不是要求自己永遠平靜，也不是把情緒趕走。它更像一盞小燈，讓你看見此刻的感受，並用少一點自動反應來照顧自己。'],
  '心理健康資源與支持': ['照顧心理健康不只是在很辛苦時才需要。找一個可信任的人聊聊、讓日常保有睡眠與吃飯的節奏，或記下每天一個感受，都可以是支持自己的方式。', '如果困擾已經影響生活，尋求專業協助是合理而勇敢的選擇。本站提供的是日常陪伴，不能取代醫療、心理或危機服務；需要時請向當地專業單位求助。'],
  '正念': ['正念是一種把注意力帶回當下的練習。你可以先注意一個聲音、一個觸感，或呼吸進出鼻腔的感覺。當你發現自己分心，不需要生氣，只要再回來。', '長一點的練習可以讓人更熟悉自己的內在變化，但短短十秒也有意義。重點不是清空腦袋，而是多一點看見與選擇。'],
  '森林浴': ['走進樹木較多的地方，不一定要完成一條路線。慢慢走，感覺腳下的地面，觀察樹皮的紋理與光影的移動，讓感官先於思考。', '自然接觸不能取代治療，但可以成為日常恢復的一個環節。若無法去森林，也可以在住家附近找一棵樹，花幾分鐘和它一起安靜。'],
  '園藝療法': ['照顧植物是一種有節奏的活動：看土壤、澆水、剪掉枯葉，再等待新的變化。它不要求你一次完成很多事，而是讓注意力停在一個具體的小任務。', '沒有花園也沒關係，一杯水裡的綠枝、一盆香草，或替窗台擦去灰塵，都可以成為與生命感接觸的方式。'],
  '旅行': ['旅行有時不是去很遠的地方，而是讓熟悉的路線多一個角度。換一條街回家、在附近公園坐十分鐘，或觀察一間店的門面，都能讓日常重新有細節。', '真正的休息不一定要塞滿行程。留一段沒有目的的時間，讓腳步慢下來，目的地就不只是一個地名，也是一種重新感受世界的方式。'],
  '哲學': ['哲學可以從一個小問題開始：「什麼是我今天能負責的事？」把問題寫下來，不急著找到唯一答案，先看看它如何改變你看待眼前情境的方式。', '思考不是把生活變得更複雜，而是幫我們分辨哪些價值值得守護。今天選一個你重視的詞，例如誠實、安定或善意，讓一個小行動靠近它。'],
  '佛教': ['佛教思想中常談到對當下與變化的觀察。用日常語言說，就是承認感受會來也會走，不必把某一刻的痛苦當成永遠的自己。', '閱讀任何宗教或思想，都可以保有自己的提問與界線。這篇短文只提供溫和的知識入口，不代表任何宗教立場，也不要求你接受特定答案。'],
  '宗教': ['宗教對不同的人可能是信仰、文化、家庭記憶或思考世界的方式。理解它時，可以先聽見多種經驗，而不是急著把所有人放進同一個框架。', '我們可以尊重他人的信念，也保留自己選擇距離的權利。溫柔的對話不必消除差異，只要讓彼此都能被完整地看見。'],
  '海洋': ['海洋的尺度很大，卻也和每天的生活相連。潮汐、氣候、食物與許多生命，都在一個不容易被看見的循環裡互相牽動。', '當你覺得自己的煩惱佔滿視野，可以想像站在海邊看一會兒。問題仍然存在，但世界也還有更寬的背景，容得下你慢慢呼吸。'],
  '曼陀羅': ['曼陀羅在不同文化與脈絡裡有不同意思。對許多人來說，圓形與重複的圖案也提供一種專注的節奏：從中心開始，慢慢向外延伸。', '你可以畫一個圓、填入今天喜歡的線條與顏色，不需要追求對稱或漂亮。它不是測驗，也不替你解讀人生，只是一個讓手和心一起停留的空間。'],
  '音樂治療': ['音樂會和呼吸、記憶與身體感受連在一起。今天選一首不需要解釋的歌，讓它在背景播放，注意自己在某個段落是放鬆、想動，還是想安靜。', '日常聽音樂可以支持情緒，但若涉及治療需要由合資格專業人員評估。你也可以只把音樂當作陪伴，不必要求它立刻改變心情。'],
  'Stress, Lifestyle, and Health': ['Stress is a message from the body and mind, not a personal failure. Start by noticing a pattern: when does tension rise, and what helps even a little? A glass of water, a pause, or a conversation can be useful data.', 'Healthy routines are built through repeatable choices, not heroic effort. Pick one small routine that supports your energy and allow it to be imperfect while it becomes familiar.'],
  'Consciousness, Sleep and Dreams': ['睡眠讓身體與心智有機會整理一天的經驗。夢境有時鮮明、有時模糊，不必急著為每個夢尋找固定的象徵或答案。', '若睡眠困擾持續影響日常，請尋求醫療或專業協助。這篇短文只提供一般知識與溫和提醒，不是對個人狀況的診斷。']
};
Object.assign(articleBodies, window.shortArticleBodies || {});

const defaultLongArticles = [
  {
    title: '當身體一直處在警覺裡：理解創傷反應與復原的入口',
    category: '身心健康',
    language: '繁體中文',
    art: 'heart',
    description: '從睡眠、情緒、身體感受與人際互動，認識壓力事件之後可能出現的反應；不替你診斷，只提供一張更安全的觀察地圖。',
    note: '本站原創整理｜非醫療診斷、非治療建議',
    sources: [
      { label: 'WHO｜Doing What Matters in Times of Stress', url: 'https://www.who.int/publications/i/item/9789240003927', rights: 'CC BY-NC-SA 3.0 IGO；本站未複製原文' },
      { label: 'NHS｜PTSD（post-traumatic stress disorder）', url: 'https://www.nhs.uk/mental-health/conditions/ptsd-post-traumatic-stress-disorder/', rights: 'NHS Crown Copyright；本站未複製原文' },
      { label: 'SAMHSA｜Trauma-Informed Approaches and Programs', url: 'https://www.samhsa.gov/mental-health/trauma-violence/trauma-informed-approaches-programs', rights: '美國政府公開資訊；本站自行整理' },
      { label: 'CDC｜Managing Stress', url: 'https://www.cdc.gov/mental-health/living-with/index.html', rights: '美國政府公開資訊；本站自行整理' }
    ],
    sections: [
      { heading: '先說在前面：察覺不是替自己下診斷', text: '「創傷」在日常語言裡常被用得很廣，但每個人的反應、時間與需要都不一樣。看到某個症狀，不代表你就患有 PTSD，也不代表你必須用某個標籤解釋自己。這篇文章的用途，是幫你把模糊的不舒服分成幾個可以觀察的方向；如果它持續影響生活，請把這些觀察帶給醫師或心理健康專業人員。' },
      { heading: '身體可能先替你發出訊號', text: '在很大的壓力或驚嚇之後，有些人會睡不好、容易被聲音嚇到、心跳加快、肌肉緊繃、胃口改變，或反覆出現頭痛與腸胃不適。這些感受也可能有其他身體原因，因此不要只靠網路文章判斷。比較有幫助的問題是：「它何時出現？持續多久？什麼情境會讓它變強或稍微緩和？」' },
      { heading: '情緒與注意力的變化，也值得被看見', text: '你可能變得很警覺、很容易生氣或害怕，也可能感覺麻木、與自己或周遭的人有距離。有人會反覆想起某個事件、做惡夢，或刻意避開會勾起記憶的地方與話題。這些都不是意志力不夠，而可能是身體在嘗試保護自己；但如果它讓你無法工作、上學、睡覺或維持關係，就值得尋求專業評估。' },
      { heading: '用「安全感」而不是逼迫自己恢復', text: '復原不等於把自己逼回事件以前的樣子。今天能做的第一步，可能是讓環境更可預期：固定吃飯與睡覺時間、減少讓自己過度刺激的資訊、找一位可信任的人知道你的狀態，或用簡短筆記記下觸發你的聲音、氣味與場景。若呼吸練習、散步或接觸自然對你有幫助，可以把它當成支持，不必當作必須完成的功課。' },
      { heading: '陪伴別人時，先把選擇權還給對方', text: '如果身邊的人正在經歷創傷反應，最有用的話不一定是「你要想開一點」。可以先問：「你希望我陪你坐著，還是幫你找資源？」尊重對方暫時不說細節的權利，不追問、不強迫回想，也不把自己的經驗套上去。安全、信任、合作與選擇感，是創傷知情照護常反覆提醒的核心。' },
      { heading: '什麼時候應該找專業或緊急支持？', text: '如果反應持續、越來越嚴重，或已影響睡眠、工作、學習、關係與日常安全，可以預約家庭醫師、身心科／精神科、臨床心理師或當地心理支持服務。若你有傷害自己或他人的念頭、無法維持基本安全，請立即聯絡當地緊急服務、危機專線，或請身邊可信任的人陪你就近求助。這不是把事情想得太嚴重，而是先把安全放在前面。' },
      { heading: '最後，留一個不急著解釋完的空間', text: '理解身體與心理的反應，可以讓我們少一點責怪自己，但理解不必變成新的壓力。你可以一次只記住一件事：反應是訊號，不是身分；求助是選擇，不是失敗；復原可以有不同速度，也可以在支持中慢慢發生。' }
    ]
  }
];
const longArticles = window.longArticlesData || defaultLongArticles;
const mediaItems = window.mediaData || [];
let currentMediaIndex = -1;

function pickMedia() {
  if (!mediaItems.length) return null;
  let next = Math.floor(Math.random() * mediaItems.length);
  if (mediaItems.length > 1 && next === currentMediaIndex) next = (next + 1) % mediaItems.length;
  currentMediaIndex = next;
  return mediaItems[next];
}

function renderMedia(item = pickMedia()) {
  if (!item || !$('#mediaImage')) return;
  $('#mediaImage').src = item.file;
  $('#mediaImage').alt = item.alt;
  $('#mediaTitle').textContent = item.title;
  $('#mediaCredit').innerHTML = `${item.credit} · <a href="${item.sourceUrl}" target="_blank" rel="noreferrer">${item.source}</a> · ${item.license}`;
}

function renderMediaGallery() {
  if (!$('#mediaGallery')) return;
  $('#mediaGallery').innerHTML = mediaItems.map((item, index) => `<button class="media-thumb" type="button" data-media-index="${index}" aria-label="查看 ${item.title}"><img src="${item.file}" alt="" loading="lazy" /><span>${item.title}</span></button>`).join('');
}

function mediaMarkup(item = pickMedia()) {
  if (!item) return '';
  return `<figure class="reader-media"><img src="${item.file}" alt="${item.alt}" /><figcaption>${item.title} · ${item.credit} · <a href="${item.sourceUrl}" target="_blank" rel="noreferrer">來源與授權</a></figcaption></figure>`;
}

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
const storedProgress = Number(localStorage.getItem(dailyProgressKey) || 0);
const state = { revealed: Number.isFinite(storedProgress) ? Math.min(dailyCards.length, Math.max(0, storedProgress)) : 0, filter: '全部', query: '' };
const openingScenes = ['dawn', 'tide', 'garden', 'star'];
const openingScene = openingScenes[Math.floor(Math.random() * openingScenes.length)];
const dailyLine = companionLines[todayOrdinal % companionLines.length] || companionLines[0];
const openingCandidates = companionLines.filter((_, index) => index !== todayOrdinal % companionLines.length);
let lastOpeningLine = null;
function pickOpeningLine() {
  if (!openingCandidates.length) return dailyLine;
  const choices = openingCandidates.filter(line => line !== lastOpeningLine);
  const line = choices[Math.floor(Math.random() * choices.length)];
  lastOpeningLine = line;
  return line;
}
const visitExperience = dailyExperiences.length
  ? dailyExperiences[Math.floor(Math.random() * dailyExperiences.length)]
  : dailyExperiences[0];

function cardStorageKey(card) {
  return `xinli-saved-card-${encodeURIComponent(`${card.text}|${card.source}`)}`;
}

function isCardSaved(card, index) {
  return localStorage.getItem(cardStorageKey(card)) === 'yes'
    || localStorage.getItem(`xinli-saved-card-${index}`) === 'yes';
}

function showWelcome() {
  const line = pickOpeningLine();
  const separator = line.title.indexOf('，');
  const titleMarkup = separator > -1
    ? `${line.title.slice(0, separator)}，<br /><em>${line.title.slice(separator + 1)}</em>`
    : `<em>${line.title}</em>`;
  $('#welcomeModal').dataset.scene = openingScene;
  $('#welcomeTitle').innerHTML = titleMarkup;
  $('#welcomeText').textContent = line.text;
  $('#welcomeModal').hidden = false;
  document.body.classList.add('modal-open');
  setTimeout(() => $('#enterToday').focus(), 40);
}
function closeWelcome() {
  $('#welcomeModal').hidden = true;
  document.body.classList.remove('modal-open');
}

function cardMarkup(card, index, revealed) {
  const saved = isCardSaved(card, index);
  return `<article class="card-slot ${revealed ? 'revealed' : ''}" data-card-index="${index}">
    <div class="card-inner">
      <div class="card-face card-back" aria-label="第 ${index + 1} 張尚未翻開的小卡">
        <div class="card-back-top"><span>今日一息</span><span>0${index + 1}</span></div>
        <span class="card-back-mark" aria-hidden="true"></span>
        <div class="card-back-bottom"><span>留一點空間</span><span>✦</span></div>
      </div>
      <div class="card-face card-front">
        <span class="card-type">${card.type}</span>
        <span class="card-art card-art-${card.art}" aria-hidden="true"></span>
        <blockquote>「${card.text}」</blockquote>
        <div class="card-source"><strong>${card.sourceLink ? `<a href="${card.sourceLink}" target="_blank" rel="noreferrer">${card.source}</a>` : card.source}</strong></div>
        <span class="card-tag">${card.tag}</span>
        <div class="card-actions"><button type="button" class="card-action" data-card-action="save" aria-label="${saved ? '取消收藏' : '收藏這張卡'}">${saved ? '♥ 已收藏' : '♡ 收藏'}</button><button type="button" class="card-action" data-card-action="share" aria-label="分享這張卡">分享 ↗</button></div>
      </div>
    </div>
  </article>`;
}

function renderCards() {
  $('#cardsGrid').innerHTML = dailyCards.map((card, index) => cardMarkup(card, index, index < state.revealed)).join('');
  $('#progressText').textContent = `${state.revealed} / ${dailyCards.length}`;
  $('#progressBar').style.width = `${state.revealed / dailyCards.length * 100}%`;
  const button = $('#drawButton');
  const hint = $('#drawHint');
  if (state.revealed >= dailyCards.length) {
    button.disabled = true;
    button.innerHTML = '<span>今天五張都收到了</span><b>✓</b>';
    hint.textContent = '今天的五張已完成；明天再回來，會為這台裝置換一組新的小卡。';
  } else {
    button.disabled = false;
    button.innerHTML = `<span>抽第 ${state.revealed + 1} 張</span><b>→</b>`;
    hint.textContent = state.revealed === 0 ? '這台裝置今天會抽到一組隨機五張；同一天不會更換。' : '不用猜會抽到什麼，讓這句話陪你停留一下。';
  }
}
function drawCard() {
  if (state.revealed >= dailyCards.length) return;
  state.revealed += 1;
  localStorage.setItem(dailyProgressKey, String(state.revealed));
  renderCards();
  const drawPanel = $('#drawPanel');
  drawPanel.classList.remove('draw-bloom');
  void drawPanel.offsetWidth;
  drawPanel.classList.add('draw-bloom');
  const slot = $(`.card-slot[data-card-index="${state.revealed - 1}"]`);
  requestAnimationFrame(() => slot.classList.add('revealed'));
  slot.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });
}

function categoryList() {
  return ['全部', ...new Set(articles.map(article => article.category))];
}
function renderFilters() {
  $('#filterPills').innerHTML = categoryList().map(category => `<button type="button" class="filter-pill ${state.filter === category ? 'active' : ''}" data-category="${category}">${category}</button>`).join('');
}
function renderArticles() {
  const q = state.query.trim().toLowerCase();
  const visible = articles.filter(article => {
    const matchesFilter = state.filter === '全部' || article.category === state.filter;
    const haystack = `${article.title} ${article.category} ${article.language} ${article.source} ${article.description}`.toLowerCase();
    return matchesFilter && (!q || haystack.includes(q));
  });
  $('#articleGrid').innerHTML = visible.map(article => `<article class="article-card">
    <span class="article-art article-art-${article.art}" aria-hidden="true"></span>
    <div class="article-meta"><span>${article.category}</span><span>${article.language}</span></div>
    <h2>${article.title}</h2>
    <p>${article.description}</p>
    <div class="article-card-footer"><span>本站站內短文<br />參考：${article.source}<br />${article.rights}</span><button class="article-link read-article" type="button" data-article-title="${article.title}">在本站閱讀 ↗</button></div>
  </article>`).join('');
  $('#emptyState').hidden = visible.length !== 0;
}

function renderLongArticles() {
  $('#longArticleGrid').innerHTML = longArticles.map(article => `<article class="long-article-card">
    <span class="article-art article-art-${article.art}" aria-hidden="true"></span>
    <p class="long-article-label">${article.category} · ${article.language}</p>
    <h3>${article.title}</h3>
    <p>${article.description}</p>
    <div class="long-article-footer"><span>${article.sources.length} 個可查證來源<br />${article.note}</span><button class="article-link read-long-article" type="button" data-long-article-title="${article.title}">開始閱讀 →</button></div>
  </article>`).join('');
}

function renderMood() {
  const chosen = localStorage.getItem(`xinli-mood-${todayKey}`) || '';
  $$('.mood-choice').forEach(button => {
    const active = button.dataset.mood === chosen;
    button.classList.toggle('active', active);
    button.setAttribute('aria-pressed', String(active));
  });
  const actions = {
    '平靜': { reply: '收到，今天先陪你守住這一小片平靜。', label: '一起慢慢呼吸三次', icon: '◌', action: 'breathe' },
    '有點累': { reply: '辛苦了，不必把自己撐成沒事的樣子。', label: '給我一個擁抱', icon: '♡', action: 'hug' },
    '想專注': { reply: '好，我們先只陪一件小事走一段。', label: '開啟 30 秒專注', icon: '✦', action: 'focus' },
    '需要鼓勵': { reply: '你不用先證明自己值得，現在就值得被鼓勵。', label: '給我一句鼓勵', icon: '☼', action: 'encourage' },
    '只是路過': { reply: '路過也很好，願你帶走一點不急著完成的空間。', label: '留下一顆小星星', icon: '✧', action: 'star' }
  };
  const mood = actions[chosen];
  $('#moodReply').textContent = mood ? mood.reply : '不需要解釋太多，選一個最接近現在的感覺就好。';
  $('#moodAction').innerHTML = mood ? `<button type="button" class="mood-action" data-mood-action="${mood.action}"><span>${mood.icon}</span>${mood.label}</button><p id="moodActionNote">按一下，讓這份陪伴真的動起來。</p>` : '';
}

function openArticle(title) {
  const article = articles.find(item => item.title === title);
  if (!article) return;
  $('#articleReaderArt').className = `article-reader-art article-art-${article.art}`;
  $('#articleReaderMeta').textContent = `${article.category} · ${article.language} · 站內短文`;
  $('#articleReaderTitle').textContent = article.title;
  $('#articleReaderBody').innerHTML = mediaMarkup() + (articleBodies[title] || [article.description]).map(paragraph => `<p>${paragraph}</p>`).join('');
  $('#articleReaderSource').textContent = `本文由「今日一息」重新撰寫；主題參考：${article.source}。${article.rights}。本站內容為日常閱讀，非醫療診斷或治療建議。`;
  $('#articleReader').hidden = false;
  document.body.classList.add('modal-open');
  setTimeout(() => $('#articleReaderClose').focus(), 40);
}

function openLongArticle(title) {
  const article = longArticles.find(item => item.title === title);
  if (!article) return;
  $('#articleReaderArt').className = `article-reader-art article-art-${article.art}`;
  $('#articleReaderMeta').textContent = `${article.category} · ${article.language} · 長篇原創整理`;
  $('#articleReaderTitle').textContent = article.title;
  $('#articleReaderBody').innerHTML = mediaMarkup() + article.sections.map(section => `<section class="long-reader-section"><h3>${section.heading}</h3><p>${section.text}</p></section>`).join('');
  $('#articleReaderSource').innerHTML = `<strong>${article.note}</strong><br />內容由「今日一息」自行撰寫與整理，未複製下列來源全文。資料來源：${article.sources.map(source => `<a href="${source.url}" target="_blank" rel="noreferrer">${source.label}</a>（${source.rights}）`).join('；')}`;
  $('#articleReader').hidden = false;
  document.body.classList.add('modal-open');
  setTimeout(() => $('#articleReaderClose').focus(), 40);
}

function closeArticle() {
  $('#articleReader').hidden = true;
  document.body.classList.remove('modal-open');
}

function runMoodAction(action) {
  const actionNotes = {
    breathe: '吸氣 1 · 吐氣 1　—　再來兩次，讓身體知道你在這裡。',
    hug: '把手臂交叉抱住自己，停留三個呼吸。你不需要獨自撐住全部。',
    focus: '30 秒只做一件事。完成後，你可以再決定下一步。',
    encourage: '你已經在照顧自己了，這本身就是一件值得肯定的事。',
    star: '✦ 已替今天留下一顆小星星，謝謝你來過。'
  };
  $('#moodAction').classList.remove('action-breathe', 'action-hug', 'action-focus', 'action-encourage', 'action-star', 'mood-reveal');
  void $('#moodAction').offsetWidth;
  $('#moodAction').classList.add(`action-${action}`, 'mood-reveal');
  $('#moodActionNote').textContent = actionNotes[action];
}

function showMoodBurst(action) {
  const burst = $('#moodBurst');
  const messages = {
    breathe: ['◌', '跟著光圈呼吸', '吸氣，吐氣，讓身體知道此刻是安全的。'],
    hug: ['🫂', '抱抱你', '把手臂交叉抱住自己，你不用獨自撐住全部。'],
    focus: ['✺', '一件小事就好', '能把注意力帶回來，已經是一種力量。'],
    encourage: ['☼', '你已經做得很好', '不必先證明自己值得，現在就值得被鼓勵。'],
    star: ['✦', '星星收到你了', '路過也很好，謝謝你把這一刻留給自己。']
  };
  const message = messages[action] || messages.star;
  $('#moodBurstIcon').textContent = message[0];
  $('#moodBurstTitle').textContent = message[1];
  $('#moodBurstText').textContent = message[2];
  burst.hidden = false;
  burst.classList.remove('burst-in');
  void burst.offsetWidth;
  burst.classList.add('burst-in', `burst-${action}`);
  clearTimeout(window.moodBurstTimer);
  window.moodBurstTimer = setTimeout(() => { burst.hidden = true; }, 2300);
}

function renderExperience(type = 'rest') {
  const item = visitExperience && (visitExperience[type] || visitExperience.rest);
  if (!item) return;
  let content;
  if (type === 'rest') {
    content = `<div class="explore-rest"><span class="explore-doodle">☾</span><div><p class="explore-kicker">A QUIET MINUTE</p><h3>${item.title}</h3><p>${item.text}</p><button class="soft-action" type="button" data-rest-action="pause">${item.action}</button><span class="rest-note" id="restNote">${item.note}</span></div></div>`;
  } else {
    const options = type === 'know' ? item.options : item.angles;
    const attr = type === 'know' ? 'data-branch' : 'data-topic';
    const resultId = type === 'know' ? 'branchResult' : 'topicResult';
    content = `<div class="explore-question"><p class="explore-kicker">${type === 'know' ? 'A DAILY QUESTION' : 'FOLLOW YOUR CURIOSITY'}</p><h3>${item.question}</h3><p>${type === 'know' ? '沒有正確答案。選一個比較接近你的入口，再看看它可能帶來的感受與下一步。' : '先選一個想看的角度。這裡不急著給結論，只提供一扇可以繼續想的門。'}</p><div class="branch-options ${type === 'why' ? 'topic-options' : ''}">${options.map((option, index) => `<button type="button" ${attr}="${type === 'know' ? ['wait','ask','blame'][index] : ['bias','group','protect'][index]}">${option[0]}</button>`).join('')}</div><div class="branch-result" id="${resultId}" hidden></div></div>`;
    if (type === 'know') window.dailyBranchResults = Object.fromEntries(item.options.map((option, index) => [['wait','ask','blame'][index], option[1]]));
    if (type === 'why') window.dailyTopicResults = Object.fromEntries(item.angles.map((option, index) => [['bias','group','protect'][index], option[1]]));
  }
  $('#exploreContent').innerHTML = content;
  $$('.experience-tab').forEach(tab => { const active = tab.dataset.experience === type; tab.classList.toggle('active', active); tab.setAttribute('aria-selected', String(active)); });
}
function renderBranchResult(branch) {
  const results = window.dailyBranchResults || {};
  const result = $('#branchResult');
  result.textContent = results[branch];
  result.hidden = false;
}

function renderTopicResult(topic) {
  const results = window.dailyTopicResults || {};
  const result = $('#topicResult');
  result.textContent = results[topic];
  result.hidden = false;
}

async function shareCard(index) {
  const card = dailyCards[index];
  const shareText = `今日一息｜${card.text}（${card.source}）`;
  if (navigator.share) {
    await navigator.share({ title: '今日一息｜每日療癒小卡', text: shareText });
  } else if (navigator.clipboard) {
    await navigator.clipboard.writeText(shareText);
    $('#drawHint').textContent = '這張小卡已複製，可以分享給需要一點光的人。';
  }
}

let curiosityFilter = '全部';
let currentDrawer = null;

function renderCuriosityFilters() {
  const categories = ['全部', ...new Set((window.curiosityData || []).map(item => item.category))];
  $('#curiosityFilters').innerHTML = categories.map(category => `<button type="button" class="drawer-filter ${category === curiosityFilter ? 'active' : ''}" data-drawer-category="${category}">${category}</button>`).join('');
}

function renderDrawers() {
  const items = (window.curiosityData || []).filter(item => curiosityFilter === '全部' || item.category === curiosityFilter);
  $('#drawerRoom').innerHTML = items.map((item, index) => `<button class="drawer-card drawer-size-${(index % 3) + 1}" type="button" data-drawer-id="${item.id}"><span class="drawer-handle"></span><small>${item.category}</small><strong>${item.question}</strong><i>${localStorage.getItem(`xinli-drawer-${item.id}`) === 'yes' ? '已探索' : '拉開抽屜'}</i></button>`).join('');
}

function openDrawer(id) {
  const item = (window.curiosityData || []).find(entry => entry.id === id);
  if (!item) return;
  currentDrawer = item;
  const relatedItems = (window.curiosityData || []).filter(entry => entry.id !== item.id).sort((a, b) => (a.category === item.category ? -1 : 1) - (b.category === item.category ? -1 : 1)).slice(0, 3);
  localStorage.setItem(`xinli-drawer-${id}`, 'yes');
  $('#drawerReader').hidden = false;
  $('#drawerReader').innerHTML = `<div class="drawer-reader-head"><span>${item.category}</span><button type="button" id="closeDrawer">收回抽屜 ×</button></div><h2>${item.question}</h2><p class="drawer-answer">${item.answer}</p><div class="perspective-tabs">${Object.keys(item.perspectives).map((key, index) => `<button type="button" class="perspective-tab ${index === 0 ? 'active' : ''}" data-perspective="${key}">${key}</button>`).join('')}</div><div class="perspective-content" id="perspectiveContent">${Object.values(item.perspectives)[0]}</div><div class="drawer-related"><small>沿著好奇心繼續｜每一格都可以再打開</small>${relatedItems.map(next => `<button type="button" data-related-id="${next.id}">${next.question} →</button>`).join('')}</div><p class="drawer-source">參考來源：<a href="${item.sourceUrl}" target="_blank" rel="noreferrer">${item.sourceLabel}</a>。本文為本站自行整理，不把來源文章全文搬入。</p>`;
  $('#drawerReader').scrollIntoView({ behavior: 'smooth', block: 'start' });
  renderDrawers();
}

function setupPalette() {
  const canvas = $('#paletteCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d', { alpha: false });
  const wrap = $('#paletteCanvasWrap');
  const swatches = [
    ['珊瑚', '#e98272'], ['磚紅', '#b9574b'], ['玫瑰', '#d47b92'], ['杏橘', '#e9a26e'], ['琥珀', '#d99539'], ['向日黃', '#e6c65c'],
    ['天空藍', '#7cb9d5'], ['深藍', '#385a86'], ['靛藍', '#59639d'], ['青綠', '#58a9a0'], ['湖水綠', '#70c6b7'], ['薄荷', '#a7d5bd'],
    ['薰衣草', '#a99acb'], ['淡紫', '#c5add0'], ['灰粉', '#c99da7'], ['鼠尾草', '#9caf9a'], ['奶油', '#f1dfad'], ['沙色', '#c9a77b'],
    ['深灰', '#4d5960'], ['墨色', '#25313b'], ['灰藍', '#72899b'], ['灰綠', '#647b72'], ['咖啡', '#876654'], ['米白', '#efe9d8'],
    ['海松', '#3e7e78'], ['莓果', '#9c4f6d'], ['月光', '#d5d9e3'], ['森林', '#466a52']
  ];
  const emotions = [
    { label: '平靜', symbol: '—', color: '#7cb9d5', bg1: '#e8f2f0', bg2: '#b8d7d7', glow: '#f2dca4', texture: 'water' },
    { label: '期待', symbol: '◇', color: '#d99539', bg1: '#f6ead1', bg2: '#e2b66d', glow: '#fff2ba', texture: 'rays' },
    { label: '疲倦', symbol: '◐', color: '#59639d', bg1: '#e7e7ee', bg2: '#b1b5cc', glow: '#f4d8c4', texture: 'soft' },
    { label: '好奇', symbol: '·', color: '#a99acb', bg1: '#eeeaf4', bg2: '#cfb9d6', glow: '#f8e7c5', texture: 'speckle' },
    { label: '希望', symbol: '↑', color: '#d7ab57', bg1: '#f6f0d9', bg2: '#d8c77b', glow: '#fff6c5', texture: 'rays' },
    { label: '混合', symbol: '∿', color: '#e98272', bg1: '#f7e8df', bg2: '#d8b4af', glow: '#f6d594', texture: 'ribbons' },
    { label: '安心', symbol: '⌂', color: '#9caf9a', bg1: '#e7eee3', bg2: '#b7c8ae', glow: '#f2e2bb', texture: 'leaf' },
    { label: '想念', symbol: '○', color: '#d47b92', bg1: '#f4e7e8', bg2: '#d7b2bf', glow: '#f8d4b0', texture: 'rings' },
    { label: '專注', symbol: '+', color: '#72899b', bg1: '#e8eef0', bg2: '#b7c7ce', glow: '#f6dfad', texture: 'lines' },
    { label: '新鮮', symbol: '✳', color: '#a7c46f', bg1: '#eef1df', bg2: '#c5d491', glow: '#fff2bf', texture: 'sprout' },
    { label: '勇氣', symbol: '△', color: '#e9a26e', bg1: '#f8eadb', bg2: '#dba886', glow: '#ffe2ab', texture: 'rays' },
    { label: '放空', symbol: '…', color: '#c5add0', bg1: '#efecf2', bg2: '#c8c2d8', glow: '#eee6c7', texture: 'mist' }
  ];
  const materials = [['水', 'water'], ['霧', 'mist'], ['墨', 'ink'], ['沙', 'sand'], ['玻璃', 'glass'], ['雨', 'rain'], ['光', 'light']];
  const forces = [['風吹', 'wind'], ['漂浮', 'float'], ['下沉', 'sink'], ['聚集', 'gather'], ['擴散', 'spread'], ['旋轉', 'rotate'], ['全部停住', 'still']];
  const layers = [['前景', 'front'], ['中景', 'middle'], ['背景', 'back']];
  const transforms = [['原始作品', 'none'], ['海洋', 'ocean'], ['山景', 'mountain'], ['花園', 'garden'], ['夜空', 'night'], ['島', 'island'], ['天氣', 'weather'], ['抽象地形', 'terrain']];
  const shapes = [
    ['光球', 'orb'], ['波紋', 'ring'], ['星芒', 'star'], ['葉片', 'leaf'], ['三角', 'triangle'], ['花瓣', 'petal'],
    ['月牙', 'moon'], ['雲朵', 'cloud'], ['菱形', 'diamond'], ['小雨', 'drop'], ['海浪', 'wave'], ['山脊', 'mountain'],
    ['花朵', 'flower'], ['草地', 'grass'], ['樹木', 'tree']
  ];
  const effects = [
    ['柔和水彩', 'watercolor'], ['筆痕畫筆', 'brush'], ['細線筆', 'line'], ['柔霧筆', 'softmist'],
    ['柔光', 'glow'], ['粒子', 'particle'], ['符號', 'symbol'], ['暈染', 'wash']
  ];
  const objectCatalog = [
    { type: 'sofa', label: '沙發', note: '布料坐墊與扶手' },
    { type: 'bed', label: '床', note: '床架、枕頭與被子' },
    { type: 'chair', label: '椅子', note: '椅背、座面與木腳' },
    { type: 'cup', label: '咖啡杯', note: '杯耳、杯碟與蒸氣' },
    { type: 'bicycle', label: '腳踏車', note: '輪胎、車架與座椅' },
    { type: 'desk', label: '書桌', note: '桌面、抽屜與桌腳' },
    { type: 'piano', label: '鋼琴', note: '琴身、鍵盤與琴譜架' },
    { type: 'easel', label: '畫架', note: '木架、畫布與顏料痕跡' },
    { type: 'carpet', label: '地毯', note: '織紋、邊緣與柔和圖樣' },
    { type: 'house', label: '房子', note: '屋頂、窗戶與門' },
    { type: 'book', label: '書本', note: '封面、書頁與書籤' },
    { type: 'lamp', label: '檯燈', note: '燈罩、支架與底座' },
    { type: 'plant', label: '盆栽', note: '枝葉與陶盆' }
  ];
  const objectSizes = {
    sofa: [210, 126], bed: [250, 155], chair: [112, 156], cup: [78, 98], bicycle: [230, 142], desk: [236, 144],
    piano: [260, 170], easel: [150, 220], carpet: [260, 122], house: [210, 190], book: [106, 142], lamp: [116, 184], plant: [116, 184]
  };
  let activeColor = swatches[0][1];
  let activeEmotion = emotions[0];
  let activeShape = 'orb';
  let activeEffect = 'brush';
  let activeMaterial = 'light';
  let activeForce = 'still';
  let activeLayer = 'middle';
  let sceneMode = 'none';
  let paused = false;
  let motionStopped = true;
  let intensity = .78;
  let speed = .8;
  let points = [];
  let objects = [];
  let selectedObjectId = null;
  let draggingObject = null;
  let objectId = 0;
  let sceneMarks = [];
  let sceneSnapshot = null;
  let sceneSize = { w: 0, h: 0 };
  let lastWidth = 0;
  let lastHeight = 0;
  let activePointer = null;
  const cssColor = (hex, alpha = 1) => {
    const value = hex.replace('#', '');
    const n = parseInt(value.length === 3 ? value.split('').map(x => x + x).join('') : value, 16);
    return `rgba(${n >> 16}, ${(n >> 8) & 255}, ${n & 255}, ${alpha})`;
  };
  const hexRgb = hex => {
    const value = hex.replace('#', '');
    return { r: parseInt(value.slice(0, 2), 16), g: parseInt(value.slice(2, 4), 16), b: parseInt(value.slice(4, 6), 16) };
  };
  const mixHex = (hex, other, amount) => {
    const a = hexRgb(hex); const b = hexRgb(other);
    return `rgb(${Math.round(a.r + (b.r - a.r) * amount)}, ${Math.round(a.g + (b.g - a.g) * amount)}, ${Math.round(a.b + (b.b - a.b) * amount)})`;
  };
  const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
  const refresh = () => { if (paused) draw(performance.now()); };
  const setStatus = text => {
    $('#paletteStatus').textContent = text;
    const swatch = swatches.find(item => item[1] === activeColor);
    $('#paletteCurrentLabel').textContent = swatch?.[0] || activeEmotion.label;
    $('#paletteCurrentDot').style.background = activeColor;
    wrap.dataset.material = activeMaterial;
    wrap.dataset.force = activeForce;
    wrap.dataset.layer = activeLayer;
    wrap.dataset.transform = sceneMode;
    wrap.dataset.emotion = activeEmotion.label;
  };
  const syncExisting = (key, value) => points.forEach(point => { point[key] = value; });
  const paintButtons = (selector, items, attr, active) => {
    const target = $(selector);
    if (!target) return;
    target.innerHTML = items.map(item => `<button type="button" data-${attr}="${item[1]}" class="${item[1] === active ? 'active' : ''}">${item[0]}</button>`).join('');
  };
  const rand = (seed) => {
    let value = Math.sin(seed * 12.9898 + 78.233) * 43758.5453;
    return value - Math.floor(value);
  };
  const resetSceneMarks = () => { sceneMarks = []; sceneSize = { w: 0, h: 0 }; };
  const ensureSceneMarks = (w, h) => {
    if (sceneMarks.length && sceneSize.w === w && sceneSize.h === h) return;
    sceneSize = { w, h };
    const count = sceneMode === 'night' ? 58 : sceneMode === 'garden' ? 34 : 20;
    sceneMarks = Array.from({ length: count }, (_, index) => ({
      x: rand(index + sceneMode.length * 7) * w,
      y: rand(index * 3.1 + sceneMode.length) * h,
      r: 1.5 + rand(index * 5.2 + 4) * 4.5,
      phase: rand(index * 2.4 + 9) * Math.PI * 2,
      hue: swatches[index % swatches.length][1]
    }));
  };
  const resize = () => {
    const ratio = Math.min(2, window.devicePixelRatio || 1);
    const box = canvas.getBoundingClientRect();
    const w = Math.max(1, Math.round(box.width));
    const h = Math.max(1, Math.round(box.height));
    if (lastWidth && lastHeight) {
      points.forEach(point => { point.x *= w / lastWidth; point.y *= h / lastHeight; point.px *= w / lastWidth; point.py *= h / lastHeight; });
      objects.forEach(object => { object.x *= w / lastWidth; object.y *= h / lastHeight; });
    }
    lastWidth = w; lastHeight = h;
    canvas.width = Math.round(w * ratio);
    canvas.height = Math.round(h * ratio);
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    resetSceneMarks();
    refresh();
  };
  const brushRadius = () => {
    if (activeEffect === 'line') return 2.4 + Math.random() * 2;
    if (activeEffect === 'softmist') return 18 + Math.random() * 20;
    if (activeEffect === 'watercolor') return 13 + Math.random() * 18;
    if (activeEffect === 'brush') return 7 + Math.random() * 12;
    return 10 + Math.random() * 19;
  };
  const drawStroke = (point, color, alpha) => {
    const distance = Math.hypot(point.x - point.px, point.y - point.py);
    const width = point.r * (point.effect === 'line' ? .22 : point.effect === 'watercolor' ? 1.25 : point.effect === 'softmist' ? 1.6 : .8);
    ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.strokeStyle = color; ctx.lineWidth = Math.max(1.2, width); ctx.globalAlpha = alpha * (point.effect === 'watercolor' ? .34 : point.effect === 'softmist' ? .22 : .88);
    ctx.beginPath(); ctx.moveTo(point.px, point.py); ctx.quadraticCurveTo((point.px + point.x) / 2, (point.py + point.y) / 2 - point.r * .16, point.x, point.y); ctx.stroke();
    if (point.material === 'water') { ctx.globalAlpha = alpha * .42; ctx.strokeStyle = cssColor(point.color, 1); ctx.lineWidth = Math.max(1, width * .22); ctx.beginPath(); ctx.moveTo(point.px, point.py + point.r * .24); ctx.quadraticCurveTo((point.px + point.x) / 2, (point.py + point.y) / 2 - point.r * .2, point.x, point.y + point.r * .24); ctx.stroke(); }
    else if (point.material === 'ink') { ctx.globalAlpha = alpha * .8; ctx.strokeStyle = mixHex(point.color, '#172b36', .45); ctx.lineWidth = Math.max(1.5, width * .3); ctx.beginPath(); ctx.moveTo(point.px - 1, point.py + 1); ctx.lineTo(point.x - 1, point.y + 1); ctx.stroke(); }
    else if (point.material === 'sand') { ctx.fillStyle = cssColor(point.color, 1); ctx.globalAlpha = alpha * .58; for (let n = 0; n < 5; n++) { const t = n / 5; ctx.beginPath(); ctx.arc(point.px + (point.x - point.px) * t + Math.sin(n * 9) * point.r * .35, point.py + (point.y - point.py) * t + Math.cos(n * 7) * point.r * .35, 1 + n * .35, 0, Math.PI * 2); ctx.fill(); } }
    else if (point.material === 'glass') { ctx.globalAlpha = alpha * .44; ctx.strokeStyle = '#f7fbf2'; ctx.lineWidth = Math.max(1, width * .18); ctx.beginPath(); ctx.moveTo(point.px - point.r * .16, point.py - point.r * .16); ctx.lineTo(point.x - point.r * .16, point.y - point.r * .16); ctx.stroke(); }
    else if (point.material === 'rain') { ctx.globalAlpha = alpha * .52; ctx.strokeStyle = '#d9eef0'; ctx.lineWidth = Math.max(1, width * .16); ctx.beginPath(); ctx.moveTo(point.px - point.r * .5, point.py - point.r * .65); ctx.lineTo(point.x - point.r * .5, point.y - point.r * .65); ctx.stroke(); }
    else if (point.material === 'light') { ctx.shadowColor = point.color; ctx.shadowBlur = Math.min(18, point.r * .55); ctx.globalAlpha = alpha * .35; ctx.fillStyle = point.color; ctx.beginPath(); ctx.arc(point.x, point.y, Math.max(2, point.r * .16), 0, Math.PI * 2); ctx.fill(); ctx.shadowBlur = 0; }
    if (point.effect === 'watercolor') { ctx.globalAlpha = alpha * .14; ctx.lineWidth = width * 1.8; ctx.beginPath(); ctx.moveTo(point.px + 2, point.py - 2); ctx.lineTo(point.x + 2, point.y - 2); ctx.stroke(); }
    else if (point.effect === 'brush') { ctx.globalAlpha = alpha * .32; ctx.lineWidth = Math.max(1, width * .23); ctx.beginPath(); ctx.moveTo(point.px - 2, point.py + 2); ctx.lineTo(point.x - 2, point.y + 2); ctx.stroke(); }
    else if (point.effect === 'softmist') { const gradient = ctx.createRadialGradient(point.x, point.y, 0, point.x, point.y, point.r * 2.5); gradient.addColorStop(0, cssColor(point.color, .2)); gradient.addColorStop(1, cssColor(point.color, 0)); ctx.fillStyle = gradient; ctx.globalAlpha = alpha; ctx.beginPath(); ctx.arc(point.x, point.y, point.r * 2.5, 0, Math.PI * 2); ctx.fill(); }
  };
  const drawShape = (point, color, alpha) => {
    const { x, y, r } = point;
    ctx.strokeStyle = color; ctx.fillStyle = color; ctx.globalAlpha = alpha; ctx.lineWidth = Math.max(1.4, r / 10); ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    if (point.shape === 'wave') { for (let row = -1; row <= 1; row++) { ctx.beginPath(); ctx.moveTo(x - r * 2, y + row * r * .5); ctx.quadraticCurveTo(x - r, y - r * .55 + row * r * .5, x, y + row * r * .5); ctx.quadraticCurveTo(x + r, y + r * .55 + row * r * .5, x + r * 2, y + row * r * .5); ctx.stroke(); } return; }
    if (point.shape === 'mountain') { ctx.beginPath(); ctx.moveTo(x - r * 2.4, y + r); ctx.lineTo(x - r * .7, y - r * .9); ctx.lineTo(x - r * .08, y - r * .25); ctx.lineTo(x + r * .7, y - r * 1.35); ctx.lineTo(x + r * 2.4, y + r); ctx.closePath(); ctx.globalAlpha = alpha * .46; ctx.fill(); ctx.globalAlpha = alpha; ctx.stroke(); return; }
    if (point.shape === 'cloud') { ctx.beginPath(); ctx.arc(x - r * .7, y, r * .65, Math.PI, 0); ctx.arc(x, y - r * .35, r * .9, Math.PI, 0); ctx.arc(x + r * .72, y, r * .58, Math.PI, 0); ctx.lineTo(x + r * 1.35, y + r * .62); ctx.lineTo(x - r * 1.35, y + r * .62); ctx.closePath(); ctx.globalAlpha = alpha * .72; ctx.fill(); ctx.globalAlpha = alpha; ctx.stroke(); return; }
    if (point.shape === 'flower') { ctx.beginPath(); ctx.moveTo(x, y + r * .2); ctx.quadraticCurveTo(x - r * .12, y + r * 1.1, x - r * .35, y + r * 1.55); ctx.stroke(); for (let n = 0; n < 6; n++) { const angle = n * Math.PI / 3; ctx.beginPath(); ctx.ellipse(x + Math.cos(angle) * r * .55, y + Math.sin(angle) * r * .55, r * .3, r * .6, angle, 0, Math.PI * 2); ctx.fill(); } ctx.fillStyle = '#f0c85f'; ctx.beginPath(); ctx.arc(x, y, r * .25, 0, Math.PI * 2); ctx.fill(); return; }
    if (point.shape === 'grass') { for (let n = -2; n <= 2; n++) { ctx.beginPath(); ctx.moveTo(x + n * r * .35, y + r); ctx.quadraticCurveTo(x + n * r * .24, y - r * .2, x + n * r * .48, y - r); ctx.stroke(); } return; }
    if (point.shape === 'tree') { ctx.fillStyle = '#705342'; ctx.globalAlpha = alpha; ctx.fillRect(x - r * .16, y, r * .32, r * 1.25); ctx.fillStyle = color; ctx.globalAlpha = alpha * .82; [[-.62, -.42, .62], [0, -.72, .78], [.58, -.37, .56]].forEach(([dx, dy, size]) => { ctx.beginPath(); ctx.arc(x + dx * r, y + dy * r, r * size, 0, Math.PI * 2); ctx.fill(); }); return; }
    ctx.beginPath();
    if (point.shape === 'ring') { ctx.arc(x, y, r, 0, Math.PI * 2); ctx.stroke(); ctx.globalAlpha = alpha * .42; ctx.arc(x, y, r * .55, 0, Math.PI * 2); ctx.stroke(); }
    else if (point.shape === 'star') { for (let n = 0; n < 8; n++) { const angle = n * Math.PI / 4; ctx.lineTo(x + Math.cos(angle) * (n % 2 ? r * .34 : r), y + Math.sin(angle) * (n % 2 ? r * .34 : r)); } ctx.closePath(); ctx.fill(); }
    else if (point.shape === 'leaf') { ctx.ellipse(x, y, r * .46, r, .45, 0, Math.PI * 2); ctx.fill(); ctx.strokeStyle = '#fff4c6aa'; ctx.beginPath(); ctx.moveTo(x, y - r); ctx.lineTo(x, y + r); ctx.stroke(); }
    else if (point.shape === 'triangle') { ctx.moveTo(x, y - r); ctx.lineTo(x + r, y + r); ctx.lineTo(x - r, y + r); ctx.closePath(); ctx.stroke(); }
    else if (point.shape === 'petal') { for (let n = 0; n < 6; n++) { const angle = n * Math.PI / 3; ctx.ellipse(x + Math.cos(angle) * r * .45, y + Math.sin(angle) * r * .45, r * .28, r * .62, angle, 0, Math.PI * 2); } ctx.fill(); }
    else if (point.shape === 'moon') { ctx.arc(x, y, r, .35, Math.PI * 1.7); ctx.lineWidth = r * .42; ctx.stroke(); }
    else if (point.shape === 'diamond') { ctx.moveTo(x, y - r); ctx.lineTo(x + r * .7, y); ctx.lineTo(x, y + r); ctx.lineTo(x - r * .7, y); ctx.closePath(); ctx.fill(); }
    else if (point.shape === 'drop') { ctx.moveTo(x, y - r); ctx.quadraticCurveTo(x + r, y, x, y + r); ctx.quadraticCurveTo(x - r, y, x, y - r); ctx.fill(); }
    else { ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill(); }
  };
  const drawPoint = (point, time, index, w, h, alphaScale = 1) => {
    if (!motionStopped) {
      if (point.force === 'wind') point.x += (.08 + index * .002) * speed;
      if (point.force === 'float') point.y += Math.sin(time / 750 + point.phase) * .08 * speed;
      if (point.force === 'sink') point.y += .09 * speed;
      if (point.force === 'gather') { point.x += (w / 2 - point.x) * .0012 * speed; point.y += (h / 2 - point.y) * .0012 * speed; }
      if (point.force === 'spread') { point.x += (point.x - w / 2) * .001 * speed; point.y += (point.y - h / 2) * .001 * speed; }
      if (point.force === 'rotate') { const dx = point.x - w / 2; const dy = point.y - h / 2; const angle = .00035 * speed; point.x = w / 2 + dx * Math.cos(angle) - dy * Math.sin(angle); point.y = h / 2 + dx * Math.sin(angle) + dy * Math.cos(angle); }
      if (point.x > w + 80) point.x = -40; if (point.x < -80) point.x = w + 40; if (point.y > h + 80) point.y = -40; if (point.y < -80) point.y = h + 40;
    }
    const layerScale = point.layer === 'front' ? 1.12 : point.layer === 'back' ? .72 : 1;
    const layerAlpha = point.layer === 'front' ? 1 : point.layer === 'back' ? .38 : .72;
    const x = clamp(point.x, -w, w * 2); const y = clamp(point.y, -h, h * 2); const radius = Math.min(48, point.r * layerScale); const alpha = intensity * layerAlpha * alphaScale;
    ctx.save();
    if (point.kind === 'stroke') drawStroke(point, cssColor(point.color, 1), alpha); else drawShape({ ...point, x, y, r: radius }, cssColor(point.color, 1), alpha);
    if (point.effect === 'symbol') { ctx.fillStyle = '#fff4c6'; ctx.globalAlpha = alpha * .85; ctx.font = `${Math.max(14, radius)}px serif`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(point.symbol || activeEmotion.symbol, x, y); }
    if (point.effect === 'particle') { ctx.fillStyle = cssColor(point.color, alpha * .74); for (let n = 0; n < 3; n++) { ctx.beginPath(); ctx.arc(x + Math.cos(n + point.phase) * radius * 1.4, y + Math.sin(n * 1.7 + point.phase) * radius * 1.4, 1.5 + n, 0, Math.PI * 2); ctx.fill(); } }
    ctx.restore();
  };
  const sceneWave = (x, y, width, height, color, alpha, phase = 0) => { ctx.beginPath(); ctx.moveTo(x, y); ctx.quadraticCurveTo(x + width * .25, y - height * Math.sin(phase) - height, x + width * .5, y); ctx.quadraticCurveTo(x + width * .75, y + height * .45, x + width, y); ctx.strokeStyle = color; ctx.globalAlpha = alpha; ctx.lineWidth = Math.max(1.2, height * .18); ctx.stroke(); };
  const landscapeRidge = (pointsList, fill, stroke, alpha = 1) => { ctx.beginPath(); ctx.moveTo(pointsList[0][0], pointsList[0][1]); pointsList.slice(1).forEach(([x, y]) => ctx.lineTo(x, y)); ctx.lineTo(canvas.clientWidth, canvas.clientHeight); ctx.lineTo(0, canvas.clientHeight); ctx.closePath(); ctx.globalAlpha = alpha; ctx.fillStyle = fill; ctx.fill(); ctx.globalAlpha = Math.min(1, alpha + .2); ctx.strokeStyle = stroke; ctx.lineWidth = 1.4; ctx.stroke(); };
  const drawAtmosphere = (w, h, time, opacity = 1) => {
    const profile = activeEmotion;
    const gradient = ctx.createLinearGradient(0, 0, w, h);
    gradient.addColorStop(0, cssColor(profile.bg1, opacity)); gradient.addColorStop(.55, cssColor(profile.bg2, opacity * .9)); gradient.addColorStop(1, cssColor(mixHex(profile.bg2, '#f6f1e8', .25), opacity));
    ctx.fillStyle = gradient; ctx.globalAlpha = 1; ctx.fillRect(0, 0, w, h);
    const glow = ctx.createRadialGradient(w * (.24 + Math.sin(time / 2800) * .04), h * .2, 0, w * .24, h * .2, Math.min(w, h) * .62);
    glow.addColorStop(0, cssColor(profile.glow, opacity * .62)); glow.addColorStop(1, cssColor(profile.glow, 0)); ctx.fillStyle = glow; ctx.fillRect(0, 0, w, h);
    ctx.save(); ctx.globalAlpha = opacity * .2; ctx.strokeStyle = cssColor(profile.color, 1); ctx.fillStyle = cssColor(profile.color, 1); ctx.lineWidth = 1;
    if (profile.texture === 'water' || profile.texture === 'ribbons') for (let n = 0; n < 6; n++) sceneWave(-20, h * (.18 + n * .12), w + 40, 10 + n * 2, profile.color, .28, time / 1200 + n);
    if (profile.texture === 'rings' || profile.texture === 'soft') for (let n = 0; n < 4; n++) { ctx.beginPath(); ctx.ellipse(w * .72, h * .35, 80 + n * 38, 36 + n * 20, -.2, 0, Math.PI * 2); ctx.stroke(); }
    if (profile.texture === 'rays' || profile.texture === 'lines') for (let n = -4; n < 6; n++) { ctx.beginPath(); ctx.moveTo(w * .7, h * .16); ctx.lineTo(w * .7 + n * 100, h); ctx.stroke(); }
    if (profile.texture === 'leaf' || profile.texture === 'sprout') for (let n = 0; n < 7; n++) { const x = w * (.12 + n * .13); const y = h * (.78 + Math.sin(n) * .03); ctx.beginPath(); ctx.ellipse(x, y, 10 + n * 1.6, 27, -.35 + n * .12, 0, Math.PI * 2); ctx.fill(); }
    if (profile.texture === 'speckle' || profile.texture === 'mist') for (let n = 0; n < 35; n++) { const x = rand(n * 3.7 + todayOrdinal) * w; const y = rand(n * 4.2 + 8) * h; ctx.beginPath(); ctx.arc(x, y, 1 + rand(n + 8) * 2.5, 0, Math.PI * 2); ctx.fill(); }
    ctx.restore();
  };
  const drawOcean = (w, h, time) => { const horizon = h * .43; const water = activeColor; const sky = ctx.createLinearGradient(0, 0, 0, horizon); sky.addColorStop(0, mixHex(water, '#eef3ed', .72)); sky.addColorStop(1, '#a8c8c4'); ctx.fillStyle = sky; ctx.fillRect(0, 0, w, horizon); const sea = ctx.createLinearGradient(0, horizon, 0, h); sea.addColorStop(0, mixHex(water, '#d8eee6', .35)); sea.addColorStop(1, mixHex(water, '#15384c', .65)); ctx.fillStyle = sea; ctx.fillRect(0, horizon, w, h - horizon); ctx.fillStyle = '#f4d99b'; ctx.globalAlpha = .82; ctx.beginPath(); ctx.arc(w * .76, h * .2, Math.min(w, h) * .055, 0, Math.PI * 2); ctx.fill(); ctx.strokeStyle = '#567b7d'; ctx.globalAlpha = .72; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(0, horizon); ctx.lineTo(w, horizon); ctx.stroke(); for (let row = 0; row < 11; row++) { const y = horizon + 26 + row * ((h - horizon - 38) / 11); const amplitude = 3 + row * .7; const width = 80 + (row % 3) * 45; for (let x = -width; x < w + width; x += width) sceneWave(x, y, width, amplitude, row % 2 ? water : '#d8eee3', .32 + row * .026, time / 300 + row); } landscapeRidge([[0, horizon + 3], [w * .2, horizon - 14], [w * .36, horizon + 2], [w * .58, horizon - 22], [w * .78, horizon + 1], [w, horizon - 12]], '#628b8a', '#4a7174', .55); };
  const drawMountain = (w, h) => { const sky = ctx.createLinearGradient(0, 0, 0, h * .7); sky.addColorStop(0, mixHex(activeColor, '#e5eff0', .62)); sky.addColorStop(1, '#b8ccd0'); ctx.fillStyle = sky; ctx.fillRect(0, 0, w, h * .7); ctx.fillStyle = '#f0d69d'; ctx.globalAlpha = .8; ctx.beginPath(); ctx.arc(w * .72, h * .2, Math.min(w, h) * .06, 0, Math.PI * 2); ctx.fill(); landscapeRidge([[0, h * .58], [w * .12, h * .43], [w * .28, h * .37], [w * .42, h * .5], [w * .58, h * .31], [w * .72, h * .46], [w * .86, h * .33], [w, h * .42]], '#9aabb0', '#73898f', .68); landscapeRidge([[0, h * .76], [w * .16, h * .6], [w * .3, h * .51], [w * .44, h * .68], [w * .58, h * .45], [w * .72, h * .59], [w * .87, h * .48], [w, h * .61]], mixHex(activeColor, '#405461', .48), '#415a62', .88); ctx.strokeStyle = '#eef1e7'; ctx.globalAlpha = .38; ctx.lineWidth = 12; for (let y = h * .52; y < h * .72; y += 22) { ctx.beginPath(); ctx.moveTo(0, y); ctx.quadraticCurveTo(w * .45, y - 9, w, y + 4); ctx.stroke(); } };
  const drawGarden = (w, h) => { const sky = ctx.createLinearGradient(0, 0, 0, h * .68); sky.addColorStop(0, '#dce8df'); sky.addColorStop(1, mixHex(activeColor, '#d8e4cb', .7)); ctx.fillStyle = sky; ctx.fillRect(0, 0, w, h * .7); ctx.fillStyle = '#a8bf8c'; ctx.globalAlpha = .92; ctx.fillRect(0, h * .62, w, h * .38); ctx.fillStyle = '#e7c991'; ctx.globalAlpha = .7; ctx.beginPath(); ctx.arc(w * .18, h * .2, Math.min(w, h) * .05, 0, Math.PI * 2); ctx.fill(); for (let n = 0; n < 21; n++) { const x = rand(n * 4.8 + 2) * w; const base = h * (.72 + rand(n * 6.2) * .22); const height = 24 + rand(n * 6) * 48; ctx.strokeStyle = n % 3 ? '#557b5a' : '#6e8f63'; ctx.globalAlpha = .72; ctx.lineWidth = 2 + rand(n) * 1.2; ctx.beginPath(); ctx.moveTo(x, base); ctx.quadraticCurveTo(x - 9, base - height * .55, x + (rand(n) - .5) * 26, base - height); ctx.stroke(); if (n % 3 === 0) { ctx.beginPath(); ctx.ellipse(x - 10, base - height * .6, 9, 4, -.5, 0, Math.PI * 2); ctx.ellipse(x + 9, base - height * .72, 10, 4, .5, 0, Math.PI * 2); ctx.fillStyle = '#6f956d'; ctx.fill(); } } for (let n = 0; n < 12; n++) { const x = rand(n * 4.8 + 2) * w; const y = h * (.6 + rand(n * 3.1) * .32); const r = 5 + rand(n * 8) * 5; drawShape({ shape: 'flower', x, y, r, color: n % 2 ? '#d47b92' : '#e6c65c', effect: 'glow', symbol: '✦' }, cssColor(n % 2 ? '#d47b92' : '#e6c65c', 1), .78); } };
  const drawNight = (w, h, time) => { const sky = ctx.createLinearGradient(0, 0, 0, h); sky.addColorStop(0, '#111d3c'); sky.addColorStop(.62, mixHex(activeColor, '#1c2948', .72)); sky.addColorStop(1, '#0d1828'); ctx.fillStyle = sky; ctx.fillRect(0, 0, w, h); ctx.fillStyle = '#f3e7bf'; ctx.globalAlpha = .94; ctx.beginPath(); ctx.arc(w * .75, h * .22, Math.min(w, h) * .07, 0, Math.PI * 2); ctx.fill(); ctx.fillStyle = '#182744'; ctx.globalAlpha = .96; ctx.beginPath(); ctx.arc(w * .78, h * .19, Math.min(w, h) * .065, 0, Math.PI * 2); ctx.fill(); ensureSceneMarks(w, h); sceneMarks.forEach((mark, index) => { if (mark.y > h * .62) return; ctx.fillStyle = index % 4 ? '#f8e7a9' : activeColor; ctx.globalAlpha = .42 + (Math.sin(time / 900 + mark.phase) + 1) * .2; ctx.beginPath(); ctx.arc(mark.x, mark.y, mark.r, 0, Math.PI * 2); ctx.fill(); }); landscapeRidge([[0, h * .76], [w * .2, h * .66], [w * .42, h * .75], [w * .62, h * .63], [w * .83, h * .72], [w, h * .65]], '#111d31', '#233451', 1); ctx.fillStyle = '#0b1523'; ctx.globalAlpha = .94; ctx.fillRect(0, h * .78, w, h * .22); };
  const drawScene = (w, h, time) => { if (sceneMode === 'ocean') drawOcean(w, h, time); else if (sceneMode === 'mountain') drawMountain(w, h); else if (sceneMode === 'garden') drawGarden(w, h); else if (sceneMode === 'night') drawNight(w, h, time); else drawAtmosphere(w, h, time); };
  const drawEmotionTint = (w, h) => { const gradient = ctx.createRadialGradient(w * .22, h * .18, 0, w * .22, h * .18, Math.max(w, h) * .72); gradient.addColorStop(0, cssColor(activeEmotion.glow, .18)); gradient.addColorStop(1, cssColor(activeEmotion.bg2, 0)); ctx.fillStyle = gradient; ctx.globalAlpha = 1; ctx.fillRect(0, 0, w, h); };
  const objectPreview = type => {
    const art = {
      sofa: '<ellipse cx="32" cy="53" rx="24" ry="4" fill="#293b3b" opacity=".16"/><rect x="10" y="20" width="44" height="23" rx="7" fill="#a98378" stroke="#394b4b" stroke-width="1.7"/><rect x="7" y="35" width="50" height="12" rx="5" fill="#8f6b64" stroke="#394b4b" stroke-width="1.7"/><rect x="15" y="24" width="15" height="14" rx="5" fill="#c5a198"/><rect x="34" y="24" width="15" height="14" rx="5" fill="#c5a198"/><path d="M14 47v6m36-6v6" stroke="#59615a" stroke-width="2.5" stroke-linecap="round"/>',
      bed: '<ellipse cx="32" cy="54" rx="25" ry="4" fill="#293b3b" opacity=".14"/><rect x="10" y="13" width="10" height="37" rx="2" fill="#745c55"/><rect x="16" y="27" width="39" height="22" rx="4" fill="#e5ddd1" stroke="#394b4b" stroke-width="1.5"/><path d="M20 32h12v9H20c-4 0-4-9 0-9Z" fill="#f7f0e5"/><path d="M33 29c7 3 13 3 20 1v17H33c-4-5-4-12 0-18Z" fill="#aebfc0"/><path d="M17 49h38M17 49v4m38-4v4" stroke="#594b46" stroke-width="2"/>',
      chair: '<ellipse cx="32" cy="54" rx="17" ry="3" fill="#293b3b" opacity=".15"/><path d="M19 12h26v25H19z" fill="#93a8a3" stroke="#394b4b" stroke-width="1.7"/><path d="M15 31h34v12H15z" fill="#b2c0ba" stroke="#394b4b" stroke-width="1.7"/><path d="M20 43 16 54m28-11 4 11" stroke="#59615a" stroke-width="3" stroke-linecap="round"/><path d="M23 17h18" stroke="#dce8df" stroke-width="2" opacity=".7"/>',
      cup: '<ellipse cx="31" cy="49" rx="22" ry="4" fill="#293b3b" opacity=".13"/><ellipse cx="32" cy="44" rx="20" ry="5" fill="#d9c1ae"/><path d="M18 22h27v22c0 7-27 7-27 0Z" fill="#eee3d6" stroke="#394b4b" stroke-width="1.6"/><ellipse cx="31.5" cy="23" rx="13" ry="3.5" fill="#765449"/><path d="M45 28c13-5 13 13 0 11" fill="none" stroke="#394b4b" stroke-width="2"/><path d="M24 16c-4-7 5-7 1-13m9 13c-4-7 5-7 1-13" fill="none" stroke="#a77c6b" stroke-width="1.7" stroke-linecap="round"/>',
      bicycle: '<circle cx="16" cy="43" r="11" fill="none" stroke="#3d5558" stroke-width="2.2"/><circle cx="49" cy="43" r="11" fill="none" stroke="#3d5558" stroke-width="2.2"/><path d="M16 43 29 25l9 18-22 0 13-18 13-1 7 19M29 25l-5-6h-6m20 0h6l4 4" fill="none" stroke="#9b6257" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"/><path d="M24 16h8M42 20l6-3" stroke="#414b4a" stroke-width="2.3" stroke-linecap="round"/><circle cx="38" cy="43" r="3.5" fill="#d5a45f"/>',
      desk: '<ellipse cx="32" cy="54" rx="23" ry="3" fill="#293b3b" opacity=".14"/><path d="M8 20h48v10H8z" fill="#a77d5c" stroke="#394b4b" stroke-width="1.6"/><path d="M13 30v23m38-23v23" stroke="#715344" stroke-width="3"/><rect x="17" y="30" width="17" height="11" rx="2" fill="#c39770" stroke="#394b4b" stroke-width="1.3"/><circle cx="25" cy="35" r="1.4" fill="#594b46"/><path d="M39 18c2-6 10-6 12 0" fill="#819b91" stroke="#394b4b" stroke-width="1.2"/>',
      piano: '<ellipse cx="32" cy="54" rx="25" ry="4" fill="#293b3b" opacity=".18"/><rect x="8" y="18" width="48" height="30" rx="5" fill="#40383d" stroke="#293335" stroke-width="1.7"/><path d="M12 17h40l-5-6H17z" fill="#665055" stroke="#293335" stroke-width="1.5"/><rect x="14" y="26" width="36" height="13" rx="1" fill="#eee5d4"/><path d="M19 26v13m7-13v13m7-13v13m7-13v13m7-13v13" stroke="#726c65" stroke-width=".9"/><path d="M23 26v7h3v-7m8 0v7h3v-7m8 0v7h3v-7" stroke="#292d32" stroke-width="2.2"/><path d="M17 48v5m30-5v5" stroke="#65514b" stroke-width="2.5"/>',
      easel: '<path d="M21 12 10 55M43 12l11 43M32 17v38" stroke="#8d684f" stroke-width="3.5" stroke-linecap="round"/><rect x="18" y="12" width="28" height="28" rx="2" fill="#e7d6bd" stroke="#394b4b" stroke-width="1.5"/><path d="M22 32c5-11 9-10 13-3 4-7 7-6 8 3Z" fill="#8ea59a"/><circle cx="28" cy="22" r="3" fill="#c47d73"/><path d="M13 41h38" stroke="#8d684f" stroke-width="2.5"/><circle cx="50" cy="45" r="3" fill="#d7a45f"/>',
      carpet: '<rect x="8" y="14" width="48" height="37" rx="8" fill="#936a70" stroke="#394b4b" stroke-width="1.6"/><rect x="14" y="20" width="36" height="25" rx="5" fill="#a98383" stroke="#e6cdb8" stroke-width="1.3"/><path d="M19 25c7 7 18 7 27 0M19 39c7-7 18-7 27 0M25 21c4 7 4 17 0 24m14-24c-4 7-4 17 0 24" fill="none" stroke="#e7c9b3" stroke-width="1.2" opacity=".75"/>',
      house: '<path d="M8 28 32 9l24 19v25H8z" fill="#d1ae8e" stroke="#394b4b" stroke-width="1.7"/><path d="M5 28 32 6l27 22" fill="none" stroke="#805f55" stroke-width="3"/><rect x="26" y="38" width="12" height="15" fill="#76594d"/><rect x="14" y="30" width="9" height="9" fill="#b9d4d0"/><rect x="41" y="30" width="9" height="9" fill="#b9d4d0"/>',
      book: '<path d="M11 15c7-3 14 0 21 5 7-5 14-8 21-5v34c-7-3-14 0-21 5-7-5-14-8-21-5z" fill="#806a78" stroke="#394b4b" stroke-width="1.5"/><path d="M32 20v34M16 23h11m-11 6h11m10-6h11m-11 6h11" stroke="#f0e1c9" stroke-width="1.2"/>',
      lamp: '<path d="M18 24h28l-5-15H23z" fill="#d7b17a" stroke="#394b4b" stroke-width="1.5"/><path d="M23 24h18" stroke="#f3dda5" stroke-width="2"/><path d="M32 24v22" stroke="#6d5b52" stroke-width="2.5"/><rect x="22" y="45" width="20" height="6" rx="3" fill="#7a6b63"/><circle cx="32" cy="28" r="8" fill="#f6d991" opacity=".28"/>',
      plant: '<path d="M20 34h24l-3 18H23z" fill="#b87961" stroke="#394b4b" stroke-width="1.5"/><path d="M32 34V17m0 10c-9-8-14 1-4 5m4-4c9-8 14 1 4 5" fill="none" stroke="#52705b" stroke-width="2" stroke-linecap="round"/><ellipse cx="22" cy="21" rx="7" ry="3.5" transform="rotate(28 22 21)" fill="#719a73"/><ellipse cx="42" cy="20" rx="7" ry="3.5" transform="rotate(-28 42 20)" fill="#719a73"/><ellipse cx="32" cy="13" rx="6" ry="3.5" fill="#6a906d"/>'
    }[type] || '';
    return `<svg viewBox="0 0 64 64" aria-hidden="true" focusable="false">${art}</svg>`;
  };
  const renderObjectLibrary = () => {
    const target = $('#paletteObjects');
    if (!target) return;
    target.innerHTML = objectCatalog.map(item => `<button type="button" class="palette-object-card" data-palette-object="${item.type}" aria-label="加入${item.label}"><span class="object-thumb object-thumb-${item.type}">${objectPreview(item.type)}</span><strong>${item.label}</strong><small>${item.note}</small></button>`).join('');
  };
  const objectLocal = (object, x, y) => { const dx = x - object.x; const dy = y - object.y; const angle = -object.rotation; return { x: (dx * Math.cos(angle) - dy * Math.sin(angle)) / object.scale, y: (dx * Math.sin(angle) + dy * Math.cos(angle)) / object.scale }; };
  const hitObject = (x, y) => [...objects].sort((a, b) => b.z - a.z).find(object => { const local = objectLocal(object, x, y); const [w, h] = objectSizes[object.type]; return Math.abs(local.x) <= w * .62 && Math.abs(local.y) <= h * .62; });
  const selectedObject = () => objects.find(object => object.id === selectedObjectId) || null;
  const renderObjectEditor = () => {
    const editor = $('#paletteObjectEditor');
    if (!editor) return;
    const object = selectedObject();
    editor.hidden = !object;
    if (!object) { editor.innerHTML = ''; return; }
    const meta = objectCatalog.find(item => item.type === object.type);
    editor.innerHTML = `<div class="object-editor-title"><span>${objectPreview(object.type)}</span><strong>${meta?.label || '生活物件'}</strong><small>直接拖曳物件移動</small></div><div class="object-editor-actions"><button type="button" data-object-action="smaller">縮小</button><button type="button" data-object-action="larger">放大</button><button type="button" data-object-action="rotate-left">左轉</button><button type="button" data-object-action="rotate-right">右轉</button><button type="button" data-object-action="back">後移</button><button type="button" data-object-action="front">前移</button><button type="button" class="object-delete" data-object-action="delete">刪除</button><button type="button" data-object-action="deselect">取消選取</button></div>`;
  };
  const drawSelection = object => {
    if (!object) return;
    const [w, h] = objectSizes[object.type];
    ctx.save(); ctx.translate(object.x, object.y); ctx.rotate(object.rotation); ctx.scale(object.scale, object.scale); ctx.strokeStyle = '#b56b52'; ctx.globalAlpha = .85; ctx.lineWidth = 1.5 / object.scale; ctx.setLineDash([6 / object.scale, 4 / object.scale]); ctx.strokeRect(-w * .58, -h * .58, w * 1.16, h * 1.16); ctx.setLineDash([]); ctx.fillStyle = '#fffdf5'; ctx.strokeStyle = '#b56b52'; [[-w * .58, -h * .58], [w * .58, -h * .58], [w * .58, h * .58], [-w * .58, h * .58]].forEach(([x, y]) => { ctx.beginPath(); ctx.arc(x, y, 5 / object.scale, 0, Math.PI * 2); ctx.fill(); ctx.stroke(); }); ctx.restore();
  };
  const drawObject = (object, time) => {
    const [w, h] = objectSizes[object.type];
    ctx.save(); ctx.translate(object.x, object.y); ctx.rotate(object.rotation); ctx.scale(object.scale, object.scale);
    ctx.save(); ctx.translate(0, h * .48); ctx.scale(1, .24); ctx.fillStyle = 'rgba(28,42,43,.22)'; ctx.filter = 'blur(6px)'; ctx.beginPath(); ctx.ellipse(0, 0, w * .43, h * .18, 0, 0, Math.PI * 2); ctx.fill(); ctx.restore(); ctx.filter = 'none';
    const path = (x, y, width, height, radius) => { ctx.beginPath(); ctx.roundRect(x, y, width, height, radius); };
    const grad = (from, to, y1 = -h / 2, y2 = h / 2) => { const g = ctx.createLinearGradient(0, y1, 0, y2); g.addColorStop(0, from); g.addColorStop(1, to); return g; };
    ctx.lineJoin = 'round'; ctx.lineCap = 'round'; ctx.strokeStyle = 'rgba(39,53,53,.58)'; ctx.lineWidth = 2;
    if (object.type === 'sofa') {
      path(-w / 2 + 16, -h / 2 + 18, w - 32, h * .52, 18); ctx.fillStyle = grad('#c9a99a', '#9b746b', -h / 2, 0); ctx.fill(); ctx.stroke();
      path(-w / 2 + 4, -4, w - 8, 42, 13); ctx.fillStyle = grad('#c9a99a', '#8f675f', -2, h / 2); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#bd9589'; path(-w / 2 + 24, -h / 2 + 37, 69, 42, 12); ctx.fill(); ctx.stroke(); path(w / 2 - 93, -h / 2 + 37, 69, 42, 12); ctx.fill(); ctx.stroke();
      ctx.strokeStyle = 'rgba(255,241,227,.4)'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(-w / 2 + 31, 8); ctx.quadraticCurveTo(-w * .22, 17, -w / 2 + 79, 8); ctx.moveTo(w / 2 - 79, 8); ctx.quadraticCurveTo(w * .22, 17, w / 2 - 31, 8); ctx.stroke();
      ctx.strokeStyle = '#594b4a'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(-w / 2 + 28, h / 2 - 7); ctx.lineTo(-w / 2 + 23, h / 2 + 7); ctx.moveTo(w / 2 - 28, h / 2 - 7); ctx.lineTo(w / 2 - 23, h / 2 + 7); ctx.stroke();
    } else if (object.type === 'bed') {
      path(-w / 2 + 10, -h / 2 + 3, w - 20, 47, 8); ctx.fillStyle = grad('#8c6b5d', '#624f49', -h / 2, -h * .1); ctx.fill(); ctx.stroke();
      path(-w / 2 + 4, -h / 2 + 37, w - 8, h - 49, 7); ctx.fillStyle = grad('#eee4d5', '#c9bbb0', -h / 2 + 37, h / 2); ctx.fill(); ctx.stroke();
      path(-w / 2 + 22, -h / 2 + 48, 75, 34, 9); ctx.fillStyle = '#f8f1e4'; ctx.fill(); ctx.stroke(); path(-w / 2 + 104, -h / 2 + 49, 77, 34, 9); ctx.fill(); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(6, -h / 2 + 45); ctx.quadraticCurveTo(25, -5, 5, h / 2 - 8); ctx.lineTo(w / 2 - 4, h / 2 - 8); ctx.lineTo(w / 2 - 4, -h / 2 + 45); ctx.closePath(); ctx.fillStyle = '#b5c4c7'; ctx.globalAlpha = .78; ctx.fill(); ctx.globalAlpha = 1; ctx.stroke();
      ctx.strokeStyle = '#554b46'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(-w / 2 + 15, h / 2 - 4); ctx.lineTo(-w / 2 + 15, h / 2 + 8); ctx.moveTo(w / 2 - 15, h / 2 - 4); ctx.lineTo(w / 2 - 15, h / 2 + 8); ctx.stroke();
    } else if (object.type === 'chair') {
      path(-w / 2 + 15, -h / 2 + 5, w - 30, h * .47, 11); ctx.fillStyle = grad('#9faeaa', '#6e817c', -h / 2, 0); ctx.fill(); ctx.stroke();
      path(-w / 2 + 9, -5, w - 18, 34, 12); ctx.fillStyle = '#b8c5bf'; ctx.fill(); ctx.stroke();
      ctx.strokeStyle = '#5a625c'; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(-w / 2 + 20, 22); ctx.lineTo(-w / 2 + 9, h / 2 + 5); ctx.moveTo(w / 2 - 20, 22); ctx.lineTo(w / 2 - 9, h / 2 + 5); ctx.stroke();
      ctx.strokeStyle = 'rgba(255,255,255,.45)'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(-w / 2 + 29, -h / 2 + 15); ctx.lineTo(w / 2 - 29, -h / 2 + 15); ctx.stroke();
    } else if (object.type === 'cup') {
      ctx.fillStyle = '#efe7dc'; ctx.beginPath(); ctx.ellipse(0, h * .28, w * .44, h * .13, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      path(-w * .35, -h * .08, w * .7, h * .42, 13); ctx.fillStyle = grad('#f6eee2', '#bd9b86', -h * .08, h * .42); ctx.fill(); ctx.stroke();
      ctx.beginPath(); ctx.arc(w * .35, h * .1, 17, -.8, 1.1); ctx.stroke();
      ctx.fillStyle = '#765449'; ctx.beginPath(); ctx.ellipse(0, -h * .08, w * .3, h * .08, 0, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = 'rgba(255,255,255,.62)'; ctx.lineWidth = 2; for (let i = -1; i <= 1; i++) { ctx.beginPath(); ctx.moveTo(i * 12, -h * .24); ctx.bezierCurveTo(i * 12 - 8, -h * .4, i * 12 + 8, -h * .43, i * 12, -h * .6); ctx.stroke(); }
    } else if (object.type === 'bicycle') {
      ctx.strokeStyle = '#40575a'; ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(-w * .34, h * .22, h * .25, 0, Math.PI * 2); ctx.arc(w * .34, h * .22, h * .25, 0, Math.PI * 2); ctx.stroke();
      ctx.strokeStyle = '#9a5e52'; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(-w * .34, h * .22); ctx.lineTo(-w * .04, -h * .12); ctx.lineTo(w * .14, h * .22); ctx.lineTo(-w * .34, h * .22); ctx.lineTo(w * .34, h * .22); ctx.lineTo(-w * .04, -h * .12); ctx.lineTo(-w * .17, -h * .27); ctx.moveTo(-w * .17, -h * .27); ctx.lineTo(-w * .02, -h * .27); ctx.moveTo(w * .14, h * .22); ctx.lineTo(w * .05, -h * .16); ctx.lineTo(w * .2, -h * .26); ctx.moveTo(w * .2, -h * .26); ctx.lineTo(w * .3, -h * .2); ctx.stroke();
      ctx.fillStyle = '#463c39'; path(-w * .23, -h * .35, 28, 8, 3); ctx.fill(); ctx.stroke(); ctx.fillStyle = '#d5ab62'; ctx.beginPath(); ctx.arc(-w * .04, h * .22, 8, 0, Math.PI * 2); ctx.fill();
    } else if (object.type === 'desk') {
      path(-w / 2, -h / 2 + 8, w, 34, 5); ctx.fillStyle = grad('#b98d68', '#825d49', -h / 2, 0); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#c9a17c'; path(-w * .27, -h / 2 + 42, 78, 34, 3); ctx.fill(); ctx.stroke(); ctx.fillStyle = '#5a4b45'; ctx.beginPath(); ctx.arc(-w * .04, -h / 2 + 59, 3, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = '#725443'; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(-w / 2 + 13, -h / 2 + 42); ctx.lineTo(-w / 2 + 18, h / 2 + 4); ctx.moveTo(w / 2 - 13, -h / 2 + 42); ctx.lineTo(w / 2 - 18, h / 2 + 4); ctx.stroke();
      ctx.fillStyle = '#667c75'; ctx.beginPath(); ctx.ellipse(w * .27, -h / 2 + 6, 12, 4, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    } else if (object.type === 'piano') {
      path(-w / 2, -h / 2 + 18, w, h - 42, 9); ctx.fillStyle = grad('#4e3a39', '#2c2a2c', -h / 2, h / 2); ctx.fill(); ctx.stroke();
      path(-w / 2 + 12, -h / 2 + 34, w - 24, 58, 3); ctx.fillStyle = '#eadfca'; ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#2f3032'; for (let i = 0; i < 10; i++) { if (i % 7 !== 2 && i % 7 !== 6) path(-w / 2 + 25 + i * 20, -h / 2 + 34, 11, 28, 1), ctx.fill(); }
      ctx.fillStyle = '#6b4b45'; path(-w * .32, -h / 2 + 4, w * .64, 15, 4); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#b08b61'; path(-w * .24, -h * .23, w * .48, 10, 3); ctx.fill(); ctx.stroke();
      ctx.strokeStyle = '#a78361'; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(-w * .34, h * .26); ctx.lineTo(-w * .29, h / 2 + 7); ctx.moveTo(w * .34, h * .26); ctx.lineTo(w * .29, h / 2 + 7); ctx.stroke();
    } else if (object.type === 'easel') {
      ctx.strokeStyle = '#87664c'; ctx.lineWidth = 9; ctx.beginPath(); ctx.moveTo(-w * .25, -h / 2 + 6); ctx.lineTo(-w * .42, h / 2 + 8); ctx.moveTo(w * .25, -h / 2 + 6); ctx.lineTo(w * .42, h / 2 + 8); ctx.moveTo(0, -h * .32); ctx.lineTo(0, h / 2 + 8); ctx.stroke();
      path(-w * .38, -h * .36, w * .76, h * .48, 4); ctx.fillStyle = '#e5d6bd'; ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#7d9a8b'; ctx.globalAlpha = .78; ctx.beginPath(); ctx.arc(-w * .12, -h * .12, 19, 0, Math.PI * 2); ctx.fill(); ctx.fillStyle = '#c57f73'; ctx.beginPath(); ctx.arc(w * .16, h * .02, 15, 0, Math.PI * 2); ctx.fill(); ctx.globalAlpha = 1;
      ctx.strokeStyle = '#a9835e'; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(-w * .45, h * .25); ctx.lineTo(w * .45, h * .25); ctx.stroke();
    } else if (object.type === 'carpet') {
      path(-w / 2, -h / 2, w, h, 18); ctx.fillStyle = grad('#a97d73', '#725c65', -h / 2, h / 2); ctx.fill(); ctx.stroke();
      ctx.strokeStyle = 'rgba(247,226,193,.62)'; ctx.lineWidth = 2; path(-w / 2 + 12, -h / 2 + 10, w - 24, h - 20, 13); ctx.stroke();
      ctx.strokeStyle = 'rgba(245,221,182,.45)'; ctx.lineWidth = 1.5; for (let x = -w * .34; x <= w * .34; x += 22) { ctx.beginPath(); ctx.moveTo(x, -h * .31); ctx.lineTo(x + 12, h * .31); ctx.stroke(); } for (let x = -w * .27; x <= w * .27; x += 44) { ctx.beginPath(); ctx.moveTo(x, -h * .35); ctx.lineTo(x - 15, h * .35); ctx.stroke(); }
    } else if (object.type === 'house') {
      ctx.fillStyle = '#d4b18f'; ctx.beginPath(); ctx.moveTo(-w / 2, -h * .05); ctx.lineTo(0, -h / 2); ctx.lineTo(w / 2, -h * .05); ctx.lineTo(w / 2, h / 2); ctx.lineTo(-w / 2, h / 2); ctx.closePath(); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#8b675b'; ctx.beginPath(); ctx.moveTo(-w / 2 - 7, -h * .03); ctx.lineTo(0, -h / 2 - 17); ctx.lineTo(w / 2 + 7, -h * .03); ctx.closePath(); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#b9d4d0'; path(-w * .34, -h * .06, 40, 32, 3); ctx.fill(); ctx.stroke(); path(w * .1, -h * .06, 40, 32, 3); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#76594d'; path(-25, h * .1, 50, h * .4, 5); ctx.fill(); ctx.stroke(); ctx.fillStyle = '#e8c886'; ctx.beginPath(); ctx.arc(13, h * .3, 3, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = '#678067'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(-w * .55, h / 2); ctx.quadraticCurveTo(-w * .44, h * .23, -w * .34, h / 2); ctx.moveTo(w * .35, h / 2); ctx.quadraticCurveTo(w * .45, h * .2, w * .57, h / 2); ctx.stroke();
    } else if (object.type === 'book') {
      ctx.fillStyle = '#7e646f'; path(-w / 2, -h / 2, w, h, 5); ctx.fill(); ctx.stroke(); ctx.fillStyle = '#f1e4c9'; path(-w / 2 + 10, -h / 2 + 10, w - 20, h - 20, 3); ctx.fill(); ctx.stroke(); ctx.strokeStyle = '#c79f65'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(0, -h / 2 + 10); ctx.lineTo(0, h / 2 - 10); ctx.stroke(); ctx.fillStyle = '#d58b73'; ctx.fillRect(w * .22, h * .18, 8, h * .32); ctx.strokeStyle = '#6f817b'; ctx.lineWidth = 1; for (let y = -h * .18; y < h * .25; y += 13) { ctx.beginPath(); ctx.moveTo(-w * .32, y); ctx.lineTo(-w * .08, y); ctx.moveTo(w * .08, y); ctx.lineTo(w * .31, y); ctx.stroke(); }
    } else if (object.type === 'lamp') {
      ctx.fillStyle = '#d9b279'; ctx.beginPath(); ctx.moveTo(-w * .38, -h / 2); ctx.lineTo(w * .38, -h / 2); ctx.lineTo(w * .52, -h * .1); ctx.lineTo(-w * .52, -h * .1); ctx.closePath(); ctx.fill(); ctx.stroke(); ctx.fillStyle = '#f5df9e'; ctx.globalAlpha = .65; ctx.beginPath(); ctx.ellipse(0, -h * .08, w * .34, h * .14, 0, 0, Math.PI * 2); ctx.fill(); ctx.globalAlpha = 1; ctx.strokeStyle = '#6d5b52'; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(0, -h * .08); ctx.lineTo(0, h * .33); ctx.stroke(); path(-w * .4, h * .33, w * .8, 16, 8); ctx.fillStyle = '#7a6b63'; ctx.fill(); ctx.stroke();
    } else if (object.type === 'plant') {
      path(-w * .32, h * .08, w * .64, h * .35, 8); ctx.fillStyle = grad('#b86f59', '#7d4f48', h * .08, h / 2); ctx.fill(); ctx.stroke(); ctx.strokeStyle = '#52705b'; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(0, h * .1); ctx.quadraticCurveTo(-8, -h * .12, 0, -h * .38); ctx.moveTo(0, h * .1); ctx.quadraticCurveTo(13, -h * .1, 9, -h * .37); ctx.stroke(); ctx.fillStyle = '#6f9a70'; [[-20, -h * .25, -.5], [20, -h * .28, .5], [-9, -h * .45, -.2], [16, -h * .48, .35]].forEach(([x, y, angle]) => { ctx.beginPath(); ctx.ellipse(x, y, 13, 27, angle, 0, Math.PI * 2); ctx.fill(); ctx.stroke(); });
    }
    ctx.restore();
  };
  const draw = (time = 0, includeSelection = true) => {
    const w = canvas.clientWidth; const h = canvas.clientHeight;
    ctx.save(); ctx.beginPath(); ctx.rect(0, 0, w, h); ctx.clip(); ctx.globalCompositeOperation = 'source-over'; ctx.globalAlpha = 1;
    const frameTime = motionStopped ? 0 : time;
    drawScene(w, h, frameTime); ctx.globalAlpha = 1;
    if (sceneMode !== 'none') drawEmotionTint(w, h);
    [...objects].sort((a, b) => a.z - b.z).forEach(object => drawObject(object, frameTime));
    const originalAlpha = sceneMode === 'none' ? 1 : .48;
    points.forEach((point, index) => drawPoint(point, frameTime, index, w, h, originalAlpha));
    if (includeSelection) drawSelection(selectedObject());
    ctx.restore();
    if (!paused) requestAnimationFrame(draw);
  };
  const addPoint = (x, y, px = x, py = y) => {
    const naturalShapes = ['wave', 'mountain', 'cloud', 'flower', 'grass', 'tree'];
    const point = { x, y, px, py, r: brushRadius(), color: activeColor, shape: activeShape, effect: activeEffect, material: activeMaterial, force: activeForce, layer: activeLayer, symbol: activeEmotion.symbol, phase: Math.random() * Math.PI * 2, kind: naturalShapes.includes(activeShape) ? 'shape' : (activeEffect === 'line' || activeEffect === 'brush' || activeEffect === 'watercolor' || activeEffect === 'softmist' ? 'stroke' : 'shape') };
    points.push(point); if (points.length > 260) points.splice(0, points.length - 260); refresh();
  };
  const selectTab = tab => { $$('.palette-tool-tab').forEach(item => { const active = item.dataset.paletteTab === tab; item.classList.toggle('active', active); item.setAttribute('aria-selected', String(active)); }); $$('[data-palette-panel]').forEach(panel => { panel.hidden = panel.dataset.palettePanel !== tab; }); const activePanel = $(`[data-palette-panel="${tab}"]`); if (activePanel) requestAnimationFrame(() => activePanel.scrollIntoView({ block: 'nearest', behavior: 'smooth' })); };
  const clonePoints = () => points.map(point => ({ ...point }));
  const enterScene = value => { if (value !== 'none' && sceneMode === 'none') sceneSnapshot = clonePoints(); if (value === 'none' && sceneSnapshot) { points = sceneSnapshot.map(point => ({ ...point })); sceneSnapshot = null; } sceneMode = value; resetSceneMarks(); setStatus(value === 'none' ? '已回到原始作品；原本的筆觸與生活物件仍在。' : `作品已轉成${transforms.find(item => item[1] === value)?.[0] || '自然場景'}，生活物件與原本筆觸保留。`); refresh(); };
  const addObject = type => { const [w, h] = objectSizes[type] || [140, 100]; const object = { id: `object-${++objectId}`, type, x: canvas.clientWidth * (.5 + ((objects.length % 3) - 1) * .16), y: canvas.clientHeight * (.52 + (objects.length % 2) * .08), scale: Math.min(.9, Math.max(.55, Math.min(canvas.clientWidth / (w * 2.5), canvas.clientHeight / (h * 2.4)))), rotation: (objects.length % 3 - 1) * .04, z: objects.length + 1 }; objects.push(object); selectedObjectId = object.id; renderObjectEditor(); selectTab('objects'); setStatus(`${objectCatalog.find(item => item.type === type)?.label || '物件'}已放入畫布；可直接拖曳移動。`); refresh(); };
  const applyObjectAction = action => { const object = selectedObject(); if (!object) return; if (action === 'smaller') object.scale = clamp(object.scale * .88, .3, 2.3); if (action === 'larger') object.scale = clamp(object.scale * 1.14, .3, 2.3); if (action === 'rotate-left') object.rotation -= Math.PI / 18; if (action === 'rotate-right') object.rotation += Math.PI / 18; if (action === 'front') object.z = Math.max(...objects.map(item => item.z), 0) + 1; if (action === 'back') object.z = Math.min(...objects.map(item => item.z), 0) - 1; if (action === 'delete') { objects = objects.filter(item => item.id !== object.id); selectedObjectId = null; } if (action === 'deselect') selectedObjectId = null; renderObjectEditor(); setStatus(action === 'delete' ? '物件已移除，畫布仍可繼續創作。' : '物件調整已套用。'); refresh(); };
  $('#paletteSwatches').innerHTML = swatches.map(([label, color]) => `<button type="button" class="palette-swatch" style="--swatch:${color}" data-palette-color="${color}" aria-label="選擇${label}" title="${label}"><span></span></button>`).join('');
  paintButtons('#paletteEmotions', emotions.map(item => [item.label, item.label]), 'palette-emotion', emotions[0].label); paintButtons('#paletteShapes', shapes, 'palette-shape', activeShape); paintButtons('#paletteEffects', effects, 'palette-effect', activeEffect); paintButtons('#paletteMaterials', materials, 'palette-material', activeMaterial); paintButtons('#paletteForces', forces, 'palette-force', activeForce); paintButtons('#paletteLayers', layers, 'palette-layer', activeLayer); paintButtons('#paletteTransforms', transforms, 'palette-transform', sceneMode); renderObjectLibrary();
  $('#paletteControls').addEventListener('click', event => { const tab = event.target.closest('[data-palette-tab]'); if (!tab) return; event.preventDefault(); selectTab(tab.dataset.paletteTab); });
  $('#paletteSwatches').addEventListener('click', event => { const button = event.target.closest('[data-palette-color]'); if (!button) return; activeColor = button.dataset.paletteColor; setStatus('色票已選好；下一次觸碰會使用它。'); });
  $('#paletteCustomToggle').addEventListener('click', () => { $('#paletteCustomColor').classList.toggle('open'); if ($('#paletteCustomColor').classList.contains('open')) $('#paletteCustomColor').focus(); });
  $('#paletteCustomColor').addEventListener('input', event => { activeColor = event.target.value; setStatus('自選顏色已加入；下一次觸碰會使用它。'); });
  $('#paletteEmotions').addEventListener('click', event => { const button = event.target.closest('[data-palette-emotion]'); if (!button) return; activeEmotion = emotions.find(item => item.label === button.dataset.paletteEmotion) || activeEmotion; $$('#paletteEmotions button').forEach(item => item.classList.toggle('active', item === button)); setStatus(`${activeEmotion.symbol} ${activeEmotion.label} 的氛圍已切換；原有筆觸與物件保留。`); refresh(); });
  $('#paletteObjects').addEventListener('click', event => { const button = event.target.closest('[data-palette-object]'); if (button) addObject(button.dataset.paletteObject); });
  $('#paletteObjectEditor').addEventListener('click', event => { const button = event.target.closest('[data-object-action]'); if (button) applyObjectAction(button.dataset.objectAction); });
  $('#paletteShapes').addEventListener('click', event => { const button = event.target.closest('[data-palette-shape]'); if (!button) return; activeShape = button.dataset.paletteShape; syncExisting('shape', activeShape); $$('#paletteShapes button').forEach(item => item.classList.toggle('active', item === button)); setStatus(`自然形狀「${button.textContent}」已套用到目前作品。`); });
  $('#paletteEffects').addEventListener('click', event => { const button = event.target.closest('[data-palette-effect]'); if (!button) return; activeEffect = button.dataset.paletteEffect; syncExisting('effect', activeEffect); $$('#paletteEffects button').forEach(item => item.classList.toggle('active', item === button)); setStatus(`筆觸「${button.textContent}」已作用在畫布。`); });
  $('#paletteMaterials').addEventListener('click', event => { const button = event.target.closest('[data-palette-material]'); if (!button) return; activeMaterial = button.dataset.paletteMaterial; syncExisting('material', activeMaterial); $$('#paletteMaterials button').forEach(item => item.classList.toggle('active', item === button)); setStatus(`材質「${button.textContent}」已作用在畫布。`); refresh(); });
  $('#paletteForces').addEventListener('click', event => { const button = event.target.closest('[data-palette-force]'); if (!button) return; activeForce = button.dataset.paletteForce; motionStopped = activeForce === 'still'; syncExisting('force', activeForce === 'still' ? 'still' : activeForce); $$('#paletteForces button').forEach(item => item.classList.toggle('active', item === button)); setStatus(`環境力「${button.textContent}」已改變畫布元素的運動。`); refresh(); });
  $('#paletteLayers').addEventListener('click', event => { const button = event.target.closest('[data-palette-layer]'); if (!button) return; activeLayer = button.dataset.paletteLayer; syncExisting('layer', activeLayer); $$('#paletteLayers button').forEach(item => item.classList.toggle('active', item === button)); setStatus(`空間「${button.textContent}」已改變元素層次。`); refresh(); });
  $('#paletteTransforms').addEventListener('click', event => { const button = event.target.closest('[data-palette-transform]'); if (!button) return; $$('#paletteTransforms button').forEach(item => item.classList.toggle('active', item === button)); enterScene(button.dataset.paletteTransform); });
  const positionFromEvent = event => { const rect = canvas.getBoundingClientRect(); return { x: clamp(event.clientX - rect.left, 0, rect.width), y: clamp(event.clientY - rect.top, 0, rect.height) }; };
  canvas.addEventListener('pointerdown', event => { event.preventDefault(); const position = positionFromEvent(event); const object = hitObject(position.x, position.y); if (object) { selectedObjectId = object.id; draggingObject = { id: object.id, pointerId: event.pointerId, offsetX: position.x - object.x, offsetY: position.y - object.y }; renderObjectEditor(); setStatus(`${objectCatalog.find(item => item.type === object.type)?.label || '物件'}已選取；拖曳它調整位置。`); try { canvas.setPointerCapture?.(event.pointerId); } catch (_) {} refresh(); return; } selectedObjectId = null; renderObjectEditor(); activePointer = { id: event.pointerId, ...position }; addPoint(activePointer.x, activePointer.y); try { canvas.setPointerCapture?.(event.pointerId); } catch (_) {} setStatus(`${activeEmotion.symbol} 新筆觸已留下，可以拖曳繼續畫。`); });
  canvas.addEventListener('pointermove', event => { if (draggingObject?.pointerId === event.pointerId) { const position = positionFromEvent(event); const object = objects.find(item => item.id === draggingObject.id); if (object) { object.x = position.x - draggingObject.offsetX; object.y = position.y - draggingObject.offsetY; refresh(); } return; } if (!activePointer || activePointer.id !== event.pointerId) return; event.preventDefault(); const next = positionFromEvent(event); addPoint(next.x, next.y, activePointer.x, activePointer.y); activePointer.x = next.x; activePointer.y = next.y; });
  const finishPointer = event => { if (draggingObject?.pointerId === event.pointerId) { canvas.releasePointerCapture?.(event.pointerId); draggingObject = null; return; } if (activePointer?.id === event.pointerId) { canvas.releasePointerCapture?.(event.pointerId); activePointer = null; } };
  canvas.addEventListener('pointerup', finishPointer); canvas.addEventListener('pointercancel', finishPointer); canvas.addEventListener('pointerleave', event => { if (activePointer?.id === event.pointerId || draggingObject?.pointerId === event.pointerId) finishPointer(event); });
  $('#paletteIntensity').addEventListener('input', event => { intensity = Number(event.target.value); setStatus('光影強度已更新。'); refresh(); }); $('#paletteSpeed').addEventListener('input', event => { speed = Number(event.target.value); setStatus('流動速度已更新。'); });
  $('#palettePause').addEventListener('click', event => { paused = !paused; event.target.textContent = paused ? '恢復動畫' : '暫停動畫'; if (!paused) requestAnimationFrame(draw); else draw(performance.now()); });
  $$('[data-palette-action]').forEach(button => button.addEventListener('click', () => { const action = button.dataset.paletteAction; if (action === 'restore') { enterScene('none'); return; } if (action === 'scatter') { points.forEach(point => { point.x += (point.x - canvas.clientWidth / 2) * .18; point.y += (point.y - canvas.clientHeight / 2) * .18; point.force = 'spread'; }); activeForce = 'spread'; } if (action === 'wind') { activeForce = 'wind'; points.forEach(point => { point.force = 'wind'; point.x += 10; }); } if (action === 'rain') { for (let i = 0; i < 10; i++) addPoint(Math.random() * canvas.clientWidth, -10 - Math.random() * 50, Math.random() * canvas.clientWidth, -30); } if (action === 'still') { motionStopped = true; activeForce = 'still'; } if (action === 'grow') { motionStopped = false; points.forEach(point => { point.r = Math.min(64, point.r * 1.12); }); } setStatus(`${button.textContent} 已直接作用在目前作品，畫布仍可繼續繪製。`); refresh(); }));
  $('#paletteRandom').addEventListener('click', () => { const picked = swatches[Math.floor(Math.random() * swatches.length)]; activeColor = picked[1]; setStatus(`換到${picked[0]}；下一次觸碰會使用它。`); });
  $('#paletteClear').addEventListener('click', () => { points = []; objects = []; selectedObjectId = null; renderObjectEditor(); resetSceneMarks(); setStatus('畫布清空了，可以從任何地方開始。'); refresh(); });
  $('#paletteDownload').addEventListener('click', () => { draw(performance.now(), false); const link = document.createElement('a'); link.download = `今日一息-情緒調色盤-${Date.now()}.png`; link.href = canvas.toDataURL('image/png'); link.click(); draw(performance.now()); });
  window.addEventListener('resize', resize); if ('ResizeObserver' in window) new ResizeObserver(() => { if (wrap.clientWidth) resize(); }).observe(wrap);
  resize(); points = []; for (let i = 0; i < 8; i++) addPoint((i + 1) / 9 * canvas.clientWidth, canvas.clientHeight * (.32 + rand(i + 3) * .4)); setStatus('平靜氛圍已準備好；觸碰、拖曳或放入生活物件開始。'); requestAnimationFrame(draw);
}
function switchView(view) {
  $$('.nav-link').forEach(link => link.classList.toggle('active', link.dataset.view === view));
  $$('[data-view-panel]').forEach(panel => {
    const active = panel.id === view;
    panel.hidden = !active;
    panel.classList.toggle('active', active);
  });
  window.scrollTo({ top: 0, behavior: 'smooth' });
  if (view === 'palette') setTimeout(() => window.dispatchEvent(new Event('resize')), 40);
}

function setLibraryMode(mode) {
  const isLong = mode === 'long';
  $('#shortLibrary').hidden = isLong;
  $('.long-reading').hidden = !isLong;
  $$('.library-tab').forEach(tab => {
    const active = tab.dataset.libraryMode === mode;
    tab.classList.toggle('active', active);
    tab.setAttribute('aria-selected', String(active));
  });
}

$('#drawButton').addEventListener('click', drawCard);
$('#reopenWelcome').addEventListener('click', showWelcome);
$('#closeWelcome').addEventListener('click', closeWelcome);
$('#enterToday').addEventListener('click', closeWelcome);
$('#welcomeModal').addEventListener('click', (event) => { if (event.target.id === 'welcomeModal') closeWelcome(); });
document.addEventListener('keydown', (event) => {
  if (event.key !== 'Escape') return;
  if (!$('#welcomeModal').hidden) closeWelcome();
  if (!$('#articleReader').hidden) closeArticle();
});
$$('.nav-link').forEach(link => link.addEventListener('click', () => switchView(link.dataset.view)));
$$('.library-tab').forEach(tab => tab.addEventListener('click', () => setLibraryMode(tab.dataset.libraryMode)));
renderCuriosityFilters();
renderDrawers();
$('#curiosityFilters').addEventListener('click', event => { const button = event.target.closest('[data-drawer-category]'); if (!button) return; curiosityFilter = button.dataset.drawerCategory; renderCuriosityFilters(); renderDrawers(); });
$('#drawerRoom').addEventListener('click', event => { const button = event.target.closest('[data-drawer-id]'); if (button) openDrawer(button.dataset.drawerId); });
$('#randomDrawer').addEventListener('click', () => { const items = window.curiosityData || []; if (items.length) openDrawer(items[Math.floor(Math.random() * items.length)].id); });
$('#drawerReader').addEventListener('click', event => {
  if (event.target.id === 'closeDrawer') { $('#drawerReader').hidden = true; return; }
  const tab = event.target.closest('[data-perspective]');
  if (tab && currentDrawer) { $$('.perspective-tab').forEach(item => item.classList.toggle('active', item === tab)); $('#perspectiveContent').textContent = currentDrawer.perspectives[tab.dataset.perspective]; }
  const related = event.target.closest('[data-related-id]');
  if (related) openDrawer(related.dataset.relatedId);
});
$('#articleSearch').addEventListener('input', (event) => { state.query = event.target.value; renderArticles(); });
$('#filterPills').addEventListener('click', (event) => {
  const button = event.target.closest('[data-category]');
  if (!button) return;
  state.filter = button.dataset.category;
  renderFilters();
  renderArticles();
});
$('#articleGrid').addEventListener('click', (event) => {
  const button = event.target.closest('[data-article-title]');
  if (button) openArticle(button.dataset.articleTitle);
});
$('#longArticleGrid').addEventListener('click', (event) => {
  const button = event.target.closest('[data-long-article-title]');
  if (button) openLongArticle(button.dataset.longArticleTitle);
});
$('#nextMedia').addEventListener('click', () => renderMedia());
$('#mediaGallery').addEventListener('click', event => { const button = event.target.closest('[data-media-index]'); if (button) renderMedia(mediaItems[Number(button.dataset.mediaIndex)]); });
$('.experience-tabs').addEventListener('click', (event) => {
  const tab = event.target.closest('[data-experience]');
  if (tab) renderExperience(tab.dataset.experience);
});
$('#exploreContent').addEventListener('click', (event) => {
  const branch = event.target.closest('[data-branch]');
  const topic = event.target.closest('[data-topic]');
  const rest = event.target.closest('[data-rest-action]');
  if (branch) renderBranchResult(branch.dataset.branch);
  if (topic) renderTopicResult(topic.dataset.topic);
  if (rest) {
    $('#exploreContent').classList.toggle('rest-breathe');
    $('#restNote').textContent = '光圈正在慢慢呼吸；你可以一起，也可以只是看著它。';
  }
});
$('#articleReaderClose').addEventListener('click', closeArticle);
$('#articleReader').addEventListener('click', (event) => { if (event.target.id === 'articleReader') closeArticle(); });
$('#moodAction').addEventListener('click', (event) => {
  const button = event.target.closest('[data-mood-action]');
  if (button) runMoodAction(button.dataset.moodAction);
});
$('#cardsGrid').addEventListener('click', (event) => {
  const action = event.target.closest('[data-card-action]');
  if (!action) return;
  const slot = action.closest('[data-card-index]');
  const index = Number(slot.dataset.cardIndex);
  if (action.dataset.cardAction === 'save') {
    const card = dailyCards[index];
    const key = cardStorageKey(card);
    const legacyKey = `xinli-saved-card-${index}`;
    const saved = isCardSaved(card, index);
    localStorage.setItem(key, saved ? 'no' : 'yes');
    if (saved) localStorage.setItem(legacyKey, 'no');
    renderCards();
    return;
  }
  shareCard(index).catch(() => { $('#drawHint').textContent = '分享沒有完成，但這句話仍然可以留在今天。'; });
});
$('#moodChoices').addEventListener('click', (event) => {
  const button = event.target.closest('[data-mood]');
  if (!button) return;
  localStorage.setItem(`xinli-mood-${todayKey}`, button.dataset.mood);
  renderMood();
  button.classList.remove('mood-pop');
  void button.offsetWidth;
  button.classList.add('mood-pop');
  const action = $('#moodAction [data-mood-action]');
  if (action) {
    runMoodAction(action.dataset.moodAction);
    showMoodBurst(action.dataset.moodAction);
  }
});

$('#dailyReminder').textContent = dailyLine.reminder;
$('#todayDate').textContent = new Intl.DateTimeFormat('zh-Hant-TW', { year: 'numeric', month: 'long', day: 'numeric' }).format(new Date());
renderCards();
renderFilters();
renderArticles();
renderLongArticles();
renderMood();
renderExperience();
setLibraryMode('short');
renderMedia();
renderMediaGallery();
setupPalette();
setTimeout(showWelcome, 260);
