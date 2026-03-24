import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres.igirpljuupwspigyaqzm:trustvault%40123@aws-1-ap-southeast-2.pooler.supabase.com:5432/postgres',
  ssl: {
    rejectUnauthorized: false
  }
});

async function checkSchema() {
  try {
    console.log('🔍 Checking verification_logs table structure...\n');

    const result = await pool.query(`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_name = 'verification_logs'
      ORDER BY ordinal_position;
    `);

    console.log('Columns in verification_logs table:');
    console.log('=====================================');
    result.rows.forEach(row => {
      console.log(`${row.column_name} (${row.data_type}) ${row.is_nullable === 'YES' ? 'NULL' : 'NOT NULL'}`);
    });

    await pool.end();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    await pool.end();
    process.exit(1);
  }
}

checkSchema();
