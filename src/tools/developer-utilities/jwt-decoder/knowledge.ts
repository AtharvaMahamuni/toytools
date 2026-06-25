import { KNOWLEDGE_SCHEMA_VERSION, type Knowledge } from '@lib/knowledge/types';

export const knowledge: Knowledge = {
  schemaVersion: KNOWLEDGE_SCHEMA_VERSION,
  slug: 'jwt-decoder',
  title: 'JWT Decoder',
  category: 'developer-utilities',
  summary: 'Decode a JSON Web Token to read its header, payload, and claims locally. Decoding is not verification.',
  primaryConcepts: ['jwt'],
  secondaryConcepts: ['json web token', 'base64url', 'claims', 'authentication', 'bearer token'],
  intentGroups: {
    informational: ['What is a JWT?', 'What is inside a JWT payload?'],
    howTo: ['How to decode a JWT', 'How to read the exp and iat claims'],
    comparison: ['Decoding vs verifying a JWT', 'JWT vs JWE'],
    misconception: ['A JWT is not encrypted', 'Decoding is not authentication'],
    troubleshooting: ['JWT fails to decode', 'Invalid Base64URL segment'],
  },
  realWorldUseCases: [
    'Inspecting the claims in an auth token while debugging a login flow',
    'Checking whether an access token has expired',
    'Reading the issuer and audience of a token from a third-party API',
    'Confirming which algorithm a token was signed with',
  ],
  commonMistakes: [
    'Believing a JWT payload is encrypted or private',
    'Treating a successful decode as proof the token is valid',
    'Storing passwords or secrets inside the payload',
  ],
  commonQuestions: [
    'Is it safe to paste a JWT into an online decoder?',
    'Does decoding verify the signature?',
    'What do exp, iat, and nbf mean?',
  ],
  usedWith: [
    { slug: 'base64-encoder-decoder', reason: 'JWT segments are Base64URL encoded', strength: 0.8 },
    { slug: 'json-formatter', reason: 'Format the decoded payload JSON', strength: 0.7 },
  ],
  alternatives: [
    { slug: 'base64-encoder-decoder', reason: 'Manually decode a single token segment' },
  ],
  nextSteps: [
    { slug: 'sha256-hash-generator', reason: 'Explore the hashing behind HMAC signatures', priority: 1 },
  ],
  workflowStage: ['analyze'],
  keywords: ['jwt decoder', 'decode jwt', 'json web token', 'jwt payload', 'jwt claims', 'jwt parser'],
  entityAliases: ['json web token', 'jwt token', 'bearer token'],
};
