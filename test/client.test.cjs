const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.resolve(__dirname, '..');
const plain = value => JSON.parse(JSON.stringify(value));
const MARKER = "    return {\n      inject: ['slots', 'locale'],";
const EXPOSE = "    return {\n      __test: { orderVendors, isVisionTwin, vendorFor, modelRowFor, selectionFor, settings, panel, credits, creditSourceOf, abbreviateCredit, creditExact, creditView, magpieAccountsFor, magpieCredit, parseMagpieBalance },\n      inject: ['slots', 'locale'],";

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
  const { source, definition, context, store } = load();
  const installFetch = impl => { context.window.fetch = impl; };
  assert.equal(definition.id, 'dsh-vendor-quick-switch');
  assert.ok(!/require\(['"]react-dom['"]\)/.test(source), 'must not require react-dom');
  assert.ok(!/ReactDOM\.|createPortal/.test(source), 'no portal machinery');

  // The index must use the shipped menu's own surface material, not a hand-picked color.
  assert.ok(source.includes('var(--dsw-menu-surface-fill'), 'menu surface fill token');
  assert.ok(source.includes('var(--dsw-menu-backdrop-filter'), 'menu backdrop token');

  const plugin = definition.factory(() => React);
  const {
    orderVendors, isVisionTwin, vendorFor, modelRowFor, selectionFor, settings, panel,
    credits, creditSourceOf, abbreviateCredit, creditExact, creditView, magpieAccountsFor, magpieCredit, parseMagpieBalance,
  } = plugin.__test;

  assert.equal(settings.getSnapshot(), 'panel');
  settings.set('menu');
  assert.equal(store.get('dsh-vendor-quick-switch.settings'), '{"mode":"menu"}');
  settings.set('panel');
  assert.equal(settings.getSnapshot(), 'panel');

  const groups = [
    { id: 'tb', name: 'TB积分助手', models: [{ id: 'm1', name: 'Model One' }] },
    { id: 'deepseek-official-vision', name: 'DeepSeek + 自动识图', models: [] },
    { id: 'deepseek-official', name: 'DeepSeek', models: [{ id: 'ds1', name: 'DeepSeek Model' }] },
    { id: 'codearts-vision', name: 'CodeArts + Auto Vision', models: [] },
    { id: 'codearts', name: 'CodeArts', models: [{ id: 'ca1', name: 'CodeArts Model' }] },
    { id: 'empty', name: 'Empty vendor', models: [] },
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

  /* ---------------------------------------------------------------- credits */

  // Only vendors whose number some plugin actually owns get a source.
  assert.equal(creditSourceOf('taobao'), 'tb');
  assert.equal(creditSourceOf('deepseek-official'), 'whale');
  assert.equal(creditSourceOf('zcode'), 'channel');
  assert.equal(creditSourceOf('gemini'), 'channel');
  assert.equal(creditSourceOf('codearts'), null, 'no invented source');
  assert.equal(creditSourceOf('deepseek-official-vision'), null);

  // Four digits and up are abbreviated; below that the value stays readable.
  assert.equal(abbreviateCredit(999), '999');
  assert.equal(abbreviateCredit(42.55), '42.6');
  assert.equal(abbreviateCredit(1000), '1k');
  assert.equal(abbreviateCredit(1234), '1.2k');
  assert.equal(abbreviateCredit(5428.9), '5.4k');
  assert.equal(abbreviateCredit(999999), '1M', 'never prints 1000k');
  assert.equal(abbreviateCredit(1234567), '1.2M');
  assert.equal(abbreviateCredit(999999999), '1B');
  assert.equal(abbreviateCredit(null), null);
  assert.equal(abbreviateCredit('nope'), null);
  assert.equal(creditExact(1200), '1,200');
  assert.equal(creditExact(5.4289), '5.43');
  assert.equal(creditExact(5428.9), '5,428.90');

  const fakeT = (key, vars) => (vars === undefined ? key : `${vars.label}=${vars.detail}`);
  assert.equal(creditView(undefined, fakeT), null);
  assert.equal(creditView({ state: 'miss', badge: null, source: 'tb' }, fakeT), null, 'miss renders nothing');
  assert.deepEqual(plain(creditView({ state: 'ok', badge: '5.4k', detail: '5,428.90', source: 'tb' }, fakeT)), {
    badge: '5.4k',
    title: 'credits.tb=5,428.90',
  });

/* ------------------------------------------------------------- Magpie rules */

  assert.deepEqual(plain(parseMagpieBalance('¥1,234.56')), {
    amount: 1234.56, symbol: '¥', unit: '', key: '¥:',
  });
  assert.equal(parseMagpieBalance('not reported'), null);
  const quotaRows = [
    { provider: 'codex', name: 'Codex', windows: [{ name: '7 days', used: 25, remaining: 75 }] },
    { provider: 'kiro', name: 'Kiro', balance: '$1,234.50' },
    { provider: 'zcode', name: 'ZCode', windows: [{ name: 'Total credits', limit: 2000, amount: 500, unit: 'tokens' }] },
  ];
  const codexGroup = { id: 'dsh-magpie-connector-codex', name: 'Magpie (Codex)', models: [{ id: 'gpt-5' }] };
  assert.equal(magpieAccountsFor(codexGroup, quotaRows).length, 1);
  assert.equal(magpieCredit(codexGroup, quotaRows).badge, '75%');
  assert.equal(magpieCredit({ id: 'kiro', name: 'Kiro', models: [] }, quotaRows).badge, '$1.2k');
  assert.equal(magpieCredit({ id: 'zcode', name: 'ZCode', models: [] }, quotaRows).badge, '1.5k');
  assert.equal(magpieCredit({ id: 'zcode', name: 'ZCode', models: [] }, quotaRows).source, 'magpie');
  assert.equal(magpieAccountsFor({ id: 'other', name: 'Other', models: [{ id: 'claude-opus' }] }, quotaRows).length, 0,
    'a model family never decides the vendor');
  assert.equal(magpieAccountsFor({ id: 'magpie', name: 'Magpie', models: [{ id: 'subscription:magpie/codex/gpt-5' }] }, quotaRows).length, 1);

  const twoBalances = [
    { provider: 'deepseek', name: 'DeepSeek', balance: '¥1000' },
    { provider: 'deepseek', name: 'DeepSeek', balance: '¥234.5' },
  ];
  assert.equal(magpieCredit({ id: 'deepseek', name: 'DeepSeek', models: [] }, twoBalances).badge, '¥1.2k',
    'same-unit accounts are summed exactly before abbreviating');
  const mixed = [
    { provider: 'magpie', name: 'Magpie', balance: '$10' },
    { provider: 'magpie', name: 'Magpie', balance: '200 tokens' },
  ];
  assert.equal(magpieCredit({ id: 'magpie', name: 'Magpie', models: [] }, mixed), null,
    'mixed units are never added together');
  const multiRoute = [
    { provider: 'codex', name: 'Codex', windows: [{ name: '7 days', remaining: 80 }] },
    { provider: 'claude', name: 'Claude', windows: [{ name: '7 days', remaining: 35 }] },
  ];
  const combinedRoute = {
    id: 'magpie', name: 'Magpie',
    models: [{ id: 'subscription:magpie/codex/gpt' }, { id: 'subscription:magpie/claude/sonnet' }],
  };
  assert.equal(magpieCredit(combinedRoute, multiRoute).badge, '35%', 'multi-owner route shows the tightest window');

  {
    const calls = [];
    const tick = () => new Promise(resolve => setImmediate(resolve));
    installFetch((url, init = {}) => {
      calls.push(url);
      if (url === '/api/tb-panel/points') {
        return { ok: true, status: 200, json: async () => ({ balance: 5428.9, checkedToday: true }) };
      }
      if (url === '/dsh-whale/balance.json') {
        return { ok: true, status: 200, json: async () => ({ ok: true, totalBalance: 12.345, currency: 'CNY' }) };
      }
      if (url === '/api/channel-pack') {
        const body = JSON.parse(init.body);
        assert.equal(body.type, 'client-request');
        assert.equal(body.method, 'channel-pack');
        assert.equal(body.payload.method, 'credits.balances');
        if (body.payload.payload.provider === 'gemini') {
          return { ok: true, status: 200, json: async () => ({ result: { ok: false, error: { message: 'no quota source' } } }) };
        }
        return {
          ok: true,
          status: 200,
          json: async () => ({ result: { ok: true, value: { accounts: [{ accountId: 'z', nickname: 'Z', balance: { total: 1234567 } }] } } }),
        };
      }
      return { ok: false, status: 404, json: async () => ({}) };
    });

    credits.bind({ get: () => undefined });
    credits.request(['taobao', 'deepseek-official', 'zcode', 'codearts', 'unknown']);
    await tick();
    const rows = credits.getSnapshot().rows;
    assert.equal(rows.taobao.badge, '5.4k');
    assert.equal(rows.taobao.detail, '5,428.90', 'tooltip keeps the exact number');
    assert.equal(rows['deepseek-official'].badge, '¥12.3');
    assert.equal(rows.zcode.badge, '1.2M');
    assert.equal(rows.zcode.detail, 'Z 1,234,567 tokens');
    assert.equal(rows.codearts.state, 'miss', 'unsupported vendor silently misses when Magpie has no matching route');
    assert.equal(rows.codearts.badge, null);
    assert.equal(rows.unknown.state, 'miss');

    const fetched = calls.length;
    credits.request(['taobao']);
    await tick();
    assert.equal(calls.length, fetched, 'a fresh row is not refetched');

    credits.request(['gemini']);
    await tick();
    const miss = credits.getSnapshot().rows.gemini;
    assert.equal(miss.state, 'miss', 'an error is a miss, not a zero');
    assert.equal(miss.badge, null);
    assert.equal(creditView(miss, fakeT), null);

    // A rejected fetch must settle as a miss instead of throwing into the menu.
    installFetch(() => Promise.reject(new Error('offline')));
    credits.request(['qoder']);
    await tick();
    assert.equal(credits.getSnapshot().rows.qoder.state, 'miss');
    credits.request(['qoder']);
    await tick();
  }

  {
    // Unknown/custom providers are resolved through the shared Magpie catalog.
    credits.__resetForTest();
    const calls = [];
    installFetch((url) => {
      calls.push(url);
      if (url === '/api/vendor-quick-switch/magpie-quotas') {
        return { ok: true, status: 200, json: async () => ({ ok: true, providers: quotaRows }) };
      }
      return { ok: false, status: 404, json: async () => ({}) };
    });
    credits.request([
      codexGroup,
      { id: 'kiro', name: 'Kiro', models: [{ id: 'kiro/claude-opus' }] },
      { id: 'unrelated', name: 'Unrelated', models: [{ id: 'claude-opus' }] },
    ]);
    await new Promise(resolve => setImmediate(resolve));
    await new Promise(resolve => setImmediate(resolve));
    const rows = credits.getSnapshot().rows;
    assert.equal(rows.codex?.badge, undefined, 'row key is the real DSH provider id');
    assert.equal(rows['dsh-magpie-connector-codex'].badge, '75%');
    assert.equal(rows['dsh-magpie-connector-codex'].source, 'magpie');
    assert.equal(rows.kiro.badge, '$1.2k');
    assert.equal(rows.unrelated.badge, null);
    assert.equal(calls.filter(url => url === '/api/vendor-quick-switch/magpie-quotas').length, 1,
      'all vendors share one Magpie read');
  }
  assert.equal(typeof context.window.fetch, 'function', 'fetch stub is installed');
  assert.equal(typeof credits.getSnapshot, 'function');

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

  // Regression: the shipped root pane paints the *current* model's provider id
  // on its "model" cell. Counting that marker as a revealed group made a click
  // on the currently selected vendor answer with a zero-distance success, so
  // only a real model option row may count.
  {
    const row = height => ({ getBoundingClientRect: () => ({ height }) });
    const marker = (id, target) => ({
      getAttribute: name => (name === 'data-provider-id' ? id : null),
      closest: selector => (selector === 'button[role="menuitemradio"]' ? target : null),
    });
    const live = row(30);
    assert.equal(modelRowFor([marker('codearts', null)], 'codearts'), null,
      'the root pane model cell is not a revealed vendor group');
    assert.equal(modelRowFor([marker('codearts', live)], 'codearts'), live,
      'a listed model row is revealed');
    assert.equal(modelRowFor([marker('codearts', row(0))], 'codearts'), null,
      'a collapsing row cannot be revealed');
    assert.equal(modelRowFor([marker('codearts', row(0)), marker('codearts', live)], 'codearts'), live,
      'a later visible row still wins');
    assert.equal(modelRowFor([marker('qoder', live)], 'codearts'), null,
      'another vendor never matches');
    assert.equal(modelRowFor([null, {}, marker(null, live)], 'codearts'), null,
      'junk markers never throw');
    assert.ok(source.includes('modelRowFor(scope.querySelectorAll'), 'the jump reads option rows only');
  }

  // The shipped menu belongs to the host: its height, offset, and length must
  // never be written by this plugin, even when it renders past the window.
  assert.ok(!/\.style\.maxHeight/.test(source), 'the shipped menu height is never written');
  assert.ok(!/\.style\.top\s*=/.test(source), 'the shipped menu offset is never written');
  assert.ok(!/\.style\.bottom\s*=/.test(source), 'the shipped menu bottom is never written');
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