// CSV report renderer — flattens scored opportunities into a spreadsheet-friendly table. Pure and
// deterministic (RFC-4180 quoting). No external deps.

import type { ResearchReports } from '../models/report';

const COLUMNS = [
  'id',
  'proposedTool',
  'title',
  'transformation',
  'proposedEngine',
  'engineExists',
  'gap',
  'status',
  'difficulty',
  'searchDemand',
  'competitionScore',
  'evergreenScore',
  'implementationCost',
  'engineReuse',
  'seoPotential',
  'topicClusterPotential',
  'localizationPotential',
  'confidence',
  'finalScore',
] as const;

function cell(v: unknown): string {
  const s = String(v ?? '');
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

export function opportunitiesCsv(r: ResearchReports): string {
  const rows = [COLUMNS.join(',')];
  for (const o of r.opportunities) {
    rows.push(COLUMNS.map(c => cell((o as Record<string, unknown>)[c])).join(','));
  }
  return rows.join('\n') + '\n';
}
