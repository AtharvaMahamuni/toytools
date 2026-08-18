// Build-time knowledge gate. Mirrors validate-registry.ts: collects errors and exits non-zero
// to fail the build. Adds a non-fatal warnings channel. Runs after validate-registry in the
// build pipeline.
//
// ERROR (fail build): invalid knowledge shape, schemaVersion mismatch, slug/category mismatch
//   with the tool, unresolved relationship target, duplicate knowledge slug.
// WARN (pass build): tool has no knowledge file (unless KNOWLEDGE_REQUIRED=true), empty
//   usedWith/nextSteps, single-family recommendation bubble.

import { tools } from '../src/data/registry';
import { KNOWLEDGE_ENTRIES, buildKnowledgeMap } from '../src/lib/knowledge/registry';
import { validateKnowledge } from '../src/lib/knowledge/schema';
import { isSingleFamilyBubble } from '../src/lib/knowledge/diversity';
import { getRelatedTools, relatedCandidates } from '../src/lib/tools/related';
import type { RelationshipReference } from '../src/lib/knowledge/types';

const KNOWLEDGE_REQUIRED = process.env.KNOWLEDGE_REQUIRED === 'true';

const toolBySlug = new Map(tools.map(t => [t.slug, t]));
const knowledgeMap = buildKnowledgeMap(KNOWLEDGE_ENTRIES);

const errors: string[] = [];
const warnings: string[] = [];

// Duplicate knowledge slugs
const seen = new Set<string>();
for (const kn of KNOWLEDGE_ENTRIES) {
  if (seen.has(kn.slug)) errors.push(`Duplicate knowledge slug: "${kn.slug}"`);
  seen.add(kn.slug);
}

// Per-knowledge validation + cross-reference resolution
for (const kn of KNOWLEDGE_ENTRIES) {
  const result = validateKnowledge(kn);
  if (!result.ok) result.errors.forEach(e => errors.push(e));

  const tool = toolBySlug.get(kn.slug);
  if (!tool) {
    errors.push(`Knowledge "${kn.slug}" has no matching tool in the registry`);
    continue;
  }
  if (kn.category !== tool.categorySlug) {
    errors.push(`Knowledge "${kn.slug}" category "${kn.category}" !== tool categorySlug "${tool.categorySlug}"`);
  }

  // Every relationship target must resolve to a real tool
  const checkRefs = (field: string, refs: RelationshipReference[]) => {
    for (const r of refs) {
      if (!toolBySlug.has(r.slug)) {
        errors.push(`Knowledge "${kn.slug}": ${field} references unknown tool "${r.slug}"`);
      }
    }
  };
  checkRefs('usedWith', kn.usedWith);
  checkRefs('alternatives', kn.alternatives);
  checkRefs('nextSteps', kn.nextSteps);
  if (kn.relatedTools) checkRefs('relatedTools', kn.relatedTools);

  // WARN — encouraged-but-optional curation
  if (kn.usedWith.length === 0 && kn.nextSteps.length === 0) {
    warnings.push(`Knowledge "${kn.slug}" has no usedWith or nextSteps — consider adding workflow links`);
  }

  // ERROR — recommendation bubble. Every related tool shares the source's family AND the catalog
  // offered another one. That is a link graph sealing itself into clusters, and it is now a build
  // failure rather than a warning nobody read for months. A category that genuinely holds one
  // family is exempt structurally, inside isSingleFamilyBubble, not by a list of slugs here.
  const related = getRelatedTools(tool, tools, 5);
  if (isSingleFamilyBubble(tool, related, relatedCandidates(tool, tools))) {
    errors.push(
      `Knowledge "${kn.slug}": all ${related.length} related tools are family "${tool.family}" ` +
      `while other families are available. The derivation reserves a slot for one ` +
      `(src/lib/tools/related.ts); if that is not reaching this tool, say why in the PR.`,
    );
  }
}

// Coverage — WARN (or ERROR when KNOWLEDGE_REQUIRED) for tools lacking a knowledge file
const missing = tools.filter(t => !knowledgeMap.has(t.slug)).map(t => t.slug);
if (missing.length > 0) {
  const msg = `${missing.length} tool(s) have no knowledge.ts: ${missing.join(', ')}`;
  if (KNOWLEDGE_REQUIRED) errors.push(msg);
  else warnings.push(msg);
}

// Report
if (warnings.length > 0) {
  console.warn('\n[validate-knowledge] Warnings:\n');
  warnings.forEach(w => console.warn(`  ⚠ ${w}`));
}

if (errors.length > 0) {
  console.error('\n[validate-knowledge] Errors found:\n');
  errors.forEach(e => console.error(`  ✗ ${e}`));
  console.error(`\n${errors.length} error(s). Fix before building.\n`);
  process.exit(1);
} else {
  const covered = tools.length - missing.length;
  console.log(`[validate-knowledge] OK — ${KNOWLEDGE_ENTRIES.length} knowledge files, ${covered}/${tools.length} tools covered.`);
}
