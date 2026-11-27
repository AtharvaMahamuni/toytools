import type { LocalizedToolPack } from '@lib/i18n/types';

export const pack: LocalizedToolPack = {
  locale: 'de',
  slug: 'url-encoder-decoder',
  name: 'URL Encoder und Decoder',
  seoTitle: 'URL Enkodieren & Dekodieren (Percent-Encoding)',
  description:
    'Enkodiere und dekodiere URL-Bestandteile (`encodeURIComponent`) direkt im Browser. Mit Erklärung zu %20 vs. + und Reparatur doppelter Kodierung.',
  tagline: 'URL-Parameter mit Prozent-Kodierung (%XX) umwandeln.',
  craft: {
    solves:
      'Doppelt kodierte Werte, ein „+“ aus HTML-Formularen oder ein einzelnes „%“ brechen oft die Dekodierung, obwohl nur eine schnelle Bereinigung nötig ist.',
  },
  knowledge: {
    primaryConcepts: ['URL-Kodierung'],
    realWorldUseCases: [
      'Suchbegriffe sauber in Query-Parameter umwandeln',
      'E-Mail-Adressen oder OAuth-Redirect-URLs als Parameter übergeben',
      'Dateipfade mit Leerzeichen oder Umlauten sicher verlinken',
    ],
    commonMistakes: [
      'Die gesamte URL statt einzelner Parameterwerte enkodieren',
      'Bereits kodierte Werte doppelt umwandeln (%20 wird zu %2520)',
    ],
  },
  faqs: [
    {
      id: 'url-enc-faq-1',
      question: 'Was macht URL-Kodierung (Percent-Encoding)?',
      answer:
        'Unsichere oder reservierte Zeichen werden durch `%` gefolgt von zwei Hex-Ziffern ihres UTF-8-Bytes ersetzt – etwa `%20` für ein Leerzeichen oder `%26` für `&`.',
    },
    {
      id: 'url-enc-faq-2',
      question: 'Was unterscheidet %20 und + bei Leerzeichen?',
      answer:
        '`%20` gilt allgemein nach RFC 3986 für Pfade und Query-Strings. `+` steht nur in `application/x-www-form-urlencoded`-Formulardaten für ein Leerzeichen und sonst als echtes Plus.',
    },
    {
      id: 'url-enc-faq-3',
      question: 'Wann nutzt man encodeURIComponent statt encodeURI?',
      answer:
        'Nutze `encodeURIComponent` für einzelne Parameterwerte oder Pfadsegmente, die `&`, `=`, `/` oder `?` enthalten können; `encodeURI` dient nur kompletten URLs.',
    },
    {
      id: 'url-enc-faq-4',
      question: 'Welche Zeichen müssen prozentkodiert werden?',
      answer:
        'Leerzeichen, `<`, `>`, `"`, `{`, `}`, `|`, `\\`, `^`, Umlaute, Emojis sowie alle Nicht-ASCII-Zeichen – außerdem `&`, `=`, `/`, `?`, `#`, sofern sie als Daten im Parameter stehen.',
    },
    {
      id: 'url-enc-faq-5',
      question: 'Was ist doppelte Kodierung und wie vermeidet man sie?',
      answer:
        'Wenn `%20` erneut kodiert wird, entsteht `%2520`. Codiere Rohtext genau einmal kurz vor dem Zusammenbau der URL oder dekodiere vorab, falls unsicher.',
    },
    {
      id: 'url-enc-faq-6',
      question: 'Gilt URL-Kodierung für Pfade genauso wie für Query-Parameter?',
      answer:
        'Ja. Sowohl Pfadsegmente (`/mein%20ordner/datei.txt`) als auch Query-Werte (`?q=Hallo%20Welt`) benötigen Prozent-Kodierung für Leer- und Sonderzeichen.',
    },
    {
      id: 'url-enc-faq-7',
      question: 'Sind URL-Encoding und Percent-Encoding dasselbe?',
      answer:
        'Ja. RFC 3986 spricht von Percent-Encoding, in der Webentwicklung sagt man meist URL-Encoding oder URL-Escaping – gemeint ist exakt dieselbe Technik.',
    },
    {
      id: 'url-enc-faq-8',
      question: 'Was passiert, wenn ich einen Parameter nicht enkodiert übergebe?',
      answer:
        'Ein unkodiertes `&` teilt den Parameter auf, ein `?` startet eine zweite Query und ein `#` schneidet alles Folgende als lokalen Anker ab, der den Server nie erreicht.',
    },
    {
      id: 'url-enc-faq-9',
      question: 'Wie kodiert und dekodiert dieses Werkzeug genau?',
      answer:
        'Es nutzt lokal im Browser `encodeURIComponent` und `decodeURIComponent` auf UTF-8-Basis – die richtige Wahl für Query-Werte und Pfadsegmente.',
    },
  ],
  guide: {
    title: 'URL-Kodierung: %20 vs. +, RFC 3986 & Fehler',
    description:
      'Warum Prozent-Kodierung existiert, Unterschied zwischen encodeURI und encodeURIComponent und wie man doppelte Kodierung erkennt.',
    readMinutes: 5,
  },
  ui: {
    displayName: 'URL',
    forwardLabel: 'Kodieren → URL',
    inverseLabel: 'Dekodieren ← URL',
    outputLabel: 'Ausgabe',
    placeholder: 'Text oder %XX-String hier einfügen…',
    outputPlaceholder: 'Das Ergebnis erscheint hier…',
    emptyOutput: 'Gib Text oder einen URL-kodierten String ein.',
    insight:
      'Percent-Encoding ersetzt reservierte oder Nicht-ASCII-Zeichen durch %XX in UTF-8 (`encodeURIComponent`), damit &, = oder ? die URL-Struktur nicht beschädigen.',
    technical: [
      { term: 'Verfahren', detail: 'encodeURIComponent / decodeURIComponent (UTF-8 RFC 3986)' },
      { term: 'Leerzeichen', detail: '%20 in Standard-URIs; + in x-www-form-urlencoded Formularen' },
      { term: 'Datenschutz', detail: 'Vollständig lokal im Browser ohne Übertragung von URLs' },
    ],
    compareLabel: 'Vergleichen',
    comparePlaceholder: 'Optionaler Sollwert',
    modeAriaLabel: 'Konvertierungsmodus',
    inputAriaLabel: 'Eingabe',
    outputAriaLabel: 'Konvertierte Ausgabe',
    swapLabel: 'Tauschen',
    swapAriaLabel: 'Ein- und Ausgabe tauschen',
    metaAriaLabel: 'Metadaten',
    byteAriaLabel: 'Hex-Byte-Ansicht',
    historyTitle: 'Verlauf',
    historyAriaLabel: 'Zuletzt verwendete Eingaben',
    insightAriaLabel: 'Technischer Hinweis',
    appliedPrefix: 'Korrektur angewandt:',
    checkInputMsg: 'Eingabe prüfen: enthält ungültige %-Sequenzen.',
    invalidInputMsg: 'Ungültige Prozent-Kodierung.',
    couldNotConvertMsg: 'Eingabe konnte nicht konvertiert werden.',
    detectedPrefix: 'Erkannt:',
    validPrefix: 'Gültig',
    digestPrefix: '',
    digestSuffix: '',
    detectLabels: {
      Base64: 'Base64',
      Text: 'Klartext',
      'Percent-encoded': 'URL-kodiert',
      'HTML entities': 'HTML-Entitäten',
      Markup: 'Markup',
    },
    engine: {
      errDecode: 'Konnte URL-String nicht dekodieren.',
      errEncode: 'Konnte Eingabe nicht als URL-Komponente kodieren.',
      errInvalidPctTpl: 'Ungültige oder unvollständige %-Sequenz an Position {pos}.',
      recDouble: 'Mögliche Doppelkodierung (%25XX): weitere Ebene dekodieren',
      recStrayPct: 'Einzelne %-Zeichen vor dem Dekodieren als %25 maskieren',
      recPlus: '+ durch Leerzeichen ersetzen (x-www-form-urlencoded)',
      metaEscapes: '%XX-Sequenzen',
      escCountTpl: '{n} Sequenzen',
      metaInputLen: 'Eingabelänge',
      metaOutputBytes: 'Ausgabe-Bytes',
    },
  },
};
