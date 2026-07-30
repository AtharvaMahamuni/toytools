import { units } from '@lib/engines/units/registry';
import type { AttachFn } from '../types';

/** ToyTools.units.pxToRem/pxToDp/aspectRatio — CSS + mobile unit math namespace. */
export const attach: AttachFn = (TT) => {
  TT.units = units;
};
