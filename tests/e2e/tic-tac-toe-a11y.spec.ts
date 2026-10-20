import { test, expect, type Page } from '@playwright/test';

const URL = '/tool/game/tic-tac-toe/';

async function ready(page: Page) {
  await page.goto(URL);
  await expect(page.locator('[data-tool="tic-tac-toe"]')).toHaveAttribute('data-ready', 'true');
}
const cell = (page: Page, i: number) => page.locator(`[data-cell="${i}"]`);

/** Text that a screen reader announces: inside an element with role=status and aria-live=polite. */
async function expectAnnounced(page: Page, text: string) {
  const region = page.locator('[role="status"][aria-live="polite"]', { hasText: text });
  await expect(region).toHaveCount(1);
  await expect(region).toBeVisible();
  await expect(region).toHaveText(text);
}

test.describe('tic tac toe announcements and privacy', () => {
  test('turn, win, draw and a taken square are announced through live regions', async ({ page }) => {
    await ready(page);
    await expect(page.locator('[data-board-banner]')).toHaveAttribute('role', 'status');
    await expect(page.locator('[data-board-note]')).toHaveAttribute('aria-live', 'polite');
    await expectAnnounced(page, 'X to play. Pass the phone.');

    await cell(page, 0).click();
    await expectAnnounced(page, 'O to play. Pass the phone.');
    const note = page.locator('[data-board-note]');
    await expect(note).not.toHaveCSS('display', 'none');
    await cell(page, 0).click();
    await expectAnnounced(page, 'That square already has a mark.');

    // A second tap on the taken square must change the DOM text again, or nothing is re-announced.
    await note.evaluate((el) => {
      (window as unknown as { __noteTexts: string[] }).__noteTexts = [];
      new MutationObserver(() => (window as unknown as { __noteTexts: string[] }).__noteTexts.push(el.textContent ?? ''))
        .observe(el, { childList: true, characterData: true, subtree: true });
    });
    await cell(page, 0).click();
    await expectAnnounced(page, 'That square already has a mark.');
    const texts = await page.evaluate(() => (window as unknown as { __noteTexts: string[] }).__noteTexts);
    expect(texts).toEqual(['', 'That square already has a mark.']);
    await expect(note).not.toHaveCSS('display', 'none');

    // A legal move clears the note.
    await cell(page, 3).click();
    await expect(note).toHaveText('');
    // Empty, it is clipped to 1px, not removed from rendering.
    await expect(note).not.toHaveCSS('display', 'none');
    const size = await note.evaluate((el) => [el.getBoundingClientRect().width, el.getBoundingClientRect().height]);
    expect(size[0]).toBeLessThanOrEqual(1);
    expect(size[1]).toBeLessThanOrEqual(1);
    await cell(page, 1).click();
    await cell(page, 4).click();
    await cell(page, 2).click();
    await expectAnnounced(page, 'X wins.');
    await expect(cell(page, 0)).toHaveAccessibleName('Row 1, column 1, X, winning line');
    await expect(cell(page, 2)).toHaveAccessibleName('Row 1, column 3, X, winning line');
    await expect(cell(page, 3)).toHaveAccessibleName('Row 2, column 1, O');

    // Rematch: O opens. A full board with no line is a draw.
    await page.locator('[data-board-rematch]').click();
    await expectAnnounced(page, 'O to play. Pass the phone.');
    // O X O / O X X / X O O
    for (const i of [0, 1, 2, 4, 3, 6, 7, 5, 8]) await cell(page, i).click();
    await expectAnnounced(page, 'Draw.');
    // A draw has no winning line, so no square says it is on one.
    await expect(page.locator('[data-cell][aria-label*="winning line"]')).toHaveCount(0);
  });

  test('squares are named by row and column', async ({ page }) => {
    await ready(page);
    await expect(cell(page, 1)).toHaveAccessibleName('Row 1, column 2, empty');
    await expect(cell(page, 8)).toHaveAccessibleName('Row 3, column 3, empty');
    await cell(page, 5).click();
    await expect(cell(page, 5)).toHaveAccessibleName('Row 2, column 3, X');
  });

  test('rematch alternates who starts', async ({ page }) => {
    await ready(page);
    const banner = page.locator('[data-board-banner]');
    const rematch = page.locator('[data-board-rematch]');
    await rematch.click();
    await expect(banner).toHaveText('O to play. Pass the phone.');
    await cell(page, 4).click();
    await expect(cell(page, 4)).toHaveAttribute('data-mark', 'O');
    await rematch.click();
    await expect(banner).toHaveText('X to play. Pass the phone.');
  });

  test('the score is never written to storage, reset score zeroes it, and a refresh starts at zero', async ({ page }) => {
    await ready(page);
    const score = page.locator('[data-board-score]');
    for (const i of [0, 3, 1, 4, 2]) await cell(page, i).click();
    await expect(score).toHaveText('X 1, O 0, draws 0');

    const stored = await page.evaluate(() => {
      // The platform's recent-tools list names the page; that is not the score. Look for the
      // score's own key and for any value that carries a tally.
      const all = (s: Storage) => Array.from({ length: s.length }, (_, i) => [s.key(i)!, s.getItem(s.key(i)!) ?? '']);
      return [...all(localStorage), ...all(sessionStorage)]
        .filter(([k, v]) => /^toytools\.tic-tac-toe/.test(k) || /"draws"/.test(v))
        .map(([k]) => k);
    });
    expect(stored).toEqual([]);

    const reset = page.getByRole('button', { name: 'Reset score' });
    await expect(reset).toBeVisible();
    await reset.click();
    await expect(score).toHaveText('X 0, O 0, draws 0');
    await expect(page.locator('[data-board-undo]')).toBeDisabled();

    // The finished board stays after a reset; rematch (O opens) and win again.
    await page.locator('[data-board-rematch]').click();
    for (const i of [0, 3, 1, 4, 2]) await cell(page, i).click();
    await expect(score).toHaveText('X 0, O 1, draws 0');
    await page.reload();
    await expect(page.locator('[data-tool="tic-tac-toe"]')).toHaveAttribute('data-ready', 'true');
    await expect(score).toHaveText('X 0, O 0, draws 0');
  });
});
