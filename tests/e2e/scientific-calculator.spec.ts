// Deep suite for the Scientific Calculator — drives the real bespoke widget end to end on both
// viewports (chromium + pixel5). The pure math/state layers are unit-tested; this proves the
// keypad, keyboard, DEG/RAD, memory, history, and copy wiring work in a real browser.
import { test, expect, type Page } from '@playwright/test';

const URL = '/tool/number/scientific-calculator/';

function guardConsole(page: Page): string[] {
  const errors: string[] = [];
  page.on('console', (m) => {
    if (m.type() === 'error') errors.push(m.text());
  });
  page.on('pageerror', (e) => errors.push(String(e)));
  return errors;
}

/** Click keypad buttons by exact accessible name. */
async function press(page: Page, ...names: string[]): Promise<void> {
  for (const name of names) {
    await page.getByRole('button', { name, exact: true }).first().click();
  }
}

const result = (page: Page) => page.locator('#sc-result');
const expr = (page: Page) => page.locator('#sc-expr');

test.describe('scientific calculator', () => {
  test('respects order of operations', async ({ page }) => {
    const errors = guardConsole(page);
    await page.goto(URL);
    await press(page, '2', 'plus', '3', 'multiply', '4', 'equals');
    await expect(result(page)).toHaveText('= 14');
    expect(errors, errors.join('\n')).toEqual([]);
  });

  test('parentheses override precedence', async ({ page }) => {
    await page.goto(URL);
    await press(page, 'open parenthesis', '2', 'plus', '3', 'close parenthesis', 'multiply', '4', 'equals');
    await expect(result(page)).toHaveText('= 20');
  });

  test('trig honours the DEG/RAD toggle', async ({ page }) => {
    await page.goto(URL);
    // DEG is the default.
    await press(page, 'sine', '3', '0', 'close parenthesis', 'equals');
    await expect(result(page)).toHaveText('= 0.5');
    // Switch to radians: same keys give a different value.
    await press(page, 'clear all', 'RAD');
    await press(page, 'sine', '3', '0', 'close parenthesis', 'equals');
    await expect(result(page)).not.toHaveText('= 0.5');
    await expect(page.getByRole('button', { name: 'RAD', exact: true })).toHaveAttribute('aria-pressed', 'true');
  });

  test('computes a square root and a factorial', async ({ page }) => {
    await page.goto(URL);
    await press(page, 'square root', '2', 'close parenthesis', 'equals');
    await expect(result(page)).toHaveText(/= 1\.41421356/);
    await press(page, 'clear all', '5', 'factorial', 'equals');
    await expect(result(page)).toHaveText('= 120');
  });

  test('accepts physical keyboard input', async ({ page }) => {
    await page.goto(URL);
    await expr(page).focus();
    await page.keyboard.type('6*7');
    await expect(expr(page)).toHaveValue('6*7');
    await page.keyboard.press('Enter');
    await expect(result(page)).toHaveText('= 42');
  });

  test('keyboard backspace and clear edit the expression', async ({ page }) => {
    await page.goto(URL);
    await expr(page).focus();
    await page.keyboard.type('12');
    await expect(expr(page)).toHaveValue('12');
    await page.keyboard.press('Backspace');
    await expect(expr(page)).toHaveValue('1');
    await page.keyboard.press('Escape');
    await expect(expr(page)).toHaveValue('');
  });

  test('records history and reuses an entry', async ({ page }) => {
    await page.goto(URL);
    await press(page, '8', 'plus', '1', 'equals'); // 9
    await expect(page.locator('.sc-history-item')).toHaveCount(1);
    await press(page, 'clear all');
    await page.locator('.sc-history-item').first().click();
    await expect(expr(page)).toHaveValue('8+1');
  });

  test('memory keys store and recall a value', async ({ page }) => {
    await page.goto(URL);
    await press(page, '5', 'equals'); // ans = 5
    await press(page, 'memory store'); // M = 5
    await expect(page.locator('#sc-mem')).toBeVisible();
    await press(page, 'clear all', 'memory recall'); // inserts 5
    await expect(expr(page)).toHaveValue('5');
    await press(page, 'memory clear');
    await expect(page.locator('#sc-mem')).toBeHidden();
  });

  test('shows a friendly error and copies the result', async ({ page }) => {
    await page.goto(URL);
    await press(page, '1', 'divide', '0', 'equals');
    await expect(result(page)).toHaveClass(/is-error/);
    // A valid result can be copied.
    await press(page, 'clear all', '2', 'plus', '2', 'equals');
    await page.getByRole('button', { name: 'Copy result' }).click();
    await expect(page.getByRole('button', { name: '✓ Copied' })).toBeVisible();
  });
});
