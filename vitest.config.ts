import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    include: ['src/**/*.test.ts'],
    coverage: {
      provider: 'v8',
      include: ['src/lib/**/*.ts'],
      exclude: [
        'src/lib/**/*.test.ts',
        'src/lib/**/*.testutil.ts',
        'src/lib/storage.ts',
        'src/lib/paths.ts',
        // boot.ts is the DOM orchestration layer (ResizeObserver / MutationObserver /
        // visibilitychange / pointer capture). Its behaviour is asserted by boot.test.ts
        // (happy-dom) and the Playwright physics suite in a real browser; the branchy
        // environment glue is not meaningfully measurable in vitest.
        'src/lib/simulation/boot.ts',
        // Pure canvas draw routines — exercised by the stub-context draw smoke and e2e.
        'src/lib/simulation/simulations/*.draw.ts',
      ],
      reporter: ['text', 'html', 'json-summary'],
      thresholds: {
        lines: 90,
        functions: 90,
        branches: 85,
        statements: 90,
      },
    },
  },
  resolve: {
    alias: {
      '@lib': path.resolve(__dirname, 'src/lib'),
      '@config': path.resolve(__dirname, 'src/config'),
      '@data': path.resolve(__dirname, 'src/data'),
      '@tools': path.resolve(__dirname, 'src/tools'),
      '@components': path.resolve(__dirname, 'src/components'),
    },
  },
});
