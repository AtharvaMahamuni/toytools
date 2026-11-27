import type { LocalizedToolPack } from '@lib/i18n/types';

export const pack: LocalizedToolPack = {
  locale: 'de',
  slug: 'base64-encoder-decoder',
  name: 'Base64 Encoder und Decoder',
  seoTitle: 'Base64 Enkodieren & Dekodieren Online Gratis',
  description:
    'Kodiere UTF-8-Text in Base64 und dekodiere Base64 oder Base64URL direkt im Browser. Mit automatischer Erkennung und Padding-Reparatur ohne Upload.',
  tagline: 'Base64 und Klartext im Browser enkodieren und dekodieren.',
  craft: {
    solves:
      'Data-URI-Präfixe, Base64URL-Zeichen ohne Padding oder kopierte Leerzeichen brechen oft die Dekodierung, obwohl nur eine kleine Korrektur fehlt.',
  },
  knowledge: {
    primaryConcepts: ['Base64'],
    realWorldUseCases: [
      'Kleine Grafiken als Data URI direkt in HTML oder CSS einbetten',
      'Binärdaten sicher innerhalb von JSON-APIs übertragen',
      'Header und Payload eines JWT-Tokens lesbar machen',
      'E-Mail-Anhänge für textbasierte Protokolle wie SMTP kodieren',
    ],
    commonMistakes: [
      'Base64 fälschlich für Verschlüsselung oder Schutz von Geheimnissen halten',
      'Vergessen, dass Base64 die Datenmenge um ca. 33 % vergrößert',
    ],
  },
  faqs: [
    {
      id: 'b64-faq-1',
      question: 'Was ist Base64?',
      answer:
        'Ein Binär-zu-Text-Verfahren, das beliebige Bytefolgen mit 64 druckbaren ASCII-Zeichen (`A–Z`, `a–z`, `0–9`, `+`, `/`) und `=`-Padding abbildet, damit sie reine Textkanäle unbeschadet passieren.',
    },
    {
      id: 'b64-faq-2',
      question: 'Wie kodiere ich Text in Base64?',
      answer:
        'Füge deinen Text links ein und wähle „Kodieren → Base64“. Die UTF-8-Kodierung erscheint sofort und lässt sich per Klick kopieren.',
    },
    {
      id: 'b64-faq-3',
      question: 'Wie dekodiere ich Base64 zurück in Klartext?',
      answer:
        'Füge den Base64-String ein und wähle „Dekodieren ← Base64“. Bei Data-URI-Präfixen oder Base64URL bietet das Tool eine direkte Ein-Klick-Korrektur.',
    },
    {
      id: 'b64-faq-4',
      question: 'Ist Base64 eine Art Verschlüsselung?',
      answer:
        'Nein. Base64 ist lediglich eine Darstellung ohne geheimen Schlüssel. Jeder kann den Text sofort zurückwandeln; für Vertraulichkeit brauchst du echte Verschlüsselung wie AES oder TLS.',
    },
    {
      id: 'b64-faq-5',
      question: 'Sind Base64-kodierte Daten sicher?',
      answer:
        'Nein, Base64 bietet keinerlei Geheimhaltung. Nutze es nur für sicheren Datentransport über Textschnittstellen, niemals zur Passwort- oder Secret-Sicherung.',
    },
    {
      id: 'b64-faq-6',
      question: 'Warum endet Base64 manchmal mit "=" oder "=="?',
      answer:
        'Base64 arbeitet in 3-Byte-Blöcken. Ist die Eingabe kein Vielfaches von 3 Bytes, füllt ein oder zwei `=`-Zeichen den letzten 4-Zeichen-Block auf.',
    },
    {
      id: 'b64-faq-7',
      question: 'Was unterscheidet Base64URL von Standard-Base64?',
      answer:
        'Base64URL ersetzt `+` durch `-` und `/` durch `_` (meist ohne `=`), damit Werte problemlos in URLs, Dateinamen und JWT-Tokens passen.',
    },
    {
      id: 'b64-faq-8',
      question: 'Kann Base64 auch Bilder oder Binärdateien kodieren?',
      answer:
        'Ja, beliebige Binärdaten lassen sich etwa als Data-URI (`data:image/png;base64,...`) in CSS/HTML einbinden. Dieses Online-Tool verarbeitet direkt Text- und UTF-8-Eingaben.',
    },
    {
      id: 'b64-faq-9',
      question: 'Warum ist die Base64-Ausgabe größer als das Original?',
      answer:
        'Aus je 3 Eingabe-Bytes entstehen 4 ASCII-Zeichen – das entspricht rund 33 % Größenzuwachs als Preis für reine Textkompatibilität.',
    },
  ],
  guide: {
    title: 'Was ist Base64? Funktion, "=" Padding & Base64URL',
    description:
      'Wie 3 Bytes zu 4 ASCII-Zeichen werden, warum die Größe um 33 % steigt und weshalb Base64 keine Verschlüsselung ist.',
    readMinutes: 5,
  },
  ui: {
    displayName: 'Base64',
    forwardLabel: 'Kodieren → Base64',
    inverseLabel: 'Dekodieren ← Base64',
    outputLabel: 'Ausgabe',
    placeholder: 'Text oder Base64 hier einfügen…',
    outputPlaceholder: 'Das Ergebnis erscheint hier…',
    emptyOutput: 'Gib Text oder einen Base64-String ein.',
    insight:
      'Base64 bildet beliebige Bytes auf 64 sichere ASCII-Zeichen ab (~33 % größer). Reines Transportformat, keine Verschlüsselung.',
    technical: [
      { term: 'Verfahren', detail: 'UTF-8-Bytes nach RFC 4648 Alphabet (A-Z, a-z, 0-9, +, /)' },
      { term: 'Größenzuwachs', detail: '4 Zeichen pro 3 Bytes (~33 % Overhead plus = Padding)' },
      { term: 'Datenschutz', detail: '100 % lokale Verarbeitung im Browser ohne Serverupload' },
    ],
    compareLabel: 'Vergleichen',
    comparePlaceholder: 'Optionaler Sollwert',
    modeAriaLabel: 'Konvertierungsmodus',
    inputAriaLabel: 'Eingabe',
    outputAriaLabel: 'Konvertierte Ausgabe',
    swapLabel: 'Tauschen',
    swapAriaLabel: 'Ein- und Ausgabe tauschen',
    metaAriaLabel: 'Umwandlungs-Metadaten',
    byteAriaLabel: 'Hex-Byte-Ansicht',
    historyTitle: 'Verlauf',
    historyAriaLabel: 'Zuletzt verwendete Eingaben',
    insightAriaLabel: 'Technischer Hinweis',
    appliedPrefix: 'Korrektur angewandt:',
    checkInputMsg: 'Eingabe prüfen: enthält ungültige Zeichen zum Dekodieren.',
    invalidInputMsg: 'Ungültige Base64-Eingabe.',
    couldNotConvertMsg: 'Eingabe konnte nicht umgewandelt werden.',
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
      errDecode: 'Konnte nicht als gültiges Base64 dekodiert werden.',
      errEncode: 'Konnte nicht in Base64 kodiert werden.',
      errBadCharTpl: 'Ungültiges Base64-Zeichen „{ch}“ an Position {pos}.',
      errBadPadTpl: 'Unerwartetes =-Padding nahe Position {pos}; = ist nur am Ende zulässig.',
      warnLen: 'Länge ohne Padding ist kein Vielfaches von 4; evtl. fehlt = am Ende.',
      recDataUri: 'Data-URI-Präfix entfernen (data:...;base64,)',
      recBase64Url: 'Von Base64URL (- / _) in Standard-Base64 umwandeln',
      recPadding: 'Fehlende =-Zeichen am Ende ergänzen',
      metaInputBytes: 'Eingabe-Bytes',
      metaB64Length: 'Base64-Länge',
      metaExpansion: 'Zuwachs',
    },
  },
};
