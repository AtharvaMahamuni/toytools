// The platform experience renderer, shared by every "schema in, InteractiveResult out" engine
// (finance, datetime, math, wellness). Each of those attach modules imports this, so Vite emits it
// once as a chunk shared between them rather than duplicating it into four bundles.
import { renderExperience } from '@lib/experience/render';
import type { ToyToolsGlobal } from './types';

/** ToyTools.experience.render(root, result) → fills the experience shell. */
export function attachExperience(TT: ToyToolsGlobal): void {
  TT.experience = { render: renderExperience };
}
