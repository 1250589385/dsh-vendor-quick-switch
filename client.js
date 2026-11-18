window.__ModuleLoader__.load({
  id: 'dsh-vendor-quick-switch',
  factory(require) {
    const React = require('react');
    const h = React.createElement;
    const NS = 'vendorQuickSwitch';
    const PACKAGE_NAME = 'dsh-vendor-quick-switch';
    const SETTINGS_KEY = 'dsh-vendor-quick-switch.settings';

    const zh = {
      vendor: '厂商',
      'vendor.account': 'DeepSeek 账号',
      'menu.providers': '厂商索引',
      'loading': '正在加载模型…',
      empty: '暂无厂商',
      'empty.models': '该厂商暂无模型',
      'error.select': '切换失败：{message}',
      'error.sessionInUse': '当前会话正被其他 DSH 实例占用，请关闭其他实例后重试。',
      'settings.title': '切换方式',
      'settings.description': '侧挂面板：打开模型菜单时，厂商索引常驻在菜单旁边，点厂商直接跳到原模型列表里该厂商的位置，不另做二级菜单。菜单内展开：不弹侧栏，只在原菜单里逐级展开厂商与模型。偏好保存在本机浏览器。',
      'settings.panel': '侧挂面板',
      'settings.menu': '菜单内展开',
      'credits.channel': '渠道包余额',
      'credits.tb': '淘宝积分',
      'credits.whale': 'DeepSeek 余额',
      'credits.magpie': 'MAGPIE 额度',
      'credits.title': '{label}：{detail}',
    };
    const en = {
      vendor: 'Vendor',
      'vendor.account': 'DeepSeek Account',
      'menu.providers': 'Vendor index',
      loading: 'Loading models…',
      empty: 'No vendors',
      'empty.models': 'No models for this vendor',
      'error.select': 'Could not switch models: {message}',
      'error.sessionInUse': 'This session is in use by another DSH instance. Close the other instance and try again.',
      'settings.title': 'Switching style',
      'settings.description': 'Side panel: while the model menu is open, a vendor index stays beside it; clicking a vendor jumps to that vendor inside the existing model list, with no separate second-level menu. In menu: no side list, the vendor and model lists expand inside the shipped menu. The preference is kept in this browser.',
      'settings.panel': 'Side panel',
      'settings.menu': 'In menu',
      'credits.channel': 'Channel pack balance',
      'credits.tb': 'TB points',
      'credits.whale': 'DeepSeek balance',
      'credits.magpie': 'Magpie quota',
      'credits.title': '{label}: {detail}',
    };

    const CSS = `
.vqs-option{box-sizing:border-box;display:flex;align-items:center;gap:6px;width:auto;max-width:100%;min-width:100%;height:34px;padding:0 8px;border:0;border-radius:var(--dsw-radius-md);outline:none;background:transparent;color:var(--dsw-alias-label-primary);font:inherit;font-size:13px;line-height:20px;font-weight:400;text-align:left;cursor:pointer}
.vqs-option:focus-visible{background:var(--dsw-alias-interactive-bg-hover)}
.vqs-option:disabled{color:var(--dsw-alias-label-dimmed);cursor:default}
.vqs-label{flex:0 0 auto;white-space:nowrap}
.vqs-value{flex:1 1 auto;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;text-align:right;color:var(--dsw-alias-label-tertiary)}
.vqs-chevron{flex:0 0 auto;width:12px;height:12px;color:var(--dsw-alias-menu-icon)}
.vqs-back{color:var(--dsw-alias-label-secondary);border-bottom:1px solid var(--dsw-alias-border-l1);border-radius:0;margin-bottom:3px}
.vqs-check{display:grid;place-items:center;flex:0 0 14px;color:var(--dsw-alias-label-primary)}
.vqs-check svg{width:14px;height:14px}
.vqs-name{flex:1 1 auto;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.vqs-credit{flex:0 0 auto;max-width:46%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:var(--dsw-alias-label-tertiary);font-size:11px;line-height:16px;font-variant-numeric:tabular-nums;text-align:right}
.vqs-option:disabled .vqs-credit{color:inherit;opacity:.72}
.vqs-status{padding:6px 8px;color:var(--dsw-alias-label-tertiary);font-size:12px;line-height:18px}
.vqs-spinner{box-sizing:border-box;width:12px;height:12px;border:1.5px solid currentColor;border-right-color:transparent;border-radius:50%;animation:vqs-spin .7s linear infinite}
@keyframes vqs-spin{to{transform:rotate(360deg)}}
@media(hover:hover){.vqs-option:hover:not(:disabled){background:var(--dsw-alias-interactive-bg-hover)}}
@media(prefers-reduced-motion:reduce){.vqs-spinner{animation:none}}
.vqs-arm{display:block;width:100%;height:0;padding:0;margin:0;border:0;overflow:hidden}
.vqs-col{box-sizing:border-box;position:fixed;z-index:1200;display:flex;flex-direction:column;min-height:0;padding:4px;border:0;border-radius:var(--dsw-radius-lg);background:var(--dsw-menu-surface-fill,var(--dsw-alias-bg-overlay));backdrop-filter:var(--dsw-menu-backdrop-filter,blur(40px) saturate(150%));-webkit-backdrop-filter:var(--dsw-menu-backdrop-filter,blur(40px) saturate(150%));box-shadow:var(--dsw-elevation-prominent);isolation:isolate;--dsw-elevation-stroke-color:var(--dsw-alias-border-l1);color:var(--dsw-alias-label-primary);--dsh-scrollbar-thumb:var(--dsw-alias-scrollbar-bg-l2);--dsh-scrollbar-thumb-hover:var(--dsw-alias-scrollbar-hover-l2)}
.vqs-scroll{min-height:0;overflow-x:hidden;overflow-y:auto;overscroll-behavior:contain}
.vqs-col .vqs-option{height:30px}
.vqs-settings{display:flex;flex-direction:column;gap:8px;padding:10px 0}
.vqs-settings-row{display:flex;align-items:flex-start;justify-content:space-between;gap:12px}
.vqs-settings-copy{display:flex;flex-direction:column;gap:3px;min-width:0}
.vqs-settings-title{font-size:13px;line-height:20px;color:var(--dsw-alias-label-primary)}
.vqs-settings-desc{font-size:12px;line-height:18px;color:var(--dsw-alias-label-secondary)}
.vqs-segmented{display:inline-flex;flex:none;padding:2px;border:1px solid var(--dsw-alias-border-l1);border-radius:var(--dsw-radius-md);background:var(--dsw-alias-bg-layer-2)}
.vqs-segment{box-sizing:border-box;height:26px;padding:0 10px;border:0;border-radius:var(--dsw-radius-sm);outline:none;background:transparent;color:var(--dsw-alias-label-secondary);font:inherit;font-size:12px;line-height:18px;cursor:pointer;white-space:nowrap}
.vqs-segment:focus-visible{box-shadow:0 0 0 2px var(--dsw-alias-brand-primary)}
.vqs-segment[aria-checked="true"]{background:var(--dsw-alias-bg-base);color:var(--dsw-alias-label-primary);box-shadow:0 1px 2px rgba(0,0,0,.16)}
@media(hover:hover){.vqs-segment[aria-checked="false"]:hover{background:var(--dsw-alias-interactive-bg-hover)}}
`;

    /* --------------------------------------------------------------- settings */

    const MODE_PANEL = 'panel';
    const MODE_MENU = 'menu';

    const settings = (function createSettings() {
      let mode = MODE_PANEL;
      try {
        const raw = window.localStorage.getItem(SETTINGS_KEY);
        if (raw !== null) {
          const parsed = JSON.parse(raw);
          if (parsed !== null && typeof parsed === 'object' && parsed.mode === MODE_MENU) mode = MODE_MENU;
        }
      } catch {
        /* blocked storage keeps this session's default */
      }
      const listeners = new Set();
      const emit = () => {
        for (const listener of Array.from(listeners)) listener();
      };
      return {
        getSnapshot: () => mode,
        subscribe(listener) {
          listeners.add(listener);
          return () => {
            listeners.delete(listener);
          };
        },
        set(next) {
          mode = next === MODE_MENU ? MODE_MENU : MODE_PANEL;
          try {
            window.localStorage.setItem(SETTINGS_KEY, JSON.stringify({ mode }));
          } catch {
            /* the in-memory value still applies */
          }
          emit();
        },
      };
    })();

    function useMode() {
      return React.useSyncExternalStore(settings.subscribe, settings.getSnapshot);
    }

    /* ------------------------------------------------------------ panel store */

    /**
     * The seat lives in the shipped menu's root pane, which unmounts as soon as
     * a pane is drilled into. The vendor index must survive that, so the seat
     * registers the menu surface element here and the index renders from the
     * frame-wide overlay, following that element.
     */
    const panel = (function createPanel() {
      let state = { open: false, sessionId: undefined, surface: null };
      const listeners = new Set();
      const emit = () => {
        for (const listener of Array.from(listeners)) listener();
      };
      return {
        getSnapshot: () => state,
        subscribe(listener) {
          listeners.add(listener);
          return () => {
            listeners.delete(listener);
          };
        },
        show(sessionId, surface) {
          if (state.open && state.sessionId === sessionId && state.surface === surface) return;
          state = { open: true, sessionId, surface };
          emit();
        },
        close() {
          if (!state.open) return;
          state = { open: false, sessionId: undefined, surface: null };
          emit();
        },
      };
    })();

    /* ---------------------------------------------------------------- credits */

    /**
     * Remaining credit per vendor, read from whichever plugin already owns that
     * number: the channel pack's `credits.balances` RPC, the TB panel's points
     * route, the whale widget's balance route. Nothing is recomputed here, and a
     * vendor whose source cannot answer renders no badge at all — no zero, no
     * placeholder, no guessing at a provider id.
     */
    const CREDIT_TTL = 120_000;
    const CREDIT_RETRY = 20_000;
    const CREDIT_TIMEOUT = 25_000;
    /** Pack-side units (same table the free-model page uses) for the suffix only. */
    const CHANNEL_CREDIT_UNITS = { cline: 'dollars', zcode: 'tokens', gemini: 'quota' };
    const CHANNEL_CREDIT_IDS = [
      'opencode', 'lobsterai', 'qoder', 'qodercn', 'trae',
      'cline', 'loomy', 'raccoon', 'zcode', 'minimax', 'gemini',
    ];

    function creditSourceOf(provider) {
      if (provider === 'taobao') return 'tb';
      if (provider === 'deepseek-official') return 'whale';
      return CHANNEL_CREDIT_IDS.includes(provider) ? 'channel' : null;
    }

    /**
     * Four digits and up read as `1.2k`. The badge shares a 176px column with the
     * vendor name, and a raw token count there is noise, not information.
     */
    function abbreviateCredit(value) {
      if (value === null || value === undefined || value === '') return null;
      const number = Number(value);
      if (!Number.isFinite(number)) return null;
      const magnitude = Math.abs(number);
      if (magnitude < 999.5) {
        return String(magnitude >= 100 ? Math.round(number) : Math.round(number * 10) / 10);
      }
      const scale = magnitude >= 1e9 ? ['B', 1e9] : magnitude >= 1e6 ? ['M', 1e6] : ['k', 1e3];
      let rounded = Math.round((number / scale[1]) * 10) / 10;
      let suffix = scale[0];
      // 999,996 must not read as "1000k": promote one unit instead.
      if (Math.abs(rounded) >= 999.95 && suffix !== 'B') {
        const up = suffix === 'k' ? ['M', 1e6] : ['B', 1e9];
        rounded = Math.round((number / up[1]) * 10) / 10;
        suffix = up[0];
      }
      return `${rounded}${suffix}`;
    }

    /** The exact value for the tooltip, so the badge never hides the truth. */
    function creditExact(value) {
      const number = Number(value);
      if (!Number.isFinite(number)) return '';
      if (Number.isInteger(number)) return number.toLocaleString('en-US');
      const [whole, fraction] = Math.abs(number).toFixed(2).split('.');
      const grouped = Number(whole).toLocaleString('en-US');
      return `${number < 0 ? '-' : ''}${grouped}.${fraction}`;
    }

    const providerKey = value => typeof value === 'string'
      ? value.trim().toLowerCase().replace(/^plugin:/, '').replace(/[\s_]+/g, '-')
      : '';

    /**
     * Match route metadata, never model-family guesses. This covers Magpie's
     * single route, per-owner connector routes, and direct providers which happen
     * to be served by Magpie, without assigning Claude's quota to every Claude
     * model on an unrelated route.
     */
    function magpieAccountsFor(group, quotas) {
      const accounts = Array.isArray(quotas) ? quotas : [];
      const hints = new Set();
      const add = value => {
        const key = providerKey(value);
        if (key !== '') hints.add(key);
      };
      add(group.id);
      add(group.name);
      const named = /magpie\s*\(([^)]+)\)/i.exec(typeof group.name === 'string' ? group.name : '');
      if (named !== null) add(named[1]);
      const id = providerKey(group.id);
      const routed = /(?:^|-)magpie(?:-connector)?-([a-z0-9.-]+)$/.exec(id);
      if (routed !== null) add(routed[1]);
      const magpieLike = id.includes('magpie') || named !== null;
      for (const model of Array.isArray(group.models) ? group.models : []) {
        const modelId = typeof model?.id === 'string' ? model.id : '';
        const subscription = /^subscription:magpie\/([^/]+)\//i.exec(modelId);
        if (subscription !== null) add(subscription[1]);
        else if (magpieLike && modelId.includes('/')) add(modelId.split('/')[0]);
      }
      return accounts.filter(account => {
        const provider = providerKey(account?.provider);
        const name = providerKey(account?.name);
        return (provider !== '' && hints.has(provider)) || (name !== '' && hints.has(name));
      });
    }

    /** Parse Magpie's own balance spelling without discarding its currency/unit. */
    function parseMagpieBalance(value) {
      if (typeof value !== 'string' || value.trim() === '') return null;
      const raw = value.trim();
      const match = /^\s*([¥$€£])?\s*(-?\d+(?:\.\d+)?)(?:\s*(%|[a-zA-Z]+|[^\d\s()]+))?/.exec(raw.replace(/,/g, ''));
      if (match === null) return null;
      const amount = Number(match[2]);
      if (!Number.isFinite(amount)) return null;
      const symbols = { $: '$', '¥': '¥', '€': '€', '£': '£' };
      const symbol = symbols[match[1]] ?? '';
      const unit = match[3] ?? '';
      return { amount, symbol, unit, key: `${symbol}:${providerKey(unit)}` };
    }

    function magpieWindowCredit(window) {
      if (!window || typeof window !== 'object') return null;
      if (typeof window.display === 'string' && /^https?:\/\//i.test(window.display.trim())) return null;
      const limit = Number(window.limit);
      const amount = Number(window.amount);
      const used = Number(window.used);
      const hasLimit = Number.isFinite(limit) && limit > 0;
      const usedAmount = Number.isFinite(amount) ? amount : hasLimit && Number.isFinite(used) ? used * limit / 100 : null;
      const unit = typeof window.unit === 'string' ? window.unit : '';
      if (hasLimit && usedAmount !== null) {
        const remaining = Math.max(0, limit - usedAmount);
        const symbol = /^(?:usd|dollars?)$/i.test(unit) ? '$' : /^(?:cny|rmb|元)$/i.test(unit) ? '¥' : '';
        return {
          type: 'amount', amount: remaining, symbol, unit,
          key: `${symbol}:${providerKey(unit)}`,
          detail: `${window.name || 'quota'} ${symbol}${creditExact(remaining)}${unit ? ` ${unit}` : ''} / ${creditExact(limit)}${unit ? ` ${unit}` : ''}`,
          usedRatio: Math.min(1, Math.max(0, usedAmount / limit)),
          total: /total|overall|combined|credits?|points?|积分|合计|总额/i.test(String(window.name ?? '')),
        };
      }
      const explicit = Number(window.remaining);
      const remaining = Number.isFinite(explicit) ? explicit : Number.isFinite(used) ? 100 - used : null;
      if (remaining === null) return null;
      return {
        type: 'percent', amount: Math.min(100, Math.max(0, remaining)),
        detail: `${window.name || 'quota'} ${creditExact(remaining)}%`,
        usedRatio: 1 - remaining / 100,
        total: /total|overall|combined|credits?|points?|积分|合计|总额/i.test(String(window.name ?? '')),
      };
    }

    function magpieAccountCredit(account) {
      if (account?.error) return null;
      const balance = parseMagpieBalance(account?.balance);
      if (balance !== null) {
        return { ...balance, type: 'amount', detail: `${account.name || account.provider || 'Magpie'} ${balance.symbol}${creditExact(balance.amount)}${balance.unit ? ` ${balance.unit}` : ''}` };
      }
      const windows = (Array.isArray(account?.windows) ? account.windows : [])
        .map(magpieWindowCredit).filter(Boolean);
      if (windows.length === 0) return null;
      windows.sort((left, right) => Number(right.total) - Number(left.total) || right.usedRatio - left.usedRatio);
      return windows[0];
    }

    /** Sum like units; average percentages; never add dollars to tokens. */
    function combineMagpieCredits(items, label) {
      if (items.length === 0) return null;
      if (items.every(item => item.type === 'amount')) {
        const keys = new Set(items.map(item => item.unitKey ?? item.key));
        if (keys.size !== 1) return null;
        const amount = items.reduce((sum, item) => sum + item.amount, 0);
        const first = items[0];
        return {
          type: 'amount', amount, symbol: first.symbol, unit: first.unit, unitKey: first.unitKey ?? first.key,
          badge: `${first.symbol}${abbreviateCredit(amount)}`,
          detail: items.length === 1
            ? items[0].detail
            : `${label} ${first.symbol}${creditExact(amount)}${first.unit ? ` ${first.unit}` : ''} · ${items.map(item => item.detail).join(' · ')}`,
        };
      }
      if (items.every(item => item.type === 'percent')) {
        const percent = items.reduce((sum, item) => sum + item.amount, 0) / items.length;
        return {
          type: 'percent', amount: percent,
          badge: `${abbreviateCredit(percent)}%`,
          detail: items.map(item => item.detail).join(' · '),
        };
      }
      return null;
    }

    function magpieCredit(group, quotas) {
      const accounts = magpieAccountsFor(group, quotas);
      const byProvider = new Map();
      for (const account of accounts) {
        const key = providerKey(account.provider || account.name);
        if (!byProvider.has(key)) byProvider.set(key, []);
        byProvider.get(key).push(account);
      }
      const summaries = [];
      for (const [key, providerAccounts] of byProvider) {
        const label = providerAccounts[0]?.name || providerAccounts[0]?.provider || key;
        const items = providerAccounts.map(magpieAccountCredit).filter(Boolean);
        const summary = combineMagpieCredits(items, label);
        if (summary !== null) summaries.push({ ...summary, key, label });
      }
      if (summaries.length === 0) return null;
      if (summaries.length === 1) return { ...summaries[0], source: 'magpie' };
      // A single Magpie route can expose several upstream owners. Combine only
      // like units; otherwise the tightest percentage is the honest summary.
      if (summaries.every(item => item.type === 'amount')) {
        const combined = combineMagpieCredits(summaries, 'Magpie');
        return combined === null ? null : { ...combined, source: 'magpie' };
      }
      if (summaries.every(item => item.type === 'percent')) {
        const worst = Math.min(...summaries.map(item => item.amount));
        return {
          type: 'percent', amount: worst,
          badge: `${abbreviateCredit(worst)}%`,
          detail: summaries.map(item => item.detail).join(' · '), source: 'magpie',
        };
      }
      return null;
    }

    const credits = (function createCredits() {
      let context = null;
      let snapshot = { rows: {} };
      const rows = {};
      const pending = new Set();
      const listeners = new Set();
      let magpieCache = null;
      let magpiePending = null;

      const publish = () => {
        snapshot = { rows: { ...rows } };
        for (const listener of Array.from(listeners)) listener();
      };

      /**
       * The pack's own browser half goes through the shell's connection service;
       * this asks the same service first and only falls back to the plain
       * `/api/channel-pack` envelope when the shell does not expose it.
       */
      const connectionTransport = () => {
        if (context === null) return null;
        let connection;
        try {
          connection = context.get?.('connection');
        } catch {
          connection = undefined;
        }
        if (connection === undefined || connection === null) {
          try {
            connection = context.connection;
          } catch {
            connection = undefined;
          }
        }
        try {
          const call = connection?.rpc?.call;
          return typeof call === 'function' ? { connection, call } : null;
        } catch {
          return null;
        }
      };

      const fetchJson = async (path, init) => {
        const impl = typeof window.fetch === 'function' ? window.fetch.bind(window) : null;
        if (impl === null) throw new Error('no-fetch');
        const controller = typeof AbortController === 'function' ? new AbortController() : null;
        const timer = controller !== null && typeof window.setTimeout === 'function'
          ? window.setTimeout(() => controller.abort(), CREDIT_TIMEOUT)
          : null;
        try {
          const options = { credentials: 'same-origin', ...init };
          if (controller !== null) options.signal = controller.signal;
          const response = await impl(path, options);
          if (response.ok !== true) throw new Error(`http-${response.status}`);
          return await response.json();
        } finally {
          if (timer !== null && typeof window.clearTimeout === 'function') window.clearTimeout(timer);
        }
      };

      const channelPackHttp = async (method, payload) => {
        const body = JSON.stringify({
          type: 'client-request',
          rpcId: `vqs-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`,
          method: 'channel-pack',
          payload: { method, payload },
        });
        const reply = await fetchJson('/api/channel-pack', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body,
        });
        return reply !== null && typeof reply === 'object' && reply.result !== undefined ? reply.result : reply;
      };

      const channelBalances = async provider => {
        const transport = connectionTransport();
        if (transport !== null) {
          try {
            const result = await transport.call(
              transport.connection.rpc, '/api', 'channel-pack',
              { method: 'credits.balances', payload: { provider } },
            );
            if (result?.ok === true) return result.value;
          } catch {
            /* a shell can expose `connection` without admitting this channel */
          }
        }
        const result = await channelPackHttp('credits.balances', { provider });
        if (result?.ok === true) return result.value;
        throw new Error(typeof result?.error?.message === 'string' ? result.error.message : 'channel-pack-unavailable');
      };

      const channelCredit = (provider, value) => {
        const unit = CHANNEL_CREDIT_UNITS[provider] ?? 'left';
        const accounts = Array.isArray(value?.accounts) ? value.accounts : [];
        let total = null;
        const lines = [];
        for (const account of accounts) {
          const raw = account?.balance?.total;
          const number = Number(raw);
          // `null` means the pack could not ask, which is not a zero balance.
          if (raw === null || raw === undefined || raw === '' || !Number.isFinite(number)) continue;
          total = (total === null ? 0 : total) + number;
          const nickname = typeof account?.nickname === 'string' && account.nickname !== ''
            ? `${account.nickname} `
            : '';
          const suffix = unit === 'dollars' ? ' USD' : unit === 'quota' ? '%' : unit === 'tokens' ? ' tokens' : '';
          lines.push(`${nickname}${creditExact(number)}${suffix}`);
        }
        if (total === null) return null;
        const abbreviated = abbreviateCredit(total);
        return {
          badge: unit === 'dollars' ? `$${abbreviated}` : unit === 'quota' ? `${abbreviated}%` : abbreviated,
          detail: lines.join(' · '),
          source: 'channel',
        };
      };

      const MAGPIE_QUOTA_PATHS = [
        // This bundle: standalone Magpie, including a user-configured port.
        '/api/vendor-quick-switch/magpie-quotas',
        // Optional embedded Magpie: its same-origin proxy owns the web cookie.
        '/api/our-free-model/engine/ui/v1/magpie/quotas',
        // Existing quota plugins are sources too, never prerequisites.
        '/magpie/quotas',
        '/api/magpie-quota/quotas',
      ];

      /** One shared read per menu cycle, no matter how many vendors use it. */
      const readMagpieQuotas = () => {
        const now = Date.now();
        if (magpieCache !== null && now - magpieCache.at < (magpieCache.rows.length > 0 ? CREDIT_TTL : CREDIT_RETRY)) {
          return Promise.resolve(magpieCache.rows);
        }
        if (magpiePending !== null) return magpiePending;
        magpiePending = (async () => {
          let empty = null;
          for (const path of MAGPIE_QUOTA_PATHS) {
            try {
              const data = await fetchJson(path);
              const rows = Array.isArray(data?.providers) ? data.providers : Array.isArray(data?.data) ? data.data : null;
              if (rows === null || data?.ok === false) continue;
              if (rows.length > 0) return rows;
              empty = rows;
            } catch {
              // Not installed, offline, or an older Host half: try the next source.
            }
          }
          return empty ?? [];
        })().then(rows => {
          magpieCache = { at: Date.now(), rows };
          return rows;
        }).finally(() => {
          magpiePending = null;
        });
        return magpiePending;
      };

      const directCredit = async group => {
        const provider = group.id;
        const source = creditSourceOf(provider);
        if (source === 'channel') return channelCredit(provider, await channelBalances(provider));
        if (source === 'tb') {
          const data = await fetchJson('/api/tb-panel/points');
          if (data?.balance === null || data?.balance === undefined || data?.balance === '') return null;
          const number = Number(data.balance);
          if (!Number.isFinite(number)) return null;
          return { badge: abbreviateCredit(number), detail: creditExact(number), source: 'tb' };
        }
        if (source === 'whale') {
          const data = await fetchJson('/dsh-whale/balance.json');
          if (data?.ok !== true) return null;
          const number = Number(data.totalBalance);
          if (!Number.isFinite(number)) return null;
          const currency = typeof data.currency === 'string' ? data.currency.toUpperCase() : '';
          const symbol = currency === 'USD' ? '$' : currency === 'CNY' ? '¥' : '';
          return { badge: `${symbol}${abbreviateCredit(number)}`, detail: `${symbol}${creditExact(number)}`, source: 'whale' };
        }
        return null;
      };

      const resolveCredit = async group => {
        // A native source is most specific. If it is absent or cannot answer,
        // Magpie gets a chance to resolve the same real route instead.
        if (creditSourceOf(group.id) !== null) {
          try {
            const direct = await directCredit(group);
            if (direct !== null) return direct;
          } catch {
            // Optional plugin absent: this is exactly what the fallback is for.
          }
        }
        return magpieCredit(group, await readMagpieQuotas());
      };

      const load = async group => {
        const provider = group.id;
        if (typeof provider !== 'string' || provider === '') return;
        const known = rows[provider];
        const ttl = known !== undefined && known.state === 'ok' ? CREDIT_TTL : CREDIT_RETRY;
        if (known !== undefined && Date.now() - known.at < ttl) return;
        if (pending.has(provider)) return;
        pending.add(provider);
        let entry;
        try {
          const credit = await resolveCredit(group);
          entry = credit === null
            ? { state: 'miss', badge: null, detail: null, source: creditSourceOf(provider) ?? 'magpie', at: Date.now() }
            : { state: 'ok', badge: credit.badge, detail: credit.detail, source: credit.source, at: Date.now() };
        } catch {
          entry = { state: 'miss', badge: null, detail: null, source: creditSourceOf(provider) ?? 'magpie', at: Date.now() };
        }
        pending.delete(provider);
        rows[provider] = entry;
        publish();
      };

      return {
        getSnapshot: () => snapshot,
        subscribe(listener) {
          listeners.add(listener);
          return () => {
            listeners.delete(listener);
          };
        },
        bind(next) {
          context = next;
        },
        /** Fire and forget: the menu must never wait on a network round trip. */
        request(groups) {
          if (!Array.isArray(groups)) return;
          for (const value of groups) {
            const group = typeof value === 'string' ? { id: value, name: value, models: [] } : value;
            if (group !== null && typeof group === 'object') void load(group);
          }
        },
        __setForTest(provider, entry) {
          rows[provider] = entry;
          publish();
        },
        __readForTest() {
          return { ...rows };
        },
        __resetForTest() {
          for (const key of Object.keys(rows)) delete rows[key];
          magpieCache = null;
          magpiePending = null;
          publish();
        },
      };
    })();

    function useCredits() {
      return React.useSyncExternalStore(credits.subscribe, credits.getSnapshot);
    }

    /** What one row shows, or null when its source had no answer at all. */
    function creditView(entry, translate) {
      if (entry === undefined || entry === null) return null;
      if (entry.badge === null || entry.badge === undefined || entry.badge === '') return null;
      const label = translate(`credits.${entry.source}`);
      const title = typeof entry.detail === 'string' && entry.detail !== ''
        ? translate('credits.title', { label, detail: entry.detail })
        : label;
      return { badge: entry.badge, title };
    }

    /** One vendor row's badge; renders nothing when the source could not answer. */
    function CreditBadge({ snapshot, provider, t: translate }) {
      const view = creditView(snapshot.rows[provider], translate);
      if (view === null) return null;
      return h('span', { className: 'vqs-credit', title: view.title }, view.badge);
    }

    /* ------------------------------------------------------------------- data */

    /** Vision-plugin twins carry a `-vision` route and an "自动识图" suffix. */
    function isVisionTwin(group) {
      if (typeof group.id === 'string' && group.id.endsWith('-vision')) return true;
      const name = typeof group.name === 'string' ? group.name : '';
      return name.includes('自动识图') || name.includes('Auto Vision');
    }

    function orderVendors(groups) {
      const rank = id => (id === 'deepseek-account' ? 0 : id === 'deepseek-official' ? 1 : 2);
      return groups
        // The shipped list hides empty groups, so offering one here would make
        // its row a guaranteed dead jump. Empty failed groups stay in the host's
        // own warning strip instead.
        .filter(group => !isVisionTwin(group) && (group.models?.length ?? 0) > 0)
        .sort((left, right) => rank(left.id) - rank(right.id));
    }

    /** Map a selected route back to a listed vendor, including vision twins. */
    function vendorFor(vendors, provider) {
      if (provider === undefined || provider === null) return undefined;
      const direct = vendors.find(group => group.id === provider);
      if (direct !== undefined) return direct;
      const base = typeof provider === 'string' && provider.endsWith('-vision')
        ? provider.slice(0, -'-vision'.length)
        : undefined;
      return base === undefined ? undefined : vendors.find(group => group.id === base);
    }

    function selectionFor(state, provider, modelId) {
      const group = state.groups.find(item => item.id === provider);
      const model = group?.models.find(item => item.id === modelId);
      if (group === undefined || model === undefined) return undefined;
      return {
        provider,
        model: modelId,
        ...(model.reasoning?.defaultEffort === undefined
          ? {}
          : { reasoningEffort: model.reasoning.defaultEffort }),
      };
    }

    function useDirectory(getModels, sessionId) {
      const directory = React.useMemo(() => {
        const models = typeof getModels === 'function' ? getModels() : undefined;
        if (models === undefined || sessionId === undefined) return null;
        try {
          return models.directoryFor(sessionId);
        } catch {
          return null;
        }
      }, [getModels, sessionId]);
      const fallback = React.useMemo(
        () => ({ current: null, groups: [], failures: [], status: 'idle', pending: null, error: null }),
        [],
      );
      const source = directory === null ? null : directory.store;
      const subscribe = React.useCallback(
        listener => (source === null ? () => {} : source.subscribe(listener)),
        [source],
      );
      const getSnapshot = React.useCallback(
        () => (source === null ? fallback : source.getSnapshot()),
        [source, fallback],
      );
      const state = React.useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
      return { directory, state };
    }

    const Icon = ({ name, size = 14 }) => {
      const paths = {
        right: [h('path', { key: 'a', d: 'm9 5 7 7-7 7' })],
        left: [h('path', { key: 'a', d: 'm15 5-7 7 7 7' })],
        check: [h('path', { key: 'a', d: 'm4 10 4 4 8-9' })],
      };
      return h('svg', {
        width: size, height: size, viewBox: '0 0 24 24', fill: 'none',
        stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round',
        strokeLinejoin: 'round', 'aria-hidden': true,
      }, paths[name]);
    };

    const clamp = (value, low, high) => Math.max(low, Math.min(high, value));

    /** Nearest fixed/absolute ancestor: the shipped menu surface. */
    function surfaceOf(node) {
      let current = node;
      while (current !== null && current !== undefined && current !== document.body) {
        const style = window.getComputedStyle(current);
        if (style.position === 'fixed' || style.position === 'absolute') return current;
        current = current.parentElement;
      }
      return node;
    }

    /** The shipped model list, when a model pane is open. */
    function listOf(surface) {
      if (surface === null || surface === undefined) return null;
      const list = surface.querySelector('[role="menu"]');
      return list === null || list === undefined ? null : list;
    }

    /**
     * The scrollable box the shipped list scrolls inside, if any.
     * @returns the nearest vertically scrollable ancestor, or null.
     */
    function scrollerOf(node) {
      let current = node.parentElement;
      while (current !== null && current !== undefined && current !== document.body) {
        const style = window.getComputedStyle(current);
        if (/(auto|scroll)/.test(style.overflowY) && current.scrollHeight > current.clientHeight + 1) {
          return current;
        }
        current = current.parentElement;
      }
      return null;
    }

    /** The direct child of the model viewport that owns this row. */
    function groupOf(row, list) {
      let current = row;
      while (current.parentElement !== null && current.parentElement !== undefined
        && current.parentElement !== list) {
        current = current.parentElement;
      }
      return current;
    }

    /** Rendered with a real box: hidden or mid-transition nodes cannot be revealed. */
    function isShown(node) {
      if (node === null || node === undefined) return false;
      if (typeof node.getBoundingClientRect !== 'function') return true;
      const rect = node.getBoundingClientRect();
      if (rect === null || rect === undefined) return false;
      const top = typeof rect.top === 'number' ? rect.top : 0;
      const height = typeof rect.height === 'number' ? rect.height : (typeof rect.bottom === 'number' ? rect.bottom - top : 0);
      return height > 0;
    }

    /**
     * The shipped model option row that owns this provider id.
     *
     * Only `menuitemradio` rows count. The root pane also paints the current
     * model's provider id on its "model" cell, so accepting any marker made the
     * currently selected vendor look already revealed — its row answered the
     * click with a zero-distance success and never opened the model pane.
     */
    function modelRowFor(markers, providerId, shown = isShown) {
      if (markers === null || markers === undefined) return null;
      for (const marker of markers) {
        if (marker === null || marker === undefined) continue;
        if (typeof marker.getAttribute !== 'function') continue;
        if (marker.getAttribute('data-provider-id') !== providerId) continue;
        if (typeof marker.closest !== 'function') continue;
        const row = marker.closest('button[role="menuitemradio"]');
        if (row === null || row === undefined) continue;
        if (typeof shown === 'function' && !shown(row)) continue;
        return row;
      }
      return null;
    }

    /**
     * Reveal a vendor through the stable provider id painted on every shipped
     * model label. Display text is only a compatibility fallback: localized,
     * renamed, or visually hidden group headings must never disable jumping.
     * @returns true when a group was found and revealed.
     */
    function revealVendor(surface, group, names) {
      const scope = surface ?? null;
      if (scope === null) return false;
      if (typeof scope.querySelectorAll !== 'function') return false;

      const row = modelRowFor(scope.querySelectorAll('[data-provider-id]'), group.id);
      let list = listOf(scope) ?? scope;
      let firstRow = null;
      let target = null;
      if (row !== null) {
        const own = typeof row.closest === 'function' ? row.closest('[role="menu"]') : null;
        // A model option always lives in the shipped list; a marker outside one
        // is not a model row at all.
        if (own === null || own === undefined) return false;
        list = own;
        firstRow = row;
        target = groupOf(row, list);
      }

      // Older host builds may not expose provider ids; retain the text lookup.
      if (target === null) {
        const wanted = new Set((Array.isArray(names) ? names : [names])
          .filter(name => typeof name === 'string' && name !== '')
          .map(name => name.trim()));
        for (const node of list.querySelectorAll('div,span,button,li,header')) {
          if (node.children.length !== 0) continue;
          const text = (node.textContent ?? '').trim();
          if (text === '' || !wanted.has(text)) continue;
          if (!isShown(node)) continue;
          target = groupOf(node, list);
          firstRow = node;
          break;
        }
      }
      if (target === null || firstRow === null) return false;

      /* Put the clicked vendor at the top of the shipped list so it and the
       * models under it read as a group. Clamping at maxScroll is what keeps a
       * trailing vendor from being forced further than the list can go. */
      const scroller = scrollerOf(firstRow);
      const box = target.getBoundingClientRect();
      if (scroller !== null && scroller !== undefined) {
        const frame = scroller.getBoundingClientRect();
        const maxScroll = Math.max(0, scroller.scrollHeight - scroller.clientHeight);
        const delta = box.top - frame.top;
        if (delta === 0) return true;
        scroller.scrollTop = Math.min(maxScroll, Math.max(0, scroller.scrollTop + delta));
        return true;
      }
      target.scrollIntoView({ block: 'start', inline: 'nearest' });
      return true;
    }

    /* ---------------------------------------------------------------- flyout */

    const COLUMN_WIDTH = 176;
    const COLUMN_GAP = 6;
    const COLUMN_INSET = 8;
    const COLUMN_MAX_HEIGHT = 340;
    /** Clearance reserved for the composer's tool row under the menu. */
    const COLUMN_FLOOR = 132;

    function VendorIndex({ getModels, t: translate }) {
      const t = typeof translate === 'function' ? translate : key => key;
      const state = React.useSyncExternalStore(panel.subscribe, panel.getSnapshot);
      const [rect, setRect] = React.useState(null);
      const [activeId, setActiveId] = React.useState(null);
      const columnRef = React.useRef(null);
      const { state: catalog } = useDirectory(getModels, state.sessionId);
      const creditRows = useCredits();

      /* Ask each vendor's own source once per menu open; cached rows skip the
       * round trip, so this is cheap even while the menu re-renders. */
      React.useEffect(() => {
        if (!state.open) return;
        credits.request(catalog.groups);
      }, [state.open, catalog.groups]);

      /**
       * The shipped menu is the host's: never touch its height, offset, or
       * length. Only this column is bounded to the viewport, so the vendor
       * index can never be the thing that spills past the window edge.
       */

      /* Follow the shipped menu every frame; a no-op frame writes no state. */
      React.useEffect(() => {
        if (!state.open || state.surface === null) {
          setRect(null);
          return undefined;
        }
        let frame = 0;
        let last = '';
        const follow = () => {
          frame = window.requestAnimationFrame(follow);
          const surface = state.surface;
          if (surface === null || surface.isConnected !== true) {
            panel.close();
            return;
          }
          const next = surface.getBoundingClientRect();
          const key = `${next.top}:${next.bottom}:${next.left}:${next.right}`;
          if (key === last) return;
          last = key;
          setRect({ top: next.top, bottom: next.bottom, left: next.left, right: next.right });
        };
        frame = window.requestAnimationFrame(follow);
        return () => window.cancelAnimationFrame(frame);
      }, [state.open, state.surface]);

      React.useEffect(() => {
        if (!state.open) return undefined;
        const outside = event => {
          if (columnRef.current !== null && columnRef.current.contains(event.target)) return;
          const surface = state.surface;
          if (surface !== null && surface.contains(event.target)) return;
          panel.close();
        };
        const onKey = event => {
          if (event.key === 'Escape') panel.close();
        };
        document.addEventListener('pointerdown', outside, true);
        document.addEventListener('keydown', onKey);
        return () => {
          document.removeEventListener('pointerdown', outside, true);
          document.removeEventListener('keydown', onKey);
        };
      }, [state.open, state.surface]);

      React.useEffect(() => {
        if (!state.open) return undefined;
        const column = columnRef.current;
        if (column === null || column === undefined) return undefined;
        /* The shipped menu closes on two independent signals: a press outside its
         * subtree, and focus leaving it. The column lives in the frame overlay,
         * so it must swallow the press AND refuse focus — a focused row here
         * would fire the menu's own blur handler and dismiss everything. This
         * mirrors how the menu's own rows keep focus with preventDefault. */
        const swallowPress = event => { event.stopPropagation(); };
        const swallowFocus = event => { event.preventDefault(); event.stopPropagation(); };
        column.addEventListener('pointerdown', swallowPress, true);
        column.addEventListener('mousedown', swallowFocus, true);
        return () => {
          column.removeEventListener('pointerdown', swallowPress, true);
          column.removeEventListener('mousedown', swallowFocus, true);
        };
      }, [state.open, rect]);

      if (!state.open || rect === null) return null;

      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      const floor = viewportHeight - COLUMN_FLOOR;
      const ceiling = COLUMN_INSET;
      /* Bound this column to the viewport only. The shipped menu keeps its own
       * height and length untouched, even when it renders past the window. */
      const columnHeight = Math.max(120, Math.min(COLUMN_MAX_HEIGHT, floor - ceiling));
      const top = clamp(rect.top, ceiling, Math.max(ceiling, floor - columnHeight));

      const rightRoom = viewportWidth - COLUMN_INSET - (rect.right + COLUMN_GAP);
      const left = rightRoom >= COLUMN_WIDTH
        ? rect.right + COLUMN_GAP
        : clamp(rect.left - COLUMN_GAP - COLUMN_WIDTH, COLUMN_INSET, viewportWidth - COLUMN_WIDTH - COLUMN_INSET);

      const vendors = orderVendors(catalog.groups);
      const currentVendor = vendorFor(vendors, catalog.current?.provider);

      const jump = group => {
        setActiveId(group.id);
        const surface = state.surface;
        /* The host localizes the account group, so try every name it can wear. */
        const names = [group.name, 'DeepSeek 账号', 'DeepSeek Account', t('vendor.account')]
          .filter(name => typeof name === 'string' && name !== '');
        if (revealVendor(surface, group, names)) return;

        /* Root pane has a Model cell. Effort and filtered model panes do not:
         * the host's own Escape handler returns those to root first, clearing
         * the query on the subsequent drill instead of leaving the click dead. */
        let drilled = false;
        const cell = surface?.querySelector('button[role="menuitem"]');
        if (cell !== null && cell !== undefined) {
          drilled = true;
          cell.click();
        } else if (surface !== null && surface !== undefined
          && typeof surface.dispatchEvent === 'function'
          && typeof window.KeyboardEvent === 'function') {
          surface.dispatchEvent(new window.KeyboardEvent('keydown', {
            key: 'Escape', bubbles: true, cancelable: true,
          }));
        } else if (surface === null || surface === undefined) {
          return;
        }

        let tries = 0;
        const tick = () => {
          if (revealVendor(surface, group, names)) return;
          // Escape returned Effort/search to root: open Model on this pass.
          const rootCell = drilled ? null : surface?.querySelector('button[role="menuitem"]');
          if (rootCell !== null && rootCell !== undefined) {
            drilled = true;
            rootCell.click();
          }
          tries += 1;
          if (tries >= 20) return;
          window.requestAnimationFrame(tick);
        };
        window.requestAnimationFrame(tick);
        // The model pane can mount after an animation frame; one late pass
        // covers a list that was still empty on the first frames.
        window.setTimeout(() => { revealVendor(surface, group, names); }, 120);
      };

      return h('div', {
        ref: columnRef,
        className: 'vqs-col',
        onPointerDown: event => { event.stopPropagation(); },
        onMouseDown: event => { event.preventDefault(); event.stopPropagation(); },
        role: 'menu',
        'aria-label': t('menu.providers'),
        style: { top, left, width: COLUMN_WIDTH, maxHeight: columnHeight },
      },
        h('div', { className: 'vqs-scroll', role: 'group' },
          vendors.length === 0
            ? h('div', { className: 'vqs-status', role: 'status' },
              t(catalog.status === 'loading' ? 'loading' : 'empty'))
            : vendors.map(group => {
              const isCurrent = currentVendor !== undefined && currentVendor.id === group.id;
              const name = group.id === 'deepseek-account' ? t('vendor.account') : group.name;
              return h('button', {
                key: group.id,
                type: 'button',
                role: 'menuitem',
                tabIndex: -1,
                'aria-current': isCurrent ? 'true' : undefined,
                'data-vendor-id': group.id,
                className: 'vqs-option',
                title: name,
                style: activeId === group.id ? { background: 'var(--dsw-alias-interactive-bg-hover)' } : undefined,
                onClick: () => jump(group),
              },
                h('span', { className: 'vqs-name' }, name),
                h(CreditBadge, { snapshot: creditRows, provider: group.id, t }),
                h('span', { className: 'vqs-check' }, isCurrent ? h(Icon, { name: 'check' }) : null),
              );
            }),
        ),
      );
    }

    /* ------------------------------------------------------------------- seat */

    /**
     * Root-pane seat. Panel mode renders only a zero-height probe: it reports
     * the shipped menu surface upward so the index can follow it, and keeps the
     * menu itself untouched. Menu mode renders the drilled rows in place.
     */
    function VendorSeat({ sessionId, locked, dismiss, reportFailure, getModels, t: translate }) {
      const t = typeof translate === 'function' ? translate : key => key;
      const mode = useMode();
      const [pane, setPane] = React.useState('root');
      const [activeProvider, setActiveProvider] = React.useState(null);
      const armRef = React.useRef(null);
      const listRef = React.useRef(null);
      const { directory, state } = useDirectory(getModels, sessionId);
      const creditRows = useCredits();

      const vendors = React.useMemo(() => orderVendors(state.groups), [state.groups]);
      const busy = state.pending !== null;
      const disabled = locked === true || busy;
      const currentVendor = vendorFor(vendors, state.current?.provider);

      /* The seat only mounts while the shipped menu is open, which is exactly
       * when the in-menu vendor rows need a number to show. */
      React.useEffect(() => {
        credits.request(state.groups);
      }, [state.groups]);

      React.useEffect(() => {
        if (directory === null) return;
        directory.load().catch(() => { /* the shared store carries the failure */ });
      }, [directory]);

      React.useEffect(() => {
        if (mode !== MODE_PANEL) {
          panel.close();
          return undefined;
        }
        let frame = 0;
        let attempts = 0;
        let surface = null;
        const measure = () => {
          const node = armRef.current;
          if (node === null) {
            if (attempts < 12) {
              attempts += 1;
              frame = window.requestAnimationFrame(measure);
            }
            return;
          }
          surface = surfaceOf(node);
          if (sessionId !== undefined && surface !== null) panel.show(sessionId, surface);
        };
        measure();
        return () => {
          window.cancelAnimationFrame(frame);
          const closing = surface;
          window.setTimeout(() => {
            if (closing !== null && closing.isConnected === true
              && closing.getBoundingClientRect().height > 0) {
              // A pane was drilled into: the menu is still open, keep the index.
              return;
            }
            if (panel.getSnapshot().surface === closing) panel.close();
          }, 160);
        };
      }, [mode, sessionId]);

      React.useEffect(() => {
        if (mode !== MODE_MENU || pane === 'root') return undefined;
        const frame = window.requestAnimationFrame(() => {
          listRef.current?.querySelector('button:not([disabled])')?.focus();
        });
        return () => window.cancelAnimationFrame(frame);
      }, [mode, pane, activeProvider]);

      if (directory === null || sessionId === undefined) return null;

      const vendorName = group => (group.id === 'deepseek-account' ? t('vendor.account') : group.name);

      if (mode === MODE_PANEL) {
        return h('span', { className: 'vqs-arm', ref: armRef, 'aria-hidden': true });
      }

      const chooseModel = modelId => {
        const selection = selectionFor(state, activeProvider, modelId);
        if (selection === undefined || disabled) return;
        if (state.current?.provider === selection.provider && state.current.model === selection.model) {
          dismiss?.();
          return;
        }
        void Promise.resolve(directory.select(selection)).then(result => {
          if (result === undefined) return;
          if (result.ok) {
            dismiss?.();
            return;
          }
          reportFailure?.(result.error.code === 'session/writer-held'
            ? t('error.sessionInUse')
            : t('error.select', { message: `${result.error.code}: ${result.error.message}` }));
        }).catch(error => {
          reportFailure?.(t('error.select', { message: error instanceof Error ? error.message : String(error) }));
        });
      };

      const vendorRow = (group, extra) => {
        const selected = currentVendor !== undefined && currentVendor.id === group.id;
        const name = vendorName(group);
        return h('button', {
          key: `vendor:${group.id}`,
          type: 'button',
          role: 'menuitem',
          'aria-current': selected ? 'true' : undefined,
          'data-vendor-id': group.id,
          className: 'vqs-option',
          title: name,
          disabled,
          ...extra,
        },
          h('span', { className: 'vqs-name' }, name),
          h(CreditBadge, { snapshot: creditRows, provider: group.id, t }),
          h('span', { className: 'vqs-check' }, selected ? h(Icon, { name: 'check' }) : null),
        );
      };

      const modelRow = model => {
        const selected = state.current?.provider === activeProvider && state.current.model === model.id;
        const pending = state.pending?.provider === activeProvider && state.pending.model === model.id;
        return h('button', {
          key: `model:${model.id}`,
          type: 'button',
          role: 'menuitemradio',
          'aria-checked': selected,
          className: 'vqs-option',
          title: model.name,
          disabled,
          onClick: () => chooseModel(model.id),
        },
          h('span', { className: 'vqs-name' }, model.name),
          h('span', { className: 'vqs-check' }, pending
            ? h('span', { className: 'vqs-spinner', 'aria-hidden': true })
            : selected ? h(Icon, { name: 'check' }) : null),
        );
      };

      const activeVendor = vendors.find(group => group.id === activeProvider);
      const rows = [];
      if (pane !== 'root') {
        rows.push(h('button', {
          key: 'back',
          type: 'button',
          role: 'menuitem',
          className: 'vqs-option vqs-back',
          disabled,
          onClick: () => setPane('root'),
        },
          h(Icon, { name: 'left', size: 13 }),
          h('span', { className: 'vqs-name' }, t('vendor')),
        ));
      }

      if (pane === 'root') {
        rows.push(h('button', {
          key: 'vendor',
          type: 'button',
          role: 'menuitem',
          className: 'vqs-option',
          disabled,
          title: t('menu.providers'),
          onClick: () => { setActiveProvider(null); setPane('vendors'); },
        },
          h('span', { className: 'vqs-label' }, t('vendor')),
          h('span', { className: 'vqs-value' }, currentVendor === undefined ? t('empty') : vendorName(currentVendor)),
          h('span', { className: 'vqs-chevron' }, h(Icon, { name: 'right', size: 12 })),
        ));
      } else if (pane === 'vendors') {
        if (vendors.length === 0) {
          rows.push(h('div', { key: 'status', className: 'vqs-status', role: 'status' },
            t(state.status === 'loading' ? 'loading' : 'empty')));
        }
        for (const group of vendors) {
          rows.push(vendorRow(group, { onClick: () => { setActiveProvider(group.id); setPane('models'); } }));
        }
      } else if (pane === 'models') {
        if ((activeVendor?.models ?? []).length === 0) {
          rows.push(h('div', { key: 'status', className: 'vqs-status', role: 'status' }, t('empty.models')));
        }
        for (const model of (activeVendor?.models ?? [])) rows.push(modelRow(model));
      }

      return h('div', {
        ref: listRef,
        role: 'group',
        'aria-label': pane === 'root' ? t('menu.providers') : t('menu.models', { provider: activeVendor ? vendorName(activeVendor) : '' }),
        onKeyDown: event => {
          if (pane === 'root' || event.nativeEvent.isComposing) return;
          if (event.key === 'Escape' || event.key === 'ArrowLeft') {
            event.preventDefault();
            event.stopPropagation();
            setPane('root');
          }
        },
      }, rows);
    }

    /* -------------------------------------------------------- settings card */

    function SettingsCard({ t: translate }) {
      const t = typeof translate === 'function' ? translate : key => key;
      const mode = useMode();
      const options = [
        { value: MODE_PANEL, label: t('settings.panel') },
        { value: MODE_MENU, label: t('settings.menu') },
      ];
      return h('div', { className: 'vqs-settings' },
        h('div', { className: 'vqs-settings-row' },
          h('div', { className: 'vqs-settings-copy' },
            h('span', { className: 'vqs-settings-title' }, t('settings.title')),
            h('span', { className: 'vqs-settings-desc' }, t('settings.description')),
          ),
          h('div', { className: 'vqs-segmented', role: 'radiogroup', 'aria-label': t('settings.title') },
            options.map(option => h('button', {
              key: option.value,
              type: 'button',
              role: 'radio',
              'aria-checked': mode === option.value,
              className: 'vqs-segment',
              onClick: () => settings.set(option.value),
            }, option.label)),
          ),
        ),
      );
    }

    /* ------------------------------------------------------------------- apply */

    return {
      inject: ['slots', 'locale'],
      apply(ctx) {
        const slots = ctx.get('slots');
        const locale = ctx.get('locale');
        if (!slots || !locale) {
          console.error('vendor-quick-switch: required Client services are unavailable');
          return;
        }
        ctx.effect(() => locale.register(NS, { zh, en }), 'vendor-quick-switch: dictionaries');
        const t = locale.bind(NS);
        ctx.effect(() => {
          if (typeof styles !== 'undefined' && styles !== null && typeof styles.insert === 'function') {
            return styles.insert(CSS);
          }
          if (typeof document === 'undefined') return undefined;
          const element = document.createElement('style');
          element.id = 'dsh-vendor-quick-switch-css';
          element.textContent = CSS;
          document.head.appendChild(element);
          return () => { element.remove(); };
        }, 'vendor-quick-switch: styles');

        const getModels = () => ctx.get('modelDirectories');
        credits.bind(ctx);

        slots.inject('conversation.input.model.options', () => slots.register({
          name: 'conversation.input.model.options',
          id: 'vendor-quick-switch',
          order: -10,
          locale: NS,
          inject: () => ({ getModels, t }),
        }, function VendorSeatEntry(props) {
          return h(VendorSeat, {
            sessionId: props.sessionId,
            locked: props.locked,
            dismiss: props.dismiss,
            reportFailure: props.reportFailure,
            getModels: props.getModels,
            t: props.t,
          });
        }));

        slots.inject('shell.overlay', () => slots.register({
          name: 'shell.overlay',
          id: 'vendor-quick-switch-index',
          order: 62,
          locale: NS,
          inject: () => ({ getModels, t }),
        }, function VendorIndexEntry(props) {
          return h(VendorIndex, { getModels: props.getModels, t: props.t });
        }));

        slots.inject('plugins.bundle.config', () => slots.register({
          name: 'plugins.bundle.config',
          key: PACKAGE_NAME,
          locale: NS,
          inject: () => ({ t }),
        }, function SettingsSeat(props) {
          return h(SettingsCard, { t: props.t });
        }));
      },
    };
  },
});