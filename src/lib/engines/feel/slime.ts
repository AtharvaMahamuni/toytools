// One Verlet blob. A missed pointerup must not glue a vertex to the cursor forever.

export type SlimeIntensity = 'low' | 'medium' | 'high';

export const SLIME_STIFFNESS: Record<SlimeIntensity, number> = {
  low: 0.18,
  medium: 0.32,
  high: 0.48,
};

export interface SlimeVertex {
  x: number;
  y: number;
  ox: number;
  oy: number;
}

export interface SlimeBlob {
  verts: SlimeVertex[];
  cx: number;
  cy: number;
  radius: number;
  grab: number | null;
}

export function createBlob(cx: number, cy: number, radius = 64, count = 24): SlimeBlob {
  const verts: SlimeVertex[] = [];
  for (let i = 0; i < count; i++) {
    const a = (i / count) * Math.PI * 2 - Math.PI / 2;
    const x = cx + Math.cos(a) * radius;
    const y = cy + Math.sin(a) * radius;
    verts.push({ x, y, ox: x, oy: y });
  }
  return { verts, cx, cy, radius, grab: null };
}

export function nearestVertex(blob: SlimeBlob, x: number, y: number): number {
  let best = 0;
  let bestD = Infinity;
  for (let i = 0; i < blob.verts.length; i++) {
    const dx = blob.verts[i].x - x;
    const dy = blob.verts[i].y - y;
    const d = dx * dx + dy * dy;
    if (d < bestD) {
      bestD = d;
      best = i;
    }
  }
  return best;
}

export function grab(blob: SlimeBlob, x: number, y: number): number {
  blob.grab = nearestVertex(blob, x, y);
  return blob.grab;
}

export function moveGrab(blob: SlimeBlob, x: number, y: number): void {
  if (blob.grab == null) return;
  const v = blob.verts[blob.grab];
  v.x = x;
  v.y = y;
  v.ox = x;
  v.oy = y;
}

export function release(blob: SlimeBlob): void {
  blob.grab = null;
}

export function isGrabbed(blob: SlimeBlob): boolean {
  return blob.grab != null;
}

export function step(
  blob: SlimeBlob,
  width: number,
  height: number,
  stiffness: number,
  motionScale = 1,
): void {
  const { verts, cx, cy, radius, grab: held } = blob;
  const n = verts.length;
  const rest = (Math.PI * 2 * radius) / n;
  const damp = motionScale > 0 ? 0.12 : 1;

  for (let i = 0; i < n; i++) {
    if (i === held) continue;
    const v = verts[i];
    const vx = (v.x - v.ox) * (1 - damp);
    const vy = (v.y - v.oy) * (1 - damp);
    v.ox = v.x;
    v.oy = v.y;
    v.x += vx;
    v.y += vy;
  }

  const passes = motionScale > 0 ? 4 : 8;
  for (let p = 0; p < passes; p++) {
    for (let i = 0; i < n; i++) {
      const a = verts[i];
      const b = verts[(i + 1) % n];
      const dx = b.x - a.x;
      const dy = b.y - a.y;
      const d = Math.hypot(dx, dy) || 0.0001;
      const diff = ((d - rest) / d) * 0.5;
      if (i !== held) {
        a.x += dx * diff;
        a.y += dy * diff;
      }
      if ((i + 1) % n !== held) {
        b.x -= dx * diff;
        b.y -= dy * diff;
      }
    }
    const k = Math.min(1, Math.max(0.08, stiffness));
    for (let i = 0; i < n; i++) {
      if (i === held) continue;
      const v = verts[i];
      const a = (i / n) * Math.PI * 2 - Math.PI / 2;
      const tx = cx + Math.cos(a) * radius;
      const ty = cy + Math.sin(a) * radius;
      v.x += (tx - v.x) * k;
      v.y += (ty - v.y) * k;
      v.x = Math.min(width - 2, Math.max(2, v.x));
      v.y = Math.min(height - 2, Math.max(2, v.y));
    }
  }
}

export const slimeApi = {
  createBlob,
  grab,
  moveGrab,
  release,
  isGrabbed,
  nearestVertex,
  step,
  SLIME_STIFFNESS,
};
