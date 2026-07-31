// Inline-SVG trend rendering, shared by the wellness and tracker engines.
import { sparklineSvg } from '@lib/visualization/render';
import type { ToyToolsGlobal } from './types';

/** ToyTools.viz.sparkline(values) → inline SVG trend line. */
export function attachViz(TT: ToyToolsGlobal): void {
  TT.viz = { sparkline: sparklineSvg };
}
