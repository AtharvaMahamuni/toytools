// One basic match per input mode the shared BoardWidget runs: cell (Tic Tac Toe), column
// (Connect 4, by pointer and by keyboard), chess (place and slide) and pair (Quantum, including a
// scripted win).
import { test, expect, type Page } from '@playwright/test';

async function ready(page: Page, slug: string) {
  await page.goto(`/tool/game/${slug}/`);
  await expect(page.locator(`[data-tool="${slug}"]`)).toHaveAttribute('data-ready', 'true');
}
const cell = (page: Page, i: number) => page.locator(`[data-cell="${i}"]`);
const banner = (page: Page) => page.locator('[data-board-banner]');
const discs = (page: Page) => page.locator('[data-cell][data-mark="X"], [data-cell][data-mark="O"]');

test('cell mode: a tap marks one square', async ({ page }) => {
  await ready(page, 'tic-tac-toe');
  await cell(page, 4).click();
  await expect(cell(page, 4)).toHaveAttribute('data-mark', 'X');
  await expect(banner(page)).toHaveText('O to play. Pass the phone.');
});

test('column mode: one click drops exactly one disc to the bottom', async ({ page }) => {
  await ready(page, 'connect-4');
  await cell(page, 3).click();
  await expect(discs(page)).toHaveCount(1);
  await expect(cell(page, 38)).toHaveAttribute('data-mark', 'X');
  await expect(banner(page)).toHaveText('O to play. Pass the phone.');
});

test('column mode by keyboard: Enter and Space each drop one disc into the focused column', async ({ page }) => {
  await ready(page, 'connect-4');
  await cell(page, 2).focus();
  await page.keyboard.press('Enter');
  await expect(discs(page)).toHaveCount(1);
  await expect(cell(page, 37)).toHaveAttribute('data-mark', 'X');
  await expect(banner(page)).toHaveText('O to play. Pass the phone.');

  await cell(page, 2).focus();
  await page.keyboard.press('Space');
  await expect(discs(page)).toHaveCount(2);
  await expect(cell(page, 30)).toHaveAttribute('data-mark', 'O');

  await cell(page, 5).focus();
  await page.keyboard.press('Enter');
  await expect(discs(page)).toHaveCount(3);
  await expect(cell(page, 40)).toHaveAttribute('data-mark', 'X');
  await expect(banner(page)).toHaveText('O to play. Pass the phone.');
});

test('chess mode: place from the hand, then slide once the hand is empty', async ({ page }) => {
  await ready(page, 'chess-tac-toe');
  const place = async (piece: string, i: number) => {
    await page.locator(`[data-piece="${piece}"]`).click();
    await cell(page, i).click();
  };
  await place('pawn', 0);
  await place('pawn', 3);
  await place('rook', 5);
  await place('rook', 6);
  await place('knight', 10);
  await place('knight', 9);
  await place('bishop', 14);
  await place('bishop', 13);
  await expect(banner(page)).toHaveText('X to move. Pass the phone.');
  await expect(page.locator('[data-piece]')).toHaveCount(0);
  await cell(page, 5).click();
  await cell(page, 4).click();
  await expect(cell(page, 4)).toHaveAttribute('data-mark', 'X');
  await expect(cell(page, 5)).toHaveAttribute('data-mark', 'empty');
  await expect(banner(page)).toHaveText('O to move. Pass the phone.');
});

test('pair mode: a scripted quantum win, with the line named on its cells', async ({ page }) => {
  await ready(page, 'quantum-tic-tac-toe');
  const pair = async (a: number, b: number) => {
    await cell(page, a).click();
    await cell(page, b).click();
  };
  for (const [a, b] of [[0, 1], [8, 7], [1, 2], [7, 6], [2, 8], [6, 0]] as const) await pair(a, b);
  await expect(banner(page)).toHaveText('X to choose the collapse. Pass the phone.');
  const choices = page.locator('[data-choice]');
  await expect(choices).toHaveCount(2);
  // One of the two resolutions gives X the earlier line. Try the first; if it is not the X win,
  // undo and take the other.
  await choices.nth(0).click();
  if ((await banner(page).textContent()) !== 'X wins. O has a later line.') {
    await page.locator('[data-board-undo]').click();
    await choices.nth(1).click();
  }
  await expect(banner(page)).toHaveText('X wins. O has a later line.');
  await expect(page.locator('[data-board-score]')).toHaveText('X 1, O 0, draws 0');
  for (const i of [0, 1, 2]) {
    await expect(cell(page, i)).toHaveAccessibleName(new RegExp(`^Row 1, column ${i + 1}, X, winning line$`));
  }
  await expect(page.locator('[data-cell][aria-label$=", winning line"]')).toHaveCount(3);
});

test('pair mode: the same pair twice collapses instead of being refused', async ({ page }) => {
  await ready(page, 'quantum-tic-tac-toe');
  for (let i = 0; i < 2; i++) {
    await cell(page, 0).click();
    await cell(page, 1).click();
  }
  await expect(page.locator('[data-board-note]')).toHaveText('');
  await expect(banner(page)).toHaveText('X to choose the collapse. Pass the phone.');
  await expect(page.locator('[data-choice]')).toHaveCount(2);
});

test('house-rule lines: quantum names its simplified scoring, chess has no draw rule', async ({ page }) => {
  await ready(page, 'quantum-tic-tac-toe');
  await expect(page.locator('[data-board-rule]')).toContainText("does not use Goff's half-point scoring");
  await ready(page, 'chess-tac-toe');
  await expect(page.locator('[data-board-rule]')).toHaveText('No draw rule. If nobody can make four in a line, use Rematch.');
  await ready(page, 'tic-tac-toe');
  await expect(page.locator('[data-board-rule]')).toHaveCount(0);
});
