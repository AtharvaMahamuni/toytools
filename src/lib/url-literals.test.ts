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
//     around a live link, and {/* */} is scanned too, so a link can never hide behind any of them.
// A line that starts with * is only skipped inside a real block comment, so a * line of code or
// markup is scanned like any other.
//
// OTHER_FILES is the one allowlist: files the builder cannot reach yet, each with its reason. It
// only shrinks. An allowlisted file that no longer has a hit fails too, so it cannot go stale.
import { describe, it, expect } from 'vitest';
import { readdirSync, readFileSync, statSync } from 'node:fs';
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
 * is not tracked, so its later lines are scanned: a false positive at worst, never a skipped line.
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

const OPENING = /<!--|<(script|style)\b[^>]*>/i;
const CLOSING = { script: /<\/script\s*>/i, style: /<\/style\s*>/i } as const;

/**
 * An .astro source, by context: frontmatter is script; after it, markup, where only <!-- --> is a
 * comment, until a <script> or <style> block, whose body follows its own language's comments.
 */
function astroLines(source: string): Array<[number, string]> {
  const lines = source.split('\n');
  const out: Array<[number, string]> = [];
  let i = 0;
  if (lines[0]?.trim() === '---') {
    const block: BlockState = { open: false };
    for (i = 1; i < lines.length && lines[i]!.trim() !== '---'; i++) out.push([i + 1, stripScript(lines[i]!, block)]);
    i += 1;
  }
  let ctx: 'markup' | 'script' | 'style' = 'markup';
  let inHtmlComment = false;
  const block: BlockState = { open: false };
  for (; i < lines.length; i++) {
    let rest = lines[i]!;
    let kept = '';
    while (rest) {
      if (ctx === 'markup') {
        if (inHtmlComment) {
          const end = rest.indexOf('-->');
          if (end === -1) break;
          rest = rest.slice(end + 3);
          inHtmlComment = false;
          continue;
        }
        const m = OPENING.exec(rest);
        if (!m) {
          kept += rest;
          break;
        }
        kept += rest.slice(0, m.index);
        rest = rest.slice(m.index + m[0].length);
        if (m[0] === '<!--') {
          inHtmlComment = true;
        } else {
          kept += m[0];
          ctx = m[1]!.toLowerCase() as 'script' | 'style';
          block.open = false;
        }
        continue;
      }
      const close = CLOSING[ctx].exec(rest);
      const body = close ? rest.slice(0, close.index) : rest;
      kept += stripScript(body, block, ctx === 'script');
      if (!close) break;
      kept += ` ${close[0]}`;
      rest = rest.slice(close.index + close[0].length);
      ctx = 'markup';
    }
    out.push([i + 1, kept]);
  }
  return out;
}

/** The code on each line with comments removed, as [lineNumber, text] pairs, blank lines dropped. */
function codeLines(source: string, file = 'x.ts'): Array<[number, string]> {
  const lines = file.endsWith('.astro') ? astroLines(source) : scriptLines(source);
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
