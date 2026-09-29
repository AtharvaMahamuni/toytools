// @vitest-environment happy-dom
//
// The service-worker half of attachPlatform. The guard decides WHETHER to register (guard.test.ts
// pins that rule); this file pins WHAT happens either way, so the C3 change to the rule cannot
// strand an existing install: when the gate is open the worker is registered at the same URL and
// scope as always, and when it is closed nothing touches navigator.serviceWorker at all. In
// particular nothing ever unregisters a worker a visitor already has.
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import type { ToyToolsGlobal } from './types';

const gate = vi.hoisted(() => ({ sw: true }));

vi.mock('@lib/analytics/guard', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@lib/analytics/guard')>()),
  analyticsEnabled: false,
  get serviceWorkerEnabled() {
    return gate.sw;
  },
}));

import { attachPlatform } from './platform';

let register: ReturnType<typeof vi.fn>;
let getRegistrations: ReturnType<typeof vi.fn>;
let loadListeners: EventListener[];

beforeEach(() => {
  register = vi.fn(() => Promise.resolve({}));
  getRegistrations = vi.fn(() => Promise.resolve([]));
  Object.defineProperty(navigator, 'serviceWorker', {
    configurable: true,
    value: { register, getRegistrations },
  });
  // Capture the load listeners instead of adding them to the shared window, so one test's
  // listener can never fire in the next one.
  loadListeners = [];
  vi.spyOn(window, 'addEventListener').mockImplementation(((type: string, fn: EventListener) => {
    if (type === 'load') loadListeners.push(fn);
  }) as typeof window.addEventListener);
});

const fireLoad = () => loadListeners.forEach((fn) => fn(new Event('load')));

afterEach(() => {
  vi.restoreAllMocks();
});

describe('attachPlatform: service worker', () => {
  it('registers /sw.js at scope / on load when the gate is open (toytoolsapp.com)', () => {
    gate.sw = true;
    attachPlatform({} as ToyToolsGlobal);
    expect(register).not.toHaveBeenCalled();
    fireLoad();
    expect(register).toHaveBeenCalledTimes(1);
    expect(register).toHaveBeenCalledWith('/sw.js', { scope: '/' });
  });

  it('does nothing at all with navigator.serviceWorker when the gate is closed', () => {
    gate.sw = false;
    attachPlatform({} as ToyToolsGlobal);
    fireLoad();
    expect(loadListeners).toHaveLength(0);
    expect(register).not.toHaveBeenCalled();
    expect(getRegistrations).not.toHaveBeenCalled();
  });

  it('never unregisters a worker, so a closed gate cannot strand an existing install', () => {
    const src = readFileSync(resolve(__dirname, 'platform.ts'), 'utf8');
    expect(src).not.toMatch(/unregister\s*\(/);
    expect(src).not.toMatch(/getRegistrations?\s*\(/);
  });
});
