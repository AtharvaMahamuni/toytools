// Source of truth for which tool slugs have a guide wired into the guide route.
//
// The actual `Guide.astro` components are imported in `src/pages/guide/[...slug].astro`
// (a .astro file — its component map is typed `Record<RegisteredGuideSlug, …>`, so TypeScript
// fails the build if this list and the component map ever drift apart). This module stays free of
// `.astro` imports so it can be imported by `scripts/validate-registry.ts` under tsx, which cannot
// parse Astro components. `validate-registry` checks every tool that declares `guide:` appears here.

export const registeredGuideSlugs = [
  'todo-list',
  'notepad',
  'keep-screen-awake',
  'base64-encoder-decoder',
  'url-encoder-decoder',
  'html-entity-encoder-decoder',
  'md5-hash-generator',
  'sha1-hash-generator',
  'sha256-hash-generator',
  'hex-encoder-decoder',
  'json-to-csv-converter',
  'json-formatter',
  'json-minifier',
  'json-validator',
  'percentage-calculator',
  'word-counter',
  'pomodoro-timer',
  'uppercase-converter',
  'lowercase-converter',
  'title-case-converter',
  'sentence-case-converter',
  'camel-case-converter',
  'snake-case-converter',
  'kebab-case-converter',
  'remove-extra-spaces',
  'remove-blank-lines',
  'remove-duplicate-lines',
  'trim-text',
  'normalize-whitespace',
  'remove-tabs',
  'character-counter',
  'reading-time-calculator',
  'sentence-counter',
  'paragraph-counter',
] as const;

export type RegisteredGuideSlug = (typeof registeredGuideSlugs)[number];

export const registeredGuideSlugSet: ReadonlySet<string> = new Set(registeredGuideSlugs);
