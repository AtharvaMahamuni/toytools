import { KNOWLEDGE_SCHEMA_VERSION, type Knowledge } from '@lib/knowledge/types';

export const knowledge: Knowledge = {
  schemaVersion: KNOWLEDGE_SCHEMA_VERSION,
  slug: 'punycode-converter',
  title: 'Punycode Converter',
  category: 'developer-utilities',
  summary: 'Convert domain names between Unicode and Punycode (xn--) form, the encoding behind IDNs.',
  primaryConcepts: ['punycode'],
  secondaryConcepts: ['internationalized domain name', 'idn', 'xn-- prefix', 'dns', 'unicode'],
  intentGroups: {
    informational: ['What is Punycode?', 'What does the xn-- prefix mean?'],
    howTo: ['How to convert a Unicode domain to Punycode', 'How to decode an xn-- domain'],
    comparison: ['Punycode vs URL encoding', 'Punycode vs UTF-8'],
    misconception: ['Punycode applies per label, not the whole URL', 'Punycode is not encryption or security'],
    troubleshooting: ['Why is only part of my domain encoded?', 'My xn-- string will not decode (invalid input)'],
  },
  realWorldUseCases: [
    'Registering or inspecting an internationalized domain name',
    'Reading the real target behind an xn-- domain in a link',
    'Spotting lookalike (homograph) domains used in phishing',
    'Debugging IDN handling in email, DNS, or TLS certificates',
  ],
  commonMistakes: [
    'Expecting Punycode to encode the whole URL rather than each domain label',
    'Treating Punycode as a way to hide or secure a domain',
  ],
  commonQuestions: [
    'What is the difference between Punycode and UTF-8?',
    'Is Punycode encryption?',
    'Why will my xn-- string not decode?',
  ],
  usedWith: [
    { slug: 'url-encoder-decoder', reason: 'Percent-encode the path while Punycode handles the host', strength: 0.7 },
    { slug: 'base64-encoder-decoder', reason: 'A different text-safe encoding for general data', strength: 0.4 },
  ],
  alternatives: [
    { slug: 'url-encoder-decoder', reason: 'For encoding URL paths and query strings, not the host' },
  ],
  nextSteps: [
    { slug: 'url-encoder-decoder', reason: 'Encode the rest of the URL after the domain', priority: 1 },
  ],
  workflowStage: ['transform'],
  keywords: ['punycode', 'idn converter', 'xn-- converter', 'unicode to punycode', 'punycode to unicode'],
  entityAliases: ['punycode', 'idn', 'xn--'],
  inputs: ['domain name'],
  outputs: ['punycode (xn--) or unicode domain'],
  difficulty: 'intermediate',
  audience: ['developers', 'domain owners', 'security analysts'],
};
