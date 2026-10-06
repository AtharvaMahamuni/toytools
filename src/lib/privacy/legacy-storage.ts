// One-time cleanup of what older builds saved from private tools.
//
// Until beta-v12.4.2 a tool page whose trust notice says "Nothing stored unless you choose to save
// it" still wrote what you typed to this browser: Base64 and hash inputs, a QR Wi-Fi password, a
// date of birth, the health calculators' body details and result history, and a "Recent
// conversions" list in session storage. ToyTools.state now keeps typed input out of storage on
// those pages (see ToyToolsRuntime.astro), and this module removes what is already there.
//
// It is precise on purpose. Every key below was written by a private tool's own state envelope, a
// shared group input envelope, or a raw input key that older widget code used. Option fields in a
// mixed envelope are kept (a converter's direction, a calculator's units, generator settings), so a
// returning visitor loses their typed text and nothing else. Data tools (notepad, trackers, todo,
// pomodoro, ledger) are not private pages and none of their keys appear here; neither do the
// cross-tool preferences, favourites, recents or theme.
//
// The list is a frozen snapshot of the catalog at this release. A tool added later never wrote a
// legacy key, because the storage policy was already in force when it shipped.
//
// Loaded by src/lib/runtime/index.ts through a dynamic import, only while MARK is unset, so a
// browser fetches it once and never again.

/** Set once the cleanup has run. Outside the "toytools:" namespace so a backup never carries it. */
export const MARK = 'toytools.private-inputs-cleared';

/** What survives of one private tool's legacy envelope. Anything not named is removed. */
export interface LegacyRule {
  /** Top-level option fields kept as they are (mode, currency, units). */
  keep?: readonly string[];
  /** Field ids moved out of `fields` into `opts`: selects and segmented choices, never typed values. */
  fieldOpts?: readonly string[];
  /** Generator envelopes: the free-text ids removed from `options` (QR text, Wi-Fi password). */
  dropOptions?: readonly string[];
}

/** Private tools whose envelope mixed typed input with options: strip to the options. */
export const LEGACY_RULES: Readonly<Record<string, LegacyRule>> = {
  'base64-encoder-decoder': { keep: ['mode', 'override'] },
  'binary-converter': { keep: ['mode', 'override'] },
  'binary-text-converter': { keep: ['mode', 'override'] },
  'bmi-calculator': { fieldOpts: ['unit'] },
  'bmr-calculator': { fieldOpts: ['unit'] },
  'body-fat-calculator': { fieldOpts: ['unit'] },
  'cagr-calculator': { keep: ['currency'] },
  'calorie-deficit-calculator': { fieldOpts: ['unit'] },
  'character-counter': { keep: ['limit'] },
  'combinations-permutations-calculator': { fieldOpts: ['mode', 'repetition'] },
  'compound-interest-calculator': { keep: ['currency'], fieldOpts: ['frequency'] },
  'crc32-hash-generator': { keep: ['mode', 'override'] },
  'dice-roller': { keep: ['options'], dropOptions: ['notation'] },
  'discount-calculator': { keep: ['mode'] },
  'emergency-fund-calculator': { keep: ['currency'] },
  'equalizer-settings-generator': { keep: ['eq'] },
  'fraction-calculator': { fieldOpts: ['op'] },
  'hex-encoder-decoder': { keep: ['mode', 'override'] },
  'html-entity-encoder-decoder': { keep: ['mode', 'override'] },
  'ideal-weight-calculator': { fieldOpts: ['unit'] },
  'inflation-calculator': { keep: ['currency'] },
  'json-escape': { keep: ['mode', 'override'] },
  'margin-calculator': { keep: ['mode'] },
  'markup-calculator': { keep: ['mode'] },
  'matrix-calculator': { fieldOpts: ['operation'] },
  'md5-hash-generator': { keep: ['mode', 'override'] },
  'number-to-words': { keep: ['mode', 'override'] },
  'one-rep-max-calculator': { fieldOpts: ['unit'] },
  'percentage-calculator': { keep: ['mode'] },
  'protein-intake-calculator': { fieldOpts: ['unit'] },
  'punycode-converter': { keep: ['mode', 'override'] },
  'px-to-dp-converter': { keep: ['mode', 'density'] },
  'px-to-rem-converter': { keep: ['unit', 'base'] },
  'qr-code-generator': { keep: ['options'], dropOptions: ['text', 'ssid', 'wifiPassword', 'fullName', 'vcardPhone', 'vcardEmail', 'org'] },
  'random-choice-picker': { keep: ['options'], dropOptions: ['options'] },
  'random-name-picker': { keep: ['options'], dropOptions: ['names'] },
  'random-string-generator': { keep: ['options'], dropOptions: ['custom'] },
  'roi-calculator': { keep: ['currency'] },
  'roman-numeral-converter': { keep: ['mode', 'override'] },
  'rot13-encoder-decoder': { keep: ['mode', 'override'] },
  'rule-of-72-calculator': { keep: ['currency'] },
  'running-pace-calculator': { fieldOpts: ['unit'] },
  'savings-goal-calculator': { keep: ['currency'] },
  'scientific-calculator': { keep: ['angleMode'] },
  'sha1-hash-generator': { keep: ['mode', 'override'] },
  'sha256-hash-generator': { keep: ['mode', 'override'] },
  'sha512-hash-generator': { keep: ['mode', 'override'] },
  'shell-quote-escalator': { keep: ['chain'] },
  'sip-calculator': { keep: ['currency'] },
  'sleep-cycle-calculator': { fieldOpts: ['direction'] },
  'statistics-visualizer': { fieldOpts: ['stdevMode'] },
  'tax-calculator': { keep: ['mode'] },
  'tdee-calculator': { fieldOpts: ['unit'] },
  'text-repeater': { keep: ['count', 'separator', 'numbered'] },
  'timezone-converter': { fieldOpts: ['fromZone', 'toZone'] },
  'unix-timestamp-converter': { fieldOpts: ['mode', 'unit'] },
  'url-encoder-decoder': { keep: ['mode', 'override'] },
  'word-counter': { keep: ['goal'] },
};

/**
 * Private tools (and shared group or second-input envelopes) that only ever held typed input. Each
 * id is stored as "toytools:" + id. Removed outright.
 */
export const LEGACY_INPUT_IDS: readonly string[] = [
  'age-calculator', 'aspect-ratio-calculator', 'camel-case-converter', 'cidr-calculator',
  'color-contrast-checker', 'color-format-converter', 'cron-expression-parser', 'csv-cleaner',
  'csv-to-tsv', 'date-difference-calculator', 'heart-rate-zone-calculator', 'jwt-decoder',
  'kebab-case-converter', 'letter-counter', 'line-counter', 'lowercase-converter',
  'macro-calculator', 'normalize-whitespace', 'paragraph-counter',
  'prime-factorization-calculator', 'reading-time-calculator', 'remove-accents',
  'remove-blank-lines', 'remove-duplicate-lines', 'remove-emoji', 'remove-extra-spaces',
  'remove-line-breaks', 'remove-tabs', 'reverse-text', 'sentence-case-converter',
  'sentence-counter', 'slugify-text', 'snake-case-converter', 'space-counter',
  'systemd-timer-converter', 'tip-calculator', 'title-case-converter', 'triangle-solver',
  'trim-text', 'uppercase-converter', 'word-frequency-counter', 'case-converter',
  'group:case-converters', 'group:encoders', 'group:hash-generators', 'group:text-cleanup',
  'group:text-counters',
];

/**
 * Work-in-progress tools flagged `keepInput` (see ToolConfig): their typed input is meant to stay on
 * this device, so the cleanup never touches these keys and a returning visitor keeps their saved
 * JSON, CSV, regex and text. Their own keys, their second inputs and the group keys they read.
 * group:csv-tools is shared with CSV Cleaner and CSV to TSV, but CSV Diff reads it as its input.
 */
export const KEEP_INPUT_KEYS: readonly string[] = [
  'csv-diff', 'csv-diff:b', 'csv-to-json-converter', 'find-replace', 'json-formatter', 'json-minifier',
  'json-schema-validator', 'json-to-csv-converter', 'json-to-schema', 'json-to-yaml-converter',
  'json-tree-viewer', 'json-validator', 'regex-tester', 'text-compare', 'yaml-to-json-converter',
  'group:csv-tools', 'group:json-csv', 'group:json-tools', 'group:json-yaml',
];
const KEEP = new Set(KEEP_INPUT_KEYS);

/** Raw keys outside the envelope convention that held typed input or personal details. */
export const LEGACY_RAW_KEYS: readonly string[] = [
  'toytools.base64.input',
  'toytools.color-shades-generator.color',
  'toytools.file-hash-verifier.expected',
  'toytools:profile:body',
];

/** Recent conversions lived in session storage under this prefix, one key per tool. */
export const LEGACY_HISTORY_PREFIX = 'toytools:hist:';

const STATE_PREFIX = 'toytools:';

/** The slice of the Storage API the cleanup needs, so tests can pass a plain map. */
export interface KeyValueStore {
  readonly length: number;
  key(index: number): string | null;
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

export interface CleanupReport {
  removed: string[];
  rewritten: string[];
}

type Bag = Record<string, unknown>;

const isBag = (v: unknown): v is Bag => !!v && typeof v === 'object' && !Array.isArray(v);

/** The options-only envelope a legacy one reduces to, or null when nothing in it is an option. */
export function reduceEnvelope(data: unknown, rule: LegacyRule): Bag | null {
  if (!isBag(data)) return null;
  const out: Bag = {};
  for (const k of rule.keep ?? []) {
    if (data[k] !== undefined) out[k] = data[k];
  }
  if (rule.fieldOpts) {
    const opts: Bag = isBag(data.opts) ? { ...data.opts } : {};
    const fields = isBag(data.fields) ? data.fields : {};
    for (const id of rule.fieldOpts) {
      const v = fields[id];
      // FinanceWidget stored { value, raw } per field; the others stored the bare value.
      const value = isBag(v) ? v.value : v;
      if (value !== undefined && value !== null && value !== '') opts[id] = value;
    }
    if (Object.keys(opts).length) out.opts = opts;
  }
  if (rule.dropOptions && isBag(out.options)) {
    const options: Bag = { ...out.options };
    for (const id of rule.dropOptions) delete options[id];
    if (Object.keys(options).length) out.options = options;
    else delete out.options;
  }
  return Object.keys(out).length ? out : null;
}

function remove(store: KeyValueStore, key: string, report: CleanupReport): void {
  if (store.getItem(key) === null) return;
  store.removeItem(key);
  report.removed.push(key);
}

/** Remove legacy typed input and history from the two stores. Never throws on bad data. */
export function clearLegacyInputs(local: KeyValueStore | null, session: KeyValueStore | null): CleanupReport {
  const report: CleanupReport = { removed: [], rewritten: [] };

  if (local) {
    for (const key of LEGACY_RAW_KEYS) remove(local, key, report);
    for (const id of LEGACY_INPUT_IDS) if (!KEEP.has(id)) remove(local, STATE_PREFIX + id, report);

    for (const [id, rule] of Object.entries(LEGACY_RULES)) {
      if (KEEP.has(id)) continue;
      const key = STATE_PREFIX + id;
      const raw = local.getItem(key);
      if (raw === null) continue;
      let env: unknown;
      try { env = JSON.parse(raw); } catch { env = null; }
      // An unreadable value under a private tool's key cannot hold a usable option, and
      // ToyTools.state would ignore it anyway.
      if (!isBag(env) || typeof env.v !== 'number') { remove(local, key, report); continue; }
      const next = reduceEnvelope(env.data, rule);
      if (!next) { remove(local, key, report); continue; }
      if (JSON.stringify(next) === JSON.stringify(env.data)) continue;
      local.setItem(key, JSON.stringify({ v: env.v, data: next }));
      report.rewritten.push(key);
    }
  }

  if (session) {
    const hist: string[] = [];
    for (let i = 0; i < session.length; i++) {
      const k = session.key(i);
      if (k && k.startsWith(LEGACY_HISTORY_PREFIX)) hist.push(k);
    }
    for (const k of hist) remove(session, k, report);
  }

  return report;
}

/** Browser entry point: clean up once, then set MARK so this chunk is never fetched again. */
export function runLegacyCleanup(): CleanupReport | null {
  let local: KeyValueStore | null = null;
  let session: KeyValueStore | null = null;
  try { local = globalThis.localStorage ?? null; } catch { local = null; }
  try { session = globalThis.sessionStorage ?? null; } catch { session = null; }
  if (!local) return null;
  try {
    const report = clearLegacyInputs(local, session);
    local.setItem(MARK, '1');
    return report;
  } catch {
    // Quota or a locked store: leave MARK unset so the next page load tries again.
    return null;
  }
}
