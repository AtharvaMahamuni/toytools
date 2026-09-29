// @vitest-environment happy-dom
//
// How readSignals() fills in `framed` from the live window. guard.test.ts covers isFramed() on
// plain objects; this covers the wiring, so `framed: isFramed(win)` cannot silently become a
// constant. Under happy-dom `window` is the global, so stubbing `window.top` is what the guard sees.
import { describe, it, expect, afterEach } from 'vitest';
import { readSignals } from './guard';

type Win = Window & { happyDOM: { setURL(url: string): void } };
const w = window as unknown as Win;
const originalTop = Object.getOwnPropertyDescriptor(window, 'top');

function stubTop(get: () => unknown): void {
  Object.defineProperty(window, 'top', { configurable: true, get });
}

afterEach(() => {
  if (originalTop) Object.defineProperty(window, 'top', originalTop);
  else delete (window as unknown as { top?: unknown }).top;
});

describe('readSignals().framed', () => {
  it('is false for a top window on toytoolsapp.com', () => {
    w.happyDOM.setURL('https://toytoolsapp.com/tool/audio/equalizer-presets/');
    expect(window.top).toBe(window.self);
    const signals = readSignals();
    expect(signals.hostname).toBe('toytoolsapp.com');
    expect(signals.framed).toBe(false);
  });

  it('is true when window.top is not self (an iframe)', () => {
    w.happyDOM.setURL('https://toytoolsapp.com/tool/audio/equalizer-presets/');
    const parent = {};
    stubTop(() => parent);
    expect(window.top).not.toBe(window.self);
    expect(readSignals().framed).toBe(true);
  });

  it('is true when reading window.top throws (a cross-origin parent)', () => {
    w.happyDOM.setURL('https://toytoolsapp.com/tool/audio/equalizer-presets/');
    stubTop(() => {
      throw new DOMException('Blocked a frame with origin', 'SecurityError');
    });
    expect(() => window.top).toThrow();
    expect(readSignals().framed).toBe(true);
  });
});
