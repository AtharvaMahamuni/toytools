import type { LocalizedToolPack } from '@lib/i18n/types';

export const pack: LocalizedToolPack = {
  "name": "ローマ数字変換ツール",
  "seoTitle": "ローマ数字変換・数字とI〜MMMCMXCIXの相互変換",
  "description": "算用数字とローマ数字（I〜MMMCMXCIX）を双方向に変換する無料ツール。時計の文字盤にあるIIIIも読み取り、標準表記を提案します。",
  "tagline": "IからMMMCMXCIXまで数字とローマ数字を相互変換。",
  "lead": "1から3999までの整数とローマ数字をブラウザ内で双方向変換。時計のIIIIや古い記念碑の表記も読み取って現代の標準表記を提案します。",
  "guide": {
    "title": "ローマ数字の正しい読み方・書き方と減算則のルール",
    "description": "6つの減算ペア、時計がIVではなくIIIIを使う理由、3999が上限となる仕組み、映画の年号表記（MCMXCIX）の読み方を解説します。"
  },
  "ui": {
    "displayName": "ローマ数字",
    "forwardLabel": "ローマ数字へ →",
    "inverseLabel": "数字へ ←",
    "outputLabel": "変換結果",
    "placeholder": "整数（1〜3999）またはローマ数字を入力してください。",
    "modeAriaLabel": "変換方向",
    "inputAriaLabel": "数字またはローマ数字",
    "outputAriaLabel": "変換結果（編集可能）",
    "outputPlaceholder": "ここに結果が表示されます。こちら側からも編集できます。",
    "swapLabel": "入れ替え",
    "swapAriaLabel": "入力と出力を入れ替える",
    "insight": [
      "ローマ数字は大きい文字から順に足していきますが、小さい文字が大きい文字の左にある場合だけ引き算します（同じIとVでも IV は4、VI は6）。",
      "標準の減算ペアは IV・IX・XL・XC・CD・CM の6組だけです。99を「IC」と書くような表現はローマ時代には使われませんでした。",
      "プレーンテキストでは3999（MMMCMXCIX）が上限です。4000以上には文字の上へ横線（1000倍の記号）を引く必要があります。"
    ],
    "technical": [
      {
        "term": "対応範囲",
        "detail": "1〜3999（MMMCMXCIX）。0と負数は表記不可"
      },
      {
        "term": "記号一覧",
        "detail": "I=1, V=5, X=10, L=50, C=100, D=500, M=1000"
      },
      {
        "term": "減算ペア",
        "detail": "IV, IX, XL, XC, CD, CM の6組のみ"
      },
      {
        "term": "読み取り",
        "detail": "IIII や VIIII などの旧表記も認識して注意表示"
      },
      {
        "term": "書き出し",
        "detail": "常に正規の標準減算表記を出力"
      }
    ],
    "engine": {
      "detNumber": "算用数字",
      "detRoman": "ローマ数字",
      "errWhole": "半角の正の整数を入力してください。",
      "errZero": "ローマ数字に「0」を表す記号はありません。最小値は I（1）です。",
      "errNegative": "ローマ数字に負号（マイナス）は存在しません。",
      "errOverbarTpl": "{n} には上付き横線が必要なため、テキスト変換は {max}（MMMCMXCIX）が上限です。",
      "errBadRomanTpl": "\"{ch}\" はローマ数字の文字ではありません。使用できるのは I, V, X, L, C, D, M のみです。",
      "warnNonStd": "読み取り可能ですが、標準の現代表記ではありません。",
      "metaValue": "数値",
      "metaLetters": "文字数",
      "metaSubtractive": "減算ペア数",
      "recCanonicalTpl": "{value} の標準表記 {canonical} に書き換える"
    }
  },
  "knowledge": {
    "summary": "1〜3999の数字とローマ数字を相互変換し、時計文字盤のIIIIなど旧式表記を認識して標準形を提案します。",
    "useCases": [
      "映画エンドロールや書籍奥付のローマ数字の年号を読む",
      "章番号・世紀表記・巻数・付録記号を確認する",
      "彫刻や刻印・記念日の日付表記を事前に確かめる",
      "大会回数や歴代名称の番号を素早く把握する"
    ],
    "mistakes": [
      "99を XCIX ではなく IC と書いてしまうこと",
      "時計の IIII をそのまま入力して標準表記だと思い込むこと",
      "通常のテキスト入力で3999を超える数を書こうとすること"
    ]
  },
  "faqs": [
    {
      "id": "roman-faq-1",
      "question": "「MCMXCIX」は何年を意味しますか？",
      "answer": "1999年です。M（1000）＋ CM（900）＋ XC（90）＋ IX（9）と3つの減算ペアごとに分解すると、映画クレジットなどの年号を瞬時に読めます。"
    },
    {
      "id": "roman-faq-2",
      "question": "なぜ腕時計や掛け時計は IV ではなく IIII を使うのですか？",
      "answer": "文字盤の反対側にある VIII との視覚的バランスや、金属活字の鋳造効率など伝統的な理由からです。本ツールはどちらも4として読み取り、標準の IV を案内します。"
    },
    {
      "id": "roman-faq-3",
      "question": "ローマ数字はなぜ3999までしか書けないのですか？",
      "answer": "4000を書くにはMを4回並べるか、1000倍を意味する上線（ウィンクルム）を文字の上に引く必要があり、通常のASCII文字だけでは表せないためです。"
    },
    {
      "id": "roman-faq-4",
      "question": "99を「IC」と書くのは正しいですか？",
      "answer": "いいえ。引けるのは自分の1つ上か2つ上の位だけという規則があるため、99は必ず XCIX（90＋9）と表記します。"
    },
    {
      "id": "roman-faq-5",
      "question": "「標準表記ではありません」と表示されるのはなぜ？",
      "answer": "IIII・VIIII・MDCCCCX といった古い加算式の表記を正しく解釈したうえで、現代の標準減算表記へワンクリック変換できるよう提案しているためです。"
    },
    {
      "id": "roman-faq-6",
      "question": "ローマ数字にゼロ（0）はありますか？",
      "answer": "ありません。古代ローマの記号は数を数えるためのもので0や負の数は存在せず、中世では「無」を意味するラテン語 nulla が使われました。"
    }
  ]
};
