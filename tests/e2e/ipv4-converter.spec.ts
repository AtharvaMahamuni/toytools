import { test, expect, type Page } from '@playwright/test';

const URL = '/tool/developer-utilities/ipv4-converter/';

function guardConsole(page: Page): string[] {
  const errors: string[] = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') errors.push(msg.text());
  });
  page.on('pageerror', (err) => errors.push(String(err)));
  return errors;
}

test.describe('ipv4 converter', () => {
  test('converts a dotted address and stays quiet', async ({ page }) => {
    const errors = guardConsole(page);
    await page.goto(URL);
    await expect(page.locator('#ipv4-converter-hero')).toHaveText('192.168.0.1');
    await expect(page.locator('#ipv4-converter-experience')).toContainText('0xC0A80001');
    await expect(page.locator('#ipv4-converter-recover')).toBeHidden();
    expect(errors, errors.join('\n')).toEqual([]);
  });

  test('offers the dotted address for a glued integer and for mapped IPv6', async ({ page }) => {
    await page.goto(URL);
    const field = page.locator('[data-field-id="address"]');
    const recover = page.locator('#ipv4-converter-recover');

    await field.fill('8888');
    await expect(page.locator('#ipv4-converter-hero')).toHaveText('0.0.34.184');
    await expect(recover).toContainText('8.8.8.8');
    await recover.click();
    await expect(field).toHaveValue('8.8.8.8');
    await expect(recover).toBeHidden();

    await field.fill('::ffff:192.0.2.1');
    await expect(recover).toContainText('192.0.2.1');
    await field.fill('2001:db8::1');
    await expect(recover).toBeHidden();
    await expect(page.locator('#ipv4-converter-experience')).toContainText('not cut down');

    await field.fill('256.1.1.1');
    await expect(page.locator('#ipv4-converter-experience')).toContainText('256');
    await expect(recover).toBeHidden();
  });
});
