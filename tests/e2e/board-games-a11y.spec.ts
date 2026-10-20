// The #258 board patterns on all four hot-seat games that share BoardWidget: live regions, a note
// that is never display:none, row and column names, the winning line named on its cells, nothing
// saved, Reset score, and a rematch that hands the first move to the other seat.
import { test, expect, type Page } from '@playwright/test';

type Step = { piece?: string; cell: number };
const GAMES: {
  slug: string;
  url: string;
  columns: number;
  cells: number;
  opener: string;
  /** Moves that end in an X win, and the cells of that line. Quantum has no short scripted win. */
  win?: { steps: Step[]; line: number[] };
}[] = [
  {
    slug: 'tic-tac-toe', url: '/tool/game/tic-tac-toe/', columns: 3, cells: 9, opener: 'O to play. Pass the phone.',
    win: { steps: [0, 3, 1, 4, 2].map((cell) => ({ cell })), line: [0, 1, 2] },
  },
  {
    slug: 'connect-4', url: '/tool/game/connect-4/', columns: 7, cells: 42, opener: 'O to play. Pass the phone.',
    win: { steps: [0, 0, 1, 1, 2, 2, 3].map((cell) => ({ cell })), line: [35, 36, 37, 38] },
  },
  {
    slug: 'chess-tac-toe', url: '/tool/game/chess-tac-toe/', columns: 4, cells: 16, opener: 'O to place. Pass the phone.',
    win: {
      steps: [
        { piece: 'pawn', cell: 0 }, { piece: 'pawn', cell: 12 },
        { piece: 'rook', cell: 1 }, { piece: 'rook', cell: 13 },
        { piece: 'knight', cell: 2 }, { piece: 'knight', cell: 14 },
        { piece: 'bishop', cell: 3 },
      ],
      line: [0, 1, 2, 3],
    },
  },
  { slug: 'quantum-tic-tac-toe', url: '/tool/game/quantum-tic-tac-toe/', columns: 3, cells: 9, opener: 'O to play. Pass the phone.' },
];

async function ready(page: Page, url: string, slug: string) {
  await page.goto(url);
  await expect(page.locator(`[data-tool="${slug}"]`)).toHaveAttribute('data-ready', 'true');
}

async function playSteps(page: Page, steps: Step[]) {
  for (const step of steps) {
    if (step.piece) await page.locator(`[data-piece="${step.piece}"]`).click();
    await page.locator(`[data-cell="${step.cell}"]`).click();
  }
}

function where(index: number, columns: number) {
  return `Row ${Math.floor(index / columns) + 1}, column ${(index % columns) + 1}`;
}

/** Any score key, or any stored value that carries a tally. recent-tools names the page, not the score. */
async function scoreKeys(page: Page) {
  return page.evaluate(() => {
    const all = (s: Storage) => Array.from({ length: s.length }, (_, i) => [s.key(i)!, s.getItem(s.key(i)!) ?? '']);
    return [...all(localStorage), ...all(sessionStorage)]
      .filter(([k, v]) => /\.session$/.test(k) || /"draws"/.test(v))
      .map(([k]) => k);
  });
}

for (const game of GAMES) {
  test.describe(`${game.slug} board patterns`, () => {
    test('live regions, a rendered note, row and column names, Reset score, nothing saved', async ({ page }) => {
      await ready(page, game.url, game.slug);
      const banner = page.locator('[data-board-banner]');
      const note = page.locator('[data-board-note]');
      await expect(banner).toHaveAttribute('role', 'status');
      await expect(banner).toHaveAttribute('aria-live', 'polite');
      await expect(note).toHaveAttribute('role', 'status');
      await expect(note).toHaveAttribute('aria-live', 'polite');
      await expect(note).not.toHaveCSS('display', 'none');
      await expect(page.locator('[data-cell]')).toHaveCount(game.cells);
      const last = game.cells - 1;
      await expect(page.locator(`[data-cell="${last}"]`)).toHaveAccessibleName(`${where(last, game.columns)}, empty`);
      await expect(page.locator('[data-cell="1"]')).toHaveAccessibleName('Row 1, column 2, empty');
      await expect(page.getByRole('button', { name: 'Reset score' })).toBeVisible();
      expect(await scoreKeys(page)).toEqual([]);
    });

    test('rematch hands the first move to the other seat, every time', async ({ page }) => {
      await ready(page, game.url, game.slug);
      const banner = page.locator('[data-board-banner]');
      await page.locator('[data-board-rematch]').click();
      await expect(banner).toHaveText(game.opener);
      await page.locator('[data-board-rematch]').click();
      await expect(banner).toHaveText(game.opener.replace(/^O /, 'X '));
    });

    if (game.win) {
      const win = game.win;
      test('a win is announced, named on its cells, kept in memory only, and Reset score clears it', async ({ page }) => {
        await ready(page, game.url, game.slug);
        await playSteps(page, win.steps);
        await expect(page.locator('[data-board-banner]')).toHaveText('X wins.');
        await expect(page.locator('[role="status"][aria-live="polite"]', { hasText: 'X wins.' })).toHaveCount(1);
        await expect(page.locator('[data-cell][aria-label$=", winning line"]')).toHaveCount(win.line.length);
        for (const i of win.line) {
          await expect(page.locator(`[data-cell="${i}"]`)).toHaveAccessibleName(new RegExp(`^${where(i, game.columns)}, .+, winning line$`));
        }
        const score = page.locator('[data-board-score]');
        await expect(score).toHaveText('X 1, O 0, draws 0');
        expect(await scoreKeys(page)).toEqual([]);
        await page.getByRole('button', { name: 'Reset score' }).click();
        await expect(score).toHaveText('X 0, O 0, draws 0');
        await page.locator('[data-board-rematch]').click();
        await expect(page.locator('[data-cell][aria-label$=", winning line"]')).toHaveCount(0);
        // Win again, then refresh: nothing was saved, so the tally starts at zero.
        await page.locator('[data-board-rematch]').click();
        await playSteps(page, win.steps);
        await expect(score).toHaveText('X 1, O 0, draws 0');
        await page.reload();
        await expect(page.locator(`[data-tool="${game.slug}"]`)).toHaveAttribute('data-ready', 'true');
        await expect(score).toHaveText('X 0, O 0, draws 0');
        expect(await scoreKeys(page)).toEqual([]);
      });
    }
  });
}

test('connect 4: a refused drop is announced, re-announced on repeat, and hover does not repeat it', async ({ page }) => {
  await ready(page, '/tool/game/connect-4/', 'connect-4');
  const note = page.locator('[data-board-note]');
  const drop = (col: number) => page.locator(`[data-cell="${col}"]`).click();
  for (let i = 0; i < 6; i++) await drop(0);
  await drop(0);
  const message = (await note.textContent())!.trim();
  expect(message.length).toBeGreaterThan(0);
  await expect(note).toBeVisible();
  await note.evaluate((el) => {
    (window as unknown as { __t: string[] }).__t = [];
    new MutationObserver(() => (window as unknown as { __t: string[] }).__t.push(el.textContent ?? ''))
      .observe(el, { childList: true, characterData: true, subtree: true });
  });
  await drop(0);
  await expect(note).toHaveText(message);
  expect(await page.evaluate(() => (window as unknown as { __t: string[] }).__t)).toEqual(['', message]);

  await page.evaluate(() => ((window as unknown as { __t: string[] }).__t = []));
  await page.locator('[data-cell="3"]').hover();
  await page.locator('[data-cell="5"]').hover();
  await page.waitForTimeout(100);
  expect(await page.evaluate(() => (window as unknown as { __t: string[] }).__t)).toEqual([]);
});

test('chess tac toe: a refused placement shows in the note, which is never display:none', async ({ page }) => {
  await ready(page, '/tool/game/chess-tac-toe/', 'chess-tac-toe');
  const note = page.locator('[data-board-note]');
  await playSteps(page, [{ piece: 'pawn', cell: 0 }, { piece: 'pawn', cell: 0 }]);
  await expect(note).toHaveText('You cannot capture by placing from your hand.');
  await expect(note).toBeVisible();
  await expect(page.locator('[role="status"][aria-live="polite"]', { hasText: 'You cannot capture' })).toHaveCount(1);
  await page.locator('[data-board-undo]').click();
  await expect(note).toHaveText('');
  await expect(note).not.toHaveCSS('display', 'none');
});
