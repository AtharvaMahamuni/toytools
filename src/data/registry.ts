import type { ToolConfig } from './types';
import { config as wordCounter }           from '@tools/text/word-counter/config';
import { config as characterCounter }      from '@tools/text/character-counter/config';
import { config as readingTimeCalculator } from '@tools/text/reading-time-calculator/config';
import { config as sentenceCounter }       from '@tools/text/sentence-counter/config';
import { config as paragraphCounter }      from '@tools/text/paragraph-counter/config';
import { config as caseConverter }         from '@tools/text/case-converter/config';
import { config as percentageCalculator }  from '@tools/number/percentage-calculator/config';
import { config as todoList }              from '@tools/productivity/todo-list/config';
import { config as notepad }              from '@tools/productivity/notepad/config';
import { config as keepScreenAwake }       from '@tools/productivity/keep-screen-awake/config';
import { config as base64 }               from '@tools/developer/base64-encoder-decoder/config';
import { config as pomodoroTimer }         from '@tools/productivity/pomodoro-timer/config';

// Add/remove a tool: one import line above + one array entry below
export const tools: ToolConfig[] = [
  wordCounter,
  characterCounter,
  readingTimeCalculator,
  sentenceCounter,
  paragraphCounter,
  caseConverter,
  percentageCalculator,
  todoList,
  notepad,
  keepScreenAwake,
  base64,
  pomodoroTimer,
];

export const toolsWithGuide = tools.filter(t => t.guide !== undefined);
export const toolsWithFaq   = tools.filter(t => t.faq !== undefined);

export function getToolBySlug(slug: string): ToolConfig {
  const tool = tools.find(t => t.slug === slug);
  if (!tool) throw new Error(`[registry] No tool found for slug "${slug}"`);
  return tool;
}
