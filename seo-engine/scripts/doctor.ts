/**
 * seo:doctor — asserts that everything the SEO engine, its skill docs, and its
 * scaffold output claim about the codebase is still true. The engine's docs
 * drifted silently once (removed config.faq field, /tools/ → /tool/ URL change,
 * flat tool dirs); this command turns that class of drift into a red exit code.
 *
 * Usage: tsx scripts/doctor.ts        (from seo-engine/, or `npm run seo:doctor` from root)
 */

import { execSync } from 'node:child_process';
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const PROJECT = join(ROOT, '..');

const failures: string[] = [];
const passes: string[] = [];

function check(name: string, ok: boolean, detail?: string): void {
  if (ok) passes.push(name);
  else failures.push(detail ? `${name} — ${detail}` : name);
}

// 0. Refresh the content-graph snapshot (cheap, deterministic)
try {
  execSync('npx tsx scripts/export-content-graph.ts', { cwd: PROJECT, stdio: 'pipe' });
} catch (e) {
  console.error('[doctor] could not regenerate content-graph.json:', (e as Error).message);
  process.exit(1);
}

interface GraphTool {
  segment: string;
  hasGuideConfig: boolean;
  guideRegistered: boolean;
  faqRegistered: boolean;
  knowledgeRegistered: boolean;
}
const graph = JSON.parse(readFileSync(join(ROOT, 'cache', 'content-graph.json'), 'utf-8')) as {
  tools: Record<string, GraphTool>;
};
const slugs = Object.keys(graph.tools);
check('content-graph snapshot has tools', slugs.length > 0);

// 1. URL shape: /tool/ (singular) route exists; no /tools/ route
check('route src/pages/tool/ exists (singular)', existsSync(join(PROJECT, 'src/pages/tool')));
check('no src/pages/tools/ route (plural is dead)', !existsSync(join(PROJECT, 'src/pages/tools')));

// 2. ToolConfig shape: guide? present, faq field removed
const typesSrc = readFileSync(join(PROJECT, 'src/data/types.ts'), 'utf-8');
const toolConfigBody = typesSrc.match(/interface ToolConfig \{([\s\S]*?)\n\}/)?.[1] ?? '';
check('ToolConfig has guide?: field', /\bguide\?:/.test(toolConfigBody));
check('ToolConfig has NO faq field (FAQ registers via faq-registry only)', !/\bfaq\??:/.test(toolConfigBody));

// 3. Tool dirs are two-level src/tools/<segment>/<slug>/ and every graph slug resolves
for (const [slug, t] of Object.entries(graph.tools)) {
  check(`tool dir src/tools/${t.segment}/${slug}/`, existsSync(join(PROJECT, 'src/tools', t.segment, slug)));
}

// 4. Guide config ↔ guide registration parity
for (const [slug, t] of Object.entries(graph.tools)) {
  if (t.hasGuideConfig !== t.guideRegistered) {
    check(`guide parity for ${slug}`, false,
      t.hasGuideConfig ? 'config declares guide but slug missing from registeredGuideSlugs' : 'registered but config has no guide field');
  }
}
check('guide config ↔ registeredGuideSlugs parity', !failures.some(f => f.startsWith('guide parity')));

// 5. Exemplar guides referenced by skills/PROMPT.md exist and still use the canonical shape
const EXEMPLARS = [
  'src/tools/developer/json-formatter/Guide.astro',
  'src/tools/text/character-counter/Guide.astro',
];
for (const rel of EXEMPLARS) {
  const p = join(PROJECT, rel);
  if (!existsSync(p)) {
    check(`exemplar ${rel}`, false, 'file missing');
    continue;
  }
  const src = readFileSync(p, 'utf-8');
  for (const marker of ['GuideLayout', 'ReferenceBlock', 'cta-link', 'gold-dot']) {
    check(`exemplar ${rel} contains ${marker}`, src.includes(marker));
  }
}

// 6. Every npm command named in the seo-content skill exists in a package.json
const rootScripts = Object.keys(JSON.parse(readFileSync(join(PROJECT, 'package.json'), 'utf-8')).scripts ?? {});
const engineScripts = Object.keys(JSON.parse(readFileSync(join(ROOT, 'package.json'), 'utf-8')).scripts ?? {});
const skillDir = join(PROJECT, '.claude/skills/seo-content');
if (existsSync(skillDir)) {
  const mdFiles: string[] = [];
  const walk = (dir: string) => {
    for (const f of readdirSync(dir)) {
      const p = join(dir, f);
      if (statSync(p).isDirectory()) walk(p);
      else if (f.endsWith('.md')) mdFiles.push(p);
    }
  };
  walk(skillDir);
  const referenced = new Set<string>();
  for (const f of mdFiles) {
    const src = readFileSync(f, 'utf-8');
    for (const m of src.matchAll(/npm (?:--prefix seo-engine )?run (seo:[a-z-]+)/g)) referenced.add(m[1]);
  }
  for (const cmd of referenced) {
    check(`skill-referenced command "${cmd}" exists`, rootScripts.includes(cmd) || engineScripts.includes(cmd));
  }
} else {
  console.log('[doctor] note: .claude/skills/seo-content not present yet — skipping skill command checks');
}

// 7. Every toolIntents key in content-intelligence-rules.json resolves to a real tool
const rules = JSON.parse(readFileSync(join(ROOT, 'config/content-intelligence-rules.json'), 'utf-8'));
for (const key of Object.keys(rules.toolIntents ?? {})) {
  check(`rules.toolIntents key "${key}" resolves to a registered tool`, key in graph.tools,
    'stale override — tool renamed or removed');
}

// 8. Research output path shape: research/processed/<slug>/research.json
const processedDir = join(ROOT, 'research', 'processed');
if (existsSync(processedDir)) {
  for (const dir of readdirSync(processedDir)) {
    const p = join(processedDir, dir);
    if (!statSync(p).isDirectory()) continue;
    check(`research/processed/${dir}/research.json exists`, existsSync(join(p, 'research.json')));
  }
}

// Report
console.log(`\n[doctor] ${passes.length} checks passed`);
if (failures.length > 0) {
  console.error(`[doctor] ${failures.length} FAILED:\n`);
  failures.forEach(f => console.error(`  ✗ ${f}`));
  console.error('\nFix the drift above (or update the engine/skill docs) before relying on the pipeline.\n');
  process.exit(1);
}
console.log('[doctor] OK — engine assumptions match the codebase.\n');
