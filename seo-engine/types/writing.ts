export interface WritingScore {
  score: number;
  clarity: number;
  readability: number;
  scannability: number;
  examples: number;
  teaching: number;
  rhythm: number;
  jargon: number;
  flow: number;
  confidence: number;
  interestingness: number;
  repetition: number;
  passiveVoice: number;
  comparisonCoverage: number;
  mistakeCoverage: number;
  aiTells: number;
  toyToolsStyleScore: number;
  issues: string[];
  recommendations: string[];
}

export interface RewriterSuggestion {
  original: string;
  suggested: string;
}

export interface WritingFingerprint {
  avgSentenceLength: number;
  avgParagraphLength: number;
  questionHeadings: number;
  examples: number;
  jargonCount: number;
  hedgingCount: number;
  passiveVoiceCount: number;
  comparisonSections: number;
  commonMistakeSections: number;
  transitionDensity: number;
  repetitionScore: number;
  // AI-tell fingerprint — em-dashes are banned outright (any count is a gate failure)
  emDashCount: number;
  aiTellPhraseCount: number;
  aiTellPhrasesFound: string[];
  notJustCount: number;
  tripletRatio: number;
  paragraphShapeStdDev: number;
}
