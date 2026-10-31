# OMR Design System


An AI-readable design system for OMR — the Hamburg-based marketing media company behind the
OMR Festival, OMR Reviews, editorial content, podcasts and events. It packages OMR's real
design foundations (colour, type, spacing, radius, motion), reusable UI components and brand
assets, so an agent can generate on-brand OMR presentations, interfaces and assets.

## Start here

**`CLAUDE.md` holds every binding rule** — source hierarchy, briefing questions, colour
routing, palette, logos, title slides, highlight bar, decoration, Störer, patterns, writing,
self-check and worst-case testing, in numbered sections §1–§13. Read it before producing
anything. This README is a map, not a rulebook — where the two disagree, `CLAUDE.md` wins.

| File | What |
|---|---|
| `CLAUDE.md` | Binding rules §1–§13. Source hierarchy, colour routing, logos, title slides, highlight bar, decoration, patterns, writing, self-check. |
| `tokens/` | The only source for numeric values. Colour, spacing, radius, motion, font metrics, highlight bar. |
| `guidelines/` | Specimen cards. They render what the tokens say; they define nothing. |
| `components/**/*.prompt.md` | Per-component usage rules, one file per component. |
| `docs/components.md` | Component catalogue and repository index. |
| `docs/architecture.md` | Naming decisions, kit-coverage rationale, build caveats. |
| `styles.css` | Global entry point, `@import` list only. Consumers link this one file. |
| `docs/briefpapier/` | Letterhead specification (A4, OMR and OMR Reviews) with exact geometry in `briefbogen-referenz.js`. Letters are always A4 documents, never slides. |
| `docs/logos.md` | Logo knowledge base: brand architecture, decision tree, file naming. |

`_ds_bundle.js`, `_ds_manifest.json` and `_adherence.oxlintrc.json` are generated. Never edit
them by hand.

## Brand

OMR is one of the most important guides and gathering points in the digital space — online,
live, and in professional development. The voice is confident, direct and plain-spoken,
closer to a trade newsletter than to a SaaS brochure. German heritage is worn visibly (the
mark reads 'OMR' — simply OMR, nothing to spell out) but product copy is bilingual DE/EN.

Binding writing rules (`CLAUDE.md` §11): direct address (`du` / `you`), sentence case, no trailing periods on
buttons, no dashes, Genderstern, canonical date/money/percent formats. Specimen:
`guidelines/brand-voice.html`.

## Two colour worlds

The single most important routing decision in this system. Determine the asset type before
choosing any colour.

- **Web & Product** — websites, web apps, dashboards, mockups, anything that ends in code.
  Semantic UI tokens only (`bg-surface`, `text-main`, `border-main`, `bg-primary-*`). Brand
  purple `#7337fc`, ink `#0c0d0f`, surface `#fdfdfd`, mint `#00adad`.
- **Editorial & Advertising** — presentations, whitepapers, reports, ads, social, event
  graphics, charts, videos and motion graphics, and prompts for external tools. Eleven fixed hex values, purple is
  `#8259ff`. Always output hex, never token names: Canva, Figma and image generators cannot
  resolve tokens.

Never carry a colour from one world into the other. The one permitted exception is
`bg-primary-subtlest` `#f4f2ff` and `bg-secondary-subtlest` `#fef9e8` as box and surface
backgrounds in the editorial world — not for text, icons, lines or chart series. Routing table and palette: `CLAUDE.md` §3–§4. Usage: `guidelines/color-routing.html`,
`guidelines/color-editorial-kit.html`, `guidelines/color-editorial-usage.html`,
`guidelines/color-web-ui.html`.

## Presentations — title slides, chapter dividers, emphasis

Title slides and chapter dividers are the strongest appearance in a document and are **never
built in light tones**. Two equally valid standards, both full brand appearances:

| Variant | Background | Bar | Bar text | Rest of headline |
|---|---|---|---|---|
| **A** | `#000000` | `#8259ff` | `#ffffff` | `#ffffff` |
| **B** | `#8259ff` | `#000000` | `#ffffff` | `#ffffff` |

Without an explicit instruction the asset type decides: presentations, slides, event and
social assets take **A**; whitepapers, reports, PDFs and documents take **B**. If the asset
type is unclear, ask rather than guess. A chapter divider always repeats the title slide's
variant, background as well as bar. The `titelfarbe` tweak (`black` | `purple` | `white-bar`)
overrides the mapping, and any deviation from the standard is named in the result. Full rule:
`CLAUDE.md` §6.

Forbidden as a title-slide background: the light tones `#ada6fc`, `#8e7bff`, `#33cccc`,
`#80e0db`, `#f5c41c`, `#ffdb75`, and `#ffffff`; `#f2b200` and `#00adad` are not used as bar
colours there.

**Title-slide H1 is always all-caps.** Sentence case still governs body copy and inner-slide
headings.

**Headlines are always left-aligned with a ragged right edge** — never right-aligned, never
centred, never justified. The rule is enforced on every `txt-headline-*` and `txt-display-*`
class in `tokens/typography.css` (`CLAUDE.md` §11).

**Highlight bars mark the important words** — the OMR signature emphasis, only in all-caps,
only on single key words or one core statement in a headline, never in body text. The
geometry comes from `OMR_Highlightbalken.fig`, is measured into `tokens/highlight.css` and is
binding: cap block `0.745em` plus exactly `0.2025em` above and below gives a bar height of
`1.15em`; the headline sits at `1.353em`, so the `0.203em` gap to the neighbouring line falls
out on its own and is never set. One bar colour per visual.

Outside title slides the bar colour follows the background: on `#000000` the bar is `#8259ff`
or `#ffffff`; on `#8259ff`, on `#ffffff` and on every light tone it is `#000000`. On coloured
backgrounds the black bar is the reliable choice, coloured bars belong on black or white. Full
rules: `CLAUDE.md` §7, specimen `guidelines/text-emphasis.html`.

## Visual foundations (Web & Product)

**Type.** OMR One (variable, 400–800). Fluid `clamp()` scale in four families: label (UI
chrome, 2 % tracking), body (140 % leading), headline (120 % leading), display (hero,
uppercase-extrabold for brand statements). Baseline is `txt-body-m-regular` (16→18 px). Work
down from m, don't skip more than two steps in one view. `text-balance` on headlines,
`text-pretty` + `max-w-prose` on body.

**Spacing & layout.** 4 px base grid. Semantic layer: `page-gutter`, `section-spacing-*`,
`content-gap` / `inline-gap` / `tight-gap`, `inner-*` for card padding. Always a 12-column
grid at every breakpoint — widen content on mobile, don't drop columns. Prefer flex/grid with
`gap` over margins.

**Corners.** Tight and rectangular, mirroring `omr-js` core-ui. `rounded-sm` (4 px) for cards,
panels, inputs and listing cards (CardBox, ArticleCard, FormElements); buttons scale with size,
`rounded-md` (6 px) for xs/s and `rounded-lg` (8 px) for m/l; chips and badges `rounded-xs`
(2 px), interactive tag chips are pills; modals and toasts `rounded-lg`; speaker cards
`rounded-xl`. `rounded-3xl`/`4xl` only for large marketing surfaces outside the product. Fully
round only for genuinely circular elements (avatars, toggles, count badges). Nested radius must
be ≤ its container. Drop the radius on any edge stuck to the viewport. Role tokens:
`tokens/layout.css`.

**Depth.** OMR barely uses shadows. Depth is surface tier plus a hairline border: elevated
surface + 1 px `border-main` (`rgba(20,27,40,0.2)`) + radius. `border-subtle` for in-card
dividers, `border-strong` sparingly. Selection uses `border-selected`. The one soft shadow is
on floating overlays. Modal backdrops: `rgba(20,27,40,0.5)` + `backdrop-blur-xs`.

**Backgrounds.** Flat, near-white surfaces; step up the surface tier instead of adding
shadow. Marketing and event surfaces invert: near-black with a soft radial purple or yellow
glow behind hero content. No patterns or textures in product UI. Imagery full-bleed inside
rounded, clipped containers.

**Motion.** 100 / 150 / 200 / 300 ms; `ease-in-out` standard, `ease-out` decelerate,
`ease-in` accelerate. Functional only — colour, border, opacity, transform. No loops, no
bounce.

**Interaction states.** Hover, press and drag use semi-transparent state-layer overlays
(`state-layer-neutral` / `-primary` / `-neutral-inverse`), never a hardcoded `hover:bg-grey`.
Press deepens the overlay. Focus is a 2 px solid brand-dark outline
(`omr-focus-visible-outline`, `-inset` inside clipped containers). Disabled is 40 % opacity
ink / 5 % fill.

**Gradients.** An edge case. Colour is applied as flat fills. Only ever create a gradient
when explicitly asked. Depth comes from a surface tier or a single brand fill.

**Accessibility.** WCAG AA is the floor: ≥ 4.5:1 for body text, ≥ 3:1 for large text and
meaningful non-text elements. Contrast wins over decoration. This is why the logo and H1
pairings below are binding.

Dark theme is automatic — every token has a dark value, and elevation inverts (a higher tier
reads lighter).

## Iconography

Lucide (`lucide-vue-next` + `@lucide/lab`), re-exported from `@ramp106/omrjs-core-ui/icons`.
Stroke-based, `stroke-width: 2`, 24 × 24 viewBox, `currentColor`. In this system the `Icon`
component wraps Lucide, loaded from the UMD CDN per page. Colour by emphasis with
`text-icon-*`: main / subtle / subtlest match the equivalent text tone; `text-icon-primary`
(purple) and `-secondary` (yellow) are deliberate brand choices; status variants for
success, error and warning.

Custom brand and social glyphs (X, LinkedIn, Instagram, Facebook, YouTube, Spotify, TikTok,
WhatsApp, Xing, Apple Podcasts, Google, Amazon) ship as hand-made SVGs in `assets/social/`.
Add more from `omr-js/packages/core-ui/src/icons/customSvgIcons/` as needed. Emoji are not
used as iconography.

The OMR mark is `assets/omr-mark.svg` (white variant `omr-mark-white.svg`); the OMR Reviews
wordmark is `assets/omr-reviews-logo.svg` plus inverse.

## Brand assets

- **Logos** — 34 lockups (umbrella OMR, 12 brands, 21 products) as files in `logos/svg/`,
  indexed in `logos/logo-index.js`, browsable in `guidelines/brand-logo-database.html`.
  Horizontal and vertical, black and white. Establish the brand before
  placing a logo and ask if it is not stated; parent OMR is the default, including in a
  festival context. The colour version follows the background: white (WoB) on purple strong
  or medium, mint strong and black; black (BoW) on purple soft, mint medium and soft, all
  yellow steps and white. The same pairing governs H1 title colour. Specimen:
  `guidelines/brand-logo-database.html`.
- **Decoration** — 16 restrained decorations (kit numbers 01, 03…17) × left/right, the
  default way to give an OMR document character. One kind per slide, up to three instances of
  it, placed in the bleed at differing angles, never behind or over the headline or bar.
  Always two-coloured, both colours free from the nine brand-kit colours (purple, mint and
  yellow in strong · medium · soft) — no black, no white, never the background colour, never
  twice the same, at most two decoration colours per slide. On title slides and chapter
  dividers only 03, 04, 06, 07, 08, 11, 14, 16, 17 are released: 07, 08, 11 and 17 rotate
  freely, 03, 04, 06, 14 and 16 only in 45° steps. Rules: `CLAUDE.md` §8,
  `Decoration.prompt.md`, `guidelines/color-editorial-usage.html`.
- **GraphicElement** — 43 focus shapes ("Störer") × filled/outline, `currentColor`. Text on a
  Störer sits centred **inside** the shape with clear padding to its edge — roughly the
  central 60 % for pointed shapes, 75 % for round and square ones; if it cannot fit, enlarge
  the shape, shorten the text or drop the carrier pattern (`CLAUDE.md` §9).
- **BackgroundPattern** — 4 groups (Rising Squares, Floating Bulbs, Bubbles, Party Mix) ×
  filled/outline, placed subtly in the background, always exactly one shade off the
  background, never on black or white, never on title slides or chapter dividers. Text may
  sit over a pattern — check its colour against the background and the pattern colour. One
  group per design; filled and outline of the same group may combine, different groups never
  do (`CLAUDE.md` §10).

Decoration and pattern are never mixed: a design has either a subtle background pattern or it
is designed with decoration elements. Patterns are excluded from title slides and chapter
dividers. Specimen for all three categories: `guidelines/graphic-elements.html`.

## Components

Reusable React primitives (`.jsx` + `.d.ts` + `.prompt.md`), mounted via
`window.OMRDesignSystem_d9b3c2`, grouped under `components/`. Each component's own
`.prompt.md` holds its binding usage rules.

- **action/** — `Button`, `BtnLink`, `InlineLink`, `Fab`
- **forms/** — `TextInput`, `Textarea`, `Select`, `RichSelectField`, `Checkbox`, `Radio`,
  `RadioCard`, `ToggleSwitch`, `RangeSlider`
- **data-display/** — `Card`, `Badge`, `Tag`, `Chip`, `Avatar`, `RatingStars`, `Table`
- **navigation/** — `Tabs`, `Breadcrumbs`, `Pagination`, `Stepper`
- **feedback/** — `Alert`, `Toast`, `Tooltip`, `ProgressBar`, `Spinner`
- **overlay/** — `Modal`
- **layout/** — `Accordion`, `Divider`
- **media/** — `Icon`
- **decoration/** — `Decoration`
- **graphic/** — `GraphicElement`
- **pattern/** — `BackgroundPattern`
- **product/** — `ProductCard`, `PricingPlanCard`, `ArticleCard`, `SpeakerCard`, `EventCard`

Anatomy notes, the Figma-family mapping and the repository index: `docs/components.md`.

## Sources

Everything here is grounded in real OMR source material.

- `ramp106/omr-design-system` (private) — authoritative documentation of the foundations.
  Token values, decision rules and anti-patterns come from here.
- `omr-js` — the platform monorepo (Vue 3 + Tailwind v4). Component anatomy and exact numeric
  values come from `config-tailwind`, `core-ui`, `reviews-ui` and `events-ui`.
- `OMR_Highlightbalken.fig` — the reference geometry for the highlight bar, measured into
  `tokens/highlight.css` and `CLAUDE.md` §7.
- Fonts load from `https://static.omr.com/fonts/omrone/`, referenced in `tokens/fonts.css`.
  If that host is unreachable the stack falls back to Helvetica/Arial. Local binaries:
  `fonts/OMROneVF.ttf` (variable) and the static OMR Sans cuts plus print logos under
  `assets/print-legacy/`.

Build caveats and the rationale behind component naming and kit consolidation:
`docs/architecture.md`.
