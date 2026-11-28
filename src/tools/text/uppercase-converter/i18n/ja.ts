import type { LocalizedToolPack } from '@lib/i18n/types';

export const pack: LocalizedToolPack = {
  "locale": "ja",
  "slug": "uppercase-converter",
  "name": "大文字変換ツール",
  "seoTitle": "英語テキスト大文字変換ツール｜一括UPPERCASE変換",
  "description": "貼り付けた英字テキストを一瞬ですべて大文字（UPPERCASE）に変換してコピー。ブラウザ内で動作し入力内容は送信されません。",
  "tagline": "英字テキストを一括でUPPERCASE（大文字）に変換。",
  "knowledge": {
    "primaryConcepts": [
      "大文字変換"
    ],
    "realWorldUseCases": [
      "見出しやラベルをすべて大文字に揃える",
      "コード用の定数名 MAX_SIZE などを作成する",
      "大小混在の略語を統一する",
      "短い注意書きやボタン表記を強調する"
    ],
    "commonMistakes": [
      "長文の本文すべてを大文字にして読みにくくする",
      "CSSの見た目変更と文字列データ自体の変換を混同する"
    ]
  },
  "faqs": [
    {
      "id": "uc-faq-1",
      "question": "テキストを大文字に変換するには？",
      "answer": "入力欄に貼り付けるだけで、即座にすべて大文字（UPPERCASE）に変換された結果が表示されます。"
    },
    {
      "id": "uc-faq-2",
      "question": "数字や記号も変わりますか？",
      "answer": "いいえ、アルファベットなどの大文字・小文字を持つ文字だけが変換され、数字・記号・日本語はそのまま残ります。"
    },
    {
      "id": "uc-faq-3",
      "question": "画面では大文字なのにコピーすると小文字になる理由は？",
      "answer": "WebサイトのCSS（text-transform: uppercase）で見た目だけ大文字にしているため、元データは小文字のままコピーされるためです。"
    },
    {
      "id": "uc-faq-4",
      "question": "入力テキストは外部サーバーに送信されますか？",
      "answer": "いいえ、すべてブラウザ内のJavaScriptでローカル処理されます。"
    },
    {
      "id": "uc-faq-5",
      "question": "すべて大文字にすべき場面は？",
      "answer": "略語（HTML、API）や定数名（MAX_SIZE）、短い見出し・ラベルに適しています。長文の本文に使うと可読性が落ちます。"
    },
    {
      "id": "uc-faq-6",
      "question": "CSSのtext-transformと実データ変換どちらを使うべき？",
      "answer": "見た目だけならCSS、データベース保存・文字列比較・コード定数など値自体を大文字にする必要がある場合は本ツールで変換してください。"
    },
    {
      "id": "uc-faq-7",
      "question": "どの言語でも同じ変換ルールですか？",
      "answer": "標準Unicode規則で変換します（ドイツ語の「ß」は「SS」に展開されます）。"
    },
    {
      "id": "uc-faq-8",
      "question": "アクセント付き文字の記号が消えないのはなぜ？",
      "answer": "「é」は「É」へ変換されるのが正しいUnicode仕様であり、アクセント記号自体は保持されます。"
    }
  ],
  "guide": {
    "title": "テキストを大文字（UPPERCASE）に変換する方法",
    "description": "CSSのtext-transformとの違い、記号・数字・Unicode文字の扱いと使い分けをわかりやすく解説します。"
  },
  "ui": {
    "placeholder": "ここにテキストを貼り付けまたは入力",
    "outputPlaceholder": "大文字変換の結果がここに表示されます",
    "sampleText": "The quick brown fox jumps over the lazy dog"
  }
};
