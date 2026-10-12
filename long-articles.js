const section = (heading, text) => ({ heading, text });
const source = (label, url, rights) => ({ label, url, rights });

window.longArticlesData = [
  {
    title: '當身體一直處在警覺裡：理解創傷反應與復原的入口', category: '身心健康', language: '繁體中文', art: 'heart',
    description: '從睡眠、情緒、身體感受與人際互動，認識壓力事件之後可能出現的反應；不替你診斷，只提供一張更安全的觀察地圖。', note: '本站原創整理｜非醫療診斷、非治療建議',
    sources: [source('WHO｜Doing What Matters in Times of Stress', 'https://www.who.int/publications/i/item/9789240003927', 'CC BY-NC-SA 3.0 IGO；本站未複製原文'), source('NHS｜PTSD', 'https://www.nhs.uk/mental-health/conditions/ptsd-post-traumatic-stress-disorder/', 'NHS Crown Copyright；本站未複製原文'), source('SAMHSA｜Trauma-Informed Approaches', 'https://www.samhsa.gov/mental-health/trauma-violence/trauma-informed-approaches-programs', '美國政府公開資訊；本站自行整理')],
    sections: [section('先說在前面：察覺不是替自己下診斷', '創傷反應的樣子、時間與需要因人而異。看到某個症狀，不代表你就患有 PTSD；這篇文章只是幫你把模糊的不舒服分成可以觀察的方向。'), section('身體可能先替你發出訊號', '睡不好、容易被聲音嚇到、心跳加快、肌肉緊繃、胃口改變，都可能值得記錄。也要記得，這些感受有很多身體原因，不能只靠文章判斷。'), section('用安全感而不是逼迫自己恢復', '固定吃飯與睡覺時間、找一位可信任的人、記下觸發情境，都是可能的支持。復原不是把自己逼回事件以前的樣子。'), section('什麼時候應該求助？', '若反應持續影響工作、睡眠、關係或安全，請找醫師或心理健康專業人員；若有傷害自己或他人的念頭，請立即聯絡當地緊急服務。')]
  },
  {
    title: '把夜晚還給身體：睡眠、光線與生理時鐘的日常指南', category: '睡眠與身體', language: '繁體中文', art: 'moon',
    description: '理解晝夜節律、光線、咖啡因與生活節奏如何影響睡意，從可持續的小習慣開始觀察自己的夜晚。', note: '本站原創整理｜一般健康教育，非醫療建議',
    sources: [source('NIGMS｜Circadian Rhythms', 'https://www.nigms.nih.gov/education/fact-sheets/Pages/circadian-rhythms', '美國 NIH 官方科普；本站自行改寫'), source('NHLBI｜Your Sleep/Wake Cycle', 'https://www.nhlbi.nih.gov/health/sleep/sleep-wake-cycle', '美國 NIH 官方資訊；本站未複製原文'), source('CDC｜About Sleep', 'https://www.cdc.gov/sleep/about/index.html', '美國政府公開資訊；本站自行整理')],
    sections: [section('身體時鐘不是一個固定鬧鐘', '晝夜節律約以一天循環，睡眠壓力則會隨清醒時間累積。光暗、進食、活動、壓力與社交時間，都可能一起影響身體的節奏。'), section('光線如何把白天與夜晚寫進大腦', '眼睛接收的光線會向身體傳遞時間訊號。晚間降低強光、早晨接觸自然光，可能讓作息更容易觀察與調整，但每個人的自然型態不同。'), section('時差與晚睡：為什麼身體會對不上時間', '旅行跨時區、輪班或長期日夜顛倒，都可能造成內外時鐘失配。可以記錄上床、起床、午睡、咖啡因與白天精神，不急著責怪自己。'), section('讓睡眠衛生回到日常', '固定起床時間、睡前降低刺激、下午後留意咖啡因、臥室保持安靜舒適，都是低風險方向。若長期失眠、異常嗜睡或疑似呼吸中止，請諮詢醫療專業。')]
  },
  {
    title: '吃得穩，心情才有餘裕？從食物、能量到情緒', category: '飲食與情緒', language: '繁體中文', art: 'sun',
    description: '從餐盤、能量與研究限制出發，理解飲食與情緒的可能關聯，不把單一食物說成解決所有問題的答案。', note: '本站原創整理｜營養科普，非個人化飲食建議',
    sources: [source('WHO｜Healthy diet', 'https://www.who.int/news-room/fact-sheets/detail/healthy-diet', 'WHO 官方資料；依使用條款自行改寫'), source('OpenStax｜Nutrition and Diet', 'https://openstax.org/books/anatomy-and-physiology-2e/pages/24-7-nutrition-and-diet', '外部教材參考連結；本站未轉載教材'), source('BMJ／PMC｜Food and mood', 'https://pmc.ncbi.nlm.nih.gov/articles/PMC7322666/', '學術引用與自行摘要；不重製圖表')],
    sections: [section('能量不是意志力，情緒也不只由食物決定', '疲倦或低落可能和睡眠、壓力、疾病、關係與環境一起有關。不要把某種感受簡化成單一營養素不足。'), section('均衡、足夠與穩定比追逐神奇食物重要', '全穀、蔬果、豆類、蛋白質與適量脂肪各有不同角色。規律進餐可以是觀察身體的起點，但不需要追求完美餐盤。'), section('研究看見關聯，不等於食物能治療情緒', '較健康的飲食型態與較佳心理健康指標有時呈關聯，但研究仍受生活方式與社會因素影響。不要把群體研究當成個人治療。'), section('把證據轉成溫和行動', '可以先增加水分、蔬果或規律用餐，而不是大幅限制飲食。若食慾、體重或情緒明顯改變，請找醫師或註冊營養師。')]
  },
  {
    title: '把身體動起來：日常活動與心理健康的溫和指南', category: '運動與身心', language: '繁體中文', art: 'leaf',
    description: '不以外表或競賽衡量身體活動，從步行、家務、伸展與遊戲理解運動如何支持睡眠、情緒與生活節奏。', note: '本站原創整理｜一般健康資訊，非運動處方',
    sources: [source('WHO｜Physical activity', 'https://www.who.int/news-room/fact-sheets/detail/physical-activity', 'WHO 官方資料；本站自行改寫'), source('WHO｜Guidelines on physical activity and sedentary behaviour', 'https://www.who.int/publications/i/item/9789240015128', 'WHO 指南；本站以自己的文字摘要，不主張重製授權'), source('CDC｜Physical Activity Boosts Brain Health', 'https://www.cdc.gov/physical-activity/features/boost-brain-health.html', '美國政府公開資訊；本站未使用標誌')],
    sections: [section('什麼都算：運動不只在健身房', '步行、騎車、家務、工作中的移動、遊戲與休閒活動，都可以是身體活動。任何活動通常都比完全不動更接近可持續的開始。'), section('把指南拆成可以生活的大小', '每週活動量是公共衛生參考，不是每個人都必須達成的考試。可以拆成短散步、通勤多走一站，依能力與喜好慢慢累積。'), section('運動與情緒：可能有幫助，不是治療保證', '研究常觀察到活動與較佳情緒、睡眠或認知健康相關，但運動不取代心理治療、藥物或危機處置。'), section('先照顧安全與身體界線', '循序漸進、留意疼痛與不適；若有胸痛、昏厥、嚴重呼吸困難或急性受傷，應停止並求醫。')]
  },
  {
    title: '在城市裡找回自然：綠地與日常放鬆', category: '自然與環境', language: '繁體中文', art: 'tree',
    description: '從公園、樹蔭、藍綠空間與社區可近性出發，理解自然接觸可能如何支持放鬆，也看見研究的不確定與公平議題。', note: '本站原創整理｜環境健康科普，非治療建議',
    sources: [source('WHO Europe｜Urban green spaces and health', 'https://www.who.int/europe/publications/i/item/WHO-EURO-2016-3352-43111-60341', 'WHO 官方報告；本站自行摘要'), source('EEA｜Health and well-being benefits of urban green space', 'https://www.eea.europa.eu/en/analysis/publications/who-benefits-from-nature-in-cities-social-inequalities-in-access-to-urban-green-and-blue-spaces-across-europe/health-and-well-being-benefits-of-urban-green-space', 'EEA 多數資料採 CC BY；逐項核對第三方素材'), source('PMC｜Urban Green Space and Its Impact on Human Health', 'https://pmc.ncbi.nlm.nih.gov/articles/PMC5876990/', '學術引用與自行整理；不重製圖表')],
    sections: [section('自然接觸可以很小', '公園、綠蔭街道、住家植物或窗外天空，都可以成為觀察環境的入口。放鬆是主觀經驗，不是保證的治療效果。'), section('研究有支持，也有不確定', '部分研究把綠地與情緒、活動量、社交或環境舒適度連在一起，但研究地點、時間與族群不同，結果不會完全一致。'), section('把綠意放進自己的日常', '可以在安全可及的地方散步、看樹影或和同伴坐一會兒；不便外出時，也可以照顧室內植物或觀看自然景象。'), section('自然資源也關乎公平', '距離、交通、無障礙、費用與安全感會影響誰能享受自然。不要把環境差異簡化成個人不夠努力。')]
  },
  {
    title: '一個人不等於孤單：孤獨、隔離與重新連結', category: '關係與社會', language: '繁體中文', art: 'circle',
    description: '分清楚獨處、主觀孤獨與客觀社會隔離，從個人感受延伸到社區、交通、收入與公共空間。', note: '本站原創整理｜公共衛生科普，非個人風險評估',
    sources: [source('WHO｜From loneliness to social connection', 'https://www.who.int/groups/commission-on-social-connection/report', 'WHO 官方資料；本站自行改寫'), source('CDC｜Health Effects of Social Isolation and Loneliness', 'https://www.cdc.gov/social-connectedness/risk-factors/index.html', '美國政府公開資訊；本站未複製原文'), source('U.S. Surgeon General｜Social Connection Advisory', 'https://www.hhs.gov/sites/default/files/surgeon-general-social-connection-advisory.pdf', '美國政府報告；引用框架並核對第三方內容')],
    sections: [section('獨處、孤獨與隔離不是同一件事', '獨處可以是主動選擇；孤獨比較接近理想與實際連結的落差；社會隔離則描述接觸與支持較少的客觀狀況。身邊有人也可能感到孤獨。'), section('連結不只是多交朋友', '健康、搬遷、失業、歧視、交通與社區設施，都會影響人是否有機會連結。關係品質、被理解與安全感也很重要。'), section('研究談的是群體關聯，不是你的命運', '公共衛生研究把社會連結不足與一些健康結果連在一起，但統計不能預測每個人的人生，也不該用來製造恐慌。'), section('從小而可行的連結開始', '可以聯繫一位可信任的人、參加低壓力活動、使用圖書館或社區空間。需要的是陪伴、實質協助或安全感，答案不一定都是社交。')]
  },
  {
    title: '相信自己之前：看見認知偏誤，做出更穩健的選擇', category: '心理與思考', language: '繁體中文', art: 'star',
    description: '認識確認偏誤、過度確信與自我效能，練習保留勇氣，也保留修正看法的空間。', note: '本站原創整理｜心理學科普，非人格測驗',
    sources: [source('PMC｜Cognitive bias and sustainable decision making', 'https://pmc.ncbi.nlm.nih.gov/articles/PMC10071311/', 'CC BY 4.0；本站自行改寫'), source('NCI｜Self-Efficacy and Health Behavior Theories', 'https://cancercontrol.cancer.gov/sites/default/files/2020-06/self-efficacy.pdf', '官方研究資料；引用與摘要'), source('APA｜Self-Efficacy', 'https://www.apa.org/pi/aids/resources/education/self-efficacy', 'APA 公開教育資源；本站未複製原文')],
    sections: [section('偏誤是捷徑，不是道德缺陷', '確認偏誤、事後偏誤與過度確信，可能讓我們更快判斷，也可能讓反例被忽略。看見偏誤不是替自己貼上壞人的標籤。'), section('自我效能不是盲目自信', '自我效能是對「我能否完成某個行動」的信念。健康的信心可以和承認限制、尋求協助與修正計畫同時存在。'), section('問自己：事實、推測與反例在哪裡？', '可以寫下已知事實、目前推測、反方證據與錯誤代價。重大健康、法律、財務或安全決定要查證多個可靠來源。'), section('把勇氣拆成可觀察的小步驟', '先設定一個小行動與檢視日期，記錄結果，再決定是否調整。相信自己不等於永遠正確，而是願意學習。')]
  },
  {
    title: '對自己嚴格，還是對自己友善？自我慈悲的研究骨架', category: '自我照顧', language: '繁體中文', art: 'flower',
    description: '區分有助修正的自我檢討與反覆羞辱自己的批評，理解自我友善、共同人性與正念的概念。', note: '本站原創整理｜心理健康教育，非治療方案',
    sources: [source('PubMed｜Self-compassion interventions and self-criticism', 'https://pubmed.ncbi.nlm.nih.gov/33749936/', 'NIH 公開書目；本站自行摘要'), source('PMC｜Increasing Self-Compassion', 'https://pmc.ncbi.nlm.nih.gov/articles/PMC10653232/', '依文章授權條款引用；不複製全文'), source('WHO｜Self-care for health and well-being', 'https://www.who.int/health-topics/self-care', 'WHO 官方資料；本站自行整理')],
    sections: [section('自我檢討不等於自我攻擊', '「這次哪裡需要調整」能指向下一步；「我整個人都很糟」則把一次經驗擴大成全盤否定。兩者帶來的行動空間很不一樣。'), section('自我慈悲的三個支柱', '研究常談自我友善、共同人性與正念。它不是縱容、逃避責任，也不是強迫自己假裝沒事。'), section('有希望，但不是萬靈丹', '自我慈悲介入對自我批評呈現有希望的下降，但研究品質、族群與方法仍不完全一致，不應當成個人療效保證。'), section('一句可以開始的話', '描述事件、辨認內在語氣，再問「如果朋友遇到同樣的事，我會怎麼說？」若練習引起強烈不適，可以停止並尋求專業支持。')]
  },
  {
    title: '把路走深一點：旅行的意義，從抵達遠方到慢下來', category: '旅行與文化', language: '繁體中文', art: 'mountain',
    description: '從在場感、地方文化與永續旅遊重新思考旅行，不把景點數量或速度當成唯一價值。', note: '本站原創整理｜文化閱讀，非心理療效保證',
    sources: [source('UN Tourism｜Sustainable development', 'https://www.untourism.int/sustainable-development', '官方框架；本站自行摘要'), source('UNESCO｜Intangible Cultural Heritage', 'https://www.unesco.org/en/intangible-cultural-heritage', '官方資料；未複製原文或圖片'), source('Thoreau｜Walden／Wikisource', 'https://en.wikisource.org/wiki/Walden,_or,_Life_in_the_Woods', '古典原作參考連結；本站未轉載網站文字')],
    sections: [section('慢旅行不是固定交通工具', '慢下來可以是少排幾個景點、留意沿途、預留休息，也可以是選擇適合身體與預算的交通。重點不是表演一種生活方式。'), section('陌生地方讓日常換一個角度', '逛市場、閱讀地方歷史、搭乘公共運輸或觀察街道，都可能讓熟悉的生活問題出現新的背景。旅行不保證解決內心困難。'), section('文化不是旅遊布景', '參與儀式、拍攝人物、進入宗教場所或接觸原住民族文化前，先理解地方規範並取得同意，支持在地創作者與公平交易。'), section('慢下來也要看見環境影響', '慢旅行不必然比較環保。交通方式、旅程距離、住宿能源、地方承載量與消費行為都會影響總體結果；在評估這些條件後，減少不必要移動或支持在地方式，可能降低部分影響。')]
  },
  {
    title: '讓音樂陪你整理情緒：從聆聽經驗到日常照顧', category: '音樂與情緒', language: '繁體中文', art: 'music',
    description: '區分一般聆聽、音樂介入與專業音樂治療，理解同一首歌為何可能讓不同人感受不同。', note: '本站原創整理｜音樂健康科普，非治療建議',
    sources: [source('PMC／MDPI｜Music for Emotion Regulation', 'https://pmc.ncbi.nlm.nih.gov/articles/PMC11428991/', 'CC BY；本站自行整理'), source('NCCIH｜Music and Health', 'https://www.nccih.nih.gov/health/music-and-health-what-you-need-to-know', '美國政府健康資訊；本站未複製原文'), source('WHO Europe｜Arts and health review', 'https://ncch.org.uk/uploads/WHO-Scoping-Review-Arts-and-Health.pdf', 'CC BY-NC-SA 3.0 IGO；依條款引用')],
    sections: [section('情緒調節不是把負面情緒消除', '音樂可能幫助表達、轉移注意力、喚起記憶或連結他人；同一首歌也可能讓另一個人不舒服，差異值得被尊重。'), section('一般聆聽與專業治療不同', '自己聽歌、唱歌或演奏是生活活動；具資格專業人員提供的音樂治療則有不同的訓練與脈絡，不能混為一談。'), section('研究有希望，也有侷限', '部分研究支持音樂介入與情緒或壓力的可能關聯，但樣本與方法各異，不宜寫成「一首歌治好焦慮」。'), section('讓聆聽保持安全與彈性', '選擇合適音量與場合，留意歌曲是否喚起強烈記憶；可以隨時換歌或停止。持續困擾仍應尋求專業協助。')]
  },
  {
    title: '把注意力帶回呼吸：正念理解壓力的入口', category: '呼吸與壓力', language: '繁體中文', art: 'breath',
    description: '用自然、不勉強的呼吸覺察作為入口，說明正念的意義、研究限制與練習界線。', note: '本站原創整理｜可中止的日常練習，非治療',
    sources: [source('NHS｜Breathing exercises for stress', 'https://www.nhs.uk/mental-health/self-help/guides-tools-and-activities/breathing-exercises-for-stress/', '官方健康資訊；本站自行改寫'), source('NCCIH｜Meditation and Mindfulness', 'https://www.nccih.nih.gov/health/meditation-and-mindfulness-effectiveness-and-safety', '美國政府資訊；本站未複製原文'), source('PMC｜Breathing Practices for Stress and Anxiety', 'https://pmc.ncbi.nlm.nih.gov/articles/PMC10741869/', '依文章授權標示引用')],
    sections: [section('壓力是警報，不是個人失敗', '短期壓力可能讓身體提高警覺；持續困擾則需要更多支持。練習的目的不是命令自己立刻平靜，而是增加覺察與選擇。'), section('呼吸可以是錨點，不是考試', '坐著、站著或躺著都可以，讓呼吸自然進出，不需要憋氣或追求特定感覺。分心後回來，就是練習的一部分。'), section('正念不等於清空大腦', '正念是以不評判的方式留意當下經驗。它可能對部分人有幫助，但研究形式與效果並不一致，不能替代治療。'), section('任何不舒服都可以停止', '若頭暈、胸痛、氣促、恐慌或情緒升高，立即停止並恢復自然呼吸；有呼吸或心血管疾病者可先詢問專業人員。')]
  },
  {
    title: '把力氣用在能回應的地方：斯多葛思想的可控制範圍', category: '哲學與生活', language: '繁體中文', art: 'orbit',
    description: '從愛比克泰德的區分出發，理解可控制、可影響與不可保證的事情，不把哲學變成責怪受苦者的工具。', note: '本站原創整理｜哲學導讀，非心理治療',
    sources: [source('Stanford Encyclopedia｜Stoicism', 'https://plato.stanford.edu/entries/stoicism/', '學術百科；本站自行摘要'), source('MIT Classics｜Epictetus', 'https://classics.mit.edu/Epictetus/epicench.html', '古典原作公版；網站轉錄仍受其條款保護'), source('Stanford Encyclopedia｜Seneca', 'https://plato.stanford.edu/entries/seneca/', '學術百科；本站僅概念引用')],
    sections: [section('我能直接回應什麼？', '自己的判斷、選擇與行動，和身體狀況、財物、名聲及他人行動並不相同。這是分析空間的工具，不是宣稱人能控制一切。'), section('事情與對事情的看法', '刺激未必由我們選擇，但可以暫緩、檢視與修正判斷。情緒不必被斥為軟弱，也不必被迫立刻消失。'), section('不可控不等於不重要', '健康、財富與公共環境仍然有實際價值；尋求醫療、倡議改變、保護自己，都不是違反哲學。'), section('把區分落地', '列出事實、標示可影響範圍，再選一個尊重自己與他人的下一步。結果不能保證，但行動仍然有意義。')]
  },
  {
    title: '把「陰影」讀成自我反思工具：榮格概念的安全入門', category: '思想與自我理解', language: '繁體中文', art: 'circle',
    description: '將榮格的陰影放回思想史語境，以溫和提問理解觸發與投射，不把它當成測驗或人格診斷。', note: '本站原創整理｜思想史導讀，非心理診斷',
    sources: [source('Pacifica｜Jung Shadow research guide', 'https://pacifica.libguides.com/Jung/shadow', '大學圖書館研究導引；本站自行改寫'), source('NIMH｜Caring for Your Mental Health', 'https://www.nimh.nih.gov/health/topics/caring-for-your-mental-health', '美國政府公開資訊；本站未使用圖片'), source('WHO｜Mental health response', 'https://www.who.int/news-room/fact-sheets/detail/mental-health-strengthening-our-response', 'WHO 官方資料；本站自行摘要')],
    sections: [section('陰影是詮釋概念，不是診斷名詞', '榮格談的陰影可以理解成被自我形象排除或不易察覺的面向，也會受文化與家庭規範影響。它不是固定的邪惡本質。'), section('從「我討厭他」到可檢驗的問題', '可以問：我掌握了哪些事實？還有哪些解釋？這個反應是否碰到界線或過往經驗？問題是開放的，不是替自己或他人貼標籤。'), section('整合不是放縱', '承認情緒或衝動，不等於照著它傷害人。反思必須包含同意、安全、責任與他人界線。'), section('何時停止自己深挖', '若探索引起強烈痛苦、失眠、解離感、功能受損或危機念頭，先停止並尋求合資格的心理健康專業支持。')]
  },
  {
    title: '從自卑感到共同體感覺：阿德勒的成長與連結', category: '思想與關係', language: '繁體中文', art: 'bird',
    description: '介紹阿德勒如何談不足感、補償與社會興趣，區分思想史觀點與現代心理專業服務。', note: '本站原創整理｜心理思想導讀，非自我測驗',
    sources: [source('Adler Graduate School｜Theory and Application', 'https://www.alfredadler.edu/about/alfred-adler-theory-application/', '教育機構公開導讀；本站自行摘要'), source('PMC｜Revitalizing Alfred Adler', 'https://pmc.ncbi.nlm.nih.gov/articles/PMC7932831/', '依文章授權資訊引用'), source('Internet Archive｜The Practice and Theory of Individual Psychology', 'https://archive.org/details/in.ernet.dli.2015.74812', '館藏標示 Copyright Protected；僅作書目入口')],
    sections: [section('自卑感不是疾病或低人一等', '阿德勒談自卑感時，指向面對能力、資源或位置差距時的主觀不足感。它不能直接等同於低自尊或心理疾病。'), section('人如何回應不足感', '人可能學習、練習、尋求支持、競爭或退縮。重點不是替讀者分類，而是看某種回應是否增加選擇與合作。'), section('共同體感覺不是盲目服從', '對共同生活的關心可以表現在尊重、互惠與參與，也必須和界線、自我照顧及安全同時存在。'), section('把思想留在反思的位置', '可以問「哪些比較正在影響我？」與「我需要什麼支持？」但持續痛苦或功能受損時，請找心理或醫療專業。')]
  },
  {
    title: '從學而時習到待人以仁：孔子思想的日常練習', category: '傳統思想', language: '繁體中文', art: 'flower',
    description: '從學習、思考、仁與禮的概念，理解古典文本如何提供提問，而不是把古人的話變成現代人的唯一答案。', note: '本站原創整理｜經典導讀，非規訓或醫療建議',
    sources: [source('Stanford Encyclopedia｜Confucius', 'https://plato.stanford.edu/entries/confucius/', '學術百科；本站自行改寫'), source('香港教育局｜論學資源', 'https://www.edb.gov.hk/attachment/tc/curriculum-development/kla/chi-edu/resources/secondary-edu/lang/culture/B003.pdf', '官方教材；以摘要與連結為主'), source('Project Gutenberg｜The Analects', 'https://www.gutenberg.org/ebooks/3330', '英語譯本參考連結；公版狀態依地區與版本而異')],
    sections: [section('學習不只是在記憶', '學、習與思考可以互相往返：閱讀、請益、反省，再在具體情境裡驗證。學習的節奏不必拿來和別人比較。'), section('仁與禮需要放回歷史語境', '關懷、尊重與分寸可以成為提問，但古代角色秩序和現代平等、個人界線之間需要被仔細區分。'), section('把修養放在可觀察的行動', '守信、傾聽、言語節制與反省，可以成為日常練習；它不是追求完美人格，也不等於壓抑情緒。'), section('如何讀古人而不被古人規訓', '比較原典、譯本與不同詮釋，把現代聯想寫成開放問題。遇到不安全的關係，界線與求助優先於任何古典格言。')]
  },
  {
    title: '在沒有預設答案之後：尼采談價值、選擇與生命敘事', category: '哲學與思想史', language: '繁體中文', art: 'star',
    description: '以價值重估、自我塑造、生命肯定與多重視角為閱讀入口，不把哲學口號簡化成意志力或支配他人。', note: '本站原創整理｜哲學導讀，非心理或醫療建議',
    sources: [source('Stanford Encyclopedia｜Friedrich Nietzsche', 'https://plato.stanford.edu/entries/nietzsche/', '學術百科；本站自行摘要'), source('Internet Encyclopedia of Philosophy｜Nietzsche', 'https://iep.utm.edu/nietzsch/', '公開學術導讀；本站未複製原文'), source('Project Gutenberg｜Thus Spake Zarathustra', 'https://www.gutenberg.org/ebooks/1998', '英語譯本參考連結；公版狀態依地區與版本而異')],
    sections: [section('價值不是天降答案', '尼采追問價值從哪裡來、鼓勵了什麼又壓抑了什麼。批判既有價值不等於否定一切價值，也不等於任性。'), section('成為自己不是即興任性', '自我塑造包含反思、長期實踐與承擔後果，不是用意志力解釋所有處境，也不是要求人忽視疾病與結構限制。'), section('把永劫回歸當作思想實驗', '可以問「如果重來，我仍願意肯定哪些選擇？」這是閱讀問題，不是宇宙學定論或壓力測驗。'), section('生命故事可以修訂，但不能任意捏造', '我們的敘事會受語言、記憶與文化影響；保留多種觀點，也要對自己的行動與公共後果負責。')]
  },
  {
    title: '為什麼人會相信自己想相信的事？認知、群體與自我保護', category: '心理與社會', language: '繁體中文', art: 'orbit',
    description: '從確認偏誤、群體資訊與自我保護整理一個不急著下結論的思考入口，讓好奇心多走一步。', note: '本站原創整理｜心理與社會科普，非人格判斷',
    sources: [source('PMC｜Cognitive bias and sustainable decision making', 'https://pmc.ncbi.nlm.nih.gov/articles/PMC10071311/', 'CC BY 4.0；本站自行整理'), source('APA｜Confirmation bias overview', 'https://dictionary.apa.org/confirmation-bias', 'APA 詞典公開入口；本站僅作定義參考'), source('OpenStax｜Psychology 2e', 'https://openstax.org/details/books/psychology-2e', '外部教材參考連結；本站未轉載教材')],
    sections: [section('相信不是單純的資訊不足', '人會依照既有經驗、注意力、情緒與關係信任解讀資訊。確認偏誤可能讓支持既有看法的材料更顯眼。'), section('群體會改變我們看見的世界', '社群、朋友與媒體提供線索，也可能形成同溫層。理解群體影響不代表所有群體都是危險，重點是保留查證與離開的自由。'), section('自我保護有時會變成拒絕修正', '一個信念可能讓人維持歸屬、尊嚴或安全感；挑戰它時，先理解這個信念在保護什麼，比嘲笑更接近有效對話。'), section('替自己保留一個更新按鈕', '寫下「什麼證據會讓我改變？」查找不同來源，區分事實、推測與價值。重大議題不要只依賴單一文章或單一權威。')]
  },
  {
    title: '睡前腦袋停不下來：從反芻到溫和收尾', category: '睡眠與情緒', language: '繁體中文', art: 'moon',
    description: '理解睡前反芻與未完成感，提供不強迫入睡的環境整理與書寫方向。', note: '本站原創整理｜日常自我照顧，非失眠治療',
    sources: [source('NHS｜Insomnia', 'https://www.nhs.uk/conditions/insomnia/', 'NHS 官方資訊；本站自行改寫'), source('CDC｜About Sleep', 'https://www.cdc.gov/sleep/about/index.html', '美國政府公開資訊；本站未複製原文'), source('NHLBI｜Sleep/Wake Cycle', 'https://www.nhlbi.nih.gov/health/sleep/sleep-wake-cycle', '美國 NIH 官方資訊；本站自行整理')],
    sections: [section('反覆擔心不等於臨床失眠', '有些人晚上安靜下來後會反覆想同一件事；這是日常經驗的描述，不等於失眠或其他診斷，也不代表每個念頭都需要立刻解決。'), section('把擔心整理成可觀察的項目', '可以把明天要處理的一件事寫下來，再註明何時回看；書寫只是整理方法，不是保證改善睡眠，也不必把所有擔心一次處理完。'), section('若仍睡不著，選擇低刺激的安排', '降低光線、把工作訊息移出臥室。若約十五至二十分鐘仍清醒，可以到安全、昏暗處做安靜活動，等有睡意再回床；這是睡眠衛生與 CBT-I 常見的刺激控制概念，不是自行治療的保證。'), section('持續困擾就不要只靠技巧', '若難入睡、夜醒或白天嗜睡持續影響生活，請找醫療專業評估，不要自行增加鎮靜藥、酒精或大量咖啡因。')]
  },
  {
    title: '從海邊到森林：自然景色為什麼讓人想慢一點', category: '自然與旅行', language: '繁體中文', art: 'wave',
    description: '把海洋、森林與山景當作感官與文化經驗來閱讀，而不是保證療效的景點清單。', note: '本站原創整理｜自然與文化閱讀，非療效宣稱',
    sources: [source('WHO Europe｜Urban green spaces and health', 'https://www.who.int/europe/publications/i/item/WHO-EURO-2016-3352-43111-60341', 'WHO 官方研究；本站自行整理'), source('EEA｜Health and well-being benefits of urban green space', 'https://www.eea.europa.eu/en/analysis/publications/who-benefits-from-nature-in-cities-social-inequalities-in-access-to-urban-green-and-blue-spaces-across-europe/health-and-well-being-benefits-of-urban-green-space', '歐洲環境署公開資料；本站自行整理'), source('UN Tourism｜Sustainable development', 'https://www.untourism.int/sustainable-development', '官方框架；本站自行摘要')],
    sections: [section('景色不會替每個人做同一件事', '海浪、樹影與山的尺度可能讓注意力暫時移動，但自然經驗也會因天氣、記憶、身體狀態與文化背景而不同。'), section('用感官取代打卡清單', '可以注意一種聲音、一個光影變化或腳下的觸感；不必把旅行排滿，也不必把「放鬆」變成必須成功的任務。'), section('勝地也有地方與居民', '進入自然保護區、宗教空間或社群生活前，遵守管理規範、攝影同意與環境承載限制，支持在地且公平的方式。'), section('回家之後帶回一個小改變', '旅行的意義也可以是重新看見住家附近的路、河岸或公園。慢下來不一定需要遠行。')]
  },
  {
    title: '把「應該」放下半步：內在聲音與生活界線', category: '自我覺察', language: '繁體中文', art: 'flower',
    description: '從內在批評、社會期待與界線感出發，練習把責任分清楚，不把自我照顧寫成另一種要求。', note: '本站原創整理｜自我覺察，非心理診斷',
    sources: [source('WHO｜Self-care for health and well-being', 'https://www.who.int/health-topics/self-care', 'WHO 官方資料；本站自行改寫'), source('NIMH｜Caring for Your Mental Health', 'https://www.nimh.nih.gov/health/topics/caring-for-your-mental-health', '美國政府公開資訊；本站未使用標誌'), source('PubMed｜Self-compassion interventions', 'https://pubmed.ncbi.nlm.nih.gov/33749936/', '研究摘要引用；本站未複製全文')],
    sections: [section('「應該」有時是價值，有時是壓力', '期待可以幫助我們安排生活，也可能把所有休息都變成需要證明的表現。先辨認這句話來自自己的價值、他人的要求，還是害怕被拒絕。'), section('責任要有邊界', '你可以對自己的選擇負責，但不必為別人的情緒、所有結果或不公平的環境獨自負責。分清楚責任不是逃避。'), section('界線不是拒絕所有人', '界線可以是說明時間、能力、隱私與身體距離，也可以留下重新協商的空間。安全與同意永遠比禮貌壓力重要。'), section('讓自我照顧不再是一張考卷', '選一件能減少負荷的小事，做不到也不代表失敗。持續痛苦、功能受損或危機念頭需要專業支持，不必自己撐。')]
  },
  {
    title: '讓好奇心有地圖：如何核對一個問題的資料', category: '學習與探索', language: '繁體中文', art: 'orbit',
    description: '示範如何把一個問題拆成定義、證據、不同觀點與生活情境，避免只尋找支持自己答案的文章。', note: '本站原創整理｜閱讀方法，非專業結論',
    sources: [source('MedlinePlus｜Evaluating Health Information', 'https://medlineplus.gov/evaluatinghealthinformation.html', '美國國家醫學圖書館公開衛教資料；本站自行整理'), source('NIH ODS｜How To Evaluate Health Information on the Internet', 'https://ods.od.nih.gov/HealthInformation/how_to_evaluate_health_information_on_the_internet_questions_and_answers.aspx', '美國 NIH 官方健康資訊評估指引；本站自行整理'), source('Stanford Encyclopedia of Philosophy｜Scientific Method', 'https://plato.stanford.edu/entries/scientific-method/', '學術百科科學方法導讀；本站自行整理')],
    sections: [section('先問自己真正想知道什麼', '「為什麼人會孤單」可以拆成感受、社會關係、公共衛生、文化與個人故事。問題越清楚，越不容易被一個漂亮標題帶走。'), section('定義比答案更重要', '先把問題中的詞拆開：孤獨通常描述主觀感受，社會隔離偏向客觀的互動或支持不足，獨處則可能是主動選擇的狀態；不同來源的定義不一定完全相同，應看原文脈絡。'), section('把證據和觀點分開', '把原始研究、機構說明、新聞報導與個人觀點分開記錄：作者是誰、何時發布、引用了什麼、哪些只是推測。先用兩個彼此獨立的可靠來源核對，再決定是否延伸閱讀。'), section('讓閱讀回到生活而不是自我診斷', '讀完只記下一個值得繼續查證的問題與一個低風險行動。重大健康或安全判斷，仍需合資格專業人士。')]
  },
  {
    title: '為什麼旅行會改變我們看見日常的方式', category: '旅行與觀察', language: '繁體中文', art: 'plane',
    description: '旅行不只關於景點，也關於尺度、陌生感、地方脈絡與重新觀看熟悉生活的能力。', note: '本站原創整理｜文化與旅行閱讀，非旅遊醫療建議',
    sources: [source('UN Tourism｜Sustainable development', 'https://www.unwto.org/sustainable-development', '公開組織資料；本站自行整理'), source('UNESCO World Heritage', 'https://whc.unesco.org/en/list/', '公開文化遺產索引；本站未複製條目全文'), source('Smithsonian｜Travel and culture', 'https://www.si.edu/', '公開文化研究入口；本站只作延伸查證')],
    sections: [section('陌生感讓注意力醒來', '在熟悉環境裡，我們常依靠習慣行走。到了陌生地方，招牌、聲音、交通與餐桌都需要重新辨認，感官因此多了一點明亮。'), section('景點之外是地方的生活', '理解一個地方不只拍下風景，也可以學著看見居民的生活節奏、歷史記憶與環境限制。旅行的好奇心最好同時帶著尊重。'), section('不要把休息排成考試', '若每天都要完成很多景點，旅行也可能變成另一種追趕。留下一段沒有安排的時間，讓身體成為行程的一部分。'), section('回家以後帶回一個問題', '旅程的意義不一定是得到結論。也許只是回家後開始注意一件以前忽略的事，或想替日常保留一點在旅途中感受到的空間。')]
  },
  {
    title: '看星星的時候，我們為什麼會感到渺小又安定', category: '宇宙與哲思', language: '繁體中文', art: 'star',
    description: '從夜空、尺度與敬畏感出發，理解壯觀不必讓人焦慮，也可以帶來一種溫柔的比例感。', note: '本站原創整理｜天文科普與哲思，非宗教結論',
    sources: [source('NASA｜Solar System Exploration', 'https://science.nasa.gov/solar-system/', 'NASA 公開科普資料；本站自行改寫'), source('NASA｜Universe', 'https://science.nasa.gov/universe/', 'NASA 公開科普資料；本站未複製原文'), source('ESA｜Space science', 'https://www.esa.int/Science_Exploration/Space_Science', 'ESA 公開科普入口；本站只作查證')],
    sections: [section('尺度會改變問題的形狀', '當我們抬頭看見月亮、行星或星河，日常的煩惱沒有因此消失，但它不再是唯一的尺度。這種比例感有時讓人主觀感到放鬆，也可能帶來其他感受。'), section('敬畏不是否定自己', '感到渺小不必等於沒有價值。人可以很小，仍然能照顧一個人、一株植物與一個承諾。意義不只由大小決定。'), section('用科學保留想像力', '天文知識讓我們知道光年、引力與星體演化；想像力則讓這些知識與人生經驗連在一起。兩者可以同時存在，不必互相取代。'), section('把一點宇宙帶回今天', '找一個天氣好的晚上，抬頭幾分鐘，或只看一張可靠的天文照片。你不必理解全部，只要讓眼睛暫時離開近距離的螢幕。')]
  },
  {
    title: '幽默為什麼能替困難打開一扇小窗', category: '幽默與生活', language: '繁體中文', art: 'cat',
    description: '笑聲不是逃避現實的萬用藥，但在安全與尊重的前提下，它能讓人暫時看見不同角度。', note: '本站原創整理｜生活觀察，非心理治療建議',
    sources: [source('Stanford Encyclopedia of Philosophy｜Humor', 'https://plato.stanford.edu/entries/humor/', '公開學術百科；本站自行整理'), source('OpenStax｜Psychology 2e', 'https://openstax.org/details/books/psychology-2e', '外部教材參考連結；本站未轉載教材'), source('Wikimedia Commons｜Vintage Cat Illustration', 'https://commons.wikimedia.org/wiki/File:Vintage_Cat_Illustration.jpg', 'Public domain 圖片；本站保留來源與授權')],
    sections: [section('笑不等於事情不嚴重', '人在困難裡仍然笑，並不表示他不在乎。幽默有時讓人主觀感到短暫輕鬆，也有時是人與人連結的方式。'), section('安全的笑話需要同意與脈絡', '以弱勢、創傷或真實痛苦當作笑點，可能會增加傷害。讓笑聲往自己、日常荒謬或溫和觀察靠近，通常更容易保留尊重。'), section('把荒謬感留給生活', '一隻貓對紙箱的堅持、雨傘在風裡翻面、煮飯時忘了放鹽，都是不必解決世界卻能讓人微笑的時刻。'), section('笑過之後仍可回到正事', '短暫的輕鬆不是否認問題，而是替自己補一點力氣。笑聲結束後，如果事情仍重要，就用比較有空間的狀態回去面對。')]
  },
  {
    title: '藝術不一定要看懂：從觀看開始的內在空間', category: '藝術與感受', language: '繁體中文', art: 'flower',
    description: '藝術的價值不只在知識與評價，也在於它讓我們用不同速度感受顏色、形狀、聲音與故事。', note: '本站原創整理｜藝術觀察，非藝術治療',
    sources: [source('The Met｜Open Access', 'https://www.metmuseum.org/art/collection', '館方公開收藏資料；各作品依頁面標示使用'), source('Rijksmuseum｜Collection', 'https://www.rijksmuseum.nl/en/collection', '館方公開收藏資料；本站只作延伸入口'), source('Wikimedia Commons｜Public domain media', 'https://commons.wikimedia.org/wiki/Commons:Reusing_content_outside_Wikimedia', '公版與自由授權使用說明')],
    sections: [section('先描述，再解釋', '看一幅畫時，可以先說出眼睛看到的顏色、線條、距離與光線，不急著判斷它代表什麼。描述本身就是一種專注。'), section('不懂也可以停留', '沒有藝術背景不代表不能感受藝術。你可以只選一個喜歡的局部，或注意自己身體的反應。'), section('讓作品保留多重答案', '作品的歷史背景很重要，但觀者的感受也可能不同。知道背景，是增加理解，不是把所有感受都收進唯一解釋。'), section('創作可以很小', '畫一個圓、拍一張光影、排列桌上的物件，都能讓人從被動接收變成主動觀看。創作不需要先得到別人的評分。')]
  },
  {
    title: '走路、伸展與身體的回信', category: '運動與身體', language: '繁體中文', art: 'wave',
    description: '從低門檻活動、日常走路與伸展出發，理解運動不必以懲罰或外貌為唯一理由。', note: '本站原創整理｜一般健康教育，非個人化運動處方',
    sources: [source('WHO｜Physical activity', 'https://www.who.int/news-room/fact-sheets/detail/physical-activity', 'WHO 官方資料；本站自行整理'), source('CDC｜Benefits of Physical Activity', 'https://www.cdc.gov/physical-activity-basics/benefits/', '美國政府公開資訊；本站未複製全文'), source('NHS｜Exercise', 'https://www.nhs.uk/live-well/exercise/', 'NHS 公開健康資訊；本站自行改寫')],
    sections: [section('身體活動不是只有正式運動', '走到下一個路口、爬樓梯、整理房間、在椅子上活動肩膀，都可能讓身體離開長時間固定的姿勢。從容易重複的動作開始，比一次做得很大更可靠。'), section('把活動和懲罰分開', '運動可以是感覺力量、睡得更穩或讓腦袋換一個節奏，不必只為了改變外表或抵銷吃過的東西。'), section('留意身體的界線', '疼痛、暈眩、呼吸異常或舊傷需要被重視。降低強度、休息，並在需要時詢問醫療或運動專業人員。'), section('找一種願意回來的活動', '最好的活動不一定最流行，而是你願意在下週再次做。音樂、自然、朋友或一條喜歡的路，都能讓它多一點生活感。')]
  },
  {
    title: '從一本書走進另一個人的時代', category: '閱讀與歷史', language: '繁體中文', art: 'book',
    description: '閱讀歷史人物與經典文本時，同時保留欣賞、脈絡與質疑，讓名言不只是一句漂亮的話。', note: '本站原創整理｜歷史閱讀方法，不代表特定人物全部立場',
    sources: [source('Project Gutenberg｜The Meditations', 'https://www.gutenberg.org/ebooks/2680', '英語譯本參考連結；各版本及地區權利狀態不同'), source('Wikisource｜The Analects', 'https://en.wikisource.org/wiki/The_Analects', '外部古典文本連結；本站未轉載譯文'), source('Stanford Encyclopedia of Philosophy', 'https://plato.stanford.edu/', '公開學術百科；本站自行整理')],
    sections: [section('一句話不能代替一個人', '歷史人物常被濃縮成幾句名言，但完整作品裡可能有矛盾、時代限制與不再適用的部分。先回到作品與脈絡，才不容易把人變成口號。'), section('讀出他當時面對的問題', '問問看：這段文字是在回應戰爭、教育、死亡、政治、家庭還是日常倫理？知道問題，句子的方向會更清楚。'), section('欣賞與質疑可以一起做', '你可以被一句話幫助，也可以不同意作者的另一個觀點。閱讀不是交出判斷，而是暫時借用另一雙眼睛。'), section('把經典帶回一個小行動', '讀完不必立刻寫出心得。只記下一個想繼續查證的概念，或一個能在今天實驗的小行動，讓閱讀從紙面回到生活。')]
  }
];
