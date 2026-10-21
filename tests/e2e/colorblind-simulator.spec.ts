import { test, expect, type Page } from '@playwright/test';

const URL = '/tool/design/colorblind-simulator/';

function guardConsole(page: Page): string[] {
  const errors: string[] = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') errors.push(msg.text());
  });
  page.on('pageerror', (err) => errors.push(String(err)));
  return errors;
}

test.describe('colorblind simulator', () => {
  test('shows every type at once and names the collapsed red and green', async ({ page }) => {
    const errors = guardConsole(page);
    await page.goto(URL);
    const rows = page.locator('#colorblind-simulator-rows');
    await expect(rows).toContainText('Deuteranopia');
    await expect(rows).toContainText('Protanopia');
    await expect(rows).toContainText('Tritanopia');
    await expect(rows).toContainText('Achromatopsia');
    await expect(page.locator('#colorblind-simulator-note')).toContainText('Deuteranopia');
    await expect(page.locator('#colorblind-simulator-note')).toContainText('#d32f2f');
    expect(errors, errors.join('\n')).toEqual([]);
  });

  test('hides the note when the pair stays apart, and rejects a bad token', async ({ page }) => {
    await page.goto(URL);
    const input = page.locator('#colorblind-simulator-input');
    await input.fill('#1565c0 #f9a825');
    await expect(page.locator('#colorblind-simulator-note')).toBeHidden();
    await input.fill('not-a-color');
    await expect(page.locator('#colorblind-simulator-error')).toBeVisible();
    await expect(page.locator('#colorblind-simulator-note')).toBeHidden();
  });

  test('accepts rgb() and hsl() lists and notes the eight-color cap', async ({ page }) => {
    const errors = guardConsole(page);
    await page.goto(URL);
    const input = page.locator('#colorblind-simulator-input');
    const err = page.locator('#colorblind-simulator-error');
    const cap = page.locator('#colorblind-simulator-cap');
    const firstLine = page.locator('#colorblind-simulator-rows .cb-row').first().locator('.cb-swatch');
    await input.fill('rgb(211, 47, 47) hsl(123, 43%, 39%)');
    await expect(err).toBeHidden();
    await expect(firstLine).toHaveCount(2);
    await input.fill('rgba(0, 0, 255, 0.5), #00ff00 red');
    await expect(err).toBeHidden();
    await expect(firstLine).toHaveCount(3);
    await expect(cap).toBeHidden();
    await input.fill('#000 #111 #222 #333 #444 #555 #666 #777 #888');
    await expect(cap).toBeVisible();
    await expect(cap).toHaveText('Only the first 8 colors are shown.');
    await expect(firstLine).toHaveCount(8);
    await input.fill('#000 #fff');
    await expect(cap).toBeHidden();
    expect(errors, errors.join('\n')).toEqual([]);
  });

  test('names the cap note and error from the input only while shown, and reads "rgb (1,2,3)"', async ({ page }) => {
    await page.goto(URL);
    const input = page.locator('#colorblind-simulator-input');
    await input.fill('rgb (211, 47, 47) #1565c0');
    await expect(page.locator('#colorblind-simulator-error')).toBeHidden();
    await expect(input).not.toHaveAttribute('aria-describedby', /./);
    await input.fill('#000 #111 #222 #333 #444 #555 #666 #777 #888');
    await expect(input).toHaveAttribute('aria-describedby', 'colorblind-simulator-cap');
    await expect(input).toHaveAccessibleDescription('Only the first 8 colors are shown.');
    await input.fill('nope #000');
    await expect(input).toHaveAttribute('aria-describedby', 'colorblind-simulator-error');
    await expect(input).toHaveAccessibleDescription('nope is not a color.');
  });
});
