import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? true : false,
});

async function migrateDocumentUrlColumn() {
  const client = await pool.connect();

  try {
    console.log('Starting migration: Altering document_url column from VARCHAR(500) to TEXT...');

    // Alter the column type from VARCHAR(500) to TEXT
    await client.query(`
      ALTER TABLE credentials
      ALTER COLUMN document_url SET DATA TYPE TEXT;
    `);

    console.log('✅ Successfully migrated document_url column to TEXT type');

    // Verify the column type
    const result = await client.query(`
      SELECT column_name, data_type, character_maximum_length
      FROM information_schema.columns
      WHERE table_name = 'credentials' AND column_name = 'document_url';
    `);

    console.log('Column details:', result.rows[0]);

  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

migrateDocumentUrlColumn().then(() => {
  console.log('Migration completed successfully');
  process.exit(0);
}).catch(err => {
  console.error('Migration error:', err);
  process.exit(1);
});
