import type { LocalizedToolPack } from '@lib/i18n/types';

export const pack: LocalizedToolPack = {
  locale: 'de',
  slug: 'password-generator',
  name: 'Passwort-Generator',
  seoTitle: 'Passwort-Generator Online – Sichere Passwörter',
  description:
    'Erstelle sichere Zufallspasswörter mit wählbarer Länge, Zeichensätzen und Live-Entropieschätzung direkt im Browser. Alle Daten bleiben lokal.',
  tagline: 'Starke Zufallspasswörter mit Entropie-Bewertung in Echtzeit.',
  citation: {
    problem: 'Nutze diesen Generator, um direkt im Browser ein kryptografisch zufälliges Passwort zu erstellen.',
    nonGoal: 'das Passwort zu speichern oder an ein KI-Modell bzw. einen Server zu senden.',
  },
  craft: {
    solves:
      'Beim Abtippen vom Bildschirm oder Diktieren am Telefon sehen O/0 und l/1 in vielen Schriften gleich aus – das Ausschließen verhindert Tippfehler.',
  },
  knowledge: {
    primaryConcepts: ['Passwortgenerierung', 'Passwortstärke'],
    realWorldUseCases: [
      'Einzigartiges Passwort für ein neues Benutzerkonto anlegen',
      'Alte oder mehrfach genutzte Kennwörter ersetzen',
      'Master-Passwort für einen Passwort-Manager erzeugen',
      'Einmal-Zugangsdaten für gemeinsame Dienste bereitstellen',
    ],
    commonMistakes: [
      'Dasselbe Passwort auf mehreren Websites wiederverwenden',
      'Kurze Passwörter wählen, weil Sonderzeichen enthalten sind',
      'Passwörter unverschlüsselt in einer Textdatei ablegen',
      'Fast alle Zeichensätze deaktivieren, bis der Zeichenvorrat winzig ist',
    ],
  },
  fields: {
    length: { label: 'Länge', help: '4 bis 128 Zeichen. Empfohlen: mindestens 16 Zeichen.' },
    uppercase: { label: 'Großbuchstaben (A-Z)', group: 'Zeichensätze' },
    lowercase: { label: 'Kleinbuchstaben (a-z)', group: 'Zeichensätze' },
    numbers: { label: 'Ziffern (0-9)', group: 'Zeichensätze' },
    symbols: { label: 'Sonderzeichen (!@#$...)', group: 'Zeichensätze' },
    excludeAmbiguous: { label: 'Verwechselbare Zeichen meiden (0, O, 1, l, I)', group: 'Optionen' },
  },
  faqs: [
    {
      id: 'password-generator-faq-1',
      question: 'Was ist ein Passwort-Generator?',
      answer:
        'Ein Passwort-Generator stellt Zeichen nach echtem Zufallsprinzip aus gewählten Zeichensätzen zusammen. Im Gegensatz zu selbst ausgedachten Kennwörtern gibt es keine Wörterbuchmuster oder Gewohnheiten.',
    },
    {
      id: 'password-generator-faq-2',
      question: 'Wie benutze ich diesen Passwort-Generator?',
      answer:
        'Stelle die gewünschte Länge ein und aktiviere Großbuchstaben, Kleinbuchstaben, Ziffern und Sonderzeichen. Das Passwort erscheint sofort; klicke auf Neu generieren oder Kopieren.',
    },
    {
      id: 'password-generator-faq-3',
      question: 'Wie lang sollte ein sicheres Passwort sein?',
      answer:
        'Je länger, desto besser. Mindestens 16 Zeichen sind für normale Konten ein solider Standard, für E-Mail oder Passwort-Manager empfiehlt sich 20 Zeichen oder mehr.',
    },
    {
      id: 'password-generator-faq-4',
      question: 'Ist dieser Online-Passwort-Generator sicher?',
      answer:
        'Ja. Jedes Passwort wird lokal im Browser berechnet. Nichts wird über das Netzwerk gesendet oder auf einem Server gespeichert, was du im Netzwerk-Tab jederzeit prüfen kannst.',
    },
    {
      id: 'password-generator-faq-5',
      question: 'Funktioniert der Generator auch offline?',
      answer:
        'Ja. Sobald die Seite geladen ist, läuft die Erzeugung komplett in lokalem JavaScript. Du kannst die Internetverbindung trennen und weiter Passwörter erzeugen.',
    },
    {
      id: 'password-generator-faq-6',
      question: 'Sind die erzeugten Passwörter wirklich zufällig?',
      answer:
        'Es wird die kryptografische Web Crypto API des Browsers (`crypto.getRandomValues`) mit verzerrungsfreier Auswahl genutzt, sodass jedes Zeichen exakt dieselbe Wahrscheinlichkeit hat.',
    },
    {
      id: 'password-generator-faq-7',
      question: 'Was bedeutet Passwort-Entropie?',
      answer:
        'Entropie misst in Bit, wie schwer sich ein Passwort erraten lässt. Jedes zusätzliche Bit verdoppelt die Suchmenge: unter 40 Bit ist schwach, 60 bis 80 Bit solide, ab 100 Bit sehr stark.',
    },
    {
      id: 'password-generator-faq-8',
      question: 'Wie wird die Entropie berechnet?',
      answer:
        'Passwortlänge multipliziert mit dem Zweierlogarithmus des Zeichenpools. Mit allen vier Zeichensätzen (~88 Zeichen) und 16 Zeichen Länge ergeben sich rund 103 Bit.',
    },
    {
      id: 'password-generator-faq-9',
      question: 'Was zeigt die Stärke-Anzeige an?',
      answer:
        'Sie übersetzt die Entropie in Stufen von Sehr schwach bis Sehr stark. Wichtige Konten sollten mindestens Stark oder Sehr stark erreichen.',
    },
    {
      id: 'password-generator-faq-10',
      question: 'Sollte ich Sonderzeichen einschließen?',
      answer:
        'Ja, sofern die Website sie erlaubt, aber Länge ist wirksamer. Vier zusätzliche Zeichen bringen mehr Sicherheit als der Sprung von 62 auf 88 Zeichen im Pool.',
    },
    {
      id: 'password-generator-faq-11',
      question: 'Was sind verwechselbare Zeichen und warum meidet man sie?',
      answer:
        'In vielen Schriftarten sehen 0 und O sowie 1, l und I fast identisch aus. Wer das Passwort abtippen oder vorlesen muss, vermeidet durch diese Option Tippfehler.',
    },
    {
      id: 'password-generator-faq-12',
      question: 'Kann ich ein reines Ziffern-Passwort erstellen?',
      answer:
        'Ja. Deaktiviere Buchstaben sowie Sonderzeichen und lasse nur Ziffern aktiv, um eine PIN zu erzeugen. Wegen des kleinen Pools (10 Zeichen) sollte die Länge entsprechend größer sein.',
    },
    {
      id: 'password-generator-faq-13',
      question: 'Warum lehnt eine Website mein Passwort ab?',
      answer:
        'Manche Seiten begrenzen die Maximallänge oder verbieten bestimmte Sonderzeichen. Reduziere die Länge auf das erlaubte Maximum oder schalte Sonderzeichen vorübergehend aus.',
    },
    {
      id: 'password-generator-faq-14',
      question: 'Können zwei Personen dasselbe Passwort erhalten?',
      answer:
        'Theoretisch ja, praktisch ausgeschlossen: Bei 16 Zeichen aus dem vollen Pool gibt es über 10^31 Möglichkeiten.',
    },
    {
      id: 'password-generator-faq-15',
      question: 'Wo bewahre ich das neue Passwort am besten auf?',
      answer:
        'In einem verschlüsselten Passwort-Manager. Speichere Kennwörter niemals ungeschützt in Textdateien, Notizen oder Tabellen.',
    },
    {
      id: 'password-generator-faq-16',
      question: 'Speichert die Seite erzeugte Passwörter?',
      answer:
        'Nein. Es werden niemals Passwörter gesichert. Lediglich deine gewählten Schalter (z. B. Länge) bleiben lokal im Browser für den Komfort erhalten.',
    },
    {
      id: 'password-generator-faq-17',
      question: 'Kann ich mehrere Passwörter gleichzeitig erstellen?',
      answer:
        'Dieses Tool erzeugt gezielt ein Passwort pro Durchgang und liefert per Klick sofort ein neues. Für größere Mengen Zufallszeichen eignet sich ein Random-String-Generator.',
    },
    {
      id: 'password-generator-faq-18',
      question: 'Was ist der Unterschied zwischen Passwort und Passphrase?',
      answer:
        'Ein Passwort kombiniert zufällige Einzelzeichen, eine Passphrase mehrere zufällige Wörter. Zufallszeichen-Passwörter eignen sich ideal für Passwort-Manager.',
    },
    {
      id: 'password-generator-faq-19',
      question: 'Schlägt ein langes Passwort ein kurzes, komplexes?',
      answer:
        'Fast immer ja. 20 zufällige Kleinbuchstaben bieten oft deutlich mehr Entropie als 10 Zeichen mit Sonderzeichen.',
    },
    {
      id: 'password-generator-faq-20',
      question: 'In welchen Browsern läuft der Generator?',
      answer:
        'In jedem modernen Browser auf Desktop und Mobilgerät (Chrome, Firefox, Safari, Edge), da die Standard-Web-Crypto-API verwendet wird.',
    },
    {
      id: 'password-generator-faq-21',
      question: 'Eignet sich das Tool auch für API-Keys oder Tokens?',
      answer:
        'Für schnelle Geheimnisse ja; wenn du feste Alphabete oder extrem lange Tokens brauchst, bietet ein Random-String-Generator mehr Kontrolle.',
    },
    {
      id: 'password-generator-faq-22',
      question: 'Wie oft sollte man Passwörter ändern?',
      answer:
        'Immer dann, wenn ein Dienst ein Datenleck meldet, ein Verdacht auf Missbrauch besteht oder ein Passwort doppelt verwendet wurde. Routinewechsel ohne Anlass gelten heute als kontraproduktiv.',
    },
    {
      id: 'password-generator-faq-23',
      question: 'Ist die Zwischenablage nach dem Kopieren ein Risiko?',
      answer:
        'Falls ein Zwischenablageverlauf aktiv ist, kann das Passwort dort bleiben. Kopiere nach dem Einfügen etwas Harmloses oder lösche den Verlauf.',
    },
    {
      id: 'password-generator-faq-24',
      question: 'Werden Daten hochgeladen oder geteilt?',
      answer:
        'Nein. Keine Registrierung, keine Serveranfrage und kein Tracking der generierten Zeichenketten.',
    },
    {
      id: 'password-generator-faq-25',
      question: 'Nutzt der Passwort-Generator künstliche Intelligenz?',
      answer:
        'Nein. Alle Zeichen stammen aus dem kryptografischen Zufallszahlengenerator deines Browsers, völlig ohne KI-Modell.',
    },
  ],
  guide: {
    title: 'Sichere Passwörter & Entropie einfach erklärt',
    description:
      'Warum Passwortlänge Komplexität schlägt, wie Entropie in Bit gemessen wird und wie du Passwörter sicher verwaltest.',
    readMinutes: 8,
  },
  ui: {
    emptyText: 'Optionen wählen und Passwort generieren.',
    engine: {
      errNoSet: 'Bitte mindestens einen Zeichensatz aktivieren.',
      bitsTpl: '{bits} Bit',
      charsTpl: '{n} Zeichen',
      metaEntropy: 'Entropie',
      metaLength: 'Länge',
      metaPool: 'Zeichenpool',
      strength: {
        veryWeak: 'Sehr schwach',
        weak: 'Schwach',
        fair: 'Mittel',
        strong: 'Stark',
        veryStrong: 'Sehr stark',
      },
    },
  },
};
