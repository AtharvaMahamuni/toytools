import type { LocalizedToolPack } from '@lib/i18n/types';

export const pack: LocalizedToolPack = {
  "locale": "hi",
  "slug": "title-case-converter",
  "name": "टाइटल केस कन्वर्टर (Title Case)",
  "seoTitle": "टाइटल केस कन्वर्टर - हर शब्द का पहला अक्षर बड़ा करें",
  "description": "शीर्षक और हेडिंग के लिए हर शब्द का पहला अक्षर तुरंत बड़ा (Title Case) करें। बिना अपलोड के सीधे ब्राउज़र में चलता है।",
  "tagline": "हर शब्द का पहला अक्षर तुरंत बड़ा (Title Case) करें।",
  "knowledge": {
    "primaryConcepts": [
      "टाइटल केस (Title Case)"
    ],
    "realWorldUseCases": [
      "ब्लॉग और लेख के शीर्षक फॉर्मेट करना",
      "किताब, गीत या प्रेजेंटेशन टाइटल सजाना",
      "नेविगेशन मेन्यू एक समान करना",
      "मिश्रित केस वाले शीर्षकों को सुधारना"
    ],
    "commonMistakes": [
      "पूरे पैराग्राफ पर टाइटल केस लागू कर देना",
      "अंग्रेजी के छोटे शब्द (a, an, of, in) बिना जाँचे बड़ा छोड़ देना"
    ]
  },
  "faqs": [
    {
      "id": "tc-faq-1",
      "question": "टाइटल केस (Title Case) क्या होता है?",
      "answer": "इसमें हर शब्द का पहला अक्षर बड़ा लिखा जाता है (जैसे \"The Quick Brown Fox\"), जिसका उपयोग हेडिंग और शीर्षक के लिए होता है।"
    },
    {
      "id": "tc-faq-2",
      "question": "शीर्षक में कौन-से शब्द बड़े लिखे जाते हैं?",
      "answer": "यह टूल शुरुआती मदद के लिए हर शब्द का पहला अक्षर बड़ा करता है; पारंपरिक अंग्रेजी गाइड में a, an, the, of, in जैसे छोटे शब्द बीच में छोटे रखे जाते हैं।"
    },
    {
      "id": "tc-faq-3",
      "question": "Title Case और Sentence Case में क्या अंतर है?",
      "answer": "Sentence Case केवल वाक्य का पहला अक्षर बड़ा रखता है, जबकि Title Case हर शब्द का पहला अक्षर बड़ा करता है।"
    },
    {
      "id": "tc-faq-4",
      "question": "क्या लंबे पैराग्राफ में भी Title Case उपयोग करना चाहिए?",
      "answer": "नहीं, लंबे अनुच्छेदों के लिए Sentence Case ही पठनीय रहता है।"
    },
    {
      "id": "tc-faq-5",
      "question": "क्या संख्याएँ या चिह्न बदलते हैं?",
      "answer": "नहीं, वे पूरी तरह सुरक्षित रहते हैं।"
    },
    {
      "id": "tc-faq-6",
      "question": "हेडलाइन को Title Case में कैसे बदलें?",
      "answer": "शीर्षक पेस्ट करें और परिणाम तुरंत कॉपी करें।"
    },
    {
      "id": "tc-faq-7",
      "question": "क्या बीच में आने वाले \"of\" या \"the\" को बड़ा रखना चाहिए?",
      "answer": "AP और Chicago स्टाइल में केवल शुरुआत या अंत में आने पर ही इन्हें बड़ा किया जाता है।"
    },
    {
      "id": "tc-faq-8",
      "question": "छोटे शब्द भी बड़े क्यों हो गए?",
      "answer": "क्योंकि यह टूल हर शब्द पर एक ही यांत्रिक नियम चलाता है और नीचे उनकी गिनती भी दिखा देता है।"
    },
    {
      "id": "tc-faq-9",
      "question": "हाइफ़न वाले शब्द (well-known) कैसे बदलते हैं?",
      "answer": "हाइफ़न के बाद आने वाले हिस्से का पहला अक्षर भी बड़ा (\"Well-Known\") हो जाता है।"
    }
  ],
  "guide": {
    "title": "टेक्स्ट को टाइटल केस (Title Case) में कैसे बदलें",
    "description": "शीर्षकों में कौन-से शब्द बड़े रखने चाहिए, Sentence Case से अंतर और हाइफ़न वाले शब्दों का नियम समझें।"
  },
  "ui": {
    "placeholder": "यहाँ शीर्षक या टेक्स्ट पेस्ट करें",
    "outputPlaceholder": "Title Case परिणाम यहाँ दिखाई देगा",
    "sampleText": "the future of remote work in the city",
    "handoff": {
      "msgTpl": "इसमें {n} छोटे शब्द (जैसे of, in, the) भी बड़े हो गए हैं जिन्हें Chicago और AP स्टाइल में छोटा रखा जाता है।",
      "siblings": {
        "sentence-case-converter": "वाक्य केस (Sentence Case)",
        "kebab-case-converter": "कबाब केस (Kebab Case)",
        "trim-text": "टेक्स्ट ट्रिम",
        "lowercase-converter": "लोअरकेस कन्वर्टर"
      }
    }
  }
};
