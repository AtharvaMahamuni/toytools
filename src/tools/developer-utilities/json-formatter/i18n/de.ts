import type { LocalizedToolPack } from '@lib/i18n/types';

export const pack: LocalizedToolPack = {
  locale: 'de',
  slug: 'json-formatter',
  name: 'JSON-Formatierer',
  seoTitle: 'JSON Formatierer Online – JSON Lesbar Machen',
  description:
    'JSON online sauber formatieren und einrücken. Kompakter JSON-Code wird übersichtlich dargestellt, ohne dass Daten Ihr Gerät verlassen.',
  tagline: 'Kompaktes JSON mit sauberer Einrückung direkt im Browser lesbar machen.',
  citation: {
    problem: 'Verwenden Sie diesen JSON-Formatierer, um JSON-Daten lokal zu formatieren oder zu prüfen, ohne sie hochzuladen.',
    nonGoal: 'ein KI-Modell aufzurufen oder den Inhalt der Daten fachlich zu interpretieren.',
  },
  knowledge: {
    primaryConcepts: ['json formatierer', 'json einrücken'],
    realWorldUseCases: [
      'Minimierte API-Antworten beim Debugging lesbar machen',
      'Gebündelte Konfigurationsdateien übersichtlich prüfen',
      'Webhook-Payloads aus Server-Logs schnell analysieren',
      'Saubere Git-Diffs für JSON-Konfigurationsdateien vorbereiten',
    ],
    commonMistakes: [
      'Ungültiges JSON mit Syntaxfehlern direkt formatieren zu wollen',
      'Formatiertes JSON statt kompakter Ausgabe in latenzkritischen APIs auszuliefern',
    ],
  },
  faqs: [
    {
      id: 'json-fmt-faq-1',
      question: 'Wie formatiere ich JSON online?',
      answer:
        'Fügen Sie Ihr JSON einfach in das Eingabefeld ein. Gültiges JSON erscheint sofort sauber eingerückt und mit Zeilenumbrüchen. Bei Syntaxfehlern weist die Statuszeile direkt auf die Problemstelle hin. Alle Schritte laufen lokal im Browser.',
    },
    {
      id: 'json-fmt-faq-2',
      question: 'Was genau macht ein JSON-Formatierer?',
      answer:
        'Er nimmt gültiges JSON und versieht es mit einheitlichen Einrückungen und Zeilenumbrüchen. Die Daten selbst bleiben unverändert: gleiche Schlüssel, gleiche Werte, gleiche Struktur. Lediglich der Leerraum wird für Menschen lesbar angeordnet.',
    },
    {
      id: 'json-fmt-faq-3',
      question: 'Verändert die Formatierung die Bedeutung des JSON?',
      answer:
        'Nein. Leerraum zwischen JSON-Tokens besitzt keine inhaltliche Bedeutung. `{"a":1}`, `{ "a": 1 }` und die mehrzeilige Fassung werden von jedem Parser identisch eingelesen.',
    },
    {
      id: 'json-fmt-faq-4',
      question: 'Was ist der Unterschied zwischen Formatieren und Minifizieren?',
      answer:
        'Beide Vorgänge sind Gegenteile: Formatieren fügt Einrückungen für bessere Lesbarkeit hinzu, Minifizieren entfernt unnötige Leerzeichen für kleinere Dateigrößen. Beide liefern gültiges JSON mit identischem Datenbestand.',
    },
    {
      id: 'json-fmt-faq-5',
      question: 'Worin unterscheidet sich das Formatieren vom Validieren?',
      answer:
        'Formatieren strukturiert gültiges JSON visuell. Validieren prüft, ob ein Text der offiziellen JSON-Syntax entspricht, und meldet eventuelle Syntaxfehler. Bei fehlerhaftem Input korrigieren Sie zuerst die Syntax.',
    },
    {
      id: 'json-fmt-faq-6',
      question: 'Bleiben meine JSON-Daten privat?',
      answer:
        'Ja. Die komplette Verarbeitung findet lokal in Ihrem Browser statt. Es werden keinerlei Eingaben an externe Server gesendet.',
    },
    {
      id: 'json-fmt-faq-7',
      question: 'Wie viele Leerzeichen sind für die Einrückung üblich?',
      answer:
        'Zwei Leerzeichen sind im Web- und JavaScript-Umfeld Standard, während vier Leerzeichen oft in Python eingesetzt werden. Technisch behandeln JSON-Parser beide Varianten identisch.',
    },
    {
      id: 'json-fmt-faq-8',
      question: 'Warum sehen API-Antworten oft wie ein einziger langer Textblock aus?',
      answer:
        'APIs senden im Produktivbetrieb meist minifiziertes JSON ohne Zeilenumbrüche, um Traffic und Ladezeit zu sparen. Für die Fehlersuche fügen Sie die Antwort hier ein und erhalten sofort eine strukturierte Ansicht.',
    },
    {
      id: 'json-fmt-faq-9',
      question: 'Was bedeutet „Pretty-Printing“?',
      answer:
        'Pretty-Printing bezeichnet das leserliche Formatieren von strukturiertem Text durch Einrückungen und Zeilenumbrüche. Im JSON-Kontext bedeutet es genau dasselbe wie Formatieren oder Verschönern.',
    },
    {
      id: 'json-fmt-faq-10',
      question: 'Kann ich JSON formatieren, ohne eine Datei hochzuladen?',
      answer:
        'Ja. ToyTools verarbeitet den Text direkt im Arbeitsspeicher Ihres Geräts ohne Upload.',
    },
    {
      id: 'json-fmt-faq-11',
      question: 'Nutzt der JSON-Formatierer eine KI?',
      answer:
        'Nein. Er formatiert deterministisch nach RFC 8259 im Browser und ruft weder ChatGPT noch Claude, Gemini oder andere KI-Dienste auf.',
    },
    {
      id: 'json-fmt-faq-12',
      question: 'Kann ich damit JSON prüfen, das ein Sprachmodell erzeugt hat?',
      answer:
        'Ja. Fügen Sie die Ausgabe einfach ein, um Struktur und Syntax zu kontrollieren oder das formatierte Ergebnis direkt weiterzuverwenden.',
    },
    {
      id: 'json-fmt-faq-13',
      question: 'Bleiben große Ganzzahlen und doppelte Schlüssel erhalten?',
      answer:
        'Ja. Der Formatierer rückt Ihre Original-Tokens neu ein, statt sie über JSON.stringify neu aufzubauen. Dadurch bleiben 12345678901234567890, 1.0 und 1e5 exakt erhalten, und doppelte Schlüssel werden beibehalten samt Hinweis markiert.',
    },
  ],
  guide: {
    title: 'Was ist JSON-Formatierung und wann nutzt man sie?',
    description:
      'Wie ein JSON-Formatierer arbeitet, warum Formatieren und Minifizieren dieselben Daten bewahren und wann welche Form sinnvoll ist.',
    readMinutes: 4,
  },
  ui: {
    inputLabel: 'JSON-Eingabe',
    placeholder: 'JSON hier einfügen',
    emptyOutput: 'Fügen Sie links JSON ein, um es zu formatieren.',
    validLabel: 'Gültiges JSON',
    invalidLabel: 'Ungültiges JSON',
    appliedPrefix: 'Korrektur angewendet:',
    loadError: 'Der JSON-Prozessor konnte nicht geladen werden.',
    moreAboutHeading: 'So funktioniert der JSON-Formatierer',
    insight:
      'Formatieren (Pretty-Printing) ergänzt gleichmäßige Einrückungen und Zeilenumbrüche, damit JSON lesbar und leicht vergleichbar wird. Nur Leerzeichen ändern sich, niemals die Daten.',
    technical: [
      { term: 'Standard', detail: 'RFC 8259 / ECMA-404' },
      { term: 'Verfahren', detail: 'Rückt die Original-Tokens mit 2 Leerzeichen neu ein, ohne Werte neu zu serialisieren' },
      { term: 'Daten', detail: 'Unverändert: große Ganzzahlen, 1.0, 1e5 und Zeichen-Escapes bleiben exakt erhalten' },
      { term: 'Doppelte Schlüssel', detail: 'Werden unverändert beibehalten und mit Warnung gemeldet' },
      { term: 'Fehler', detail: 'Nennt den ersten Syntaxfehler inklusive Position' },
    ],
  },
};
