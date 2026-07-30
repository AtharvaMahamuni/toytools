// Shape of the window.ToyTools global as far as the *deferred* runtime is concerned.
//
// The always-on half of the global (state, toast, copy, storage, prefs, profile, focus, ...) is
// defined by the inline script in ToyToolsRuntime.astro and is deliberately not typed here: it
// exists before this module runs. This type only covers the engine surfaces that attach lazily,
// so an attach module cannot typo a global name.

export interface ToyToolsGlobal {
  ready?: boolean;
  _readyCbs?: (() => void)[];
  track?: (name: string, params?: Record<string, unknown>) => void;
  // Engine surfaces, each attached by exactly one module in ./engines/.
  [global: string]: unknown;
}

/** An engine's attach step: given the global, hang this engine's functions off it. */
export type AttachFn = (TT: ToyToolsGlobal) => void | Promise<void>;
