import { test, expect } from '@playwright/test';

test.describe('i18n multilingual routes and switcher', () => {
  test('renders all 6 localized home pages with valid lang, canonical, and reciprocal hreflang links', async ({ page }) => {
    for (const locale of ['es', 'de', 'fr', 'ja', 'pt', 'hi'] as const) {
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

  test('switches language cleanly across es, de, and ja via LanguageSwitcher', async ({ page }) => {
    await page.goto('/es/tool/text/word-counter/');
    await expect(page.locator('h1')).toContainText('Contador de Palabras');

    const details = page.locator('.lang-switcher').first();
    await details.locator('summary').click();
    await details.locator('a[href="/de/tool/text/word-counter/"]').click();

    await page.waitForURL('**/de/tool/text/word-counter/');
    await expect(page.locator('html')).toHaveAttribute('lang', 'de');
    await expect(page.locator('h1')).toContainText('Wörterzähler');

    const details2 = page.locator('.lang-switcher').first();
    await details2.locator('summary').click();
    await details2.locator('a[href="/ja/tool/text/word-counter/"]').click();

    await page.waitForURL('**/ja/tool/text/word-counter/');
    await expect(page.locator('html')).toHaveAttribute('lang', 'ja');
    await expect(page.locator('h1')).toContainText('単語数カウンター');
  });

  test('computes localized interactive tool workflows across groups and locales without template leaks', async ({ page }) => {
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

    await page.goto('/pt/tool/text/character-counter/');
    await expect(page.locator('.empty-hint')).not.toContainText('Paste or type');
    await page.fill('#character-counter-input', 'Olá mundo');
    await expect(page.locator('.hero-value[data-metric="characters"]')).toHaveText('9');
    await expect(page.locator('[data-metric="charactersNoSpaces"]')).toHaveText('8');

    await page.goto('/hi/tool/developer-utilities/base64-encoder-decoder/');
    await page.fill('#base64-encoder-decoder-input', 'hello');
    await expect(page.locator('#base64-encoder-decoder-output')).toHaveValue('aGVsbG8=');

    await page.goto('/ja/tool/number/discount-calculator/');
    await page.fill('#disc-price', '1000');
    await page.fill('#disc-amount', '25');
    await expect(page.locator('#disc-final')).toContainText('750');
    await expect(page.locator('main')).not.toContainText('{pct}');

    await page.goto('/es/tool/datetime/age-calculator/');
    await page.fill('#age-calculator-f-birthDate', '2000-01-15');
    await expect(page.locator('main')).not.toContainText('{totalDays}');
    await expect(page.locator('main')).not.toContainText('{days}');

    await page.goto('/de/tool/datetime/date-difference-calculator/');
    await page.fill('#date-difference-calculator-f-startDate', '2026-01-01');
    await page.fill('#date-difference-calculator-f-endDate', '2026-02-15');
    await expect(page.locator('main')).not.toContainText('{n}');
    await expect(page.locator('main')).not.toContainText('{start}');
    await expect(page.locator('main')).not.toContainText('{end}');
    await expect(page.locator('main')).not.toContainText('{days}');

    await page.goto('/ja/tool/health/tdee-calculator/');
    await page.fill('#tdee-calculator-f-age', '30');
    await page.fill('#tdee-calculator-f-weight', '70');
    await page.fill('#tdee-calculator-f-height', '175');
    await expect(page.locator('main')).not.toContainText('{bmr}');
    await expect(page.locator('main')).not.toContainText('{maintain}');
    await expect(page.locator('main')).not.toContainText('{pct}');

    await page.goto('/fr/tool/design/px-to-rem-converter/');
    await expect(page.locator('main')).not.toContainText('{base}');

    await page.goto('/de/tool/generate/password-generator/');
    await expect(page.locator('h1')).toContainText('Passwort-Generator');

    // Phase 3 interactive workflows
    await page.goto('/es/tool/finance/compound-interest-calculator/');
    await expect(page.locator('main')).not.toContainText('{principal}');
    await expect(page.locator('main')).not.toContainText('{rate}');
    await page.fill('#compound-interest-calculator-f-principal', '10000');
    await page.fill('#compound-interest-calculator-f-years', '10');
    await expect(page.locator('#compound-interest-calculator-hero')).toBeVisible();

    await page.goto('/hi/tool/finance/loan-calculator/');
    await expect(page.locator('main')).not.toContainText('{years}');
    await expect(page.locator('main')).not.toContainText('{total}');

    await page.goto('/de/tool/text/slugify-text/');
    await page.fill('#slugify-text-input', 'Hallo Welt Überschrift');
    await expect(page.locator('#slugify-text-output')).toHaveValue('hallo-welt-uberschrift');

    await page.goto('/fr/tool/text/word-frequency-counter/');
    await page.fill('#word-frequency-counter-input', 'chat chien chat');
    await expect(page.locator('#wf-list')).toContainText('chat');
    await expect(page.locator('main')).not.toContainText('{limit}');
    await expect(page.locator('main')).not.toContainText('{total}');

    await page.goto('/pt/tool/number/roman-numeral-converter/');
    await page.fill('#roman-numeral-converter-input', '1999');
    await expect(page.locator('#roman-numeral-converter-output')).toHaveValue('MCMXCIX');

    await page.goto('/ja/tool/health/calorie-deficit-calculator/');
    await expect(page.locator('main')).not.toContainText('{maint}');
    await expect(page.locator('main')).not.toContainText('{daily}');
    await page.fill('#calorie-deficit-calculator-f-weight', '72');
    await expect(page.locator('#calorie-deficit-calculator-hero')).toBeVisible();

    await page.goto('/es/tool/datetime/sleep-cycle-calculator/');
    await page.fill('#sleep-cycle-calculator-f-time', '07:00');
    await expect(page.locator('#sleep-cycle-calculator-hero')).toBeVisible();
    await expect(page.locator('main')).not.toContainText('{cycle}');
    await expect(page.locator('main')).not.toContainText('{latency}');

    expect(errors).toEqual([]);
  });

  test('does not advertise alternate locale links on unlocalized English tools', async ({ page }) => {
    await page.goto('/tool/developer-utilities/hex-encoder-decoder/');
    await expect(page.locator('link[rel="alternate"][hreflang="es"]')).toHaveCount(0);
    await expect(page.locator('link[rel="alternate"][hreflang="ja"]')).toHaveCount(0);
    await expect(page.locator('link[rel="alternate"][hreflang="hi"]')).toHaveCount(0);
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
