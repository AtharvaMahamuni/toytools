// Sim-specific JSON-LD (Problem 14): simulators are interactive educational resources, so beyond the
// generic SoftwareApplication/FAQPage schema every tool emits, a sim page also advertises a
// LearningResource (what it teaches, level, the equations) and a HowTo (how to drive it). Both are
// DERIVED from the manifest, so they stay in sync with the content. Pure builders returning plain
// JSON-LD objects; the tool page serializes them.

import type { SimulationManifest } from './manifest';

/** Convert an "N min" learning-time hint to an ISO-8601 duration (PT5M). Undefined if unparseable. */
function isoDuration(t?: string): string | undefined {
  if (!t) return undefined;
  const m = /(\d+)\s*min/i.exec(t);
  if (m) return `PT${m[1]}M`;
  const h = /(\d+)\s*h/i.exec(t);
  if (h) return `PT${h[1]}H`;
  return undefined;
}

/** A LearningResource node describing the simulator as educational content. */
export function learningResourceSchema(manifest: SimulationManifest, url: string): Record<string, unknown> {
  const md = manifest.metadata;
  const concepts = [...manifest.concepts.primary, ...manifest.concepts.secondary];
  const teaches: Record<string, unknown>[] = concepts.map((c) => ({ '@type': 'DefinedTerm', name: c }));
  for (const eq of manifest.equations) {
    teaches.push({ '@type': 'DefinedTerm', name: `${eq.symbol}: ${eq.expression}`, description: eq.description });
  }
  const duration = isoDuration(md.estimatedLearningTime);
  return {
    '@context': 'https://schema.org',
    '@type': 'LearningResource',
    name: md.title,
    url,
    inLanguage: 'en',
    isAccessibleForFree: true,
    learningResourceType: 'Interactive simulation',
    educationalUse: 'Simulation',
    interactivityType: 'active',
    ...(md.schoolLevel ? { educationalLevel: md.schoolLevel } : {}),
    ...(duration ? { timeRequired: duration } : {}),
    abstract: manifest.educational.summary,
    about: manifest.concepts.primary.map((c) => ({ '@type': 'Thing', name: c })),
    teaches,
  };
}

/** A HowTo node describing how to operate the simulator, built from its params and primary equation. */
export function howToSchema(manifest: SimulationManifest, url: string): Record<string, unknown> {
  const paramNames = manifest.params.map((p) => p.label).join(', ');
  const eq = manifest.equations[0];
  const step = [
    {
      '@type': 'HowToStep',
      name: 'Set the inputs',
      text: `Adjust ${paramNames} with the sliders, or load one of the presets.`,
    },
    {
      '@type': 'HowToStep',
      name: 'Run the simulation',
      text: 'Play the animation and drag directly on the canvas to explore how the system responds.',
    },
    {
      '@type': 'HowToStep',
      name: 'Read the results',
      text: eq
        ? `Watch the live readouts update through ${eq.expression}.`
        : 'Watch the live measurement readouts update as you change the inputs.',
    },
  ];
  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: `How to use the ${manifest.metadata.title}`,
    description: manifest.seo.description,
    url,
    totalTime: isoDuration(manifest.metadata.estimatedLearningTime) ?? 'PT2M',
    step,
  };
}

/** Both sim-specific JSON-LD nodes for a manifest, ready to serialize on the tool page. */
export function simulationSchemas(manifest: SimulationManifest, url: string): Record<string, unknown>[] {
  return [learningResourceSchema(manifest, url), howToSchema(manifest, url)];
}
