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
  'index.html', 'styles.css', 'app.js', 'cards-data.js',
  'daily-content.js', 'quiet-spaces.js', 'long-articles.js',
  'short-articles.js', 'curiosity.js', 'media.js'
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

const win = {
  localStorage: {
    getItem: () => null, setItem: () => {}, removeItem: () => {}
  }
};
const sandbox = { window: win };
for (const name of ['cards-data.js', 'daily-content.js', 'long-articles.js',
                    'short-articles.js', 'curiosity.js', 'media.js']) {
  vm.runInNewContext(read(name), sandbox, { filename: name, timeout: 8000 });
}
assert.equal(win.longArticlesData.length, 27);
assert.equal(win.longArticlesData.reduce((n, a) => n + a.sections.length, 0), 108);
assert.equal(win.shortArticlesData.length, 25);
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
const prefixCut = app.indexOf('const defaultLongArticles = []');
assert.ok(prefixCut > 0, 'outdated fallback was not removed');
assert.ok(!app.includes('openstax.org'), 'outdated OpenStax reference remains in app.js');
const bootstrap = app.slice(0, prefixCut) +
  '\n;globalThis.__AUDIT = { cards, articles, articleBodies, dailyCards };';
vm.runInNewContext(bootstrap, sandbox, { filename: 'app.js:bootstrap', timeout: 10000 });
const state = sandbox.__AUDIT;
assert.equal(state.cards.length, 80);
assert.equal(state.dailyCards.length, 5);
assert.equal(new Set(state.dailyCards.map(c => c.text)).size, 5);
assert.equal(new Set(state.cards.map(c => c.text)).size, 80);
assert.equal(state.articles.length, 45, '20 directory entries plus 25 short essays');
assert.ok(state.articles.some(a => a.title === '曼荼羅（Mandala）' && a.url.includes('metmuseum.org')), 'mandala reference must point to the religion/art topic, not a disambiguation page');
assert.ok(!state.articles.some(a => a.url.includes('%E6%9B%BC%E9%99%80%E7%BE%85')), 'misleading mandala disambiguation link must be absent');
assert.equal(Object.keys(state.articleBodies).length, 45);
assert.equal(new Set(state.articles.map(a => a.title)).size, 45, 'reading titles must be unique');
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
  $: readerSelector, document: readerDocument, mediaMarkup: () => '',
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
  status: 'pass', root, long: 27, longSections: 108, short: 25,
  curiosity: 36, sourceReferences: 117, uniqueSources: 97,
  cards: 80, dailyReminders: 31, experiences: 15,
  readingEntries: 45, images: 15, scripts: required.filter(x => x.endsWith('.js')).length
}, null, 2));
