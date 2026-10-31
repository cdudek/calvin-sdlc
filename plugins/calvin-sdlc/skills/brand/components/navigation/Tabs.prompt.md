**Tabs / Breadcrumbs / Pagination / Stepper** — the navigation family.

```jsx
<Tabs value={tab} onChange={setTab} items={[{id:'reviews',label:'Reviews',badge:1284},{id:'pricing',label:'Pricing'}]} />
<Breadcrumbs items={[{label:'Home',href:'/'},{label:'CRM software',href:'/crm'},{label:'Flowdesk'}]} onNavigate={go} />
<Pagination page={p} pageCount={12} onChange={setP} />
<Stepper current={1} steps={[{label:'Account'},{label:'Details'},{label:'Confirm'}]} />
```

- **Tabs**: `items` [{id,label,icon?,badge?}], `size` small/medium/large, `color` (brand vs neutral).
- **Breadcrumbs**: bar with top+bottom hairlines (grey-200) + 8px padding; chevron-right separators (grey-700); purple-500 links (→ purple-600 hover); last item is the current page (black, not a link). `shortOnMobile` collapses to a single "‹ back" crumb pointing at the parent.
- **Pagination**: `page`, `pageCount`; collapses long ranges with ellipses.
- **Stepper**: `current` is 0-indexed; earlier steps render complete.
