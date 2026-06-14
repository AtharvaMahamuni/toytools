import type { StructuredDataTool } from './types';

function escapeCell(value: unknown): string {
  const str =
    value === null || value === undefined ? ''
    : typeof value === 'object' ? JSON.stringify(value)
    : String(value);
  if (str.includes(',') || str.includes('"') || str.includes('\n') || str.includes('\r'))
    return '"' + str.replace(/"/g, '""') + '"';
  return str;
}

export const jsonToCsv: StructuredDataTool = {
  id: 'json-to-csv',
  family: 'json',
  execute: (input) => {
    if (!input.trim()) return { ok: true, output: '' };
    let parsed: unknown;
    try { parsed = JSON.parse(input); }
    catch (e) { return { ok: false, output: '', error: (e as Error).message }; }
    if (!Array.isArray(parsed))
      return { ok: false, output: '', error: 'Input must be a JSON array.' };
    if (parsed.length === 0)
      return { ok: false, output: '', error: 'Array is empty — nothing to convert.' };

    // Collect union of keys across all objects (handles sparse rows)
    const headers: string[] = [];
    const seen = new Set<string>();
    for (const row of parsed) {
      if (row !== null && typeof row === 'object' && !Array.isArray(row)) {
        for (const key of Object.keys(row as object))
          if (!seen.has(key)) { seen.add(key); headers.push(key); }
      }
    }

    // Array of primitives — single "value" column
    if (headers.length === 0)
      return { ok: true, output: ['value', ...(parsed as unknown[]).map(escapeCell)].join('\n') };

    const rows = [
      headers.map(escapeCell).join(','),
      ...(parsed as Record<string, unknown>[]).map(row =>
        headers.map(h => escapeCell(row[h])).join(',')
      ),
    ];
    return { ok: true, output: rows.join('\n') };
  },
};
