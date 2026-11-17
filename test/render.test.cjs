const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

/**
 * Render smoke test: runs the seat and the index with a minimal React stand-in
 * so a missing translator, wrong hook order, or broken placement math fails
 * here instead of blanking the shipped model menu in the browser.
 */

const root = path.resolve(__dirname, '..');
const MARKER = "    return {\n      inject: ['slots', 'locale'],";
const EXPOSE = "    return {\n      __test: { VendorSeat, VendorIndex, SettingsCard, panel, settings },\n      inject: ['slots', 'locale'],";

function load() {
  const raw = fs.readFileSync(path.join(root, 'client.js'), 'utf8');
  assert.ok(raw.includes(MARKER), 'exposure marker must match the Client module');
  let definition;
  const store = new Map();
  const context = {
    window: {
      __ModuleLoader__: { load(value) { definition = value; } },
      innerWidth: 1000,
      innerHeight: 800,
      addEventListener() {},
      removeEventListener() {},
      requestAnimationFrame: fn => { fn(); return 1; },
      cancelAnimationFrame() {},
      setTimeout: fn => { fn(); return 1; },
      getComputedStyle: () => ({ position: 'static' }),
      localStorage: {
        getItem: key => (store.has(key) ? store.get(key) : null),
        setItem: (key, value) => store.set(key, value),
      },
    },
    console: { error: () => {} },
    document: { head: { appendChild() {} }, body: null, createElement: () => ({ remove() {} }) },
    styles: { insert: () => () => {} },
  };
  vm.createContext(context);
  vm.runInContext(raw.replace(MARKER, EXPOSE), context, { filename: 'client.js' });
  return { definition };
}

function makeReact() {
  const harness = { queue: [], index: 0 };
  const React = {
    Fragment: 'fragment',
    createElement(type, props, ...children) {
      return { type, props: props ?? {}, children };
    },
    useState(initial) {
      const value = harness.index < harness.queue.length ? harness.queue[harness.index] : initial;
      harness.index += 1;
      return [value, () => {}];
    },
    useRef(value) { return { current: value }; },
    useMemo(fn) { return fn(); },
    useCallback(fn) { return fn; },
    useEffect() {},
    useSyncExternalStore(_subscribe, getSnapshot) { return getSnapshot(); },
  };
  return { React, harness };
}

function textOf(node) {
  if (node === null || node === undefined || node === false) return '';
  if (typeof node === 'string' || typeof node === 'number') return String(node);
  if (Array.isArray(node)) return node.map(textOf).join(' ');
  return textOf(node.children);
}

function collect(node, predicate, out = []) {
  if (node === null || node === undefined || node === false) return out;
  if (Array.isArray(node)) {
    for (const child of node) collect(child, predicate, out);
    return out;
  }
  if (typeof node !== 'object') return out;
  if (predicate(node)) out.push(node);
  for (const child of node.children) collect(child, predicate, out);
  return out;
}

const directoryState = {
  current: { provider: 'tb', model: 'm1' },
  groups: [
    { id: 'deepseek-official', name: 'DeepSeek', models: [{ id: 'ds1', name: 'DeepSeek Model' }] },
    { id: 'deepseek-official-vision', name: 'DeepSeek + 自动识图', models: [{ id: 'ds1', name: 'DeepSeek Model' }] },
    { id: 'tb', name: 'TB积分助手', models: [{ id: 'm1', name: 'Model One' }, { id: 'm2', name: 'Model Two' }] },
    { id: 'codearts', name: 'CodeArts', models: [] },
  ],
  failures: [],
  status: 'ready',
  pending: null,
  error: null,
};
const directory = {
  store: { getSnapshot: () => directoryState, subscribe: () => () => {} },
  load: async () => directoryState,
  select: async () => ({ ok: true, value: undefined }),
};
const models = { directoryFor: id => (assert.equal(id, 'session-1'), directory) };

const { definition } = load();
const { React, harness } = makeReact();
const plugin = definition.factory(() => React);
const { VendorSeat, VendorIndex, SettingsCard, panel, settings } = plugin.__test;

const baseProps = {
  sessionId: 'session-1',
  locked: false,
  dismiss: () => {},
  reportFailure: () => {},
  getModels: () => models,
  t: key => key,
};

function renderSeat(queue, overrides = {}) {
  harness.index = 0;
  harness.queue = queue;
  return VendorSeat({ ...baseProps, ...overrides });
}

/* ---------------------------------------------------------------- panel mode */

settings.set('panel');
const arm = renderSeat([]);
assert.equal(arm.props.className, 'vqs-arm', 'panel mode injects only a zero-height probe');
assert.equal(arm.children.length, 0, 'the shipped menu gains no rows in panel mode');

/* --------------------------------------------------------------- index column */

const surface = {
  isConnected: true,
  contains: () => true,
  getBoundingClientRect: () => ({ top: 300, bottom: 520, left: 400, right: 560 }),
  querySelector: () => null,
};
panel.show('session-1', surface);
harness.index = 0;
harness.queue = [{ top: 300, bottom: 520, left: 400, right: 560 }, null];
const index = VendorIndex({ getModels: () => models, t: key => key });

assert.equal(index.props.className, 'vqs-col');
assert.equal(index.props.style.width, 176);
assert.equal(index.props.style.left, 560 + 6, 'attaches beside the shipped menu');
assert.equal(index.props.style.top, 300, 'starts level with the shipped menu');
assert.ok(index.props.style.top + index.props.style.maxHeight <= 800 - 132, 'clears the tool row');

// A menu that renders far past the window must not drag the column with it:
// the column is clamped to the band and the menu itself is left alone.
{
  const spilling = {
    isConnected: true,
    contains: () => true,
    getBoundingClientRect: () => ({ top: 12, bottom: 1400, left: 400, right: 560 }),
    querySelector: () => null,
    style: { top: '', bottom: '', maxHeight: '' },
  };
  panel.show('session-1', spilling);
  harness.index = 0;
  harness.queue = [{ top: 12, bottom: 1400, left: 400, right: 560 }, null];
  const tall = VendorIndex({ getModels: () => models, t: key => key });
  assert.ok(tall.props.style.top >= 8, 'column stays below the ceiling');
  assert.ok(tall.props.style.top + tall.props.style.maxHeight <= 800 - 132, 'column stays in the band');
  assert.deepEqual(spilling.style, { top: '', bottom: '', maxHeight: '' }, 'the shipped menu is untouched');
  panel.show('session-1', surface);
}

const indexVendors = collect(index, node => node.props['data-vendor-id'] !== undefined);
assert.deepEqual(indexVendors.map(node => node.props['data-vendor-id']), ['deepseek-official', 'tb', 'codearts']);
assert.ok(!textOf(index).includes('自动识图'), 'vision twins never render');
assert.equal(collect(index, node => node.props['aria-current'] === 'true').length, 1);

// No second column: the shipped model list is the second level.
assert.equal(collect(index, node => node.props.role === 'menuitemradio').length, 0);

// The press must never reach the shipped menu's outside-press dismissal, and
// must not steal focus: a focused row here fires the menu's own blur handler,
// which closes everything. Both signals have to be swallowed.
let stopped = 0;
let prevented = 0;
const press = { stopPropagation: () => { stopped += 1; }, preventDefault: () => { prevented += 1; } };
assert.equal(typeof index.props.onPointerDown, 'function');
assert.equal(typeof index.props.onMouseDown, 'function');
index.props.onPointerDown(press);
index.props.onMouseDown(press);
assert.equal(stopped, 2, 'press is swallowed at the column');
assert.equal(prevented, 1, 'mousedown refuses focus so the menu does not blur-close');

/* ------------------------------------------------- vendor jump into the list */

{
  const scrolled = [];
  const heading = { children: [], textContent: 'CodeArts', scrollIntoView: () => { scrolled.push('CodeArts'); } };
  const list = { querySelectorAll: () => [heading] };
  const withList = {
    isConnected: true,
    contains: () => true,
    getBoundingClientRect: () => ({ top: 300, bottom: 520, left: 400, right: 560 }),
    querySelector: selector => (selector === '[role="menu"]' ? list : null),
  };
  panel.show('session-1', withList);
  harness.index = 0;
  harness.queue = [{ top: 300, bottom: 520, left: 400, right: 560 }, null];
  const open = VendorIndex({ getModels: () => models, t: key => key });
  const codearts = collect(open, node => node.props['data-vendor-id'] === 'codearts')[0];
  codearts.props.onClick();
  assert.deepEqual(scrolled, ['CodeArts'], 'clicking a vendor scrolls the shipped list to its group');
}

/* ------------------------------- root pane: open the list, then reveal the group */

{
  const clicks = [];
  const cell = { click: () => { clicks.push('model'); } };
  const rootSurface = {
    isConnected: true,
    contains: () => true,
    getBoundingClientRect: () => ({ top: 300, bottom: 520, left: 400, right: 560 }),
    querySelector: selector => (selector === 'button[role="menuitem"]' ? cell : null),
  };
  panel.show('session-1', rootSurface);
  harness.index = 0;
  harness.queue = [{ top: 300, bottom: 520, left: 400, right: 560 }, null];
  const open = VendorIndex({ getModels: () => models, t: key => key });
  const first = collect(open, node => node.props['data-vendor-id'] === 'tb')[0];
  first.props.onClick();
  assert.deepEqual(clicks, ['model'], 'the shipped model pane is opened before revealing');
}

// Narrow viewport: the column flips to the left of the menu instead of overflowing.
harness.index = 0;
harness.queue = [{ top: 300, bottom: 520, left: 700, right: 860 }, null];
const narrow = VendorIndex({ getModels: () => models, t: key => key });
assert.ok(narrow.props.style.left < 700, 'flips left when the right side is full');

// Closed store renders nothing.
panel.close();
assert.equal(VendorIndex({ getModels: () => models, t: key => key }), null);

/* ----------------------------------------------------------------- menu mode */

settings.set('menu');
const rootRow = renderSeat(['root', null]);
assert.equal(rootRow.props.role, 'group');
const rootButtons = collect(rootRow, node => node.props.role === 'menuitem');
assert.equal(rootButtons.length, 1, 'root pane adds exactly one row');
assert.ok(textOf(rootButtons[0]).includes('vendor'));
assert.ok(textOf(rootButtons[0]).includes('TB积分助手'));

const vendorPane = renderSeat(['vendors', null]);
assert.deepEqual(
  collect(vendorPane, node => node.props['data-vendor-id'] !== undefined).map(node => node.props['data-vendor-id']),
  ['deepseek-official', 'tb', 'codearts'],
);

const modelPane = renderSeat(['models', 'tb']);
assert.deepEqual(
  collect(modelPane, node => node.props.role === 'menuitemradio').map(node => node.props.title),
  ['Model One', 'Model Two'],
);

/* -------------------------------------------------------------- robustness */

assert.doesNotThrow(() => renderSeat(['root', null], { t: undefined }));
const locked = renderSeat(['root', null], { locked: true });
assert.ok(collect(locked, node => node.props.role === 'menuitem').every(node => node.props.disabled === true));
assert.equal(renderSeat(['root', null], { sessionId: undefined }), null);

/* ------------------------------------------------------------------ settings */

settings.set('panel');
assert.deepEqual(
  collect(SettingsCard({ t: key => key }), node => node.props.role === 'radio').map(node => node.props['aria-checked']),
  [true, false],
);

console.log('vendor quick switch: render smoke test passed');