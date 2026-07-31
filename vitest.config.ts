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
        // Deferred-runtime glue, same rationale as boot.ts: index.ts is DOM lookup + dynamic
        // import orchestration and platform.ts is gtag/service-worker registration — both only
        // mean anything in a browser, and both are exercised by the Playwright suite (every spec
        // waits on the ToyTools global these files populate). The parts with real logic are NOT
        // excluded and are unit-tested: transform.ts (provider dispatch + neutral fallbacks) and
        // loaders.ts (the two maps).
        'src/lib/runtime/index.ts',
        'src/lib/runtime/platform.ts',
        // One-line attach modules — `TT.x = engineFn`. No branches, nothing to assert beyond the
        // maps in loaders.ts, which loaders.test.ts already walks (it imports every one of these
        // and asserts the attach export).
        'src/lib/runtime/engines/*.ts',
        'src/lib/runtime/experience.ts',
        'src/lib/runtime/viz.ts',
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
