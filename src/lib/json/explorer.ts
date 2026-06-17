// JSON Explorer Core — the reusable engine behind the JSON tree viewer (and future
// JSON tools: Compare, Schema Generator, JSONPath Tester, Flatten).
//
// Pure, framework-free, never-throwing. It parses JSON once into an addressable AST of
// JsonNodes (each carrying its dot path AND JSONPath), then derives structure stats and
// runs path-aware search over that single tree. Widgets consume it through the
// ToyTools.json.* runtime global; nothing here touches the DOM.

export type JsonType = 'object' | 'array' | 'string' | 'number' | 'boolean' | 'null';

export interface JsonNode {
  /** Object key (string), array index (number), or null for the root. */
  key: string | number | null;
  type: JsonType;
  /** The actual parsed value — primitive, object, or array (used for copy-value). */
  value: unknown;
  /** Dot/bracket access path, e.g. `data.users[0].name` ('' for root). */
  path: string;
  /** JSONPath, e.g. `$.data.users[0].name` ('$' for root). */
  jsonPath: string;
  /** Nesting depth — root is 0. */
  depth: number;
  parent: JsonNode | null;
  /** Empty for leaves. */
  children: JsonNode[];
}

export interface ParseResult {
  ok: boolean;
  ast?: JsonNode;
  error?: string;
  /** 1-based line/column of a syntax error, when derivable from the parser message. */
  errorPos?: { line: number; col: number };
}

export interface JsonStats {
  /** Byte length of the canonical (minified) JSON. */
  sizeBytes: number;
  /** Maximum nesting depth. */
  depth: number;
  /** Total object-member keys across the document. */
  keys: number;
  objects: number;
  arrays: number;
  /** Primitive nodes (string/number/boolean/null). */
  leaves: number;
  /** Total nodes incl. root and containers — drives the large-payload render guard. */
  nodes: number;
}

export interface SearchOptions {
  /** Match against keys and paths (default true). */
  keys?: boolean;
  /** Match against primitive values (default true). */
  values?: boolean;
}

function typeOf(v: unknown): JsonType {
  if (v === null) return 'null';
  if (Array.isArray(v)) return 'array';
  const t = typeof v;
  if (t === 'object') return 'object';
  if (t === 'number') return 'number';
  if (t === 'boolean') return 'boolean';
  return 'string';
}

// A key usable as a bare `.key` accessor — otherwise we fall back to bracket notation.
function isIdentifier(key: string): boolean {
  return /^[A-Za-z_$][A-Za-z0-9_$]*$/.test(key);
}

function childDotPath(parentPath: string, key: string): string {
  if (isIdentifier(key)) return parentPath ? `${parentPath}.${key}` : key;
  const esc = key.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
  return `${parentPath}["${esc}"]`;
}

function childJsonPath(parentJsonPath: string, key: string): string {
  if (isIdentifier(key)) return `${parentJsonPath}.${key}`;
  const esc = key.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
  return `${parentJsonPath}['${esc}']`;
}

function byteLength(s: string): number {
  try {
    return new TextEncoder().encode(s).length;
  } catch (_) {
    return s.length;
  }
}

function build(
  key: string | number | null,
  value: unknown,
  parent: JsonNode | null,
  depth: number,
  path: string,
  jsonPath: string,
): JsonNode {
  const type = typeOf(value);
  const node: JsonNode = { key, type, value, path, jsonPath, depth, parent, children: [] };
  if (type === 'object') {
    const obj = value as Record<string, unknown>;
    for (const k of Object.keys(obj)) {
      node.children.push(
        build(k, obj[k], node, depth + 1, childDotPath(path, k), childJsonPath(jsonPath, k)),
      );
    }
  } else if (type === 'array') {
    const arr = value as unknown[];
    for (let i = 0; i < arr.length; i++) {
      node.children.push(build(i, arr[i], node, depth + 1, `${path}[${i}]`, `${jsonPath}[${i}]`));
    }
  }
  return node;
}

function positionFromError(msg: string, input: string): { line: number; col: number } | undefined {
  const m = /position (\d+)/.exec(msg);
  if (!m) return undefined;
  const pos = Number(m[1]);
  let line = 1;
  let col = 1;
  for (let i = 0; i < pos && i < input.length; i++) {
    if (input[i] === '\n') {
      line++;
      col = 1;
    } else {
      col++;
    }
  }
  return { line, col };
}

function parse(input: string): ParseResult {
  if (!input || !input.trim()) return { ok: false, error: 'Empty input' };
  let value: unknown;
  try {
    value = JSON.parse(input);
  } catch (e) {
    const msg = (e as Error).message;
    return { ok: false, error: msg, errorPos: positionFromError(msg, input) };
  }
  return { ok: true, ast: build(null, value, null, 0, '', '$') };
}

function stats(ast: JsonNode): JsonStats {
  let objects = 0;
  let arrays = 0;
  let leaves = 0;
  let keys = 0;
  let nodes = 0;
  let maxDepth = 0;
  (function walk(n: JsonNode) {
    nodes++;
    if (n.depth > maxDepth) maxDepth = n.depth;
    if (n.type === 'object') objects++;
    else if (n.type === 'array') arrays++;
    else leaves++;
    if (n.parent && n.parent.type === 'object') keys++;
    for (const c of n.children) walk(c);
  })(ast);
  return { sizeBytes: byteLength(JSON.stringify(ast.value)), depth: maxDepth, keys, objects, arrays, leaves, nodes };
}

// Pre-order (document-order) walk so matches return in the order they appear — which the
// UI relies on for "Match N of M" Prev/Next navigation.
function search(ast: JsonNode, query: string, opts: SearchOptions = {}): JsonNode[] {
  const q = (query || '').toLowerCase();
  if (!q) return [];
  const matchKeys = opts.keys !== false;
  const matchValues = opts.values !== false;
  const out: JsonNode[] = [];
  (function walk(n: JsonNode) {
    let hit = false;
    if (matchKeys) {
      if (n.key !== null && String(n.key).toLowerCase().includes(q)) hit = true;
      if (!hit && n.path && n.path.toLowerCase().includes(q)) hit = true;
    }
    if (!hit && matchValues && n.type !== 'object' && n.type !== 'array') {
      const v = n.type === 'null' ? 'null' : String(n.value);
      if (v.toLowerCase().includes(q)) hit = true;
    }
    if (hit) out.push(n);
    for (const c of n.children) walk(c);
  })(ast);
  return out;
}

export const jsonExplorer = { parse, stats, search };
export type JsonExplorer = typeof jsonExplorer;
