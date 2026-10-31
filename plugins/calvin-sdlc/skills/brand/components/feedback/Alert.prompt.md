**Alert / Toast / Tooltip** — the feedback family.

`Alert` is a faithful port of OMR core-ui **MessageBanner**: an icon + optional headline + message (or slotted body) + optional action, on a status-tinted, `rounded-lg` surface.

```jsx
<Alert type="success" headline="Changes saved">Your profile is up to date.</Alert>
<Alert type="error" headline="Payment failed" action={<BtnLink href="#" variant="color">Retry →</BtnLink>} />
<Alert type="reminder" message="Your trial ends in 3 days." condensed />
<Alert type="info" inline="top" message="A new dashboard version is available." />
<Toast tone="success" message="Review published" onClose={close} />
<Tooltip label="Add to comparison"><Button variant="outline" intent="neutral" size="s"><Icon name="plus" size={16}/></Button></Tooltip>
```

- **Alert (MessageBanner)**: `type` `info`(default, purple) / `success` / `warning` / `error` / `neutral` / `reminder` (clock). `headline` (alias `title`), `message` (alias children), `action` (trailing slot). `filled` (default true) — set false for a plain surface with tinted border + text; `solid` removes the border; `condensed` = single-line tight padding; `inline` `top`/`middle`/`bottom` for flush-edge banners. Icons: info ⓘ, success ✓, warning △, error ⯃ (octagon), reminder ⏱. No built-in dismiss — put a close control in `action` if you need one.
- **Toast**: dark, non-blocking; `tone`, `message`, `action`, `onClose`. Position it fixed yourself.
- **Tooltip**: wraps a trigger; `label` + `position` (top/bottom/left/right).
