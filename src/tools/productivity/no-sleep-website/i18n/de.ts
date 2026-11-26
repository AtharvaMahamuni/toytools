import type { LocalizedToolPack } from '@lib/i18n/types';

export const pack: LocalizedToolPack = {
  locale: 'de',
  slug: 'no-sleep-website',
  name: 'Bildschirm anlassen (No Sleep Website)',
  seoTitle: 'Bildschirm anlassen online – No Sleep Website',
  description:
    'Kostenlose No Sleep Website: Bildschirm am Handy, Tablet oder Laptop direkt im Browser wach halten, ohne App-Installation und ohne Konto.',
  tagline: 'Bildschirm direkt im Browser wach halten, ganz ohne App-Installation.',
  citation: {
    problem:
      'Nutzen Sie diese No Sleep Website, um den Bildschirm von Smartphone, Tablet oder Laptop aktiv zu halten, ohne Software zu installieren oder Systemeinstellungen zu ändern.',
    nonGoal: 'den physischen Ein-/Aus-Schalter umgehen, kritische Akku-Abschaltungen verhindern oder im Hintergrund aktiv bleiben.',
  },
  knowledge: {
    primaryConcepts: ['bildschirm anlassen', 'no sleep website'],
    realWorldUseCases: [
      'Rezept beim Kochen auf dem Smartphone sichtbar halten, ohne den Bildschirm ständig anzutippen',
      'Während einer Präsentation, Demo oder Besprechung das Abdunkeln des Laptops verhindern',
      'Ein Monitoring-Dashboard, Build-Status oder Notizen auf einem zweiten Monitor dauerhaft anzeigen',
      'Lange Dokumentationen oder Artikel lesen, ohne nach 30 Sekunden neu entsperren zu müssen',
    ],
    commonMistakes: [
      'Erwarten, dass die Sperre nach einem Tab-Wechsel oder Minimieren des Browsers bestehen bleibt',
      'Annehmen, dass Web-Wake-Locks den Energiesparmodus oder das Schließen des Laptop-Deckels außer Kraft setzen',
    ],
  },
  faqs: [
    {
      id: 'nsw-faq-1',
      question: 'Was ist eine No Sleep Website?',
      answer:
        'Eine No Sleep Website ist eine Webseite, die das Betriebssystem über die standardisierte W3C Screen Wake Lock API bittet, das Display eingeschaltet zu lassen. Solange der Tab sichtbar bleibt, verhindert sie automatisches Abdunkeln und den Ruhezustand des Bildschirms.',
    },
    {
      id: 'nsw-faq-2',
      question: 'Wie halte ich meinen Bildschirm online wach?',
      answer:
        'Öffnen Sie diese Seite und klicken oder tippen Sie auf Bildschirm wach halten. Ihr Browser fordert sofort einen Wake Lock an. Solange dieser Tab im Vordergrund sichtbar bleibt, schaltet sich der Bildschirm nicht ab.',
    },
    {
      id: 'nsw-faq-3',
      question: 'Funktioniert das Tool auf Android-Smartphones und Tablets?',
      answer:
        'Ja. In Google Chrome, Microsoft Edge, Brave, Samsung Internet und anderen modernen Chromium-Browsern auf Android funktioniert der Wake Lock direkt ohne Installation.',
    },
    {
      id: 'nsw-faq-4',
      question: 'Funktioniert es auf dem iPhone und iPad?',
      answer:
        'Ja. Seit iOS 16.4 und iPadOS 16.4 unterstützt Safari sowie alle auf WebKit basierenden iOS-Browser die Screen Wake Lock API nativ. Der Tab muss sichtbar geöffnet bleiben.',
    },
    {
      id: 'nsw-faq-5',
      question: 'Kann ich damit den Bildschirm meines Windows- oder Mac-Laptops aktiv halten?',
      answer:
        'Ja. Chrome, Edge und Safari unterstützen Wake Locks unter Windows und macOS direkt; Firefox unterstützt die API ab Version 126. Das Zuklappen des Laptop-Deckels oder System-Standby-Shortcuts lösen jedoch weiterhin den System-Ruhezustand aus.',
    },
    {
      id: 'nsw-faq-6',
      question: 'Bleibt die Sperre aktiv, wenn ich den Tab wechsle oder das Fenster minimiere?',
      answer:
        'Nein. Aus Energiespargründen geben alle Browser Wake Locks sofort frei, sobald ein Tab verdeckt oder minimiert wird. Kehren Sie zu diesem Tab zurück, fordert das Tool die Sperre automatisch erneut an.',
    },
    {
      id: 'nsw-faq-7',
      question: 'Verbraucht ein dauerhaft aktives Display mehr Akku?',
      answer:
        'Ja. Das beleuchtete Display ist einer der größten Energieverbraucher. Im Bereich Benachrichtigungen und Anzeige können Sie optional den Akkuschutz aktivieren, der die Sperre unter 15 Prozent Akkustand automatisch löst.',
    },
    {
      id: 'nsw-faq-8',
      question: 'Ist diese No Sleep Website kostenlos?',
      answer:
        'Ja. Das Werkzeug ist komplett kostenlos, erfordert weder Registrierung noch Konto und läuft lokal in Ihrem Browser.',
    },
    {
      id: 'nsw-faq-9',
      question: 'Muss ich eine App oder Browser-Erweiterung installieren?',
      answer:
        'Nein. Da die offizielle Browser-API genutzt wird, funktioniert die Seite sofort ohne Downloads oder Zusatzprogramme.',
    },
    {
      id: 'nsw-faq-10',
      question: 'Warum schaltet sich der Bildschirm manchmal trotzdem ab?',
      answer:
        'Strenge Energiesparmodi, Unternehmensrichtlinien, der physische Ein-/Aus-Schalter oder das Zuklappen des Laptops haben Vorrang vor Browser-Anfragen. Wird die Sperre vom System beendet, meldet das Tool den Verlust sofort und versucht bei sichtbarem Tab eine Wiederverbindung.',
    },
  ],
  guide: {
    title: 'Bildschirm wach halten im Browser',
    description: 'Wie die Screen Wake Lock API funktioniert, welche Geräte unterstützt werden und wie Sie Akku sparen.',
    readMinutes: 6,
  },
  ui: {
    panelScreen: 'Bildschirm',
    panelSession: 'Sitzung',
    heroReady: 'Bereit',
    heroPlanned: 'Geplant',
    heroRemaining: 'Verbleibend',
    heroAwakeFor: 'Wach seit',
    heroTotalAwake: 'Gesamtzeit wach',
    btnStart: 'Bildschirm wach halten',
    btnStop: 'Stoppen',
    lockReady: 'Bereit für Ihre Sitzung.',
    lockHeld: 'Wake Lock wird von Ihrem Gerät gehalten.',
    lockLost: 'Sperre verloren. Verbinde neu...',
    lockComplete: 'Sitzung abgeschlossen.',
    lockUnsupported: 'Nutzen Sie stattdessen die Geräteeinstellungen.',
    metaStarted: 'Gestartet',
    metaEnds: 'Endet',
    btnAmbient: 'Umgebungsmodus',
    unsupTitle: 'Dieser Browser unterstützt keinen Wake Lock.',
    keepAwakeFor: 'Wach halten für',
    sessionLengthAria: 'Sitzungsdauer',
    durUntilStop: 'Bis ich stoppe',
    dur15m: '15 Min.',
    dur30m: '30 Min.',
    dur1h: '1 Stunde',
    dur2h: '2 Stunden',
    customLabel: 'Eigene Zeit',
    customPlaceholder: 'Minuten',
    alertsSummary: 'Hinweise und Anzeige',
    optChime: 'Signalton am Sitzungsende',
    optNotify: 'Browser-Benachrichtigung am Ende',
    optGuard: 'Unter 15% Akku automatisch beenden',
    clockFormatAria: 'Uhrzeitformat',
    clockLabel: 'Uhr',
    ambSleeping: 'Standby',
    ambAwake: 'Wach',
    ambReconnecting: 'Verbinde neu',
    ambCompleted: 'Fertig',
    ambEndsAt: 'Endet um',
    ambBtnStart: 'Wach halten',
    ambBtnDim: 'Dimmen',
    ambBtnExit: 'Beenden',
    unitMinShort: 'Min.',
    unitHourShort: 'Std.',
    todayPrefix: 'Heute: ',
    todayOne: 'Sitzung',
    todayMany: 'Sitzungen',
    todayAwakeSuffix: 'wach',
    titleActive: 'Aktiv · Bildschirm anlassen',
    annLockLost: 'Wake Lock verloren. Verbinde neu.',
    annAcquireFail: 'Wake Lock konnte nicht aktiviert werden.',
    annStartedTimed: 'Bildschirm bleibt {dur} aktiv.',
    annStartedOpen: 'Bildschirm wird wach gehalten.',
    annCompleted: 'Sitzung nach {dur} beendet.',
    notifyTitle: 'Bildschirm freigegeben',
    notifyBody: 'Ihre Sitzung ({dur}) ist beendet.',
    batteryLabel: 'Akku ',
    batteryCharging: ' und lädt',
    batteryGuardStop: 'Bei {pct}% Akku zum Schutz beendet.',
    hintIos: 'Unter iOS: Einstellungen > Anzeige & Helligkeit > Automatische Sperre > Nie.',
    hintAndroid: 'Unter Android: Einstellungen > Display > Bildschirm-Timeout.',
    hintMac: 'Unter macOS: Systemeinstellungen > Sperrbildschirm > Display ausschalten.',
    hintWin: 'Unter Windows: Einstellungen > System > Stromversorgung und Akku > Bildschirm und Energiesparmodus.',
    hintOther: 'Stellen Sie das Timeout in den Anzeigeeinstellungen Ihres Geräts ein.',
  },
};
