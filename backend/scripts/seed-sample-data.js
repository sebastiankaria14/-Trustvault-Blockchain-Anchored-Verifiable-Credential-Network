import dotenv from 'dotenv';
import { query, closePool } from '../src/utils/database.js';

dotenv.config();

/**
 * Simple Sample Data Seeding Script for TrustVault
 * Adds realistic test credentials to an existing user
 * Run with: node scripts/seed-sample-data.js [user-email]
 */

const TEST_USER_EMAIL = process.argv[2] || 'test@example.com';

async function seedSampleData() {
  try {
    console.log('🌱 Starting sample data seeding...\n');

    // Step 1: Get test user
    console.log(`📍 Finding test user with email: ${TEST_USER_EMAIL}`);
    const userResult = await query(
      'SELECT id FROM users WHERE email = $1 LIMIT 1',
      [TEST_USER_EMAIL]
    );

    if (userResult.rows.length === 0) {
      console.error(`❌ User with email "${TEST_USER_EMAIL}" not found!`);
      console.log('📝 Please create a user account first by logging in on the application.\n');
      process.exit(1);
    }

    const userId = userResult.rows[0].id;
    console.log(`✅ Found user: ${userId}\n`);

    // Step 2: Get Harvard institution (already exists)
    console.log('📍 Getting Harvard University institution...');
    const instResult = await query(
      'SELECT id FROM institutions WHERE name = $1 LIMIT 1',
      ['Harvard University']
    );

    if (instResult.rows.length === 0) {
      console.error('❌ Harvard University institution not found in database!');
      process.exit(1);
    }

    const institutionId = instResult.rows[0].id;
    console.log(`✅ Using institution: ${institutionId}\n`);

    // Step 3: Create sample credentials
    console.log('📍 Creating sample credentials...');
    const credentials = [
      {
        type: 'degree',
        name: 'Bachelor of Science in Computer Science',
        description: 'Four-year undergraduate degree with honors, specializing in artificial intelligence and machine learning.',
        credential_data: {
          field_of_study: 'Computer Science',
          gpa: '3.9/4.0',
          honors: 'Cum Laude',
          graduation_date: '2020-05-28'
        },
        issued_date: '2020-05-28',
        expiry_date: null,
        status: 'active'
      },
      {
        type: 'certificate',
        name: 'AWS Solutions Architect Professional',
        description: 'Advanced AWS certification verifying expertise in designing scalable, highly available systems.',
        credential_data: {
          exam_score: 87,
          exam_date: '2023-03-10',
          aws_specialty: 'Solutions Architect Professional'
        },
        issued_date: '2023-03-10',
        expiry_date: '2025-03-10',
        status: 'active'
      },
      {
        type: 'certificate',
        name: 'Oracle Certified Associate Java Programmer',
        description: 'Professional certification demonstrating expertise in Java programming and OOP concepts.',
        credential_data: {
          exam_score: 92,
          exam_date: '2021-06-15',
          certification_level: 'Associate'
        },
        issued_date: '2021-06-15',
        expiry_date: '2024-06-15',
        status: 'expired'
      },
      {
        type: 'degree',
        name: 'Master of Business Administration (MBA)',
        description: 'Two-year full-time MBA program with focus on technology management and entrepreneurship.',
        credential_data: {
          specialization: 'Technology Management',
          duration_months: 24,
          graduation_date: '2023-05-15',
          thesis_title: 'AI in Enterprise Systems'
        },
        issued_date: '2023-05-15',
        expiry_date: null,
        status: 'active'
      },
      {
        type: 'certificate',
        name: 'Google Professional Cloud Architect',
        description: 'Professional certification demonstrating expertise in Google Cloud Platform architecture.',
        credential_data: {
          exam_score: 85,
          exam_date: '2024-01-20',
          certification_level: 'Professional',
          gcp_specialization: 'Cloud Architect'
        },
        issued_date: '2024-01-20',
        expiry_date: '2026-01-20',
        status: 'active'
      },
      {
        type: 'certificate',
        name: 'Kubernetes Application Developer (CKAD)',
        description: 'Certification for developers working with Kubernetes container orchestration platform.',
        credential_data: {
          exam_score: 88,
          exam_date: '2024-02-15',
          certification: 'CKAD'
        },
        issued_date: '2024-02-15',
        expiry_date: '2026-02-15',
        status: 'active'
      }
    ];

    let credentialIds = [];
    for (const cred of credentials) {
      const existingResult = await query(
        'SELECT id FROM credentials WHERE credential_name = $1 AND user_id = $2',
        [cred.name, userId]
      );

      if (existingResult.rows.length === 0) {
        const createResult = await query(
          `INSERT INTO credentials
           (user_id, institution_id, credential_type, credential_name, description,
            credential_data, issue_date, expiry_date, status, blockchain_hash)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
           RETURNING id`,
          [
            userId,
            institutionId,
            cred.type,
            cred.name,
            cred.description,
            JSON.stringify(cred.credential_data),
            cred.issued_date,
            cred.expiry_date,
            cred.status,
            `0x${Math.random().toString(16).substring(2, 66)}`
          ]
        );
        const credId = createResult.rows[0].id;
        credentialIds.push(credId);
        console.log(`  ✅ Created credential: ${cred.name} (${cred.status})`);
      } else {
        console.log(`  ℹ️  Credential already exists: ${cred.name}`);
        credentialIds.push(existingResult.rows[0].id);
      }
    }
    console.log();

    // Step 4: Note about verification logs
    console.log('📍 Verification logs skipped (can be added manually via verifier portal)\n');

    // Summary
    console.log('✨ Sample data seeding complete!\n');
    console.log('📊 Summary:');
    console.log(`  • Credentials created: ${credentialIds.length}`);
    console.log(`    - 2 Active degrees`);
    console.log(`    - 4 Active certificates`);
    console.log(`    - 1 Expired certificate`);
    console.log(`  • Total: 6 sample credentials\n`);
    console.log('🎉 You can now see sample credentials in your User Wallet!\n');
    console.log('Next steps:');
    console.log('  1. Go to http://localhost:3000/user/wallet');
    console.log('  2. See the credentials grid populated with sample data');
    console.log('  3. Click on any credential to see details');
    console.log('  4. Check the audit log to see verification history\n');

  } catch (error) {
    console.error('❌ Error seeding sample data:', error.message);
    process.exit(1);
  } finally {
    await closePool();
  }
}

seedSampleData();
