import { query } from './src/utils/database.js';

async function cleanupDemoCredentials() {
  try {
    console.log('🧹 Starting cleanup of demo credentials...\n');

    // Step 1: Get the latest TWE credential
    const latestTWE = await query(
      `SELECT id FROM credentials
       WHERE credential_name = 'TWE'
       ORDER BY created_at DESC
       LIMIT 1`,
      []
    );

    if (latestTWE.rows.length === 0) {
      console.log('❌ No TWE credential found. Aborting cleanup.');
      process.exit(1);
    }

    const latesTWEId = latestTWE.rows[0].id;
    console.log(`✓ Found latest TWE credential: ${latesTWEId}`);

    // Step 2: Get all other credentials to delete
    const otherCredentials = await query(
      `SELECT id, credential_name, created_at
       FROM credentials
       WHERE id != $1
       ORDER BY created_at DESC`,
      [latesTWEId]
    );

    console.log(`✓ Found ${otherCredentials.rows.length} credentials to delete\n`);

    if (otherCredentials.rows.length === 0) {
      console.log('✓ No other credentials to delete. Database is clean.');
      process.exit(0);
    }

    // Show what will be deleted
    console.log('Credentials to be deleted:');
    otherCredentials.rows.forEach((cred, idx) => {
      console.log(`  ${idx + 1}. ${cred.credential_name} (${new Date(cred.created_at).toLocaleString()})`);
    });
    console.log();

    // Step 3: Delete all other credentials (cascade will handle related records)
    const credentialIds = otherCredentials.rows.map(c => c.id);

    // Delete in chunks to avoid too large query
    const batchSize = 10;
    let deleted = 0;

    for (let i = 0; i < credentialIds.length; i += batchSize) {
      const batch = credentialIds.slice(i, i + batchSize);
      const placeholders = batch.map((_, idx) => `$${idx + 1}`).join(',');

      const result = await query(
        `DELETE FROM credentials WHERE id IN (${placeholders})`,
        batch
      );

      deleted += result.rowCount;
      console.log(`✓ Deleted batch ${Math.floor(i / batchSize) + 1}, total deleted: ${deleted}`);
    }

    console.log(`\n✅ Cleanup complete!`);
    console.log(`   - Kept: 1 credential (TWE)`);
    console.log(`   - Deleted: ${deleted} credentials`);
    console.log(`   - Related credential_shares and verification_logs automatically deleted (cascade)`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Cleanup failed:', error);
    process.exit(1);
  }
}

cleanupDemoCredentials();
