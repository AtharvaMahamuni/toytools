import { runWellness } from '@lib/engines/wellness/registry';
import { attachExperience } from '../experience';
import { attachViz } from '../viz';
import type { AttachFn } from '../types';

/** ToyTools.runWellness(id, input, { locale? }) → InteractiveResult */
export const attach: AttachFn = (TT) => {
  TT.runWellness = runWellness;
  attachExperience(TT);
  attachViz(TT);
};
