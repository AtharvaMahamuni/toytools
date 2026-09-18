// Deep suite for Book Tracker — Chromium + Pixel 5.
// Persist, finished forces progress 100 and leaves Reading, import merge
// (no duplicate, ratings survive header aliases), and the 200 book cap.
import { test, expect, type Page } from '@playwright/test';

const URL = '/tool/productivity/book-tracker/';
const STORAGE_KEY = 'toytools.book-tracker.v1';

function guardConsole(page: Page): string[] {
  const errors: string[] = [];
  page.on('console', (m) => {
    if (m.type() === 'error') errors.push(m.text());
  });
  page.on('pageerror', (e) => errors.push(String(e)));
  return errors;
}

type SeedBook = {
  id?: string;
  title: string;
  author?: string;
  status?: 'want' | 'reading' | 'finished';
  progress?: number;
  rating?: number | null;
  note?: string;
};

function payloadFor(books: SeedBook[]): string {
  return JSON.stringify({
    v: 1,
    books: books.map((b, i) => ({
      id: b.id ?? `b${i + 1}`,
      title: b.title,
      author: b.author ?? '',
      status: b.status ?? 'want',
      progress: b.status === 'finished' ? 100 : b.status === 'reading' ? (b.progress ?? 0) : 0,
      rating: b.rating ?? null,
      note: b.note ?? '',
      createdAt: new Date().toISOString(),
    })),
  });
}

async function openWithBooks(page: Page, books: SeedBook[]) {
  await page.goto(URL);
  await page.evaluate(
    ({ key, value }) => {
      localStorage.setItem(key, value);
    },
    { key: STORAGE_KEY, value: payloadFor(books) },
  );
  await page.reload();
}

const card = (page: Page, title: string) =>
  page.locator('.bt-card', { has: page.locator('.bt-title', { hasText: title }) });

test.describe('book tracker', () => {
  test('persists a shelf and finished leaves reading at 100', async ({ page }) => {
    const errors = guardConsole(page);
    await page.goto(URL);

    const sample = card(page, 'The Lantern Road');
    await expect(sample).toBeVisible();
    await expect(sample).toHaveAttribute('data-status', 'reading');
    await expect(sample).toHaveAttribute('data-progress', '20');
    await expect(page.locator('#bt-craft')).toBeVisible();
    await expect(page.locator('#bt-craft')).toHaveAttribute('data-craft', 'book-shelf-local');

    await sample.locator('.bt-status').selectOption('finished');
    const finished = card(page, 'The Lantern Road');
    await expect(finished).toHaveAttribute('data-status', 'finished');
    await expect(finished).toHaveAttribute('data-progress', '100');
    await expect(finished.locator('.bt-progress')).toHaveCount(0);

    await page.locator('#bt-filter-reading').click();
    await expect(finished).toBeHidden();
    await page.locator('#bt-filter-finished').click();
    await expect(finished).toBeVisible();

    await page.reload();
    const again = card(page, 'The Lantern Road');
    await expect(again).toHaveAttribute('data-status', 'finished');
    await expect(again).toHaveAttribute('data-progress', '100');

    await page.locator('#bt-filter-all').click();
    await page.locator('#bt-search').fill('lantern');
    await expect(again).toBeVisible();
    await page.locator('#bt-search').fill('zzzz-no-such-book');
    await expect(page.locator('#bt-empty')).toBeVisible();
    await expect(again).toBeHidden();

    page.once('dialog', (d) => d.accept());
    await page.locator('#bt-search').fill('');
    await card(page, 'The Lantern Road').locator('[data-action="delete"]').click();
    await expect(page.locator('.bt-card')).toHaveCount(0);
    await expect(page.locator('#bt-start')).toBeVisible();

    await page.locator('#bt-title').fill('Dracula');
    await page.locator('#bt-author').fill('Bram Stoker');
    await page.locator('#bt-status').selectOption('reading');
    await page.locator('#bt-progress').fill('15');
    await page.locator('#bt-rating').selectOption('4');
    await page.locator('#bt-add-form button[type="submit"]').click();

    const dracula = card(page, 'Dracula');
    await expect(dracula).toBeVisible();
    await expect(dracula).toHaveAttribute('data-progress', '15');
    await expect(dracula.locator('.bt-rating-text')).toHaveText('Rating 4');
    await page.reload();
    await expect(card(page, 'Dracula')).toHaveAttribute('data-progress', '15');
    await expect(card(page, 'The Lantern Road')).toHaveCount(0);

    expect(errors, errors.join('\n')).toEqual([]);
  });

  test('import merges title and author and keeps ratings', async ({ page }) => {
    const errors = guardConsole(page);
    await openWithBooks(page, [
      { id: 'dune', title: 'Dune', author: 'Frank Herbert', status: 'reading', progress: 40, rating: 5 },
    ]);

    const [download] = await Promise.all([
      page.waitForEvent('download'),
      page.locator('#bt-export').click(),
    ]);
    expect(download.suggestedFilename()).toBe('book-tracker-backup.json');
    const fs = await import('node:fs/promises');
    const backup = await fs.readFile((await download.path())!, 'utf8');
    const parsed = JSON.parse(backup);
    expect(parsed.v).toBe(1);
    expect(parsed.books).toHaveLength(1);
    expect(parsed.books[0].rating).toBe(5);

    await page.locator('#bt-import-btn').click();
    await page.locator('#bt-import-text').fill(backup);
    await page.locator('#bt-import-run').click();
    await expect(page.locator('#bt-import-msg')).toContainText('not duplicated');
    await expect(page.locator('.bt-card')).toHaveCount(1);
    await expect(card(page, 'Dune').locator('.bt-rating-text')).toHaveText('Rating 5');

    // Header aliases, and a second pass that omits Rating must not wipe stars.
    const alias = JSON.stringify({
      headers: ['Title', 'Author', 'Status', 'Progress', 'Rating'],
      rows: [['Project Hail Mary', 'Andy Weir', 'finished', '12', '4']],
    });
    await page.locator('#bt-import-text').fill(alias);
    await page.locator('#bt-import-run').click();
    const hail = card(page, 'Project Hail Mary');
    await expect(hail).toHaveAttribute('data-status', 'finished');
    await expect(hail).toHaveAttribute('data-progress', '100');
    await expect(hail.locator('.bt-rating-text')).toHaveText('Rating 4');
    await page.locator('#bt-filter-reading').click();
    await expect(hail).toBeHidden();
    await expect(card(page, 'Dune')).toBeVisible();

    await page.locator('#bt-filter-all').click();
    await page.locator('#bt-import-text').fill(JSON.stringify({
      books: [{ title: 'dune', author: 'frank herbert', status: 'reading', progress: 10 }],
    }));
    await page.locator('#bt-import-run').click();
    await expect(page.locator('.bt-card')).toHaveCount(2);
    await expect(card(page, 'Dune').locator('.bt-rating-text')).toHaveText('Rating 5');
    await expect(card(page, 'Dune')).toHaveAttribute('data-status', 'reading');

    // Replace asks first. Dismiss keeps the shelf.
    await page.locator('#bt-replace').check();
    page.once('dialog', (d) => d.dismiss());
    await page.locator('#bt-import-run').click();
    await expect(page.locator('#bt-import-msg')).toContainText('not replaced');
    await expect(card(page, 'Dune')).toBeVisible();

    page.once('dialog', async (d) => {
      expect(d.message()).toContain('Replace the shelf');
      await d.accept();
    });
    await page.locator('#bt-import-text').fill(JSON.stringify({
      books: [{ title: 'Only This', author: 'Reader', status: 'want' }],
    }));
    await page.locator('#bt-import-run').click();
    await expect(page.locator('#bt-import-msg')).toContainText('Replaced the shelf');
    await expect(page.locator('.bt-card')).toHaveCount(1);
    await expect(card(page, 'Only This')).toBeVisible();
    await expect(card(page, 'Dune')).toHaveCount(0);

    expect(errors, errors.join('\n')).toEqual([]);
  });

  test('enforces a maximum of 200 books', async ({ page }) => {
    const errors = guardConsole(page);
    const books: SeedBook[] = Array.from({ length: 200 }, (_, i) => ({
      id: `n${i}`,
      title: `Title ${i + 1}`,
      author: 'Author',
      status: 'want' as const,
    }));
    await openWithBooks(page, books);
    await expect(page.locator('#bt-count')).toHaveText('200 books');
    await page.locator('#bt-title').fill('One too many');
    await page.locator('#bt-add-form button[type="submit"]').click();
    await expect(page.locator('#bt-add-msg')).toBeVisible();
    await expect(page.locator('#bt-add-msg')).toContainText('200 books');
    await expect(card(page, 'One too many')).toHaveCount(0);
    await expect(page.locator('#bt-count')).toHaveText('200 books');
    expect(errors, errors.join('\n')).toEqual([]);
  });
});
