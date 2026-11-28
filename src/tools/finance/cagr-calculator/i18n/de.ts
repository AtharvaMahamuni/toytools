import type { LocalizedToolPack } from '@lib/i18n/types';

export const pack: LocalizedToolPack = {
  "locale": "de",
  "slug": "cagr-calculator",
  "name": "CAGR-Rechner",
  "seoTitle": "CAGR-Rechner: Jährliche Wachstumsrate Berechnen",
  "description": "Berechne CAGR (Compound Annual Growth Rate), Gesamtwachstum, Faktor und Verdopplungszeit aus Start- und Endwert im Browser.",
  "tagline": "Durchschnittliche jährliche Wachstumsrate (CAGR) und Faktor.",
  "methodology": {
    "name": "Geometrische Wachstumsrate",
    "detail": "Bestimmt über (End/Start)^(1/t) − 1 die konstante jährliche Rate zwischen Anfangs- und Endwert."
  },
  "knowledge": {
    "primaryConcepts": [
      "CAGR (jährliche Wachstumsrate)"
    ],
    "realWorldUseCases": [
      "Mehrjährige Fonds- oder Aktienrenditen annualisieren",
      "Umsatzwachstum über mehrere Geschäftsjahre auswerten",
      "Anlagen mit unterschiedlicher Laufzeit vergleichen",
      "Wachstumsprognosen auf Plausibilität prüfen"
    ],
    "commonMistakes": [
      "Gesamtwachstum linear durch Jahre teilen",
      "CAGR trotz Zwischenzahlungen anwenden"
    ]
  },
  "faqs": [
    {
      "id": "cagr-faq-1",
      "question": "Was ist der CAGR?",
      "answer": "Die Compound Annual Growth Rate bezeichnet die gleichmäßige jährliche Wachstumsrate, mit der ein Anfangswert in t Jahren den Endwert erreicht."
    },
    {
      "id": "cagr-faq-2",
      "question": "Wie wird der CAGR berechnet?",
      "answer": "CAGR = (Endwert / Anfangswert)^(1 / Jahre) − 1. Aus 10.000 auf 25.000 in 10 Jahren werden rund 9,6% p. a."
    },
    {
      "id": "cagr-faq-3",
      "question": "Warum ist CAGR niedriger als Gesamtwachstum geteilt durch Jahre?",
      "answer": "Weil Zinseszins auf vorangehenden Erträgen aufbaut; eine kleinere konstante Jahresrate erzeugt denselben Gesamtzuwachs."
    },
    {
      "id": "cagr-faq-4",
      "question": "Worin liegt der Unterschied zwischen CAGR und ROI?",
      "answer": "ROI zeigt den gesamten prozentualen Gewinn; CAGR rechnet denselben Erfolg auf eine vergleichbare Jahresrate um."
    },
    {
      "id": "cagr-faq-5",
      "question": "Kann der CAGR negativ ausfallen?",
      "answer": "Ja, sobald der Endwert unter dem Startwert liegt, beschreibt der negative CAGR den durchschnittlichen jährlichen Rückgang."
    },
    {
      "id": "cagr-faq-6",
      "question": "Welche Grenzen hat der CAGR?",
      "answer": "Er blendet Kursschwankungen zwischen Start und Ende aus und wird bei Zwischenzahlungen verfälscht."
    },
    {
      "id": "cagr-faq-7",
      "question": "Wie hängt er mit der Verdopplungszeit zusammen?",
      "answer": "Die exakte Verdopplungszeit beträgt ln(2) / ln(1 + CAGR) und liegt nah bei der Faustformel 72 / CAGR(%)."
    },
    {
      "id": "cagr-faq-8",
      "question": "Wie annualisiere ich ein mehrjähriges Wachstum?",
      "answer": "Berechne den Faktor (Ende / Start), nimm ihn hoch (1 / Jahre) und ziehe 1 ab. Eine Verdopplung in 5 Jahren entspricht 14,87% p. a., nicht 20%."
    },
    {
      "id": "cagr-faq-9",
      "question": "CAGR versus arithmetisches Jahresmittel?",
      "answer": "Das arithmetische Mittel täuscht bei Schwankungen (+100% und −50% ergäben +25% Mittelwert bei real 0% CAGR)."
    },
    {
      "id": "cagr-faq-10",
      "question": "Können zwei Anlagen gleichen CAGR bei anderem Risiko haben?",
      "answer": "Ja, denn ein ruhiger Anstieg und ein tiefer zwischenzeitlicher Crash mit Erholung führen beim identischen Endwert zum gleichen CAGR."
    },
    {
      "id": "cagr-faq-11",
      "question": "Warum wirkt der CAGR neben dem Gesamtwachstum oft klein?",
      "answer": "400% Gesamtplus (Faktor 5) über 20 Jahre ergeben exponentiell nur 8,4% p. a."
    },
    {
      "id": "cagr-faq-12",
      "question": "Werden meine Daten übertragen?",
      "answer": "Nein, alles wird ausschließlich im Browser berechnet."
    }
  ],
  "guide": {
    "title": "Was bedeutet CAGR und wie berechnet man ihn?",
    "description": "CAGR-Formel, Vergleich mit Durchschnitt und ROI sowie typische Fallstricke bei Cashflows."
  },
  "ui": {
    "scenarios": {
      "Index fund decade": "Indexfonds 10 J.",
      "Fast-growing revenue": "Umsatzwachstum",
      "Slow saver": "Konservativ"
    },
    "engine": {
      "heroLabel": "CAGR (jährliche Wachstumsrate)",
      "heroNoteTpl": "pro Jahr über {period}",
      "cardGrowth": "Gesamtwachstum",
      "cardDecline": "Gesamtrückgang",
      "cardMultiple": "Wachstumsfaktor",
      "cardDoubles": "Verdopplung alle",
      "insPosTpl": "Ein Plus von {total} über {period} entspricht {cagr} p. a. – weniger als bloßes Teilen durch die Jahre.",
      "insNegTpl": "Der Wert schrumpfte im Schnitt um {cagr} pro Jahr.",
      "insShort": "Das Hochrechnen von Zeiträumen unter einem Jahr auf ein Gesamtjahr sollte vorsichtig bewertet werden.",
      "insSmooth": "Der CAGR glättet den Verlauf auf eine gleichmäßige Jahresrate; reale Kursschwankungen bleiben unsichtbar.",
      "msDoubled": "Wert mindestens verdoppelt",
      "msDoubleDigit": "Zweistelliges Jahreswachstum",
      "asmGrowth": "Verlauf",
      "asmGrowthVal": "konstant jährlich verzinst",
      "asmCash": "Zahlungsfluss",
      "asmCashVal": "ohne Ein- und Auszahlungen im Zeitraum",
      "asmFigures": "Basis",
      "asmFiguresVal": "vor Steuern und Gebühren",
      "decRoi": "Gesamtrendite stattdessen im ROI-Rechner prüfen",
      "decRule72": "Verdopplung über 72er-Regel schätzen",
      "decCompound": "Mit diesem CAGR weiter in die Zukunft rechnen",
      "q1": "Wohin wächst der Betrag bei gleicher Rate?",
      "q2": "Ist der Wert vor oder nach Inflation?",
      "gainWord": "Steigerung",
      "declineWord": "Abnahme",
      "explanationTpl": "Ein Anstieg von {start} auf {end} über {period} entspricht einem CAGR von {cagr} für dieselbe {dir}.",
      "vizTitle": "Geglätteter Wachstumspfad",
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
    "heroLabel": "CAGR (jährliche Wachstumsrate)",
    "heroNoteTpl": "pro Jahr über {period}",
    "cardGrowth": "Gesamtwachstum",
    "cardDecline": "Gesamtrückgang",
    "cardMultiple": "Wachstumsfaktor",
    "cardDoubles": "Verdopplung alle",
    "insPosTpl": "Ein Plus von {total} über {period} entspricht {cagr} p. a. – weniger als bloßes Teilen durch die Jahre.",
    "insNegTpl": "Der Wert schrumpfte im Schnitt um {cagr} pro Jahr.",
    "insShort": "Das Hochrechnen von Zeiträumen unter einem Jahr auf ein Gesamtjahr sollte vorsichtig bewertet werden.",
    "insSmooth": "Der CAGR glättet den Verlauf auf eine gleichmäßige Jahresrate; reale Kursschwankungen bleiben unsichtbar.",
    "msDoubled": "Wert mindestens verdoppelt",
    "msDoubleDigit": "Zweistelliges Jahreswachstum",
    "asmGrowth": "Verlauf",
    "asmGrowthVal": "konstant jährlich verzinst",
    "asmCash": "Zahlungsfluss",
    "asmCashVal": "ohne Ein- und Auszahlungen im Zeitraum",
    "asmFigures": "Basis",
    "asmFiguresVal": "vor Steuern und Gebühren",
    "decRoi": "Gesamtrendite stattdessen im ROI-Rechner prüfen",
    "decRule72": "Verdopplung über 72er-Regel schätzen",
    "decCompound": "Mit diesem CAGR weiter in die Zukunft rechnen",
    "q1": "Wohin wächst der Betrag bei gleicher Rate?",
    "q2": "Ist der Wert vor oder nach Inflation?",
    "gainWord": "Steigerung",
    "declineWord": "Abnahme",
    "explanationTpl": "Ein Anstieg von {start} auf {end} über {period} entspricht einem CAGR von {cagr} für dieselbe {dir}.",
    "vizTitle": "Geglätteter Wachstumspfad",
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
    "start": {
      "label": "Anfangswert"
    },
    "end": {
      "label": "Endwert"
    },
    "years": {
      "label": "Zeitraum",
      "unit": "Jahre"
    }
  }
};
