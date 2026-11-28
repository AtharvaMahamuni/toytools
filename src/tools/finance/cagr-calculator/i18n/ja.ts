import type { LocalizedToolPack } from '@lib/i18n/types';

export const pack: LocalizedToolPack = {
  "locale": "ja",
  "slug": "cagr-calculator",
  "name": "CAGR（年平均成長率）計算ツール",
  "seoTitle": "CAGR（年平均成長率）計算ツール｜複利ベース年率算出",
  "description": "開始値・終了値・年数からCAGR（年平均成長率）、累計成長率、成長倍率、資産倍増年数をブラウザ上で即座に計算します。",
  "tagline": "年平均成長率（CAGR）、成長倍率、倍増年数を算出。",
  "methodology": {
    "name": "幾何平均による年率算出",
    "detail": "開始値から終了値への変化を複利で均等化した年率 (End/Start)^(1/t) − 1 を求めます。"
  },
  "knowledge": {
    "primaryConcepts": [
      "CAGR（年平均成長率）"
    ],
    "realWorldUseCases": [
      "ファンドや株式の数年間の成績を年率比較する",
      "事業売上の複数年にわたる成長率を報告する",
      "保有期間の異なる投資を比較する",
      "過去の成長率から将来予測の妥当性を確かめる"
    ],
    "commonMistakes": [
      "累計成長率を単純に年数で割って年率とみなす",
      "途中の追加入金・出金があるデータにCAGRを使う"
    ]
  },
  "faqs": [
    {
      "id": "cagr-faq-1",
      "question": "CAGR（年平均成長率）とは何ですか？",
      "answer": "開始値から終了値までの期間を、毎年同じ複利の率で成長したとみなした場合の年間成長率です。10年間で10,000が25,000になる場合、約9.6%となります。"
    },
    {
      "id": "cagr-faq-2",
      "question": "CAGRの計算式は？",
      "answer": "(終了値 ÷ 開始値)^(1 ÷ 年数) − 1 で求めます。"
    },
    {
      "id": "cagr-faq-3",
      "question": "累計成長率を年数で割った値より小さい理由は？",
      "answer": "毎年増えた元本に対して複利が効くため、より小さな年率でも長期的には同じ規模の成長に到達するからです。"
    },
    {
      "id": "cagr-faq-4",
      "question": "CAGRとROIの違いは？",
      "answer": "ROIは期間通算の増加率、CAGRはその期間を通じた1年あたりの複利成長率です。"
    },
    {
      "id": "cagr-faq-5",
      "question": "CAGRはマイナスにもなりますか？",
      "answer": "はい、終了値が開始値を下回った場合はマイナスの成長率になります。"
    },
    {
      "id": "cagr-faq-6",
      "question": "CAGRの限界や注意点は？",
      "answer": "途中の価格下落や激しい変動が隠れる点と、期間中に追加投資や引き出しがあると正しく測れない点です。"
    },
    {
      "id": "cagr-faq-7",
      "question": "2倍になる期間（倍増年数）との関係は？",
      "answer": "厳密には ln(2) ÷ ln(1 + CAGR) で求められ、簡易暗算の「72の法則（72 ÷ %）」とよく一致します。"
    },
    {
      "id": "cagr-faq-8",
      "question": "複数年の成長を年率に直すには？",
      "answer": "成長倍率を（1 ÷ 年数）乗して1を引きます。5年で2倍になる成長は年20%ではなく年14.87%です。"
    },
    {
      "id": "cagr-faq-9",
      "question": "算術平均リターンとCAGRの違いは？",
      "answer": "単年の騰落率を単純平均すると変動幅によって実態より高く見えます（+100%の翌年-50%は平均+25%でも実際はCAGR 0%）。"
    },
    {
      "id": "cagr-faq-10",
      "question": "同じCAGRでもリスクが異なることはありますか？",
      "answer": "はい。安定して上昇した場合と、途中で大きく暴落してから元に戻った場合では、CAGRが同じでもリスクは大きく異なります。"
    },
    {
      "id": "cagr-faq-11",
      "question": "累計成長率に比べてCAGRが小さく見える理由は？",
      "answer": "たとえば20年で400%増（5倍）は複利では年8.4%に相当し、単純割り算の20%より低く計算されるのが正常です。"
    },
    {
      "id": "cagr-faq-12",
      "question": "数値データが送信されることはありますか？",
      "answer": "いいえ、すべてお使いのブラウザ上でローカル計算されます。"
    }
  ],
  "guide": {
    "title": "CAGR（年平均成長率）の意味と計算式",
    "description": "単純平均やROIとの違い、CAGRの計算式、途中の追加投資がある場合の注意点を具体例とともにわかりやすく解説します。"
  },
  "ui": {
    "scenarios": {
      "Index fund decade": "インデックス10年",
      "Fast-growing revenue": "急成長売上",
      "Slow saver": "低成長"
    },
    "engine": {
      "heroLabel": "CAGR（年平均成長率）",
      "heroNoteTpl": "{period}の年平均",
      "cardGrowth": "累計成長率",
      "cardDecline": "累計減少率",
      "cardMultiple": "成長倍率",
      "cardDoubles": "2倍になる期間",
      "insPosTpl": "{period}で合計 {total} の成長は、複利ベースでは年率 {cagr} に相当します（単純割り算より低くなります）。",
      "insNegTpl": "この期間中、年平均 {cagr} のペースで減少しました。",
      "insShort": "1年未満の期間を年率換算すると短期変動が誇張されるため注意が必要です。",
      "insSmooth": "CAGRは一定の成長率を仮定した平滑値であり、実際の途中経過の価格変動は反映されません。",
      "msDoubled": "期間中に2倍以上に到達",
      "msDoubleDigit": "年率2桁（10%以上）成長",
      "asmGrowth": "成長モデル",
      "asmGrowthVal": "年1回複利の定率成長",
      "asmCash": "資金移動",
      "asmCashVal": "期中の追加投資・引出なし",
      "asmFigures": "対象数値",
      "asmFiguresVal": "税金・手数料控除前",
      "decRoi": "通算リターンをROI計算ツールで確認",
      "decRule72": "72の法則で倍増年数をチェック",
      "decCompound": "この成長率で将来の複利運用を試算",
      "q1": "このCAGRが続くと10年後にいくらになる？",
      "q2": "インフレを考慮する前と後ではどう違う？",
      "gainWord": "増加",
      "declineWord": "減少",
      "explanationTpl": "{start} から {period} かけて {end} に変化した場合、その{dir}をもたらす一定の年平均成長率（CAGR）は {cagr} です。",
      "vizTitle": "CAGRが示す成長曲線",
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
    "heroLabel": "CAGR（年平均成長率）",
    "heroNoteTpl": "{period}の年平均",
    "cardGrowth": "累計成長率",
    "cardDecline": "累計減少率",
    "cardMultiple": "成長倍率",
    "cardDoubles": "2倍になる期間",
    "insPosTpl": "{period}で合計 {total} の成長は、複利ベースでは年率 {cagr} に相当します（単純割り算より低くなります）。",
    "insNegTpl": "この期間中、年平均 {cagr} のペースで減少しました。",
    "insShort": "1年未満の期間を年率換算すると短期変動が誇張されるため注意が必要です。",
    "insSmooth": "CAGRは一定の成長率を仮定した平滑値であり、実際の途中経過の価格変動は反映されません。",
    "msDoubled": "期間中に2倍以上に到達",
    "msDoubleDigit": "年率2桁（10%以上）成長",
    "asmGrowth": "成長モデル",
    "asmGrowthVal": "年1回複利の定率成長",
    "asmCash": "資金移動",
    "asmCashVal": "期中の追加投資・引出なし",
    "asmFigures": "対象数値",
    "asmFiguresVal": "税金・手数料控除前",
    "decRoi": "通算リターンをROI計算ツールで確認",
    "decRule72": "72の法則で倍増年数をチェック",
    "decCompound": "この成長率で将来の複利運用を試算",
    "q1": "このCAGRが続くと10年後にいくらになる？",
    "q2": "インフレを考慮する前と後ではどう違う？",
    "gainWord": "増加",
    "declineWord": "減少",
    "explanationTpl": "{start} から {period} かけて {end} に変化した場合、その{dir}をもたらす一定の年平均成長率（CAGR）は {cagr} です。",
    "vizTitle": "CAGRが示す成長曲線",
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
    "start": {
      "label": "開始時の金額"
    },
    "end": {
      "label": "終了時の金額"
    },
    "years": {
      "label": "期間",
      "unit": "年"
    }
  }
};
