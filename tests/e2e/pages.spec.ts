// The standalone pages: privacy, about, changelog, settings.
//
// Settings gets the real coverage, because it is the only page on the site that can destroy data
// the user cannot get back.
import { test, expect } from '@playwright/test';

test.describe('information pages', () => {
  for (const [path, heading] of [
    ['/privacy/', 'Privacy'],
    ['/about/', 'About ToyTools'],
    ['/changelog/', 'Changelog'],
  ] as const) {
    test(`${path} renders and is reachable from the footer`, async ({ page }) => {
      await page.goto('/');
      const link = page.getByRole('navigation', { name: 'Site information' })
        .getByRole('link', { name: heading.split(' ')[0]! });
      await link.click();
      await expect(page).toHaveURL(new RegExp(`${path}$`));
      await expect(page.getByRole('heading', { level: 1 })).toHaveText(heading);
    });
  }

  // The knowledge drawers are closed by default, which is the point of them. But 32 retired
  // /faq/... URLs are noindex redirect stubs pointing at #faq on a tool page
  // (src/data/faq-redirects.ts), and those URLs were indexed once. Landing on a collapsed drawer
  // from one of them would be arriving at a page that appears not to contain what was promised.
  test('a #faq link opens the questions drawer rather than landing on a closed one', async ({ page }) => {
    await page.goto('/tool/developer-utilities/base64-encoder-decoder/#faq');
    const drawer = page.locator('details#faq');
    await expect(drawer).toHaveAttribute('open', '');
    await expect(drawer.getByRole('heading', { level: 2 })).toBeVisible();
  });

  test('the changelog renders the real releases from CHANGELOG.md', async ({ page }) => {
    await page.goto('/changelog/');
    const releases = page.locator('.release');
    await expect(releases.first()).toBeVisible();
    // Rendered, not shown as raw markdown.
    await expect(page.locator('.release-section code').first()).toBeVisible();
    await expect(page.locator('.release-section li').first()).not.toContainText('**');
  });

  // From a platform page, not a tool page: tool pages render their own ToolBar instead of Nav, so
  // the version badge is not there by design. Chrome belongs to whoever owns the page.
  test('the nav version badge links to the changelog', async ({ page }) => {
    await page.goto('/');
    await page.locator('.nav-version').click();
    await expect(page).toHaveURL(/\/changelog\/$/);
  });

  test('a tool page renders its own header instead of the site nav', async ({ page }) => {
    await page.goto('/tool/text/word-counter/');
    await expect(page.locator('.tool-bar')).toBeVisible();
    await expect(page.locator('.nav-logo')).toHaveCount(0);
    // Exactly one banner landmark, whichever header is drawn.
    await expect(page.getByRole('banner')).toHaveCount(1);
    // Search survives the swap: it is the only way to reach another tool from here.
    await expect(page.locator('.tool-bar [data-palette-open]')).toBeVisible();
    // The h1 moved into the bar rather than being replaced by it.
    await expect(page.locator('.tool-bar h1')).toHaveText('Word Counter');
  });

  test('privacy names the analytics that actually loads', async ({ page }) => {
    await page.goto('/privacy/');
    // The page must not claim there is no tracking when GA is present for real visitors.
    await expect(page.getByRole('heading', { name: 'Google Analytics' })).toBeVisible();
    await expect(page.locator('body')).toContainText('G-WHD7CL44MX');
  });
});

test.describe('offline fallback page', () => {
  // The service worker itself is NOT exercised here: registration is deliberately skipped under
  // automation (see src/lib/analytics/guard.ts), so no worker ever controls the page in E2E. What
  // is covered is the page the worker serves, which is where the bugs would be anyway.
  test('is not indexed', async ({ page }) => {
    await page.goto('/offline/');
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex/);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('You are offline');
  });

  test('lists tools this browser has already opened', async ({ page }) => {
    await page.goto('/tool/text/reverse-text/');
    await page.goto('/offline/');

    const available = page.locator('#available');
    await expect(available).toBeVisible();
    await expect(available.getByRole('link', { name: /reverse text/i })).toBeVisible();
  });

  test('says nothing is available when nothing has been opened', async ({ page }) => {
    await page.goto('/offline/');
    await expect(page.locator('#available')).toBeHidden();
  });
});

test.describe('settings', () => {
  test('is not indexed', async ({ page }) => {
    await page.goto('/settings/');
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex/);
  });

  test('lists what a tool has saved', async ({ page }) => {
    // Save something real first.
    await page.goto('/tool/productivity/notepad/');
    await page.locator('textarea').first().fill('a note worth keeping');
    await page.waitForTimeout(400);

    await page.goto('/settings/');
    await expect(page.locator('#storage-summary')).toContainText('saved');
    await expect(page.locator('#key-list li')).not.toHaveCount(0);
  });

  test('exports a backup file containing the saved data', async ({ page }) => {
    await page.goto('/tool/productivity/notepad/');
    await page.locator('textarea').first().fill('exported note');
    await page.waitForTimeout(400);

    await page.goto('/settings/');
    const download = await Promise.all([
      page.waitForEvent('download'),
      page.locator('#export-btn').click(),
    ]).then(([d]) => d);

    expect(download.suggestedFilename()).toMatch(/^toytools-backup-\d{4}-\d{2}-\d{2}\.json$/);
  });

  test('delete everything needs two taps and then clears storage', async ({ page }) => {
    await page.goto('/tool/productivity/notepad/');
    await page.locator('textarea').first().fill('about to be deleted');
    await page.waitForTimeout(400);
    await page.goto('/settings/');

    const remaining = () => page.evaluate(() => {
      let n = 0;
      for (let i = 0; i < localStorage.length; i++) {
        if (localStorage.key(i)?.startsWith('toytools')) n++;
      }
      return n;
    });
    expect(await remaining()).toBeGreaterThan(0);

    const button = page.locator('#delete-btn');
    await button.click();
    // One tap only arms it: nothing may be gone yet.
    await expect(button).toContainText('Tap again');
    expect(await remaining()).toBeGreaterThan(0);

    await button.click();
    await expect(button).toHaveText('Delete everything');
    expect(await remaining()).toBe(0);
  });
});
