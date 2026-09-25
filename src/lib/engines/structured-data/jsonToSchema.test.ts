import { describe, expect, it } from 'vitest';
import { jsonToSchema } from './jsonToSchema';

function schema(input: string): unknown {
  const result = jsonToSchema.execute(input);
  expect(result.ok, result.error).toBe(true);
  return JSON.parse(result.output);
}

describe('jsonToSchema', () => {
  it('records string, integer, number, boolean, and null', () => {
    expect(schema('{"name":"Atharva","age":30,"score":1.5,"active":true,"note":null}')).toEqual({
      type: 'object',
      properties: {
        name: { type: 'string' },
        age: { type: 'integer' },
        score: { type: 'number' },
        active: { type: 'boolean' },
        note: { type: 'null' },
      },
    });
  });

  it('nests objects and leaves an empty array without items', () => {
    expect(schema('{"user":{"name":"A"},"tags":[]}')).toEqual({
      type: 'object',
      properties: {
        user: { type: 'object', properties: { name: { type: 'string' } } },
        tags: { type: 'array' },
      },
    });
  });

  it('uses one item schema when every element matches', () => {
    expect(schema('[1, 2, 3]')).toEqual({
      type: 'array',
      items: { type: 'integer' },
    });
  });

  it('unions mixed array types and does not merge different object shapes', () => {
    expect(schema('["a", 1, true]')).toEqual({
      type: 'array',
      items: { type: ['boolean', 'integer', 'string'] },
    });
    expect(schema('[{"a":1},{"b":"x"}]')).toEqual({
      type: 'array',
      items: { type: 'object' },
    });
  });

  it('does not mark fields required or invent a format', () => {
    const out = schema('{"name":"Atharva"}') as { required?: unknown; properties: { name: { format?: unknown } } };
    expect(out.required).toBeUndefined();
    expect(out.properties.name.format).toBeUndefined();
  });

  it('rejects invalid JSON', () => {
    const result = jsonToSchema.execute('{bad');
    expect(result.ok).toBe(false);
    expect(result.error).toBeTruthy();
  });
});
