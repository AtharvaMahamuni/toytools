import type { LocalizedToolPack } from '@lib/i18n/types';

export const pack: LocalizedToolPack = {
  "name": "Schlafzyklus-Rechner",
  "seoTitle": "Schlafzyklus Rechner - 90-Minuten-Schlafenszeit & Wecker",
  "description": "Berechne deine ideale Schlafenszeit oder Weckzeit in 90-Minuten-Zyklen inklusive deiner tatsächlichen Einschlafzeit im Browser.",
  "tagline": "Schlafenszeiten in 90-Minuten-Zyklen plus Einschlafzeit.",
  "lead": "Finde die optimalen Bett- oder Weckzeiten nach 90-Minuten-Schlafzyklen unter Berücksichtigung deiner Einschlafminuten lokal im Browser.",
  "craft": {
    "solves": "Wer nur 90 Minuten rückwärts zählt, vergisst die Einschlafphase im Bett und landet am Morgen mitten in der Tiefschlafphase."
  },
  "guide": {
    "title": "Schlafenszeit mit 90-Minuten-Zyklen finden",
    "description": "Was ein Schlafzyklus von 90 Minuten ist, warum Einschlafminuten vor Zyklus eins gehören und wie Bett- vs. Weckzeit funktionieren."
  },
  "fields": {
    "direction": {
      "label": "Ich kenne meine",
      "options": {
        "wake": "Aufwachzeit",
        "sleep": "Zubettgehzeit"
      }
    },
    "time": {
      "label": "Uhrzeit",
      "help": "z. B. 07:00, 19:00 oder 7:00 am als Weck- oder Bettgehzeit."
    },
    "latency": {
      "label": "Minuten bis zum Einschlafen",
      "help": "Meist ca. 15 Minuten. 0 bedeutet sofortiges Einschlafen."
    },
    "cycle": {
      "label": "Zykluslänge (Minuten)",
      "help": "Ein typischer Erwachsenen-Zyklus dauert ca. 90 Minuten."
    }
  },
  "ui": {
    "emptyText": "Gib eine Aufwach- oder Zubettgehzeit ein, um alle vier Schlafzyklus-Optionen zu sehen.",
    "engine": {
      "vLabel_latency": "Minuten bis zum Einschlafen",
      "vLabel_cycle": "Zykluslänge",
      "errEnterTpl": "Bitte {label} eingeben.",
      "errWholeTpl": "{label} muss eine ganze Zahl sein.",
      "errRangeTpl": "{label} muss zwischen {min} und {max} liegen.",
      "errBadClock": "Bitte eine gültige Uhrzeit wie 07:00, 19:00 oder 7:00 am eingeben.",
      "heroWake": "Ins Bett gehen",
      "heroSleep": "Aufwachen um",
      "heroInstant": "5 Zyklen. Sofortiges Einschlafen beim Hinlegen angenommen.",
      "heroLatencyTpl": "5 Zyklen nach {latency} Minuten Einschlafzeit.",
      "cycleCardTpl": "{n} Zyklen",
      "cycleNoteTpl": "{n} × {cycle} Min. Schlaf",
      "insWakeTpl": "Wecker um {time}. Jede Bettzeit rechnet {latency} Min. Einschlafzeit plus 3 bis 6 Zyklen à {cycle} Min. zurück.",
      "insSleepTpl": "Ins Bett um {time}. Jede Weckzeit plant {latency} Min. Einschlafzeit plus 3 bis 6 Zyklen à {cycle} Min. ein.",
      "insInstant": "Diese Zeiten gehen von sofortigem Einschlafen aus. Ergänze deine übliche Einschlafzeit, sonst klingelt der Wecker mitten im Zyklus.",
      "asmCycle": "Zykluslänge",
      "asmLatency": "Einschlafzeit",
      "asmInstant": "keine (sofortiger Schlaf)",
      "minTpl": "{n} Minuten",
      "decDateDiff": "Tage zwischen zwei Daten zählen",
      "explanationTpl": "Ein Zyklus dauert hier {cycle} Minuten; die {latency} Minuten Einschlafzeit davor zählen noch nicht als Zyklus. Die vier Angaben zeigen 6, 5, 4 und 3 volle Zyklen."
    }
  },
  "knowledge": {
    "summary": "Berechnet optimale Zubettgeh- und Weckzeiten auf Basis von 90-Minuten-Schlafzyklen inklusive Einschlafzeit.",
    "useCases": [
      "Passende Bettzeit für einen 07:00-Uhr-Wecker ermitteln",
      "Ideale Weckzeit beim sofortigen Zubettgehen berechnen",
      "Persönliche Einschlafminuten realistisch einbeziehen"
    ],
    "mistakes": [
      "Einschlafzeit bei 0 belassen und dadurch morgens im Tiefschlaf geweckt werden",
      "90 Minuten für starr und universell halten",
      "Den Rechner als medizinische Schlafdiagnose missverstehen"
    ]
  },
  "faqs": [
    {
      "id": "sleep-cycle-calculator-faq-1",
      "question": "Wann sollte ich für 90-Minuten-Zyklen ins Bett gehen?",
      "answer": "Wähle \"Aufwachzeit\", gib deinen Wecker ein und nutze etwa 15 Minuten Einschlafzeit: Für 07:00 liegen 5 Zyklen bei 23:15 und 6 Zyklen bei 21:45."
    },
    {
      "id": "sleep-cycle-calculator-faq-2",
      "question": "Warum startet die Berechnung 15 Minuten vor dem ersten Zyklus?",
      "answer": "Die Zeit zwischen Hinlegen und Einschlafen gehört nicht zur Schlafphase. Ohne Puffer klingelt dein Wecker rund 15 Minuten vor Zyklusende."
    },
    {
      "id": "sleep-cycle-calculator-faq-3",
      "question": "Wie viele Schlafzyklen hat eine Nacht?",
      "answer": "Angezeigt werden 6, 5, 4 und 3 Zyklen (9 h, 7,5 h, 6 h oder 4,5 h reiner Schlaf). Fünf bis sechs gelten für die meisten Erwachsenen als erholsam."
    },
    {
      "id": "sleep-cycle-calculator-faq-4",
      "question": "Kann ich auch von der Zubettgehzeit statt dem Wecker rechnen?",
      "answer": "Ja. Stelle auf \"Zubettgehzeit\", trage z. B. 22:30 ein und lies direkt die passenden Weckzeiten ab."
    },
    {
      "id": "sleep-cycle-calculator-faq-5",
      "question": "Dauert ein Zyklus bei jedem exakt 90 Minuten?",
      "answer": "Nein. 90 Minuten ist ein Richtwert; daher lässt sich die Zykluslänge zwischen 60 und 120 Minuten anpassen."
    },
    {
      "id": "sleep-cycle-calculator-faq-6",
      "question": "Was passiert, wenn ich die Einschlafzeit auf Null lasse?",
      "answer": "Alle Zeiten verschieben sich exakt um diesen Puffer und ein Hinweis warnt, dass sofortiges Einschlafen angenommen wurde."
    },
    {
      "id": "sleep-cycle-calculator-faq-7",
      "question": "Werden meine Schlafzeiten hochgeladen?",
      "answer": "Nein. Alles wird lokal in deinem Browser berechnet und verlässt dein Gerät nie."
    },
    {
      "id": "sleep-cycle-calculator-faq-8",
      "question": "Warum liegt die 6-Zyklen-Bettzeit mehr als 9 Stunden vor dem Wecker?",
      "answer": "Sechs 90-Minuten-Zyklen ergeben exakt 9 Stunden Schlaf, zuzüglich 15 Minuten Einschlafzeit im Bett."
    },
    {
      "id": "sleep-cycle-calculator-faq-9",
      "question": "Erkennt das Tool Schlafstörungen?",
      "answer": "Nein. Es führt nur Zeitrechnung anhand deiner gewählten Zykluslänge aus und ersetzt keine ärztliche Abklärung."
    },
    {
      "id": "sleep-cycle-calculator-faq-10",
      "question": "Worin liegt der Vorteil gegenüber Kopfrechnen?",
      "answer": "Du erhältst vier Zyklusoptionen in beide Richtungen inklusive Einschlafzeit und sauberem Mitternachts-Übertrag."
    }
  ]
};
