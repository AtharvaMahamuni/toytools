/**
 * seo:status — the pipeline orchestrator. Inspects the filesystem, the
 * content-graph snapshot, and the last audit report, then tells the agent
 * exactly where this tool is in the content pipeline and what command to run
 * next. Always the first command to run; nextActions[0].command is meant to be
 * executed verbatim.
 *
 * Usage:
 *   tsx scripts/status.ts <slug> [--json]   single-tool state + next actions
 *   tsx scripts/status.ts                   site-wide table (slug × state × score)
 *
 * (--json prints a parseable object to stdout; run npm with --silent.)
 */

import { execSync } from 'node:child_process';
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadContentGraph, type GraphTool } from './utils/tool-profile.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const PROJECT = join(ROOT, '..');

type ToolState =
  | 'needs-research'
  | 'needs-extract'
  | 'needs-scaffold'
  | 'needs-writing'
  | 'needs-registration'
  | 'needs-audit'
  | 'failing-gate'
  | 'done';

interface NextAction {
  step: string;
  command: string;
  why: string;
}

interface StatusChecks {
  researchPresent: boolean;
  researchAgeDays: number | null;
  rawPagesFetched: number;
  scaffoldPresent: boolean;
  scaffoldStale: boolean;
  guideAuthored: boolean;
  faqAuthored: boolean;
  knowledgeAuthored: boolean;
  guideRegistered: boolean;
  faqRegistered: boolean;
  knowledgeRegistered: boolean;
  auditPresent: boolean;
  auditStale: boolean;
  lastOverallScore: number | null;
  gatePass: boolean | null;
}

interface ToolStatus {
  slug: string;
  state: ToolState;
  checks: StatusChecks;
  nextActions: NextAction[];
  definitionOfDone: string[];
}

function mtime(p: string): number | null {
  try {
    return statSync(p).mtimeMs;
  } catch {
    return null;
  }
}

function buildStatus(slug: string, tool: GraphTool): ToolStatus {
  const researchJson = join(ROOT, 'research', 'processed', slug, 'research.json');
  const rawDir = join(ROOT, 'research', 'raw', slug);
  const promptMd = join(ROOT, 'output', slug, 'PROMPT.md');
  const toolDir = join(PROJECT, 'src', 'tools', tool.segment, slug);
  const guidePath = join(toolDir, 'Guide.astro');
  const faqPath = join(toolDir, 'faq.ts');
  const knowledgePath = join(toolDir, 'knowledge.ts');
  const reportJson = join(ROOT, 'reports', `tool-content-intelligence-${slug}.json`);

  const researchMtime = mtime(researchJson);
  const rawPagesFetched = existsSync(rawDir)
    ? readdirSync(rawDir).filter(f => /^result-\d+\.html$/.test(f)).length
    : 0;
  const promptMtime = mtime(promptMd);
  const guideMtime = mtime(guidePath);
  const faqMtime = mtime(faqPath);
  const reportMtime = mtime(reportJson);

  let lastOverallScore: number | null = null;
  let gatePass: boolean | null = null;
  if (reportMtime !== null) {
    try {
      const report = JSON.parse(readFileSync(reportJson, 'utf-8'));
      lastOverallScore = report.overall ?? null;
      gatePass = report.gate?.pass ?? null;
    } catch {}
  }

  const contentMtime = Math.max(guideMtime ?? 0, faqMtime ?? 0);
  const checks: StatusChecks = {
    researchPresent: researchMtime !== null,
    researchAgeDays: researchMtime !== null ? Math.round((Date.now() - researchMtime) / 86400000) : null,
    rawPagesFetched,
    scaffoldPresent: promptMtime !== null,
    scaffoldStale: promptMtime !== null && researchMtime !== null && promptMtime < researchMtime,
    guideAuthored: guideMtime !== null,
    faqAuthored: faqMtime !== null,
    knowledgeAuthored: existsSync(knowledgePath),
    guideRegistered: tool.guideRegistered && tool.hasGuideConfig,
    faqRegistered: tool.faqRegistered,
    knowledgeRegistered: tool.knowledgeRegistered,
    auditPresent: reportMtime !== null,
    auditStale: reportMtime !== null && contentMtime > reportMtime,
    lastOverallScore,
    gatePass,
  };

  const actions: NextAction[] = [];
  let state: ToolState;

  // Research/scaffold only gate the path while guide/faq are still missing. A
  // tool with both goes straight to the knowledge → registration → audit → gate
  // loop; fresh research is optional enrichment for an existing tool, and
  // knowledge.ts is an authored overlay that needs no SERP research.
  const fullyAuthored = checks.guideAuthored && checks.faqAuthored;

  if (fullyAuthored) {
    if (!checks.knowledgeAuthored) {
      state = 'needs-writing';
      actions.push({
        step: 'write-knowledge',
        command: `npm run seo:gate -- ${slug}`,
        why: `Guide and FAQ exist but src/tools/${tool.segment}/${slug}/knowledge.ts is missing. Author it (overlay fields only: concepts, intents, use cases, mistakes, questions, usedWith/alternatives/nextSteps) and register it in src/lib/knowledge/registry.ts; the audit's Knowledge Sync section then checks it stays consistent. No research needed.`,
      });
      return {
        slug,
        state,
        checks,
        nextActions: actions,
        definitionOfDone: [
          'Guide.astro, faq.ts, and knowledge.ts exist and are registered (graph shows all three)',
          'npm run build passes',
          `npm run seo:gate -- ${slug} exits 0`,
        ],
      };
    }
    if (!checks.guideRegistered || !checks.faqRegistered || !checks.knowledgeRegistered) {
      state = 'needs-registration';
      const missing = [
        !checks.guideRegistered && 'guide (config.ts guide field + src/pages/guide/[...slug].astro import + registeredGuideSlugs)',
        !checks.faqRegistered && 'faq (src/data/faq-registry.ts)',
        !checks.knowledgeRegistered && 'knowledge (src/lib/knowledge/registry.ts)',
      ].filter(Boolean).join('; ');
      actions.push({
        step: 'register',
        command: 'npm run seo:graph && npm run build',
        why: `Authored but not registered: ${missing}. Apply the registration snippets from output/${slug}/PROMPT.md (run seo:scaffold first if it doesn't exist), then re-export the graph and build.`,
      });
    } else if (!checks.auditPresent || checks.auditStale) {
      state = 'needs-audit';
      actions.push({
        step: 'audit',
        command: `npm run seo:gate -- ${slug}`,
        why: checks.auditPresent ? 'Content changed since the last audit' : 'No audit run yet for this tool',
      });
    } else if (checks.gatePass === false) {
      state = 'failing-gate';
      actions.push({
        step: 'fix',
        command: `npm run seo:gate -- ${slug}`,
        why: `Last audit scored ${lastOverallScore}/100 and failed the gate. Apply the High Impact actions in seo-engine/reports/tool-content-intelligence-${slug}.json, then re-run (max 3 iterations; report remaining actions after that).`,
      });
    } else {
      state = 'done';
    }
    return {
      slug,
      state,
      checks,
      nextActions: actions,
      definitionOfDone: [
        'Guide.astro, faq.ts, and knowledge.ts exist and are registered (graph shows all three)',
        'npm run build passes',
        `npm run seo:gate -- ${slug} exits 0`,
      ],
    };
  }

  if (!checks.researchPresent) {
    if (rawPagesFetched > 0) {
      state = 'needs-extract';
      actions.push({
        step: 'extract',
        command: `npm run seo:extract -- ${slug}`,
        why: `${rawPagesFetched} raw competitor page(s) fetched but research.json not built yet`,
      });
    } else if (existsSync(join(rawDir, 'search-results.json'))) {
      state = 'needs-research';
      actions.push({
        step: 'fetch',
        command: `npm run seo:fetch -- ${slug}`,
        why: 'SERP discovery ran but fetched zero pages (likely bot-blocked). Curate competitor URLs in research/raw/' + slug + '/search-results.json, then fetch.',
      });
    } else {
      state = 'needs-research';
      actions.push({
        step: 'research',
        command: `npm run seo:research -- ${slug}`,
        why: 'No research collected for this tool yet',
      });
    }
  } else if (!checks.scaffoldPresent || checks.scaffoldStale) {
    state = 'needs-scaffold';
    actions.push({
      step: 'scaffold',
      command: `npm run seo:scaffold -- ${slug}`,
      why: checks.scaffoldPresent
        ? 'Research is newer than the scaffold; regenerate the authoring brief'
        : 'Research is ready; generate the authoring brief (output/' + slug + '/PROMPT.md)',
    });
  } else {
    state = 'needs-writing';
    const missing = [
      !checks.guideAuthored && 'Guide.astro',
      !checks.faqAuthored && 'faq.ts',
      !checks.knowledgeAuthored && 'knowledge.ts',
    ].filter(Boolean).join(', ');
    actions.push({
      step: 'write',
      command: `cat ${join('seo-engine', 'output', slug, 'PROMPT.md')}`,
      why: `Missing in src/tools/${tool.segment}/${slug}/: ${missing}. Follow the brief in output/${slug}/PROMPT.md (it contains the style contract, section spec, and registration snippets).`,
    });
  }

  return {
    slug,
    state,
    checks,
    nextActions: actions,
    definitionOfDone: [
      'Guide.astro, faq.ts, and knowledge.ts exist and are registered (graph shows all three)',
      'npm run build passes',
      `npm run seo:gate -- ${slug} exits 0`,
    ],
  };
}

// ─── CLI ──────────────────────────────────────────────────────────────────────

const args = process.argv.slice(2);
const jsonMode = args.includes('--json');
const slug = args.find(a => !a.startsWith('--'));
const log = jsonMode ? console.error : console.log;

// Refresh the snapshot so registration state is never stale
try {
  execSync('npx tsx scripts/export-content-graph.ts', { cwd: PROJECT, stdio: 'pipe' });
} catch (e) {
  console.error('[status] could not regenerate content-graph.json:', (e as Error).message);
  process.exit(1);
}

const graph = loadContentGraph();

if (slug) {
  const tool = graph[slug];
  if (!tool) {
    console.error(`[status] unknown tool slug "${slug}". Registered slugs:\n  ${Object.keys(graph).join('\n  ')}`);
    process.exit(1);
  }
  const status = buildStatus(slug, tool);

  if (jsonMode) {
    console.log(JSON.stringify(status, null, 2));
  } else {
    const c = status.checks;
    const mark = (v: boolean) => (v ? '✓' : '✗');
    log(`\n=== seo:status — ${slug} ===\n`);
    log(`State: ${status.state}\n`);
    log(`${mark(c.researchPresent)} research${c.researchPresent ? ` (${c.researchAgeDays}d old, ${c.rawPagesFetched} pages)` : ''}`);
    log(`${mark(c.scaffoldPresent && !c.scaffoldStale)} scaffold${c.scaffoldStale ? ' (stale)' : ''}`);
    log(`${mark(c.guideAuthored)} Guide.astro   ${mark(c.faqAuthored)} faq.ts   ${mark(c.knowledgeAuthored)} knowledge.ts`);
    log(`${mark(c.guideRegistered)} guide registered   ${mark(c.faqRegistered)} faq registered   ${mark(c.knowledgeRegistered)} knowledge registered`);
    log(`${mark(c.auditPresent && !c.auditStale)} audit${c.auditStale ? ' (stale)' : ''}${c.lastOverallScore !== null ? ` — overall ${c.lastOverallScore}/100, gate ${c.gatePass ? 'PASS' : 'FAIL'}` : ''}`);
    log('');
    if (status.nextActions.length > 0) {
      log('Next:');
      for (const a of status.nextActions) {
        log(`  $ ${a.command}`);
        log(`    ${a.why}`);
      }
    } else {
      log('Done — all stages complete and the gate passes.');
    }
    log('');
  }
} else {
  // Site-wide table
  const rows = Object.entries(graph).map(([s, tool]) => {
    const st = buildStatus(s, tool);
    return { slug: s, state: st.state, score: st.checks.lastOverallScore };
  });

  if (jsonMode) {
    console.log(JSON.stringify(rows, null, 2));
  } else {
    const width = Math.max(...rows.map(r => r.slug.length));
    log(`\n=== seo:status — all ${rows.length} tools ===\n`);
    const order: ToolState[] = ['needs-research', 'needs-extract', 'needs-scaffold', 'needs-writing', 'needs-registration', 'needs-audit', 'failing-gate', 'done'];
    rows.sort((a, b) => order.indexOf(a.state) - order.indexOf(b.state) || a.slug.localeCompare(b.slug));
    for (const r of rows) {
      log(`  ${r.slug.padEnd(width)}  ${r.state.padEnd(18)}  ${r.score !== null ? r.score + '/100' : ''}`);
    }
    log(`\nRun: npm run seo:status -- <slug>  for next actions on one tool.\n`);
  }
}
