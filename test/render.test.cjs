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
const EXPOSE = "    return {\n      __test: { VendorSeat, VendorIndex, SettingsCard, panel, settings, credits },\n      inject: ['slots', 'locale'],";

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
      setTimeout: () => 1,
      getComputedStyle: node => ({
        position: 'static',
        ...(node && node.__scrollY ? { overflowY: 'auto' } : {}),
      }),
      KeyboardEvent: class KeyboardEvent {
        constructor(type, props) { this.type = type; Object.assign(this, props); }
      },
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
  if (typeof node.type === 'function') {
    // Resolve function components (the credit badge) so assertions see real rows.
    return collect(node.type({ ...node.props, children: node.children }), predicate, out);
  }
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
    { id: 'codearts', name: 'CodeArts', models: [{ id: 'ca1', name: 'CodeArts Model' }] },
    { id: 'empty', name: 'Empty vendor', models: [] },
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
const { VendorSeat, VendorIndex, SettingsCard, panel, settings, credits } = plugin.__test;
const plain = value => JSON.parse(JSON.stringify(value));

/* With no fetch the store stays empty and every badge renders nothing. */
assert.deepEqual(plain(credits.getSnapshot().rows), {}, 'no fetch, no rows, no throw');

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
assert.equal(collect(index, node => node.props.className === 'vqs-credit').length, 0, 'unknown vendors get no badge');

/* A settled row shows its badge with the source and the exact value in the
 * tooltip; the badge sits between the vendor name and the selection check. */
credits.__setForTest('tb', { state: 'ok', badge: '5.4k', detail: '5,428.90', source: 'tb', at: Date.now() });
harness.index = 0;
harness.queue = [{ top: 300, bottom: 520, left: 400, right: 560 }, null];
const credited = VendorIndex({ getModels: () => models, t: key => key });
const badge = collect(credited, node => node.props.className === 'vqs-credit');
assert.equal(badge.length, 1, 'only the vendor whose source answered shows a badge');
assert.equal(textOf(badge[0]), '5.4k');
assert.equal(badge[0].props.title, 'credits.title');
const tbRow = collect(credited, node => node.props['data-vendor-id'] === 'tb')[0];
assert.deepEqual(tbRow.children.map(child => child && child.props && child.props.className), ['vqs-name', undefined, 'vqs-check']);
credits.__setForTest('tb', { state: 'miss', badge: null, detail: null, source: 'tb', at: Date.now() });

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
  /* Match the shipped DOM: MenuGroup > model row > label[data-provider-id].
   * The heading deliberately has unrelated text: provider id, not a localized
   * title, is what must locate the group. */
  const scroller = {
    __scrollY: true,
    scrollTop: 120,
    scrollHeight: 1200,
    clientHeight: 300,
    getBoundingClientRect: () => ({ top: 100, bottom: 400, left: 0, right: 200 }),
    parentElement: null,
  };
  const makeGroup = (provider, top, rowTop = top + 30, stickyTop = top) => {
    const heading = {
      children: [],
      textContent: '标题文字不参与定位',
      getBoundingClientRect: () => ({ top: stickyTop, bottom: stickyTop + 24, left: 0, right: 200 }),
      scrollIntoView: () => { throw new Error('the inner scroller should be used, not the page'); },
    };
    const group = {
      firstElementChild: heading,
      querySelectorAll: () => [],
      getBoundingClientRect: () => ({ top, bottom: rowTop + 20, left: 0, right: 200 }),
    };
    const row = {
      contains: () => false,
      getBoundingClientRect: () => ({ top: rowTop, bottom: rowTop + 20, left: 0, right: 200 }),
      parentElement: group,
      // Only the shipped list container is a `[role="menu"]`; the model row is
      // a `menuitemradio` button and must be found exactly that way.
      closest: selector => (selector === '[role="menu"]' ? scroller : null),
    };
    const marker = {
      getAttribute: name => (name === 'data-provider-id' ? provider : null),
      closest: selector => (selector === 'button[role="menuitemradio"]' ? row : null),
    };
    group.parentElement = scroller;
    scroller.querySelectorAll = selector => (selector === '[data-provider-id]' ? [marker] : []);
    return { group, heading, row, marker };
  };

  makeGroup('codearts', 500, 530);
  const withList = {
    isConnected: true,
    contains: () => true,
    getBoundingClientRect: () => ({ top: 300, bottom: 520, left: 400, right: 560 }),
    querySelector: selector => (selector === '[role="menu"]' ? scroller : null),
    // A real surface contains the drilled list, so provider markers are found
    // from either scope.
    querySelectorAll: (...args) => scroller.querySelectorAll(...args),
  };
  panel.show('session-1', withList);
  harness.index = 0;
  harness.queue = [{ top: 300, bottom: 520, left: 400, right: 560 }, null];
  const open = VendorIndex({ getModels: () => models, t: key => key });
  const codearts = collect(open, node => node.props['data-vendor-id'] === 'codearts')[0];
  codearts.props.onClick();
  // The clicked group sits 400px below the viewport top and moves there.
  assert.equal(scroller.scrollTop, 120 + 400, 'the clicked vendor moves to the top of the list');

  // A vendor near the end stops at the maximum scroll instead of being forced up.
  makeGroup('tb', 2000, 2030);
  scroller.scrollTop = 100;
  panel.show('session-1', withList);
  harness.index = 0;
  harness.queue = [{ top: 300, bottom: 520, left: 400, right: 560 }, null];
  const tailIndex = VendorIndex({ getModels: () => models, t: key => key });
  collect(tailIndex, node => node.props['data-vendor-id'] === 'tb')[0].props.onClick();
  assert.equal(scroller.scrollTop, 900, 'clamped to the maximum scroll, allowed to sit mid-list');

  // A vendor already on screen still moves to the top: the click must visibly
  // reposition the list, not just highlight the row in the side index.
  makeGroup('codearts', 150, 180);
  scroller.scrollTop = 40;
  panel.show('session-1', withList);
  harness.index = 0;
  harness.queue = [{ top: 300, bottom: 520, left: 400, right: 560 }, null];
  collect(VendorIndex({ getModels: () => models, t: key => key }), node => node.props['data-vendor-id'] === 'codearts')[0].props.onClick();
  assert.equal(scroller.scrollTop, 40 + 50, 'a visible vendor aligns with the list top');

  // A group whose start is above the viewport scrolls back up to its start.
  makeGroup('codearts', -200, 130, 100);
  scroller.scrollTop = 70;
  panel.show('session-1', withList);
  harness.index = 0;
  harness.queue = [{ top: 300, bottom: 520, left: 400, right: 560 }, null];
  collect(VendorIndex({ getModels: () => models, t: key => key }), node => node.props['data-vendor-id'] === 'codearts')[0].props.onClick();
  assert.equal(scroller.scrollTop, 0, 'a group above the viewport is brought back to its start, clamped');
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

/* Regression: the vendor that is already selected must expand on click too.
 * The shipped root pane renders that vendor's id on its Model cell, so a
 * marker-only lookup answered "already revealed" with a zero-distance success
 * and the click did nothing until another vendor had been expanded first. */
{
  const clicks = [];
  const currentMarker = { getAttribute: () => 'deepseek-official', closest: () => null };
  const cell = { click: () => { clicks.push('model'); } };
  const surface = {
    isConnected: true,
    contains: () => true,
    getBoundingClientRect: () => ({ top: 300, bottom: 520, left: 400, right: 560 }),
    querySelectorAll: selector => (selector === '[data-provider-id]' ? [currentMarker] : []),
    querySelector: selector => (selector === 'button[role="menuitem"]' ? cell : null),
  };
  panel.show('session-1', surface);
  harness.index = 0;
  harness.queue = [{ top: 300, bottom: 520, left: 400, right: 560 }, null];
  const index = VendorIndex({ getModels: () => models, t: key => key });
  collect(index, node => node.props['data-vendor-id'] === 'deepseek-official')[0].props.onClick();
  assert.deepEqual(clicks, ['model'], 'the selected vendor still opens the model list');
}

/* ----------------------- effort/search panes: return, drill, then reveal */

for (const startPane of ['effort', 'search']) {
  let pane = startPane;
  let clicks = 0;
  let escapes = 0;
  const viewport = {
    __scrollY: true,
    scrollTop: 0,
    scrollHeight: 1000,
    clientHeight: 300,
    parentElement: null,
    getBoundingClientRect: () => ({ top: 100, bottom: 400, left: 0, right: 200 }),
  };
  const heading = {
    children: [],
    textContent: 'TB积分助手',
    getBoundingClientRect: () => ({ top: 500, bottom: 524, left: 0, right: 200 }),
  };
  const group = {
    firstElementChild: heading,
    querySelectorAll: () => [heading],
    parentElement: viewport,
    getBoundingClientRect: () => ({ top: 500, bottom: 550, left: 0, right: 200 }),
  };
  const row = {
    contains: () => false,
    parentElement: group,
    getBoundingClientRect: () => ({ top: 530, bottom: 550, left: 0, right: 200 }),
    closest: selector => (selector === '[role="menu"]' ? viewport : null),
  };
  const marker = {
    getAttribute: () => 'tb',
    closest: selector => (selector === 'button[role="menuitemradio"]' ? row : null),
  };
  /* The root pane paints the current model's provider id on its "model" cell.
   * That cell is a plain menuitem, never a model option row: it must not be
   * mistaken for a revealed group, or the current vendor answers the click
   * with a zero-distance success and never expands. */
  const cellMarker = {
    getAttribute: () => 'tb',
    closest: () => null,
  };
  viewport.querySelectorAll = selector => (selector === '[data-provider-id]' ? [marker] : []);
  const filtered = { querySelectorAll: () => [] };
  const cell = { click: () => { clicks += 1; pane = 'model'; } };
  const dynamicSurface = {
    isConnected: true,
    contains: () => true,
    getBoundingClientRect: () => ({ top: 300, bottom: 520, left: 400, right: 560 }),
    querySelectorAll: selector => (selector !== '[data-provider-id]'
      ? []
      : pane === 'model' ? [marker] : [cellMarker]),
    querySelector: selector => {
      if (selector === 'button[role="menuitem"]') return pane === 'root' ? cell : null;
      if (selector === '[role="menu"]') {
        if (pane === 'model') return viewport;
        if (pane === 'search') return filtered;
      }
      return null;
    },
    dispatchEvent: event => {
      assert.equal(event.key, 'Escape');
      escapes += 1;
      pane = 'root';
    },
  };
  panel.show('session-1', dynamicSurface);
  harness.index = 0;
  harness.queue = [{ top: 300, bottom: 520, left: 400, right: 560 }, null];
  const dynamicIndex = VendorIndex({ getModels: () => models, t: key => key });
  collect(dynamicIndex, node => node.props['data-vendor-id'] === 'tb')[0].props.onClick();
  assert.equal(escapes, 1, `${startPane}: Escape returns to the root pane`);
  assert.equal(clicks, 1, `${startPane}: the shipped Model cell is opened once`);
  assert.equal(pane, 'model', `${startPane}: target model pane is visible`);
  assert.equal(viewport.scrollTop, 400, `${startPane}: target group is revealed at the top after drilling`);
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