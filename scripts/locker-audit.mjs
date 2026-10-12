// No real visitor text is used. Simulate locker save, lock, reload, unlock,
// escaped display, release, and storage-denied failure in an isolated JS context.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

const root = path.resolve(process.argv[2] || '.');
const source = fs.readFileSync(path.join(root, 'quiet-spaces.js'), 'utf8');
const storage = new Map();
let clock = Date.now();
const fixture = '測試紙條 <script>alert("x")</script> & 再見';
let storageDenied = false;

class ClockDate extends Date {
  constructor(...args) { super(...(args.length ? args : [clock])); }
  static now() { return clock; }
}
const localStorage = {
  getItem: key => storage.get(key) ?? null,
  setItem: (key, value) => {
    if (storageDenied) throw new Error('Storage unavailable');
    storage.set(key, String(value));
  },
  removeItem: key => storage.delete(key)
};
function createDOM() {
  let warning = null;
  const callbacks = {};
  const cls = { add: () => {}, remove: () => {} };
  const lockerRoom = {
    innerHTML: '',
    querySelector: () => ({ classList: cls }),
    addEventListener: (name, cb) => { callbacks.room = cb; }
  };
  const lockerEditor = {
    hidden: true, innerHTML: '', dataset: {}, warning: null,
    addEventListener: (name, cb) => { callbacks.editor = cb; },
    scrollIntoView: () => {},
    querySelector: selector => {
      if (selector === '#lockerText') return { value: fixture, focus: () => {} };
      if (selector === '.locker-warn') return { replaceWith: item => { warning = item; } };
      return null;
    }
  };
  const document = {
    querySelector: selector => selector === '#lockerRoom' ? lockerRoom :
      selector === '#lockerEditor' ? lockerEditor : null,
    querySelectorAll: () => [],
    createElement: tag => ({
      tagName: tag, className: '', textContent: '',
      setAttribute: () => {}
    })
  };
  vm.runInNewContext(source, {
    document, localStorage, Date: ClockDate,
    setTimeout: fn => { fn(); return 1; },
    clearTimeout: () => {},
    setInterval: () => 1,
    console
  }, { filename: 'quiet-spaces.js', timeout: 10000 });
  assert.equal(typeof callbacks.room, 'function');
  assert.equal(typeof callbacks.editor, 'function');
  const click = (kind, id = 1) => {
    const route = kind === 'open' ? callbacks.room : callbacks.editor;
    const selector = kind === 'open' ? '[data-locker-id]' :
      kind === 'save' ? '[data-locker-save]' : '[data-release-locker]';
    route({
      target: {
        closest: query => query === selector ? { dataset: {
          lockerId: String(id), lockerSave: String(id), releaseLocker: String(id)
        }} : null
      }
    });
  };
  return { lockerRoom, lockerEditor, click, get warning() { return warning; } };
}

let ui = createDOM();
assert.match(ui.lockerRoom.innerHTML, /空著/, 'locker starts empty');
ui.click('open');
assert.match(ui.lockerEditor.innerHTML, /lockerText/, 'must offer a compose editor');
ui.click('save');
let saved = JSON.parse(storage.get('xinli-holding-place-v1'));
assert.equal(saved.length, 1, 'writing must persist');
assert.equal(saved[0].text, fixture);
assert.ok(saved[0].unlockAt > clock, 'locked until a later date');
assert.ok(!ui.lockerRoom.innerHTML.includes(fixture), 'private text must not appear in grid');
ui.click('open');
assert.match(ui.lockerEditor.innerHTML, /還沒到取回的日子/, 'early read must be blocked');
assert.ok(!ui.lockerEditor.innerHTML.includes(fixture), 'locked editor must not expose private content');
ui = createDOM();
assert.match(ui.lockerRoom.innerHTML, /locked/, 'locker must remain locked after reload');
clock = saved[0].unlockAt + 1000;
ui.click('open');
assert.match(ui.lockerEditor.innerHTML, /測試紙條/, 'text not restored after unlock');
assert.ok(!ui.lockerEditor.innerHTML.includes('<script>'), 'HTML injection must be escaped');
assert.match(ui.lockerEditor.innerHTML, /&lt;script&gt;/, 'HTML characters must be escaped');
ui.click('release');
assert.equal(JSON.parse(storage.get('xinli-holding-place-v1')).length, 0);
ui = createDOM();
assert.match(ui.lockerRoom.innerHTML, /空著/, 'locker must become available after release');
storageDenied = true;
ui.click('open');
ui.click('save');
assert.match(ui.warning?.textContent || '', /無法儲存/, 'storage failure must warn user');
assert.equal(storage.get('xinli-holding-place-v1'), '[]', 'failure must not claim success');
console.log(JSON.stringify({
  status: 'PASS',
  scenarios: ['empty', 'save', 'closed concealment', 'premature unlock denied',
              'reload keeps lock', 'time-unlock', 'HTML escaping',
              'release', 'storage failure'],
  simulated: true,
  realBrowserManualTest: false
}, null, 2));
