import { describe, it, expect, vi } from 'vitest';
import { pinReplaceState, type ReplaceStateHost } from './history';

// A History-shaped host: the method lives on the prototype, exactly as History.prototype does.
function makeHost() {
  const native = vi.fn();
  const proto = { replaceState: native };
  const host = Object.create(proto) as ReplaceStateHost;
  return { host, native };
}

describe('pinReplaceState', () => {
  it('keeps calls reaching the native method, with the host as this', () => {
    const { host, native } = makeHost();
    expect(pinReplaceState(host, native)).toBe(true);
    (host.replaceState as (...a: unknown[]) => void)(null, '', '/tool/x/?a=1');
    expect(native).toHaveBeenCalledTimes(1);
    expect(native.mock.contexts[0]).toBe(host);
    expect(native).toHaveBeenCalledWith(null, '', '/tool/x/?a=1');
  });

  it('ignores a later assignment, the way gtag.js installs its history-change wrapper', () => {
    const { host, native } = makeHost();
    pinReplaceState(host, native);
    const wrapper = vi.fn();
    // gtag.js does `history.replaceState = function () { ...; sendPageView() }` inside a try.
    (host as { replaceState: unknown }).replaceState = wrapper;
    (host.replaceState as (...a: unknown[]) => void)(null, '', '/tool/x/?a=2');
    expect(wrapper).not.toHaveBeenCalled();
    expect(native).toHaveBeenCalledTimes(1);
    expect(host.replaceState).toBe(native);
  });

  it('does not throw on assignment from strict-mode code (ES modules are strict)', () => {
    const { host, native } = makeHost();
    pinReplaceState(host, native);
    expect(() => {
      (host as { replaceState: unknown }).replaceState = () => {};
    }).not.toThrow();
  });

  it('pins a class instance to its prototype method, as with window.history', () => {
    class FakeHistory {
      replaceState(): void {}
    }
    const h = new FakeHistory();
    expect(pinReplaceState(h as unknown as ReplaceStateHost, FakeHistory.prototype.replaceState)).toBe(true);
    expect(h.replaceState).toBe(FakeHistory.prototype.replaceState);
  });

  it('returns false instead of throwing when the property cannot be redefined', () => {
    const { host, native } = makeHost();
    const frozen = vi.fn();
    Object.defineProperty(host, 'replaceState', { value: frozen, configurable: false, writable: false });
    expect(pinReplaceState(host, native)).toBe(false);
    expect(host.replaceState).toBe(frozen);
  });
});
