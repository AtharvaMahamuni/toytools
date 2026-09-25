// Deterministic cleanup for a pasted chat transcript.
// The patterns below are the whole ruleset. There is no per-vendor scraper.

export type ChatKeep = 'all' | 'user' | 'assistant' | 'code';

export interface ChatCleanOptions {
  removeTimestamps: boolean;
  removeSpeakerLabels: boolean;
  normalizeBlankLines: boolean;
  removeEmptyFences: boolean;
  normalizeWhitespace: boolean;
  removeCitationChips: boolean;
  keep: ChatKeep;
}

export const CHAT_CLEAN_DEFAULTS: ChatCleanOptions = {
  removeTimestamps: true,
  removeSpeakerLabels: true,
  normalizeBlankLines: true,
  removeEmptyFences: true,
  normalizeWhitespace: true,
  removeCitationChips: true,
  keep: 'all',
};

export interface ChatCleanResult {
  text: string;
  /** Non-empty input lines that are not in the output. */
  removedLines: number;
  /** True when a keep mode drops turns or text outside fences. */
  lossy: boolean;
  /** Explains a filter that dropped text, or why a filter could not run. */
  note: string;
}

const SPEAKER_NAMES = 'user|human|you|assistant|chatgpt|claude|gemini|grok|model|ai|system';

/** Optional leading [time], then a known speaker label, then the rest of the line. */
const SPEAKER_LINE_RE = new RegExp(
  `^(?:\\[\\d{1,2}:\\d{2}(?::\\d{2})?(?:\\s*[AP]M)?\\]\\s*)?(?:\\*\\*)?(${SPEAKER_NAMES})(?:\\*\\*)?\\s*:\\s*([\\s\\S]*)$`,
  'i',
);

const TIMESTAMP_LINE_RE =
  /^(?:\[\d{1,2}:\d{2}(?::\d{2})?(?:\s*[AP]M)?\]|\d{1,2}:\d{2}(?::\d{2})?\s*[AP]M|\d{4}-\d{2}-\d{2}(?:[T ]\d{2}:\d{2}(?::\d{2})?(?:\.\d+)?Z?)?)$/i;

const LEADING_TIME_RE =
  /^(?:\[\d{1,2}:\d{2}(?::\d{2})?(?:\s*[AP]M)?\]|\d{1,2}:\d{2}(?::\d{2})?\s*[AP]M)\s+/i;

const TRAILING_TIME_RE = /\s*\[\d{1,2}:\d{2}(?::\d{2})?(?:\s*[AP]M)?\]\s*$/i;

const CHIP_RE = /【[^】]*】/g;
const ONLY_FOOTNOTE_RE = /^\[\d+\]$/;
const EMPTY_FENCE_RE = /```[^\n]*\n[ \t]*```/g;

type Role = 'user' | 'assistant' | 'system' | 'other' | 'preamble';

interface Turn {
  role: Role;
  /** Original speaker line, when this turn started with one. */
  head: string | null;
  body: string[];
}

function roleOf(name: string): Role {
  const n = name.toLowerCase();
  if (n === 'user' || n === 'human' || n === 'you') return 'user';
  if (n === 'assistant' || n === 'chatgpt' || n === 'claude' || n === 'gemini' || n === 'grok' || n === 'model' || n === 'ai') {
    return 'assistant';
  }
  if (n === 'system') return 'system';
  return 'other';
}

function splitTurns(text: string): Turn[] {
  const turns: Turn[] = [];
  let current: Turn | null = null;
  for (const line of text.split('\n')) {
    if (SPEAKER_LINE_RE.test(line)) {
      if (current) turns.push(current);
      const match = line.match(SPEAKER_LINE_RE);
      current = { role: roleOf(match?.[1] ?? ''), head: line, body: [] };
    } else if (current) {
      current.body.push(line);
    } else {
      current = { role: 'preamble', head: null, body: [line] };
    }
  }
  if (current) turns.push(current);
  return turns;
}

function messageOnSpeakerLine(head: string): string {
  return (head.match(SPEAKER_LINE_RE)?.[2] ?? '').trim();
}

function stripTime(line: string, enabled: boolean): string {
  if (!enabled) return line;
  if (TIMESTAMP_LINE_RE.test(line.trim())) return '';
  return line.replace(LEADING_TIME_RE, '').replace(TRAILING_TIME_RE, '').trimEnd();
}

function stripChips(line: string, enabled: boolean): string {
  if (!enabled) return line;
  if (ONLY_FOOTNOTE_RE.test(line.trim())) return '';
  return line.replace(CHIP_RE, '');
}

function tidyLine(line: string, options: ChatCleanOptions): string {
  let next = stripChips(stripTime(line, options.removeTimestamps), options.removeCitationChips);
  if (options.normalizeWhitespace) next = next.replace(/[ \t]{2,}/g, ' ').replace(/[ \t]+$/g, '');
  return next;
}

function turnLines(turn: Turn, options: ChatCleanOptions): string[] {
  const lines: string[] = [];
  if (turn.head) {
    if (options.removeSpeakerLabels) {
      const message = tidyLine(messageOnSpeakerLine(turn.head), options);
      if (message) lines.push(message);
    } else {
      const head = tidyLine(turn.head, options);
      if (head) lines.push(head);
    }
  }
  for (const line of turn.body) lines.push(tidyLine(line, options));
  return lines;
}

function extractCode(text: string): string {
  const blocks: string[] = [];
  const re = /```[^\n]*\n[\s\S]*?\n```/g;
  for (const match of text.matchAll(re)) {
    const block = match[0].trim();
    if (!/```[^\n]*\n[ \t]*```/.test(block)) blocks.push(block);
  }
  return blocks.join('\n\n');
}

function finish(input: string, text: string, options: ChatCleanOptions, note: string): ChatCleanResult {
  let out = text;
  if (options.removeEmptyFences) out = out.replace(EMPTY_FENCE_RE, '');
  if (options.normalizeBlankLines) out = out.replace(/\n{3,}/g, '\n\n');
  out = out.trim();
  const kept = new Set(out.split('\n').map(line => line.trim()).filter(Boolean));
  const removedLines = input.split('\n').filter(line => line.trim() && !kept.has(line.trim())).length;
  return {
    text: out,
    removedLines,
    lossy: options.keep !== 'all',
    note,
  };
}

export function cleanChatExport(input: string, options: ChatCleanOptions = CHAT_CLEAN_DEFAULTS): ChatCleanResult {
  const text = input.replace(/\r\n/g, '\n');
  if (!text.trim()) return { text: '', removedLines: 0, lossy: options.keep !== 'all', note: '' };

  if (options.keep === 'code') {
    const code = extractCode(text);
    const note = code
      ? 'Keeping code blocks only. Everything outside a fence is dropped.'
      : 'No code fences found.';
    return finish(text, code, { ...options, removeEmptyFences: false }, note);
  }

  const turns = splitTurns(text);
  const labeled = turns.some(turn => turn.role !== 'preamble');
  let note = '';
  let kept = turns;

  if (options.keep === 'user' || options.keep === 'assistant') {
    if (!labeled) {
      note = 'No speaker labels found, so this filter left the text in place.';
    } else {
      kept = turns.filter(turn => turn.role === options.keep);
      note = options.keep === 'user'
        ? 'Keeping user turns only. Assistant and system turns are dropped.'
        : 'Keeping assistant turns only. User and system turns are dropped.';
    }
  }

  const lines = kept.flatMap(turn => turnLines(turn, options));
  return finish(text, lines.join('\n'), options, note);
}
