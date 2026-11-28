import type { LocalizedToolPack } from '@lib/i18n/types';

export const pack: LocalizedToolPack = {
  "locale": "ja",
  "slug": "roi-calculator",
  "name": "ROI（投資利益率）計算ツール",
  "seoTitle": "ROI（投資利益率）計算ツール｜年換算利回り対応",
  "description": "投資額と回収額からROI（投資利益率）と純損益を計算。保有年数を入れれば比較に不可欠な年率換算リターンも算出します。",
  "tagline": "ROI（投資利益率）と年率換算リターンを同時に計算。",
  "methodology": {
    "name": "年率換算付きROI",
    "detail": "総利益を投資元本で割ったROIに加え、保有年数を用いた複利ベースの年率（CAGR）を算出します。"
  },
  "knowledge": {
    "primaryConcepts": [
      "投資利益率（ROI）"
    ],
    "realWorldUseCases": [
      "株式売却後の実質リターンと損益を確認する",
      "不動産売却益とインデックス運用を比較する",
      "事業やサイドプロジェクトの投資回収を判定する",
      "複数年のリターンを年率換算して比較する"
    ],
    "commonMistakes": [
      "保有期間の違う単純ROIをそのまま比較する",
      "手数料・税金・配当金を計算から抜かす"
    ]
  },
  "faqs": [
    {
      "id": "roi-faq-1",
      "question": "ROIはどう計算しますか？",
      "answer": "（回収額 − 投資額）÷ 投資額 × 100 で計算します。10,000投資して15,000になればROIは50%です。"
    },
    {
      "id": "roi-faq-2",
      "question": "良いROIの基準はどのくらいですか？",
      "answer": "投資期間次第です。1年で50%は優秀ですが、15年かけた50%は年率約2.7%にとどまります。必ず年換算利回りで比較してください。"
    },
    {
      "id": "roi-faq-3",
      "question": "ROIと年換算リターンの違いは？",
      "answer": "ROIは期間全体を合算した通算成績、年換算リターンは異なる年数の投資を同じ1年あたり基準で比べられる指標です。"
    },
    {
      "id": "roi-faq-4",
      "question": "損失（マイナス）も計算できますか？",
      "answer": "はい。最終金額が投資額より少ない場合、マイナスのROIと純損失額を表示します。"
    },
    {
      "id": "roi-faq-5",
      "question": "手数料・税金・配当も含めるべきですか？",
      "answer": "正確な実力を見るなら、購入手数料を投資額に含め、受け取った配当や家賃収入を最終金額に加算するのが適切です。"
    },
    {
      "id": "roi-faq-6",
      "question": "ROIとCAGRの違いは何ですか？",
      "answer": "ROIは通算で何%増えたかを示し、CAGRはその期間を複利で何%成長したか（年平均成長率）に直した値です。"
    },
    {
      "id": "roi-faq-7",
      "question": "データはサーバーに保存されますか？",
      "answer": "いいえ、すべての計算はブラウザ内で処理され外部に送信されません。"
    }
  ],
  "guide": {
    "title": "ROI（投資利益率）の計算方法と年率換算の重要性",
    "description": "ROIの計算式、年率換算（CAGR）が比較に不可欠な理由、手数料・税金・配当金の扱いまで具体例付きで詳しく解説します。"
  },
  "ui": {
    "scenarios": {
      "Stock position": "株式投資",
      "Property sale": "不動産売却",
      "Losing trade": "損失ケース"
    },
    "engine": {
      "yearOne": "年",
      "yearMany": "年",
      "yrUnit": "年",
      "notSpecified": "未指定",
      "heroLabel": "ROI（投資利益率）",
      "noteGainTpl": "利益 {amt}",
      "noteLossTpl": "損失 {amt}",
      "cardGain": "純利益",
      "cardLoss": "純損失",
      "cardFinal": "最終金額",
      "cardAnnualized": "年換算リターン",
      "insGainTpl": "投入した {base} ごとに {back} として回収できました。",
      "insLossTpl": "元本に対して {loss}（{pct}）のマイナスとなりました。",
      "insAnnualTpl": "単純ROIは保有期間を無視します。{years} 年間での実質年率は {annual} となり、他投資と公平に比較できます。",
      "insNoPeriod": "保有年数を入力すると年換算リターンを確認できます。",
      "msDoubled": "投資額が2倍以上に成長",
      "msAhead": "元本を上回るプラス圏",
      "asmFigures": "計算対象",
      "asmFiguresVal": "税引前・手数料考慮前",
      "asmCash": "キャッシュフロー",
      "asmCashVal": "期中の追加・引出なしの一括投資",
      "asmPeriod": "保有期間",
      "decCagr": "CAGR計算ツールで年成長率を確認",
      "decCompound": "回収額を次の複利運用で試算",
      "decInflation": "インフレの影響を差し引いて確認",
      "q1": "年平均にすると何%のリターンですか？",
      "q2": "インデックス投資と比べるとどうですか？",
      "returnWord": "プラス",
      "lossWord": "損失",
      "expAnnualTpl": "（{years} {unit}で年率 {annual}）",
      "explanationTpl": "{cost} を投資して {final} となり、ROIは {pct} の{dir}{annualClause}です。",
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
    "yrUnit": "年",
    "notSpecified": "未指定",
    "heroLabel": "ROI（投資利益率）",
    "noteGainTpl": "利益 {amt}",
    "noteLossTpl": "損失 {amt}",
    "cardGain": "純利益",
    "cardLoss": "純損失",
    "cardFinal": "最終金額",
    "cardAnnualized": "年換算リターン",
    "insGainTpl": "投入した {base} ごとに {back} として回収できました。",
    "insLossTpl": "元本に対して {loss}（{pct}）のマイナスとなりました。",
    "insAnnualTpl": "単純ROIは保有期間を無視します。{years} 年間での実質年率は {annual} となり、他投資と公平に比較できます。",
    "insNoPeriod": "保有年数を入力すると年換算リターンを確認できます。",
    "msDoubled": "投資額が2倍以上に成長",
    "msAhead": "元本を上回るプラス圏",
    "asmFigures": "計算対象",
    "asmFiguresVal": "税引前・手数料考慮前",
    "asmCash": "キャッシュフロー",
    "asmCashVal": "期中の追加・引出なしの一括投資",
    "asmPeriod": "保有期間",
    "decCagr": "CAGR計算ツールで年成長率を確認",
    "decCompound": "回収額を次の複利運用で試算",
    "decInflation": "インフレの影響を差し引いて確認",
    "q1": "年平均にすると何%のリターンですか？",
    "q2": "インデックス投資と比べるとどうですか？",
    "returnWord": "プラス",
    "lossWord": "損失",
    "expAnnualTpl": "（{years} {unit}で年率 {annual}）",
    "explanationTpl": "{cost} を投資して {final} となり、ROIは {pct} の{dir}{annualClause}です。",
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
    "cost": {
      "label": "投資額（元本）"
    },
    "final": {
      "label": "最終評価額・売却額",
      "help": "現在の評価額、または売却で受け取った金額。"
    },
    "years": {
      "label": "保有年数",
      "unit": "年",
      "help": "任意。入力すると年平均の比較用利回りを表示します。"
    }
  }
};
