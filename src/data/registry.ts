import type { ToolConfig } from './types';
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

// Add/remove a tool: one import line above + one array entry below
export const tools: ToolConfig[] = [
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
];

export const toolsWithGuide = tools.filter(t => t.guide !== undefined);

export function getToolBySlug(slug: string): ToolConfig {
  const tool = tools.find(t => t.slug === slug);
  if (!tool) throw new Error(`[registry] No tool found for slug "${slug}"`);
  return tool;
}
