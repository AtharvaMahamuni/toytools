import type { StructuredDataTool } from './types';
import { formatJsonLossless } from './losslessJson';

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
    if (!duplicates.length) return { ok: true, output };
    const names = duplicates.map((k) => JSON.stringify(k)).join(', ');
    return {
      ok: true,
      output,
      warning: `Duplicate key${duplicates.length > 1 ? 's' : ''} ${names}: kept as written here, but most JSON parsers keep only the last value.`,
    };
  },
};
