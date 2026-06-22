// Bespoke JSON→YAML serializer — pure TypeScript, no deps.
// Handles all JSON value types with smart quoting, literal block scalars for multi-line
// strings, and four user-controllable options.

// Key ordering for object maps: keep insertion order, or sort A→Z / Z→A.
export type SortKeys = 'none' | 'asc' | 'desc';

export interface YamlOptions {
  indent: 2 | 4;
  sortKeys: SortKeys;
  docMarker: boolean;  // prepend "---\n"
  flowScalars: boolean; // render scalar-only arrays as flow style [a, b, c]
}

export const DEFAULT_YAML_OPTIONS: YamlOptions = {
  indent: 2,
  sortKeys: 'none',
  docMarker: false,
  flowScalars: false,
};

// Order an object's keys per the sortKeys option. 'none' preserves insertion order.
function orderKeys(keys: string[], mode: SortKeys): string[] {
  if (mode === 'asc') return keys.slice().sort();
  if (mode === 'desc') return keys.slice().sort().reverse();
  return keys;
}

// YAML reserved words that must be quoted when used as plain scalars.
const RESERVED = new Set([
  'true', 'false', 'null', 'yes', 'no', 'on', 'off', '~',
  'True', 'False', 'Null', 'Yes', 'No', 'On', 'Off',
  'TRUE', 'FALSE', 'NULL', 'YES', 'NO', 'ON', 'OFF',
]);

// Determine whether a string value needs quoting.
function needsQuote(s: string): boolean {
  if (s === '') return true;
  if (RESERVED.has(s)) return true;
  // Looks like a number (integer, float, scientific notation)
  if (/^[-+]?(\d+\.?\d*|\.\d+)([eE][-+]?\d+)?$/.test(s)) return true;
  // Hex or octal literals
  if (/^0[xX][0-9a-fA-F]+$/.test(s)) return true;
  if (/^0o[0-7]+$/.test(s)) return true;
  // Starts/ends with whitespace
  if (/^\s|\s$/.test(s)) return true;
  // Contains characters with special meaning in YAML
  if (/[:{}\[\]#&*!|>'"%@`,?]/.test(s)) return true;
  // Inline comment trigger or key-value separator
  if (s.includes(': ') || s.includes(' #')) return true;
  // Block sequence or mapping indicator at start
  if (/^[-?] /.test(s) || s === '-' || s === '?') return true;
  return false;
}

// Double-quote a string, escaping control characters.
function doubleQuote(s: string): string {
  return '"' + s
    .replace(/\\/g, '\\\\')
    .replace(/"/g, '\\"')
    .replace(/\n/g, '\\n')
    .replace(/\r/g, '\\r')
    .replace(/\t/g, '\\t')
    .replace(/[\x00-\x1f]/g, c => '\\u' + c.charCodeAt(0).toString(16).padStart(4, '0'))
    + '"';
}

// Serialize a key, quoting if necessary.
function yamlKey(k: string): string {
  return needsQuote(k) ? doubleQuote(k) : k;
}

// Serialize a scalar string value.
function yamlString(s: string, contentDepth: number, indent: number): string {
  if (s.includes('\n')) {
    // Literal block scalar (|). Content lines are indented at contentDepth.
    const pad = ' '.repeat(contentDepth * indent);
    const lines = s.split('\n');
    const trailingNewline = lines[lines.length - 1] === '';
    const body = trailingNewline ? lines.slice(0, -1) : lines;
    const chomping = trailingNewline ? '' : '-'; // |- strips final newline
    return `|${chomping}\n${body.map(l => pad + l).join('\n')}`;
  }
  return needsQuote(s) ? doubleQuote(s) : s;
}

// Returns true when every element of the array is a non-null scalar.
function isScalarArray(arr: unknown[]): boolean {
  return arr.every(v => v === null || typeof v !== 'object');
}

// Serialize a flow-style array of scalars: [val, val, ...]
function flowArray(arr: unknown[]): string {
  const items = arr.map(v => {
    if (v === null || v === undefined) return 'null';
    if (typeof v === 'boolean') return String(v);
    if (typeof v === 'number') return Number.isFinite(v) ? String(v) : 'null';
    if (typeof v === 'string') return needsQuote(v) ? doubleQuote(v) : v;
    return String(v);
  });
  return '[' + items.join(', ') + ']';
}

/**
 * Serialize `value` to YAML.
 * `depth` = how many indent-levels the output lines should be prefixed with.
 * Returns the multi-line YAML string (no trailing newline).
 */
function serializeNode(value: unknown, depth: number, opts: YamlOptions): string {
  const pad = ' '.repeat(depth * opts.indent);

  // Scalars
  if (value === null || value === undefined) return 'null';
  if (typeof value === 'boolean') return value ? 'true' : 'false';
  if (typeof value === 'number') return Number.isFinite(value) ? String(value) : 'null';
  if (typeof value === 'string') return yamlString(value, depth + 1, opts.indent);

  // Arrays
  if (Array.isArray(value)) {
    if (value.length === 0) return '[]';
    if (opts.flowScalars && isScalarArray(value)) return flowArray(value);

    const items: string[] = [];
    for (const item of value) {
      if (item !== null && typeof item === 'object' && !Array.isArray(item)) {
        // Object item: inline first key with '- ', rest aligned underneath
        const obj = item as Record<string, unknown>;
        const keys = orderKeys(Object.keys(obj), opts.sortKeys);
        if (keys.length === 0) {
          items.push(`${pad}- {}`);
          continue;
        }
        const lines: string[] = [];
        let first = true;
        for (const k of keys) {
          const kStr = yamlKey(k);
          const v = obj[k];
          // First key: `- key:` or `- key: val`; rest: `  key:` or `  key: val`
          const linePrefix = first ? `${pad}- ` : `${pad}  `;
          first = false;
          if (v !== null && typeof v === 'object') {
            const isEmptyArr = Array.isArray(v) && (v as unknown[]).length === 0;
            const isEmptyObj = !Array.isArray(v) && Object.keys(v as object).length === 0;
            if (isEmptyArr) {
              lines.push(`${linePrefix}${kStr}: []`);
            } else if (isEmptyObj) {
              lines.push(`${linePrefix}${kStr}: {}`);
            } else if (Array.isArray(v) && opts.flowScalars && isScalarArray(v as unknown[])) {
              lines.push(`${linePrefix}${kStr}: ${flowArray(v as unknown[])}`);
            } else {
              lines.push(`${linePrefix}${kStr}:`);
              lines.push(serializeNode(v, depth + 1, opts));
            }
          } else if (typeof v === 'string' && v.includes('\n')) {
            lines.push(`${linePrefix}${kStr}: ${yamlString(v, depth + 2, opts.indent)}`);
          } else {
            const scalar = serializeNode(v, depth + 1, opts);
            lines.push(`${linePrefix}${kStr}: ${scalar}`);
          }
        }
        items.push(lines.join('\n'));
      } else if (Array.isArray(item)) {
        // Array of arrays
        if ((item as unknown[]).length === 0) {
          items.push(`${pad}- []`);
        } else {
          items.push(`${pad}-`);
          items.push(serializeNode(item, depth + 1, opts));
        }
      } else {
        // Scalar item
        if (typeof item === 'string' && item.includes('\n')) {
          items.push(`${pad}- ${yamlString(item, depth + 2, opts.indent)}`);
        } else {
          items.push(`${pad}- ${serializeNode(item, depth, opts)}`);
        }
      }
    }
    return items.join('\n');
  }

  // Object (mapping)
  const obj = value as Record<string, unknown>;
  const keys = orderKeys(Object.keys(obj), opts.sortKeys);
  if (keys.length === 0) return '{}';

  const lines: string[] = [];
  for (const k of keys) {
    const kStr = yamlKey(k);
    const v = obj[k];

    if (v !== null && typeof v === 'object') {
      const isEmptyArr = Array.isArray(v) && (v as unknown[]).length === 0;
      const isEmptyObj = !Array.isArray(v) && Object.keys(v as object).length === 0;
      if (isEmptyArr) {
        lines.push(`${pad}${kStr}: []`);
      } else if (isEmptyObj) {
        lines.push(`${pad}${kStr}: {}`);
      } else if (Array.isArray(v) && opts.flowScalars && isScalarArray(v as unknown[])) {
        lines.push(`${pad}${kStr}: ${flowArray(v as unknown[])}`);
      } else {
        lines.push(`${pad}${kStr}:`);
        lines.push(serializeNode(v, depth + 1, opts));
      }
    } else if (typeof v === 'string' && v.includes('\n')) {
      // Literal block — indicator goes on key line, content indented at depth+1
      lines.push(`${pad}${kStr}: ${yamlString(v, depth + 1, opts.indent)}`);
    } else {
      lines.push(`${pad}${kStr}: ${serializeNode(v, depth, opts)}`);
    }
  }
  return lines.join('\n');
}

export function serializeToYaml(value: unknown, opts: Partial<YamlOptions> = {}): string {
  const options: YamlOptions = { ...DEFAULT_YAML_OPTIONS, ...opts };
  const body = serializeNode(value, 0, options);
  return options.docMarker ? `---\n${body}` : body;
}

export const yamlSerializer = { serialize: serializeToYaml };
