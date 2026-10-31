**Decoration** — OMR decoration elements (the "Decoration 01…17" kit families). 16 supporting decorations, each with a `left` and `right` direction. They are always two-coloured, both colours free from the nine brand-kit colours.

```jsx
<Decoration name="03" direction="left" size={96} colors={['#00adad', '#8259ff']} />
```

**What they're for** — Decoration Elements are the **standard way to design an OMR document**. They bring OMR character onto a title or chapter slide, placed e.g. in a **corner** of the slide, and make a visual a recognisable OMR visual.

**Binding rules:**
- **One kind per slide.** Never combine different decoration elements on the same slide.
- **Up to 3 instances** of that one element may be used to compose a page (1, 2 or 3 — never more).
- **Never mix decorations and background patterns.** A design has either a subtle pattern in the background or it is designed with decoration elements. Decoration elements are the default.
- **At most two decoration colours per slide** (CLAUDE.md §8).
- **Colour:** decorations are **two-coloured**. Both colours are chosen **freely from the nine brand-kit colours** (`decorationColors`): Purple `#8259ff` / `#8e7bff` / `#ada6fc`, Mint `#00adad` / `#33cccc` / `#80e0db`, Yellow `#f2b200` / `#f5c41c` / `#ffdb75`. Every combination is allowed, within a family (Purple Strong + Purple Soft) as well as across families (Yellow Strong + Mint Soft). There is no fixed mapping from background to decoration colour. Contrast between the two colours is allowed and welcome, but not required.
- **Restrictions, binding:** only these nine colours, **no `#000000`, no `#ffffff`** (neither fill nor outline). Neither decoration colour may equal the **background colour**, otherwise the affected part becomes invisible; check before setting. The two colours are **never identical**, at most **two colours per element**. `colors={[base shape, accent shape]}`: the shape drawn first gets colour 1, all further shapes colour 2.
- **Colour tweak** chooses the **combination**, not a single uniform colour. `decorationCombo(clicked, currentB, background)` returns `[A, B]`: slot A takes the clicked colour, slot B keeps its family (the step may follow) and only moves to another family if A and B would otherwise be identical or if B equals the background. A and B differ afterwards. Example: Mint Strong + Yellow Soft, click on Purple → **Purple Strong + Yellow Strong**, not Purple Strong + Purple Strong and not everything in one colour.
- **On title slides and chapter dividers** only the elements **03, 04, 06, 07, 08, 11, 14, 16, 17** are released (`titleSlideDecorations`, CLAUDE.md §8). Rotation: **07, 08, 11, 17 freely rotatable**, **03, 04, 06, 14, 16 in 45° steps only** (`titleSlideRotationFor(name)`). All other elements are not permitted there; for other asset types there is no restriction.
- They **support** the layout and never pull focus — they stay in the background, never in the foreground.
- They **never overlap** central motifs or important text content.

`name` is `"01"`…`"17"` (see `decorationNames`).
