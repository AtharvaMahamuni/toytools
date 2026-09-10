import { KNOWLEDGE_SCHEMA_VERSION, type Knowledge } from '@lib/knowledge/types';

export const knowledge: Knowledge = {
  schemaVersion: KNOWLEDGE_SCHEMA_VERSION,
  slug: 'cidr-calculator',
  title: 'CIDR Calculator',
  category: 'developer-utilities',
  summary:
    'Turn an IPv4 CIDR or a dotted mask into the network, broadcast, usable range, subnet mask, and wildcard, including the /31 and /32 exceptions.',
  primaryConcepts: ['CIDR notation', 'subnet mask'],
  secondaryConcepts: [
    'wildcard mask',
    'broadcast address',
    'usable hosts',
    'RFC 3021',
    'network address',
    'prefix length',
  ],
  intentGroups: {
    informational: [
      'what CIDR notation is',
      'what a subnet mask does',
      'what a wildcard mask is',
    ],
    howTo: [
      'calculate a subnet from CIDR',
      'convert CIDR to IP range',
      'find the wildcard mask for an ACL',
    ],
    comparison: [
      'CIDR versus dotted subnet mask',
      '/31 versus /32 host counts',
    ],
    misconception: [
      'usable hosts is not always total minus two',
      'a host address in a CIDR is not the network',
    ],
    troubleshooting: [
      'why a /24 pasted as a host does not match a firewall range',
      'why a holey mask is rejected',
    ],
  },
  realWorldUseCases: [
    'Sizing an AWS VPC subnet before applying a Terraform plan.',
    'Writing a Cisco ACL and needing the wildcard that matches a prefix.',
    'Checking whether 192.168.1.50/24 is a host or the network in a security group.',
  ],
  commonMistakes: [
    'Pasting a host like 192.168.1.50/24 into a rule and treating it as the network.',
    'Subtracting two hosts from a /31 point-to-point link.',
    'Accepting a dotted mask with a hole in the bits as if it were a CIDR prefix.',
  ],
  commonQuestions: [
    'What is CIDR notation?',
    'How do I calculate a subnet from a CIDR?',
    'Why is a /31 or /32 different?',
    'What is a wildcard mask?',
  ],
  usedWith: [
    { slug: 'what-is-my-ip', reason: 'See the address this connection presents', strength: 0.7 },
    { slug: 'binary-converter', reason: 'Read the same address as binary', strength: 0.6 },
  ],
  alternatives: [],
  nextSteps: [
    { slug: 'hex-encoder-decoder', reason: 'Inspect a packet hex dump next to the prefix', strength: 0.45 },
    { slug: 'unix-timestamp-converter', reason: 'Stamp the change window for a cutover', strength: 0.4 },
  ],
  workflowStage: ['analyze'],
  keywords: [
    'cidr calculator',
    'subnet calculator',
    'cidr to ip range',
    'subnet mask calculator',
    'wildcard mask calculator',
    'network address calculator',
  ],
  entityAliases: ['subnet calculator', 'ip calculator', 'cidr subnet calculator', 'ip range calculator'],
};
