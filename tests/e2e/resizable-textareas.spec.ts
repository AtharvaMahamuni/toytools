import { test, expect, type Locator, type Page } from '@playwright/test';

// Site-wide resizable textareas (beta-v12.0.2). The height lives on the textarea, not on its
// .io-panel: it opens at --io-pane-h (or the viewport default), drags vertically between 5rem
// and 80vh, and a few deliberate exceptions keep their fixed boxes. See tool-widget.css.

const BASE64 = '/tool/developer-utilities/base64-encoder-decoder/';
const JSON_FORMATTER = '/tool/developer-utilities/json-formatter/';

async function heightOf(el: Locator): Promise<number> {
  const box = await el.boundingBox();
  if (!box) throw new Error('element has no box');
  return box.height;
}

async function computed(el: Locator, prop: string): Promise<string> {
  return el.evaluate((node, p) => getComputedStyle(node).getPropertyValue(p), prop);
}

/** Drag the native resize grip (bottom-right corner) down by dy pixels. */
async function dragGrip(page: Page, el: Locator, dy: number): Promise<void> {
  const box = await el.boundingBox();
  if (!box) throw new Error('element has no box');
  const x = box.x + box.width - 3;
  const y = box.y + box.height - 3;
  await page.mouse.move(x, y);
  await page.mouse.down();
  await page.mouse.move(x, y + dy, { steps: 6 });
  await page.mouse.up();
}

test.describe('resizable textareas', () => {
  test('a converter textarea resizes vertically and owns the pane height', async ({ page }) => {
    await page.goto(BASE64);
    const input = page.locator('#base64-encoder-decoder-input');
    await expect(input).toBeVisible();
    expect(await computed(input, 'resize')).toBe('vertical');

    // The panel no longer reserves a 280px box around a 224px textarea: the textarea is the
    // sized element, at least 5rem, and the panel hugs it.
    const ta = await heightOf(input);
    expect(ta).toBeGreaterThan(80);
    const panel = page.locator('.io-panel', { has: input }).first();
    expect(await computed(panel, 'max-height')).toBe('none');

    // The page never scrolls sideways because of a resizable field.
    const hscroll = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);
    expect(hscroll).toBe(false);
  });

  test('dragging grows the textarea and stops at 80vh', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name === 'pixel5', 'mouse drag on the native grip is a desktop affordance');
    await page.goto(BASE64);
    const input = page.locator('#base64-encoder-decoder-input');
    const before = await heightOf(input);
    await dragGrip(page, input, 60);
    const grown = await heightOf(input);
    expect(grown).toBeGreaterThan(before + 30);

    await dragGrip(page, input, 3000);
    const viewportH = page.viewportSize()!.height;
    expect(await heightOf(input)).toBeLessThanOrEqual(Math.ceil(viewportH * 0.8) + 1);
  });

  test('a widget --io-pane-h now sets the textarea height', async ({ page }) => {
    // Prompt Packer declares --io-pane-h: 4.5rem, which the old 280px panel floor ignored.
    // Below the 5rem minimum, so the field opens at 5rem (80px).
    await page.goto('/tool/prep/prompt-packer/');
    const task = page.locator('#pp-task');
    await expect(task).toBeVisible();
    expect(Math.round(await heightOf(task))).toBe(80);
    expect(await computed(task, 'resize')).toBe('vertical');

    // Chat Export Cleaner declares 8rem (128px).
    await page.goto('/tool/prep/chat-export-cleaner/');
    expect(Math.round(await heightOf(page.locator('#cc-in')))).toBe(128);
  });

  test('an <output> pane opens as tall as the textarea beside it on desktop', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name === 'pixel5', 'panes stack below 1024px');
    await page.goto(JSON_FORMATTER);
    const input = page.locator('#json-formatter-input');
    const inPanel = page.locator('.io-panel', { has: input }).first();
    const outPanel = page.locator('.io-panel:has(> output)').first();
    await expect(outPanel).toBeVisible();
    expect(Math.abs((await heightOf(inPanel)) - (await heightOf(outPanel)))).toBeLessThanOrEqual(2);
  });

  test('deliberate fixed boxes keep resize: none', async ({ page }) => {
    // JSON Tree Viewer: the pane is the fixed box; the input fills it.
    await page.goto('/tool/developer-utilities/json-tree-viewer/');
    const jtv = page.locator('#json-tree-viewer-input');
    await expect(jtv).toBeVisible();
    expect(await computed(jtv, 'resize')).toBe('none');
    const jtvPanel = page.locator('.jtv-io', { has: jtv }).first();
    // The textarea still fits inside its fixed pane (no overflow past the pane bottom).
    const tb = (await jtv.boundingBox())!;
    const pb = (await jtvPanel.boundingBox())!;
    expect(tb.y + tb.height).toBeLessThanOrEqual(pb.y + pb.height + 1);

    // Text Repeater: fixed box with internal scroll, by design.
    await page.goto('/tool/text/text-repeater/');
    expect(await computed(page.locator('#rep-input'), 'resize')).toBe('none');
    expect(await computed(page.locator('#rep-output'), 'resize')).toBe('none');
  });
});
