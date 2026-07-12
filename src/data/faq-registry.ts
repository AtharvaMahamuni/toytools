import type { FAQItem } from './types';
import { simulationFaqsBySlug } from '@lib/simulation/derived';
import { authoredFaqsBySlug } from './faq-registry.generated';

// FAQ registration is DERIVED from the filesystem: authoring src/tools/<segment>/<slug>/faq.ts
// registers it (via `npm run registries:generate`, run automatically by scaffold:tool).
// Simulation FAQs are derived from their manifests and merged in the same way.
export const faqsByToolSlug: Record<string, FAQItem[]> = {
  ...simulationFaqsBySlug,
  ...authoredFaqsBySlug,
};
