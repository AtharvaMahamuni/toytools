import { test, expect } from '@playwright/test';
import { deflateSync } from 'node:zlib';

const CRC_TABLE = new Uint32Array(256);
for (let n = 0; n < 256; n++) {
  let c = n;
  for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  CRC_TABLE[n] = c;
}

function crc(buf: Buffer): Buffer {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) c = CRC_TABLE[(c ^ buf[i]!) & 0xff]! ^ (c >>> 8);
  const out = Buffer.alloc(4);
  out.writeUInt32BE((c ^ 0xffffffff) >>> 0, 0);
  return out;
}

function chunk(type: string, data: Buffer): Buffer {
  const body = Buffer.concat([Buffer.from(type), data]);
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  return Buffer.concat([len, body, crc(body)]);
}

/** A tiny uncompressed-filter PNG. Playwright feeds it to the file input. */
function png(width: number, height: number, paint: (x: number, y: number) => [number, number, number]): Buffer {
  const raw = Buffer.alloc((width * 4 + 1) * height);
  for (let y = 0; y < height; y++) {
    const row = y * (width * 4 + 1);
    raw[row] = 0;
    for (let x = 0; x < width; x++) {
      const [r, g, b] = paint(x, y);
      const i = row + 1 + x * 4;
      raw[i] = r;
      raw[i + 1] = g;
      raw[i + 2] = b;
      raw[i + 3] = 255;
    }
  }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8;
  ihdr[9] = 6;
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  return Buffer.concat([
    signature,
    chunk('IHDR', ihdr),
    chunk('IDAT', deflateSync(raw)),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}

test('a photo returns the logo red, its share, and CSS', async ({ page, context, browserName }) => {
  await page.goto('/tool/design/image-palette-extractor/');
  const list = page.locator('[data-craft="palette-pixel-share"]');
  await expect(list).toBeHidden();
  await expect(page.locator('#image-palette-extractor-gamut')).toBeHidden();

  const photo = png(10, 10, (x, y) => {
    const i = y * 10 + x;
    if (i >= 90) return [225, 6, 0];
    return [244, 244, 244];
  });
  await page.locator('#image-palette-extractor-file').setInputFiles({
    name: 'logo.png',
    mimeType: 'image/png',
    buffer: photo,
  });

  await expect(list).toBeVisible();
  await expect(list).toContainText('#e10600');
  await expect(list).toContainText('10%');
  await expect(page.locator('#image-palette-extractor-css')).toContainText('--palette-1');
  await expect(page.locator('#image-palette-extractor-gamut')).toBeHidden();

  test.skip(browserName !== 'chromium', 'clipboard permissions are chromium-only here');
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.locator('#image-palette-extractor-copy').click();
  const copied = await page.evaluate(() => navigator.clipboard.readText());
  expect(copied).toContain('#e10600');
  expect(copied).toContain('10%');
});

test('an empty file says the image could not be read', async ({ page }) => {
  await page.goto('/tool/design/image-palette-extractor/');
  await page.locator('#image-palette-extractor-file').setInputFiles({
    name: 'empty.png',
    mimeType: 'image/png',
    buffer: Buffer.alloc(0),
  });
  await expect(page.locator('#image-palette-extractor-error')).toContainText('could not be read');
  await expect(page.locator('[data-craft="palette-pixel-share"]')).toBeHidden();
});
