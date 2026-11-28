import type { LocalizedToolPack } from '@lib/i18n/types';

export const pack: LocalizedToolPack = {
  "locale": "ja",
  "slug": "loan-calculator",
  "name": "ローン返済シミュレーター",
  "seoTitle": "ローン返済シミュレーター｜住宅ローン・毎月返済額",
  "description": "借入額・年利・返済年数・繰上返済から毎月の返済額と総利息をブラウザ上で試算。データは外部へ送信されません。",
  "tagline": "毎月の返済額、総利息、繰上返済による節約額を試算。",
  "methodology": {
    "name": "元利均等返済方式",
    "detail": "年利を12等分して毎月の返済額を算出。追加返済額はそのまま元本返済に充当します。"
  },
  "knowledge": {
    "primaryConcepts": [
      "ローン計算",
      "毎月返済額"
    ],
    "realWorldUseCases": [
      "契約前に個人ローンの毎月返済額を確認する",
      "同じ物件価格で20年ローンと30年ローンを比較する",
      "毎月の繰上返済で節約できる総利息を算出する",
      "頭金を差し引いた実際の借入元本を把握する"
    ],
    "commonMistakes": [
      "年利の欄に月利2%などをそのまま入力する",
      "返済期間（年）を月数と取り違える",
      "繰上返済が次回引き落とし額の割引になると思い込む"
    ]
  },
  "faqs": [
    {
      "id": "loan-faq-payment",
      "question": "毎月のローン返済額はどう計算されますか？",
      "answer": "年利を12で割った月利を使い、元利均等返済の算式で計算します。100,000を年利12%・5年で借りると毎月2,224.44、総利息は33,466.83になります。"
    },
    {
      "id": "loan-faq-rate-unit",
      "question": "金利欄に「2」と入力した場合の意味は？",
      "answer": "年利2%を意味します（月利2%なら年利24%）。3%未満または36%超の値を入力すると、年利として扱っている旨の注記を表示します。"
    },
    {
      "id": "loan-faq-extra",
      "question": "毎月の繰上返済で利息は減りますか？",
      "answer": "はい。通常の返済に上乗せした分が直接元本の減少に充てられるため、完済期間が短くなり総支払利息が大きく減ります。"
    },
    {
      "id": "loan-faq-home",
      "question": "住宅ローンも同じ計算式ですか？",
      "answer": "同じです。物件価格・頭金・年数を入力すれば、固定金利の住宅ローン返済額と総利息を正確に計算できます。"
    },
    {
      "id": "loan-faq-left-out",
      "question": "諸費用・保証料・火災保険料は含まれますか？",
      "answer": "含まれません。純粋な借入元本と固定金利に基づく返済計算のみを行います。"
    },
    {
      "id": "loan-faq-high-rate",
      "question": "極端に高い金利だと完済できないと表示されるのはなぜ？",
      "answer": "1か月の利息が返済額を上回ると元本がまったく減らないためです。金利を下げるか繰上返済を加えると解消します。"
    },
    {
      "id": "loan-faq-privacy",
      "question": "入力した借入額や金利は送信されますか？",
      "answer": "いいえ、すべての試算はブラウザ内で完結し、外部に保存・送信されることはありません。"
    }
  ],
  "guide": {
    "title": "固定金利ローン返済額の仕組みと計算式",
    "description": "元利均等返済の計算方法、頭金の効果、毎月の繰上返済による総利息の削減効果を実例とともに詳しく解説します。"
  },
  "ui": {
    "scenarios": {
      "Personal loan": "カード/個人ローン",
      "Home loan, 15 years": "住宅ローン 15年",
      "Home loan, 20 years": "住宅ローン 20年",
      "Home loan, 30 years": "住宅ローン 30年"
    },
    "engine": {
      "yearOne": "年",
      "yearMany": "年",
      "monthOne": "か月",
      "monthMany": "か月",
      "none": "なし",
      "yearlyRateToken": "は年利率です",
      "noteLowRateTpl": "{rate}は年利率です（月利{rate}なら年率{annualized}になり、この計算とは異なります）。",
      "noteHighRateTpl": "{rate}は年利率です（月利約{monthly}に相当）。返済額は年利率で算出しています。",
      "errShortTerm": "最短期間は1か月です（1か月は0.08、6か月は0.5と入力してください）。",
      "errNoBorrow": "頭金が価格以上のため、借入額が0以下になります。",
      "errUnpaid": "この年利と期間では元本が減りません。金利を下げるか繰上返済を追加してください。",
      "underTpl": "{amt}未満",
      "heroLabel": "毎月の返済額",
      "cardBorrowed": "借入元本",
      "cardInterest": "総支払利息",
      "cardTotal": "総返済額",
      "cardPayoff": "完済期間",
      "cardSaved": "利息節約額",
      "insExtraTpl": "毎月 {extra} の繰上返済により {payoff} で完済し、利息を {saved} 節約できます。",
      "insZero": "金利0%のため、元本を月数で均等割りした返済額になります。",
      "insShareTpl": "総返済額のうち {pct}% が利息です。",
      "insTiny": "利息は非常に小さく最小通貨単位未満です。",
      "msPaid": "完済到達",
      "msShortened": "繰上返済で期間短縮",
      "asmRate": "年利率",
      "asmSchedule": "返済間隔",
      "asmScheduleVal": "毎月（年利÷12で計算）。",
      "asmDown": "頭金",
      "asmExtra": "繰上返済",
      "asmExtraTpl": "毎月 {extra} を元本へ充当",
      "brkPrincipal": "元本",
      "brkInterest": "利息",
      "decSip": "同額を毎月積立投資した場合を試算",
      "decCompound": "一括投資の複利運用と比較",
      "q1": "繰上返済をすると何年早く終わる？",
      "q2": "返済額を投資に回したらいくらになる？",
      "expShortTpl": " 毎月 {extra} を追加すると {payoff} で完済します。",
      "explanationTpl": "{principal} を年利 {rate}・期間 {term} で借りると、毎月の返済は {payment}、総利息は {interest} です。{shortened}",
      "errEnterTpl": "{label}を入力してください。",
      "errNotNumberTpl": "{label}は数値で入力してください。",
      "errNotNegativeTpl": "{Label}は0以上の数値を入力してください。",
      "errMinTpl": "{Label}は{min}以上にしてください。",
      "errMaxTpl": "{Label}は{max}以下にしてください。",
      "errPositiveTpl": "{label}は0より大きい値にしてください。",
      "yearSingular": "年",
      "yearsPlural": "年",
      "neverLabel": "到達不可",
      "vLabels": {
        "principal": "元本",
        "rate": "年利率",
        "years": "年数",
        "contribution": "毎月の積立額",
        "price": "借入金額または価格",
        "down": "頭金",
        "extra": "毎月の繰上返済額",
        "monthly": "毎月の投資額",
        "initial": "初期一括投資額",
        "cost": "投資元本",
        "final": "最終評価額",
        "amount": "現在の金額",
        "goal": "目標金額",
        "current": "現在の貯蓄額",
        "start": "開始時の金額",
        "end": "終了時の金額"
      }
    },
    "yearOne": "年",
    "yearMany": "年",
    "monthOne": "か月",
    "monthMany": "か月",
    "none": "なし",
    "yearlyRateToken": "は年利率です",
    "noteLowRateTpl": "{rate}は年利率です（月利{rate}なら年率{annualized}になり、この計算とは異なります）。",
    "noteHighRateTpl": "{rate}は年利率です（月利約{monthly}に相当）。返済額は年利率で算出しています。",
    "errShortTerm": "最短期間は1か月です（1か月は0.08、6か月は0.5と入力してください）。",
    "errNoBorrow": "頭金が価格以上のため、借入額が0以下になります。",
    "errUnpaid": "この年利と期間では元本が減りません。金利を下げるか繰上返済を追加してください。",
    "underTpl": "{amt}未満",
    "heroLabel": "毎月の返済額",
    "cardBorrowed": "借入元本",
    "cardInterest": "総支払利息",
    "cardTotal": "総返済額",
    "cardPayoff": "完済期間",
    "cardSaved": "利息節約額",
    "insExtraTpl": "毎月 {extra} の繰上返済により {payoff} で完済し、利息を {saved} 節約できます。",
    "insZero": "金利0%のため、元本を月数で均等割りした返済額になります。",
    "insShareTpl": "総返済額のうち {pct}% が利息です。",
    "insTiny": "利息は非常に小さく最小通貨単位未満です。",
    "msPaid": "完済到達",
    "msShortened": "繰上返済で期間短縮",
    "asmRate": "年利率",
    "asmSchedule": "返済間隔",
    "asmScheduleVal": "毎月（年利÷12で計算）。",
    "asmDown": "頭金",
    "asmExtra": "繰上返済",
    "asmExtraTpl": "毎月 {extra} を元本へ充当",
    "brkPrincipal": "元本",
    "brkInterest": "利息",
    "decSip": "同額を毎月積立投資した場合を試算",
    "decCompound": "一括投資の複利運用と比較",
    "q1": "繰上返済をすると何年早く終わる？",
    "q2": "返済額を投資に回したらいくらになる？",
    "expShortTpl": " 毎月 {extra} を追加すると {payoff} で完済します。",
    "explanationTpl": "{principal} を年利 {rate}・期間 {term} で借りると、毎月の返済は {payment}、総利息は {interest} です。{shortened}",
    "errEnterTpl": "{label}を入力してください。",
    "errNotNumberTpl": "{label}は数値で入力してください。",
    "errNotNegativeTpl": "{Label}は0以上の数値を入力してください。",
    "errMinTpl": "{Label}は{min}以上にしてください。",
    "errMaxTpl": "{Label}は{max}以下にしてください。",
    "errPositiveTpl": "{label}は0より大きい値にしてください。",
    "yearSingular": "年",
    "yearsPlural": "年",
    "neverLabel": "到達不可",
    "vLabels": {
      "principal": "元本",
      "rate": "年利率",
      "years": "年数",
      "contribution": "毎月の積立額",
      "price": "借入金額または価格",
      "down": "頭金",
      "extra": "毎月の繰上返済額",
      "monthly": "毎月の投資額",
      "initial": "初期一括投資額",
      "cost": "投資元本",
      "final": "最終評価額",
      "amount": "現在の金額",
      "goal": "目標金額",
      "current": "現在の貯蓄額",
      "start": "開始時の金額",
      "end": "終了時の金額"
    }
  },
  "fields": {
    "price": {
      "label": "物件価格または借入額"
    },
    "down": {
      "label": "頭金",
      "help": "任意。借入元本から差し引かれます。"
    },
    "rate": {
      "label": "年利率（金利）"
    },
    "years": {
      "label": "返済期間",
      "unit": "年",
      "help": "1年未満は小数で指定（例: 0.5 = 6か月）。"
    },
    "extra": {
      "label": "毎月の繰上返済額",
      "help": "任意。毎月返済に上乗せして元本を減らします。"
    }
  }
};
