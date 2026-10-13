// Keep the site usable when private browsing or browser settings block local storage.
const memoryStore = new Map();
const safeStorage = {
  getItem(key) {
    try { return window.localStorage.getItem(key); }
    catch { return memoryStore.has(key) ? memoryStore.get(key) : null; }
  },
  setItem(key, value) {
    try { window.localStorage.setItem(key, String(value)); }
    catch { memoryStore.set(key, String(value)); }
  },
  removeItem(key) {
    try { window.localStorage.removeItem(key); }
    catch { memoryStore.delete(key); }
  }
};

const companionLines = (window.dailyContent && window.dailyContent.companionLines) || [];
const dailyExperiences = (window.dailyContent && window.dailyContent.experiences) || [];

const cards = [
  { type: '經典引文', text: '有些事在我們的掌握之中，有些事不在。', source: '愛比克泰德《手冊》1｜本站依古典思想自行概述，非逐字譯文；連結為參考譯本', sourceLink: 'https://en.wikisource.org/wiki/Epictetus,_the_Discourses_as_reported_by_Arrian,_the_Manual,_and_Fragments/Manual', tag: '分辨能掌握的事', art: 'sun' },
  { type: '觀察', text: '窗外的燈亮了，也許有人剛回到家；我們能看見燈，卻看不見他的整天。', source: '今日一息｜AI 協助撰寫原創文字', tag: '看見與未知', art: 'leaf' },
  { type: '生活', text: '熱水壺停下來的聲音，讓廚房忽然安靜。這是今天的一個小小轉場。', source: '今日一息｜AI 協助撰寫原創文字', tag: '廚房聲音', art: 'cloud' },
  { type: '閱讀', text: '在書頁邊緣寫下一個問號，就能留下當時沒想通的地方。', source: '今日一息｜AI 協助撰寫原創文字', tag: '閱讀的痕跡', art: 'flower' },
  { type: '經典引文', text: '向內探看；善的泉源就在內心，只要你願意挖掘，它總會湧出。', source: '馬可·奧理略《沉思錄》7.59｜本站依古典思想自行概述，非逐字譯文；連結為參考譯本', sourceLink: 'https://en.wikisource.org/wiki/The_Meditations_of_the_Emperor_Marcus_Antoninus/Book_7', tag: '往內留一點空間', art: 'star' }
];
cards.push(...(window.freshCards || window.extraCards || []));
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
    const storedIndexes = JSON.parse(safeStorage.getItem(dailyCardsKey) || 'null');
    if (Array.isArray(storedIndexes) && storedIndexes.length === Math.min(5, cards.length)
      && new Set(storedIndexes).size === storedIndexes.length
      && storedIndexes.every(index => Number.isInteger(index) && cards[index])) {
      return storedIndexes.map(index => cards[index]);
    }
  } catch (_) { /* ignore malformed local storage and create a fresh daily set */ }
  const selected = pickRandomCards();
  safeStorage.setItem(dailyCardsKey, JSON.stringify(selected.map(card => cards.indexOf(card))));
  safeStorage.removeItem(dailyProgressKey);
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
  { title: 'Mindfulness｜Mental Health Foundation', category: '正念', language: 'English', source: 'Mental Health Foundation', description: '介紹正念如何成為日常覺察練習，並提醒使用者依自己的狀態選擇適合的方式。', url: 'https://www.mentalhealth.org.uk/explore-mental-health/a-z-topics/mindfulness', status: '公開文章索引', rights: '本站僅作來源索引，請依原站條款使用', art: 'star' },
  { title: '心理健康資源與支持', category: '心理', language: '中文', source: '衛生福利部心理健康司', description: '台灣官方心理健康資源入口，提供心理健康、支持與求助資訊的公開索引。', url: 'https://dep.mohw.gov.tw/DOMHAOH/', status: '官方資源索引', rights: '官方來源索引；請依原站資訊使用', art: 'heart' },
  { title: '正念', category: '正念', language: '中文', source: '中文維基百科', description: '介紹將注意力集中於當下的心理過程，以及它與禪、冥想和現代心理健康實踐的關聯。', url: 'https://zh.wikipedia.org/wiki/%E6%AD%A3%E5%BF%B5', status: '外部參考連結', rights: '外部百科參考連結；本站另撰簡介，未轉載條目', art: 'leaf' },
  { title: '森林浴', category: '自然', language: '中文', source: '中文維基百科', description: '從感官體驗與自然接觸的角度，認識森林浴與森林療癒的概念、活動方式與研究脈絡。', url: 'https://zh.wikipedia.org/wiki/%E6%A3%AE%E6%9E%97%E6%B5%B4', status: '外部參考連結', rights: '外部百科參考連結；本站另撰簡介，未轉載條目', art: 'tree' },
  { title: '園藝療法', category: '身體', language: '繁體中文', source: '農業部農業知識入口網', description: '臺灣農業部介紹園藝活動、園藝療育與由專業人員規劃的園藝治療有何不同；並非所有種花活動都具治療效果。', url: 'https://kmweb.moa.gov.tw/subject/subject.php?id=49982&print=Y', status: '官方知識資料', rights: '農業部政府網站外部參考連結；本站自行撰述，未轉載原文', art: 'flower' },
  { title: '旅行', category: '旅行', language: '中文', source: '中文維基百科', description: '從位移、交通方式與旅遊概念切入，讀一篇不急著抵達目的地的知識小文。', url: 'https://zh.wikipedia.org/wiki/%E6%97%85%E8%A1%8C', status: '外部參考連結', rights: '外部百科參考連結；本站另撰簡介，未轉載條目', art: 'plane' },
  { title: '哲學', category: '哲學', language: '中文', source: '中文維基百科', description: '哲學的主題概覽，包含主要分支、歷史時期與思想家，適合想慢慢思考一個問題的時候。', url: 'https://zh.wikipedia.org/wiki/%E5%93%B2%E5%AD%B8', status: '外部參考連結', rights: '外部百科參考連結；本站另撰簡介，未轉載條目', art: 'book' },
  { title: '佛教', category: '佛學', language: '中文', source: '中文維基百科', description: '認識源於古印度的宗教與思想傳統，從基本教義、歷史發展到不同地區的傳播。', url: 'https://zh.wikipedia.org/wiki/%E4%BD%9B%E6%95%99', status: '外部參考連結', rights: '外部百科參考連結；本站另撰簡介，未轉載條目', art: 'lotus' },
  { title: '宗教', category: '宗教', language: '中文', source: '中文維基百科', description: '以百科概覽的方式，認識宗教的定義、教儀、教團、起源理論與社會影響。', url: 'https://zh.wikipedia.org/wiki/%E5%AE%97%E6%95%99', status: '外部參考連結', rights: '外部百科參考連結；本站另撰簡介，未轉載條目', art: 'sun' },
  { title: '海洋', category: '自然', language: '中文', source: '中文維基百科', description: '從海水、氣候與生態到人類利用，讀一篇把視線帶向更大尺度的自然知識。', url: 'https://zh.wikipedia.org/wiki/%E6%B5%B7%E6%B4%8B', status: '外部參考連結', rights: '外部百科參考連結；本站另撰簡介，未轉載條目', art: 'wave' },
  { title: '曼荼羅（Mandala）', category: '藝術與文化', language: '中文', source: '大都會藝術博物館（The Met）', description: '認識印度與藏傳佛教藝術中的曼荼羅圖像、宇宙象徵及儀式脈絡；日常圓形塗鴉不必視為宗教修行或治療。', url: 'https://www.metmuseum.org/zh/met-publications/mandalas-mapping-the-buddhist-art-of-tibet', status: '博物館藝術史資料', rights: '博物館出版品僅外部參考連結；本站未重製原文或藝術圖像', art: 'mandala' },
  { title: '音樂治療', category: '身體', language: '中文', source: '中文維基百科', description: '介紹以樂音與節奏回應生理或心理需求的有計畫療程，並認識它的不同治療取向。', url: 'https://zh.wikipedia.org/wiki/%E9%9F%B3%E6%A8%82%E6%B2%BB%E7%99%82', status: '外部參考連結', rights: '外部百科參考連結；本站另撰簡介，未轉載條目', art: 'music' },
  { title: 'Stress | NCCIH', category: '壓力', language: 'English', source: 'NIH／NCCIH', description: '美國國家補充與整合健康中心介紹壓力反應、放鬆方法、研究限制與需要專業支持的時機。', url: 'https://www.nccih.nih.gov/health/stress', status: '官方健康知識', rights: '美國政府衛教外部連結；本站自行整理，非醫療建議', art: 'sun' },
  { title: 'Why Is Sleep Important? | NHLBI', category: '睡眠', language: 'English', source: 'NIH／NHLBI', description: '美國國家心肺暨血液研究所說明睡眠對學習記憶、健康及日常功能的重要性與研究限制。', url: 'https://www.nhlbi.nih.gov/health/sleep/why-sleep-important', status: '官方健康知識', rights: '美國政府衛教外部連結；本站自行整理，非醫療建議', art: 'moon' }
];
articles.push(...(window.shortArticlesData || []), ...(window.additionalShortReads || []));

const articleBodies = {
  '壓力來的時候，先做一件能讓自己回到當下的事': ['壓力很大時，腦中常常同時出現很多待辦事項。先不用急著解決全部，找一個感覺得到的東西：腳踩著地面的重量、手心的溫度，或眼前一個顏色。', '當注意力回到當下，事情不一定立刻變少，但你會多一點選擇。接著只問自己：「下一個最小、最溫柔的動作是什麼？」喝水、伸展，或把一件事寫下來，都算是開始。'],
  '一份給忙碌日子的呼吸與休息提醒': ['忙碌不代表你必須一直緊繃。把肩膀放下，讓吸氣自然進來，再讓吐氣比吸氣稍微長一點。你不需要做得很標準，只要感覺自己正在停留。', '休息也可以只有一分鐘。離開螢幕、看一眼窗外，或把雙手覆在胸口，都是在告訴身體：「現在可以不用趕路。」'],
  '睡前，把明天交還給明天': ['睡前的腦袋喜歡把未完成的事重新播放。拿一張紙寫下三件掛念的事，再在旁邊寫一句：「我明天會再處理。」這不是逃避，而是替今天畫出邊界。', '接著把房間的光線調暗，讓身體知道一天正在收尾。如果還睡不著，也不必責怪自己；安靜地躺著、聽呼吸，本身就是休息的一部分。'],
  '為自己留一條不必立刻回覆的界線': ['訊息出現時，你不一定要立刻回覆。可以先說：「我看到了，晚一點整理好再回你。」清楚的時間界線，往往比勉強自己答應更多事情更溫柔。', '界線不是把人推開，而是讓關係有足夠空間呼吸。當你知道自己的容量，也比較能用真實而穩定的方式陪伴別人。'],
  'Doing What Matters in Times of Stress': ['When stress fills the whole room, choose one small anchor. Notice five things you can see, four things you can feel, or one sound that is already here. The aim is not to force calm, but to reconnect with the present moment.', 'Then choose one action that reflects what matters to you today: kindness, steadiness, rest, or connection. A small action can be enough when the day feels too large.'],
  'Every Mind Matters: Sleep': ['睡眠不是一場需要完美達成的考試。比起突然改變所有習慣，可以先固定一個「準備睡覺」的訊號，例如同一盞燈、幾頁書，或一段安靜音樂。', '如果今晚沒有睡得理想，明天也不需要用責備補償。回到規律的起床時間、白天接觸自然光，並把注意力放在可調整的一小步。'],
  'Mindfulness｜Mental Health Foundation': ['正念可以很生活化：刷牙時感覺水流，走路時感覺腳步，喝茶時留意溫度。當思緒跑遠了，發現它，再把注意力帶回來，就已經完成一次練習。', '正念不是要求自己永遠平靜，也不是把情緒趕走。它更像一盞小燈，讓你看見此刻的感受，並用少一點自動反應來照顧自己。'],
  '心理健康資源與支持': ['照顧心理健康不只是在很辛苦時才需要。找一個可信任的人聊聊、讓日常保有睡眠與吃飯的節奏，或記下每天一個感受，都可以是支持自己的方式。', '如果困擾已經影響生活，尋求專業協助是合理而勇敢的選擇。本站提供的是日常陪伴，不能取代醫療、心理或危機服務；需要時請向當地專業單位求助。'],
  '正念': ['正念是一種把注意力帶回當下的練習。你可以先注意一個聲音、一個觸感，或呼吸進出鼻腔的感覺。當你發現自己分心，不需要生氣，只要再回來。', '長一點的練習可以讓人更熟悉自己的內在變化，但短短十秒也有意義。重點不是清空腦袋，而是多一點看見與選擇。'],
  '森林浴': ['走進樹木較多的地方，不一定要完成一條路線。慢慢走，感覺腳下的地面，觀察樹皮的紋理與光影的移動，讓感官先於思考。', '自然接觸不能取代治療，但可以成為日常恢復的一個環節。若無法去森林，也可以在住家附近找一棵樹，花幾分鐘和它一起安靜。'],
  '園藝療法': ['照顧植物可以是一種有節奏的日常活動：看土壤、澆水、剪掉枯葉，再等待新的變化。一般園藝活動與有專業人員、個別目標的園藝治療不同，不能保證治療效果。', '沒有花園也沒關係，一盆香草或照顧窗台植物，都可以是日常觀察練習。若涉及健康問題，仍須合格專業人員評估。'],
  '旅行': ['旅行有時不是去很遠的地方，而是讓熟悉的路線多一個角度。換一條街回家、在附近公園坐十分鐘，或觀察一間店的門面，都能讓日常重新有細節。', '真正的休息不一定要塞滿行程。留一段沒有目的的時間，讓腳步慢下來，目的地就不只是一個地名，也是一種重新感受世界的方式。'],
  '哲學': ['哲學可以從一個小問題開始：「什麼是我今天能負責的事？」把問題寫下來，不急著找到唯一答案，先看看它如何改變你看待眼前情境的方式。', '思考不是把生活變得更複雜，而是幫我們分辨哪些價值值得守護。今天選一個你重視的詞，例如誠實、安定或善意，讓一個小行動靠近它。'],
  '佛教': ['佛教思想中常談到對當下與變化的觀察。用日常語言說，就是承認感受會來也會走，不必把某一刻的痛苦當成永遠的自己。', '閱讀任何宗教或思想，都可以保有自己的提問與界線。這篇短文只提供溫和的知識入口，不代表任何宗教立場，也不要求你接受特定答案。'],
  '宗教': ['宗教對不同的人可能是信仰、文化、家庭記憶或思考世界的方式。理解它時，可以先聽見多種經驗，而不是急著把所有人放進同一個框架。', '我們可以尊重他人的信念，也保留自己選擇距離的權利。溫柔的對話不必消除差異，只要讓彼此都能被完整地看見。'],
  '海洋': ['海洋的尺度很大，卻也和每天的生活相連。潮汐、氣候、食物與許多生命，都在一個不容易被看見的循環裡互相牽動。', '當你覺得自己的煩惱佔滿視野，可以想像站在海邊看一會兒。問題仍然存在，但世界也還有更寬的背景，容得下你慢慢呼吸。'],
  '曼荼羅（Mandala）': ['曼荼羅在佛教尤其藏傳佛教藝術和儀式中，常以圖像呈現宇宙觀、諸尊及象徵性的空間結構。不同傳統有不同的教義與製作脈絡，不宜簡化為一般的心理治療圖卡。', '日常畫圓形、對稱或反覆圖案也可以是個人創作活動，但無須自稱宗教修行，亦不能保證具有臨床療效。理解原有文化的脈絡，再選擇自己喜歡的畫畫方式。'],
  '音樂治療': ['音樂會和呼吸、記憶與身體感受連在一起。今天選一首不需要解釋的歌，讓它在背景播放，注意自己在某個段落是放鬆、想動，還是想安靜。', '日常聽音樂可以支持情緒，但若涉及治療需要由合資格專業人員評估。你也可以只把音樂當作陪伴，不必要求它立刻改變心情。'],
  'Stress | NCCIH': ['Stress is a message from the body and mind, not a personal failure. Start by noticing a pattern: when does tension rise, and what helps even a little? A glass of water, a pause, or a conversation can be useful data.', 'Healthy routines are built through repeatable choices, not heroic effort. Pick one small routine that supports your energy and allow it to be imperfect while it becomes familiar.'],
  'Why Is Sleep Important? | NHLBI': ['睡眠讓身體與心智有機會整理一天的經驗。夢境有時鮮明、有時模糊，不必急著為每個夢尋找固定的象徵或答案。', '若睡眠困擾持續影響日常，請尋求醫療或專業協助。這篇短文只提供一般知識與溫和提醒，不是對個人狀況的診斷。']
};
Object.assign(articleBodies, window.shortArticleBodies || {}, window.additionalShortBodies || {});

// Avoid showing an outdated, unreviewed fallback article if the data script fails to load.
const defaultLongArticles = [];
const longArticles = [...(window.longArticlesData || defaultLongArticles), ...(window.additionalLongReads || [])];
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
  $('#mediaCredit').innerHTML = `${item.credit} · <a href="${item.sourceUrl}" target="_blank" rel="noopener noreferrer">${item.source}</a> · ${item.license}`;
}

function renderMediaGallery() {
  if (!$('#mediaGallery')) return;
  $('#mediaGallery').innerHTML = mediaItems.map((item, index) => `<button class="media-thumb" type="button" data-media-index="${index}" aria-label="查看 ${item.title}"><img src="${item.file}" alt="" loading="lazy" /><span>${item.title}</span></button>`).join('');
}

function mediaMarkup(item = pickMedia()) {
  if (!item) return '';
  return `<figure class="reader-media"><img src="${item.file}" alt="${item.alt}" /><figcaption>${item.title} · ${item.credit} · <a href="${item.sourceUrl}" target="_blank" rel="noopener noreferrer">來源與授權</a></figcaption></figure>`;
}

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
const storedProgress = Number(safeStorage.getItem(dailyProgressKey) || 0);
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
  return safeStorage.getItem(cardStorageKey(card)) === 'yes';
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
        <div class="card-source"><strong>${card.sourceLink ? `<a href="${card.sourceLink}" target="_blank" rel="noopener noreferrer">${card.source}</a>` : card.source}</strong></div>
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
  safeStorage.setItem(dailyProgressKey, String(state.revealed));
  renderCards();
  const drawPanel = $('#drawPanel');
  drawPanel.classList.remove('draw-bloom');
  void drawPanel.offsetWidth;
  drawPanel.classList.add('draw-bloom');
  const slot = $(`.card-slot[data-card-index="${state.revealed - 1}"]`);
  requestAnimationFrame(() => slot.classList.add('revealed'));
  slot.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });
}

function renderDailyRecommendation() {
  const host = $('#dailyRecommendation');
  if (!host) return;
  const pool = [
    ...articles.map(article => ({ ...article, kind: 'short' })),
    ...longArticles.map(article => ({ ...article, kind: 'long' }))
  ];
  if (!pool.length) return;
  const picked = pool[Math.floor(Math.random() * pool.length)];
  const image = window.PausePhotos?.coverMarkup(picked) || '';
  host.innerHTML = `<div class="recommendation-art">${image}</div><div class="recommendation-copy"><p class="section-kicker">TODAY'S READING ／ 隨機的一篇</p><h2></h2><p class="recommendation-description"></p><button class="recommendation-open" type="button">今天先讀這篇 ↗</button></div>`;
  host.querySelector('h2').textContent = picked.title;
  host.querySelector('.recommendation-description').textContent = picked.description;
  host.querySelector('button').addEventListener('click', () => picked.kind === 'long' ? openLongArticle(picked.title) : openArticle(picked.title));
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
    ${window.PausePhotos?.coverMarkup(article) || `<span class="article-art article-art-${article.art}" aria-hidden="true"></span>`}
    <div class="article-meta"><span>${article.category}</span><span>${article.language}</span></div>
    <h2>${article.title}</h2>
    <p>${article.description}</p>
    <div class="article-card-footer"><span>本站站內短文<br />參考：${article.source}<br />${article.rights}</span><button class="article-link read-article" type="button" data-article-title="${article.title}">在本站閱讀 ↗</button></div>
  </article>`).join('');
  $('#emptyState').hidden = visible.length !== 0;
}

function renderLongArticles() {
  $('#longArticleGrid').innerHTML = longArticles.map(article => `<article class="long-article-card">
    ${window.PausePhotos?.coverMarkup(article) || `<span class="article-art article-art-${article.art}" aria-hidden="true"></span>`}
    <p class="long-article-label">${article.category} · ${article.language}</p>
    <h3>${article.title}</h3>
    <p>${article.description}</p>
    <div class="long-article-footer"><span>${article.sources.length ? `${article.sources.length} 個可查證來源` : '原創散文'}<br />${article.note}</span><button class="article-link read-long-article" type="button" data-long-article-title="${article.title}">開始閱讀 →</button></div>
  </article>`).join('');
}

function renderMood() {
  const chosen = safeStorage.getItem(`xinli-mood-${todayKey}`) || '';
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
  $('#articleReaderBody').innerHTML = (window.PausePhotos?.readerMarkup(article) || mediaMarkup()) + (articleBodies[title] || [article.description]).map(paragraph => `<p>${paragraph}</p>`).join('');
  const sourceElement = $('#articleReaderSource');
  sourceElement.textContent = '本文由「今日一息」重新撰寫；主題參考：';
  if (article.url && /^https:\/\//.test(article.url)) {
    const link = document.createElement('a');
    link.href = article.url;
    link.textContent = article.source;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    sourceElement.appendChild(link);
  } else {
    sourceElement.appendChild(document.createTextNode(article.source));
  }
  sourceElement.appendChild(document.createTextNode(`。${article.rights}。本站內容為日常閱讀，非醫療診斷或治療建議。`));
  $('#articleReader').hidden = false;
  window.PausePhotos?.start(article);
  document.body.classList.add('modal-open');
  setTimeout(() => $('#articleReaderClose').focus(), 40);
}

function openLongArticle(title) {
  const article = longArticles.find(item => item.title === title);
  if (!article) return;
  $('#articleReaderArt').className = `article-reader-art article-art-${article.art}`;
  $('#articleReaderMeta').textContent = `${article.category} · ${article.language} · 長篇原創整理`;
  $('#articleReaderTitle').textContent = article.title;
  $('#articleReaderBody').innerHTML = (window.PausePhotos?.readerMarkup(article) || mediaMarkup()) + article.sections.map(section => `<section class="long-reader-section"><h3>${section.heading}</h3><p>${section.text}</p></section>`).join('');
  $('#articleReaderSource').innerHTML = `<strong>${article.note}</strong><br />內容由「今日一息」自行撰寫與整理，未複製下列來源全文。${article.sources.length ? `資料來源：${article.sources.map(source => `<a href="${source.url}" target="_blank" rel="noopener noreferrer">${source.label}</a>（${source.rights}）`).join('；')}` : '此篇為生活觀察與文學性敘述，不以研究證據主張心理療效。'}`;
  $('#articleReader').hidden = false;
  window.PausePhotos?.start(article);
  document.body.classList.add('modal-open');
  setTimeout(() => $('#articleReaderClose').focus(), 40);
}

function closeArticle() {
  window.PausePhotos?.stop();
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
  $('#drawerRoom').innerHTML = items.map((item, index) => `<button class="drawer-card drawer-size-${(index % 3) + 1}" type="button" data-drawer-id="${item.id}"><span class="drawer-handle"></span><small>${item.category}</small><strong>${item.question}</strong><i>${safeStorage.getItem(`xinli-drawer-${item.id}`) === 'yes' ? '已探索' : '拉開抽屜'}</i></button>`).join('');
}

function openDrawer(id) {
  const item = (window.curiosityData || []).find(entry => entry.id === id);
  if (!item) return;
  currentDrawer = item;
  const relatedItems = (window.curiosityData || []).filter(entry => entry.id !== item.id).sort((a, b) => (a.category === item.category ? -1 : 1) - (b.category === item.category ? -1 : 1)).slice(0, 3);
  safeStorage.setItem(`xinli-drawer-${id}`, 'yes');
  $('#drawerReader').hidden = false;
  $('#drawerReader').innerHTML = `<div class="drawer-reader-head"><span>${item.category}</span><button type="button" id="closeDrawer">收回抽屜 ×</button></div><h2>${item.question}</h2><p class="drawer-answer">${item.answer}</p><div class="perspective-tabs">${Object.keys(item.perspectives).map((key, index) => `<button type="button" class="perspective-tab ${index === 0 ? 'active' : ''}" data-perspective="${key}">${key}</button>`).join('')}</div><div class="perspective-content" id="perspectiveContent">${Object.values(item.perspectives)[0]}</div><div class="drawer-related"><small>沿著好奇心繼續｜每一格都可以再打開</small>${relatedItems.map(next => `<button type="button" data-related-id="${next.id}">${next.question} →</button>`).join('')}</div><p class="drawer-source">參考來源：<a href="${item.sourceUrl}" target="_blank" rel="noopener noreferrer">${item.sourceLabel}</a>。本文為本站自行整理，不把來源文章全文搬入。</p>`;
  $('#drawerReader').scrollIntoView({ behavior: 'smooth', block: 'start' });
  renderDrawers();
}

// The original geometric palette engine was replaced by palette-world.js.
// Keep no inactive renderer on the public page: there is one studio source of truth.
function switchView(view) {
  $$('.nav-link').forEach(link => link.classList.toggle('active', link.dataset.view === view));
  $$('[data-view-panel]').forEach(panel => {
    const active = panel.id === view;
    panel.hidden = !active;
    panel.classList.toggle('active', active);
  });
  window.scrollTo({ top: 0, behavior: 'smooth' });
  window.dispatchEvent(new Event('palette-view-change'));
  window.dispatchEvent(new CustomEvent('pause:companion',{detail:{text:view==='read'?'隨手翻開一篇也好。':view==='curiosity'?'一個疑問可以先留著。':view==='palette'?'讓筆觸慢慢留在畫裡。':view==='holding'?'這裡不需要向任何人交代。':'這裡可以停一下。',kind:view==='read'?'paper':view==='palette'?'leaf':view==='holding'?'moon':'light'}}));
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
    window.PauseRestStage?.open(visitExperience?.rest);
    window.dispatchEvent(new CustomEvent('pause:companion-close'));
    $('#restNote').textContent = '每個休息題目都有不同的畫面，想停就隨時關閉。';
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
    safeStorage.setItem(key, saved ? 'no' : 'yes');
    if (saved) safeStorage.setItem(legacyKey, 'no');
    renderCards();
    return;
  }
  shareCard(index).catch(() => { $('#drawHint').textContent = '分享沒有完成，但這句話仍然可以留在今天。'; });
});
$('#moodChoices').addEventListener('click', (event) => {
  const button = event.target.closest('[data-mood]');
  if (!button) return;
  safeStorage.setItem(`xinli-mood-${todayKey}`, button.dataset.mood);
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
window.PausePhotos?.register([...articles,...longArticles]);
renderCards();
renderFilters();
renderArticles();
renderLongArticles();
renderMood();
renderExperience();
setLibraryMode('short');
renderMedia();
renderMediaGallery();
window.setupPaletteNew?.();
renderDailyRecommendation();
setTimeout(showWelcome, 260);
