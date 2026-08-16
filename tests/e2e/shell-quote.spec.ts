// Shell Quoting Escalator, in a real browser.
//
// The generic smoke suite proves the page loads and the widget does not throw. This suite proves
// the thing the tool actually claims: that the bottom of the ladder is the command the user typed,
// which is the property a wall of apostrophes makes impossible to check by eye.
//
// The craft assertions are deliberately half about silence. An orientation line that appears over
// an ordinary command turns a quiet tool into a nagging one, and that failure is invisible to a
// suite that only checks it fires.

import { test, expect } from '@playwright/test';

const PATH = '/tool/developer-utilities/shell-quote-escalator/';

async function type(page: import('@playwright/test').Page, command: string, chain?: string) {
  await page.goto(PATH);
  if (chain) await page.locator('#sq-chain').selectOption(chain);
  await page.locator('#sq-input').fill(command);
  await expect(page.locator('#sq-output')).not.toHaveAttribute('data-empty', '');
}

test.describe('shell quoting escalator', () => {
  test('quotes a command and ends the ladder at what the user typed', async ({ page }) => {
    const command = "echo 'a b'";
    await type(page, command, 'ssh');

    const rungs = page.locator('#sq-ladder li');
    await expect(rungs).toHaveCount(2); // one hop -> "you type" + "what runs"
    await expect(rungs.last().locator('.sq-rung-text')).toHaveText(command);
  });

  test('adds exactly one rung per shell in the chain', async ({ page }) => {
    await type(page, 'id', 'ssh-sudo-docker');
    await expect(page.locator('#sq-ladder li')).toHaveCount(4);
    await expect(page.locator('#sq-ladder li').last().locator('.sq-rung-text')).toHaveText('id');
  });

  test('re-quotes when the chain changes, without retyping the command', async ({ page }) => {
    await type(page, 'id', 'ssh');
    const oneLayer = await page.locator('#sq-output').textContent();

    await page.locator('#sq-chain').selectOption('ssh-sudo');
    const twoLayers = await page.locator('#sq-output').textContent();

    expect(twoLayers).not.toBe(oneLayer);
    expect((twoLayers ?? '').length).toBeGreaterThan((oneLayer ?? '').length);
  });

  test('reports an unbalanced quote instead of quoting it', async ({ page }) => {
    await page.goto(PATH);
    await page.locator('#sq-input').fill("echo 'a b");

    await expect(page.locator('#sq-error')).toBeVisible();
    await expect(page.locator('#sq-output')).toHaveAttribute('data-error', /single quote/);
    await expect(page.locator('#sq-ladder li')).toHaveCount(0);
  });

  test('the craft line names where an expansion resolves', async ({ page }) => {
    await type(page, 'echo $HOME', 'ssh-docker');

    const note = page.locator('[data-craft="shell-expansion-points"]');
    await expect(note).toBeVisible();
    await expect(note).toContainText('$HOME');
    await expect(note).toContainText('container shell');
  });

  test('the craft line stays silent over an ordinary command', async ({ page }) => {
    await type(page, 'systemctl restart nginx', 'ssh');
    await expect(page.locator('[data-craft="shell-expansion-points"]')).toBeHidden();
  });

  test('the example button fills a command and produces a ladder', async ({ page }) => {
    await page.goto(PATH);
    await page.locator('#sq-example').click();

    await expect(page.locator('#sq-input')).not.toHaveValue('');
    await expect(page.locator('#sq-ladder li')).toHaveCount(3); // ssh-sudo
  });

  test('the command survives a reload', async ({ page }) => {
    await type(page, 'uptime', 'sudo');
    await page.reload();
    await expect(page.locator('#sq-input')).toHaveValue('uptime');
    await expect(page.locator('#sq-chain')).toHaveValue('sudo');
  });
});
