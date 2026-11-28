import type { LocalizedToolPack } from '@lib/i18n/types';

export const pack: LocalizedToolPack = {
  "locale": "ja",
  "slug": "savings-goal-calculator",
  "name": "目標貯蓄・毎月積立額シミュレーター",
  "seoTitle": "目標貯蓄額シミュレーター｜毎月の必要積立額を計算",
  "description": "目標金額・現在の貯蓄・想定年利・期間から毎月いくら積み立てればよいかを瞬時に計算。入力データはデバイス内に保持されます。",
  "tagline": "目標金額と期限から毎月の必要積立額を逆算します。",
  "methodology": {
    "name": "目標額逆算モデル",
    "detail": "初期資産と毎月の積立金の複利成長を合わせて、期限に目標額へ到達する月額を求めます。"
  },
  "knowledge": {
    "primaryConcepts": [
      "目標貯蓄計画"
    ],
    "realWorldUseCases": [
      "住宅ローンの頭金を期日までに貯める",
      "結婚資金・マイカー購入資金を計画する",
      "毎月の自動積立額を設定する",
      "現在のペースで目標に届くか検証する"
    ],
    "commonMistakes": [
      "短期目標なのに高リスクな高利回りを前提にする",
      "手元の既存貯蓄を入力し忘れる"
    ]
  },
  "faqs": [
    {
      "id": "sg-faq-1",
      "question": "目標額に達するには毎月いくら貯める必要がありますか？",
      "answer": "目標金額・現在の貯蓄・想定利回り・年数から、期限通りに到達するための毎月の定額積立額を算出します。"
    },
    {
      "id": "sg-faq-2",
      "question": "運用利回りは必要積立額にどう影響しますか？",
      "answer": "利回りがプラスだと運用益が目標の一部を補ってくれます。ただし高い利回りを想定するほど価格変動リスクも伴います。"
    },
    {
      "id": "sg-faq-3",
      "question": "どの程度の想定利回りを入力すべきですか？",
      "answer": "1〜2年の短期目標は低い預金金利相当、長期目標でも保守的な分散投資の期待利回りを設定するのが安全です。"
    },
    {
      "id": "sg-faq-4",
      "question": "スタートが遅れるとどうなりますか？",
      "answer": "複利で増える期間が短くなるため、同じ目標額でも毎月の積立負担が急増します。"
    },
    {
      "id": "sg-faq-5",
      "question": "今ある貯蓄額も含めるべきですか？",
      "answer": "はい。初期貯蓄も運用されて目標額に加算されるため、毎月の必要額が軽くなります。"
    },
    {
      "id": "sg-faq-6",
      "question": "目標貯蓄の前に生活防衛資金を用意すべきですか？",
      "answer": "はい。急な出費で積立を取り崩さずに済むよう、まず防衛資金を確保してから目的別貯蓄に進むのが一般的です。"
    },
    {
      "id": "sg-faq-7",
      "question": "インフレ率は考慮されていますか？",
      "answer": "いいえ。数年先の目標はインフレ計算ツールで物価上昇分を上乗せした金額を目標に設定するとより現実的です。"
    },
    {
      "id": "sg-faq-8",
      "question": "入力データがサーバーに保存されることはありますか？",
      "answer": "いいえ、計算はすべてお使いのブラウザ上で完結します。"
    }
  ],
  "guide": {
    "title": "目標貯蓄を達成するための計画と逆算方法",
    "description": "必要積立額の計算式、目標期間と想定利回りのバランス、インフレ調整の考え方を具体例を交えて詳しく解説します。"
  },
  "ui": {
    "scenarios": {
      "Home down payment": "住宅頭金",
      "Wedding": "結婚資金",
      "New car": "車購入"
    },
    "engine": {
      "yearOne": "年",
      "yearMany": "年",
      "heroLabel": "毎月の必要積立額",
      "heroNoteTpl": "{months} か月間",
      "cardInvested": "自己積立総額",
      "cardInterest": "運用収益分",
      "cardGoal": "目標金額",
      "errMinMonths": "数か月以上の積立期間を入力してください。",
      "insMet": "現在の貯蓄額だけで目標金額に達しています。",
      "insReturnsTpl": "運用益が目標の {interest} を補うため、自己負担額を抑えられます。",
      "insEarlier": "早く始めるほど利回りの助けが増え、毎月の積立負担が下がります。",
      "msMet": "目標すでに達成",
      "msReturns": "運用益が目標達成に貢献",
      "asmRate": "想定年利",
      "asmHorizon": "積立期間",
      "asmStart": "初期残高",
      "decCompound": "複利での残高推移を詳しく見る",
      "decInflation": "インフレ後の必要目標額を確認",
      "decEmergency": "まず生活防衛資金の目安を計算",
      "q1": "利回りが想定より低い場合はどうなる？",
      "q2": "インフレで目標金額はどのくらい変わる？",
      "expMetTpl": "すでに {current} の貯蓄があるため、目標 {goal} を達成済みです。",
      "explanationTpl": "現在 {current} の貯蓄から想定年利 {rate} で {years} {unit}後に {goal} を達成するには、毎月 {monthly} の積立が必要です。",
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
    "heroLabel": "毎月の必要積立額",
    "heroNoteTpl": "{months} か月間",
    "cardInvested": "自己積立総額",
    "cardInterest": "運用収益分",
    "cardGoal": "目標金額",
    "errMinMonths": "数か月以上の積立期間を入力してください。",
    "insMet": "現在の貯蓄額だけで目標金額に達しています。",
    "insReturnsTpl": "運用益が目標の {interest} を補うため、自己負担額を抑えられます。",
    "insEarlier": "早く始めるほど利回りの助けが増え、毎月の積立負担が下がります。",
    "msMet": "目標すでに達成",
    "msReturns": "運用益が目標達成に貢献",
    "asmRate": "想定年利",
    "asmHorizon": "積立期間",
    "asmStart": "初期残高",
    "decCompound": "複利での残高推移を詳しく見る",
    "decInflation": "インフレ後の必要目標額を確認",
    "decEmergency": "まず生活防衛資金の目安を計算",
    "q1": "利回りが想定より低い場合はどうなる？",
    "q2": "インフレで目標金額はどのくらい変わる？",
    "expMetTpl": "すでに {current} の貯蓄があるため、目標 {goal} を達成済みです。",
    "explanationTpl": "現在 {current} の貯蓄から想定年利 {rate} で {years} {unit}後に {goal} を達成するには、毎月 {monthly} の積立が必要です。",
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
    "goal": {
      "label": "目標金額"
    },
    "current": {
      "label": "現在の貯蓄額"
    },
    "rate": {
      "label": "想定年利"
    },
    "years": {
      "label": "目標までの年数",
      "unit": "年"
    }
  }
};
