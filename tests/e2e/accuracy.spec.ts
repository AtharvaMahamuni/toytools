// Accuracy audit (3 Nov 2026): the browser-visible fixes. The engine fixes are pinned in vitest.
import { test, expect } from '@playwright/test';

test.describe('accuracy audit', () => {
  test('a discount over 100% shows a visible warning instead of a silent cap', async ({ page }) => {
    await page.goto('/tool/number/discount-calculator/');
    await page.locator('#disc-price').fill('50');
    await page.locator('#disc-amount').fill('150');
    const warn = page.locator('#disc-warn');
    await expect(warn).toBeVisible();
    await expect(warn).toContainText('over 100%');
    await expect(page.locator('#disc-final')).toHaveText('$0.00');
    await page.locator('#disc-amount').fill('20');
    await expect(warn).toBeHidden();
  });

  test('the selected Height unit is an ink pill, as the changelog says', async ({ page }) => {
    await page.goto('/tool/number/height-comparison/');
    const cm = page.locator('#height-comparison-unit-cm');
    await expect(cm).toHaveAttribute('aria-pressed', 'true');
    const [bg, ink, label, canvas] = await cm.evaluate((el) => {
      const probe = document.createElement('span');
      probe.style.color = 'var(--color-selected)';
      document.body.appendChild(probe);
      const inkColor = getComputedStyle(probe).color;
      probe.style.color = 'var(--color-on-selected)';
      const onColor = getComputedStyle(probe).color;
      probe.remove();
      const cs = getComputedStyle(el);
      return [cs.backgroundColor, inkColor, cs.color, onColor];
    });
    expect(bg).toBe(ink);
    expect(label).toBe(canvas);
  });

  test('the character counter counts grapheme clusters', async ({ page }) => {
    await page.goto('/tool/text/character-counter/');
    await page.locator('textarea').first().fill('😀👍🏽 é');
    await expect(page.locator('[data-metric="characters"]').first()).toHaveText('4');
  });
});
