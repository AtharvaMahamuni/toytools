// Renders the post cards for the X queue: 1600x900 images on the site's own paper, type and gold.
//
//   npm run x:cards                 every card in the current queue
//   npm run x:cards -- --id gotcha-base64-encoder-decoder
//   npm run x:cards -- --kind gotcha --limit 5
//   npm run x:cards -- --square     1600x1600 instead of 1600x900, suffixed -square.png
//
// Run npm run x:generate first; this reads brand/social/x/queue/queue.json and renders the `card`
// block each draft declares. A card is never authored separately from its draft, so a post and its
// image cannot end up saying different things.
//
// Text-only is the pipeline default. Most drafts carry no `card` at all -- threads never do, and a
// gotcha's card is left with a `[[slot]]` (see build-drafts.ts) rather than auto-filled with the
// full craft.solves sentence, so nothing renders for it until a human decides one specific post
// earns the extra reach and writes a short phrase, not a paragraph. This script only ever touches
// what's already in the queue; it does not decide which drafts get an image.
//
// Two templates in practice:
//
//   gotcha  a failure named in one short phrase. Opt-in, and rendered only after the slot is filled.
//   ship    a release, one sentence. The one kind that ships a card by default.
//
// `thread` support stays in the renderer below in case a specific thread ever earns a cover by
// hand, but build-drafts.ts no longer emits one automatically.
//
// 1600x900 (the default) because X renders a 16:9 attachment at full column width without
// cropping, and the same file works as a link preview. --square renders 1600x1600 instead, for
// surfaces that crop or reject 16:9 (a profile-grid preview, a non-X share). Both are rendered at
// 2x and downscaled, so the type stays clean at the ~500px width a phone actually shows.

import { mkdirSync, readFileSync, existsSync } from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';
import { launch, renderHtml, PAPER, SURFACE, INK, INK_MUTED, INK_SUBTLE, ACCENT, goldDotCss } from './brand/render';
import type { Draft } from './x-content/types';

const QUEUE = path.resolve(process.cwd(), 'brand/social/x/queue/queue.json');
const OUT = path.resolve(process.cwd(), 'brand/social/x/cards');
const W = 1600;

function arg(name: string): string | undefined {
  const i = process.argv.indexOf(`--${name}`);
  return i === -1 ? undefined : process.argv[i + 1];
}

function flag(name: string): boolean {
  return process.argv.includes(`--${name}`);
}

const escape = (s: string): string =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/**
 * Body type shrinks as the sentence grows, in three steps rather than continuously.
 *
 * craft.solves spans 128 to 366 characters. One size for all of them either sets the short ones
 * in something too small to carry a card or lets the long ones overflow the box; a continuous
 * scale gives every card a slightly different size and the set stops looking like a set.
 *
 * Square gets its own, larger tiers rather than the same size in a taller box. The 16:9 sizes
 * leave a talkative sentence hugging the middle third of a 1600x1600 frame with dead paper above
 * and below; a bigger sentence, wrapped narrower (see .mid max-width in cardCss), actually fills it.
 */
function bodySize(text: string, square: boolean): number {
  if (square) {
    if (text.length > 280) return 46;
    if (text.length > 190) return 54;
    return 62;
  }
  if (text.length > 280) return 34;
  if (text.length > 190) return 40;
  return 46;
}

function cardHtml(draft: Draft, square: boolean): string {
  const card = draft.card!;
  const isThread = card.template === 'thread';
  const threadSize = square ? 88 : 64;
  return `<div class="card ${card.template}">
  <div class="top">
    <span class="eyebrow">${escape(card.eyebrow)}</span>
    <span class="gold-dot"></span>
    <span class="eyebrow subtle">toytoolsapp.com</span>
  </div>
  <div class="mid">
    ${isThread ? '' : `<p class="kicker">${escape(card.headline)}</p>`}
    <p class="body" style="font-size:${isThread ? threadSize : bodySize(card.body, square)}px">${escape(isThread ? card.headline : card.body)}</p>
    ${isThread ? `<p class="sub">${escape(card.body)}</p>` : ''}
  </div>
  <div class="rail"></div>
</div>`;
}

/**
 * The card's CSS. Every value is a token from src/styles/tokens.css, and the composition is the
 * one the tool pages use: paper, a lot of air, one accent rail, and no frame around anything.
 *
 * No border on the card, deliberately. The site removed container frames catalog-wide and holds
 * separator rules at zero in check:craft; a card that draws a box round itself would be the one
 * ToyTools surface still doing the thing every other surface stopped doing.
 */
function cardCss(H: number, square: boolean): string {
  return `
  .card {
    width: ${W}px; height: ${H}px;
    background: ${PAPER};
    font-family: 'Geist', system-ui, sans-serif;
    display: flex; flex-direction: column;
    padding: 92px 104px;
    box-sizing: border-box;
    line-height: normal;
  }
  /* The one flat fill on the set, so a thread cover reads as a cover and not as another gotcha. */
  .card.thread { background: ${SURFACE}; }

  .top { display: flex; align-items: center; gap: 20px; }
  .eyebrow {
    font-family: 'Geist Mono', ui-monospace, monospace;
    font-size: 24px; font-weight: 500;
    letter-spacing: 0.08em; text-transform: uppercase;
    color: ${ACCENT};
  }
  .eyebrow.subtle { color: ${INK_SUBTLE}; text-transform: none; letter-spacing: 0.02em; }
${goldDotCss(10)}

  /* Takes the space between the eyebrow and the rail and centres inside it, so a 128-character
     sentence and a 366-character one sit on the same optical line instead of one floating high
     and the other sinking into the rail. */
  .mid {
    flex: 1;
    display: flex; flex-direction: column; justify-content: center; gap: 28px;
    max-width: ${square ? 1080 : 1240}px;
    min-height: 0;
    padding: 56px 0;
  }
  .kicker {
    margin: 0;
    font-size: ${square ? 38 : 30}px; font-weight: 600;
    letter-spacing: -0.01em;
    color: ${INK_MUTED};
  }
  .body {
    margin: 0;
    font-weight: 600;
    line-height: 1.3;              /* --leading-tight, a touch open for long sentences */
    letter-spacing: -0.022em;
    color: ${INK};
  }
  .thread .body { font-weight: 700; letter-spacing: -0.028em; }
  .sub {
    margin: 0;
    font-size: ${square ? 42 : 34}px; line-height: 1.5;
    color: ${INK_MUTED};
  }

  /* The rail: the mark's own motif, and the card's only ornament. A flex child rather than an
     absolutely positioned one -- placed absolutely it sat under whatever the body happened to
     reach, and on the longest sentence it read as an underline beneath the final word. */
  .rail {
    flex-shrink: 0;
    width: 132px; height: 8px; border-radius: 4px;
    background: ${ACCENT};
  }
`;
}

async function main() {
  if (!existsSync(QUEUE)) {
    console.error('[x-cards] no queue found. Run npm run x:generate first.');
    process.exit(1);
  }

  const drafts = (JSON.parse(readFileSync(QUEUE, 'utf8')) as Draft[]).filter((d) => d.card);
  const id = arg('id');
  const kind = arg('kind');
  const limit = Number(arg('limit') ?? 0);

  let selected = drafts;
  if (id) selected = selected.filter((d) => d.id === id);
  if (kind) selected = selected.filter((d) => d.kind === kind);
  if (limit) selected = selected.slice(0, limit);

  if (!selected.length) {
    console.error('[x-cards] nothing selected.');
    process.exit(1);
  }

  const square = flag('square');
  const H = square ? W : 900;
  const suffix = square ? '-square' : '';

  mkdirSync(OUT, { recursive: true });
  const browser = await launch();

  let written = 0;
  for (const draft of selected) {
    // A card carrying an unfilled slot would publish the instruction rather than the sentence.
    // This is also the mechanism that keeps a gotcha's card opt-in: it stays a slot until a human
    // fills it for that one post, so most runs land here rather than at the render below.
    if (/\[\[/.test(draft.card!.body) || /\[\[/.test(draft.card!.headline)) {
      console.log(`[x-cards] skipped ${draft.id}: card text still has a slot to fill`);
      continue;
    }
    const buf = await renderHtml(browser, cardHtml(draft, square), cardCss(H, square), W, H, 2);
    await sharp(buf).resize(W, H).png({ compressionLevel: 9, effort: 9 })
      .toFile(path.join(OUT, `${draft.id}${suffix}.png`));
    written++;
  }

  await browser.close();
  console.log(`[x-cards] wrote ${written} card(s) to brand/social/x/cards/ (${selected.length - written} skipped)`);
}

main();
