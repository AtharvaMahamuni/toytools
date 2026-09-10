import type { ToolConfig } from '@data/types';

export const config: ToolConfig = {
  slug: 'what-is-my-ip',
  name: 'What Is My IP',
  seoTitle: 'Whats My IP: Public IPv4 and IPv6 Address',
  description:
    'Whats my ip, show my ip: public IPv4 and IPv6 for this connection. Copy the family you need. CGNAT ranges are named. Nothing is stored here.',
  tagline: 'See the public IPv4 and IPv6 this connection presents.',
  categorySlug: 'developer-utilities',
  tags: ['public ip address', 'whats my ip', 'show my ip', 'ipv4', 'ipv6'],
  updatedAt: '2026-09-10',
  isNew: true,
  trustVariant: 'lookup',
  engine: 'network',
  pattern: 'network-lookup',
  family: 'identity',
  craft: {
    id: 'ip-family',
    kind: 'orientation',
    solves:
      'People copy the IPv6 address into a v4-only form, or treat a 100.64 CGNAT address as a public IP they can whitelist, and both mistakes look like the lookup was wrong.',
  },
  relatedTools: ['cidr-calculator', 'binary-converter', 'hex-encoder-decoder'],
  keywords: ['cgnat'],
  inputs: [],
  outputs: ['ipv4', 'ipv6'],
  guide: {
    slug: 'what-is-my-ip',
    categorySlug: 'developer-utilities',
    title: 'What Is My IP Address: Public, Private and CGNAT',
    description:
      'How a public IP lookup works, why IPv4 and IPv6 can both show up, and how a CGNAT address is not something the internet can dial back.',
    readMinutes: 5,
    updatedAt: '2026-09-10',
  },
};
