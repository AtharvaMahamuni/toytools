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

/**
 * Every question the form can ask, defined once.
 *
 * A field means the same thing wherever it appears, so it is declared here and referenced by
 * id from FIELDS_BY_TYPE. That keeps the rendered form a single union of controls: switching
 * type shows and hides existing fields instead of swapping in a duplicate set, so a half-typed
 * answer survives a change of mind and no id is ever rendered twice.
 */
export const FIELD_DEFS: Readonly<Record<string, FeedbackField>> = {
  tool: {
    id: 'tool',
    label: 'Which tool?',
    help: 'Filled in for you when you arrive from a tool page. Edit it if it is wrong.',
    control: 'text',
    section: 'Current Tool',
  },
  goal: {
    id: 'goal',
    label: 'What are you trying to do?',
    help: 'Convert… Calculate… Compare… Generate… Validate… Extract… Clean up…',
    control: 'textarea',
    section: 'Goal',
  },
  problem: {
    id: 'problem',
    label: 'What went wrong?',
    help: 'What you did, and what the tool actually gave you.',
    control: 'textarea',
    section: 'Problem',
  },
  expected: {
    id: 'expected',
    label: 'What did you expect instead?',
    help: 'The correct result, as far as you know it.',
    control: 'textarea',
    section: 'Ideal Solution',
  },
  today: {
    id: 'today',
    label: 'How do you do this today?',
    help: '"I copy everything into a spreadsheet." "I use three different websites." "I work it out by hand."',
    control: 'textarea',
    section: 'Current Workflow',
  },
  frustration: {
    id: 'frustration',
    label: "What's frustrating about that?",
    help: 'Too many ads. Too slow. Needs a login. Confusing. Not mobile friendly. Results are not trustworthy.',
    control: 'textarea',
    section: 'Problem',
  },
  ideal: {
    id: 'ideal',
    label: 'What would the ideal tool do?',
    help: 'Describe the outcome you want, not how it should work inside.',
    control: 'textarea',
    section: 'Ideal Solution',
  },
  message: {
    id: 'message',
    label: 'Your feedback',
    help: 'Anything at all. What works, what does not, what is missing.',
    control: 'textarea',
    section: 'Feedback',
  },
  exampleInput: {
    id: 'exampleInput',
    label: 'Example input',
    help: 'Real data helps more than a description. A small sample is plenty.',
    control: 'textarea',
    section: 'Example Input',
  },
  exampleOutput: {
    id: 'exampleOutput',
    label: 'Example output',
    help: 'What the result should have been for that input.',
    control: 'textarea',
    section: 'Example Output',
  },
};

/**
 * The order fields are rendered in, for every type.
 *
 * One order serves all four because the questions that do not apply are hidden, and what
 * remains still reads as a sensible interview: which tool, what are you doing, what broke,
 * how you cope today, why that hurts, what you actually want, then optional examples.
 */
export const FORM_FIELD_ORDER: readonly string[] = [
  'tool',
  'goal',
  'problem',
  'expected',
  'today',
  'frustration',
  'ideal',
  'message',
  'exampleInput',
  'exampleOutput',
];

/** A field as it applies to one submission type. */
export interface TypeField {
  id: string;
  required: boolean;
}

/**
 * Which questions each type asks, and which of them are required.
 *
 * The shape is deliberate: a new tool needs the full problem story, an improvement assumes the
 * tool already exists so the workflow question relaxes to optional, a bug wants observed versus
 * expected rather than a discovery interview, and general feedback gets out of the way.
 */
export const FIELDS_BY_TYPE: Record<FeedbackType, readonly TypeField[]> = {
  'new-tool': [
    { id: 'tool', required: false },
    { id: 'goal', required: true },
    { id: 'today', required: true },
    { id: 'frustration', required: true },
    { id: 'ideal', required: true },
    { id: 'exampleInput', required: false },
    { id: 'exampleOutput', required: false },
  ],
  improve: [
    { id: 'tool', required: true },
    { id: 'goal', required: true },
    { id: 'today', required: false },
    { id: 'frustration', required: true },
    { id: 'ideal', required: true },
    { id: 'exampleInput', required: false },
    { id: 'exampleOutput', required: false },
  ],
  bug: [
    { id: 'tool', required: true },
    { id: 'problem', required: true },
    { id: 'expected', required: true },
    { id: 'exampleInput', required: false },
    { id: 'exampleOutput', required: false },
  ],
  general: [
    { id: 'tool', required: false },
    { id: 'message', required: true },
  ],
};

/** A field definition joined with how it behaves for one particular type. */
export type ResolvedField = FeedbackField & { required: boolean };

/** The questions one type asks, in render order, with their definitions attached. */
export function fieldsForType(type: FeedbackType): ResolvedField[] {
  const applicable = new Map((FIELDS_BY_TYPE[type] ?? []).map(f => [f.id, f.required]));
  return FORM_FIELD_ORDER.filter(id => applicable.has(id)).map(id => ({
    ...FIELD_DEFS[id],
    required: applicable.get(id)!,
  }));
}

/** Which types show a given field, and which of them require it. Drives the form's markup. */
export function fieldApplicability(id: string): {
  shownFor: FeedbackType[];
  requiredFor: FeedbackType[];
} {
  const shownFor: FeedbackType[] = [];
  const requiredFor: FeedbackType[] = [];
  for (const [type, fields] of Object.entries(FIELDS_BY_TYPE) as [FeedbackType, readonly TypeField[]][]) {
    const match = fields.find(f => f.id === id);
    if (!match) continue;
    shownFor.push(type);
    if (match.required) requiredFor.push(type);
  }
  return { shownFor, requiredFor };
}

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
  for (const field of fieldsForType(input.type)) {
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
