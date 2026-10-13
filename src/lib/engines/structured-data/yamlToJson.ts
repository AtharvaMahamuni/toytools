import type { StructuredDataTool } from './types';
import jsYaml from 'js-yaml';
import { LosslessInt, stringifyLossless } from '@lib/json/losslessInt';

// js-yaml reads every integer as a JavaScript number, which rounds past 2^53. This int type has the
// same tag, so it replaces the built-in one, and keeps an out-of-range integer as its exact digits.
const baseInt = jsYaml.types.int;
const losslessIntType = new jsYaml.Type('tag:yaml.org,2002:int', {
  kind: 'scalar',
  resolve: baseInt.resolve,
  construct: (data: string) => {
    const n = baseInt.construct(data) as number;
    if (Number.isSafeInteger(n)) return n;
    const clean = data.replace(/_/g, '');
    const neg = clean.startsWith('-');
    try {
      return new LosslessInt((neg ? '-' : '') + BigInt(clean.replace(/^[-+]/, '')).toString());
    } catch {
      return n;
    }
  },
  predicate: baseInt.predicate,
  represent: baseInt.represent as never,
  defaultStyle: baseInt.defaultStyle,
});
const LOSSLESS_SCHEMA = jsYaml.DEFAULT_SCHEMA.extend({ implicit: [losslessIntType] });

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
      parsed = jsYaml.load(input, { schema: LOSSLESS_SCHEMA });
    } catch (e) {
      return { ok: false, output: '', error: (e as Error).message };
    }
    if (parsed === undefined) return { ok: true, output: 'null' };
    try {
      return { ok: true, output: stringifyLossless(parsed, 2, replacer) };
    } catch (e) {
      return { ok: false, output: '', error: (e as Error).message };
    }
  },
};
