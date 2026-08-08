import type { ToolConfig } from '@data/types';

export const config: ToolConfig = {
  slug: 'qr-code-generator',
  name: 'QR Code Generator',
  seoTitle: 'QR Code Generator — Text, URL, Wi-Fi & vCard',
  description:
    'Create QR codes in your browser from text, a URL, an email, a phone number, Wi-Fi credentials, or a contact card. Download PNG or SVG. Nothing is uploaded.',
  tagline: 'QR codes for a URL, Wi-Fi, contact or plain text. PNG or SVG.',
  categorySlug: 'generate',
  tags: [
    'qr code generator',
    'qr code',
    'wifi qr code',
    'vcard qr code',
    'url qr code',
    'qr code download',
  ],
  isNew: true,
  updatedAt: '2026-07-09',
  trustVariant: 'private',
  engine: 'generation',
  pattern: 'generate-code',
  family: 'code',
  processorId: 'qr-code',
  relatedTools: ['password-generator', 'uuid-generator'],
  keywords: ['qr', 'code', 'wifi', 'vcard', 'url', 'png', 'svg', 'download'],
  inputs: ['options'],
  outputs: ['image'],
  guide: {
    slug: 'qr-code-generator',
    categorySlug: 'generate',
    title: 'How to Create a QR Code',
    description:
      'What QR codes are, how error correction works, and how to make QR codes for text, URLs, Wi-Fi, and contacts in the browser.',
    readMinutes: 9,
    updatedAt: 'Jul 2026',
  },
};
