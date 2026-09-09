// Device tilt for fidgets. Sand pours downhill; other toys can read the same axes.
// Orientation stays on the device. iOS requires a user gesture for permission.

export interface TiltSample {
  /** -1..1, screen right. */
  x: number;
  /** -1..1, screen down. */
  y: number;
}

export interface TiltHost {
  addEventListener: (type: string, fn: (ev: DeviceOrientationEvent) => void) => void;
  removeEventListener: (type: string, fn: (ev: DeviceOrientationEvent) => void) => void;
  DeviceOrientationEvent?: { requestPermission?: () => Promise<string> };
  screen?: { orientation?: { angle?: number } };
  orientation?: number;
}

export const TILT_DEADZONE_DEG = 8;
export const TILT_FULL_DEG = 35;
export const TILT_ACTIVE = 0.12;

const noopHost: TiltHost = {
  addEventListener() {},
  removeEventListener() {},
};

function defaultHost(): TiltHost {
  if (typeof globalThis !== 'undefined' && typeof globalThis.addEventListener === 'function') {
    return globalThis as unknown as TiltHost;
  }
  return noopHost;
}

/** Map `window.orientation` / `screen.orientation.angle` onto 0..359. */
export function readScreenAngle(host: Pick<TiltHost, 'screen' | 'orientation'> | null | undefined): number {
  const o = host?.screen?.orientation?.angle;
  if (typeof o === 'number' && Number.isFinite(o)) return ((o % 360) + 360) % 360;
  const w = host?.orientation;
  if (typeof w === 'number' && Number.isFinite(w)) return ((w % 360) + 360) % 360;
  return 0;
}

function scaleAxis(deg: number): number {
  const mag = Math.abs(deg);
  if (mag < TILT_DEADZONE_DEG) return 0;
  const t = Math.min(1, (mag - TILT_DEADZONE_DEG) / (TILT_FULL_DEG - TILT_DEADZONE_DEG));
  return (deg < 0 ? -1 : 1) * t;
}

/**
 * Convert device beta/gamma into screen-space tilt.
 * Portrait: gamma is left-right. Landscape swaps in the axes.
 */
export function tiltFromOrientation(
  beta: number | null | undefined,
  gamma: number | null | undefined,
  angle = 0,
): TiltSample {
  const b = typeof beta === 'number' ? beta : NaN;
  const g = typeof gamma === 'number' ? gamma : NaN;
  if (!Number.isFinite(b) || !Number.isFinite(g)) return { x: 0, y: 0 };
  const a = ((angle % 360) + 360) % 360;
  let x = g;
  let y = b;
  if (a === 90) {
    x = b;
    y = -g;
  } else if (a === 180) {
    x = -g;
    y = -b;
  } else if (a === 270) {
    x = -b;
    y = g;
  }
  return { x: scaleAxis(x), y: scaleAxis(y) };
}

export function tiltActive(sample: TiltSample, threshold = TILT_ACTIVE): boolean {
  return Math.hypot(sample.x, sample.y) >= threshold;
}

export function createTilt(host: TiltHost | null | undefined = defaultHost()) {
  const target = host ?? noopHost;
  let sample: TiltSample = { x: 0, y: 0 };
  let listening = false;
  let live = false;
  const watchers: Array<(next: TiltSample) => void> = [];

  function onOrient(ev: DeviceOrientationEvent) {
    sample = tiltFromOrientation(ev.beta, ev.gamma, readScreenAngle(target));
    if (ev.beta != null || ev.gamma != null) live = true;
    for (let i = 0; i < watchers.length; i++) watchers[i](sample);
  }

  return {
    /** Request iOS permission if needed, then listen. Safe to call from a tap more than once. */
    async start(): Promise<boolean> {
      if (listening) return true;
      const fromHost = target.DeviceOrientationEvent;
      const fromGlobal =
        target === globalThis && typeof DeviceOrientationEvent !== 'undefined'
          ? (DeviceOrientationEvent as unknown as { requestPermission?: () => Promise<string> })
          : undefined;
      const Ctor = fromHost ?? fromGlobal;
      if (!Ctor) return false;
      try {
        if (typeof Ctor.requestPermission === 'function') {
          const state = await Ctor.requestPermission();
          if (state !== 'granted') return false;
        }
      } catch {
        return false;
      }
      target.addEventListener('deviceorientation', onOrient);
      listening = true;
      return true;
    },
    stop() {
      if (!listening) return;
      target.removeEventListener('deviceorientation', onOrient);
      listening = false;
      live = false;
      sample = { x: 0, y: 0 };
    },
    x(): number {
      return sample.x;
    },
    y(): number {
      return sample.y;
    },
    listening(): boolean {
      return listening;
    },
    /** True after at least one orientation event with real axes. */
    live(): boolean {
      return live;
    },
    onChange(fn: (next: TiltSample) => void): () => void {
      watchers.push(fn);
      return () => {
        const at = watchers.indexOf(fn);
        if (at >= 0) watchers.splice(at, 1);
      };
    },
  };
}
