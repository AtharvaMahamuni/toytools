// Board Game Engine. A match is pure data: two seats, a board, one-ply history, a session score.
// Rules modules decide what a tap means. They return a result and never throw.

export type Seat = 'X' | 'O';
export type Outcome = Seat | 'draw' | null;

export interface Score {
  X: number;
  O: number;
  draws: number;
}

/** The board at one moment, without the history stack. */
export interface Ply {
  cells: (Seat | null)[];
  turn: Seat;
  score: Score;
  outcome: Outcome;
}

export interface MatchState extends Ply {
  rulesId: string;
  /** Who opened this game. Rematch hands the first move to the other seat. */
  starter: Seat;
  past: Ply[];
}

export interface CellView {
  index: number;
  mark: Seat | null;
  shape: 'cross' | 'ring' | 'empty';
  letter: string;
  win: boolean;
}

export interface BoardView {
  columns: number;
  rows: number;
  cells: CellView[];
  banner: string;
  scoreText: string;
  canUndo: boolean;
  status: 'playing' | 'won' | 'draw';
}

export interface MoveResult {
  ok: boolean;
  state: MatchState;
  reason: string;
}

export interface Rules {
  id: string;
  columns: number;
  rows: number;
  /** A fresh board with `starter` (X by default) to move. */
  create(starter?: Seat): Ply;
  /** Never throws. An illegal index returns ok: false and the same ply. */
  apply(ply: Ply, index: number): { ok: boolean; ply: Ply; reason: string };
  view(ply: Ply, canUndo: boolean): BoardView;
}
