import { test, expect } from '@playwright/test';

const URL = '/tool/game/quantum-tic-tac-toe/';

test.describe('quantum tic tac toe', () => {
  test('a cycle lists both collapses, and undo restores the links', async ({ page }) => {
    await page.goto(URL);
    const root = page.locator('[data-tool="quantum-tic-tac-toe"]');
    await expect(root).toHaveAttribute('data-ready', 'true');

    const cell = (index: number) => page.locator(`[data-cell="${index}"]`);
    const banner = page.locator('[data-board-banner]');
    const choices = page.locator('[data-choice]');

    await cell(0).click();
    await cell(1).click();
    await cell(1).click();
    await cell(2).click();
    await cell(2).click();
    await cell(0).click();

    await expect(banner).toHaveText('O to choose the collapse. Pass the phone.');
    await expect(choices).toHaveCount(2);
    await expect(root.locator('[data-board-links] line')).toHaveCount(3);
    await expect(cell(1)).toContainText('X1 O2');

    await choices.first().click();
    await expect(choices).toHaveCount(0);
    await expect(root.locator('[data-board-links] line')).toHaveCount(0);

    await page.locator('[data-board-undo]').click();
    await expect(choices).toHaveCount(2);
    await expect(root.locator('[data-board-links] line')).toHaveCount(3);
    await expect(root.locator('[data-craft="entanglement-graph"]')).toHaveCount(1);
  });
});
