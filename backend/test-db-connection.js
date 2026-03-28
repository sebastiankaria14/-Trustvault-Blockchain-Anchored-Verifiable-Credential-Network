import pkg from 'pg';
const { Client } = pkg;
import dotenv from 'dotenv';

dotenv.config();

const testConnection = async () => {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }, // Required for Supabase
    connectionTimeoutMillis: 10000,
  });

  try {
    console.log('🔄 Attempting to connect to database...');
    console.log(`📍 Connection string: ${process.env.DATABASE_URL?.substring(0, 50)}...`);

    await client.connect();
    console.log('✅ Connected successfully!');

    const result = await client.query('SELECT NOW()');
    console.log('✅ Query executed! Server time:', result.rows[0].now);

    await client.end();
    console.log('✅ Connection closed');
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    if (error.cause) {
      console.error('   Cause:', error.cause.message);
    }
    process.exit(1);
  }
};

testConnection();
