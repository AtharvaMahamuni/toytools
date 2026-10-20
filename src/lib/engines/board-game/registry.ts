import { chessTacToe } from './rules/chess-tac-toe';
import { connect4 } from './rules/connect-4';
import { quantumTicTacToe } from './rules/quantum-tic-tac-toe';
import { ticTacToe } from './rules/tic-tac-toe';
import type { BoardMove, BoardView, MatchState, MoveResult, Ply, Rules, Score, ViewHint } from './types';

export const RULES: Record<string, Rules> = {
  'tic-tac-toe': ticTacToe,
  'connect-4': connect4,
  'chess-tac-toe': chessTacToe,
  'quantum-tic-tac-toe': quantumTicTacToe,
};

function snapshot(ply: Ply): Ply {
  const next: Ply = {
    cells: ply.cells.slice(),
    turn: ply.turn,
    score: { ...ply.score },
    outcome: ply.outcome,
  };
  if (ply.extra !== undefined) next.extra = structuredClone(ply.extra);
  return next;
}

function unavailable(rulesId: string): MatchState {
  return {
    rulesId,
    cells: [],
    turn: 'X',
    score: { X: 0, O: 0, draws: 0 },
    outcome: null,
    past: [],
  };
}

function isScore(score: Score | undefined): score is Score {
  if (!score) return false;
  return [score.X, score.O, score.draws].every(n => Number.isInteger(n) && n >= 0);
}

export function createBoardGameApi() {
  return {
    create(rulesId: string, score?: Score): MatchState {
      const rules = RULES[rulesId];
      if (!rules) return unavailable(rulesId);
      const ply = rules.create();
      if (isScore(score)) ply.score = { ...score };
      return { rulesId, ...snapshot(ply), past: [] };
    },

    apply(state: MatchState, move: BoardMove): MoveResult {
      const rules = RULES[state.rulesId];
      if (!rules) return { ok: false, state, reason: 'This board is not available.' };
      const result = rules.apply(snapshot(state), move);
      if (!result.ok) return { ok: false, state, reason: result.reason };
      return {
        ok: true,
        state: { rulesId: state.rulesId, ...snapshot(result.ply), past: state.past.concat(snapshot(state)) },
        reason: '',
      };
    },

    undo(state: MatchState): MatchState {
      if (!state.past.length) return state;
      const prev = state.past[state.past.length - 1]!;
      return { rulesId: state.rulesId, ...snapshot(prev), past: state.past.slice(0, -1) };
    },

    rematch(state: MatchState): MatchState {
      const rules = RULES[state.rulesId];
      if (!rules) return state;
      const fresh = rules.create();
      return {
        rulesId: state.rulesId,
        ...snapshot(fresh),
        score: { ...state.score },
        past: [],
      };
    },

    view(state: MatchState, hint?: ViewHint): BoardView {
      const rules = RULES[state.rulesId];
      if (!rules) {
        return {
          columns: 0,
          rows: 0,
          cells: [],
          banner: 'This board is not available.',
          scoreText: '',
          canUndo: false,
          status: 'playing',
          input: 'cell',
          hand: [],
          choices: [],
          links: [],
        };
      }
      return rules.view(snapshot(state), state.past.length > 0, hint);
    },
  };
}

export type BoardGameApi = ReturnType<typeof createBoardGameApi>;
