**Accordion** — expandable section list (FAQ, filters, product details).

```jsx
<Accordion items={[
  { title: 'What is OMR Reviews?', content: 'A B2B software review platform.' },
  { title: 'How are reviews verified?', content: 'Every reviewer is checked.' },
]} defaultOpen={[0]} />
```

`multi` allows several sections open at once; `divider` toggles the row lines.
