import type { LocalizedToolPack } from '@lib/i18n/types';

export const pack: LocalizedToolPack = {
  locale: 'de',
  slug: 'sha256-hash-generator',
  name: 'SHA-256 Hash-Generator',
  seoTitle: 'SHA-256 Hash-Generator Online – Prüfsummen Testen',
  description:
    'Erzeuge kryptografische SHA-256-Prüfsummen (64 Hex-Zeichen) und vergleiche erwartete Hashes per WebCrypto lokal in deinem Browser ohne Upload.',
  tagline: 'SHA-256-Hash aus beliebigem Text direkt im Browser erzeugen.',
  citation: {
    problem: 'Nutze dieses SHA-256-Tool, wenn du lokal ohne Upload einen Prüfsummentext-Digest berechnen möchtest.',
    nonGoal: 'einen Hash umzukehren oder die Eingabe an ein KI-Modell zu senden.',
  },
  craft: {
    solves:
      'Ein Hash hilft nur im exakten Vergleich; 64 Hex-Zeichen per Auge zu vergleichen scheitert leicht oder verwechselt verschiedene Algorithmen.',
  },
  knowledge: {
    primaryConcepts: ['SHA-256'],
    realWorldUseCases: [
      'Signaturen von TLS/SSL-Zertifikaten nachprüfen',
      'Software-Pakete und Manifeste kryptografisch signieren',
      'Transaktions-IDs und Proof-of-Work bei Bitcoin verstehen',
      'Datenintegrität gegen Manipulation verifizieren',
    ],
    commonMistakes: [
      'Ungehashten oder rohen SHA-256 ohne Salt/Cost-Factor für Passwörter verwenden',
      'Einweg-Hashing mit umkehrbarer Verschlüsselung verwechseln',
    ],
  },
  faqs: [
    {
      id: 'sha256-faq-1',
      question: 'Was ist SHA-256?',
      answer:
        'Eine kryptografische Hashfunktion der SHA-2-Familie (2001 standardisiert), die aus beliebigen Daten stets einen 256-Bit-Digest als 64-stellige Hex-Zahl berechnet und keine bekannten Kollisionsangriffe hat.',
    },
    {
      id: 'sha256-faq-2',
      question: 'Wie sieht ein SHA-256-Hash aus?',
      answer:
        'Immer exakt 64 kleingeschriebene Hex-Zeichen (`0–9`, `a–f`). Schon die Änderung eines einzelnen Bits kippt rund die Hälfte aller Ausgabezeichen (Lawineneffekt).',
    },
    {
      id: 'sha256-faq-3',
      question: 'Lässt sich ein SHA-256-Hash umkehren?',
      answer:
        'Nein. SHA-256 ist eine mathematische Einwegfunktion, aus dem Digest lässt sich der Ursprungstext nicht zurückrechnen.',
    },
    {
      id: 'sha256-faq-4',
      question: 'Warum gilt SHA-256 als sicher?',
      answer:
        'Gegen den vollständigen 64-Runden-Algorithmus existieren nach über zwanzig Jahren Kryptoanalyse keine praxistauglichen Kollisions- oder Urbildangriffe.',
    },
    {
      id: 'sha256-faq-5',
      question: 'Eignet sich SHA-256 zur Passwort-Speicherung?',
      answer:
        'Nein. SHA-256 arbeitet viel zu schnell (Milliarden Hashes pro Sekunde auf GPUs). Nutze für Passwörter langsame, gesalzene Verfahren wie Argon2, bcrypt oder scrypt.',
    },
    {
      id: 'sha256-faq-6',
      question: 'Wie verwendet Bitcoin SHA-256?',
      answer:
        'Sowohl beim Mining (`SHA-256(SHA-256(Block-Header))`) als auch zur Berechnung von Transaktions-IDs und Merkle-Trees.',
    },
    {
      id: 'sha256-faq-7',
      question: 'Was unterscheidet SHA-256 von SHA-512?',
      answer:
        'SHA-256 erzeugt 256 Bit (64 Hex-Zeichen, 64 Runden, 32-Bit-Wörter), SHA-512 dagegen 512 Bit (128 Hex-Zeichen, 80 Runden, 64-Bit-Wörter).',
    },
    {
      id: 'sha256-faq-8',
      question: 'Wie schneidet SHA-256 im Vergleich zu MD5 und SHA-1 ab?',
      answer:
        'MD5 (128 Bit) und SHA-1 (160 Bit) gelten aufgrund nachgewiesener Kollisionen als unsicher. SHA-256 (256 Bit) ist der aktuelle Mindeststandard.',
    },
    {
      id: 'sha256-faq-9',
      question: 'Was umfasst die SHA-2-Familie?',
      answer:
        'Die NIST-Verfahren SHA-224, SHA-256, SHA-384 und SHA-512 auf Basis der Merkle–Damgård-Konstruktion (unabhängig von SHA-3/Keccak).',
    },
    {
      id: 'sha256-faq-10',
      question: 'Kann ich SHA-256 berechnen, ohne Text hochzuladen?',
      answer:
        'Ja. Die WebCrypto-Engine rechnet lokal direkt im Browser-Tab; kein Klartext erreicht einen Server.',
    },
    {
      id: 'sha256-faq-11',
      question: 'Nutzt der SHA-256-Generator maschinelles Lernen oder KI?',
      answer:
        'Nein. Es laufen rein deterministische Bit-Operationen nach FIPS PUB 180-4 ganz ohne KI-Aufrufe.',
    },
  ],
  guide: {
    title: 'Was ist SHA-256? Checksums prüfen & Einsatzgebiete',
    description:
      'SHA-256-Prüfsummen unter Windows, macOS und Linux testen, Lawineneffekt verstehen und Vergleich mit MD5/SHA-1.',
    readMinutes: 6,
  },
  ui: {
    displayName: 'SHA-256',
    forwardLabel: 'SHA-256 berechnen',
    inverseLabel: 'Prüfsumme abgleichen',
    outputLabel: 'SHA-256-Digest (Hex)',
    placeholder: 'UTF-8-Text hier eingeben oder einfügen…',
    outputPlaceholder: 'Der 64-stellige Hex-Hash erscheint hier…',
    emptyOutput: 'Gib beliebigen Text ein, um seinen SHA-256-Digest zu erhalten.',
    insight:
      'SHA-256 verdichtet beliebige UTF-8-Eingaben auf exakt 256 Bit (64 Hex-Zeichen). Einwegfunktion für Integritätsprüfungen; für Passwörter Argon2 oder bcrypt nutzen.',
    technical: [
      { term: 'Algorithmus', detail: 'SHA-256 (FIPS 180-4) über SubtleCrypto WebCrypto API' },
      { term: 'Ausgabeformat', detail: '256 Bit als 64 kleingeschriebene Hexadezimalzeichen' },
      { term: 'Datenschutz', detail: '100 % lokale Berechnung im Browser ohne Serverupload' },
    ],
    compareLabel: 'Erwarteten Hash prüfen',
    comparePlaceholder: '64-stelligen SHA-256-Hash zum Vergleich einfügen',
    modeAriaLabel: 'SHA-256-Modus',
    inputAriaLabel: 'Eingabetext',
    outputAriaLabel: 'Berechneter SHA-256-Hash',
    swapLabel: 'Tauschen',
    swapAriaLabel: 'Felder tauschen',
    metaAriaLabel: 'Hash-Metadaten',
    byteAriaLabel: 'Hex-Byte-Ansicht',
    historyTitle: 'Verlauf',
    historyAriaLabel: 'Zuletzt verwendete Eingaben',
    insightAriaLabel: 'Technischer Hinweis',
    appliedPrefix: 'Korrektur angewandt:',
    checkInputMsg: 'Eingabe prüfen.',
    invalidInputMsg: 'Hash konnte nicht erstellt werden.',
    couldNotConvertMsg: 'Fehler bei der Hash-Berechnung.',
    detectedPrefix: 'Erkannt:',
    validPrefix: 'Gültig',
    digestPrefix: 'Abgleich:',
    digestSuffix: 'mit der aktuellen Ausgabe.',
    detectLabels: {
      Base64: 'Base64',
      Text: 'Klartext',
      'Percent-encoded': 'URL-kodiert',
      'HTML entities': 'HTML-Entitäten',
      Markup: 'Markup',
    },
    engine: {
      bitsTpl: '{bits} Bit',
      metaAlgorithm: 'Algorithmus',
      metaOutput: 'Ausgabe',
      metaHexChars: 'Hex-Zeichen',
      metaInputBytes: 'Eingabe-Bytes',
      errHash: 'SHA-256 konnte in diesem Browser nicht berechnet werden.',
      digestUnreadable: 'Unbekanntes Format: Für SHA-256 sind 64 Hex-Zeichen erforderlich.',
      digestWrongNamedTpl: 'Dieser Hash sieht nach {algo} ({len} Zeichen) aus, nicht SHA-256 (64 Zeichen).',
      digestWrongLenTpl: 'Falsche Länge ({len} Hex-Zeichen); SHA-256 besitzt exakt 64.',
      digestMatch: 'Stimmt exakt mit dem berechneten SHA-256-Digest überein.',
      digestMismatch: 'Abweichung: Der Vergleichswert unterscheidet sich vom aktuellen SHA-256.',
    },
  },
};
