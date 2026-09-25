// A small JSON Schema check. Keywords not listed in SUPPORTED are reported, not silently treated as passed.

export interface SchemaIssue {
  path: string;
  message: string;
}

export interface SchemaValidation {
  ok: boolean;
  errors: SchemaIssue[];
  unchecked: string[];
  /** Which pane failed to parse, when the failure is JSON syntax. */
  parseError?: string;
}

const SUPPORTED = new Set([
  'type', 'properties', 'required', 'items', 'additionalProperties', 'enum', 'const',
  'minimum', 'maximum', 'exclusiveMinimum', 'exclusiveMaximum',
  'minLength', 'maxLength', 'minItems', 'maxItems',
]);

type Schema = Record<string, unknown>;

function isSchema(value: unknown): value is Schema {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function pointer(path: string, key: string): string {
  return `${path}/${key.replace(/~/g, '~0').replace(/\//g, '~1')}`;
}

function typeOf(value: unknown): string {
  if (value === null) return 'null';
  if (Array.isArray(value)) return 'array';
  if (typeof value === 'number') return Number.isInteger(value) ? 'integer' : 'number';
  return typeof value;
}

function matchesType(value: unknown, expected: string): boolean {
  if (expected === 'integer') return typeof value === 'number' && Number.isInteger(value);
  if (expected === 'number') return typeof value === 'number';
  return typeOf(value) === expected;
}

function same(a: unknown, b: unknown): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}

function check(schema: Schema, data: unknown, path: string, errors: SchemaIssue[], unchecked: Set<string>): void {
  for (const key of Object.keys(schema)) {
    if (!SUPPORTED.has(key)) unchecked.add(key);
  }

  const declared = schema.type;
  if (typeof declared === 'string' && !matchesType(data, declared)) {
    errors.push({ path: path || '/', message: `Expected ${declared}, got ${typeOf(data)}.` });
    return;
  }
  if (Array.isArray(declared)) {
    const names = declared.filter((item): item is string => typeof item === 'string');
    if (!names.some(name => matchesType(data, name))) {
      errors.push({ path: path || '/', message: `Expected ${names.join(' or ')}, got ${typeOf(data)}.` });
      return;
    }
  }

  if ('const' in schema && !same(data, schema.const)) {
    errors.push({ path: path || '/', message: 'Value does not equal const.' });
  }
  if (Array.isArray(schema.enum) && !schema.enum.some(item => same(item, data))) {
    errors.push({ path: path || '/', message: 'Value is not in enum.' });
  }

  if (typeof data === 'number') {
    if (typeof schema.minimum === 'number' && data < schema.minimum) {
      errors.push({ path: path || '/', message: `Below minimum ${schema.minimum}.` });
    }
    if (typeof schema.maximum === 'number' && data > schema.maximum) {
      errors.push({ path: path || '/', message: `Above maximum ${schema.maximum}.` });
    }
    if (typeof schema.exclusiveMinimum === 'number' && data <= schema.exclusiveMinimum) {
      errors.push({ path: path || '/', message: `Not above exclusiveMinimum ${schema.exclusiveMinimum}.` });
    }
    if (typeof schema.exclusiveMaximum === 'number' && data >= schema.exclusiveMaximum) {
      errors.push({ path: path || '/', message: `Not below exclusiveMaximum ${schema.exclusiveMaximum}.` });
    }
  }

  if (typeof data === 'string') {
    if (typeof schema.minLength === 'number' && data.length < schema.minLength) {
      errors.push({ path: path || '/', message: `Shorter than minLength ${schema.minLength}.` });
    }
    if (typeof schema.maxLength === 'number' && data.length > schema.maxLength) {
      errors.push({ path: path || '/', message: `Longer than maxLength ${schema.maxLength}.` });
    }
  }

  if (Array.isArray(data)) {
    if (typeof schema.minItems === 'number' && data.length < schema.minItems) {
      errors.push({ path: path || '/', message: `Fewer than minItems ${schema.minItems}.` });
    }
    if (typeof schema.maxItems === 'number' && data.length > schema.maxItems) {
      errors.push({ path: path || '/', message: `More than maxItems ${schema.maxItems}.` });
    }
    if (Array.isArray(schema.items)) {
      unchecked.add('items');
      errors.push({ path: path || '/', message: 'Tuple items are not checked.' });
    } else if (isSchema(schema.items)) {
      data.forEach((item, index) => check(schema.items as Schema, item, `${path}/${index}`, errors, unchecked));
    }
  }

  if (isSchema(data)) {
    const properties = isSchema(schema.properties) ? schema.properties : null;
    if (Array.isArray(schema.required)) {
      for (const key of schema.required) {
        if (typeof key === 'string' && !Object.prototype.hasOwnProperty.call(data, key)) {
          errors.push({ path: pointer(path, key), message: 'Required property is missing.' });
        }
      }
    }
    if (properties) {
      for (const key of Object.keys(properties)) {
        if (Object.prototype.hasOwnProperty.call(data, key) && isSchema(properties[key])) {
          check(properties[key] as Schema, data[key], pointer(path, key), errors, unchecked);
        }
      }
    }
    const known = new Set(properties ? Object.keys(properties) : []);
    const extra = Object.keys(data).filter(key => !known.has(key));
    if (schema.additionalProperties === false) {
      for (const key of extra) errors.push({ path: pointer(path, key), message: 'Additional property is not allowed.' });
    } else if (isSchema(schema.additionalProperties)) {
      for (const key of extra) {
        check(schema.additionalProperties, data[key], pointer(path, key), errors, unchecked);
      }
    }
  }
}

export function validateJsonSchema(schemaText: string, dataText: string): SchemaValidation {
  if (!schemaText.trim() && !dataText.trim()) {
    return { ok: true, errors: [], unchecked: [] };
  }
  let schema: unknown;
  let data: unknown;
  try {
    schema = JSON.parse(schemaText);
  } catch (e) {
    return { ok: false, errors: [], unchecked: [], parseError: `Schema is not valid JSON. ${(e as Error).message}` };
  }
  try {
    data = JSON.parse(dataText);
  } catch (e) {
    return { ok: false, errors: [], unchecked: [], parseError: `Data is not valid JSON. ${(e as Error).message}` };
  }
  if (!isSchema(schema)) {
    return { ok: false, errors: [{ path: '/', message: 'Schema must be a JSON object.' }], unchecked: [] };
  }
  const errors: SchemaIssue[] = [];
  const unchecked = new Set<string>();
  check(schema, data, '', errors, unchecked);
  return { ok: errors.length === 0, errors, unchecked: [...unchecked].sort() };
}
