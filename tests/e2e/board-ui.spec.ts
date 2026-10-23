// Board UI on desktop and Pixel 5: SVG marks (no font glyph, so no tofu or emoji), the turn chip,
// last-move and selection highlights, legal-move markers, deselect, and mark contrast in both themes.
import { test, expect, type Page } from '@playwright/test';

const url = (slug: string) => `/tool/game/${slug}/`;
const cell = (page: Page, i: number) => page.locator(`[data-cell="${i}"]`);

async function open(page: Page, slug: string, theme?: 'light' | 'dark') {
  await page.goto(url(slug));
  if (theme) await page.evaluate((t) => document.documentElement.setAttribute('data-theme', t), theme);
  await expect(page.locator('[data-ready="true"]')).toHaveCount(1);
}

// WCAG relative luminance contrast of two computed rgb() colours.
async function contrast(page: Page, fg: string, bg: string): Promise<number> {
  return page.evaluate(([a, b]) => {
    const lum = (c: string) => {
      const [r, g, bl] = (c.match(/[\d.]+/g) ?? []).slice(0, 3).map(Number).map((v) => {
        const s = v / 255;
        return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
      });
      return 0.2126 * r! + 0.7152 * g! + 0.0722 * bl!;
    };
    const [hi, lo] = [lum(a!), lum(b!)].sort((x, y) => y - x);
    return (hi! + 0.05) / (lo! + 0.05);
  }, [fg, bg]);
}

test('tic tac toe: SVG marks, the turn chip, and the last move follow each play', async ({ page }) => {
  await open(page, 'tic-tac-toe');
  const chip = page.locator('[data-board-turn]');
  await expect(chip).toHaveAttribute('data-seat', 'X');
  await cell(page, 0).click();
  await expect(cell(page, 0).locator('.mark svg path')).toHaveCount(1);
  await expect(cell(page, 0)).toHaveClass(/is-last/);
  await expect(chip).toHaveAttribute('data-seat', 'O');
  await cell(page, 4).click();
  await expect(cell(page, 4).locator('.mark svg circle')).toHaveCount(1);
  await expect(cell(page, 4)).toHaveClass(/is-last/);
  await expect(cell(page, 0)).not.toHaveClass(/is-last/);
  await page.locator('[data-board-undo]').click();
  await expect(page.locator('.board-cell.is-last')).toHaveCount(0);
});

test('connect 4: X is a solid disc, O a thick ring, and the dropped square is the last move', async ({ page }) => {
  await open(page, 'connect-4');
  await cell(page, 38).click();
  await expect(cell(page, 38).locator('.mark svg circle.fill')).toHaveCount(1);
  await expect(cell(page, 38)).toHaveClass(/is-last/);
  await cell(page, 38).click();
  await expect(cell(page, 31).locator('.mark svg circle')).toHaveCount(1);
  await expect(cell(page, 31).locator('.mark svg circle.fill')).toHaveCount(0);
  await expect(cell(page, 31)).toHaveClass(/is-last/);
});

test('chess tac toe: a picked piece marks every legal square, Escape and a second tap deselect', async ({ page }) => {
  await open(page, 'chess-tac-toe');
  const hand = page.locator('[data-piece]').first();
  await expect(hand.locator('svg')).toHaveCount(1);
  await hand.click();
  await expect(hand).toHaveClass(/is-selected/);
  await expect(page.locator('.board-cell.is-target')).toHaveCount(16);
  await page.keyboard.press('Escape');
  await expect(page.locator('.board-cell.is-target')).toHaveCount(0);
  await expect(page.locator('.board-hand-btn.is-selected')).toHaveCount(0);

  await page.locator('[data-piece]').first().click();
  await cell(page, 5).click();
  await expect(cell(page, 5).locator('.mark svg .fill').first()).toBeVisible();
  await expect(cell(page, 5)).toHaveClass(/is-last/);
  await page.locator('[data-piece]').first().click();
  await cell(page, 10).click();
  await cell(page, 5).click();
  await expect(cell(page, 5)).toHaveClass(/is-selected/);
  await cell(page, 5).click();
  await expect(cell(page, 5)).not.toHaveClass(/is-selected/);
  await expect(page.locator('.board-cell.is-target')).toHaveCount(0);
});

test('quantum: the first square of a pair marks the others, and Escape drops it', async ({ page }) => {
  await open(page, 'quantum-tic-tac-toe');
  await cell(page, 0).click();
  await expect(cell(page, 0)).toHaveClass(/is-selected/);
  await expect(page.locator('.board-cell.is-target')).toHaveCount(8);
  await page.keyboard.press('Escape');
  await expect(page.locator('.board-cell.is-target')).toHaveCount(0);
  await cell(page, 1).click();
  await expect(cell(page, 1)).toHaveClass(/is-selected/);
  await page.keyboard.press('Escape');
  await expect(page.locator('.board-cell.is-selected')).toHaveCount(0);
  await cell(page, 0).click();
  await cell(page, 4).click();
  await expect(cell(page, 0)).toHaveClass(/is-last/);
  await expect(cell(page, 4)).toHaveClass(/is-last/);
});

for (const theme of ['light', 'dark'] as const) {
  test(`marks and markers clear 3:1 on the square in the ${theme} theme, with no emoji`, async ({ page }) => {
    for (const slug of ['tic-tac-toe', 'connect-4', 'chess-tac-toe', 'quantum-tic-tac-toe']) {
      await open(page, slug, theme);
      if (slug === 'chess-tac-toe') {
        await page.locator('[data-piece]').first().click();
        await cell(page, 5).click();
        await page.locator('[data-piece]').first().click();
        await cell(page, 10).click();
        await page.locator('[data-piece]').first().click();
      } else if (slug === 'quantum-tic-tac-toe') {
        await cell(page, 0).click();
      } else {
        await cell(page, slug === 'connect-4' ? 38 : 0).click();
        await cell(page, slug === 'connect-4' ? 38 : 4).click();
      }
      const pairs = await page.evaluate(() => {
        const out: [string, string, string][] = [];
        for (const btn of document.querySelectorAll<HTMLElement>('[data-board-grid] [data-cell]')) {
          const bg = getComputedStyle(btn).backgroundColor;
          const svg = btn.querySelector('.mark svg');
          if (svg) out.push([getComputedStyle(svg).color, bg, 'mark ' + btn.dataset.cell]);
          if (btn.classList.contains('is-target')) {
            const after = getComputedStyle(btn, '::after');
            out.push([btn.dataset.mark === 'empty' ? after.backgroundColor : after.borderTopColor, bg, 'target ' + btn.dataset.cell]);
          }
        }
        return out;
      });
      expect(pairs.length, slug).toBeGreaterThan(1);
      for (const [fg, bg, what] of pairs) {
        expect(await contrast(page, fg, bg), `${slug} ${what} ${fg} on ${bg}`).toBeGreaterThanOrEqual(3);
      }
      const text = await page.locator('.board-match').innerText();
      expect(text, slug).not.toMatch(/\p{Extended_Pictographic}/u);
      expect(text, slug).not.toMatch(/\uFE0F/);
    }
  });
}

test('at 320 px each board fits and every square is still a touch target', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 720 });
  for (const slug of ['tic-tac-toe', 'connect-4', 'chess-tac-toe', 'quantum-tic-tac-toe']) {
    await open(page, slug);
    const box = await page.locator('[data-board-grid]').boundingBox();
    expect(box!.x).toBeGreaterThanOrEqual(0);
    expect(box!.x + box!.width, slug).toBeLessThanOrEqual(320);
    const sq = await cell(page, 0).boundingBox();
    expect(sq!.height, slug).toBeGreaterThanOrEqual(44);
    expect(sq!.width, slug).toBeGreaterThanOrEqual(slug === 'connect-4' ? 36 : 44);
  }
});

// Exact legal-move sets. Each set below differs from "every other square", so a marker that skips
// the engine check (marking any square that names a move) fails these.
const targets = (page: Page) =>
  page.evaluate(() => [...document.querySelectorAll<HTMLElement>('.board-cell.is-target')].map((b) => Number(b.dataset.cell)).sort((a, b) => a - b));

async function chessSliding(page: Page) {
  await open(page, 'chess-tac-toe');
  // X rook 12 under its own knight on 8, X pawn 9 with an O rook diagonally ahead on 4.
  for (const [piece, i] of [['rook', 12], ['pawn', 3], ['knight', 8], ['rook', 4], ['pawn', 9], ['bishop', 15], ['bishop', 0], ['knight', 7]] as const) {
    await page.locator(`[data-piece="${piece}"]`).click();
    await cell(page, i).click();
  }
  await expect(page.locator('[data-board-banner]')).toHaveText('X to move. Pass the phone.');
}

test('chess tac toe: a blocked rook marks only the squares it can reach, and the note counts them', async ({ page }) => {
  await chessSliding(page);
  await cell(page, 12).click();
  await expect(cell(page, 12)).toHaveClass(/is-selected/);
  expect(await targets(page)).toEqual([13, 14, 15]);
  await expect(page.locator('[data-board-note]')).toHaveText('Rook selected, 3 legal moves');
  await expect(cell(page, 12)).toHaveAccessibleName('Row 4, column 1, X rook, selected');
  await cell(page, 12).click();
  await expect(page.locator('[data-board-note]')).toHaveText('');
});

test('chess tac toe: a pawn marks its forward square and its diagonal capture only', async ({ page }) => {
  await chessSliding(page);
  await cell(page, 9).click();
  expect(await targets(page)).toEqual([4, 5]);
  await expect(page.locator('[data-board-note]')).toHaveText('Pawn selected, 2 legal moves');
  await page.keyboard.press('Escape');
  await expect(page.locator('[data-board-note]')).toHaveText('');
});

test('quantum: a pair start marks every empty square except itself, not the classical ones', async ({ page }) => {
  await open(page, 'quantum-tic-tac-toe');
  for (let i = 0; i < 2; i++) {
    await cell(page, 0).click();
    await cell(page, 1).click();
  }
  await page.locator('[data-choice]').first().click();
  await expect(cell(page, 0)).not.toHaveAttribute('data-mark', 'empty');
  await expect(cell(page, 1)).not.toHaveAttribute('data-mark', 'empty');
  await cell(page, 2).click();
  expect(await targets(page)).toEqual([3, 4, 5, 6, 7, 8]);
});

for (const theme of ['light', 'dark'] as const) {
  test(`chess tac toe: X pieces are filled, O pieces outlined, on the board and the turn chip (${theme})`, async ({ page }) => {
    await open(page, 'chess-tac-toe', theme);
    const chip = page.locator('[data-board-turn]');
    const style = (sel: string) =>
      page.evaluate((s) => {
        const el = document.querySelector(s)!;
        const host = el.closest('[data-cell], [data-board-turn]') as HTMLElement;
        const cs = getComputedStyle(el);
        return { fill: cs.fill, stroke: cs.stroke, width: parseFloat(cs.strokeWidth), bg: getComputedStyle(host).backgroundColor, page: getComputedStyle(document.body).backgroundColor };
      }, sel);
    let c = await style('[data-board-turn] .fill');
    expect(c.fill).not.toBe(c.page);
    await page.locator('[data-piece="pawn"]').click();
    await cell(page, 5).click();
    await expect(chip).toHaveAttribute('data-seat', 'O');
    c = await style('[data-board-turn] .fill');
    expect(c.width).toBeGreaterThanOrEqual(6);
    expect(await contrast(page, c.stroke, c.fill)).toBeGreaterThanOrEqual(3);
    await page.locator('[data-piece="pawn"]').click();
    await cell(page, 10).click();
    const x = await style('[data-cell="5"] .mark .fill');
    const o = await style('[data-cell="10"] .mark .fill');
    // X: a solid body in the text colour. O: hollow (body painted the square colour), thick accent edge.
    expect(await contrast(page, x.fill, x.bg)).toBeGreaterThanOrEqual(3);
    expect(o.fill).toBe(o.bg);
    expect(o.width).toBeGreaterThanOrEqual(6);
    expect(await contrast(page, o.stroke, o.bg)).toBeGreaterThanOrEqual(3);
    expect(x.fill).not.toBe(o.fill);
    expect(x.width).toBeLessThan(o.width);
  });
}

test('the turn chip hides once the game is won', async ({ page }) => {
  await open(page, 'tic-tac-toe');
  const chip = page.locator('[data-board-turn]');
  await expect(chip).toBeVisible();
  for (const i of [0, 3, 1, 4, 2]) await cell(page, i).click();
  await expect(chip).toBeHidden();
  await page.locator('[data-board-rematch]').click();
  await expect(chip).toBeVisible();
});

test('connect 4: the O disc is a thick ring, on the board and in the turn chip', async ({ page }) => {
  await open(page, 'connect-4');
  await cell(page, 38).click();
  await cell(page, 38).click();
  const width = (sel: string) => page.locator(sel).evaluate((el) => getComputedStyle(el).strokeWidth);
  expect(await width('[data-cell="31"] .mark circle')).toBe('20px');
  await cell(page, 37).click();
  expect(await width('[data-board-turn] circle')).toBe('20px');
  // The hover ghost is a preview, never the last move.
  await cell(page, 3).hover();
  if (!test.info().project.name.includes('pixel')) await expect(page.locator('.board-cell.is-ghost')).toHaveCount(1);
  await expect(page.locator('.board-cell.is-ghost.is-last')).toHaveCount(0);
});
