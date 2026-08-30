import { describe, it, expect } from 'vitest';
import electronConfiguration, {
  AUFBAU,
  EXCEPTIONS,
  aufbauFill,
  configurationFor,
  configurationString,
  currentConfiguration,
  dElectrons,
  electronsInShell,
  neutralConfiguration,
  nobleCore,
  outermostShell,
  placedConfiguration,
  shorthandString,
  speciesLabel,
  totalElectrons,
  unpairedElectrons,
  valenceElectrons,
} from './electron-configuration';
import { MAX_Z } from '../data/elements';
import { SUBSTEP } from '../loop';
import type { SimState } from '../types';

function stateFor(atomicNumber: number, charge = 0): SimState {
  const params = { atomicNumber, charge };
  return { t: 0, params, vars: electronConfiguration.init(params) };
}

const asString = (z: number, charge = 0) => configurationString(configurationFor(z, charge));

describe('aufbau order', () => {
  it('is sorted by n + l, with lower n breaking ties', () => {
    for (let i = 1; i < AUFBAU.length; i++) {
      const prev = AUFBAU[i - 1]!;
      const cur = AUFBAU[i]!;
      const a = prev.n + prev.l;
      const b = cur.n + cur.l;
      expect(a <= b, `${prev.label} before ${cur.label}`).toBe(true);
      if (a === b) expect(prev.n).toBeLessThan(cur.n);
    }
  });

  it('holds exactly the whole periodic table', () => {
    expect(AUFBAU.reduce((sum, s) => sum + s.capacity, 0)).toBe(MAX_Z);
  });

  it('puts 4s before 3d, which is the whole reason the order is worth drawing', () => {
    const labels = AUFBAU.map((s) => s.label);
    expect(labels.indexOf('4s')).toBeLessThan(labels.indexOf('3d'));
    expect(labels.indexOf('6s')).toBeLessThan(labels.indexOf('4f'));
  });
});

describe('neutral configurations', () => {
  it('matches the textbook string for common elements', () => {
    expect(asString(1)).toBe('1s1');
    expect(asString(2)).toBe('1s2');
    expect(asString(8)).toBe('1s2 2s2 2p4');
    expect(asString(11)).toBe('1s2 2s2 2p6 3s1');
    expect(asString(18)).toBe('1s2 2s2 2p6 3s2 3p6');
    expect(asString(26)).toBe('1s2 2s2 2p6 3s2 3p6 4s2 3d6');
  });

  it('conserves electrons for every element', () => {
    for (let z = 1; z <= MAX_Z; z++) {
      expect(totalElectrons(neutralConfiguration(z)), `Z=${z}`).toBe(z);
    }
  });

  it('never exceeds a subshell capacity', () => {
    for (let z = 1; z <= MAX_Z; z++) {
      const config = neutralConfiguration(z);
      for (let i = 0; i < config.length; i++) {
        expect(config[i]!, `Z=${z} ${AUFBAU[i]!.label}`).toBeLessThanOrEqual(AUFBAU[i]!.capacity);
        expect(config[i]!).toBeGreaterThanOrEqual(0);
      }
    }
  });
});

describe('ground-state exceptions', () => {
  it('gives chromium a half-filled 3d and a single 4s', () => {
    expect(asString(24)).toBe('1s2 2s2 2p6 3s2 3p6 4s1 3d5');
  });

  it('gives copper a filled 3d and a single 4s', () => {
    expect(asString(29)).toBe('1s2 2s2 2p6 3s2 3p6 4s1 3d10');
  });

  it('empties palladium 5s entirely', () => {
    const config = neutralConfiguration(46);
    const i5s = AUFBAU.findIndex((s) => s.label === '5s');
    const i4d = AUFBAU.findIndex((s) => s.label === '4d');
    expect(config[i5s]).toBe(0);
    expect(config[i4d]).toBe(10);
  });

  it('leaves gadolinium with a half-filled 4f and one 5d', () => {
    const config = neutralConfiguration(64);
    const i4f = AUFBAU.findIndex((s) => s.label === '4f');
    const i5d = AUFBAU.findIndex((s) => s.label === '5d');
    expect(config[i4f]).toBe(7);
    expect(config[i5d]).toBe(1);
  });

  it('keeps every exception a pure transfer that conserves electrons', () => {
    for (const z of Object.keys(EXCEPTIONS).map(Number)) {
      expect(totalElectrons(neutralConfiguration(z)), `Z=${z}`).toBe(z);
      expect(neutralConfiguration(z)).not.toEqual(aufbauFill(z));
    }
  });
});

describe('ions', () => {
  it('takes 4s before 3d, so Fe2+ is [Ar] 3d6', () => {
    expect(shorthandString(configurationFor(26, 2))).toBe('[Ar] 3d6');
    expect(shorthandString(configurationFor(26, 3))).toBe('[Ar] 3d5');
  });

  it('empties the outer shell of a main-group cation', () => {
    expect(shorthandString(configurationFor(11, 1))).toBe('[Ne]');
    expect(shorthandString(configurationFor(12, 2))).toBe('[Ne]');
  });

  it('fills an anion up to the next noble gas', () => {
    expect(shorthandString(configurationFor(17, -1))).toBe('[Ar]');
    expect(shorthandString(configurationFor(8, -2))).toBe('[Ne]');
  });

  it('conserves electrons across the whole charge range', () => {
    for (let z = 1; z <= MAX_Z; z += 7) {
      for (const charge of [-3, -1, 0, 2, 3]) {
        const expected = Math.max(0, z - charge);
        expect(totalElectrons(configurationFor(z, charge)), `Z=${z} q=${charge}`).toBe(
          Math.min(expected, MAX_Z),
        );
      }
    }
  });

  it('never goes negative when the charge exceeds the electron count', () => {
    const config = configurationFor(1, 3);
    expect(totalElectrons(config)).toBe(0);
    expect(config.every((c) => c >= 0)).toBe(true);
  });
});

describe('derived counts', () => {
  it('reads valence electrons off the outermost shell', () => {
    expect(valenceElectrons(neutralConfiguration(17))).toBe(7); // Cl 3s2 3p5
    expect(valenceElectrons(neutralConfiguration(20))).toBe(2); // Ca 4s2
    expect(valenceElectrons(neutralConfiguration(26))).toBe(2); // Fe 4s2
  });

  it('reports the d electrons a transition metal also bonds with', () => {
    expect(dElectrons(neutralConfiguration(26))).toBe(6);
    expect(dElectrons(neutralConfiguration(20))).toBe(0);
    expect(dElectrons(neutralConfiguration(30))).toBe(0); // zinc: 3d is full, not incomplete
  });

  it('counts unpaired electrons by Hund\'s rule', () => {
    expect(unpairedElectrons(neutralConfiguration(6))).toBe(2); // C 2p2
    expect(unpairedElectrons(neutralConfiguration(7))).toBe(3); // N 2p3
    expect(unpairedElectrons(neutralConfiguration(8))).toBe(2); // O 2p4
    expect(unpairedElectrons(neutralConfiguration(10))).toBe(0); // Ne, closed
    expect(unpairedElectrons(neutralConfiguration(24))).toBe(6); // Cr 4s1 3d5
  });

  it('counts electrons per shell to the 2n^2 limit', () => {
    const kr = neutralConfiguration(36);
    expect(electronsInShell(kr, 1)).toBe(2);
    expect(electronsInShell(kr, 2)).toBe(8);
    expect(electronsInShell(kr, 3)).toBe(18);
    expect(electronsInShell(kr, 4)).toBe(8);
    expect(outermostShell(kr)).toBe(4);
  });
});

describe('shorthand', () => {
  it('picks the largest noble gas the configuration contains', () => {
    expect(nobleCore(neutralConfiguration(26))).toBe(18);
    expect(nobleCore(neutralConfiguration(11))).toBe(10);
    expect(nobleCore(neutralConfiguration(2))).toBe(2);
    expect(shorthandString(neutralConfiguration(26))).toBe('[Ar] 4s2 3d6');
  });

  it('falls back to the full string below the first noble gas', () => {
    expect(shorthandString(neutralConfiguration(1))).toBe('1s1');
  });

  it('never defines a noble gas in terms of itself', () => {
    // Neon as "[Ne]" is circular; the full string is the only useful answer for the element itself.
    expect(shorthandString(neutralConfiguration(10), 10)).toBe('1s2 2s2 2p6');
    // The same core IS the right answer for an ion that has reached it.
    expect(shorthandString(configurationFor(11, 1), 11)).toBe('[Ne]');
  });
});

describe('species label and animation', () => {
  it('names ions the way a chemist writes them', () => {
    expect(speciesLabel(stateFor(26, 0))).toBe('Fe');
    expect(speciesLabel(stateFor(26, 2))).toBe('Fe2+');
    expect(speciesLabel(stateFor(17, -1))).toBe('Cl-');
    expect(speciesLabel(stateFor(11, 1))).toBe('Na+');
  });

  it('places electrons over time and stops at the full count', () => {
    const s = stateFor(8);
    expect(totalElectrons(placedConfiguration(s))).toBe(0);
    for (let i = 0; i < 40; i++) electronConfiguration.step(s, SUBSTEP);
    const partial = totalElectrons(placedConfiguration(s));
    expect(partial).toBeGreaterThan(0);
    expect(partial).toBeLessThanOrEqual(8);
    for (let i = 0; i < 600; i++) electronConfiguration.step(s, SUBSTEP);
    expect(totalElectrons(placedConfiguration(s))).toBe(8);
    expect(s.vars.placed).toBe(8);
  });

  it('fills 4s before 3d as it animates', () => {
    const s = stateFor(26);
    const i4s = AUFBAU.findIndex((x) => x.label === '4s');
    const i3d = AUFBAU.findIndex((x) => x.label === '3d');
    for (let i = 0; i < 500; i++) {
      electronConfiguration.step(s, SUBSTEP);
      const placed = placedConfiguration(s);
      if (placed[i3d]! > 0) expect(placed[i4s]).toBe(2);
    }
  });

  it('keeps the finished configuration independent of the animation', () => {
    const s = stateFor(24);
    expect(configurationString(currentConfiguration(s))).toBe(asString(24));
  });

  it('every preset is within its parameter range', () => {
    for (const preset of electronConfiguration.presets) {
      for (const param of electronConfiguration.params) {
        const v = preset.values[param.id];
        if (v === undefined) continue;
        expect(v).toBeGreaterThanOrEqual(param.min);
        expect(v).toBeLessThanOrEqual(param.max);
      }
    }
  });
});
