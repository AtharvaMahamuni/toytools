import type { ToolConfig } from '@data/types';

export const config: ToolConfig = {
  slug: 'cidr-calculator',
  name: 'CIDR Calculator',
  seoTitle: 'CIDR Calculator: Subnet, Wildcard and Network Address',
  description:
    'CIDR and subnet calculator for IPv4. Paste 192.168.1.0/24 to get the network, broadcast, usable ip range, mask, and wildcard. /31 and /32 follow RFC 3021.',
  tagline: 'Paste a CIDR. Get the network, range and wildcard.',
  categorySlug: 'developer-utilities',
  tags: ['subnet calculator', 'cidr to ip range', 'wildcard mask', 'network address', 'cidr notation'],
  updatedAt: '2026-09-10',
  isNew: true,
  trustVariant: 'private',
  engine: 'network',
  pattern: 'network-calculate',
  family: 'addressing',
  processorId: 'cidr',
  craft: {
    id: 'cidr-network',
    kind: 'recovery',
    solves:
      'People paste a host like 192.168.1.50/24 into a firewall rule and treat that host as the network, so the rule matches one address instead of the subnet they meant.',
  },
  relatedTools: ['what-is-my-ip', 'binary-converter', 'hex-encoder-decoder', 'unix-timestamp-converter'],
  keywords: ['subnet mask'],
  inputs: ['cidr', 'ipv4', 'subnet mask'],
  outputs: ['network', 'broadcast', 'usable range', 'wildcard'],
  guide: {
    slug: 'cidr-calculator',
    categorySlug: 'developer-utilities',
    title: 'How CIDR Notation and Subnet Masks Work',
    description:
      'What CIDR notation means, how a subnet mask carves a network from an IPv4 address, and why /31 and /32 do not use the minus-two host rule.',
    readMinutes: 6,
    updatedAt: '2026-09-10',
  },
};
