import { networkApi, runNetwork } from '@lib/engines/network/registry';
import { attachExperience } from '../experience';
import type { AttachFn } from '../types';

/** ToyTools.runNetwork(id, input, { locale? }) → InteractiveResult
 *  ToyTools.network.lookupPublic() → public IPv4/IPv6 from an IP echo. */
export const attach: AttachFn = (TT) => {
  TT.runNetwork = runNetwork;
  TT.network = networkApi;
  attachExperience(TT);
};
