// Physics Playground Engine — the SimulationDef contract every simulation implements.
//
// A simulation is CONFIG + PURE FUNCTIONS: parameter/preset declarations, an init() that
// derives the integration variables, a step() that advances them, measurement/observation/
// explanation rules, and a draw(). Everything else — the animation loop, DPR-aware canvases,
// sliders, measurement cards, the live formula panel, the graph, persistence, accessibility —
// is shared engine code (loop.ts / canvas.ts / graph.ts / boot.ts) and never changes per tool.
// Adding a simulation is: one model file + one draw file + one registry line + a tool folder.
//
// Model modules must stay pure (no DOM, no browser APIs) so they clear the unit-coverage gate;
// *.draw.ts files own all CanvasRenderingContext2D work and are excluded from coverage.

/** A user-adjustable simulation parameter, rendered as a slider at build time. */
export interface ParamDef {
  id: string;
  label: string;
  /** Display unit, e.g. 'Hz', 'm', '°C'. Empty string for unitless. */
  unit: string;
  min: number;
  max: number;
  step: number;
  default: number;
  /** Decimal places for the live value readout (default 2). */
  decimals?: number;
}

/** A named parameter combination ("Moon", "Boiling water") applied as one click. */
export interface Preset {
  id: string;
  label: string;
  /** paramId → value. Every key must reference a declared param, every value be in range. */
  values: Record<string, number>;
}

/** The full mutable simulation state the loop advances. */
export interface SimState {
  /** Simulated elapsed time in seconds. step() owns advancing it. */
  t: number;
  /** Current parameter values, keyed by ParamDef.id. */
  params: Record<string, number>;
  /** Integration variables derived by init() (e.g. pendulum theta/omega). */
  vars: Record<string, number>;
}

/** Theme colors resolved from the CSS custom properties at boot (canvas can't use var()). */
export interface Palette {
  ink: string;
  muted: string;
  accent: string;
  accentSubtle: string;
  bg: string;
  surface: string;
  border: string;
  danger: string;
}

/** CSS-pixel drawing surface info. The context is pre-scaled by dpr — draw in CSS pixels. */
export interface Viewport {
  width: number;
  height: number;
  dpr: number;
  palette: Palette;
}

/** A live readout card. compute() must be pure and total (finite for any in-range state). */
export interface MeasurementDef {
  id: string;
  label: string;
  unit: string;
  decimals?: number;
  /** Feed the formula panel without rendering a measurement card. */
  hidden?: boolean;
  compute(s: SimState): number;
}

/** One symbol in the formula panel; its live value comes from a param or a measurement. */
export interface FormulaTerm {
  symbol: string;
  label: string;
  paramId?: string;
  measurementId?: string;
}

/** The live formula panel: a display expression plus the terms substituted beneath it. */
export interface FormulaDef {
  /** Human-readable expression, e.g. 'v = f × λ'. */
  expression: string;
  terms: FormulaTerm[];
  /**
   * Optional right-hand-side template used to render a live "worked" line, with {paramId}
   * placeholders substituted for the current values, e.g. '{frequency} × {wavelength}'. When the
   * formula has editable inputs (paramId terms), the panel shows: outputSymbol = <this> = answer.
   */
  substitution?: string;
}

export interface GraphSeries {
  id: string;
  label: string;
  /** Palette key used to stroke this series. */
  color: 'accent' | 'danger' | 'ink' | 'muted';
  /**
   * snapshot mode: value at spatial coordinate x for the current state.
   * stream mode: current value (x is unused); the renderer keeps the rolling history.
   */
  sample(s: SimState, x: number): number;
}

/** An animated line graph beneath the simulation. */
export interface GraphDef {
  xLabel: string;
  yLabel: string;
  /** 'snapshot' resamples series across xRange each frame; 'stream' traces values against s.t. */
  mode: 'snapshot' | 'stream';
  /** stream mode: seconds of history kept on screen (default 8). */
  window?: number;
  /** snapshot mode: the sampled spatial domain. */
  xRange?(s: SimState): [number, number];
  yRange(s: SimState): [number, number];
  series: GraphSeries[];
}

/** A normalized pointer event on the simulation canvas. x/y are 0..1 of the CSS drawing area. */
export interface PointerEvent {
  type: 'down' | 'move' | 'up' | 'tap';
  x: number;
  y: number;
  /** Wall-clock seconds (boot fills performance.now()/1000) — used for tap-tempo input. */
  t: number;
}

/** Direct-manipulation seam: grab the wave/bob/block on the canvas instead of only sliders. */
export interface PointerControl {
  /** Caption shown over the canvas until the first interaction. */
  hint: string;
  /**
   * Pure handler. Returns param changes to apply (routed through the same clamped path as
   * sliders), or null to ignore. May read/write s.vars for grab-and-release style drags
   * (e.g. holding the pendulum bob); boot.ts calls it on every pointer event.
   */
  handle(s: SimState, ev: PointerEvent): Record<string, number> | null;
  /** True while a drag should suspend the physics step (e.g. holding the bob still). */
  isHolding?(s: SimState): boolean;
}

export interface SimulationDef {
  /** Must equal the module filename and the tool's processorId. */
  id: string;
  /** Canvas width/height ratio (default 16/9). */
  aspect?: number;
  /**
   * What a parameter change means mid-flight:
   * 'continuous' — the wave keeps travelling with the new value (vars untouched, t preserved);
   * 'restart'    — the experiment restarts from the new initial conditions (t=0, vars re-derived).
   */
  paramBehavior: 'continuous' | 'restart';
  params: ParamDef[];
  presets: Preset[];
  /** Derive integration variables from parameter values. Pure. */
  init(params: Record<string, number>): Record<string, number>;
  /** Advance the state by dt seconds (including s.t). Called at a fixed substep. Pure. */
  step(s: SimState, dt: number): void;
  measurements: MeasurementDef[];
  formula?: FormulaDef;
  graph?: GraphDef;
  /** Optional direct-manipulation on the canvas (drag the wave/bob/block). */
  pointer?: PointerControl;
  /** Ordered rules; each returns a sentence for the current state or null to stay silent. */
  observations: ((s: SimState) => string | null)[];
  /** A short contextual paragraph explaining what the current state shows. */
  explanation(s: SimState): string;
  /** Render the scene. Lives in the sibling *.draw.ts file, never in the model. */
  draw(ctx: CanvasRenderingContext2D, s: SimState, vp: Viewport): void;
}
