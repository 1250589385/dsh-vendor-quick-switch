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
        .filter(group => !isVisionTwin(group))
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

    /**
     * Put the shipped menu surface inside the safe band when it renders out of
     * it (renderers without CSS anchor positioning fall back to the top-left
     * corner and grow with their content).
     * @returns true when the surface was adjusted.
     */
    function boundSurface(surface, viewportHeight) {
      if (surface === null || surface === undefined) return false;
      const floor = viewportHeight - COLUMN_FLOOR;
      const ceiling = COLUMN_INSET;
      const box = surface.getBoundingClientRect();
      if (box.bottom <= floor && box.top >= ceiling) return false;
      surface.style.maxHeight = `${Math.max(160, floor - ceiling)}px`;
      surface.style.bottom = `${COLUMN_FLOOR}px`;
      surface.style.top = 'auto';
      return true;
    }

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
     * Bring one vendor's group heading into view inside the shipped list.
     * @returns true when the heading was found and scrolled to.
     */
    function revealVendor(surface, name) {
      const list = listOf(surface);
      if (list === null) return false;
      const nodes = list.querySelectorAll('div,span');
      for (const node of nodes) {
        if (node.children.length !== 0) continue;
        if ((node.textContent ?? '').trim() !== name) continue;
        node.scrollIntoView({ block: 'nearest' });
        return true;
      }
      return false;
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

      /**
       * Keep the shipped menu itself inside the safe band.
       *
       * The shipped surface is placed with CSS anchor positioning. Where the
       * renderer does not support it, the menu falls back to the top-left
       * corner and grows with its content, so a long model list runs past the
       * bottom of the window — and a vendor index that follows that rectangle
       * runs past it too. Only the out-of-band case is touched: the menu gets a
       * bounded height, sits above the composer's tool row, and keeps its own
       * internal scrolling. Original inline values are restored on close.
       */
      React.useEffect(() => {
        if (!state.open || state.surface === null) return undefined;
        const surface = state.surface;
        const saved = {
          top: surface.style.top,
          bottom: surface.style.bottom,
          maxHeight: surface.style.maxHeight,
        };
        const apply = () => {
          boundSurface(surface, window.innerHeight);
        };
        apply();
        const frame = window.requestAnimationFrame(apply);
        window.addEventListener('resize', apply);
        return () => {
          window.cancelAnimationFrame(frame);
          window.removeEventListener('resize', apply);
          surface.style.top = saved.top;
          surface.style.bottom = saved.bottom;
          surface.style.maxHeight = saved.maxHeight;
        };
      }, [state.open, state.surface]);

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
      const columnHeight = Math.max(
        120,
        Math.min(COLUMN_MAX_HEIGHT, floor - ceiling, Math.max(120, rect.bottom - ceiling)),
      );
      const menuBottom = Math.min(rect.bottom, floor);
      const top = Math.max(ceiling, menuBottom - columnHeight);

      const rightRoom = viewportWidth - COLUMN_INSET - (rect.right + COLUMN_GAP);
      const left = rightRoom >= COLUMN_WIDTH
        ? rect.right + COLUMN_GAP
        : clamp(rect.left - COLUMN_GAP - COLUMN_WIDTH, COLUMN_INSET, viewportWidth - COLUMN_WIDTH - COLUMN_INSET);

      const vendors = orderVendors(catalog.groups);
      const currentVendor = vendorFor(vendors, catalog.current?.provider);

      const jump = group => {
        setActiveId(group.id);
        const surface = state.surface;
        const name = group.id === 'deepseek-account' ? t('vendor.account') : group.name;
        if (revealVendor(surface, name)) return;
        // The menu is on its root pane: open the shipped model list, then reveal.
        const cell = surface?.querySelector('button[role="menuitem"]');
        if (cell === null || cell === undefined) return;
        cell.click();
        let tries = 0;
        const tick = () => {
          if (revealVendor(surface, name)) return;
          tries += 1;
          if (tries >= 12) return;
          window.requestAnimationFrame(tick);
        };
        window.requestAnimationFrame(tick);
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

      const vendors = React.useMemo(() => orderVendors(state.groups), [state.groups]);
      const busy = state.pending !== null;
      const disabled = locked === true || busy;
      const currentVendor = vendorFor(vendors, state.current?.provider);

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