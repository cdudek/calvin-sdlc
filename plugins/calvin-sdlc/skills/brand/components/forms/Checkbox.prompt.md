**Checkbox** — checkbox with optional label/description; supports indeterminate and error states. Selected fill is brand purple, `rounded-sm` box.

```jsx
<Checkbox checked={agree} onChange={setAgree} label="I agree to the terms" />
<Checkbox indeterminate label="Select all" description="Some items selected" />
<Checkbox error label="Required" />
```
