import type { LocalizedToolPack } from '@lib/i18n/types';

export const pack: LocalizedToolPack = {
  "name": "JSON से YAML कन्वर्टर",
  "seoTitle": "JSON से YAML कन्वर्टर - Kubernetes कॉन्फ़िग ऑनलाइन",
  "description": "Kubernetes, Docker Compose, Ansible और CI/CD के लिए JSON को तुरंत YAML में बदलें। साफ़ इंडेंटेशन और स्वचालित कोटिंग ब्राउज़र में।",
  "tagline": "Kubernetes और CI/CD के लिए JSON को पठनीय YAML में बदलें।",
  "lead": "बिना किसी सर्वर अपलोड के API JSON को Kubernetes मैनिफेस्ट, Docker Compose और कॉन्फ़िग के लिए साफ़ YAML में बदलें।",
  "guide": {
    "title": "JSON से YAML कन्वर्टर: संपूर्ण मार्गदर्शिका",
    "description": "JSON और YAML का अंतर, स्पेस इंडेंटेशन नियम, आरक्षित शब्दों पर कोट्स लगाने का कारण और DevOps उपयोग समझें।"
  },
  "ui": {
    "inputLabel": "JSON इनपुट",
    "placeholder": "यहाँ JSON पेस्ट करें",
    "moreAboutHeading": "JSON से YAML कन्वर्टर कैसे काम करता है",
    "insight": "JSON को कॉन्फ़िगरेशन फ़ाइलों में लोकप्रिय अधिक पठनीय YAML में बदलता है। डेटा वही रहता है, केवल सिंटैक्स बदलता है।",
    "technical": [
      {
        "term": "प्रक्रिया",
        "detail": "पार्स किए गए JSON को YAML रूप में सिरीयलाइज करता है"
      },
      {
        "term": "उपयोग",
        "detail": "कॉन्फ़िग फ़ाइलें, CI पाइपलाइन और मैनिफेस्ट"
      },
      {
        "term": "डेटा",
        "detail": "सुरक्षित: YAML, JSON का सुपरसेट है"
      }
    ]
  },
  "knowledge": {
    "summary": "Kubernetes, Docker Compose, Ansible और CI/CD के लिए सुरक्षित कोटिंग के साथ JSON को YAML में बदलता है।",
    "useCases": [
      "JSON API आउटपुट को Kubernetes डिप्लॉयमेंट मैनिफेस्ट में बदलना",
      "JSON परिभाषा से Docker Compose फ़ाइल तैयार करना",
      "Ansible के लिए JSON वैरिएबल को YAML बनाना",
      "GitHub Actions वर्कफ़्लो कॉन्फ़िग बनाना",
      "OpenAPI विनिर्देश को पढ़ने योग्य YAML बनाना"
    ],
    "mistakes": [
      "YAML में स्पेस के बजाय टैब इंडेंटेशन इस्तेमाल करना",
      "संख्या जैसे दिखने वाले स्ट्रिंग मान बिना कोट्स के छोड़ देना",
      "नेस्टेड स्तरों में इंडेंटेशन गड़बड़ करना",
      "बिना --- वाले YAML को अमान्य मान लेना"
    ]
  },
  "faqs": [
    {
      "id": "jyaml-faq-1",
      "question": "JSON और YAML में क्या अंतर है?",
      "answer": "दोनों पदानुक्रमित डेटा दर्शाते हैं। JSON कोष्ठकों और अनिवार्य कोट्स का उपयोग करता है, जबकि YAML स्पेस इंडेंटेशन व डैश का प्रयोग कर मानव-पठनीय बनता है।"
    },
    {
      "id": "jyaml-faq-2",
      "question": "JSON को YAML में क्यों बदलें?",
      "answer": "Kubernetes, Docker Compose, Ansible और GitHub Actions में YAML मानक फॉर्मेट है, जिससे API डेटा सीधे कॉन्फ़िग में लग जाता है।"
    },
    {
      "id": "jyaml-faq-3",
      "question": "YAML को वापस JSON में क्यों बदला जाता है?",
      "answer": "वेब API और JSON Schema सत्यापन के लिए JSON अनिवार्य होता है। आप सहयोगी YAML से JSON टूल से तुरंत वापस बदल सकते हैं।"
    },
    {
      "id": "jyaml-faq-4",
      "question": "क्या YAML में इंडेंटेशन अनिवार्य है?",
      "answer": "हाँ। YAML में केवल स्पेस (टैब नहीं) संरचना तय करते हैं। प्रति स्तर 2 स्पेस मानक है; एक भी गलत स्पेस त्रुटि दे सकता है।"
    },
    {
      "id": "jyaml-faq-5",
      "question": "YAML आउटपुट में कुछ शब्द कोट्स में क्यों लिपटे दिखते हैं?",
      "answer": "true, false, yes, no या 10001 जैसे मान बिना कोट्स के बूलियन या नंबर बन जाते हैं। कोट्स यह पक्का करते हैं कि वे स्ट्रिंग ही रहें।"
    },
    {
      "id": "jyaml-faq-6",
      "question": "फ़्लो ऐरे (Flow arrays) विकल्प क्या करता है?",
      "answer": "यह साधारण मानों की छोटी सूची को अलग-अलग पंक्तियों के बजाय एक लाइन [a, b, c] में संक्षिप्त दिखाता है।"
    },
    {
      "id": "jyaml-faq-7",
      "question": "YAML में ऊपर --- चिह्न का क्या अर्थ है?",
      "answer": "यह YAML दस्तावेज़ के आरंभ को दर्शाता है, जो मल्टी-डॉक्यूमेंट Kubernetes या Helm फ़ाइलों में उपयोगी होता है।"
    },
    {
      "id": "jyaml-faq-8",
      "question": "क्या मेरा कॉन्फ़िगरेशन डेटा निजी रहता है?",
      "answer": "हाँ। रूपांतरण पूरी तरह ब्राउज़र में JavaScript से चलता है; कोई भी संवेदनशील कॉन्फ़िग सर्वर पर नहीं जाती।"
    }
  ]
};
