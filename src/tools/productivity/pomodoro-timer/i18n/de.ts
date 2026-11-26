import type { LocalizedToolPack } from '@lib/i18n/types';

export const pack: LocalizedToolPack = {
  locale: 'de',
  slug: 'pomodoro-timer',
  name: 'Pomodoro Timer',
  seoTitle: 'Pomodoro Timer Online: 25-Minuten-Fokus-Timer',
  description:
    'Kostenloser Pomodoro-Timer online: 25 Minuten Fokus, 5 Minuten Pause oder 50/10-Rhythmus. Alle Einstellungen bleiben lokal auf Ihrem Gerät.',
  tagline: 'Konzentriert arbeiten in festen Zeitblöcken mit echten Pausen.',
  knowledge: {
    primaryConcepts: ['pomodoro timer', 'pomodoro technik', 'fokus timer'],
    realWorldUseCases: [
      'Textentwürfe und Berichte in fokussierten 25-Minuten-Blöcken schreiben',
      'Prüfungsstoff mit festen Erholungspausen strukturiert lernen',
      'Pull Requests prüfen oder Aufgabenlisten abarbeiten',
    ],
    commonMistakes: [
      'Pausen auslassen und dadurch in der zweiten Stunde spürbar an Konzentration verlieren',
      'Während der fünfminütigen Pause E-Mails oder Chats prüfen',
      'Den Timer starten, ohne vorab eine konkrete Aufgabe festzulegen',
    ],
  },
  faqs: [
    {
      id: 'pt-faq-1',
      question: 'Was ist ein Pomodoro?',
      answer:
        'Ein Pomodoro ist ein abgemessener Arbeitsblock, klassisch 25 Minuten konzentrierte Arbeit gefolgt von 5 Minuten Pause. Der Name stammt vom italienischen Wort für Tomate nach der Küchenuhr von Francesco Cirillo.',
    },
    {
      id: 'pt-faq-2',
      question: 'Wie lange dauert ein Pomodoro?',
      answer:
        'Standardmäßig dauert eine Fokus-Einheit 25 Minuten. Nach vier Blöcken folgt eine längere Pause von 15 Minuten. Für längere Aufgaben lassen sich auch 50/10 oder beliebige Zeiten einstellen.',
    },
    {
      id: 'pt-faq-3',
      question: 'Warum heißt die Methode Pomodoro?',
      answer:
        'Francesco Cirillo nutzte in den späten 1980er-Jahren beim Lernen eine rote Küchenuhr in Tomatenform (italienisch pomodoro), die zum Symbol der Technik wurde.',
    },
    {
      id: 'pt-faq-4',
      question: 'Kann ich die Timer-Dauer anpassen?',
      answer:
        'Ja. Über Anpassen legen Sie Fokuszeit (1–180 Minuten), kurze Pause (1–60 Minuten), lange Pause (1–120 Minuten) und Einheiten pro Zyklus (1–12) fest. Alle Werte werden lokal gespeichert.',
    },
    {
      id: 'pt-faq-5',
      question: 'Kann ich 50/10 statt 25/5 verwenden?',
      answer:
        'Ja. Stellen Sie unter Anpassen 50 Minuten Fokus und 10 Minuten kurze Pause ein. Viele Entwickler und Autoren bevorzugen diesen längeren Rhythmus für tiefe Konzentrationsarbeit.',
    },
    {
      id: 'pt-faq-6',
      question: 'Wie viele Pomodoros sind pro Tag sinnvoll?',
      answer:
        'In intensiver Wissensarbeit sind meist 6 bis 12 Einheiten à 25 Minuten realistisch. Zum Einstieg bieten sich 4 volle Blöcke pro Tag an.',
    },
    {
      id: 'pt-faq-7',
      question: 'Was sollte ich in den Pausen tun?',
      answer:
        'In 5-Minuten-Pausen: aufstehen, kurz dehnen, in die Ferne blicken, Wasser trinken. Vermeiden Sie soziale Medien oder Mails, damit sich das Arbeitsgedächtnis tatsächlich erholt.',
    },
    {
      id: 'pt-faq-8',
      question: 'Eignet sich Pomodoro zum Lernen?',
      answer:
        'Ja, besonders für klar abgegrenzte Lernziele wie das Lesen eines Kapitels, das Lösen von Übungsaufgaben oder das Wiederholen von Karteikarten.',
    },
    {
      id: 'pt-faq-9',
      question: 'Ist die Pomodoro-Technik für Programmierer sinnvoll?',
      answer:
        'Für Bugfixes, Code-Reviews oder klar definierte Module funktioniert 25/5 sehr gut. Bei komplexem Design wählen viele Entwickler 50/10 oder 90/20.',
    },
    {
      id: 'pt-faq-16',
      question: 'Hilft Pomodoro bei ADHS?',
      answer:
        'Für viele Menschen mit ADHS ist die klare Zeitgrenze sehr hilfreich, weil sie die Einstiegshürde senkt ("nur 25 Minuten") und erzwungene Pausen Erschöpfung durch Hyperfokus vorbeugen.',
    },
    {
      id: 'pt-faq-17',
      question: 'Pomodoro oder Time Blocking: Was ist besser?',
      answer:
        'Beide ergänzen sich ideal. Time Blocking plant im Kalender, wann woran gearbeitet wird; Pomodoro strukturiert den Fokus innerhalb dieses Zeitfensters.',
    },
    {
      id: 'pt-faq-18',
      question: 'Funktioniert die Pomodoro-Technik wirklich?',
      answer:
        'Ja. Geplante Arbeits- und Erholungsintervalle stützen die natürliche Aufmerksamkeitskurve, begrenzen Unterbrechungen und reduzieren Aufschieben durch überschaubare Verpflichtungen.',
    },
    {
      id: 'pt-faq-14',
      question: 'Für wen eignet sich der Pomodoro-Timer?',
      answer:
        'Für Studierende, Entwickler, Autoren und alle, die regelmäßig unter Ablenkungen leiden oder große Aufgaben in machbare Abschnitte unterteilen möchten.',
    },
    {
      id: 'pt-faq-10',
      question: 'Funktioniert dieser Timer offline?',
      answer:
        'Ja. Nach dem ersten Laden der Seite läuft die gesamte Zeitmessung samt Signalton ohne Serververbindung im Browser.',
    },
    {
      id: 'pt-faq-11',
      question: 'Speichert ToyTools meine Daten?',
      answer:
        'Nein. Einstellungen und heutige Sitzungszähler liegen ausschließlich im localStorage Ihres Browsers und können per JSON exportiert werden.',
    },
    {
      id: 'pt-faq-12',
      question: 'Läuft der Timer weiter, wenn ich den Tab wechsle?',
      answer:
        'Ja. Der Countdown berechnet die Restzeit über echte Zeitstempel statt reiner Sekunden-Zähler und bleibt daher auch in gedrosselten Hintergrund-Tabs exakt.',
    },
    {
      id: 'pt-faq-13',
      question: 'Funktioniert der Timer auf Smartphones?',
      answer:
        'Ja. Die Oberfläche ist mobil optimiert. Da mobile Browser JavaScript bei gesperrtem Display pausieren, empfiehlt sich bei Bedarf unser Bildschirm-Wachhalter.',
    },
    {
      id: 'pt-faq-15',
      question: 'Kann ich den Timer als App auf dem Startbildschirm speichern?',
      answer:
        'Ja, über Installieren bzw. Zum Startbildschirm hinzufügen. Alle Daten bleiben lokal auf dem jeweiligen Gerät.',
    },
  ],
  guide: {
    title: 'Die Pomodoro-Technik: Praxisratgeber',
    description: 'Wie ein Pomodoro-Zyklus funktioniert, Varianten wie 50/10, Tipps für Studium und ADHS sowie typische Fehler.',
    readMinutes: 6,
  },
  ui: {
    btnCustomize: 'Anpassen',
    lblFocusMins: 'Fokusdauer',
    lblShortBreak: 'Kurze Pause',
    lblLongBreak: 'Lange Pause',
    lblSessionsPerCycle: 'Blöcke pro Zyklus',
    unitMin: 'Min.',
    lblSound: 'Signalton abspielen',
    lblNotif: 'Browser-Benachrichtigungen',
    lblAutoStart: 'Nächste Phase automatisch starten',
    ariaModePrefix: 'Aktueller Modus:',
    ariaTimer: 'Pomodoro-Timer',
    modeFocus: 'FOKUS',
    modeShortBreak: 'KURZE PAUSE',
    modeLongBreak: 'LANGE PAUSE',
    btnStart: 'Start',
    btnPause: 'Pause',
    btnReset: 'Zurücksetzen',
    msgFocusComplete: 'Fokus-Block beendet ✓',
    ariaProgress: 'Zyklus-Fortschritt',
    sessionInitial: 'Einheit 1 von 4',
    sessionTpl: 'Einheit {n} von {total}',
    btnFullScreen: 'Vollbild',
    btnRemoveDistractions: 'Ablenkungsfrei',
    ariaBackup: 'Datensicherung',
    btnExportJson: 'JSON exportieren',
    btnImportJson: 'JSON importieren',
    lblPasteBackup: 'Backup-JSON einfügen',
    ariaChooseFile: 'JSON-Backup-Datei wählen',
    btnImport: 'Importieren',
    statsInitial: 'Heute ● 0 Einheiten ● 0 Minuten',
    todayWord: 'Heute',
    unitSessionOne: 'Einheit',
    unitSessionMany: 'Einheiten',
    unitMinuteOne: 'Minute',
    unitMinuteMany: 'Minuten',
    ariaExitFs: 'Vollbild beenden',
    dotDone: 'Einheit {i}: abgeschlossen',
    dotCurrent: 'Einheit {i}: aktiv',
    dotRemaining: 'Einheit {i}: offen',
    notifBreakTitle: 'Pausenzeit',
    notifBreakBody: 'Kurze Erholung. Tippen zum Zurückkehren.',
    notifFocusTitle: '● Pomodoro läuft',
    notifFocusBody: 'Fokus-Einheit aktiv. Tippen zum Öffnen.',
    msgFocusNotif: 'Fokus-Einheit abgeschlossen. Zeit für eine Pause!',
    msgLongBreakNotif: 'Lange Pause vorbei. Weiter geht es!',
    msgShortBreakNotif: 'Pause beendet. Zurück an die Arbeit!',
    msgRestored: 'Sitzung wiederhergestellt. Drücken Sie Start zum Fortsetzen.',
  },
};
