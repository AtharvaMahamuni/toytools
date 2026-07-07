// Boot/orchestration layer for the Physics Playground — finds every [data-physics-sim]
// widget on the page, lazy-loads its one simulation module, and wires the shared UI
// (playback bar, sliders, presets, measurement cards, formula panel, graph, observations,
// live region) to the simulation loop. PhysicsWidget.astro renders the markup at build
// time; this module only reads data-* hooks, so the two form one contract.
//
// Browser-glue module — excluded from unit coverage; exercised by the Playwright suite.

import { loadSimulation } from './loader';
import { createLoop, type SimulationLoop } from './loop';
import { observeResize, readPalette, sizeCanvas } from './canvas';
import { createGraphRenderer, type GraphRenderer } from './graph';
import { formatQuantity, formatWithUnit } from './format';
import type { MeasurementDef, ParamDef, SimState, SimulationDef, Viewport } from './types';

/** Frames between measurement/formula readout refreshes (~10 Hz at 60 fps). */
const READOUT_EVERY = 6;
/** Frames between observation/explanation refreshes (~2 Hz at 60 fps). */
const NARRATIVE_EVERY = 30;

interface ToyToolsState {
  state?: {
    save(id: string, data: unknown): void;
    load(id: string): { params?: Record<string, number> } | null;
  };
}

export function initPhysicsWidgets(doc: Document = document): void {
  doc.querySelectorAll<HTMLElement>('[data-physics-sim]').forEach((root) => {
    void bootWidget(root);
  });
}

async function bootWidget(root: HTMLElement): Promise<void> {
  const id = root.getAttribute('data-simulation-id') ?? '';
  try {
    const def = await loadSimulation(id);
    wire(root, def);
  } catch {
    // Never surface as a pageerror/unhandled rejection — show the static fallback instead.
    root.querySelector('[data-sim-fallback]')?.removeAttribute('hidden');
  }
}

function wire(root: HTMLElement, def: SimulationDef): void {
  const slug = root.getAttribute('data-slug') ?? def.id;
  const canvas = root.querySelector<HTMLCanvasElement>('[data-sim-canvas]');
  if (!canvas) return;
  const graphCanvas = root.querySelector<HTMLCanvasElement>('[data-sim-graph]');
  const playBtn = root.querySelector<HTMLButtonElement>('[data-sim-play]');
  const resetBtn = root.querySelector<HTMLButtonElement>('[data-sim-reset]');
  const speedBtns = [...root.querySelectorAll<HTMLButtonElement>('[data-sim-speed]')];
  const presetBtns = [...root.querySelectorAll<HTMLButtonElement>('[data-sim-preset]')];
  const sliders = [...root.querySelectorAll<HTMLInputElement>('input[data-param]')];
  const observationsEl = root.querySelector<HTMLElement>('[data-sim-observations]');
  const explanationEl = root.querySelector<HTMLElement>('[data-sim-explanation]');
  const liveEl = root.querySelector<HTMLElement>('[data-sim-live]');

  const paramDefs = new Map<string, ParamDef>(def.params.map((p) => [p.id, p]));
  const measurementDefs = new Map<string, MeasurementDef>(def.measurements.map((m) => [m.id, m]));
  const tt = (window as unknown as { ToyTools?: ToyToolsState }).ToyTools;

  // ── State: defaults ← saved params (clamped), vars derived by the model ──────────────────
  const params: Record<string, number> = {};
  for (const p of def.params) params[p.id] = p.default;
  const saved = tt?.state?.load(slug)?.params;
  if (saved) {
    for (const p of def.params) {
      const v = Number(saved[p.id]);
      if (Number.isFinite(v)) params[p.id] = Math.min(Math.max(v, p.min), p.max);
    }
  }
  const state: SimState = { t: 0, params, vars: def.init(params) };

  // ── Canvases ──────────────────────────────────────────────────────────────────────────────
  let palette = readPalette();
  const aspect = def.aspect ?? 16 / 9;
  let stage = sizeCanvas(canvas, aspect, palette);
  let graphStage = graphCanvas ? sizeCanvas(graphCanvas, 5 / 2, palette) : null;
  const graph: GraphRenderer | null = def.graph ? createGraphRenderer(def.graph) : null;

  function resizeCanvases(): void {
    stage = sizeCanvas(canvas!, aspect, palette);
    if (graphCanvas) graphStage = sizeCanvas(graphCanvas, 5 / 2, palette);
    render();
  }

  function render(): void {
    if (stage) def.draw(stage.ctx, state, stage.viewport as Viewport);
    if (graph && graphStage) graph.draw(graphStage.ctx, state, graphStage.viewport as Viewport);
  }

  // ── Readouts ──────────────────────────────────────────────────────────────────────────────
  function updateReadouts(): void {
    for (const m of def.measurements) {
      const el = root.querySelector<HTMLElement>(`[data-measurement="${m.id}"]`);
      if (el) el.textContent = formatWithUnit(m.compute(state), m.unit, m.decimals ?? 2);
    }
    if (def.formula) {
      for (const term of def.formula.terms) {
        const el = root.querySelector<HTMLElement>(`[data-term-value="${term.symbol}"]`);
        if (!el) continue;
        if (term.paramId) {
          const p = paramDefs.get(term.paramId);
          if (p) el.textContent = formatWithUnit(state.params[p.id], p.unit, p.decimals ?? 2);
        } else if (term.measurementId) {
          const m = measurementDefs.get(term.measurementId);
          if (m) el.textContent = formatWithUnit(m.compute(state), m.unit, m.decimals ?? 2);
        }
      }
    }
  }

  function updateNarrative(): void {
    if (observationsEl) {
      observationsEl.textContent = '';
      for (const rule of def.observations) {
        const text = rule(state);
        if (!text) continue;
        const li = document.createElement('li');
        li.textContent = text;
        observationsEl.appendChild(li);
      }
    }
    if (explanationEl) explanationEl.textContent = def.explanation(state);
  }

  /** One polite screen-reader summary — updated on user actions only, never at frame rate. */
  function updateLiveSummary(): void {
    if (!liveEl) return;
    const parts = def.measurements
      .filter((m) => !m.hidden)
      .map((m) => `${m.label} ${formatWithUnit(m.compute(state), m.unit, m.decimals ?? 2)}`);
    liveEl.textContent = parts.join(', ') + '.';
  }

  function persist(): void {
    tt?.state?.save(slug, { params: state.params });
  }

  // ── Loop ──────────────────────────────────────────────────────────────────────────────────
  let frameCount = 0;
  const loop: SimulationLoop = createLoop({
    step(dt) {
      // Suspend integration while the user holds a draggable element (e.g. the pendulum bob).
      if (def.pointer?.isHolding?.(state)) return;
      def.step(state, dt);
      graph?.push(state);
    },
    render() {
      render();
      frameCount++;
      if (frameCount % READOUT_EVERY === 0) updateReadouts();
      if (frameCount % NARRATIVE_EVERY === 0) updateNarrative();
    },
  });

  function reflectPlayState(): void {
    if (!playBtn) return;
    const running = loop.running();
    playBtn.setAttribute('aria-pressed', String(running));
    playBtn.textContent = running ? 'Pause' : 'Play';
  }

  function refreshAll(): void {
    render();
    updateReadouts();
    updateNarrative();
    updateLiveSummary();
  }

  /** A parameter changed: apply the def's paramBehavior, then refresh every surface. */
  function onParamsChanged(): void {
    if (def.paramBehavior === 'restart') {
      state.t = 0;
      state.vars = def.init(state.params);
      graph?.reset();
    }
    refreshAll();
    persist();
  }

  // ── Controls ──────────────────────────────────────────────────────────────────────────────
  for (const slider of sliders) {
    const pid = slider.getAttribute('data-param') ?? '';
    const p = paramDefs.get(pid);
    if (!p) continue;
    slider.value = String(state.params[pid]);
    const out = root.querySelector<HTMLElement>(`[data-param-value="${pid}"]`);
    const reflect = () => {
      if (out) out.textContent = formatWithUnit(state.params[pid], p.unit, p.decimals ?? 2);
    };
    reflect();
    slider.addEventListener('input', () => {
      const v = Number(slider.value);
      if (!Number.isFinite(v)) return;
      state.params[pid] = Math.min(Math.max(v, p.min), p.max);
      reflect();
      onParamsChanged();
    });
  }

  function setSliderTo(pid: string, value: number): void {
    const p = paramDefs.get(pid);
    if (!p) return;
    state.params[pid] = Math.min(Math.max(value, p.min), p.max);
    const slider = sliders.find((s) => s.getAttribute('data-param') === pid);
    if (slider) slider.value = String(state.params[pid]);
    const out = root.querySelector<HTMLElement>(`[data-param-value="${pid}"]`);
    if (out) out.textContent = formatWithUnit(state.params[pid], p.unit, p.decimals ?? 2);
  }

  for (const btn of presetBtns) {
    btn.addEventListener('click', () => {
      let values: Record<string, number> = {};
      try {
        values = JSON.parse(btn.getAttribute('data-values') ?? '{}');
      } catch {
        return;
      }
      for (const pid of Object.keys(values)) setSliderTo(pid, values[pid]);
      onParamsChanged();
    });
  }

  playBtn?.addEventListener('click', () => {
    loop.toggle();
    reflectPlayState();
    if (!loop.running()) updateLiveSummary();
  });

  resetBtn?.addEventListener('click', () => {
    for (const p of def.params) setSliderTo(p.id, p.default);
    state.t = 0;
    state.vars = def.init(state.params);
    graph?.reset();
    refreshAll();
    persist();
  });

  for (const btn of speedBtns) {
    btn.addEventListener('click', () => {
      const s = Number(btn.getAttribute('data-sim-speed'));
      if (!Number.isFinite(s)) return;
      loop.setSpeed(s);
      for (const other of speedBtns) other.setAttribute('aria-pressed', String(other === btn));
    });
  }

  // ── Direct manipulation: drag/tap the wave, bob, or blocks on the canvas ─────────────────
  if (def.pointer) {
    const hintEl = root.querySelector<HTMLElement>('[data-sim-hint]');
    const TAP_MS = 250;
    const TAP_MOVE = 0.02;
    let dragging = false;
    let downX = 0;
    let downY = 0;
    let downTime = 0;
    let moved = false;

    const coords = (ev: globalThis.PointerEvent): { x: number; y: number } => {
      const rect = canvas.getBoundingClientRect();
      return {
        x: rect.width ? (ev.clientX - rect.left) / rect.width : 0,
        y: rect.height ? (ev.clientY - rect.top) / rect.height : 0,
      };
    };

    const dispatch = (type: 'down' | 'move' | 'up' | 'tap', x: number, y: number): void => {
      const changes = def.pointer!.handle(state, { type, x, y, t: performance.now() / 1000 });
      if (changes) {
        for (const pid of Object.keys(changes)) setSliderTo(pid, changes[pid]);
      }
      // The handler may have set state.vars directly; never restart here — it owns vars.
      refreshAll();
      if (changes) persist();
    };

    canvas.addEventListener('pointerdown', (ev) => {
      ev.preventDefault();
      canvas.setPointerCapture(ev.pointerId);
      hintEl?.setAttribute('hidden', '');
      dragging = true;
      moved = false;
      const c = coords(ev);
      downX = c.x;
      downY = c.y;
      downTime = performance.now();
      dispatch('down', c.x, c.y);
    });
    canvas.addEventListener('pointermove', (ev) => {
      if (!dragging) return;
      const c = coords(ev);
      if (Math.abs(c.x - downX) > TAP_MOVE || Math.abs(c.y - downY) > TAP_MOVE) moved = true;
      dispatch('move', c.x, c.y);
    });
    const endDrag = (ev: globalThis.PointerEvent): void => {
      if (!dragging) return;
      dragging = false;
      const c = coords(ev);
      // A quick, still press is a tap (distinct gesture, e.g. tempo tap / +5 °C bump).
      if (!moved && performance.now() - downTime < TAP_MS) dispatch('tap', c.x, c.y);
      else dispatch('up', c.x, c.y);
    };
    canvas.addEventListener('pointerup', endDrag);
    canvas.addEventListener('pointercancel', endDrag);
  }

  // ── Environment: resize, tab visibility, theme changes ───────────────────────────────────
  observeResize(canvas.parentElement ?? canvas, resizeCanvases);

  let pausedByVisibility = false;
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      pausedByVisibility = loop.running();
      loop.pause();
      reflectPlayState();
    } else if (pausedByVisibility) {
      pausedByVisibility = false;
      loop.play();
      reflectPlayState();
    }
  });

  const onThemeChange = () => {
    palette = readPalette();
    resizeCanvases();
  };
  new MutationObserver(onThemeChange).observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['data-theme'],
  });
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener?.('change', onThemeChange);

  // ── First paint. Reduced motion starts paused on a static frame; Play stays available. ───
  refreshAll();
  reflectPlayState();
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!reduceMotion) {
    loop.play();
    reflectPlayState();
  }
}
