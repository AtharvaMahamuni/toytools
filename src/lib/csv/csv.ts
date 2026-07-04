// Bespoke CSV parser + serializer — pure TypeScript, no deps.
// Mirrors src/lib/json/yaml.ts: a small, never-throwing core that the structured-data
// engine and the converter widgets share. Follows RFC 4180 quoting rules.

export interface CsvParseOptions {
  /** Field delimiter. Default ','. */
  delimiter: string;
  /** Coerce numeric / boolean / null-looking cells into real JSON types. Default true. */
  smartTypes: boolean;
}

export const DEFAULT_CSV_PARSE_OPTIONS: CsvParseOptions = {
  delimiter: ',',
  smartTypes: true,
};

export interface CsvParseResult {
  ok: boolean;
  /** One object per data row, keyed by header. */
  rows: Record<string, unknown>[];
  /** Header names in source order. */
  headers: string[];
  error?: string;
}

// Tokenize CSV text into a matrix of raw string cells. Handles quoted fields with
// embedded delimiters, newlines (CRLF or LF), and escaped quotes ("").
function tokenize(text: string, delimiter: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = '';
  let inQuotes = false;
  let started = false; // true once the current row has any content
  const n = text.length;
  let i = 0;

  function endField() { row.push(field); field = ''; started = true; }
  function endRow() { endField(); rows.push(row); row = []; started = false; }

  while (i < n) {
    const ch = text[i];
    if (inQuotes) {
      if (ch === '"') {
        if (text[i + 1] === '"') { field += '"'; i += 2; continue; }
        inQuotes = false; i++; continue;
      }
      field += ch; i++; continue;
    }
    if (ch === '"') { inQuotes = true; started = true; i++; continue; }
    if (ch === delimiter) { endField(); i++; continue; }
    if (ch === '\r') { if (text[i + 1] === '\n') i++; endRow(); i++; continue; }
    if (ch === '\n') { endRow(); i++; continue; }
    field += ch; started = true; i++;
  }
  // Flush trailing field/row only if something was accumulated (avoids a phantom
  // empty row when the input ends with a newline).
  if (started || field !== '') endRow();
  return rows;
}

// Coerce a raw string cell into a typed value. Leading-zero numbers (e.g. "007",
// zip codes) and empty strings are intentionally left as strings.
function coerce(s: string): unknown {
  if (s === '') return '';
  if (s === 'true') return true;
  if (s === 'false') return false;
  if (s === 'null') return null;
  if (/^-?0\d/.test(s)) return s; // preserve leading zeros
  if (/^[-+]?(\d+\.?\d*|\.\d+)([eE][-+]?\d+)?$/.test(s)) {
    const num = Number(s);
    if (Number.isFinite(num)) return num;
  }
  return s;
}

/**
 * Tokenize CSV text into its raw cell matrix, preserving ragged rows and extra cells
 * exactly as written (unlike parseCsv, which keys cells by header and drops overflow).
 * Fully-empty rows are dropped unless `keepEmptyRows` is set. Never throws.
 */
export function csvToMatrix(
  text: string,
  opts: { delimiter?: string; keepEmptyRows?: boolean } = {},
): string[][] {
  if (!text.trim()) return [];
  const matrix = tokenize(text, opts.delimiter || ',');
  if (opts.keepEmptyRows) return matrix;
  return matrix.filter(r => !r.every(c => c === ''));
}

/**
 * Parse CSV text into rows of objects. Never throws — malformed input returns a
 * result with ok:false (or empty rows for blank input).
 */
export function parseCsv(text: string, opts: Partial<CsvParseOptions> = {}): CsvParseResult {
  const o: CsvParseOptions = { ...DEFAULT_CSV_PARSE_OPTIONS, ...opts };
  if (!text.trim()) return { ok: true, rows: [], headers: [] };

  // Drop fully-empty rows (blank lines / trailing newline artifacts).
  const matrix = tokenize(text, o.delimiter || ',').filter(r => !r.every(c => c === ''));
  if (matrix.length === 0) return { ok: true, rows: [], headers: [] };

  const headers = matrix[0].map(h => h.trim());
  const rows: Record<string, unknown>[] = [];
  for (let r = 1; r < matrix.length; r++) {
    const cells = matrix[r];
    const obj: Record<string, unknown> = {};
    for (let c = 0; c < headers.length; c++) {
      const raw = c < cells.length ? cells[c] : '';
      obj[headers[c]] = o.smartTypes ? coerce(raw) : raw;
    }
    rows.push(obj);
  }
  return { ok: true, rows, headers };
}

// Escape a single CSV cell, quoting when it contains the delimiter, a quote, or a newline.
export function escapeCell(value: unknown, delimiter = ','): string {
  if (value === null || value === undefined) return '';
  const str = typeof value === 'object' ? JSON.stringify(value) : String(value);
  if (str.indexOf(delimiter) !== -1 || str.indexOf('"') !== -1 || str.indexOf('\n') !== -1 || str.indexOf('\r') !== -1) {
    return '"' + str.replace(/"/g, '""') + '"';
  }
  return str;
}

/** Serialize rows (keyed by header) back to CSV text. */
export function serializeCsv(
  rows: Record<string, unknown>[],
  headers: string[],
  delimiter = ',',
): string {
  if (!headers.length) return '';
  const lines = [headers.map(h => escapeCell(h, delimiter)).join(delimiter)];
  for (const row of rows) {
    lines.push(headers.map(h => escapeCell(row[h], delimiter)).join(delimiter));
  }
  return lines.join('\n');
}

// Exposed on the ToyTools runtime global as ToyTools.csv (mirrors ToyTools.yaml).
export const csvSerializer = { parse: parseCsv, serialize: serializeCsv, escapeCell };
