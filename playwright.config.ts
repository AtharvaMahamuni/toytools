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
const PORT = 4321;
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
  },
  webServer: {
    command: 'npm run build && npm run preview',
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'pixel5', use: { ...devices['Pixel 5'] } },
  ],
});
