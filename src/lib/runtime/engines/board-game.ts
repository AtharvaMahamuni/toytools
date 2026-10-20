import { createBoardGameApi } from '@lib/engines/board-game/registry';
import type { AttachFn } from '../types';

/** ToyTools.boardGame — hot-seat matches. Rules stay in the engine chunk, not the widget. */
export const attach: AttachFn = (TT) => {
  TT.boardGame = createBoardGameApi();
};
