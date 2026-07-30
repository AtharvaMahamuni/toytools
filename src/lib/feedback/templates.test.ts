import { describe, it, expect } from 'vitest';
import {
  EMAIL_SECTION_ORDER,
  FIELDS_BY_TYPE,
  FIELD_DEFS,
  FORM_FIELD_ORDER,
  composeBody,
  composeSubject,
  fieldApplicability,
  fieldsForType,
  shortLabel,
  type FeedbackEnv,
  type FeedbackInput,
} from './templates';
import { FEEDBACK_TYPES } from './config';

const env: FeedbackEnv = {
  browser: 'Chrome',
  platform: 'Android',
  language: 'en-IN',
  url: 'https://toytoolsapp.com/tool/text/word-counter/',
  version: '1.4.2',
  time: '2026-07-30 18:42 IST',
};

const bugReport: FeedbackInput = {
  type: 'bug',
  values: {
    tool: 'Word Counter',
    problem: 'Emoji count is incorrect.',
    expected: 'Count emojis correctly.',
    exampleInput: 'hello world',
    exampleOutput: 'Expected count = 2',
  },
};

// The email format is a contract with the user's Gmail filters. These assertions exist so a
// later refactor cannot quietly change the shape and silently break inbox triage.
describe('composeBody — the pinned email format', () => {
  it('renders a bug report exactly', () => {
    expect(composeBody(bugReport, env)).toBe(
      [
        'Feedback Type',
        'Bug Report',
        '',
        'Current Tool',
        'Word Counter',
        '',
        'Problem',
        'Emoji count is incorrect.',
        '',
        'Ideal Solution',
        'Count emojis correctly.',
        '',
        'Example Input',
        'hello world',
        '',
        'Example Output',
        'Expected count = 2',
        '',
        'Browser          Chrome',
        'Platform         Android',
        'Language         en-IN',
        'URL              https://toytoolsapp.com/tool/text/word-counter/',
        'ToyTools Version 1.4.2',
        'Time             2026-07-30 18:42 IST',
      ].join('\n'),
    );
  });

  it('omits sections with no answer rather than printing them empty', () => {
    const body = composeBody(
      { type: 'general', values: { message: 'Everything works nicely, thank you.' } },
      env,
    );
    expect(body).toContain('Feedback\nEverything works nicely, thank you.');
    expect(body).not.toContain('Current Tool');
    expect(body).not.toContain('Example Input');
  });

  it('prints every section in the declared order, whichever type produced it', () => {
    const body = composeBody(
      {
        type: 'new-tool',
        values: {
          tool: 'Word Counter',
          goal: 'Count characters for a tweet',
          today: 'I paste it into a spreadsheet',
          frustration: 'The spreadsheet counts emoji wrong',
          ideal: 'Give me the exact tweet length',
          exampleInput: 'hello',
          exampleOutput: '5',
        },
      },
      env,
    );
    // Only the sections this type actually asks about appear; the ones present must follow
    // the declared order rather than the order the questions happened to be asked in.
    const sections = new Set(fieldsForType('new-tool').map(f => f.section));
    const expected = EMAIL_SECTION_ORDER.filter(section => sections.has(section));
    const positions = expected.map(section => body.indexOf(`\n${section}\n`));
    expect(positions.every(p => p >= 0)).toBe(true);
    expect([...positions]).toEqual([...positions].sort((a, b) => a - b));
    // "Current Tool" is asked last on the page but printed first in the email.
    expect(body.indexOf('\nCurrent Tool\n')).toBeLessThan(body.indexOf('\nGoal\n'));
  });

  it('includes opt-in reproduction data under an unambiguous heading, truncated', () => {
    const body = composeBody({ ...bugReport, capturedInput: 'x'.repeat(600) }, env);
    expect(body).toContain('Their Input (shared on purpose)');
    expect(body).toContain('x'.repeat(500));
    expect(body).not.toContain('x'.repeat(501));
  });

  it('leaves the reproduction section out entirely when nothing was shared', () => {
    expect(composeBody({ ...bugReport, capturedInput: '   ' }, env)).not.toContain(
      'Their Input',
    );
  });
});

describe('composeSubject', () => {
  it('names the type and the tool', () => {
    expect(composeSubject(bugReport)).toBe('[ToyTools] BUG · Word Counter');
  });

  it('falls back to the goal when a new-tool idea names no existing tool', () => {
    expect(
      composeSubject({ type: 'new-tool', values: { goal: 'QR Code Generator' } }),
    ).toBe('[ToyTools] IDEA · QR Code Generator');
  });

  it('stays bare when there is nothing to name', () => {
    expect(composeSubject({ type: 'general', values: { message: 'nice site' } })).toBe(
      '[ToyTools] FEEDBACK',
    );
  });

  it('uses the improvement token', () => {
    expect(composeSubject({ type: 'improve', values: { tool: 'JSON Formatter' } })).toBe(
      '[ToyTools] IMPROVEMENT · JSON Formatter',
    );
  });

  // A newline in a subject line is a header-injection vector, so flattening is a safety
  // property rather than a formatting nicety.
  it('never lets a newline or control character reach the subject', () => {
    const subject = composeSubject({
      type: 'bug',
      values: { tool: 'Word\nCounter\r\nBcc: someone@example.com' },
    });
    expect(subject).not.toMatch(/[\r\n]/);
  });

  it('falls back to the default type for an unknown id', () => {
    const subject = composeSubject({
      type: 'nonsense' as FeedbackInput['type'],
      values: { tool: 'Word Counter' },
    });
    expect(subject).toBe('[ToyTools] IDEA · Word Counter');
  });
});

describe('shortLabel', () => {
  it('leaves a short label untouched', () => {
    expect(shortLabel('QR Code Generator')).toBe('QR Code Generator');
  });

  it('trims to a word boundary', () => {
    expect(shortLabel('convert a spreadsheet column into a comma separated list', 20)).toBe(
      'convert a',
    );
  });

  it('hard-cuts a single word too long to break', () => {
    expect(shortLabel('supercalifragilistic', 10)).toBe('supercalif');
  });

  it('collapses runs of whitespace', () => {
    expect(shortLabel('word    counter\n\ntool')).toBe('word counter tool');
  });
});

describe('form definitions', () => {
  it('asks questions for every feedback type', () => {
    for (const type of FEEDBACK_TYPES) {
      expect(fieldsForType(type.id).length).toBeGreaterThan(0);
    }
  });

  it('maps every field to a section the email knows how to print', () => {
    for (const field of Object.values(FIELD_DEFS)) {
      expect(EMAIL_SECTION_ORDER).toContain(field.section);
    }
  });

  it('references only declared fields, at most once per type', () => {
    for (const fields of Object.values(FIELDS_BY_TYPE)) {
      const ids = fields.map(f => f.id);
      expect(new Set(ids).size).toBe(ids.length);
      for (const id of ids) expect(FIELD_DEFS[id]).toBeDefined();
    }
  });

  // The form renders one union of controls, so the render order must cover every field any
  // type can ask for. A field missing here would simply never appear on the page.
  it('gives every declared field a place in the render order', () => {
    expect([...FORM_FIELD_ORDER].sort()).toEqual(Object.keys(FIELD_DEFS).sort());
  });

  it('renders each type in the declared order', () => {
    for (const type of FEEDBACK_TYPES) {
      const ids = fieldsForType(type.id).map(f => f.id);
      const positions = ids.map(id => FORM_FIELD_ORDER.indexOf(id));
      expect(positions).toEqual([...positions].sort((a, b) => a - b));
    }
  });

  it('gives every field a label and a usable control', () => {
    for (const field of Object.values(FIELD_DEFS)) {
      expect(field.label.length).toBeGreaterThan(0);
      expect(['text', 'textarea']).toContain(field.control);
    }
  });

  it('reports where a field applies, so the markup can be rendered once', () => {
    expect(fieldApplicability('tool')).toEqual({
      shownFor: ['new-tool', 'improve', 'bug', 'general'],
      requiredFor: ['improve', 'bug'],
    });
    expect(fieldApplicability('problem')).toEqual({
      shownFor: ['bug'],
      requiredFor: ['bug'],
    });
    expect(fieldApplicability('nonexistent')).toEqual({ shownFor: [], requiredFor: [] });
  });

  it('returns nothing for an unknown type instead of throwing', () => {
    expect(fieldsForType('nonsense' as FeedbackInput['type'])).toEqual([]);
  });
});
