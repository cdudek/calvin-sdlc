**Button** — the semantic action button; use for anything that triggers an action (submit, open, confirm). For navigation, use `BtnLink`.

```jsx
<Button variant="primary" intent="color" size="m" onClick={save}>Save changes</Button>
```

Variants: `primary` (filled solid) · `secondary` (soft tint) · `outline` (bordered). Intents: `color` (brand purple, default) · `neutral` · `success` · `destructive`. Sizes: `xs` `s` `m` `l` (heights 32/40/48/64). Pass `prefixIcon` / `suffixIcon` with an `<Icon>` node, `fullWidth` to stretch, `disabled` to dim to 40%.
