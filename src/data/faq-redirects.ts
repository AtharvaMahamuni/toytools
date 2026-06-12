// FAQ URL redirects — SEO migration shim.
//
// The standalone /faq/{segment}/{slug}/ pages were deprecated when FAQ content moved
// onto the tool pages (rendered in the #faq section with FAQPage JSON-LD). These
// mappings reproduce every previously-indexed FAQ URL so it serves a redirect stub
// (meta-refresh + canonical → tool page #faq) instead of a 404.
//
// `oldPath` is the historical URL path segment pair exactly as deployed — recovered
// from git history (note: four text-metric tools used 'text-utilities' rather than
// 'text'). Do not "fix" them; a redirect only helps at the URL that was indexed.

export interface FaqRedirect {
  /** Historical path under /faq/, e.g. 'text/word-counter'. */
  oldPath: string;
  /** Tool that now hosts the FAQ content in its #faq section. */
  toolSlug: string;
}

export const faqRedirects: FaqRedirect[] = [
  { oldPath: 'developer/base64-encoder-decoder',      toolSlug: 'base64-encoder-decoder' },
  { oldPath: 'developer/html-entity-encoder-decoder', toolSlug: 'html-entity-encoder-decoder' },
  { oldPath: 'developer/json-formatter',              toolSlug: 'json-formatter' },
  { oldPath: 'developer/json-minifier',               toolSlug: 'json-minifier' },
  { oldPath: 'developer/json-validator',              toolSlug: 'json-validator' },
  { oldPath: 'developer/md5-hash-generator',          toolSlug: 'md5-hash-generator' },
  { oldPath: 'developer/sha1-hash-generator',         toolSlug: 'sha1-hash-generator' },
  { oldPath: 'developer/sha256-hash-generator',       toolSlug: 'sha256-hash-generator' },
  { oldPath: 'developer/url-encoder-decoder',         toolSlug: 'url-encoder-decoder' },
  { oldPath: 'number/percentage-calculator',          toolSlug: 'percentage-calculator' },
  { oldPath: 'productivity/keep-screen-awake',        toolSlug: 'keep-screen-awake' },
  { oldPath: 'productivity/notepad',                  toolSlug: 'notepad' },
  { oldPath: 'productivity/pomodoro-timer',           toolSlug: 'pomodoro-timer' },
  { oldPath: 'productivity/todo-list',                toolSlug: 'todo-list' },
  { oldPath: 'text/camel-case-converter',             toolSlug: 'camel-case-converter' },
  { oldPath: 'text/kebab-case-converter',             toolSlug: 'kebab-case-converter' },
  { oldPath: 'text/lowercase-converter',              toolSlug: 'lowercase-converter' },
  { oldPath: 'text/normalize-whitespace',             toolSlug: 'normalize-whitespace' },
  { oldPath: 'text/remove-blank-lines',               toolSlug: 'remove-blank-lines' },
  { oldPath: 'text/remove-duplicate-lines',           toolSlug: 'remove-duplicate-lines' },
  { oldPath: 'text/remove-extra-spaces',              toolSlug: 'remove-extra-spaces' },
  { oldPath: 'text/remove-tabs',                      toolSlug: 'remove-tabs' },
  { oldPath: 'text/sentence-case-converter',          toolSlug: 'sentence-case-converter' },
  { oldPath: 'text/snake-case-converter',             toolSlug: 'snake-case-converter' },
  { oldPath: 'text/title-case-converter',             toolSlug: 'title-case-converter' },
  { oldPath: 'text/trim-text',                        toolSlug: 'trim-text' },
  { oldPath: 'text/uppercase-converter',              toolSlug: 'uppercase-converter' },
  { oldPath: 'text/word-counter',                     toolSlug: 'word-counter' },
  { oldPath: 'text-utilities/character-counter',      toolSlug: 'character-counter' },
  { oldPath: 'text-utilities/paragraph-counter',      toolSlug: 'paragraph-counter' },
  { oldPath: 'text-utilities/reading-time-calculator', toolSlug: 'reading-time-calculator' },
  { oldPath: 'text-utilities/sentence-counter',       toolSlug: 'sentence-counter' },
];
