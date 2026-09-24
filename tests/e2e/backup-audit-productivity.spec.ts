// Phase 3 backup audit: Notepad, Todo List, and Pomodoro Timer.
// Export/Import must be findable on the tool screen (Atharva hard rule) —
// never behind More about, Details, or menus — and must round-trip the
// real localStorage keys these tools use (toytools.* dot namespace).
import { test, expect, type Page } from '@playwright/test';

function guardConsole(page: Page): string[] {
  const errors: string[] = [];
  page.on('console', (m) => {
    if (m.type() === 'error') errors.push(m.text());
  });
  page.on('pageerror', (e) => errors.push(String(e)));
  return errors;
}

async function assertBackupVisible(page: Page, exportSel: string, importSel: string) {
  await expect(page.locator(exportSel)).toBeVisible();
  await expect(page.locator(importSel)).toBeVisible();
  await expect(page.locator(exportSel)).toBeInViewport();
  await expect(page.locator(importSel)).toBeInViewport();
}

test.describe('Notepad backup', () => {
  const URL = '/tool/productivity/notepad/';
  const KEY = 'toytools.notepad.note';

  test('Export/Import visible; JSON round-trips note', async ({ page }) => {
    const errors = guardConsole(page);
    await page.goto(URL);
    await page.locator('#notepad-input').waitFor();

    await assertBackupVisible(page, '#np-export', '#np-import-btn');

    await page.locator('#notepad-input').fill('Phase 3 backup note');
    await expect.poll(async () => page.evaluate((k) => localStorage.getItem(k), KEY)).toBe(
      'Phase 3 backup note',
    );

    const [download] = await Promise.all([
      page.waitForEvent('download'),
      page.locator('#np-export').click(),
    ]);
    expect(download.suggestedFilename()).toBe('notepad-backup.json');
    const fs = await import('node:fs/promises');
    const backup = await fs.readFile((await download.path())!, 'utf8');
    const parsed = JSON.parse(backup);
    expect(parsed.v).toBe(1);
    expect(parsed.note).toBe('Phase 3 backup note');

    await page.locator('#notepad-input').fill('');
    await page.evaluate((k) => localStorage.removeItem(k), KEY);
    await page.reload();
    await expect(page.locator('#notepad-input')).toHaveValue('');

    await page.locator('#np-import-btn').click();
    await expect(page.locator('#np-import-panel')).toBeVisible();
    await page.locator('#np-import-text').fill(backup);
    await page.locator('#np-import-run').click();
    await expect(page.locator('#np-import-msg')).toContainText('Imported note');
    await expect(page.locator('#notepad-input')).toHaveValue('Phase 3 backup note');

    await page.reload();
    await expect(page.locator('#notepad-input')).toHaveValue('Phase 3 backup note');
    expect(errors, errors.join('\n')).toEqual([]);
  });
});

test.describe('Todo List backup', () => {
  const URL = '/tool/productivity/todo-list/';
  const KEY = 'toytools.todo.tasks';

  test('Export/Import visible even with empty list; JSON round-trips tasks', async ({
    page,
  }) => {
    const errors = guardConsole(page);
    await page.goto(URL);
    await page.locator('#todo-new-task').waitFor();

    // Always visible — even when the progress footer is hidden (empty list).
    await assertBackupVisible(page, '#todo-export', '#todo-import-btn');
    await expect(page.locator('.todo-footer')).toBeHidden();

    await page.locator('#todo-new-task').fill('Buy milk');
    await page.locator('#todo-add-btn').click();
    await expect(page.locator('.todo-task')).toHaveCount(1);

    const [download] = await Promise.all([
      page.waitForEvent('download'),
      page.locator('#todo-export').click(),
    ]);
    expect(download.suggestedFilename()).toBe('todo-list-backup.json');
    const fs = await import('node:fs/promises');
    const backup = await fs.readFile((await download.path())!, 'utf8');
    const parsed = JSON.parse(backup);
    expect(parsed.v).toBe(1);
    expect(parsed.tasks).toHaveLength(1);
    expect(parsed.tasks[0].title).toBe('Buy milk');

    await page.evaluate((k) => localStorage.removeItem(k), KEY);
    await page.reload();
    await expect(page.locator('.todo-empty')).toBeVisible();
    await assertBackupVisible(page, '#todo-export', '#todo-import-btn');

    await page.locator('#todo-import-btn').click();
    await page.locator('#todo-import-text').fill(backup);
    await page.locator('#todo-import-run').click();
    await expect(page.locator('#todo-import-msg')).toContainText('Imported 1 task');
    await expect(page.locator('.todo-task')).toHaveCount(1);
    await expect(page.locator('.todo-task')).toContainText('Buy milk');

    await page.reload();
    await expect(page.locator('.todo-task')).toContainText('Buy milk');
    expect(errors, errors.join('\n')).toEqual([]);
  });
});

test.describe('Pomodoro Timer backup', () => {
  const URL = '/tool/productivity/pomodoro-timer/';
  const SETTINGS_KEY = 'toytools.pomodoro-timer.settings';
  const PREFS_KEY = 'toytools.pomodoro-timer.prefs';
  const STATS_KEY = 'toytools.pomodoro-timer.stats';

  test('Export/Import visible without opening Customize; round-trips keys', async ({
    page,
  }) => {
    const errors = guardConsole(page);
    await page.goto(URL);
    await page.locator('#pt-start').waitFor();

    // Not behind Customize ▾.
    await expect(page.locator('#pt-settings-panel')).toBeHidden();
    await assertBackupVisible(page, '#pt-export', '#pt-import-btn');

    await page.locator('#pt-settings-toggle').click();
    await expect(page.locator('#pt-settings-panel')).toBeVisible();
    await page.locator('#pt-focus-mins').fill('33');
    await page.locator('#pt-sound-toggle').check();
    // Blur / change to persist settings (widget listens on change).
    await page.locator('#pt-focus-mins').dispatchEvent('change');
    await page.locator('#pt-sound-toggle').dispatchEvent('change');

    await expect
      .poll(async () =>
        page.evaluate((k) => {
          const raw = localStorage.getItem(k);
          return raw ? JSON.parse(raw).focusMins : null;
        }, SETTINGS_KEY),
      )
      .toBe(33);

    const [download] = await Promise.all([
      page.waitForEvent('download'),
      page.locator('#pt-export').click(),
    ]);
    expect(download.suggestedFilename()).toBe('pomodoro-timer-backup.json');
    const fs = await import('node:fs/promises');
    const backup = await fs.readFile((await download.path())!, 'utf8');
    const parsed = JSON.parse(backup);
    expect(parsed.v).toBe(1);
    expect(parsed.settings.focusMins).toBe(33);
    expect(parsed.prefs.sound).toBe(true);
    expect(parsed.stats).toBeTruthy();
    expect(parsed.timerstate).toBeUndefined();

    await page.evaluate(
      ([sk, pk, stk]) => {
        localStorage.removeItem(sk);
        localStorage.removeItem(pk);
        localStorage.removeItem(stk);
      },
      [SETTINGS_KEY, PREFS_KEY, STATS_KEY],
    );
    await page.reload();
    await expect(page.locator('#pt-focus-mins')).toHaveValue('25');
    await assertBackupVisible(page, '#pt-export', '#pt-import-btn');

    await page.locator('#pt-import-btn').click();
    await page.locator('#pt-import-text').fill(backup);
    await page.locator('#pt-import-run').click();
    await expect(page.locator('#pt-import-msg')).toContainText('Imported settings');
    await expect(page.locator('#pt-focus-mins')).toHaveValue('33');
    await expect(page.locator('#pt-sound-toggle')).toBeChecked();

    await page.reload();
    await expect(page.locator('#pt-focus-mins')).toHaveValue('33');
    expect(errors, errors.join('\n')).toEqual([]);
  });
});


test.describe('Phase 4 mobile slim first screens', () => {
  test('Notepad: note + Export/Import primary; More tools folded', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'pixel5', 'phone slim first screen only');
    const errors = guardConsole(page);
    await page.goto('/tool/productivity/notepad/');
    await page.locator('#notepad-input').waitFor();

    await expect(page.locator('#notepad-paste')).toBeVisible();
    await expect(page.locator('#notepad-copy')).toBeVisible();
    await assertBackupVisible(page, '#np-export', '#np-import-btn');

    await expect(page.locator('#notepad-download')).toBeHidden();
    await expect(page.locator('#notepad-clear')).toBeHidden();
    await expect(page.locator('#notepad-fullscreen')).toBeHidden();

    await page.locator('#np-more-panel > summary').click();
    await expect(page.locator('#notepad-download')).toBeVisible();
    await expect(page.locator('#notepad-clear')).toBeVisible();
    await expect(page.locator('#np-export')).toBeVisible();

    expect(errors, errors.join('\n')).toEqual([]);
  });

  test('Todo: add + list + Export/Import primary; Focus tools folded', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'pixel5', 'phone slim first screen only');
    const errors = guardConsole(page);
    await page.goto('/tool/productivity/todo-list/');
    await page.locator('#todo-new-task').waitFor();

    await expect(page.locator('#todo-new-task')).toBeVisible();
    await assertBackupVisible(page, '#todo-export', '#todo-import-btn');

    await expect(page.locator('#todo-fullscreen')).toBeHidden();
    await expect(page.locator('#todo-distraction')).toBeHidden();
    await expect(page.locator('#todo-wake')).toBeHidden();

    await page.locator('#todo-focus-panel > summary').click();
    await expect(page.locator('#todo-fullscreen')).toBeVisible();
    await expect(page.locator('#todo-wake')).toBeVisible();
    await expect(page.locator('#todo-export')).toBeVisible();

    expect(errors, errors.join('\n')).toEqual([]);
  });
});
