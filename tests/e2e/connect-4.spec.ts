import { test, expect } from '@playwright/test';

const URL = '/tool/game/connect-4/';

test.describe('connect 4', () => {
  test('a vertical four scores, undo returns the point, rematch keeps it', async ({ page }) => {
    await page.goto(URL);
    const root = page.locator('[data-tool="connect-4"]');
    await expect(root).toHaveAttribute('data-ready', 'true');

    const banner = page.locator('[data-board-banner]');
    const score = page.locator('[data-board-score]');
    const column = (index: number) => page.locator(`[data-cell="${index}"]`);

    for (const index of [0, 1, 0, 1, 0, 1, 0]) {
      await column(index).click();
    }

    await expect(banner).toHaveText('X wins.');
    await expect(score).toHaveText('X 1, O 0, draws 0');
    await expect(column(35)).toHaveAttribute('data-shape', 'disc');
    await expect(column(36)).toHaveAttribute('data-shape', 'ring');
    await expect(root.locator('[data-craft="column-preview"]')).toBeVisible();

    await page.locator('[data-board-undo]').click();
    await expect(banner).toHaveText('X to play. Pass the phone.');
    await expect(score).toHaveText('X 0, O 0, draws 0');

    await column(0).click();
    await expect(banner).toHaveText('X wins.');
    await page.locator('[data-board-rematch]').click();
    await expect(banner).toHaveText('X to play. Pass the phone.');
    await expect(score).toHaveText('X 1, O 0, draws 0');
    await expect(column(35)).toHaveAttribute('data-mark', 'empty');
  });
});
