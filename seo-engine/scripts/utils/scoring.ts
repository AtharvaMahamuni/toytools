import type { ResearchDocument, SeoScore, GeoScore } from '../../types/index.js';

const COMPARISON_RE = /\bvs\.?\b|\bversus\b|\bdifference\b|\bcompare(d|s)?\b|\bcomparison\b|\bvariation|\balternative/i;
const TROUBLESHOOT_RE = /\bnot working\b|\berror\b|\bfix\b|\btroubleshoot\b|\bfailed\b|\bissue\b|\bmistake|\bavoid\b|\bproblem|\bpitfall|\bwrong\b/i;
const DEFINITION_RE = /^(what is|what are|what does|define|definition)/i;

export function calculateSeoScore(doc: ResearchDocument): SeoScore {
  let score = 0;
  const issues: string[] = [];

  if (doc.entities.length >= 5) {
    score += 20;
    if (doc.entities.length >= 10) score += 10;
  } else {
    issues.push(`Too few entities (${doc.entities.length}/5 minimum)`);
  }

  if (doc.questions.length >= 10) {
    score += 20;
    if (doc.questions.length >= 20) score += 10;
  } else {
    issues.push(`Too few questions (${doc.questions.length}/10 minimum)`);
  }

  if (doc.contentGaps.length >= 3) {
    score += 15;
  } else {
    issues.push(`Insufficient content gaps detected (${doc.contentGaps.length}/3 minimum)`);
  }

  if (doc.competitorHeadings.length >= 5) {
    score += 15;
  } else {
    issues.push(`Too few competitor headings (${doc.competitorHeadings.length}/5 minimum)`);
  }

  if (doc.competitorFaqs.length >= 3) {
    score += 10;
  } else {
    issues.push(`Missing competitor FAQs (${doc.competitorFaqs.length}/3 minimum)`);
  }

  if (doc.primaryIntent) {
    score += 10;
  } else {
    issues.push('Primary intent not detected');
  }

  if (doc.secondaryIntent) {
    score += 5;
  } else {
    issues.push('Secondary intent not detected');
  }

  return { score: Math.min(score, 100), issues };
}

export function calculateGeoScore(doc: ResearchDocument): GeoScore {
  let score = 0;
  const issues: string[] = [];

  const allQuestions = [...doc.questions, ...doc.competitorFaqs];

  const hasDefinition = allQuestions.some(q => DEFINITION_RE.test(q));
  if (hasDefinition) {
    score += 20;
  } else {
    issues.push('No definition-style questions found (What is...)');
  }

  const hasComparison = allQuestions.some(q => COMPARISON_RE.test(q));
  if (hasComparison) {
    score += 20;
  } else {
    issues.push('No comparison-style questions found (vs / difference)');
  }

  const hasTroubleshoot = allQuestions.some(q => TROUBLESHOOT_RE.test(q));
  if (hasTroubleshoot) {
    score += 15;
  } else {
    issues.push('No troubleshooting questions found (error / fix / not working)');
  }

  if (doc.entities.length >= 5) {
    score += 20;
  } else {
    issues.push(`Insufficient entity coverage for GEO (${doc.entities.length}/5)`);
  }

  if (doc.competitorFaqs.length >= 3) {
    score += 15;
  } else {
    issues.push('Not enough competitor FAQs for extractable snippets');
  }

  if (doc.relatedTopics.length > 0) {
    score += 10;
  } else {
    issues.push('No related topics identified');
  }

  return { score: Math.min(score, 100), issues };
}
