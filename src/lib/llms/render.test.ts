import { describe, expect, it } from 'vitest';
import {
  CATEGORY_SUMMARY_TERMS,
  CORE_TOOL_SLUGS,
  PREP_HIGHLIGHT_SLUGS,
  categorySummaryTerms,
  doesNotLine,
  highlightLines,
  llmsTxtForSite,
  renderDetail,
  renderLlmsFull,
  renderLlmsTxt,
  renderSummary,
  simulationSubjects,
} from './render';
import { tools } from '@data/registry';
import type { Tool } from '@data/types';
import { allToolFacts } from './facts';
import { categories as allCategories } from '@data/categories';
import { PRIVACY_LINE } from '@lib/privacy';
import type { ContentEntry } from '@lib/content/manifest';
import { readFileSync } from 'node:fs';
import { init, parse } from 'es-module-lexer';
import { join } from 'node:path';

const SITE = 'https://toytoolsapp.com/';

const categories: ContentEntry[] = [
  { type: 'category', slug: 'text-utilities', url: '/category/text-utilities/', categorySlug: 'text-utilities', priority: 0.8, changefreq: 'weekly' },
];
const platform: ContentEntry = { type: 'page', slug: 'platform', url: '/platform/', priority: 0.5, changefreq: 'monthly' };
const feedback: ContentEntry = { type: 'page', slug: 'feedback', url: '/feedback/', priority: 0.6, changefreq: 'monthly' };

describe('renderLlmsTxt', () => {
  const txt = renderLlmsTxt(categories, feedback, SITE, platform);

  it('opens with the site name and the canonical privacy line', () => {
    expect(txt.startsWith('# ToyTools\n')).toBe(true);
    expect(txt).toContain(PRIVACY_LINE);
  });

  it('lists every core tool as an absolute URL that exists in the registry', () => {
    expect(CORE_TOOL_SLUGS).toHaveLength(25);
    const known = new Set(tools.map(t => t.slug));
    for (const slug of CORE_TOOL_SLUGS) {
      expect(known.has(slug), slug).toBe(true);
      expect(txt).toContain(`/${slug}/`);
      expect(txt).toContain('https://toytoolsapp.com/tool/');
    }
  });

  it('puts Core tools above Categories', () => {
    const coreAt = txt.indexOf('## Core tools');
    const catsAt = txt.indexOf('## Categories');
    expect(coreAt).toBeGreaterThan(0);
    expect(catsAt).toBeGreaterThan(coreAt);
  });

  it('lists Prep highlight tools between Core and Categories', () => {
    const coreAt = txt.indexOf('## Core tools');
    const prepAt = txt.indexOf('## Prep tools');
    const catsAt = txt.indexOf('## Categories');
    expect(prepAt).toBeGreaterThan(coreAt);
    expect(catsAt).toBeGreaterThan(prepAt);
    expect(txt).toContain('prepare text before a model');
    expect(txt).toContain('ToyTools does not run a model');
    expect(PREP_HIGHLIGHT_SLUGS).toHaveLength(3);
    const known = new Set(tools.map(t => t.slug));
    for (const slug of PREP_HIGHLIGHT_SLUGS) {
      expect(known.has(slug), slug).toBe(true);
      expect(txt).toContain(`/${slug}/`);
    }
  });

  it('mentions prep in the summary blockquote', () => {
    const summary = txt.split('\n').find(line => line.startsWith('> '));
    expect(summary).toBeTruthy();
    expect(summary!.toLowerCase()).toContain('prep');
    expect(summary).toContain('does not run a model');
  });

  it('still lists categories and the platform page', () => {
    expect(txt).toContain('/category/text-utilities/');
    expect(txt).toContain('/platform/');
    expect(txt).toContain('/feedback/');
  });

  it('points at the full inventory without inlining it', () => {
    expect(txt).toContain('https://toytoolsapp.com/llms-full.txt');
    expect(txt.indexOf('llms-full.txt')).toBeLessThan(txt.indexOf('## Core tools'));
  });
});

// The llms files rule (CLAUDE.md, "LLM files"): the curated prose must not drift from the catalog.
// Before beta-v12.1.1 the summary named 8 subjects and skipped 7 categories.
describe('SUMMARY names every category', () => {
  const summary = renderSummary().toLowerCase();

  it('has exactly one term per category in categories.ts, no strays', () => {
    expect(Object.keys(CATEGORY_SUMMARY_TERMS).sort()).toEqual(allCategories.map(c => c.slug).sort());
    const terms = Object.values(CATEGORY_SUMMARY_TERMS);
    expect(new Set(terms).size).toBe(terms.length);
  });

  it.each(allCategories.map(c => [c.slug, c] as const))('mentions %s', (_slug, category) => {
    const term = CATEGORY_SUMMARY_TERMS[category.slug]!;
    expect(summary).toContain(term);
    // The term has to be recognisably that category, not any word: its first word shares a stem
    // with the category's slug, name or URL segment.
    const stem = term.split(' ')[0]!.slice(0, 4);
    expect(`${category.slug} ${category.name} ${category.segment}`.toLowerCase()).toContain(stem);
  });

  it('names the seven categories the hand-written summary left out', () => {
    for (const term of ['physics', 'chemistry', 'applied math', 'music', 'fidgets', 'generators', 'productivity']) {
      expect(summary).toContain(term);
    }
  });

  it('is the blockquote llms.txt actually prints', () => {
    const txt = renderLlmsTxt([], undefined, SITE);
    expect(txt).toContain(`> ${renderSummary()}\n`);
    expect(txt).toContain(renderDetail());
  });

  it('fails the build when a category has no summary term', () => {
    expect(() => categorySummaryTerms([{ slug: 'text-utilities' }, { slug: 'brand-new' }])).toThrow(
      /no term for category brand-new/,
    );
    expect(() => renderSummary([{ slug: 'a-new' }, { slug: 'b-new' }])).toThrow(/categories a-new, b-new/);
  });

  it('joins one, two and many terms readably', () => {
    expect(renderSummary([{ slug: 'prep' }])).toContain('tools for prep.');
    expect(renderSummary([{ slug: 'text-utilities' }, { slug: 'prep' }])).toContain('tools for text and prep.');
    expect(renderSummary()).toContain(', fidgets, and prep.');
  });

  it('uses no em dash', () => {
    expect(renderSummary()).not.toContain('\u2014');
    expect(renderDetail()).not.toContain('\u2014');
  });
});

describe('DETAIL names every simulation subject', () => {
  it('derives the subjects from the categories that hold a simulation', () => {
    const withSims = new Set(tools.filter(t => t.pattern === 'simulate').map(t => t.categorySlug));
    expect(withSims.size).toBeGreaterThanOrEqual(3);
    const subjects = simulationSubjects();
    expect(subjects).toHaveLength(withSims.size);
    for (const subject of subjects) expect(renderDetail()).toContain(subject);
    expect(renderDetail()).toContain('chemistry');
  });

  it('follows the catalog it is given', () => {
    expect(simulationSubjects([{ categorySlug: 'physics', pattern: 'simulate' }])).toEqual(['physics']);
    expect(simulationSubjects([{ categorySlug: 'physics', pattern: 'text-metric' }])).toEqual([]);
  });
});

describe('renderLlmsFull', () => {
  const full = renderLlmsFull(SITE);

  it('lists every published tool once, with an absolute tool URL', () => {
    const urls = [...full.matchAll(/^URL: (\S+)$/gm)].map(m => m[1]);
    expect(urls).toHaveLength(tools.length);
    expect(new Set(urls).size).toBe(tools.length);
    for (const tool of tools) {
      expect(urls.some(url => url.endsWith(`/${tool.slug}/`)), tool.slug).toBe(true);
      expect(full).toContain(`## ${tool.name}`);
    }
    expect(urls.every(url => url.startsWith('https://toytoolsapp.com/tool/'))).toBe(true);
  });

  it('states privacy and a non-goal on every block', () => {
    const blocks = full.split(/\n(?=## )/).filter(block => block.startsWith('## '));
    expect(blocks.length).toBe(tools.length);
    for (const block of blocks) {
      expect(block).toMatch(/^Use for: \S/m);
      expect(block).toMatch(/^Privacy: \S/m);
      expect(block).toMatch(/^Does not: \S/m);
    }
    expect(full).toContain(PRIVACY_LINE);
  });

  it('uses a lookup tool\'s real privacy claim', () => {
    const ip = full.split(/\n(?=## )/).find(block => block.includes('/what-is-my-ip/'));
    expect(ip).toBeTruthy();
    expect(ip).toContain('IP echo');
    expect(ip).not.toContain('Nothing is uploaded');
  });

  it('capitalises a citation non-goal', () => {
    expect(doesNotLine(undefined)).toBe('Call an AI model.');
    expect(doesNotLine('verify the signature.')).toBe('Verify the signature.');
  });
});

describe('the llms files on another site', () => {
  const OTHER = 'https://example.test/';

  it.each([
    ['llms-full.txt', () => renderLlmsFull(OTHER)],
    ['llms.txt', () => llmsTxtForSite(OTHER)],
  ])('%s puts every URL on the site it is given', (_name, render) => {
    const text = render();
    const urls = [...text.matchAll(/https?:\/\/[^\s)\]>]+/g)].map(m => m[0]);
    expect(urls.filter(u => u.includes('/tool/')).length).toBeGreaterThan(20);
    expect(urls.filter(u => !u.startsWith(OTHER))).toEqual([]);
    expect(text).not.toContain('toytoolsapp.com/tool/');
  });

  it('llms-full.txt links every tool on that site', () => {
    const full = renderLlmsFull(OTHER);
    for (const tool of tools) expect(full).toMatch(new RegExp(`^URL: https://example\\.test/tool/[a-z-]+/${tool.slug}/$`, 'm'));
  });
});

describe('renderLlmsFull catalog', () => {
  it('renders only the catalog it is given', () => {
    const fixture: Tool = { slug: 'x-tool', name: 'X Tool', description: 'Does x. Then y.', categorySlug: 'text-utilities', tags: [] };
    const full = renderLlmsFull(SITE, [fixture]);
    expect(full).toContain('X Tool');
    expect(full).toContain('https://toytoolsapp.com/tool/text/x-tool/');
    for (const tool of tools) expect(full).not.toContain(`/${tool.slug}/`);
    expect(renderLlmsFull(SITE)).toContain(`/${tools[0]!.slug}/`);
  });
});

describe('highlightLines', () => {
  it('fails loudly on a highlighted slug that is not in the registry', () => {
    expect(() => highlightLines(['no-such-tool'], allToolFacts(SITE), 'core')).toThrow(
      'llms.txt core tools missing from the registry: no-such-tool',
    );
  });
});

// The llms files read a tool only through toolFacts() (src/lib/llms/facts.ts), so every surface
// states the same facts. The renderer may not reach around it to the raw per-tool sources, so its
// imports are an allowlist of modules and, where a module could hand over per-tool data, of names.
// This is a static lint on the raw source of render.ts. es-module-lexer finds the imports and
// re-exports written in normal syntax, so a comment or an odd quote inside one does not hide it. A
// dynamic import(), import.meta (import.meta.glob), require() or createRequire written out in the
// source is reported. Each occurrence of the name contentByType, or of an alias given to it in its
// import, spelled out in the source, must be a call whose argument is the literal 'page' or
// 'category'. The lint catches normal imports, re-exports and uses of the forbidden names. It is
// not proof against deliberately obfuscated code, such as TypeScript syntax that makes the lexer
// read an import as a regex, or identifier escapes (contentBy\u0054ype). Checking the
// esbuild-transformed output is a tracked follow-up.
const RENDER_IMPORTS: Readonly<Record<string, readonly string[] | null>> = {
  '@lib/content/manifest': ['contentByType', 'ContentEntry'],
  '@lib/sitemap/render': ['absoluteUrl'],
  '@data/categories': null,
  '@data/types': null,
  '@lib/paths': ['withBase'],
  '@lib/privacy': ['PRIVACY_LINE'],
  './facts': null,
};
/** The content manifest also lists every tool and guide; the renderer may ask it only for these. */
const MANIFEST_TYPES = ['page', 'category'];
/** Any call that builds a tool, category or guide URL, or a tool's privacy line. */
const BUILDS_URL_OR_PRIVACY = /\b(?:toolRoute|toolPath|urlFor|canonicalFor|guideRoute|guidePath|privacyStatement)\s*\(/;

await init;

interface ImportOf {
  /** The module specifier; a description in angle brackets when it is not a plain static import. */
  specifier: string;
  /** Each name taken, as `imported` (checked) and `local` (what the source calls it); '*' for a namespace. */
  names: Array<{ imported: string; local: string }>;
  /** Where the statement sits in the source, so the rest of the source can be read without it. */
  start: number;
  end: number;
}

/** The modules a source imports or re-exports, statically or dynamically, as es-module-lexer reports them. */
function importsOf(source: string): ImportOf[] {
  const [imports] = parse(source);
  return imports.map(i => {
    const at = { start: i.ss, end: i.se };
    if (i.d === -2) return { specifier: '<import.meta>', names: [], ...at };
    if (i.d > -1) return { specifier: `<dynamic import(${source.slice(i.s, i.e)})>`, names: [], ...at };
    // The clause is everything before the quoted specifier. Comments go first, so none can hide or
    // fake a name; the specifier itself is the lexer's.
    const clause = source
      .slice(i.ss, i.s - 1)
      .replace(/\/\*[\s\S]*?\*\//g, ' ')
      .replace(/\/\/[^\n]*/g, ' ')
      .replace(/^\s*(?:import|export)\s+(?:type\s+)?/, '')
      .replace(/\s*from\s*$/, '');
    const names: ImportOf['names'] = [];
    const braces = /\{([^}]*)\}/.exec(clause);
    for (const part of braces ? braces[1]!.split(',') : []) {
      const [imported, local] = part.trim().replace(/^type\s+/, '').split(/\s+as\s+/).map(x => x.trim());
      if (imported) names.push({ imported, local: local ?? imported });
    }
    const rest = clause.replace(/\{[^}]*\}/, '');
    const star = /\*(?:\s*as\s+([\w$]+))?/.exec(rest);
    if (star) names.push({ imported: '*', local: star[1] ?? '*' });
    const def = /^\s*([A-Za-z_$][\w$]*)\s*(?:,|$)/.exec(rest.replace(/\*(?:\s*as\s+[\w$]+)?/, ''));
    if (def) names.push({ imported: 'default', local: def[1]! });
    return { specifier: i.n ?? '<unnamed>', names, ...at };
  });
}

/** What the lint reports in a render.ts source: an import off the allowlist, or a forbidden name or call written out. */
function renderGuardViolations(source: string): string[] {
  const problems: string[] = [];
  const imports = importsOf(source);
  const manifestCalls = new Set(['contentByType']);
  for (const { specifier, names } of imports) {
    if (!(specifier in RENDER_IMPORTS)) {
      problems.push(`imports ${specifier}`);
      continue;
    }
    const allowed = RENDER_IMPORTS[specifier];
    if (allowed) for (const { imported } of names) if (!allowed.includes(imported)) problems.push(`takes ${imported} from ${specifier}`);
    if (specifier === '@lib/content/manifest') {
      for (const { imported, local } of names) if (imported === 'contentByType') manifestCalls.add(local);
    }
  }
  // The source with its import statements blanked, so only the code that uses the names is read.
  let body = source;
  for (const { start, end } of imports) body = body.slice(0, start) + ' '.repeat(end - start) + body.slice(end);
  for (const name of manifestCalls) {
    const uses = body.match(new RegExp(`(?<![\\w$.])${name.replace(/\$/g, '\\$')}(?![\\w$])`, 'g'))?.length ?? 0;
    const pattern = `(?<![\\w$.])${name.replace(/\$/g, '\\$')}\\s*\\(\\s*(['"])(?:${MANIFEST_TYPES.join('|')})\\1\\s*\\)`;
    const allowedCalls = body.match(new RegExp(pattern, 'g'))?.length ?? 0;
    if (uses !== allowedCalls) problems.push(`uses ${name} other than as ${name}('page') or ${name}('category')`);
  }
  if (/\bbuildContentManifest\b/.test(source)) problems.push('references buildContentManifest');
  if (/\brequire\s*\(/.test(source)) problems.push('calls require()');
  if (/\bcreateRequire\b/.test(source)) problems.push('uses createRequire');
  const call = BUILDS_URL_OR_PRIVACY.exec(source);
  if (call) problems.push(`calls ${call[0].replace(/\s*\($/, '')}`);
  if (/\.(?:citation|trustVariant)\b/.test(source)) problems.push('reads a raw tool field');
  return problems;
}

describe('render.ts reads tools only through toolFacts', () => {
  const source = readFileSync(join(__dirname, 'render.ts'), 'utf8');

  it('imports exactly the allowlisted modules, each only for its allowed names', () => {
    expect(new Set(importsOf(source).map(i => i.specifier))).toEqual(new Set(Object.keys(RENDER_IMPORTS)));
    expect(renderGuardViolations(source)).toEqual([]);
  });

  it('asks the content manifest only for pages and categories', () => {
    expect(source.match(/\bcontentByType\s*\(\s*'(?:page|category)'\s*\)/g)?.length).toBeGreaterThan(0);
  });

  // The reviews' bypasses of earlier versions of this guard, plus the other shapes it must refuse.
  it.each([
    ['a relative path to the registry', "import { tools } from '../../data/registry';"],
    ['a double-quoted registry import', 'import { tools } from "@data/registry";'],
    ['the generated registry', "import { toolConfigs } from '@data/registry.generated';"],
    ['a local module that re-exports the registry', "import { tools } from './raw';"],
    ['an export-from of the registry', "export { tools } from '@data/registry';"],
    ['an export-star of the registry', "export * from '@data/registry';"],
    ['a dynamic import', "const { tools } = await import('@data/registry');"],
    ['a dynamic import of an allowed module', "const { withBase } = await import('@lib/paths');"],
    ['a dynamic import of a computed path', 'const m = await import(`@data/${name}`);'],
    ['a side-effect import', "import '@data/registry';"],
    ['a block comment before the specifier', "import { tools } from /* raw */ '@data/registry';"],
    ['a quote in a comment inside the braces', "import { tools /* the registry's list */ } from '@data/registry';"],
    ['a semicolon in a comment in the clause', "import /* ; */ { tools } from '@data/registry';"],
    ['a line comment before the specifier', "import { tools } from // raw\n  '@data/registry';"],
    ['import.meta.glob', "const { tools } = Object.values(import.meta.glob<{ tools: Tool[] }>('../../data/registry.ts', { eager: true }))[0]!;"],
    ['require()', "const { tools } = require('@data/registry');"],
    ['createRequire', "import { createRequire } from 'node:module';\nconst load = createRequire(import.meta.url);"],
    ['another name from @lib/paths', "import { withBase, toolPath } from '@lib/paths';"],
    ['a name hidden in a comment-split clause', "import { withBase, /* x */ toolRoute } from '@lib/paths';"],
    ['a namespace import of @lib/privacy', "import * as P from '@lib/privacy';"],
    ['another name from the content manifest', "import { contentByType, buildContentManifest } from '@lib/content/manifest';"],
    ['another name from @lib/sitemap/render', "import { absoluteUrl, renderSitemap } from '@lib/sitemap/render';"],
    ['the manifest asked for tools', "const u = contentByType('tool').find(e => e.slug === f.slug)!.url;"],
    ['the manifest asked for guides', "const g = contentByType('guide');"],
    ['the manifest asked through an alias', "import { contentByType as entries } from '@lib/content/manifest';\nconst t = entries('tool');"],
    ['the manifest asked with a variable', "const kind = 'tool';\nconst t = contentByType(kind);"],
    ['the manifest passed around', "const all = contentByType;\nconst t = all('tool');"],
    ['buildContentManifest', 'const m = buildContentManifest();'],
    ['a tool URL through toolRoute', 'const u = absoluteUrl(withBase(toolRoute({ slug: f.slug, segment: f.category.segment })), site);'],
    ['a tool URL through urlFor', "const u = absoluteUrl(urlFor({ kind: 'tool', slug: f.slug, segment: f.category.segment }), site);"],
    ['a guide URL through guidePath', 'const g = guidePath(guide);'],
    ['a raw citation read', 'const n = tool.citation?.nonGoal;'],
  ])('reports %s', (_name, sample) => {
    expect(renderGuardViolations(sample)).not.toEqual([]);
  });

  it('allows the manifest calls render.ts makes', () => {
    const ok = "import { contentByType, type ContentEntry } from '@lib/content/manifest';\nconst c = contentByType('category');\nconst p = contentByType(\"page\");";
    expect(renderGuardViolations(ok)).toEqual([]);
  });

  it('reads type-only, aliased, multi-line, commented and default imports', () => {
    const names = (src: string) => importsOf(src).map(i => ({ specifier: i.specifier, names: i.names.map(n => n.imported) }));
    expect(names("import { contentByType, type ContentEntry } from '@lib/content/manifest';")).toEqual([
      { specifier: '@lib/content/manifest', names: ['contentByType', 'ContentEntry'] },
    ]);
    expect(names("import type { Category,\n  Tool } from '@data/types';")).toEqual([{ specifier: '@data/types', names: ['Category', 'Tool'] }]);
    expect(names("import { withBase as wb } from '@lib/paths';")).toEqual([{ specifier: '@lib/paths', names: ['withBase'] }]);
    expect(names("import { /* } */ withBase // }\n } from '@lib/paths';")).toEqual([{ specifier: '@lib/paths', names: ['withBase'] }]);
    expect(names("import thing, { a } from 'x';")).toEqual([{ specifier: 'x', names: ['a', 'default'] }]);
    expect(names("import * as P from 'x';")).toEqual([{ specifier: 'x', names: ['*'] }]);
  });
});
