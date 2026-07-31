import { runJwt } from '@lib/engines/jwt/registry';
import type { AttachFn } from '../types';

/** ToyTools.runJwt(id, token) → { ok, decoded, error } */
export const attach: AttachFn = (TT) => {
  TT.runJwt = runJwt;
};
