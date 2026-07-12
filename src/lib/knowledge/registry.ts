// Knowledge registry — the single import hub for every tool's knowledge.ts, mirroring
// src/data/registry.ts. Explicit imports (not import.meta.glob) so this module is consumable
// by tsx build scripts (scripts/validate-knowledge.ts) AND vitest AND Astro alike.
//
// Adding a tool's knowledge: one import line + one KNOWLEDGE_ENTRIES entry below.

import type { Knowledge } from './types';
import { simulationKnowledge } from '@lib/simulation/derived';
import { knowledge as ageCalculator } from '@tools/datetime/age-calculator/knowledge';
import { knowledge as dateDifferenceCalculator } from '@tools/datetime/date-difference-calculator/knowledge';
import { knowledge as timezoneConverter } from '@tools/datetime/timezone-converter/knowledge';
import { knowledge as unixTimestampConverter } from '@tools/datetime/unix-timestamp-converter/knowledge';
import { knowledge as cronExpressionParser } from '@tools/datetime/cron-expression-parser/knowledge';
import { knowledge as qrCodeGenerator } from '@tools/generate/qr-code-generator/knowledge';
import { knowledge as loremIpsumGenerator } from '@tools/generate/lorem-ipsum-generator/knowledge';
import { knowledge as randomStringGenerator } from '@tools/generate/random-string-generator/knowledge';
import { knowledge as uuidGenerator } from '@tools/generate/uuid-generator/knowledge';
import { knowledge as passwordGenerator } from '@tools/generate/password-generator/knowledge';
import { knowledge as csvCleaner } from '@tools/developer-utilities/csv-cleaner/knowledge';
import { knowledge as csvToTsv } from '@tools/developer-utilities/csv-to-tsv/knowledge';
import { knowledge as csvDiff } from '@tools/developer-utilities/csv-diff/knowledge';
import { knowledge as cagrCalculator } from '@tools/finance/cagr-calculator/knowledge';
import { knowledge as roiCalculator } from '@tools/finance/roi-calculator/knowledge';
import { knowledge as wordFrequencyCounter } from '@tools/text/word-frequency-counter/knowledge';
import { knowledge as removeEmoji } from '@tools/text/remove-emoji/knowledge';
import { knowledge as rot13EncoderDecoder } from '@tools/developer-utilities/rot13-encoder-decoder/knowledge';
import { knowledge as jsonEscape } from '@tools/developer-utilities/json-escape/knowledge';
import { knowledge as sipCalculator } from '@tools/finance/sip-calculator/knowledge';
import { knowledge as removeAccents } from '@tools/text/remove-accents/knowledge';
import { knowledge as slugifyText } from '@tools/text/slugify-text/knowledge';
import { knowledge as removeLineBreaks } from '@tools/text/remove-line-breaks/knowledge';
import { knowledge as reverseText } from '@tools/text/reverse-text/knowledge';
import { knowledge as taxCalculator } from '@tools/number/tax-calculator/knowledge';
import { knowledge as markupCalculator } from '@tools/number/markup-calculator/knowledge';
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

// --- Money & Finance ---
import { knowledge as compoundInterestCalculator } from '@tools/finance/compound-interest-calculator/knowledge';
import { knowledge as ruleOf72Calculator }         from '@tools/finance/rule-of-72-calculator/knowledge';
import { knowledge as inflationCalculator }         from '@tools/finance/inflation-calculator/knowledge';
import { knowledge as savingsGoalCalculator }       from '@tools/finance/savings-goal-calculator/knowledge';
import { knowledge as emergencyFundCalculator }     from '@tools/finance/emergency-fund-calculator/knowledge';
import { knowledge as scientificCalculator }        from '@tools/number/scientific-calculator/knowledge';

// --- Physics ---
import { knowledge as heatTransferSimulator }      from '@tools/physics/heat-transfer-simulator/knowledge';

/** Every authored knowledge entry. */
export const KNOWLEDGE_ENTRIES: Knowledge[] = [
  ...simulationKnowledge,
  ageCalculator,
  dateDifferenceCalculator,
  timezoneConverter,
  unixTimestampConverter,
  cronExpressionParser,
  qrCodeGenerator,
  loremIpsumGenerator,
  randomStringGenerator,
  uuidGenerator,
  passwordGenerator,
  csvCleaner,
  csvToTsv,
  csvDiff,
  cagrCalculator,
  roiCalculator,
  wordFrequencyCounter,
  removeEmoji,
  rot13EncoderDecoder,
  jsonEscape,
  sipCalculator,
  removeAccents,
  slugifyText,
  removeLineBreaks,
  reverseText,
  taxCalculator,
  markupCalculator,
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
  compoundInterestCalculator,
  ruleOf72Calculator,
  inflationCalculator,
  savingsGoalCalculator,
  emergencyFundCalculator,
  scientificCalculator,
  heatTransferSimulator,
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
