// The one privacy sentence the site uses in banners, schema, FAQs and copy.
//
// Models and humans were reading five different wordings of the same fact (browser / device /
// never leaves / no upload / local-only). One string, imported everywhere, is the whole fix.

/**
 * Short form of TOOL_DATA_LINE (below). It replaced "Nothing is uploaded" on 1 Nov 2026: the site
 * loads analytics and has a feedback form, so a bare "nothing is uploaded" overclaimed.
 */
export const PRIVACY_LINE = 'What you enter stays on your device.';

/**
 * The site-wide privacy fact, for files that speak for the whole site rather than one tool (the
 * llms files and the identity files). PRIVACY_LINE is true of a tool's input; this one is true of
 * the site, which also loads analytics and has a feedback form that sends what you submit.
 */
/**
 * What is true of the data a person enters in a tool. The AI files (llms.txt, llms-full.txt and the
 * identity files) and the category blurbs they quote use it instead of "Nothing is uploaded", which
 * reads as a claim about the whole site.
 */
export const TOOL_DATA_LINE =
  'The text, files and values you enter in tools are processed on your device and not uploaded.';

/** TOOL_DATA_LINE sized for a category blurb, which doubles as a 160-character meta description. */
export const TOOL_DATA_SHORT = 'What you enter stays on your device.';

export const SITE_PRIVACY_LINE =
  `${TOOL_DATA_LINE} The site uses analytics, and the feedback form sends what you submit.`;

/** Trust-badge short form. Same claim as PRIVACY_LINE, sized for Zone B. */
export const PRIVACY_BADGE = 'Private ● Runs entirely on your device';

export type TrustVariant = 'private' | 'offline' | 'local' | 'lookup';

/**
 * The privacy sentence a tool may actually claim, keyed by its trust variant.
 *
 * `private` is the default and matches PRIVACY_LINE. Lookup is the exception: the browser
 * does ask an echo, so the "stays on your device" line would be false there.
 */
export function privacyStatement(variant?: TrustVariant): string {
  switch (variant) {
    case 'offline':
      return 'Works offline after the first page load.';
    case 'local':
      return 'No sync, no cloud. Your data stays on this device.';
    case 'lookup':
      return 'Your browser asks an IP echo. ToyTools never sees the reply.';
    default:
      return PRIVACY_LINE;
  }
}

const ALREADY_STATED =
  /on your device|in your browser|not uploaded|never (uploaded|sent)|no uploads?/i;

/**
 * Append the tool's privacy statement when the text has not already made the claim. The statement
 * follows the trust variant, so a lookup tool (What Is My IP asks an IP echo) never gets the
 * "stays on your device" line.
 */
export function withPrivacy(text: string, variant?: TrustVariant): string {
  const line = privacyStatement(variant);
  const trimmed = text.trim();
  if (!trimmed) return line;
  if (variant !== 'lookup' && ALREADY_STATED.test(trimmed)) return trimmed;
  if (trimmed.includes(line)) return trimmed;
  return `${trimmed} ${line}`;
}

/**
 * The quotable opening a model should read for a tool: the on-page line, the meta description,
 * then the privacy sentence if neither already said it.
 *
 * This is the 40-60 word "opening answer" for JSON-LD. The visible tagline stays one line so the
 * fold ratchet does not move; schema is where the longer answer lives.
 */
export function openingAnswer(tool: { tagline?: string; description: string; trustVariant?: TrustVariant }): string {
  const tagline = tool.tagline?.trim() ?? '';
  const description = tool.description.trim();
  const lead =
    tagline && !description.toLowerCase().includes(tagline.toLowerCase())
      ? `${tagline} ${description}`
      : description;
  return withPrivacy(lead, tool.trustVariant);
}
