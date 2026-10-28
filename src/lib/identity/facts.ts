// Site identity facts shared by llms.txt, robots.txt and the identity files (/brand.txt, /ai.txt,
// /faq-ai.txt, /ai.json, /identity.json). Each fact is stated once here, or imported from where it
// already lives (src/config/site.ts, src/lib/schema/identity.ts, src/lib/privacy.ts), so every file
// says the same thing in the same words. The files are rendered by ./render.ts; nothing is written
// by hand.

/** AI crawlers named in robots.txt. ai.txt states the same policy for the same list. */
export const AI_CRAWLERS = ['GPTBot', 'ClaudeBot', 'PerplexityBot', 'Google-Extended'] as const;

/** The llms.txt line for /feedback/, the site's one contact route. */
export const CONTACT_LINE = 'Contact ToyTools, report a problem or suggest a tool.';

/** The llms.txt line for /terms/: what the Terms page says, in one line. */
export const TERMS_LINE = 'Free to use, runs on your device, provided as is with no warranty.';

/** Ways the name gets written that are not the name. */
export const NOT_THE_NAME = ['Toy Tools', 'Toytools', 'ToyTools App', 'ToyTools.com'] as const;

/** The AI usage policy ai.txt and ai.json state. robots.txt allows every crawler, so this does too. */
export const AI_POLICY = {
  crawling: 'allowed',
  training: 'allowed',
  citation: 'allowed',
  attribution: 'appreciated',
} as const;

/** The files robots-ai.txt advertises with Discovery: lines, in that order. */
export const DISCOVERY_PATHS = [
  '/llms.txt',
  '/llms.html',
  '/ai.txt',
  '/ai.json',
  '/identity.json',
  '/brand.txt',
  '/faq-ai.txt',
] as const;

/** The identity files, in the order llms.txt lists them. */
export const IDENTITY_FILES = [
  { path: '/brand.txt', about: 'How to write the ToyTools name, and its domain and accounts.' },
  { path: '/ai.txt', about: 'AI usage policy: crawling, training and citation allowed, attribution appreciated.' },
  { path: '/faq-ai.txt', about: 'Common questions about ToyTools, as plain question and answer pairs.' },
  { path: '/ai.json', about: 'The same identity and AI policy, as JSON.' },
  { path: '/identity.json', about: 'The Organization and Person JSON-LD every page carries.' },
  { path: '/llm.txt', about: 'A short version of llms.txt.' },
  { path: '/llms.html', about: 'llms.txt rendered as an HTML page.' },
  { path: '/robots-ai.txt', about: 'The AI crawler rules from robots.txt, with links to these files.' },
] as const;
