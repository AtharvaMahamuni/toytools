// One growth row for one slug (`npm run growth:score -- <slug>`).
// On demand only. Never part of `npm run build`. The count lives in src/lib/growth/score.ts.

import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  formatGrowthReport,
  scoreGrowth,
  type GrowthResearch,
  type GrowthSources,
} from '../src/lib/growth/score';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');

function readText(path: string): string | null {
  if (!existsSync(path)) return null;
  return readFileSync(path, 'utf8');
}

function findToolDir(slug: string): string | null {
  const tools = join(ROOT, 'src', 'tools');
  for (const segment of readdirSync(tools)) {
    if (segment.startsWith('_')) continue;
    const dir = join(tools, segment, slug);
    if (existsSync(join(dir, 'config.ts'))) return dir;
  }
  return null;
}

function titleFrom(config: string): string {
  const name = config.match(/\bname:\s*'([^']+)'/)?.[1] ?? '';
  const seoTitle = config.match(/\bseoTitle:\s*'([^']+)'/)?.[1] ?? '';
  return `${name} ${seoTitle}`.trim();
}

function resolveImport(toolDir: string, spec: string): string | null {
  if (spec.startsWith('@tools/')) return join(ROOT, 'src', 'tools', spec.slice('@tools/'.length));
  if (spec.startsWith('.')) return join(toolDir, spec);
  return null;
}

function widgetSource(toolDir: string): string | null {
  const widgetPath = join(toolDir, 'Widget.astro');
  const own = readText(widgetPath);
  if (own === null) return null;
  let combined = own;
  for (const match of own.matchAll(/from\s+['"]([^'"]+\.astro)['"]/g)) {
    const resolved = resolveImport(toolDir, match[1] ?? '');
    if (!resolved) continue;
    const shared = readText(resolved);
    if (shared) combined += `\n${shared}`;
  }
  return combined;
}

function asResearch(raw: unknown): GrowthResearch | null {
  if (!raw || typeof raw !== 'object') return null;
  const record = raw as Record<string, unknown>;
  const strings = (value: unknown): string[] =>
    Array.isArray(value) ? value.filter((item): item is string => typeof item === 'string') : [];
  const questions = Array.isArray(record.redditQuestions)
    ? record.redditQuestions.flatMap(item => {
        if (!item || typeof item !== 'object') return [];
        const topic = (item as { topic?: unknown }).topic;
        return typeof topic === 'string' ? [{ topic }] : [];
      })
    : [];
  const num = (value: unknown): number => (typeof value === 'number' && Number.isFinite(value) ? value : 0);
  return {
    contentGaps: strings(record.contentGaps),
    competitorHeadings: strings(record.competitorHeadings),
    redditQuestions: questions,
    redditDemandScore: num(record.redditDemandScore),
    dataConfidence: num(record.dataConfidence),
    sampleSize: num(record.sampleSize),
  };
}

function loadResearch(slug: string): GrowthResearch | null {
  const path = join(ROOT, 'seo-engine', 'research', 'processed', slug, 'research.json');
  const text = readText(path);
  if (text === null) return null;
  return asResearch(JSON.parse(text) as unknown);
}

function usage(): never {
  console.error('Usage: npm run growth:score -- <slug> [--json]');
  process.exit(1);
}

function main(): void {
  const args = process.argv.slice(2).filter(arg => arg !== '--');
  const json = args.includes('--json');
  const slug = args.find(arg => arg !== '--json');
  if (!slug) usage();

  const toolDir = findToolDir(slug);
  if (!toolDir) {
    console.error(`[growth:score] no tool directory for "${slug}". Simulations are outside this slice.`);
    process.exit(1);
  }

  const config = readText(join(toolDir, 'config.ts')) ?? '';
  let research: GrowthResearch | null = null;
  try {
    research = loadResearch(slug);
  } catch {
    console.error(`[growth:score] research.json for "${slug}" is not valid JSON.`);
    process.exit(1);
  }

  const sources: GrowthSources = {
    slug,
    title: titleFrom(config),
    research,
    widgetSource: widgetSource(toolDir),
    faqSource: readText(join(toolDir, 'faq.ts')),
    knowledgeSource: readText(join(toolDir, 'knowledge.ts')),
    guideSource: readText(join(toolDir, 'Guide.astro')),
  };
  const row = scoreGrowth(sources);
  console.log(json ? JSON.stringify(row, null, 2) : formatGrowthReport(row));
}

main();
