/// <reference types="astro/client" />

interface ImportMetaEnv {
  /** Set to "true" to disable Google Analytics during E2E runs. */
  readonly PUBLIC_E2E?: string;
  /** Web3Forms relay key for /feedback/. Public by design: it only permits submitting,
   *  never reading. Absent locally, so the form composes but never sends. */
  readonly PUBLIC_WEB3FORMS_KEY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
