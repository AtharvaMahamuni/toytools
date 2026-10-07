import { KNOWLEDGE_SCHEMA_VERSION, type Knowledge } from '@lib/knowledge/types';

export const knowledge: Knowledge = {
  schemaVersion: KNOWLEDGE_SCHEMA_VERSION,
  slug: 'ipv4-converter',
  title: 'IPv4 Converter',
  category: 'developer-utilities',
  summary: 'Turn one IPv4 address into dotted decimal, a 32-bit integer, padded hex, and binary.',
  primaryConcepts: ['ip to decimal'],
  secondaryConcepts: ['ipv4 to decimal', 'ip to hex', 'dotted decimal to binary', 'IPv4-mapped IPv6'],
  intentGroups: {
    informational: [
      'how a dotted IPv4 address becomes a 32-bit integer',
      'why hex from a packet capture keeps leading zeros',
      'what an IPv4-mapped IPv6 address contains',
    ],
    howTo: [
      'convert ip address to integer',
      'turn 192.168.0.1 into hex and binary',
      'reject an octet above 255',
    ],
    comparison: [
      'dotted decimal versus a 32-bit integer',
      'an IPv4 address versus an IPv6 address',
    ],
    misconception: [
      '19216811 is the integer form of 192.168.1.1',
      'an IPv6 address can be cut down to IPv4',
    ],
    troubleshooting: [
      'why 8888 offers 8.8.8.8',
      'why ::ffff:192.0.2.1 does not show a truncated result',
    ],
  },
  realWorldUseCases: [
    'Matching a firewall log integer to the dotted address an operator expects.',
    'Copying an eight-digit hex form that lines up with a packet capture.',
    'Refusing 256 in an octet instead of wrapping it into a different host.',
  ],
  commonMistakes: [
    'Gluing the four octets into one integer and trusting the host that comes back.',
    'Pasting an IPv6 address and reading a leftover fragment as IPv4.',
    'Dropping the leading zeros in hex, so 10.0.0.1 no longer matches 0x0A000001.',
  ],
  commonQuestions: [
    'How do I convert an IP address to an integer?',
    'What is the hex form of 192.168.0.1?',
    'Why is 256 rejected?',
    'What happens if I paste an IPv6 address?',
  ],
  usedWith: [
    { slug: 'cidr-calculator', reason: 'Take the dotted address onward into a subnet, mask, and wildcard', strength: 0.8 },
  ],
  alternatives: [],
  nextSteps: [
    { slug: 'binary-converter', reason: 'Read a number as binary outside an IPv4 address', strength: 0.4 },
    { slug: 'hex-encoder-decoder', reason: 'Encode text as hex when the value is not an address', strength: 0.3 },
  ],
  workflowStage: ['transform'],
  keywords: [
    'ip to decimal',
    'ipv4 to decimal',
    'ip to hex',
    'dotted decimal to binary',
    'convert ip address to integer',
  ],
  entityAliases: ['IPv4 to integer', 'dotted decimal converter'],
  inputs: ['ipv4'],
  outputs: ['decimal', 'hex', 'binary'],
  difficulty: 'beginner',
  audience: ['developers', 'network operators'],
};
