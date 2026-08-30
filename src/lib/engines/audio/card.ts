// The share card: a picture of one preset, drawn to a canvas the caller owns.
//
// Deliberately NOT a screenshot of the page. A screenshot carries the site's chrome, the reader's
// theme and whatever was scrolled into view; a card carries the seven numbers somebody actually
// wants, at a size that survives being reposted. It reads at thumbnail size in a chat and at full
// size on a timeline, which is the only two ways it will ever be looked at.
//
// The palette is fixed rather than read from the page's tokens: the image leaves the browser, so
// it cannot depend on the theme the sender happened to be using. These are the site's dark-mode
// values, which is the version that sits well on both light and dark chat backgrounds.

import { curvePoints } from './curve';

export interface CardSpec {
  /** The preset name, e.g. "Deep Bass + Clear Vocals". */
  name: string;
  /** Band labels, in order. */
  labels: string[];
  gains: number[];
  minGain: number;
  maxGain: number;
  /** Preamp cut to print, when the curve has boosts worth one. */
  preamp?: number;
}

/** 16:9 at a size that stays sharp when a chat client re-encodes it. */
export const CARD_SIZE = { width: 1200, height: 675 };

const INK = {
  bg: '#181614',
  panel: '#1F1D1A',
  text: '#EDEAE4',
  muted: '#A8A299',
  accent: '#84C2A3',
  gold: '#D4A017',
  grid: '#383430',
};

const FONT = "system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif";
const MONO = "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace";

/** Draw the whole card. The caller supplies a 1200x675 context and owns what happens next. */
export function drawShareCard(ctx: CanvasRenderingContext2D, spec: CardSpec): void {
  const { width: W, height: H } = CARD_SIZE;
  const pad = 64;

  ctx.fillStyle = INK.bg;
  ctx.fillRect(0, 0, W, H);

  // Eyebrow, with the gold dot as the site's punctuation rather than a logo.
  ctx.textBaseline = 'alphabetic';
  ctx.textAlign = 'left';
  ctx.fillStyle = INK.muted;
  ctx.font = `600 22px ${FONT}`;
  const eyebrow = 'MY SOUND';
  ctx.fillText(eyebrow, pad, pad + 22);
  ctx.fillStyle = INK.gold;
  ctx.fillText(' ●', pad + ctx.measureText(eyebrow).width, pad + 22);

  ctx.fillStyle = INK.text;
  ctx.font = `700 54px ${FONT}`;
  ctx.fillText(clip(ctx, spec.name, W - pad * 2), pad, pad + 90);

  drawCurve(ctx, spec, pad, 210, 540, 330);
  drawTable(ctx, spec, 700, 200);

  ctx.fillStyle = INK.muted;
  ctx.font = `600 24px ${FONT}`;
  const mark = 'ToyTools';
  ctx.fillText(mark, pad, H - pad + 8);
  ctx.fillStyle = INK.gold;
  ctx.fillText(' ●', pad + ctx.measureText(mark).width, H - pad + 8);

  ctx.fillStyle = INK.muted;
  ctx.font = `400 20px ${FONT}`;
  ctx.textAlign = 'right';
  ctx.fillText('Equalizer settings you can copy into your own player', W - pad, H - pad + 8);
  ctx.textAlign = 'left';
}

/** The curve, its 0 dB line and a dot per band. */
function drawCurve(ctx: CanvasRenderingContext2D, spec: CardSpec, x: number, y: number, w: number, h: number): void {
  const { gains, minGain, maxGain } = spec;
  const toY = (db: number) => y + h - ((db - minGain) / (maxGain - minGain)) * h;

  ctx.fillStyle = INK.panel;
  ctx.fillRect(x, y, w, h);

  ctx.strokeStyle = INK.grid;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(x, toY(0));
  ctx.lineTo(x + w, toY(0));
  ctx.stroke();

  const points = curvePoints(gains, minGain, maxGain, 97);
  ctx.strokeStyle = INK.accent;
  ctx.lineWidth = 5;
  ctx.lineJoin = 'round';
  ctx.beginPath();
  points.forEach((p, i) => {
    const px = x + p.x * w;
    const py = toY(p.y);
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  });
  ctx.stroke();

  const n = gains.length;
  ctx.fillStyle = INK.accent;
  for (let i = 0; i < n; i++) {
    ctx.beginPath();
    ctx.arc(x + (n > 1 ? i / (n - 1) : 0) * w, toY(gains[i] ?? 0), 8, 0, Math.PI * 2);
    ctx.fill();
  }
}

/** The seven values, which are the part a reader is going to retype into their own player. */
function drawTable(ctx: CanvasRenderingContext2D, spec: CardSpec, x: number, y: number): void {
  const rowHeight = 46;
  ctx.font = `500 30px ${MONO}`;
  spec.labels.forEach((label, i) => {
    const g = spec.gains[i] ?? 0;
    const rowY = y + i * rowHeight;
    ctx.textAlign = 'left';
    ctx.fillStyle = INK.muted;
    ctx.fillText(label, x, rowY);
    ctx.textAlign = 'right';
    ctx.fillStyle = g === 0 ? INK.muted : INK.text;
    ctx.fillText(`${g > 0 ? '+' : ''}${g} dB`, x + 436, rowY);
  });

  if (spec.preamp !== undefined && spec.preamp < 0) {
    const rowY = y + spec.labels.length * rowHeight + 12;
    ctx.textAlign = 'left';
    ctx.fillStyle = INK.gold;
    ctx.fillText('Preamp', x, rowY);
    ctx.textAlign = 'right';
    ctx.fillText(`${spec.preamp} dB`, x + 436, rowY);
  }
  ctx.textAlign = 'left';
}

/** Truncate to fit, so a long custom name cannot run off the card. */
function clip(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string {
  if (ctx.measureText(text).width <= maxWidth) return text;
  let out = text;
  while (out.length > 1 && ctx.measureText(`${out}...`).width > maxWidth) out = out.slice(0, -1);
  return `${out}...`;
}
