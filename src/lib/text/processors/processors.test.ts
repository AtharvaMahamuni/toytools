import { describe, it, expect } from 'vitest';
import { splitWords, perLine } from './transform/_words';
import { runProcessor, PROCESSORS } from './registry';

// --- Helpers ---

describe('splitWords', () => {
  it('returns [] for empty string', () => expect(splitWords('')).toEqual([]));
  it('returns [] for whitespace-only string', () => expect(splitWords('   ')).toEqual([]));
  it('splits single word', () => expect(splitWords('hello')).toEqual(['hello']));
  it('splits on spaces', () => expect(splitWords('hello world')).toEqual(['hello', 'world']));
  it('splits on hyphens', () => expect(splitWords('hello-world')).toEqual(['hello', 'world']));
  it('splits on underscores', () => expect(splitWords('hello_world')).toEqual(['hello', 'world']));
  it('splits camelCase at lowercase→uppercase boundary', () => expect(splitWords('helloWorld')).toEqual(['hello', 'World']));
  it('splits multiple camelCase humps', () => expect(splitWords('camelCaseTest')).toEqual(['camel', 'Case', 'Test']));
  it('does not split consecutive uppercase (no lowercase→uppercase boundary)', () => expect(splitWords('HTMLParser')).toEqual(['HTMLParser']));
  it('collapses multiple spaces', () => expect(splitWords('hello   world')).toEqual(['hello', 'world']));
  it('strips leading punctuation', () => expect(splitWords('!!! hello')).toEqual(['hello']));
  it('preserves alphanumeric tokens', () => expect(splitWords('hello123world')).toEqual(['hello123world']));
  it('handles mixed separators', () => expect(splitWords('hello-world_foo')).toEqual(['hello', 'world', 'foo']));
});

describe('perLine', () => {
  it('maps over each line', () => expect(perLine('a\nb\nc', s => s.toUpperCase())).toBe('A\nB\nC'));
  it('handles single line', () => expect(perLine('a', s => s.toUpperCase())).toBe('A'));
  it('handles empty string', () => expect(perLine('', s => s.toUpperCase())).toBe(''));
  it('preserves blank lines', () => expect(perLine('a\n\nb', s => s)).toBe('a\n\nb'));
  it('applies identity transform unchanged', () => expect(perLine('hello\nworld', s => s)).toBe('hello\nworld'));
});

// --- Registry ---

describe('runProcessor', () => {
  it('resolves and runs a known processor', () => expect(runProcessor('uppercase', 'hello')).toBe('HELLO'));
  it('returns input unchanged for unknown id', () => expect(runProcessor('does-not-exist', 'hello')).toBe('hello'));
  it('returns input unchanged for empty id', () => expect(runProcessor('', 'hello')).toBe('hello'));
  it('passes empty string through known processor', () => expect(runProcessor('uppercase', '')).toBe(''));
});

// --- Transform Processors ---

describe('uppercase', () => {
  const p = PROCESSORS.uppercase.process;
  it('returns empty string for empty input', () => expect(p('')).toBe(''));
  it('uppercases a simple word', () => expect(p('hello')).toBe('HELLO'));
  it('uppercases mixed case', () => expect(p('Hello World')).toBe('HELLO WORLD'));
  it('uppercases with numbers and punctuation', () => expect(p('123 abc!')).toBe('123 ABC!'));
  it('is idempotent on already-uppercase input', () => expect(p('ALREADY UPPER')).toBe('ALREADY UPPER'));
  it('uppercases across newlines', () => expect(p('hello\nworld')).toBe('HELLO\nWORLD'));
  it('handles whitespace-only string', () => expect(p('   ')).toBe('   '));
});

describe('lowercase', () => {
  const p = PROCESSORS.lowercase.process;
  it('returns empty string for empty input', () => expect(p('')).toBe(''));
  it('lowercases a simple word', () => expect(p('HELLO')).toBe('hello'));
  it('lowercases mixed case', () => expect(p('Hello World')).toBe('hello world'));
  it('is idempotent on already-lowercase input', () => expect(p('already lower')).toBe('already lower'));
  it('lowercases across newlines', () => expect(p('HELLO\nWORLD')).toBe('hello\nworld'));
  it('handles numbers and punctuation', () => expect(p('ABC 123!')).toBe('abc 123!'));
  it('handles whitespace-only string', () => expect(p('   ')).toBe('   '));
});

describe('titleCase', () => {
  const p = PROCESSORS.titleCase.process;
  it('returns empty string for empty input', () => expect(p('')).toBe(''));
  it('capitalizes a single word', () => expect(p('hello')).toBe('Hello'));
  it('capitalizes each word in a phrase', () => expect(p('hello world')).toBe('Hello World'));
  it('re-cases already-uppercase input', () => expect(p('HELLO WORLD')).toBe('Hello World'));
  it('capitalizes across newlines', () => expect(p('hello\nworld')).toBe('Hello\nWorld'));
  it('uses word boundaries — preserves hyphen separator', () => expect(p('hello-world')).toBe('Hello-World'));
  it('underscore is a word char — no boundary, only first word capitalized', () => expect(p('hello_world')).toBe('Hello_world'));
  it('capitalizes every word including articles (no exceptions)', () => expect(p('the quick brown fox')).toBe('The Quick Brown Fox'));
  it('handles numbers mixed with words', () => expect(p('chapter 3 intro')).toBe('Chapter 3 Intro'));
});

describe('sentenceCase', () => {
  const p = PROCESSORS.sentenceCase.process;
  it('returns empty string for empty input', () => expect(p('')).toBe(''));
  it('capitalizes first letter only', () => expect(p('hello world')).toBe('Hello world'));
  it('lowercases rest of input', () => expect(p('HELLO WORLD')).toBe('Hello world'));
  it('capitalizes after period-space', () => expect(p('hello. world')).toBe('Hello. World'));
  it('capitalizes after exclamation-space', () => expect(p('hello! world')).toBe('Hello! World'));
  it('capitalizes after question-space', () => expect(p('hello? world')).toBe('Hello? World'));
  it('handles multiple sentences', () => expect(p('hello. world! foo')).toBe('Hello. World! Foo'));
  it('capitalizes only first char across newlines (not per-line)', () => expect(p('hello\nworld')).toBe('Hello\nworld'));
  it('is idempotent on already-sentence-cased input', () => expect(p('Already sentence case')).toBe('Already sentence case'));
  it('handles whitespace-only string', () => expect(p('   ')).toBe('   '));
});

describe('camelCase', () => {
  const p = PROCESSORS.camelCase.process;
  it('returns empty string for empty input', () => expect(p('')).toBe(''));
  it('converts space-separated words', () => expect(p('hello world')).toBe('helloWorld'));
  it('converts hyphen-separated words', () => expect(p('hello-world')).toBe('helloWorld'));
  it('converts underscore-separated words', () => expect(p('hello_world')).toBe('helloWorld'));
  it('lowercases first word from PascalCase input', () => expect(p('Hello World')).toBe('helloWorld'));
  it('converts all-uppercase input', () => expect(p('HELLO WORLD')).toBe('helloWorld'));
  it('handles three words', () => expect(p('hello world foo')).toBe('helloWorldFoo'));
  it('is idempotent on already-camelCase input', () => expect(p('helloWorld')).toBe('helloWorld'));
  it('applies per-line — each line is camel-cased independently', () => expect(p('hello world\nfoo bar')).toBe('helloWorld\nfooBar'));
  it('handles single character', () => expect(p('a')).toBe('a'));
  it('handles single-word input', () => expect(p('hello')).toBe('hello'));
});

describe('snakeCase', () => {
  const p = PROCESSORS.snakeCase.process;
  it('returns empty string for empty input', () => expect(p('')).toBe(''));
  it('converts space-separated words', () => expect(p('hello world')).toBe('hello_world'));
  it('converts PascalCase input', () => expect(p('Hello World')).toBe('hello_world'));
  it('converts hyphen-separated words', () => expect(p('hello-world')).toBe('hello_world'));
  it('converts camelCase to snake_case', () => expect(p('helloWorld')).toBe('hello_world'));
  it('converts all-uppercase input', () => expect(p('HELLO WORLD')).toBe('hello_world'));
  it('handles three words', () => expect(p('hello world foo')).toBe('hello_world_foo'));
  it('applies per-line — each line independently', () => expect(p('hello world\nfoo bar')).toBe('hello_world\nfoo_bar'));
  it('is idempotent on already-snake_case input', () => expect(p('hello_world')).toBe('hello_world'));
});

describe('kebabCase', () => {
  const p = PROCESSORS.kebabCase.process;
  it('returns empty string for empty input', () => expect(p('')).toBe(''));
  it('converts space-separated words', () => expect(p('hello world')).toBe('hello-world'));
  it('converts PascalCase input', () => expect(p('Hello World')).toBe('hello-world'));
  it('converts underscore-separated words', () => expect(p('hello_world')).toBe('hello-world'));
  it('converts camelCase to kebab-case', () => expect(p('helloWorld')).toBe('hello-world'));
  it('converts all-uppercase input', () => expect(p('HELLO WORLD')).toBe('hello-world'));
  it('handles three words', () => expect(p('hello world foo')).toBe('hello-world-foo'));
  it('applies per-line — each line independently', () => expect(p('hello world\nfoo bar')).toBe('hello-world\nfoo-bar'));
  it('is idempotent on already-kebab-case input', () => expect(p('hello-world')).toBe('hello-world'));
});

// --- Cleanup Processors ---

describe('removeExtraSpaces', () => {
  const p = PROCESSORS.removeExtraSpaces.process;
  it('returns empty string for empty input', () => expect(p('')).toBe(''));
  it('leaves single spaces unchanged', () => expect(p('hello world')).toBe('hello world'));
  it('collapses double space to single', () => expect(p('hello  world')).toBe('hello world'));
  it('collapses triple space to single', () => expect(p('hello   world')).toBe('hello world'));
  it('collapses leading spaces to single (does not trim)', () => expect(p('  hello')).toBe(' hello'));
  it('collapses trailing spaces to single (does not trim)', () => expect(p('hello  ')).toBe('hello '));
  it('replaces tabs with a single space', () => expect(p('hello\t\tworld')).toBe('hello world'));
  it('preserves newlines', () => expect(p('hello\nworld')).toBe('hello\nworld'));
  it('collapses spaces per-line across newlines', () => expect(p('a  b\nc  d')).toBe('a b\nc d'));
  it('handles whitespace-only line (tabs/spaces → single space)', () => expect(p('\t\t')).toBe(' '));
});

describe('removeBlankLines', () => {
  const p = PROCESSORS.removeBlankLines.process;
  it('returns empty string for empty input', () => expect(p('')).toBe(''));
  it('leaves non-blank lines unchanged', () => expect(p('hello\nworld')).toBe('hello\nworld'));
  it('removes a single blank line between content', () => expect(p('hello\n\nworld')).toBe('hello\nworld'));
  it('removes multiple consecutive blank lines', () => expect(p('hello\n\n\nworld')).toBe('hello\nworld'));
  it('removes leading blank line', () => expect(p('\nhello')).toBe('hello'));
  it('removes trailing blank line', () => expect(p('hello\n')).toBe('hello'));
  it('removes whitespace-only lines (treated as blank)', () => expect(p('hello\n   \nworld')).toBe('hello\nworld'));
  it('returns empty for all-blank input', () => expect(p('\n\n\n')).toBe(''));
  it('handles single non-blank line', () => expect(p('hello')).toBe('hello'));
});

describe('removeDuplicateLines', () => {
  const p = PROCESSORS.removeDuplicateLines.process;
  it('returns empty string for empty input', () => expect(p('')).toBe(''));
  it('leaves unique lines unchanged', () => expect(p('hello\nworld')).toBe('hello\nworld'));
  it('removes adjacent duplicate line', () => expect(p('hello\nhello')).toBe('hello'));
  it('removes non-adjacent duplicate (second occurrence removed)', () => expect(p('a\nb\na')).toBe('a\nb'));
  it('handles all unique lines', () => expect(p('a\nb\nc')).toBe('a\nb\nc'));
  it('is case-sensitive — Hello and hello are different', () => expect(p('Hello\nhello')).toBe('Hello\nhello'));
  it('deduplicates blank lines (keeps first blank)', () => expect(p('a\n\nb')).toBe('a\n\nb'));
  it('removes all but first blank when multiple blanks', () => expect(p('\n\n')).toBe(''));
  it('removes all duplicate pairs', () => expect(p('a\nb\na\nb')).toBe('a\nb'));
  it('preserves order of first occurrences', () => expect(p('c\na\nb\na\nc')).toBe('c\na\nb'));
});

describe('trimLines', () => {
  const p = PROCESSORS.trimLines.process;
  it('returns empty string for empty input', () => expect(p('')).toBe(''));
  it('trims leading and trailing spaces', () => expect(p('  hello  ')).toBe('hello'));
  it('trims each line in multi-line input', () => expect(p('  hello  \n  world  ')).toBe('hello\nworld'));
  it('leaves already-trimmed lines unchanged', () => expect(p('hello')).toBe('hello'));
  it('trims tabs from each line', () => expect(p('\t\thello\t\t')).toBe('hello'));
  it('reduces whitespace-only line to empty string', () => expect(p('  ')).toBe(''));
  it('preserves blank lines (empty lines stay empty)', () => expect(p('a\n\nb')).toBe('a\n\nb'));
  it('handles mixed indentation styles', () => expect(p('\t hello \t')).toBe('hello'));
});

describe('normalizeWhitespace', () => {
  const p = PROCESSORS.normalizeWhitespace.process;
  it('returns empty string for empty input', () => expect(p('')).toBe(''));
  it('leaves clean single-spaced text unchanged', () => expect(p('hello world')).toBe('hello world'));
  it('collapses multiple spaces to one', () => expect(p('hello  world')).toBe('hello world'));
  it('replaces tabs with a space', () => expect(p('hello\tworld')).toBe('hello world'));
  it('collapses newlines into spaces', () => expect(p('hello\nworld')).toBe('hello world'));
  it('trims leading and trailing whitespace', () => expect(p('  hello world  ')).toBe('hello world'));
  it('collapses mixed whitespace characters', () => expect(p('a\t\tb\n\nc')).toBe('a b c'));
  it('handles whitespace-only string', () => expect(p('   \t\n  ')).toBe(''));
  it('collapses blank lines between content into a single space', () => expect(p('hello\n\nworld')).toBe('hello world'));
});

describe('removeTabs', () => {
  const p = PROCESSORS.removeTabs.process;
  it('returns empty string for empty input', () => expect(p('')).toBe(''));
  it('replaces single tab with a space', () => expect(p('hello\tworld')).toBe('hello world'));
  it('replaces each tab independently (two tabs → two spaces)', () => expect(p('hello\t\tworld')).toBe('hello  world'));
  it('replaces leading tab', () => expect(p('\thello')).toBe(' hello'));
  it('replaces trailing tab', () => expect(p('hello\t')).toBe('hello '));
  it('leaves tab-free text unchanged', () => expect(p('hello')).toBe('hello'));
  it('handles multi-line text with tabs', () => expect(p('hello\nworld\there')).toBe('hello\nworld here'));
  it('preserves spaces (only tabs are replaced)', () => expect(p('hello world')).toBe('hello world'));
  it('handles whitespace-only tab string', () => expect(p('\t\t\t')).toBe('   '));
});
