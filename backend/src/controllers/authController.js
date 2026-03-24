import { query } from '../utils/database.js';
import { hashPassword, comparePassword } from '../utils/password.js';
import { generateAuthToken } from '../utils/jwt.js';

/**
 * Register a new user
 */
export const registerUser = async (req, res) => {
  try {
    const { email, password, firstName, lastName, phone, dateOfBirth } = req.body;

    // Check if user already exists
    const existingUser = await query(
      'SELECT id FROM users WHERE email = $1',
      [email]
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists'
      });
    }

    // Hash password
    const passwordHash = await hashPassword(password);

    // Insert new user
    const result = await query(
      `INSERT INTO users (email, password_hash, first_name, last_name, phone, date_of_birth, kyc_status, is_active)
       VALUES ($1, $2, $3, $4, $5, $6, 'pending', true)
       RETURNING id, email, first_name, last_name, phone, date_of_birth, kyc_status, created_at`,
      [email, passwordHash, firstName, lastName, phone || null, dateOfBirth || null]
    );

    const user = result.rows[0];

    // Generate JWT token
    const token = generateAuthToken(user, 'user');

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: {
          id: user.id,
          email: user.email,
          firstName: user.first_name,
          lastName: user.last_name,
          phone: user.phone,
          dateOfBirth: user.date_of_birth,
          kycStatus: user.kyc_status,
          createdAt: user.created_at
        },
        token
      }
    });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({
      success: false,
      message: 'Error registering user',
      error: error.message
    });
  }
};

/**
 * Register a new institution
 */
export const registerInstitution = async (req, res) => {
  try {
    const {
      name,
      type,
      email,
      password,
      registrationNumber,
      address,
      city,
      state,
      country,
      postalCode,
      phone,
      website
    } = req.body;

    // Check if institution already exists
    const existingInstitution = await query(
      'SELECT id FROM institutions WHERE email = $1',
      [email]
    );

    if (existingInstitution.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Institution with this email already exists'
      });
    }

    // Hash password
    const passwordHash = await hashPassword(password);

    // Insert new institution
    const result = await query(
      `INSERT INTO institutions (
        name, type, email, password_hash, registration_number,
        address, city, state, country, postal_code, phone, website,
        verification_status, api_enabled, is_active
      )
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, 'pending', false, true)
       RETURNING id, name, type, email, registration_number, phone, website, verification_status, created_at`,
      [
        name, type, email, passwordHash, registrationNumber || null,
        address || null, city || null, state || null, country || null,
        postalCode || null, phone || null, website || null
      ]
    );

    const institution = result.rows[0];

    // Generate JWT token
    const token = generateAuthToken(institution, 'institution');

    res.status(201).json({
      success: true,
      message: 'Institution registered successfully. Pending admin approval.',
      data: {
        institution: {
          id: institution.id,
          name: institution.name,
          type: institution.type,
          email: institution.email,
          registrationNumber: institution.registration_number,
          phone: institution.phone,
          website: institution.website,
          verificationStatus: institution.verification_status,
          createdAt: institution.created_at
        },
        token
      }
    });
  } catch (error) {
    console.error('Error registering institution:', error);
    res.status(500).json({
      success: false,
      message: 'Error registering institution',
      error: error.message
    });
  }
};

/**
 * Register a new verifier
 */
export const registerVerifier = async (req, res) => {
  try {
    const {
      companyName,
      email,
      password,
      industry,
      address,
      city,
      state,
      country,
      postalCode,
      phone,
      website
    } = req.body;

    // Check if verifier already exists
    const existingVerifier = await query(
      'SELECT id FROM verifiers WHERE email = $1',
      [email]
    );

    if (existingVerifier.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Verifier with this email already exists'
      });
    }

    // Hash password
    const passwordHash = await hashPassword(password);

    // Insert new verifier
    const result = await query(
      `INSERT INTO verifiers (
        company_name, email, password_hash, industry,
        address, city, state, country, postal_code, phone, website,
        verification_status, is_active
      )
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, 'pending', true)
       RETURNING id, company_name, email, industry, phone, website, verification_status, created_at`,
      [
        companyName, email, passwordHash, industry || null,
        address || null, city || null, state || null, country || null,
        postalCode || null, phone || null, website || null
      ]
    );

    const verifier = result.rows[0];

    // Generate JWT token
    const token = generateAuthToken(verifier, 'verifier');

    res.status(201).json({
      success: true,
      message: 'Verifier registered successfully. Pending admin approval.',
      data: {
        verifier: {
          id: verifier.id,
          companyName: verifier.company_name,
          email: verifier.email,
          industry: verifier.industry,
          phone: verifier.phone,
          website: verifier.website,
          verificationStatus: verifier.verification_status,
          createdAt: verifier.created_at
        },
        token
      }
    });
  } catch (error) {
    console.error('Error registering verifier:', error);
    res.status(500).json({
      success: false,
      message: 'Error registering verifier',
      error: error.message
    });
  }
};

/**
 * Login for all user types
 */
export const login = async (req, res) => {
  try {
    const { email, password, userType } = req.body;

    let result;
    let user;
    let type = userType || 'user'; // Default to user if not specified

    // Query appropriate table based on user type
    if (type === 'user') {
      result = await query(
        'SELECT id, email, password_hash, first_name, last_name, kyc_status, is_active FROM users WHERE email = $1',
        [email]
      );
      if (result.rows.length > 0) {
        user = {
          ...result.rows[0],
          name: `${result.rows[0].first_name} ${result.rows[0].last_name}`
        };
      }
    } else if (type === 'institution') {
      result = await query(
        'SELECT id, email, password_hash, name, verification_status, is_active FROM institutions WHERE email = $1',
        [email]
      );
      user = result.rows[0];
    } else if (type === 'verifier') {
      result = await query(
        'SELECT id, email, password_hash, company_name, verification_status, is_active FROM verifiers WHERE email = $1',
        [email]
      );
      user = result.rows[0];
    } else {
      return res.status(400).json({
        success: false,
        message: 'Invalid user type'
      });
    }

    // Check if user exists
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Check if account is active
    if (!user.is_active) {
      return res.status(403).json({
        success: false,
        message: 'Your account has been deactivated. Please contact support.'
      });
    }

    // Verify password
    const isPasswordValid = await comparePassword(password, user.password_hash);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Update last login
    const tableName = type === 'user' ? 'users' : type === 'institution' ? 'institutions' : 'verifiers';
    await query(
      `UPDATE ${tableName} SET last_login = CURRENT_TIMESTAMP WHERE id = $1`,
      [user.id]
    );

    // Generate JWT token
    const token = generateAuthToken(user, type);

    // Remove password hash from response
    delete user.password_hash;

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: user.id,
          email: user.email,
          userType: type,
          ...(type === 'user' && {
            firstName: user.first_name,
            lastName: user.last_name,
            kycStatus: user.kyc_status
          }),
          ...(type === 'institution' && {
            name: user.name,
            verificationStatus: user.verification_status
          }),
          ...(type === 'verifier' && {
            companyName: user.company_name,
            verificationStatus: user.verification_status
          })
        },
        token
      }
    });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({
      success: false,
      message: 'Error during login',
      error: error.message
    });
  }
};

/**
 * Get current user profile
 */
export const getCurrentUser = async (req, res) => {
  try {
    const { id, userType } = req.user;

    let result;
    let tableName;
    let query_string;

    if (userType === 'user') {
      tableName = 'users';
      query_string = 'SELECT id, email, first_name, last_name, phone, date_of_birth, kyc_status, is_active, created_at FROM users WHERE id = $1';
    } else if (userType === 'institution') {
      tableName = 'institutions';
      query_string = 'SELECT id, email, name, type, registration_number, phone, website, verification_status, api_enabled, is_active, created_at FROM institutions WHERE id = $1';
    } else if (userType === 'verifier') {
      tableName = 'verifiers';
      query_string = 'SELECT id, email, company_name, industry, phone, website, verification_status, is_active, created_at FROM verifiers WHERE id = $1';
    }

    result = await query(query_string, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        user: result.rows[0],
        userType
      }
    });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching user profile',
      error: error.message
    });
  }
};

export default {
  registerUser,
  registerInstitution,
  registerVerifier,
  login,
  getCurrentUser
};
