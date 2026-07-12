// GENERATED FILE — do not edit. Run `npm run registries:generate` to refresh.
// Derived from the src/tools/<segment>/<slug>/ directory contract (see scripts/generate-registries.ts).

import type { Knowledge } from './types';
import { knowledge as ageCalculator } from '@tools/datetime/age-calculator/knowledge';
import { knowledge as base64EncoderDecoder } from '@tools/developer-utilities/base64-encoder-decoder/knowledge';
import { knowledge as binaryTextConverter } from '@tools/developer-utilities/binary-text-converter/knowledge';
import { knowledge as cagrCalculator } from '@tools/finance/cagr-calculator/knowledge';
import { knowledge as camelCaseConverter } from '@tools/text/camel-case-converter/knowledge';
import { knowledge as characterCounter } from '@tools/text/character-counter/knowledge';
import { knowledge as compoundInterestCalculator } from '@tools/finance/compound-interest-calculator/knowledge';
import { knowledge as crc32HashGenerator } from '@tools/developer-utilities/crc32-hash-generator/knowledge';
import { knowledge as cronExpressionParser } from '@tools/datetime/cron-expression-parser/knowledge';
import { knowledge as csvCleaner } from '@tools/developer-utilities/csv-cleaner/knowledge';
import { knowledge as csvDiff } from '@tools/developer-utilities/csv-diff/knowledge';
import { knowledge as csvToJsonConverter } from '@tools/developer-utilities/csv-to-json-converter/knowledge';
import { knowledge as csvToTsv } from '@tools/developer-utilities/csv-to-tsv/knowledge';
import { knowledge as dateDifferenceCalculator } from '@tools/datetime/date-difference-calculator/knowledge';
import { knowledge as discountCalculator } from '@tools/number/discount-calculator/knowledge';
import { knowledge as emergencyFundCalculator } from '@tools/finance/emergency-fund-calculator/knowledge';
import { knowledge as findReplace } from '@tools/text/find-replace/knowledge';
import { knowledge as hexEncoderDecoder } from '@tools/developer-utilities/hex-encoder-decoder/knowledge';
import { knowledge as htmlEntityEncoderDecoder } from '@tools/developer-utilities/html-entity-encoder-decoder/knowledge';
import { knowledge as inflationCalculator } from '@tools/finance/inflation-calculator/knowledge';
import { knowledge as jsonEscape } from '@tools/developer-utilities/json-escape/knowledge';
import { knowledge as jsonFormatter } from '@tools/developer-utilities/json-formatter/knowledge';
import { knowledge as jsonMinifier } from '@tools/developer-utilities/json-minifier/knowledge';
import { knowledge as jsonToCsvConverter } from '@tools/developer-utilities/json-to-csv-converter/knowledge';
import { knowledge as jsonToYamlConverter } from '@tools/developer-utilities/json-to-yaml-converter/knowledge';
import { knowledge as jsonTreeViewer } from '@tools/developer-utilities/json-tree-viewer/knowledge';
import { knowledge as jsonValidator } from '@tools/developer-utilities/json-validator/knowledge';
import { knowledge as jwtDecoder } from '@tools/developer-utilities/jwt-decoder/knowledge';
import { knowledge as kebabCaseConverter } from '@tools/text/kebab-case-converter/knowledge';
import { knowledge as keepScreenAwake } from '@tools/productivity/keep-screen-awake/knowledge';
import { knowledge as letterCounter } from '@tools/text/letter-counter/knowledge';
import { knowledge as lineCounter } from '@tools/text/line-counter/knowledge';
import { knowledge as loremIpsumGenerator } from '@tools/generate/lorem-ipsum-generator/knowledge';
import { knowledge as lowercaseConverter } from '@tools/text/lowercase-converter/knowledge';
import { knowledge as marginCalculator } from '@tools/number/margin-calculator/knowledge';
import { knowledge as markupCalculator } from '@tools/number/markup-calculator/knowledge';
import { knowledge as md5HashGenerator } from '@tools/developer-utilities/md5-hash-generator/knowledge';
import { knowledge as normalizeWhitespace } from '@tools/text/normalize-whitespace/knowledge';
import { knowledge as notepad } from '@tools/productivity/notepad/knowledge';
import { knowledge as paragraphCounter } from '@tools/text/paragraph-counter/knowledge';
import { knowledge as passwordGenerator } from '@tools/generate/password-generator/knowledge';
import { knowledge as percentageCalculator } from '@tools/number/percentage-calculator/knowledge';
import { knowledge as pomodoroTimer } from '@tools/productivity/pomodoro-timer/knowledge';
import { knowledge as punycodeConverter } from '@tools/developer-utilities/punycode-converter/knowledge';
import { knowledge as qrCodeGenerator } from '@tools/generate/qr-code-generator/knowledge';
import { knowledge as randomStringGenerator } from '@tools/generate/random-string-generator/knowledge';
import { knowledge as readingTimeCalculator } from '@tools/text/reading-time-calculator/knowledge';
import { knowledge as removeAccents } from '@tools/text/remove-accents/knowledge';
import { knowledge as removeBlankLines } from '@tools/text/remove-blank-lines/knowledge';
import { knowledge as removeDuplicateLines } from '@tools/text/remove-duplicate-lines/knowledge';
import { knowledge as removeEmoji } from '@tools/text/remove-emoji/knowledge';
import { knowledge as removeExtraSpaces } from '@tools/text/remove-extra-spaces/knowledge';
import { knowledge as removeLineBreaks } from '@tools/text/remove-line-breaks/knowledge';
import { knowledge as removeTabs } from '@tools/text/remove-tabs/knowledge';
import { knowledge as reverseText } from '@tools/text/reverse-text/knowledge';
import { knowledge as roiCalculator } from '@tools/finance/roi-calculator/knowledge';
import { knowledge as rot13EncoderDecoder } from '@tools/developer-utilities/rot13-encoder-decoder/knowledge';
import { knowledge as ruleOf72Calculator } from '@tools/finance/rule-of-72-calculator/knowledge';
import { knowledge as savingsGoalCalculator } from '@tools/finance/savings-goal-calculator/knowledge';
import { knowledge as scientificCalculator } from '@tools/number/scientific-calculator/knowledge';
import { knowledge as sentenceCaseConverter } from '@tools/text/sentence-case-converter/knowledge';
import { knowledge as sentenceCounter } from '@tools/text/sentence-counter/knowledge';
import { knowledge as sha1HashGenerator } from '@tools/developer-utilities/sha1-hash-generator/knowledge';
import { knowledge as sha256HashGenerator } from '@tools/developer-utilities/sha256-hash-generator/knowledge';
import { knowledge as sha512HashGenerator } from '@tools/developer-utilities/sha512-hash-generator/knowledge';
import { knowledge as sipCalculator } from '@tools/finance/sip-calculator/knowledge';
import { knowledge as slugifyText } from '@tools/text/slugify-text/knowledge';
import { knowledge as snakeCaseConverter } from '@tools/text/snake-case-converter/knowledge';
import { knowledge as spaceCounter } from '@tools/text/space-counter/knowledge';
import { knowledge as taxCalculator } from '@tools/number/tax-calculator/knowledge';
import { knowledge as textCompare } from '@tools/text/text-compare/knowledge';
import { knowledge as timezoneConverter } from '@tools/datetime/timezone-converter/knowledge';
import { knowledge as tipCalculator } from '@tools/number/tip-calculator/knowledge';
import { knowledge as titleCaseConverter } from '@tools/text/title-case-converter/knowledge';
import { knowledge as todoList } from '@tools/productivity/todo-list/knowledge';
import { knowledge as trimText } from '@tools/text/trim-text/knowledge';
import { knowledge as unixTimestampConverter } from '@tools/datetime/unix-timestamp-converter/knowledge';
import { knowledge as uppercaseConverter } from '@tools/text/uppercase-converter/knowledge';
import { knowledge as urlEncoderDecoder } from '@tools/developer-utilities/url-encoder-decoder/knowledge';
import { knowledge as uuidGenerator } from '@tools/generate/uuid-generator/knowledge';
import { knowledge as wordCounter } from '@tools/text/word-counter/knowledge';
import { knowledge as wordFrequencyCounter } from '@tools/text/word-frequency-counter/knowledge';
import { knowledge as yamlToJsonConverter } from '@tools/developer-utilities/yaml-to-json-converter/knowledge';

export const authoredKnowledge: Knowledge[] = [
  ageCalculator,
  base64EncoderDecoder,
  binaryTextConverter,
  cagrCalculator,
  camelCaseConverter,
  characterCounter,
  compoundInterestCalculator,
  crc32HashGenerator,
  cronExpressionParser,
  csvCleaner,
  csvDiff,
  csvToJsonConverter,
  csvToTsv,
  dateDifferenceCalculator,
  discountCalculator,
  emergencyFundCalculator,
  findReplace,
  hexEncoderDecoder,
  htmlEntityEncoderDecoder,
  inflationCalculator,
  jsonEscape,
  jsonFormatter,
  jsonMinifier,
  jsonToCsvConverter,
  jsonToYamlConverter,
  jsonTreeViewer,
  jsonValidator,
  jwtDecoder,
  kebabCaseConverter,
  keepScreenAwake,
  letterCounter,
  lineCounter,
  loremIpsumGenerator,
  lowercaseConverter,
  marginCalculator,
  markupCalculator,
  md5HashGenerator,
  normalizeWhitespace,
  notepad,
  paragraphCounter,
  passwordGenerator,
  percentageCalculator,
  pomodoroTimer,
  punycodeConverter,
  qrCodeGenerator,
  randomStringGenerator,
  readingTimeCalculator,
  removeAccents,
  removeBlankLines,
  removeDuplicateLines,
  removeEmoji,
  removeExtraSpaces,
  removeLineBreaks,
  removeTabs,
  reverseText,
  roiCalculator,
  rot13EncoderDecoder,
  ruleOf72Calculator,
  savingsGoalCalculator,
  scientificCalculator,
  sentenceCaseConverter,
  sentenceCounter,
  sha1HashGenerator,
  sha256HashGenerator,
  sha512HashGenerator,
  sipCalculator,
  slugifyText,
  snakeCaseConverter,
  spaceCounter,
  taxCalculator,
  textCompare,
  timezoneConverter,
  tipCalculator,
  titleCaseConverter,
  todoList,
  trimText,
  unixTimestampConverter,
  uppercaseConverter,
  urlEncoderDecoder,
  uuidGenerator,
  wordCounter,
  wordFrequencyCounter,
  yamlToJsonConverter,
];
