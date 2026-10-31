**RichSelectField** — OMR's fully custom select. Form-field trigger (same look as `TextInput`) with a bordered dropdown; supports search, single/multi-select, clearable, validation states and keyboard nav (↑ ↓ Enter Esc).

```jsx
const opts = [{value:'crm',label:'CRM software'},{value:'email',label:'Email marketing'},{value:'seo',label:'SEO tools'}];

// single
<RichSelectField label="Category" options={opts} value={v} onChange={setV} clearable />

// multi-select with count badge + search
<RichSelectField label="Categories" options={opts} value={arr} onChange={setArr}
  multiple counter searchable placeholder="Choose categories" />

// validation
<RichSelectField label="Plan" options={opts} value={p} onChange={setP} state="invalid" helper="Select a plan." />
```

Sizes `s/m/l` (32/40/48). `state`: `none/valid/invalid` drives the border, trailing icon (`octagon-alert` / `circle-check`) and message colour. Requires the Lucide UMD script on the page (uses the `Icon` component internally).
