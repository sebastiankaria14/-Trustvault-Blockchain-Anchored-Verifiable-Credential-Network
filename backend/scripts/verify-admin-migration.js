import dotenv from 'dotenv';
import pkg from 'pg';

dotenv.config();

const { Pool } = pkg;

const run = async () => {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    const tableResult = await pool.query(
      "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_name IN ('admins', 'system_settings') ORDER BY table_name"
    );

    const adminResult = await pool.query('SELECT COUNT(*)::int AS count FROM admins');
    const settingsResult = await pool.query('SELECT COUNT(*)::int AS count FROM system_settings');

    console.log(`tables=${tableResult.rows.map((row) => row.table_name).join(',')}`);
    console.log(`admins=${adminResult.rows[0].count}`);
    console.log(`settings=${settingsResult.rows[0].count}`);
  } finally {
    await pool.end();
  }
};

run().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
