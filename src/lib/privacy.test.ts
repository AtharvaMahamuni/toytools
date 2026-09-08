import { describe, expect, it } from 'vitest';
import { openingAnswer, PRIVACY_LINE, withPrivacy } from './privacy';

describe('withPrivacy', () => {
  it('appends the canonical line when the text never mentions privacy', () => {
    expect(withPrivacy('Count the words in a paragraph.')).toBe(
      `Count the words in a paragraph. ${PRIVACY_LINE}`,
    );
  });

  it('does not double the claim when the text already says it', () => {
    expect(withPrivacy('Decode a token in your browser.')).toBe('Decode a token in your browser.');
    expect(withPrivacy(PRIVACY_LINE)).toBe(PRIVACY_LINE);
    expect(withPrivacy('Paste text. Nothing is uploaded.')).toBe('Paste text. Nothing is uploaded.');
  });
});

describe('openingAnswer', () => {
  it('joins a distinct tagline and description, then the privacy line', () => {
    const out = openingAnswer({
      tagline: 'Your BMI from height and weight.',
      description: 'Calculate Body Mass Index and see the WHO category.',
    });
    expect(out.startsWith('Your BMI from height and weight. Calculate Body Mass Index')).toBe(true);
    expect(out.endsWith(PRIVACY_LINE)).toBe(true);
  });

  it('does not repeat a tagline that is already the start of the description', () => {
    const out = openingAnswer({
      tagline: 'Count characters, with and without spaces.',
      description: 'Count characters, with and without spaces. Runs in your browser.',
    });
    expect(out.startsWith('Count characters, with and without spaces. Count characters')).toBe(false);
    expect(out).toBe('Count characters, with and without spaces. Runs in your browser.');
  });
});
