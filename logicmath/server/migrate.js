import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pool from './db/pool.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runMigrations() {
  const migrationsDir = path.join(__dirname, 'db', 'migrations');

  // Table to track executed migrations
  await pool.query(`
    CREATE TABLE IF NOT EXISTS _migrations (
      filename TEXT PRIMARY KEY,
      applied_at TIMESTAMPTZ DEFAULT NOW()
    )
  `);

  const files = fs.readdirSync(migrationsDir).sort().filter(f => f.endsWith('.sql'));
  console.log(`Found ${files.length} migration files`);

  for (const file of files) {
    // Check if already applied
    const { rows } = await pool.query('SELECT 1 FROM _migrations WHERE filename = $1', [file]);
    if (rows.length > 0) {
      console.log(`⏭️  Skipping (already applied): ${file}`);
      continue;
    }

    const filePath = path.join(migrationsDir, file);
    const sql = fs.readFileSync(filePath, 'utf-8');

    console.log(`⏳ Executing: ${file}...`);
    try {
      await pool.query('BEGIN');
      await pool.query(sql);
      await pool.query('INSERT INTO _migrations (filename) VALUES ($1)', [file]);
      await pool.query('COMMIT');
      console.log(` ${file}`);
    } catch (err) {
      await pool.query('ROLLBACK');
      console.error(` Error in ${file}:`, err.message);
      // Continue next migrations even on failure
    }
  }

  console.log('\n🎉 Migrations completed!');
  await pool.end();
}

runMigrations().catch(err => {
  console.error('Critical error:', err);
  process.exit(1);
});
