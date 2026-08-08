/**
 * Search aliases: the words people actually type, mapped to the tool they mean.
 *
 * Ranking (src/lib/search/rank.ts) can forgive a typo, but it cannot know that "percent off" means
 * the discount calculator or that "epoch" means the unix timestamp converter. That is vocabulary,
 * and vocabulary is data. Keeping it in one file means adding a phrase never touches a tool config.
 *
 * Rules, enforced by validate-registry:
 *   - every key must be a registered tool slug
 *   - phrases are lowercase and unique across the whole file (two tools cannot claim one phrase)
 *
 * Do not add a phrase already contained in the tool's own name; the index drops those anyway
 * because matching the name always scores higher.
 */
export const searchAliases: Record<string, string[]> = {
  // Developer utilities
  'base64-encoder-decoder': ['b64', 'base 64'],
  'binary-text-converter': ['text to binary', 'ascii to binary'],
  'crc32-hash-generator': ['crc checksum'],
  'cron-expression-parser': ['crontab', 'cron schedule'],
  'csv-cleaner': ['clean csv', 'tidy csv'],
  'csv-diff': ['compare csv'],
  'csv-to-json-converter': ['csv2json'],
  'csv-to-tsv': ['tab separated'],
  'hex-encoder-decoder': ['hexadecimal', 'text to hex'],
  'html-entity-encoder-decoder': ['escape html', 'html escape'],
  'json-escape': ['escape json string'],
  'json-formatter': ['beautify json', 'pretty print json', 'prettify json'],
  'json-minifier': ['compress json', 'shrink json'],
  'json-to-csv-converter': ['json2csv'],
  'json-to-yaml-converter': ['json to yml'],
  'json-tree-viewer': ['json viewer', 'explore json'],
  'json-validator': ['validate json', 'json lint'],
  'jwt-decoder': ['json web token', 'decode token'],
  'md5-hash-generator': ['md5 checksum'],
  'punycode-converter': ['idn', 'internationalized domain'],
  'rot13-encoder-decoder': ['caesar cipher'],
  'sha1-hash-generator': ['sha 1'],
  'sha256-hash-generator': ['sha 256'],
  'sha512-hash-generator': ['sha 512'],
  'url-encoder-decoder': ['percent encoding', 'urlencode'],
  'yaml-to-json-converter': ['yml to json'],

  // Text utilities
  'camel-case-converter': ['camelcase'],
  'character-counter': ['char count', 'character limit'],
  'find-replace': ['search and replace'],
  'kebab-case-converter': ['kebabcase', 'dash case'],
  'letter-counter': ['count letters'],
  'line-counter': ['count lines'],
  'lowercase-converter': ['all lowercase'],
  'normalize-whitespace': ['clean whitespace'],
  'paragraph-counter': ['count paragraphs'],
  'reading-time-calculator': ['minutes to read', 'read time'],
  'remove-accents': ['diacritics', 'unaccent'],
  'remove-blank-lines': ['delete empty lines'],
  'remove-duplicate-lines': ['dedupe lines', 'unique lines'],
  'remove-emoji': ['strip emoji'],
  'remove-extra-spaces': ['double spaces'],
  'remove-line-breaks': ['join lines', 'remove newlines'],
  'remove-tabs': ['tabs to spaces'],
  'reverse-text': ['backwards text'],
  'sentence-case-converter': ['sentencecase'],
  'sentence-counter': ['count sentences'],
  'slugify-text': ['url slug', 'permalink'],
  'snake-case-converter': ['snakecase', 'underscore case'],
  'space-counter': ['count spaces'],
  'text-compare': ['diff text', 'text diff', 'compare two texts'],
  'title-case-converter': ['titlecase', 'capitalize each word'],
  'trim-text': ['strip spaces'],
  'uppercase-converter': ['all caps'],
  'word-counter': ['essay length', 'how many words'],
  'word-frequency-counter': ['most common words', 'keyword density'],

  // Generators
  'lorem-ipsum-generator': ['placeholder text', 'dummy text', 'filler text'],
  'password-generator': ['strong password'],
  'qr-code-generator': ['qr'],
  'random-string-generator': ['random token'],
  'uuid-generator': ['guid'],

  // Design
  'aspect-ratio-calculator': ['16 9', 'screen ratio'],
  'color-contrast-checker': ['wcag contrast', 'contrast ratio', 'accessible colors'],
  'color-format-converter': ['hex to rgb', 'rgb to hex', 'hsl'],
  'px-to-dp-converter': ['pixels to dp', 'density independent'],
  'px-to-rem-converter': ['pixels to rem'],

  // Money and finance
  'cagr-calculator': ['annual growth rate'],
  'compound-interest-calculator': ['interest growth'],
  'discount-calculator': ['percent off', 'sale price'],
  'emergency-fund-calculator': ['rainy day fund'],
  'inflation-calculator': ['purchasing power'],
  'margin-calculator': ['profit margin'],
  'markup-calculator': ['cost plus'],
  'roi-calculator': ['return on investment'],
  'rule-of-72-calculator': ['doubling time'],
  'savings-goal-calculator': ['save for a goal'],
  'sip-calculator': ['systematic investment', 'mutual fund sip'],
  'tax-calculator': ['sales tax', 'vat'],
  'tip-calculator': ['gratuity'],

  // Numbers and applied math
  'combinations-permutations-calculator': ['ncr', 'npr'],
  'fraction-calculator': ['simplify fraction'],
  'percentage-calculator': ['percent of', 'percent change'],
  'prime-factorization-calculator': ['prime factors'],
  'probability-calculator': ['dice odds', 'coin flip'],
  'quadratic-equation-solver': ['quadratic formula', 'roots of equation'],
  // Not "calculator": it is a word in twenty tool names, so it can only ever rank behind them.
  'scientific-calculator': ['trigonometry calculator', 'logarithm calculator'],
  'unit-circle-calculator': ['sin cos tan', 'trig circle'],

  // Date and time
  'age-calculator': ['how old am i', 'birthday age'],
  'date-difference-calculator': ['days between dates', 'days until'],
  'timezone-converter': ['time zone', 'utc offset'],
  'unix-timestamp-converter': ['epoch', 'epoch time', 'unix time'],

  // Health and fitness
  'bmi-calculator': ['body mass index'],
  'body-fat-calculator': ['bodyfat percentage'],
  'body-weight-tracker': ['weight log'],
  'heart-rate-zone-calculator': ['max heart rate', 'cardio zones'],
  'ideal-weight-calculator': ['target weight'],
  'macro-calculator': ['macros', 'protein carbs fat'],
  'move-today-tracker': ['step tracker', 'activity log'],
  'tdee-calculator': ['daily calories', 'calorie needs'],
  'water-intake-tracker': ['hydration', 'how much water'],

  // Productivity
  'keep-screen-awake': ['prevent sleep', 'stay awake'],
  'notepad': ['scratchpad', 'quick notes'],
  'pomodoro-timer': ['focus timer', '25 minute timer'],
  'todo-list': ['task list', 'checklist'],

  // Physics playground
  // The "<subject> simulator" / "interactive <subject>" phrasings are DERIVED for every simulation
  // (src/lib/simulation/generate.ts, simulatorTags), so they belong in neither this file nor a
  // manifest's tag list. Only vocabulary a rule cannot produce goes here.
  'doppler-effect-calculator': ['doppler shift'],
  'heat-transfer-calculator': ['conduction'],
  'frequency-period-calculator': ['hertz', 'cycles per second'],
  'ideal-gas-law-calculator': ['pv nrt', 'charles law', 'boyle law'],
  'inclined-plane-calculator': ['ramp friction'],
  'momentum-collision-calculator': ['elastic collision'],
  'ohms-law-calculator': ['ohm law', 'voltage current resistance'],
  'pendulum-period-calculator': ['swing period'],
  'projectile-motion-calculator': ['trajectory'],
  'simple-harmonic-motion-calculator': ['harmonic motion', 'spring oscillation'],
  'wave-speed-calculator': ['wavelength frequency'],
};
