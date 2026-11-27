import type { LocalizedToolPack } from '@lib/i18n/types';

export const pack: LocalizedToolPack = {
  locale: 'de',
  slug: 'html-entity-encoder-decoder',
  name: 'HTML-Entitäten Encoder & Decoder',
  seoTitle: 'HTML-Entitäten Enkodieren & Dekodieren Online',
  description:
    'Maskiere reservierte HTML-Zeichen (`<`, `>`, `&`, `"`) als HTML-Entitäten oder dekodiere `&amp;`, `&#38;` und `&#x26;` sofort lokal im Browser.',
  tagline: 'HTML-Entitäten direkt im Browser kodieren und dekodieren.',
  craft: {
    solves:
      'Aus CMS-Systemen kopierte Entitäten sind oft doppelt maskiert oder ohne abschließendes Semikolon, sodass wörtliche Kaufleute-Und statt Zeichen erscheinen.',
  },
  knowledge: {
    primaryConcepts: ['HTML-Entitäten'],
    realWorldUseCases: [
      'HTML-Codebeispiele sicher auf einer Webseite darstellen',
      'Nutzereingaben gegen XSS in Text und Attributen maskieren',
      'Typografische Sonderzeichen oder geschützte Leerzeichen (`&nbsp;`) einfügen',
    ],
    commonMistakes: [
      'Fremde Eingaben nicht maskieren (akutes XSS-Risiko)',
      '`&nbsp;` statt CSS-Abständen für Layout-Lücken missbrauchen',
    ],
  },
  faqs: [
    {
      id: 'html-ent-faq-1',
      question: 'Was ist eine HTML-Entität?',
      answer:
        'Eine Zeichenreferenz, mit der reservierte Zeichen sichtbar bleiben: `&lt;` wird als `<` gerendert, ohne dass der HTML-Parser ein öffnendes Tag vermutet.',
    },
    {
      id: 'html-ent-faq-2',
      question: 'Welche Zeichen müssen in HTML immer maskiert werden?',
      answer:
        'Vor allem `<` (`&lt;`), `>` (`&gt;`), `&` (`&amp;`) sowie `"` in Attributwerten (`&quot;`). In UTF-8-Dokumenten sind alle übrigen Zeichen optional.',
    },
    {
      id: 'html-ent-faq-3',
      question: 'Braucht man mit UTF-8 überhaupt noch HTML-Entitäten?',
      answer:
        'Ja, genau für `<`, `>`, `&` und Attribut-Anführungszeichen, da diese syntaktische Bedeutung für den HTML-Parser haben.',
    },
    {
      id: 'html-ent-faq-4',
      question: 'Was ist der Unterschied zwischen &amp; und &#38;?',
      answer:
        'Beide stehen für `&`: `&amp;` ist die benannte Referenz, `&#38;` die dezimale und `&#x26;` die hexadezimale Form für denselben Codepunkt.',
    },
    {
      id: 'html-ent-faq-5',
      question: 'Warum verhält sich &nbsp; anders als ein normales Leerzeichen?',
      answer:
        'Ein geschütztes Leerzeichen (`&nbsp;`) verhindert unerwünschte Zeilenumbrüche (z. B. `10&nbsp;kg`) und verhindert das Zusammenfassen mehrerer Leerzeichen.',
    },
    {
      id: 'html-ent-faq-6',
      question: 'Was unterscheidet HTML-Kodierung von URL-Kodierung?',
      answer:
        'HTML schützt Markup (`<` → `&lt;`), URL-Encoding schützt HTTP-Transport (`<` → `%3C`). Innerhalb eines HTML-Attributs greifen bei Query-Links sogar beide Regeln zusammen.',
    },
    {
      id: 'html-ent-faq-7',
      question: 'Was passiert, wenn ich < oder > bei Nutzereingaben vergesse zu maskieren?',
      answer:
        'Der Browser führt eingefügte Tags als aktives HTML oder `<script>` aus – das klassische Cross-Site-Scripting-Risiko (XSS).',
    },
    {
      id: 'html-ent-faq-8',
      question: 'Verhindert HTML-Entity-Encoding zuverlässig XSS?',
      answer:
        'Innerhalb normaler HTML-Textknoten und -Attribute ja; innerhalb von `<script>`, CSS-Styles oder `href`-URLs gelten jedoch zusätzliche Kontextregeln.',
    },
    {
      id: 'html-ent-faq-9',
      question: 'Warum funktioniert &apos; in altem HTML nicht immer?',
      answer:
        '`&apos;` stammt aus XML und kam erst mit HTML5 in den Standard. Ältere HTML4-Parser verstehen stattdessen zuverlässig `&#39;`.',
    },
  ],
  guide: {
    title: 'HTML-Entitäten: Was maskieren & XSS-Schutz',
    description:
      'Die fünf zentralen HTML-Zeichen, &amp; vs. &#38;, geschützte Leerzeichen und warum UTF-8 Escaping nicht ersetzt.',
    readMinutes: 6,
  },
  ui: {
    displayName: 'HTML-Entitäten',
    forwardLabel: 'Kodieren → HTML',
    inverseLabel: 'Dekodieren ← HTML',
    outputLabel: 'Ausgabe',
    placeholder: 'Text oder Entitäten (&lt;...&gt;) hier einfügen…',
    outputPlaceholder: 'Das Ergebnis erscheint hier…',
    emptyOutput: 'Gib Text oder HTML-Entitäten ein.',
    insight:
      'Das Maskieren von `<`, `>`, `&` und `"` verhindert, dass Nutzereingaben als ausführbares HTML-Markup interpretiert werden.',
    technical: [
      { term: 'Basis-Entitäten', detail: '&lt; (<), &gt; (>), &amp; (&), &quot; ("), &#39; (\')' },
      { term: 'Formate', detail: 'Benannt (&copy;), dezimal (&#169;) und hexadezimal (&#xA9;)' },
      { term: 'Datenschutz', detail: '100 % lokal im Browser ohne Übertragung an Server' },
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
    checkInputMsg: 'Eingabe prüfen.',
    invalidInputMsg: 'Ungültige HTML-Eingabe.',
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
      errDecode: 'HTML-Entitäten konnten nicht dekodiert werden.',
      errEncode: 'HTML-Entitäten konnten nicht kodiert werden.',
      infoNoEntities: 'Keine HTML-Entitäten zum Dekodieren gefunden.',
      recDoubleEsc: 'Mögliches Doppel-Escaping (&amp;lt;): weitere Ebene dekodieren',
      recMissingSemi: 'Fehlende Semikolons an Entitäten ergänzen (z. B. &amp ohne ;)',
      metaEntities: 'Entitäten',
      entCountTpl: '{n} Entitäten',
      metaInputLen: 'Eingabelänge',
      metaOutputBytes: 'Ausgabe-Bytes',
    },
  },
};
