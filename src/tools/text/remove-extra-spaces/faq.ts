import type { FAQItem } from '@data/types';

export const items: FAQItem[] = [
  {
    id: 'res-faq-1',
    question: 'What does "remove extra spaces" do?',
    answer:
      'It collapses any run of two or more spaces or tabs into a single space, so "hello     world" becomes "hello world". Line breaks are kept, so your paragraphs stay intact.',
  },
  {
    id: 'res-faq-2',
    question: 'Why do extra spaces appear in text?',
    answer:
      'They often come from copy-pasting between documents, the old typing habit of double-spacing after a period, manual alignment with the space bar, or text exported from PDFs and spreadsheets.',
  },
  {
    id: 'res-faq-3',
    question: 'Does it remove line breaks too?',
    answer:
      'No. This tool only collapses runs of spaces and tabs. If you also want to flatten line breaks into single spaces, use the Normalize Whitespace tool instead.',
  },
  {
    id: 'res-faq-4',
    question: 'Will it trim spaces at the start and end of lines?',
    answer:
      'It collapses internal runs to a single space but does not strip a single leading or trailing space on its own. To trim the start and end of every line, use the Trim Text tool.',
  },
  {
    id: 'res-faq-5',
    question: 'How do I clean up spacing in text pasted from a PDF or email?',
    answer:
      'Paste the text into Remove Extra Spaces and copy the output: every run of repeated spaces or tabs collapses to one space, while single spaces between words stay exactly as they are. Line breaks are kept, so the paragraphs from the PDF survive. For example, a sentence that arrives as "Invoice   sent.  Payment   due Friday." comes out as "Invoice sent. Payment due Friday.", ready to paste back into your document.',
  },
  {
    id: 'res-faq-6',
    question: 'Should I remove extra spaces or trim the whitespace at the edges?',
    answer:
      'Remove extra spaces when the problem is repeated spaces between words; trim when the problem is padding at the start or end of lines. This tool collapses interior runs but never strips the edges: a line beginning with three spaces still begins with one space afterward. For example, "  name   :   value  " becomes " name : value " here, while Trim Text would return "name   :   value" and leave the interior gaps alone.',
  },
  {
    id: 'res-faq-7',
    question: 'What is the difference between collapsing spaces and normalizing whitespace?',
    answer:
      'Collapsing spaces fixes the gaps inside each line and keeps the document structure; normalizing rewrites every whitespace character, line breaks included, and outputs one flat line. If your line breaks were preserved when you expected them gone, that is this boundary: pick Normalize Whitespace for the umbrella job. For example, a two-line address stays two lines here, but normalizing turns "12 Oak St" and "Springfield" into the single line "12 Oak St Springfield".',
  },
  {
    id: 'res-faq-8',
    question: 'Why does my text still have wide gaps after removing extra spaces?',
    answer:
      'The leftover gaps are non-breaking spaces or other Unicode whitespace, which this tool leaves alone: it only matches regular spaces and tab characters. Real tabs do get converted, so a gap that survives the pass is not a tab. Word documents and web pages routinely paste non-breaking spaces (U+00A0) that look identical to normal ones. For example, run the same text through Normalize Whitespace, which covers Unicode spaces too, and the stubborn gap collapses to one plain space.',
  },
  {
    id: 'res-faq-9',
    question: 'Is it safe to paste private text into an online extra-space remover?',
    answer:
      'Yes. Remove Extra Spaces does all of its work locally in your browser with one line of JavaScript; no text is sent to a server, stored, or logged. Close the tab and nothing persists anywhere. For example, you can fix the double spacing in a client contract or an unpublished manuscript, copy the cleaned result, and the content never leaves your computer.',
  },
];
