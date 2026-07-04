import { defineConfig, devices } from '@playwright/test';

// Unified E2E config for the whole platform. The developer tools are the pilot
// deep suite; every tool gets generic smoke coverage for free (see tests/e2e/).
//
// `webServer` builds the production output and serves it, then waits — so a single
// `npm run test:e2e` is fully turnkey. E2E is a local/CI verification layer; it is
// deliberately NOT wired into `npm run build`.
//
// Mobile-first platform → both Desktop Chrome and Pixel 5 projects ship now, and
// helpers must locate by role/label (never desktop-only positions).
// Dedicated preview port (not Astro's default 4321) so E2E always exercises the
// production build and never collides with a running `astro dev` server.
const PORT = 4331;
const baseURL = `http://localhost:${PORT}`;

export default defineConfig({
  testDir: 'tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: [
    ['html', { open: 'never' }],
    ['list'],
    ['json', { outputFile: 'playwright-report/results.json' }],
  ],
  use: {
    baseURL,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    // Environments with a pre-installed Chromium outside Playwright's registry
    // (e.g. remote CI containers) point PW_CHROMIUM_PATH at it instead of downloading.
    ...(process.env.PW_CHROMIUM_PATH
      ? { launchOptions: { executablePath: process.env.PW_CHROMIUM_PATH } }
      : {}),
  },
  webServer: {
    // PUBLIC_E2E=true bakes the analytics opt-out into the build so Google
    // Analytics never loads during E2E (the runtime guard also excludes the
    // localhost host + navigator.webdriver, but this is the explicit signal).
    command: `PUBLIC_E2E=true npm run build && npm run preview -- --port ${PORT}`,
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'pixel5', use: { ...devices['Pixel 5'] } },
  ],
});
