**TextInput** — single-line text field with label, helper/validation message, and optional prepend/append nodes.

```jsx
<TextInput label="Email address" placeholder="name@company.com"
  prepend={<Icon name="mail" size={18}/>} helper="We'll never share it." />
<TextInput label="Company" state="invalid" helper="This field is required." />
```

`state`: `none` / `valid` / `invalid` (drives border + message colour). Sizes `s/m/l` (32/40/48). Container is `rounded-sm`; input text is 16px to avoid iOS zoom.
