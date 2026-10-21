import type { FAQItem } from '@data/types';

export const items: FAQItem[] = [
  {
    id: 'palette-faq-1',
    question: 'How do I extract colors from an image?',
    answer:
      'Choose an image file. The page samples it in this tab and lists the dominant colors. Copy CSS writes one custom property per stop. Runs entirely on your device. Nothing is uploaded.',
  },
  {
    id: 'palette-faq-2',
    question: 'Why does a background become one color?',
    answer:
      'Near-identical pixels are merged after the cut. A wall that is several close grays becomes one stop, and the pixel share shows how much of the picture that stop is.',
  },
  {
    id: 'palette-faq-3',
    question: 'What does the pixel share mean?',
    answer:
      'It is the fraction of sampled pixels in that stop. A logo that is a tenth of the picture reads about 10%. The share is how you tell the wall from the subject.',
  },
  {
    id: 'palette-faq-4',
    question: 'Why is a hex marked as clamped?',
    answer:
      'A display-p3 sample can sit outside sRGB. The hex is the clamped sRGB value, and the line under the list says so. An ordinary sRGB picture stays quiet.',
  },
  {
    id: 'palette-faq-5',
    question: 'Does this page upload the picture?',
    answer:
      'No. There is no address field and no request. The file is read in the tab. Runs entirely on your device. Nothing is uploaded.',
  },
  {
    id: 'palette-faq-6',
    question: 'Why is a small logo missing?',
    answer:
      'The sample is a nearest-neighbor grid, not an average, but a mark thinner than one sample can be skipped. Crop closer to the logo and open the file again.',
  },
];
