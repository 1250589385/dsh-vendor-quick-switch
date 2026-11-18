import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

export const MAGPIE_ROUTE = '/api/vendor-quick-switch/magpie-quotas';

const DEFAULT_PORT = 3425;
const SUCCESS_TTL = 60_000;
const FAILURE_TTL = 20_000;
const REQUEST_TIMEOUT = 2_000;
const MAX_BODY = 2 * 1024 * 1024;

function text(value, limit = 120) {
  return typeof value === 'string' ? value.slice(0, limit) : null;
}

function number(value) {
  return typeof value === 'number' && Number.isFinite(value) ? value : null;
}

/** Only quota fields cross into the browser: no account names, keys or logs. */
export function normalizeMagpieQuota(entry) {
  const windows = Array.isArray(entry?.windows) ? entry.windows.slice(0, 30).map(window => ({
    name: text(window?.name),
    used: number(window?.used),
    remaining: number(window?.remaining),
    amount: number(window?.amount),
    limit: number(window?.limit),
    unit: text(window?.unit, 30),
    resetsAt: text(window?.resetsAt, 60),
  })) : [];
  return {
    provider: text(entry?.provider, 100),
    name: text(entry?.name, 100),
    kind: text(entry?.kind, 40),
    plan: text(entry?.plan, 100),
    windows,
    balance: text(entry?.balance),
    error: entry?.error ? true : null,
  };
}

/** Structural fence for deployments where the global API admission is absent. */
export function isTrustedRequest(req) {
  const host = req?.headers?.host;
  if (typeof host !== 'string' || host === '') return false;
  let url;
  try {
    url = new URL(`http://${host}`);
  } catch {
    return false;
  }
  const hostname = url.hostname;
  const direct = hostname === 'localhost' || hostname.endsWith('.localhost') ||
    hostname === '::1' || hostname === '[::1]' || /^[0-9a-f:]+$/i.test(hostname) ||
    /^\d{1,3}(?:\.\d{1,3}){3}$/.test(hostname);
  if (!direct || req.headers['sec-fetch-site'] === 'cross-site') return false;
  const origin = req.headers.origin;
  if (origin === undefined) return true;
  try {
    return new URL(origin).host === url.host;
  } catch {
    return false;
  }
}

function explicitBase(env) {
  const raw = String(env.MAGPIE_URL || env.MAGPIE_BASE_URL || '').trim();
  if (raw === '') return null;
  try {
    const url = new URL(raw);
    if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password) return null;
    url.search = '';
    url.hash = '';
    return url.toString().replace(/\/+$/, '');
  } catch {
    return null;
  }
}

async function configuredPort(file, read) {
  try {
    const value = JSON.parse(await read(file, 'utf8'))?.port;
    return Number.isInteger(value) && value > 0 && value < 65536 ? value : null;
  } catch {
    return null;
  }
}

/** Explicit URL, then the user's configured port, then Magpie's default. */
export async function magpieCandidateBases(env = process.env, read = readFile) {
  const bases = [];
  const push = value => {
    if (typeof value === 'string' && value !== '' && !bases.includes(value)) bases.push(value);
  };
  push(explicitBase(env));
  const home = env.USERPROFILE || env.HOME || '';
  const dirs = [
    env.MAGPIE_CONFIG_DIR,
    env.XDG_CONFIG_HOME ? join(env.XDG_CONFIG_HOME, 'magpie') : '',
    env.APPDATA ? join(env.APPDATA, 'magpie') : '',
    home ? join(home, '.config', 'magpie') : '',
  ].filter(value => typeof value === 'string' && value !== '');
  const ports = [];
  for (const dir of dirs) {
    const port = await configuredPort(join(dir, 'settings.json'), read);
    if (port !== null && !ports.includes(port)) ports.push(port);
  }
  if (!ports.includes(DEFAULT_PORT)) ports.push(DEFAULT_PORT);
  for (const port of ports) push(`http://127.0.0.1:${port}`);
  return bases;
}

function quotaUrl(base) {
  return `${base}${base.endsWith('/v1') ? '/magpie/quotas' : '/v1/magpie/quotas'}`;
}

export function createMagpieQuotaReader(options = {}) {
  const env = options.env ?? process.env;
  const read = options.readFile ?? readFile;
  const fetchImpl = options.fetchImpl ?? ((...args) => fetch(...args));
  const timeout = options.timeout ?? REQUEST_TIMEOUT;
  let activeBase = null;
  let cache = null;
  let pending = null;

  const load = async () => {
    const candidates = await magpieCandidateBases(env, read);
    if (activeBase !== null && !candidates.includes(activeBase)) candidates.unshift(activeBase);
    else if (activeBase !== null) {
      candidates.splice(candidates.indexOf(activeBase), 1);
      candidates.unshift(activeBase);
    }
    for (const base of candidates) {
      try {
        const response = await fetchImpl(quotaUrl(base), {
          headers: { accept: 'application/json' },
          redirect: 'error',
          signal: AbortSignal.timeout(timeout),
        });
        if (!response.ok) continue;
        const raw = await response.text();
        if (raw.length > MAX_BODY) continue;
        const body = JSON.parse(raw);
        if (!Array.isArray(body?.data)) continue;
        activeBase = base;
        return {
          ok: true,
          providers: body.data.slice(0, 200).map(normalizeMagpieQuota),
          fetchedAt: Date.now(),
        };
      } catch {
        // An absent gateway and a changed port are both ordinary silent misses.
      }
    }
    return { ok: false, providers: [], fetchedAt: Date.now() };
  };

  return async () => {
    const now = Date.now();
    if (cache !== null && now - cache.at < (cache.value.ok ? SUCCESS_TTL : FAILURE_TTL)) {
      return cache.value;
    }
    if (pending !== null) return pending;
    pending = load().then(value => {
      cache = { at: Date.now(), value };
      return value;
    }).finally(() => {
      pending = null;
    });
    return pending;
  };
}
