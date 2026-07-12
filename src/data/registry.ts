import type { ToolConfig } from './types';
import { simulationTools } from '@lib/simulation/derived';
import { config as ageCalculator } from '@tools/datetime/age-calculator/config';
import { config as dateDifferenceCalculator } from '@tools/datetime/date-difference-calculator/config';
import { config as timezoneConverter } from '@tools/datetime/timezone-converter/config';
import { config as unixTimestampConverter } from '@tools/datetime/unix-timestamp-converter/config';
import { config as cronExpressionParser } from '@tools/datetime/cron-expression-parser/config';
import { config as qrCodeGenerator } from '@tools/generate/qr-code-generator/config';
import { config as loremIpsumGenerator } from '@tools/generate/lorem-ipsum-generator/config';
import { config as randomStringGenerator } from '@tools/generate/random-string-generator/config';
import { config as uuidGenerator } from '@tools/generate/uuid-generator/config';
import { config as passwordGenerator } from '@tools/generate/password-generator/config';
import { config as csvCleaner } from '@tools/developer-utilities/csv-cleaner/config';
import { config as csvToTsv } from '@tools/developer-utilities/csv-to-tsv/config';
import { config as csvDiff } from '@tools/developer-utilities/csv-diff/config';
import { config as cagrCalculator } from '@tools/finance/cagr-calculator/config';
import { config as roiCalculator } from '@tools/finance/roi-calculator/config';
import { config as wordFrequencyCounter } from '@tools/text/word-frequency-counter/config';
import { config as removeEmoji } from '@tools/text/remove-emoji/config';
import { config as rot13EncoderDecoder } from '@tools/developer-utilities/rot13-encoder-decoder/config';
import { config as jsonEscape } from '@tools/developer-utilities/json-escape/config';
import { config as sipCalculator } from '@tools/finance/sip-calculator/config';
import { config as removeAccents } from '@tools/text/remove-accents/config';
import { config as slugifyText } from '@tools/text/slugify-text/config';
import { config as removeLineBreaks } from '@tools/text/remove-line-breaks/config';
import { config as reverseText } from '@tools/text/reverse-text/config';
import { config as taxCalculator } from '@tools/number/tax-calculator/config';
import { config as markupCalculator } from '@tools/number/markup-calculator/config';
import { config as punycodeConverter } from '@tools/developer-utilities/punycode-converter/config';
import { config as crc32HashGenerator } from '@tools/developer-utilities/crc32-hash-generator/config';
import { config as binaryTextConverter } from '@tools/developer-utilities/binary-text-converter/config';
import { config as wordCounter }           from '@tools/text/word-counter/config';
import { config as characterCounter }      from '@tools/text/character-counter/config';
import { config as readingTimeCalculator } from '@tools/text/reading-time-calculator/config';
import { config as sentenceCounter }       from '@tools/text/sentence-counter/config';
import { config as paragraphCounter }      from '@tools/text/paragraph-counter/config';
import { config as letterCounter }         from '@tools/text/letter-counter/config';
import { config as lineCounter }           from '@tools/text/line-counter/config';
import { config as spaceCounter }          from '@tools/text/space-counter/config';
// Text interactive engine
import { config as findReplace }           from '@tools/text/find-replace/config';
import { config as textCompare }           from '@tools/text/text-compare/config';
// Text processor engine — transform family
import { config as uppercaseConverter }    from '@tools/text/uppercase-converter/config';
import { config as lowercaseConverter }    from '@tools/text/lowercase-converter/config';
import { config as titleCaseConverter }    from '@tools/text/title-case-converter/config';
import { config as sentenceCaseConverter } from '@tools/text/sentence-case-converter/config';
import { config as camelCaseConverter }    from '@tools/text/camel-case-converter/config';
import { config as snakeCaseConverter }    from '@tools/text/snake-case-converter/config';
import { config as kebabCaseConverter }    from '@tools/text/kebab-case-converter/config';
// Text processor engine — cleanup family
import { config as removeExtraSpaces }     from '@tools/text/remove-extra-spaces/config';
import { config as removeBlankLines }      from '@tools/text/remove-blank-lines/config';
import { config as removeDuplicateLines }  from '@tools/text/remove-duplicate-lines/config';
import { config as trimText }              from '@tools/text/trim-text/config';
import { config as normalizeWhitespace }   from '@tools/text/normalize-whitespace/config';
import { config as removeTabs }            from '@tools/text/remove-tabs/config';
import { config as percentageCalculator }  from '@tools/number/percentage-calculator/config';
import { config as marginCalculator }      from '@tools/number/margin-calculator/config';
import { config as discountCalculator }     from '@tools/number/discount-calculator/config';
import { config as tipCalculator }          from '@tools/number/tip-calculator/config';
import { config as todoList }              from '@tools/productivity/todo-list/config';
import { config as notepad }              from '@tools/productivity/notepad/config';
import { config as keepScreenAwake }       from '@tools/productivity/keep-screen-awake/config';
import { config as base64 }               from '@tools/developer-utilities/base64-encoder-decoder/config';
import { config as urlEncoderDecoder }     from '@tools/developer-utilities/url-encoder-decoder/config';
import { config as htmlEntityEncoderDecoder } from '@tools/developer-utilities/html-entity-encoder-decoder/config';
import { config as hexEncoderDecoder }    from '@tools/developer-utilities/hex-encoder-decoder/config';
import { config as md5HashGenerator }     from '@tools/developer-utilities/md5-hash-generator/config';
import { config as sha1HashGenerator }    from '@tools/developer-utilities/sha1-hash-generator/config';
import { config as sha256HashGenerator }  from '@tools/developer-utilities/sha256-hash-generator/config';
import { config as sha512HashGenerator }  from '@tools/developer-utilities/sha512-hash-generator/config';
import { config as jsonFormatter }        from '@tools/developer-utilities/json-formatter/config';
import { config as jsonMinifier }         from '@tools/developer-utilities/json-minifier/config';
import { config as jsonValidator }        from '@tools/developer-utilities/json-validator/config';
import { config as jsonToCsvConverter }   from '@tools/developer-utilities/json-to-csv-converter/config';
import { config as csvToJsonConverter }   from '@tools/developer-utilities/csv-to-json-converter/config';
import { config as jsonToYamlConverter }  from '@tools/developer-utilities/json-to-yaml-converter/config';
import { config as yamlToJsonConverter }  from '@tools/developer-utilities/yaml-to-json-converter/config';
import { config as jsonTreeViewer }       from '@tools/developer-utilities/json-tree-viewer/config';
import { config as jwtDecoder }            from '@tools/developer-utilities/jwt-decoder/config';
import { config as pomodoroTimer }         from '@tools/productivity/pomodoro-timer/config';
// Money & Finance — finance engine
import { config as compoundInterestCalculator } from '@tools/finance/compound-interest-calculator/config';
import { config as ruleOf72Calculator }         from '@tools/finance/rule-of-72-calculator/config';
import { config as inflationCalculator }         from '@tools/finance/inflation-calculator/config';
import { config as savingsGoalCalculator }       from '@tools/finance/savings-goal-calculator/config';
import { config as emergencyFundCalculator }     from '@tools/finance/emergency-fund-calculator/config';
import { config as scientificCalculator }        from '@tools/number/scientific-calculator/config';
// Physics — physics playground engine
import { config as frequencyPeriodSimulator }     from '@tools/physics/frequency-period-simulator/config';
import { config as pendulumSimulator }            from '@tools/physics/pendulum-simulator/config';
import { config as heatTransferSimulator }        from '@tools/physics/heat-transfer-simulator/config';

// Add/remove a tool: one import line above + one array entry below.
// Simulation tools are DERIVED from their manifests (src/lib/simulation) and spread in here, so
// they need no per-tool config.ts or registry line.
export const tools: ToolConfig[] = [
  ...simulationTools,
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
  wordCounter,
  characterCounter,
  readingTimeCalculator,
  sentenceCounter,
  paragraphCounter,
  letterCounter,
  lineCounter,
  spaceCounter,
  findReplace,
  textCompare,
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
  percentageCalculator,
  marginCalculator,
  discountCalculator,
  tipCalculator,
  todoList,
  notepad,
  keepScreenAwake,
  base64,
  urlEncoderDecoder,
  htmlEntityEncoderDecoder,
  hexEncoderDecoder,
  md5HashGenerator,
  sha1HashGenerator,
  sha256HashGenerator,
  sha512HashGenerator,
  jsonFormatter,
  jsonMinifier,
  jsonValidator,
  jsonToCsvConverter,
  csvToJsonConverter,
  jsonToYamlConverter,
  yamlToJsonConverter,
  jsonTreeViewer,
  jwtDecoder,
  pomodoroTimer,
  compoundInterestCalculator,
  ruleOf72Calculator,
  inflationCalculator,
  savingsGoalCalculator,
  emergencyFundCalculator,
  scientificCalculator,
  frequencyPeriodSimulator,
  pendulumSimulator,
  heatTransferSimulator,
];

export const toolsWithGuide = tools.filter(t => t.guide !== undefined);

export function getToolBySlug(slug: string): ToolConfig {
  const tool = tools.find(t => t.slug === slug);
  if (!tool) throw new Error(`[registry] No tool found for slug "${slug}"`);
  return tool;
}
