import type { LocalizedToolPack } from '@lib/i18n/types';

export const pack: LocalizedToolPack = {
  locale: 'de',
  slug: 'qr-code-generator',
  name: 'QR-Code-Generator',
  seoTitle: 'QR-Code-Generator Online – Text, URL, WLAN & vCard',
  description:
    'Erstellen Sie QR-Codes für Text, URLs, E-Mail, Telefon, WLAN oder Visitenkarten. Kostenlos als PNG oder SVG herunterladen, alles lokal im Browser.',
  tagline: 'QR-Codes für URL, WLAN, Kontakte oder Text direkt als PNG oder SVG.',
  knowledge: {
    primaryConcepts: ['qr-code-generierung', 'qr-codes'],
    realWorldUseCases: [
      'Plakate, Flyer oder Produktetiketten direkt mit einer Webseite verknüpfen',
      'Gäste-WLAN teilen, ohne lange Passwörter abtippen zu müssen',
      'Kontaktdaten als vCard auf Visitenkarten oder in Signaturen bereitstellen',
      'Speisekarten oder Feedback-Formulare als Tischaufsteller anbieten',
    ],
    commonMistakes: [
      'Sehr lange URLs kodieren, wodurch der Code zu dicht und schwer scannbar wird',
      'Den QR-Code für den jeweiligen Leseabstand zu klein drucken',
      'Niedrige Fehlerkorrektur für Oberflächen mit Abrieb- oder Knickrisiko wählen',
      'Den weißen Ruhebereich (Quiet Zone) rund um das Muster abschneiden',
    ],
  },
  faqs: [
    {
      id: 'qr-code-generator-faq-1',
      question: 'Was ist ein QR-Code?',
      answer:
        'Ein QR-Code ist ein quadratischer Matrixcode aus schwarzen und weißen Modulen. Smartphone-Kameras erfassen das Muster sofort („Quick Response“) und führen die passende Aktion aus, etwa einen Link öffnen oder ein WLAN verbinden.',
    },
    {
      id: 'qr-code-generator-faq-2',
      question: 'Wie verwende ich diesen QR-Code-Generator?',
      answer:
        'Wählen Sie den Inhaltstyp (Text, URL, E-Mail, Telefon, WLAN oder Kontaktkarte) und füllen Sie die Felder aus. Der QR-Code entsteht live beim Tippen. Anschließend laden Sie ihn als PNG oder SVG herunter oder kopieren den kodierten Text direkt.',
    },
    {
      id: 'qr-code-generator-faq-3',
      question: 'Welche Inhaltstypen lassen sich kodieren?',
      answer:
        'Sechs gängige Formate: Klartext, URL, E-Mail-Adresse, Telefonnummer, WLAN-Zugangsdaten und Visitenkarte (vCard). Jedes Format folgt dem Standardschema, das mobile Betriebssysteme direkt erkennen.',
    },
    {
      id: 'qr-code-generator-faq-4',
      question: 'Wie erstelle ich einen WLAN-QR-Code?',
      answer:
        'Wählen Sie den Typ WLAN, geben Sie Netzwerknamen (SSID), Passwort und Verschlüsselung (meist WPA/WPA2) ein und aktivieren Sie bei Bedarf „Verstecktes Netzwerk“. Beim Scannen bietet das Handy direkt den Beitritt an.',
    },
    {
      id: 'qr-code-generator-faq-5',
      question: 'Kann ich den erstellten QR-Code herunterladen?',
      answer:
        'Ja. Sie erhalten wahlweise eine PNG-Rastergrafik für Bildschirme und Chats oder eine verlustfreie SVG-Vektordatei für gestochen scharfen Druck in jeder Größe.',
    },
    {
      id: 'qr-code-generator-faq-6',
      question: 'Was ist der Unterschied zwischen PNG und SVG?',
      answer:
        'PNG besteht aus Pixeln mit fester Auflösung und wird bei starker Vergrößerung unscharf. SVG speichert geometrische Vektorpfade, skaliert beliebig groß und eignet sich perfekt für Poster, Broschüren und Beschilderung.',
    },
    {
      id: 'qr-code-generator-faq-7',
      question: 'Funktioniert der Generator auch offline?',
      answer:
        'Ja. Nach dem einmaligen Laden der Seite benötigt das Werkzeug keine Internetverbindung mehr, weil sämtliche Kodierungs- und Grafikfunktionen lokal per JavaScript laufen.',
    },
    {
      id: 'qr-code-generator-faq-8',
      question: 'Bleiben meine Daten privat?',
      answer:
        'Ja. Alle Angaben wie WLAN-Passwörter oder Telefonnummern bleiben ausschließlich in Ihrem Browser. Es findet kein Upload und keine Server-Speicherung statt.',
    },
    {
      id: 'qr-code-generator-faq-9',
      question: 'Was bedeutet Fehlerkorrektur bei QR-Codes?',
      answer:
        'QR-Codes enthalten Redundanzdaten, damit sie auch bei Verschmutzung, Kratzern oder leichter Überdeckung lesbar bleiben. Höhere Stufen von Niedrig bis Hoch vertragen mehr Schaden, machen den Code aber dichter. Mittel ist der beste Standard.',
    },
    {
      id: 'qr-code-generator-faq-10',
      question: 'Welche Fehlerkorrekturstufe sollte ich wählen?',
      answer:
        'Mittel (15%) deckt den Alltag zuverlässig ab. Wählen Sie Quartil oder Hoch für kleine Ausdrucke, raue Verpackungen oder Codes mit Logo. Niedrig empfiehlt sich nur bei knapper Fläche und optimaler Druckqualität.',
    },
    {
      id: 'qr-code-generator-faq-11',
      question: 'Kann ich einen QR-Code für eine Webadresse erstellen?',
      answer:
        'Ja. Wählen Sie URL und fügen Sie die vollständige Adresse ein. Halten Sie Links möglichst kurz, damit die Module groß bleiben und Kameras schneller fokussieren.',
    },
    {
      id: 'qr-code-generator-faq-12',
      question: 'Wie erstelle ich eine vCard-Visitenkarte als QR-Code?',
      answer:
        'Wählen Sie Kontaktkarte und tragen Sie Name, Telefonnummer, E-Mail und optional Organisation ein. Beim Scannen bietet das Smartphone direkt an, den Kontakt ins Adressbuch zu übernehmen.',
    },
    {
      id: 'qr-code-generator-faq-13',
      question: 'Warum lässt sich mein QR-Code nicht scannen?',
      answer:
        'Typische Ursachen sind zu viel Text, zu kleiner Druck, zu geringer Kontrast oder ein abgeschnittener weißer Rand. Kürzen Sie den Inhalt, drucken Sie größer mit hohem Schwarz-Weiß-Kontrast und bewahren Sie den Rand.',
    },
    {
      id: 'qr-code-generator-faq-14',
      question: 'Wie klein darf ein QR-Code gedruckt werden?',
      answer:
        'Für kurze URLs aus normalem Leseabstand gelten mindestens 2 × 2 cm als Faustregel, bei mehr Daten oder größerem Abstand entsprechend größer. Testen Sie jeden Ausdruck vorab mit dem Handy.',
    },
    {
      id: 'qr-code-generator-faq-15',
      question: 'Was ist die Ruhezone (Quiet Zone)?',
      answer:
        'Die Ruhezone ist der leere weiße Rand rund um den QR-Code, damit Scanner die Kanten sicher erkennen. Die hier exportierten Dateien bringen diesen Rand automatisch mit; schneiden Sie ihn nicht ab.',
    },
    {
      id: 'qr-code-generator-faq-16',
      question: 'Kann ich einen QR-Code nachträglich bearbeiten?',
      answer:
        'Nein. Statische QR-Codes speichern die Daten direkt im Muster. Wenn sich ein Ziel später ändern soll, kodieren Sie eine eigene Weiterleitungs-URL, deren Ziel Sie auf dem Server anpassen.',
    },
    {
      id: 'qr-code-generator-faq-17',
      question: 'Laufen die erzeugten QR-Codes irgendwann ab?',
      answer:
        'Nein. Da der Inhalt direkt im Code liegt und über keinen Drittanbieter-Dienst läuft, bleibt er dauerhaft gültig, solange die hinterlegte Webseite oder das WLAN-Passwort unverändert bleiben.',
    },
    {
      id: 'qr-code-generator-faq-18',
      question: 'Wie viele Zeichen passen in einen QR-Code?',
      answer:
        'Theoretisch einige tausend Zeichen, praktisch empfiehlt sich jedoch möglichst kompakter Text. Weniger Daten bedeuten gröbere Module und schnellere Erkennung durch Smartphone-Kameras.',
    },
    {
      id: 'qr-code-generator-faq-25',
      question: 'Funktioniert der QR-Code mit Emojis, Umlauten und anderen Sprachen?',
      answer:
        'Ja. Texte werden als UTF-8 kodiert, sodass Umlaute, Emojis sowie chinesische, japanische, arabische oder kyrillische Zeichen exakt übernommen werden. Solche Zeichen belegen 2 bis 4 Bytes statt 1 Byte, wodurch das Muster schneller dichter wird.',
    },
    {
      id: 'qr-code-generator-faq-19',
      question: 'Kann ich statt des Downloads den kodierten Text kopieren?',
      answer:
        'Ja. Die Schaltfläche Kopieren übernimmt genau die erzeugte Zeichenkette (etwa URL oder WIFI:-String) in die Zwischenablage.',
    },
    {
      id: 'qr-code-generator-faq-20',
      question: 'Sind die QR-Codes kostenlos und ohne Wasserzeichen nutzbar?',
      answer:
        'Ja. Alle generierten Codes gehören Ihnen ohne Konto, Kosten oder Wasserzeichen für private wie gewerbliche Zwecke.',
    },
    {
      id: 'qr-code-generator-faq-21',
      question: 'In welchen Browsern funktioniert der Generator?',
      answer:
        'In allen aktuellen Desktop- und Mobilbrowsern inklusive Chrome, Firefox, Safari und Edge. PNG und SVG lassen sich universell weiterverarbeiten.',
    },
    {
      id: 'qr-code-generator-faq-22',
      question: 'Funktioniert der QR-Code im Dark Mode?',
      answer:
        'Ja. Unabhängig vom dunklen Design der Webseite wird der QR-Code immer mit dunklen Modulen auf weißem Hintergrund gezeichnet und exportiert, damit Kameras ihn zuverlässig lesen.',
    },
    {
      id: 'qr-code-generator-faq-23',
      question: 'Merkt sich das Tool meine Eingaben?',
      answer:
        'Im lokalen Browserspeicher bleiben nur Formular-Einstellungen wie Inhaltstyp und Fehlerkorrektur erhalten. Ihre Texte, WLAN-Passwörter oder erzeugten Grafiken werden nicht gespeichert.',
    },
    {
      id: 'qr-code-generator-faq-24',
      question: 'Werden Daten hochgeladen oder mit Dritten geteilt?',
      answer:
        'Nein. Es gibt kein Benutzerkonto, keine Serveranfragen und kein Tracking Ihrer Eingaben. Alles entsteht lokal auf Ihrem Gerät.',
    },
  ],
  guide: {
    title: 'QR-Code erstellen: Aufbau, Formate & Tipps',
    description:
      'Was QR-Codes sind, wie Fehlerkorrektur funktioniert und wie Sie QR-Codes für Text, URLs, WLAN und vCards direkt im Browser erzeugen.',
    readMinutes: 9,
  },
  fields: {
    contentType: {
      label: 'Inhalt',
      options: {
        text: 'Text',
        url: 'URL',
        email: 'E-Mail',
        phone: 'Telefon',
        wifi: 'WLAN',
        vcard: 'Kontaktkarte',
      },
    },
    text: {
      label: 'Wert',
      placeholder: 'Text, https://beispiel.de, name@beispiel.de oder +49 170 0000000',
      help: 'Der exakte Inhalt des QR-Codes.',
    },
    ssid: { label: 'Netzwerkname (SSID)', placeholder: 'MeinWLAN' },
    wifiPassword: { label: 'WLAN-Passwort', placeholder: 'Netzwerkpasswort' },
    encryption: {
      label: 'Sicherheit',
      options: { WPA: 'WPA/WPA2', WEP: 'WEP', nopass: 'Keine' },
    },
    hidden: { label: 'Verstecktes Netzwerk' },
    fullName: { label: 'Vollständiger Name', placeholder: 'Ada Lovelace' },
    vcardPhone: { label: 'Telefon', placeholder: '+49 170 0000000' },
    vcardEmail: { label: 'E-Mail', placeholder: 'name@beispiel.de' },
    org: { label: 'Organisation', placeholder: 'Unternehmen (optional)' },
    errorCorrection: {
      label: 'Fehlerkorrektur',
      group: 'Optionen',
      options: {
        L: 'Niedrig (7%)',
        M: 'Mittel (15%)',
        Q: 'Quartil (25%)',
        H: 'Hoch (30%)',
      },
    },
  },
  ui: {
    emptyText: 'Wählen Sie Optionen und geben Sie Inhalte für Ihren QR-Code ein.',
    engine: {
      enterContent: 'Geben Sie den zu kodierenden Inhalt ein.',
      tooMuchTpl: 'Zu viele Daten für einen QR-Code ({bytes} Bytes; Limit bei Korrektur {level}: {limit}). Kürzen Sie den Text oder wählen Sie eine niedrigere Stufe.',
      modulesLabel: 'Module',
      ecLabel: 'Fehlerkorrektur',
    },
  },
};
