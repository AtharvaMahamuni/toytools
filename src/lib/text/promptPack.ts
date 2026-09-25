// Assemble a prompt from separate fields. No model call. Empty fields are omitted so a blank
// heading is not left behind as if it were an instruction.

export type PromptFormat = 'markdown' | 'xml';

export interface PromptFields {
  role: string;
  task: string;
  context: string;
  constraints: string;
  outputFormat: string;
}

export interface PromptSection {
  key: keyof PromptFields;
  heading: string;
  tag: string;
}

export const PROMPT_SECTIONS: readonly PromptSection[] = [
  { key: 'role', heading: 'Role', tag: 'role' },
  { key: 'task', heading: 'Task', tag: 'task' },
  { key: 'context', heading: 'Context', tag: 'context' },
  { key: 'constraints', heading: 'Constraints', tag: 'constraints' },
  { key: 'outputFormat', heading: 'Output format', tag: 'output_format' },
];

export interface PromptPack {
  text: string;
  characters: number;
  words: number;
  /** Headings left out because the field was empty. */
  omitted: string[];
}

function escapeXml(text: string): string {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function countWords(text: string): number {
  const trimmed = text.trim();
  if (!trimmed) return 0;
  return trimmed.split(/\s+/).length;
}

export function packPrompt(fields: PromptFields, format: PromptFormat): PromptPack {
  const included: string[] = [];
  const omitted: string[] = [];

  for (const section of PROMPT_SECTIONS) {
    const value = (fields[section.key] ?? '').trim();
    if (!value) {
      omitted.push(section.heading);
      continue;
    }
    if (format === 'xml') {
      included.push(`<${section.tag}>\n${escapeXml(value)}\n</${section.tag}>`);
    } else {
      included.push(`## ${section.heading}\n\n${value}`);
    }
  }

  const text = included.join('\n\n');
  return {
    text,
    characters: text.length,
    words: countWords(text),
    omitted,
  };
}
