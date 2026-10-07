import type { StructuredDataTool } from './types';
import { duplicateKeyWarning, formatJsonLossless } from './losslessJson';

// Pretty-print JSON with 2-space indentation, losslessly: JSON.parse only validates (and supplies
// the error message), then the original tokens are re-indented, so big integers, 1.0, 1e5 and
// escapes stay exactly as written. A duplicate key is kept as written and reported as a warning.
export const jsonFormatter: StructuredDataTool = {
  id: 'json-formatter',
  family: 'json',
  jsonInput: true,
  execute: (input) => {
    if (!input.trim()) return { ok: true, output: '' };
    try {
      JSON.parse(input);
    } catch (e) {
      return { ok: false, output: '', error: (e as Error).message };
    }
    const { output, duplicates } = formatJsonLossless(input);
    const warning = duplicateKeyWarning(duplicates);
    return warning ? { ok: true, output, warning } : { ok: true, output };
  },
};
