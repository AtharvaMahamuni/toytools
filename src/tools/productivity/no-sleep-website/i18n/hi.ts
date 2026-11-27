import type { LocalizedToolPack } from '@lib/i18n/types';

export const pack: LocalizedToolPack = {
  locale: 'hi',
  slug: 'no-sleep-website',
  name: 'स्क्रीन चालू रखें (No Sleep Website)',
  seoTitle: 'No Sleep Website – स्क्रीन स्लीप रोकने का मुफ्त ऑनलाइन टूल',
  description:
    'बिना किसी ऐप के फोन, टैबलेट या लैपटॉप की स्क्रीन को ऑटो-स्लीप से बचाने वाली मुफ्त वेबसाइट। ब्राउज़र के Screen Wake Lock से स्क्रीन चालू रहती है।',
  tagline: 'बिना कोई ऐप इंस्टॉल किए सीधे ब्राउज़र से अपनी स्क्रीन को चालू रखें।',
  citation: {
    problem:
      'बिना सॉफ्टवेयर डाले या सिस्टम सेटिंग बदले फोन, टैबलेट या लैपटॉप की स्क्रीन को अपने-आप बंद होने से रोकने के लिए इस पेज का उपयोग करें।',
    nonGoal: 'पावर बटन या बैटरी खत्म होने पर शटडाउन को रोकना, या बैकग्राउंड में छिपकर चलते रहना।',
  },
  knowledge: {
    primaryConcepts: ['स्क्रीन स्लीप रोकें', 'no sleep website', 'wake lock'],
    realWorldUseCases: [
      'रसोई में रेसिपी देखते समय फोन की स्क्रीन चालू रखना',
      'प्रेज़ेंटेशन, डेमो या मीटिंग के दौरान लैपटॉप को लॉक होने से बचाना',
      'लॉग, डैशबोर्ड या लाइव स्टेटस बिना माउस हिलाए सामने देखना',
      'लंबे लेख या डॉक्यूमेंटेशन बिना स्क्रीन बुझे पढ़ना',
    ],
    commonMistakes: [
      'यह मान लेना कि टैब बदलने या ब्राउज़र मिनिमाइज़ करने के बाद भी स्क्रीन लॉक बना रहेगा',
      'यह समझना कि ब्राउज़र पावर बटन या बैटरी सेवर के नियम बदल सकता है',
    ],
  },
  faqs: [
    {
      id: 'nsw-faq-1',
      question: 'No Sleep Website (स्क्रीन स्लीप रोकने वाली वेबसाइट) क्या है?',
      answer:
        'यह एक वेब पेज है जो W3C के Screen Wake Lock API के ज़रिए ऑपरेटिंग सिस्टम से स्क्रीन को डिम या बंद न करने का अनुरोध करता है। जब तक यह टैब खुला और सामने दिखता रहता है, आपका फोन, टैबलेट या लैपटॉप स्क्रीन स्लीप में नहीं जाता।',
    },
    {
      id: 'nsw-faq-2',
      question: 'इस ऑनलाइन स्क्रीन अवेक टूल का उपयोग कैसे करें?',
      answer:
        'बस इस पेज को खोलें और "स्क्रीन चालू रखें" बटन दबाएँ। ब्राउज़र तुरंत स्क्रीन वेक लॉक मांगता है और जब तक टैब स्क्रीन पर खुला रहेगा, डिस्प्ले अपने-आप बंद नहीं होगा। काम पूरा होने पर "रोकें" दबाएँ।',
    },
    {
      id: 'nsw-faq-3',
      question: 'क्या यह Android फोन और टैबलेट पर काम करता है?',
      answer:
        'हाँ। जब तक टैब खुला और सक्रिय रहता है, यह Android पर Google Chrome, Microsoft Edge, Brave और Samsung Internet जैसे Chromium ब्राउज़रों में सीधे काम करता है।',
    },
    {
      id: 'nsw-faq-4',
      question: 'क्या यह iPhone और iPad पर काम करता है?',
      answer:
        'हाँ। Apple ने iOS 16.4 और iPadOS 16.4 से Safari और iOS WebKit ब्राउज़रों में Screen Wake Lock API का समर्थन जोड़ा है। बस पेज को स्क्रीन पर खुला रखें।',
    },
    {
      id: 'nsw-faq-5',
      question: 'क्या मैं अपने Windows लैपटॉप या Mac की स्क्रीन को स्लीप होने से रोक सकता हूँ?',
      answer:
        'हाँ। Chrome, Edge, Safari और Firefox 126+ इसे Windows व macOS दोनों पर सपोर्ट करते हैं। ध्यान रखें कि लैपटॉप का ढक्कन बंद करने या पावर बटन दबाने से सिस्टम स्लीप में चला जाएगा।',
    },
    {
      id: 'nsw-faq-6',
      question: 'क्या टैब बदलने या ब्राउज़र मिनिमाइज़ करने पर भी यह चालू रहेगा?',
      answer:
        'नहीं। बैटरी बचाने के लिए, टैब छिपते ही हर ब्राउज़र वेक लॉक को अपने-आप हटा देता है। जैसे ही आप इस टैब पर वापस आते हैं, टूल लॉक फिर से लेने की कोशिश करता है।',
    },
    {
      id: 'nsw-faq-7',
      question: 'क्या स्क्रीन लगातार चालू रखने से बैटरी ज़्यादा खर्च होती है?',
      answer:
        'हाँ। फोन और लैपटॉप में स्क्रीन सबसे ज़्यादा बैटरी लेती है। विकल्पों में आप 15% बैटरी से नीचे आने पर अपने-आप रुकने वाला बैटरी गार्ड चालू कर सकते हैं।',
    },
    {
      id: 'nsw-faq-8',
      question: 'क्या यह टूल मुफ्त और प्राइवेट है?',
      answer:
        'हाँ। यह पूरी तरह मुफ्त है, इसमें अकाउंट की ज़रूरत नहीं और यह 100% आपके ब्राउज़र में लोकल चलता है। कोई डेटा सर्वर पर नहीं भेजा जाता।',
    },
    {
      id: 'nsw-faq-9',
      question: 'क्या इसके लिए कोई ऐप या एक्सटेंशन इंस्टॉल करना होगा?',
      answer:
        'नहीं। यह आधुनिक ब्राउज़रों में पहले से मौजूद मानक API का उपयोग करता है, इसलिए सिर्फ वेबसाइट खोलकर उपयोग शुरू किया जा सकता है।',
    },
    {
      id: 'nsw-faq-10',
      question: 'फिर भी कभी-कभी मेरी स्क्रीन क्यों बंद हो जाती है?',
      answer:
        'सिस्टम का बैटरी सेवर मोड, कड़े पावर नियम, लैपटॉप की लिड बंद करना या पावर बटन हमेशा ब्राउज़र से ऊपर होते हैं। यदि सिस्टम लॉक हटाता है, तो पेज तुरंत वास्तविक स्थिति दिखा देता है।',
    },
  ],
  guide: {
    title: 'ब्राउज़र से स्क्रीन स्लीप कैसे रोकें',
    description: 'Wake Lock API कैसे काम करता है, डिवाइस सपोर्ट, बैटरी खपत और OS की सीमाएँ समझें।',
    readMinutes: 6,
  },
  ui: {
    panelScreen: 'स्क्रीन',
    panelSession: 'सत्र',
    heroReady: 'तैयार',
    heroPlanned: 'तय समय',
    heroRemaining: 'शेष समय',
    heroAwakeFor: 'चालू समय',
    heroTotalAwake: 'कुल चालू समय',
    btnStart: 'स्क्रीन चालू रखें',
    btnStop: 'रोकें',
    lockReady: 'शुरू करने के लिए तैयार।',
    lockHeld: 'आपके डिवाइस पर स्क्रीन लॉक रोक सक्रिय है।',
    lockLost: 'लॉक छूट गया। फिर जुड़ रहे हैं...',
    lockComplete: 'सत्र पूरा हुआ।',
    lockUnsupported: 'अपने डिवाइस की डिस्प्ले टाइमआउट सेटिंग बदलें।',
    metaStarted: 'शुरू',
    metaEnds: 'समाप्त',
    btnAmbient: 'एम्बिएंट मोड',
    unsupTitle: 'यह ब्राउज़र Screen Wake Lock सपोर्ट नहीं करता।',
    keepAwakeFor: 'कितनी देर चालू रखें',
    sessionLengthAria: 'सत्र की अवधि',
    durUntilStop: 'जब तक न रोकें',
    dur15m: '15 मिनट',
    dur30m: '30 मिनट',
    dur1h: '1 घंटा',
    dur2h: '2 घंटे',
    customLabel: 'कस्टम',
    customPlaceholder: 'मिनट',
    alertsSummary: 'अलर्ट और डिस्प्ले',
    optChime: 'सत्र पूरा होने पर ध्वनि बजाएँ',
    optNotify: 'पूरा होने पर ब्राउज़र सूचना भेजें',
    optGuard: '15% से कम बैटरी पर अपने-आप रोकें',
    clockFormatAria: 'घड़ी का प्रारूप',
    clockLabel: 'घड़ी',
    ambSleeping: 'स्लीप अनुमत',
    ambAwake: 'स्क्रीन चालू',
    ambReconnecting: 'पुनः जुड़ रहा है',
    ambCompleted: 'पूर्ण',
    ambEndsAt: 'समाप्ति समय',
    ambBtnStart: 'स्क्रीन चालू करें',
    ambBtnDim: 'मद्धम करें',
    ambBtnExit: 'बाहर जाएँ',
    unitMinShort: 'मि',
    unitHourShort: 'घं',
    todayPrefix: 'आज: ',
    todayOne: 'सत्र',
    todayMany: 'सत्र',
    todayAwakeSuffix: 'सक्रिय',
    titleActive: 'चालू · No Sleep Website',
    annLockLost: 'स्क्रीन वेक लॉक हट गया। फिर से जोड़ रहे हैं।',
    annAcquireFail: 'स्क्रीन वेक लॉक नहीं मिल पाया।',
    annStartedTimed: '{dur} के लिए स्क्रीन चालू रखी गई।',
    annStartedOpen: 'स्क्रीन चालू रखी गई।',
    annCompleted: '{dur} का सत्र पूरा हुआ।',
    notifyTitle: 'स्क्रीन लॉक मुक्त हुआ',
    notifyBody: 'आपका {dur} का सत्र पूरा हो गया।',
    batteryLabel: 'बैटरी ',
    batteryCharging: ' · चार्ज हो रहा है',
    batteryGuardStop: 'बैटरी बचाने के लिए {pct}% पर रोका गया।',
    hintIos: 'iOS पर: Settings > Display & Brightness > Auto-Lock > Never.',
    hintAndroid: 'Android पर: Settings > Display > Screen timeout.',
    hintMac: 'macOS पर: System Settings > Lock Screen > Turn display off.',
    hintWin: 'Windows पर: Settings > System > Power & battery > Screen and sleep.',
    hintOther: 'अपने डिवाइस की डिस्प्ले सेटिंग में स्क्रीन टाइमआउट बढ़ाएँ।',
  },
};
