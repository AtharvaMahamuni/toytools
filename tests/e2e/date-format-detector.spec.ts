// Date Format Detector on desktop and Pixel 5. Parsing is unit-tested in the datetime engine.
// This proves the widget shows both readings, hides the note on a one-reading column, and keeps
// the textarea as the first control on a phone.
import { test, expect, type Page } from '@playwright/test';

const URL = '/tool/datetime/date-format-detector/';
const experience = (page: Page) => page.locator('#date-format-detector-experience');
const dates = (page: Page) => page.locator('#date-format-detector-f-dates');

test.describe('date format detector', () => {
  test('a mixed column counts the two-reading row and shows both days', async ({ page }) => {
    await page.goto(URL);
    await dates(page).fill('03/04/2026\n2026-04-03\nApril 13, 2026');
    await expect(experience(page)).toContainText('1 of 3');
    await expect(experience(page)).toContainText('3 April 2026');
    await expect(experience(page)).toContainText('4 March 2026');
    await expect(page.locator('[data-hero-note]')).toBeVisible();
    await expect(page.locator('[data-hero-note]')).toContainText('1 row can be read as two different days.');
  });

  test('a line that only works day first decides the column', async ({ page }) => {
    await page.goto(URL);
    await dates(page).fill('03/04/2025\n05/06/2025\n25/03/2025');
    await expect(experience(page).locator('[data-hero-value]')).toHaveText('Day first');
    await expect(experience(page).locator('[data-hero-label]')).toHaveText('whole column');
    await expect(page.locator('[data-hero-note]')).toHaveText('Day first: line 3 (25/03/2025) only works that way. 2 rows were read that way too.');
    await expect(experience(page)).not.toContainText('4 March 2025');
  });

  test('both orders confirmed shows Mixed and keeps both readings', async ({ page }) => {
    await page.goto(URL);
    await dates(page).fill('03/04/2025\n25/03/2025\n03/25/2025');
    await expect(experience(page).locator('[data-hero-value]')).toHaveText('Mixed');
    await expect(page.locator('[data-hero-note]')).toContainText('line 2 (25/03/2025) only works day first, and line 3 (03/25/2025) only works month first');
    await expect(experience(page)).toContainText('4 March 2025');
  });

  test('an ISO column leaves the ambiguous-row note hidden', async ({ page }) => {
    await page.goto(URL);
    await dates(page).fill('2026-04-03\n2026-04-13');
    await expect(experience(page)).toContainText('Each date has one reading');
    await expect(page.locator('[data-hero-note]')).toBeHidden();
  });

  test('an all-unreadable paste names the lines and gives each row a reason', async ({ page }) => {
    await page.goto(URL);
    await dates(page).fill('31/04/2025\ngarbage');
    await expect(experience(page).locator('[data-hero-value]')).toHaveText('2 of 2');
    await expect(experience(page).locator('[data-hero-label]')).toHaveText('could not be read');
    await expect(page.locator('[data-hero-note]')).toHaveText('Lines 1 and 2 could not be read.');
    await expect(experience(page)).toContainText('That date does not exist.');
  });

  test('the 200-line cap shows in the visible note', async ({ page }) => {
    await page.goto(URL);
    await dates(page).fill(Array.from({ length: 205 }, () => '2025-04-03').join('\n'));
    await expect(page.locator('[data-hero-note]')).toBeVisible();
    await expect(page.locator('[data-hero-note]')).toContainText('Stopped at line 200.');
  });

  test('the textarea is the first control on a phone', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'pixel5', 'phone geometry only');
    await page.goto(URL, { waitUntil: 'load' });
    await page.waitForLoadState('networkidle');
    const firstIsTextarea = await page.evaluate(() => {
      const header = document.querySelector('.tool-header');
      const floor = header ? header.getBoundingClientRect().bottom + window.scrollY : 0;
      const first = [...document.querySelectorAll('main textarea, main input:not([type=hidden]), main select, main button')]
        .map((el) => ({ el, rect: el.getBoundingClientRect() }))
        .filter(({ rect }) => rect.height > 0 && rect.width > 0)
        .filter(({ rect }) => rect.top + window.scrollY >= floor - 1)
        .sort((a, b) => a.rect.top - b.rect.top)[0];
      return first ? first.el.tagName === 'TEXTAREA' : false;
    });
    expect(firstIsTextarea).toBe(true);
  });
});
