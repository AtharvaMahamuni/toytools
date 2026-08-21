import type { ToolConfig } from '@data/types';

export const config: ToolConfig = {
  slug: 'encoding-detector',
  name: 'Encoding Detector',
  seoTitle: 'Encoding Detector: Identify Base64, Hex, URL or Binary',
  description: 'Find out what encoding this is. Identify a Base64, Base64URL, hex, URL-encoded, binary or punycode string, see what it decodes to, and spot double encoding.',
  tagline: 'Find out what a string is encoded with, and what it decodes to.',
  categorySlug: 'developer-utilities',
  tags: ['encoding detector', 'what encoding is this', 'identify base64 or hex', 'detect string encoding', 'is this base64url', 'decode unknown string', 'base64 or hex checker', 'double encoded string'],
  updatedAt: '2026-08-21',
  isNew: true,
  trustVariant: 'private',
  engine: 'encoding',
  pattern: 'encode-detect',
  family: 'detect',
  craft: {
    id: 'ed-chain',
    kind: 'continuation',
    solves:
      'A decode that succeeds and returns something that still looks like noise leaves you unable to tell whether the data is corrupt or merely wrapped twice. Values picked up from URLs and logs are routinely URL-encoded around Base64, and every decoder stops after one layer without saying that another one is there.',
  },
  relatedTools: ['base64-encoder-decoder', 'hex-encoder-decoder', 'url-encoder-decoder'],
  guide: {
    slug: 'identify-string-encoding',
    categorySlug: 'developer-utilities',
    title: 'How to Identify an Unknown String Encoding',
    description: 'Learn to tell Base64 from hex, spot the URL-safe alphabet, recognise a double-encoded value, and know when a string is not encoded at all.',
    readMinutes: 5,
    updatedAt: '2026-08-21',
  },
};
