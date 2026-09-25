// Context windows copied from vendor docs on 2026-09-25.
// charsPerToken is ToyTools' estimate, not a published tokenizer rate.
// A model with no page we could read is not in this list.

export interface ContextModel {
  id: string;
  name: string;
  provider: string;
  /** Tokens, as the source page states them. */
  contextWindow: number;
  /** ToyTools approximation. Not the vendor tokenizer. */
  charsPerToken: number;
  lastUpdated: string;
  sourceNote: string;
}

export const CONTEXT_MODELS: readonly ContextModel[] = [
  {
    id: 'gpt-4o',
    name: 'GPT-4o',
    provider: 'OpenAI',
    contextWindow: 128000,
    charsPerToken: 4,
    lastUpdated: '2026-09-25',
    sourceNote: 'https://developers.openai.com/api/docs/models/gpt-4o says 128,000 context window.',
  },
  {
    id: 'claude-sonnet-4-5',
    name: 'Claude Sonnet 4.5',
    provider: 'Anthropic',
    contextWindow: 200000,
    charsPerToken: 4,
    lastUpdated: '2026-09-25',
    sourceNote: 'https://platform.claude.com/docs/en/build-with-claude/context-windows lists Claude Sonnet 4.5 at 200k tokens.',
  },
  {
    id: 'claude-sonnet-4-6',
    name: 'Claude Sonnet 4.6',
    provider: 'Anthropic',
    contextWindow: 1000000,
    charsPerToken: 4,
    lastUpdated: '2026-09-25',
    sourceNote: 'https://platform.claude.com/docs/en/build-with-claude/context-windows lists Claude Sonnet 4.6 at 1M tokens.',
  },
  {
    id: 'gemini-3-8-flash',
    name: 'Gemini 3.8 Flash',
    provider: 'Google',
    contextWindow: 1048576,
    charsPerToken: 4,
    lastUpdated: '2026-09-25',
    sourceNote: 'https://docs.cloud.google.com/gemini-enterprise-agent-platform/models/gemini/3-8-flash lists context window 1,048,576.',
  },
  {
    id: 'grok-4-7',
    name: 'Grok 4.7',
    provider: 'xAI',
    contextWindow: 500000,
    charsPerToken: 4,
    lastUpdated: '2026-09-25',
    sourceNote: 'https://docs.x.ai/developers/models lists Grok 4.7 at 500k tokens.',
  },
];

export function contextModel(id: string): ContextModel | undefined {
  return CONTEXT_MODELS.find(model => model.id === id);
}
