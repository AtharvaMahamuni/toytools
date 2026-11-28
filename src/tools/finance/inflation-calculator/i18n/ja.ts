import type { LocalizedToolPack } from '@lib/i18n/types';

export const pack: LocalizedToolPack = {
  "locale": "ja",
  "slug": "inflation-calculator",
  "name": "インフレ計算シミュレーター",
  "seoTitle": "インフレ計算ツール｜将来の実質価値と購買力",
  "description": "インフレ率から将来のお金の実質購買力・目減り額・将来の物価水準をブラウザ内で即座に試算。データは送信されません。",
  "tagline": "インフレによる将来価値の目減りと物価上昇を試算します。",
  "methodology": {
    "name": "物価上昇の複利計算",
    "detail": "インフレも金利と同様に複利で積み重なり、貨幣の購買力を指数関数的に引き下げます。"
  },
  "knowledge": {
    "primaryConcepts": [
      "インフレ率"
    ],
    "realWorldUseCases": [
      "老後資金が将来の物価でいくらに相当するか試算する",
      "物価上昇に追いつくための必要昇給率を確認する",
      "将来の目標金額をインフレ織り込みで再設定する",
      "投資の想定リターンから実質利回りを把握する"
    ],
    "commonMistakes": [
      "名目金額（額面）と実質価値（購買力）を混同する",
      "年2〜3%の緩やかなインフレの長期累積を過小評価する"
    ]
  },
  "faqs": [
    {
      "id": "inf-faq-1",
      "question": "インフレ後のお金の価値はいくらになりますか？",
      "answer": "現在の金額 ÷ (1 + インフレ率)^年数 で算出します。年3%のインフレが25年続くと、100,000は現在の約47,761分の購買力になります。"
    },
    {
      "id": "inf-faq-2",
      "question": "実質価値と名目価値の違いは何ですか？",
      "answer": "名目価値は額面上の金額そのもので、実質価値は物価上昇を調整した「今のお金に換算した購買力」です。"
    },
    {
      "id": "inf-faq-3",
      "question": "現金のまま持つとインフレでどうなりますか？",
      "answer": "預金金利1%・インフレ率3%なら、毎年約2%ずつ実質的に買える量が減っていきます。"
    },
    {
      "id": "inf-faq-4",
      "question": "将来の商品価格を計算する方法は？",
      "answer": "現在の価格 × (1 + インフレ率)^年数 で求めます。年3%・25年で100,000のものは約209,378になります。"
    },
    {
      "id": "inf-faq-5",
      "question": "インフレ率は何%に設定すればよいですか？",
      "answer": "先進国の目標値は年2%前後が多いですが、保守的な計画には2〜4%で複数試算するのが安心です。"
    },
    {
      "id": "inf-faq-6",
      "question": "インフレに対抗するにはどうすればよいですか？",
      "answer": "税引後の運用利回りがインフレ率を上回る資産（分散された株式・インデックス等）を活用することが一般的です。"
    },
    {
      "id": "inf-faq-7",
      "question": "年数%のインフレでも長期で大きな差が出る理由は？",
      "answer": "物価上昇も前年水準を土台に複利で積み上がるため、25年後の実質価値を半分以下に押し下げるからです。"
    }
  ],
  "guide": {
    "title": "インフレが資産価値に与える影響",
    "description": "年率3%・5%・7%での購買力変化、実質利回りと名目利回りの違い、インフレ対策の考え方を具体例とともに解説します。"
  },
  "ui": {
    "engine": {
      "yearOne": "年",
      "yearMany": "年",
      "heroLabel": "将来の実質購買力",
      "heroNoteTpl": "{years} {unit}後の現在価値換算",
      "cardLost": "目減りする価値",
      "cardLostPct": "購買力の低下率",
      "cardCost": "同じ商品の将来価格",
      "insPowerTpl": "{years} {unit}間のインフレにより、この金額の購買力は約 {pct} 失われます。",
      "insImpact": "低いインフレ率でも長期では大きな目減りになるため、物価上昇を上回る運用が重要になります。",
      "msHalved": "購買力が半分以下に低下",
      "asmRate": "インフレ率",
      "asmPeriod": "期間",
      "decCompound": "インフレを上回る複利利回りを試算",
      "decRule72": "72の法則で物価倍増年数を計算",
      "q1": "インフレに負けないためには年利何%必要？",
      "q2": "目減り分を補うにはいくら貯めるべき？",
      "explanationTpl": "インフレ率 {rate} が続くと、現在の {amount} の {years} {unit}後の実質購買力は {real} 相当になり、同じ品物の価格は {futureCost} に上がります。",
      "errEnterTpl": "{label}を入力してください。",
      "errNotNumberTpl": "{label}は数値で入力してください。",
      "errNotNegativeTpl": "{Label}は0以上にしてください。",
      "errMinTpl": "{Label}は{min}以上にしてください。",
      "errMaxTpl": "{Label}は{max}以下にしてください。",
      "errPositiveTpl": "{label}は0より大きい値にしてください。",
      "yearSingular": "年",
      "yearsPlural": "年",
      "neverLabel": "到達不可",
      "vLabels": {
        "amount": "金額",
        "rate": "年率",
        "years": "年数",
        "goal": "目標金額",
        "current": "現在の貯蓄額",
        "start": "開始金額",
        "end": "終了金額"
      }
    },
    "yearOne": "年",
    "yearMany": "年",
    "heroLabel": "将来の実質購買力",
    "heroNoteTpl": "{years} {unit}後の現在価値換算",
    "cardLost": "目減りする価値",
    "cardLostPct": "購買力の低下率",
    "cardCost": "同じ商品の将来価格",
    "insPowerTpl": "{years} {unit}間のインフレにより、この金額の購買力は約 {pct} 失われます。",
    "insImpact": "低いインフレ率でも長期では大きな目減りになるため、物価上昇を上回る運用が重要になります。",
    "msHalved": "購買力が半分以下に低下",
    "asmRate": "インフレ率",
    "asmPeriod": "期間",
    "decCompound": "インフレを上回る複利利回りを試算",
    "decRule72": "72の法則で物価倍増年数を計算",
    "q1": "インフレに負けないためには年利何%必要？",
    "q2": "目減り分を補うにはいくら貯めるべき？",
    "explanationTpl": "インフレ率 {rate} が続くと、現在の {amount} の {years} {unit}後の実質購買力は {real} 相当になり、同じ品物の価格は {futureCost} に上がります。",
    "errEnterTpl": "{label}を入力してください。",
    "errNotNumberTpl": "{label}は数値で入力してください。",
    "errNotNegativeTpl": "{Label}は0以上にしてください。",
    "errMinTpl": "{Label}は{min}以上にしてください。",
    "errMaxTpl": "{Label}は{max}以下にしてください。",
    "errPositiveTpl": "{label}は0より大きい値にしてください。",
    "yearSingular": "年",
    "yearsPlural": "年",
    "neverLabel": "到達不可",
    "vLabels": {
      "amount": "金額",
      "rate": "年率",
      "years": "年数",
      "goal": "目標金額",
      "current": "現在の貯蓄額",
      "start": "開始金額",
      "end": "終了金額"
    }
  },
  "fields": {
    "amount": {
      "label": "現在の金額"
    },
    "rate": {
      "label": "年間インフレ率"
    },
    "years": {
      "label": "年数",
      "unit": "年"
    }
  }
};
