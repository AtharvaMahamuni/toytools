// scaffold-tool — generate a tool directory; registration is derived, not edited.
//
// Registration barrels (registry/faq/guide/knowledge *.generated.ts + the glob-driven guide
// route) DERIVE from the tool tree, so this script only writes the tool directory (config.ts +
// Widget.astro + optional faq/guide/knowledge stubs) and re-runs `generate-registries` to refresh
// the barrels. The one thing still hand-wired is a NEW engine impl (its engine registry entry),
// which this script also scaffolds via stable anchors when the processorId does not resolve yet.
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

import { readFileSync, writeFileSync, mkdirSync, existsSync, rmSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execSync } from 'node:child_process';

import { tools } from '../src/data/registry';
import { categories } from '../src/data/categories';
import { engineIds, getEngine, knownPatterns } from '../src/data/engines';
import { PROCESSORS } from '../src/lib/text/processors/registry';
import { ENCODERS } from '../src/lib/engines/encoding/registry';
import { STRUCTURED_TOOLS } from '../src/lib/engines/structured-data/registry';

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

// Tool-tree edits happen after this process imported the registries, so the committed
// registration barrels + code map are regenerated in fresh processes (validate-architecture
// fails on staleness of either). Order matters: barrels first, then the code map reads them.
function regenerateDerived() {
  execSync('npx tsx scripts/generate-registries.ts', { cwd: repoRoot, stdio: 'inherit' });
  execSync('npx tsx scripts/export-code-map.ts', { cwd: repoRoot, stdio: 'inherit' });
}

function die(msg: string): never {
  console.error(`[scaffold-tool] ✗ ${msg}`);
  process.exit(1);
}

// ---- remove mode (the clean inverse of scaffold) --------------------------------------------
// `npm run scaffold:tool -- --remove --slug <slug> [--dry-run]` deletes the tool directory and
// regenerates the derived registration barrels (which drop the tool automatically). Only a
// now-unused engine impl still needs its registry lines stripped by hand here.
if (args.remove) {
  const rslug = String(args.slug ?? '');
  if (!rslug) die('--remove needs --slug');
  // Locate the tool's segment directory on disk.
  const toolsRoot = join(repoRoot, 'src', 'tools');
  let rseg = '';
  for (const seg of readdirSync(toolsRoot, { withFileTypes: true })) {
    if (seg.isDirectory() && existsSync(join(toolsRoot, seg.name, rslug, 'config.ts'))) { rseg = seg.name; break; }
  }
  if (!rseg) die(`no tool directory found for slug "${rslug}"`);

  // Registration is derived, so removal is: delete the directory, regenerate the barrels. Only
  // an engine impl that no other tool uses still has hand-wired registry lines to strip.
  const dropSpecs: { file: string; drop: (l: string) => boolean }[] = [];

  // If the tool has an engine impl no other tool uses, remove the impl + its registry lines
  // too (the inverse of the scaffold-time impl stub). A shared processorId is left alone.
  const rconfig = readFileSync(join(toolsRoot, rseg, rslug, 'config.ts'), 'utf-8');
  const rpid = rconfig.match(/processorId:\s*'([^']+)'/)?.[1] ?? '';
  const rengine = rconfig.match(/engine:\s*'([^']+)'/)?.[1] ?? '';
  const implDirs: Record<string, { dir: string; registry: string }> = {
    'text-processor': { dir: 'src/lib/text/processors', registry: 'src/lib/text/processors/registry.ts' },
    encoding: { dir: 'src/lib/engines/encoding', registry: 'src/lib/engines/encoding/registry.ts' },
    'structured-data': { dir: 'src/lib/engines/structured-data', registry: 'src/lib/engines/structured-data/registry.ts' },
  };
  let implToDelete = '';
  if (rpid && implDirs[rengine] && !tools.some(t => t.slug !== rslug && t.processorId === rpid)) {
    const rpidCamel = rpid.replace(/-([a-z0-9])/g, (_, c) => c.toUpperCase());
    const { dir, registry } = implDirs[rengine];
    for (const candidate of [`${dir}/${rpidCamel}.ts`, `${dir}/transform/${rpidCamel}.ts`, `${dir}/cleanup/${rpidCamel}.ts`]) {
      if (existsSync(join(repoRoot, candidate))) { implToDelete = candidate; break; }
    }
    if (implToDelete) {
      dropSpecs.push({
        file: registry,
        drop: l => l.includes(`/${rpidCamel}';`) || l.trim() === `'${rpid}': ${rpidCamel},` || l.trim() === `${rpidCamel},`,
      });
    }
  }

  console.log(`[scaffold-tool] ${dryRun ? 'DRY RUN — ' : ''}remove tool "${rslug}" (segment ${rseg})`);
  for (const { file, drop } of dropSpecs) {
    const path = join(repoRoot, file);
    const lines = readFileSync(path, 'utf-8').split('\n');
    const kept = lines.filter(l => !drop(l));
    const removed = lines.length - kept.length;
    if (removed > 0) {
      console.log(`  ~ ${file}: removed ${removed} line(s)`);
      if (!dryRun) writeFileSync(path, kept.join('\n'));
    }
  }
  const dir = join(toolsRoot, rseg, rslug);
  console.log(`  - ${dir.replace(repoRoot + '/', '')}/ (directory)`);
  if (!dryRun) rmSync(dir, { recursive: true, force: true });
  if (implToDelete) {
    console.log(`  - ${implToDelete} (engine impl, no other tool uses "${rpid}")`);
    if (!dryRun) rmSync(join(repoRoot, implToDelete), { force: true });
  }
  if (!dryRun) regenerateDerived();
  console.log(`\n[scaffold-tool] ${dryRun ? 'dry run complete — nothing changed.' : 'removed. Run `npm run build` to confirm.'}`);
  process.exit(0);
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

const REGISTRY_ENGINES = new Set(['text-processor', 'encoding', 'hashing', 'structured-data', 'jwt', 'finance', 'generation', 'physics', 'wellness']);
if (REGISTRY_ENGINES.has(engine) && !processorId) {
  die(`engine "${engine}" needs --processor-id (must resolve in that engine's registry)`);
}

const segment = categories.find(c => c.slug === category)!.segment;
const today = new Date().toISOString().slice(0, 10);
const monthYear = new Date().toLocaleString('en-US', { month: 'short', year: 'numeric' });

// ---- file templates -------------------------------------------------------------------------
const WIDGETS: Record<string, { comp: string; prop: string }> = {
  'text-processor': { comp: 'TextProcessorWidget', prop: 'processorId' },
  encoding:         { comp: 'ConverterWidget',     prop: 'processorId' },
  hashing:          { comp: 'ConverterWidget',     prop: 'processorId' },
  'structured-data':{ comp: 'StructuredDataWidget',prop: 'structuredId' },
  jwt:              { comp: 'JwtWidget',            prop: 'jwtId' },
  finance:          { comp: 'FinanceWidget',        prop: 'financeId' },
  generation:       { comp: 'GeneratorWidget',      prop: 'generatorId' },
  wellness:         { comp: 'WellnessWidget',        prop: 'wellnessId' },
  tracker:          { comp: 'TrackerWidget',          prop: 'trackerId' },
};

function widgetSource(): string {
  // Physics wraps SimulationWidget with a distinct prop shape (simulationId + authored examples)
  // and needs a hand-written SimulationDef (src/lib/simulation/simulations/<id>.ts) that
  // scaffold cannot generate — remind the author here.
  if (engine === 'physics') {
    return `---\nimport SimulationWidget from '@tools/_shared/SimulationWidget.astro';\nimport { config } from './config';\n\n// TODO: author real-world examples for this simulation.\nconst examples: { title: string; body: string }[] = [];\n---\n\n<!-- TODO: create the SimulationDef at src/lib/simulation/simulations/${processorId}.ts\n     (+ ${processorId}.draw.ts) and register it in simulations/registry.ts. -->\n<SimulationWidget config={config} simulationId="${processorId}" examples={examples} />\n`;
  }
  const w = WIDGETS[engine];
  if (w) {
    return `---\nimport ${w.comp} from '@tools/_shared/${w.comp}.astro';\nimport { config } from './config';\n---\n\n<${w.comp} slug={config.slug} ${w.prop}={config.processorId!} config={config} />\n`;
  }
  // Bespoke engine (calculator / productivity / text-interactive / text-analysis): no shared
  // 3-line wrapper. Emit a valid placeholder so the build stays green; author fills it in.
  return `---\n// TODO: implement the ${name} widget. Engine "${engine}" has no shared 3-line widget —\n// build a self-contained Widget here. Find sibling ${engine} tools to copy the pattern from\n// in docs/code-map.json (tools with "engine": "${engine}").\nimport { config } from './config';\n---\n\n<section class="tool-widget">\n  <p>TODO: build the {config.name} interface.</p>\n</section>\n`;
}

// ---- engine impl stub (text-processor / encoding / structured-data) --------------------------
// When the processorId does not resolve in its engine registry yet, scaffold the impl file and
// its two registry lines too — otherwise the widget wires up to a transform that does not exist
// and validate-registry fails the build. A processorId that already resolves is engine reuse
// (e.g. a new case converter) and needs no impl.
interface EngineImplSpec {
  implPath: string;            // repo-relative impl file to create
  implBody: string;
  registryFile: string;        // engine registry to edit
  importAnchor: string;
  importLine: string;
  entryAnchor: string;
  entryLine: string;
  testFile: string;            // colocated test to extend (reminder only)
}

function engineImplSpec(): EngineImplSpec | null {
  if (!processorId) return null;
  const pidCamel = processorId.replace(/-([a-z0-9])/g, (_, c: string) => c.toUpperCase());

  if (engine === 'text-processor') {
    if (PROCESSORS[processorId]) return null;
    const fam = pattern === 'text-cleanup' ? 'cleanup' : 'transform';
    return {
      implPath: `src/lib/text/processors/${fam}/${pidCamel}.ts`,
      implBody: `import type { TextProcessor } from '../types';\n\n// TODO: implement the ${name} transform (pure, synchronous, no browser APIs at top level).\nexport const ${pidCamel}: TextProcessor = {\n  id: '${processorId}',\n  family: '${fam}',\n  process: (text) => text, // TODO\n};\n`,
      registryFile: 'src/lib/text/processors/registry.ts',
      importAnchor: `import type { TextProcessor } from './types';`,
      importLine: `import { ${pidCamel} } from './${fam}/${pidCamel}';`,
      entryAnchor: `export const PROCESSORS: Record<string, TextProcessor> = {`,
      entryLine: `  '${processorId}': ${pidCamel},`,
      testFile: 'src/lib/text/processors/processors.test.ts',
    };
  }

  if (engine === 'encoding') {
    if (ENCODERS[processorId]) return null;
    return {
      implPath: `src/lib/engines/encoding/${pidCamel}.ts`,
      implBody: `import type { EncodingTool } from './types';\n\n// TODO: implement the ${name} encoder. Keep browser APIs inside methods, never at module\n// top level (registries import side-effect-free under tsx/vitest).\nexport const ${pidCamel}: EncodingTool = {\n  id: '${processorId}',\n  family: 'binary-text', // TODO: or 'web'\n  displayName: '${name}',\n  sample: 'Hello',\n  insight: 'TODO: one-paragraph educational insight.',\n  encode(input: string): string {\n    return input; // TODO\n  },\n  decode(input: string): string {\n    return input; // TODO (may throw on malformed input — the resolver catches it)\n  },\n};\n`,
      registryFile: 'src/lib/engines/encoding/registry.ts',
      importAnchor: `import { base64 } from './base64';`,
      importLine: `import { ${pidCamel} } from './${pidCamel}';`,
      entryAnchor: `export const ENCODERS: Record<string, EncodingTool> = {`,
      entryLine: `  '${processorId}': ${pidCamel},`,
      testFile: 'src/lib/engines/encoding/encoding.test.ts',
    };
  }

  if (engine === 'structured-data') {
    if (STRUCTURED_TOOLS[processorId]) return null;
    return {
      implPath: `src/lib/engines/structured-data/${pidCamel}.ts`,
      implBody: `import type { StructuredDataTool } from './types';\n\n// TODO: implement ${name}. Never throws — failures become a result error.\nexport const ${pidCamel}: StructuredDataTool = {\n  id: '${processorId}',\n  family: 'json',\n  execute: (input) => {\n    if (!input.trim()) return { ok: true, output: '' };\n    return { ok: true, output: input }; // TODO\n  },\n};\n`,
      registryFile: 'src/lib/engines/structured-data/registry.ts',
      importAnchor: `import type { StructuredDataTool, StructuredDataResult } from './types';`,
      importLine: `import { ${pidCamel} } from './${pidCamel}';`,
      entryAnchor: `export const STRUCTURED_TOOLS: Record<string, StructuredDataTool> = {`,
      entryLine: `  '${processorId}': ${pidCamel},`,
      testFile: 'src/lib/engines/structured-data/structured-data.test.ts',
    };
  }

  // hashing / jwt impls are algorithm-heavy one-offs; author them by hand.
  return null;
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

// ---- engine-registry insertion (anchor-based, idempotent) -----------------------------------
// Tool registration is derived (generate-registries runs after the files are written); the only
// remaining anchor edits wire a NEW engine impl into its engine registry.
interface Edit { file: string; anchor: string; line: string; }
const edits: Edit[] = [];

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

const implSpec = engineImplSpec();
if (implSpec) {
  if (existsSync(join(repoRoot, implSpec.implPath))) {
    die(`engine impl ${implSpec.implPath} already exists but "${processorId}" is not registered — wire it into ${implSpec.registryFile} by hand`);
  }
  files.push({ path: join(repoRoot, implSpec.implPath), body: implSpec.implBody });
  edits.push({ file: implSpec.registryFile, anchor: implSpec.importAnchor, line: implSpec.importLine });
  edits.push({ file: implSpec.registryFile, anchor: implSpec.entryAnchor, line: implSpec.entryLine });
}

console.log(`[scaffold-tool] ${dryRun ? 'DRY RUN — ' : ''}tool "${slug}" (${engine}/${pattern}) in src/tools/${segment}/${slug}/`);
for (const f of files) {
  console.log(`  + ${f.path.replace(repoRoot + '/', '')}`);
  if (!dryRun) { mkdirSync(dirname(f.path), { recursive: true }); writeFileSync(f.path, f.body); }
}
if (edits.length) console.log('[scaffold-tool] engine-registry edits:');
for (const e of edits) { console.log(`  ~ ${e.file}  +  ${e.line.trim()}`); applyEdit(e); }

if (dryRun) {
  console.log('\n[scaffold-tool] dry run complete — nothing written. (Registration barrels regenerate on the real run.)');
  process.exit(0);
}

regenerateDerived();

console.log('\n[scaffold-tool] done. Next: fill the TODOs, then run `npm run build` (validators + render) and `npm run test:e2e`.');
if (implSpec) console.log(`[scaffold-tool] NOTE: implement ${implSpec.implPath} (currently a passthrough stub) and add cases to ${implSpec.testFile}.`);
if (!WIDGETS[engine]) console.log('[scaffold-tool] NOTE: this engine has no shared widget — implement Widget.astro by hand (see docs/code-map.json for siblings).');
