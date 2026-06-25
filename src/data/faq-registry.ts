import type { FAQItem } from './types';
import { items as todoFaqs }               from '@tools/productivity/todo-list/faq';
import { items as notepadFaqs }             from '@tools/productivity/notepad/faq';
import { items as keepScreenAwakeFaqs }     from '@tools/productivity/keep-screen-awake/faq';
import { items as base64Faqs }              from '@tools/developer-utilities/base64-encoder-decoder/faq';
import { items as urlEncoderDecoderFaqs }   from '@tools/developer-utilities/url-encoder-decoder/faq';
import { items as htmlEntityEncoderDecoderFaqs } from '@tools/developer-utilities/html-entity-encoder-decoder/faq';
// Developer utilities — hashing engine
import { items as md5HashGeneratorFaqs }   from '@tools/developer-utilities/md5-hash-generator/faq';
import { items as sha1HashGeneratorFaqs }  from '@tools/developer-utilities/sha1-hash-generator/faq';
import { items as sha256HashGeneratorFaqs } from '@tools/developer-utilities/sha256-hash-generator/faq';
import { items as hexEncoderDecoderFaqs } from '@tools/developer-utilities/hex-encoder-decoder/faq';
import { items as jsonToCsvConverterFaqs } from '@tools/developer-utilities/json-to-csv-converter/faq';
import { items as jsonToYamlConverterFaqs } from '@tools/developer-utilities/json-to-yaml-converter/faq';
import { items as jsonTreeViewerFaqs }  from '@tools/developer-utilities/json-tree-viewer/faq';
import { items as jwtDecoderFaqs }      from '@tools/developer-utilities/jwt-decoder/faq';
import { items as sha512HashGeneratorFaqs }  from '@tools/developer-utilities/sha512-hash-generator/faq';
import { items as discountCalculatorFaqs }   from '@tools/number/discount-calculator/faq';
import { items as marginCalculatorFaqs }     from '@tools/number/margin-calculator/faq';
import { items as tipCalculatorFaqs }        from '@tools/number/tip-calculator/faq';
// Developer utilities — structured-data engine
import { items as jsonFormatterFaqs }  from '@tools/developer-utilities/json-formatter/faq';
import { items as jsonMinifierFaqs }   from '@tools/developer-utilities/json-minifier/faq';
import { items as jsonValidatorFaqs }  from '@tools/developer-utilities/json-validator/faq';
import { items as percentageCalculatorFaqs } from '@tools/number/percentage-calculator/faq';
import { items as wordCounterFaqs }         from '@tools/text/word-counter/faq';
import { items as pomodoroTimerFaqs }        from '@tools/productivity/pomodoro-timer/faq';
// Text processor engine — transform family
import { items as uppercaseConverterFaqs }    from '@tools/text/uppercase-converter/faq';
import { items as lowercaseConverterFaqs }    from '@tools/text/lowercase-converter/faq';
import { items as titleCaseConverterFaqs }    from '@tools/text/title-case-converter/faq';
import { items as sentenceCaseConverterFaqs } from '@tools/text/sentence-case-converter/faq';
import { items as camelCaseConverterFaqs }    from '@tools/text/camel-case-converter/faq';
import { items as snakeCaseConverterFaqs }    from '@tools/text/snake-case-converter/faq';
import { items as kebabCaseConverterFaqs }    from '@tools/text/kebab-case-converter/faq';
// Text processor engine — cleanup family
import { items as removeExtraSpacesFaqs }     from '@tools/text/remove-extra-spaces/faq';
import { items as removeBlankLinesFaqs }      from '@tools/text/remove-blank-lines/faq';
import { items as removeDuplicateLinesFaqs }  from '@tools/text/remove-duplicate-lines/faq';
import { items as trimTextFaqs }              from '@tools/text/trim-text/faq';
import { items as normalizeWhitespaceFaqs }   from '@tools/text/normalize-whitespace/faq';
import { items as removeTabsFaqs }            from '@tools/text/remove-tabs/faq';
// Text analysis tools
import { items as characterCounterFaqs }      from '@tools/text/character-counter/faq';
import { items as readingTimeCalculatorFaqs } from '@tools/text/reading-time-calculator/faq';
import { items as sentenceCounterFaqs }       from '@tools/text/sentence-counter/faq';
import { items as paragraphCounterFaqs }      from '@tools/text/paragraph-counter/faq';
import { items as letterCounterFaqs }         from '@tools/text/letter-counter/faq';
import { items as lineCounterFaqs }           from '@tools/text/line-counter/faq';
import { items as spaceCounterFaqs }          from '@tools/text/space-counter/faq';
import { items as findReplaceFaqs }           from '@tools/text/find-replace/faq';
import { items as textCompareFaqs }           from '@tools/text/text-compare/faq';

export const faqsByToolSlug: Record<string, FAQItem[]> = {
  'todo-list':              todoFaqs,
  'notepad':                notepadFaqs,
  'keep-screen-awake':      keepScreenAwakeFaqs,
  'base64-encoder-decoder': base64Faqs,
  'url-encoder-decoder':    urlEncoderDecoderFaqs,
  'html-entity-encoder-decoder': htmlEntityEncoderDecoderFaqs,
  'md5-hash-generator':          md5HashGeneratorFaqs,
  'sha1-hash-generator':         sha1HashGeneratorFaqs,
  'sha256-hash-generator':       sha256HashGeneratorFaqs,
  'hex-encoder-decoder':         hexEncoderDecoderFaqs,
  'json-to-csv-converter':       jsonToCsvConverterFaqs,
  'json-to-yaml-converter':      jsonToYamlConverterFaqs,
  'json-tree-viewer':            jsonTreeViewerFaqs,
  'jwt-decoder':                 jwtDecoderFaqs,
  'sha512-hash-generator':       sha512HashGeneratorFaqs,
  'discount-calculator':         discountCalculatorFaqs,
  'margin-calculator':           marginCalculatorFaqs,
  'tip-calculator':              tipCalculatorFaqs,
  'json-formatter':              jsonFormatterFaqs,
  'json-minifier':               jsonMinifierFaqs,
  'json-validator':              jsonValidatorFaqs,
  'percentage-calculator':  percentageCalculatorFaqs,
  'word-counter':           wordCounterFaqs,
  'pomodoro-timer':         pomodoroTimerFaqs,
  'uppercase-converter':    uppercaseConverterFaqs,
  'lowercase-converter':    lowercaseConverterFaqs,
  'title-case-converter':   titleCaseConverterFaqs,
  'sentence-case-converter': sentenceCaseConverterFaqs,
  'camel-case-converter':   camelCaseConverterFaqs,
  'snake-case-converter':   snakeCaseConverterFaqs,
  'kebab-case-converter':   kebabCaseConverterFaqs,
  'remove-extra-spaces':    removeExtraSpacesFaqs,
  'remove-blank-lines':     removeBlankLinesFaqs,
  'remove-duplicate-lines': removeDuplicateLinesFaqs,
  'trim-text':              trimTextFaqs,
  'normalize-whitespace':   normalizeWhitespaceFaqs,
  'remove-tabs':            removeTabsFaqs,
  'character-counter':      characterCounterFaqs,
  'reading-time-calculator': readingTimeCalculatorFaqs,
  'sentence-counter':       sentenceCounterFaqs,
  'paragraph-counter':      paragraphCounterFaqs,
  'letter-counter':         letterCounterFaqs,
  'line-counter':           lineCounterFaqs,
  'space-counter':          spaceCounterFaqs,
  'find-replace':           findReplaceFaqs,
  'text-compare':           textCompareFaqs,
};
