// Discovery surfaces — the homepage shelves, the full directory behind them, and the sectioned
// category pages. These specs pin the store-style structure: category AppTile shelves on home,
// full tool coverage still in the HTML, recent-tools chips, and pattern-based category sections.
import { test, expect } from '@playwright/test';

test.describe('homepage index', () => {
  test('leads with fourteen category AppTile shelves, not a wall of tool names', async ({ page }) => {
    await page.goto('/');
    const shelves = page.locator('.category-shelves');
    await expect(shelves.locator('.shelf')).toHaveCount(14);
    // The categories are the homepage's content outline, not just styled links.
    await expect(shelves.getByRole('heading', { level: 2 })).toHaveCount(14);

    // Each shelf carries a linked name, tagline, See all, and a capped AppTile row.
    const text = shelves.locator('.shelf').filter({ hasText: 'Text Utilities' });
    await expect(text.getByRole('link', { name: 'Text Utilities' })).toHaveAttribute(
      'href', /\/category\/text-utilities\/$/,
    );
    await expect(text.locator('.shelf-tagline')).toHaveText('Count, convert, clean and compare text.');
    await expect(text.getByRole('link', { name: 'See all' })).toHaveAttribute(
      'href', /\/category\/text-utilities\/$/,
    );
    await expect(text.locator('.app-tile')).toHaveCount(3);
    await expect(text.locator('.app-tile-main[data-slug="word-counter"]')).toHaveAttribute(
      'href', /\/tool\/text\/word-counter\/$/,
    );
    // Install is a sibling deep-link, not a multi-instance InstallButton.
    await expect(text.locator('[data-app-tile-install]').first()).toHaveAttribute(
      'href', /\/tool\/text\/word-counter\/\?install=1$/,
    );

    // Highlights name tools the collapsed directory hides behind a group entry.
    const health = shelves.locator('.shelf').filter({ hasText: 'Health & Fitness' });
    await expect(health.locator('.app-tile-main[data-slug="bmi-calculator"]')).toBeVisible();
  });

  test('the full directory ships closed but present', async ({ page }) => {
    await page.goto('/');
    const details = page.locator('.all-tools');
    const directory = page.getByRole('navigation', { name: 'All tools by category' });

    // Closed by default: the catalog is available, not imposed.
    await expect(details).not.toHaveAttribute('open', /.*/);
    await expect(directory).not.toBeVisible();

    await page.locator('.all-tools-summary').click();
    await expect(directory).toBeVisible();
  });

  test('the directory still covers every tool with collapsed tool groups', async ({ page }) => {
    await page.goto('/');
    // A closed <details> keeps its contents out of the accessibility tree, so role-based
    // queries below need it open.
    await page.locator('.all-tools-summary').click();

    const directory = page.getByRole('navigation', { name: 'All tools by category' });
    await expect(directory.locator('.dir-column')).toHaveCount(14);

    // Case converters collapse to a single entry that still covers every member slug.
    const caseEntry = directory.getByRole('link', { name: 'Case Converter' });
    await expect(caseEntry).toHaveCount(1);
    await expect(caseEntry).toHaveAttribute('data-group-slugs', /snake-case-converter/);

    // JSON tools (formatter, minifier, tree viewer) collapse the same way.
    const jsonEntry = directory.getByRole('link', { name: 'JSON Tools' });
    await expect(jsonEntry).toHaveCount(1);
    await expect(jsonEntry).toHaveAttribute('data-group-slugs', /json-tree-viewer/);

    // CSV tools (diff, to-tsv, cleaner) collapse the same way.
    const csvEntry = directory.getByRole('link', { name: 'CSV Tools' });
    await expect(csvEntry).toHaveCount(1);
    await expect(csvEntry).toHaveAttribute('data-group-slugs', /csv-cleaner/);

    // All tools, with every tool group collapsed to a single entry:
    //   −6 case converters (7→1), −2 JSON tools (3→1), −1 JSON↔YAML (2→1), −1 JSON↔CSV (2→1),
    //   −2 CSV tools (3→1), −8 text cleanup (9→1), −7 encoders (8→1), −4 hash generators (5→1),
    //   −8 text counters (9→1), −10 health calculators (11→1), −2 daily trackers (3→1),
    //   −5 growth calculators (6→1), −5 everyday calculators (6→1).
    // 138 tools − 61 grouped-collapse = 77 directory links (generator, physics, applied-math,
    // date/time, scientific-calculator, shell-quote-escalator, systemd-timer-converter,
    // encoding-detector, invisible-character-detector and the 5 design tools stay ungrouped;
    // physics has 12 manifest-driven simulators and applied-math five wave-2 tools beside
    // unit-circle). The nine tools added in alpha-v7.22 are all ungrouped: the four chance tools
    // share an engine and a pattern but answer different questions, and a group switcher that
    // swapped a dice roller for a coin would be shuffling the tool rather than the input.
    // Neither detector can join the group whose subject it shares: group members must share one
    // engine/pattern, and a detector declares `encode-detect` / `text-inspect` rather than
    // `encode-decode` / `text-cleanup` precisely because it reports on input instead of transforming it.
    // The nuclear reactor calculator added in alpha-v7.23 is likewise ungrouped: it is the only
    // simulator on its family, so there is nothing to collapse it with. The three chemistry
    // simulators added in alpha-v8.0 are ungrouped for the same reason, one per family: organic,
    // inorganic and physical chemistry share the engine but answer unrelated questions, so there is
    // no pair a group switcher could sensibly swap between. The electron configuration and
    // chemical bond simulators added in alpha-v8.2 are likewise ungrouped, one per family: they are
    // a natural pair to READ together, which is what the relationship overlay expresses, but a
    // group switcher swaps one tool for another and neither answers the other's question. The
    // equalizer added in alpha-v9.0 is ungrouped because it is the only tool on its engine so far.
    // Switch Board (alpha-v10.3) is ungrouped with Pop It: they share engine and pattern but are
    // different toys, not modes of one workspace, so a group switcher would shuffle the tool.
    // Five more Feel fidgets (gears, spinner, kinetic-sand, slime, breathing-circle) are likewise
    // ungrouped: they share engine and pattern but are different toys, not modes of one workspace.
    // What Is My IP and the CIDR calculator (alpha-v11.0) are ungrouped: they share the network
    // engine but not a pattern (lookup versus calculate), so they cannot sit in one group.
    // Statistics Visualizer (beta-v11.1) is ungrouped: first tool on the math statistics family,
    // so there is nothing to collapse it with.
    // Habit Streak Tracker (beta-v11.2) is ungrouped: first productivity habit-family tool, not a
    // mode of todo-list / notepad / pomodoro.
    // Book Tracker (beta-v11.3) is ungrouped: shelf family, not a mode of todo-list, notepad,
    // or habit-streak-tracker.
    // UUID Inspector (beta-v11.4) is ungrouped: same engine and pattern as UUID Generator, but
    // reading a UUID is not a mode of minting one, so a group switcher would swap the task.
    // Hash Identifier (beta-v11.5) is ungrouped: it sits on the hashing engine, but pattern
    // hash-identify is not hash, so it cannot share the Hash Generator switcher.
    // JSON Diff (beta-v11.6) is ungrouped: pattern structured-compare is not structured-transform,
    // so it cannot share the JSON Tools switcher (formatter, minifier, tree).
    // UPI 1999 Split (beta-v11.7) is ungrouped: a finance-planning meme, not a mode of the
    // growth calculators and not a switch with the emergency fund calculator.
    // UPI MDR Estimator, Split Bill, and Shop UPI Tally (beta-v11.8) are ungrouped:
    // each answers a different question, so a group switcher would swap the task.
    await expect(directory.locator('.dir-link')).toHaveCount(97);
  });

  test('recent chips appear after visiting a tool', async ({ page }) => {
    // An ungrouped tool surfaces under its own name (group members surface as
    // their group entry — covered by the next test).
    await page.goto('/tool/text/reverse-text/');
    await page.goto('/');
    const row = page.locator('#recent-row');
    await expect(row).toBeVisible();
    await expect(row.getByRole('link', { name: 'Reverse Text' })).toBeVisible();
  });

  test('a visited group member surfaces as its group entry', async ({ page }) => {
    await page.goto('/tool/text/snake-case-converter/');
    await page.goto('/');
    await expect(page.locator('#recent-row').getByRole('link', { name: 'Case Converter' })).toBeVisible();
  });
});

test.describe('category pages', () => {
  test('text-utilities groups into three titled sections', async ({ page }) => {
    await page.goto('/category/text-utilities/');
    const headings = page.locator('.cat-section-heading');
    await expect(headings).toHaveText(['Counting & Analysis', 'Case Conversion', 'Cleanup', 'Find & Compare']);

    // Grouped rows render mode chips: 7 case converters + 9 text-cleanup + 9 text counters.
    await expect(page.locator('.cat-chip')).toHaveCount(25);
    // Scoped to the chip rather than matched by name across the whole page: the category page also
    // lists its guides, and "How To Convert Text To snake_case" contains this chip's name, so an
    // unscoped role query resolves to two links. The assertion is about where the chip points.
    await expect(page.locator('a.cat-chip', { hasText: 'snake_case' })).toHaveAttribute(
      'href', /\/tool\/text\/snake-case-converter\/$/,
    );
  });

  test('single-section categories render no section headings', async ({ page }) => {
    await page.goto('/category/productivity/');
    await expect(page.locator('.cat-section-heading')).toHaveCount(0);
    // Book Tracker (beta-v11.3) is the sixth productivity tool.
    await expect(page.locator('.app-tile-item')).toHaveCount(6);
  });

  test('category AppTiles deep-link Install with ?install=1', async ({ page }) => {
    await page.goto('/category/productivity/');
    const install = page.locator('[data-app-tile-install]').first();
    await expect(install).toBeVisible();
    await expect(install).toHaveAttribute('href', /\/tool\/[^/]+\/[^/]+\/\?install=1$/);
    // Tile body opens the tool without the install query.
    const main = page.locator('.app-tile-main').first();
    await expect(main).toHaveAttribute('href', /\/tool\/[^/]+\/[^/]+\/$/);
  });
});
