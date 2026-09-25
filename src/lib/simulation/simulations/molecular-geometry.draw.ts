// Canvas scene for the Molecular Geometry Simulator: a rotatable AXE sketch, with electron
// geometry and molecular shape labelled as two facts rather than one.
//
// Bonded atoms are filled circles. Lone pairs are lobes on the same vertices, so a water molecule
// is visibly tetrahedral in its electron groups and bent in its atoms. The two names sit in a
// band under the sketch: they share a colour when they match, and the molecular shape goes accent
// the moment they split. That is the whole argument of the tool, drawn rather than footnoted.
//
// Layout is banded like the other simulations: caption, molecule, two-name band. Nothing is
// positioned above the canvas.
//
// Excluded from unit coverage; stub-context smoke test asserts no-throw.

import type { SimState, Viewport } from '../types';
import { clear, drawLabel } from '../canvas';
import {
  type Site,
  type Vec3,
  axeNotation,
  bondingPairs,
  compressedAngle,
  electronGeometry,
  geometriesDiffer,
  isValid,
  molecularShape,
  rotateX,
  rotateY,
  sitesFor,
} from './molecular-geometry';

interface Projected {
  x: number;
  y: number;
  depth: number;
  scale: number;
}

function project(p: Vec3, yaw: number, pitch: number, cx: number, cy: number, scale: number): Projected {
  const r = rotateX(rotateY(p, yaw), pitch);
  const z = r.z + 3.2;
  const f = scale / z;
  return { x: cx + r.x * f, y: cy - r.y * f, depth: r.z, scale: f };
}

function drawBond(
  ctx: CanvasRenderingContext2D,
  from: Projected,
  to: Projected,
  color: string,
): void {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = 3;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(from.x, from.y);
  ctx.lineTo(to.x, to.y);
  ctx.stroke();
  ctx.restore();
}

function drawAtom(
  ctx: CanvasRenderingContext2D,
  p: Projected,
  radius: number,
  fill: string,
  stroke: string,
  label: string,
  ink: string,
): void {
  ctx.save();
  ctx.beginPath();
  ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
  ctx.fillStyle = fill;
  ctx.fill();
  ctx.strokeStyle = stroke;
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.restore();
  drawLabel(ctx, label, p.x, p.y, ink);
}

function drawLonePair(
  ctx: CanvasRenderingContext2D,
  origin: Projected,
  tip: Projected,
  fill: string,
  accent: string,
): void {
  const mx = origin.x + (tip.x - origin.x) * 0.72;
  const my = origin.y + (tip.y - origin.y) * 0.72;
  const r = Math.max(7, tip.scale * 0.09);
  ctx.save();
  ctx.fillStyle = fill;
  ctx.beginPath();
  ctx.arc(mx, my, r * 1.35, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = accent;
  const dx = (tip.x - origin.x) * 0.04;
  const dy = (tip.y - origin.y) * 0.04;
  const px = -(tip.y - origin.y) * 0.03;
  const py = (tip.x - origin.x) * 0.03;
  ctx.beginPath();
  ctx.arc(mx - px, my - py, 3.2, 0, Math.PI * 2);
  ctx.arc(mx + px + dx, my + py + dy, 3.2, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

export function drawMolecularGeometry(ctx: CanvasRenderingContext2D, s: SimState, vp: Viewport): void {
  clear(ctx, vp);
  const p = vp.palette;
  const valid = isValid(s);
  const geom = electronGeometry(s);
  const shape = molecularShape(s);
  const split = geometriesDiffer(s);

  const caption = valid ? `${axeNotation(s)}  ·  ${shape}` : 'Not a VSEPR case';
  drawLabel(ctx, caption, vp.width * 0.5, vp.height * 0.09, p.ink);

  const cx = vp.width * 0.5;
  const cy = vp.height * 0.46;
  const scale = Math.min(vp.width, vp.height) * 0.95;
  const yaw = s.vars.yaw;
  const pitch = s.vars.pitch;
  const origin = project({ x: 0, y: 0, z: 0 }, yaw, pitch, cx, cy, scale);

  if (valid) {
    const sites = sitesFor(s);
    const projected: { site: Site; proj: Projected }[] = sites.map((site) => ({
      site,
      proj: project(site.pos, yaw, pitch, cx, cy, scale),
    }));

    for (const item of projected) {
      if (item.site.kind !== 'bond') continue;
      drawBond(ctx, origin, item.proj, p.border);
    }

    const ordered: { depth: number; draw: () => void }[] = [
      {
        depth: origin.depth,
        draw: () => drawAtom(ctx, origin, Math.max(12, origin.scale * 0.12), p.accentSubtle, p.accent, 'A', p.ink),
      },
    ];
    for (const item of projected) {
      ordered.push({
        depth: item.proj.depth,
        draw: () => {
          if (item.site.kind === 'lone') {
            drawLonePair(ctx, origin, item.proj, p.accentSubtle, p.accent);
          } else {
            drawAtom(ctx, item.proj, Math.max(10, item.proj.scale * 0.1), p.surface, p.muted, 'X', p.ink);
          }
        },
      });
    }
    ordered.sort((a, b) => a.depth - b.depth);
    for (const item of ordered) item.draw();

    if (bondingPairs(s) === 2) {
      drawLabel(ctx, `${compressedAngle(s).toFixed(1)}°`, cx, cy + Math.min(vp.height * 0.22, 70), p.ink);
    }
  } else {
    drawLabel(ctx, 'Drop a pair, or add one, to enter the table', cx, cy, p.muted);
  }

  const bandY = vp.height * 0.82;
  const leftX = vp.width * 0.27;
  const rightX = vp.width * 0.73;
  drawLabel(ctx, 'Electron geometry', leftX, bandY - 12, p.muted);
  drawLabel(ctx, valid ? geom : 'none', leftX, bandY + 6, p.ink);
  drawLabel(ctx, 'Molecular shape', rightX, bandY - 12, p.muted);
  drawLabel(ctx, valid ? shape : 'none', rightX, bandY + 6, split ? p.accent : p.ink);
}
