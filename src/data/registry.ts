import type { ToolConfig } from './types';
import { config as wordCounter }           from '@tools/text/word-counter/config';
import { config as characterCounter }      from '@tools/text/character-counter/config';
import { config as readingTimeCalculator } from '@tools/text/reading-time-calculator/config';
import { config as sentenceCounter }       from '@tools/text/sentence-counter/config';
import { config as paragraphCounter }      from '@tools/text/paragraph-counter/config';
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
import { config as discountCalculator }     from '@tools/number/discount-calculator/config';
import { config as todoList }              from '@tools/productivity/todo-list/config';
import { config as notepad }              from '@tools/productivity/notepad/config';
import { config as keepScreenAwake }       from '@tools/productivity/keep-screen-awake/config';
import { config as base64 }               from '@tools/developer-utilities/base64-encoder-decoder/config';
import { config as urlEncoderDecoder }     from '@tools/developer-utilities/url-encoder-decoder/config';
import { config as htmlEntityEncoderDecoder } from '@tools/developer-utilities/html-entity-encoder-decoder/config';
import { config as md5HashGenerator }     from '@tools/developer-utilities/md5-hash-generator/config';
import { config as sha1HashGenerator }    from '@tools/developer-utilities/sha1-hash-generator/config';
import { config as sha256HashGenerator }  from '@tools/developer-utilities/sha256-hash-generator/config';
import { config as jsonFormatter }        from '@tools/developer-utilities/json-formatter/config';
import { config as jsonMinifier }         from '@tools/developer-utilities/json-minifier/config';
import { config as jsonValidator }        from '@tools/developer-utilities/json-validator/config';
import { config as pomodoroTimer }         from '@tools/productivity/pomodoro-timer/config';

// Add/remove a tool: one import line above + one array entry below
export const tools: ToolConfig[] = [
  wordCounter,
  characterCounter,
  readingTimeCalculator,
  sentenceCounter,
  paragraphCounter,
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
  discountCalculator,
  todoList,
  notepad,
  keepScreenAwake,
  base64,
  urlEncoderDecoder,
  htmlEntityEncoderDecoder,
  md5HashGenerator,
  sha1HashGenerator,
  sha256HashGenerator,
  jsonFormatter,
  jsonMinifier,
  jsonValidator,
  pomodoroTimer,
];

export const toolsWithGuide = tools.filter(t => t.guide !== undefined);

export function getToolBySlug(slug: string): ToolConfig {
  const tool = tools.find(t => t.slug === slug);
  if (!tool) throw new Error(`[registry] No tool found for slug "${slug}"`);
  return tool;
}
