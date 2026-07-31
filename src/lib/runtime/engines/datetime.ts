import { runDateTime } from '@lib/engines/datetime/registry';
import { attachExperience } from '../experience';
import type { AttachFn } from '../types';

/** ToyTools.runDateTime(id, input, { timezone?, locale? }) → InteractiveResult */
export const attach: AttachFn = (TT) => {
  TT.runDateTime = runDateTime;
  attachExperience(TT);
};
