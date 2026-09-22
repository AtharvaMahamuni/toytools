// Site-wide mobile Play for Zone C: under 640px, KnowledgeDrawers collapse behind one
// "More about" control. Desktop keeps the Zone C row visible (summary hidden via CSS).
// SEO content stays in the first HTML response — fold only, never JS-fetched.
import { test, expect, type Page } from '@playwright/test';

const SAMPLES: { name: string; path: string }[] = [
  { name: 'habit-streak-tracker', path: '/tool/productivity/habit-streak-tracker/' },
  { name: 'px-to-rem-converter', path: '/tool/design/px-to-rem-converter/' },
  { name: 'pop-it', path: '/tool/fidget/pop-it/' },
];

async function pageSource(page: Page): Promise<string> {
  return page.content();
}

test.describe('mobile More about collapses Zone C', () => {
  for (const sample of SAMPLES) {
    test(`${sample.name}: More about closed by default on phone`, async ({ page }, testInfo) => {
      test.skip(testInfo.project.name !== 'pixel5', 'phone geometry only');

      await page.goto(sample.path, { waitUntil: 'load' });
      const more = page.locator('details.kd-more');
      await expect(more).toBeVisible();
      await expect(more).not.toHaveAttribute('open', '');
      await expect(page.locator('details.kd-more > summary')).toBeVisible();
      // Inner drawer triggers stay in the DOM but are not shown while the shell is closed.
      await expect(page.locator('details#faq')).toBeHidden();

      await page.locator('details.kd-more > summary').click();
      await expect(more).toHaveAttribute('open', '');
      await expect(page.locator('details#faq')).toBeVisible();
    });

    test(`${sample.name}: desktop Zone C row stays visible without More about`, async ({ page }, testInfo) => {
      test.skip(testInfo.project.name !== 'chromium', 'desktop geometry only');

      await page.goto(sample.path, { waitUntil: 'load' });
      // Summary is CSS-hidden from 640px up; the drawer row is forced visible.
      await expect(page.locator('details.kd-more > summary')).toBeHidden();
      await expect(page.locator('.kd-row')).toBeVisible();
      await expect(page.locator('details#faq')).toBeVisible();
    });
  }

  test('page source still carries FAQ JSON-LD, #faq, and concept H2s', async ({ page }) => {
    await page.goto('/tool/productivity/habit-streak-tracker/', { waitUntil: 'load' });
    const html = await pageSource(page);
    expect(html).toContain('"@type":"FAQPage"');
    expect(html).toMatch(/id=["']faq["']/);
    // Concept H2s live inside drawer summaries (query-coverage targeting slot).
    expect(html).toMatch(/<h2[^>]*class="[^"]*kd-heading/);
    expect(html).toContain('More about');
  });

  test('#faq on phone opens More about and the FAQ drawer', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'pixel5', 'phone geometry only');

    await page.goto('/tool/productivity/habit-streak-tracker/#faq', { waitUntil: 'load' });
    await expect(page.locator('details.kd-more')).toHaveAttribute('open', '');
    const drawer = page.locator('details#faq');
    await expect(drawer).toHaveAttribute('open', '');
    await expect(drawer.getByRole('heading', { level: 2 })).toBeVisible();
  });

  test('Export/Import on Habit Streak Tracker stay outside More about', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'pixel5', 'phone geometry only');

    await page.goto('/tool/productivity/habit-streak-tracker/', { waitUntil: 'load' });
    // Shell starts closed — export/import must still be reachable without opening it.
    await expect(page.locator('details.kd-more')).not.toHaveAttribute('open', '');
    await expect(page.locator('#hst-export')).toBeVisible();
    await expect(page.locator('#hst-import-btn')).toBeVisible();
  });
});
