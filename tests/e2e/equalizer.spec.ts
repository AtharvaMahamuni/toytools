// The equalizer, driven the way somebody actually uses it.
//
// The engine's maths is unit-tested (src/lib/engines/audio/audio.test.ts). What that cannot prove
// is the part this tool lives or dies on: that a preset click moves seven controls and the picture
// with them, that a shared link reproduces somebody else's sound exactly, and that the preamp
// warning appears when the curve has grown teeth. All of it runs on Pixel 5 as well as desktop,
// because a phone is where music settings get changed.
import { test, expect } from '@playwright/test';

const TOOL = '/tool/music/equalizer-settings-generator/';
const BANDS = 7;

const sliders = (page: import('@playwright/test').Page) => page.locator('.eq-slider');

test.describe('music equalizer', () => {
  test('opens flat, with one control per band', async ({ page }) => {
    await page.goto(TOOL);
    await expect(sliders(page)).toHaveCount(BANDS);
    for (let i = 0; i < BANDS; i++) {
      await expect(sliders(page).nth(i)).toHaveValue('0');
    }
    await expect(page.locator('.eq-band-label').first()).toHaveText('60 Hz');
  });

  test('a goal loads a curve and says what it changed', async ({ page }) => {
    await page.goto(TOOL);
    const explain = page.locator('[data-eq-explain]');
    const before = await explain.textContent();

    await page.getByRole('button', { name: 'More Bass', exact: true }).click();

    // The controls moved, the ledger agrees with them, and the explanation is the preset's.
    await expect(sliders(page).first()).toHaveValue('6');
    await expect(page.locator('.eq-row-value').first()).toHaveText('+6 dB');
    await expect(explain).not.toHaveText(before ?? '');
    await expect(explain).toContainText('60 Hz');
  });

  test('the curve redraws when a preset is loaded', async ({ page }) => {
    await page.goto(TOOL);
    const line = page.locator('[data-eq-line]');
    const flat = await line.getAttribute('d');

    await page.getByRole('button', { name: 'More Detail', exact: true }).click();
    await expect
      .poll(async () => line.getAttribute('d'))
      .not.toBe(flat);
  });

  test('moving one band explains that band', async ({ page }) => {
    await page.goto(TOOL);
    await sliders(page).nth(4).fill('4');
    await sliders(page).nth(4).dispatchEvent('input');

    await expect(page.locator('[data-eq-explain]')).toContainText('2.4 kHz');
    await expect(page.locator('.eq-row-value').nth(4)).toHaveText('+4 dB');
  });

  test('a large boost raises the preamp guardrail, and trimming it clears it', async ({ page }) => {
    await page.goto(TOOL);
    const note = page.locator('[data-craft="eq-preamp-headroom"]');
    await expect(note).toBeHidden();

    await sliders(page).first().fill('10');
    await sliders(page).first().dispatchEvent('input');

    await expect(note).toBeVisible();
    await expect(note).toContainText('-10 dB');
    await expect(note).toContainText('clipping');

    await page.getByRole('button', { name: 'Trim boosts' }).click();
    await expect(sliders(page).first()).toHaveValue('6');
    await expect(note).not.toContainText('clipping');
  });

  test('settings sync to the address bar and a shared link reproduces them', async ({ page }) => {
    await page.goto(TOOL);
    await page.getByRole('button', { name: 'Clear Vocals', exact: true }).click();
    await expect(page).toHaveURL(/[?&]eq=-1_-2_-2_1_3_2_1/);

    // The recipient's view: a link with someone else's gains and their name for it.
    await page.goto(`${TOOL}?eq=5_0_-2_0_3_0_1&name=Podcast`);
    await expect(sliders(page).first()).toHaveValue('5');
    await expect(sliders(page).nth(2)).toHaveValue('-2');
    await expect(sliders(page).nth(4)).toHaveValue('3');
    await expect(page.locator('.eq-name')).toHaveValue('Podcast');
  });

  test('a mangled link opens flat instead of breaking the page', async ({ page }) => {
    await page.goto(`${TOOL}?eq=nonsense`);
    await expect(sliders(page)).toHaveCount(BANDS);
    await expect(sliders(page).first()).toHaveValue('0');
  });

  test('copy hands over the settings, the preamp and the caveat', async ({ page, context, browserName }) => {
    test.skip(browserName !== 'chromium', 'clipboard permissions are chromium-only here');
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    await page.goto(TOOL);
    await page.getByRole('button', { name: 'More Bass', exact: true }).click();
    await page.getByRole('button', { name: 'Copy settings' }).click();

    const text = await page.evaluate(() => navigator.clipboard.readText());
    expect(text).toContain('More Bass');
    expect(text).toContain('60 Hz');
    expect(text).toContain('+6 dB');
    expect(text).toContain('Preamp');
    expect(text).toContain('Equalizers vary by app and device');
  });

  test('the share image is a real PNG of the card size', async ({ page }) => {
    await page.goto(TOOL);
    await page.getByRole('button', { name: 'More Punch', exact: true }).click();

    // Drawn from the same state as the page, so the check is that the canvas path produces a
    // decodable image rather than that any particular pixel is right.
    const size = await page.evaluate(async () => {
      const TT = (window as unknown as { ToyTools: Record<string, any> }).ToyTools;
      const def = TT.eq.definition('music-eq-7');
      const card = TT.eq.card.size;
      const canvas = document.createElement('canvas');
      canvas.width = card.width;
      canvas.height = card.height;
      TT.eq.card.draw(canvas.getContext('2d'), {
        name: 'More Punch',
        labels: def.bands.map((b: { label: string }) => b.label),
        gains: [4, 1, -2, 0, 2, 1, 0],
        minGain: def.minGain,
        maxGain: def.maxGain,
        preamp: -4,
      });
      const url = canvas.toDataURL('image/png');
      const image = new Image();
      image.src = url;
      await image.decode();
      return { w: image.naturalWidth, h: image.naturalHeight, png: url.startsWith('data:image/png') };
    });
    expect(size).toEqual({ w: 1200, h: 675, png: true });
  });

  test('reset returns the EQ to flat and forgets the name', async ({ page }) => {
    await page.goto(`${TOOL}?eq=6_3_-1_0_0_0_1&name=Mine`);
    await expect(sliders(page).first()).toHaveValue('6');

    await page.getByRole('button', { name: 'Reset' }).click();
    await expect(sliders(page).first()).toHaveValue('0');
    await expect(page.locator('.eq-name')).toHaveValue('');
  });

  test('every band control is keyboard reachable and labelled', async ({ page }) => {
    await page.goto(TOOL);
    for (let i = 0; i < BANDS; i++) {
      const slider = sliders(page).nth(i);
      await expect(slider).toHaveAttribute('aria-label', /Hz|kHz/);
      await expect(slider).toHaveAttribute('aria-valuetext', /decibels/);
    }

    // Arrow keys are the whole keyboard story for a range input, so the value must actually move.
    await sliders(page).first().focus();
    await page.keyboard.press('ArrowUp');
    await expect(sliders(page).first()).toHaveValue('1');
  });

  test('the page never scrolls sideways on a phone', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'pixel5', 'geometry is asserted on the phone project');
    await page.goto(TOOL);
    await page.getByRole('button', { name: 'More Energy', exact: true }).click();

    const overflow = await page.evaluate(() =>
      document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    expect(overflow).toBeLessThanOrEqual(1);

    // Seven controls across a 393px viewport still have to be touchable.
    const box = await page.locator('.eq-slider').first().boundingBox();
    expect(box!.width).toBeGreaterThanOrEqual(40);
    expect(box!.height).toBeGreaterThanOrEqual(100);
  });
});
