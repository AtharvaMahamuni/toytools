import type { Category } from './types';
import { tools } from './registry';
import { engineRegistry } from './engines';

// `tagline` and `highlights` drive the homepage index (CategoryIndex.astro): the homepage
// now shows eleven category rows instead of every tool name, so these three example slugs
// are the concrete picture a visitor gets of what a category holds. Prefer the tools people
// actually arrive looking for, and prefer ones the collapsed directory hides (BMI and TDEE
// both sit behind a single "Health Calculator" group entry, so name them here).
const categoryDefs: Omit<Category, 'toolCount' | 'engines'>[] = [
  {
    slug: 'text-utilities',
    name: 'Text Utilities',
    description: 'Count, transform, clean, and analyze text strings.',
    tagline: 'Count, convert, clean and compare text.',
    highlights: ['word-counter', 'title-case-converter', 'find-replace'],
    accent: '#9B543E',
    segment: 'text',
    intro: [
      'Text tools fall into three jobs that are easy to confuse. Counting answers how much is here: words, characters, lines, or the reading time an editor asked for. Transforming rewrites the same text into another shape, which is where case conversion and slugs live. Cleaning removes what you cannot see, and that is usually the one you actually need: stray tabs, double spaces, blank lines pasted in from somewhere else, or a zero-width character that is breaking a search you swear should match.',
      'The counters disagree with each other on purpose. A word counter and a character counter give different numbers for the same paragraph, and a character count with spaces is not the count a Twitter field or a meta description limit means. Each tool says which rule it applied, because the honest answer to "how long is this" depends on who is asking.',
      'Everything here runs on the text in your browser. Nothing is uploaded, which matters more than it sounds: the text you most want to clean up is often the text you least want to paste into a stranger\'s server.',
    ],
  },
  {
    slug: 'number-utilities',
    name: 'Number Utilities',
    description: 'Convert, format, and calculate numeric values quickly.',
    tagline: 'Percentages, discounts, tips and everyday math.',
    highlights: ['percentage-calculator', 'discount-calculator', 'scientific-calculator'],
    accent: '#765B22',
    segment: 'number',
    intro: [
      'These are the calculations you do often enough to resent doing by hand, and rarely enough to second-guess. Percentages, discounts, tips, tax, margin and markup are all the same arithmetic wearing different words, which is exactly why they get mixed up.',
      'Margin and markup are the pair worth knowing apart. Markup is measured against what a thing cost you, margin against what you sold it for, so the same fifty percent means two different prices. Getting that backwards is a pricing error, not a rounding error, and it is the reason these tools show the working rather than only the answer.',
      'The scientific calculator sits here too, for order of operations, trigonometry, logarithms and factorials, with a visible history so you can check the step you are no longer sure about.',
    ],
  },
  {
    slug: 'developer-utilities',
    name: 'Developer Utilities',
    description: 'Encode, decode, format, and inspect data structures.',
    tagline: 'Format, encode, hash and inspect data.',
    highlights: ['json-formatter', 'base64-encoder-decoder', 'jwt-decoder'],
    accent: '#56568F',
    segment: 'developer-utilities',
    intro: [
      'The largest group on the site, and the most repetitive work in a developer\'s day: encode this, decode that, format the thing that arrived minified, and find out why a payload will not parse. JSON accounts for the biggest share, from formatting and validating to converting into CSV or YAML and walking a large document as a tree.',
      'Encoders and decoders come in pairs because the return trip is where mistakes surface. Base64, URL encoding, HTML entities, hex, binary and punycode each mangle a different set of characters, and the fastest way to find which layer broke your string is to run it back the other way.',
      'Hashing is one-way and is here for checking, not hiding: comparing a download against a published checksum, or telling whether two files differ. A JWT decoder reads a token\'s header and claims without verifying its signature, which is the right tool for seeing what is inside one and the wrong tool for deciding whether to trust it.',
    ],
  },
  {
    slug: 'productivity',
    name: 'Productivity',
    description: 'Simple tools to help you focus, plan, and get things done.',
    tagline: 'Focus, plan and keep track.',
    highlights: ['pomodoro-timer', 'notepad', 'todo-list'],
    accent: '#3E7B55',
    segment: 'productivity',
    intro: [
      'A small group on purpose. A notepad that keeps what you typed, a to-do list, a Pomodoro timer, and a switch that stops your screen sleeping while you are reading a recipe or following instructions with your hands full.',
      'What these have in common is state: they are the tools here that remember something between visits. That memory is stored by your own browser on the device you are using, never uploaded, and never synced anywhere, so it is on this device and only this device. The settings page can export all of it as one file, which is worth doing before you clear your browser.',
    ],
  },
  {
    slug: 'money-finance',
    name: 'Money & Finance',
    description: 'Calculate interest, savings, inflation, and plan smarter money decisions.',
    tagline: 'Interest, savings and growth, projected.',
    highlights: ['compound-interest-calculator', 'sip-calculator', 'savings-goal-calculator'],
    accent: '#2F7268',
    segment: 'finance',
    intro: [
      'Compound interest, savings growth, loan repayment and inflation, which are four views of the same idea: money changes value with time, and the direction depends on which side of it you are standing.',
      'The compounding tools are the ones people get wrong most often, because the interval matters more than the rate does. The same annual percentage compounded monthly, quarterly or yearly gives three different totals, and over a long enough run the gap is larger than most people expect. Each calculator states the assumption it made rather than leaving you to guess.',
      'These are arithmetic, not advice. They tell you what a set of numbers implies, which is a different thing from what you should do.',
    ],
  },
  {
    slug: 'generate',
    name: 'Generators',
    description: 'Generate passwords, UUIDs, random strings, placeholder text, and QR codes in your browser.',
    tagline: 'Passwords, UUIDs, QR codes and filler text.',
    highlights: ['password-generator', 'uuid-generator', 'qr-code-generator'],
    accent: '#7F5B2A',
    segment: 'generate',
    intro: [
      'Tools that produce something rather than convert it: passwords, UUIDs, placeholder text, QR codes and random strings.',
      'Randomness here comes from your browser\'s cryptographic generator, not from a shortcut like the clock or a simple pseudo-random call, which matters for anything you intend to treat as a secret. Nothing generated is sent anywhere or logged, so a password made here exists only in the tab you made it in.',
    ],
  },
  {
    slug: 'physics',
    name: 'Physics',
    headline: 'Physics Simulations',
    description: 'Interactive physics simulations you can see, touch, and experiment with. Explore waves, oscillations, and heat right in your browser.',
    tagline: 'Motion, waves, heat and circuits, made visual.',
    highlights: ['projectile-motion-calculator', 'ohms-law-calculator', 'wave-speed-calculator'],
    accent: '#3A6288',
    segment: 'physics',
    intro: [
      'Eleven simulations rather than eleven calculators. Each one draws the thing it is describing and lets you drag it: pull the pendulum bob and let go, drag the wave to change its amplitude, move the blocks in the heat transfer scene and watch the temperatures converge.',
      'They exist because the formula is the easy part. Knowing that a pendulum\'s period does not depend on the mass of the bob is one thing; changing the mass and watching the period refuse to move is another, and the second one tends to stay. Every simulation shows its live measurements, its formula with real numbers substituted in, and a line about what is happening in the scene.',
      'The physics covers mechanics, oscillations, waves and thermodynamics, at the level a school or first-year course expects. The formula panel doubles as a calculator: type a value into it and the scene follows.',
    ],
  },
  {
    slug: 'applied-math',
    name: 'Applied Math',
    headline: 'Interactive Math Simulations',
    description: 'Interactive math you can see and touch. Drag angles, morph curves, and watch sin, cos, and the rest come alive in your browser.',
    tagline: 'Trigonometry, probability and number theory.',
    highlights: ['unit-circle-calculator', 'quadratic-equation-solver', 'fraction-calculator'],
    accent: '#9E4750',
    segment: 'math',
    intro: [
      'Maths you can move rather than only read. The unit circle explorer, quadratic explorer and probability simulator draw what the equation is doing and let you drag the inputs, which makes the relationship visible in a way a static answer is not.',
      'Probability is the one that benefits most. Intuition about coin flips and dice is famously bad, and the fastest cure is watching a few thousand trials land: the shape settles down long before any individual run looks like the average.',
    ],
  },
  {
    slug: 'chemistry',
    name: 'Chemistry',
    headline: 'Chemistry Simulations',
    description: 'Interactive chemistry simulations you can turn, tune, and run. Explore conformers, crystal field splitting, and reaction rates in your browser.',
    tagline: 'Conformers, coordination complexes and reaction rates.',
    highlights: ['newman-projection-calculator', 'crystal-field-splitting-calculator', 'reaction-rate-calculator'],
    accent: '#5C7530',
    segment: 'chemistry',
    intro: [
      'Three simulations, one from each branch a first chemistry course splits into. Organic gets a Newman projection you rotate with your finger, so the strain energy curve is drawn by your own dragging rather than copied off a lecture slide. Inorganic gets a crystal field diagram where the electrons rearrange themselves the moment the ligand field beats the pairing energy. Physical gets a reaction you actually have to wait for, at whatever rate the Arrhenius equation says.',
      'They exist because chemistry hides its mechanism behind a static picture more than most subjects do. A Newman projection in a textbook is one frozen angle out of 360, and the energy diagram sits on the facing page as if the two were separate facts. Here they are the same object: the molecule turns, the marker slides along the curve, and the anti and gauche populations recompute as you raise the temperature.',
      'Every simulation shows its live measurements, its equation with the current numbers substituted in, and a sentence about what the scene is doing right now. Nothing is uploaded and everything runs offline once the page has loaded.',
    ],
  },
  {
    slug: 'date-time',
    name: 'Date & Time',
    description: 'Calculate ages and durations, convert time zones and timestamps, and work with dates, all in your browser.',
    tagline: 'Ages, durations, time zones and timestamps.',
    highlights: ['age-calculator', 'timezone-converter', 'unix-timestamp-converter'],
    accent: '#6B5090',
    segment: 'datetime',
    intro: [
      'Dates are harder than they look, and every tool here exists because of a specific way they go wrong. Ages and durations have to account for leap years and for months of different lengths. Timezone conversion has to account for two places changing their clocks on different weekends, or one of them not changing at all.',
      'Unix timestamps are the developer\'s version of the same problem: a number that means nothing at a glance, in seconds or milliseconds depending on where it came from, and the difference is a factor of a thousand in whichever direction hurts. Cron and systemd schedules are here for a related reason, which is that reading one back and knowing exactly when it next fires is genuinely difficult.',
    ],
  },
  {
    slug: 'health-fitness',
    name: 'Health & Fitness',
    description: 'Calculate fitness metrics, track your health, and build habits that stick, all privately in your browser.',
    tagline: 'BMI, calories, macros and training numbers.',
    highlights: ['bmi-calculator', 'tdee-calculator', 'macro-calculator'],
    accent: '#94486F',
    segment: 'health',
    intro: [
      'Body measurements, energy needs, nutrition targets and a few habit trackers. The calculators use the standard published formulas, which are named on each tool rather than hidden, because the formula is the assumption.',
      'That naming matters more here than anywhere else on the site. BMI was designed to describe populations and not individuals, and it cannot tell muscle from fat. Calorie needs come from equations fitted to averages, so a result is a starting estimate to adjust from, not a measurement of you. Each tool says where its number is weakest rather than presenting an estimate as a fact.',
      'The trackers keep their history in your browser only. Nothing here is uploaded, which for this category is the whole point.',
    ],
  },
  {
    slug: 'design-tools',
    name: 'Design & CSS',
    description: 'Convert colors, check WCAG contrast, and translate CSS and mobile units, all privately in your browser.',
    tagline: 'Colors, contrast and CSS units.',
    highlights: ['color-format-converter', 'color-contrast-checker', 'px-to-rem-converter'],
    accent: '#33697C',
    segment: 'design',
    intro: [
      'Colour and units, the two things that follow a design from a mockup into code. Colour conversion moves between HEX, RGB, HSL, HSV, OKLCH and CMYK; the contrast checker scores a pair against the WCAG thresholds and says which level it reaches.',
      'Contrast is the one with a right answer. Normal body text needs 4.5:1 to pass AA and large text needs 3:1, so a pairing that looks fine on your monitor can still fail for someone else. The checker gives the ratio and the grade rather than a verdict, so you can see how far off you are.',
      'The unit converters handle px to rem and px to dp, which are the same arithmetic against different base sizes: rem depends on the root font size a user may have changed, dp on the screen\'s density. Both are here because the conversion is trivial and getting the base wrong is not.',
    ],
  },
  {
    slug: 'music-audio',
    name: 'Music & Audio',
    description: 'Build, understand and share music equalizer settings, then apply them in your own player.',
    tagline: 'Equalizer settings you can actually use.',
    accent: '#5E5AA8',
    segment: 'music',
    intro: [
      'Most people meet an equalizer as a screen full of sliders with no labels beyond a frequency in hertz, and no way to find out what any of them do except by moving one and hoping. That is the gap these tools are for. You start from what you actually want, more bass or clearer vocals or less harshness, and work backwards to the numbers that get you there.',
      'Nothing here plays or changes your audio. A browser page cannot reach into Spotify, your headphones app or your car stereo, and a tool that implied otherwise would be lying about the one thing that matters. What it can do is generate the settings, explain what each band tends to affect, warn you when a curve is boosted far enough to distort, and hand you something you can copy into whatever equalizer you already have.',
      'Frequencies are the vocabulary the rest of it is built on. Weight lives near 60 Hz, muddiness near 200 to 400 Hz, the forwardness of a voice near 3 kHz, and the sense of air at the top of the range. Those are tendencies rather than rules: the same boost lands differently on different recordings, different headphones and different ears, which is why every explanation here is written as something that can happen rather than something that will.',
    ],
  },
];

export const categories: Category[] = categoryDefs.map(c => ({
  ...c,
  toolCount: tools.filter(t => t.categorySlug === c.slug).length,
  engines: engineRegistry.filter(e => e.category === c.slug).map(e => e.id),
}));
