import type { LocalizedToolPack } from '@lib/i18n/types';

export const pack: LocalizedToolPack = {
  locale: 'ja',
  slug: 'no-sleep-website',
  name: '画面スリープ防止 (No Sleep Website)',
  seoTitle: '画面スリープ防止サイト – PC・スマホ画面を常時点灯',
  description:
    'アプリ不要でスマホ・PCの画面消灯やスリープを防止する無料サイト。ブラウザのScreen Wake Lock APIで表示中ずっと画面を点灯維持します。',
  tagline: 'アプリをインストールせず、ブラウザだけで画面のスリープを防ぎます。',
  citation: {
    problem:
      'アプリの導入やOS設定の変更なしで、スマホ・タブレット・ノートPCの画面消灯を防ぎたいときに使えます。',
    nonGoal: '電源ボタンの操作やバッテリー残量低下によるシャットダウンを無効化したり、バックグラウンドで常駐したりすること。',
  },
  knowledge: {
    primaryConcepts: ['画面スリープ防止', 'no sleep website', 'wake lock'],
    realWorldUseCases: [
      '料理中にレシピを表示したまま画面消灯を防ぐ',
      'プレゼンやオンライン会議中にPC画面のロックを防ぐ',
      'ログや監視ダッシュボードを操作なしで常時表示する',
      '長文ドキュメントや学習ノートを中断なく読み進める',
    ],
    commonMistakes: [
      '別タブへ切り替えたりブラウザを最小化してもロックが維持されると期待すること',
      '電源ボタンや省電力モードの強制制限まで上書きできると思い込むこと',
    ],
  },
  faqs: [
    {
      id: 'nsw-faq-1',
      question: '画面スリープ防止サイト（No Sleep Website）とは何ですか？',
      answer:
        'W3C標準のScreen Wake Lock APIを使い、OSに画面を消灯・減光しないよう要求するWebページです。このタブを前面で開いている間、スマートフォンやタブレット、PCの画面を点灯させたまま保てます。',
    },
    {
      id: 'nsw-faq-2',
      question: 'この画面スリープ防止ツールの使い方は？',
      answer:
        'ページを開いて「画面を常時点灯」ボタンを押すだけです。ブラウザが即座にWake Lockを取得し、タブが前面に表示されている間は画面が自動で消えません。終了するときは「停止」を押してください。',
    },
    {
      id: 'nsw-faq-3',
      question: 'Androidスマホやタブレットで使えますか？',
      answer:
        'はい。AndroidのGoogle Chrome、Microsoft Edge、Brave、Samsung InternetなどChromium系ブラウザで標準サポートされており、タブを開いている間そのまま動作します。',
    },
    {
      id: 'nsw-faq-4',
      question: 'iPhoneやiPadのSafariでも使えますか？',
      answer:
        'はい。AppleはiOS 16.4およびiPadOS 16.4以降のSafariでScreen Wake Lock APIに標準対応しています。タブを前面に開いた状態で利用してください。',
    },
    {
      id: 'nsw-faq-5',
      question: 'WindowsやMacのノートPCでも画面スリープを防げますか？',
      answer:
        'はい。Chrome、Edge、Safariに加えFirefox 126以降で動作します。ただしノートPCのフタを閉じたり電源ボタンを押したりするとOS側のスリープが優先されます。',
    },
    {
      id: 'nsw-faq-6',
      question: '別のタブに切り替えたり最小化しても有効ですか？',
      answer:
        'いいえ。バッテリー保護のため、タブが非表示になった瞬間にブラウザがWake Lockを自動解放します。このタブに戻ると自動的に再取得を試みます。',
    },
    {
      id: 'nsw-faq-7',
      question: '画面を点けたままにするとバッテリーを多く消費しますか？',
      answer:
        'はい。ディスプレイのバックライトは最も電力を消費する部品です。詳細設定のバッテリー保護を有効にすると、残量15%未満で自動的にロックを解除できます。',
    },
    {
      id: 'nsw-faq-8',
      question: '無料かつプライバシーは安全ですか？',
      answer:
        'はい。完全無料・登録不要で、処理はすべてブラウザ内で完結します。入力や利用状態が外部サーバーへ送信されることはありません。',
    },
    {
      id: 'nsw-faq-9',
      question: 'アプリや拡張機能のインストールは必要ですか？',
      answer:
        '不要です。現代のブラウザに標準搭載されているAPIのみで動作するため、ページを開くだけで利用できます。',
    },
    {
      id: 'nsw-faq-10',
      question: 'それでも画面が消えてしまうことがあるのはなぜですか？',
      answer:
        'OSの低電力モード、省電力ポリシー、電源ボタン、ノートPCを閉じた操作などはブラウザより優先されます。本ツールはOSからロックが解除された場合、偽りの表示をせず実際の状態に更新します。',
    },
  ],
  guide: {
    title: 'ブラウザで画面スリープを防止する方法',
    description: 'Wake Lock APIの仕組み、PC・iPhone・Androidの対応状況、バッテリーへの影響とOS上の制限を解説。',
    readMinutes: 6,
  },
  ui: {
    panelScreen: '画面',
    panelSession: 'セッション',
    heroReady: '待機中',
    heroPlanned: '予定時間',
    heroRemaining: '残り時間',
    heroAwakeFor: '点灯経過時間',
    heroTotalAwake: '合計点灯時間',
    btnStart: '画面を常時点灯',
    btnStop: '停止',
    lockReady: '開始すると画面のスリープを防ぎます。',
    lockHeld: 'このデバイスの画面スリープを防止中です。',
    lockLost: 'ロックが解除されました。再取得中...',
    lockComplete: 'セッションが完了しました。',
    lockUnsupported: 'デバイスの画面自動ロック設定をご変更ください。',
    metaStarted: '開始',
    metaEnds: '終了',
    btnAmbient: 'アンビエント表示',
    unsupTitle: 'このブラウザはScreen Wake Lockに未対応です。',
    keepAwakeFor: '点灯を維持する時間',
    sessionLengthAria: 'セッション時間',
    durUntilStop: '停止するまで',
    dur15m: '15分',
    dur30m: '30分',
    dur1h: '1時間',
    dur2h: '2時間',
    customLabel: 'カスタム',
    customPlaceholder: '分',
    alertsSummary: 'アラートと表示設定',
    optChime: 'セッション終了時に音を鳴らす',
    optNotify: '終了時にブラウザ通知を送る',
    optGuard: 'バッテリー残量15%未満で解除する',
    clockFormatAria: '時刻表示形式',
    clockLabel: '時計',
    ambSleeping: 'スリープ許可',
    ambAwake: '常時点灯中',
    ambReconnecting: '再接続中',
    ambCompleted: '完了',
    ambEndsAt: '終了予定',
    ambBtnStart: '点灯を開始',
    ambBtnDim: '画面を暗くする',
    ambBtnExit: '戻る',
    unitMinShort: '分',
    unitHourShort: '時間',
    todayPrefix: '今日: ',
    todayOne: '回',
    todayMany: '回',
    todayAwakeSuffix: '点灯',
    titleActive: '常時点灯中 · No Sleep Website',
    annLockLost: '画面ロック維持が解除されました。再接続しています。',
    annAcquireFail: 'Screen Wake Lockを取得できませんでした。',
    annStartedTimed: '{dur}の画面常時点灯を開始しました。',
    annStartedOpen: '画面の常時点灯を開始しました。',
    annCompleted: '{dur}のセッションが完了しました。',
    notifyTitle: '画面常時点灯が終了しました',
    notifyBody: '{dur}のセッションが完了しました。',
    batteryLabel: 'バッテリー ',
    batteryCharging: '・充電中',
    batteryGuardStop: '充電保護のため残量{pct}%で停止しました。',
    hintIos: 'iOS: 設定 > 画面表示と明るさ > 自動ロック > なし',
    hintAndroid: 'Android: 設定 > ディスプレイ > 画面消灯時間',
    hintMac: 'macOS: システム設定 > ロック画面 > ディスプレイをオフにするまでの時間',
    hintWin: 'Windows: 設定 > システム > 電源とバッテリー > 画面とスリープ',
    hintOther: 'お使いの端末のディスプレイ設定から自動消灯時間を変更してください。',
  },
};
