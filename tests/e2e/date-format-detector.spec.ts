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
    await dates(page).fill('03/04/2026\n2026-04-03\n13/04/2026');
    await expect(experience(page)).toContainText('1 of 3');
    await expect(experience(page)).toContainText('3 April 2026');
    await expect(experience(page)).toContainText('4 March 2026');
    await expect(page.locator('[data-hero-note]')).toBeVisible();
    await expect(page.locator('[data-hero-note]')).toContainText('1 row can be read as two different days.');
  });

  test('an ISO column leaves the ambiguous-row note hidden', async ({ page }) => {
    await page.goto(URL);
    await dates(page).fill('2026-04-03\n2026-04-13');
    await expect(experience(page)).toContainText('Each date has one reading');
    await expect(page.locator('[data-hero-note]')).toBeHidden();
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
