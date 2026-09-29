// The engine href contract (C3, report §26): every link an engine emits resolves to a real tool URL
// in the registry. Engines name tools by slug (a decision carries { slug, segment }) and the
// experience renderer builds the href with toolPath(), so this pins three things:
//   1. every entry in an engine's linked-tool map is a registry tool, with that tool's real segment,
//      and its built href is exactly the URL the tool page is published at;
//   2. every toolDecision(...) a calculator makes names a registry tool in its engine's map, so a
//      typo'd slug or a missing map entry fails here instead of silently rendering as plain text.
//      A sibling that has not shipped yet has to be named in PENDING_SIBLINGS on purpose;
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

/**
 * Slugs a calculator may name before the tool exists (the engine drops the decision until then).
 * Empty today: every toolDecision names a live registry tool. An entry here is a deliberate,
 * reviewed exception, never a way to quiet a typo.
 */
const PENDING_SIBLINGS: Record<string, readonly string[]> = {};

/** The one shape the scan reads: toolDecision('label', 'slug'). */
const TOOL_DECISION_CALL = /toolDecision\(\s*'[^']*'\s*,\s*'([a-z0-9-]+)'\s*\)/g;

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
  it('covers the engines that link to other tools (42 links)', () => {
    const total = ENGINES.reduce((n, e) => n + Object.keys(e.map).length, 0);
    expect(total).toBeGreaterThanOrEqual(42);
  });

  it('keeps PENDING_SIBLINGS empty (every sibling a calculator names has shipped)', () => {
    expect(PENDING_SIBLINGS).toEqual({});
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

      it('every toolDecision a calculator makes names a registry tool in this engine\'s map', () => {
        const dir = join(ENGINES_DIR, engine.id);
        const pending = new Set(PENDING_SIBLINGS[engine.id] ?? []);
        const problems: string[] = [];
        let scanned = 0;
        for (const file of sourcesUnder(dir)) {
          const src = readFileSync(file, 'utf8');
          const rel = relative(ENGINES_DIR, file);
          // Every call site must be in the scanned shape, so none is skipped by accident.
          src.split('\n').forEach((line, i) => {
            if (!/\btoolDecision\(/.test(line) || /function toolDecision\(/.test(line)) return;
            if (!new RegExp(TOOL_DECISION_CALL.source).test(line)) {
              problems.push(`${rel}:${i + 1}: call not in the form toolDecision('label', 'slug')`);
            }
          });
          for (const m of src.matchAll(TOOL_DECISION_CALL)) {
            scanned += 1;
            const slug = m[1]!;
            if (pending.has(slug)) {
              if (toolBySlug.has(slug)) problems.push(`${rel} → ${slug}: shipped, move it from PENDING_SIBLINGS to the map`);
              continue;
            }
            if (!toolBySlug.has(slug)) problems.push(`${rel} → ${slug}: not a registry tool (typo?)`);
            else if (!engine.map[slug]) problems.push(`${rel} → ${slug}: missing from the ${engine.id} linked-tool map`);
          }
        }
        expect(scanned, `${engine.id}: no toolDecision calls found`).toBeGreaterThan(0);
        expect(problems).toEqual([]);
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
