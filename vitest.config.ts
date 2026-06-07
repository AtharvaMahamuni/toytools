import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    include: ['src/**/*.test.ts'],
  },
  resolve: {
    alias: {
      '@lib': path.resolve(__dirname, 'src/lib'),
      '@data': path.resolve(__dirname, 'src/data'),
      '@tools': path.resolve(__dirname, 'src/tools'),
      '@components': path.resolve(__dirname, 'src/components'),
    },
  },
});
