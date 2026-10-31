// Chair conformation drawn from a 3D model (see chairGeometry). Axial bonds are accent,
// equatorial bonds muted, so the flip visibly trades the two sets.
// Excluded from unit coverage; the model tests pin the geometry and the labels.

import type { SimState, Viewport } from '../types';
import { clear, drawLabel } from '../canvas';
import { chairGeometry, isMethyl, project, readout, type Point3 } from './cyclohexane-chair';

export function drawCyclohexaneChair(ctx: CanvasRenderingContext2D, s: SimState, vp: Viewport): void {
  clear(ctx, vp);
  const p = vp.palette;
  const g = chairGeometry(s.params.flip);
  const scale = Math.min(vp.width * 0.3, vp.height * 0.36);
  const cx = vp.width * 0.5;
  const cy = vp.height * 0.52;
  const at = (q: Point3) => {
    const v = project(q);
    return { x: cx + v.x * scale, y: cy + v.y * scale };
  };

  ctx.save();
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  // Back ring bonds first, thinner; front bonds over them. Depth is the ring's y.
  const order = [0, 1, 2, 3, 4, 5].map((i) => {
    const a = g.carbons[i]!;
    const b = g.carbons[(i + 1) % 6]!;
    return { a, b, depth: (a.y + b.y) / 2 };
  }).sort((m, n) => n.depth - m.depth);
  for (const edge of order) {
    const a = at(edge.a);
    const b = at(edge.b);
    ctx.strokeStyle = p.ink;
    ctx.lineWidth = edge.depth < 0 ? 4 : 2.5;
    ctx.beginPath();
    ctx.moveTo(a.x, a.y);
    ctx.lineTo(b.x, b.y);
    ctx.stroke();
  }

  const methyl = isMethyl(s.params.substituent);
  for (const bond of g.bonds) {
    const a = at(bond.from);
    const b = at(bond.to);
    ctx.strokeStyle = bond.kind === 'axial' ? p.accent : p.muted;
    ctx.lineWidth = bond.methyl && methyl ? 3.5 : 2;
    ctx.beginPath();
    ctx.moveTo(a.x, a.y);
    ctx.lineTo(b.x, b.y);
    ctx.stroke();
    if (bond.methyl && methyl) {
      ctx.fillStyle = p.accent;
      ctx.beginPath();
      ctx.arc(b.x, b.y, Math.max(9, vp.width * 0.016), 0, Math.PI * 2);
      ctx.fill();
      drawLabel(ctx, 'Me', b.x, b.y - 18, p.ink);
    }
  }
  ctx.restore();

  drawLabel(ctx, readout(s.params.flip), vp.width * 0.5, vp.height * 0.08, p.ink);
  drawLabel(ctx, 'axial', vp.width * 0.1, vp.height * 0.92, p.accent);
  drawLabel(ctx, 'equatorial', vp.width * 0.26, vp.height * 0.92, p.muted);
}
