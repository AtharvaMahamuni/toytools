import type { FAQItem } from '@data/types';

export const items: FAQItem[] = [
  {
    id: 'qr-code-generator-faq-1',
    question: 'What is a QR code?',
    answer:
      'A QR code is a square barcode that stores data as a pattern of black and white squares. A phone camera reads it and acts on the content, such as opening a link or joining a Wi-Fi network. QR stands for Quick Response, a nod to how fast it can be scanned. It holds far more data than a traditional one-dimensional barcode.',
  },
  {
    id: 'qr-code-generator-faq-2',
    question: 'How do I use this QR code generator?',
    answer:
      'Pick the content type, text, URL, email, phone, Wi-Fi, or contact card, then fill in the fields. The QR code appears as you type. When it looks right, download it as a PNG or an SVG, or copy the underlying content. Everything happens in your browser.',
  },
  {
    id: 'qr-code-generator-faq-3',
    question: 'What kinds of content can I encode?',
    answer:
      'Six types: plain text, a URL, an email address, a phone number, Wi-Fi credentials, and a contact card. Each formats the data the way phone cameras expect, so scanning a Wi-Fi code offers to join the network, a phone code offers to dial, and so on. Choose the type that matches what you want the scan to do.',
  },
  {
    id: 'qr-code-generator-faq-4',
    question: 'How do I make a Wi-Fi QR code?',
    answer:
      'Choose the Wi-Fi content type, enter the network name (SSID) and password, and pick the security type, usually WPA. When someone scans the code, their phone offers to join the network without typing the password. It is a simple way to share guest Wi-Fi. Mark the network hidden if it does not broadcast its name.',
  },
  {
    id: 'qr-code-generator-faq-5',
    question: 'Can I download the QR code?',
    answer:
      'Yes. You can download it as a PNG, a pixel image good for screens and quick use, or as an SVG, a vector file that stays sharp at any size and is ideal for print. Both are generated in your browser and saved straight to your device.',
  },
  {
    id: 'qr-code-generator-faq-6',
    question: 'What is the difference between PNG and SVG?',
    answer:
      'A PNG is made of pixels, so it has a fixed resolution and can look blocky if you enlarge it a lot. An SVG is made of shapes, so it scales to any size without losing sharpness, which is why it is preferred for printing large. For a quick screen or chat, PNG is fine; for a poster or sign, use SVG.',
  },
  {
    id: 'qr-code-generator-faq-7',
    question: 'Does the QR code generator work offline?',
    answer:
      'Yes. After the page loads once, it needs no connection. The QR code is built entirely in local JavaScript, so you can disconnect and keep generating and downloading. Nothing you enter is sent to a server.',
  },
  {
    id: 'qr-code-generator-faq-8',
    question: 'Is my data private?',
    answer:
      'Yes. Everything you type, including Wi-Fi passwords and contact details, stays in your browser. No content is uploaded, logged, or stored on a server. You can open your browser network tools and confirm that generating a code makes no requests. This matters because QR content is often sensitive.',
  },
  {
    id: 'qr-code-generator-faq-9',
    question: 'What is error correction?',
    answer:
      'QR codes include spare data so they can still be read even if part of the code is dirty, damaged, or covered. The level, from Low to High, sets how much of the code can be lost and still scan. Higher correction survives more damage but makes the code denser. Medium is a good default for most uses.',
  },
  {
    id: 'qr-code-generator-faq-10',
    question: 'Which error correction level should I choose?',
    answer:
      'Medium suits most cases. Use a higher level (Quartile or High) when the code will be printed small, placed on a surface that may get scuffed, or overlaid with a logo. Use Low only when space is tight and the code will be clean and well lit, since it tolerates the least damage.',
  },
  {
    id: 'qr-code-generator-faq-11',
    question: 'Can I make a QR code for a URL?',
    answer:
      'Yes. Choose the URL content type and paste the address. When scanned, the phone offers to open it. Keep URLs short where you can, because a long address makes the code denser and harder to scan, especially when printed small.',
  },
  {
    id: 'qr-code-generator-faq-12',
    question: 'Can I make a contact card QR code?',
    answer:
      'Yes. Choose the contact card type and enter a name, phone, email, and organization. The code uses a compact contact format that phones recognize, so scanning it offers to save the details as a new contact. It is handy on business cards and email signatures.',
  },
  {
    id: 'qr-code-generator-faq-13',
    question: 'Why will my QR code not scan?',
    answer:
      'The usual causes are too much data, too small a size, poor contrast, or a missing border. Shorten the content, print it larger, keep it dark on a light background, and leave a white margin (the quiet zone) around it. Raising the error correction level can also help on imperfect surfaces.',
  },
  {
    id: 'qr-code-generator-faq-14',
    question: 'How small can I print a QR code?',
    answer:
      'It depends on the data and the scan distance, but a common guideline is at least 2 by 2 centimeters for a short URL scanned from close up, and larger for more data or greater distance. When in doubt, print bigger and test with a phone before committing to a run.',
  },
  {
    id: 'qr-code-generator-faq-15',
    question: 'What is the quiet zone?',
    answer:
      'The quiet zone is the empty margin around a QR code. Scanners need it to find the edges of the code. The downloaded image includes this border automatically. If you crop it away or place other elements too close, some scanners will struggle, so leave the margin intact.',
  },
  {
    id: 'qr-code-generator-faq-16',
    question: 'Can I edit a QR code after I create it?',
    answer:
      'No. A QR code is static: the data is baked into the pattern, so changing the destination means generating a new code. If you need to change where a code points without reprinting, use a URL you control that redirects, and update the redirect target instead of the code.',
  },
  {
    id: 'qr-code-generator-faq-17',
    question: 'Do QR codes expire?',
    answer:
      'The code itself never expires; it is just a pattern that encodes data. What it points to can stop working, though. A URL can go dead, or a Wi-Fi password can change. The code will still scan and produce the same content, but that content may no longer be valid.',
  },
  {
    id: 'qr-code-generator-faq-18',
    question: 'How much data can a QR code hold?',
    answer:
      'A lot in theory, up to a few thousand characters, but practically you want as little as possible. The more data you encode, the denser and harder to scan the code becomes. Keep URLs and text short so the pattern stays open and reliable, especially for print.',
  },
  {
    id: 'qr-code-generator-faq-19',
    question: 'Can I copy the content instead of downloading?',
    answer:
      'Yes. The Copy button copies the exact text that the QR code encodes, such as the full URL or the Wi-Fi join string. That is useful for testing what the code contains or for pasting the value somewhere else. To save the image, use the PNG or SVG download instead.',
  },
  {
    id: 'qr-code-generator-faq-20',
    question: 'Are the QR codes free to use?',
    answer:
      'Yes. The codes you generate are yours to use anywhere, for personal or commercial projects, with no watermark, account, or fee. QR is an open standard, and this tool adds no restrictions to what you create.',
  },
  {
    id: 'qr-code-generator-faq-21',
    question: 'Which browsers does it work in?',
    answer:
      'All current browsers, including Chrome, Firefox, Safari, and Edge, on desktop and mobile. It uses standard canvas and download features that are widely supported. The generated PNG and SVG open in any image viewer or design tool.',
  },
  {
    id: 'qr-code-generator-faq-22',
    question: 'Will the QR code work in dark mode?',
    answer:
      'Yes. The code is always drawn as dark squares on a white background, regardless of the site theme, because scanners rely on that contrast. The downloaded image keeps the white background so it scans reliably wherever you place it.',
  },
  {
    id: 'qr-code-generator-faq-23',
    question: 'Does the tool remember what I entered?',
    answer:
      'It remembers your option choices, such as the content type and error correction level, in local storage so the form looks familiar next time. It does not save the content you typed or the image. The preference stays on your device and holds no personal data.',
  },
  {
    id: 'qr-code-generator-faq-24',
    question: 'Is any of my data uploaded or shared?',
    answer:
      'No. There is no account, no server call, and no analytics tied to what you encode. QR codes are built and shown entirely in your browser, which is important because the content can include passwords and contact details. The only thing kept is your local option preference.',
  },
];
