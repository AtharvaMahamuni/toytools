import { KNOWLEDGE_SCHEMA_VERSION, type Knowledge } from '@lib/knowledge/types';

export const knowledge: Knowledge = {
  schemaVersion: KNOWLEDGE_SCHEMA_VERSION,
  slug: 'what-is-my-ip',
  title: 'What Is My IP',
  category: 'developer-utilities',
  summary:
    'Show the public IPv4 and IPv6 this connection presents, name CGNAT and private ranges, and copy the family a form actually accepts.',
  primaryConcepts: ['public IP address', 'IPv4 and IPv6'],
  secondaryConcepts: ['CGNAT', 'RFC 6598', 'VPN egress', 'dual-stack', 'private IP ranges'],
  intentGroups: {
    informational: [
      'what is a public IP address',
      'what is CGNAT',
      'difference between IPv4 and IPv6',
    ],
    howTo: [
      'find my public IP',
      'copy my IPv4 address',
      'see my IPv6 address',
    ],
    comparison: [
      'IPv4 versus IPv6 on the same path',
      'public IP versus CGNAT',
    ],
    misconception: [
      'the IPv6 address is not a writing of the IPv4 address',
      'a 100.64 address is not a public IP you can whitelist',
    ],
    troubleshooting: [
      'why a whitelist of my IP still fails',
      'why a form rejects the address I copied',
    ],
  },
  realWorldUseCases: [
    'Pasting an IPv4 allowlist into a cloud security group.',
    'Checking whether a VPN is the egress a remote host actually sees.',
    'Confirming a home connection is dual-stack before filing an ISP ticket.',
  ],
  commonMistakes: [
    'Copying IPv6 into a v4-only form and blaming the lookup.',
    'Whitelisting a 100.64 CGNAT address as if the internet could dial it.',
    'Leaving a VPN on and treating that egress as the home router.',
  ],
  commonQuestions: [
    'What is my IP address?',
    'Why do I see both IPv4 and IPv6?',
    'Why is my IP in 100.64.x.x?',
    'Does a VPN change what this page shows?',
  ],
  usedWith: [
    { slug: 'cidr-calculator', reason: 'Plan a subnet around the address you just saw', strength: 0.7 },
  ],
  alternatives: [],
  nextSteps: [
    { slug: 'binary-converter', reason: 'Read the same IPv4 address as binary', strength: 0.5 },
    { slug: 'hex-encoder-decoder', reason: 'Inspect a packet dump next to the address', strength: 0.4 },
  ],
  workflowStage: ['analyze'],
  keywords: [
    'what is my ip',
    'what is my ip address',
    'public ip address',
    'my ipv4',
    'my ipv6',
    'cgnat',
  ],
  entityAliases: ['whats my ip', 'show my ip', 'my ip address'],
};
