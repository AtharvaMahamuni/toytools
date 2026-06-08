import type { StructuredDataTool } from './types';

// Strip all insignificant whitespace from JSON. Invalid JSON returns a result error.
export const jsonMinifier: StructuredDataTool = {
  id: 'json-minifier',
  family: 'json',
  execute: (input) => {
    if (!input.trim()) return { ok: true, output: '' };
    try {
      return { ok: true, output: JSON.stringify(JSON.parse(input)) };
    } catch (e) {
      return { ok: false, output: '', error: (e as Error).message };
    }
  },
};
