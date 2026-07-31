import type { FAQItem } from '@data/types';

export const items: FAQItem[] = [
  {
    id: 'px-to-dp-converter-faq-1',
    question: 'What is the formula for dp to px on Android?',
    answer: 'px = dp times (dpi / 160). The mdpi bucket at 160dpi is the baseline where 1dp equals 1px. At xhdpi (320dpi) the scale is 2, so 8dp becomes 16px; at xxxhdpi (640dpi) the scale is 4, so 8dp becomes 32px. This tool lists every bucket at once so you do not have to run the formula per density.',
  },
  {
    id: 'px-to-dp-converter-faq-2',
    question: 'What is the difference between dp and sp?',
    answer: 'dp (density-independent pixels) is used for layout dimensions like margins and icon sizes. sp (scale-independent pixels) is used for text and behaves like dp but also scales with the user font-size accessibility setting. The pixel math is identical, which is why this converter covers both; choose sp for type and dp for everything else.',
  },
  {
    id: 'px-to-dp-converter-faq-3',
    question: 'Which density bucket should I design for?',
    answer: 'Design and specify in dp, which is density-independent, and let Android scale to each bucket. When you export raster assets, provide them for the common buckets (mdpi, hdpi, xhdpi, xxhdpi, xxxhdpi) so images stay sharp. Vector drawables avoid the problem entirely since they scale without pixelation.',
  },
  {
    id: 'px-to-dp-converter-faq-4',
    question: 'How do iOS points relate to Android dp?',
    answer: 'Both are density-independent units, and at the baseline 1pt equals 1px, matching 1dp at mdpi. iOS uses integer scale factors: @1x, @2x, and @3x. The tool shows the iOS pixel values beside the Android buckets so you can hand off one measurement to both platforms.',
  },
  {
    id: 'px-to-dp-converter-faq-5',
    question: 'How do I convert a pixel value back to dp?',
    answer: 'Switch the mode to px to dp, enter the pixel measurement, and pick the density it was taken at. The tool divides by that density scale to recover the dp value. This is useful when you have a pixel size from a screenshot or a redline and need the density-independent equivalent.',
  },
];
