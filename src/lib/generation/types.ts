// Generation Engine — types.
//
// A generator turns a small set of OPTIONS into an OUTPUT (a password, a UUID, placeholder
// text, a QR matrix). Every generator is one object implementing the `Generator` interface.
// The shared GeneratorWidget never names a generator; it reads the field schema at build time
// and calls ToyTools.runGeneration(id, options) at runtime, which resolves through the registry.
// Adding a generator is a new strategy file plus one map entry — no widget/runtime/route change.
//
// Randomness lives INSIDE generate() (crypto.getRandomValues / crypto.randomUUID), never at module
// top-level, so importing a strategy is side-effect-free and the engine stays testable in Node.

/** The kinds of form control the shared widget can render from a field schema. */
export type GeneratorFieldType = 'number' | 'range' | 'boolean' | 'select' | 'text' | 'textarea';

/** One declarative option control. The widget renders these; it has no per-tool knowledge. */
export interface GeneratorField {
  /** Stable key used in the options object passed to generate(). */
  id: string;
  label: string;
  type: GeneratorFieldType;
  default: number | string | boolean;
  /** number / range bounds. */
  min?: number;
  max?: number;
  step?: number;
  /** select options. */
  options?: { value: string; label: string }[];
  /** text / textarea placeholder. */
  placeholder?: string;
  /** textarea height in rows (default 6). Fixed, never auto-growing: a box that resizes while
   *  somebody is pasting into it moves every control under their thumb. */
  rows?: number;
  /** Short helper line rendered under the control. */
  help?: string;
  /** Groups boolean toggles under a shared heading (e.g. "Character sets"). */
  group?: string;
  /**
   * Marks this field as the tool's declared craft affordance, rendered as data-craft.
   *
   * Generator craft is an option rather than a panel: the touch IS the control. check-craft.ts
   * fails the build if a declared id never reaches the DOM, so the marker has to live on the field
   * that carries it rather than on the widget generally.
   */
  craft?: string;
  /** Conditional visibility — show only when another field matches (equals, or is one of oneOf). */
  showWhen?: { field: string; equals?: string; oneOf?: string[] };
}

/** Raw option values keyed by field id, collected from the form. */
export type GeneratorOptions = Record<string, number | string | boolean>;

/**
 * One line of fact about THIS result that the user cannot see, with an optional one-tap fix.
 *
 * The craft seam for the generation engine, and the reason four chance tools are not the same page
 * with a different processorId. Each generator supplies its own domain knowledge (a coin knows what
 * a lopsided run costs, a name list knows that a duplicate doubles somebody's odds) and returns
 * undefined when it has nothing true to say, which is a legitimate answer rather than a gap.
 *
 * The widget renders it through the shared CraftNote: one line, no box, hidden when absent.
 */
export interface GenerationNote {
  /** The fact, in the user's terms, in one sentence. */
  text: string;
  /** Optional follow-through: replace one option field's value with a repaired one. */
  fix?: {
    /** Button label, phrased as what the user gets ("Split into 7 options"). */
    label: string;
    /** Field id to rewrite. */
    field: string;
    /** The repaired value. */
    value: string;
  };
}

/** A labelled output badge (entropy, character pool size, module count…). */
export interface GeneratorMeta {
  label: string;
  value: string;
}

/** Password-style strength summary, rendered as a 5-step indicator. */
export interface GeneratorStrength {
  score: 0 | 1 | 2 | 3 | 4;
  label: string;
}

/** The QR payload the widget rasterizes to canvas (PNG) and SVG. */
export interface QrResult {
  /** Square boolean grid; true = dark module. */
  modules: boolean[][];
  /** Grid side length (modules.length). */
  count: number;
  /** The exact encoded string (also what "Copy content" copies). */
  content: string;
}

/** The result of one generate() call. Never thrown — the error path is a value. */
export interface GenerationResult {
  ok: boolean;
  /** 'text' → single string; 'lines' → many strings (e.g. UUID batch); 'qr' → a matrix. */
  kind: 'text' | 'lines' | 'qr';
  text?: string;
  lines?: string[];
  qr?: QrResult;
  /** Output badges (entropy, pool size…). */
  meta?: GeneratorMeta[];
  /** Optional strength indicator (passwords / random strings). */
  strength?: GeneratorStrength;
  /** Which downloads the widget should offer (QR: png + svg). */
  downloads?: ('png' | 'svg')[];
  /** This generator's one thoughtful touch, or undefined when it has nothing to say. */
  note?: GenerationNote;
  error?: string;
}

export interface Generator {
  /** Stable lookup id == ToolConfig.processorId, unique across the engine. */
  id: string;
  /** Grouping used by discovery systems (related tools, search, clustering). */
  family: string;
  /** The option controls the widget renders (build-time schema). */
  fields: GeneratorField[];
  /** Produce output on first load (all five current generators: true). */
  autoGenerate?: boolean;
  /** Recompute on every option change (lorem/qr). Others regenerate only on button press. */
  live?: boolean;
  /**
   * This generator may return a `note`, so the widget renders the CraftNote slot for it.
   *
   * Explicit rather than inferred: a generator whose craft is an OPTION (password-generator marks
   * its exclude-ambiguous field) must not also get an empty note element, or two elements would
   * carry the same data-craft and the wiring check would pass for the wrong one.
   */
  notes?: boolean;
  /** Pure aside from crypto randomness. Never throws — the error path returns { ok:false }. */
  generate(options: GeneratorOptions): GenerationResult;
}
