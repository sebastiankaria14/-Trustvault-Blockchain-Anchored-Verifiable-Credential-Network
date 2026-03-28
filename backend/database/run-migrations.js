#!/usr/bin/env node

/**
 * Database Migration Runner
 * Reads DATABASE_URL from .env and applies all migrations
 */

import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pkg from 'pg';

const { Client } = pkg;

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error('❌ ERROR: DATABASE_URL not set in .env file');
  process.exit(1);
}

const client = new Client({
  connectionString: DATABASE_URL
});

async function runMigrations() {
  try {
    await client.connect();
    console.log('✅ Connected to database');

    const migrationsDir = path.join(__dirname, 'migrations');
    const files = fs.readdirSync(migrationsDir)
      .filter(f => f.endsWith('.sql'))
      .sort();

    console.log(`\n📁 Found ${files.length} migrations:\n`);

    for (const file of files) {
      const filePath = path.join(migrationsDir, file);
      const sql = fs.readFileSync(filePath, 'utf8');

      try {
        console.log(`⏳ Running: ${file}`);
        await client.query(sql);
        console.log(`✅ Success: ${file}\n`);
      } catch (err) {
        // If error is about columns/tables already existing, that's OK
        if (err.code === '42701' || err.code === '42P07' || err.message.includes('already exists')) {
          console.log(`⚠️  Already exists: ${file} (OK)\n`);
        } else {
          console.error(`❌ Error in ${file}:`);
          console.error(err.message);
          console.error('');
        }
      }
    }

    console.log('✅ All migrations completed!');
    console.log('\n📊 Checking credentials table columns...');

    // Show table structure
    const result = await client.query(`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_name = 'credentials'
      ORDER BY ordinal_position
    `);

    console.log('\n📋 Credentials table structure:');
    console.log('─'.repeat(60));
    result.rows.forEach(row => {
      const nullable = row.is_nullable === 'YES' ? 'NULL' : 'NOT NULL';
      console.log(`${row.column_name.padEnd(30)} ${row.data_type.padEnd(20)} ${nullable}`);
    });

    // Check for blockchain columns specifically
    const blockchainCols = ['did', 'blockchain_hash', 'blockchain_tx_hash', 'blockchain_network'];
    const existingCols = result.rows.map(r => r.column_name);
    const missingCols = blockchainCols.filter(col => !existingCols.includes(col));

    if (missingCols.length === 0) {
      console.log('\n✅ All blockchain columns exist!');
    } else {
      console.log('\n❌ Missing columns:', missingCols.join(', '));
    }

  } catch (err) {
    console.error('❌ Database connection error:', err.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

runMigrations();
