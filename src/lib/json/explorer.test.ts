import { describe, it, expect } from 'vitest';
import { jsonExplorer, type JsonNode } from './explorer';

const { parse, stats, search } = jsonExplorer;

// Collect nodes in document order for assertions.
function flatten(ast: JsonNode): JsonNode[] {
  const out: JsonNode[] = [];
  (function walk(n: JsonNode) {
    out.push(n);
    n.children.forEach(walk);
  })(ast);
  return out;
}

function nodeByPath(ast: JsonNode, path: string): JsonNode | undefined {
  return flatten(ast).find((n) => n.path === path);
}

describe('parse', () => {
  it('rejects empty input', () => {
    expect(parse('   ')).toEqual({ ok: false, error: 'Empty input' });
  });

  it('reports invalid JSON with an error and best-effort position', () => {
    const r = parse('{"a": }');
    expect(r.ok).toBe(false);
    expect(r.error).toBeTruthy();
    expect(r.ast).toBeUndefined();
  });

  it('derives a 1-based line/col from a positional parser error', () => {
    const r = parse('{\n  "a": 1,\n  "b":\n}');
    expect(r.ok).toBe(false);
    if (r.errorPos) {
      expect(r.errorPos.line).toBeGreaterThanOrEqual(1);
      expect(r.errorPos.col).toBeGreaterThanOrEqual(1);
    }
  });

  it('builds a root node with null key and $ json path', () => {
    const r = parse('{"a":1}');
    expect(r.ok).toBe(true);
    expect(r.ast!.key).toBeNull();
    expect(r.ast!.type).toBe('object');
    expect(r.ast!.path).toBe('');
    expect(r.ast!.jsonPath).toBe('$');
    expect(r.ast!.depth).toBe(0);
  });

  it('classifies every primitive type', () => {
    const ast = parse('{"s":"x","n":1,"b":true,"z":null}').ast!;
    expect(nodeByPath(ast, 's')!.type).toBe('string');
    expect(nodeByPath(ast, 'n')!.type).toBe('number');
    expect(nodeByPath(ast, 'b')!.type).toBe('boolean');
    expect(nodeByPath(ast, 'z')!.type).toBe('null');
  });
});

describe('path building', () => {
  const ast = parse('{"data":{"users":[{"name":"Alice"}]}}').ast!;

  it('uses dot notation for identifier keys and [i] for array indices', () => {
    const leaf = nodeByPath(ast, 'data.users[0].name')!;
    expect(leaf).toBeDefined();
    expect(leaf.value).toBe('Alice');
    expect(leaf.jsonPath).toBe('$.data.users[0].name');
  });

  it('falls back to bracket notation for non-identifier keys', () => {
    const r = parse('{"first name":1,"weird.key":2}');
    const paths = flatten(r.ast!).map((n) => n.path);
    expect(paths).toContain('["first name"]');
    expect(paths).toContain('["weird.key"]');
    const jsonPaths = flatten(r.ast!).map((n) => n.jsonPath);
    expect(jsonPaths).toContain("$['first name']");
  });

  it('tracks parent and depth', () => {
    const leaf = nodeByPath(ast, 'data.users[0].name')!;
    expect(leaf.depth).toBe(4);
    expect(leaf.parent!.type).toBe('object');
    expect(leaf.parent!.parent!.type).toBe('array');
  });
});

describe('stats', () => {
  it('counts containers, leaves, keys, depth and nodes', () => {
    const ast = parse('{"a":[1,2,{"x":true}],"b":null}').ast!;
    const s = stats(ast);
    // nodes: root + a(array) + 1 + 2 + {x}(object) + x(true) + b(null) = 7
    expect(s.nodes).toBe(7);
    expect(s.objects).toBe(2); // root + {x}
    expect(s.arrays).toBe(1); // a
    expect(s.leaves).toBe(4); // 1, 2, true, null
    expect(s.keys).toBe(3); // a, b, x (object members)
    expect(s.depth).toBe(3); // root->a->{x}->x
    expect(s.sizeBytes).toBeGreaterThan(0);
  });

  it('handles a primitive root', () => {
    const s = stats(parse('42').ast!);
    expect(s.nodes).toBe(1);
    expect(s.leaves).toBe(1);
    expect(s.depth).toBe(0);
    expect(s.keys).toBe(0);
  });
});

describe('search', () => {
  const ast = parse('{"user":{"name":"John","city":"NYC"},"admin":{"name":"Jane"}}').ast!;

  it('returns [] for an empty query', () => {
    expect(search(ast, '')).toEqual([]);
  });

  it('matches keys and values, in document order', () => {
    const hits = search(ast, 'name');
    // both `name` keys, document order: user.name then admin.name
    expect(hits.map((n) => n.path)).toEqual(['user.name', 'admin.name']);
  });

  it('matches values when keys do not', () => {
    const hits = search(ast, 'john');
    expect(hits).toHaveLength(1);
    expect(hits[0].path).toBe('user.name');
  });

  it('is path-aware (matches full paths, not just leaf keys)', () => {
    const hits = search(ast, 'admin', { values: false });
    expect(hits.some((n) => n.path.startsWith('admin'))).toBe(true);
  });

  it('can restrict to keys only', () => {
    expect(search(ast, 'nyc', { values: false })).toHaveLength(0);
    expect(search(ast, 'nyc', { values: true })).toHaveLength(1);
  });
});
