# OMR logo knowledge base

**Purpose:** this file is the knowledge base for Claude Design (and any other Claude session) on the question *which OMR logo, when, in which variant and in which file*. It describes the brand architecture, the brand ↔ product distinction, the variant system, and holds the complete index of all 122 SVG files.

**Source:** folder `01_OMR Logos` (31 logo folders, 122 SVG files), evaluated and visually verified on 14.09.2026.
**Supplements:** the existing OMR Design System (brand.omr.com / `calvin-sdlc:brand`), which sets the colour, type and background rules. This file does not replace it; it extends the logo layer from 11 to 31 lockups.

---

## 1. Brand architecture in three tiers

```
OMR (umbrella brand, single logo)
│   = Festival · the whole cosmos · sender when nothing more specific applies
│
├── OMR brands            → word in a FILLED box
│   independent brands with their own team, revenue and audience
│
└── OMR products / services → word in an OUTLINED box
    formats, offerings and stages within a brand or the Festival
```

The box logic is not a design detail; it is the brand hierarchy itself. A filled box says: *this is a brand*. An outlined box says: *this is an offering under the brand*. Swapping the two shifts the hierarchy.

### The OMR single logo
Lives as a lockup at `logos/svg/omr_black_h.svg` and `omr_white_h.svg` (entry `omr` in `logos/logo-index.js`); the mark alone at `assets/omr-mark.svg` and `omr-mark-white.svg`. It stands **for the Festival, for the whole OMR cosmos and as the umbrella brand**.

**Default rule:** when it is about OMR as a whole or about the Festival, the OMR single logo is the right choice. The *OMR Festival* lockup only when explicitly requested.

### Not part of this database
* **Podstars by OMR** — a known subsidiary with its own design system in Claude Design. Never serve it from this folder.

---

## 2. What is needed most in practice

The inventory is broad, actual usage is not. The bulk of requests concern these four:

* **OMR** (single logo) — as the umbrella brand and for the Festival
* **OMR Reviews**
* **OMR Education**
* **OMR Festival** (the lockup, when explicitly requested)

This is an observation about frequency, not a ranking and not a judgement. All other logos are equally valid and are treated exactly the same; they just come up less often. If it is unclear which logo is meant, the rule still holds: ask instead of guessing.

---

## 3. OMR Podcast used to be a brand; today it is a product of the umbrella brand OMR

**OMR Podcast** is the business podcast of founder Philipp Westermeyer. It is **no longer a brand of its own but a product**. The logo in the folder correctly carries the outlined box.

Why this is stated explicitly: the podcast was once a brand of its own and is colloquially still treated like one. Today it is a product of the umbrella brand OMR. In assets, architecture diagrams and brand overviews it belongs on the product tier.

---

## 4. Brand or product: how to tell

| | OMR brand | OMR product / service |
|---|---|---|
| **Box** | filled (solid surface) | outlined only (stroke, transparent surface) |
| **Wordmark** | knocked out, in the background colour | in the foreground colour, like the OMR wordmark |
| **Statement** | independent brand | offering/format under a brand |
| **Count** | 12 in this folder | 21 |

### Technical detection rule (for automated evaluation)
In the **black** variant this holds reliably:

* **Brand:** the file contains `.cls-1 { fill: #fff; }`. The box is a single filled path, the letters carry `class="cls-1"` and are knocked out in white.
* **Product:** no `#fff` in the file. The box is a path with an inner counter-path (stroke), the letters are in the same colour as the OMR wordmark.

In the **white** variant this inverts: for brands the OMR wordmark and the box surface are white, the sub-brand letters are knocked out in black.

---

## 5. Variant system

Every logo exists in **four files**: two orientations × two colour versions. The exception is the single-letter lockup OMR X, which exists horizontally only (section 7).

### Orientation

**Horizontal — the standard.** Wordmark to the right of the OMR wordmark. This variant is always used first.

**Vertical — the exception.** Wordmark below the OMR wordmark. **Use only when a specifically requested format demands it** or when there is no other way for visual or space reasons: narrow columns, square tiles, portrait stories, profile pictures. Do not choose it for reasons of taste.

Rule of thumb: if the layout offers an aspect ratio of roughly 6:1 or wider, horizontal is possible, so horizontal it is.

### Colour version

**black** and **white**, both monochrome, no colour logo. The choice follows the background and maximum contrast alone, not taste.

From the existing OMR Design System (binding pairings):

| Background | Logo |
|---|---|
| Purple Strong | white |
| Purple Medium | white |
| Purple Soft | black |
| Mint Strong | white |
| Mint Medium | black |
| Mint Soft | black |
| Yellow Medium | black |
| White | black |
| Black | white |

**Never:** a black logo on Purple Strong or Purple Medium. Contrast failure.

On photos and busy surfaces choose the version that contrasts across the whole logo area; when in doubt, place a calm surface underneath instead of forcing a poorly contrasting version.

---

## 6. Decision tree

```
1. Which OMR brand or product is the asset for?
   → unclear? Do NOT guess. Always ask in this wording (verbatim, in German):

     Welches Logo soll verwendet werden
     1. OMR
     2. OMR Reviews
     3. OMR Education
     4. Andere: z. B. OMR Festival, Podcast, 5050 etc.

   → on answer 4, ask for the exact lockup and look it up in section 8
   → without an answer no logo is set

2. Is it about OMR as a whole, the cosmos or the Festival?
   → OMR single logo (from the design system)
   → OMR Festival lockup only when explicitly requested

3. Is it about a specific brand or product?
   → exactly the one matching lockup from the index in section 8
   → one logo per asset. Never stack two lockups side by side.

4. Orientation
   → horizontal, unless the format does not allow it
   → then vertical

5. Colour version
   → by background per the table in section 5
```

---

## 7. OMR X: special case

The single-letter lockup behaves differently from the rest of the inventory.

* It belongs to the **brand** tier: filled box, letter knocked out.
* It exists **horizontally only**; there is no vertical version.
* The box is much narrower than in all other lockups; the aspect ratio is roughly 4:1 instead of the usual 6:1 to 13:1. In very narrow layouts it is therefore the only lockup that still works horizontally.
* If a layout absolutely needs a vertical lockup, that is a design request to the brand team. Do not rebuild it yourself.

The file names carry **no** orientation suffix: `OMR_X_Logo_black.svg` / `OMR_X_Logo_white.svg`.

**OMR Y** was removed without replacement on 15.09.2026; the brand no longer exists. No lockup, no slug, no files. The brand tier therefore holds 12 lockups.

---

## 8. Complete logo index

Dimensions as `width × height` of the viewBox (proportion, not pixel size; SVG scales freely).
All files live under `01_OMR Logos/<FOLDER>/SVG/`.

### 8.1 OMR brands: filled box (12 in this folder)

| Logo | Slug | Folder | File prefix | Horizontal | Vertical |
|---|---|---|---|---|---|
| OMR 50 50 | `5050` | `OMR 5050` | `OMR_5050_Logo_` | 156.37 × 27.46 | 85.78 × 63.40 |
| OMR Crew | `crew` | `OMR CREW` | `OMR_CREW_Logo_` | 162.05 × 27.46 | 85.78 × 63.40 |
| OMR Education | `education` | `OMR EDUCATION` | `OMR_EDUCATION_Logo_` | 221.80 × 27.46 | 132.52 × 63.40 |
| OMR Executive Search | `executive-search` | `OMR EXECUTIVE SEARCH` | `OMR_EXECUTIVE_SEARCH_Logo_` | 339.45 × 30.84 | 239.15 × 71.92 |
| OMR Festival | `festival` | `OMR FESTIVAL` | `OMR_FESTIVAL_Logo_` | 195.44 × 27.46 | 105.38 × 63.40 |
| OMR Frames | `frames` | `OMR FRAMES` | `OMR_FRAMES_Logo_` | 183.87 × 27.46 | 94.08 × 63.40 |
| OMR Jobs & HR | `jobs-hr` | `OMR JOBS & HR` | `OMR_JOBS_&_HR_Logo_` | 206.85 × 27.46 | 118.38 × 63.40 |
| OMR Reviews | `reviews` | `OMR REVIEWS` | `OMR_REVIEWS_Logo_` | 192.49 × 27.46 | 102.90 × 63.40 |
| OMR Run Club | `run-club` | `OMR RUN CLUB` | `OMR_RUN_CLUB_Logo_` | 227.88 × 30.77 | 126.94 × 71.06 |
| OMR Services | `services` | `OMR SERVICES` | `OMR_SERVICES_Logo_` | 223.64 × 30.77 | 123.80 × 71.06 |
| OMR Travel | `travel` | `OMR TRAVEL` | `OMR_TRAVEL_Logo_` | 200.76 × 30.77 | 100.66 × 71.08 |
| OMR X | `x` | `OMR X` | `OMR_X_Logo_` | 112.50 × 27.46 | — (does not exist) |

### 8.2 OMR products & services: outlined box (21)

| Logo | Slug | Folder | File prefix | Horizontal | Vertical |
|---|---|---|---|---|---|
| OMR A-Team | `a-team` | `OMR A-TEAM` | `OMR_A-TEAM_Logo_` | 203.94 × 30.76 | 103.90 × 71.06 |
| OMR Academy | `academy` | `OMR ACADEMY` | `OMR_ACADEMY_Logo_` | 229.20 × 30.76 | 130.47 × 71.06 |
| OMR Blue Stage | `blue-stage` | `OMR BLUE STAGE` | `OMR_BLUE_STAGE_Logo_` | 249.72 × 30.76 | 149.32 × 71.06 |
| OMR Briefing | `briefing` | `OMR BRIEFING` | `OMR_BRIEFING_Logo_` | 220.20 × 30.76 | 120.62 × 71.06 |
| OMR Conference Stage | `conference-stage` | `OMR CONFERENCE STAGE` | `OMR_CONFERENCE_STAGE_Logo_` | 350.36 × 30.76 | 250.51 × 71.06 |
| OMR Daily | `daily` | `OMR DAILY` | `OMR_DAILY_Logo_` | 178.83 × 30.76 | 96.14 × 71.06 |
| OMR Deep Dive | `deep-dive` | `OMR DEEP DIVE` | `OMR_DEEP_DIVE_Logo_` | 230.19 × 30.76 | 130.22 × 71.06 |
| OMR Digital Masterclasses | `digital-masterclasses` | `OMR DIGITAL MASTERCLASSES` | `OMR_DIGITAL_MASTERCLASSES_Logo_` | 406.15 × 30.76 | 305.81 × 71.06 |
| OMR Food Stage | `food-stage` | `OMR FOOD STAGE` | `OMR_FOOD_STAGE_Logo_` | 261.75 × 30.76 | 161.81 × 71.06 |
| OMR Guided Tours | `guided-tours` | `OMR GUIDED TOURS` | `OMR_GUIDED_TOURS_Logo_` | 285.42 × 30.76 | 185.53 × 71.06 |
| OMR Logistics | `logistics` | `OMR LOGISTICS` | `OMR_LOGISTICS_Logo_` | 235.86 × 30.76 | 135.81 × 71.04 |
| OMR Manager | `manager` | — upload 15.09.2026 | — | 2966.98 × 398.91 | 1669.63 × 930.14 |
| OMR Masterclasses | `masterclasses` | `OMR MASTERCLASSES` | `OMR_MASTERCLASSES_Logo_` | 309.50 × 30.76 | 209.10 × 71.06 |
| OMR Podcast | `podcast` | `OMR PODCAST` | `OMR_PODCAST_Logo_` | 224.93 × 30.76 | 124.43 × 71.06 |
| OMR Purple Stage | `purple-stage` | `OMR PURPLE STAGE` | `OMR_PURPLE_STAGE_Logo_` | 279.69 × 30.76 | 179.40 × 71.06 |
| OMR Report | `report` | `OMR REPORT` | `OMR_REPORT_Logo_` | 204.53 × 30.76 | 104.26 × 71.06 |
| OMR Spotlight | `spotlight` | `OMR SPOTLIGHT` | `OMR_SPOTLIGHT_Logo_` | 241.64 × 30.76 | 142.09 × 71.06 |
| OMR Tool Talks | `tool-talks` | `OMR TOOL TALKS` | `OMR_TOOL_TALKS_Logo_` | 253.08 × 30.76 | 153.04 × 71.20 |
| OMR Top 50 | `top-50` | `OMR TOP 50` | `OMR_TOP_50_Logo_` | 193.16 × 30.76 | 96.14 × 71.06 |
| OMR Viewer | `viewer` | — upload 15.09.2026 | — | 2609.82 × 398.91 | 1312.46 × 930.10 |
| OMR Yellow Stage | `yellow-stage` | `OMR YELLOW STAGE` | `OMR_YELLOW_STAGE_Logo_` | 290.94 × 30.76 | 190.93 × 71.06 |

### 8.3 Thematic clusters

Useful when asked "which logos belong together":

* **Umbrella brand OMR:** OMR (single logo) · Podcast, Daily, Briefing, Top 50 (products)
* **OMR Reviews:** OMR Reviews (brand) · Tool Talks, Manager, Viewer (products)
* **OMR Education:** OMR Education (brand) · Academy, Deep Dive, Report (products)
* **OMR Festival:** OMR Festival and OMR Crew (brands)
* **Festival stages (all products):** Blue Stage, Purple Stage, Yellow Stage, Food Stage, Conference Stage
* **Festival formats (all products):** Guided Tours, Masterclasses, Digital Masterclasses, Spotlight
* **Jobs & HR:** OMR Jobs & HR (brand) · Executive Search (brand)
* **Internal & operations:** A-Team, Logistics, Travel, Run Club
* **Other brands:** 50 50, Frames, Services, X

---

## 9. File names: convention and pitfalls

**Schema:**
```
<FOLDER>/SVG/OMR_<NAME>_Logo_<black|white>_<horizontal|vertical>.svg
```

The folder name uses spaces, the file name underscores.

### Four deviations that trip up programmatic access

1. **`vertikal` instead of `vertical`** (German spelling) for exactly two logos:
   * `OMR_PODCAST_Logo_black_vertikal.svg` / `..._white_vertikal.svg`
   * `OMR_PURPLE_STAGE_Logo_black_vertikal.svg` / `..._white_vertikal.svg`

   Filtering on `_vertical` loses these four files. Always check for `vertic*|vertik*`.

2. **Ampersand in the path:** `OMR JOBS & HR/SVG/OMR_JOBS_&_HR_Logo_*.svg`. The `&` must be escaped in shell, URL and HTML (`\&`, `%26`, `&amp;`).

3. **OMR X without orientation suffix:** `OMR_X_Logo_black.svg`, no `_horizontal`.

4. **`.DS_Store` in every folder**, a macOS artefact; filter it out when reading.

### The folder name is not always the wordmark
`OMR 5050` reads **"50 50"** (with a space) in the logo. In running text therefore "OMR 50 50", in the file system and as slug `5050`.

---

## 10. Technical structure of the SVGs

For everyone who processes the files further or moves them into a component system:

* **Monochrome, no gradients, no raster image.** All shapes are paths.
* **The delivered files contain no fill rule.** The `<defs>` block is empty, the class `.cls-1` is set but not defined. Without an addition all paths fall back to default black: brands show a solid box without wordmark, the white version is invisible on black. In `logos/svg/` every path therefore carries an explicit `fill` attribute: `#fff` for `class="cls-1"`, otherwise `#000`. The rule applies to both versions: in the black file `.cls-1` is the white knockout, in the white file the white ink. Geometry and inner spacing are unchanged.
* **Two colour values at most:** the foreground colour as default fill and `#fff` via the class `.cls-1`. For brands `.cls-1` is the knockout of the letters; for products it does not occur at all in the black version.
* **Recolouring:** the default fill is not set in the markup and therefore inherits `currentColor` behaviour only when set actively. For a two-tone recolouring (such as a logo in Purple Strong on Purple Soft) both layers have to be swapped, default fill and `.cls-1`. **Rule of thumb: do not recolour.** Use black and white only; that is the brand guideline.
* **Two geometry generations in the inventory:** one set with lockup height 27.46 and box radius 2.47, one set with height 30.76 and radius 2.77. Both are proportionally identical; the difference is pure export size and **not** a difference in meaning. When mixing both in one layout, scale to the same **optical** height, not to the same viewBox number.
* **Inner spacing is part of the file.** The distance between the OMR wordmark and the box is constantly around 13 % of the lockup height. It is built in and must **never** be changed manually, rebuilt or replaced by placing mark and text side by side yourself.

---

## 11. Do & Don't

**Do**
* Before placing, clarify which brand or product the asset is for.
* Horizontal as standard, vertical only when the format forces it.
* Colour version by background, maximum contrast.
* One logo per asset.
* Scale the original file, proportionally, never distorted.

**Don't**
* No logo "on suspicion" when the brand is unclear.
* Do not swap brand and product boxes (it shifts the brand hierarchy).
* No rebuilding of the lockup from the OMR mark plus typed text.
* No colours of your own, no gradients, no effects, no drop shadow, no outline.
* Do not rotate, mirror, distort, crop or mask with a shape.
* No second logo stacked directly beside it.
* Never serve Podstars by OMR from this inventory; it has its own design system.
* Do not treat OMR Podcast as a brand.

---

## 12. Open points

These values are **not** in the files and should be added by the brand team before Claude Design applies them automatically:

* **Clear space** (minimum distance to other elements), not encoded in the SVGs.
* **Minimum sizes** for print and digital.
* **Behaviour on photos**, whether darkening or lightening is prescribed.
* **Co-branding rules**, how an OMR lockup is placed next to a partner logo.
* Whether the **internal brands** (Crew, A-Team, Logistics, Travel, Run Club) are released for external communication.


---

## 9. OMR Manager and OMR Viewer

Two SaaS products of OMR Reviews, added on 15.09.2026.

* **OMR Manager** — profile management for vendors on OMR Reviews. Slug `manager`.
* **OMR Viewer** — buyer-intent data from OMR Reviews. Slug `viewer`.

Both sit on the **product tier** under the brand OMR Reviews: outlined box, wordmark in the foreground colour. They exist horizontally and vertically, each in black and white. The white versions were derived from the delivered black originals, geometry unchanged.

In combination with the brand logo the usual rule applies: one logo per asset. When it is about the product, the product lockup stands alone, not next to OMR Reviews.
