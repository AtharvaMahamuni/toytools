import { emptyScore, winningLine } from './tic-tac-toe';
import { scoreText } from './connect-4';
import type { BoardMove, BoardView, CellView, Outcome, Ply, Rules, Seat } from '../types';

const OVER = 'The match is over. Rematch to play again.';
const NAMES = [
  'top left',
  'top middle',
  'top right',
  'middle left',
  'center',
  'middle right',
  'bottom left',
  'bottom middle',
  'bottom right',
];

const LINES: readonly (readonly number[])[] = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

export interface QMark {
  n: number;
  seat: Seat;
  a: number;
  b: number;
}

interface CollapseOption {
  cells: (Seat | null)[];
  marks: QMark[];
  /** Subscript of the mark that became classical on each square. 0 means still open. */
  subs: number[];
  label: string;
}

interface QuantumExtra {
  marks: QMark[];
  next: number;
  subs: number[];
  pending: { chooser: Seat; options: CollapseOption[] } | null;
  note: string;
}

function freshExtra(): QuantumExtra {
  return { marks: [], next: 1, subs: Array<number>(9).fill(0), pending: null, note: '' };
}

function extraOf(ply: Ply): QuantumExtra {
  return ply.extra as QuantumExtra;
}

function other(seat: Seat): Seat {
  return seat === 'X' ? 'O' : 'X';
}

function onBoard(index: number): boolean {
  return Number.isInteger(index) && index >= 0 && index < 9;
}

function path(marks: readonly QMark[], from: number, to: number): number[] | null {
  const adj = new Map<number, number[]>();
  for (const mark of marks) {
    if (!adj.has(mark.a)) adj.set(mark.a, []);
    if (!adj.has(mark.b)) adj.set(mark.b, []);
    adj.get(mark.a)!.push(mark.b);
    adj.get(mark.b)!.push(mark.a);
  }
  const prev = new Map<number, number>();
  const queue = [from];
  prev.set(from, -1);
  while (queue.length) {
    const current = queue.shift()!;
    if (current === to) break;
    for (const next of adj.get(current) ?? []) {
      if (prev.has(next)) continue;
      prev.set(next, current);
      queue.push(next);
    }
  }
  if (!prev.has(to)) return null;
  const nodes = [to];
  let cursor = to;
  while (prev.get(cursor)! !== -1) {
    cursor = prev.get(cursor)!;
    nodes.push(cursor);
  }
  return nodes.reverse();
}

function edgeBetween(marks: readonly QMark[], a: number, b: number): QMark | undefined {
  return marks.find(mark => (mark.a === a && mark.b === b) || (mark.a === b && mark.b === a));
}

function component(marks: readonly QMark[], start: number): QMark[] {
  const seen = new Set<number>([start]);
  let grew = true;
  while (grew) {
    grew = false;
    for (const mark of marks) {
      if (seen.has(mark.a) && !seen.has(mark.b)) {
        seen.add(mark.b);
        grew = true;
      }
      if (seen.has(mark.b) && !seen.has(mark.a)) {
        seen.add(mark.a);
        grew = true;
      }
    }
  }
  return marks.filter(mark => seen.has(mark.a) && seen.has(mark.b));
}

function forceStems(seed: Map<number, QMark>, marks: readonly QMark[]): Map<number, QMark> | null {
  const placed = new Map(seed);
  const used = new Set<QMark>(seed.values());
  let changed = true;
  while (changed) {
    changed = false;
    for (const mark of marks) {
      if (used.has(mark)) continue;
      const aTaken = placed.has(mark.a);
      const bTaken = placed.has(mark.b);
      if (aTaken && bTaken) return null;
      if (!aTaken && !bTaken) continue;
      placed.set(aTaken ? mark.b : mark.a, mark);
      used.add(mark);
      changed = true;
    }
  }
  const open = marks.filter(mark => !used.has(mark) && (placed.has(mark.a) || placed.has(mark.b)));
  if (open.length) return null;
  return placed;
}

function optionsFor(
  cells: readonly (Seat | null)[],
  marks: readonly QMark[],
  cycle: readonly number[],
  closing: QMark,
  prevSubs: readonly number[],
): CollapseOption[] | null {
  // `cycle` is the path from the closing mark's a to its b through the older marks, so the cycle's
  // edges are the path's edges, then the closing mark back from b to a. Picking each edge by its
  // two squares alone fails on a 2-cycle (X1 0-1, then O2 0-1): both edges join the same squares,
  // and the older mark was found both ways. So the last edge is the closing mark itself, and each
  // path edge is an older mark not already used.
  const older = marks.filter(mark => mark !== closing);
  const edges: QMark[] = [];
  for (let i = 0; i + 1 < cycle.length; i += 1) {
    const edge = edgeBetween(older.filter(mark => !edges.includes(mark)), cycle[i]!, cycle[i + 1]!);
    if (!edge) return null;
    edges.push(edge);
  }
  edges.push(closing);
  // Two orientations: each edge collapses onto its first square, or onto its second.
  const seeds: Map<number, QMark>[] = [new Map(), new Map()];
  edges.forEach((edge, i) => {
    seeds[0]!.set(cycle[i]!, edge);
    seeds[1]!.set(cycle[(i + 1) % cycle.length]!, edge);
  });
  const group = component(marks, cycle[0]!);
  const options: CollapseOption[] = [];
  for (const seed of seeds) {
    const placed = forceStems(seed, group);
    if (!placed) return null;
    const nextCells = cells.slice();
    const subs = prevSubs.slice();
    let land = -1;
    for (const [index, mark] of placed) {
      nextCells[index] = mark.seat;
      subs[index] = mark.n;
      if (mark === closing) land = index;
    }
    if (land < 0) return null;
    const used = new Set(placed.values());
    options.push({
      cells: nextCells,
      marks: marks.filter(mark => !used.has(mark)),
      subs,
      label: `${closing.seat}${closing.n} in the ${NAMES[land]!}`,
    });
  }
  return options;
}

function earliest(cells: readonly (Seat | null)[], seat: Seat, subs: readonly number[]): number | null {
  let best: number | null = null;
  for (const line of LINES) {
    if (!line.every(index => cells[index] === seat)) continue;
    const max = Math.max(...line.map(index => subs[index] ?? 0));
    if (best === null || max < best) best = max;
  }
  return best;
}

/** The earlier classical line takes the point. A tie on the subscript goes to X. */
function decide(cells: readonly (Seat | null)[], subs: readonly number[]): { outcome: Outcome; note: string } {
  const xMax = earliest(cells, 'X', subs);
  const oMax = earliest(cells, 'O', subs);
  if (xMax === null && oMax === null) return { outcome: null, note: '' };
  if (xMax !== null && oMax === null) return { outcome: 'X', note: '' };
  if (oMax !== null && xMax === null) return { outcome: 'O', note: '' };
  if (xMax! <= oMax!) return { outcome: 'X', note: 'O has a later line.' };
  return { outcome: 'O', note: 'X has a later line.' };
}

function openSquares(cells: readonly (Seat | null)[]): number {
  return cells.filter(cell => cell === null).length;
}

function lettersAt(index: number, cells: readonly (Seat | null)[], marks: readonly QMark[]): string {
  if (cells[index]) return cells[index]!;
  return marks
    .filter(mark => mark.a === index || mark.b === index)
    .map(mark => `${mark.seat}${mark.n}`)
    .join(' ');
}

function viewCells(ply: Ply): CellView[] {
  const bag = extraOf(ply);
  const win = new Set(
    ply.outcome && ply.outcome !== 'draw'
      ? winningLine(ply.cells.map(cell => (cell === ply.outcome ? cell : null)))
      : [],
  );
  return ply.cells.map((mark, index) => ({
    index,
    mark,
    shape: mark === 'X' ? 'cross' : mark === 'O' ? 'ring' : 'empty',
    letter: lettersAt(index, ply.cells, bag.marks),
    win: win.has(index),
  }));
}

function commit(
  ply: Ply,
  cells: (Seat | null)[],
  turn: Seat,
  outcome: Outcome,
  extra: QuantumExtra,
): { ok: true; ply: Ply; reason: string } {
  const score = { ...ply.score };
  if (outcome === 'X' || outcome === 'O') score[outcome] += 1;
  if (outcome === 'draw') score.draws += 1;
  return { ok: true, ply: { cells, turn, score, outcome, extra }, reason: '' };
}

export const quantumTicTacToe: Rules = {
  id: 'quantum-tic-tac-toe',
  columns: 3,
  rows: 3,
  create(starter: Seat = 'X'): Ply {
    return {
      cells: Array<Seat | null>(9).fill(null),
      turn: starter,
      score: emptyScore(),
      outcome: null,
      extra: freshExtra(),
    };
  },
  apply(ply, move: BoardMove) {
    if (ply.outcome) return { ok: false, ply, reason: OVER };
    const bag = extraOf(ply);
    if (bag.pending) {
      if (typeof move === 'number' || move.kind !== 'collapse') {
        return { ok: false, ply, reason: 'Choose how the cycle collapses.' };
      }
      const option = bag.pending.options[move.resolution];
      if (!option) return { ok: false, ply, reason: 'That collapse is not one of the two resolutions.' };
      const { outcome, note } = decide(option.cells, option.subs);
      const finalOutcome: Outcome = outcome ?? (openSquares(option.cells) === 0 ? 'draw' : null);
      return commit(ply, option.cells, bag.pending.chooser, finalOutcome, {
        marks: option.marks,
        next: bag.next,
        subs: option.subs,
        pending: null,
        note,
      });
    }

    if (typeof move !== 'object' || move.kind !== 'mark') {
      return { ok: false, ply, reason: 'A move marks two different squares.' };
    }
    if (!onBoard(move.a) || !onBoard(move.b)) {
      return { ok: false, ply, reason: 'That square is not on the board.' };
    }
    if (ply.cells[move.a] || ply.cells[move.b]) {
      return { ok: false, ply, reason: 'That square already has a classical mark.' };
    }
    if (move.a === move.b) {
      // With one square left a move cannot mark two, so the last square takes a classical mark
      // (tap it twice). That can still complete a line, so it is not a draw until it is played.
      if (openSquares(ply.cells) !== 1) return { ok: false, ply, reason: 'A move marks two different squares.' };
      const cells = ply.cells.slice();
      cells[move.a] = ply.turn;
      const subs = bag.subs.slice();
      subs[move.a] = bag.next;
      const { outcome, note } = decide(cells, subs);
      return commit(ply, cells, other(ply.turn), outcome ?? 'draw', {
        marks: bag.marks.slice(),
        next: bag.next + 1,
        subs,
        pending: null,
        note,
      });
    }

    const mark: QMark = { n: bag.next, seat: ply.turn, a: move.a, b: move.b };
    const marks = bag.marks.concat(mark);
    const cycle = path(bag.marks, move.a, move.b);
    if (!cycle) {
      return commit(ply, ply.cells.slice(), other(ply.turn), null, {
        marks,
        next: bag.next + 1,
        subs: bag.subs.slice(),
        pending: null,
        note: '',
      });
    }
    const options = optionsFor(ply.cells, marks, cycle, mark, bag.subs);
    if (!options) return { ok: false, ply, reason: 'That cycle has no collapse.' };
    return {
      ok: true,
      ply: {
        cells: ply.cells.slice(),
        turn: other(ply.turn),
        score: ply.score,
        outcome: null,
        extra: {
          marks,
          next: bag.next + 1,
          subs: bag.subs.slice(),
          pending: { chooser: other(ply.turn), options },
          note: '',
        },
      },
      reason: '',
    };
  },
  view(ply, canUndo): BoardView {
    const bag = extraOf(ply);
    const pending = bag.pending;
    let banner = `${ply.turn} to play. Pass the phone.`;
    if (ply.outcome === 'draw') banner = 'Draw.';
    else if (ply.outcome) banner = bag.note ? `${ply.outcome} wins. ${bag.note}` : `${ply.outcome} wins.`;
    else if (pending) banner = `${pending.chooser} to choose the collapse. Pass the phone.`;
    return {
      columns: 3,
      rows: 3,
      cells: viewCells(ply),
      banner,
      scoreText: scoreText(ply),
      canUndo,
      status: ply.outcome === null ? 'playing' : ply.outcome === 'draw' ? 'draw' : 'won',
      input: 'pair',
      hand: [],
      choices: pending && !ply.outcome ? pending.options.map((option, id) => ({ id, label: option.label })) : [],
      links: bag.marks.map(mark => ({ a: mark.a, b: mark.b })),
    };
  },
};
