import { test, expect } from '@playwright/test';

test('default 5000 groups 2 times 1999 then 1002 under the caution', async ({ page }) => {
  await page.goto('/tool/finance/upi-1999-split/');
  const caution = page.locator('[data-craft="upi-split-meme"]');
  await expect(caution).toBeVisible();
  await expect(caution).toContainText('For fun only');
  await expect(caution).toContainText('Do not use this for that');
  await expect(page.locator('#upi-1999-split-hero')).toHaveText('2 × ₹1,999, then ₹1,002', { timeout: 15000 });
  await expect(page.getByRole('button', { name: '5,000' })).toHaveClass(/is-active/);
  const result = page.locator('#upi-1999-split-experience');
  await expect(result).toContainText('3 payments');
  await expect(result).toContainText('The parts sum to ₹5,000.');
  await expect(result).toContainText('does not owe a 2000 rupee UPI tax');
  await expect(result).not.toContainText('Payment 1');
});

test('2000 is one payment and nothing to split', async ({ page }) => {
  await page.goto('/tool/finance/upi-1999-split/');
  await expect(page.locator('#upi-1999-split-hero')).toHaveText('2 × ₹1,999, then ₹1,002', { timeout: 15000 });
  await page.locator('#upi-1999-split-f-amount').evaluate((el) => {
    const input = el as HTMLInputElement;
    input.value = '2000';
    input.setAttribute('data-raw', '2000');
    input.dispatchEvent(new Event('input', { bubbles: true }));
  });
  await expect(page.locator('#upi-1999-split-hero')).toHaveText('One payment of ₹2,000. Nothing to split.');
  await expect(page.locator('#upi-1999-split-experience')).not.toContainText('Payment 1');
});

const NEXT = '#upi-1999-split-next';
const VPA = '#upi-1999-split-vpa';
const LINK = '#upi-1999-split-link';
const BOX = '#upi-1999-split-done';

async function ready(page: import('@playwright/test').Page) {
  await page.goto('/tool/finance/upi-1999-split/');
  await expect(page.locator('#upi-1999-split-hero')).toHaveText('2 × ₹1,999, then ₹1,002', { timeout: 15000 });
  await expect(page.locator(NEXT)).toHaveText('Payment 1 of 3 · ₹1,999');
}

test('empty or invalid UPI ID builds no link', async ({ page }) => {
  await ready(page);
  await expect(page.locator('a[href^="upi://"]')).toHaveCount(0);
  await expect(page.locator('#upi-1999-split-vpa-msg')).toBeHidden();
  await page.locator(VPA).fill('not-a-vpa');
  await expect(page.locator('#upi-1999-split-vpa-msg')).toContainText('name@handle');
  await expect(page.locator('a[href^="upi://"]')).toHaveCount(0);
  await page.locator(VPA).fill('');
  await expect(page.locator('#upi-1999-split-vpa-msg')).toBeHidden();
  await expect(page.locator('a[href^="upi://"]')).toHaveCount(0);
  await expect(page.locator('main')).toContainText('Runs entirely on your device. Nothing is uploaded.');
  await expect(page.locator('#upi-1999-split-experience')).toContainText('does not owe a 2000 rupee UPI tax');
});

test('one next chunk opens in a UPI app, and the tick is not a receipt', async ({ page }) => {
  await ready(page);
  await page.locator(VPA).fill('name@upi');
  const link = page.locator(LINK);
  await expect(link).toBeVisible();
  await expect(link).toHaveText('Open UPI app');
  const first = 'upi://pay?pa=name%40upi&am=1999&cu=INR&tn=Payment%201%20of%203';
  await expect(link).toHaveAttribute('href', first);
  expect(first).not.toMatch(/[?&](pn|tid|tr)=/);
  await expect(page.locator('a[href^="upi://"]')).toHaveCount(1);
  const wide = (page.viewportSize()?.width ?? 0) >= 1024;
  if (wide) await expect(page.locator('#upi-1999-split-phone')).toBeVisible();
  else await expect(page.locator('#upi-1999-split-phone')).toBeHidden();
  await expect(page.locator('label[for="upi-1999-split-done"]')).toContainText('your own tick');
  await expect(page.locator('label[for="upi-1999-split-done"]')).toContainText('not a receipt');

  await page.locator(BOX).click();
  await expect(page.locator(NEXT)).toHaveText('Payment 2 of 3 · ₹1,999');
  await expect(link).toHaveAttribute('href', 'upi://pay?pa=name%40upi&am=1999&cu=INR&tn=Payment%202%20of%203');
  await expect(page.locator('a[href^="upi://"]')).toHaveCount(1);

  await page.locator(BOX).click();
  await expect(page.locator(NEXT)).toHaveText('Payment 3 of 3 · ₹1,002');
  await expect(link).toHaveAttribute('href', 'upi://pay?pa=name%40upi&am=1002&cu=INR&tn=Payment%203%20of%203');

  await page.locator(BOX).click();
  await expect(page.locator('a[href^="upi://"]')).toHaveCount(0);
  await expect(page.locator(BOX)).toBeChecked();
  await expect(page.locator('#upi-1999-split-all')).toContainText('not a receipt');
  await expect(page.locator('main')).not.toContainText(/pay all/i);
  await expect(page.locator('main')).not.toContainText(/succeeded|payment successful/i);

  await page.locator(BOX).click();
  await expect(page.locator(NEXT)).toHaveText('Payment 3 of 3 · ₹1,002');
  await expect(link).toHaveAttribute('href', /am=1002/);
  await expect(page.locator(BOX)).not.toBeChecked();

  const stored = await page.evaluate(() => {
    const parts: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i) || '';
      parts.push(key + '=' + localStorage.getItem(key));
    }
    return parts.join('\n') + '\n' + location.href;
  });
  expect(stored).not.toContain('name@upi');
  expect(stored).not.toContain('name%40upi');
});

test('amount chips set the total', async ({ page }) => {
  await ready(page);
  await expect(page.getByRole('button', { name: '5,000' })).toHaveClass(/is-active/);
  await page.getByRole('button', { name: '10,000' }).click();
  await expect(page.locator('#upi-1999-split-hero')).toHaveText('5 × ₹1,999, then ₹5');
  await expect(page.getByRole('button', { name: '10,000' })).toHaveClass(/is-active/);
  await expect(page.getByRole('button', { name: '5,000' })).not.toHaveClass(/is-active/);
});

test('on a phone the amount field sits above the next-chunk payee', async ({ page }, info) => {
  test.skip(info.project.name !== 'pixel5', 'desktop keeps pay under the split, beside the amount');
  await ready(page);
  const vpa = await page.locator(VPA).boundingBox();
  const amount = await page.locator('#upi-1999-split-f-amount').boundingBox();
  const hero = await page.locator('#upi-1999-split-hero').boundingBox();
  expect(vpa, 'payee field should render').not.toBeNull();
  expect(amount, 'amount field should render').not.toBeNull();
  expect(hero, 'split line should render').not.toBeNull();
  expect(hero!.y).toBeLessThan(amount!.y);
  expect(amount!.y).toBeLessThan(vpa!.y);
});

test('on desktop the next-chunk payee sits with the split, beside the amount', async ({ page }, info) => {
  test.skip(info.project.name === 'pixel5', 'phone stacks the split, then the amount, then pay');
  await ready(page);
  const vpa = await page.locator(VPA).boundingBox();
  const amount = await page.locator('#upi-1999-split-f-amount').boundingBox();
  const hero = await page.locator('#upi-1999-split-hero').boundingBox();
  expect(vpa, 'payee field should render').not.toBeNull();
  expect(amount, 'amount field should render').not.toBeNull();
  expect(hero, 'split line should render').not.toBeNull();
  expect(vpa!.x).toBeGreaterThan(amount!.x);
  expect(vpa!.y).toBeGreaterThan(hero!.y);
});

test('a new total clears ticks, and 2000 is one payment', async ({ page }) => {
  await ready(page);
  await page.locator(VPA).fill('name@upi');
  await expect(page.locator(LINK)).toBeVisible();
  await page.locator(BOX).click();
  await expect(page.locator(NEXT)).toHaveText('Payment 2 of 3 · ₹1,999');
  await page.locator('#upi-1999-split-f-amount').evaluate((el) => {
    const input = el as HTMLInputElement;
    input.value = '2000';
    input.setAttribute('data-raw', '2000');
    input.dispatchEvent(new Event('input', { bubbles: true }));
  });
  await expect(page.locator('#upi-1999-split-hero')).toHaveText('One payment of ₹2,000. Nothing to split.');
  await expect(page.locator(NEXT)).toHaveText('Payment 1 of 1 · ₹2,000');
  await expect(page.locator(LINK)).toHaveAttribute('href', /am=2000/);
  await expect(page.locator('a[href^="upi://"]')).toHaveCount(1);
});
