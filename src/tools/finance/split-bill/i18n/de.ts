import type { LocalizedToolPack } from '@lib/i18n/types';

export const pack: LocalizedToolPack = {
  "locale": "de",
  "slug": "split-bill",
  "name": "Rechnung Teilen",
  "seoTitle": "Rechnung Teilen Online mit Exakter Trinkgeld-Aufteilung",
  "description": "Teile eine Restaurantrechnung samt optionalem Trinkgeld unter 2 bis 30 Personen auf, sodass alle Anteile exakt auf den Cent aufgehen.",
  "tagline": "Restaurantrechnung und Trinkgeld centgenau aufteilen.",
  "methodology": {
    "name": "Centgenauer Ausgleich",
    "detail": "Alle zahlen denselben Grundbetrag; nicht teilbare Restbeträge gehen auf den letzten Anteil, damit die Gesamtsumme exakt stimmt."
  },
  "knowledge": {
    "primaryConcepts": [
      "Rechnung teilen"
    ],
    "realWorldUseCases": [
      "Gemeinsame Restaurantrechnung mit Trinkgeld gerecht aufteilen"
    ],
    "commonMistakes": [
      "Einzelanteile getrennt runden, sodass die Summe nicht mehr aufgeht",
      "Mit Zahlungsdienst-Gebühren verwechseln"
    ]
  },
  "faqs": [
    {
      "id": "bill-faq-1",
      "question": "Was macht Rechnung Teilen?",
      "answer": "Es teilt eine Restaurantrechnung samt optionalem Trinkgeld (0–30%) auf 2 bis 30 Personen auf, sodass alle Anteile exakt die Summe ergeben."
    },
    {
      "id": "bill-faq-2",
      "question": "Wie funktioniert der Restbetrag?",
      "answer": "Gerechnet wird in Untereinheiten (Paise/Cent): Jeder erhält den gleichen Grundanteil, die letzte Person übernimmt den nicht teilbaren Rest."
    },
    {
      "id": "bill-faq-3",
      "question": "Beispiel: 1000 mit 10% für 3 Personen?",
      "answer": "Summe 1100 ergibt 366,66, 366,66 und 366,68 – zusammen exakt 1100."
    },
    {
      "id": "bill-faq-4",
      "question": "Was passiert, wenn alles glatt aufgeht?",
      "answer": "Dann zahlen alle exakt gleich viel und es bleibt kein Restbetrag."
    },
    {
      "id": "bill-faq-5",
      "question": "Welche Trinkgeldsätze sind erlaubt?",
      "answer": "Ganzzahlige Prozentwerte von 0 bis 30%; leer bedeutet kein Trinkgeld."
    },
    {
      "id": "bill-faq-6",
      "question": "Für wie viele Personen funktioniert es?",
      "answer": "Für 2 bis 30 Personen (ganze Zahl)."
    },
    {
      "id": "bill-faq-7",
      "question": "Werden Namen oder Konten gespeichert?",
      "answer": "Nein. Keine Registrierung, keine Freundeslisten, keine Speicherung."
    },
    {
      "id": "bill-faq-8",
      "question": "Ist das ein Zahlungsgebühren-Rechner?",
      "answer": "Nein, ausschließlich ein Tischrechner für Restaurant und Trinkgeld."
    },
    {
      "id": "bill-faq-9",
      "question": "Werden Eingaben hochgeladen?",
      "answer": "Nein, alles bleibt in deinem Browser."
    },
    {
      "id": "bill-faq-10",
      "question": "Unterschied zum Trinkgeldrechner?",
      "answer": "Der Trinkgeldrechner endet bei der Gesamtsumme; hier werden zusätzlich die exakten Einzelanteile zugewiesen."
    }
  ],
  "guide": {
    "title": "Wie man eine Rechnung ohne Rundungsdifferenz teilt",
    "description": "Umgang mit unteilbaren Restcent, Trinkgeldregeln (0–30%) und Abgrenzung zum Trinkgeldrechner."
  },
  "ui": {
    "engine": {
      "billNote1": "Geht der Gesamtbetrag nicht glatt auf, übernimmt die letzte Person den Restbetrag, damit die Summe stimmt.",
      "billNote2": "Reiner Tischrechner ohne Konten oder Speicherung; alle Eingaben bleiben lokal.",
      "heroLabel": "Summe inkl. Trinkgeld",
      "eachLineTpl": "Jede Person zahlt {each}.",
      "noteEvenTpl": "{n} Personen. {eachLine}",
      "noteOddTpl": "{n} Personen. {eachLine} Die letzte Person zahlt {last}.",
      "insEven": "Alle Anteile sind exakt gleich hoch.",
      "insOdd": "Die letzte Person übernimmt den unteilbaren Restbetrag.",
      "msSum": "Alle Anteile ergeben exakt die Gesamtsumme",
      "asmTip": "Trinkgeld",
      "noTip": "Kein Trinkgeld",
      "asmPeople": "Personen",
      "asmRem": "Rest in Untereinheiten",
      "decTip": "Trinkgeld separat berechnen",
      "errBillEmpty": "Rechnungsbetrag eingeben.",
      "errBillNaN": "Der Rechnungsbetrag muss eine Zahl sein.",
      "errBillPos": "Der Betrag muss größer als null sein.",
      "errBillDec": "Maximal zwei Nachkommastellen eingeben.",
      "errBillCap": "Dieser Betrag überschreitet das Seitenlimit (10,00,00,000).",
      "errPeopleEmpty": "Personenzahl von 2 bis 30 eingeben.",
      "errPeopleNaN": "Personen müssen eine Zahl sein.",
      "errPeopleInt": "Personenzahl muss ganzzahlig sein.",
      "errPeopleRange": "Personenzahl zwischen 2 und 30 wählen.",
      "errTipNaN": "Trinkgeld muss eine Zahl sein.",
      "errTipRange": "Trinkgeld muss zwischen 0 und 30 liegen.",
      "errTipInt": "Trinkgeld muss eine ganze Zahl sein.",
      "errEnterTpl": "Gib {label} ein, um zu berechnen.",
      "errNotNumberTpl": "{label} muss eine Zahl sein.",
      "errNotNegativeTpl": "{Label} darf nicht negativ sein. Gib 0 oder mehr ein.",
      "errMinTpl": "{Label} darf nicht kleiner als {min} sein.",
      "errMaxTpl": "{Label} darf nicht größer als {max} sein.",
      "errPositiveTpl": "{label} muss größer als null sein.",
      "yearSingular": "Jahr",
      "yearsPlural": "Jahre",
      "neverLabel": "nie",
      "vLabels": {
        "amount": "den Betrag",
        "rate": "den Zinssatz",
        "years": "die Jahre",
        "goal": "das Sparziel",
        "current": "das vorhandene Ersparte",
        "start": "den Anfangswert",
        "end": "den Endwert"
      }
    },
    "billNote1": "Geht der Gesamtbetrag nicht glatt auf, übernimmt die letzte Person den Restbetrag, damit die Summe stimmt.",
    "billNote2": "Reiner Tischrechner ohne Konten oder Speicherung; alle Eingaben bleiben lokal.",
    "heroLabel": "Summe inkl. Trinkgeld",
    "eachLineTpl": "Jede Person zahlt {each}.",
    "noteEvenTpl": "{n} Personen. {eachLine}",
    "noteOddTpl": "{n} Personen. {eachLine} Die letzte Person zahlt {last}.",
    "insEven": "Alle Anteile sind exakt gleich hoch.",
    "insOdd": "Die letzte Person übernimmt den unteilbaren Restbetrag.",
    "msSum": "Alle Anteile ergeben exakt die Gesamtsumme",
    "asmTip": "Trinkgeld",
    "noTip": "Kein Trinkgeld",
    "asmPeople": "Personen",
    "asmRem": "Rest in Untereinheiten",
    "decTip": "Trinkgeld separat berechnen",
    "errBillEmpty": "Rechnungsbetrag eingeben.",
    "errBillNaN": "Der Rechnungsbetrag muss eine Zahl sein.",
    "errBillPos": "Der Betrag muss größer als null sein.",
    "errBillDec": "Maximal zwei Nachkommastellen eingeben.",
    "errBillCap": "Dieser Betrag überschreitet das Seitenlimit (10,00,00,000).",
    "errPeopleEmpty": "Personenzahl von 2 bis 30 eingeben.",
    "errPeopleNaN": "Personen müssen eine Zahl sein.",
    "errPeopleInt": "Personenzahl muss ganzzahlig sein.",
    "errPeopleRange": "Personenzahl zwischen 2 und 30 wählen.",
    "errTipNaN": "Trinkgeld muss eine Zahl sein.",
    "errTipRange": "Trinkgeld muss zwischen 0 und 30 liegen.",
    "errTipInt": "Trinkgeld muss eine ganze Zahl sein.",
    "errEnterTpl": "Gib {label} ein, um zu berechnen.",
    "errNotNumberTpl": "{label} muss eine Zahl sein.",
    "errNotNegativeTpl": "{Label} darf nicht negativ sein. Gib 0 oder mehr ein.",
    "errMinTpl": "{Label} darf nicht kleiner als {min} sein.",
    "errMaxTpl": "{Label} darf nicht größer als {max} sein.",
    "errPositiveTpl": "{label} muss größer als null sein.",
    "yearSingular": "Jahr",
    "yearsPlural": "Jahre",
    "neverLabel": "nie",
    "vLabels": {
      "amount": "den Betrag",
      "rate": "den Zinssatz",
      "years": "die Jahre",
      "goal": "das Sparziel",
      "current": "das vorhandene Ersparte",
      "start": "den Anfangswert",
      "end": "den Endwert"
    }
  },
  "fields": {
    "bill": {
      "label": "Rechnungsbetrag",
      "help": "Bis zu zwei Nachkommastellen. Reine Tischaufteilung ohne Zahlungsgebühren."
    },
    "people": {
      "label": "Personen",
      "unit": "Personen",
      "help": "2 bis 30 Personen."
    },
    "tip": {
      "label": "Trinkgeld in %",
      "help": "Optional, ganze Prozent von 0 bis 30. Leer = kein Trinkgeld."
    }
  }
};
