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
        'src/lib/storage.ts',
        'src/lib/paths.ts',
        // Physics browser glue: canvas/DOM/rAF wiring covered by the Playwright physics
        // suite, not vitest. Model modules (simulations/*.ts) stay fully covered.
        'src/lib/engines/physics/boot.ts',
        'src/lib/engines/physics/canvas.ts',
        'src/lib/engines/physics/graph.ts',
        'src/lib/engines/physics/loader.ts',
        'src/lib/engines/physics/simulations/*.draw.ts',
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
