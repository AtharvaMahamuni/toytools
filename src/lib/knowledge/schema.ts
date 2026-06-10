// Pure, never-throwing validation of a Knowledge object. Returns a result the build-time
// gate (scripts/validate-knowledge.ts) and tests consume. No I/O, no registry lookups here —
// cross-reference resolution (slugs that must exist) lives in the build script + graph.

import {
  KNOWLEDGE_SCHEMA_VERSION,
  WORKFLOW_STAGES,
  type Knowledge,
  type RelationshipReference,
  type WorkflowStage,
} from './types';

export interface ValidationResult {
  ok: boolean;
  errors: string[];
}

const SUMMARY_MAX = 160;

function isNonEmptyString(v: unknown): v is string {
  return typeof v === 'string' && v.trim().length > 0;
}

function isStringArray(v: unknown): v is string[] {
  return Array.isArray(v) && v.every(x => typeof x === 'string');
}

function validateRefs(
  field: string,
  refs: unknown,
  selfSlug: string,
  errors: string[],
): void {
  if (!Array.isArray(refs)) {
    errors.push(`"${selfSlug}": ${field} must be an array of relationship references`);
    return;
  }
  refs.forEach((ref, i) => {
    const r = ref as RelationshipReference;
    if (!r || typeof r !== 'object') {
      errors.push(`"${selfSlug}": ${field}[${i}] must be an object with a slug`);
      return;
    }
    if (!isNonEmptyString(r.slug)) {
      errors.push(`"${selfSlug}": ${field}[${i}] missing slug`);
    }
    if (r.slug === selfSlug) {
      errors.push(`"${selfSlug}": ${field}[${i}] references itself`);
    }
    if (r.reason !== undefined && typeof r.reason !== 'string') {
      errors.push(`"${selfSlug}": ${field}[${i}] reason must be a string`);
    }
    if (r.strength !== undefined && (typeof r.strength !== 'number' || r.strength < 0 || r.strength > 1)) {
      errors.push(`"${selfSlug}": ${field}[${i}] strength must be a number in [0,1]`);
    }
    if (r.priority !== undefined && typeof r.priority !== 'number') {
      errors.push(`"${selfSlug}": ${field}[${i}] priority must be a number`);
    }
  });
}

/** Validate a single Knowledge object's shape. Never throws. */
export function validateKnowledge(k: unknown): ValidationResult {
  const errors: string[] = [];

  if (!k || typeof k !== 'object') {
    return { ok: false, errors: ['knowledge entry is not an object'] };
  }
  const kn = k as Partial<Knowledge>;
  const slug = typeof kn.slug === 'string' ? kn.slug : '(unknown)';

  if (kn.schemaVersion !== KNOWLEDGE_SCHEMA_VERSION) {
    errors.push(`"${slug}": schemaVersion must be ${KNOWLEDGE_SCHEMA_VERSION} (got ${String(kn.schemaVersion)})`);
  }
  if (!isNonEmptyString(kn.slug)) errors.push(`"${slug}": missing slug`);
  if (!isNonEmptyString(kn.title)) errors.push(`"${slug}": missing title`);
  if (!isNonEmptyString(kn.category)) errors.push(`"${slug}": missing category`);
  if (!isNonEmptyString(kn.summary)) {
    errors.push(`"${slug}": missing summary`);
  } else if (kn.summary.length > SUMMARY_MAX) {
    errors.push(`"${slug}": summary too long (${kn.summary.length} chars, max ${SUMMARY_MAX})`);
  }

  if (!isStringArray(kn.primaryConcepts) || kn.primaryConcepts.length === 0) {
    errors.push(`"${slug}": primaryConcepts must be a non-empty string array`);
  }
  if (!isStringArray(kn.secondaryConcepts)) {
    errors.push(`"${slug}": secondaryConcepts must be a string array`);
  }
  if (!isStringArray(kn.keywords)) errors.push(`"${slug}": keywords must be a string array`);
  if (!isStringArray(kn.entityAliases)) errors.push(`"${slug}": entityAliases must be a string array`);
  if (!isStringArray(kn.realWorldUseCases)) errors.push(`"${slug}": realWorldUseCases must be a string array`);
  if (!isStringArray(kn.commonMistakes)) errors.push(`"${slug}": commonMistakes must be a string array`);
  if (!isStringArray(kn.commonQuestions)) errors.push(`"${slug}": commonQuestions must be a string array`);

  // intentGroups — every bucket must be a string array
  const ig = kn.intentGroups as Record<string, unknown> | undefined;
  if (!ig || typeof ig !== 'object') {
    errors.push(`"${slug}": intentGroups must be an object`);
  } else {
    for (const bucket of ['informational', 'howTo', 'comparison', 'misconception', 'troubleshooting']) {
      if (!isStringArray(ig[bucket])) {
        errors.push(`"${slug}": intentGroups.${bucket} must be a string array`);
      }
    }
  }

  // workflowStage — every entry must be a known stage
  if (!Array.isArray(kn.workflowStage) || kn.workflowStage.length === 0) {
    errors.push(`"${slug}": workflowStage must be a non-empty array`);
  } else {
    for (const stage of kn.workflowStage) {
      if (!WORKFLOW_STAGES.includes(stage as WorkflowStage)) {
        errors.push(`"${slug}": invalid workflowStage "${String(stage)}"`);
      }
    }
  }

  validateRefs('usedWith', kn.usedWith, slug, errors);
  validateRefs('alternatives', kn.alternatives, slug, errors);
  validateRefs('nextSteps', kn.nextSteps, slug, errors);
  if (kn.relatedTools !== undefined) validateRefs('relatedTools', kn.relatedTools, slug, errors);

  return { ok: errors.length === 0, errors };
}
