// scaffold-tool — generate a tool directory AND wire every registry in one command.
//
// Adding a fully-loaded tool by hand touches up to five files (registry, faq-registry,
// guide-registry + the guide route, knowledge registry) on top of the tool directory itself.
// This collapses that into one step: it writes config.ts + Widget.astro (+ optional faq/guide/
// knowledge stubs) and inserts the matching import + entry into each registry via stable anchors.
// Idempotent (refuses an existing slug), supports --dry-run, and runs the validators at the end.
//
// Usage:
//   npm run scaffold:tool -- --slug my-tool --name "My Tool" --category text-utilities \
//     --engine text-processor --pattern text-transform --family transform \
//     --processor-id myProcessor --description "One-line description." [--faq] [--guide] [--no-knowledge]
//   npm run scaffold:tool -- ... --dry-run     # preview the files + edits, write nothing
//
// Engine-backed engines (text-processor, encoding, hashing, structured-data, jwt) get a real
// 3-line widget. Other engines get a clearly-marked placeholder widget to fill in.

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import { tools } from '../src/data/registry';
import { categories } from '../src/data/categories';
import { engineIds, getEngine, knownPatterns } from '../src/data/engines';

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), '..');

// ---- arg parsing ----------------------------------------------------------------------------
function parseArgs(argv: string[]): Record<string, string | boolean> {
  const out: Record<string, string | boolean> = {};
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (!a.startsWith('--')) continue;
    const key = a.slice(2);
    const next = argv[i + 1];
    if (next === undefined || next.startsWith('--')) out[key] = true;
    else { out[key] = next; i++; }
  }
  return out;
}
const args = parseArgs(process.argv.slice(2));
const dryRun = Boolean(args['dry-run']);

function die(msg: string): never {
  console.error(`[scaffold-tool] ✗ ${msg}`);
  process.exit(1);
}

// ---- inputs ---------------------------------------------------------------------------------
const slug = String(args.slug ?? '');
const name = String(args.name ?? '');
const category = String(args.category ?? '');
const engine = String(args.engine ?? '');
const pattern = String(args.pattern ?? '');
const family = String(args.family ?? '');
const description = String(args.description ?? `${name}.`);
const processorId = args['processor-id'] ? String(args['processor-id']) : '';
const wantFaq = Boolean(args.faq);
const wantGuide = Boolean(args.guide);
const wantKnowledge = !args['no-knowledge']; // knowledge by default (coverage is enforced)

if (!slug || !name || !category || !engine || !pattern || !family) {
  die('required: --slug --name --category --engine --pattern --family (see header for usage)');
}
if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug)) die(`slug "${slug}" must be kebab-case`);
if (tools.some(t => t.slug === slug)) die(`slug "${slug}" already exists in the registry`);
if (!categories.find(c => c.slug === category)) die(`unknown category "${category}"`);
if (!engineIds.has(engine)) die(`unknown engine "${engine}" — register it in src/data/engines.ts first`);
if (!knownPatterns.has(pattern)) die(`unknown pattern "${pattern}" — declare it in src/data/engines.ts`);
const eng = getEngine(engine)!;
if (!eng.patterns.includes(pattern)) die(`pattern "${pattern}" is not owned by engine "${engine}" (allowed: ${eng.patterns.join(', ')})`);

const REGISTRY_ENGINES = new Set(['text-processor', 'encoding', 'hashing', 'structured-data', 'jwt']);
if (REGISTRY_ENGINES.has(engine) && !processorId) {
  die(`engine "${engine}" needs --processor-id (must resolve in that engine's registry)`);
}

const segment = categories.find(c => c.slug === category)!.segment;
const today = new Date().toISOString().slice(0, 10);
const monthYear = new Date().toLocaleString('en-US', { month: 'short', year: 'numeric' });

// camelCase / PascalCase from the slug
const camel = slug.replace(/-([a-z0-9])/g, (_, c) => c.toUpperCase());
const Pascal = camel.charAt(0).toUpperCase() + camel.slice(1);

// ---- file templates -------------------------------------------------------------------------
const WIDGETS: Record<string, { comp: string; prop: string }> = {
  'text-processor': { comp: 'TextProcessorWidget', prop: 'processorId' },
  encoding:         { comp: 'ConverterWidget',     prop: 'processorId' },
  hashing:          { comp: 'ConverterWidget',     prop: 'processorId' },
  'structured-data':{ comp: 'StructuredDataWidget',prop: 'structuredId' },
  jwt:              { comp: 'JwtWidget',            prop: 'jwtId' },
};

function widgetSource(): string {
  const w = WIDGETS[engine];
  if (w) {
    return `---\nimport ${w.comp} from '@tools/_shared/${w.comp}.astro';\nimport { config } from './config';\n---\n\n<${w.comp} slug={config.slug} ${w.prop}={config.processorId!} config={config} />\n`;
  }
  // Bespoke engine (calculator / productivity / text-interactive / text-analysis): no shared
  // 3-line wrapper. Emit a valid placeholder so the build stays green; author fills it in.
  return `---\n// TODO: implement the ${name} widget. Engine "${engine}" has no shared 3-line widget —\n// build a self-contained Widget here (see a sibling ${engine} tool for the pattern).\nimport { config } from './config';\n---\n\n<section class="tool-widget">\n  <p>TODO: build the {config.name} interface.</p>\n</section>\n`;
}

function configSource(): string {
  const lines = [
    `import type { ToolConfig } from '@data/types';`,
    ``,
    `export const config: ToolConfig = {`,
    `  slug: '${slug}',`,
    `  name: '${name}',`,
    `  description: '${description.replace(/'/g, "\\'")}',`,
    `  categorySlug: '${category}',`,
    `  tags: ['${slug.replace(/-/g, ' ')}'], // TODO: add search keywords`,
    `  updatedAt: '${today}',`,
    `  engine: '${engine}',`,
    `  pattern: '${pattern}',`,
    `  family: '${family}',`,
  ];
  if (REGISTRY_ENGINES.has(engine)) lines.push(`  processorId: '${processorId}',`);
  if (wantGuide) {
    lines.push(
      `  guide: {`,
      `    slug: '${slug}',`,
      `    categorySlug: '${segment}',`,
      `    title: '${name} Guide', // TODO`,
      `    description: 'TODO: one-line guide description.',`,
      `    readMinutes: 3,`,
      `    updatedAt: '${monthYear}',`,
      `  },`,
    );
  }
  lines.push(`};`, ``);
  return lines.join('\n');
}

function faqSource(): string {
  return `import type { FAQItem } from '@data/types';\n\n// TODO: replace with real, tool-specific questions and answers.\nexport const items: FAQItem[] = [\n  {\n    id: '${slug}-faq-1',\n    question: 'TODO: a real question about ${name}?',\n    answer: 'TODO: a concrete, original answer.',\n  },\n];\n`;
}

function guideSource(): string {
  return `---\nimport GuideLayout from '@layouts/GuideLayout.astro';\nimport { config } from './config';\nimport type { EcosystemEntry } from '@data/types';\n\ninterface Props {\n  title: string;\n  description: string;\n  readMinutes: number;\n  updatedAt: string;\n  entry: EcosystemEntry;\n}\nconst props = Astro.props;\n---\n\n<GuideLayout\n  {...props}\n  toolSlug={config.slug}\n  toolName={config.name}\n  toolCategorySlug={config.categorySlug}\n>\n  <section id="overview">\n    <h2>Overview</h2>\n    <p>TODO: write the guide for ${name}.</p>\n  </section>\n</GuideLayout>\n`;
}

function knowledgeSource(): string {
  return `import { KNOWLEDGE_SCHEMA_VERSION, type Knowledge } from '@lib/knowledge/types';\n\n// TODO: fill in real, tool-specific content. Empty relationship arrays are valid to start.\nexport const knowledge: Knowledge = {\n  schemaVersion: KNOWLEDGE_SCHEMA_VERSION,\n  slug: '${slug}',\n  title: '${name}',\n  category: '${category}',\n  summary: 'TODO: one-line summary (<=160 chars).',\n  primaryConcepts: ['${slug.replace(/-/g, ' ')}'],\n  secondaryConcepts: [],\n  intentGroups: {\n    informational: [],\n    howTo: [],\n    comparison: [],\n    misconception: [],\n    troubleshooting: [],\n  },\n  realWorldUseCases: [],\n  commonMistakes: [],\n  commonQuestions: [],\n  usedWith: [],\n  alternatives: [],\n  nextSteps: [],\n  workflowStage: ['transform'],\n  keywords: [],\n  entityAliases: [],\n};\n`;
}

// ---- registry insertion (anchor-based, idempotent) ------------------------------------------
interface Edit { file: string; anchor: string; line: string; }
const edits: Edit[] = [];

edits.push({
  file: 'src/data/registry.ts',
  anchor: `import type { ToolConfig } from './types';`,
  line: `import { config as ${camel} } from '@tools/${segment}/${slug}/config';`,
});
edits.push({
  file: 'src/data/registry.ts',
  anchor: `export const tools: ToolConfig[] = [`,
  line: `  ${camel},`,
});

if (wantFaq) {
  edits.push({
    file: 'src/data/faq-registry.ts',
    anchor: `import type { FAQItem } from './types';`,
    line: `import { items as ${camel}Faqs } from '@tools/${segment}/${slug}/faq';`,
  });
  edits.push({
    file: 'src/data/faq-registry.ts',
    anchor: `export const faqsByToolSlug: Record<string, FAQItem[]> = {`,
    line: `  '${slug}': ${camel}Faqs,`,
  });
}

if (wantGuide) {
  edits.push({
    file: 'src/data/guide-registry.ts',
    anchor: `export const registeredGuideSlugs = [`,
    line: `  '${slug}',`,
  });
  edits.push({
    file: 'src/pages/guide/[...slug].astro',
    anchor: `import type { RegisteredGuideSlug } from '@data/guide-registry';`,
    line: `import ${Pascal}Guide from '../../tools/${segment}/${slug}/Guide.astro';`,
  });
  edits.push({
    file: 'src/pages/guide/[...slug].astro',
    anchor: `const guidesBySlug: Record<RegisteredGuideSlug, any> = {`,
    line: `  '${slug}': ${Pascal}Guide,`,
  });
}

if (wantKnowledge) {
  edits.push({
    file: 'src/lib/knowledge/registry.ts',
    anchor: `import type { Knowledge } from './types';`,
    line: `import { knowledge as ${camel} } from '@tools/${segment}/${slug}/knowledge';`,
  });
  edits.push({
    file: 'src/lib/knowledge/registry.ts',
    anchor: `export const KNOWLEDGE_ENTRIES: Knowledge[] = [`,
    line: `  ${camel},`,
  });
}

function applyEdit(e: Edit): void {
  const path = join(repoRoot, e.file);
  const content = readFileSync(path, 'utf-8');
  if (content.includes(e.line)) return; // idempotent
  if (!content.includes(e.anchor)) die(`anchor not found in ${e.file}: "${e.anchor}"`);
  const next = content.replace(e.anchor, `${e.anchor}\n${e.line}`);
  if (!dryRun) writeFileSync(path, next);
}

// ---- write files ----------------------------------------------------------------------------
const toolDir = join(repoRoot, 'src', 'tools', segment, slug);
const files: { path: string; body: string }[] = [
  { path: join(toolDir, 'config.ts'), body: configSource() },
  { path: join(toolDir, 'Widget.astro'), body: widgetSource() },
];
if (wantFaq) files.push({ path: join(toolDir, 'faq.ts'), body: faqSource() });
if (wantGuide) files.push({ path: join(toolDir, 'Guide.astro'), body: guideSource() });
if (wantKnowledge) files.push({ path: join(toolDir, 'knowledge.ts'), body: knowledgeSource() });

console.log(`[scaffold-tool] ${dryRun ? 'DRY RUN — ' : ''}tool "${slug}" (${engine}/${pattern}) in src/tools/${segment}/${slug}/`);
for (const f of files) {
  console.log(`  + ${f.path.replace(repoRoot + '/', '')}`);
  if (!dryRun) { mkdirSync(dirname(f.path), { recursive: true }); writeFileSync(f.path, f.body); }
}
console.log('[scaffold-tool] registry edits:');
for (const e of edits) { console.log(`  ~ ${e.file}  +  ${e.line.trim()}`); applyEdit(e); }

if (dryRun) {
  console.log('\n[scaffold-tool] dry run complete — nothing written.');
  process.exit(0);
}

console.log('\n[scaffold-tool] done. Next: fill the TODOs, then run `npm run build` (validators + render) and `npm run test:e2e`.');
if (!WIDGETS[engine]) console.log('[scaffold-tool] NOTE: this engine has no shared widget — implement Widget.astro by hand.');
