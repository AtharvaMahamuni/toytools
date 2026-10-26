# PDF and file tools: analysis and roadmap

Date: 2026-10-25 (IST). Planning document only. Nothing here is implemented, and no tool, category, engine or page is added by this file.
Based on the read-only study `/workspace/specs/pdf-tools-study.md` (ihatepdf.cv compared with ToyTools), read against `AtharvaMahamuni/toytools` at `origin/main` c6e3ee1c (alpha-v13.13).

**Legend used everywhere**
- **[V]** verified: read in the repo or measured in the study, and the source is given.
- **[P]** proposed: a recommendation. Not in the repo.
- **[TV]** to verify: a number or behaviour that must be checked before the work package that depends on it starts.
- Sizes are min + gzip -9, measured in the study unless marked "to measure". There are **no search volumes** in this document that were measured here.

Related: `docs/world-time-tools-roadmap.md` (World & Travel). The two plans share open decision 1 below.

---

## 1. Executive summary

**Proposed: 1 new category ("PDF & Files"), 17 candidate tools in phases, up to 5 new engines (one, `pdf-crypt`, has no library yet), 0 tools built by this PR.**

1. **Demand is an order above most current niches.** "merge pdf", "split pdf", "jpg to pdf", "pdf to jpg" and "compress pdf" are among the highest-volume utility queries (millions per month per public keyword tools; not measured here) [TV].
2. **ToyTools has the differentiator incumbents lack.** Files never leave the device, there is no upload, no account, and every library is self-hosted and open source, which anyone can check in the repo. The reference site, ihatepdf.cv, loads its heavy libraries from third-party CDNs at runtime, and its Chat/Summarize tools send document text to Gemini [V study].
3. **Win on privacy and the long tail, not the head terms.** iLovePDF and Smallpdf own the head queries.
4. **Nothing ships until the open questions in section 7 are answered.**

## 2. What exists today

- Engines in `src/lib/engines/`: audio, board-game, color, csv, datetime, encoding, feel, finance, hashing, jwt, math, network, structured-data, tracker, transform, units, wellness. **No pdf, image-codec or archive engine** [V].
- File-adjacent tools: `file-hash-verifier` (developer-utilities), `image-palette-extractor` (design), `qr-code-generator`. **Zero PDF tools** [V].

## 3. Fit with the philosophy

| Group | Actions |
|---|---|
| **Fit** (in-browser, nothing saved, small) | merge; split (pages, range, every N, half); rotate; organise, reorder and delete pages; extract pages; images to PDF; PDF to JPG/PNG; page numbers; text watermark; headers and footers; crop and resize; flatten form; edit or remove metadata with a privacy scanner; protect and unlock with a known password; N-up; extract text; invert colours; compare two PDFs (text diff); Markdown or text to PDF |
| **Borderline** | compress (pdf-lib can only re-save or downsample images, a weak result against a "compress" promise); OCR (multi-MB wasm); redact (true redaction needs a content-stream rewrite, fake redaction is a privacy risk); repair; sign (draw and stamp is fine, "legal e-sign" claims are not) |
| **Does not fit** | Chat or Summarize PDF (AI, third-party upload, API key); PDF to and from Word, Excel, PPTX, EPUB or HTML (low fidelity, several heavy libraries); audio to PDF; p2p share and whiteboard (need servers); GST and POS billing (off scope); runtime CDN loading (privacy and supply-chain risk); sponsor checkout |

## 4. Engines [P]

| Engine | Library | Size (gz) | Used by |
|---|---|---|---|
| `pdf` (write) | pdf-lib 1.17.1 | **207 KB** UMD [V study]; an ESM build may be smaller [TV] | about 80% of the tools |
| `pdf-render` | pdfjs-dist, **4.2.67 or later** (see the security note below) | **88 KB** main + **290 KB** worker, measured on 3.11 [V study]; the required version is to measure [TV] | thumbnails, PDF to image, extract text, compare |
| `image` | canvas encode and resize | 0 KB library | images to PDF input, later image compress, resize, convert |
| `archive` | fflate 0.8 | **12 KB** (jszip is 28 KB) [V study] | multi-file output as one ZIP |
| `pdf-crypt` | **TBD**, not chosen | to measure | Protect and Unlock only (see open question 8) |

**Licences [V npm registry, 2026-10-25].** pdf-lib 1.17.1 is MIT. pdfjs-dist is Apache-2.0 (latest is 6.4.299). fflate 0.8.3 is MIT. Each must be credited the way the repo already credits third-party code.

**pdf-lib cannot encrypt or decrypt.** Its README says it "does not currently support encrypted documents": `PDFDocument.load` throws on an encrypted file, and `ignoreEncryption: true` loads it without decrypting, so edits and saves can fail or come out corrupt [V github.com/Hopding/pdf-lib, Encryption Handling]. Protect and Unlock therefore need a separate library, not yet chosen. No candidate is named here until its browser support, size and licence are checked (open question 8).

**pdf.js security.** pdfjs-dist up to 4.1.392 is affected by CVE-2024-4367 (GHSA-wgrm-67xf-hhpq, high): opening a malicious PDF with the default `isEvalSupported: true` runs attacker JavaScript in the site's origin. It is patched in 4.2.67, and the 3.x line will not get the fix [V github.com/mozilla/pdf.js advisory and discussion 18168]. So the render engine requires **4.2.67 or later**, never the 3.11 build the study measured, and also passes `isEvalSupported: false` to `getDocument` as hardening (the advisory's documented workaround).

Each tool stays a small island with a static form. The engine never ships in page HTML or CSS, so it does not count toward the tool CSS budget; the only shared cost is a drop-zone stylesheet of about 1 KB [TV].

**JS page budget.** `scripts/check-budget.ts` caps a tool page at `jsKb: 24` (24,576 B gz), and counts "all JS the page fetches on load (entry + static deps + its engine chunk)" [V]. A 207 KB engine can only fit if it is never in that graph: the engine must be reached through a dynamic `import()` fired by user action (section 5), never a static import, and the spike must confirm check-budget does not count the deferred chunk [TV].

## 5. Delivery notes

These are **proposed** delivery rules [P], to confirm when the open questions are answered. None is decided.

- **Load engines per tool.** Each tool imports only the engine it needs, on demand. pdf-lib is about 207 KB gz. pdf.js is 88 KB plus a 290 KB worker, and is loaded only by the rendering tools (thumbnails, PDF to image, extract text, compare). A write-only tool never downloads pdf.js.
- **Images to PDF uses a tiny hand-rolled JPEG-to-PDF writer**, not pdf-lib. A JPEG can be embedded as a DCTDecode image stream inside a minimal PDF, so the most common conversion needs no heavy engine at all.
- **Work off the main thread.** pdf.js already runs its parser in a Web Worker. pdf-lib runs on the main thread, so large merges should run in a dedicated worker [P] to keep the page responsive [TV cost].
- **Files stay on the device.** Every file is read with the File API and processed in the tab. Nothing is uploaded, and nothing is saved to storage; the output is a download the user triggers.
- **Engine caching uses the existing service worker.** `public/sw.js` already caches every successful same-origin GET network-first, with hashed assets requested normally so the HTTP cache serves them, and falls back to the cache offline. Its runtime cache is trimmed to 150 entries, oldest first [V]. CLAUDE.md:184 forbids a widget its own service worker [V]. So no new worker: engines ship as hashed, self-hosted Astro chunks, the browser HTTP cache reuses them across tools, and `sw.js` makes them work offline once fetched. Whether a 290 KB worker should be exempt from the 150-entry trim is a `sw.js` change for the spike to propose [TV].
- **Prefetch the engine on file-picker intent.** Start fetching when the user shows intent (hovering or focusing the drop zone, or opening the file picker), so the engine is usually ready by the time a file is chosen. Never load it on page load.
- **Serve Brotli.** Engine chunks are served Brotli-compressed, which is smaller than the gzip numbers above [TV exact saving].
- **Do not split pdf-lib itself.** It is loaded as one chunk. Splitting its internals is fragile and gains little once it is cached.
- **The size-measurement spike is deferred.** Measuring the tree-shaken pdf-lib ESM chunk, Astro dynamic-import behaviour and a check-budget rule for engine chunks waits until the open questions are answered. Until then the study's UMD numbers are the planning figures.
- **Offline and the shell.** A PDF tool works offline only after its engine has been fetched once; until then it shows the static form and an offline note rather than failing [P]. Tools render inside the normal tool shell and follow the Tool Render Unit contract (CLAUDE.md), with no page-level additions.
- **Never load from a CDN.** Runtime third-party loading would break the "nothing leaves your browser" claim [V study, section 4].

## 6. Phased plan [P]

| Phase | Engine | Tools | Count |
|---|---|---|---|
| 0, groundwork | none | search budget fix, if Q6 makes it a prerequisite; deferred size spike (section 5) | 0 |
| 1, pilot | `pdf` + JPEG writer | Merge PDF, Split PDF, Images to PDF | 3 |
| 2 | `pdf` | Rotate, Delete and Reorder pages, Extract pages, Page numbers, Watermark, PDF metadata viewer and remover | 6 |
| 2b, only if Q8 is answered | `pdf-crypt` (TBD) | Protect and Unlock with a known password | 2 |
| 3 | `pdf-render` + `archive` | PDF to JPG/PNG (ZIP), Extract text, Compare PDFs (text) | 3 |
| 4 | `image` | Image compress, resize, convert (JPG, PNG, WebP), optional EXIF stripping | 3 |
| Later or maybe | various | OCR, true redaction, compress PDF | - |

**Search budget.** Measured on `origin/main` c6e3ee1c (alpha-v13.13) with `astro build` and Node `gzipSync`: `/search/` HTML is 31,593 B against its 31,744 B cap (151 B left), and `search-terms.json` is 10,042 B against 10,240 B (198 B left) [V]. Every new tool adds search entries, so Phase 1 almost certainly needs room first. Whether that is a separate prerequisite PR is open question 6, not decided here.

## 7. Open questions for Atharva

These are not decided here.

1. Is a new "PDF & Files" category approved, and does it get its own major bump or share alpha-v14 with World & Travel? Which roadmap goes first?
2. Is a one-time, on-demand engine download (about 207 KB gz for pdf-lib, up to about 585 KB with pdf.js) acceptable under "lightweight"?
3. Is the pilot set Merge, Split and Images to PDF?
4. Do the image tools (compress, resize, convert) go in the same category, or in Design?
5. Are compress PDF, OCR and redact excluded for now?
6. Is the search budget fix (trim or split the index) a prerequisite PR?
7. What file-size cap applies (for example 100 MB on desktop and 30 MB on mobile)?
8. Which library, if any, handles Protect and Unlock, given that pdf-lib cannot encrypt or decrypt? Candidates must be checked for in-browser use, size and licence before one is named. Until then Phase 2b does not start.

## 8. Risks

- **First-use download** of about 200 to 585 KB gz hurts "lightweight" on slow mobile. Mitigated by loading only after file-picker intent, the service worker cache, Brotli and a size note.
- **Memory on mobile.** Large files can crash a tab, so a size cap and a warning are needed (Q7).
- **Encrypted or corrupt PDFs.** pdf-lib cannot open any encrypted file for editing, so every pdf-lib tool must detect `EncryptedPDFError` and say so plainly, and Protect and Unlock wait on Q8.
- **Malicious PDFs.** pdf.js must be 4.2.67 or later with `isEvalSupported: false` (CVE-2024-4367).
- **Trust.** Fake redaction or weak compression harms the brand, so both stay out until they can be done properly.
- **Test weight.** e2e needs fixture PDFs, which adds repo weight. Keep them tiny.
- **Budgets.** `/search/` and `search-terms.json` are effectively full (see the prerequisite in section 6).
