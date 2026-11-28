import type { LocalizedToolPack } from '@lib/i18n/types';

export const pack: LocalizedToolPack = {
  "locale": "ja",
  "slug": "compound-interest-calculator",
  "name": "複利計算シミュレーター",
  "seoTitle": "複利計算シミュレーター｜積立・利回り試算",
  "description": "元本・年利・複利周期・毎月の積立額から将来の資産額を即座に試算。入力データはブラウザ内で完結し、外部へ送信されません。",
  "tagline": "元本と毎月の積立額から将来の複利成長を試算します。",
  "methodology": {
    "name": "定期複利計算式",
    "detail": "元本の将来価値 FV = P(1 + r/n)^(n × t) に、毎月の積立投資の複利運用分を加算します。"
  },
  "knowledge": {
    "primaryConcepts": [
      "複利計算"
    ],
    "realWorldUseCases": [
      "貯蓄や投資信託の数十年後の資産額を試算する",
      "毎月の継続積立が資産残高に与える影響を把握する",
      "毎月複利と年1回複利の差を比較する",
      "老後資金や教育資金の目標計画を立てる"
    ],
    "commonMistakes": [
      "年利と各期間の利率を取り違える",
      "変動する投資リターンを確定利回りと誤解する"
    ]
  },
  "faqs": [
    {
      "id": "ci-faq-1",
      "question": "複利とは何ですか？",
      "answer": "当初の元本だけでなく、これまでに得た利息にも次の利息がつく仕組みです。運用期間が長くなるほど雪だるま式に増加スピードが上がります。"
    },
    {
      "id": "ci-faq-2",
      "question": "複利はどのように計算しますか？",
      "answer": "元本の将来価値は FV = P(1 + r/n)^(n × t) で求めます（P: 元本、r: 年率、n: 年間複利回数、t: 年数）。たとえば10,000を年利7%・毎月複利で20年運用すると約40,387になります。"
    },
    {
      "id": "ci-faq-3",
      "question": "毎月複利と年1回複利の違いは何ですか？",
      "answer": "複利頻度が高いほど利息が早く元本に組み込まれるため最終金額は増えますが、差は比較的小さく、利率や運用期間の長さの方が大きく影響します。"
    },
    {
      "id": "ci-faq-4",
      "question": "複利とCAGR（年平均成長率）は同じですか？",
      "answer": "逆方向の計算です。複利計算は利率から将来の金額を予測し、CAGRは開始時と終了時の金額から年平均の複利成長率を逆算します。"
    },
    {
      "id": "ci-faq-5",
      "question": "複利運用で元本割れすることはありますか？",
      "answer": "計算式自体はプラス成長を前提としていますが、株式や投資信託などは価格が下落することもあります。控えめな利回りを設定し、試算としてご活用ください。"
    },
    {
      "id": "ci-faq-6",
      "question": "毎月の積立はどれくらい効果がありますか？",
      "answer": "長期では非常に大きな差を生みます。毎月の積立分それぞれが残存期間ずっと複利で増えるため、多くの場合、初期元本より積立分の貢献が上回ります。"
    },
    {
      "id": "ci-faq-7",
      "question": "税金や信託報酬などの手数料は考慮されますか？",
      "answer": "いいえ、入力した利率に基づく税引前・手数料控除前の試算です。コストを考慮したい場合は差し引いた利回りを入力してください。"
    },
    {
      "id": "ci-faq-8",
      "question": "1,000を年利5%で10年間運用するとどうなりますか？",
      "answer": "年1回複利で約1,629、毎月複利で約1,647になります。"
    },
    {
      "id": "ci-faq-9",
      "question": "入力した金額がサーバーに送信されることはありますか？",
      "answer": "いいえ、すべての計算はお使いのブラウザ内で行われ、データはデバイス外に送信されません。"
    }
  ],
  "guide": {
    "title": "複利計算の仕組みと積立の効果",
    "description": "複利の計算式、単利との違い、毎月積立や運用期間が資産形成に与える影響を具体例とともにわかりやすく解説します。"
  },
  "ui": {
    "scenarios": {
      "Retirement": "老後資金",
      "Child education": "教育資金",
      "Dream house": "住宅頭金"
    },
    "engine": {
      "yearOne": "年",
      "yearMany": "年",
      "heroLabel": "最終資産額",
      "heroNoteTpl": "{years} {unit}後",
      "cardInterest": "運用収益（利息）",
      "cardPrincipal": "初期元本",
      "cardContrib": "積立元本合計",
      "brkPrincipal": "初期元本",
      "brkContrib": "毎月の積立",
      "brkInterest": "複利収益",
      "freqs": {
        "1": "年1回",
        "4": "四半期ごと",
        "12": "毎月",
        "365": "毎日"
      },
      "insShareTpl": "最終残高の {pct}% が複利による運用収益で、残りが元本と積立額の合計です。",
      "insContrib": "長期運用では、初期元本よりも毎月の継続積立と時間の経過が最終残高を大きく押し上げます。",
      "msDoubled": "資産が2倍に到達",
      "msExceeds": "収益が総投資元本を上回る",
      "asmRate": "年利率",
      "asmCompounding": "複利頻度",
      "asmContrib": "毎月積立",
      "moUnit": "月",
      "none": "なし",
      "decInflation": "インフレ後の実質購買力を確認",
      "decRule72": "72の法則で倍増年数を概算",
      "decGoal": "目標額から必要積立額を逆算",
      "q1": "目標達成には毎月いくら積み立てるべき？",
      "q2": "インフレを考慮した現在の価値は？",
      "expContribTpl": " に毎月 {amount} を積み立てて",
      "explanationTpl": "元本 {principal}{contribClause}を年率 {rate}（{freq}複利）で運用すると、{years} {unit}後の残高は {final} になります。",
      "vizTitle": "資産残高の推移",
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
    "heroLabel": "最終資産額",
    "heroNoteTpl": "{years} {unit}後",
    "cardInterest": "運用収益（利息）",
    "cardPrincipal": "初期元本",
    "cardContrib": "積立元本合計",
    "brkPrincipal": "初期元本",
    "brkContrib": "毎月の積立",
    "brkInterest": "複利収益",
    "freqs": {
      "1": "年1回",
      "4": "四半期ごと",
      "12": "毎月",
      "365": "毎日"
    },
    "insShareTpl": "最終残高の {pct}% が複利による運用収益で、残りが元本と積立額の合計です。",
    "insContrib": "長期運用では、初期元本よりも毎月の継続積立と時間の経過が最終残高を大きく押し上げます。",
    "msDoubled": "資産が2倍に到達",
    "msExceeds": "収益が総投資元本を上回る",
    "asmRate": "年利率",
    "asmCompounding": "複利頻度",
    "asmContrib": "毎月積立",
    "moUnit": "月",
    "none": "なし",
    "decInflation": "インフレ後の実質購買力を確認",
    "decRule72": "72の法則で倍増年数を概算",
    "decGoal": "目標額から必要積立額を逆算",
    "q1": "目標達成には毎月いくら積み立てるべき？",
    "q2": "インフレを考慮した現在の価値は？",
    "expContribTpl": " に毎月 {amount} を積み立てて",
    "explanationTpl": "元本 {principal}{contribClause}を年率 {rate}（{freq}複利）で運用すると、{years} {unit}後の残高は {final} になります。",
    "vizTitle": "資産残高の推移",
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
    "principal": {
      "label": "元本（初期投資額）"
    },
    "rate": {
      "label": "年利率"
    },
    "frequency": {
      "label": "複利周期",
      "options": {
        "1": "毎年（年1回）",
        "4": "四半期（年4回）",
        "12": "毎月（年12回）",
        "365": "毎日（年365回）"
      }
    },
    "years": {
      "label": "運用期間",
      "unit": "年"
    },
    "contribution": {
      "label": "毎月の積立額",
      "help": "任意。毎月末に追加される前提で計算します。"
    }
  }
};
