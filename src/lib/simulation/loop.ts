// The ONE animation loop shared by every physics simulation.
//
// Fixed-timestep accumulator: rendering runs at display rate via requestAnimationFrame,
// but the model is always advanced in exact SUBSTEP increments so simulation results are
// deterministic and independent of frame rate (a 30 Hz phone and a 120 Hz desktop integrate
// the pendulum identically). Frame deltas are clamped so a background tab or debugger pause
// can't produce one giant, physics-exploding step. raf/now are injectable for unit tests.

export const SUBSTEP = 1 / 120;
// Clamp each frame's delta so a background tab / debugger pause can't inject one giant,
// physics-exploding step. This also bounds substeps per frame (0.1 s ÷ (1/120) × max speed
// 2 ≈ 24), so no separate catch-up cap is needed.
export const MAX_FRAME_DELTA = 0.1;
export const SPEED_MIN = 0.25;
export const SPEED_MAX = 2;

export interface LoopCallbacks {
  /** Advance the model by exactly dt (= SUBSTEP) seconds. */
  step(dt: number): void;
  /** Paint the current state. Called once per animation frame while running. */
  render(): void;
}

export interface LoopTimers {
  raf?(cb: (t: number) => void): number;
  caf?(handle: number): void;
  /** Millisecond clock, performance.now-compatible. */
  now?(): number;
}

export interface SimulationLoop {
  play(): void;
  pause(): void;
  /** Returns the new running state. */
  toggle(): boolean;
  running(): boolean;
  setSpeed(speed: number): void;
  speed(): number;
}

export function createLoop(cb: LoopCallbacks, timers: LoopTimers = {}): SimulationLoop {
  const raf = timers.raf ?? ((f: (t: number) => void) => requestAnimationFrame(f));
  const caf = timers.caf ?? ((h: number) => cancelAnimationFrame(h));
  const now = timers.now ?? (() => performance.now());

  let isRunning = false;
  let speed = 1;
  let last = 0;
  let acc = 0;
  let handle = 0;

  function frame(): void {
    if (!isRunning) return;
    const t = now();
    const elapsed = Math.min(Math.max((t - last) / 1000, 0), MAX_FRAME_DELTA);
    last = t;
    acc += elapsed * speed;
    while (acc >= SUBSTEP) {
      cb.step(SUBSTEP);
      acc -= SUBSTEP;
    }
    cb.render();
    handle = raf(frame);
  }

  return {
    play(): void {
      if (isRunning) return;
      isRunning = true;
      last = now();
      acc = 0;
      handle = raf(frame);
    },
    pause(): void {
      if (!isRunning) return;
      isRunning = false;
      caf(handle);
    },
    toggle(): boolean {
      if (isRunning) this.pause();
      else this.play();
      return isRunning;
    },
    running: () => isRunning,
    setSpeed(s: number): void {
      speed = Math.min(Math.max(s, SPEED_MIN), SPEED_MAX);
    },
    speed: () => speed,
  };
}
