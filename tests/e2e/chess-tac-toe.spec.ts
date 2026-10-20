import { test, expect } from '@playwright/test';

const URL = '/tool/game/chess-tac-toe/';

test.describe('chess tac toe', () => {
  test('an occupied square is refused, and undo clears the first pawn', async ({ page }) => {
    await page.goto(URL);
    const root = page.locator('[data-tool="chess-tac-toe"]');
    await expect(root).toHaveAttribute('data-ready', 'true');

    const banner = page.locator('[data-board-banner]');
    const note = page.locator('[data-board-note]');
    const square = page.locator('[data-cell="0"]');

    await page.locator('[data-piece="pawn"]').click();
    await square.click();
    await expect(banner).toHaveText('O to place. Pass the phone.');
    await expect(square).toHaveAttribute('data-mark', 'X');

    await page.locator('[data-piece="pawn"]').click();
    await square.click();
    await expect(note).toHaveText('You cannot capture by placing from your hand.');
    await expect(banner).toHaveText('O to place. Pass the phone.');
    await expect(page.locator('[data-piece="pawn"]')).toHaveClass(/is-selected/);

    await page.locator('[data-board-undo]').click();
    await expect(square).toHaveAttribute('data-mark', 'empty');
    await expect(banner).toHaveText('X to place. Pass the phone.');
    await expect(root.locator('[data-craft="illegal-reason"]')).toHaveCount(1);
  });
});

test.describe('chess tac toe origin selection', () => {
  async function slidingPhase(page: import('@playwright/test').Page) {
    await page.goto(URL);
    await expect(page.locator('[data-tool="chess-tac-toe"]')).toHaveAttribute('data-ready', 'true');
    // X 0, O 3, X 5, O 6, X 10, O 9, X 14, O 13: no line, both hands empty, X to move.
    for (const [piece, i] of [['pawn', 0], ['pawn', 3], ['rook', 5], ['rook', 6], ['knight', 10], ['knight', 9], ['bishop', 14], ['bishop', 13]] as const) {
      await page.locator(`[data-piece="${piece}"]`).click();
      await page.locator(`[data-cell="${i}"]`).click();
    }
    await expect(page.locator('[data-board-banner]')).toHaveText('X to move. Pass the phone.');
  }
  const cell = (page: import('@playwright/test').Page, i: number) => page.locator(`[data-cell="${i}"]`);
  const selected = (page: import('@playwright/test').Page) => page.locator('[data-cell].is-selected');

  test('an empty square is not picked; then your own piece is, and a legal move succeeds', async ({ page }) => {
    await slidingPhase(page);
    await cell(page, 8).click(); // empty
    await expect(page.locator('[data-board-note]')).toHaveText('That is not your piece.');
    await expect(selected(page)).toHaveCount(0);
    await cell(page, 5).click(); // X rook
    await expect(selected(page)).toHaveCount(1);
    await expect(cell(page, 5)).toHaveAccessibleName(/, selected$/);
    await cell(page, 4).click(); // rook slides left
    await expect(cell(page, 4)).toHaveAttribute('data-mark', 'X');
    await expect(cell(page, 5)).toHaveAttribute('data-mark', 'empty');
    await expect(page.locator('[data-board-banner]')).toHaveText('O to move. Pass the phone.');
    await expect(selected(page)).toHaveCount(0);
  });

  test("the other player's piece is not picked, and the next own-piece tap still works", async ({ page }) => {
    await slidingPhase(page);
    await cell(page, 6).click(); // O rook
    await expect(page.locator('[data-board-note]')).toHaveText('That is not your piece.');
    await expect(selected(page)).toHaveCount(0);
    await cell(page, 6).click(); // still not yours, still not a trap
    await expect(selected(page)).toHaveCount(0);
    await cell(page, 5).click();
    await cell(page, 4).click();
    await expect(cell(page, 4)).toHaveAttribute('data-mark', 'X');
  });

  test('a refused slide keeps your own piece selected; tapping another own piece moves the selection', async ({ page }) => {
    await slidingPhase(page);
    await cell(page, 5).click(); // X rook
    await cell(page, 15).click(); // not a rook move
    await expect(page.locator('[data-board-note]')).not.toHaveText('');
    await expect(cell(page, 5)).toHaveClass(/is-selected/);
    await cell(page, 10).click(); // another X piece
    await expect(cell(page, 10)).toHaveClass(/is-selected/);
    await expect(selected(page)).toHaveCount(1);
  });
});
