import type { StructuredDataTool } from './types';

// Types seen in one JSON example. No required fields, no formats, no guessed meaning.

type Schema = { type?: string | string[]; properties?: Record<string, Schema>; items?: Schema };

function schemaFor(value: unknown): Schema {
  if (value === null) return { type: 'null' };
  if (Array.isArray(value)) {
    if (value.length === 0) return { type: 'array' };
    return { type: 'array', items: mergeItems(value.map(schemaFor)) };
  }
  if (typeof value === 'string') return { type: 'string' };
  if (typeof value === 'number') return { type: Number.isInteger(value) ? 'integer' : 'number' };
  if (typeof value === 'boolean') return { type: 'boolean' };
  if (typeof value === 'object') return objectSchema(value as Record<string, unknown>);
  return {};
}

function objectSchema(value: Record<string, unknown>): Schema {
  const properties: Record<string, Schema> = {};
  for (const key of Object.keys(value)) properties[key] = schemaFor(value[key]);
  return { type: 'object', properties };
}

function mergeItems(schemas: Schema[]): Schema {
  const first = JSON.stringify(schemas[0]);
  if (schemas.every(schema => JSON.stringify(schema) === first)) return schemas[0]!;
  const types = [...new Set(schemas.map(schema => (
    Array.isArray(schema.type) ? schema.type.join('|') : schema.type ?? 'unknown'
  )))].sort();
  if (types.length === 1) return { type: schemas[0]!.type };
  return { type: types };
}

export const jsonToSchema: StructuredDataTool = {
  id: 'json-to-schema',
  family: 'json',
  jsonInput: true,
  execute: (input) => {
    if (!input.trim()) return { ok: true, output: '' };
    try {
      return { ok: true, output: JSON.stringify(schemaFor(JSON.parse(input)), null, 2) };
    } catch (e) {
      return { ok: false, output: '', error: (e as Error).message };
    }
  },
};
