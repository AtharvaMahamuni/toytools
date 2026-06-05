import type { FAQItem } from './types';
import { items as todoFaqs }               from '@tools/todo-list/faq';
import { items as notepadFaqs }             from '@tools/notepad/faq';
import { items as keepScreenAwakeFaqs }     from '@tools/keep-screen-awake/faq';
import { items as base64Faqs }              from '@tools/base64-encoder-decoder/faq';
import { items as caseConverterFaqs }       from '@tools/case-converter/faq';
import { items as percentageCalculatorFaqs } from '@tools/percentage-calculator/faq';
import { items as wordCounterFaqs }         from '@tools/word-counter/faq';
import { items as pomodoroTimerFaqs }        from '@tools/pomodoro-timer/faq';

export const faqsByToolSlug: Record<string, FAQItem[]> = {
  'todo-list':              todoFaqs,
  'notepad':                notepadFaqs,
  'keep-screen-awake':      keepScreenAwakeFaqs,
  'base64-encoder-decoder': base64Faqs,
  'case-converter':         caseConverterFaqs,
  'percentage-calculator':  percentageCalculatorFaqs,
  'word-counter':           wordCounterFaqs,
  'pomodoro-timer':         pomodoroTimerFaqs,
};
