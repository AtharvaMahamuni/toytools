import { test, expect, type Page } from '@playwright/test';

const URL = '/tool/developer-utilities/cidr-calculator/';

function guardConsole(page: Page): string[] {
  const errors: string[] = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') errors.push(msg.text());
  });
  page.on('pageerror', (err) => errors.push(String(err)));
  return errors;
}

test.describe('cidr calculator', () => {
  test('computes a /24 live and offers the network when a host is typed', async ({ page }) => {
    const errors = guardConsole(page);
    await page.goto(URL);
    const hero = page.locator('#cidr-calculator-hero');
    await expect(hero).toHaveText('192.168.1.0/24');
    await expect(page.locator('#cidr-calculator-recover')).toBeHidden();

    await page.locator('[data-field-id="cidr"]').fill('192.168.1.50/24');
    await expect(hero).toHaveText('192.168.1.0/24');
    const recover = page.locator('#cidr-calculator-recover');
    await expect(recover).toBeVisible();
    await expect(recover).toContainText('192.168.1.0/24');
    await recover.click();
    await expect(page.locator('[data-field-id="cidr"]')).toHaveValue('192.168.1.0/24');
    await expect(recover).toBeHidden();
    expect(errors, errors.join('\n')).toEqual([]);
  });

  test('keeps both addresses on a /31', async ({ page }) => {
    await page.goto(URL);
    await page.locator('[data-field-id="cidr"]').fill('10.0.0.0/31');
    await expect(page.locator('#cidr-calculator-hero')).toHaveText('10.0.0.0/31');
    await expect(page.locator('#cidr-calculator-experience')).toContainText('2');
    await expect(page.locator('#cidr-calculator-experience')).toContainText('none');
  });
});
