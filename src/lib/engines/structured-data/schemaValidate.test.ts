import { describe, expect, it } from 'vitest';
import { validateJsonSchema } from './schemaValidate';

const SCHEMA = JSON.stringify({
  type: 'object',
  properties: {
    name: { type: 'string', minLength: 1 },
    age: { type: 'integer', minimum: 0 },
    tags: { type: 'array', items: { type: 'string' } },
  },
  required: ['name'],
  additionalProperties: false,
});

describe('validateJsonSchema', () => {
  it('accepts data that matches', () => {
    const result = validateJsonSchema(SCHEMA, '{"name":"Ada","age":30,"tags":["a"]}');
    expect(result.ok).toBe(true);
    expect(result.errors).toEqual([]);
    expect(result.unchecked).toEqual([]);
  });

  it('names a missing required field and a wrong type', () => {
    const missing = validateJsonSchema(SCHEMA, '{"age":30}');
    expect(missing.ok).toBe(false);
    expect(missing.errors.some(error => error.path === '/name')).toBe(true);
    const wrong = validateJsonSchema(SCHEMA, '{"name":"Ada","age":"30"}');
    expect(wrong.errors.some(error => error.message.includes('integer'))).toBe(true);
  });

  it('reports a nested item failure and an extra property', () => {
    const nested = validateJsonSchema(SCHEMA, '{"name":"Ada","tags":["a", 1]}');
    expect(nested.errors.some(error => error.path === '/tags/1')).toBe(true);
    const extra = validateJsonSchema(SCHEMA, '{"name":"Ada","role":"admin"}');
    expect(extra.errors.some(error => error.path === '/role')).toBe(true);
  });

  it('reports invalid JSON on the pane that failed', () => {
    expect(validateJsonSchema('{', '{"a":1}').parseError).toContain('Schema is not valid JSON');
    expect(validateJsonSchema('{"type":"string"}', '{').parseError).toContain('Data is not valid JSON');
  });

  it('names a keyword it does not check', () => {
    const result = validateJsonSchema('{"type":"string","format":"email"}', '"ada@example.com"');
    expect(result.ok).toBe(true);
    expect(result.unchecked).toEqual(['format']);
  });

  it('stays quiet when both panes are empty', () => {
    expect(validateJsonSchema('  ', '').ok).toBe(true);
  });
});