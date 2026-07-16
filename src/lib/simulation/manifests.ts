// The registry of simulation MANIFESTS — the declarative single source of truth for every sim's
// content (config, knowledge, FAQ, guide, SEO). Adding a simulator: author one manifest + one model
// and add the manifest here. Everything else is derived (see derived.ts) and spread into the site
// registries, so there are no per-tool config/knowledge/faq/Guide files to hand-sync.

import type { SimulationManifest } from './manifest';
import { manifest as projectileMotion } from './simulations/projectile-motion.manifest';
import { manifest as waveSpeed } from './simulations/wave-speed.manifest';
import { manifest as frequencyPeriod } from './simulations/frequency-period.manifest';
import { manifest as pendulum } from './simulations/pendulum.manifest';
import { manifest as heatTransfer } from './simulations/heat-transfer.manifest';
import { manifest as ohmsLaw } from './simulations/ohms-law.manifest';
import { manifest as shmSpring } from './simulations/shm-spring.manifest';
import { manifest as idealGasLaw } from './simulations/ideal-gas-law.manifest';
import { manifest as momentumCollision } from './simulations/momentum-collision.manifest';
import { manifest as inclinedPlane } from './simulations/inclined-plane.manifest';
import { manifest as dopplerEffect } from './simulations/doppler-effect.manifest';
import { manifest as unitCircle } from './simulations/unit-circle.manifest';
import { manifest as quadratic } from './simulations/quadratic.manifest';
import { manifest as probability } from './simulations/probability.manifest';

export const MANIFESTS: SimulationManifest[] = [projectileMotion, waveSpeed, frequencyPeriod, pendulum, heatTransfer, ohmsLaw, shmSpring, idealGasLaw, momentumCollision, inclinedPlane, dopplerEffect, unitCircle, quadratic, probability];

export const manifestBySlug = new Map(MANIFESTS.map((m) => [m.metadata.slug, m]));
export const manifestByProcessorId = new Map(MANIFESTS.map((m) => [m.metadata.processorId, m]));
