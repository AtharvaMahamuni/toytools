// The Simulation MANIFEST — the declarative single source of truth for a simulator.
//
// A simulation is authored as two separated concerns (Problem 13: never mix metadata, runtime, and
// rendering):
//   - SimulationManifest  = pure DATA: educational metadata, concepts, equations, SEO, plus the
//     declarative param/preset/formula shape. This is what build-time generators read to emit the
//     tool config, knowledge overlay, FAQ, guide, related tools, SEO, and JSON-LD. No closures.
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
  commonMistakes: string[];
  realWorldUseCases: string[];
  commonQuestions: string[];
}

export interface SeoMeta {
  /** seoTitle for the tool page (~40-52 chars). */
  title: string;
  /** Meta description (<= 160 chars). */
  description: string;
  keywords: string[];
}

/** The declarative half: everything a generator needs to emit content, SEO, and relationships. */
export interface SimulationManifest {
  schemaVersion: typeof SIMULATION_SCHEMA_VERSION;
  metadata: SimulationMetadata;
  concepts: ConceptSet;
  equations: Equation[];
  educational: EducationalMeta;
  seo: SeoMeta;
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
