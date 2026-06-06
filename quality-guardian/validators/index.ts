import { buildIntegrityValidator } from './build-integrity.js';
import { metadataValidator } from './metadata.js';
import { canonicalValidator } from './canonical.js';
import { robotsValidator } from './robots.js';
import { sitemapValidator } from './sitemap.js';
import { internalLinksValidator } from './internal-links.js';
import { orphanPagesValidator } from './orphan-pages.js';
import { urlIntegrityValidator } from './url-integrity.js';
import { contentIntegrityValidator } from './content-integrity.js';
import { accessibilityValidator } from './accessibility.js';
import { performanceValidator } from './performance.js';
import { structuredDataValidator } from './structured-data.js';
import type { Validator } from '../types/index.js';

// Phase 2A: runs on every PR and push — target <60s, no Lighthouse
// internal-links MUST run before orphan-pages (populates ctx.inboundLinks)
export const PHASE_2A_VALIDATORS: Validator[] = [
  buildIntegrityValidator,
  metadataValidator,
  canonicalValidator,
  robotsValidator,
  sitemapValidator,
  internalLinksValidator,  // must precede orphan-pages
  orphanPagesValidator,
  urlIntegrityValidator,
  contentIntegrityValidator,
];

// Phase 2B: runs in weekly full audit only
export const PHASE_2B_VALIDATORS: Validator[] = [
  accessibilityValidator,
  performanceValidator,
  structuredDataValidator,
];

export const ALL_VALIDATORS: Validator[] = [
  ...PHASE_2A_VALIDATORS,
  ...PHASE_2B_VALIDATORS,
];
