// Canvas scene for the Momentum Collision: two carts on a horizontal track. Cart sizes track their
// masses, positions come from the model, and a velocity arrow above each cart shows its speed and
// direction. Drawn positions are clamped to the track edges so a fast post-collision cart rests at
// the wall rather than leaving the scene. Excluded from unit coverage (browser drawing).

import type { SimState, Viewport } from '../types';
import { clear, drawArrow, drawLabel } from '../canvas';
import { positions, cartHalfWidth, TRACK_M } from './momentum-collision';

export function drawMomentumCollision(ctx: CanvasRenderingContext2D, s: SimState, vp: Viewport): void {
  clear(ctx, vp);

  const trackY = vp.height * 0.62;
  const toX = (x: number) => (x / TRACK_M) * vp.width;

  // The track.
  ctx.save();
  ctx.strokeStyle = vp.palette.border;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(0, trackY);
  ctx.lineTo(vp.width, trackY);
  ctx.stroke();
  ctx.restore();

  const { x1, x2, v1, v2 } = positions(s);
  const hw1 = cartHalfWidth(s.params.mass1);
  const hw2 = cartHalfWidth(s.params.mass2);

  const drawCart = (
    xc: number,
    hw: number,
    vel: number,
    color: string,
    label: string,
  ) => {
    // Clamp the drawn centre so the whole cart stays on the track.
    const clamped = Math.min(Math.max(xc, hw), TRACK_M - hw);
    const cx = toX(clamped);
    const wpx = (hw / TRACK_M) * vp.width * 2;
    const hpx = 34 + hw * 26;
    ctx.save();
    ctx.fillStyle = color;
    ctx.strokeStyle = vp.palette.ink;
    ctx.lineWidth = 2;
    ctx.fillRect(cx - wpx / 2, trackY - hpx, wpx, hpx);
    ctx.strokeRect(cx - wpx / 2, trackY - hpx, wpx, hpx);
    ctx.restore();
    drawLabel(ctx, label, cx, trackY - hpx - 26, vp.palette.muted);

    // Velocity arrow above the cart, length proportional to speed.
    if (Math.abs(vel) > 0.05) {
      const len = Math.min(70, Math.abs(vel) * 12);
      const ay = trackY - hpx - 12;
      const dir = Math.sign(vel);
      drawArrow(ctx, cx, ay, cx + dir * len, ay, vp.palette.ink, 2);
    }
  };

  drawCart(x1, hw1, v1, vp.palette.accent, `${s.params.mass1.toFixed(1)} kg`);
  drawCart(x2, hw2, v2, vp.palette.danger, `${s.params.mass2.toFixed(1)} kg`);

  // Restitution readout.
  ctx.save();
  ctx.fillStyle = vp.palette.muted;
  ctx.font = '13px var(--font-mono, monospace)';
  ctx.textAlign = 'center';
  ctx.fillText(`e = ${s.params.restitution.toFixed(2)}`, vp.width / 2, vp.height - 16);
  ctx.restore();
}
