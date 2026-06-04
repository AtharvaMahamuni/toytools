import type { ToolConfig } from './types';
import { config as wordCounter }          from '@tools/word-counter/config';
import { config as caseConverter }        from '@tools/case-converter/config';
import { config as percentageCalculator } from '@tools/percentage-calculator/config';
import { config as todoList }             from '@tools/todo-list/config';
import { config as notepad }              from '@tools/notepad/config';
import { config as keepScreenAwake }      from '@tools/keep-screen-awake/config';
import { config as base64 }              from '@tools/base64-encoder-decoder/config';

// Add/remove a tool: one import line above + one array entry below
export const tools: ToolConfig[] = [
  wordCounter,
  caseConverter,
  percentageCalculator,
  todoList,
  notepad,
  keepScreenAwake,
  base64,
];

export const toolsWithGuide = tools.filter(t => t.guide !== undefined);
export const toolsWithFaq   = tools.filter(t => t.faq !== undefined);

export function getToolBySlug(slug: string): ToolConfig {
  const tool = tools.find(t => t.slug === slug);
  if (!tool) throw new Error(`[registry] No tool found for slug "${slug}"`);
  return tool;
}
