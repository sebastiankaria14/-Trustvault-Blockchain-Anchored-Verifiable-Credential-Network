export const REQUIRED_DOCUMENT_TYPES = {
  user: [
    'identity_document',
    'address_proof',
    'selfie_photo'
  ],
  institution: [
    'registration_certificate',
    'tax_certificate',
    'authorized_signatory_id'
  ],
  verifier: [
    'company_registration',
    'compliance_certificate',
    'authorized_representative_id'
  ]
};

export const OPTIONAL_DOCUMENT_TYPES = {
  user: ['other'],
  institution: ['other'],
  verifier: ['other']
};

export const getAllowedDocumentTypes = (entityType) => {
  const required = REQUIRED_DOCUMENT_TYPES[entityType] || [];
  const optional = OPTIONAL_DOCUMENT_TYPES[entityType] || [];
  return [...required, ...optional];
};

export const getRequiredDocumentTypes = (entityType) =>
  REQUIRED_DOCUMENT_TYPES[entityType] || [];
