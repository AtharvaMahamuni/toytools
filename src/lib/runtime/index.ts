// Deferred half of the ToyTools runtime.
//
// The inline half (ToyToolsRuntime.astro) defines everything that must exist during parse — state,
// toast, copy, storage, prefs, profile, history, focus, keyboard shortcuts — and the onReady queue.
// This module supplies the ENGINE surfaces, and only the ones the page asks for.
//
// Why it is split: this used to be one bundle statically importing all ~18 engines, so every page
// (a guide, the homepage, a physics simulation) downloaded, parsed and executed ~231 KB of engine
// code to use at most one of them. A page now declares its engine in <meta name="tt-engines">
// (BaseLayout, from the tool's registry entry) and only that engine's chunk is fetched.
//
// The readiness contract is unchanged and is what makes this safe: widget inline scripts run during
// parse, engine functions attach later, so a widget's first render must be scheduled through
// ToyTools.onReady(). That was already true when this was a static bundle — the wait is just longer
// now. TT.ready flips once, after the declared engines have attached (or failed to).

import { attachPlatform } from './platform';
import { ENGINE_LOADERS } from './loaders';
import type { ToyToolsGlobal } from './types';

const TT: ToyToolsGlobal = ((window as any).ToyTools ??= {});

attachPlatform(TT);

/** Engine ids this page declared, e.g. "datetime". Empty on non-tool pages. */
function declaredEngines(): string[] {
  const meta = document.querySelector('meta[name="tt-engines"]');
  const content = meta?.getAttribute('content') ?? '';
  return content.split(',').map((s) => s.trim()).filter(Boolean);
}

function markReady(): void {
  TT.ready = true;
  const cbs = TT._readyCbs;
  if (cbs) {
    // Callbacks are one-shot: clear first so a callback that itself calls onReady runs immediately
    // via the TT.ready branch instead of being queued into a list nobody drains again.
    TT._readyCbs = [];
    for (const fn of cbs) {
      try { fn(); } catch (_) { /* one broken widget must not strand the others */ }
    }
  }
}

void Promise.all(
  declaredEngines().map(async (id) => {
    const load = ENGINE_LOADERS[id];
    if (!load) return; // engines with no browser runtime (physics, calculator, ...) are not an error
    try {
      (await load()).attach(TT);
    } catch (_) {
      // A failed engine chunk must still let the page finish booting: widgets guard on the
      // functions they need, and the alternative is a permanently un-flushed onReady queue.
    }
  }),
).finally(markReady);
