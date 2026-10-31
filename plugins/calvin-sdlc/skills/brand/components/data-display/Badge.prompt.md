**Badge** — non-interactive information carrier (status · count · dot). Never clickable. For interactive labels (filter / select / remove) use `Tag`.

```jsx
// status label (children present)
<Badge tone="success">Verified</Badge>
<Badge tone="warning" outlined>Beta</Badge>
// count + dot
<Badge count={3} />   <Badge count={128} max={99} tone="error" />
<Badge dot tone="success" />
```

- **Label form** `tone`: neutral · primary · secondary · success · error · warning · `outlined` · `uppercase` · `prefixIcon`. Soft rectangle (`rounded-lg`).
- **Count / dot form** `tone`: primary · neutral · error · success. Circular (`rounded-full`).
