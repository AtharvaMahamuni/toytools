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
      { term: 'Operation', detail: 'Re-indents the original tokens with 2 spaces; nothing is re-serialized' },
      { term: 'Data', detail: 'Unchanged: big integers, 1.0, 1e5 and string escapes stay exactly as written' },
      { term: 'Duplicate keys', detail: 'Kept as written, with a warning' },
      { term: 'Errors', detail: 'Reports the first syntax problem with its location' },
    ],
    sample: '{"name":"Ada","langs":["JS","TS"],"active":true}',
  },
  'json-minifier': {
    displayName: 'JSON Minifier',
    insight:
      'Minifying removes all insignificant whitespace to produce the smallest valid JSON, which reduces payload size for transfer and storage. The data is unchanged.',
    technical: [
      { term: 'Operation', detail: 'Copies the original tokens with no whitespace; nothing is re-serialized' },
      { term: 'Use', detail: 'Shrink request/response and stored payloads' },
      { term: 'Data', detail: 'Unchanged: big integers, 1.0, 1e5, string escapes and key order stay exactly as written' },
      { term: 'Duplicate keys', detail: 'Kept as written, with a warning' },
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
  'json-to-schema': {
    displayName: 'JSON to JSON Schema',
    insight:
      'The schema records JSON types seen in this example. A string stays a string: the page does not guess that it is a name, an email, or a required field.',
    technical: [
      { term: 'Input', detail: 'One JSON value' },
      { term: 'Types', detail: 'string, number, integer, boolean, null, object, array' },
      { term: 'Not inferred', detail: 'required, format, enum, or additionalProperties' },
      { term: 'Empty array', detail: 'type array, with no items schema' },
    ],
    sample: '{"name":"Atharva","age":30,"active":true}',
  },
  'sql-formatter': {
    displayName: 'SQL Formatter',
    insight:
      'Formatting uppercases SQL keywords and puts each major clause on its own line so a one-line query is readable. String literals, comments and identifiers stay exactly as typed.',
    technical: [
      { term: 'Operation', detail: 'Tokenize, uppercase keywords, indent clauses and parentheses' },
      { term: 'Dialects', detail: 'Everyday Postgres, MySQL and SQLite keywords' },
      { term: 'Preserved', detail: 'String literals, -- and /* */ comments, numbers, identifiers' },
      { term: 'Errors', detail: 'Unclosed quotes are reported; nothing is guessed' },
      { term: 'Privacy', detail: 'Runs in your browser; a password-like literal also raises a warning' },
    ],
    sample: "select u.id, u.name from users u join orders o on o.user_id = u.id where o.total > 100 order by o.created_at desc",
    inputLabel: 'SQL input',
    placeholder: 'Paste SQL here',
    downloadExt: '.sql',
  },
  'xml-formatter': {
    displayName: 'XML Formatter and Validator',
    insight:
      'Formatting re-indents well-formed XML so nested elements are readable. Validation uses the browser DOMParser and reports the first well-formedness error with a line when the browser provides one.',
    technical: [
      { term: 'Operation', detail: 'Parse with DOMParser, then serialize with 2-space indentation or minify' },
      { term: 'Validation', detail: 'Well-formedness only: matching tags, one root, legal names' },
      { term: 'Not checked', detail: 'DTD, XSD, or Schematron schemas' },
      { term: 'Preserved', detail: 'Element names, attributes, text, comments and CDATA' },
      { term: 'Privacy', detail: 'Runs in your browser; nothing leaves this tab' },
    ],
    sample: '<note><to>Ada</to><from>Grace</from><body>Hello</body></note>',
    inputLabel: 'XML input',
    placeholder: 'Paste XML here',
    downloadExt: '.xml',
  },
  'css-minifier': {
    displayName: 'CSS Minifier and Beautifier',
    insight:
      'Minifying removes comments and insignificant whitespace so stylesheets transfer smaller. Beautifying expands minified CSS with consistent indentation so you can read it again.',
    technical: [
      { term: 'Minify', detail: 'Drop comments and collapse whitespace outside strings and url()' },
      { term: 'Beautify', detail: 'Indent blocks with two spaces; keep string and url() contents' },
      { term: 'Safe', detail: 'Does not rewrite selectors, merge rules, or alter calc() math' },
      { term: 'Privacy', detail: 'Runs in your browser; nothing leaves this tab' },
    ],
    sample: 'body{margin:0;color:#333}/* note */.card{padding:1rem}',
    inputLabel: 'CSS input',
    placeholder: 'Paste CSS here',
    downloadExt: '.css',
  },
};

/** Educational info for a structured-data tool. Never throws; unknown ids return a stub. */
export function structuredInfo(id: string): StructuredInfo {
  return STRUCTURED_INFO[id] ?? { displayName: id };
}
