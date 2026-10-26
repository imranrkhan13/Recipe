import test from 'node:test';
import assert from 'node:assert/strict';
delete process.env.DATABASE_URL;
const { default: handler } = await import('../netlify/functions/api.mjs');

test('a failed function start returns a safe 503 and recovers on a later request', async () => {
  const failed = await handler(new Request('https://example.netlify.app/api/nope'));
  assert.equal(failed.status, 503);
  assert.equal(failed.headers.get('cache-control'), 'no-store');
  const text = await failed.text();
  assert.deepEqual(JSON.parse(text), { error: 'Service unavailable. Try again shortly.' });
  assert.ok(!text.includes('DATABASE_URL') && !text.includes('.mjs'));
  process.env.DATABASE_URL = 'postgres://unused:unused@127.0.0.1:1/unused'; // pool is lazy; no connection is made
  const recovered = await handler(new Request('https://example.netlify.app/api/nope'));
  assert.equal(recovered.status, 404);
});
