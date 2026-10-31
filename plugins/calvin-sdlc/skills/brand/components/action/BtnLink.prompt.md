**BtnLink / InlineLink** — link affordances. `BtnLink` is a standalone, button-like link (nav item, "Read more →"); no underline until hover. `InlineLink` is a hyperlink inside running prose; always underlined.

```jsx
<BtnLink href="/docs" variant="color" size="m" suffixIcon={<Icon name="arrow-right" size={16}/>}>Documentation</BtnLink>
<p className="txt-body-m-regular">See our <InlineLink href="/pricing">pricing</InlineLink> page.</p>
```

`variant`: `color` (brand purple) · `neutral` (inherits text). Sizes `l/m/s`. Pass `underline` to force the underline on.
