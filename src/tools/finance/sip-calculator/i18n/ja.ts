import type { LocalizedToolPack } from '@lib/i18n/types';

export const pack: LocalizedToolPack = {
  "locale": "ja",
  "slug": "sip-calculator",
  "name": "積立投資（SIP）シミュレーター",
  "seoTitle": "積立投資（SIP）シミュレーター｜毎月積立の将来額",
  "description": "毎月の積立額・想定年利・期間から将来の評価額と運用益をリアルタイム試算。ドルコスト平均法の効果も確認でき、入力値は送信されません。",
  "tagline": "毎月定額の積立投資（SIP）による将来評価額と運用益を試算。",
  "methodology": {
    "name": "定期積立の将来価値計算",
    "detail": "毎月の積立金が残りの期間ずっと複利で成長する年金終価モデルで試算します。"
  },
  "knowledge": {
    "primaryConcepts": [
      "積立投資計画（SIP）"
    ],
    "realWorldUseCases": [
      "投信やETFへの毎月積立額を計画する",
      "毎月の給料天引き投資が将来いくらになるか試算する",
      "目標金額に対する月々の積立額を比較する",
      "若いうちから少額で始める優位性を確認する"
    ],
    "commonMistakes": [
      "高めの想定利回りを確定収益と思い込む",
      "インフレによる将来価値の目減りを忘れる"
    ]
  },
  "faqs": [
    {
      "id": "sip-faq-1",
      "question": "SIP（積立投資計画）とは何ですか？",
      "answer": "毎月一定額を自動的に投資信託やファンドへ投資する手法です。購入タイミングを見極める必要がなく、長期の資産形成に適しています。"
    },
    {
      "id": "sip-faq-2",
      "question": "満期時の評価額はどう計算されますか？",
      "answer": "毎月の積立金が残存月数分だけ毎月複利で増える算式 FV = P · ((1 + i)^n − 1) / i を使って計算します。"
    },
    {
      "id": "sip-faq-3",
      "question": "想定年利はどの程度に設定すべきですか？",
      "answer": "投資対象に応じて控えめに設定します。長期の株式インデックスでも年5〜8%程度で保守的に見込むのが一般的です。"
    },
    {
      "id": "sip-faq-4",
      "question": "一括投資と積立投資（SIP）はどちらが良いですか？",
      "answer": "すでに手元にまとまった資金がある場合は一括投資が市場滞在時間が長くなります。毎月の収入から積み立てる場合は高値掴みを避けやすいSIPが適しています。"
    },
    {
      "id": "sip-faq-5",
      "question": "ドルコスト平均法（DCA）とは？",
      "answer": "毎月定額を買うことで、価格が安い時に多くの口数を、高い時に少ない口数を購入し平均取得単価を抑える効果です。"
    },
    {
      "id": "sip-faq-6",
      "question": "なぜ早く始めるほど有利なのですか？",
      "answer": "複利は運用の後半ほど大きく膨らむため、最初の積立が全期間にわたって増え続けることが最大の効果を生みます。"
    },
    {
      "id": "sip-faq-7",
      "question": "税金やインフレは反映されていますか？",
      "answer": "いいえ、税引前・インフレ未調整の金額です。実質価値を確かめるにはインフレ計算ツールを併用してください。"
    },
    {
      "id": "sip-faq-8",
      "question": "毎月の増額と期間の延長ではどちらが効果的ですか？",
      "answer": "総投資額が同じなら、運用期間を延ばす方が圧倒的に最終評価額が大きくなります。"
    },
    {
      "id": "sip-faq-9",
      "question": "期間を2倍にすると資産が2倍以上に増える理由は？",
      "answer": "増えた運用益にもさらに複利がつくため、後半になるほど伸び幅が急拡大するからです。"
    },
    {
      "id": "sip-faq-10",
      "question": "最初の数年は運用益が少なく見えるのはなぜ？",
      "answer": "開始直後は元本が小さく運用期間も短いため、ほとんどが自分の積立元本です。時間を味方につけると後半で急増します。"
    },
    {
      "id": "sip-faq-11",
      "question": "実際の口座残高と結果が異なる理由は？",
      "answer": "実際の基準価額は日々変動し、信託報酬や売買時期のずれも生じるため、一定の想定年利とは差が出ます。"
    },
    {
      "id": "sip-faq-12",
      "question": "入力データが外部に送信されることはありますか？",
      "answer": "いいえ、計算はすべてお使いのブラウザ上で完結します。"
    }
  ],
  "guide": {
    "title": "毎月積立投資（SIP）の仕組みと増え方",
    "description": "ドルコスト平均法のメリット、積立計算式、運用年数が収益に与える影響を具体的なシミュレーション例とともに解説します。"
  },
  "ui": {
    "scenarios": {
      "First salary SIP": "新卒積立",
      "Wealth building": "資産形成",
      "Short-term goal": "5年目標"
    },
    "engine": {
      "yearOne": "年",
      "yearMany": "年",
      "heroLabel": "最終評価額",
      "heroNoteTpl": "{years} {unit}後",
      "cardGain": "運用益",
      "cardInvested": "投資元本合計",
      "cardMonths": "積立回数",
      "brkLump": "初期投資",
      "brkMonthly": "毎月積立",
      "brkGrowth": "運用益",
      "insShareTpl": "最終評価額のうち {pct}% が運用益で、残りがご自身の積立元本です。",
      "insAvg": "定額積立は価格が安い時に多くの口数を購入できるため、購入単価を平準化する効果があります。",
      "msDoubled": "評価額が元本の2倍に到達",
      "msExceeds": "運用益が元本を上回る",
      "asmRate": "想定年利",
      "asmTiming": "積立タイミング",
      "asmTimingVal": "毎月末",
      "asmCompounding": "複利周期",
      "asmMonthly": "毎月",
      "asmLump": "初期一括",
      "none": "なし",
      "decInflation": "インフレ調整後の実質価値を見る",
      "decCompound": "一括投資のみの場合と比較する",
      "decGoal": "目標額から毎月の必要積立額を逆算",
      "q1": "目標額に届く毎月の積立額はいくら？",
      "q2": "5年早く始めるとどれだけ差が出る？",
      "expLumpTpl": "（初期一括 {lump} を含む）",
      "explanationTpl": "毎月 {monthly}{lumpClause}を想定年利 {rate} で積み立てると、{years} {unit}後の評価額は {final}（元本 {invested}、運用益 {gain}）になります。",
      "vizTitle": "積立評価額の推移",
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
    "heroLabel": "最終評価額",
    "heroNoteTpl": "{years} {unit}後",
    "cardGain": "運用益",
    "cardInvested": "投資元本合計",
    "cardMonths": "積立回数",
    "brkLump": "初期投資",
    "brkMonthly": "毎月積立",
    "brkGrowth": "運用益",
    "insShareTpl": "最終評価額のうち {pct}% が運用益で、残りがご自身の積立元本です。",
    "insAvg": "定額積立は価格が安い時に多くの口数を購入できるため、購入単価を平準化する効果があります。",
    "msDoubled": "評価額が元本の2倍に到達",
    "msExceeds": "運用益が元本を上回る",
    "asmRate": "想定年利",
    "asmTiming": "積立タイミング",
    "asmTimingVal": "毎月末",
    "asmCompounding": "複利周期",
    "asmMonthly": "毎月",
    "asmLump": "初期一括",
    "none": "なし",
    "decInflation": "インフレ調整後の実質価値を見る",
    "decCompound": "一括投資のみの場合と比較する",
    "decGoal": "目標額から毎月の必要積立額を逆算",
    "q1": "目標額に届く毎月の積立額はいくら？",
    "q2": "5年早く始めるとどれだけ差が出る？",
    "expLumpTpl": "（初期一括 {lump} を含む）",
    "explanationTpl": "毎月 {monthly}{lumpClause}を想定年利 {rate} で積み立てると、{years} {unit}後の評価額は {final}（元本 {invested}、運用益 {gain}）になります。",
    "vizTitle": "積立評価額の推移",
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
    "monthly": {
      "label": "毎月の積立額"
    },
    "rate": {
      "label": "想定年利（リターン）"
    },
    "years": {
      "label": "積立期間",
      "unit": "年"
    },
    "initial": {
      "label": "初期一括投資額",
      "help": "任意。開始時に一度だけ投入する資金があれば入力します。"
    }
  }
};
