/// <reference types="astro/client" />

interface ImportMetaEnv {
  /** Set to "true" to disable Google Analytics during E2E runs. */
  readonly PUBLIC_E2E?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
