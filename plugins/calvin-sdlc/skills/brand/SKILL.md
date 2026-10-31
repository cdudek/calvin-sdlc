---
name: brand
description: >-
  OMR brand identity for everything designed outside the product: presentations and slide
  decks, whitepapers, reports and PDFs, ads, social posts, event and trade-fair graphics,
  posters, charts and illustrations, videos and motion graphics, and prompts for Canva,
  Figma, image or video generators. Holds the binding rules, the editorial palette, OMR One, all 34 OMR logos, decorations, patterns and highlight bars. Use when
  someone asks for OMR colours, fonts or logo rules, whether something looks on-brand, or wants
  a deck, social asset, graphic, video or print piece designed or reviewed. Triggers: "OMR
  Farben", "OMR Logo", "on-brand", "Corporate Design", "CI", "Präsentation", "Slide",
  "Social Post", "Grafik", "Video", "Whitepaper", "Briefbogen", "Purple", "Mint", "Yellow". Skip for anything that
  ends in code or shows a product surface: Vue or Tailwind UI, websites, dashboards, app
  mockups, design handoffs and token choices for omr-js, reviews-frontend or eventmanager use
  calvin-sdlc:design-system-apply instead.
user_invocable: true
metadata:
  version: "1.0.0-beta"
  source: "OMR Design Master v1 [BETA] (Claude Design artifact H3QyvnrQr7Z9fptjWLdtAX, export of 2026-10-05, formerly titled v0.99)"
---

Read `CLAUDE.md` in this skill first — it holds every binding rule in numbered sections §1–§13 (source hierarchy, briefing questions, colour routing, palette, logos, title slides, highlight bar, decoration, Störer, patterns, writing, self-check, worst-case test). Then read `readme.md`, the map of the system. Where the two disagree, `CLAUDE.md` wins. Then explore the other files:

- `styles.css` + `tokens/` — the token system (colour, type, spacing, radius, motion, list styles, highlight-bar metrics in `tokens/highlight.css`). Link `styles.css` to inherit every token and the `txt-*` / semantic colour / `rounded-*` utility classes. Dark values live in `tokens/colors-dark.css` and are opt-in.
- `components/` — reusable React primitives (`Button`, `BtnLink`, `Card`, `Chip`, `Badge`, `RatingStars`, `TextInput`, `Modal`, `Icon`). Each has a `.prompt.md` with usage.
- `guidelines/` — foundation specimen cards. Start with `color-routing.html` (which colour world applies) and `brand-logo-database.html`.
- `docs/` — `logos.md` (logo knowledge base), `components.md` (catalogue and repository index), `architecture.md` (naming, caveats), `briefpapier/` (letterhead specification).
- `patterns/`, `decorations/`, `graphics/` — reusable background patterns, decorative elements, and illustration assets.
- `logos/` — 34 lockups as SVG in `logos/svg/`, indexed in `logos/logo-index.js`. `assets/` — OMR mark and brand/social SVG glyphs.
- `assets/print-legacy/` — legacy print-production files (Illustrator/EPS/TIFF logos, static OMR Sans OTF/WOFF cuts) for print or non-web use cases. Prefer the SVG logos and the variable `fonts/OMROneVF.ttf` for anything digital.
- `fonts/` — OMR One variable font.
- `figma/` — Figma-exported token CSS for design-tool parity.

Layer boundary: this skill is the brand identity authority for collateral and marketing surfaces (decks, social assets, print, standalone visuals). For OMR product frontends (the Vue/Nuxt apps), the product design system is authoritative instead: invoke `calvin-sdlc:design-system-apply`, which loads the `omr-design-system` repo. Never port raw values from this skill into product code; product UI uses its own compiled semantic tokens.

If creating visual artifacts (slides, mocks, throwaway prototypes), copy assets out and produce static HTML files that link `styles.css` and load Lucide (`https://unpkg.com/lucide@0.544.0/dist/umd/lucide.js`) for icons. If working on production code, read the rules here to become an expert in designing with the OMR brand.

**Two colour worlds, decide first.** The system carries two separate palettes that are never mixed. **Default is Editorial & Advertising** (brand kit, only these eleven hex values: `#000000 · #8259ff · #00adad · #f2b200 · #8e7bff · #ada6fc · #33cccc · #80e0db · #f5c41c · #ffdb75 · #ffffff`) for presentations, slides, whitepapers, reports, PDFs, ads, social posts, event and trade-fair graphics, posters, charts, illustrations, videos and motion graphics, and templates for Canva, Figma, image and video generators; always output colours there as hex, token names only as a supplement. **Web & Product** (semantic UI tokens: `bg-surface`, `bg-surface-elevation-*`, `text-main`, `border-main`, `bg-primary-*`, status) applies **only** to websites, web apps, dashboards, website and app mockups, design handoffs, component specs and anything that ends in code. **Never carry a colour from one world into an asset of the other. If the asset type is unclear, ask before setting a colour.** The one exception: `bg-primary-subtlest` #f4f2ff and `bg-secondary-subtlest` #fef9e8 may appear in editorial assets, but only as box and surface backgrounds (callouts, cards, table rows, quote boxes), never for text, icons, lines, chart series or full-bleed backgrounds. Details: `guidelines/color-routing.html`, `readme.md` section "Two colour worlds", `CLAUDE.md` §3–§4.

Hard rules to honour (from OMR's own agent contract): semantic tokens only (never raw hex or primitive `--color-*`); `txt-*` for all type; the 4px spacing scale; radius by role from `tokens/layout.css`, mirroring `omr-js` core-ui (cards and inputs `rounded-sm`, buttons `rounded-md`/`rounded-lg` by size, chips `rounded-xs`); state-layer overlays for hover/press (never `hover:bg-grey`); sentence case; direct address (`du`/`you`); en-dash ranges; one brand emphasis per view; **gradients are an edge case — only ever create one when the user explicitly asks, never by default**; **maximise accessibility — every fg/bg pairing must meet a strong contrast ratio (WCAG AA floor) for high legibility**.

For presentations specifically: **the title-slide H1/title is ALWAYS set in ALL-CAPS** (use the `-extrabold-uppercase` display/headline styles), and **important words in headlines are marked with the OMR Highlight-Balken (highlight bar)** — sharp-cornered rectangle, **only in combination with all-caps**, single key words only, never body text. **One bar colour per visual: ~80% black or white** (white bars only on a black background; black bars on almost any background) and **~20% coloured** — Purple / Mint / Yellow **Strong**, each only on its own Light pendant background (e.g. Purple Light → Purple Strong). Text colour per contrast pairing. See `guidelines/text-emphasis.html`.

If the user invokes this skill without other guidance, ask what they want to build or design, ask a few clarifying questions, then act as an expert OMR designer who outputs HTML artifacts — or production code — depending on the need.
