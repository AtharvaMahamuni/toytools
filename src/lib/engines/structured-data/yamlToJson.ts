import type { StructuredDataTool } from './types';
import jsYaml from 'js-yaml';

// JSON replacer that handles non-JSON-serializable values from YAML parsing
// (e.g., Date objects from !!timestamp, undefined from absent values).
function replacer(_key: string, value: unknown): unknown {
  if (value instanceof Date) return value.toISOString();
  if (value === undefined) return null;
  return value;
}

// Convert YAML to JSON (pretty-printed, 2-space indent).
export const yamlToJson: StructuredDataTool = {
  id: 'yaml-to-json',
  family: 'json',
  execute: (input) => {
    if (!input.trim()) return { ok: true, output: '' };
    let parsed: unknown;
    try {
      parsed = jsYaml.load(input);
    } catch (e) {
      return { ok: false, output: '', error: (e as Error).message };
    }
    if (parsed === undefined) return { ok: true, output: 'null' };
    try {
      return { ok: true, output: JSON.stringify(parsed, replacer, 2) };
    } catch (e) {
      return { ok: false, output: '', error: (e as Error).message };
    }
  },
};
