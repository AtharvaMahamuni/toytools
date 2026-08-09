// Structured-Data — educational metadata (insight / technical / example) per tool.
//
// Kept separate from the execute() implementations so the pure transform logic stays
// minimal, and so the shared widget can render the reusable EducationalInsight /
// TechnicalDetails / ExampleLoader blocks at build time (JS-free, indexable). Keyed by
// the same id used in the registry (a tool config's `processorId`). Never throws.

import type { TechnicalEntry } from '../transform/types';

export interface StructuredInfo {
  displayName: string;
  insight?: string | string[];
  technical?: TechnicalEntry[];
  sample?: string;
  /** Input pane label/placeholder — defaults suit the JSON-input tools. */
  inputLabel?: string;
  placeholder?: string;
  /** Download extension for the output (default '.json'). */
  downloadExt?: string;
}

const PRETTY_JSON = '{\n  "name": "Ada",\n  "langs": ["JS", "TS"],\n  "active": true\n}';
const ROWS_JSON = '[{"name":"Ada","age":36},{"name":"Linus","age":54}]';

const STRUCTURED_INFO: Record<string, StructuredInfo> = {
  'json-formatter': {
    displayName: 'JSON Formatter',
    insight:
      'Formatting (pretty-printing) adds consistent indentation and line breaks so JSON is easy to read and diff. It changes only whitespace, never the data itself.',
    technical: [
      { term: 'Standard', detail: 'RFC 8259 / ECMA-404' },
      { term: 'Operation', detail: 'Re-serializes with 2-space indentation' },
      { term: 'Data', detail: 'Unchanged: only whitespace is added' },
      { term: 'Errors', detail: 'Reports the first syntax problem with its location' },
    ],
    sample: '{"name":"Ada","langs":["JS","TS"],"active":true}',
  },
  'json-minifier': {
    displayName: 'JSON Minifier',
    insight:
      'Minifying removes all insignificant whitespace to produce the smallest valid JSON, which reduces payload size for transfer and storage. The data is unchanged.',
    technical: [
      { term: 'Operation', detail: 'Re-serializes with no whitespace' },
      { term: 'Use', detail: 'Shrink request/response and stored payloads' },
      { term: 'Data', detail: 'Unchanged: re-format any time to restore readability' },
    ],
    sample: PRETTY_JSON,
  },
  'json-validator': {
    displayName: 'JSON Validator',
    insight:
      'Validation parses the input and reports whether it is well-formed JSON, pinpointing the first syntax error. It checks structure and syntax, not your schema.',
    technical: [
      { term: 'Standard', detail: 'RFC 8259 / ECMA-404' },
      { term: 'Checks', detail: 'Syntax and structure' },
      { term: 'Does not check', detail: 'Your schema, types, or required fields' },
      { term: 'Output', detail: 'Valid, or the first error and where it occurs' },
    ],
    sample: '{"name":"Ada","langs":["JS","TS"],"active":true}',
  },
  'json-to-csv': {
    displayName: 'JSON to CSV',
    insight:
      'Converts an array of flat JSON objects into CSV rows, using the object keys as the header row. Nested values are stringified so each cell stays a single field.',
    technical: [
      { term: 'Input', detail: 'An array of objects with consistent keys' },
      { term: 'Header', detail: 'Derived from the object keys' },
      { term: 'Nested values', detail: 'Stringified into a single cell' },
    ],
    sample: ROWS_JSON,
    downloadExt: '.csv',
  },
  'csv-to-json': {
    displayName: 'CSV to JSON',
    insight:
      'Converts CSV rows into an array of JSON objects, using the first (header) row as the keys. Useful for turning spreadsheet exports into API-ready data.',
    technical: [
      { term: 'Header', detail: 'First row becomes the object keys' },
      { term: 'Output', detail: 'An array of objects, one per data row' },
      { term: 'Values', detail: 'Read as strings unless clearly numeric' },
    ],
    sample: 'name,age\nAda,36\nLinus,54',
    inputLabel: 'CSV input',
    placeholder: 'Paste CSV here',
  },
  'json-to-yaml': {
    displayName: 'JSON to YAML',
    insight:
      'Converts JSON into YAML, a more human-readable superset often used for configuration files. The data is preserved; only the surface syntax changes.',
    technical: [
      { term: 'Operation', detail: 'Re-serializes the parsed JSON as YAML' },
      { term: 'Use', detail: 'Configuration files, CI pipelines, manifests' },
      { term: 'Data', detail: 'Preserved: YAML is a superset of JSON' },
    ],
    sample: PRETTY_JSON,
    downloadExt: '.yaml',
  },
  'yaml-to-json': {
    displayName: 'YAML to JSON',
    insight:
      'Converts YAML configuration into JSON for APIs and tooling that expect JSON. Indentation in YAML maps to nesting in the resulting JSON.',
    technical: [
      { term: 'Operation', detail: 'Parses YAML and serializes it as JSON' },
      { term: 'Use', detail: 'Feed config into JSON-only APIs and tools' },
      { term: 'Indentation', detail: 'YAML nesting becomes JSON object/array nesting' },
    ],
    sample: 'name: Ada\nlangs:\n  - JS\n  - TS\nactive: true',
    inputLabel: 'YAML input',
    placeholder: 'Paste YAML here',
  },
};

/** Educational info for a structured-data tool. Never throws; unknown ids return a stub. */
export function structuredInfo(id: string): StructuredInfo {
  return STRUCTURED_INFO[id] ?? { displayName: id };
}
