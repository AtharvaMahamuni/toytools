import { test, expect } from '@playwright/test';

const URL = '/tool/game/tic-tac-toe/';

test.describe('tic tac toe', () => {
  test('a top-row win scores, undo returns the point, rematch keeps it', async ({ page }) => {
    await page.goto(URL);
    const root = page.locator('[data-tool="tic-tac-toe"]');
    await expect(root).toHaveAttribute('data-ready', 'true');

    const cell = (index: number) => page.locator(`[data-cell="${index}"]`);
    const banner = page.locator('[data-board-banner]');
    const score = page.locator('[data-board-score]');

    await expect(cell(0)).toHaveAttribute('data-shape', 'empty');
    await cell(0).click();
    await expect(cell(0)).toHaveAttribute('data-shape', 'cross');
    await expect(cell(0)).toContainText('X');
    await expect(banner).toHaveText('O to play. Pass the phone.');

    await cell(0).click();
    await expect(banner).toHaveText('O to play. Pass the phone.');
    await expect(page.locator('[data-board-note]')).toHaveText('That square already has a mark.');

    await cell(3).click();
    await expect(cell(3)).toHaveAttribute('data-shape', 'ring');
    await expect(cell(3)).toContainText('O');
    await cell(1).click();
    await cell(4).click();
    await cell(2).click();

    await expect(banner).toHaveText('X wins.');
    await expect(score).toHaveText('X 1, O 0, draws 0');
    await expect(root.locator('[data-craft="marks-by-shape"]')).toBeVisible();

    await page.locator('[data-board-undo]').click();
    await expect(banner).toHaveText('X to play. Pass the phone.');
    await expect(cell(2)).toHaveAttribute('data-mark', 'empty');
    await expect(score).toHaveText('X 0, O 0, draws 0');

    await cell(2).click();
    await expect(banner).toHaveText('X wins.');
    await page.locator('[data-board-rematch]').click();
    await expect(banner).toHaveText('O to play. Pass the phone.');
    await expect(score).toHaveText('X 1, O 0, draws 0');
    await expect(cell(0)).toHaveAttribute('data-mark', 'empty');
  });
});
