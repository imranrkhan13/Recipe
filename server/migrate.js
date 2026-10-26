import fs from 'node:fs/promises';
import { getPool } from './db.js';
const pool = getPool();
const client = await pool.connect();
try {
  await client.query('BEGIN');
  await client.query(await fs.readFile(new URL('../db/001-init.sql', import.meta.url), 'utf8'));
  await client.query('COMMIT');
  console.log('Une recette additive schema is ready.');
} catch {
  await client.query('ROLLBACK');
  console.error('Schema update failed; transaction rolled back.');
  process.exitCode = 1;
} finally { client.release(); await pool.end(); }
