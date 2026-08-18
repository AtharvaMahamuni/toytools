// Wellness runtime. Deliberately does NOT import the calculator registry: that map holds every
// calculator, and pulling it in here put all eleven into the engine chunk, so each new tool made
// every existing wellness page heavier. The page declares the one it needs on the widget's
// `data-wellness` attribute, so only that chunk is fetched. See ../../engines/wellness/lazy.ts.

import { loadWellnessCalculator, runLazyWellness } from '@lib/engines/wellness/lazy';
// Safe to import eagerly: caveat.ts pulls only models.ts, the pure-math module every calculator
// already depends on. It does not reach the calculator registry, so the per-page chunking holds.
import { wellnessCaveat } from '@lib/engines/wellness/caveat';
import { attachExperience } from '../experience';
import { attachViz } from '../viz';
import type { AttachFn } from '../types';

/** ToyTools.runWellness(id, input, { locale? }) → InteractiveResult */
export const attach: AttachFn = async (TT) => {
  const ids = new Set<string>();
  for (const el of document.querySelectorAll('[data-wellness]')) {
    const id = el.getAttribute('data-wellness');
    if (id) ids.add(id);
  }
  // Awaited before TT.ready flips, so a widget's first onReady render already has its calculator.
  await Promise.all([...ids].map(loadWellnessCalculator));

  TT.runWellness = runLazyWellness;
  TT.wellnessCaveat = wellnessCaveat; // (id, input) → where this input sits in the model, or null
  attachExperience(TT);
  attachViz(TT);
};
