# Architecture, naming and caveats

## Naming — confirmed intentional (adherence note)

An automated name check compares built component names against the literal Figma-kit family
names and reports the primitives below as "named after nothing in the kit". **This is
confirmed intentional.** The kit's family labels are Figma-internal strings (lowercase,
deprecated duplicates, `_helper` sub-parts, variant-set names like `button` /
`Button_deprecated` / `Form-elements`), while this system uses the canonical component
vocabulary of OMR's own product code (`omr-js/packages/core-ui`, `reviews-ui`, `events-ui`)
and its component specs (`omr-js/specs/components/`). Code names win over Figma layer names,
so a design generated here matches what engineering actually ships.

| Built component | Kit / spec family |
|---|---|
| `Button` | button · Button · Button_deprecated (all variant sets) |
| `BtnLink`, `InlineLink` | Link (button-style / inline) |
| `Fab` | FAB |
| `TextInput`, `Textarea`, `Select`, `RichSelectField`, `RangeSlider` | Form-elements (text · textarea · select · slider) |
| `Checkbox`, `Radio`, `RadioCard`, `ToggleSwitch` | Checkbox · Radio (+ Card) · Toggle-Switch |
| `Card` | Card |
| `Badge`, `Tag`, `Chip` | Chip / Tag / Badge (split by interactivity) |
| `Avatar` | Avatar · UserAvatar |
| `RatingStars` | Rating |
| `Table` | Table |
| `Tabs`, `Breadcrumbs`, `Pagination`, `Stepper` | Tab-Bar · Breadcrumbs · PaginationControl · Progress-stepper |
| `Alert`, `Toast`, `Tooltip`, `ProgressBar`, `Spinner` | Alerts/Message-Banner · Toast-Message · Tooltip · Progress |
| `Modal` | Modal |
| `Accordion`, `Divider` | Accordion · Divider |
| `Icon` | the ~437-glyph Lucide icon set (rendered live, not materialised) |
| `Decoration`, `GraphicElement`, `BackgroundPattern` | the 60 Grafik-Elements families, consolidated |
| `ProductCard`, `PricingPlanCard`, `ArticleCard`, `SpeakerCard`, `EventCard` | product composites from `reviews-ui` / `events-ui` |

No renames are pending. If a future kit version introduces official family names that differ,
rename then — not before.

**Intentional additions** (not 1:1 in the source specs, added for this HTML system):

- **Icon** — a thin Lucide wrapper, because the source uses Vue Lucide components that cannot
  run here; it gives designs access to the real Lucide glyph set.
- **Badge** vs **Tag** — **Badge** is a non-interactive information carrier (status label ·
  count · dot, never clickable), **Tag** is the interactive label (filter / select /
  removable). `Chip` is a legacy static label, superseded by the Badge status form.
- **RatingStars**, **Table** — ported from `reviews-ui` because they are core to Reviews.

## Figma-family coverage — what is intentionally not a separate component

The asset-library `.fig` reports ~2,100 "component families", but that count is inflated by
material that should not become design-system primitives:

- **Internal `_helper` sub-parts** (`_Box`, `_Cell`, `_Digitbox`, `_Slider handle`,
  `_Modifier`, `_Star`, …) — private building blocks, folded into the built components.
- **Duplicated and deprecated button/select sets** — many historical `button` / `Button` /
  `Button_deprecated` variant sets (720/918/1080 variants each) all resolve to the single
  semantic **Button**.
- **Abstract illustrations** (`Abstract 1–19`, `Arc`, decorative shapes) — brand art, not UI
  primitives.
- **The ~437-glyph icon set** — OMR's Lucide library plus custom brand glyphs. Rather than
  materialise 437 near-duplicate files, **Icon** renders them live from Lucide; custom brand
  and social glyphs live in `assets/social/`.
- **Full-page product surfaces** (`Cover`, `ContentBlocker`, `Footer`, `Navigation`) — compose
  them from the primitives. The composite cards themselves are shipped in
  `components/product/`.

## Grafik-Elements kit — 60 families as 3 consolidated components

The Grafik Elements Figma file defines 60 component families: 17 `Decoration NN` (×
left/right), 34 `Graphic *` sets plus 9 standalone `Graphic *` (× filled/outline), and the 4
Background-Pattern groups. Following the same pattern as **Icon**, they are not shipped as 60
near-duplicate files. Every family is implemented, keyed by slug, inside three data-driven
components:

- **`GraphicElement`** (`components/graphic/`) — all 43 `Graphic *` families (filled +
  outline), data in `graphics/graphics-data.js`.
- **`Decoration`** (`components/decoration/`) — the `Decoration NN` families (left + right),
  data in `decorations/decorations-data.js`. The data carries kit numbers 01 and 03…17;
  element 02 is missing from the source file and is unusable until clarified (`CLAUDE.md` §8).
- **`BackgroundPattern`** (`components/pattern/`) — all 4 pattern groups (filled + outline),
  data in `patterns/patterns-data.js`.

An adherence check that counts one built component per Figma family name will report these 60
families as "not built as separate components" — intentional: the coverage is complete, the
packaging is consolidated, exactly as for the Lucide icon set.

## Caveats

- **Fonts load from OMR's public CDN** (`static.omr.com`). If that host is unreachable the
  stack falls back to Helvetica/Arial. There are no local font binaries in this project.
- The `omr-design-system` repo docs describe additional foundations still marked *todo*
  (elevation, full effects/opacity/blur); those areas are inferred here from token values and
  product code.
- The data files behind the graphic components are large (`decorations` ~350 KB, `graphics`
  ~359 KB, `patterns` ~282 KB). They ship in every consumer's bundle.
- Element 16 is flagged as an open point in `CLAUDE.md` §8: it was called unsuitable for
  slides and is back on the release list. Decide before the next build.
- The highlight bar relies on `text-box: trim-both cap alphabetic`. In engines without that
  property the vertical trim does not apply; no fallback compensation is set, deliberately,
  because a second vertical rule is what previously broke the geometry.
