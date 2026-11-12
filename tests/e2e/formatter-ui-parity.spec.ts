import { test, expect, type Page } from '@playwright/test';

const TOOLS = [
  {
    id: 'sql-formatter',
    path: '/tool/developer-utilities/sql-formatter/',
    modes: false,
    invalid: "select 'oops from t",
    invalidStatus: /Unclosed/i,
    sampleOut: /SELECT/i,
  },
  {
    id: 'xml-formatter',
    path: '/tool/developer-utilities/xml-formatter/',
    modes: true,
    invalid: '<root><a></root>',
    invalidStatus: /Malformed XML/i,
    sampleOut: /<note>/,
  },
  {
    id: 'css-minifier',
    path: '/tool/design/css-minifier/',
    modes: true,
    invalid: null as string | null,
    invalidStatus: null as RegExp | null,
    sampleOut: /body/,
  },
] as const;

async function ready(page: Page) {
  await page.waitForFunction(
    () => !!(window as unknown as { ToyTools?: { runStructuredData?: unknown } }).ToyTools?.runStructuredData,
  );
}

async function attachPageErrors(page: Page) {
  const errors: string[] = [];
  page.on('pageerror', (err) => errors.push(String(err)));
  return errors;
}

for (const tool of TOOLS) {
  test.describe(`${tool.id} UI parity`, () => {
    test('matches the shared formatter chrome', async ({ page }) => {
      const errors = await attachPageErrors(page);
      await page.goto(tool.path);
      await ready(page);

      const input = page.locator(`#${tool.id}-input`);
      const output = page.locator(`#${tool.id}-output`);
      await expect(input).toBeVisible();
      await expect(output).toBeVisible();
      await expect(input).toHaveAttribute('aria-label', /input/i);
      await expect(output).toHaveAttribute('aria-live', 'polite');

      const resize = await input.evaluate((el) => getComputedStyle(el).resize);
      expect(resize, 'input textarea is vertically resizable').toBe('vertical');

      const actions = page.locator('.tool-actions .action-btn');
      await expect(actions).toHaveText(['Paste', 'Clear', 'Download', 'Load example']);
      await expect(page.locator('.io-header .copy-btn')).toHaveCount(1);

      if (tool.modes) {
        const mode = page.locator(`#${tool.id}-mode`);
        await expect(mode).toHaveClass(/io-mode/);
        await expect(mode).toHaveAttribute('aria-label', 'Mode');
        await expect(mode).toBeVisible();
        const inHeader = await mode.evaluate((el) => !!el.closest('.io-header'));
        expect(inHeader, 'mode select lives in the input header').toBe(true);
        await expect(page.locator('.widget-label')).toHaveCount(0);
        await expect(page.locator('select.widget-select')).toHaveCount(0);
      } else {
        await expect(page.locator(`#${tool.id}-mode`)).toHaveCount(0);
      }

      // Load example fills both panes and leaves the status valid.
      await page.locator('[data-conv-example]').click();
      await expect(output).not.toHaveAttribute('data-empty', '');
      await expect(output).toContainText(tool.sampleOut);
      await expect(page.locator(`#${tool.id}-status`)).toContainText(/✓/);

      // Copy feedback on the output header button.
      await page.locator('.io-header .copy-btn').click();
      await expect(page.locator('.io-header .copy-btn')).toHaveAttribute('data-copied', '');
      await expect(page.locator('.io-header .copy-btn')).toHaveAttribute('aria-label', 'Copied!');

      // Clear is confirm-then-clear, like the other structured-data tools.
      const clear = page.locator('.action-btn--clear');
      await clear.click();
      await expect(clear).toHaveText('Confirm Clear');
      await clear.click();
      await expect(input).toHaveValue('');
      await expect(output).toHaveAttribute('data-empty', '');

      if (tool.invalid) {
        await input.fill(tool.invalid);
        await expect(page.locator(`#${tool.id}-status`)).toContainText(tool.invalidStatus!);
        await expect(output).toHaveAttribute('data-empty', '');
      }

      expect(errors, 'no page errors').toEqual([]);
    });

    if (tool.modes) {
      test('rapid mode toggling keeps the output in the selected mode', async ({ page }) => {
        const errors = await attachPageErrors(page);
        await page.goto(tool.path);
        await ready(page);
        const input = page.locator(`#${tool.id}-input`);
        const output = page.locator(`#${tool.id}-output`);
        const mode = page.locator(`#${tool.id}-mode`);

        if (tool.id === 'xml-formatter') {
          await input.fill('<root>\n  <a>1</a>\n</root>');
          await mode.selectOption('pretty');
          await mode.selectOption('minify');
          await mode.selectOption('pretty');
          await mode.selectOption('minify');
          await expect(output).toContainText('<root><a>1</a></root>');
        } else {
          await input.fill('body {\n  color: red;\n}');
          await mode.selectOption('beautify');
          await mode.selectOption('minify');
          await mode.selectOption('beautify');
          await mode.selectOption('minify');
          await expect(output).toContainText('body{color:red}');
          await expect(page.locator(`#${tool.id}-status`)).toContainText(/Saved \d+ byte/i);
        }
        expect(errors, 'no page errors').toEqual([]);
      });
    }

    test('a roughly 1 MB paste does not freeze the page', async ({ page }) => {
      const errors = await attachPageErrors(page);
      await page.goto(tool.path);
      await ready(page);
      const input = page.locator(`#${tool.id}-input`);
      const status = page.locator(`#${tool.id}-status`);

      const started = Date.now();
      await input.evaluate((el, id) => {
        let payload = '';
        if (id === 'sql-formatter') {
          payload = Array.from({ length: 9000 }, (_, i) => `select id from t${i} where x = ${i};`).join('\n');
        } else if (id === 'xml-formatter') {
          payload = '<root>' + Array.from({ length: 25000 }, (_, i) => `<item id="${i}">v</item>`).join('') + '</root>';
        } else {
          payload = Array.from({ length: 25000 }, (_, i) => `.c${i}{color:#333;margin:0;padding:1rem}`).join('');
        }
        (el as HTMLTextAreaElement).value = payload;
        el.dispatchEvent(new Event('input', { bubbles: true }));
      }, tool.id);

      // The page must stay interactive: Clear is still clickable while or after work.
      const clear = page.locator('.action-btn--clear');
      await expect(clear).toBeEnabled();
      await expect(status).toContainText(/Valid|larger than|Working/i, { timeout: 8000 });
      // Wait until Working… has settled if it appeared.
      await expect(status).not.toHaveText('Working…', { timeout: 8000 });
      expect(Date.now() - started, 'engine settled within 8s').toBeLessThan(8000);

      await clear.click();
      await expect(clear).toHaveText('Confirm Clear');
      await clear.click();
      await expect(input).toHaveValue('');
      expect(errors, 'no page errors').toEqual([]);
    });

    test('pixel-width layout does not overflow', async ({ page }) => {
      await page.goto(tool.path);
      await ready(page);
      const overflow = await page.evaluate(() => {
        const doc = document.documentElement;
        return {
          html: doc.scrollWidth > doc.clientWidth + 1,
          extra: Math.max(0, doc.scrollWidth - doc.clientWidth),
        };
      });
      expect(overflow.html, `horizontal overflow of ${overflow.extra}px`).toBe(false);

      const small = await page.locator('.tool-actions .action-btn').evaluateAll((els) =>
        els
          .map((el) => {
            const r = el.getBoundingClientRect();
            return { text: (el as HTMLElement).innerText.trim(), h: Math.round(r.height), w: Math.round(r.width) };
          })
          .filter((b) => b.h < 40 && b.w > 0),
      );
      expect(small, 'action buttons meet a 40px tap height').toEqual([]);
    });
  });
}
