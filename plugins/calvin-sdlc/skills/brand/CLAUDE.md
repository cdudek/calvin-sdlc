# CLAUDE.md — binding rules of the OMR Design System

This file holds the rules that apply to **every** job. They are written as conditions, not
as hints. An asset produced without these steps counts as unfinished.

Reference and background live elsewhere: the component overview and repository index in
`docs/components.md`, architecture and naming decisions in `docs/architecture.md`, specimens
in `guidelines/`. Those files are for looking things up. Only what is written here is binding.

---

## 1 · Source hierarchy

1. `tokens/` is the only source for numeric values. Colours, spacing, radii, font metrics.
2. `CLAUDE.md` is the only source for rules and conditions.
3. `guidelines/*.html` renders only what 1 and 2 say. Cards define nothing.

A value in a guideline card that is not in `tokens/` is an error. It is reported, not used.
When two sources contradict each other, the higher level wins and the contradiction is named
in the result.

**No estimated values.** A value is never estimated, interpolated or taken from a comment.
If a required value is missing from `tokens/`, the asset is not built; the missing value is
named and asked for. Values marked "≈", "ca." or "TBD" count as missing.

---

## 2 · Clarify the brief before the first pixel

**First: is it a letter?** If a trigger from §3b applies, §3b applies exclusively. Of the
questions below only the brand remains. Asset type and background are set by the letterhead
and are not asked.

Four questions, always, answered from the brief instead of guessed:

0. **Is there a fixed template for this kind of job?** Today that is the letterhead only
   (§3b, `docs/briefpapier/spezifikation.md`). If so, the template is rebuilt and nothing is
   redesigned.
1. **Which OMR brand is the asset for?** If the brief does not say, ask. A default logo is
   never inserted. The question is always asked in this wording and this order (verbatim, in
   German, because that is the language of the people asking):

   > Welches Logo soll verwendet werden
   > 1. OMR
   > 2. OMR Reviews
   > 3. OMR Education
   > 4. Andere: z. B. OMR Festival, Podcast, 5050 etc.

   On answer 4, ask for the exact lockup and look it up in
   `guidelines/brand-logo-database.html`. Without an answer no logo is set.
2. **Which asset type?** It decides the colour world (section 3). If the type is unclear, ask.
3. **Which background colour?** Logo version, H1 colour, text colour, bar colour and pattern
   colour follow from it by necessity. They are not chosen separately.

---

## 3 · Colour-world routing

There are two colour worlds. They are never mixed. The default is colour world 2.

**Only colour is separated.** Shape, radius, spacing, typography, labels, lists and depth via
surface tiers are one shared system and apply identically in both colour worlds (section 3a).
An editorial asset looks like the UI system, just in the editorial palette.

| Asset type | Colour world |
|---|---|
| Presentations, slides, keynotes | 2 · Editorial |
| Whitepapers, reports, PDFs | 2 · Editorial |
| Ad assets, ads, social posts | 2 · Editorial |
| Event and trade-fair graphics, posters | 2 · Editorial |
| Charts, data visualisation, illustrations | 2 · Editorial |
| Videos, motion graphics, bumpers, social clips | 2 · Editorial |
| Templates for Canva/Figma, prompts for AI image and video generators | 2 · Editorial |
| Websites, web apps, landing pages | 1 · Web & Product |
| Dashboards | 1 · Web & Product |
| Website and app mockups | 1 · Web & Product |
| Design handoffs, component specs, anything that ends in code | 1 · Web & Product |
| Letters and official correspondence (triggers in §3b) | none, letterhead specification §3b |
| Not clearly assignable | ask, set no colour |

**Colour world 1 — Web & Product.** Semantic UI tokens (`bg-surface`, `text-main`,
`border-main`, `bg-primary-*`, status). In code always the token, never the hex value. No
brand-kit values in product UI.

**Colour world 2 — Editorial & Advertising.** Only the eleven values from section 4. Always
output as hex, token names only in brackets. External tools, Canva, Figma and image
generators cannot resolve token names.

**Exception 1.** `bg-primary-subtlest` #f4f2ff and `bg-secondary-subtlest` #fef9e8 may also
be used in colour world 2, exclusively as box and surface backgrounds (callouts, cards, table
rows, quote boxes). Not for text, icons, lines, chart series or full-bleed backgrounds.

**Exception 2 — structure is grey, not black.** Outlines, frames, dividers, table rules and
comparable structural elements are **not set in #000000**. A black outline around a box or a
black table rule counts as an error and is corrected. Structure carries the neutral tones of
the UI kit; black stays reserved for text, surfaces and bars.

Binding assignment:

| Element | Value |
|---|---|
| Frame, box outline, card edge | Grey 200 #dfe1e5 |
| Divider in body copy, row rule in tables | Grey 150 #ebecef |
| Header underline, emphasised separation | Grey 250 #d0d3d9 |
| Zebra cell surface, card and callout surface | #f8f9fb, #f3f4f6 or the two subtlest from exception 1 |
| Table header surface | #f3f4f6 |
| Secondary text, units, footnotes, sources | Grey 500 #6c7380 |
| Disabled, very low priority | Grey 400 #9197a3 |

Further permitted neutral values: `bg-solid` #ffffff, Grey 25 #fdfdfd, `-1` #f8f9fb,
`-2` #f3f4f6, `-3` #ebecef, `-4` #dfe1e5, `-5` #d0d3d9.

Hierarchy comes first from surface and spacing, only then from lines. Where a zebra surface
or white space carries the structure, the line is left out. Line weight is 1 px, at most 2 px
in large formats; no double frames, no frame around a surface that already has a coloured
background.

The neutral tones are never a headline, surface, accent or chart-series colour. Body copy
and headings stay #000000 or #ffffff; Grey 500 and Grey 400 are permitted only for secondary
text and only on a light background.

**Exception 3 — labels, flags and list markers follow the UI standard.** The three forms
from section 11.1 and the list markers from section 11.2 apply in both colour worlds. The
status flag may use the UI status pairs (`bg-*-subtle` with `text-*`) in a slide, PDF or ad
asset too, because it communicates a state. Only for that, not for surfaces, accents,
headlines or chart series.

No further token follows these exceptions.

---

## 3a · Shape and space are system-wide

Radii and spacing come from `tokens/layout.css` in both colour worlds. There is no separate
editorial geometry. A square-cornered container in editorial counts as an error.

**Radius by role**

| Element | Token | Value |
|---|---|---|
| Chips, badges, count badge | `--radius-chip` → `--radius-xs` | 2 px |
| Buttons xs and s | `--radius-button-compact` → `--radius-md` | 6 px |
| Buttons m and l | `--radius-button` → `--radius-lg` | 8 px |
| Tag chips (interactive, removable) | `--radius-pill` → `--radius-full` | full |
| Inputs, swatches, small tiles, image markers | `--radius-control` → `--radius-sm` | 4 px |
| Cards, boxes, callouts, quote boxes, table, chart and image containers | `--radius-card` → `--radius-sm` | 4 px, like `core-ui` CardBox |
| Large marketing containers, image surfaces in social and posters | `--radius-surface-lg` → `--radius-3xl` | 24 px |
| Hero surfaces | `--radius-hero` → `--radius-4xl` | 32 px |
| Counters, dots, avatars | `--radius-pill` → `--radius-full` | full |

**Without rounding** remain only: the page or slide itself and full-bleed backgrounds, the
highlight bar (section 7, source `OMR_Highlightbalken.fig`) and the bullet square (section
11.2). Logos and Störer bring their shape from the file.

**Rules**

1. The radius follows the role, not the size. A card on a 1920 px slide carries
   `--radius-card` as in the UI. If a container looks too sharp in a large format, the next
   step of the scale is chosen, never an in-between value.
2. Nested: the inner radius is never larger than the outer one.
3. Tables and charts sit in a rounded container; the cells inside stay square.
4. Depth comes from surface tiers (`#f8f9fb`, `#f3f4f6`, subtlest from exception 1), never
   from shadows. The same holds in the UI.

**Spacing** follows the 4 px scale `--spacing-*`. The standard inner padding of a card is
`--spacing-4` 16 px; in large formats the next step of the scale, never a free value.

---

## 3b · Letters: the letterhead is rebuilt, not designed

The letterhead is a rule, not a stencil. Nobody looks for a template and fills it in. Once a
letter job is recognised, the letterhead is rebuilt completely from the specification: logo,
pattern, field positions, font sizes, footer. Nobody asks whether a template should be used,
and nothing is designed freely.

**Triggers.** The rule applies automatically as soon as the brief asks for one of these:
letter, cover letter, official or formal correspondence, confirmation, termination, offer
letter, contract cover letter, letter to an authority, legal letter, or any document with a
recipient address, a subject line and a closing salutation.

**Precedence.** A letter is never designed from the general editorial rules. On conflict the
letterhead specification wins, also over `tokens/` and the other sections of this file. The
conflict is named in the result.

**Two templates, assigned by brand.** The brand decides, not the occasion.

| Template | Applies to | Logo | Sender and legal entity | Pattern |
|---|---|---|---|---|
| REVIEWS | OMR Reviews only | OMR Reviews wordmark, 125 × 17 pt at 431 / 39 pt | Software Reviews GmbH | filled staircase shape plus outline elements |
| OMR | OMR and every other brand of the group: Festival, Education, Jobs & HR, Services, Crew, 50 50, Frames, X, Y | OMR wordmark, 95 × 29 pt at 460 / 39 pt | ramp106 GmbH | outline bubbles top right and bottom left |

If the brand is not in the brief, ask with the question from §2. Answer 2 gives REVIEWS, any
other answer gives OMR. Never assume a template as default. A document carries exactly one
brand, never mixed. The assignment is binding even when the sub-brand has a logo of its own:
the letterhead carries the template's wordmark because the footer names the legal entity and
the two belong together.

**Specification.** Positions, font sizes, line heights, pattern coordinates and fixed texts
are in `docs/briefpapier/spezifikation.md`. It is the leading source; the leading source file
is `OMR_letter_paper.fig`. The exact geometry of both letterheads is kept as a reference in
`docs/briefpapier/briefbogen-referenz.js` and is used for the rebuild, not traced.

**Templates.** The two letterheads `OMR Brief` and `OMR Reviews Brief` exist as fixed canvas
templates only in Claude Design (under `templates/` there). This skill does not ship them. A
letter is rebuilt here from `docs/briefpapier/spezifikation.md` and the reference geometry in
`docs/briefpapier/briefbogen-referenz.js`; there is no second copy of the values. The
letterhead is an A4 page (210 × 297 mm portrait, `@page` A4 without margin, PDF export). The
A4 page container is never removed, scaled, set in another format or embedded in a slide, web
page or canvas. If the result deviates from the format, the letter counts as unfinished.

**Output form: an A4 document, mandatory.** Every requested letter is created by default as
a print-ready A4 document, without asking and even when the brief names no format: one page
210 × 297 mm portrait, white, exportable as PDF, based on `docs/briefpapier/spezifikation.md`.
Never as a slide, web page, e-mail, card, canvas artboard, image or responsive layout, never
in Letter, A5 or landscape. Another format only on explicit instruction in the brief, and the
deviation is named in the result.

A4 portrait, 210 × 297 mm, white. No other format. Variable are exclusively the recipient
address, contact person, place and date, subject line and body copy. Everything else is
fixed. No element is added.

**Check.** For a letter this check replaces the self-check from §12. The writing rules from
§11 still apply.

a. Was the letter job recognised and the letterhead rebuilt without asking back?
b. Which brand, which template, and do logo, legal entity and legal line belong to the same
   legal person?
c. Name the page format in mm. Target 210 × 297 portrait, created as an A4 document
   (print-ready page, PDF export), not as a slide, web page or image.
d. Name the positions of logo, subject line, top edge of the body copy and legal line and
   compare them with the specification. Deviation zero.
e. Confirm that no element was added that is not in the template.

Then the eight numeric checks from `docs/briefpapier/spezifikation.md` §10, each one
individually.

---

## 4 · Palette of colour world 2

| Hex | Token | Role |
|---|---|---|
| `#000000` | black | Text, headlines, surfaces, bars |
| `#ffffff` | white | Surfaces, text on dark, bars on black |
| `#8259ff` | primary-strong | Main accent, bars, main chart series |
| `#8e7bff` | primary-medium | Chart series, surfaces, Störer |
| `#ada6fc` | primary-subtle | Surface, chart series |
| `#00adad` | tertiary-strong | Second accent, chart series |
| `#33cccc` | tertiary-medium | Chart series, surfaces |
| `#80e0db` | tertiary-subtle | Surface, chart series |
| `#f2b200` | secondary-strong | Signal accent, chart series |
| `#f5c41c` | secondary-medium | Surfaces, chart series, Störer |
| `#ffdb75` | secondary-subtle | Surface, chart series |

The editorial purple is **#8259ff**. Not #7337fc, not #601ee3. Those two belong to the web
colour world.

**Text colour.** Text is #000000 or #ffffff, by contrast to the background. No exceptions in
headlines, body copy, sublines or captions. Coloured text is permitted for: numbers and
labels that take the colour of their chart series; large key figures where the number is the
design element; labels, flags and status chips per UI standard (section 11.1); bullets, list
numbers and their badges (section 11.2).

**Forbidden pairings.** No #000000 on #8259ff, #8e7bff or #00adad. No #ffffff on #f2b200,
#f5c41c, #ffdb75, #ada6fc, #33cccc or #80e0db. Contrast at least WCAG AA (4.5:1 for body
copy, 3:1 for large type and meaning-carrying non-text elements).

**Colour budget per slide.** One surface colour, one accent colour, neutral as much as
needed, data colours only where there is data. So at most two chromatic colours, the second
only with data. No gradients. No drop shadows.

Not counted against the colour budget: bullets and list numbers (section 11.2), label and
flag surfaces as well as status colours (section 11.1). They are UI chrome, not design. More
than four label surfaces on one surface are still not set.

---

## 5 · Logos

Before a logo is placed, the brand must be clarified (section 2). One logo per asset. The
umbrella brand `omr` is the default, also in a festival context. The dedicated festival logo
only on explicit instruction.

Colour version and H1 colour follow the same rule:

| Background | Logo and H1 |
|---|---|
| Purple Strong / Medium | White (WoB) |
| Purple Soft | Black (BoW) |
| Mint Strong | White (WoB) |
| Mint Medium / Soft | Black (BoW) |
| Yellow, all steps | Black (BoW) |
| White | Black (BoW) |
| Black | White (WoB) |

A black logo or a black H1 on Purple Strong, Purple Medium or Mint Strong is never permitted.

**Inventory.** 34 lockups live in `logos/svg/` as `<slug>_<black|white>_<h|v>.svg`, the
index in `logos/logo-index.js`, the overview in `guidelines/brand-logo-database.html`, the
long form of the rules in `docs/logos.md`. The umbrella brand OMR (`omr`) is there as well,
horizontal only. Logos are placed as files; there is no logo component any more.

**Brand or product.** A filled box means brand, an outlined box means product or service
under a brand. The box logic is the brand hierarchy and is never swapped. 12 brands, 21
products. OMR Podcast is a product, not a brand. Podstars by OMR is never served from this
inventory.

**Orientation.** Horizontal is the standard. Vertical only when the format demands it, such
as narrow columns, square tiles, portrait format. Not for reasons of taste. OMR X exists
horizontally only.

**Place unchanged.** Scale the original file proportionally. No recolouring beyond black and
white, no effects, no rotating, mirroring, cropping or masking, no rebuilding of the lockup
from mark plus typed text. The inner spacing between wordmark and box is part of the file.

---

## 6 · Title slides and chapter dividers

Never in light tones. They are the strongest appearance in the document.

**Two equally valid standards**

| | Background | Bar | Bar text | Rest of headline |
|---|---|---|---|---|
| A | `#000000` | `#8259ff` | `#ffffff` | `#ffffff` |
| B | `#8259ff` | `#000000` | `#ffffff` | `#ffffff` |

Neither is the exception. Without a tweak the asset type decides: presentations, slides,
event and social assets → A. Whitepapers, reports, PDFs, documents → B.

**Tweak** `titelfarbe: black | purple | white-bar`
`black` = A, `purple` = B, `white-bar` = background #000000, bar #ffffff, bar text #000000.
`white-bar` only on explicit instruction, when A feels too quiet.

**Forbidden on title slides and chapter dividers.** Light tones as background (#ada6fc,
#8e7bff, #33cccc, #80e0db, #f5c41c, #ffdb75), not even with their darker counterpart as the
bar. Likewise #ffffff as background and #f2b200 and #00adad as bar colour. No background
patterns.

**Chapter dividers** always take the same variant as the title slide of the same document,
background as well as bar. No switching within a document.

**The H1 on the title slide is always in capitals.** Without exception. Sentence case still
applies to body copy and headings on content slides.

---

## 7 · Highlight bar

### 7.1 Principle

The leading source is `OMR_Highlightbalken.fig`.

**The bar height is not derived from the line height.** It follows from the padding: cap
block 0.745 em plus exactly 0.2025 em above and below gives 1.15 em. The headline sits at
1.353 em. The gap of 0.203 em to the neighbouring line falls out of that and is never set.

There is therefore no clearance value, no slack deduction, no offset and no line-spacing
allowance.

### 7.2 Font metrics OMR One

Measured on `OMROneVF.woff2` at `wght 800`, upm 1000. These values live in
`tokens/highlight.css` and are not estimated.

| Value | em |
|---|---|
| Cap height | 0.745 |
| Top of diacritics (Ä Ö Ü) | 0.996 |
| typoAscender | 1.038 |
| typoDescender | 0.315 |
| lineGap | 0 |
| intrinsic line height | 1.353 |
| Stem | 0.171 |

`USE_TYPO_METRICS` is set, the typo values apply. The cut is called **OMR One Extrabold**,
not "OMR Sans Extra-Bold".

### 7.3 Geometry

All values relative to the font size, stored in `tokens/highlight.css`. Guideline cards and
assets define no values of their own.

| Size | Value |
|---|---|
| Line height headline | 1.353 em (font-intrinsic) |
| Spacing between lines | 0 |
| `line-height` inside the bar | 1 |
| Padding top / bottom | 0.2025 em |
| Padding left / right | 0.159 em |
| Bar height without diacritics | 1.15 em (result: 0.745 + 2 × 0.2025) |
| Bar height with diacritics | 1.277 em (result) |
| Extra top padding with diacritics | 0.127 em |
| Distance cap top to bar top | 0.2025 em |
| Distance baseline to bar bottom | 0.2025 em |

**Rules**

1. The bar is anchored to the cap block, not centred in the line box. The line box centres on
   ascender plus descender and sits 0.022 em too low. There is no offset and no centring
   calculation.
2. Trimming uses `text-box: trim-both cap alphabetic`. The padding of 0.2025 em above and
   below sits on top of that. There is exactly one vertical rule, no second compensation
   beside it. Do not readjust. The two measured distances must match, tolerance 1 px per
   side.
3. Line spacing: none. Between two bars on neighbouring lines 0.203 em remain automatically.
   This value is not set, it falls out.
4. Diacritics: if the bar text contains a character above cap height (Ä Ö Ü, accents), the
   bar gets 0.127 em extra padding at the top. Bottom and sides unchanged. The larger bar
   height of 1.277 em still stays below the line height of 1.353 em, so the line spacing is
   not increased for umlauts either.
5. Word spacing is the font's normal space (0.19 em). The bar padding of 0.159 em is added on
   top and is never taken out of it. No additional outer margin on the bar: it would break
   the text edge at the start and end of a line.
6. All values are multiples of the font size and scale with it. No fixed pixel values.

### 7.4 Setting

The bar sits on the most important word or on the main statement of the headline. Capitals
only, never in mixed case, never in body copy. One bar colour per visual.

A bar may wrap. If the bar statement wraps, two independent bars result, one per line, each
with the full geometry from 7.3 and the diacritics allowance only where diacritics occur. No
continuous bar across two lines. The break sits at a word boundary, both bars start on the
left text edge, at most two lines per statement. The break is set as soon as pulling the
statement closed into the next line would leave a gap at the line end that is clearly wider
than one word of the headline. If three lines would be needed, shorten to the core word.

Bars on several lines are permitted and never touch under this geometry.

### 7.5 Bar colour outside title slides

On title slides and chapter dividers section 6 applies. Otherwise:

| Background | Bar | Bar text |
|---|---|---|
| `#000000` | `#8259ff` or `#ffffff` | `#ffffff` or `#000000` respectively |
| `#8259ff` | `#000000` | `#ffffff` |
| `#ffffff` | `#000000` | `#ffffff` |
| Light tones | `#000000` | `#ffffff` |

On coloured backgrounds the black bar is the most reliable choice. Coloured bars belong on
black or white.

---

## 8 · Decoration elements

17 elements per the kit, each left and right. The data holds 16 families, kit numbers 01 and
03 to 17. **Element 02 is missing from the source file** and is unusable until clarified. It
is on no release list, so it blocks nothing.

Decorations sit at the edge or in a corner, never in the foreground, never behind or over
the headline, bar or central motif.

**Release for title slides and chapter dividers**

| Released | Rotation |
|---|---|
| 07, 08, 11, 17 | freely rotatable |
| 03, 04, 06, 14, 16 | in 45° steps only |

All other elements are not permitted on title slides and chapter dividers. For other asset
types there is no restriction.

> Open point: element 16 was at one point declared unsuitable for slides and is now back on
> the release list. Decide before the next build.

**Colour.** Every element is two-coloured, both colours free from the nine brand-kit colours
(#8259ff, #8e7bff, #ada6fc, #00adad, #33cccc, #80e0db, #f2b200, #f5c41c, #ffdb75). Every
combination is allowed, within a family as well as across families. Contrast between the two
colours is allowed and welcome, but not required.

Binding:

1. Only these nine colours. No #000000, no #ffffff, neither as fill nor as outline.
2. Neither of the two colours may equal the background colour. Otherwise the affected part
   becomes invisible. Check before setting.
3. The two colours are never identical.
4. At most two colours per element, at most two decoration colours per slide.

**Colour tweak.** The tweak chooses the combination, not a single uniform colour. The element
has two colour slots A and B. On clicking a swatch:

1. Slot A takes the clicked colour.
2. Slot B keeps its colour family. The step within the family may be adjusted.
3. Slot B changes family only if A and B would otherwise be identical or if B equals the
   background colour.
4. A and B differ after every tweak.
5. Neither A nor B equals the background colour after the tweak.

Example: before Mint Strong + Yellow Soft, click on Purple → Purple Strong + Yellow Strong.
Not Purple Strong + Purple Strong, never everything in one colour.

---

## 9 · Störer (graphic elements)

43 shapes, filled and outline, `currentColor`. Used as content carriers (list numbers), as
building blocks for patterns of your own, as a soft overlay over an image or strongly
enlarged as a layout divider.

**Large numbering is the standard case of the content carrier.** A single large number above
a box or column sits in the `super-nova`, geometry and colours per section 11.2. Small
numbered lists carry the bare digit instead. Another shape carries a number only on explicit
instruction.

**Text on a Störer always sits inside the shape.** Centred, with clearance to the edge, within
the safe inner area: roughly the central 60 % for pointed shapes (Super-Nova, star), roughly
75 % for round and square shapes. Only very short content, a number or a short word.

If the text does not fit with sufficient clearance, it is not forced in. Instead: enlarge the
shape, shorten the text, or drop the carrier pattern and set the text as normal type beside or
below it. A Störer with overflowing text is never acceptable.

---

## 10 · Background patterns

Four groups: Rising Squares, Floating Bulbs, Bubbles, Party Mix. Subtle in the background,
never intrusive in the foreground.

1. The pattern colour is exactly one step away from the background colour. Purple Strong →
   Purple Medium, Purple Soft → one step darker, and so on for every family.
2. Never on black or white.
3. Never on title slides or chapter dividers.
4. Only one group per design. Filled and outline of the same group may be combined, different
   groups never.
5. Text may sit over a pattern; that is the intended use. The text colour is checked against
   background **and** pattern colour, both must meet the contrast requirement. If one of the
   two fails, the area behind the text stays pattern-free.

---

## 11 · Text

Direct address: German "du", always lowercase, never "Sie". English "you".

**Alignment.** Headlines are **always left-aligned with a ragged right edge**. Never
right-aligned, never centred, never justified. This applies equally to title slides, chapter
dividers and content slides, also to headlines with a highlight bar. The rule lives in
`tokens/typography.css` on all `txt-headline-*` and `txt-display-*` classes.

Sentence case everywhere, never Title Case. The only exception: capitals for short labels,
brand statements, highlight bars and the H1 of the title slide.

### 11.1 Labels and flags

The label classes from `tokens/typography.css` (`txt-label-s-*`, `txt-label-m-*`) apply in
both colour worlds. Size, line height, weight and the tracking of 2 % stay unchanged; there
is no separate editorial label size.

**Labels and flags follow the UI/UX standards, also in editorial assets.** There are three
forms, each with a fixed colour pair:

| Form | Surface | Text |
|---|---|---|
| Solid chip | Brand-kit colour | #000000 or #ffffff by contrast |
| Quiet chip | #f4f2ff, #fef9e8, #f3f4f6 | #000000 |
| Status flag | `bg-success-subtle`, `bg-warning-strong`, `bg-error-subtle` | `text-success` #065f4f, `text-warning` #824a11, `text-error` #b91740 |

The status flag is the one place where the UI status tokens are permitted in colour world 2
as well, because they communicate a state and are not a design device. In editorial assets
their values are output as hex, token names only in brackets. For surfaces and accents the
eleven values from section 4 remain: no #7337fc, no #601ee3.

Coloured label text is limited to the status pairs and the chart reference. Purple #8259ff is
not a label text colour; it reaches 4.5:1 on no subtle surface. Radius per
`tokens/layout.css`, `--radius-xs` for chips, `--radius-full` only for counters and dots. The
prohibitions from section 4 still apply: no #ffffff on a light tone, no #000000 on Purple
Strong, Purple Medium or Mint Strong.

### 11.2 Bullets and numbering

Values in `tokens/lists.css`.

**Bullet lists carry a small square in Purple Strong #8259ff.** No dot, no dash, no tick, no
icon. Square side 0.42 em of the text size, no rounding, distance to the text 0.62 em, indent
1.04 em. The marker sits on the cap centre of the first line, not on the line centre:
`0.5lh − marker height/2 − 0.011 em`, derived from the OMR One metrics in
`tokens/highlight.css`. For multi-line entries it stays in the first line, the text continues
on the indent edge.

Grading across levels, purple stays the family: first level #8259ff, second #8e7bff, third
#ada6fc. On black and on Purple Strong the marker is #ffffff.

**Numbered lists carry the bare digit as standard.** Two digits with a leading zero (01, 02,
03 …), Purple Strong #8259ff, OMR One Extrabold, tabular figures, without surface and without
shape. This is also the standard form of chapter numbers in tables of contents. On black and
on Purple Strong the digit is #ffffff. Digit and text sit in a grid with baseline alignment,
so the digit sits on the baseline of the first line. Class `.omr-list-numbered`.

**The Störer "Numbered Super-Nova" is the shape for large numbering**, not for lists: three
steps above boxes placed side by side, chapter openers, single large numbers. Shape
`super-nova` filled in Purple Strong, side length 2.2 em of the text size, digit #ffffff in
text size and weight 700 — its cap height is thus 34 % of the shape side and stays within the
safe inner area from section 9. On black and on Purple Strong the shape is #ffffff with a
black digit. Classes `.omr-number-nova` for the free-standing number,
`.omr-list-numbered.nova` for a list of such steps. In small numbered lists the Störer is not
set.

The square badge (surface Purple Strong, side length 1.8 em, digit in text size, radius
`--radius-sm`, quiet variant surface #f4f2ff with black digit) is the fallback form via
`.omr-list-numbered.badge` when a number needs a surface to separate from its surroundings:
numbers in running text, cells, markers on an image. A Störer shape other than Super-Nova only
on explicit instruction.

A list uses exactly one marker form. Markers and numbers do not count against the colour
budget.

No full stop at the end of buttons, menu items and checkboxes. Complete sentences and help
texts keep their punctuation.

**No en dashes (–) and em dashes (—).** End the sentence, start a new one. Only in exceptions,
when truly unavoidable.

Gender-inclusive language: German Genderstern (Kund\*innen), English neutral nouns or
singular they.

No emoji in product UI.

Value formats: 6. Mai / 6 May · 1.250 € / €1,250 · 5 % / 5%. Tabular figures in UI and
tables.

---

## 12 · Self-check

For letters the check from §3b applies instead.

At the end of every job, each point named individually and answered with passed / failed /
not applicable. No blanket verdict, no "looks good".

1. Brand clarified, one logo per asset, colour version matches the background
2. Colour world chosen correctly, no colour from the other world
3. Text colour #000000 or #ffffff, except in the permitted cases from section 4
4. No forbidden contrast pairing
4a. No black frames, table rules or dividers; structure in the greys from exception 2, lines
   only where surface and spacing are not enough
4b. Containers rounded by role from §3a (card 4 px, chip 2 px and so on), square only the
   page, highlight bar and bullet square; spacing from `--spacing-*`
5. At most two chromatic colours per surface, labels, flags and list markers not counted
5a. Bullets as a Purple Strong square 0.42 em on the cap centre, numbering as the bare digit
   01, 02, 03 in Purple Strong Extrabold; Störer `super-nova` only for large numbering, badge
   only with a reason; labels and flags in one of the three forms from §11.1
6. Title slide and chapter dividers in variant A or B, without pattern, same variant
7. Title-slide H1 in capitals
7a. Headlines left-aligned with a ragged right edge, nowhere right-aligned, centred or justified
8. Highlight bar: bar height 1.15 em or 1.277 em, inner padding top and bottom 0.2025 em
   each, deviation between them at most 1 px, no contact with the neighbouring line, no line
   break inside a bar
9. Decoration only from the release list, two different brand-kit colours, neither equal to
   the background
10. Störer text completely inside the shape
11. One pattern group, pattern colour exactly one step away from the background
12. No gradients, no drop shadows
13. All values used come from `tokens/`

A failed point is corrected and checked again, not commented on and not delivered as a
limitation.

---

## 13 · Worst-case check

Testing uses the least favourable realistic case, not the most convenient example.

- Headlines: at least three lines, longest occurring variant, with an umlaut in the bar and
  with bars in the first and last line
- Störer: longest occurring text in the smallest occurring shape
- Layouts: narrowest width, longest labels, German and English
- Alignment: for every test headline check that the left edge holds and the ragged edge is on
  the right

A test with a short example headline or a one-word label counts as not performed.

On deviation from a target: report the measured numbers and stop, do not readjust.
