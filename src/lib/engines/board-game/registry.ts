import { ticTacToe } from './rules/tic-tac-toe';
import type { BoardView, MatchState, MoveResult, Ply, Rules, Score } from './types';

export const RULES: Record<string, Rules> = {
  'tic-tac-toe': ticTacToe,
};

function snapshot(ply: Ply): Ply {
  return {
    cells: ply.cells.slice(),
    turn: ply.turn,
    score: { ...ply.score },
    outcome: ply.outcome,
  };
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

    apply(state: MatchState, index: number): MoveResult {
      const rules = RULES[state.rulesId];
      if (!rules) return { ok: false, state, reason: 'This board is not available.' };
      const result = rules.apply(snapshot(state), index);
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

    view(state: MatchState): BoardView {
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
        };
      }
      return rules.view(snapshot(state), state.past.length > 0);
    },
  };
}

export type BoardGameApi = ReturnType<typeof createBoardGameApi>;
