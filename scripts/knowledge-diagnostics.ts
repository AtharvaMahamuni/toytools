// Post-build diagnostics writer. Builds the knowledge graph and writes a snapshot to
// dist/knowledge-graph.json — a build-time health artifact (not shipped to the browser,
// not linked). Runs after `astro build`. Non-fatal: it reports brokenLinks but does not
// fail the build (validate-knowledge already gates unresolved references pre-build).

import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { graph } from '../src/lib/knowledge/graph';
import { buildDiagnostics } from '../src/lib/knowledge/diagnostics';
import { KNOWLEDGE_ENTRIES } from '../src/lib/knowledge/registry';
import { KNOWLEDGE_SCHEMA_VERSION } from '../src/lib/knowledge/types';
import { tools } from '../src/data/registry';

const diagnostics = buildDiagnostics({
  graph,
  schemaVersion: KNOWLEDGE_SCHEMA_VERSION,
  toolCount: tools.length,
  knowledgeCount: KNOWLEDGE_ENTRIES.length,
});

const dir = 'dist';
if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
writeFileSync(`${dir}/knowledge-graph.json`, JSON.stringify(diagnostics, null, 2));

console.log(
  `[knowledge-diagnostics] ${diagnostics.nodes} nodes, ${diagnostics.edges} edges, ` +
  `coverage ${diagnostics.knowledgeCoverage}%, ${diagnostics.orphanCount} orphan(s), ` +
  `${diagnostics.brokenLinks.length} broken link(s) → dist/knowledge-graph.json`,
);

if (diagnostics.brokenLinks.length > 0) {
  console.warn('[knowledge-diagnostics] broken links:', diagnostics.brokenLinks.join(', '));
}
