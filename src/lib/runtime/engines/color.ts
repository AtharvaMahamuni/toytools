import { color } from '@lib/engines/color/registry';
import type { AttachFn } from '../types';

/** ToyTools.color.parse/formats/check/wcag/suggest — color math namespace. */
export const attach: AttachFn = (TT) => {
  TT.color = color;
};
