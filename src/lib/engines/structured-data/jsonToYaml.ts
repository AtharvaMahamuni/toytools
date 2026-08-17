import type { StructuredDataTool } from './types';
import { serializeToYaml, DEFAULT_YAML_OPTIONS } from '@lib/json/yaml';

// Convert JSON to YAML with default options (2-space indent, no sort, no marker).
export const jsonToYaml: StructuredDataTool = {
  id: 'json-to-yaml',
  family: 'json',
  jsonInput: true,
  execute: (input) => {
    if (!input.trim()) return { ok: true, output: '' };
    let parsed: unknown;
    try { parsed = JSON.parse(input); }
    catch (e) { return { ok: false, output: '', error: (e as Error).message }; }
    try {
      return { ok: true, output: serializeToYaml(parsed, DEFAULT_YAML_OPTIONS) };
    } catch (e) {
      return { ok: false, output: '', error: (e as Error).message };
    }
  },
};
