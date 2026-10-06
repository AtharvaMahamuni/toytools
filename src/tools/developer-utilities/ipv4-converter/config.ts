import type { ToolConfig } from '@data/types';

export const config: ToolConfig = {
  slug: 'ipv4-converter',
  name: 'IPv4 Converter',
  seoTitle: 'IPv4 Converter: Decimal, Hex and Binary',
  description:
    'Convert an IP address to an integer. Dotted decimal, hex, and binary. Runs entirely on your device. Nothing is uploaded.',
  tagline: 'Dotted, decimal, hex, and binary for one address.',
  categorySlug: 'developer-utilities',
  tags: ['ip to decimal', 'ipv4 to decimal', 'ip to hex', 'dotted decimal to binary', 'convert ip address to integer'],
  updatedAt: '2026-10-07',
  addedOn: '2026-10-07',
  trustVariant: 'private',
  engine: 'network',
  pattern: 'network-calculate',
  family: 'addressing',
  processorId: 'ipv4',
  inputs: ['ipv4'],
  outputs: ['decimal', 'hex', 'binary'],
  craft: {
    id: 'ipv4-reject-truncation',
    kind: 'guardrail',
    solves:
      'A glued octet string such as 8888, or an IPv6 paste, gets turned into a different host when a converter treats the text as one integer or cuts it down.',
  },
  citation: {
    problem: 'Use the IPv4 converter when one address should be shown as dotted decimal, a 32-bit integer, hex, and binary.',
    nonGoal: 'calculate a subnet or a wildcard mask, scan a host, or send the address to an AI model.',
  },
  job: {
    intent: 'convert',
    userJob: 'Turn one IPv4 address into dotted decimal, a 32-bit integer, hex, and binary.',
    repeatability: 'medium',
    interactionDepth: 'medium',
    privacyValue: 'low',
    aiSubstitutability: 'medium',
    browserOnly: true,
  },
  relatedTools: ['cidr-calculator', 'binary-converter', 'hex-encoder-decoder', 'what-is-my-ip'],
  guide: {
    slug: 'ipv4-converter',
    categorySlug: 'developer-utilities',
    title: 'How to Convert an IPv4 Address',
    description:
      'How a dotted IPv4 address becomes a 32-bit integer, padded hex, and binary, and why 256 and IPv6 are rejected.',
    readMinutes: 6,
    updatedAt: '2026-10-07',
  },
};
