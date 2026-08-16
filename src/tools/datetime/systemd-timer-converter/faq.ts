import type { FAQItem } from '@data/types';

export const items: FAQItem[] = [
  {
    id: 'systemd-timer-converter-faq-day-rule',
    question: 'Why does my timer run on fewer days than the cron job did?',
    answer:
      'Because the two grammars read the day fields differently. When a crontab line restricts both the day of the month and the day of the week, cron fires when either matches. systemd treats the date and the weekday as independent constraints and fires only when both match. So 0 0 13 * 5 means the 13th or any Friday under cron, and only a Friday the 13th as a timer. This is the one difference that produces no error on either side, so the tool checks a year of dates and names the first day the two disagree.',
  },
  {
    id: 'systemd-timer-converter-faq-timezone',
    question: 'Which timezone does OnCalendar use?',
    answer:
      'The system timezone of the machine running the timer. A crontab that set TZ at the top of the file does not carry over, so a job that ran at 02:00 local can move by hours once it becomes a timer. Set Timezone= in the [Timer] section when the schedule depends on a specific zone. This page computes and shows every run time in UTC so the answer does not depend on the machine you are reading it on.',
  },
  {
    id: 'systemd-timer-converter-faq-reboot',
    question: 'What is the OnCalendar equivalent of @reboot?',
    answer:
      'There is none. @reboot is not a calendar event, so it has no OnCalendar form at all. The systemd equivalent is OnBootSec= in the [Timer] section, which fires a fixed interval after boot, or OnStartupSec= to fire relative to systemd itself starting. The tool says so rather than reporting a syntax error, because a parse failure sends people looking for a typo that is not there.',
  },
  {
    id: 'systemd-timer-converter-faq-shorthands',
    question: 'Does it handle @daily, @weekly and the other shorthands?',
    answer:
      'Yes. They are expanded to their five-field equivalents first and then translated, and the result names which shorthand it came from. Note that @weekly in cron means Sunday at midnight, while the systemd shorthand weekly means Monday. That mismatch is why the tool emits an explicit OnCalendar expression rather than passing the shorthand through.',
  },
  {
    id: 'systemd-timer-converter-faq-persistent',
    question: 'Why does the generated unit set Persistent=true?',
    answer:
      'Persistent=true makes the timer run immediately after a missed window, which is the behaviour most people expect when replacing a cron job on a machine that is not always on. cron simply skips a run if the machine was asleep. Remove the line if you want that skipping behaviour back.',
  },
  {
    id: 'systemd-timer-converter-faq-verify',
    question: 'How do I check the translation on the real machine?',
    answer:
      'Run systemd-analyze calendar on the expression, which prints the next elapse. That confirms systemd parses it the way you intended, and it says nothing about whether the schedule matches the crontab line you started from, because it never saw the crontab line. That comparison is what this page does before you copy anything.',
  },
];
