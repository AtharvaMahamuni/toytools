// Knowledge registry — the single import hub for every tool's knowledge.ts, mirroring
// src/data/registry.ts. Explicit imports (not import.meta.glob) so this module is consumable
// by tsx build scripts (scripts/validate-knowledge.ts) AND vitest AND Astro alike.
//
// Adding a tool's knowledge: one import line + one KNOWLEDGE_ENTRIES entry below.

import type { Knowledge } from './types';
import { knowledge as punycodeConverter } from '@tools/developer-utilities/punycode-converter/knowledge';
import { knowledge as crc32HashGenerator } from '@tools/developer-utilities/crc32-hash-generator/knowledge';
import { knowledge as binaryTextConverter } from '@tools/developer-utilities/binary-text-converter/knowledge';

// --- Developer tools (Phase D pilot) ---
import { knowledge as base64 }        from '@tools/developer-utilities/base64-encoder-decoder/knowledge';
import { knowledge as urlCodec }      from '@tools/developer-utilities/url-encoder-decoder/knowledge';
import { knowledge as htmlEntity }    from '@tools/developer-utilities/html-entity-encoder-decoder/knowledge';
import { knowledge as md5 }           from '@tools/developer-utilities/md5-hash-generator/knowledge';
import { knowledge as sha1 }          from '@tools/developer-utilities/sha1-hash-generator/knowledge';
import { knowledge as sha256 }        from '@tools/developer-utilities/sha256-hash-generator/knowledge';
import { knowledge as sha512 }        from '@tools/developer-utilities/sha512-hash-generator/knowledge';
import { knowledge as hexCodec }      from '@tools/developer-utilities/hex-encoder-decoder/knowledge';
import { knowledge as jsonFormatter }   from '@tools/developer-utilities/json-formatter/knowledge';
import { knowledge as jsonMinifier }    from '@tools/developer-utilities/json-minifier/knowledge';
import { knowledge as jsonValidator }   from '@tools/developer-utilities/json-validator/knowledge';
import { knowledge as jsonToCsv }       from '@tools/developer-utilities/json-to-csv-converter/knowledge';
import { knowledge as csvToJson }       from '@tools/developer-utilities/csv-to-json-converter/knowledge';
import { knowledge as jsonToYaml }      from '@tools/developer-utilities/json-to-yaml-converter/knowledge';
import { knowledge as yamlToJson }      from '@tools/developer-utilities/yaml-to-json-converter/knowledge';
import { knowledge as jsonTreeViewer }  from '@tools/developer-utilities/json-tree-viewer/knowledge';
import { knowledge as jwtDecoder }      from '@tools/developer-utilities/jwt-decoder/knowledge';

// --- Number utilities ---
import { knowledge as tipCalculator }        from '@tools/number/tip-calculator/knowledge';
import { knowledge as discountCalculator }   from '@tools/number/discount-calculator/knowledge';
import { knowledge as marginCalculator }     from '@tools/number/margin-calculator/knowledge';

// --- Productivity ---
import { knowledge as pomodoroTimer } from '@tools/productivity/pomodoro-timer/knowledge';

// --- Text utilities (text-metric / text-counting family) ---
import { knowledge as wordCounter }      from '@tools/text/word-counter/knowledge';
import { knowledge as characterCounter } from '@tools/text/character-counter/knowledge';
import { knowledge as sentenceCounter }  from '@tools/text/sentence-counter/knowledge';
import { knowledge as paragraphCounter } from '@tools/text/paragraph-counter/knowledge';
import { knowledge as readingTime }      from '@tools/text/reading-time-calculator/knowledge';
import { knowledge as letterCounter }    from '@tools/text/letter-counter/knowledge';
import { knowledge as lineCounter }      from '@tools/text/line-counter/knowledge';
import { knowledge as spaceCounter }     from '@tools/text/space-counter/knowledge';

// --- Text utilities (text-transform / case-converters group) ---
import { knowledge as uppercaseConverter }    from '@tools/text/uppercase-converter/knowledge';
import { knowledge as lowercaseConverter }    from '@tools/text/lowercase-converter/knowledge';
import { knowledge as titleCaseConverter }    from '@tools/text/title-case-converter/knowledge';
import { knowledge as sentenceCaseConverter } from '@tools/text/sentence-case-converter/knowledge';
import { knowledge as camelCaseConverter }    from '@tools/text/camel-case-converter/knowledge';
import { knowledge as snakeCaseConverter }    from '@tools/text/snake-case-converter/knowledge';
import { knowledge as kebabCaseConverter }    from '@tools/text/kebab-case-converter/knowledge';

// --- Text utilities (text-cleanup family) ---
import { knowledge as removeExtraSpaces }    from '@tools/text/remove-extra-spaces/knowledge';
import { knowledge as removeBlankLines }     from '@tools/text/remove-blank-lines/knowledge';
import { knowledge as removeDuplicateLines } from '@tools/text/remove-duplicate-lines/knowledge';
import { knowledge as trimText }             from '@tools/text/trim-text/knowledge';
import { knowledge as normalizeWhitespace }  from '@tools/text/normalize-whitespace/knowledge';
import { knowledge as removeTabs }           from '@tools/text/remove-tabs/knowledge';

// --- Text utilities (text-interactive) ---
import { knowledge as findReplace }  from '@tools/text/find-replace/knowledge';
import { knowledge as textCompare }  from '@tools/text/text-compare/knowledge';

// --- Productivity ---
import { knowledge as todoList }        from '@tools/productivity/todo-list/knowledge';
import { knowledge as notepad }         from '@tools/productivity/notepad/knowledge';
import { knowledge as keepScreenAwake } from '@tools/productivity/keep-screen-awake/knowledge';

// --- Number utilities ---
import { knowledge as percentageCalculator } from '@tools/number/percentage-calculator/knowledge';

/** Every authored knowledge entry. */
export const KNOWLEDGE_ENTRIES: Knowledge[] = [
  punycodeConverter,
  crc32HashGenerator,
  binaryTextConverter,
  pomodoroTimer,
  marginCalculator,
  base64,
  urlCodec,
  htmlEntity,
  md5,
  sha1,
  sha256,
  sha512,
  hexCodec,
  jsonFormatter,
  jsonMinifier,
  jsonValidator,
  discountCalculator,
  tipCalculator,
  jsonToCsv,
  csvToJson,
  jsonToYaml,
  yamlToJson,
  jsonTreeViewer,
  jwtDecoder,
  wordCounter,
  characterCounter,
  sentenceCounter,
  paragraphCounter,
  readingTime,
  letterCounter,
  lineCounter,
  spaceCounter,
  uppercaseConverter,
  lowercaseConverter,
  titleCaseConverter,
  sentenceCaseConverter,
  camelCaseConverter,
  snakeCaseConverter,
  kebabCaseConverter,
  removeExtraSpaces,
  removeBlankLines,
  removeDuplicateLines,
  trimText,
  normalizeWhitespace,
  removeTabs,
  findReplace,
  textCompare,
  todoList,
  notepad,
  keepScreenAwake,
  percentageCalculator,
];

/** Build a slug → Knowledge map from a list. Pure, so tests can pass fixtures. */
export function buildKnowledgeMap(entries: Knowledge[]): Map<string, Knowledge> {
  const map = new Map<string, Knowledge>();
  for (const entry of entries) {
    map.set(entry.slug, entry);
  }
  return map;
}

/** Prebuilt map over the registered entries — O(1) lookups. */
export const KNOWLEDGE: Map<string, Knowledge> = buildKnowledgeMap(KNOWLEDGE_ENTRIES);

/** Look up one tool's knowledge. Never throws; returns undefined when absent. */
export function getKnowledge(slug: string): Knowledge | undefined {
  return KNOWLEDGE.get(slug);
}

/** True when a tool has an authored knowledge file. */
export function hasKnowledge(slug: string): boolean {
  return KNOWLEDGE.has(slug);
}
