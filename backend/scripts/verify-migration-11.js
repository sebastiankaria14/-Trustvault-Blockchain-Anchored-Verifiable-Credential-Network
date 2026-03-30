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
      "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_name IN ('verification_documents') ORDER BY table_name"
    );

    console.log(`tables=${tableResult.rows.map((row) => row.table_name).join(',')}`);
  } finally {
    await pool.end();
  }
};

run().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
