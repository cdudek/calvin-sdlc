# Letterhead specification

Binding via `CLAUDE.md` §3b. The leading source file is `OMR_letter_paper.fig` (frames 1:198
OMR, 1:3 OMR Reviews). All values come from it. If a letter deviates from a value, the letter
is wrong, not the value.

Status: `OMR_letter_paper.fig`, reconciled 24.09.2026. Changed against the previous state:
subject line width 206 → 461 pt, body copy width 414 → 447 pt, patterns of both letterheads
reset, REVIEWS pattern in `#f5c41c` instead of black.

`briefbogen-referenz.js` in the same folder is the exact geometry of both letterheads as a
React component (`window.OMRBriefbogen`, prop `marke: 'omr' | 'reviews'`, fields as props). A
letter is rebuilt from it or from this file. Both are identical; on conflict the `.fig` wins.

Letters are not designed, they are set according to this specification. Every letter looks
exactly the same. Logo, pattern, field positions, font sizes and footer are never rearranged,
never scaled, never visually improved.

## 0 · Triggers

The rule applies automatically as soon as a brief asks for a letter: letter, cover letter,
official or formal correspondence, confirmation, termination, offer or contract cover letter,
letter to an authority, legal letter, or any document with a recipient address, a subject
line and a closing salutation. The letterhead is then rebuilt according to this
specification, without asking whether a template should be used. A letter is never designed
freely and never derived from the general editorial rules. On conflict this specification
wins.

## 1 · Assignment by brand

The brand decides, not the occasion. There are exactly two letterheads.

| Template | Applies to | Logo | Legal entity |
|---|---|---|---|
| REVIEWS | OMR Reviews only | OMR Reviews wordmark, 125 × 17 pt at 431 / 39 pt | Software Reviews GmbH |
| OMR | OMR and every other brand of the group: Festival, Education, Jobs & HR, Services, Crew, 50 50, Frames, X, Y | OMR wordmark, 95 × 29 pt at 460 / 39 pt | ramp106 GmbH |

The assignment is binding even when the sub-brand has a logo of its own. The letterhead
carries the template's wordmark because the footer names the legal entity and the two belong
together. A document carries exactly one brand, never mixed.

If the brand is not in the brief, ask (wording from `CLAUDE.md` §2). Never assume a template
as default.

## 2 · Page

- **Created as an A4 document, mandatory**, by default and without asking: one print-ready
  page, exportable as PDF. Never as a slide, web page, e-mail, image or canvas artboard.
- A4 portrait, 210 × 297 mm (595 × 842 pt). No other format, no Letter, no A5, no landscape,
  no responsive adaptation.
- Background `#ffffff`, full bleed.
- All positions absolute from the top-left corner, in pt. Nothing is calculated as centred or
  derived from a grid.
- In the browser: 1 pt = 4/3 px. The page is built in pt coordinates and brought to 210 mm
  width as a whole (for example `zoom: 1.3333333` on a 595 × 842 container,
  `@page { size: 210mm 297mm; margin: 0 }`).

## 3 · Fields, identical in both templates

| Element | x | y | Width | Cut | Size | Line height | Alignment |
|---|---|---|---|---|---|---|---|
| Small sender line | 75 | 148 | 206 | Regular 400 | 7 pt | 100 % | left |
| Recipient address | 75 | 172 | 206 | Regular 400 | 11 pt | 1.15 | left |
| Contact person | 330 | 234 | 206 | Label Semibold 600, name/phone/e-mail Regular 400 | 10 pt | 1.15 | right |
| Place and date | 331 | 307 | 206 | Regular 400 | 12 pt | 1.15 | right |
| Subject line | 75 | 333 | 461 | Bold 700 | 12 pt | 1.15 | left |
| Body copy | 75 | 384 | 447 | Regular 400 | 10 pt | 1.25 | left |
| Company name, footer | 226 | 764 | 143 | Bold 700 | 10 pt | 100 % | centred |
| Legal line, footer | 24 | 783 | 547 | Regular 400 | 9.3 pt | 100 % | centred |

Typeface OMR One. Text colour `#000000` throughout. Tracking 0. No capitals, no highlight
bars. Footer blocks centred on 297.5 pt. The right-aligned blocks end at 536 and 537 pt
respectively.

The contact-person label is fixed: `Ihr Ansprechpartner:` in Semibold 600, below it one line
each for name, phone and e-mail in Regular 400.

## 4 · Logo

| Template | File | W × H | x | y |
|---|---|---|---|---|
| OMR | `logos/svg/omr_black_h.svg` | 95 × 29 pt | 460 | 39 |
| REVIEWS | `logos/svg/reviews_black_h.svg` | 125 × 17 pt | 431 | 39 |

Always black, never moved, never scaled, never inverted.

## 5 · Pattern

A fixed part of the template, not decoration. Colour always `#f5c41c`. Never recoloured,
moved, mirrored, left out or extended. Everything beyond the page edge is clipped. The exact
paths are in `briefbogen-referenz.js`.

**OMR:** bubbles as outline circles, stroke 1 pt, 24 elements in a pattern container
827.309 × 930.024 pt, anchor −24 / −45 pt.
- Cluster top right, runs across the top and right edge, wraps around the logo
- Cluster bottom left, runs across the left and bottom edge, ends before the company name

**REVIEWS:** filled staircase shape plus outline elements, 19 elements in a pattern container
719.533 × 863 pt, anchor −122 / −88 pt. Also `#f5c41c`, not black.
- Filled staircase at the top, left of the logo, runs across the top edge
- Outline staircase on the right at the height of the recipient address, runs across the
  right edge
- Two outline squares top left of the filled staircase
- Filled and outline staircase bottom left, runs across the left edge, ends before the
  company name

## 6 · Fixed texts

Take over verbatim.

**OMR**
- Sender line: `ramp106 GmbH | Lagerstrasse 36 | 20357 Hamburg`
- Company name: `OMR by ramp106 GmbH`
- Legal line: `Lagerstraße 36 | 20357 Hamburg | Tel.: +49 40 209 310 876 | E-Mail: info@omr.com | www.omr.com` / new line / `Register Nr.: HRB113109 | Vertreten durch: Philipp Westermeyer, Philipp Isfort, Jasper Ramm und Isabelle Gardt`

**REVIEWS**
- Sender line: non-breaking space, then `Software Reviews GmbH I Lagerstrasse 36 I 20357 Hamburg` (the separator is a capital I, as in the file)
- Company name: `Software Reviews GmbH`
- Legal line: `Lagerstraße 36 | 20357 Hamburg | Tel.: +49 40 209 310 876 | E-Mail: info@omr.com | www.omr.com | Register Nr.: HRB180010` / new line / `Vertreten durch: Philipp Schrader, Valeska Wittgen und Philipp Isfort | Steuer-Nr.: 46/753/03199 | USt.-ID.: DE360644867`

## 7 · Variable are exclusively

1. Recipient address
2. Contact person: name, phone, e-mail
3. Place and date
4. Subject line
5. Body copy including salutation and closing

No additional element: no lines, boxes, icons, page number on page 1, QR codes, decoration
elements from the slide kit.

## 8 · What does not apply here

From `CLAUDE.md` the following explicitly do not apply to letters: colour-world routing,
highlight bars, capitals, title-slide rules, decoration elements, the background-pattern
rule, the colour budget, the radius and spacing rules from §3a. Still valid: sentence case, no
en and em dashes, value formats, gender-inclusive language.

## 9 · Extent

The body copy starts at 384 pt and ends at 744 pt at the latest, 20 pt above the company
name. If it does not fit, it is not shrunk, not set tighter, the margin is not moved. It runs
onto a following page.

> Open point: the template contains no following page. Layout, header area and page number
> for page 2 onwards are not defined. Until clarified, a letter that runs beyond 744 pt is not
> built; the overflow is reported instead.

> Open point: the fixed label `Ihr Ansprechpartner:` contradicts the "du" rule from
> `CLAUDE.md` §11. Until clarified the file wins.

## 10 · Check, with numbers

Answer individually after every letter. Supplements the check points a to e from
`CLAUDE.md` §3b.

1. Name the page format in mm. Target 210 × 297, portrait, created as an A4 document.
2. Name the brand and confirm that logo, company name and legal line belong to the same
   brand.
3. Name the x and y positions of logo, subject line, top edge of the body copy and legal line
   and compare them with §3 and §4. Deviation zero.
4. Name the font sizes of the eight fields. Deviation zero.
5. Confirm that the legal line matches §6 verbatim.
6. Confirm that the pattern colour is `#f5c41c` and that no pattern element was moved, scaled
   or added.
7. Name the bottom edge of the body copy. Must be ≤ 744 pt, otherwise a following page (§9).
8. Confirm that no element was added that is not in the template.

A deviation is corrected, not commented on and not delivered as a variant.
