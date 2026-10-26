import test from 'node:test';
import assert from 'node:assert/strict';
import { randomUUID, randomBytes } from 'node:crypto';
import { createApp } from '../server/app.js';
import { getPool } from '../server/db.js';
test('private accounts and CRUD against configured test database', { skip: !process.env.DATABASE_URL }, async () => {
 const pool = getPool(); const server = createApp(pool).listen(0, '127.0.0.1');
 await new Promise(resolve => server.once('listening', resolve));
 const origin = `http://127.0.0.1:${server.address().port}`;
 const names = [0,1].map(() => 'synthetic_' + randomUUID().replaceAll('-', '').slice(0,16));
 async function call(path, method = 'GET', body, cookie) {
  const r = await fetch(origin + '/api' + path, { method, headers: { Origin: origin, 'Content-Type':'application/json', ...(cookie ? {Cookie:cookie} : {}) }, body: body === undefined ? undefined : JSON.stringify(body) });
  return { status:r.status, data:await r.json(), cookie:r.headers.get('set-cookie')?.split(';')[0] };
 }
 try {
  const accounts = [];
  for (const username of names) {
   const password = randomBytes(24).toString('base64url');
   const r = await call('/auth/register','POST',{username,password}); assert.equal(r.status,200); accounts.push({username,password,cookie:r.cookie});
  }
  const [a,b]=accounts;
  assert.equal((await call('/recipes')).status,401);
  const sample = { id:'same-synthetic-id',title:'Synthetic soup',time:10,level:'Easy',servings:2,category:'',cuisine:'',calories:'',rating:0,isFav:false,tags:[],notes:'',ingredients:[{qty:'1',unit:'g',name:'salt'}],instructions:'Stir.',image:'data:image/png;base64,AAAA' };
  assert.equal((await call('/recipes/'+sample.id,'PUT',sample,a.cookie)).status,200);
  assert.equal((await call('/recipes','GET',undefined,a.cookie)).data.recipes.length,1);
  assert.equal((await call('/recipes','GET',undefined,b.cookie)).data.recipes.length,0);
  assert.equal((await call('/recipes/'+sample.id,'DELETE',{version:1},b.cookie)).status,409);
  const update=await call('/recipes/'+sample.id,'PUT',{...sample,title:'Updated synthetic soup',version:1,owner_id:'spoof'},a.cookie);
  assert.equal(update.data.recipe.version,2);
  assert.equal((await call('/recipes/'+sample.id,'PUT',{...sample,version:1},a.cookie)).status,409);
  assert.equal((await call('/recipes/'+sample.id,'DELETE',{version:1},a.cookie)).status,409);
  const login=await call('/auth/login','POST',{username:a.username,password:a.password});assert.equal(login.status,200);
  assert.equal((await call('/recipes','GET',undefined,login.cookie)).data.recipes[0].image,sample.image);
  assert.equal((await call('/auth/logout','POST',{},login.cookie)).status,200);
  assert.equal((await call('/recipes','GET',undefined,login.cookie)).status,401);
  const crossOrigin=await fetch(origin+'/api/recipes/'+sample.id,{method:'DELETE',headers:{Origin:'https://other.invalid','Content-Type':'application/json',Cookie:a.cookie},body:JSON.stringify({version:2})});assert.equal(crossOrigin.status,403);
  assert.equal((await call('/recipes/'+sample.id,'DELETE',{version:2},a.cookie)).status,200);
  assert.equal((await call('/recipes','GET',undefined,a.cookie)).data.recipes.length,0);
 } finally {
  await pool.query('DELETE FROM une_recette.users WHERE username=ANY($1::text[])',[names]);
  await new Promise(resolve => server.close(resolve)); await pool.end();
 }
});
