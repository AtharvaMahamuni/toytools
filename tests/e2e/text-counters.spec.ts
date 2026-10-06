// Whitespace-only input on the shared text-metric counters (Phase B PR 2, bug log batch 1).
// Three spaces are three characters, so the empty state belongs to truly empty input only.
import { test, expect } from '@playwright/test';

test.describe('text counters: whitespace-only input', () => {
  test('character-counter: 3 spaces count as 3 characters, empty state only when empty', async ({ page }) => {
    await page.goto('/tool/text/character-counter/');
    const input = page.locator('#character-counter-input');
    const hero = page.locator('.hero-value');
    const hint = page.locator('.empty-hint');

    await input.fill('   ');
    await expect(hero).toHaveText('3');
    await expect(hint).toBeHidden();

    await input.fill('  \n ');
    await expect(hero).toHaveText('4');

    await input.fill('');
    await expect(hero).toHaveText('0');
    await expect(hint).toBeVisible();
  });

  test('space-counter: whitespace-only text is counted, not treated as empty', async ({ page }) => {
    await page.goto('/tool/text/space-counter/');
    await page.locator('#space-counter-input').fill('   ');
    await expect(page.locator('.hero-value')).toHaveText('3');
    await expect(page.locator('.empty-hint')).toBeHidden();
  });
});
