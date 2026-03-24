import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? true : false,
});

async function cleanupCredentials() {
  const client = await pool.connect();

  try {
    console.log('Starting cleanup: Checking for credentials with schema mismatches...');

    // Check for credentials that might have been inserted with wrong column names
    const badCredentials = await client.query(`
      SELECT COUNT(*) as count
      FROM credentials
      WHERE institution_id IS NULL OR credential_name IS NULL OR issue_date IS NULL;
    `);

    console.log(`Found ${badCredentials.rows[0].count} credentials with missing data.`);

    if (badCredentials.rows[0].count > 0) {
      console.log('Attempting to delete credentials with incomplete data...');

      await client.query(`
        DELETE FROM credentials
        WHERE institution_id IS NULL OR credential_name IS NULL OR issue_date IS NULL;
      `);

      console.log('✅ Deleted incomplete credentials.');
    }

    // Verify the cleanup
    const verifyResult = await client.query(`
      SELECT COUNT(*) as count
      FROM credentials;
    `);

    console.log(`✅ Total valid credentials remaining: ${verifyResult.rows[0].count}`);

  } catch (error) {
    console.error('❌ Cleanup failed:', error.message);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

cleanupCredentials().then(() => {
  console.log('✅ Cleanup completed successfully');
  process.exit(0);
}).catch(err => {
  console.error('❌ Cleanup error:', err);
  process.exit(1);
});
