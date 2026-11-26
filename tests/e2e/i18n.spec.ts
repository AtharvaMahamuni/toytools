import { test, expect } from '@playwright/test';

test.describe('i18n multilingual routes and switcher', () => {
  test('renders localized home pages with valid lang, canonical, and reciprocal hreflang links', async ({ page }) => {
    for (const locale of ['es', 'de', 'fr'] as const) {
      const errors: string[] = [];
      page.on('pageerror', err => errors.push(err.message));

      await page.goto(`/${locale}/`);
      await expect(page.locator('html')).toHaveAttribute('lang', locale);

      const canonical = page.locator('link[rel="canonical"]');
      await expect(canonical).toHaveAttribute('href', `https://toytoolsapp.com/${locale}/`);

      await expect(page.locator('link[rel="alternate"][hreflang="x-default"]')).toHaveAttribute(
        'href',
        'https://toytoolsapp.com/',
      );
      await expect(page.locator(`link[rel="alternate"][hreflang="${locale}"]`)).toHaveAttribute(
        'href',
        `https://toytoolsapp.com/${locale}/`,
      );

      expect(errors).toEqual([]);
    }
  });

  test('switches language cleanly via the LanguageSwitcher on localized tools', async ({ page }) => {
    await page.goto('/es/tool/text/word-counter/');
    await expect(page.locator('h1')).toContainText('Contador de Palabras');

    const details = page.locator('.lang-switcher').first();
    await details.locator('summary').click();
    await details.locator('a[href="/de/tool/text/word-counter/"]').click();

    await page.waitForURL('**/de/tool/text/word-counter/');
    await expect(page.locator('html')).toHaveAttribute('lang', 'de');
    await expect(page.locator('h1')).toContainText('Wörterzähler');
  });

  test('computes localized interactive tool workflows in browser', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', err => errors.push(err.message));

    await page.goto('/es/tool/number/percentage-calculator/');
    await page.fill('#percentage-a', '20');
    await page.fill('#percentage-b', '150');
    await expect(page.locator('#pct-value')).toHaveText('30');
    await expect(page.locator('#pct-formula')).toContainText('20% de 150');

    await page.goto('/fr/tool/health/bmi-calculator/');
    await page.fill('#bmi-calculator-f-weight', '70');
    await page.fill('#bmi-calculator-f-height', '175');
    await expect(page.locator('.tm-hero, [data-field-id="bmi"], output, .res-hero, #bmi-calculator-results')).toBeVisible();

    expect(errors).toEqual([]);
  });

  test('does not advertise alternate locale links on unlocalized English tools', async ({ page }) => {
    await page.goto('/tool/developer-utilities/base64-encoder-decoder/');
    await expect(page.locator('link[rel="alternate"][hreflang="es"]')).toHaveCount(0);
    await expect(page.locator('link[rel="alternate"][hreflang="de"]')).toHaveCount(0);
    await expect(page.locator('link[rel="alternate"][hreflang="fr"]')).toHaveCount(0);
  });

  test('preserves above-the-fold ToolBar budget on mobile for localized tool pages', async ({ page }) => {
    const vp = page.viewportSize();
    test.skip(!vp || vp.width > 420, 'Mobile viewport check only');

    await page.goto('/es/tool/productivity/no-sleep-website/');
    const headerBox = await page.locator('.tool-header').first().boundingBox();
    expect(headerBox).not.toBeNull();
    expect((headerBox!.y + headerBox!.height) / vp!.height).toBeLessThan(0.22);
    await expect(page.locator('#wl-toggle')).toBeInViewport();
  });
});
