// The registry of simulation MANIFESTS — the declarative single source of truth for every sim's
// content (config, knowledge, FAQ, guide, SEO). Adding a simulator: author one manifest + one model
// and add the manifest here. Everything else is derived (see derived.ts) and spread into the site
// registries, so there are no per-tool config/knowledge/faq/Guide files to hand-sync.

import type { SimulationManifest } from './manifest';
import { manifest as projectileMotion } from './simulations/projectile-motion.manifest';
import { manifest as waveSpeed } from './simulations/wave-speed.manifest';
import { manifest as frequencyPeriod } from './simulations/frequency-period.manifest';

export const MANIFESTS: SimulationManifest[] = [projectileMotion, waveSpeed, frequencyPeriod];

export const manifestBySlug = new Map(MANIFESTS.map((m) => [m.metadata.slug, m]));
export const manifestByProcessorId = new Map(MANIFESTS.map((m) => [m.metadata.processorId, m]));
