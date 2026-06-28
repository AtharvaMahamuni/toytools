// Text Processor System — registry (single source of truth).
//
// Every processor is registered here exactly once. The shared widget never imports a
// processor directly; it calls ToyTools.process(id, text), which resolves through
// runProcessor() below. Adding a processor: create the file, add one import + one map
// entry here. No widget, runtime, or routing changes — and never a switch statement.

import type { TextProcessor } from './types';

// transform/
import { uppercase } from './transform/uppercase';
import { lowercase } from './transform/lowercase';
import { titleCase } from './transform/titleCase';
import { sentenceCase } from './transform/sentenceCase';
import { camelCase } from './transform/camelCase';
import { snakeCase } from './transform/snakeCase';
import { kebabCase } from './transform/kebabCase';
import { reverseText } from './transform/reverseText';
import { slugify } from './transform/slugify';

// cleanup/
import { removeExtraSpaces } from './cleanup/removeExtraSpaces';
import { removeBlankLines } from './cleanup/removeBlankLines';
import { removeDuplicateLines } from './cleanup/removeDuplicateLines';
import { trimLines } from './cleanup/trimLines';
import { normalizeWhitespace } from './cleanup/normalizeWhitespace';
import { removeTabs } from './cleanup/removeTabs';
import { removeLineBreaks } from './cleanup/removeLineBreaks';
import { removeAccents } from './cleanup/removeAccents';

// Keyed by processor id. Values are the rich processor objects (id + family + process),
// so future metadata (title, description, …) can be added without changing the API.
export const PROCESSORS: Record<string, TextProcessor> = {
  uppercase,
  lowercase,
  titleCase,
  sentenceCase,
  camelCase,
  snakeCase,
  kebabCase,
  reverseText,
  slugify,
  removeExtraSpaces,
  removeBlankLines,
  removeDuplicateLines,
  trimLines,
  normalizeWhitespace,
  removeTabs,
  removeLineBreaks,
  removeAccents,
};

/**
 * Resolve a processor by id and run it. Never throws: an unknown id logs a warning
 * and returns the input unchanged (mirrors the never-throw style of ToyTools.state).
 * This is the only function the runtime/widget needs.
 */
export function runProcessor(id: string, text: string): string {
  const processor = PROCESSORS[id];
  if (!processor) {
    // eslint-disable-next-line no-console
    console.warn(`[processors] Unknown processor id "${id}" — returning input unchanged.`);
    return text;
  }
  return processor.process(text);
}
