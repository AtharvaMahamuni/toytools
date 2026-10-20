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

    await page.locator('[data-board-undo]').click();
    await expect(square).toHaveAttribute('data-mark', 'empty');
    await expect(banner).toHaveText('X to place. Pass the phone.');
    await expect(root.locator('[data-craft="illegal-reason"]')).toHaveCount(1);
  });
});
