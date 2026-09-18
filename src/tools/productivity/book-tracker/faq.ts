import type { FAQItem } from '@data/types';

export const items: FAQItem[] = [
  {
    id: 'bt-faq-1',
    question: 'What is a book tracker?',
    answer:
      'A book tracker is a private shelf of titles you want to read, are reading, or have finished. This page stores title, author, status, progress while reading, an optional rating from 1 to 5, and an optional note. For example, add The Left Hand of Darkness, set status to reading, and set progress to 30. The shelf holds 200 books. Runs entirely on your device. Nothing is uploaded.',
  },
  {
    id: 'bt-faq-2',
    question: 'Do books sync across devices?',
    answer:
      'No. There is no cloud sync in v1. A shelf on your laptop stays in that browser profile, and your phone keeps its own store. Expecting the shelf to sync across phones and laptops is the usual miss. For example, a title added in Chrome on a desk does not appear in Safari on a phone. Export JSON if you want a copy elsewhere. Runs entirely on your device. Nothing is uploaded.',
  },
  {
    id: 'bt-faq-3',
    question: 'Why did my shelf disappear?',
    answer:
      'Clearing site data, cookies, or browsing data for this site deletes the shelf. That loss is permanent unless you exported JSON first. Clearing browser data without exporting JSON first is the usual reason a shelf vanishes. A private window also drops storage when it closes. For example, a cleanup that removes site data for this domain erases the book file with it. Export before you clear the browser.',
  },
  {
    id: 'bt-faq-4',
    question: 'What happens when I mark a book finished?',
    answer:
      'Finished sets progress to 100 and the book leaves Currently Reading. It does not stay in the Reading filter with a partial percent. Marking a book finished so it leaves the reading view is the rule, so status and progress cannot disagree. For example, a card at 60 percent set to finished becomes 100 and drops out of Reading. Open the Finished filter to see it. Switch it back to reading if you were not done.',
  },
  {
    id: 'bt-faq-5',
    question: 'Will importing the same file create duplicates?',
    answer:
      'No. Import merges on title plus author, and the match ignores letter case. Re-import of the same export updates the existing row instead of adding a second copy. Importing the same backup twice and getting duplicate rows cannot happen here. For example, export one title, import that file again, and the shelf still shows one card. Matching title and author are merged, not duplicated.',
  },
  {
    id: 'bt-faq-6',
    question: 'Can an import drop my rating?',
    answer:
      'No. Header aliases title, author, status, progress, and rating are read even when the capitalization differs. A column named Rating still lands on the card. Merging an import so ratings stay on the same title and author is the default when a later file omits the rating. For example, Title plus Rating 5 imports as five stars, and a second file that skips Rating does not wipe the five.',
  },
  {
    id: 'bt-faq-7',
    question: 'Does this look up ISBN or covers?',
    answer:
      'No. v1 has no ISBN lookup, no cover download, and no account. You type the title. Nothing is fetched from a book API. For example, a barcode or an ISBN is not resolved to a cover, a publisher, or a page count. The shelf stays private because the page never calls a network service for book data.',
  },
  {
    id: 'bt-faq-8',
    question: 'How do I export or import my shelf?',
    answer:
      'Use Export JSON to download a backup, then Import JSON to load it later. The default action merges by title and author. Check Replace entire shelf only when you mean to wipe titles that are not in the file, and confirm before that replace. Backing up the shelf with export JSON before clearing the browser is the safe order. For example, save the file, clear site data, then import.',
  },
  {
    id: 'bt-faq-9',
    question: 'Why is the shelf limited to 200 books?',
    answer:
      'The shelf holds 200 books. Past that, the form shows a clear message and does not save book 201. A short cap keeps the list usable on a phone. For example, at 200 titles the message names the cap, and you delete one card before another title fits. Export JSON first if you want a copy of the full shelf before you delete.',
  },
  {
    id: 'bt-faq-10',
    question: 'Is my reading list private?',
    answer:
      'Yes. Runs entirely on your device. Nothing is uploaded. Titles, authors, notes, ratings, and progress stay in this browser under a tool-specific key, and no account is required. Keeping a private reading list without a Goodreads account is the point of the page. For example, a note about a half-read novel never leaves the browser profile you have open right now.',
  },
  {
    id: 'bt-faq-11',
    question: 'How is this different from Goodreads?',
    answer:
      'Goodreads and StoryGraph ask for an account, cloud sync, and a social feed before you keep a shelf. This page is a local alternative: filters, search, progress only while reading, and JSON export, with no signup. For example, you can track a reading list offline without opening an account. Use a cloud app when you want friends. Use this shelf when you want privacy.',
  },
  {
    id: 'bt-faq-12',
    question: 'Can a finished book stay in Reading?',
    answer:
      'No. A finished book always stores progress at 100 and leaves the Reading filter. Leaving a finished book in the reading list because progress was not updated is the failure this page blocks. For example, set status to finished while the percent field still said 10, and the saved value becomes 100. The Reading filter no longer includes that card.',
  },
];
