// Minimal 2D vector helpers for simulation models and renderers (free-body diagrams, velocity
// arrows, etc.). Immutable: every op returns a new Vec2. Pure and DOM-free.

export interface Vec2 {
  x: number;
  y: number;
}

export const vec = (x: number, y: number): Vec2 => ({ x, y });

export const add = (a: Vec2, b: Vec2): Vec2 => ({ x: a.x + b.x, y: a.y + b.y });
export const sub = (a: Vec2, b: Vec2): Vec2 => ({ x: a.x - b.x, y: a.y - b.y });
export const scale = (a: Vec2, k: number): Vec2 => ({ x: a.x * k, y: a.y * k });
export const dot = (a: Vec2, b: Vec2): number => a.x * b.x + a.y * b.y;
export const length = (a: Vec2): number => Math.hypot(a.x, a.y);

/** Unit vector in the direction of a; returns (0,0) for the zero vector. */
export function normalized(a: Vec2): Vec2 {
  const len = length(a);
  return len === 0 ? { x: 0, y: 0 } : { x: a.x / len, y: a.y / len };
}

/** Angle of a in radians, measured from +x, CCW (standard atan2). */
export const angleOf = (a: Vec2): number => Math.atan2(a.y, a.x);

/** A vector of the given magnitude at the given angle (radians from +x, CCW). */
export const fromAngle = (angle: number, magnitude = 1): Vec2 => ({
  x: Math.cos(angle) * magnitude,
  y: Math.sin(angle) * magnitude,
});
