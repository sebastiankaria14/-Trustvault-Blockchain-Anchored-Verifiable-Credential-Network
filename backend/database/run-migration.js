import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import pkg from 'pg';
const { Pool } = pkg;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres.igirpljuupwspigyaqzm:trustvault%40123@aws-1-ap-southeast-2.pooler.supabase.com:5432/postgres',
  ssl: {
    rejectUnauthorized: false
  }
});

async function runMigration() {
  try {
    console.log('🔄 Running migration: Add comments column to verification_logs...');

    const migrationSQL = readFileSync(
      join(__dirname, 'migrations', '05_create_credential_shares.sql'),
      'utf-8'
    );

    await pool.query(migrationSQL);

    console.log('✅ Migration completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    process.exit(1);
  }
}

runMigration();
