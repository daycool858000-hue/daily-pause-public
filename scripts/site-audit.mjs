// Automated read-only content, assets and structure checks for the restored static site.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { spawnSync } from 'node:child_process';

const root = path.resolve(process.argv[2] || '.');
const read = relative => fs.readFileSync(path.join(root, relative), 'utf8');
const exists = relative => fs.existsSync(path.join(root, relative));
const required = [
  'index.html', 'styles.css', 'world-style.css', 'sound-style.css', 'soundscape.js', 'app.js', 'cards-data.js',
  'daily-content.js', 'quiet-spaces.js', 'palette-history.js', 'long-articles.js',
  'short-articles.js', 'reading-20261013.js', 'curiosity.js', 'media.js',
  'world-art.js', 'palette-world.js', 'card-originals.js', 'card-sourced.js', 'fresh-cards.js',
  'photo-rotation.js', 'companion-site.js', 'rest-stage.js'
];
for (const file of required) assert.ok(exists(file), 'missing required file: ' + file);

for (const name of required.filter(name => name.endsWith('.js'))) {
  const syntax = spawnSync(process.execPath, ['--check', path.join(root, name)], { encoding: 'utf8' });
  assert.equal(syntax.status, 0, 'JS parse failed ' + name + ': ' + syntax.stderr);
}
const html = read('index.html');
assert.match(html, /<html\s+lang="zh-Hant"/, 'Chinese language tag missing');
assert.match(html, /name="viewport"/, 'mobile viewport missing');
for (const js of required.filter(name => name.endsWith('.js'))) {
  assert.ok(html.includes('./' + js + '?v='), 'HTML script missing: ' + js);
}
assert.ok(html.includes('styles.css'), 'CSS link absent');
assert.ok(html.includes('./sound-style.css?v='), 'sound UI CSS absent');
assert.ok(html.includes('id="cardSourceDialog"') && html.includes('id="cardSourceDialogClose"'), 'accessible credit dialog absent');
assert.ok(html.indexOf('soundscape.js') < html.indexOf('companion-site.js'), 'soundscape must load before companion');
assert.ok(html.indexOf('soundscape.js') < html.indexOf('./app.js'), 'soundscape must load before navigation controls');
assert.match(html, /id="worldUndo"[^>]+disabled/, 'new studio undo must begin disabled');
assert.match(html, /id="worldRedo"[^>]+disabled/, 'new studio redo must begin disabled');
assert.ok(html.includes('id="worldQuickClear"') && html.includes('id="worldQuickSave"'), 'canvas action toolbar missing');
assert.ok(html.includes('id="worldControlPanel"') && html.includes('data-world-tab="color"') && html.includes('data-world-tab="element"'), 'inline color/shape tools missing');
assert.ok(!html.includes('id="worldToolsToggle"'), 'obsolete obstructing mobile drawer must be removed');
assert.ok(html.includes('data-world-panel="brush"') && html.includes('data-world-panel="color"'), 'isolated brush and color panels required');
assert.ok(html.includes('id="globalCompanion"') && html.includes('id="restStage"'), 'site-wide companion or rest stage missing');
assert.ok(html.includes('./world-style.css?v='), 'new studio stylesheet not loaded');
assert.ok(html.includes('id="dailyRecommendation"'), 'random reading recommendation slot absent');
assert.ok(!html.includes('id="paletteCanvas"'), 'outdated visual canvas must not be displayed');
assert.ok(html.indexOf('palette-history.js') < html.indexOf('palette-world.js'), 'history library load order wrong');
assert.ok(html.indexOf('world-art.js') < html.indexOf('palette-world.js'), 'world art load order wrong');
assert.ok(html.indexOf('palette-world.js') < html.indexOf('./app.js'), 'world studio must load before app');
assert.ok(html.indexOf('photo-rotation.js') < html.indexOf('./app.js'), 'photo rotation must load before app');
assert.ok(html.indexOf('fresh-cards.js') < html.indexOf('./app.js'), 'new card library must load before app');

const historySandbox = { window: {} };
vm.runInNewContext(read('palette-history.js'), historySandbox, { filename: 'palette-history.js', timeout: 5000 });
assert.equal(typeof historySandbox.window.createPaletteHistory, 'function');
const model = { points: [1], nested: { x: 1 } };
let buttons = null;
const history = historySandbox.window.createPaletteHistory({
  read: () => model,
  write: state => {
    model.points = state.points;
    model.nested = state.nested;
  },
  onChange: state => { buttons = { ...state }; },
  limit: 2
});
assert.ok(!buttons.canUndo && !buttons.canRedo, 'history must start empty');
history.record(); model.points.push(2); model.nested.x = 2;
assert.ok(buttons.canUndo && !buttons.canRedo);
assert.equal(history.undo(), true);
assert.equal(model.points.join(','), '1', 'undo should restore earlier points');
assert.equal(model.nested.x, 1, 'history must deep-clone');
assert.ok(buttons.canRedo);
assert.equal(history.redo(), true);
assert.equal(model.points.join(','), '1,2', 'redo should restore new points');
history.undo();
history.record(); model.points.push(3);
assert.ok(!buttons.canRedo, 'new edit must invalidate redo');
assert.equal(history.redo(), false);
history.record(); model.points.push(4);
history.record(); model.points.push(5);
assert.equal(history.undo(), true);
assert.equal(history.undo(), true);
assert.equal(history.undo(), false, 'undo stack must respect configured memory limit');


const win = {
  localStorage: {
    getItem: () => null, setItem: () => {}, removeItem: () => {}
  }
};
const sandbox = { window: win };
for (const name of ['cards-data.js', 'daily-content.js', 'long-articles.js',
                    'short-articles.js', 'reading-20261013.js', 'curiosity.js', 'media.js',
                    'world-art.js', 'palette-world.js', 'card-originals.js', 'card-sourced.js', 'fresh-cards.js']) {
  vm.runInNewContext(read(name), sandbox, { filename: name, timeout: 8000 });
}
assert.equal(win.longArticlesData.length, 27);
assert.equal(win.longArticlesData.reduce((n, a) => n + a.sections.length, 0), 108);
assert.equal(win.shortArticlesData.length, 25, '2026-10-12 base remains intact');
assert.equal(win.additionalShortReads.length, 12, 'new short essay inventory');
assert.equal(win.additionalLongReads.length, 6, 'new historical and source-grounded essays');
assert.equal(win.additionalLongReads.reduce((n, a) => n + a.sections.length, 0), 24);
assert.ok(typeof win.setupPaletteNew === 'function', 'new studio entrypoint absent');
assert.ok(typeof win.PauseWorldArt?.drawScene === 'function', 'visual scene painter missing');
assert.ok(!html.includes('editorial-art.js'), 'drawn illustration engine must not be loaded');
assert.equal(win.freshCards.length, 80, 'entire gentle self-awareness card collection');
assert.equal(new Set(win.freshCards.map(c=>c.text)).size,80);
assert.equal(win.freshCards.filter(c=>c.sourceLink).length,40,'40 contextualized sourced reflections required');
assert.equal(win.freshCards.filter(c=>c.quote).length,0,'no whole-card text is a literal quotation');
const careTypes=['心情有人懂','身體也要被照顧','關係裡的溫柔','生活的小幸福','陪伴的一段話'];
assert.equal(new Set(win.freshCards.map(c=>c.type)).size,5,'five different types of caring messages');
for(const type of careTypes){
 assert.equal(win.freshCards.filter(c=>c.type===type).length,16,'missing a 16-card care category: '+type);
 assert.equal(win.freshCards.filter(c=>c.type===type&&!c.sourceLink).length,8,'8 original notes needed for '+type);
 assert.equal(win.freshCards.filter(c=>c.type===type&&c.sourceLink).length,8,'8 sourced ideas needed for '+type);
}
assert.equal(win.pauseOriginalCards.length,40);
assert.equal(win.pauseSourcedCards.length,40);
assert.ok(new Set(win.pauseSourcedCards.map(c=>c.sourceLink)).size>=20,'source diversity too low');
assert.ok(win.pauseOriginalCards.every(c=>!c.sourceLink&&c.provenance.includes('AI')));
assert.ok(win.pauseSourcedCards.every(c=>c.sourceLink&&/延伸|聯想/.test(c.provenance)),'sourced messages describe either an extension or a daily-life analogy');
assert.ok(win.freshCards.filter(c=>c.sourceLink).every(c=>c.provenance && /^https:\/\//.test(c.sourceLink)), 'sourced life reflections require traceable links and context');
assert.ok(win.freshCards.every(c=>c.text.length>=28 && c.text.length<=48),'cards should be brief, conversational, and readable');
assert.ok(win.freshCards.every(c=>!c.text.includes('願你')),'stop repeating the same blessing phrase');
assert.ok(win.freshCards.some(c=>c.text.includes('上善若水') && c.text.includes('溫柔') && c.text.includes('委屈')), 'Taoist context must explain a gentle everyday implication');
assert.ok(win.freshCards.every(c=>!/你應該|你必須|比別人|成功人士|別再偷懶/.test(c.text)), 'pressure-based messaging accidentally introduced');
assert.ok(win.freshCards.every(c=>(c.provenance||'').includes('AI')||c.sourceLink), 'missing original or classical provenance');
assert.equal(new Set([...win.shortArticlesData, ...win.additionalShortReads].map(x => x.title)).size, 37);
assert.equal(new Set([...win.longArticlesData, ...win.additionalLongReads].map(x => x.title)).size, 33);
assert.ok(win.additionalLongReads.every(a => a.sections.length === 4 && Array.isArray(a.sources)), 'new long essays malformed');
assert.equal(win.additionalLongReads.filter(a=>a.sources.length>0).length,3,'three new knowledge essays need actual source references');
assert.equal(win.additionalLongReads.filter(a=>a.sources.length===0).length,3,'life essays must remain clearly distinct from sourced ones');
for(const item of win.additionalLongReads){
 assert.ok(item.note.includes('AI'),'AI attribution missing on new long essay');
 for(const source of item.sources)assert.match(source.url,/^https:\/\//);
}
assert.equal(win.curiosityData.length, 36);
assert.equal(win.extraCards.length, 75);
assert.equal(win.dailyContent.companionLines.length, 31);
assert.equal(win.dailyContent.experiences.length, 15);
assert.equal(win.mediaData.length, 15);
assert.equal(new Set(win.curiosityData.map(d => d.id)).size, 36);
assert.equal(new Set(win.longArticlesData.map(d => d.title)).size, 27);
assert.equal(new Set(win.shortArticlesData.map(d => d.title)).size, 25);

const refs = [
  ...win.longArticlesData.flatMap(a => a.sources.map(x => x.url)),
  ...win.curiosityData.map(d => d.sourceUrl)
];
assert.equal(refs.length, 117);
assert.equal(new Set(refs).size, 97);
for (const ref of refs) assert.match(ref, /^https:\/\//, 'unsafe or relative source URL');
assert.equal(refs.filter(u => u.includes('openstax.org')).length, 0);

const app = read('app.js');
assert.ok(app.includes('window.setupPaletteNew?.();'), 'new studio is not started');
assert.ok(app.includes('renderDailyRecommendation();'), 'random recommended reading not initialized');
assert.ok(app.includes('xinli-card-install-v5') && app.includes('xinli-card-history-v5'), 'browser-specific daily seed and local history missing');
assert.ok(app.includes("installSeed+'|'+todayKey"), 'daily picks must depend on local date and visitor installation');
assert.ok(app.includes('const newlyRevealedIndex = state.revealed - 1;'), 'card opening animation must start face-down');
assert.ok(app.includes('requestAnimationFrame(() => requestAnimationFrame(() => slot?.classList.add'), 'flip should trigger after a browser paint');
assert.ok(app.includes("new CustomEvent('pause:view-change'"), 'ambient tracks must be interrupted on navigation');
assert.ok(app.includes('function showCardSource(index)'), 'credit details should be readable on demand');
assert.ok(app.includes('safeCardText(card.text)'), 'card bodies must be safely escaped');
assert.ok(app.includes('card-source-more'), 'compact visible source link absent');
assert.ok(app.includes("$('#cardSourceDialogClose').addEventListener"), 'dialog close interaction absent');
const audioScript=read('soundscape.js');
assert.ok(audioScript.includes('https://upload.wikimedia.org/'), 'genuine field recordings must replace artificial noise');
assert.ok(audioScript.includes('https://freesound.org/embed/sound/iframe/625312/'), 'verified public-domain handpan playback must be user initiated');
assert.ok(audioScript.includes('https://commons.wikimedia.org/wiki/File:'), 'visible audio source attribution required');
assert.ok(!audioScript.includes('createBufferSource') && !audioScript.includes('bufferNoise'), 'old harsh noise generator must be removed');
assert.ok(audioScript.includes('new Audio()') && audioScript.includes('audio.play()'), 'actual sound recording player missing');
assert.ok(audioScript.includes('audio.volume=0') && audioScript.includes('fadeUp(audio'), 'soft fade-in playback missing');
assert.ok(audioScript.includes("['today','stream']") && audioScript.includes("['read','forest']"), 'homepage and reading sound defaults missing');
assert.ok(audioScript.includes("['curiosity','rain']") && audioScript.includes("['palette','handpan']") && audioScript.includes("['holding','ocean']"), 'remaining navigation sound defaults missing');
assert.ok(audioScript.includes("document.addEventListener('visibilitychange'") && audioScript.includes("window.addEventListener('pagehide'"), 'sounds must stop in background');
assert.ok(audioScript.includes("bar.querySelector('[data-sound-toggle]').addEventListener('click'"), 'sound must start only on explicit click');
assert.ok(!/\bautoplay\s*=|\.autoplay\s*=/.test(audioScript), 'browser audio may not autoplay');
assert.ok(read('companion-site.js').includes('window.PauseSound?.bell?.()'), 'creature bell not wired');
const worldCode = read('palette-world.js');
assert.ok(worldCode.includes("model.marks.push(mark)"), 'additive element artwork missing');
assert.ok(worldCode.includes("model.tool=b.dataset.element"), 'changing tool must not mutate prior marks');
assert.ok(worldCode.includes("model.props.push("), 'physical scene props missing');
assert.ok(worldCode.includes("window.createPaletteHistory({"), 'studio history integration absent');
assert.ok(worldCode.includes("document.addEventListener('visibilitychange'"), 'background animation pause missing');
assert.ok(worldCode.includes("$('worldQuickClear').addEventListener"), 'quick clear absent');
assert.ok(!worldCode.includes('worldToolsToggle'), 'old sheet mechanism is still running');
assert.ok(worldCode.includes('activeTab=activeTab===b.dataset.worldTab?null:b.dataset.worldTab'), 'inline tabs must toggle');
assert.ok(worldCode.includes("['blank','空白畫布'"), 'free blank drawing canvas missing');
assert.ok(!worldCode.includes('worldCompanionText'), 'page-only companion should be removed');
assert.ok(app.includes('window.PauseRestStage?.open'), 'rest popup must be integrated');
assert.ok(app.includes('window.PausePhotos?.readerMarkup'), 'article photography must be integrated');
assert.ok(!app.includes('PauseEditorialArt'), 'drawn illustration engine should not replace articles');
assert.ok(!read('companion-site.js').includes("window.addEventListener('pause:companion',"), 'companion must not auto-talk on every action');
assert.ok(read('companion-site.js').includes("button.addEventListener('click'"), 'manual companion response missing');
const companionText=read('companion-site.js');
const companionMatch=companionText.match(/const thoughts=(\[[\s\S]*?\]);/);
assert.ok(companionMatch,'companionship messages array missing');
const lines=JSON.parse(companionMatch[1]);
assert.equal(lines.length,36,'36 warm optional creature messages');
assert.equal(new Set(lines).size,36,'no duplicated creature speech');
assert.ok(lines.every(x=>x.length>=12),'creature speech cannot be just a slogan');
assert.ok(!companionText.includes("window.addEventListener('pause:companion',"),'creature cannot interrupt navigation');
assert.ok(read('companion-site.js').includes('sprite-butterfly') && read('companion-site.js').includes('sprite-firefly'), 'roaming species absent');
assert.ok(read('rest-stage.js').includes('motion[type]'), '15 rest scenes need individually animated layers');
assert.equal((read('rest-stage.js').match(/class="scene-[a-z-]+"/g)||[]).length,15,'all fifteen rest scenes need individual moving motifs');
assert.ok(read('world-style.css').includes('@keyframes sceneLeafTravel') && read('world-style.css').includes('@keyframes sceneShoot'), 'continuous scene-specific animations missing');
assert.equal(win.freshCards.filter(c=>c.type==='陪伴的一段話').length,16,'gentle reflection category missing');
assert.ok(win.freshCards.filter(c=>c.sourceLink).every(c=>/延伸|概述|聯想|改寫|重述|轉述/.test(c.provenance)), 'sourced writing must distinguish its life interpretation from the original idea');

const countArray = (start,end) => {
  const part=worldCode.slice(worldCode.indexOf(start), worldCode.indexOf(end,worldCode.indexOf(start)));
  return (part.match(/\['/g) || []).length;
};
assert.equal(countArray('const moods=[','const scenes=['),24,'24 distinct emotion choices required');
assert.equal(countArray('const scenes=[','const elements=['),13,'12 landscapes plus one blank canvas required');
assert.equal(countArray('const elements=[','const props=['),22,'22 natural interactive elements required');
assert.equal(countArray('const props=[','const swatches='),35,'35 life object choices required');
const prefixCut = app.indexOf('const defaultLongArticles = []');
assert.ok(prefixCut > 0, 'outdated fallback was not removed');
assert.ok(!app.includes('openstax.org'), 'outdated OpenStax reference remains in app.js');
const bootstrap = app.slice(0, prefixCut) +
  '\n;globalThis.__AUDIT = { cards, articles, articleBodies, dailyCards, pickRandomCards };';
vm.runInNewContext(bootstrap, sandbox, { filename: 'app.js:bootstrap', timeout: 10000 });
const state = sandbox.__AUDIT;
for(let trial=0;trial<100;trial++){
 const trialDraw=state.pickRandomCards();
 assert.equal(trialDraw.length,5);
 assert.equal(new Set(trialDraw.map(c=>c.type)).size,5);
 assert.equal(trialDraw.filter(c=>c.sourceLink).length,2);
 assert.equal(trialDraw.filter(c=>!c.sourceLink).length,3);
}

assert.equal(state.cards.length, 80);
assert.equal(state.cards.filter(c=>c.quote).length,0,'raw excerpt cards must not remain');
assert.equal(new Set(state.dailyCards.map(c=>c.type)).size,5,'five-card experience must include five kinds of care');
assert.equal(state.dailyCards.filter(c=>c.sourceLink).length,2,'two of the five need referenced perspectives');
assert.equal(state.dailyCards.filter(c=>!c.sourceLink).length,3,'three of the five need original daily companionship');
assert.equal(state.cards.filter(c=>c.sourceLink).length,40,'40 contextual source-based readings required');
assert.ok(state.cards.filter(c=>c.sourceLink).every(c=>c.provenance && /^https:\/\//.test(c.sourceLink)), 'every idea requires provenance and HTTPS source');
assert.equal(state.dailyCards.length, 5);
assert.equal(new Set(state.dailyCards.map(c => c.text)).size, 5);
assert.equal(new Set(state.cards.map(c => c.text)).size, 80);
assert.ok(!state.cards.some(c=>c.type==='經典原文'||c.type==='問一個為什麼'), 'generic ancient excerpt and interrogation card decks are inactive');
assert.equal(state.articles.length, 57, '20 directory entries plus 25 original + 12 new short essays');
assert.ok(state.articles.some(a => a.title === '曼荼羅（Mandala）' && a.url.includes('metmuseum.org')), 'mandala reference must point to the religion/art topic, not a disambiguation page');
assert.ok(!state.articles.some(a => a.url.includes('%E6%9B%BC%E9%99%80%E7%BE%85')), 'misleading mandala disambiguation link must be absent');
assert.equal(Object.keys(state.articleBodies).length, 57);
assert.equal(new Set(state.articles.map(a => a.title)).size, 57, 'reading titles must be unique');
const externalReadings = state.articles.filter(a => a.url && a.url !== '#');
assert.equal(externalReadings.length, 16, '16 external reading sources must remain available');
const readingByTitle = title => state.articles.find(a => a.title === title);
assert.ok(readingByTitle('曼荼羅（Mandala）')?.url.startsWith('https://www.metmuseum.org/zh/'), 'mandala museum URL mismatch');
assert.equal(readingByTitle('園藝療法')?.source, '農業部農業知識入口網');
assert.ok(readingByTitle('園藝療法')?.url.includes('id=49982'), 'horticulture definition URL mismatch');
assert.ok(readingByTitle('Stress | NCCIH')?.url.includes('nccih.nih.gov/health/stress'), 'NCCIH label and URL mismatch');
assert.ok(readingByTitle('Why Is Sleep Important? | NHLBI')?.url.includes('nhlbi.nih.gov/health/sleep/why-sleep-important'), 'NHLBI label and URL mismatch');
assert.ok(readingByTitle('Mindfulness｜Mental Health Foundation')?.url.includes('mentalhealth.org.uk/explore-mental-health/a-z-topics/mindfulness'), 'mindfulness title/URL mismatch');
assert.ok(!state.articles.some(a => a.title === 'Mindfulness and mental wellbeing'), 'outdated page title');

const photoEnvironment={
 window:win,
 document:{addEventListener:()=>{}},
 setInterval:()=>123,clearInterval:()=>{}
};
vm.runInNewContext(read('photo-rotation.js'),photoEnvironment,{filename:'photo-rotation.js',timeout:5000});
assert.equal(typeof win.PausePhotos?.register,'function','missing photo rotation');
const readingList=[...state.articles,...win.longArticlesData,...win.additionalLongReads];
win.PausePhotos.register(readingList);
assert.equal(win.PausePhotos.count,15,'15 existing images not preserved');
assert.equal(win.PausePhotos.assignments,readingList.length,'reading photo assignment incomplete');
const coverCounts=new Map();
for(const item of readingList){
 const cover=win.PausePhotos.coverMarkup(item);
 const match=cover.match(/src="([^"]+)"/);
 assert.ok(match&&match[1].startsWith('./media/'),'photo source missing or external');
 coverCounts.set(match[1],(coverCounts.get(match[1])||0)+1);
}
assert.equal(coverCounts.size,15,'not all original photographs distributed');
assert.ok(Math.max(...coverCounts.values())-Math.min(...coverCounts.values())<=1,'photo distribution not balanced');
assert.ok(win.PausePhotos.readerMarkup(readingList[0]).includes('來源'),'source label missing on article photo');

const sourceNode = { textContent: '', children: [], appendChild(node) { this.children.push(node); return node; } };
const viewNodes = new Map();
const readerSelector = selector => {
  if (selector === '#articleReaderSource') return sourceNode;
  if (!viewNodes.has(selector)) viewNodes.set(selector,
    { className: '', textContent: '', innerHTML: '', hidden: true, focus: () => {} });
  return viewNodes.get(selector);
};
const readerDocument = {
  body: { classList: { add: () => {} } },
  createElement: tagName => ({ tagName: tagName.toUpperCase() }),
  createTextNode: textContent => ({ nodeType: 3, textContent })
};
const readerStart = app.indexOf('function openArticle(title) {');
const readerEnd = app.indexOf('function openLongArticle(title) {', readerStart);
assert.ok(readerStart > 0 && readerEnd > readerStart, 'reader function missing');
const readerContext = {
  articles: state.articles, articleBodies: state.articleBodies,
  $: readerSelector, document: readerDocument, mediaMarkup: () => '', window: {},
  setTimeout: () => {}
};
vm.runInNewContext(app.slice(readerStart, readerEnd) + "\nopenArticle('曼荼羅（Mandala）');", readerContext, { timeout: 5000 });
const linkedSource = sourceNode.children.find(node => node.tagName === 'A');
assert.ok(linkedSource, 'mandala source should be clickable from reading modal');
assert.equal(linkedSource.href, readingByTitle('曼荼羅（Mandala）').url);
assert.equal(linkedSource.textContent, '大都會藝術博物館（The Met）');
assert.equal(linkedSource.rel, 'noopener noreferrer');
assert.equal(linkedSource.target, '_blank');
sourceNode.children.length = 0;
vm.runInNewContext(app.slice(readerStart, readerEnd) + "\nopenArticle('壓力來的時候，先做一件能讓自己回到當下的事');", readerContext, { timeout: 5000 });
assert.ok(!sourceNode.children.some(node => node.tagName === 'A'), 'original reading should not produce dummy source link');
for (const card of state.cards) {
  for (const key of ['type', 'text', 'source', 'tag', 'art']) {
    assert.ok(typeof card[key] === 'string' && card[key].trim(), 'card missing: ' + key);
  }
  if (card.sourceLink) assert.match(card.sourceLink, /^https:\/\//);
}
for (const article of state.articles) {
  assert.ok(article.title && article.description && article.source, 'missing article fields');
  assert.ok(Array.isArray(state.articleBodies[article.title]), 'article body missing: ' + article.title);
  assert.equal(state.articleBodies[article.title].length, 2, 'expected two body paragraphs: ' + article.title);
  if (article.url && article.url !== '#') assert.match(article.url, /^https:\/\//);
}
for (const line of win.dailyContent.companionLines) {
  assert.ok(line.reminder && line.title && line.text && line.scene, 'incomplete daily reminder');
}
for (const experience of win.dailyContent.experiences) {
  assert.ok(experience.rest?.title && experience.rest?.text &&
            experience.rest?.action && experience.rest?.note, 'invalid rest experience');
  assert.ok(experience.know?.question && experience.why?.question, 'invalid prompts');
  assert.equal(experience.know.options.length, 3, 'know should have 3 choices');
  assert.equal(experience.why.angles.length, 3, 'why should have 3 angles');
  for (const row of [...experience.know.options, ...experience.why.angles]) {
    assert.ok(Array.isArray(row) && row.length === 2 && row.every(x => typeof x === 'string' && x.trim()), 'empty option');
  }
}
for (const item of win.mediaData) {
  const rel = item.file.replace(/^\.\//, '');
  assert.ok(exists(rel), 'image missing: ' + rel);
  const bytes = fs.readFileSync(path.join(root, rel));
  if (rel.endsWith('.webp')) assert.equal(bytes.toString('ascii', 0, 4), 'RIFF', 'corrupt WebP: ' + rel);
  else if (rel.endsWith('.jpg')) assert.equal(bytes.subarray(0, 3).toString('hex'), 'ffd8ff', 'corrupt JPG: ' + rel);
  assert.ok(item.credit && item.license && item.sourceUrl, 'missing photo attribution: ' + rel);
}
console.log(JSON.stringify({
  status: 'pass', root, long: 33, longSections: 132, short: 37,
  curiosity: 36, sourceReferences: 117, uniqueSources: 97,
  cards: 80, dailyReminders: 31, experiences: 15,
  readingEntries: 57, images: 15, scripts: required.filter(x => x.endsWith('.js')).length
}, null, 2));
