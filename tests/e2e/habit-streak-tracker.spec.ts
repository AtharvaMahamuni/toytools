// Deep suite for Habit Streak Tracker - Chromium + Pixel 5.
//
// Discovery/smoke already bump the directory count; this fills the interactive gap:
// streak math (increment + miss-reset), the 8-active cap, and JSON export/import.
// Seed by writing localStorage after first paint, then reload so the inline widget reads it.
import { test, expect, type Page } from '@playwright/test';

const URL = '/tool/productivity/habit-streak-tracker/';
const STORAGE_KEY = 'toytools.habit-streak-tracker.v1';

function guardConsole(page: Page): string[] {
  const errors: string[] = [];
  page.on('console', (m) => {
    if (m.type() === 'error') errors.push(m.text());
  });
  page.on('pageerror', (e) => errors.push(String(e)));
  return errors;
}

function pad(n: number): string {
  return n < 10 ? `0${n}` : String(n);
}

/** Local-date key matching the widget's todayKey()/shiftKey(). */
function dateKey(offsetDays = 0): string {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

type SeedHabit = {
  id?: string;
  name: string;
  cue?: string;
  identity?: string;
  stack?: string;
  color?: string;
  archived?: boolean;
  checks?: string[];
};

function payloadFor(habits: SeedHabit[]): string {
  return JSON.stringify({
    v: 1,
    habits: habits.map((h, i) => ({
      id: h.id ?? `h${i + 1}`,
      name: h.name,
      cue: h.cue ?? '',
      identity: h.identity ?? '',
      stack: h.stack ?? '',
      color: h.color ?? 'green',
      archived: !!h.archived,
      createdAt: new Date().toISOString(),
      checks: h.checks ?? [],
    })),
  });
}

/** Open the tool with seeded habits (fresh context is empty; write then reload). */
async function openWithHabits(page: Page, habits: SeedHabit[]) {
  await page.goto(URL);
  await page.evaluate(
    ({ key, value }) => {
      localStorage.setItem(key, value);
    },
    { key: STORAGE_KEY, value: payloadFor(habits) },
  );
  await page.reload();
}

async function clearHabits(page: Page) {
  await page.evaluate((key) => {
    localStorage.removeItem(key);
  }, STORAGE_KEY);
  await page.reload();
}

const card = (page: Page, name: string) =>
  page.locator('.hst-card', { has: page.locator('.hst-name', { hasText: name }) });

test.describe('habit streak tracker', () => {
  test('streak increments on consecutive days and miss resets current, not longest', async ({
    page,
  }) => {
    const errors = guardConsole(page);
    // Ending yesterday: current reads from yesterday when today is empty.
    await openWithHabits(page, [
      {
        id: 'walk',
        name: 'Walk 5 min',
        checks: [dateKey(-2), dateKey(-1)],
      },
    ]);

    const walk = card(page, 'Walk 5 min');
    await expect(walk.locator('.hst-badge')).toHaveText('2 days');
    await walk.locator('summary', { hasText: 'Details' }).click();
    await expect(walk.locator('.hst-meta')).toContainText('Current streak:');
    await expect(walk.locator('.hst-meta')).toContainText('2');
    await expect(walk.locator('.hst-meta')).toContainText('Longest:');

    // Check today → consecutive run becomes 3.
    await walk.locator('.hst-check').click();
    await expect(walk.locator('.hst-check')).toHaveAttribute('aria-pressed', 'true');
    await expect(walk.locator('.hst-badge')).toHaveText('3 days');
    await expect(page.locator('#hst-encourage')).toBeVisible();

    // Uncheck today → back to the yesterday-anchored streak of 2.
    await walk.locator('.hst-check').click();
    await expect(walk.locator('.hst-check')).toHaveAttribute('aria-pressed', 'false');
    await expect(walk.locator('.hst-badge')).toHaveText('2 days');

    // Miss yesterday: oldest run stays on longest; current is 0 until today is checked.
    await openWithHabits(page, [
      {
        id: 'water',
        name: 'Drink water',
        checks: [dateKey(-4), dateKey(-3), dateKey(-2)],
      },
    ]);

    const water = card(page, 'Drink water');
    await expect(water.locator('.hst-badge')).toHaveText('Start today');
    await water.locator('summary', { hasText: 'Details' }).click();
    await expect(water.locator('.hst-meta')).toContainText('Current streak:');
    await expect(water.locator('.hst-meta strong').nth(0)).toHaveText('0');
    await expect(water.locator('.hst-meta strong').nth(1)).toHaveText('3');
    await expect(water.locator('.hst-meta')).toContainText('Miss resets the current count');

    await water.locator('.hst-check').click();
    await expect(water.locator('.hst-badge')).toHaveText('1 day');
    // Recovery copy after a miss when a prior longest exists.
    await expect(page.locator('#hst-encourage')).toHaveText('Never miss twice. You are back.');

    expect(errors, errors.join('\n')).toEqual([]);
  });

  test('enforces a maximum of 8 active habits', async ({ page }) => {
    const errors = guardConsole(page);
    const habits: SeedHabit[] = Array.from({ length: 8 }, (_, i) => ({
      id: `a${i}`,
      name: `Habit ${i + 1}`,
      checks: [],
    }));
    await openWithHabits(page, habits);

    await expect(page.locator('#hst-today .hst-card')).toHaveCount(8);
    await expect(page.locator('#hst-empty')).toBeHidden();

    await page.locator('#hst-add-panel > summary').click();
    await page.locator('#hst-name').fill('One too many');
    await page.locator('#hst-add-form button[type="submit"]').click();

    await expect(page.locator('#hst-add-msg')).toBeVisible();
    await expect(page.locator('#hst-add-msg')).toContainText('8 active habits');
    await expect(page.locator('#hst-today .hst-card')).toHaveCount(8);
    await expect(card(page, 'One too many')).toHaveCount(0);

    // Archive frees a slot.
    const first = page.locator('#hst-today .hst-card').first();
    await first.locator('summary', { hasText: 'Details' }).click();
    await first.locator('[data-action="archive"]').click();
    await expect(page.locator('#hst-today .hst-card')).toHaveCount(7);

    await page.locator('#hst-name').fill('Room for one');
    await page.locator('#hst-add-form button[type="submit"]').click();
    await expect(card(page, 'Room for one')).toBeVisible();
    await expect(page.locator('#hst-today .hst-card')).toHaveCount(8);

    expect(errors, errors.join('\n')).toEqual([]);
  });

  test('export/import JSON round-trips habits and checks', async ({ page }) => {
    const errors = guardConsole(page);
    await openWithHabits(page, [
      {
        id: 'read',
        name: 'Read 1 page',
        cue: 'After breakfast',
        identity: 'I am a reader',
        stack: 'After coffee, I read',
        color: 'teal',
        checks: [dateKey(-1), dateKey(0)],
      },
      {
        id: 'stretch',
        name: 'Stretch 2 min',
        archived: true,
        checks: [dateKey(-5)],
      },
    ]);

    await expect(card(page, 'Read 1 page')).toBeVisible();
    await expect(card(page, 'Read 1 page').locator('.hst-badge')).toHaveText('2 days');

    const [download] = await Promise.all([
      page.waitForEvent('download'),
      page.locator('#hst-export').click(),
    ]);
    expect(download.suggestedFilename()).toBe('habit-streak-tracker-backup.json');

    const fs = await import('node:fs/promises');
    const backup = await fs.readFile((await download.path())!, 'utf8');
    const parsed = JSON.parse(backup);
    expect(parsed.v).toBe(1);
    expect(parsed.habits).toHaveLength(2);
    expect(parsed.habits[0].name).toBe('Read 1 page');
    expect(parsed.habits[0].checks).toEqual(expect.arrayContaining([dateKey(-1), dateKey(0)]));

    await clearHabits(page);
    await expect(page.locator('#hst-empty')).toBeVisible();
    await expect(page.locator('#hst-today .hst-card')).toHaveCount(0);

    await page.locator('#hst-import-btn').click();
    await expect(page.locator('#hst-import-panel')).toBeVisible();
    await page.locator('#hst-import-text').fill(backup);
    await page.locator('#hst-import-run').click();

    await expect(page.locator('#hst-import-msg')).toContainText('Imported 2 habits');
    await expect(card(page, 'Read 1 page')).toBeVisible();
    await expect(card(page, 'Read 1 page').locator('.hst-badge')).toHaveText('2 days');
    // Cue / identity extras live under Details (slim first screen).
    await expect(card(page, 'Read 1 page').locator('.hst-cue')).toBeHidden();
    await card(page, 'Read 1 page').locator('summary', { hasText: 'Details' }).click();
    await expect(card(page, 'Read 1 page').locator('.hst-cue')).toContainText('After breakfast');

    await page.locator('#hst-manage-panel > summary').click();
    await page.locator('#hst-toggle-archive').click();
    await expect(page.locator('#hst-archived .hst-card', { hasText: 'Stretch 2 min' })).toBeVisible();

    // Persistence: import wrote localStorage; a plain reload must keep it.
    await page.reload();
    await expect(card(page, 'Read 1 page').locator('.hst-badge')).toHaveText('2 days');

    expect(errors, errors.join('\n')).toEqual([]);
  });
  test('mobile slim: checklist + Export/Import visible; cue and heat behind Details', async ({
    page,
  }, testInfo) => {
    test.skip(testInfo.project.name !== 'pixel5', 'phone slim first screen only');
    const errors = guardConsole(page);
    await openWithHabits(page, [
      {
        id: 'read',
        name: 'Read 1 page',
        cue: 'After breakfast',
        identity: 'I am a reader',
        stack: 'After coffee, I read',
        checks: [dateKey(-1), dateKey(0)],
      },
    ]);

    const read = card(page, 'Read 1 page');
    await expect(read.locator('.hst-check')).toBeVisible();
    await expect(read.locator('.hst-name')).toHaveText('Read 1 page');
    await expect(read.locator('.hst-badge')).toHaveText('2 days');

    // Secondary chrome stays folded until Details opens.
    await expect(read.locator('.hst-cue')).toBeHidden();
    await expect(read.locator('.hst-heat')).toBeHidden();
    await expect(read.locator('.hst-meta')).toBeHidden();

    // Atharva hard rule: Export/Import stay on the tool screen - not behind Details or More about.
    await expect(page.locator('#hst-export')).toBeVisible();
    await expect(page.locator('#hst-import-btn')).toBeVisible();
    await expect(page.locator('#hst-export')).toBeInViewport();
    await expect(page.locator('#hst-import-btn')).toBeInViewport();

    await read.locator('summary', { hasText: 'Details' }).click();
    await expect(read.locator('.hst-cue')).toContainText('After breakfast');
    await expect(read.locator('.hst-meta')).toContainText('I am a reader');
    await expect(read.locator('.hst-heat')).toBeVisible();
    // Backup controls remain findable without closing Details.
    await expect(page.locator('#hst-export')).toBeVisible();

    expect(errors, errors.join('\n')).toEqual([]);
  });
});
