import { describe, it, expect } from 'vitest';
import {
  CHAINS,
  checkCommand,
  describeExpansions,
  escalate,
  findChain,
  findExpansions,
  posixQuote,
} from './quote';

/**
 * The property that matters most: quoting N times and then letting N shells parse it must return the
 * original command. `unquoteOnce` is a stand-in for one POSIX shell parse of a fully single-quoted
 * word, which is what every stage of a chain is by construction.
 */
function unquoteOnce(s: string): string {
  let out = '';
  let i = 0;
  let inQuotes = false;
  while (i < s.length) {
    const c = s[i];
    if (c === "'" && !inQuotes) {
      inQuotes = true;
      i++;
    } else if (c === "'" && inQuotes) {
      inQuotes = false;
      i++;
    } else if (c === '\\' && !inQuotes) {
      out += s[i + 1] ?? '';
      i += 2;
    } else {
      out += c;
      i++;
    }
  }
  return out;
}

describe('posixQuote', () => {
  it('wraps a plain word', () => {
    expect(posixQuote('hi')).toBe("'hi'");
  });

  it('survives one parse for a string containing single quotes', () => {
    const raw = "echo 'a b'";
    expect(unquoteOnce(posixQuote(raw))).toBe(raw);
  });

  it('protects every character a shell would otherwise expand', () => {
    const raw = '$HOME `id` $(pwd) * ~ "x"';
    expect(unquoteOnce(posixQuote(raw))).toBe(raw);
  });

  it('handles an empty string', () => {
    expect(unquoteOnce(posixQuote(''))).toBe('');
  });
});

describe('escalate', () => {
  it('applies one quoting round per hop', () => {
    expect(escalate('id', findChain('ssh')).layers).toBe(1);
    expect(escalate('id', findChain('ssh-sudo')).layers).toBe(2);
    expect(escalate('id', findChain('ssh-sudo-docker')).layers).toBe(3);
  });

  it('round-trips through exactly as many parses as there are layers, for every chain', () => {
    const command = `sh -c "echo 'a b' > /tmp/x y"`;
    for (const chain of CHAINS) {
      let s = escalate(command, chain).typed;
      for (let i = 0; i < chain.hops.length; i++) s = unquoteOnce(s);
      expect(s, `chain ${chain.id}`).toBe(command);
    }
  });

  it('is under-quoted by exactly one round if a layer is missed, which is the bug it prevents', () => {
    const command = "echo 'a b'";
    const oneShort = escalate(command, findChain('ssh')).typed;
    // Sent through a two-shell chain, a one-layer quoting does not survive.
    expect(unquoteOnce(unquoteOnce(oneShort))).not.toBe(command);
  });

  it('names every stage from what you type to what runs', () => {
    const { rungs } = escalate('id', findChain('ssh-sudo'));
    expect(rungs.map(r => r.label)).toEqual(['You type', 'Remote shell receives', 'What actually runs']);
    expect(rungs[rungs.length - 1].text).toBe('id');
  });

  it('gives one more rung than there are hops', () => {
    for (const chain of CHAINS) {
      expect(escalate('id', chain).rungs).toHaveLength(chain.hops.length + 1);
    }
  });
});

describe('findChain', () => {
  it('resolves a known id', () => {
    expect(findChain('ssh-docker').id).toBe('ssh-docker');
  });

  it('falls back to the first chain rather than throwing on an unknown id', () => {
    expect(findChain('nope')).toBe(CHAINS[0]);
  });
});

describe('findExpansions', () => {
  it('finds variables in both forms', () => {
    expect(findExpansions('echo $HOME and ${USER}').map(p => p.token)).toEqual(['$HOME', '${USER}']);
  });

  it('finds command substitution in both forms', () => {
    const kinds = findExpansions('echo $(pwd) `id`').map(p => p.kind);
    expect(kinds).toEqual(['command', 'command']);
  });

  it('finds globs and tildes', () => {
    const tokens = findExpansions('rm ~/tmp/*').map(p => p.token);
    expect(tokens).toContain('*');
    expect(tokens).toContain('~');
  });

  it('deduplicates a token repeated in one command', () => {
    expect(findExpansions('echo $HOME $HOME')).toHaveLength(1);
  });

  // The silence half, weighted equally with the firing half: an orientation line that appears over
  // ordinary commands turns a quiet tool into a nagging one, and a happy-path suite cannot see it.
  it('stays silent on a command with nothing to expand', () => {
    expect(findExpansions('systemctl restart nginx')).toEqual([]);
  });

  it('stays silent on an empty command', () => {
    expect(findExpansions('')).toEqual([]);
  });

  it('does not mistake arithmetic or awk fields for shell expansion', () => {
    expect(findExpansions("awk '{print $1}'")).toEqual([]);
    expect(findExpansions('echo 2 * 3')).not.toEqual([]); // a bare * IS a glob, and does expand
  });

  it('does not treat a mid-word tilde or asterisk as an expansion', () => {
    expect(findExpansions('grep a*b file')).toEqual([]);
    expect(findExpansions('echo user~name')).toEqual([]);
  });
});

describe('describeExpansions', () => {
  it('says nothing when there is nothing to say', () => {
    expect(describeExpansions([], findChain('ssh'))).toBeNull();
  });

  it('names the far end the expansion resolves on', () => {
    const line = describeExpansions(findExpansions('echo $HOME'), findChain('ssh-docker'));
    expect(line).toContain('$HOME');
    expect(line).toContain('container shell');
  });

  it('caps the listed tokens so the line stays one line on a phone', () => {
    const line = describeExpansions(findExpansions('echo $A $B $C $D $E $F'), findChain('ssh'))!;
    expect(line).toContain('and 2 more');
  });
});

describe('checkCommand', () => {
  it('accepts balanced quoting', () => {
    expect(checkCommand(`echo 'a b' "c d"`).ok).toBe(true);
  });

  it('accepts an empty command without complaining', () => {
    expect(checkCommand('   ').ok).toBe(true);
  });

  it('catches an unbalanced single quote', () => {
    expect(checkCommand("echo 'a b").message).toMatch(/single quote/);
  });

  it('catches an unbalanced double quote', () => {
    expect(checkCommand('echo "a b').message).toMatch(/double quote/);
  });

  it('does not count a quote nested inside the other kind', () => {
    expect(checkCommand(`echo "it's fine"`).ok).toBe(true);
    expect(checkCommand(`echo 'say "hi"'`).ok).toBe(true);
  });

  it('respects a backslash-escaped double quote', () => {
    expect(checkCommand('echo "a \\" b"').ok).toBe(true);
  });
});
