import type { NetworkCalculator, NetworkFieldDef, NetworkInput, NetworkOpts, NetworkResult } from './types';
import { calculationError } from '@lib/results/index';
import { cidrCalculator } from './calculators/cidr';
import { lookupCraft, lookupPublic, LOOKUP_DISCLOSURE } from './lookup';
import { classifyIPv4String } from './models';

export const NETWORK_CALCULATORS: Record<string, NetworkCalculator> = {
  cidr: cidrCalculator,
};

export function runNetwork(id: string, input: NetworkInput, opts: NetworkOpts = {}): NetworkResult {
  const calc = NETWORK_CALCULATORS[id];
  if (!calc) {
    // eslint-disable-next-line no-console
    console.warn(`[network] Unknown calculator id "${id}".`);
    return calculationError('Unknown calculator');
  }
  try {
    return calc.calculate(input, opts);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.warn(`[network] Calculator "${id}" threw:`, err);
    return calculationError('Could not complete this calculation');
  }
}

export function networkFields(id: string): NetworkFieldDef[] {
  return NETWORK_CALCULATORS[id]?.fields ?? [];
}

export function getNetworkCalculator(id: string): NetworkCalculator | undefined {
  return NETWORK_CALCULATORS[id];
}

/** Browser namespace attached as ToyTools.network. */
export const networkApi = {
  lookupPublic,
  lookupCraft,
  classifyIPv4: classifyIPv4String,
  disclosure: LOOKUP_DISCLOSURE,
};
