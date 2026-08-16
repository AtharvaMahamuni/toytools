// Layered POSIX shell quoting.
//
// The problem this models: a command sent to a far-away shell is parsed once by EVERY shell it
// passes through, and each parse consumes one level of quoting. `ssh host 'echo hi'` works because
// the local shell strips the quotes, ssh forwards the bare text, and the remote shell parses what
// arrives. Add one more layer (`sudo sh -c`, `docker exec sh -c`) and the quoting a person typed by
// hand is now one level short, silently: the command still runs, it just runs a different command.
//
// So the whole model is one function applied N times, where N is the number of shells between the
// keyboard and the process. Everything else here is presentation of the intermediate steps, which
// is the part a person cannot see and therefore cannot debug.
//
// Pure and synchronous. No browser APIs, no module-level state.

/** One shell that will parse the string on its way to the far end. */
export interface Hop {
  /** Label for the stage that RECEIVES the string after this hop parses it. */
  label: string;
  /** The command shape this hop represents, for the guide and the ladder subtitle. */
  form: string;
}

export interface Chain {
  id: string;
  label: string;
  /** Ordered outermost-first. Length is the number of quoting rounds required. */
  hops: Hop[];
}

/**
 * The realistic chains, rather than a bare "number of layers" spinner.
 *
 * A person in this situation does not think "I need three rounds of quoting", they think "this goes
 * over ssh and then into a container". Naming the chain is what makes the count correct without the
 * user having to work out the count, which is the arithmetic they were getting wrong.
 */
export const CHAINS: Chain[] = [
  {
    id: 'ssh',
    label: 'ssh',
    hops: [{ label: 'Remote shell', form: 'ssh host <command>' }],
  },
  {
    id: 'sudo',
    label: 'sudo sh -c',
    hops: [{ label: 'Root shell', form: 'sudo sh -c <command>' }],
  },
  {
    id: 'bash',
    label: 'bash -c',
    hops: [{ label: 'Inner shell', form: 'bash -c <command>' }],
  },
  {
    id: 'ssh-sudo',
    label: 'ssh, then sudo',
    hops: [
      { label: 'Remote shell', form: 'ssh host <command>' },
      { label: 'Root shell', form: 'sudo sh -c <command>' },
    ],
  },
  {
    id: 'ssh-docker',
    label: 'ssh, then docker exec',
    hops: [
      { label: 'Remote shell', form: 'ssh host <command>' },
      { label: 'Container shell', form: 'docker exec c sh -c <command>' },
    ],
  },
  {
    id: 'ssh-sudo-docker',
    label: 'ssh, sudo, then docker exec',
    hops: [
      { label: 'Remote shell', form: 'ssh host <command>' },
      { label: 'Root shell', form: 'sudo sh -c <command>' },
      { label: 'Container shell', form: 'docker exec c sh -c <command>' },
    ],
  },
];

export function findChain(id: string): Chain {
  return CHAINS.find(c => c.id === id) ?? CHAINS[0];
}

/**
 * Wrap a string so exactly one POSIX shell parse returns it unchanged.
 *
 * Single quotes are used rather than double quotes or backslash escaping because inside single
 * quotes a POSIX shell expands nothing at all: no $, no backtick, no glob, no tilde. That property
 * is what makes the transformation repeatable, and repeatability is the whole trick - double-quote
 * escaping would need a different rule at every layer depending on what survived the last one.
 *
 * The one character single quotes cannot contain is a single quote, so each one is closed, escaped
 * outside the quoting, and reopened: the classic '\'' dance.
 */
export function posixQuote(input: string): string {
  return `'${input.split("'").join(`'\\''`)}'`;
}

/** One visible step in the ladder: what a given layer hands to the next one. */
export interface Rung {
  /** 0 is what the user types; the last rung is what finally executes. */
  index: number;
  label: string;
  /** The exact literal at this stage. */
  text: string;
  /** Present on every rung except the last: the shell form that consumes this text. */
  form?: string;
}

export interface Escalation {
  /** The string to type, quoted for every layer in the chain. */
  typed: string;
  /** Outermost-first, starting with what the user types and ending with what runs. */
  rungs: Rung[];
  /** Number of quoting rounds applied. */
  layers: number;
}

/**
 * Quote `command` for every shell in `chain`, keeping each intermediate stage.
 *
 * Built inside-out, which is also the only order a person can reason about it: start from the thing
 * that must finally run, and add one layer of protection per shell standing between it and the
 * keyboard.
 */
export function escalate(command: string, chain: Chain): Escalation {
  const stages: string[] = [command];
  for (let i = chain.hops.length - 1; i >= 0; i--) {
    stages.unshift(posixQuote(stages[0]));
  }

  const rungs: Rung[] = stages.map((text, index) => {
    if (index === 0) {
      return { index, label: 'You type', text, form: chain.hops[0]?.form };
    }
    if (index === stages.length - 1) {
      return { index, label: 'What actually runs', text };
    }
    return { index, label: `${chain.hops[index - 1].label} receives`, text, form: chain.hops[index].form };
  });

  return { typed: stages[0], rungs, layers: chain.hops.length };
}

/* ------------------------------------------------------------------ expansion points (the craft) */

export type ExpansionKind = 'variable' | 'command' | 'glob' | 'tilde';

export interface ExpansionPoint {
  kind: ExpansionKind;
  /** The literal token found, e.g. "$HOME". */
  token: string;
}

/**
 * Tokens in the command that a shell would expand.
 *
 * Why this is worth surfacing: single-quoting protects all of them, so they survive every layer and
 * expand on the LAST shell, against the far end's environment and filesystem. That is usually what
 * someone wants and occasionally the opposite, and either way it is invisible in the output - the
 * quoted string looks identical whether `$HOME` was meant to be the local home directory or the
 * remote one. The tool knows which side it will resolve on; the person reading a wall of backslashes
 * does not.
 *
 * Pure, never throws, and returns an empty list for ordinary commands so the affordance stays silent.
 */
export function findExpansions(command: string): ExpansionPoint[] {
  const found: ExpansionPoint[] = [];
  const seen = new Set<string>();

  const push = (kind: ExpansionKind, token: string) => {
    const key = `${kind}:${token}`;
    if (seen.has(key)) return;
    seen.add(key);
    found.push({ kind, token });
  };

  // $VAR and ${VAR}. $1-style positionals and bare "$" are skipped: they are not the confusion this
  // line exists to resolve, and naming them would make it fire on ordinary awk and jq one-liners.
  for (const m of command.matchAll(/\$\{[A-Za-z_][A-Za-z0-9_]*\}|\$[A-Za-z_][A-Za-z0-9_]*/g)) {
    push('variable', m[0]);
  }
  // $(...) and `...`
  for (const m of command.matchAll(/\$\([^)]*\)|`[^`]*`/g)) push('command', m[0]);
  // Globs. A bare * inside an already-quoted argument still expands on the far side, so position is
  // not checked; the point is only that the far shell is where it resolves.
  for (const m of command.matchAll(/(?<![\w'"])[*?](?![\w])|\[[^\]]+\]/g)) push('glob', m[0]);
  // Leading ~ or ~user, only where a shell would actually expand it (start of a word).
  for (const m of command.matchAll(/(?<=^|\s)~[A-Za-z0-9_-]*(?=\/|\s|$)/g)) push('tilde', m[0]);

  return found;
}

const KIND_NOUN: Record<ExpansionKind, string> = {
  variable: 'variable',
  command: 'command substitution',
  glob: 'glob',
  tilde: 'home directory',
};

/**
 * One line of fact about where the expansions resolve, or null when there is nothing to say.
 *
 * Returns null rather than an empty string so the caller cannot accidentally render an empty row,
 * and so "say nothing" is a value the tests can assert on.
 */
export function describeExpansions(points: ExpansionPoint[], chain: Chain): string | null {
  if (points.length === 0) return null;

  const where = chain.hops.length > 0 ? chain.hops[chain.hops.length - 1].label.toLowerCase() : 'final shell';
  const kinds = [...new Set(points.map(p => p.kind))].map(k => KIND_NOUN[k]);
  const list = points.slice(0, 4).map(p => p.token).join(', ');
  const more = points.length > 4 ? ` and ${points.length - 4} more` : '';
  const nouns = kinds.length === 1 ? kinds[0] : `${kinds.slice(0, -1).join(', ')} and ${kinds[kinds.length - 1]}`;

  return (
    `The quoting protects ${list}${more}, so ${nouns} resolves on the ${where}, not on your machine. ` +
    `Substitute the local value first if you meant this end.`
  );
}

/* ---------------------------------------------------------------------------------- validation */

export interface CommandCheck {
  ok: boolean;
  message?: string;
}

/**
 * Catch a command that is already broken before it is quoted.
 *
 * Quoting an unbalanced command produces a perfectly valid string that fails at the far end, which
 * is the worst outcome available: the tool would look like it worked. Counting quotes outside each
 * other's spans is enough to catch the real case (a copied fragment) without pretending to be a
 * shell parser.
 */
export function checkCommand(command: string): CommandCheck {
  if (command.trim() === '') return { ok: true };

  let single = false;
  let double = false;
  for (let i = 0; i < command.length; i++) {
    const c = command[i];
    if (c === '\\' && double) {
      i++;
      continue;
    }
    if (c === "'" && !double) single = !single;
    else if (c === '"' && !single) double = !double;
  }

  if (single) return { ok: false, message: 'Unbalanced single quote in the command.' };
  if (double) return { ok: false, message: 'Unbalanced double quote in the command.' };
  return { ok: true };
}
