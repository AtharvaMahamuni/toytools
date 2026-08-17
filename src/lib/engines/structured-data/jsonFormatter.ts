import type { StructuredDataTool } from './types';

// Pretty-print JSON with 2-space indentation. Invalid JSON returns a result error.
export const jsonFormatter: StructuredDataTool = {
  id: 'json-formatter',
  family: 'json',
  jsonInput: true,
  execute: (input) => {
    if (!input.trim()) return { ok: true, output: '' };
    try {
      return { ok: true, output: JSON.stringify(JSON.parse(input), null, 2) };
    } catch (e) {
      return { ok: false, output: '', error: (e as Error).message };
    }
  },
};
