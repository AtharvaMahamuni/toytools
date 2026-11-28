import type { LocalizedToolPack } from '@lib/i18n/types';

export const pack: LocalizedToolPack = {
  "locale": "ja",
  "slug": "title-case-converter",
  "name": "タイトルケース変換ツール",
  "seoTitle": "英語タイトルケース変換（各単語の先頭を大文字）",
  "description": "英語の見出しや記事タイトルの各単語の先頭をワンクリックで大文字化（Title Case）。AP/Chicagoスタイルの前置詞注意点も案内します。",
  "tagline": "各単語の先頭文字を大文字（Title Case）に揃えます。",
  "knowledge": {
    "primaryConcepts": [
      "タイトルケース変換"
    ],
    "realWorldUseCases": [
      "英語記事・ブログタイトルの表記を整える",
      "書籍・楽曲・映画タイトルの書式を統一する",
      "ナビゲーションメニューの見出しを揃える",
      "バラバラな大文字小文字を一発で直す"
    ],
    "commonMistakes": [
      "本文パラグラフ全体にタイトルケースを使ってしまう",
      "of や in などの短い機能語を調整し忘れる"
    ]
  },
  "faqs": [
    {
      "id": "tc-faq-1",
      "question": "タイトルケース（Title Case）とは何ですか？",
      "answer": "「The Quick Brown Fox」のように、各単語の1文字目を大文字にする英語圏の見出し用書式です。"
    },
    {
      "id": "tc-faq-2",
      "question": "どの単語を大文字にするのが基本ですか？",
      "answer": "本ツールは全単語の先頭を機械的に大文字化します。厳密な英語スタイルでは冠詞・短い前置詞・等位接続詞を小文字で残す場合もあります。"
    },
    {
      "id": "tc-faq-3",
      "question": "センテンスケース（Sentence Case）との違いは？",
      "answer": "センテンスケースは文頭と固有名詞だけ大文字にし、タイトルケースはすべての単語の先頭を大文字にします。"
    },
    {
      "id": "tc-faq-4",
      "question": "本文の段落にも使ってよいですか？",
      "answer": "いいえ、長文の本文に使うと読みにくくなるため見出し専用に使うのが一般的です。"
    },
    {
      "id": "tc-faq-5",
      "question": "数字や記号は変わりますか？",
      "answer": "いいえ、単語先頭の英字のみ変換され、数字や記号は変わりません。"
    },
    {
      "id": "tc-faq-6",
      "question": "見出しをTitle Caseに変換する手順は？",
      "answer": "入力欄にペーストするだけで即変換されます。APやChicago形式が必要なら前置詞のみ小文字に手直ししてください。"
    },
    {
      "id": "tc-faq-7",
      "question": "英語タイトルで「of」や「the」は大文字にしますか？",
      "answer": "タイトルの最初または最後以外は小文字で書くのが主要スタイルガイドの基準です。"
    },
    {
      "id": "tc-faq-8",
      "question": "「and」や「in」まで大文字になった理由は？",
      "answer": "全単語を小文字化したあと一括で先頭大文字にする単純規則だからです。該当語数は画面下部に通知されます。"
    },
    {
      "id": "tc-faq-9",
      "question": "「well-known」などハイフン語の扱いは？",
      "answer": "ハイフンで区切られた各パートの先頭が大文字（「Well-Known」）になります。"
    }
  ],
  "guide": {
    "title": "英語タイトルケース（Title Case）のルールと変換方法",
    "description": "全単語大文字化との違い、前置詞・冠詞の小文字ルール、Sentence Caseとの使い分けを詳しく解説します。"
  },
  "ui": {
    "placeholder": "見出しや英文を貼り付けまたは入力",
    "outputPlaceholder": "Title Case 変換結果がここに表示されます",
    "sampleText": "the future of remote work in the city",
    "handoff": {
      "msgTpl": "AP/Chicagoスタイルで通常小文字のままにする短い前置詞・冠詞が {n} 語含まれており大文字化されています。",
      "siblings": {
        "sentence-case-converter": "文頭大文字変換",
        "kebab-case-converter": "ケバブケース変換",
        "trim-text": "前後空白削除",
        "lowercase-converter": "小文字変換"
      }
    }
  }
};
