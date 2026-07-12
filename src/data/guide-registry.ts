// Source of truth for which tool slugs have a guide wired into the guide route.
//
// Guide registration is DERIVED from the filesystem: authoring
// src/tools/<segment>/<slug>/Guide.astro registers it (`guide-registry.generated.ts` is written by
// `npm run registries:generate`). The guide route (src/pages/guide/[...slug].astro) discovers the
// same components with import.meta.glob, so the list and the route map cannot drift: both derive
// from Guide.astro presence on disk. This module stays free of `.astro` imports so it can be
// imported by scripts/validate-registry.ts under tsx, which cannot parse Astro components.
// validate-registry checks every tool that declares `guide:` appears here.

import { authoredGuideSlugs } from './guide-registry.generated';

export const registeredGuideSlugs = authoredGuideSlugs;

export type RegisteredGuideSlug = (typeof registeredGuideSlugs)[number];

// Simulation guides are rendered generically by SimulationGuide.astro from their manifest, so they
// are NOT in the authored list above (no Guide.astro on disk) but ARE registered guides. Adding
// them to the set keeps validate-registry's "tool declares a guide -> must be registered" check
// satisfied.
import { simulationGuideSlugs } from '@lib/simulation/derived';

export const registeredGuideSlugSet: ReadonlySet<string> = new Set([
  ...registeredGuideSlugs,
  ...simulationGuideSlugs,
]);
