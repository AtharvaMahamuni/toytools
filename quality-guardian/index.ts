import { runPrCheck } from './workflows/pr.js';
import { runWeeklyAudit } from './workflows/weekly.js';

const cmd = process.argv[2] ?? 'pr';

if (cmd === 'weekly') {
  await runWeeklyAudit();
} else {
  await runPrCheck();
}
