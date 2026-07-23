// GENERATED FILE — do not edit. Run `npm run registries:generate` to refresh.
// Derived from the src/tools/<segment>/<slug>/ directory contract (see scripts/generate-registries.ts).

import type { ToolConfig } from './types';
import { config as ageCalculator } from '@tools/datetime/age-calculator/config';
import { config as base64EncoderDecoder } from '@tools/developer-utilities/base64-encoder-decoder/config';
import { config as binaryTextConverter } from '@tools/developer-utilities/binary-text-converter/config';
import { config as bmiCalculator } from '@tools/health/bmi-calculator/config';
import { config as bodyFatCalculator } from '@tools/health/body-fat-calculator/config';
import { config as bodyWeightTracker } from '@tools/health/body-weight-tracker/config';
import { config as cagrCalculator } from '@tools/finance/cagr-calculator/config';
import { config as camelCaseConverter } from '@tools/text/camel-case-converter/config';
import { config as characterCounter } from '@tools/text/character-counter/config';
import { config as combinationsPermutationsCalculator } from '@tools/math/combinations-permutations-calculator/config';
import { config as compoundInterestCalculator } from '@tools/finance/compound-interest-calculator/config';
import { config as crc32HashGenerator } from '@tools/developer-utilities/crc32-hash-generator/config';
import { config as cronExpressionParser } from '@tools/datetime/cron-expression-parser/config';
import { config as csvCleaner } from '@tools/developer-utilities/csv-cleaner/config';
import { config as csvDiff } from '@tools/developer-utilities/csv-diff/config';
import { config as csvToJsonConverter } from '@tools/developer-utilities/csv-to-json-converter/config';
import { config as csvToTsv } from '@tools/developer-utilities/csv-to-tsv/config';
import { config as dateDifferenceCalculator } from '@tools/datetime/date-difference-calculator/config';
import { config as discountCalculator } from '@tools/number/discount-calculator/config';
import { config as emergencyFundCalculator } from '@tools/finance/emergency-fund-calculator/config';
import { config as findReplace } from '@tools/text/find-replace/config';
import { config as fractionCalculator } from '@tools/math/fraction-calculator/config';
import { config as hexEncoderDecoder } from '@tools/developer-utilities/hex-encoder-decoder/config';
import { config as htmlEntityEncoderDecoder } from '@tools/developer-utilities/html-entity-encoder-decoder/config';
import { config as inflationCalculator } from '@tools/finance/inflation-calculator/config';
import { config as jsonEscape } from '@tools/developer-utilities/json-escape/config';
import { config as jsonFormatter } from '@tools/developer-utilities/json-formatter/config';
import { config as jsonMinifier } from '@tools/developer-utilities/json-minifier/config';
import { config as jsonToCsvConverter } from '@tools/developer-utilities/json-to-csv-converter/config';
import { config as jsonToYamlConverter } from '@tools/developer-utilities/json-to-yaml-converter/config';
import { config as jsonTreeViewer } from '@tools/developer-utilities/json-tree-viewer/config';
import { config as jsonValidator } from '@tools/developer-utilities/json-validator/config';
import { config as jwtDecoder } from '@tools/developer-utilities/jwt-decoder/config';
import { config as kebabCaseConverter } from '@tools/text/kebab-case-converter/config';
import { config as keepScreenAwake } from '@tools/productivity/keep-screen-awake/config';
import { config as letterCounter } from '@tools/text/letter-counter/config';
import { config as lineCounter } from '@tools/text/line-counter/config';
import { config as loremIpsumGenerator } from '@tools/generate/lorem-ipsum-generator/config';
import { config as lowercaseConverter } from '@tools/text/lowercase-converter/config';
import { config as macroCalculator } from '@tools/health/macro-calculator/config';
import { config as marginCalculator } from '@tools/number/margin-calculator/config';
import { config as markupCalculator } from '@tools/number/markup-calculator/config';
import { config as md5HashGenerator } from '@tools/developer-utilities/md5-hash-generator/config';
import { config as normalizeWhitespace } from '@tools/text/normalize-whitespace/config';
import { config as notepad } from '@tools/productivity/notepad/config';
import { config as paragraphCounter } from '@tools/text/paragraph-counter/config';
import { config as passwordGenerator } from '@tools/generate/password-generator/config';
import { config as percentageCalculator } from '@tools/number/percentage-calculator/config';
import { config as pomodoroTimer } from '@tools/productivity/pomodoro-timer/config';
import { config as primeFactorizationCalculator } from '@tools/math/prime-factorization-calculator/config';
import { config as punycodeConverter } from '@tools/developer-utilities/punycode-converter/config';
import { config as qrCodeGenerator } from '@tools/generate/qr-code-generator/config';
import { config as randomStringGenerator } from '@tools/generate/random-string-generator/config';
import { config as readingTimeCalculator } from '@tools/text/reading-time-calculator/config';
import { config as removeAccents } from '@tools/text/remove-accents/config';
import { config as removeBlankLines } from '@tools/text/remove-blank-lines/config';
import { config as removeDuplicateLines } from '@tools/text/remove-duplicate-lines/config';
import { config as removeEmoji } from '@tools/text/remove-emoji/config';
import { config as removeExtraSpaces } from '@tools/text/remove-extra-spaces/config';
import { config as removeLineBreaks } from '@tools/text/remove-line-breaks/config';
import { config as removeTabs } from '@tools/text/remove-tabs/config';
import { config as reverseText } from '@tools/text/reverse-text/config';
import { config as roiCalculator } from '@tools/finance/roi-calculator/config';
import { config as rot13EncoderDecoder } from '@tools/developer-utilities/rot13-encoder-decoder/config';
import { config as ruleOf72Calculator } from '@tools/finance/rule-of-72-calculator/config';
import { config as savingsGoalCalculator } from '@tools/finance/savings-goal-calculator/config';
import { config as scientificCalculator } from '@tools/number/scientific-calculator/config';
import { config as sentenceCaseConverter } from '@tools/text/sentence-case-converter/config';
import { config as sentenceCounter } from '@tools/text/sentence-counter/config';
import { config as sha1HashGenerator } from '@tools/developer-utilities/sha1-hash-generator/config';
import { config as sha256HashGenerator } from '@tools/developer-utilities/sha256-hash-generator/config';
import { config as sha512HashGenerator } from '@tools/developer-utilities/sha512-hash-generator/config';
import { config as sipCalculator } from '@tools/finance/sip-calculator/config';
import { config as slugifyText } from '@tools/text/slugify-text/config';
import { config as snakeCaseConverter } from '@tools/text/snake-case-converter/config';
import { config as spaceCounter } from '@tools/text/space-counter/config';
import { config as taxCalculator } from '@tools/number/tax-calculator/config';
import { config as tdeeCalculator } from '@tools/health/tdee-calculator/config';
import { config as textCompare } from '@tools/text/text-compare/config';
import { config as timezoneConverter } from '@tools/datetime/timezone-converter/config';
import { config as tipCalculator } from '@tools/number/tip-calculator/config';
import { config as titleCaseConverter } from '@tools/text/title-case-converter/config';
import { config as todoList } from '@tools/productivity/todo-list/config';
import { config as trimText } from '@tools/text/trim-text/config';
import { config as unixTimestampConverter } from '@tools/datetime/unix-timestamp-converter/config';
import { config as uppercaseConverter } from '@tools/text/uppercase-converter/config';
import { config as urlEncoderDecoder } from '@tools/developer-utilities/url-encoder-decoder/config';
import { config as uuidGenerator } from '@tools/generate/uuid-generator/config';
import { config as waterIntakeTracker } from '@tools/health/water-intake-tracker/config';
import { config as wordCounter } from '@tools/text/word-counter/config';
import { config as wordFrequencyCounter } from '@tools/text/word-frequency-counter/config';
import { config as yamlToJsonConverter } from '@tools/developer-utilities/yaml-to-json-converter/config';

export const toolConfigs: ToolConfig[] = [
  ageCalculator,
  base64EncoderDecoder,
  binaryTextConverter,
  bmiCalculator,
  bodyFatCalculator,
  bodyWeightTracker,
  cagrCalculator,
  camelCaseConverter,
  characterCounter,
  combinationsPermutationsCalculator,
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
  fractionCalculator,
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
  macroCalculator,
  marginCalculator,
  markupCalculator,
  md5HashGenerator,
  normalizeWhitespace,
  notepad,
  paragraphCounter,
  passwordGenerator,
  percentageCalculator,
  pomodoroTimer,
  primeFactorizationCalculator,
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
  tdeeCalculator,
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
  waterIntakeTracker,
  wordCounter,
  wordFrequencyCounter,
  yamlToJsonConverter,
];
