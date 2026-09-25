import { test, expect, type Page } from '@playwright/test';

const SENTINEL = 'tt-sentinel-prep-9f3a';

function watchInput(page: Page): void {
  page.on('request', request => {
    const blob = `${request.url()}\n${request.postData() ?? ''}`;
    expect(blob, request.url()).not.toContain(SENTINEL);
  });
}

test.describe('prep for a model', () => {
  test('category says ToyTools does not run a model', async ({ page }) => {
    await page.goto('/category/prep/');
    await expect(page.locator('h1')).toHaveText('Prep for a model');
    await expect(page.locator('main')).toContainText('ToyTools does not run a model');
    await expect(page.locator('main')).toContainText('Prompt Packer');
  });

  test('prompt packer assembles a task and does not upload it', async ({ page }) => {
    watchInput(page);
    await page.goto('/tool/prep/prompt-packer/');
    await page.locator('#pp-task').fill(`Explain ${SENTINEL}.`);
    await expect(page.locator('#pp-out')).toHaveValue(`## Task\n\nExplain ${SENTINEL}.`);
    await expect(page.locator('#pp-omit')).toContainText('Left out:');
  });

  test('chat cleaner strips a speaker label', async ({ page }) => {
    watchInput(page);
    await page.goto('/tool/prep/chat-export-cleaner/');
    await page.locator('#cc-in').fill(`User: ${SENTINEL}\n\nAssistant: ok`);
    await expect(page.locator('#cc-out')).toHaveValue(`${SENTINEL}\n\nok`);
  });

  test('json to schema records types', async ({ page }) => {
    watchInput(page);
    await page.goto('/tool/prep/json-to-schema/');
    await page.locator('#json-to-schema-input').fill(`{"name":"${SENTINEL}","age":30,"active":true}`);
    const output = page.locator('#json-to-schema-output');
    await expect(output).toContainText('"type": "string"');
    await expect(output).toContainText('"type": "integer"');
    await expect(output).not.toContainText('required');
  });

  test('schema validator accepts a match and rejects bad JSON', async ({ page }) => {
    watchInput(page);
    await page.goto('/tool/prep/json-schema-validator/');
    await page.locator('#sv-schema').fill('{"type":"object","required":["name"],"properties":{"name":{"type":"string"}}}');
    await page.locator('#sv-data').fill(`{"name":"${SENTINEL}"}`);
    await expect(page.locator('#sv-status')).toContainText('Valid');
    await page.locator('#sv-data').fill('{');
    await expect(page.locator('#sv-status')).toContainText('Data is not valid JSON');
  });

  test('context fit labels the result as an estimate', async ({ page }) => {
    watchInput(page);
    await page.goto('/tool/prep/context-fit-checker/');
    await expect(page.locator('#cf-warn')).toContainText('estimate');
    await page.locator('#cf-text').fill(SENTINEL);
    await expect(page.locator('#cf-tokens')).not.toHaveText('0');
    await expect(page.locator('#cf-status')).toHaveText('Fits');
    await expect(page.locator('#cf-source')).toContainText('https://');
  });

  test('llms.txt generator writes a title and a tool link', async ({ page }) => {
    watchInput(page);
    await page.goto('/tool/prep/llms-txt-generator/');
    await page.locator('#lg-name').fill(SENTINEL);
    await page.locator('#lg-url').fill('https://ada.example/');
    await page.locator('#lg-purpose').fill('Small tools.');
    await page.locator('#lg-pages').fill('Formatter | /format/');
    await expect(page.locator('#lg-out')).toHaveValue(new RegExp(`# ${SENTINEL}`));
    await expect(page.locator('#lg-out')).toHaveValue(/- \[Formatter\]\(https:\/\/ada\.example\/format\/\)/);
    await expect(page.locator('#lg-omit')).toContainText('Left out:');
  });
});
