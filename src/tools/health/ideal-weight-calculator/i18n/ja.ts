import type { LocalizedToolPack } from '@lib/i18n/types';

export const pack: LocalizedToolPack = {
  "name": "理想・標準体重計算機",
  "seoTitle": "理想体重・標準体重計算機・4つの医学公式とBMI範囲",
  "description": "身長と性別からDevine・Robinson・Miller・Hamwiの4つの理想体重計算式と健康的なBMI標準体重範囲（18.5〜24.9）を同時に比較算出します。",
  "tagline": "4つの医学的標準体重公式と現代の健康BMI範囲を比較。",
  "lead": "身長と性別をもとにDevine・Robinson・Miller・Hamwiの4式の結果とBMI 18.5〜24.9の適正体重範囲をブラウザ上で一括算出します。",
  "craft": {
    "solves": "筋肉量や骨格を考慮しない単一数値の公式だけにとらわれず、現代的なBMI標準体重の「幅」をあわせて確認できるようにしています。"
  },
  "guide": {
    "title": "理想体重の4大計算式とBMI適正範囲の正しい見方",
    "description": "医療現場発のDevine・Robinson・Miller・Hamwi各式の仕組み、数値が異なる理由、単一の数値より「適正幅」を見るべき理由を解説します。"
  },
  "fields": {
    "unit": {
      "label": "単位系",
      "options": {
        "metric": "メートル法 (cm)",
        "imperial": "ヤード・ポンド法 (in)"
      }
    },
    "sex": {
      "label": "性別",
      "options": {
        "male": "男性",
        "female": "女性"
      }
    },
    "height": {
      "label": "身長",
      "help": "メートル法は cm、インペリアルは総インチで入力。"
    }
  },
  "ui": {
    "emptyText": "単位・性別・身長を入力すると4つの計算式の結果と健康範囲が表示されます。",
    "engine": {
      "errEnterTpl": "{label}を入力してください。",
      "errNotNumberTpl": "{label}は数値で入力してください。",
      "errMinTpl": "{label}は {min} 以上である必要があります。",
      "errMaxTpl": "{label}は {max} 以下である必要があります。",
      "fieldUnit": "単位系",
      "fieldSex": "性別",
      "fieldHeight": "身長",
      "errHeightZero": "理想体重を計算するには0より大きい身長を入力してください。",
      "heroLabel": "標準目安体重",
      "heroNote": "4つの公式の平均値",
      "cardHealthy": "健康体重範囲 (BMI)",
      "cardDevine": "Devineの式",
      "cardRobinson": "Robinsonの式",
      "cardMiller": "Millerの式",
      "cardHamwi": "Hamwiの式",
      "bandBelow": "低体重側",
      "bandHealthy": "健康範囲",
      "bandAbove": "過体重側",
      "insSpreadTpl": "4つの公式は {lo}〜{hi} の範囲に分布し、平均値は {avg} です。",
      "insBandTpl": "あなたの身長におけるBMI健康範囲（18.5〜24.9）は {range} です。",
      "insAnchor": "これらの式は身長と性別のみから計算され、骨格や筋肉量・年齢は考慮されません。絶対目標ではなく目安としてご覧ください。",
      "vizTitleTpl": "健康体重範囲における理想体重の位置（{unit}）",
      "vizDescTpl": "4式の算出範囲 {fRange} は、BMI適正範囲 {bRange} の中央付近に位置します。",
      "vizHighlight": "4式の計算範囲",
      "asmUnits": "単位",
      "asmMetric": "メートル法 (cm)",
      "asmImp": "インペリアル (in)",
      "asmFormulas": "使用計算式",
      "asmHealthy": "健康範囲基準",
      "asmHealthyVal": "BMI 18.5 〜 24.9",
      "decBmi": "現在のBMI指数を確認する",
      "decBf": "体脂肪率も推定してみる",
      "decTrack": "体重の推移を記録する",
      "q1": "自分の身長に対して何キロが標準ですか？",
      "q2": "理想体重と健康体重は同じ意味ですか？",
      "q3": "なぜ計算式によって数値が違うのですか？",
      "explanation": "Devine、Robinson、Miller、Hamwiの各理想体重式は数十年前に主に薬剤投与量の基準として考案されたもので、身長5フィート（152.4cm）を起点に線形加算します。個人差を含めた現代の目標設定にはBMI適正範囲（18.5〜24.9）との併用が最適です。"
    }
  },
  "knowledge": {
    "summary": "Devine・Robinson・Miller・Hamwiの4つのクラシック公式とBMI 18.5〜24.9の適正範囲を一覧表示します。",
    "useCases": [
      "自分の身長に対する無理のない適正体重幅を把握する",
      "有名な4種類の標準体重公式の結果を横並びで比較する",
      "体脂肪率や骨格に合わせて現実的な目標体重帯を決める"
    ],
    "mistakes": [
      "計算された1点の数値だけを絶対視してしまうこと",
      "筋肉量や骨格幅の違いを無視して比較すること"
    ]
  },
  "faqs": [
    {
      "id": "ideal-weight-calculator-faq-1",
      "question": "自分の身長では何キロが理想体重ですか？",
      "answer": "唯一の正解はありません。本計算機ではDevine・Robinson・Miller・Hamwiの4式の結果と、現代的なBMI標準体重範囲を並べて確認できます。"
    },
    {
      "id": "ideal-weight-calculator-faq-2",
      "question": "4つの公式で答えが異なるのはなぜですか？",
      "answer": "開発された年代や医療上の目的によって基準値や身長あたりの加算係数が異なるためです。一般にHamwiは高め、Millerは低めに出ます。"
    },
    {
      "id": "ideal-weight-calculator-faq-3",
      "question": "「理想体重」と「健康体重」は同じですか？",
      "answer": "異なります。理想体重公式は主に臨床投薬の参考用の一点値であり、健康体重は体格差を許容するBMI 18.5〜24.9の幅を指します。"
    },
    {
      "id": "ideal-weight-calculator-faq-4",
      "question": "これらの公式は筋肉量や骨格も考慮しますか？",
      "answer": "いいえ、身長と性別のみに基づきます。筋肉質な人は公式値より重くても体脂肪率が十分低い状態が一般的です。"
    },
    {
      "id": "ideal-weight-calculator-faq-5",
      "question": "これをダイエットや体重管理の目標にどう活かせばよいですか？",
      "answer": "1つの数字に固執せず、健康BMI範囲の中で自分の体格に合う無理のない帯域を選び、長期的な推移を見守りましょう。"
    }
  ]
};
