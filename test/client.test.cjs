const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.resolve(__dirname, '..');
const plain = value => JSON.parse(JSON.stringify(value));
const MARKER = "    return {\n      inject: ['slots', 'locale'],";
const EXPOSE = "    return {\n      __test: { orderVendors, isVisionTwin, vendorFor, selectionFor, settings, panel },\n      inject: ['slots', 'locale'],";

const React = {
  createElement: () => null,
  useSyncExternalStore: (_s, get) => get(),
  useCallback: fn => fn,
  useMemo: fn => fn(),
  useEffect: () => {},
  useState: value => [typeof value === 'function' ? value() : value, () => {}],
  useRef: value => ({ current: value }),
};

function load(withStyles = true) {
  const raw = fs.readFileSync(path.join(root, 'client.js'), 'utf8');
  assert.ok(raw.includes(MARKER), 'exposure marker must match the Client module');
  let definition;
  const head = { children: [], appendChild(node) { this.children.push(node); } };
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
    document: { head, body: null, createElement: () => ({ id: '', textContent: '', remove() {} }) },
  };
  if (withStyles) context.styles = { insert: css => { assert.ok(css.includes('.vqs-col')); return () => {}; } };
  vm.createContext(context);
  vm.runInContext(raw.replace(MARKER, EXPOSE), context, { filename: 'client.js' });
  return { source: raw, definition, context, store };
}

(async () => {
  const { source, definition, store } = load();
  assert.equal(definition.id, 'dsh-vendor-quick-switch');
  assert.ok(!/require\(['"]react-dom['"]\)/.test(source), 'must not require react-dom');
  assert.ok(!/ReactDOM\.|createPortal/.test(source), 'no portal machinery');

  // The index must use the shipped menu's own surface material, not a hand-picked color.
  assert.ok(source.includes('var(--dsw-menu-surface-fill'), 'menu surface fill token');
  assert.ok(source.includes('var(--dsw-menu-backdrop-filter'), 'menu backdrop token');

  const plugin = definition.factory(() => React);
  const { orderVendors, isVisionTwin, vendorFor, selectionFor, settings, panel } = plugin.__test;

  assert.equal(settings.getSnapshot(), 'panel');
  settings.set('menu');
  assert.equal(store.get('dsh-vendor-quick-switch.settings'), '{"mode":"menu"}');
  settings.set('panel');
  assert.equal(settings.getSnapshot(), 'panel');

  const groups = [
    { id: 'tb', name: 'TB积分助手', models: [] },
    { id: 'deepseek-official-vision', name: 'DeepSeek + 自动识图', models: [] },
    { id: 'deepseek-official', name: 'DeepSeek', models: [] },
    { id: 'codearts-vision', name: 'CodeArts + Auto Vision', models: [] },
    { id: 'codearts', name: 'CodeArts', models: [] },
  ];
  assert.equal(isVisionTwin(groups[1]), true);
  assert.equal(isVisionTwin(groups[3]), true);
  const vendors = orderVendors(groups);
  assert.deepEqual(plain(vendors.map(group => group.id)), ['deepseek-official', 'tb', 'codearts']);
  assert.equal(vendorFor(vendors, 'codearts-vision').id, 'codearts');
  assert.equal(vendorFor(vendors, null), undefined);

  const state = { groups: [{ id: 'tb', models: [{ id: 'pro', name: 'Pro', reasoning: { defaultEffort: 'high' } }] }] };
  assert.deepEqual(plain(selectionFor(state, 'tb', 'pro')), { provider: 'tb', model: 'pro', reasoningEffort: 'high' });

  const surface = { isConnected: true, contains: () => true, getBoundingClientRect: () => ({ top: 100, bottom: 300, left: 10, right: 200 }), querySelector: () => null };
  assert.equal(panel.getSnapshot().open, false);
  panel.show('session-1', surface);
  const shown = panel.getSnapshot();
  assert.equal(shown.open, true);
  assert.equal(shown.sessionId, 'session-1');
  assert.equal(shown.surface, surface, 'the index follows the shipped menu element itself');
  panel.close();
  assert.equal(panel.getSnapshot().open, false);

  const registrations = [];
  const slots = {
    inject(key, callback) {
      assert.ok([
        'conversation.input.model.options',
        'shell.overlay',
        'plugins.bundle.config',
      ].includes(key), `unexpected slot: ${key}`);
      return callback();
    },
    register(options, component) {
      registrations.push({ options, component });
      return () => {};
    },
  };
  const locale = {
    register(ns, dictionaries) {
      assert.equal(ns, 'vendorQuickSwitch');
      assert.deepEqual(Object.keys(dictionaries).sort(), ['en', 'zh']);
      return () => {};
    },
    bind(ns) {
      assert.equal(ns, 'vendorQuickSwitch');
      return key => key;
    },
  };
  const directory = {
    store: { getSnapshot: () => ({ current: null, groups: [], failures: [], status: 'idle', pending: null, error: null }), subscribe: () => () => {} },
    load: async () => ({}),
    select: async () => ({ ok: true }),
  };
  const models = { directoryFor: () => directory };
  const effects = [];
  plugin.apply({
    get(name) {
      return { slots, locale, modelDirectories: models }[name];
    },
    effect(callback) {
      const dispose = callback();
      effects.push(typeof dispose === 'function' ? dispose : () => {});
      return dispose;
    },
  });

  assert.deepEqual(plain(plugin.inject), ['slots', 'locale']);
  assert.equal(registrations.length, 3, 'seat + index + settings card');
  const byName = new Map(registrations.map(entry => [entry.options.name, entry.options]));
  assert.equal(byName.get('conversation.input.model.options').id, 'vendor-quick-switch');
  assert.equal(byName.get('shell.overlay').id, 'vendor-quick-switch-index');
  assert.equal(byName.get('plugins.bundle.config').key, 'dsh-vendor-quick-switch');
  for (const entry of registrations) {
    assert.equal(typeof entry.component, 'function');
    const injected = entry.options.inject();
    assert.equal(typeof injected.t, 'function');
  }

  assert.ok(!source.includes("'conversation.input.model'"), 'must not replace the model seat');
  assert.ok(!source.includes("'conversation.input.left'"), 'no standalone toolbar button');
  const patch = fs.readFileSync(path.join(root, 'cordis.patch.yml'), 'utf8');
  assert.ok(patch.includes('- insert:'));
  assert.ok(!patch.includes('disabled:'));
  assert.ok(!patch.includes('ui-model-selection'));

  assert.equal(effects.length, 2);
  for (const cleanup of effects.reverse()) cleanup();

  {
    const fallback = load(false);
    const fallbackPlugin = fallback.definition.factory(() => React);
    fallbackPlugin.apply({
      get(name) {
        return {
          slots: { inject: (_key, callback) => callback(), register: () => () => {} },
          locale: { register: () => () => {}, bind: () => key => key },
        }[name];
      },
      effect(callback) {
        const dispose = callback();
        return typeof dispose === 'function' ? dispose : () => {};
      },
    });
    assert.equal(fallback.context.document.head.children.length, 1, 'style fallback is used');
  }

  console.log('vendor quick switch: settings, vendor filter, and boundary tests passed');
})().catch(error => {
  console.error(error);
  process.exitCode = 1;
});