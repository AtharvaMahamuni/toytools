// Site identity. The one place the production hostnames live.
//
// Deliberately minimal: C2 needs only the hostnames, so the analytics guard can ask "is this the
// real site?" against a list instead of "is this anything except localhost?". C3 grows this module
// into the full identity (origin fallback, brand name, title suffix, X handle, GA id). Add to it
// there, not piecemeal.

export const SITE = {
  /**
   * Hostnames that count as production. Google Analytics loads on these and nowhere else, so a
   * preview deploy, a mirror or a copy of the build on another host never reports.
   */
  productionHostnames: ['toytoolsapp.com', 'www.toytoolsapp.com'],
} as const;
