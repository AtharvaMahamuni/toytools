import type { StructuredDataTool } from './types';
import { duplicateKeyWarning, formatJsonLossless } from './losslessJson';

// Strip all insignificant whitespace from JSON, losslessly: JSON.parse only validates (and supplies
// the error message), then the original tokens are copied with no whitespace between them, so big
// integers, 1.0, 1e5, string escapes and key order stay exactly as written. A duplicate key is kept
// as written and reported as a warning. Invalid JSON returns a result error.
export const jsonMinifier: StructuredDataTool = {
  id: 'json-minifier',
  family: 'json',
  jsonInput: true,
  execute: (input) => {
    if (!input.trim()) return { ok: true, output: '' };
    try {
      JSON.parse(input);
    } catch (e) {
      return { ok: false, output: '', error: (e as Error).message };
    }
    const { output, duplicates } = formatJsonLossless(input, '');
    const warning = duplicateKeyWarning(duplicates);
    return warning ? { ok: true, output, warning } : { ok: true, output };
  },
};
