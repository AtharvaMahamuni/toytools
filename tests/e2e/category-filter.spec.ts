// Category chips on Home (the "Browse all tools" directory) and /search/. State is ?cat=<slug>,
// pushed to history on each chip tap; nothing is written to storage. Without JS each chip is a
// plain link to its /category/<slug>/ page.
import { test, expect, type Page } from '@playwright/test';

const chip = (page: Page, name: RegExp) => page.locator('.cat-chip').filter({ hasText: name });
const ready = (page: Page) => expect(page.locator('#search-results')).toHaveAttribute('data-search-ready', 'true');
const visibleCards = (page: Page) => page.locator('[data-search-item]:visible');

test.describe('home category chips', () => {
  test('filter, toggle off, All, aria-pressed and the live region', async ({ page }) => {
    await page.goto('/');
    await page.locator('.all-tools-summary').click();
    const physics = chip(page, /^Physics \d+$/);
    await expect(physics).toHaveAttribute('aria-pressed', 'false');
    await physics.click();
    await expect(physics).toHaveAttribute('aria-pressed', 'true');
    await expect(chip(page, /^All \d+$/)).toHaveAttribute('aria-pressed', 'false');
    await expect(page).toHaveURL(/\?cat=physics$/);
    await expect(page.locator('.dir-column:visible')).toHaveCount(1);
    await expect(page.locator('.dir-column[data-cat="physics"]')).toBeVisible();
    await expect(page.locator('[data-cat-live]')).toHaveText(/^Showing \d+ Physics tools?$/);

    await physics.click(); // the active chip again clears it
    await expect(physics).toHaveAttribute('aria-pressed', 'false');
    await expect(page).not.toHaveURL(/cat=/);
    await expect(page.locator('.dir-column:visible')).toHaveCount(16);

    await physics.click();
    await chip(page, /^All \d+$/).click();
    await expect(page.locator('.dir-column:visible')).toHaveCount(16);
    await expect(page.locator('[data-cat-live]')).toHaveText(/^Showing all \d+ tools$/);
  });

  test('a shared ?cat link opens the directory filtered, Back undoes it, nothing stored', async ({ page }) => {
    await page.goto('/?cat=money-finance');
    await expect(page.locator('details.all-tools')).toHaveAttribute('open', '');
    await expect(chip(page, /^Money & Finance/)).toHaveAttribute('aria-pressed', 'true');
    await expect(page.locator('.dir-column:visible')).toHaveCount(1);

    await chip(page, /^Physics/).click();
    await expect(page).toHaveURL(/\?cat=physics$/);
    await page.goBack();
    await expect(page).toHaveURL(/\?cat=money-finance$/);
    await expect(chip(page, /^Money & Finance/)).toHaveAttribute('aria-pressed', 'true');
    await expect(page.locator('.dir-column[data-cat="money-finance"]')).toBeVisible();
    await expect(page.locator('.dir-column[data-cat="physics"]')).toBeHidden();

    const stored = await page.evaluate(() =>
      [...Object.keys(localStorage), ...Object.keys(sessionStorage)].filter((k) => /cat/i.test(k)),
    );
    expect(stored).toEqual([]);
  });

  test('an invalid slug falls back to All', async ({ page }) => {
    await page.goto('/?cat=not-a-category');
    await expect(chip(page, /^All \d+$/)).toHaveAttribute('aria-pressed', 'true');
    await expect(page.locator('.cat-chip[aria-pressed="true"]')).toHaveCount(1);
    await expect(page.locator('.dir-column[hidden]')).toHaveCount(0);
  });

  test('chips upgrade to buttons and keep a 44px tap target', async ({ page }) => {
    await page.goto('/');
    await page.locator('.all-tools-summary').click();
    const first = page.locator('button.cat-chip').first();
    const box = await first.boundingBox();
    expect(box!.height).toBeGreaterThanOrEqual(44);
    await expect(page.locator('a.cat-chip')).toHaveCount(0);
  });
});

test.describe('search category chips', () => {
  test('chip ANDs with the text filter and the empty state names the category', async ({ page }) => {
    await page.goto('/search/?q=calculator');
    await ready(page);
    const all = await visibleCards(page).count();
    await chip(page, /^Physics/).click();
    await expect(page).toHaveURL(/q=calculator&cat=physics$/);
    const n = await visibleCards(page).count();
    expect(n).toBeGreaterThan(0);
    expect(n).toBeLessThan(all);
    for (const t of await visibleCards(page).locator('.tool-category').allTextContents()) expect(t).toBe('Physics');
    // One announcement on /search/: the results' live region, and no second chip region.
    await expect(page.locator('#result-count')).toHaveText(`Showing ${n} Physics tool${n === 1 ? '' : 's'}`);
    await expect(page.locator('[data-cat-live]')).toHaveCount(0);

    // Typing keeps the category.
    await page.locator('#search-page-query').fill('zzqqxx');
    await expect(page.locator('#cat-empty')).toBeVisible();
    await expect(page.locator('#cat-empty')).toContainText('No Physics tools match.');
    await expect(page.locator('#empty-state')).toBeHidden();
    await page.getByRole('button', { name: 'Show all categories' }).click();
    await expect(page).not.toHaveURL(/cat=/);
    await expect(chip(page, /^All/)).toHaveAttribute('aria-pressed', 'true');
    await expect(page.locator('#cat-empty')).toBeHidden();
    await expect(page.locator('#empty-state')).toBeVisible();
  });

  test('?cat round-trips on load, Back restores, invalid slug is All', async ({ page }) => {
    await page.goto('/search/?cat=chemistry');
    await ready(page);
    await expect(chip(page, /^Chemistry/)).toHaveAttribute('aria-pressed', 'true');
    for (const t of await visibleCards(page).locator('.tool-category').allTextContents()) expect(t).toBe('Chemistry');
    await chip(page, /^Physics/).click();
    await page.goBack();
    await expect(page).toHaveURL(/\?cat=chemistry$/);
    await expect(chip(page, /^Chemistry/)).toHaveAttribute('aria-pressed', 'true');
    for (const t of await visibleCards(page).locator('.tool-category').allTextContents()) expect(t).toBe('Chemistry');

    await page.goto('/search/?cat=bogus');
    await ready(page);
    await expect(chip(page, /^All/)).toHaveAttribute('aria-pressed', 'true');
    await expect(page.locator('#result-count')).toHaveText(/tools available$/);
  });

  test('Back and Forward restore ?q and ?cat together', async ({ page }) => {
    await page.goto('/search/');
    await ready(page);
    const box = page.locator('#search-page-query');
    await box.fill('loan');
    await expect(page).toHaveURL(/\?q=loan$/);
    const loanCount = await visibleCards(page).count();
    await chip(page, /^Money & Finance/).click();
    await expect(page).toHaveURL(/q=loan&cat=money-finance$/);
    await chip(page, /^All/).click();
    await expect(page).toHaveURL(/\?q=loan$/);

    await page.goBack();
    await expect(page).toHaveURL(/q=loan&cat=money-finance$/);
    await expect(box).toHaveValue('loan');
    await expect(chip(page, /^Money & Finance/)).toHaveAttribute('aria-pressed', 'true');
    await expect(page.locator('#result-count')).toHaveText(/^Showing \d+ Money & Finance tools?$/);

    // Typing uses replaceState, so the entry before the chip is ?q=loan itself (the regression:
    // this used to show ?q=loan with an empty box and every tool).
    await page.goBack();
    await expect(page).toHaveURL(/\?q=loan$/);
    await expect(box).toHaveValue('loan');
    await expect(chip(page, /^All/)).toHaveAttribute('aria-pressed', 'true');
    await expect(visibleCards(page)).toHaveCount(loanCount);
    expect(loanCount).toBeLessThan(150);

    await page.goForward();
    await expect(page).toHaveURL(/q=loan&cat=money-finance$/);
    await expect(box).toHaveValue('loan');
    await page.goForward();
    await expect(page).toHaveURL(/\?q=loan$/);
    await expect(box).toHaveValue('loan');
    await expect(chip(page, /^All/)).toHaveAttribute('aria-pressed', 'true');
    await expect(visibleCards(page)).toHaveCount(loanCount);
  });

  test('Back after clearing the box restores the earlier ?q into the box and reruns it', async ({ page }) => {
    await page.goto('/search/');
    await ready(page);
    const box = page.locator('#search-page-query');
    await box.fill('loan');
    await expect(page).toHaveURL(/\?q=loan$/);
    const loanCount = await visibleCards(page).count();
    await chip(page, /^Money & Finance/).click();
    await box.fill('');
    await expect(page).toHaveURL(/\?cat=money-finance$/);
    await page.goBack();
    await expect(page).toHaveURL(/\?q=loan$/);
    await expect(box).toHaveValue('loan');
    await expect(visibleCards(page)).toHaveCount(loanCount);
    await page.goForward();
    await expect(box).toHaveValue('');
    await expect(page.locator('#result-count')).toHaveText(/^Showing \d+ Money & Finance tools?$/);
  });

  for (const mode of ['offline', 'still loading'] as const) {
    test(`the chip filters while the search index is ${mode}`, async ({ page }) => {
      let release = () => {};
      const gate = new Promise<void>((r) => { release = r; });
      await page.route('**/search-index.json', async (route) => {
        if (mode === 'offline') return route.abort();
        await gate;
        return route.continue();
      });
      await page.goto('/search/?cat=chemistry');
      await expect(chip(page, /^Chemistry/)).toHaveAttribute('aria-pressed', 'true');
      await expect(page.locator('#search-results')).not.toHaveAttribute('data-search-ready', 'true');
      const cats = await visibleCards(page).locator('.tool-category').allTextContents();
      expect(cats.length).toBeGreaterThan(0);
      for (const t of cats) expect(t).toBe('Chemistry');
      await chip(page, /^Physics/).click();
      await expect(page.locator('#result-count')).toHaveText(/^Showing \d+ Physics tools?$/);
      for (const t of await visibleCards(page).locator('.tool-category').allTextContents()) expect(t).toBe('Physics');
      release();
    });
  }

  test('canonical stays on the plain page', async ({ page }) => {
    await page.goto('/search/?cat=physics');
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', /\/search\/$/);
  });
});

test.describe('without JavaScript', () => {
  test.use({ javaScriptEnabled: false });

  for (const path of ['/', '/search/']) {
    test(`${path} chips are plain links to category pages`, async ({ page }) => {
      await page.goto(path);
      const links = page.locator('a.cat-chip');
      expect(await links.count()).toBeGreaterThan(10);
      await expect(page.locator('button.cat-chip')).toHaveCount(0);
      await expect(links.filter({ hasText: /^Physics/ })).toHaveAttribute('href', /\/category\/physics\/$/);
      await expect(links.first()).toHaveAttribute('href', new RegExp(`${path.replace(/\//g, '\\/')}$`));
      for (const href of await links.evaluateAll((els) => els.map((e) => e.getAttribute('href')))) {
        expect(href).not.toContain('cat=');
      }
    });
  }
});
