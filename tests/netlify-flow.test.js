import test from 'node:test';
import assert from 'node:assert/strict';
import { randomUUID, randomBytes } from 'node:crypto';
import { getPool } from '../server/db.js';

// Full account and recipe flow through the Netlify function entry point. Needs DATABASE_URL.
test('netlify function: private accounts and recipes', { skip: !process.env.DATABASE_URL }, async () => {
  const { default: handler } = await import('../netlify/functions/api.mjs');
  const origin = 'https://une-recette.example';
  const call = async (path, method = 'GET', body, cookie) => {
    const r = await handler(new Request(origin + '/api' + path, { method, headers: { origin, 'content-type': 'application/json', ...(cookie ? { cookie } : {}) }, body: body === undefined ? undefined : JSON.stringify(body) }), { ip: '203.0.113.9' });
    return { status: r.status, data: await r.json(), setCookie: r.headers.getSetCookie()[0] };
  };
  const names = [0, 1].map(() => 'synthetic_' + randomUUID().replaceAll('-', '').slice(0, 16));
  try {
    const users = [];
    for (const username of names) {
      const r = await call('/auth/register', 'POST', { username, password: randomBytes(24).toString('base64url') });
      assert.equal(r.status, 200);
      assert.match(r.setCookie, /HttpOnly/);
      assert.match(r.setCookie, /SameSite=Strict/);
      assert.match(r.setCookie, /Secure/);
      users.push(r.setCookie.split(';')[0]);
    }
    const id = 'r' + randomBytes(6).toString('hex');
    const recipe = { id, title: 'Synthetic soup', time: 20, level: 'Easy', servings: 2, category: '', cuisine: '', calories: '', rating: 3, isFav: false, tags: [], notes: '', ingredients: [{ qty: '1', unit: 'cup', name: 'water' }], instructions: 'Boil.', image: '' };
    assert.equal((await call('/recipes/' + id, 'PUT', { ...recipe, version: 0 }, users[0])).status, 200);
    assert.equal((await call('/recipes', 'GET', undefined, users[0])).data.recipes.length, 1);
    assert.equal((await call('/recipes', 'GET', undefined, users[1])).data.recipes.length, 0);
    assert.equal((await call('/recipes/' + id, 'PUT', { ...recipe, title: 'Hijack', version: 1 }, users[1])).status, 409);
    assert.equal((await call('/recipes/' + id, 'DELETE', { version: 1 }, users[1])).status, 409);
    const edit = await call('/recipes/' + id, 'PUT', { ...recipe, title: 'Edited', version: 1 }, users[0]);
    assert.equal(edit.status, 200); assert.equal(edit.data.recipe.version, 2);
    assert.equal((await call('/recipes/' + id, 'PUT', { ...recipe, title: 'Stale', version: 1 }, users[0])).status, 409);
    assert.equal((await call('/recipes/' + id, 'DELETE', { version: 2 }, users[0])).status, 200);
    assert.equal((await call('/auth/logout', 'POST', {}, users[0])).status, 200);
    assert.equal((await call('/recipes', 'GET', undefined, users[0])).status, 401);
  } finally {
    await getPool().query('DELETE FROM une_recette.users WHERE username = ANY($1)', [names]);
    await getPool().end();
  }
});
