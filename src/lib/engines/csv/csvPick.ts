// CSV Column Picker. Keeps named columns, or 1-based positions, and drops the rest.
// A semicolon or tab file is detected from the first non-empty line so a comma
// split does not collapse it. The notice is the guardrail for that switch, for
// a later duplicate header, and for a pick that will break if a column is inserted.

import type { CsvResult, CsvTool } from './types';
import { csvToMatrix, escapeCell } from '@lib/csv/csv';

const POSITION = /^[1-9]\d*$/;

const POSITION_NOTICE =
  'This pick is by position, so inserting a column changes which field is kept.';

const DUPLICATE_NOTICE = 'A later column with the same name was left behind.';

function firstNonEmptyLine(text: string): string {
  let line = '';
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (inQuotes) {
      line += ch;
      if (ch === '"') {
        if (text[i + 1] === '"') {
          line += '"';
          i++;
          continue;
        }
        inQuotes = false;
      }
      continue;
    }
    if (ch === '"') {
      inQuotes = true;
      line += ch;
      continue;
    }
    if (ch === '\n' || ch === '\r') {
      if (ch === '\r' && text[i + 1] === '\n') i++;
      if (line.trim() !== '') return line;
      line = '';
      continue;
    }
    line += ch;
  }
  return line.trim() !== '' ? line : '';
}

// Columns on one logical line. Delimiters inside quotes do not count.
function columnCount(line: string, delimiter: string): number {
  let count = 1;
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (inQuotes) {
      if (ch === '"') {
        if (line[i + 1] === '"') {
          i++;
          continue;
        }
        inQuotes = false;
      }
      continue;
    }
    if (ch === '"') {
      inQuotes = true;
      continue;
    }
    if (ch === delimiter) count++;
  }
  return count;
}

function detectDelimiter(text: string): ',' | ';' | '\t' {
  const line = firstNonEmptyLine(text);
  if (!line) return ',';
  const commas = columnCount(line, ',');
  const semis = columnCount(line, ';');
  const tabs = columnCount(line, '\t');
  if (commas === 1 && semis > 1) return ';';
  if (tabs > commas) return '\t';
  return ',';
}

function delimiterNotice(delimiter: string): string | undefined {
  if (delimiter === ';') {
    return 'The file was read as semicolon because a comma split it into one column.';
  }
  if (delimiter === '\t') {
    return 'The file was read as tab-separated because its first line has more tabs than commas.';
  }
  return undefined;
}

// The pick list is comma-separated. A name in double quotes may contain a comma ("a,b"), and a
// doubled quote inside it is one quote, as in CSV. Local to the picker: the shared csv.ts is not
// involved.
function pickTokens(second: string | undefined): string[] {
  if (!second || !second.trim()) return [];
  const out: string[] = [];
  let cur = '';
  let quoted = false;
  let inQuotes = false;
  for (let i = 0; i < second.length; i++) {
    const ch = second[i];
    if (inQuotes) {
      if (ch === '"' && second[i + 1] === '"') { cur += '"'; i++; }
      else if (ch === '"') inQuotes = false;
      else cur += ch;
      continue;
    }
    if (ch === '"' && cur.trim() === '' && !quoted) { cur = ''; inQuotes = true; quoted = true; continue; }
    if (ch === ',') { out.push(quoted ? cur : cur.trim()); cur = ''; quoted = false; continue; }
    if (quoted && ch.trim() === '') continue; // spaces after a closing quote
    cur += ch;
  }
  out.push(quoted ? cur : cur.trim());
  return out.filter(part => part.length > 0);
}

/** Larger input is refused before parsing, so a huge paste cannot block the page. */
export const MAX_PICK_CHARS = 10 * 1024 * 1024;

function serialize(matrix: string[][], delimiter: string): string {
  return matrix
    .map(row => row.map(cell => escapeCell(cell, delimiter)).join(delimiter))
    .join('\n');
}

function project(matrix: string[][], indexes: number[]): string[][] {
  return matrix.map(row => indexes.map(index => row[index] ?? ''));
}

function withNotice(result: CsvResult, notice: string | undefined): CsvResult {
  if (notice) result.notice = notice;
  return result;
}

export const csvPick: CsvTool = {
  id: 'csv-pick',
  family: 'select',
  inputs: 2,

  execute(raw, second) {
    // A UTF-8 byte order mark (Excel adds one) would otherwise stick to the first header, so
    // "id" could not be picked by name and a position pick would carry the mark along.
    const input = raw.replace(/^\uFEFF/, '');
    if (input.length > MAX_PICK_CHARS) {
      return {
        ok: false,
        output: '',
        error: 'This file is larger than 10 MB, which is too big to pick columns from in the browser. Try a smaller part of it.',
      };
    }
    const delimiter = detectDelimiter(input);
    const matrix = csvToMatrix(input, { delimiter });
    if (matrix.length === 0) {
      return { ok: false, output: '', error: 'Nothing to pick' };
    }

    const headers = matrix[0];
    const tokens = pickTokens(second);
    const switched = delimiterNotice(delimiter);

    if (tokens.length === 0) {
      return withNotice(
        {
          ok: true,
          output: serialize(matrix, delimiter),
          summary: `Headers: ${headers.join(', ')}`,
        },
        switched,
      );
    }

    if (tokens.every(token => POSITION.test(token))) {
      const indexes: number[] = [];
      for (const token of tokens) {
        const n = Number(token);
        if (!Number.isInteger(n) || n < 1 || n > headers.length) {
          return { ok: false, output: '', error: `No column ${token} in this file.` };
        }
        indexes.push(n - 1);
      }
      const labels = indexes.map(index => headers[index] || `column ${index + 1}`);
      const notice = [switched, POSITION_NOTICE].filter(Boolean).join(' ');
      return withNotice(
        {
          ok: true,
          output: serialize(project(matrix, indexes), delimiter),
          summary: `Kept ${labels.join(', ')}`,
        },
        notice,
      );
    }

    const indexes: number[] = [];
    let duplicate = false;
    // Headers are matched trimmed, as the typed names are, so "id, name" offers "name".
    const trimmed = headers.map(h => h.trim());
    for (const name of tokens) {
      const at = trimmed.indexOf(name);
      if (at < 0) {
        return { ok: false, output: '', error: `No column named "${name}".` };
      }
      if (trimmed.indexOf(name, at + 1) !== -1) duplicate = true;
      indexes.push(at);
    }
    const labels = indexes.map(index => headers[index]);
    const notice = [switched, duplicate ? DUPLICATE_NOTICE : undefined].filter(Boolean).join(' ');
    return withNotice(
      {
        ok: true,
        output: serialize(project(matrix, indexes), delimiter),
        summary: `Kept ${labels.join(', ')}`,
      },
      notice || undefined,
    );
  },
};
