// Tool Groups — unified workspace behaviour for the case-converter group.
// The switcher pills are real links (SEO: crawlable internal links); input text
// survives navigation via the shared `group:case-converters` state key.
import { test, expect } from '@playwright/test';

const INPUT = 'Hello World Example';

test.describe('case-converter group switcher', () => {
  test('renders all modes with the active one marked', async ({ page }) => {
    await page.goto('/tool/text/camel-case-converter/');
    const nav = page.getByRole('navigation', { name: 'Case Converter modes' });
    await expect(nav.getByRole('link')).toHaveCount(7);
    await expect(nav.getByRole('link', { name: 'camelCase' })).toHaveAttribute('aria-current', 'page');
    await expect(nav.getByRole('link', { name: 'snake_case' })).not.toHaveAttribute('aria-current', 'page');
  });

  test('input survives a mode switch and output re-converts', async ({ page }) => {
    await page.goto('/tool/text/camel-case-converter/');
    const nav = page.getByRole('navigation', { name: 'Case Converter modes' });

    await page.locator('#camel-case-converter-input').fill(INPUT);
    await expect(page.locator('#camel-case-converter-output')).toHaveValue('helloWorldExample');

    await nav.getByRole('link', { name: 'snake_case' }).click();
    await expect(page).toHaveURL(/\/tool\/text\/snake-case-converter\/$/);

    // Same input restored from the shared group state, recomputed in the new mode.
    await expect(page.locator('#snake-case-converter-input')).toHaveValue(INPUT);
    await expect(page.locator('#snake-case-converter-output')).toHaveValue('hello_world_example');

    // Active pill follows the page.
    await expect(nav.getByRole('link', { name: 'snake_case' })).toHaveAttribute('aria-current', 'page');
  });

  test('non-group processor tools keep per-tool state keys', async ({ page }) => {
    await page.goto('/tool/text/trim-text/');
    await expect(page.locator('[data-state-key="trim-text"]')).toHaveCount(1);
    await page.goto('/tool/text/camel-case-converter/');
    await expect(page.locator('[data-state-key="group:case-converters"]')).toHaveCount(1);
  });
});
