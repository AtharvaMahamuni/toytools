import type { LocalizedToolPack } from '@lib/i18n/types';

export const pack: LocalizedToolPack = {
  locale: 'ja',
  slug: 'css-minifier',
  name: 'CSS 圧縮・整形ツール',
  seoTitle: 'CSS 圧縮・整形ツール (Minify / Beautify) 無料',
  description:
    'CSSのコメント・空白を削除して本番用に圧縮（Minify）したり、圧縮済みCSSを読みやすく展開・整形（Beautify）します。削減バイト数も表示。',
  tagline: 'CSSを本番用に軽量圧縮したり、1行CSSを見やすく整形したりできます。',
  citation: {
    problem: 'CSSファイルをサーバー送信せずブラウザ内で軽量化したり、圧縮CSSを読みやすく戻したいときに使えます。',
    nonGoal: 'ベンダープレフィックス付与、トランスパイル、重複ルールの自動統合。',
  },
  knowledge: {
    primaryConcepts: ['CSS圧縮', 'CSS整形'],
    realWorldUseCases: [
      '手書きCSSを本番サイトへ組み込む前にファイルサイズを縮小する',
      'サードパーティの圧縮済みCSSを展開してスタイルの原因を調査する',
      'コメントやインデントで何バイト消費しているかを確認する',
    ],
    commonMistakes: [
      'トークン整形だけで未使用CSSルールの削除まで行えると期待すること',
      'まだ手直しする元のCSSファイルを整形前バックアップなしで上書きすること',
    ],
  },
  faqs: [
    {
      id: 'css-min-1',
      question: 'CSSの圧縮（Minify）では何が削除されますか？',
      answer:
        '文字列リテラルや `url()` の中身を除くコメント（`/* ... */`）と不要な空白・改行が削除されます。セレクタ・プロパティ名・CSS変数・`calc()` 式は書き換えられません。',
    },
    {
      id: 'css-min-2',
      question: '安全のため削除されないものは何ですか？',
      answer:
        '未使用ルールの削除、重複ルールの結合、カラーコード短縮は行いません。HTMLとの照合が必要なためブラウザ単体での推測変更は行わない安全設計です。',
    },
    {
      id: 'css-min-3',
      question: '整形（Beautify）モードは何をしますか？',
      answer:
        '圧縮された1行のCSSに対し、2スペースの字下げとセミコロン・波括弧ごとの改行を加えて再び読みやすく編集できる形に展開します。',
    },
    {
      id: 'css-min-4',
      question: '入力したCSSは外部サーバーに送信されますか？',
      answer:
        'いいえ。字句解析・圧縮・整形はすべてブラウザ内のタブ上だけで完結します。',
    },
    {
      id: 'css-min-5',
      question: '圧縮するとページの見た目が変わることはありますか？',
      answer:
        '通常のCSSではトークン間の空白は無視されるため見た目は変わりません。特殊なセレクタ空白依存ハックを使っている場合のみ念のため比較してください。',
    },
    {
      id: 'css-min-6',
      question: '@media クエリやネスト構文も扱えますか？',
      answer:
        'はい。トークン単位で波括弧の開閉を正しく追跡するため、メディアクエリやネスト構造も崩さずに圧縮・整形できます。',
    },
    {
      id: 'css-min-7',
      question: '削減できたバイト数を表示するのはなぜですか？',
      answer:
        'gzip後の実質メリットを見極めるためです。小さいファイルでは数バイト差ですが、コメントの多い大きなスタイルシートでは数キロバイト単位で軽くなります。',
    },
    {
      id: 'css-min-8',
      question: 'CSSを圧縮しない方がよい場面はありますか？',
      answer:
        'これから手で編集を続ける段階や、Vite・Webpackなどビルド工程で既に自動圧縮されている場合は開発用ソースを圧縮しないでください。',
    },
  ],
  guide: {
    title: 'CSS 圧縮・整形ガイド: 軽量化と可読性の両立',
    description: 'CSS MinifyとBeautifyの仕組み、calc()や文字列を壊さない安全設計と使い分けを解説。',
    readMinutes: 4,
  },
  ui: {
    inputLabel: 'CSS入力',
    placeholder: 'ここにCSSを貼り付けてください',
    emptyOutput: '左側にCSSを貼り付けると圧縮または整形します。',
    validLabel: 'CSS処理完了',
    invalidLabel: 'CSSエラー',
    loadError: 'CSSプロセッサを読み込めませんでした。',
    modeBeautify: '整形（Beautify）',
    modeMinify: '圧縮（Minify）',
    modeAriaLabel: 'モード',
    toolNote: '圧縮を実行すると削減できたバイト数がステータス欄に表示されます。',
    insight:
      '圧縮モードではコメントと余分な空白を削除して通信量を抑え、整形モードでは1行CSSを2スペース字下げへ展開します。',
    technical: [
      { term: '圧縮', detail: 'コメント削除と文字列・url()以外の空白短縮' },
      { term: '整形', detail: '文字列・url()を保持したまま2スペース字下げ' },
      { term: '安全性', detail: 'セレクタ書き換えや calc() 改変は一切なし' },
      { term: 'プライバシー', detail: '完全ブラウザ内処理。送信ゼロ' },
    ],
    engine: {
      savedBytesTpl: '{saved} バイト削減 ({before} → {after})。',
      errCss: 'CSSの処理に失敗しました。',
    },
  },
};
