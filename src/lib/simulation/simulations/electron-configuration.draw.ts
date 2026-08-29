// Canvas scene for the Electron Configuration Simulator. Two panels: the shell picture on the left,
// which is the mental model most people already carry, and the subshell bars on the right, which is
// where the electrons actually go. Watching an electron land in the right-hand bars and appear on
// the left-hand ring at the same moment is the point of drawing both.
//
// Only the electrons placed so far are drawn, so the fill animates in Madelung order and 4s is
// visibly occupied before 3d.
//
// The bars wrap into two columns past eight occupied subshells, because a heavy element has
// nineteen of them and a 219px-tall phone canvas cannot give each one a readable row.
//
// Excluded from unit coverage; stub-context smoke test asserts no-throw.

import type { SimState, Viewport } from '../types';
import { clear, drawLabel } from '../canvas';
import {
  AUFBAU,
  currentConfiguration,
  electronsInShell,
  outermostShell,
  placedConfiguration,
  shorthandString,
  speciesLabel,
} from './electron-configuration';
import { elementOf } from '../data/elements';

const MAX_SHELL = 7;

export function drawElectronConfiguration(ctx: CanvasRenderingContext2D, s: SimState, vp: Viewport): void {
  clear(ctx, vp);
  const p = vp.palette;
  const placed = placedConfiguration(s);
  const full = currentConfiguration(s);
  const valenceShell = outermostShell(full);
  const element = elementOf(Math.round(s.params.atomicNumber));

  // Caption band: what this is, and the answer in shorthand.
  drawLabel(ctx, `${speciesLabel(s)} · ${element.name}`, vp.width * 0.5, vp.height * 0.07, p.ink);
  drawLabel(ctx, shorthandString(full, element.z), vp.width * 0.5, vp.height * 0.94, p.muted);

  // ── Shell picture ────────────────────────────────────────────────────────────────────────────
  const cx = vp.width * 0.26;
  const cy = vp.height * 0.5;
  const maxRadius = Math.min(vp.width * 0.22, vp.height * 0.36);
  const nucleus = Math.max(9, maxRadius * 0.16);

  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, nucleus, 0, Math.PI * 2);
  ctx.fillStyle = p.accent;
  ctx.fill();
  ctx.restore();
  drawLabel(ctx, String(Math.round(s.params.atomicNumber)), cx, cy, p.bg);

  for (let n = 1; n <= MAX_SHELL; n++) {
    const count = electronsInShell(placed, n);
    if (count === 0) continue;
    const radius = nucleus + ((maxRadius - nucleus) * n) / MAX_SHELL;
    const isValence = n === valenceShell;

    ctx.save();
    ctx.strokeStyle = isValence ? p.accent : p.border;
    ctx.lineWidth = isValence ? 1.6 : 1;
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();

    // Electrons spread evenly round the ring, starting at the top so the first one is obvious.
    const dot = Math.max(2, Math.min(3.2, radius * 0.09));
    ctx.save();
    ctx.fillStyle = isValence ? p.accent : p.muted;
    for (let i = 0; i < count; i++) {
      const angle = -Math.PI / 2 + (i / count) * Math.PI * 2;
      ctx.beginPath();
      ctx.arc(cx + Math.cos(angle) * radius, cy + Math.sin(angle) * radius, dot, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  // ── Subshell bars ────────────────────────────────────────────────────────────────────────────
  const occupied = AUFBAU.map((sub, i) => ({ sub, i })).filter(({ i }) => full[i]! > 0);
  if (occupied.length === 0) return;

  const columns = occupied.length > 8 ? 2 : 1;
  const perColumn = Math.ceil(occupied.length / columns);
  const panelLeft = vp.width * 0.5;
  const panelWidth = vp.width * 0.46;
  const columnWidth = panelWidth / columns;
  const top = vp.height * 0.14;
  const rowHeight = Math.min((vp.height * 0.72) / perColumn, vp.height * 0.1);
  const barHeight = Math.max(4, rowHeight * 0.44);

  for (let k = 0; k < occupied.length; k++) {
    const { sub, i } = occupied[k]!;
    const column = Math.floor(k / perColumn);
    const row = k % perColumn;
    const x = panelLeft + column * columnWidth;
    const y = top + row * rowHeight;
    const isValence = sub.n === valenceShell;
    const labelWidth = columnWidth * 0.3;
    const barWidth = columnWidth * 0.6;

    drawLabel(ctx, sub.label, x + labelWidth - 4, y + barHeight / 2, isValence ? p.accent : p.muted, 'right');

    ctx.save();
    ctx.fillStyle = p.accentSubtle;
    ctx.fillRect(x + labelWidth, y, barWidth, barHeight);
    const fraction = Math.min(1, placed[i]! / sub.capacity);
    ctx.fillStyle = isValence ? p.accent : p.muted;
    ctx.fillRect(x + labelWidth, y, barWidth * fraction, barHeight);
    ctx.restore();

    drawLabel(ctx, String(placed[i]), x + labelWidth + barWidth + 4, y + barHeight / 2, p.ink, 'left');
  }
}
