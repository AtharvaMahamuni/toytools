// The URL lint (C3, spec item 4): a tool or category URL is built by src/lib/paths.ts and nowhere
// else. Any NEW raw template literal that starts a `/tool/` or `/category/` path, like
// `/tool/${segment}/${slug}/` or withBase(`/category/${slug}/`), fails here; call toolPath(),
// categoryPath(), guidePath() or urlFor() instead.
//
// Two allowlists, both of which only shrink:
//   • GUIDE_FILES: every Guide.astro that existed when the lint landed. They hold ~200 raw links
//     and move to the builder in C4, which deletes this list. A new Guide.astro is not on it, so it
//     has to use the builder from day one.
//   • OTHER_FILES: files with a reason the builder cannot be imported, each pinned by its own test.
// An allowlisted file that no longer has a raw literal fails too, so the list cannot go stale.
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
};

/** Frozen on 2026-09-29 (C3). C4 migrates these guides to the builder and deletes this list. */
const GUIDE_FILES: readonly string[] = [
  'src/tools/datetime/age-calculator/Guide.astro',
  'src/tools/datetime/cron-expression-parser/Guide.astro',
  'src/tools/datetime/date-difference-calculator/Guide.astro',
  'src/tools/datetime/systemd-timer-converter/Guide.astro',
  'src/tools/datetime/timezone-converter/Guide.astro',
  'src/tools/datetime/unix-timestamp-converter/Guide.astro',
  'src/tools/design/aspect-ratio-calculator/Guide.astro',
  'src/tools/design/color-contrast-checker/Guide.astro',
  'src/tools/design/color-format-converter/Guide.astro',
  'src/tools/design/px-to-dp-converter/Guide.astro',
  'src/tools/design/px-to-rem-converter/Guide.astro',
  'src/tools/developer-utilities/base64-encoder-decoder/Guide.astro',
  'src/tools/developer-utilities/binary-text-converter/Guide.astro',
  'src/tools/developer-utilities/cidr-calculator/Guide.astro',
  'src/tools/developer-utilities/crc32-hash-generator/Guide.astro',
  'src/tools/developer-utilities/csv-cleaner/Guide.astro',
  'src/tools/developer-utilities/csv-diff/Guide.astro',
  'src/tools/developer-utilities/csv-to-json-converter/Guide.astro',
  'src/tools/developer-utilities/csv-to-tsv/Guide.astro',
  'src/tools/developer-utilities/encoding-detector/Guide.astro',
  'src/tools/developer-utilities/hash-identifier/Guide.astro',
  'src/tools/developer-utilities/hex-encoder-decoder/Guide.astro',
  'src/tools/developer-utilities/html-entity-encoder-decoder/Guide.astro',
  'src/tools/developer-utilities/json-diff/Guide.astro',
  'src/tools/developer-utilities/json-escape/Guide.astro',
  'src/tools/developer-utilities/json-formatter/Guide.astro',
  'src/tools/developer-utilities/json-minifier/Guide.astro',
  'src/tools/developer-utilities/json-to-csv-converter/Guide.astro',
  'src/tools/developer-utilities/json-to-yaml-converter/Guide.astro',
  'src/tools/developer-utilities/json-tree-viewer/Guide.astro',
  'src/tools/developer-utilities/json-validator/Guide.astro',
  'src/tools/developer-utilities/jwt-decoder/Guide.astro',
  'src/tools/developer-utilities/md5-hash-generator/Guide.astro',
  'src/tools/developer-utilities/punycode-converter/Guide.astro',
  'src/tools/developer-utilities/regex-tester/Guide.astro',
  'src/tools/developer-utilities/rot13-encoder-decoder/Guide.astro',
  'src/tools/developer-utilities/sha1-hash-generator/Guide.astro',
  'src/tools/developer-utilities/sha256-hash-generator/Guide.astro',
  'src/tools/developer-utilities/sha512-hash-generator/Guide.astro',
  'src/tools/developer-utilities/shell-quote-escalator/Guide.astro',
  'src/tools/developer-utilities/url-encoder-decoder/Guide.astro',
  'src/tools/developer-utilities/what-is-my-ip/Guide.astro',
  'src/tools/developer-utilities/yaml-to-json-converter/Guide.astro',
  'src/tools/fidget/breathing-circle/Guide.astro',
  'src/tools/fidget/gears/Guide.astro',
  'src/tools/fidget/kinetic-sand/Guide.astro',
  'src/tools/fidget/pop-it/Guide.astro',
  'src/tools/fidget/slime/Guide.astro',
  'src/tools/fidget/spinner/Guide.astro',
  'src/tools/fidget/switch-board/Guide.astro',
  'src/tools/finance/cagr-calculator/Guide.astro',
  'src/tools/finance/compound-interest-calculator/Guide.astro',
  'src/tools/finance/emergency-fund-calculator/Guide.astro',
  'src/tools/finance/inflation-calculator/Guide.astro',
  'src/tools/finance/roi-calculator/Guide.astro',
  'src/tools/finance/rule-of-72-calculator/Guide.astro',
  'src/tools/finance/savings-goal-calculator/Guide.astro',
  'src/tools/finance/shop-upi-tally/Guide.astro',
  'src/tools/finance/sip-calculator/Guide.astro',
  'src/tools/finance/split-bill/Guide.astro',
  'src/tools/finance/upi-1999-split/Guide.astro',
  'src/tools/finance/upi-mdr-estimator/Guide.astro',
  'src/tools/generate/coin-flipper/Guide.astro',
  'src/tools/generate/dice-roller/Guide.astro',
  'src/tools/generate/lorem-ipsum-generator/Guide.astro',
  'src/tools/generate/password-generator/Guide.astro',
  'src/tools/generate/qr-code-generator/Guide.astro',
  'src/tools/generate/random-choice-picker/Guide.astro',
  'src/tools/generate/random-name-picker/Guide.astro',
  'src/tools/generate/random-string-generator/Guide.astro',
  'src/tools/generate/uuid-generator/Guide.astro',
  'src/tools/generate/uuid-inspector/Guide.astro',
  'src/tools/health/bmi-calculator/Guide.astro',
  'src/tools/health/bmr-calculator/Guide.astro',
  'src/tools/health/body-fat-calculator/Guide.astro',
  'src/tools/health/body-weight-tracker/Guide.astro',
  'src/tools/health/calorie-deficit-calculator/Guide.astro',
  'src/tools/health/heart-rate-zone-calculator/Guide.astro',
  'src/tools/health/ideal-weight-calculator/Guide.astro',
  'src/tools/health/macro-calculator/Guide.astro',
  'src/tools/health/move-today-tracker/Guide.astro',
  'src/tools/health/one-rep-max-calculator/Guide.astro',
  'src/tools/health/protein-intake-calculator/Guide.astro',
  'src/tools/health/running-pace-calculator/Guide.astro',
  'src/tools/health/tdee-calculator/Guide.astro',
  'src/tools/health/water-intake-tracker/Guide.astro',
  'src/tools/math/combinations-permutations-calculator/Guide.astro',
  'src/tools/math/fraction-calculator/Guide.astro',
  'src/tools/math/prime-factorization-calculator/Guide.astro',
  'src/tools/math/statistics-visualizer/Guide.astro',
  'src/tools/music/equalizer-settings-generator/Guide.astro',
  'src/tools/number/binary-converter/Guide.astro',
  'src/tools/number/discount-calculator/Guide.astro',
  'src/tools/number/margin-calculator/Guide.astro',
  'src/tools/number/markup-calculator/Guide.astro',
  'src/tools/number/number-to-words/Guide.astro',
  'src/tools/number/percentage-calculator/Guide.astro',
  'src/tools/number/roman-numeral-converter/Guide.astro',
  'src/tools/number/scientific-calculator/Guide.astro',
  'src/tools/number/tax-calculator/Guide.astro',
  'src/tools/number/tip-calculator/Guide.astro',
  'src/tools/prep/chat-export-cleaner/Guide.astro',
  'src/tools/prep/context-fit-checker/Guide.astro',
  'src/tools/prep/json-schema-validator/Guide.astro',
  'src/tools/prep/json-to-schema/Guide.astro',
  'src/tools/prep/llms-txt-generator/Guide.astro',
  'src/tools/prep/prompt-packer/Guide.astro',
  'src/tools/productivity/book-tracker/Guide.astro',
  'src/tools/productivity/habit-streak-tracker/Guide.astro',
  'src/tools/productivity/keep-screen-awake/Guide.astro',
  'src/tools/productivity/notepad/Guide.astro',
  'src/tools/productivity/pomodoro-timer/Guide.astro',
  'src/tools/productivity/todo-list/Guide.astro',
  'src/tools/text/camel-case-converter/Guide.astro',
  'src/tools/text/character-counter/Guide.astro',
  'src/tools/text/character-map/Guide.astro',
  'src/tools/text/find-replace/Guide.astro',
  'src/tools/text/invisible-character-detector/Guide.astro',
  'src/tools/text/kebab-case-converter/Guide.astro',
  'src/tools/text/letter-counter/Guide.astro',
  'src/tools/text/line-counter/Guide.astro',
  'src/tools/text/lowercase-converter/Guide.astro',
  'src/tools/text/normalize-whitespace/Guide.astro',
  'src/tools/text/paragraph-counter/Guide.astro',
  'src/tools/text/reading-time-calculator/Guide.astro',
  'src/tools/text/remove-accents/Guide.astro',
  'src/tools/text/remove-blank-lines/Guide.astro',
  'src/tools/text/remove-duplicate-lines/Guide.astro',
  'src/tools/text/remove-emoji/Guide.astro',
  'src/tools/text/remove-extra-spaces/Guide.astro',
  'src/tools/text/remove-line-breaks/Guide.astro',
  'src/tools/text/remove-tabs/Guide.astro',
  'src/tools/text/reverse-text/Guide.astro',
  'src/tools/text/sentence-case-converter/Guide.astro',
  'src/tools/text/sentence-counter/Guide.astro',
  'src/tools/text/slugify-text/Guide.astro',
  'src/tools/text/snake-case-converter/Guide.astro',
  'src/tools/text/space-counter/Guide.astro',
  'src/tools/text/text-compare/Guide.astro',
  'src/tools/text/text-repeater/Guide.astro',
  'src/tools/text/title-case-converter/Guide.astro',
  'src/tools/text/trim-text/Guide.astro',
  'src/tools/text/uppercase-converter/Guide.astro',
  'src/tools/text/word-counter/Guide.astro',
  'src/tools/text/word-frequency-counter/Guide.astro',
];

// A template literal that begins a /tool/ or /category/ path, optionally after one ${...} (a base).
const RAW_URL_TEMPLATE = /`(?:\$\{[^}`]*\})?\/(?:tool|category)\//;
// Whole-line comments: //, /* and * continuation lines, JSX {/* */} and HTML <!-- -->.
const COMMENT_LINE = /^\s*(?:\/\/|\*|\/\*|\{\/\*|<!--)/;

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
function rawUrlTemplates(): Map<string, string[]> {
  const hits = new Map<string, string[]>();
  for (const file of sourceFiles(SRC)) {
    const rel = relative(ROOT, file);
    const lines = readFileSync(file, 'utf8').split('\n');
    lines.forEach((line, i) => {
      if (COMMENT_LINE.test(line) || !RAW_URL_TEMPLATE.test(line)) return;
      const list = hits.get(rel) ?? [];
      list.push(`${rel}:${i + 1}: ${line.trim()}`);
      hits.set(rel, list);
    });
  }
  return hits;
}

describe('no raw /tool/ or /category/ URL templates outside the builder', () => {
  const hits = rawUrlTemplates();
  const allowed = new Set<string>([BUILDER, ...Object.keys(OTHER_FILES), ...GUIDE_FILES]);

  it('finds the builder itself (the pattern still matches what it should)', () => {
    expect(hits.has(BUILDER)).toBe(true);
  });

  it('has no raw URL template in any file that is not allowlisted', () => {
    const offenders = [...hits.entries()]
      .filter(([file]) => !allowed.has(file))
      .flatMap(([, lines]) => lines);
    expect(offenders, 'build the URL with toolPath / categoryPath / guidePath / urlFor from src/lib/paths.ts').toEqual([]);
  });

  it('allowlists no file that no longer needs it (the lists only shrink)', () => {
    const stale = [...Object.keys(OTHER_FILES), ...GUIDE_FILES].filter((file) => !hits.has(file));
    expect(stale).toEqual([]);
  });

  it('allowlists only Guide.astro files in GUIDE_FILES', () => {
    expect(GUIDE_FILES.every((f) => f.endsWith('/Guide.astro'))).toBe(true);
    expect(new Set(GUIDE_FILES).size).toBe(GUIDE_FILES.length);
  });

  it('catches a new raw template, with or without withBase or a base prefix', () => {
    for (const sample of [
      'const a = `/tool/${segment}/${slug}/`;',
      'href={withBase(`/category/${c.slug}/`)}',
      'return `${base}/tool/${seg}/${s}/`;',
    ]) {
      expect(RAW_URL_TEMPLATE.test(sample), sample).toBe(true);
    }
    for (const sample of ['`/tools/${old}/`', '`/icons/tool/${slug}.svg`', "'components/tool/ToolBar.astro'"]) {
      expect(RAW_URL_TEMPLATE.test(sample), sample).toBe(false);
    }
  });
});
