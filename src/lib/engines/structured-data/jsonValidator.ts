import type { StructuredDataTool } from './types';

// Validate JSON syntax. Output is a human-readable status; the widget shows ✓/✗ from `ok`.
export const jsonValidator: StructuredDataTool = {
  id: 'json-validator',
  family: 'json',
  jsonInput: true,
  execute: (input) => {
    if (!input.trim()) return { ok: true, output: '' };
    try {
      JSON.parse(input);
      return { ok: true, output: 'Valid JSON' };
    } catch (e) {
      return { ok: false, output: '', error: (e as Error).message };
    }
  },
};
