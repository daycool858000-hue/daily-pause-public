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
assert.equal(Object.keys(state.articleBodies).length, 45);
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
