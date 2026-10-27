import test from 'node:test';
import assert from 'node:assert/strict';
import { validateRecipe, InputError } from '../server/recipe.js';
const sample = { id: 'synthetic-1', title: 'Synthetic soup', time: 10, level: 'Easy', servings: 2, category: '', cuisine: '', calories: '', rating: 0, isFav: false, tags: [], notes: '', ingredients: [{ qty: '1', unit: 'g', name: 'salt' }], instructions: 'Stir.', image: '' };
test('round-trip every current recipe field without accepting owner spoofing', () => {
  assert.deepEqual(validateRecipe({ ...sample, owner_id: 'attacker', surprise: true }), sample);
});
test('reject invalid required fields, IDs, oversized inputs and temporary images', () => {
  for (const patch of [{ title: '' }, { id: '../x' }, { instructions: '' }, { time: -1 }, { servings: Infinity }, { image: 'blob:temporary' }, { image: 'javascript:alert(1)' }, { image: 'data:image/svg+xml;base64,AAAA' }, { notes: 'a'.repeat(20001) }, { ingredients: [null] }, { isFav: 'true' }, { rating: 6 }]) {
    assert.throws(() => validateRecipe({ ...sample, ...patch }), InputError);
  }
});
test('accept bounded persistent photos and HTTPS links', () => {
  for (const image of ['https://example.com/synthetic.jpg', 'data:image/png;base64,AAAA']) assert.equal(validateRecipe({ ...sample, image }).image, image);
});
test('accept custom cuisine names and reject over-long ones', () => {
  for (const cuisine of ['Polish', 'Greek', 'Żurek-style Polish', '日本料理']) assert.equal(validateRecipe({ ...sample, cuisine }).cuisine, cuisine);
  assert.throws(() => validateRecipe({ ...sample, cuisine: 'a'.repeat(101) }), InputError);
});
