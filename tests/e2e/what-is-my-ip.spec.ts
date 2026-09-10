import { test, expect, type Page } from '@playwright/test';

const URL = '/tool/developer-utilities/what-is-my-ip/';

async function mockEcho(page: Page, v4: string, v6?: string) {
  await page.route('https://api.ipify.org/**', async (route) => {
    await route.fulfill({ json: { ip: v4 } });
  });
  await page.route('https://api64.ipify.org/**', async (route) => {
    await route.fulfill({ json: { ip: v6 ?? v4 } });
  });
}

test.describe('what is my ip', () => {
  test('shows labelled IPv4 and IPv6 from the echo', async ({ page }) => {
    await mockEcho(page, '203.0.113.10', '2001:db8::1');
    await page.goto(URL);
    await expect(page.locator('#ip-hero')).toHaveText('203.0.113.10');
    await expect(page.locator('#ip-hero-label')).toHaveText('Public IPv4');
    await expect(page.locator('#ip-v6')).toHaveText('2001:db8::1');
    await expect(page.locator('#ip-note')).toBeVisible();
    await expect(page.locator('#ip-note')).toContainText('both families');
  });

  test('names a CGNAT address so it is not copied as public', async ({ page }) => {
    await mockEcho(page, '100.64.1.20');
    await page.goto(URL);
    await expect(page.locator('#ip-hero')).toHaveText('100.64.1.20');
    await expect(page.locator('#ip-note')).toBeVisible();
    await expect(page.locator('#ip-note')).toContainText('CGNAT');
  });

  test('stays silent on a plain public IPv4-only result', async ({ page }) => {
    await mockEcho(page, '8.8.8.8', '8.8.8.8');
    await page.goto(URL);
    await expect(page.locator('#ip-hero')).toHaveText('8.8.8.8');
    await expect(page.locator('#ip-note')).toBeHidden();
  });
});
