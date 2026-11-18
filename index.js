import { createMagpieQuotaReader, isTrustedRequest, MAGPIE_ROUTE } from './magpie.js';

export const inject = ['webServer'];

/**
 * Optional same-origin Magpie bridge. The model switcher itself needs no Host
 * service; when Magpie is absent this route simply answers with no providers.
 */
export function apply(ctx) {
  const server = ctx.get('webServer');
  if (!server || typeof server.register !== 'function') return undefined;
  const readQuotas = createMagpieQuotaReader();
  return server.register({
    name: 'dsh-vendor-quick-switch-magpie',
    kind: 'exact',
    path: MAGPIE_ROUTE,
    handler: async (req, res) => {
      const send = (status, payload) => {
        const body = JSON.stringify(payload);
        res.writeHead(status, {
          'content-type': 'application/json; charset=utf-8',
          'content-length': Buffer.byteLength(body),
          'cache-control': 'no-store',
        });
        res.end(req.method === 'HEAD' ? undefined : body);
      };
      if (!isTrustedRequest(req)) return send(403, { ok: false, providers: [] });
      if (!['GET', 'HEAD'].includes(String(req.method ?? 'GET').toUpperCase())) {
        return send(405, { ok: false, providers: [] });
      }
      return send(200, await readQuotas());
    },
  });
}
