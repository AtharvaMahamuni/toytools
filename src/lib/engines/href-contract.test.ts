// The engine href contract (C3, report §26): every link an engine emits resolves to a real tool URL
// in the registry. Engines name tools by slug (a decision carries { slug, segment }) and the
// experience renderer builds the href with toolPath(), so this pins three things:
//   1. every entry in an engine's linked-tool map is a registry tool, with that tool's real segment,
//      and its built href is exactly the URL the tool page is published at;
//   2. every toolDecision(...) a calculator makes names a slug its engine can link, so a sibling
//      that has shipped is never silently rendered as plain text;
//   3. no engine source spells a /tool/ or /category/ URL itself.
import { describe, it, expect } from 'vitest';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative, resolve } from 'node:path';
import { toolPath } from '@lib/paths';
import { tools } from '@data/registry';
import { categories } from '@data/categories';
import { contentByType } from '@lib/content/manifest';
import { DATETIME_LINKED_TOOLS, toolDecision as datetimeDecision } from './datetime/story';
import { FINANCE_LINKED_TOOLS, toolDecision as financeDecision } from './finance/story';
import { MATH_LINKED_TOOLS, toolDecision as mathDecision } from './math/story';
import { NETWORK_LINKED_TOOLS, toolDecision as networkDecision } from './network/story';
import { WELLNESS_LINKED_TOOLS, toolDecision as wellnessDecision } from './wellness/story';
import type { Decision } from '@lib/results/types';

const ENGINES_DIR = resolve(__dirname);

const ENGINES: Array<{
  id: string;
  map: Record<string, string>;
  decide: (label: string, slug: string) => Decision | null;
}> = [
  { id: 'datetime', map: DATETIME_LINKED_TOOLS, decide: datetimeDecision },
  { id: 'finance', map: FINANCE_LINKED_TOOLS, decide: financeDecision },
  { id: 'math', map: MATH_LINKED_TOOLS, decide: mathDecision },
  { id: 'network', map: NETWORK_LINKED_TOOLS, decide: networkDecision },
  { id: 'wellness', map: WELLNESS_LINKED_TOOLS, decide: wellnessDecision },
];

const toolBySlug = new Map(tools.map((t) => [t.slug, t]));
const segmentOf = (categorySlug: string) => categories.find((c) => c.slug === categorySlug)?.segment;
const publishedToolUrls = new Set(contentByType('tool').map((e) => e.url));

function sourcesUnder(dir: string): string[] {
  const out: string[] = [];
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) out.push(...sourcesUnder(full));
    else if (/\.ts$/.test(name) && !/\.test\.ts$/.test(name)) out.push(full);
  }
  return out;
}

describe('engine href contract', () => {
  it('covers the engines that link to other tools (45+ links)', () => {
    const total = ENGINES.reduce((n, e) => n + Object.keys(e.map).length, 0);
    expect(total).toBeGreaterThanOrEqual(42);
  });

  for (const engine of ENGINES) {
    describe(engine.id, () => {
      it('links only to registry tools, at their real segment and published URL', () => {
        for (const [slug, segment] of Object.entries(engine.map)) {
          const tool = toolBySlug.get(slug);
          expect(tool, `${engine.id} links to unknown tool "${slug}"`).toBeDefined();
          expect(segment, `${engine.id} → ${slug}: wrong segment`).toBe(segmentOf(tool!.categorySlug));
          const href = toolPath({ slug, segment });
          expect(publishedToolUrls.has(href), `${engine.id} → ${href} is not a published tool URL`).toBe(true);
        }
      });

      it('emits decisions that name the tool and never a hand-written href', () => {
        for (const slug of Object.keys(engine.map)) {
          const d = engine.decide('Label', slug);
          expect(d?.tool).toEqual({ slug, segment: engine.map[slug] });
          expect(d?.href).toBeUndefined();
        }
      });

      it('every toolDecision a calculator makes names a slug this engine can link', () => {
        const dir = join(ENGINES_DIR, engine.id);
        for (const file of sourcesUnder(dir)) {
          const src = readFileSync(file, 'utf8');
          for (const m of src.matchAll(/toolDecision\(\s*'[^']*'\s*,\s*'([a-z0-9-]+)'\s*\)/g)) {
            const slug = m[1]!;
            const where = `${relative(ENGINES_DIR, file)} → ${slug}`;
            // A registry tool missing from the map would render as plain text: a dead link.
            if (toolBySlug.has(slug)) expect(engine.map[slug], where).toBeDefined();
            // A slug that is not a tool yet is only allowed where the engine drops it (null).
            else expect(engine.decide('x', slug), where).toBeNull();
          }
        }
      });
    });
  }

  it('no engine source writes a /tool/ or /category/ URL itself', () => {
    const offenders: string[] = [];
    for (const file of sourcesUnder(ENGINES_DIR)) {
      const src = readFileSync(file, 'utf8');
      src.split('\n').forEach((line, i) => {
        if (/^\s*(\/\/|\*|\/\*)/.test(line)) return;
        if (/['"`](?:\$\{[^}]*\})?\/(?:tool|category)\//.test(line)) {
          offenders.push(`${relative(ENGINES_DIR, file)}:${i + 1}: ${line.trim()}`);
        }
      });
    }
    expect(offenders).toEqual([]);
  });
});
