import type { LocalizedToolPack } from '@lib/i18n/types';

export const pack: LocalizedToolPack = {
  locale: 'ja',
  slug: 'json-minifier',
  name: 'JSON 圧縮ツール（Minifier）',
  seoTitle: 'JSON 圧縮ツール (Minifier) – 空白除去で軽量化',
  description:
    'JSONの不要な空白・改行をブラウザ内で即座に除去して1行に圧縮。データ値や大きな数値、19.90などの小数桁もそのまま安全に保持します。',
  tagline: '不要な空白を取り除き、JSONデータを最小サイズに圧縮します。',
  knowledge: {
    primaryConcepts: ['JSON圧縮', 'JSON minifier'],
    realWorldUseCases: [
      '本番APIレスポンスのペイロードサイズを削減する',
      'HTTP配信する静的JSONファイルを軽量化する',
      'ビルド出力内の設定JSONバンドルをコンパクト化する',
    ],
    commonMistakes: [
      'Git管理下の設定ファイルまで圧縮して差分（Diff）を読めなくすること',
      'コメント付きのJSONC/JSON5ファイルをそのまま圧縮しようとすること',
    ],
  },
  faqs: [
    {
      id: 'json-min-faq-1',
      question: 'JSONの圧縮（Minification）とは何をしますか？',
      answer:
        'トークン間の意味を持たない空白・タブ・改行をすべて削除します。データそのものは一切変わりません。`{ "a": 1 }` と `{"a":1}` は構文上同一であり、バイト数だけが減ります。',
    },
    {
      id: 'json-min-faq-2',
      question: '圧縮するとファイルサイズはどれくらい減りますか？',
      answer:
        '元の字下げ量によりますが、深くネストされた整形済みJSONは20〜40%ほど縮むことが一般的です。平坦なオブジェクトでは数%にとどまりますが、gzip圧縮とも相性が良いです。',
    },
    {
      id: 'json-min-faq-3',
      question: '圧縮したJSONも有効なJSONのままですか？',
      answer:
        'はい。RFC 8259仕様上トークン間の空白は無視されるため、どの準拠JSONパーサーでも整形済みと全く同じく読み込めます。',
    },
    {
      id: 'json-min-faq-4',
      question: '圧縮したJSONを元の読みやすい形式に戻せますか？',
      answer:
        'はい、可逆変換です。圧縮後の文字列をJSON整形ツールへ貼り付ければインデントが復元されます。どちらも値の再シリアライズをしないためデータ損失がありません。',
    },
    {
      id: 'json-min-faq-5',
      question: 'どのようなときにJSONを圧縮すべきですか？',
      answer:
        'ネットワーク転送量を抑えたい本番環境（API応答・静的配信・設定バンドル）に適しています。開発時やGit管理ファイルは読みやすさ優先で整形したままが適切です。',
    },
    {
      id: 'json-min-faq-6',
      question: 'Minification（空白除去）とgzip圧縮の違いは何ですか？',
      answer:
        '動作レイヤーが異なります。空白除去はテキスト段階で文字を削り、gzipやBrotliは送信バイト列を圧縮します。併用することで最大の削減効果が得られます。',
    },
    {
      id: 'json-min-faq-7',
      question: '圧縮によってキーの順番や構造が変わることはありますか？',
      answer:
        'ありません。キー順・データ型・構造は完全に元のまま保たれ、空白だけが消えます。',
    },
    {
      id: 'json-min-faq-8',
      question: 'JSONファイル内のコメントも自動削除されますか？',
      answer:
        '標準JSONにはコメント構文が存在しないため、JSONCやJSON5のコメントが含まれると構文エラーとして拒否されます。先にコメントを取り除いてください。',
    },
    {
      id: 'json-min-faq-9',
      question: 'APIサーバーの返却JSONは毎回手動で圧縮すべきですか？',
      answer:
        '通常は手動圧縮は不要です。Node.jsの `JSON.stringify(data)` や大半のHTTPフレームワークは標準でコンパクト形式でシリアライズします。',
    },
    {
      id: 'json-min-faq-10',
      question: '長いIDや「19.90」のような小数の桁は変化しませんか？',
      answer:
        'はい、変化しません。元のトークン文字を1文字ずつコピーし空白のみを削除するため、`9007199254740993` が丸められたり `19.90` の末尾ゼロが消えたりしません。重複キーも警告付きでそのまま残ります。',
    },
  ],
  guide: {
    title: 'JSON圧縮（Minify）の仕組みと使い分け',
    description: 'ペイロード削減効果、gzip/Brotliとの併用効果、開発と本番環境での使い分け、数値を丸めない安全設計を解説します。',
    readMinutes: 4,
  },
  ui: {
    inputLabel: 'JSON入力',
    placeholder: 'ここにJSONを貼り付けてください',
    emptyOutput: '左側にJSONを入力すると圧縮結果が表示されます。',
    validLabel: '有効なJSON',
    invalidLabel: '無効なJSON',
    appliedPrefix: '適用済み: ',
    loadError: 'JSONプロセッサを読み込めませんでした。',
    moreAboutHeading: 'JSON圧縮ツールの仕組み',
    insight:
      '意味のない空白文字をすべて取り除いて最小の有効JSONを生成します。元の数値精度やキー順は一切損なわれません。',
    technical: [
      { term: '動作', detail: '再シリアライズせず元のトークン列を空白なしで連結' },
      { term: '用途', detail: 'APIペイロードや静的JSONの配信サイズ削減' },
      { term: 'データ保持', detail: '大きな整数・1.0・1e5・エスケープ文字を完全維持' },
      { term: '重複キー', detail: 'そのまま維持しつつ警告を表示' },
    ],
    engine: {
      repairBoth: '全角引用符と末尾カンマを修正',
      repairQuotes: 'スマート引用符を修正',
      repairComma: '末尾のカンマを削除',
    },
  },
};
