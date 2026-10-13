// Bespoke CSV parser + serializer — pure TypeScript, no deps.
// Mirrors src/lib/json/yaml.ts: a small, never-throwing core that the structured-data
// engine and the converter widgets share. Follows RFC 4180 quoting rules.
import { LosslessInt, isUnsafeIntLiteral } from '@lib/json/losslessInt';

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

/** A quoted field that never closes. Thrown by the tokenizer, turned into a result error by callers. */
export class CsvQuoteError extends Error {
  constructor(public line: number) {
    super(`Line ${line} opens a quote that is never closed, so the rest of the file would be read as one cell. Close the quote, or remove it.`);
    this.name = 'CsvQuoteError';
  }
}

// Tokenize CSV text into a matrix of raw string cells. Handles quoted fields with
// embedded delimiters, newlines (CRLF or LF), and escaped quotes (""). A quote only opens a
// quoted field at the start of a field; one in the middle (27" wide) is a literal character,
// as spreadsheets read it. An unterminated quoted field throws CsvQuoteError instead of
// silently swallowing the rest of the file.
function tokenize(text: string, delimiter: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = '';
  let inQuotes = false;
  let quoteLine = 0;
  let line = 1;
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
      if (ch === '\n') line++;
      field += ch; i++; continue;
    }
    if (ch === '"' && field === '') { inQuotes = true; quoteLine = line; started = true; i++; continue; }
    if (ch === delimiter) { endField(); i++; continue; }
    if (ch === '\r') { if (text[i + 1] === '\n') i++; endRow(); line++; i++; continue; }
    if (ch === '\n') { endRow(); line++; i++; continue; }
    field += ch; started = true; i++;
  }
  if (inQuotes) throw new CsvQuoteError(quoteLine);
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
    // Past 2^53 a number would be rounded, so the exact digits are kept instead.
    if (isUnsafeIntLiteral(s.replace(/^\+/, ''))) return new LosslessInt(s.replace(/^\+/, ''));
    const num = Number(s);
    if (Number.isFinite(num)) return num;
  }
  return s;
}

/**
 * Tokenize CSV text into its raw cell matrix, preserving ragged rows and extra cells
 * exactly as written (unlike parseCsv, which keys cells by header and drops overflow).
 * Fully-empty rows are dropped unless `keepEmptyRows` is set. Throws CsvQuoteError for an
 * unterminated quoted field (runCsv turns it into a result error); nothing else throws.
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
 * Make repeated column names unique so no column is overwritten: the second "x" becomes "x_2", the
 * third "x_3", skipping any name the file already uses.
 */
export function uniqueHeaders(names: string[]): string[] {
  const taken = new Set(names);
  const seen = new Set<string>();
  return names.map((name) => {
    if (!seen.has(name)) { seen.add(name); return name; }
    let k = 2;
    while (taken.has(`${name}_${k}`) || seen.has(`${name}_${k}`)) k++;
    const next = `${name}_${k}`;
    seen.add(next);
    return next;
  });
}

/**
 * Parse CSV text into rows of objects. Never throws — malformed input returns a
 * result with ok:false (or empty rows for blank input).
 */
export function parseCsv(text: string, opts: Partial<CsvParseOptions> = {}): CsvParseResult {
  const o: CsvParseOptions = { ...DEFAULT_CSV_PARSE_OPTIONS, ...opts };
  if (!text.trim()) return { ok: true, rows: [], headers: [] };

  // Drop fully-empty rows (blank lines / trailing newline artifacts).
  let matrix: string[][];
  try {
    matrix = tokenize(text, o.delimiter || ',').filter(r => !r.every(c => c === ''));
  } catch (e) {
    if (e instanceof CsvQuoteError) return { ok: false, rows: [], headers: [], error: e.message };
    throw e;
  }
  if (matrix.length === 0) return { ok: true, rows: [], headers: [] };

  const headers = uniqueHeaders(matrix[0].map(h => h.trim()));
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
