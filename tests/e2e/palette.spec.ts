// Command palette, shortcut help, and the search surfaces built on the same index.
//
// The point of the palette is reaching another tool from a tool page, which was impossible before
// it, so most of these deliberately start somewhere that is not the home page.
import { test, expect } from '@playwright/test';

const TOOL = '/tool/text/word-counter/';
// Text tools autofocus their input, so "/" correctly goes into the textarea there. A category page
// is where a bare keystroke has no field to land in, which is what the "/" shortcut is for.
const NO_FIELD_PAGE = '/category/text-utilities/';

test.describe('command palette', () => {
  test('opens from a tool page with Ctrl+K and navigates to another tool', async ({ page }) => {
    await page.goto(TOOL);
    await page.keyboard.press('Control+k');

    const palette = page.locator('#tt-palette');
    await expect(palette).toBeVisible();
    await expect(page.locator('#tt-palette-input')).toBeFocused();

    await page.locator('#tt-palette-input').fill('json formatter');
    const first = palette.locator('[data-url]').first();
    await expect(first).toContainText('JSON Formatter');

    await page.keyboard.press('Enter');
    await expect(page).toHaveURL(/\/tool\/developer-utilities\/json-formatter\/$/);
  });

  test('opens with "/" where no field has focus', async ({ page }) => {
    await page.goto(NO_FIELD_PAGE);
    await page.keyboard.press('/');
    await expect(page.locator('#tt-palette')).toBeVisible();
  });

  test('Ctrl+K interrupts typing, "/" does not', async ({ page }) => {
    await page.goto(TOOL);
    const textarea = page.locator('textarea').first();
    await textarea.click();
    await textarea.fill('');
    await textarea.type('and/or');

    // "/" belongs to the person typing.
    await expect(page.locator('#tt-palette')).toBeHidden();
    await expect(textarea).toHaveValue('and/or');

    // Ctrl+K is the deliberate escape hatch, which is why the nav advertises it and not "/".
    await page.keyboard.press('Control+k');
    await expect(page.locator('#tt-palette')).toBeVisible();
  });

  test('arrow keys move the selection and Escape restores focus', async ({ page }) => {
    await page.goto(TOOL);
    const trigger = page.locator('[data-palette-open]');
    await trigger.click();

    await page.locator('#tt-palette-input').fill('counter');
    const options = page.locator('#tt-palette [data-url]');
    await expect(options.first()).toHaveAttribute('aria-selected', 'true');

    await page.keyboard.press('ArrowDown');
    await expect(options.nth(1)).toHaveAttribute('aria-selected', 'true');
    await expect(options.first()).toHaveAttribute('aria-selected', 'false');

    await page.keyboard.press('Escape');
    await expect(page.locator('#tt-palette')).toBeHidden();
    // Focus must come back to the control that opened it, not the top of the document.
    await expect(trigger).toBeFocused();
  });

  test('finds a tool by alias and by typo', async ({ page }) => {
    await page.goto(TOOL);
    await page.keyboard.press('Control+k');
    const input = page.locator('#tt-palette-input');
    const first = page.locator('#tt-palette [data-url]').first();

    await input.fill('percent off');
    await expect(first).toContainText('Discount Calculator');

    // One character short of "formatter": the typo tolerance should still find it.
    await input.fill('formater');
    await expect(first).toContainText('Formatter');
  });

  test('an unmatched query offers the feedback form', async ({ page }) => {
    await page.goto(TOOL);
    await page.keyboard.press('Control+k');
    await page.locator('#tt-palette-input').fill('zzzzqqqq');

    const status = page.locator('.tt-palette-status');
    await expect(status).toContainText('No tool matches');
    await expect(status.getByRole('link', { name: 'Suggest it' })).toHaveAttribute(
      'href',
      /\/feedback\/\?type=new&q=zzzzqqqq/,
    );
  });

  test('the nav search works as a plain link with no JavaScript', async ({ browser }) => {
    const context = await browser.newContext({ javaScriptEnabled: false });
    const page = await context.newPage();
    await page.goto(TOOL);
    await page.locator('[data-palette-open]').click();
    await expect(page).toHaveURL(/\/search\/$/);
    await context.close();
  });
});

test.describe('shortcut help', () => {
  test('"?" lists the shortcuts and closes on Escape', async ({ page }) => {
    await page.goto(NO_FIELD_PAGE);
    await page.keyboard.press('?');

    const help = page.getByRole('dialog', { name: 'Keyboard shortcuts' });
    await expect(help).toBeVisible();
    await expect(help).toContainText('Search every tool');

    await page.keyboard.press('Escape');
    await expect(help).toBeHidden();
  });
});

test.describe('search page', () => {
  test('filters live while typing, without submitting', async ({ page }) => {
    await page.goto('/search/');
    await expect(page.locator('#search-results')).toHaveAttribute('data-search-ready', 'true');
    const input = page.locator('#search-page-query');
    await input.fill('json');

    await expect(page.locator('#result-count')).toContainText('matching tool');
    const visible = page.locator('[data-search-item]:not([hidden])');
    await expect(visible.first()).toContainText('JSON');
    // The URL keeps up so the result set is shareable.
    await expect(page).toHaveURL(/\?q=json/);
  });

  test('ranks the best match first rather than leaving it in alphabetical order', async ({ page }) => {
    await page.goto('/search/');
    await expect(page.locator('#search-results')).toHaveAttribute('data-search-ready', 'true');
    await page.locator('#search-page-query').fill('word counter');
    const first = page.locator('[data-search-item]:not([hidden])').first();
    await expect(first).toHaveAttribute('data-slug', 'word-counter');
  });

  test('honours a ?q= deep link', async ({ page }) => {
    await page.goto('/search/?q=uuid');
    await expect(page.locator('#search-results')).toHaveAttribute('data-search-ready', 'true');
    const visible = page.locator('[data-search-item]:not([hidden])');
    await expect(visible).toHaveCount(1);
    await expect(visible.first()).toHaveAttribute('data-slug', 'uuid-generator');
  });
});

test.describe('404', () => {
  test('suggests the closest tools for a mistyped slug', async ({ page }) => {
    await page.goto('/tool/text/word-countr/');
    const suggestions = page.locator('#nf-suggestions');
    await expect(suggestions).toBeVisible();
    await expect(suggestions.getByRole('link', { name: 'Word Counter' })).toBeVisible();
  });

  test('showing suggestions cancels the automatic redirect', async ({ page }) => {
    await page.goto('/tool/text/word-countr/');
    await expect(page.locator('#nf-suggestions')).toBeVisible();
    await expect(page.locator('.redirect-notice')).toHaveCount(0);
    // Well past the 5s countdown: we must still be here.
    await page.waitForTimeout(6000);
    await expect(page).toHaveURL(/word-countr/);
  });
});
