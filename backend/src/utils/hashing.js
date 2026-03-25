import crypto from 'crypto';

function canonicalize(value) {
  if (Array.isArray(value)) {
    return value.map(canonicalize);
  }

  if (value && typeof value === 'object') {
    return Object.keys(value)
      .sort()
      .reduce((acc, key) => {
        const item = value[key];
        if (item !== undefined) {
          acc[key] = canonicalize(item);
        }
        return acc;
      }, {});
  }

  return value;
}

export function canonicalizeCredentialData(data) {
  return JSON.stringify(canonicalize(data));
}

export function hashCredentialData(data) {
  const payload = canonicalizeCredentialData(data);
  return crypto.createHash('sha256').update(payload).digest('hex');
}

export function toBytes32Hash(hashValue) {
  const clean = (hashValue || '').toLowerCase().replace(/^0x/, '');
  if (!/^[a-f0-9]{64}$/.test(clean)) {
    throw new Error('Invalid SHA-256 hash format. Expected 64 hex characters.');
  }
  return `0x${clean}`;
}
