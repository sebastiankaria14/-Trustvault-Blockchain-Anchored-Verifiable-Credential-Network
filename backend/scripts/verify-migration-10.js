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
      "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_name IN ('approval_checklist_templates', 'approval_checklist_reviews') ORDER BY table_name"
    );

    const templateCount = await pool.query(
      'SELECT entity_type, COUNT(*)::int AS total FROM approval_checklist_templates GROUP BY entity_type ORDER BY entity_type'
    );

    console.log(`tables=${tableResult.rows.map((row) => row.table_name).join(',')}`);
    console.log(`templates=${templateCount.rows.map((row) => `${row.entity_type}:${row.total}`).join(',')}`);
  } finally {
    await pool.end();
  }
};

run().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
