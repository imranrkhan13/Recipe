import test from 'node:test';
import assert from 'node:assert/strict';
import { randomUUID, randomBytes } from 'node:crypto';
import { createApp } from '../server/app.js';
import { getPool } from '../server/db.js';

test('share links: cover public, full recipe behind session, owner-only share control', { skip: !process.env.DATABASE_URL }, async () => {
  const pool = getPool(); const server = createApp(pool).listen(0, '127.0.0.1');
  await new Promise(resolve => server.once('listening', resolve));
  const origin = `http://127.0.0.1:${server.address().port}`;
  const names = [0, 1].map(() => 'synthetic_' + randomUUID().replaceAll('-', '').slice(0, 16));
  async function call(path, method = 'GET', body, cookie) {
    const r = await fetch(origin + '/api' + path, { method, headers: { Origin: origin, 'Content-Type': 'application/json', ...(cookie ? { Cookie: cookie } : {}) }, body: body === undefined ? undefined : JSON.stringify(body) });
    return { status: r.status, data: await r.json(), cookie: r.headers.get('set-cookie')?.split(';')[0] };
  }
  try {
    const accounts = [];
    for (const username of names) {
      const password = randomBytes(24).toString('base64url');
      const r = await call('/auth/register', 'POST', { username, password }); assert.equal(r.status, 200); accounts.push({ username, password, cookie: r.cookie });
    }
    const [a, b] = accounts;
    const recipe = { id: 'share-synthetic', title: 'Synthetic share cake', time: 20, level: 'Easy', servings: 2, category: 'Dessert', cuisine: '', calories: '', rating: 0, isFav: false, tags: [], notes: 'secret note', ingredients: [{ qty: '1', unit: 'cup', name: 'flour' }], instructions: 'Mix. Bake.', image: '' };
    assert.equal((await call('/recipes/' + recipe.id, 'PUT', recipe, a.cookie)).status, 200);
    // recipe list exposes shared flag
    assert.equal((await call('/recipes', 'GET', undefined, a.cookie)).data.recipes[0].shared, false);
    // share control is owner-only and needs a session
    assert.equal((await call('/recipes/' + recipe.id + '/share', 'PUT', {})).status, 401);
    assert.equal((await call('/recipes/' + recipe.id + '/share', 'PUT', {}, b.cookie)).status, 404);
    const created = await call('/recipes/' + recipe.id + '/share', 'PUT', {}, a.cookie);
    assert.equal(created.status, 200); assert.match(created.data.share_token, /^[a-f0-9]{64}$/);
    const again = await call('/recipes/' + recipe.id + '/share', 'PUT', {}, a.cookie);
    assert.equal(again.data.share_token, created.data.share_token);
    assert.equal((await call('/recipes', 'GET', undefined, a.cookie)).data.recipes[0].shared, true);
    const link = '/shared/' + created.data.share_token;
    // signed-out: cover only, no inside content
    const pub = await call(link);
    assert.equal(pub.status, 200);
    assert.deepEqual(Object.keys(pub.data).sort(), ['image', 'title']);
    assert.equal(pub.data.title, recipe.title);
    // any signed-in visitor with the link gets the full recipe
    for (const who of [a, b]) {
      const full = await call(link, 'GET', undefined, who.cookie);
      assert.equal(full.status, 200);
      assert.equal(full.data.recipe.instructions, recipe.instructions);
    }
    // bad and unknown tokens 404
    assert.equal((await call('/shared/' + '0'.repeat(64))).status, 404);
    assert.equal((await call('/shared/not-a-token')).status, 404);
    // non-owner cannot revoke
    assert.equal((await call('/recipes/' + recipe.id + '/share', 'DELETE', {}, b.cookie)).status, 404);
    assert.equal((await call(link)).status, 200);
    // owner revokes: link dies
    assert.equal((await call('/recipes/' + recipe.id + '/share', 'DELETE', {}, a.cookie)).status, 200);
    assert.equal((await call(link)).status, 404);
  } finally {
    await pool.query('DELETE FROM une_recette.users WHERE username=ANY($1::text[])', [names]);
    await pool.end(); server.close();
  }
});
