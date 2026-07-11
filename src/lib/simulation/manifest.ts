// The Simulation MANIFEST — the declarative single source of truth for a simulator.
//
// A simulation is authored as two separated concerns (Problem 13: never mix metadata, runtime, and
// rendering):
//   - SimulationManifest  = pure DATA authored ONCE: identity, concepts, equations, educational
//     prose, SEO, and the authored content surfaces (examples, FAQ, guide). Build-time generators
//     read this to emit the tool config, knowledge overlay, FAQ, guide registration, and SEO — so
//     the same fact is never re-typed across knowledge.ts / faq.ts / Guide.astro / config.ts.
//   - SimulationModel     = pure BEHAVIOR: init/step, measurement compute, graph sampling, pointer
//     handling, narrative, and draw. No educational prose, no SEO.
//
// `defFromSimulation` flattens the two halves into the runtime `SimulationDef` the engine and the
// widget already consume, so the split is real at authoring time while the runtime is unchanged.

import type {
  FormulaDef,
  GraphDef,
  MeasurementDef,
  ParamDef,
  PointerControl,
  Preset,
  SimState,
  SimulationDef,
  Viewport,
} from './types';
import type { IntentGroups, RelationshipReference, WorkflowStage } from '@lib/knowledge/types';

/** Bump when the manifest shape changes incompatibly; lets V1/V2 manifests coexist mid-migration. */
export const SIMULATION_SCHEMA_VERSION = 1 as const;

export interface SimulationMetadata {
  /** Display name, e.g. 'Projectile Motion Simulator'. */
  title: string;
  /** Tool slug (kebab), e.g. 'projectile-motion-simulator'. */
  slug: string;
  /** Runtime simulation id == SimulationDef.id, e.g. 'projectile-motion'. */
  processorId: string;
  /** Subject plugin, e.g. 'physics'. */
  domain: string;
  /** categorySlug, e.g. 'physics'. */
  category: string;
  /** family string, e.g. 'mechanics'. */
  family: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  /** e.g. 'high-school', 'introductory-college'. */
  schoolLevel?: string;
  /** e.g. '5 min'. */
  estimatedLearningTime?: string;
  prerequisites?: string[];
  nextTopics?: string[];
  curriculumTags?: string[];
  learningObjectives: string[];
  keyTakeaways: string[];
  references?: { label: string; url?: string }[];
}

export interface ConceptSet {
  /** 1-2 canonical concepts, weighted highest for the knowledge graph. */
  primary: string[];
  secondary: string[];
  related?: string[];
  /** Extra surface forms for the EntityMatcher (beyond concepts + title). */
  aliases?: string[];
}

export interface EquationVariable {
  symbol: string;
  label: string;
  unit: string;
  /** Links the symbol to a live param or measurement (for generated worked examples). */
  paramId?: string;
  measurementId?: string;
}

export interface Equation {
  id: string;
  symbol: string;
  /** Human-readable expression, e.g. 'R = v squared times sin(2 theta) / g'. No em-dashes. */
  expression: string;
  description: string;
  variables: EquationVariable[];
}

export interface EducationalMeta {
  /** Knowledge-graph summary, <= 160 chars. */
  summary: string;
  intentGroups: IntentGroups;
  /** Short misconception statements for the knowledge graph. */
  commonMistakes: string[];
  realWorldUseCases: string[];
  audience: string[];
  workflowStage: WorkflowStage[];
}

export interface SeoMeta {
  /** seoTitle for the tool page (~40-52 chars). */
  title: string;
  /** Meta description (<= 160 chars). */
  description: string;
  keywords: string[];
}

/** A widget "real-world example" card. */
export interface ExampleCard {
  title: string;
  body: string;
}

/** One authored FAQ. The question also seeds knowledge.commonQuestions. */
export interface FaqEntry {
  question: string;
  answer: string;
}

/** A common-mistake block rendered in the generated guide (prose, not just the short statement). */
export interface GuideMistake {
  heading: string;
  body: string;
  /** ReferenceBlock variant; defaults to 'common-mistake'. */
  type?: 'common-mistake' | 'note';
}

/** One generated guide body section (a heading + a paragraph of authored prose). */
export interface GuideSection {
  id: string;
  heading: string;
  body: string;
}

/** The authored guide content, expanded by the generator into a rendered guide page. */
export interface GuideManifest {
  slug: string;
  title: string;
  /** Guide meta description, <= 160 chars. */
  description: string;
  readMinutes: number;
  updatedAt: string;
  /** The Quick Answer paragraph (definition + key equation + the CTA is auto-appended). */
  quickAnswer: string;
  /** Concept sections after the Quick Answer (How X Works, ...). */
  sections: GuideSection[];
  /** The Common Mistakes blocks. */
  mistakes: GuideMistake[];
}

/** Authored relationship overlay (non-derivable workflow edges). */
export interface RelationshipOverlay {
  usedWith?: RelationshipReference[];
  alternatives?: RelationshipReference[];
  nextSteps?: RelationshipReference[];
}

/** Tool-page presentation metadata that maps to ToolConfig. */
export interface PresentationMeta {
  tags: string[];
  updatedAt: string;
  isNew?: boolean;
  trustVariant?: 'private' | 'offline' | 'local';
}

/** The declarative half: everything a generator needs to emit content, SEO, and relationships. */
export interface SimulationManifest {
  schemaVersion: typeof SIMULATION_SCHEMA_VERSION;
  metadata: SimulationMetadata;
  concepts: ConceptSet;
  equations: Equation[];
  educational: EducationalMeta;
  seo: SeoMeta;
  presentation: PresentationMeta;
  examples: ExampleCard[];
  faq: FaqEntry[];
  guide: GuideManifest;
  relationships?: RelationshipOverlay;
  // Declarative runtime shape also surfaced to the widget at build time:
  paramBehavior: 'continuous' | 'restart';
  aspect?: number;
  params: ParamDef[];
  presets: Preset[];
  formula?: FormulaDef;
}

/** The behavior half: pure runtime + rendering, no educational content. */
export interface SimulationModel {
  init(params: Record<string, number>): Record<string, number>;
  step(s: SimState, dt: number): void;
  measurements: MeasurementDef[];
  graph?: GraphDef;
  pointer?: PointerControl;
  observations: ((s: SimState) => string | null)[];
  explanation(s: SimState): string;
  draw(ctx: CanvasRenderingContext2D, s: SimState, vp: Viewport): void;
}

/** The authored artifact for a new-style simulator: one manifest + one model. */
export interface Simulation {
  manifest: SimulationManifest;
  model: SimulationModel;
}

/** Flatten a manifest + model into the runtime `SimulationDef` the engine and widget consume. */
export function defFromSimulation(sim: Simulation): SimulationDef {
  const { manifest, model } = sim;
  return {
    id: manifest.metadata.processorId,
    aspect: manifest.aspect,
    paramBehavior: manifest.paramBehavior,
    params: manifest.params,
    presets: manifest.presets,
    formula: manifest.formula,
    init: model.init,
    step: model.step,
    measurements: model.measurements,
    graph: model.graph,
    pointer: model.pointer,
    observations: model.observations,
    explanation: model.explanation,
    draw: model.draw,
  };
}
