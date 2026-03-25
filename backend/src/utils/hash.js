import crypto from 'crypto';

/**
 * Calculate a consistent, deterministic SHA-256 hash
 * Uses sorted keys to ensure same data always produces same hash
 * regardless of property order
 */
export const calculateCredentialHash = (credentialData) => {
  // Ensure we're working with an object
  let data = credentialData;
  if (typeof credentialData === 'string') {
    try {
      data = JSON.parse(credentialData);
    } catch (e) {
      // If it's not valid JSON, use it as-is
      data = credentialData;
    }
  }

  // Create a deterministic JSON string with sorted keys
  const sortedJson = JSON.stringify(data, (key, value) => {
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      return Object.keys(value)
        .sort()
        .reduce((result, key) => {
          result[key] = value[key];
          return result;
        }, {});
    }
    return value;
  });

  // Calculate SHA-256 hash
  return crypto.createHash('sha256').update(sortedJson).digest('hex');
};
