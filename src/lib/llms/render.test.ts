import { describe, expect, it } from 'vitest';
import {
  CATEGORY_SUMMARY_TERMS,
  CORE_TOOL_SLUGS,
  PREP_HIGHLIGHT_SLUGS,
  categorySummaryTerms,
  doesNotLine,
  renderDetail,
  renderLlmsFull,
  renderLlmsTxt,
  renderSummary,
  simulationSubjects,
} from './render';
import { tools } from '@data/registry';
import { categories as allCategories } from '@data/categories';
import { PRIVACY_LINE } from '@lib/privacy';
import type { ContentEntry } from '@lib/content/manifest';
import { readFileSync } from 'node:fs';
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

// The llms files read a tool only through toolFacts() (src/lib/llms/facts.ts), so every surface
// states the same facts. The renderer may not reach around it to the raw per-tool sources, so its
// imports are an allowlist: every module it imports or re-exports, statically or with import(), in
// either quote style, must be one of these, and two of them only for the one name it needs.
const RENDER_IMPORTS: Readonly<Record<string, readonly string[] | null>> = {
  '@lib/content/manifest': null,
  '@lib/sitemap/render': null,
  '@data/categories': null,
  '@data/types': null,
  '@lib/paths': ['withBase'],
  '@lib/privacy': ['PRIVACY_LINE'],
  './facts': null,
};
/** Any call that builds a tool, category or guide URL, or a tool's privacy line. */
const BUILDS_URL_OR_PRIVACY = /\b(?:toolRoute|toolPath|urlFor|canonicalFor|guideRoute|guidePath|privacyStatement)\s*\(/;

/** Every module a source imports or re-exports, with the names it takes ('*' for a namespace). */
function importsOf(source: string): Array<{ specifier: string; names: string[] }> {
  const found: Array<{ specifier: string; names: string[] }> = [];
  const names = (clause: string): string[] => {
    const out: string[] = [];
    const braces = /\{([^}]*)\}/.exec(clause);
    if (braces) {
      for (const part of braces[1]!.split(',')) {
        const name = part.trim().replace(/^type\s+/, '').split(/\s+as\s+/)[0]!.trim();
        if (name) out.push(name);
      }
    }
    if (/\*/.test(clause.replace(/\{[^}]*\}/, ''))) out.push('*');
    const head = clause.replace(/\{[^}]*\}/, '').replace(/^\s*type\s+/, '').replace(/\*\s*as\s+\w+/, '');
    if (/^\s*[A-Za-z_$][\w$]*\s*(?:,|$)/.test(head)) out.push('default');
    return out;
  };
  for (const m of source.matchAll(/\b(?:import|export)\s+((?:type\s+)?[^'";]*?)\s*\bfrom\s*(['"])([^'"]+)\2/g)) {
    found.push({ specifier: m[3]!, names: names(m[1]!) });
  }
  for (const m of source.matchAll(/\bimport\s*(['"])([^'"]+)\1/g)) found.push({ specifier: m[2]!, names: [] });
  for (const m of source.matchAll(/\b(?:import|require)\s*\(\s*([^)]*)\)/g)) {
    const literal = /^(['"`])([^'"`$]+)\1$/.exec(m[1]!.trim());
    found.push({ specifier: literal ? literal[2]! : `<non-literal ${m[1]!.trim()}>`, names: ['*'] });
  }
  return found;
}

/** What breaks the rule in a render.ts source: imports off the allowlist, or a URL built in place. */
function renderGuardViolations(source: string): string[] {
  const problems: string[] = [];
  for (const { specifier, names } of importsOf(source)) {
    if (!(specifier in RENDER_IMPORTS)) {
      problems.push(`imports ${specifier}`);
      continue;
    }
    const allowed = RENDER_IMPORTS[specifier];
    if (allowed) for (const name of names) if (!allowed.includes(name)) problems.push(`takes ${name} from ${specifier}`);
  }
  const call = BUILDS_URL_OR_PRIVACY.exec(source);
  if (call) problems.push(`calls ${call[0].replace(/\s*\($/, '')}`);
  if (/\.(?:citation|trustVariant)\b/.test(source)) problems.push('reads a raw tool field');
  return problems;
}

describe('render.ts reads tools only through toolFacts', () => {
  const source = readFileSync(join(__dirname, 'render.ts'), 'utf8');

  it('imports exactly the allowlisted modules, and only withBase and PRIVACY_LINE from paths and privacy', () => {
    expect(new Set(importsOf(source).map(i => i.specifier))).toEqual(new Set(Object.keys(RENDER_IMPORTS)));
    expect(renderGuardViolations(source)).toEqual([]);
  });

  // The review's bypasses of the old denylist, plus the other shapes the parser must read.
  it.each([
    ['a relative path to the registry', "import { tools } from '../../data/registry';"],
    ['a double-quoted registry import', 'import { tools } from "@data/registry";'],
    ['the generated registry', "import { toolConfigs } from '@data/registry.generated';"],
    ['a local module that re-exports the registry', "import { tools } from './raw';"],
    ['an export-from of the registry', "export { tools } from '@data/registry';"],
    ['a dynamic import', "const { tools } = await import('@data/registry');"],
    ['a dynamic import of a computed path', 'const m = await import(`@data/${name}`);'],
    ['a side-effect import', "import '@data/registry';"],
    ['another name from @lib/paths', "import { withBase, toolPath } from '@lib/paths';"],
    ['a namespace import of @lib/privacy', "import * as P from '@lib/privacy';"],
    ['a tool URL through toolRoute', 'const u = absoluteUrl(withBase(toolRoute({ slug: f.slug, segment: f.category.segment })), site);'],
    ['a tool URL through urlFor', "const u = absoluteUrl(urlFor({ kind: 'tool', slug: f.slug, segment: f.category.segment }), site);"],
    ['a guide URL through guidePath', 'const g = guidePath(guide);'],
    ['a raw citation read', 'const n = tool.citation?.nonGoal;'],
  ])('reports %s', (_name, sample) => {
    expect(renderGuardViolations(sample)).not.toEqual([]);
  });

  it('reads type-only, aliased and multi-line imports', () => {
    expect(importsOf("import { contentByType, type ContentEntry } from '@lib/content/manifest';")).toEqual([
      { specifier: '@lib/content/manifest', names: ['contentByType', 'ContentEntry'] },
    ]);
    expect(importsOf("import type { Category,\n  Tool } from '@data/types';")).toEqual([
      { specifier: '@data/types', names: ['Category', 'Tool'] },
    ]);
    expect(importsOf("import { withBase as wb } from '@lib/paths';")).toEqual([{ specifier: '@lib/paths', names: ['withBase'] }]);
    expect(importsOf("import thing, { a } from 'x';")).toEqual([{ specifier: 'x', names: ['a', 'default'] }]);
  });
});
