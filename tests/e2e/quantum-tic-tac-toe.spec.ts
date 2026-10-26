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

  test('tapping the same square twice keeps that square selected', async ({ page }) => {
    await page.goto(URL);
    const root = page.locator('[data-tool="quantum-tic-tac-toe"]');
    await expect(root).toHaveAttribute('data-ready', 'true');
    const first = page.locator('[data-cell="0"]');

    await first.click();
    await first.click();

    await expect(first).toHaveClass(/is-selected/);
    await expect(page.locator('[data-board-note]')).toHaveText('A move marks two different squares.');
    await expect(page.locator('[data-board-links] line')).toHaveCount(0);
  });
});

test('tapping a classical square keeps the first square selected', async ({ page }) => {
  await page.goto(URL);
  await expect(page.locator('[data-tool="quantum-tic-tac-toe"]')).toHaveAttribute('data-ready', 'true');
  const cell = (i: number) => page.locator(`[data-cell="${i}"]`);
  // A same-pair 2-cycle on the top left and top middle, collapsed: both are classical.
  for (let i = 0; i < 2; i++) {
    await cell(0).click();
    await cell(1).click();
  }
  await page.locator('[data-choice]').first().click();
  await expect(cell(0)).not.toHaveAttribute('data-mark', 'empty');
  await cell(4).click();
  await expect(cell(4)).toHaveClass(/is-selected/);
  await cell(0).click();
  await expect(page.locator('[data-board-note]')).toHaveText('That square already has a classical mark.');
  await expect(cell(4)).toHaveClass(/is-selected/);
  await expect(cell(4)).toHaveAccessibleName(/, selected$/);
});

test.describe('quantum tic tac toe: deselecting the first square', () => {
  test('tapping the selected first square again deselects it and announces it', async ({ page }) => {
    await page.goto(URL);
    const root = page.locator('[data-tool="quantum-tic-tac-toe"]');
    await expect(root).toHaveAttribute('data-ready', 'true');
    const cell = (index: number) => page.locator(`[data-cell="${index}"]`);
    const note = root.locator('[data-board-note]');
    await expect(note).toHaveAttribute('aria-live', 'polite');

    await cell(4).click();
    await expect(cell(4)).toHaveClass(/is-selected/);
    await cell(4).click();
    await expect(cell(4)).not.toHaveClass(/is-selected/);
    await expect(note).toHaveText('Row 2, column 2 deselected. Pick two different squares.');
    await expect(page.locator('[data-board-banner]')).toHaveText('X to play. Pass the phone.');

    // The next two taps make a normal move from scratch.
    await cell(0).click();
    await cell(8).click();
    await expect(cell(0)).toContainText('X1');
    await expect(cell(8)).toContainText('X1');
    await expect(cell(4)).not.toContainText('X1');
  });
});
