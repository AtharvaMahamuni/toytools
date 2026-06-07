import type { FAQItem } from './types';
import { items as todoFaqs }               from '@tools/productivity/todo-list/faq';
import { items as notepadFaqs }             from '@tools/productivity/notepad/faq';
import { items as keepScreenAwakeFaqs }     from '@tools/productivity/keep-screen-awake/faq';
import { items as base64Faqs }              from '@tools/developer/base64-encoder-decoder/faq';
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

export const faqsByToolSlug: Record<string, FAQItem[]> = {
  'todo-list':              todoFaqs,
  'notepad':                notepadFaqs,
  'keep-screen-awake':      keepScreenAwakeFaqs,
  'base64-encoder-decoder': base64Faqs,
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
};
