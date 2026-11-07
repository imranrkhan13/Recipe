import fs from 'node:fs/promises';
import { getPool } from './db.js';
const pool = getPool();
const client = await pool.connect();
try {
  await client.query('BEGIN');
  const dir = new URL('../db/', import.meta.url);
  const files = (await fs.readdir(dir)).filter(f => f.endsWith('.sql')).sort();
  for (const f of files) await client.query(await fs.readFile(new URL(f, dir), 'utf8'));
  await client.query('COMMIT');
  console.log('Une recette additive schema is ready.');
} catch {
  await client.query('ROLLBACK');
  console.error('Schema update failed; transaction rolled back.');
  process.exitCode = 1;
} finally { client.release(); await pool.end(); }
