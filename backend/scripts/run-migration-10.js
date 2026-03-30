import { readFileSync } from 'fs';
import dotenv from 'dotenv';
import pkg from 'pg';

dotenv.config();

const { Pool } = pkg;

const run = async () => {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is missing. Configure backend/.env first.');
  }

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    const sql = readFileSync('./database/migrations/10_create_approval_checklist_tables.sql', 'utf8');
    await pool.query(sql);
    console.log('migration_10_applied');
  } finally {
    await pool.end();
  }
};

run().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
