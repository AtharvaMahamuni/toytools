# Brand assets

Artwork for ToyTools' **accounts and profiles**, not for the site.

Nothing here ships. `brand/` sits outside every path in `SHIPPING_PATHS`
(`scripts/check-version.ts`), so these files reach no bundle, no sitemap and no page, and
changing them needs no version bump. The assets the *site* serves are generated into
`public/` by `npm run icons:generate` and are a different thing entirely.

```
brand/
└── social/
    └── x/                                  X / Twitter
        ├── toytools-x-profile-1024.png     profile picture, upload this one
        ├── toytools-x-profile-400.png      the size X serves it back at
        ├── toytools-x-profile.svg          vector source
        ├── toytools-x-banner-3000x1000.png header, upload this one
        └── toytools-x-banner-1500x500.png  1x reference
```

One directory per platform, because the platforms disagree about everything that matters:
aspect ratio, safe area, and how the picture gets cropped. An asset built for one is never the
asset another one wants, so they do not share a folder.

## Regenerating

```sh
npm run brand:generate
```

Source: `scripts/generate-social-assets.ts`. Rendered through Chromium and sharp, the same path
`npm run icons:generate` uses.

Re-run it after changing `src/lib/icons/site-icon.ts` (the mark), the hero copy in
`src/pages/index.astro` (the banner quotes it), or any token the banner reads from
`src/styles/tokens.css`. Nothing fails the build if you forget: these files are not validated,
so drift here is silent, which is exactly why the generator exists rather than a design file
somebody exports by hand.

## What the assets are

**The profile mark is not a new drawing.** It is `siteIconSvg()` from
`src/lib/icons/site-icon.ts` — the same source behind the favicon, the apple-touch icon and all
133 install icons — rasterized at 2048 and downscaled. The account picture and the browser tab
cannot drift apart because there is only one drawing. It survives X's circular crop already:
everything meaningful sits inside the mark's 24..72 safe zone, which is the constraint iOS
masking and Google's favicon clipping had imposed on it anyway.

**The banner is the homepage hero**, not a poster about it. Same warm-paper field, the same
`h1`, the same tagline, and the same gold-dot trust line the site puts under its search box.
The words are lifted from `src/pages/index.astro` so the account and the landing page cannot
say two different things.

Three decisions worth not re-litigating:

- **No tool count.** The hero carries one; a header nobody re-uploads would go stale the next
  time a tool ships.
- **Laid out in HTML, not hand-placed SVG text.** The site's trust line is flexbox with a gap.
  Reproducing that by guessing an `x` per run printed the gold dots hard against the words in
  front of them; letting the browser measure gets the homepage's own spacing for free.
- **Nothing decorative on it**, because nothing decorative is on the homepage. An earlier pass
  carried the mark's module-and-rail motif across the field: full-bleed it stopped reading as a
  board and became film-strip perforations with the wordmark stranded between two sprocket
  rows, and contained on the right it collided with the headline.

## Uploading to X

Upload the **large** file of each pair; X downscales, and starting from the larger one keeps the
gradient and the rounded corners clean at the 48px and 24px sizes it serves back.

| slot | upload | X displays it as |
|---|---|---|
| profile picture | `toytools-x-profile-1024.png` | a circle, down to 24px |
| header | `toytools-x-banner-3000x1000.png` | 3:1, scaled to the column width |

**The banner's bottom-left is empty on purpose.** X overlays the avatar there — about
x 40..372, y 334..500 measured on the 1500x500 file — so that corner is left as bare paper for
the mark to land in, and nothing that has to be read goes near it. If you re-cut the banner,
keep that corner clear and check it by compositing a circle at those coordinates rather than by
eye.
