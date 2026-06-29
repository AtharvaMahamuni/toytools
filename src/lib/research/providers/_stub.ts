// Live-API provider seam. Each named external source (Reddit, GitHub, autocomplete, …) ships as a
// stub that conforms to the Provider interface and returns [] today. Wiring a real source is purely
// additive: implement discover() to fetch + normalize into RawOpportunity[], with NO changes to any
// existing provider, analyzer, or to the registry shape. This proves "future providers are addable
// without modifying existing code". Network/secret access belongs INSIDE discover(), never at module
// top level (mirrors the engine rule about keeping browser APIs inside methods).

import type { Provider, ProviderContext, RawOpportunity } from '../models/provider';
import type { ProviderId } from '../constants';

export function makeStubProvider(id: ProviderId): Provider {
  return {
    id,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    discover(_ctx: ProviderContext): RawOpportunity[] {
      // TODO(live-seam): fetch from the real source and normalize into RawOpportunity[].
      return [];
    },
  };
}
