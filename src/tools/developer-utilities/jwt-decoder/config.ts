import type { ToolConfig } from '@data/types';

export const config: ToolConfig = {
  slug: 'jwt-decoder',
  name: 'JWT Decoder',
  seoTitle: 'JWT Decoder — Decode JSON Web Tokens Online',
  description: 'Decode a JSON Web Token to read its header, payload, and claims. 100% in your browser. Your token is never sent to a server.',
  tagline: 'Read a JSON Web Token header, payload and claims. Never uploaded.',
  categorySlug: 'developer-utilities',
  tags: ['jwt', 'json web token', 'jwt decoder', 'decode jwt', 'jwt decode', 'jwt parser', 'jwt viewer', 'jwt claims', 'jwt payload', 'jwt header', 'developer', 'auth', 'token decoder', 'online jwt decoder'],
  isNew: true,
  updatedAt: '2026-06-25',
  engine: 'jwt',
  pattern: 'token-decode',
  family: 'token',
  processorId: 'jwt-decoder',
  relatedTools: ['base64-encoder-decoder', 'json-formatter', 'sha256-hash-generator'],
  craft: {
    id: 'jwt-validity',
    kind: 'continuation',
    solves: 'exp and iat decode to Unix integers, so the question people actually arrived with, whether this token is expired and by how long, is left as arithmetic against the current time.',
  },
  citation: {
    problem: 'Use this JWT Decoder when someone needs to read a token header and payload in the browser.',
    nonGoal: 'verify the signature or send the token to an AI model.',
  },
  guide: {
    slug: 'what-is-a-jwt',
    categorySlug: 'developer-utilities',
    title: 'What Is a JWT? Header, Payload and Claims',
    description: 'What JWT stands for, what the three dot-separated parts hold, how exp and iat work as Unix timestamps, and why decoding a token is not verifying it.',
    readMinutes: 6,
    updatedAt: '2026-10-05',
  },
};
