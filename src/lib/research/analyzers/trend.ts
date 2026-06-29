// Trend analyzer — aggregates opportunities by transformation to surface where demand concentrates.
// Pure, deterministic.

import type { Opportunity } from '../models/opportunity';
import type { TrendEntry } from '../models/report';

export function analyzeTrends(opportunities: Opportunity[]): TrendEntry[] {
  const byT = new Map<string, Opportunity[]>();
  for (const o of opportunities) {
    const list = byT.get(o.transformation) ?? [];
    list.push(o);
    byT.set(o.transformation, list);
  }
  const trends: TrendEntry[] = [];
  for (const [transformation, members] of byT) {
    trends.push({
      transformation,
      count: members.length,
      meanDemand: round2(members.reduce((s, m) => s + m.searchDemand, 0) / members.length),
      meanScore: round1(members.reduce((s, m) => s + m.finalScore, 0) / members.length),
    });
  }
  return trends.sort(
    (a, b) => b.count - a.count || b.meanScore - a.meanScore || a.transformation.localeCompare(b.transformation),
  );
}

function round1(n: number): number {
  return Math.round(n * 10) / 10;
}
function round2(n: number): number {
  return Math.round(n * 100) / 100;
}
