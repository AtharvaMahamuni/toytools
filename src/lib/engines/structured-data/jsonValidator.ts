import type { StructuredDataTool } from './types';
import { readClientI18n } from '@lib/i18n/client';

// Validate JSON syntax. Output is a human-readable status; the widget shows ✓/✗ from `ok`.
export const jsonValidator: StructuredDataTool = {
  id: 'json-validator',
  family: 'json',
  jsonInput: true,
  execute: (input) => {
    if (!input.trim()) return { ok: true, output: '' };
    const ei = (readClientI18n().engine ?? {}) as Record<string, any>;
    try {
      JSON.parse(input);
      return { ok: true, output: ei.validJsonOut ?? 'Valid JSON' };
    } catch (e) {
      return { ok: false, output: '', error: (e as Error).message };
    }
  },
};
