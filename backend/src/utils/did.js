const DID_METHOD = 'did:polygon:mumbai';

export function generateCredentialDID(credentialId) {
  if (!credentialId) {
    throw new Error('credentialId is required to generate DID');
  }
  return `${DID_METHOD}:${credentialId}`;
}

export function parseCredentialDID(did) {
  if (!did || typeof did !== 'string') {
    return { isValid: false, error: 'DID is required' };
  }

  const match = did.match(/^did:polygon:mumbai:([a-f0-9-]{36})$/i);
  if (!match) {
    return {
      isValid: false,
      error: 'Invalid DID format. Expected did:polygon:mumbai:<credential-uuid>'
    };
  }

  return {
    isValid: true,
    method: 'polygon',
    network: 'mumbai',
    credentialId: match[1]
  };
}
