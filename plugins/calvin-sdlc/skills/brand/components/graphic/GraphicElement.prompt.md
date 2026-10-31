**GraphicElement** — OMR graphic elements (the "Graphic *" kit families). 43 decorative shapes, most in `filled` + `outline`, painting in `currentColor`.

```jsx
<GraphicElement name="star" size={48} />
<GraphicElement name="plus" variant="outline" color="#8259ff" />
```

**What they're for** — Graphic Elements set focus or act as an eye-catcher ("Störer"):
- **Carrier for content** — e.g. a numbered Störer (place 1 · 2 · 3 inside `super-nova`).
- **Building block for your own background patterns** — e.g. composed from `plus` and `cross` (x) shapes.
- **Soft overlay / outline** laid over an image.
- **Zoomed up huge** so a single element fills ~half the asset and its edge splits the layout (image one side, text the other).

**Binding rule — text on a Störer sits INSIDE the shape, never beside it.** Wrap it: a `position:relative` box sized to the shape, the `<GraphicElement>` behind, then the text in a `position:absolute; inset:0` flex layer centred both ways.

```jsx
<div style={{position:'relative', display:'inline-flex'}}>
  <GraphicElement name="super-nova" size={120} color="var(--omr-purple-strong)" />
  <span style={{position:'absolute', inset:0, display:'flex', alignItems:'center',
                justifyContent:'center', color:'#fff', fontWeight:800}}>2</span>
</div>
```

Keep **clear padding to the edge** — text stays in the shape's safe inner area (~60% for pointed shapes like `super-nova`/`star`, ~75% for round/square) and never touches or spills past the outline. Störer carry **very short** content only (a number or one short word). **If the text won't fit inside with adequate padding, do NOT force it onto the Störer** — enlarge the shape, shorten the text, or drop the carrier and place the text beside/below the shape as normal type. Overflowing text on a Störer is never acceptable.

`name` is a shape slug — see `graphicNames`. Examples: `star`, `simple-star`, `big-star`, `plus`, `minus`, `cross`, `big-cross`, `circle`, `donut`, `flower`, `triangle`, `square`, `rhombus`, `pentagon`, `moon`, `galaxy`, `super-nova`, `morphing-blob`, `bubbles`… Recolour with `color` or a parent `color`.
