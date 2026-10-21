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
  /** Rules-private bag. Absent for tic-tac-toe. Cloned with each ply. */
  extra?: unknown;
}

export interface MatchState extends Ply {
  rulesId: string;
  /** Who opened this game. Rematch hands the first move to the other seat. */
  starter: Seat;
  past: Ply[];
}

export type CellShape =
  | 'cross'
  | 'ring'
  | 'disc'
  | 'empty'
  | 'pawn'
  | 'rook'
  | 'knight'
  | 'bishop';

export interface CellView {
  index: number;
  mark: Seat | null;
  shape: CellShape;
  letter: string;
  /** The piece's full name for screen readers, e.g. "rook". Chess only. */
  name?: string;
  win: boolean;
  /** Column under the pointer, or a square chosen for the next tap. */
  preview?: boolean;
  /** A disc shown in the column before it drops. Not a placed mark. */
  ghost?: boolean;
}

export type BoardInput = 'cell' | 'column' | 'pair' | 'chess';

export interface HandPiece {
  id: string;
  letter: string;
  /** Full piece name, read by screen readers as "Place pawn". */
  name?: string;
}

export interface CollapseChoice {
  id: number;
  label: string;
}

export interface BoardLink {
  a: number;
  b: number;
}

export interface BoardView {
  columns: number;
  rows: number;
  cells: CellView[];
  banner: string;
  scoreText: string;
  canUndo: boolean;
  status: 'playing' | 'won' | 'draw';
  input: BoardInput;
  hand: HandPiece[];
  choices: CollapseChoice[];
  links: BoardLink[];
}

/** What a widget sends. Tic-tac-toe and Connect 4 send a column or square index. */
export type BoardMove =
  | number
  | { kind: 'place'; piece: string; index: number }
  | { kind: 'slide'; from: number; to: number }
  | { kind: 'mark'; a: number; b: number }
  | { kind: 'collapse'; resolution: number };

export interface ViewHint {
  column?: number | null;
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
  /** Never throws. An illegal move returns ok: false and the same ply. */
  apply(ply: Ply, move: BoardMove): { ok: boolean; ply: Ply; reason: string };
  view(ply: Ply, canUndo: boolean, hint?: ViewHint): BoardView;
}
