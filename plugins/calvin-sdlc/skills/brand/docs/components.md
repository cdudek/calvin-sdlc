# Components & repository index

Reusable primitives (React, `.jsx` + `.d.ts` + `.prompt.md` + card HTML), mounted via
`window.OMRDesignSystem_d9b3c2`. Each component's own `.prompt.md` holds its binding usage
rules.

## Catalogue

- **action/** — **Button** (semantic `variant × intent × size`), **BtnLink** & **InlineLink**
  (link affordances), **Fab** (floating action button).
- **forms/** — **TextInput**, **Textarea**, **Select**, **RichSelectField** (search · multi ·
  clearable · validation), **Checkbox**, **Radio** & **RadioCard**, **ToggleSwitch**,
  **RangeSlider**.
- **data-display/** — **Card**, **Badge** (info: status/count/dot, not interactive), **Tag**
  (interactive: filter/select/removable), **Chip** (legacy static label), **Avatar**,
  **RatingStars**, **Table**.
- **navigation/** — **Tabs**, **Breadcrumbs**, **Pagination**, **Stepper**.
- **feedback/** — **Alert** (message banner), **Toast**, **Tooltip**, **ProgressBar**,
  **Spinner**.
- **overlay/** — **Modal** (blocking dialog, blurred backdrop).
- **layout/** — **Accordion**, **Divider**.
- **media/** — **Icon** (Lucide wrapper).
- **decoration/** — **Decoration** (16 decorations × left/right; nine-colour two-slot rule;
  title-slide allow-list without element 16).
- **graphic/** — **GraphicElement** (43 focus shapes × filled/outline, `currentColor`).
- **pattern/** — **BackgroundPattern** (4 pattern groups × filled/outline; one-shade colour
  rule).
- **product/** — **ProductCard** (Reviews listing), **PricingPlanCard**, **ArticleCard**
  (editorial), **SpeakerCard** & **EventCard** (Festival). Higher-level composites that
  assemble the primitives above for OMR's real product surfaces.

These map onto the OMR asset-library Figma families and OMR's own component specs
(`omr-js/specs/components/`): Button, Link, Card/ProductCard, Chip/Tag/Badge, Rating,
Checkbox, Radio(+Card), Toggle-Switch, Form-elements (text/textarea/select/slider), Tab-Bar,
Breadcrumbs, PaginationControl, Progress-stepper, Alerts/Message-Banner, Toast-Message,
Tooltip, Modal, Accordion, Divider, Avatar/UserAvatar, Table, FAB, Icon-wrapper.

## Repository index

| Path | What |
|---|---|
| `styles.css` | Global entry point — `@import` list only. Consumers link this one file. |
| `tokens/fonts.css` | `@font-face` — OMR One (CDN). |
| `tokens/primitives.css` | Raw colour palette (Layer 1). Never use directly. |
| `tokens/colors.css` | Semantic colour tokens (light + `[data-theme="dark"]`). |
| `tokens/typography.css` | Font vars + fluid `txt-*` utility classes. |
| `tokens/highlight.css` | Highlight-bar geometry and OMR One font metrics. The only source for those values. |
| `tokens/layout.css` | Radius, motion, z-index tokens + `rounded-*` classes. |
| `tokens/utilities.css` | Semantic colour utility classes, state layers, focus, backdrop. |
| `tokens/base.css` | Reset + element defaults (body, links, selection). |
| `components/**` | Reusable primitives, grouped as above. |
| `logos/**` | 34 logo lockups as SVG files in `logos/svg/`, index `logos/logo-index.js`. |
| `graphics/**`, `decorations/**`, `patterns/**` | SVG-markup data maps (`*-data.js`) backing `GraphicElement` / `Decoration` / `BackgroundPattern`. |
| `guidelines/**` | Foundation specimen cards (Colors, Type, Spacing, Brand — incl. logo, colour-usage and graphic-element rules). |
| `docs/briefpapier/` | Letterhead specification (`spezifikation.md`) and the exact geometry of the OMR and OMR Reviews letterheads (`briefbogen-referenz.js`). Rule in `CLAUDE.md` §3b. The canvas templates exist only in Claude Design. |
| `assets/**` | Logos (`omr-reviews-logo*`, `omr-mark*`) and brand/social SVGs (`social/`). |
| `SKILL.md` | Agent-skill manifest (for use as a downloadable skill). |

The compiler generates `_ds_bundle.js`, `_ds_manifest.json` and `_adherence.oxlintrc.json` —
never edit those by hand.
