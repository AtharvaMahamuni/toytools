// The URL lint (C3 spec item 4, tightened in C4): a tool, category or guide URL is built by
// src/lib/paths.ts and nowhere else. Call toolPath(), categoryPath(), guidePath() or urlFor()
// (or toolPathBySlug() from src/lib/tools/tool-link.ts in frontmatter) instead of spelling one.
//
// What fails, in any file under src/ outside the builder:
//   • a raw string that starts a /tool/, /category/ or /guide/ path, in any quoting: a template
//     literal (`/tool/${seg}/${slug}/`, `${base}/category/${slug}/`), a single- or double-quoted
//     string ('/tool/finance/x/', '/tool/' + seg + '/'), an attribute (href="/guide/a/b/");
//   • a split prefix: a string that is the prefix without its last slash ('/tool' + '/' + seg,
//     `${base}/category`) or without its first one ('tool/' + seg, `guide/${slug}`);
//   • an array join that spells the prefix: ['', 'tool', seg, slug, ''].join('/');
//   • an absolute ToyTools URL: 'https://toytoolsapp.com/tool/...'.
// Comments are skipped only where they are comments, by context:
//   • .ts/.tsx/.js/.mjs files, .astro frontmatter and .astro <script> blocks: whole-line //
//     comments, and /* */ blocks that open at the start of a line (or right after <script>);
//   • .astro <style> blocks: /* */ blocks the same way (// is not a CSS comment);
//   • .astro markup (everything else after the frontmatter): only <!-- --> comments. There,
//     //, /* */ and {/* */} are not treated as comments: // and /* */ are text that Astro renders
//     around a live link, and {/* */} is scanned too, so none of them is skipped as a comment.
// Which context a line is in comes from astroScan() below, which reads tags, attributes and
// expressions to their real ends (so a self-closing <script ... /> opens no block). Its self-tests
// pin each case, the generated test plants a link at the end of every real .astro file and after
// every place in it where the context changes, and the oracle test checks its regions against the
// Astro compiler's own parse of every real file.
// A line that starts with * is only skipped inside a real block comment, so a * line of code or
// markup is scanned like any other.
//
// OTHER_FILES is the one allowlist: files the builder cannot reach yet, each with its reason. It
// only shrinks. An allowlisted file that no longer has a hit fails too, so it cannot go stale.
import { describe, it, expect, beforeAll } from 'vitest';
// Astro's own compiler, installed with astro (the oracle test below parses with it).
import { parse } from '@astrojs/compiler';
import { execFileSync } from 'node:child_process';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { createRequire } from 'node:module';
import { join, relative, resolve } from 'node:path';

const ROOT = resolve(__dirname, '../..');
const SRC = join(ROOT, 'src');

/** The builder itself. */
const BUILDER = 'src/lib/paths.ts';

const OTHER_FILES: Record<string, string> = {
  // Client wire format: the palette chunk must not share a module with the engine bundles.
  // entry-url.test.ts pins entryUrl() to toolPath() for every tool.
  'src/lib/search/types.ts': 'palette chunk; pinned by src/lib/search/entry-url.test.ts',
  // Builds recent-tool links in an is:inline script, where no module can be imported.
  'src/pages/offline.astro': 'is:inline script builds the link by concatenation; no imports there',
  // Widgets are out of scope in this series (spec: do not refactor existing widgets). Each passes
  // its own fixed tool URL through withBase, so it is base-aware today.
  'src/tools/productivity/pomodoro-timer/Widget.astro': "widget, not refactored; withBase('/tool/productivity/pomodoro-timer/')",
  'src/tools/productivity/keep-screen-awake/Widget.astro': "widget, not refactored; withBase('/tool/productivity/keep-screen-awake/')",
  // Shared text widget: withBase('/tool/text/') rendered into a data attribute, and the inline
  // script's fallback for that attribute (inline scripts cannot import).
  'src/tools/_shared/TextProcessorWidget.astro': 'shared widget, not refactored; sibling prefix for an is:inline script',
};

const P = '(?:tool|category|guide)';
const Q = '[`\'"]';
const BASE = '(?:\\$\\{[^}`]*\\})?';
/** Every form the lint catches, by name, so the self-tests can pin each one on its own. */
const FORMS: Record<string, RegExp> = {
  // A string of any quoting that begins a path, optionally after one ${...} (a base).
  raw: new RegExp(`${Q}${BASE}\\/${P}\\/`),
  // The prefix without its last slash, closed right there: '/tool', `${base}/category`.
  splitEnd: new RegExp(`${Q}${BASE}\\/${P}${Q}`),
  // The prefix without its first slash, opening a string: 'tool/', `guide/${slug}`.
  splitStart: new RegExp(`${Q}${P}\\/`),
  // A one-line array holding the bare word, joined with '/'.
  arrayJoin: new RegExp(`\\[[^\\]]*${Q}${P}${Q}[^\\]]*\\]\\s*\\.join\\(\\s*${Q}\\/${Q}\\s*\\)`),
  // An absolute URL on the production host.
  absolute: new RegExp(`https?:\\/\\/(?:www\\.)?toytoolsapp\\.com\\/${P}\\/`),
};
const matchesAny = (line: string): boolean => Object.values(FORMS).some((re) => re.test(line));

/** An open /* block comment, carried from line to line within one JS or CSS context. */
interface BlockState {
  open: boolean;
}

/**
 * The code in one JS/TS (or, with lineComments false, CSS) segment: a /* block that opens at the
 * start of the segment is dropped up to its close, and so is a // line. A block that opens mid-line
 * is not tracked, so its later lines are scanned: that errs toward a false alarm.
 */
function stripScript(segment: string, block: BlockState, lineComments = true): string {
  let s = segment;
  for (;;) {
    if (block.open) {
      const end = s.indexOf('*/');
      if (end === -1) return '';
      s = s.slice(end + 2);
      block.open = false;
    }
    const open = /^\s*\/\*/.exec(s);
    if (!open) break;
    block.open = true;
    s = s.slice(open[0].length);
  }
  return lineComments && /^\s*\/\//.test(s) ? '' : s;
}

/** A .ts/.js source: every line is script. */
function scriptLines(source: string): Array<[number, string]> {
  const block: BlockState = { open: false };
  return source.split('\n').map((line, i): [number, string] => [i + 1, stripScript(line, block)]);
}

/**
 * Where a JS expression is: inside a string or template (quote), a comment, and how deep in braces.
 * Only used to find where an expression, an attribute value or the frontmatter really ends, so a
 * `}`, `>`, `<script` or `---` inside a string or comment does not move the context.
 */
interface JsState {
  depth: number;
  quote: string | null;
  comment: 'line' | 'block' | null;
  escape: boolean;
}
const js = (depth = 0): JsState => ({ depth, quote: null, comment: null, escape: false });

/** Advance a JsState over line[i]; returns how many characters it consumed (1 or 2). */
function jsStep(s: JsState, line: string, i: number): number {
  const ch = line[i]!;
  const next = line[i + 1];
  if (s.comment === 'line') return 1;
  if (s.comment === 'block') {
    if (ch === '*' && next === '/') {
      s.comment = null;
      return 2;
    }
    return 1;
  }
  if (s.quote) {
    if (s.escape) s.escape = false;
    else if (ch === '\\') s.escape = true;
    else if (ch === s.quote) s.quote = null;
    return 1;
  }
  if (ch === '/' && next === '/') s.comment = 'line';
  else if (ch === '/' && next === '*') {
    s.comment = 'block';
    return 2;
  } else if (ch === '"' || ch === "'" || ch === '`') s.quote = ch;
  else if (ch === '{') s.depth += 1;
  else if (ch === '}') s.depth -= 1;
  return 1;
}

/** End of a line: a // comment ends, and so does a '...' or "..." string (a template does not). */
function jsEndOfLine(s: JsState): void {
  if (s.comment === 'line') s.comment = null;
  if (s.quote === '"' || s.quote === "'") s.quote = null;
  s.escape = false;
}

/** What an .astro source is made of, as the scanner saw it. The oracle test compares this. */
interface AstroRegions {
  frontmatter: string | null;
  script: string[];
  style: string[];
  comment: string[];
}

type Mode = 'text' | 'tag' | 'expr' | 'comment' | 'script' | 'style';

/**
 * An .astro source, by context, as [lineNumber, scanned text] pairs plus the regions it found.
 *
 *   • Frontmatter: an opening `---` line (after any blank lines) up to the next `---` line that is
 *     not inside a string, template literal or comment. Scanned as script.
 *   • Markup: everything after it. Scanned as text, whole: line comments, slash-star blocks and
 *     brace-wrapped slash-star blocks are not comments there. Only `<!-- -->` is skipped.
 *   • A tag is read to its real end: `>` inside a quoted attribute or a `{...}` attribute
 *     expression does not end it, and neither does a line break. A tag that self-closes (`/>`),
 *     and any closing tag, never opens a block.
 *   • `{...}` expressions in markup are followed to their matching `}`, past strings and comments,
 *     so a `<script`, `<style` or `<!--` inside a string or comment there opens nothing. A
 *     `<script` or `<style` element where an operand goes (`{ok && <script>...</script>}`) is a
 *     real element, as the Astro compiler reads it: its block opens, and when it ends the scanner
 *     is back in the expression.
 *   • A non-self-closing `<script ...>` or `<style ...>` element (lowercase, so a <Script>
 *     component is markup) opens a block that ends at `</script>` or `</style>` in any case, even
 *     on the same line; its body follows that language's comments.
 */
function astroScan(source: string): {
  lines: Array<[number, string]>;
  regions: AstroRegions;
  /** The context each markup line ends in, by line number. */
  modes: Map<number, Mode>;
  endMode: Mode;
} {
  const lines = source.split('\n');
  const out: Array<[number, string]> = [];
  const modes = new Map<number, Mode>();
  const regions: AstroRegions = { frontmatter: null, script: [], style: [], comment: [] };
  let i = 0;
  while (i < lines.length && lines[i]!.trim() === '') i += 1;
  if (i < lines.length && lines[i]!.trim() === '---') {
    const block: BlockState = { open: false };
    const state = js();
    const body: string[] = [];
    for (i += 1; i < lines.length; i++) {
      const line = lines[i]!;
      if (line.trim() === '---' && !state.quote && !state.comment) break;
      body.push(line);
      out.push([i + 1, stripScript(line, block)]);
      for (let c = 0; c < line.length; ) c += jsStep(state, line, c);
      jsEndOfLine(state);
    }
    regions.frontmatter = body.join('\n');
    i += 1;
  }

  let mode: Mode = 'text';
  let buffer = '';
  let tag = { name: '', closing: false, quote: null as string | null, last: '', attr: js() };
  let expr = js(1);
  /** The expression a <script>/<style> element was opened from, to return to after it. */
  let outer: JsState | null = null;
  /** The last code character seen in the current expression, to tell `a < script` from `&& <script`. */
  let prev = '';
  const block: BlockState = { open: false };
  const leave = () => {
    if (outer) {
      mode = 'expr';
      expr = outer;
      outer = null;
      prev = '>';
    } else mode = 'text';
  };

  for (; i < lines.length; i++) {
    const line = lines[i]!;
    let kept = '';
    let c = 0;
    while (c < line.length) {
      if (mode === 'script' || mode === 'style') {
        const close = (mode === 'script' ? /<\/script\s*>/i : /<\/style\s*>/i).exec(line.slice(c));
        const body = close ? line.slice(c, c + close.index) : line.slice(c);
        kept += stripScript(body, block, mode === 'script');
        buffer += body;
        if (!close) {
          c = line.length;
          break;
        }
        regions[mode].push(buffer);
        kept += ` ${close[0]}`;
        c += close.index + close[0].length;
        leave();
        continue;
      }
      if (mode === 'comment') {
        const end = line.indexOf('-->', c);
        if (end === -1) {
          buffer += line.slice(c);
          c = line.length;
          break;
        }
        regions.comment.push(buffer + line.slice(c, end));
        c = end + 3;
        mode = 'text';
        continue;
      }
      const ch = line[c]!;
      if (mode === 'text') {
        if (line.startsWith('<!--', c)) {
          mode = 'comment';
          buffer = '';
          c += 4;
          continue;
        }
        if (ch === '{') {
          mode = 'expr';
          expr = js(1);
          prev = '{';
          kept += ch;
          c += 1;
          continue;
        }
        const open = ch === '<' ? /^<(\/?)([A-Za-z][\w:.-]*)/.exec(line.slice(c)) : null;
        if (open) {
          mode = 'tag';
          tag = { name: open[2]!, closing: open[1] === '/', quote: null, last: '', attr: js() };
          kept += open[0];
          c += open[0].length;
          continue;
        }
        kept += ch;
        c += 1;
        continue;
      }
      if (mode === 'expr') {
        const element = /^<(script|style)(?=[\s>/])/.exec(line.slice(c));
        if (element && !expr.quote && !expr.comment && /^$|[({[,?:&|=>!]/.test(prev)) {
          outer = expr;
          mode = 'tag';
          tag = { name: element[1]!, closing: false, quote: null, last: '', attr: js() };
          kept += element[0];
          c += element[0].length;
          continue;
        }
        if (!expr.quote && !expr.comment && !/\s/.test(ch)) prev = ch;
        const n = jsStep(expr, line, c);
        kept += line.slice(c, c + n);
        c += n;
        if (expr.depth === 0) mode = 'text';
        continue;
      }
      // mode === 'tag'
      if (tag.attr.depth > 0) {
        const n = jsStep(tag.attr, line, c);
        kept += line.slice(c, c + n);
        c += n;
        continue;
      }
      kept += ch;
      c += 1;
      if (tag.quote) {
        if (ch === tag.quote) tag.quote = null;
      } else if (ch === '"' || ch === "'") {
        tag.quote = ch;
      } else if (ch === '{') {
        tag.attr = js(1);
      } else if (ch === '>') {
        const selfClosing = tag.last === '/';
        if (!tag.closing && !selfClosing && (tag.name === 'script' || tag.name === 'style')) {
          mode = tag.name;
          buffer = '';
          block.open = false;
        } else leave();
      }
      if (!/\s/.test(ch)) tag.last = ch;
    }
    if (mode === 'expr') jsEndOfLine(expr);
    if (mode === 'tag' && tag.attr.depth > 0) jsEndOfLine(tag.attr);
    if (mode === 'script' || mode === 'style' || mode === 'comment') buffer += '\n';
    out.push([i + 1, kept]);
    modes.set(i + 1, mode);
  }
  return { lines: out, regions, modes, endMode: mode };
}

/** The code on each line with comments removed, as [lineNumber, text] pairs, blank lines dropped. */
function codeLines(source: string, file = 'x.ts'): Array<[number, string]> {
  const lines = file.endsWith('.astro') ? astroScan(source).lines : scriptLines(source);
  return lines.filter(([, text]) => text.trim() !== '');
}

function sourceFiles(dir: string): string[] {
  const out: string[] = [];
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) out.push(...sourceFiles(full));
    else if (/\.(?:ts|tsx|js|mjs|astro)$/.test(name) && !/\.test\.ts$/.test(name)) out.push(full);
  }
  return out;
}

/** file → offending lines, for every source file under src/. */
function rawUrlLiterals(): Map<string, string[]> {
  const hits = new Map<string, string[]>();
  for (const file of sourceFiles(SRC)) {
    const rel = relative(ROOT, file);
    for (const [n, line] of codeLines(readFileSync(file, 'utf8'), file)) {
      if (!matchesAny(line)) continue;
      const list = hits.get(rel) ?? [];
      list.push(`${rel}:${n}: ${line.trim()}`);
      hits.set(rel, list);
    }
  }
  return hits;
}

describe('no raw /tool/, /category/ or /guide/ URL strings outside the builder', () => {
  const hits = rawUrlLiterals();
  const allowed = new Set<string>([BUILDER, ...Object.keys(OTHER_FILES)]);

  it('finds the builder itself (the patterns still match what they should)', () => {
    expect(hits.has(BUILDER)).toBe(true);
  });

  it('has no raw URL string in any file that is not allowlisted', () => {
    const offenders = [...hits.entries()]
      .filter(([file]) => !allowed.has(file))
      .flatMap(([, lines]) => lines);
    expect(offenders, 'build the URL with toolPath / categoryPath / guidePath / urlFor from src/lib/paths.ts').toEqual([]);
  });

  it('allowlists no file that no longer needs it (the list only shrinks)', () => {
    const stale = Object.keys(OTHER_FILES).filter((file) => !hits.has(file));
    expect(stale).toEqual([]);
  });

  it('allowlists no guide: every Guide.astro is scanned', () => {
    expect(Object.keys(OTHER_FILES).filter((f) => f.endsWith('/Guide.astro'))).toEqual([]);
  });

  it('gives every OTHER_FILES entry a reason', () => {
    for (const [file, reason] of Object.entries(OTHER_FILES)) expect(reason.length, file).toBeGreaterThan(10);
  });
});

describe('the URL lint patterns', () => {
  const caught = (form: keyof typeof FORMS, samples: string[]) => {
    for (const sample of samples) expect(FORMS[form]!.test(sample), `${form}: ${sample}`).toBe(true);
  };

  it('catches a raw template, with or without withBase or a base prefix', () => {
    caught('raw', [
      'const a = `/tool/${segment}/${slug}/`;',
      'href={withBase(`/category/${c.slug}/`)}',
      'return `${base}/tool/${seg}/${s}/`;',
      'const g = `/guide/${cat}/${slug}/`;',
    ]);
  });

  it('catches a raw quoted string, a concatenation and an attribute value', () => {
    caught('raw', [
      "const x = '/tool/finance/x/';",
      'const y = "/category/finance/";',
      "a.href = '/tool/' + seg + '/';",
      '<a href="/tool/finance/x/">',
      "<a href='/category/text/'>",
      "href={withBase('/tool/text/')}",
      '<a href="/guide/text/how-to-count-words/">',
    ]);
  });

  it('catches a split prefix, missing either slash', () => {
    caught('splitEnd', ["const p = '/tool' + '/' + seg;", 'const c = `${base}/category`;', 'x = "/guide" + rest;']);
    caught('splitStart', ["base + 'tool/' + seg + '/'", 'const g = `guide/${slug}/`;', 'root + "category/" + slug']);
  });

  it('catches an array join that spells the prefix', () => {
    caught('arrayJoin', [
      "['', 'tool', seg, slug, ''].join('/')",
      '[base, "category", slug].join("/")',
      "const u = ['guide', cat, slug].join( '/' );",
    ]);
  });

  it('catches an absolute ToyTools URL', () => {
    caught('absolute', [
      "const u = 'https://toytoolsapp.com/tool/text/word-counter/';",
      '<a href="https://www.toytoolsapp.com/category/text/">',
      'fetch(`https://toytoolsapp.com/guide/${c}/${s}/`)',
    ]);
  });

  // Each sample line that must be reported says CATCH; every other line must be skipped.
  const reported = (lines: string[], file: string) =>
    codeLines(lines.join('\n'), file).filter(([, l]) => matchesAny(l)).map(([n]) => n);
  const expected = (lines: string[]) => lines.flatMap((l, i) => (l.includes('CATCH') ? [i + 1] : []));

  it('in a .ts file: skips // lines and /* */ blocks, scans a * line of code', () => {
    const src = [
      '/**',
      " * JSDoc: '/tool/a/b/' is prose here",
      ' */',
      "  * '/tool/c/d/' CATCH is not in a comment",
      "// const skipped = '/tool/e/f/';",
      "/* one line */ const kept = '/tool/j/k/'; // CATCH",
      '/*',
      "  '/category/x/' inside a block",
      '*/',
    ];
    expect(reported(src, 'a.ts')).toEqual(expected(src));
  });

  it('in .astro markup: catches the review repro, a raw link between /* and */ lines', () => {
    const src = ['---', "const toolHref = '';", '---', '/*', '<a href="/tool/finance/x/">x</a> CATCH', '*/', '<a href={toolHref} class="tool-card">'];
    expect(reported(src, 'ToolCard.astro')).toEqual(expected(src));
  });

  it('in .astro markup: /* */, /** * */, //, {/* */} and * lines are text, only <!-- --> is a comment', () => {
    const src = [
      '---',
      "// const skipped = '/tool/fm/a/';",
      "/** '/tool/fm/b/' in frontmatter JSDoc */",
      "const kept = '/tool/fm/c/'; // CATCH",
      '---',
      '/*',
      '<a href="/tool/finance/x/">x</a> CATCH',
      '*/',
      '/**',
      ' * <a href="/tool/finance/y/">y</a> CATCH',
      ' */',
      '// <a href="/tool/finance/z/">z</a> CATCH',
      '{/* <a href="/category/q/">q</a> CATCH */}',
      '{/*',
      '  prose "/tool/g/h/" CATCH',
      '*/}',
      '<!-- <a href="/category/i/"> -->',
      '<!--',
      '  <a href="/category/j/">',
      '-->',
      '<p>after <!-- "/tool/k/l/" --> the comment, "/tool/m/n/" CATCH</p>',
    ];
    expect(reported(src, 'x.astro')).toEqual(expected(src));
  });

  it('in .astro <script> and <style>: follows that language\'s comments', () => {
    const src = [
      '<script>',
      "  // const s = '/tool/s/a/';",
      "  /* '/tool/s/b/' */",
      "  const t = '/tool/s/c/'; // CATCH",
      '</script>',
      '<style>',
      "  /* background: url('/tool/css/a/') */",
      "  // '/tool/css/b/' CATCH is not a CSS comment",
      '</style>',
      "<script>const one = '/tool/one/line/'; // CATCH</script>",
      "<script>// '/tool/one/comment/'</script>",
      '<script is:inline>',
      "  /* '/tool/inline/a/' */",
      '</script>',
      '<a href="/tool/after/script/">CATCH</a>',
    ];
    expect(reported(src, 'x.astro')).toEqual(expected(src));
  });

  it('leaves look-alikes alone', () => {
    for (const sample of [
      '`/tools/${old}/`',
      "'/tools/text/'",
      '`/icons/tool/${slug}.svg`',
      "'components/tool/ToolBar.astro'",
      "import X from '@components/tool/ToolPage.astro';",
      "kind: 'tool',",
      "if (entity.kind === 'category') return;",
      "['tool', 'guide'].includes(kind)",
      "['a', 'b'].join('/')",
      "['tool', x].join(' ')",
      "'tooltip/'",
      "'/categories/'",
      "'guides/x'",
      "'https://github.com/owner/tool/'",
      "'https://toytoolsapp.com/search/'",
      '2 * 3 * width',
    ]) {
      expect(matchesAny(sample), sample).toBe(false);
    }
  });
});

// Context tracking, by case: every way the scanner's idea of "where am I" could drift from the
// real Astro structure. Each sample line that must be reported says CATCH.
describe('the .astro context tracker stays in sync with the file', () => {
  const reported = (lines: string[]) =>
    codeLines(lines.join('\n'), 'x.astro').filter(([, l]) => matchesAny(l)).map(([n]) => n);
  const expected = (lines: string[]) => lines.flatMap((l, i) => (l.includes('CATCH') ? [i + 1] : []));
  const check = (lines: string[]) => expect(reported(lines)).toEqual(expected(lines));

  it('a self-closing <script ... /> opens no block (review round 2 repro)', () => {
    check([
      '<script type="application/ld+json" set:html={JSON.stringify(articleSchema)} />',
      '/*',
      '<a href="/tool/finance/x/">x</a> CATCH',
      '*/',
      '/**',
      ' * <a href="/tool/finance/y/">y</a> CATCH',
      ' */',
      '// <a href="/tool/finance/z/">z</a> CATCH',
    ]);
  });

  it('a quoted attribute is read to its closing quote: a > or /> inside one does not end the tag', () => {
    check([
      '<script type="application/ld+json" data-note="a > b" set:html={x} />',
      '// <a href="/tool/a/b/">CATCH</a>',
      '<script data-x="a/>">',
      "  // const skipped = '/tool/s/a/';",
      '</script>',
      '/* <a href="/tool/c/d/">CATCH</a> */',
      "<style data-x='a > b' />",
      '/* <a href="/tool/e/f/">CATCH</a> */',
    ]);
  });

  it('a </script> or </style> close matches in any case, as the compiler reads it', () => {
    check([
      '<script>',
      "  // const skipped = '/tool/s/a/';",
      '</SCRIPT>',
      '// <a href="/tool/after/upper-script/">CATCH</a>',
      '<style>',
      '  a { color: red }',
      '</Style >',
      '/* <a href="/tool/after/upper-style/">CATCH</a> */',
    ]);
  });

  it('a self-closing <style /> and a <script> with a > inside its attribute expression', () => {
    check([
      '<style is:global />',
      '// <a href="/tool/a/b/">CATCH</a>',
      '<script type="application/ld+json" set:html={JSON.stringify(items.filter((i) => i.n > 1))} />',
      '/* <a href="/tool/c/d/">CATCH</a> */',
    ]);
  });

  it('a <script> tag whose attributes run across lines', () => {
    check([
      '<script',
      '  type="module"',
      '  data-src="/tool/attr/x/" CATCH',
      '>',
      "  // const skipped = '/tool/s/a/';",
      '</script>',
      '<script',
      '  type="application/ld+json"',
      '  set:html={schema}',
      '/>',
      '// <a href="/tool/after/multiline/">CATCH</a>',
    ]);
  });

  it('several blocks on one line, and </script> on the same line as code', () => {
    check([
      "<script>a('/tool/one/x/'); // CATCH</script><style>b{}</style>/* <a href=\"/tool/after/one/\"> */ CATCH",
      "<script>// '/tool/one/comment/'</script>",
      '<script>',
      "  run(); </script>// <a href=\"/tool/after/close/\">CATCH</a>",
      '<style>',
      '  a { color: red } </style><p>// <a href="/tool/after/style/">CATCH</a></p>',
    ]);
  });

  it('the literal text <script or <style in strings, attributes and comments opens nothing', () => {
    check([
      '---',
      "const tag = '<script>';",
      '---',
      "<p>{'<script>'}</p>",
      '// <a href="/tool/after/expr-string/">CATCH</a>',
      '<a title="<script>">x</a>',
      '/* <a href="/tool/after/attr-string/">CATCH</a> */',
      '{/* a <style> in a comment */}',
      '// <a href="/tool/after/expr-comment/">CATCH</a>',
      '<!-- <script> in an HTML comment -->',
      '// <a href="/tool/after/html-comment/">CATCH</a>',
      "{cond ? `<style>${x}` : '}'}",
      '// <a href="/tool/after/template/">CATCH</a>',
      '<Script>{x}</Script>',
      '// <a href="/tool/after/component/">CATCH</a>',
    ]);
  });

  it('a <script> or <style> element inside an expression opens its block, then the expression resumes', () => {
    check([
      '{ok && (',
      '  <script is:inline define:vars={{ slug }}>',
      "    // const skipped = '/tool/in/expr/';",
      "    go('/tool/in/expr/code/'); // CATCH",
      '  </script>',
      ')}',
      '// <a href="/tool/after/expr-script/">CATCH</a>',
      "{a<script ? '/tool/compare/x/' : b} CATCH",
      "{ok ? <style is:global /> : null} /* <a href=\"/tool/after/expr-style/\">CATCH</a> */",
      '{examples.length > 0 && (',
      '  <script type="application/json" id={`${slug}-examples`} set:html={JSON.stringify(examples)} />',
      '  /**',
      '   * <a href="/tool/in/expr/after-selfclose/">CATCH</a>',
      '   */',
      ')}',
    ]);
  });

  it('frontmatter fences: leading blank lines, a --- inside a template literal, no frontmatter', () => {
    check([
      '',
      '---',
      "// const skipped = '/tool/fm/a/';",
      'const t = `',
      '---',
      "<script>`; const kept = '/tool/fm/b/'; // CATCH",
      '---',
      '// <a href="/tool/after/fence/">CATCH</a>',
    ]);
    check(['// <a href="/tool/no/frontmatter/">CATCH</a>', '<p>x</p>']);
  });
});

// Generated from the real tree: in every .astro file under src/, a raw link planted in markup in each
// comment-looking shape must be reported. It is planted at the end of the file and right after
// every markup line where the context changes (a tag that self-closes, a </script>, </style> or -->
// close, the frontmatter fence), in plain markup or inside a {...} expression: the places a tracker
// that lost its place would skip it.
describe('a link planted in the markup of any real .astro file is reported', () => {
  const astroFiles = sourceFiles(SRC).filter((f) => f.endsWith('.astro'));
  const PLANTS: Record<string, string[]> = {
    'slash-star block': ['/*', '<a href="/tool/finance/x/">x</a>', '*/'],
    'one-line slash-star': ['/* <a href="/tool/finance/x/">x</a> */'],
    'doc block': ['/**', ' * <a href="/tool/finance/x/">x</a>', ' */'],
    'line comment': ['// <a href="/tool/finance/x/">x</a>'],
  };
  const TRANSITION = /\/>|<\/script\s*>|<\/style\s*>|-->/i;
  /** Line numbers to plant after: every context change in markup, and the last line. */
  const plantSites = (source: string): number[] => {
    const lines = source.split('\n');
    const { modes } = astroScan(source);
    const markup = [...modes.keys()];
    const sites = new Set<number>([lines.length]);
    if (markup.length > 0 && markup[0]! > 1) sites.add(markup[0]! - 1);
    for (const [n, mode] of modes) {
      if ((mode === 'text' || mode === 'expr') && TRANSITION.test(lines[n - 1]!)) sites.add(n);
    }
    return [...sites].sort((a, b) => a - b);
  };
  /**
   * The sites a file must have, found without the scanner: the last line, the closing frontmatter
   * fence, and every later line that holds a one-line self-closing <script>/<style> tag or a
   * </script>/</style> close. A weakened plantSites() that drops any of them fails by name.
   */
  const requiredSites = (source: string): number[] => {
    const lines = source.split('\n');
    const required = [lines.length];
    let from = 0;
    const first = lines.findIndex((l) => l.trim() !== '');
    if (first !== -1 && lines[first]!.trim() === '---') {
      const fence = lines.findIndex((l, n) => n > first && l.trim() === '---');
      if (fence !== -1) {
        required.push(fence + 1);
        from = fence + 1;
      }
    }
    lines.forEach((l, n) => {
      if (n < from) return;
      if (/<(?:script|style)\b[^<]*\/>/.test(l) || /<\/(?:script|style)\s*>/i.test(l)) required.push(n + 1);
    });
    return [...new Set(required)].sort((a, b) => a - b);
  };
  const read = (f: string) => readFileSync(f, 'utf8').replace(/\n*$/, '');

  it('scans every .astro file git knows under src/, tracked or new', () => {
    const listed = execFileSync('git', ['ls-files', '--cached', '--others', '--exclude-standard', '--', 'src/*.astro'], {
      cwd: ROOT,
      encoding: 'utf8',
    })
      .split('\n')
      .filter(Boolean)
      .sort();
    expect(listed.length).toBeGreaterThan(300);
    expect(astroFiles.map((f) => relative(ROOT, f)).sort()).toEqual(listed);
  });

  it('plants at every required site in every file', () => {
    const short: string[] = [];
    let total = 0;
    for (const file of astroFiles) {
      const sites = new Set(plantSites(read(file)));
      total += sites.size;
      const missing = requiredSites(read(file)).filter((n) => !sites.has(n));
      if (missing.length > 0) short.push(`${relative(ROOT, file)}: ${missing.join(', ')}`);
    }
    expect(short).toEqual([]);
    expect(total).toBeGreaterThan(astroFiles.length * 3);
  });

  for (const [shape, plant] of Object.entries(PLANTS)) {
    it(`reports a ${shape} link planted in every file`, () => {
      const missed: string[] = [];
      for (const file of astroFiles) {
        const source = read(file);
        const lines = source.split('\n');
        for (const after of plantSites(source)) {
          const planted = [...lines.slice(0, after), ...plant, ...lines.slice(after)].join('\n');
          const linkLine = after + plant.findIndex((l) => l.includes('href')) + 1;
          const hit = codeLines(planted, file).some(([n, l]) => n === linkLine && matchesAny(l));
          if (!hit) missed.push(`${relative(ROOT, file)}:${after}`);
        }
      }
      expect(missed).toEqual([]);
    });
  }

  it('ends every real file in markup', () => {
    const stuck = astroFiles
      .map((f) => [relative(ROOT, f), astroScan(readFileSync(f, 'utf8')).endMode] as const)
      .filter(([, mode]) => mode !== 'text');
    expect(stuck).toEqual([]);
  });
});

// The oracle: Astro's own parser (@astrojs/compiler, the one astro build uses) must find exactly the
// frontmatter, <script> bodies, <style> bodies and <!-- --> comments the scanner found, in every
// real .astro file. Any drift between the scanner and the real structure fails here by name. It is
// only an oracle while the build really uses that parser, so the first two tests pin that: the
// astro config turns on no other compiler (experimental.rustCompiler swaps it for a Rust one), and
// this test imports the very copy of @astrojs/compiler that astro itself resolves.
describe('the scanner agrees with the Astro compiler on every real .astro file', () => {
  interface AstNode {
    type: string;
    name?: string;
    value?: string;
    children?: AstNode[];
  }
  const astroFiles = sourceFiles(SRC).filter((f) => f.endsWith('.astro'));
  const norm = (list: string[]) => list.map((t) => t.trim()).filter((t) => t !== '');
  const parsed = new Map<string, AstroRegions>();

  beforeAll(async () => {
    for (const file of astroFiles) {
      const { ast } = await parse(readFileSync(file, 'utf8'));
      const regions: AstroRegions = { frontmatter: null, script: [], style: [], comment: [] };
      const text = (n: AstNode) => (n.children ?? []).map((c) => c.value ?? '').join('');
      const walk = (n: AstNode) => {
        if (n.type === 'frontmatter') regions.frontmatter = n.value ?? '';
        else if (n.type === 'comment') regions.comment.push(n.value ?? '');
        else if (n.type === 'element' && (n.name === 'script' || n.name === 'style')) regions[n.name].push(text(n));
        for (const c of n.children ?? []) walk(c);
      };
      walk(ast as unknown as AstNode);
      parsed.set(file, regions);
    }
  });

  it('checks the parser the build uses: no other compiler is turned on in the astro config', async () => {
    const { default: config } = (await import('../../astro.config.mjs')) as {
      default: { experimental?: Record<string, unknown>; compiler?: unknown };
    };
    const experimental = config.experimental ?? {};
    const other = Object.keys(experimental).filter((k) => /compiler/i.test(k) && experimental[k] !== false);
    expect(other, 'the oracle would check a parser the build no longer uses').toEqual([]);
    expect(config.compiler, 'the oracle would check a parser the build no longer uses').toBeUndefined();
  });

  it('checks the parser the build uses: the same @astrojs/compiler copy astro resolves', () => {
    const fromAstro = createRequire(join(ROOT, 'node_modules/astro/package.json')).resolve('@astrojs/compiler');
    const fromHere = createRequire(__filename).resolve('@astrojs/compiler');
    expect(fromHere).toBe(fromAstro);
  });

  it('parses every file', () => {
    expect(parsed.size).toBe(astroFiles.length);
  });

  for (const key of ['frontmatter', 'script', 'style', 'comment'] as const) {
    it(`finds the same ${key} regions`, () => {
      const drift: string[] = [];
      for (const file of astroFiles) {
        const mine = astroScan(readFileSync(file, 'utf8')).regions[key];
        const theirs = parsed.get(file)![key];
        const a = key === 'frontmatter' ? norm(mine === null ? [] : [mine as string]) : norm(mine as string[]);
        const b = key === 'frontmatter' ? norm(theirs === null ? [] : [theirs as string]) : norm(theirs as string[]);
        if (JSON.stringify(a) !== JSON.stringify(b)) drift.push(relative(ROOT, file));
      }
      expect(drift).toEqual([]);
    });
  }
});
