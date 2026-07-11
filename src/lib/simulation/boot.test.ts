// @vitest-environment happy-dom
//
// Integration test for the boot orchestrator. happy-dom has no 2D canvas raster, so we prime
// each canvas with a mock context (draw/graph become no-ops) and drive the DOM the way a user
// would: move sliders, click presets/reset/play/speed, and dispatch pointer drags. This asserts
// the whole wiring — readouts, formula, presets, reset, play state, and direct manipulation —
// against the REAL wave-speed SimulationDef, so it can't drift from the engine.
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { initSimulations } from './boot';
import { SIMULATIONS } from './simulations/registry';
import { primeCanvas } from './mock-ctx.testutil';
import type { SimulationDef } from './types';

let rafCb: FrameRequestCallback | null = null;

function stubEnv(reduce = false): void {
  rafCb = null;
  vi.stubGlobal('devicePixelRatio', 1);
  vi.stubGlobal('requestAnimationFrame', (cb: FrameRequestCallback) => {
    rafCb = cb;
    return 1;
  });
  vi.stubGlobal('cancelAnimationFrame', () => {
    rafCb = null;
  });
  const mm = (q: string) => ({
    matches: q.includes('reduced-motion') ? reduce : false,
    media: q,
    onchange: null,
    addEventListener() {},
    removeEventListener() {},
    addListener() {},
    removeListener() {},
    dispatchEvent: () => false,
  });
  vi.stubGlobal('matchMedia', mm);
  (window as unknown as { matchMedia: typeof mm }).matchMedia = mm;
}

/** Build the exact data-* DOM SimulationWidget renders for a simulation, into document.body. */
function mountWidget(def: SimulationDef, slug: string): HTMLElement {
  const root = document.createElement('section');
  root.setAttribute('data-physics-sim', '');
  root.setAttribute('data-simulation-id', def.id);
  root.setAttribute('data-slug', slug);

  const wrap = document.createElement('div');
  const canvas = document.createElement('canvas');
  canvas.setAttribute('data-sim-canvas', '');
  const fallback = document.createElement('p');
  fallback.setAttribute('data-sim-fallback', '');
  fallback.setAttribute('hidden', '');
  const hint = document.createElement('p');
  hint.setAttribute('data-sim-hint', '');
  wrap.append(canvas, hint, fallback);
  root.append(wrap);

  const play = document.createElement('button');
  play.setAttribute('data-sim-play', '');
  play.setAttribute('aria-pressed', 'false');
  play.textContent = 'Play';
  const reset = document.createElement('button');
  reset.setAttribute('data-sim-reset', '');
  root.append(play, reset);

  for (const sp of [0.25, 0.5, 1, 2]) {
    const b = document.createElement('button');
    b.setAttribute('data-sim-speed', String(sp));
    b.setAttribute('aria-pressed', sp === 1 ? 'true' : 'false');
    root.append(b);
  }

  for (const p of def.params) {
    const slider = document.createElement('input');
    slider.type = 'range';
    slider.id = `${slug}-${p.id}`;
    slider.setAttribute('data-param', p.id);
    slider.min = String(p.min);
    slider.max = String(p.max);
    slider.step = String(p.step);
    slider.value = String(p.default);
    const out = document.createElement('output');
    out.setAttribute('data-param-value', p.id);
    root.append(slider, out);
  }

  for (const preset of def.presets) {
    const b = document.createElement('button');
    b.setAttribute('data-sim-preset', '');
    b.setAttribute('data-values', JSON.stringify(preset.values));
    b.textContent = preset.label;
    root.append(b);
  }

  for (const m of def.measurements) {
    const span = document.createElement('span');
    span.setAttribute('data-measurement', m.id);
    span.textContent = '—';
    root.append(span);
  }
  if (def.formula) {
    for (const term of def.formula.terms) {
      const span = document.createElement('span');
      span.setAttribute('data-term-value', term.symbol);
      root.append(span);
    }
  }
  if (def.graph) {
    const g = document.createElement('canvas');
    g.setAttribute('data-sim-graph', '');
    root.append(g);
  }

  const obs = document.createElement('ul');
  obs.setAttribute('data-sim-observations', '');
  const exp = document.createElement('p');
  exp.setAttribute('data-sim-explanation', '');
  const live = document.createElement('p');
  live.setAttribute('data-sim-live', '');
  root.append(obs, exp, live);

  document.body.append(root);
  // Prime both canvases so sizeCanvas() succeeds and draw/graph run.
  root.querySelectorAll('canvas').forEach((c) => primeCanvas(c as HTMLCanvasElement, 600));
  return root;
}

function slider(root: HTMLElement, id: string): HTMLInputElement {
  return root.querySelector<HTMLInputElement>(`input[data-param="${id}"]`)!;
}
function measurement(root: HTMLElement, id: string): string {
  return root.querySelector<HTMLElement>(`[data-measurement="${id}"]`)!.textContent ?? '';
}
async function flush(): Promise<void> {
  await new Promise((r) => setTimeout(r, 0));
}

const wave = SIMULATIONS['wave-speed'];

afterEach(() => {
  document.body.innerHTML = '';
  vi.unstubAllGlobals();
});

describe('boot — wiring the wave-speed widget', () => {
  beforeEach(() => stubEnv(false));

  it('populates measurements, formula, observations, and explanation on init', async () => {
    const root = mountWidget(wave, 'wave-speed-simulator');
    initSimulations(document);
    await flush();

    // v = f × λ = 1 × 2 = 2.00 m/s at defaults.
    expect(measurement(root, 'waveSpeed')).toMatch(/2\.00 m\/s/);
    expect(root.querySelector('[data-term-value="v"]')!.textContent).toMatch(/2\.00 m\/s/);
    expect(root.querySelector('[data-param-value="frequency"]')!.textContent).toMatch(/1\.00 Hz/);
    expect(root.querySelector('[data-sim-observations]')!.children.length).toBeGreaterThan(0);
    expect(root.querySelector('[data-sim-explanation]')!.textContent!.length).toBeGreaterThan(10);
    expect(root.querySelector('[data-sim-live]')!.textContent).toMatch(/Wave speed/);
    // Autoplay (not reduced motion) → button offers Pause and scheduled a frame.
    expect(root.querySelector('[data-sim-play]')!.getAttribute('aria-pressed')).toBe('true');
    expect(rafCb).not.toBeNull();
  });

  it('recomputes when a slider moves', async () => {
    const root = mountWidget(wave, 'wave-speed-simulator');
    initSimulations(document);
    await flush();

    const freq = slider(root, 'frequency');
    freq.value = '2';
    freq.dispatchEvent(new Event('input', { bubbles: true }));
    // v = 2 × 2 = 4.00 m/s.
    expect(measurement(root, 'waveSpeed')).toMatch(/4\.00 m\/s/);
    expect(root.querySelector('[data-param-value="frequency"]')!.textContent).toMatch(/2\.00 Hz/);
  });

  it('applies a preset to every declared parameter', async () => {
    const root = mountWidget(wave, 'wave-speed-simulator');
    initSimulations(document);
    await flush();

    const oceanBtn = [...root.querySelectorAll<HTMLButtonElement>('[data-sim-preset]')].find(
      (b) => b.textContent === 'Ocean swell',
    )!;
    oceanBtn.click();
    // Ocean swell = 0.25 Hz × 4 m → 1.00 m/s.
    expect(measurement(root, 'waveSpeed')).toMatch(/1\.00 m\/s/);
    expect(slider(root, 'frequency').value).toBe('0.25');
    expect(slider(root, 'wavelength').value).toBe('4');
  });

  it('reset restores the defaults', async () => {
    const root = mountWidget(wave, 'wave-speed-simulator');
    initSimulations(document);
    await flush();

    const freq = slider(root, 'frequency');
    freq.value = '3';
    freq.dispatchEvent(new Event('input', { bubbles: true }));
    expect(freq.value).toBe('3');

    root.querySelector<HTMLButtonElement>('[data-sim-reset]')!.click();
    expect(freq.value).toBe('1');
    expect(measurement(root, 'waveSpeed')).toMatch(/2\.00 m\/s/);
  });

  it('toggles play/pause state', async () => {
    const root = mountWidget(wave, 'wave-speed-simulator');
    initSimulations(document);
    await flush();
    const play = root.querySelector<HTMLButtonElement>('[data-sim-play]')!;
    expect(play.getAttribute('aria-pressed')).toBe('true'); // autoplaying
    play.click();
    expect(play.getAttribute('aria-pressed')).toBe('false');
    expect(play.textContent).toBe('Play');
    play.click();
    expect(play.getAttribute('aria-pressed')).toBe('true');
    expect(play.textContent).toBe('Pause');
  });

  it('makes speed buttons mutually exclusive', async () => {
    const root = mountWidget(wave, 'wave-speed-simulator');
    initSimulations(document);
    await flush();
    const speeds = [...root.querySelectorAll<HTMLButtonElement>('[data-sim-speed]')];
    const half = speeds.find((b) => b.getAttribute('data-sim-speed') === '0.5')!;
    half.click();
    expect(half.getAttribute('aria-pressed')).toBe('true');
    expect(speeds.filter((b) => b.getAttribute('aria-pressed') === 'true')).toHaveLength(1);
  });

  it('responds to a pointer drag on the canvas (direct manipulation)', async () => {
    const root = mountWidget(wave, 'wave-speed-simulator');
    initSimulations(document);
    await flush();

    const canvas = root.querySelector<HTMLCanvasElement>('[data-sim-canvas]')!;
    canvas.getBoundingClientRect = () =>
      ({ left: 0, top: 0, width: 600, height: 338, right: 600, bottom: 338, x: 0, y: 0, toJSON() {} }) as DOMRect;

    // Drag to the very top of the canvas → maximum amplitude.
    canvas.dispatchEvent(new PointerEvent('pointerdown', { clientX: 300, clientY: 0, pointerId: 1, bubbles: true }));
    canvas.dispatchEvent(new PointerEvent('pointermove', { clientX: 300, clientY: 0, pointerId: 1, bubbles: true }));
    canvas.dispatchEvent(new PointerEvent('pointerup', { clientX: 300, clientY: 0, pointerId: 1, bubbles: true }));

    expect(slider(root, 'amplitude').value).toBe('1');
    // The hint hides after the first interaction.
    expect(root.querySelector('[data-sim-hint]')!.hasAttribute('hidden')).toBe(true);
  });
});

describe('boot — reduced motion', () => {
  beforeEach(() => stubEnv(true));

  it('starts paused and does not schedule a frame', async () => {
    const root = mountWidget(wave, 'wave-speed-simulator');
    initSimulations(document);
    await flush();
    expect(root.querySelector('[data-sim-play]')!.getAttribute('aria-pressed')).toBe('false');
    expect(root.querySelector('[data-sim-play]')!.textContent).toBe('Play');
    expect(rafCb).toBeNull(); // never autoplayed
    // Static frame still populated the readouts.
    expect(measurement(root, 'waveSpeed')).toMatch(/2\.00 m\/s/);
  });
});

describe('boot — failure handling', () => {
  beforeEach(() => stubEnv(false));

  it('shows the fallback and stays silent when the simulation cannot load', async () => {
    const root = document.createElement('section');
    root.setAttribute('data-physics-sim', '');
    root.setAttribute('data-simulation-id', 'does-not-exist');
    root.setAttribute('data-slug', 'nope');
    const canvas = document.createElement('canvas');
    canvas.setAttribute('data-sim-canvas', '');
    const fallback = document.createElement('p');
    fallback.setAttribute('data-sim-fallback', '');
    fallback.setAttribute('hidden', '');
    root.append(canvas, fallback);
    document.body.append(root);

    initSimulations(document);
    await flush();
    expect(fallback.hasAttribute('hidden')).toBe(false); // fallback revealed
  });

  it('ignores a widget missing its canvas without throwing', async () => {
    const root = document.createElement('section');
    root.setAttribute('data-physics-sim', '');
    root.setAttribute('data-simulation-id', 'wave-speed');
    document.body.append(root);
    expect(() => initSimulations(document)).not.toThrow();
    await flush();
  });
});
