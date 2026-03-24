import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function checkSchema() {
  try {
    // Get all tables
    const tables = await pool.query(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      ORDER BY table_name
    `);

    console.log('📊 Existing tables:');
    tables.rows.forEach(row => console.log(`   - ${row.table_name}`));

    // Get columns for institutions table
    const institutionsColumns = await pool.query(`
      SELECT column_name, data_type
      FROM information_schema.columns
      WHERE table_name = 'institutions'
      ORDER BY ordinal_position
    `);

    console.log('\n📋 Institutions table columns:');
    institutionsColumns.rows.forEach(row => {
      console.log(`   - ${row.column_name} (${row.data_type})`);
    });

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await pool.end();
  }
}

checkSchema();
