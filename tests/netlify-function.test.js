import test from 'node:test';
import assert from 'node:assert/strict';
process.env.DATABASE_URL ||= 'postgres://unused:unused@127.0.0.1:1/unused'; // pool is lazy; no connection is made
const { default: handler } = await import('../netlify/functions/api.mjs');

// Does not touch the database: checks routing, same-origin guard and JSON errors only.
test('netlify function serves the Express API', async () => {
  const unknown = await handler(new Request('https://example.netlify.app/api/nope'));
  assert.equal(unknown.status, 404);
  assert.deepEqual(await unknown.json(), { error: 'Not found' });
  assert.equal(unknown.headers.get('cache-control'), 'no-store');
  const crossOrigin = await handler(new Request('https://example.netlify.app/api/auth/login', { method: 'POST', headers: { origin: 'https://evil.example', 'content-type': 'application/json' }, body: '{}' }));
  assert.equal(crossOrigin.status, 403);
  const noSession = await handler(new Request('https://example.netlify.app/api/recipes'));
  assert.equal(noSession.status, 401);
});
