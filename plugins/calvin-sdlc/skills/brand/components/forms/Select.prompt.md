**Select** — dropdown field; click to open a list, selected row tints brand-purple. Same chrome as TextInput.

```jsx
<Select label="Category" value={cat} onChange={setCat}
  options={['CRM software','Email marketing','Analytics']} placeholder="Choose a category" />
```

Options accept strings or `{ value, label }`. `size` `s/m/l`, plus `error` + `helper`.
