**BackgroundPattern** — OMR background patterns (the "Background Patterns" kit frame). Four groups — `rising-squares`, `floating-bulbs`, `bubbles`, `party-mix` — each in a `filled` and an `outline` version. They sit subtly in the background of a slide/poster and give the OMR vibe without distracting from the foreground.

```jsx
{/* place inside a positioned, overflow-hidden container — the pattern bleeds past its edges */}
<div style={{ position:'relative', overflow:'hidden' }}>
  <BackgroundPattern pattern="bubbles" background="purple-strong" />
</div>
```

### Binding rules

1. **Low contrast, always in the background.** The pattern sits at low contrast behind the content so text on top stays fully readable. It never competes with the foreground.
2. **No contour.** The pattern shapes carry no stroke, border or outline. The `outline` group art is built from filled ring shapes, never from strokes. Never add a stroke.
3. **Never placed like an image.** A background pattern is not a graphic dropped onto the page. It is scaled up so far that it bleeds off the frame on all sides, or at minimum on two. Cropped shapes at the frame edge are the intended look. A fully visible, centred, framed pattern is wrong. `bleed` (default `true`) plus a `position:relative; overflow:hidden` container does this; `scale` tunes the overscale (default 1.35).
4. **Colour = one shade off the background.** The pattern shape is always exactly one shade away from the background colour (bg Purple Strong → pattern Purple Medium; bg Purple Soft (lightest) → one step darker; same for every family). Pass `background` and the component applies it (`patternColorForBackground`), or set `color` yourself.
5. **Text may sit over a pattern** — that is the intended use (CLAUDE.md §10). Check the text colour against the background **and** the pattern colour; both must meet the contrast requirement. If either fails, the area behind the text stays pattern-free.
6. **Never on title slides or chapter dividers** (CLAUDE.md §6 and §10).
7. **Never on black or white** — no background patterns on black or white surfaces (the component renders nothing for `background="black"`/`"white"`).
8. **One group per design** — never mix pattern groups.
9. **Filled + outline of the SAME group may be combined** (e.g. `rising-squares` filled + `rising-squares` outline).
8. **Different groups never combine** (e.g. `rising-squares` + `floating-bulbs` ✗).

Patterns paint in `currentColor`; the component drives colour so it stays exactly one shade off the background.
