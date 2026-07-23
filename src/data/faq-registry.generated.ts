// GENERATED FILE — do not edit. Run `npm run registries:generate` to refresh.
// Derived from the src/tools/<segment>/<slug>/ directory contract (see scripts/generate-registries.ts).

import type { FAQItem } from './types';
import { items as ageCalculatorFaqs } from '@tools/datetime/age-calculator/faq';
import { items as base64EncoderDecoderFaqs } from '@tools/developer-utilities/base64-encoder-decoder/faq';
import { items as binaryTextConverterFaqs } from '@tools/developer-utilities/binary-text-converter/faq';
import { items as bmiCalculatorFaqs } from '@tools/health/bmi-calculator/faq';
import { items as bodyFatCalculatorFaqs } from '@tools/health/body-fat-calculator/faq';
import { items as bodyWeightTrackerFaqs } from '@tools/health/body-weight-tracker/faq';
import { items as cagrCalculatorFaqs } from '@tools/finance/cagr-calculator/faq';
import { items as camelCaseConverterFaqs } from '@tools/text/camel-case-converter/faq';
import { items as characterCounterFaqs } from '@tools/text/character-counter/faq';
import { items as combinationsPermutationsCalculatorFaqs } from '@tools/math/combinations-permutations-calculator/faq';
import { items as compoundInterestCalculatorFaqs } from '@tools/finance/compound-interest-calculator/faq';
import { items as crc32HashGeneratorFaqs } from '@tools/developer-utilities/crc32-hash-generator/faq';
import { items as cronExpressionParserFaqs } from '@tools/datetime/cron-expression-parser/faq';
import { items as csvCleanerFaqs } from '@tools/developer-utilities/csv-cleaner/faq';
import { items as csvDiffFaqs } from '@tools/developer-utilities/csv-diff/faq';
import { items as csvToJsonConverterFaqs } from '@tools/developer-utilities/csv-to-json-converter/faq';
import { items as csvToTsvFaqs } from '@tools/developer-utilities/csv-to-tsv/faq';
import { items as dateDifferenceCalculatorFaqs } from '@tools/datetime/date-difference-calculator/faq';
import { items as discountCalculatorFaqs } from '@tools/number/discount-calculator/faq';
import { items as emergencyFundCalculatorFaqs } from '@tools/finance/emergency-fund-calculator/faq';
import { items as findReplaceFaqs } from '@tools/text/find-replace/faq';
import { items as fractionCalculatorFaqs } from '@tools/math/fraction-calculator/faq';
import { items as heartRateZoneCalculatorFaqs } from '@tools/health/heart-rate-zone-calculator/faq';
import { items as hexEncoderDecoderFaqs } from '@tools/developer-utilities/hex-encoder-decoder/faq';
import { items as htmlEntityEncoderDecoderFaqs } from '@tools/developer-utilities/html-entity-encoder-decoder/faq';
import { items as idealWeightCalculatorFaqs } from '@tools/health/ideal-weight-calculator/faq';
import { items as inflationCalculatorFaqs } from '@tools/finance/inflation-calculator/faq';
import { items as jsonEscapeFaqs } from '@tools/developer-utilities/json-escape/faq';
import { items as jsonFormatterFaqs } from '@tools/developer-utilities/json-formatter/faq';
import { items as jsonMinifierFaqs } from '@tools/developer-utilities/json-minifier/faq';
import { items as jsonToCsvConverterFaqs } from '@tools/developer-utilities/json-to-csv-converter/faq';
import { items as jsonToYamlConverterFaqs } from '@tools/developer-utilities/json-to-yaml-converter/faq';
import { items as jsonTreeViewerFaqs } from '@tools/developer-utilities/json-tree-viewer/faq';
import { items as jsonValidatorFaqs } from '@tools/developer-utilities/json-validator/faq';
import { items as jwtDecoderFaqs } from '@tools/developer-utilities/jwt-decoder/faq';
import { items as kebabCaseConverterFaqs } from '@tools/text/kebab-case-converter/faq';
import { items as keepScreenAwakeFaqs } from '@tools/productivity/keep-screen-awake/faq';
import { items as letterCounterFaqs } from '@tools/text/letter-counter/faq';
import { items as lineCounterFaqs } from '@tools/text/line-counter/faq';
import { items as loremIpsumGeneratorFaqs } from '@tools/generate/lorem-ipsum-generator/faq';
import { items as lowercaseConverterFaqs } from '@tools/text/lowercase-converter/faq';
import { items as macroCalculatorFaqs } from '@tools/health/macro-calculator/faq';
import { items as marginCalculatorFaqs } from '@tools/number/margin-calculator/faq';
import { items as markupCalculatorFaqs } from '@tools/number/markup-calculator/faq';
import { items as md5HashGeneratorFaqs } from '@tools/developer-utilities/md5-hash-generator/faq';
import { items as moveTodayTrackerFaqs } from '@tools/health/move-today-tracker/faq';
import { items as normalizeWhitespaceFaqs } from '@tools/text/normalize-whitespace/faq';
import { items as notepadFaqs } from '@tools/productivity/notepad/faq';
import { items as paragraphCounterFaqs } from '@tools/text/paragraph-counter/faq';
import { items as passwordGeneratorFaqs } from '@tools/generate/password-generator/faq';
import { items as percentageCalculatorFaqs } from '@tools/number/percentage-calculator/faq';
import { items as pomodoroTimerFaqs } from '@tools/productivity/pomodoro-timer/faq';
import { items as primeFactorizationCalculatorFaqs } from '@tools/math/prime-factorization-calculator/faq';
import { items as punycodeConverterFaqs } from '@tools/developer-utilities/punycode-converter/faq';
import { items as qrCodeGeneratorFaqs } from '@tools/generate/qr-code-generator/faq';
import { items as randomStringGeneratorFaqs } from '@tools/generate/random-string-generator/faq';
import { items as readingTimeCalculatorFaqs } from '@tools/text/reading-time-calculator/faq';
import { items as removeAccentsFaqs } from '@tools/text/remove-accents/faq';
import { items as removeBlankLinesFaqs } from '@tools/text/remove-blank-lines/faq';
import { items as removeDuplicateLinesFaqs } from '@tools/text/remove-duplicate-lines/faq';
import { items as removeEmojiFaqs } from '@tools/text/remove-emoji/faq';
import { items as removeExtraSpacesFaqs } from '@tools/text/remove-extra-spaces/faq';
import { items as removeLineBreaksFaqs } from '@tools/text/remove-line-breaks/faq';
import { items as removeTabsFaqs } from '@tools/text/remove-tabs/faq';
import { items as reverseTextFaqs } from '@tools/text/reverse-text/faq';
import { items as roiCalculatorFaqs } from '@tools/finance/roi-calculator/faq';
import { items as rot13EncoderDecoderFaqs } from '@tools/developer-utilities/rot13-encoder-decoder/faq';
import { items as ruleOf72CalculatorFaqs } from '@tools/finance/rule-of-72-calculator/faq';
import { items as savingsGoalCalculatorFaqs } from '@tools/finance/savings-goal-calculator/faq';
import { items as scientificCalculatorFaqs } from '@tools/number/scientific-calculator/faq';
import { items as sentenceCaseConverterFaqs } from '@tools/text/sentence-case-converter/faq';
import { items as sentenceCounterFaqs } from '@tools/text/sentence-counter/faq';
import { items as sha1HashGeneratorFaqs } from '@tools/developer-utilities/sha1-hash-generator/faq';
import { items as sha256HashGeneratorFaqs } from '@tools/developer-utilities/sha256-hash-generator/faq';
import { items as sha512HashGeneratorFaqs } from '@tools/developer-utilities/sha512-hash-generator/faq';
import { items as sipCalculatorFaqs } from '@tools/finance/sip-calculator/faq';
import { items as slugifyTextFaqs } from '@tools/text/slugify-text/faq';
import { items as snakeCaseConverterFaqs } from '@tools/text/snake-case-converter/faq';
import { items as spaceCounterFaqs } from '@tools/text/space-counter/faq';
import { items as taxCalculatorFaqs } from '@tools/number/tax-calculator/faq';
import { items as tdeeCalculatorFaqs } from '@tools/health/tdee-calculator/faq';
import { items as textCompareFaqs } from '@tools/text/text-compare/faq';
import { items as timezoneConverterFaqs } from '@tools/datetime/timezone-converter/faq';
import { items as tipCalculatorFaqs } from '@tools/number/tip-calculator/faq';
import { items as titleCaseConverterFaqs } from '@tools/text/title-case-converter/faq';
import { items as todoListFaqs } from '@tools/productivity/todo-list/faq';
import { items as trimTextFaqs } from '@tools/text/trim-text/faq';
import { items as unixTimestampConverterFaqs } from '@tools/datetime/unix-timestamp-converter/faq';
import { items as uppercaseConverterFaqs } from '@tools/text/uppercase-converter/faq';
import { items as urlEncoderDecoderFaqs } from '@tools/developer-utilities/url-encoder-decoder/faq';
import { items as uuidGeneratorFaqs } from '@tools/generate/uuid-generator/faq';
import { items as waterIntakeTrackerFaqs } from '@tools/health/water-intake-tracker/faq';
import { items as wordCounterFaqs } from '@tools/text/word-counter/faq';
import { items as wordFrequencyCounterFaqs } from '@tools/text/word-frequency-counter/faq';
import { items as yamlToJsonConverterFaqs } from '@tools/developer-utilities/yaml-to-json-converter/faq';

export const authoredFaqsBySlug: Record<string, FAQItem[]> = {
  'age-calculator': ageCalculatorFaqs,
  'base64-encoder-decoder': base64EncoderDecoderFaqs,
  'binary-text-converter': binaryTextConverterFaqs,
  'bmi-calculator': bmiCalculatorFaqs,
  'body-fat-calculator': bodyFatCalculatorFaqs,
  'body-weight-tracker': bodyWeightTrackerFaqs,
  'cagr-calculator': cagrCalculatorFaqs,
  'camel-case-converter': camelCaseConverterFaqs,
  'character-counter': characterCounterFaqs,
  'combinations-permutations-calculator': combinationsPermutationsCalculatorFaqs,
  'compound-interest-calculator': compoundInterestCalculatorFaqs,
  'crc32-hash-generator': crc32HashGeneratorFaqs,
  'cron-expression-parser': cronExpressionParserFaqs,
  'csv-cleaner': csvCleanerFaqs,
  'csv-diff': csvDiffFaqs,
  'csv-to-json-converter': csvToJsonConverterFaqs,
  'csv-to-tsv': csvToTsvFaqs,
  'date-difference-calculator': dateDifferenceCalculatorFaqs,
  'discount-calculator': discountCalculatorFaqs,
  'emergency-fund-calculator': emergencyFundCalculatorFaqs,
  'find-replace': findReplaceFaqs,
  'fraction-calculator': fractionCalculatorFaqs,
  'heart-rate-zone-calculator': heartRateZoneCalculatorFaqs,
  'hex-encoder-decoder': hexEncoderDecoderFaqs,
  'html-entity-encoder-decoder': htmlEntityEncoderDecoderFaqs,
  'ideal-weight-calculator': idealWeightCalculatorFaqs,
  'inflation-calculator': inflationCalculatorFaqs,
  'json-escape': jsonEscapeFaqs,
  'json-formatter': jsonFormatterFaqs,
  'json-minifier': jsonMinifierFaqs,
  'json-to-csv-converter': jsonToCsvConverterFaqs,
  'json-to-yaml-converter': jsonToYamlConverterFaqs,
  'json-tree-viewer': jsonTreeViewerFaqs,
  'json-validator': jsonValidatorFaqs,
  'jwt-decoder': jwtDecoderFaqs,
  'kebab-case-converter': kebabCaseConverterFaqs,
  'keep-screen-awake': keepScreenAwakeFaqs,
  'letter-counter': letterCounterFaqs,
  'line-counter': lineCounterFaqs,
  'lorem-ipsum-generator': loremIpsumGeneratorFaqs,
  'lowercase-converter': lowercaseConverterFaqs,
  'macro-calculator': macroCalculatorFaqs,
  'margin-calculator': marginCalculatorFaqs,
  'markup-calculator': markupCalculatorFaqs,
  'md5-hash-generator': md5HashGeneratorFaqs,
  'move-today-tracker': moveTodayTrackerFaqs,
  'normalize-whitespace': normalizeWhitespaceFaqs,
  'notepad': notepadFaqs,
  'paragraph-counter': paragraphCounterFaqs,
  'password-generator': passwordGeneratorFaqs,
  'percentage-calculator': percentageCalculatorFaqs,
  'pomodoro-timer': pomodoroTimerFaqs,
  'prime-factorization-calculator': primeFactorizationCalculatorFaqs,
  'punycode-converter': punycodeConverterFaqs,
  'qr-code-generator': qrCodeGeneratorFaqs,
  'random-string-generator': randomStringGeneratorFaqs,
  'reading-time-calculator': readingTimeCalculatorFaqs,
  'remove-accents': removeAccentsFaqs,
  'remove-blank-lines': removeBlankLinesFaqs,
  'remove-duplicate-lines': removeDuplicateLinesFaqs,
  'remove-emoji': removeEmojiFaqs,
  'remove-extra-spaces': removeExtraSpacesFaqs,
  'remove-line-breaks': removeLineBreaksFaqs,
  'remove-tabs': removeTabsFaqs,
  'reverse-text': reverseTextFaqs,
  'roi-calculator': roiCalculatorFaqs,
  'rot13-encoder-decoder': rot13EncoderDecoderFaqs,
  'rule-of-72-calculator': ruleOf72CalculatorFaqs,
  'savings-goal-calculator': savingsGoalCalculatorFaqs,
  'scientific-calculator': scientificCalculatorFaqs,
  'sentence-case-converter': sentenceCaseConverterFaqs,
  'sentence-counter': sentenceCounterFaqs,
  'sha1-hash-generator': sha1HashGeneratorFaqs,
  'sha256-hash-generator': sha256HashGeneratorFaqs,
  'sha512-hash-generator': sha512HashGeneratorFaqs,
  'sip-calculator': sipCalculatorFaqs,
  'slugify-text': slugifyTextFaqs,
  'snake-case-converter': snakeCaseConverterFaqs,
  'space-counter': spaceCounterFaqs,
  'tax-calculator': taxCalculatorFaqs,
  'tdee-calculator': tdeeCalculatorFaqs,
  'text-compare': textCompareFaqs,
  'timezone-converter': timezoneConverterFaqs,
  'tip-calculator': tipCalculatorFaqs,
  'title-case-converter': titleCaseConverterFaqs,
  'todo-list': todoListFaqs,
  'trim-text': trimTextFaqs,
  'unix-timestamp-converter': unixTimestampConverterFaqs,
  'uppercase-converter': uppercaseConverterFaqs,
  'url-encoder-decoder': urlEncoderDecoderFaqs,
  'uuid-generator': uuidGeneratorFaqs,
  'water-intake-tracker': waterIntakeTrackerFaqs,
  'word-counter': wordCounterFaqs,
  'word-frequency-counter': wordFrequencyCounterFaqs,
  'yaml-to-json-converter': yamlToJsonConverterFaqs,
};
