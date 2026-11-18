import assert from 'node:assert/strict';
import {
  createMagpieQuotaReader,
  isTrustedRequest,
  magpieCandidateBases,
  normalizeMagpieQuota,
} from '../magpie.js';

const request = (host, origin, site) => ({
  headers: {
    host,
    ...(origin === undefined ? {} : { origin }),
    ...(site === undefined ? {} : { 'sec-fetch-site': site }),
  },
});

assert.equal(isTrustedRequest(request('127.0.0.1:7832', 'http://127.0.0.1:7832', 'same-origin')), true);
assert.equal(isTrustedRequest(request('localhost:7832', undefined)), true);
assert.equal(isTrustedRequest(request('example.com', 'http://example.com')), false);
assert.equal(isTrustedRequest(request('127.0.0.1:7832', 'http://evil.example')), false);
assert.equal(isTrustedRequest(request('127.0.0.1:7832', undefined, 'cross-site')), false);

const publicRow = normalizeMagpieQuota({
  provider: 'codex', name: 'Codex', kind: 'subscription', plan: 'Pro',
  user: 'private@example.com', key: 'must-not-cross-the-boundary',
  windows: [{ name: '7 days', used: 25, remaining: 75, display: 'private account text' }],
});
assert.equal(publicRow.provider, 'codex');
assert.equal(publicRow.windows[0].remaining, 75);
assert.equal('user' in publicRow, false);
assert.equal('key' in publicRow, false);
assert.equal('display' in publicRow.windows[0], false);

{
  const bases = await magpieCandidateBases({
    MAGPIE_URL: 'https://magpie.example.test/v1/',
    HOME: '/home/example',
  }, async file => {
    assert.ok(file.endsWith('settings.json'));
    return JSON.stringify({ port: 4567 });
  });
  assert.deepEqual(bases, [
    'https://magpie.example.test/v1',
    'http://127.0.0.1:4567',
    'http://127.0.0.1:3425',
  ]);
}

{
  const urls = [];
  const read = createMagpieQuotaReader({
    env: { MAGPIE_BASE_URL: 'http://127.0.0.1:9999/v1' },
    readFile: async () => { throw new Error('no config'); },
    fetchImpl: async url => {
      urls.push(url);
      return {
        ok: true,
        text: async () => JSON.stringify({ data: [{ provider: 'custom', balance: '1200 credits', user: 'hidden' }] }),
      };
    },
  });
  const [first, second] = await Promise.all([read(), read()]);
  assert.equal(first.ok, true);
  assert.equal(second.ok, true);
  assert.equal(first.providers[0].balance, '1200 credits');
  assert.equal('user' in first.providers[0], false);
  assert.equal((await read()).ok, true);
  assert.deepEqual(urls, ['http://127.0.0.1:9999/v1/magpie/quotas'], 'in-flight and TTL reads are deduplicated');
}

{
  const read = createMagpieQuotaReader({
    env: { MAGPIE_CONFIG_DIR: '/unused' },
    readFile: async () => JSON.stringify({ port: 4567 }),
    fetchImpl: async () => { throw new Error('offline'); },
    timeout: 10,
  });
  const result = await read();
  assert.equal(result.ok, false);
  assert.deepEqual(result.providers, [], 'no gateway is an empty answer, not a plugin failure');
}

console.log('vendor quick switch: Magpie host discovery, privacy, and trust tests passed');
