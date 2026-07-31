import { runMath } from '@lib/engines/math/registry';
import { attachExperience } from '../experience';
import type { AttachFn } from '../types';

/** ToyTools.runMath(id, input, { locale? }) → InteractiveResult */
export const attach: AttachFn = (TT) => {
  TT.runMath = runMath;
  attachExperience(TT);
};
