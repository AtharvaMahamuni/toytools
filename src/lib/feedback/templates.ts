// The feedback contract — the form's questions and the exact shape of the email they produce.
//
// This module is the ONLY place either format is defined. The form renders from FIELDS_BY_TYPE
// and the email is composed by composeSubject/composeBody, so a question and the section it
// lands in can never drift apart. templates.test.ts pins the rendered output character for
// character, because the whole point of a fixed format is that inbox filters keep working.
//
// Pure: no DOM, no network, no clock. Environment values are passed in.

import {
  feedbackType,
  MAX_CAPTURED_INPUT,
  MAX_SUBJECT_LABEL,
  SUBJECT_PREFIX,
  SUBJECT_SEPARATOR,
  type FeedbackType,
} from './config';

// ── The form ────────────────────────────────────────────────────────────────────────────

export interface FeedbackField {
  /** Stable id — the form control name and the key in FeedbackInput.values. */
  id: string;
  label: string;
  /** Muted example text rendered under the field. Never a placeholder: placeholders vanish
   *  the moment someone starts typing, which is exactly when the examples are still needed. */
  help?: string;
  /** Single-line input vs fixed-height textarea. */
  control: 'text' | 'textarea';
  required: boolean;
  /** Heading this answer appears under in the email. */
  section: EmailSection;
}

/** The email's section vocabulary. Every type maps into the same set, so all four kinds of
 *  submission produce an email with the same shape. */
export type EmailSection =
  | 'Current Tool'
  | 'Goal'
  | 'Problem'
  | 'Current Workflow'
  | 'Ideal Solution'
  | 'Example Input'
  | 'Example Output'
  | 'Feedback';

/** Fixed print order. Sections with no answer are omitted rather than printed empty. */
export const EMAIL_SECTION_ORDER: readonly EmailSection[] = [
  'Current Tool',
  'Goal',
  'Problem',
  'Current Workflow',
  'Ideal Solution',
  'Feedback',
  'Example Input',
  'Example Output',
];

const TOOL_FIELD = (required: boolean): FeedbackField => ({
  id: 'tool',
  label: 'Which tool?',
  help: 'Filled in automatically when you arrive from a tool page. Edit it if it is wrong.',
  control: 'text',
  required,
  section: 'Current Tool',
});

const EXAMPLE_FIELDS: FeedbackField[] = [
  {
    id: 'exampleInput',
    label: 'Example input (optional)',
    help: 'Real data helps more than a description. Paste a small sample.',
    control: 'textarea',
    required: false,
    section: 'Example Input',
  },
  {
    id: 'exampleOutput',
    label: 'Example output (optional)',
    help: 'What the result should have been for that input.',
    control: 'textarea',
    required: false,
    section: 'Example Output',
  },
];

const GOAL_FIELD: FeedbackField = {
  id: 'goal',
  label: 'What are you trying to do?',
  help: 'Convert… Calculate… Compare… Generate… Validate… Extract… Clean up…',
  control: 'textarea',
  required: true,
  section: 'Goal',
};

const TODAY_FIELD = (required: boolean): FeedbackField => ({
  id: 'today',
  label: required ? 'How do you do this today?' : 'How do you do this today? (optional)',
  help: '"I copy everything into Excel." "I use three websites." "I calculate it manually."',
  control: 'textarea',
  required,
  section: 'Current Workflow',
});

const FRUSTRATION_FIELD: FeedbackField = {
  id: 'frustration',
  label: "What's frustrating about that?",
  help: 'Too many ads. Too slow. Needs a login. Confusing. Not mobile friendly. Results are not trustworthy.',
  control: 'textarea',
  required: true,
  section: 'Problem',
};

const IDEAL_FIELD: FeedbackField = {
  id: 'ideal',
  label: 'What would the ideal tool do?',
  help: 'Describe the outcome you want, not how it should work internally.',
  control: 'textarea',
  required: true,
  section: 'Ideal Solution',
};

/**
 * The questions each submission type asks. Order here is the order on the page.
 *
 * The shape is deliberate: a new tool needs the full problem story, an improvement assumes
 * the tool already exists so the workflow question softens to optional, and a bug wants
 * observed-versus-expected instead of a discovery interview.
 */
export const FIELDS_BY_TYPE: Record<FeedbackType, readonly FeedbackField[]> = {
  'new-tool': [
    GOAL_FIELD,
    TODAY_FIELD(true),
    FRUSTRATION_FIELD,
    IDEAL_FIELD,
    TOOL_FIELD(false),
    ...EXAMPLE_FIELDS,
  ],
  improve: [
    TOOL_FIELD(true),
    GOAL_FIELD,
    FRUSTRATION_FIELD,
    IDEAL_FIELD,
    TODAY_FIELD(false),
    ...EXAMPLE_FIELDS,
  ],
  bug: [
    TOOL_FIELD(true),
    {
      id: 'problem',
      label: 'What went wrong?',
      help: 'What you did, and what the tool actually gave you.',
      control: 'textarea',
      required: true,
      section: 'Problem',
    },
    {
      id: 'expected',
      label: 'What did you expect instead?',
      help: 'The correct result, as far as you know it.',
      control: 'textarea',
      required: true,
      section: 'Ideal Solution',
    },
    ...EXAMPLE_FIELDS,
  ],
  general: [
    {
      id: 'message',
      label: 'Your feedback',
      help: 'Anything at all. What works, what does not, what is missing.',
      control: 'textarea',
      required: true,
      section: 'Feedback',
    },
    TOOL_FIELD(false),
  ],
};

/** Every field id the form can produce, across all types. */
export const ALL_FIELD_IDS: readonly string[] = Array.from(
  new Set(Object.values(FIELDS_BY_TYPE).flatMap(fields => fields.map(f => f.id))),
);

// ── The submission ──────────────────────────────────────────────────────────────────────

export interface FeedbackInput {
  type: FeedbackType;
  /** Answers keyed by field id. Missing or blank entries are simply absent from the email. */
  values: Record<string, string>;
  /** Opt-in reproduction data, already read from the tool. Only present when the user ticked
   *  the box AND the tool's engine permits it (see config.allowsInputCapture). */
  capturedInput?: string;
}

/** Ambient values printed in the email footer. Passed in so this module stays pure. */
export interface FeedbackEnv {
  browser: string;
  platform: string;
  language: string;
  url: string;
  version: string;
  time: string;
}

// ── Composition ─────────────────────────────────────────────────────────────────────────

/** Collapse whitespace and strip control characters. Also what keeps a newline out of the
 *  subject line, where it would be a header-injection vector. */
function flatten(text: string): string {
  const stripped = text.replace(/[\u0000-\u001F\u007F]+/g, ' ');
  return stripped.replace(/\s+/g, ' ').trim();
}

/** Trim to a word boundary at or below `max` characters. */
export function shortLabel(text: string, max = MAX_SUBJECT_LABEL): string {
  const flat = flatten(text);
  if (flat.length <= max) return flat;
  const cut = flat.slice(0, max);
  const lastSpace = cut.lastIndexOf(' ');
  return (lastSpace > 0 ? cut.slice(0, lastSpace) : cut).trim();
}

function value(input: FeedbackInput, id: string): string {
  return (input.values[id] ?? '').trim();
}

/**
 * The email subject. Fixed shape, short enough to read in a mail list:
 *
 *   [ToyTools] BUG · Word Counter
 *   [ToyTools] IDEA · QR Code Generator
 *   [ToyTools] FEEDBACK
 *
 * Gmail's `subject:` matching is reliable, so these tokens are what the inbox filters key on.
 */
export function composeSubject(input: FeedbackInput): string {
  const def = feedbackType(input.type);
  const parts = [SUBJECT_PREFIX, def.token];

  // Name the tool when we know it. For a new-tool idea there may be no existing tool, so the
  // label falls back to the opening of what they are trying to do — which is the closest thing
  // to a name the suggestion has yet.
  const tool = value(input, 'tool');
  const label = tool || (input.type === 'new-tool' ? shortLabel(value(input, 'goal')) : '');

  return label ? `${parts.join(' ')}${SUBJECT_SEPARATOR}${shortLabel(label)}` : parts.join(' ');
}

const META_LABEL_WIDTH = 17;

function metaRow(label: string, text: string): string {
  return `${label.padEnd(META_LABEL_WIDTH)}${text}`;
}

/**
 * The email body. Identical structure on every submission: labelled sections in a fixed
 * order, empty ones omitted, then a metadata block.
 */
export function composeBody(input: FeedbackInput, env: FeedbackEnv): string {
  const def = feedbackType(input.type);
  const blocks: string[] = [`Feedback Type\n${def.emailLabel}`];

  // Answers are gathered by section rather than by field, so the reader sees the same
  // headings in the same order no matter which form produced the email.
  const bySection = new Map<EmailSection, string>();
  for (const field of FIELDS_BY_TYPE[input.type]) {
    const answer = value(input, field.id);
    if (answer) bySection.set(field.section, answer);
  }

  for (const section of EMAIL_SECTION_ORDER) {
    const answer = bySection.get(section);
    if (answer) blocks.push(`${section}\n${answer}`);
  }

  const captured = (input.capturedInput ?? '').trim();
  if (captured) {
    blocks.push(`Their Input (shared on purpose)\n${captured.slice(0, MAX_CAPTURED_INPUT)}`);
  }

  blocks.push(
    [
      metaRow('Browser', env.browser),
      metaRow('Platform', env.platform),
      metaRow('Language', env.language),
      metaRow('URL', env.url),
      metaRow('ToyTools Version', env.version),
      metaRow('Time', env.time),
    ].join('\n'),
  );

  return blocks.join('\n\n');
}
