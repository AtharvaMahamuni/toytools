// Game accessibility (audit PR B): one Tab stop per board with arrow keys, chess labels that name
// the owner and the piece, hand buttons named "Place pawn", the Quantum collapse hint on the first
// tap, and a trust badge that does not claim the games store data.
import { test, expect, type Page } from '@playwright/test';

async function ready(page: Page, slug: string) {
  await page.goto(`/tool/game/${slug}/`);
  await expect(page.locator(`[data-tool="${slug}"]`)).toHaveAttribute('data-ready', 'true');
}
const cell = (page: Page, i: number) => page.locator(`[data-cell="${i}"]`);

const GAMES = [
  { slug: 'tic-tac-toe', columns: 3, rows: 3 },
  { slug: 'connect-4', columns: 7, rows: 6 },
  { slug: 'chess-tac-toe', columns: 4, rows: 4 },
  { slug: 'quantum-tic-tac-toe', columns: 3, rows: 3 },
];

for (const game of GAMES) {
  test(`${game.slug}: the board is one Tab stop and arrows move between squares`, async ({ page }) => {
    await ready(page, game.slug);
    const last = game.columns * game.rows - 1;
    await expect(page.locator('[data-cell][tabindex="0"]')).toHaveCount(1);
    await cell(page, 0).focus();
    await page.keyboard.press('ArrowRight');
    await expect(cell(page, 1)).toBeFocused();
    await page.keyboard.press('ArrowDown');
    await expect(cell(page, 1 + game.columns)).toBeFocused();
    await page.keyboard.press('ArrowLeft');
    await page.keyboard.press('ArrowLeft');
    await expect(cell(page, game.columns)).toBeFocused();
    await page.keyboard.press('ArrowUp');
    await page.keyboard.press('ArrowUp');
    await expect(cell(page, 0)).toBeFocused();
    await page.keyboard.press('End');
    await expect(cell(page, game.columns - 1)).toBeFocused();
    await page.keyboard.press('Home');
    await expect(cell(page, 0)).toBeFocused();
    for (let i = 0; i < game.rows; i++) await page.keyboard.press('ArrowDown');
    await page.keyboard.press('End');
    await expect(cell(page, last)).toBeFocused();
    // The bottom row and the right edge clamp: no wrap and no escape off the board.
    await page.keyboard.press('ArrowDown');
    await expect(cell(page, last)).toBeFocused();
    await page.keyboard.press('ArrowRight');
    await expect(cell(page, last)).toBeFocused();
    await page.keyboard.press('Home');
    await page.keyboard.press('ArrowDown');
    await expect(cell(page, last - game.columns + 1)).toBeFocused();
    await page.keyboard.press('ArrowLeft');
    await expect(cell(page, last - game.columns + 1)).toBeFocused();
    // Clamping never leaves two squares, or none, in the Tab order.
    await expect(page.locator('[data-cell][tabindex="0"]')).toHaveCount(1);
    await expect(cell(page, last - game.columns + 1)).toHaveAttribute('tabindex', '0');
    await page.keyboard.press('End');
    await expect(cell(page, last)).toHaveAttribute('tabindex', '0');
    await expect(page.locator('[data-cell][tabindex="0"]')).toHaveCount(1);
    // Tab leaves the board in one step and Shift+Tab comes back to the last square.
    await page.keyboard.press('Tab');
    await expect(page.locator('[data-cell]:focus')).toHaveCount(0);
    await page.keyboard.press('Shift+Tab');
    await expect(cell(page, last)).toBeFocused();
  });

  test(`${game.slug}: the trust badge does not say data is stored`, async ({ page }) => {
    await page.goto(`/tool/game/${game.slug}/`);
    await expect(page.locator('body')).not.toContainText('Data stored only on this device');
    await expect(page.locator('.trust-badge').first()).toContainText('Offline');
  });
}

test('tic tac toe: Enter plays the square the arrows reached', async ({ page }) => {
  await ready(page, 'tic-tac-toe');
  await cell(page, 0).focus();
  await page.keyboard.press('ArrowRight');
  await page.keyboard.press('ArrowDown');
  await page.keyboard.press('Enter');
  await expect(cell(page, 4)).toHaveAttribute('data-mark', 'X');
});

test('chess tac toe: squares name the owner and piece, hand buttons say Place', async ({ page }) => {
  await ready(page, 'chess-tac-toe');
  const hand = page.locator('[data-board-hand]');
  await expect(hand.getByRole('button', { name: 'Place pawn' })).toBeVisible();
  await expect(hand.getByRole('button', { name: 'Place rook' })).toBeVisible();
  await expect(hand.getByRole('button', { name: 'Place knight' })).toBeVisible();
  await expect(hand.getByRole('button', { name: 'Place bishop' })).toBeVisible();
  await expect(page.locator('[data-piece="rook"]')).toHaveText('R');
  await page.locator('[data-piece="rook"]').click();
  await cell(page, 0).click();
  await expect(cell(page, 0)).toHaveAccessibleName('Row 1, column 1, X rook');
  await page.locator('[data-piece="rook"]').click();
  await cell(page, 15).click();
  await expect(cell(page, 15)).toHaveAccessibleName('Row 4, column 4, O rook');
  await expect(cell(page, 1)).toHaveAccessibleName('Row 1, column 2, empty');
});

test('quantum: the first tap during a waiting collapse points to the collapse buttons', async ({ page }) => {
  await ready(page, 'quantum-tic-tac-toe');
  for (let i = 0; i < 2; i++) {
    await cell(page, 0).click();
    await cell(page, 1).click();
  }
  await expect(page.locator('[data-choice]')).toHaveCount(2);
  await cell(page, 4).click();
  await expect(page.locator('[data-board-note]')).toHaveText('Choose how the cycle collapses with the buttons under the board.');
  await expect(cell(page, 4)).not.toHaveClass(/is-selected/);
  await page.locator('[data-choice]').first().click();
  await expect(page.locator('[data-choice]')).toHaveCount(0);
  await expect(page.locator('[data-board-note]')).toHaveText('');
});

test('chess tac toe: a valid pick clears the last refusal note', async ({ page }) => {
  await ready(page, 'chess-tac-toe');
  const note = page.locator('[data-board-note]');
  await page.locator('[data-piece="pawn"]').click();
  await cell(page, 0).click(); // X pawn
  await page.locator('[data-piece="pawn"]').click();
  await cell(page, 0).click(); // O on X: refused, pawn stays picked
  await expect(note).not.toHaveText('');
  await page.locator('[data-piece="rook"]').click();
  await expect(note).toHaveText('');
  await expect(page.locator('[data-piece="rook"]')).toHaveAttribute('aria-pressed', 'true');
  await cell(page, 5).click(); // O rook placed
  await expect(cell(page, 5)).toHaveAccessibleName('Row 2, column 2, O rook');
});
