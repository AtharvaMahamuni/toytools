import type { LocalizedToolPack } from '@lib/i18n/types';

export const pack: LocalizedToolPack = {
  locale: 'ja',
  slug: 'html-entity-encoder-decoder',
  name: 'HTMLエンティティ エンコード・デコード',
  seoTitle: 'HTMLエンティティ 変換ツール（エスケープ・解除）',
  description:
    'HTMLの予約記号（`<`, `>`, `&`, `"`）を文字実体参照へ安全にエスケープし、`&amp;` や `&#38;`・`&#x26;` をブラウザ上で即座に元の文字へ戻します。',
  tagline: 'ブラウザ上でHTMLエンティティを即座にエスケープ・デコード。',
  craft: {
    solves:
      'CMSからコピーした文字列は二重エスケープ（&amp;lt;）や末尾セミコロン欠落が多く、文字が化けたまま残る原因をワンクリック修復で防ぎます。',
  },
  knowledge: {
    primaryConcepts: ['HTMLエンティティ（文字参照）'],
    realWorldUseCases: [
      'Webページ上にHTMLソースコードの例をそのまま表示する',
      'ユーザー入力をHTMLエスケープしてXSS脆弱性を防ぐ',
      'コピーライト記号や改行禁止スペース（`&nbsp;`）を正しく扱う',
    ],
    commonMistakes: [
      'ユーザー投稿テキストのエスケープを忘れてXSSを招く',
      '余白調整のためにCSSではなく `&nbsp;` を乱用する',
    ],
  },
  faqs: [
    {
      id: 'html-ent-faq-1',
      question: 'HTMLエンティティ（文字参照）とは何ですか？',
      answer:
        'HTMLパーサーがタグや制御記号と誤認しないよう文字を `&...;` で表す記法です。たとえば `&lt;` と書くとブラウザ上でタグを開かず `<` の文字として表示されます。',
    },
    {
      id: 'html-ent-faq-2',
      question: 'HTMLで必ずエスケープすべき文字はどれですか？',
      answer:
        '構文上の意味を持つ4つ――`<`（`&lt;`）、`>`（`&gt;`）、`&`（`&amp;`）、属性値内の `"`（`&quot;`）――は必須です（一重引用符には `&#39;`）。UTF-8ページならそれ以外はそのまま書けます。',
    },
    {
      id: 'html-ent-faq-3',
      question: 'ページがUTF-8でもHTMLエンティティは必要ですか？',
      answer:
        '日本語や記号はUTF-8でそのまま書けますが、`<`, `>`, `&` だけはHTMLタグや参照の開始合図になるため常にエスケープが必要です。',
    },
    {
      id: 'html-ent-faq-4',
      question: '&amp; と &#38; の違いは何ですか？',
      answer:
        'どちらも同じ `&` を表します。`&amp;` は名前付き実体参照、`&#38;` は10進数値文字参照、`&#x26;` は16進数値文字参照です。',
    },
    {
      id: 'html-ent-faq-5',
      question: '&nbsp; が通常の半角スペースと違う動きをするのはなぜ？',
      answer:
        '`&nbsp;`（ノーブレークスペース）は前後の語の間で行が折り返されるのを防ぎ、連続スペースが1つに圧縮されるのも防ぎます。レイアウト余白にはCSSを使ってください。',
    },
    {
      id: 'html-ent-faq-6',
      question: 'HTMLエンコードとURLエンコードは何が違いますか？',
      answer:
        'HTMLエンコードはWebページのマークアップ誤解釈を防ぎ（`<` → `&lt;`）、URLエンコードはHTTPアドレス転送向けです（`<` → `%3C`）。',
    },
    {
      id: 'html-ent-faq-7',
      question: '< や > のエスケープを忘れるとどうなりますか？',
      answer:
        '`innerHTML` 等でそのまま出力するとブラウザが `<script>` タグとして解釈・実行してしまい、クロスサイトスクリプティング（XSS）につながります。',
    },
    {
      id: 'html-ent-faq-8',
      question: 'HTMLエンティティ化だけでXSSを完全に防げますか？',
      answer:
        '通常のHTML本文・属性コンテキストでの典型的なXSSは防げますが、`<script>` 内やCSS `style`、`href` 属性URLには各文脈専用の見直し・サニタイズが必要です。',
    },
    {
      id: 'html-ent-faq-9',
      question: '古いHTMLで &apos; が効かないことがあるのはなぜですか？',
      answer:
        '`&apos;` はXML/XHTML仕様から導入されHTML5で標準化されたため、古いHTML4パーサーでは認識されません。互換性重視なら `&#39;` を使います。',
    },
  ],
  guide: {
    title: 'HTMLエンティティとは？エスケープ必須文字とXSS対策',
    description:
      'HTML構文上の5大予約文字、名前付き参照と数値参照の違い、二重エスケープやXSS対策の基礎を解説。',
    readMinutes: 6,
  },
  ui: {
    displayName: 'HTMLエンティティ',
    forwardLabel: 'エスケープ → HTML',
    inverseLabel: 'デコード ← HTML',
    outputLabel: '出力結果',
    placeholder: 'テキストまたは &lt;...&gt; エンティティを貼り付け…',
    outputPlaceholder: '変換結果がここに表示されます…',
    emptyOutput: 'テキストまたはHTMLエンティティを入力してください。',
    insight:
      '`<`, `>`, `&`, `"` をHTMLエンティティにエスケープすることで、入力テキストがタグやスクリプトとして解釈されるのを防ぎます。',
    technical: [
      { term: '必須エスケープ', detail: '&lt; (<), &gt; (>), &amp; (&), &quot; ("), &#39; (\')' },
      { term: '対応記法', detail: '名前付き (&copy;)、10進 (&#169;)、16進 (&#xA9;) に対応' },
      { term: 'プライバシー', detail: 'サーバーへ一切送信せずブラウザ内で完結' },
    ],
    compareLabel: '比較チェック',
    comparePlaceholder: '一致確認する期待値（任意）',
    modeAriaLabel: '変換モード選択',
    inputAriaLabel: '入力欄',
    outputAriaLabel: '変換結果',
    swapLabel: '入出力を入替',
    swapAriaLabel: '入力と出力を入れ替える',
    metaAriaLabel: '変換メタデータ',
    byteAriaLabel: '16進数バイトビューア',
    historyTitle: '変換履歴',
    historyAriaLabel: '最近の入力',
    insightAriaLabel: '技術解説',
    appliedPrefix: '自動修正を適用:',
    checkInputMsg: '入力を確認してください。',
    invalidInputMsg: '有効なHTMLエンティティ入力ではありません。',
    couldNotConvertMsg: '入力を変換できませんでした。',
    detectedPrefix: '自動検出:',
    validPrefix: '有効',
    digestPrefix: '',
    digestSuffix: '',
    detectLabels: {
      Base64: 'Base64',
      Text: 'テキスト',
      'Percent-encoded': 'URLエンコード',
      'HTML entities': 'HTMLエンティティ',
      Markup: 'マークアップ',
    },
    engine: {
      errDecode: 'HTMLエンティティをデコードできませんでした。',
      errEncode: 'HTMLエンティティへエンコードできませんでした。',
      infoNoEntities: 'デコード対象のHTMLエンティティが見つかりませんでした。',
      recDoubleEsc: '二重エスケープ（&amp;lt;）の可能性があります：もう1段階デコードする',
      recMissingSemi: '末尾セミコロン（;）が欠けたエンティティを補完する',
      metaEntities: 'エンティティ数',
      entCountTpl: '{n} 件',
      metaInputLen: '入力文字数',
      metaOutputBytes: '出力バイト',
    },
  },
};
