import { describe, it, expect } from 'vitest';
import {
  DEFAULT_FEEDBACK_TYPE,
  FEEDBACK_TYPES,
  allowsInputCapture,
  feedbackType,
} from './config';

describe('feedbackType', () => {
  it('resolves each declared type', () => {
    for (const def of FEEDBACK_TYPES) {
      expect(feedbackType(def.id).token).toBe(def.token);
    }
  });

  it('falls back to the default for an unknown id', () => {
    expect(feedbackType('nope').id).toBe(DEFAULT_FEEDBACK_TYPE);
  });

  it('gives every type a distinct subject token', () => {
    const tokens = FEEDBACK_TYPES.map(t => t.token);
    expect(new Set(tokens).size).toBe(tokens.length);
  });
});

// The reproduction opt-in relays whatever the person had typed into the tool. On a JWT decoder
// that is a bearer token and on a hash generator it may be a password, so the checkbox is not
// offered at all there. Deriving this from engine/pattern means a new tool in one of those
// families is covered the day it ships.
describe('allowsInputCapture', () => {
  it('allows ordinary tools', () => {
    expect(allowsInputCapture('text-analysis', 'text-metric')).toBe(true);
    expect(allowsInputCapture('structured-data', 'structured-transform')).toBe(true);
  });

  it('refuses engines whose input may be a secret', () => {
    expect(allowsInputCapture('jwt', 'token-decode')).toBe(false);
    expect(allowsInputCapture('hashing', 'hash')).toBe(false);
    expect(allowsInputCapture('encoding', 'encode-decode')).toBe(false);
  });

  it('refuses credential generators whatever engine they belong to', () => {
    expect(allowsInputCapture('generation', 'generate-credential')).toBe(false);
  });

  it('allows a tool with no engine metadata at all', () => {
    expect(allowsInputCapture()).toBe(true);
    expect(allowsInputCapture(undefined, 'text-metric')).toBe(true);
  });
});
