import express from 'express';
import cookieParser from 'cookie-parser';
import { rateLimit } from 'express-rate-limit';
import { scrypt, randomBytes, randomUUID, createHash, timingSafeEqual } from 'node:crypto';
import { promisify } from 'node:util';
import { getPool } from './db.js';
import { InputError, validateRecipe } from './recipe.js';
const derive = promisify(scrypt);
const hash = token => createHash('sha256').update(token).digest('hex');
const cookie = 'recette_session';
const days = 14 * 24 * 60 * 60 * 1000;
export function createApp(pool = getPool()) {
  const app = express();
  if (process.env.VERCEL || process.env.TRUST_PROXY) app.set('trust proxy', 1);
  app.disable('x-powered-by');
  app.use('/api', (req, res, next) => {
    res.set({ 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' });
    // Same-origin writes only. No CORS grants. Origin is required by our browser client.
    if (!['GET', 'HEAD', 'OPTIONS'].includes(req.method)) {
      let origin;
      try { origin = new URL(req.get('origin')).host; } catch { return res.status(403).json({ error: 'Same-origin requests only' }); }
      if (origin !== req.get('host') || !req.is('application/json')) return res.status(403).json({ error: 'Same-origin JSON requests only' });
    }
    next();
  });
  app.use('/api', express.json({ limit: '400kb' }), cookieParser());
  // Per-instance backstop. Production deployments should also enforce edge-wide rate limits.
  const authLimit = rateLimit({ windowMs: 15 * 60 * 1000, limit: 20, standardHeaders: 'draft-7', legacyHeaders: false, message: { error: 'Too many attempts. Try again later.' } });
  const cookieOptions = { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict', path: '/', maxAge: days };
  async function attachUser(req) {
    const token = req.cookies[cookie];
    if (!token || !/^[a-f0-9]{64}$/.test(token)) return null;
    const result = await pool.query('SELECT u.id,u.username FROM une_recette.sessions s JOIN une_recette.users u ON u.id=s.user_id WHERE s.token_hash=$1 AND s.expires_at>now()', [hash(token)]);
    return result.rows[0] || null;
  }
  async function identify(req, res, next) {
    const user = await attachUser(req);
    if (!user) return res.status(401).json({ error: 'Please sign in' });
    req.user = user; next();
  }

  // Share links need the share_token column (db/002-share.sql). The rest of the
  // app must keep working if a deploy lands before that migration runs, so the
  // column is probed once and share routes degrade until it exists. A positive
  // result is cached; a missing column is re-probed so sharing self-heals after
  // the migration without a redeploy.
  let shareReady = false;
  async function sharingAvailable() {
    if (shareReady) return true;
    try { await pool.query('SELECT share_token FROM une_recette.recipes LIMIT 0'); shareReady = true; }
    catch (e) { if (e.code !== '42703' && !/column .* does not exist/i.test(e.message || '')) throw e; }
    return shareReady;
  }
  async function session(res, user) {
    const token = randomBytes(32).toString('hex');
    await pool.query('INSERT INTO une_recette.sessions(token_hash,user_id,expires_at) VALUES($1,$2,$3)', [hash(token), user.id, new Date(Date.now() + days)]);
    res.cookie(cookie, token, cookieOptions).json({ user: { username: user.username } });
  }
  app.get('/api/health', async (req, res) => { await pool.query('SELECT 1'); res.json({ ok: true }); });
  app.post('/api/auth/:action', authLimit, async (req, res) => {
    const { action } = req.params;
    if (action === 'logout') {
      if (req.cookies[cookie]) await pool.query('DELETE FROM une_recette.sessions WHERE token_hash=$1', [hash(req.cookies[cookie])]);
      return res.clearCookie(cookie, { ...cookieOptions, maxAge: undefined }).json({ ok: true });
    }
    if (!['register', 'login'].includes(action)) return res.sendStatus(404);
    const username = typeof req.body.username === 'string' ? req.body.username.trim().toLowerCase() : '';
    const password = req.body.password;
    if (!/^[a-z0-9_-]{3,40}$/.test(username) || typeof password !== 'string' || password.length < 12 || password.length > 128) return res.status(400).json({ error: 'Use a 3-40 character username (letters, numbers, _ or -) and a 12-128 character password.' });
    if (action === 'register') {
      const salt = randomBytes(16).toString('hex');
      const digest = (await derive(password, salt, 64)).toString('hex');
      const user = { id: randomUUID(), username };
      try { await pool.query('INSERT INTO une_recette.users(id,username,password_hash) VALUES($1,$2,$3)', [user.id, username, `${salt}:${digest}`]); }
      catch (e) { if (e.code === '23505') return res.status(409).json({ error: 'That username is unavailable.' }); throw e; }
      return session(res, user);
    }
    const result = await pool.query('SELECT id,username,password_hash FROM une_recette.users WHERE username=$1', [username]);
    const user = result.rows[0];
    // Do equivalent expensive work for unknown usernames.
    const [salt, stored] = user ? user.password_hash.split(':') : ['unknown-user-salt', '0'.repeat(128)];
    const digest = await derive(password, salt, 64);
    if (!timingSafeEqual(digest, Buffer.from(stored, 'hex')) || !user) return res.status(401).json({ error: 'Username or password is incorrect.' });
    return session(res, user);
  });
  app.get('/api/me', identify, (req, res) => res.json({ user: { username: req.user.username } }));
  app.get('/api/recipes', identify, async (req, res) => {
    if (await sharingAvailable()) {
      const result = await pool.query('SELECT data,version,share_token FROM une_recette.recipes WHERE owner_id=$1 ORDER BY created_at DESC', [req.user.id]);
      return res.json({ recipes: result.rows.map(row => ({ ...row.data, version: row.version, shared: !!row.share_token })) });
    }
    const result = await pool.query('SELECT data,version FROM une_recette.recipes WHERE owner_id=$1 ORDER BY created_at DESC', [req.user.id]);
    res.json({ recipes: result.rows.map(row => ({ ...row.data, version: row.version, shared: false })) });
  });
  app.put('/api/recipes/:id', identify, async (req, res) => {
    const recipe = validateRecipe(req.body);
    if (recipe.id !== req.params.id) throw new InputError('Recipe ID mismatch');
    const version = req.body.version ?? 0;
    if (!Number.isSafeInteger(version) || version < 0) throw new InputError('Invalid version');
    const result = version === 0
      ? await pool.query('INSERT INTO une_recette.recipes(owner_id,id,data) VALUES($1,$2,$3) ON CONFLICT DO NOTHING RETURNING version', [req.user.id, recipe.id, recipe])
      : await pool.query('UPDATE une_recette.recipes SET data=$3,version=version+1,updated_at=now() WHERE owner_id=$1 AND id=$2 AND version=$4 RETURNING version', [req.user.id, recipe.id, recipe, version]);
    if (!result.rows[0]) return res.status(409).json({ error: 'This recipe changed on another device. Refresh before editing again.' });
    res.json({ recipe: { ...recipe, version: result.rows[0].version } });
  });
  app.delete('/api/recipes/:id', identify, async (req, res) => {
    const version = req.body.version;
    if (!Number.isSafeInteger(version) || version < 1) throw new InputError('Invalid version');
    const result = await pool.query('DELETE FROM une_recette.recipes WHERE owner_id=$1 AND id=$2 AND version=$3 RETURNING id', [req.user.id, req.params.id, version]);
    if (!result.rows[0]) return res.status(409).json({ error: 'Recipe missing or changed. Refresh before deleting.' });
    res.json({ ok: true });
  });
  // Create or return the public share link for one of the owner's recipes.
  app.put('/api/recipes/:id/share', identify, async (req, res) => {
    if (!(await sharingAvailable())) return res.status(503).json({ error: 'Sharing is being set up. Try again shortly.' });
    const existing = await pool.query('SELECT share_token FROM une_recette.recipes WHERE owner_id=$1 AND id=$2', [req.user.id, req.params.id]);
    if (!existing.rows[0]) return res.status(404).json({ error: 'Recipe not found' });
    if (existing.rows[0].share_token) return res.json({ share_token: existing.rows[0].share_token });
    // Unconditional update: the SELECT above already established the row exists and has no token.
    const token = randomBytes(32).toString('hex');
    const result = await pool.query('UPDATE une_recette.recipes SET share_token=$3 WHERE owner_id=$1 AND id=$2 RETURNING share_token', [req.user.id, req.params.id, token]);
    res.json({ share_token: result.rows[0].share_token });
  });
  // Revoke the public link. The recipe itself stays private in the owner's collection.
  app.delete('/api/recipes/:id/share', identify, async (req, res) => {
    if (!(await sharingAvailable())) return res.status(503).json({ error: 'Sharing is being set up. Try again shortly.' });
    const result = await pool.query('UPDATE une_recette.recipes SET share_token=NULL WHERE owner_id=$1 AND id=$2 RETURNING id', [req.user.id, req.params.id]);
    if (!result.rows[0]) return res.status(404).json({ error: 'Recipe not found' });
    res.json({ ok: true });
  });
  // Public share view. Without a session only the cover (title + image) is returned;
  // any signed-in visitor with the link gets the full recipe, never the owner's collection.
  app.get('/api/shared/:token', async (req, res) => {
    if (!/^[a-f0-9]{64}$/.test(req.params.token)) return res.status(404).json({ error: 'This shared recipe is not available.' });
    if (!(await sharingAvailable())) return res.status(404).json({ error: 'This shared recipe is not available.' });
    const result = await pool.query('SELECT data FROM une_recette.recipes WHERE share_token=$1', [req.params.token]);
    const row = result.rows[0];
    if (!row) return res.status(404).json({ error: 'This shared recipe is not available.' });
    const user = await attachUser(req);
    if (!user) return res.json({ title: row.data.title, image: row.data.image || '' });
    res.json({ recipe: row.data });
  });
  app.use('/api', (req, res) => res.status(404).json({ error: 'Not found' }));
  app.use((err, req, res, next) => { // eslint-disable-line no-unused-vars
    if (err instanceof InputError) return res.status(400).json({ error: err.message });
    if (err.type === 'entity.too.large') return res.status(413).json({ error: 'Recipe too large. Use a smaller image.' });
    if (err.type === 'entity.parse.failed') return res.status(400).json({ error: 'Invalid JSON' });
    // Never log raw database errors or connection strings.
    res.status(503).json({ error: 'Storage temporarily unavailable. Your unsaved changes have not been confirmed.' });
  });
  return app;
}
