**Card / Chip / Badge / RatingStars** — the data-display family.

```jsx
<Card interactive media={<img src="cover.jpg"/>} footer={<Button size="s">Details</Button>}>
  <h3 className="txt-headline-l-bold text-main">HubSpot CRM</h3>
  <RatingStars value={4.5} showValue reviewCount={1234}/>
</Card>
<Badge tone="success">Verified</Badge>           {/* status / info — NOT clickable */}
<Badge count={3}/>  <Badge dot tone="error"/>    {/* count / dot notification */}
<Tag onClick={filter}>Popular</Tag>              {/* interactive */}
```

- **Card**: `interactive`, `selected`, `media`, `footer`, `padding`. Never nest cards.
- **Badge** (non-interactive information carrier — never clickable): status label `<Badge tone=…>…</Badge>` (`tone` neutral/primary/secondary/success/error/warning · `outlined` · `uppercase` · `prefixIcon`), or count/dot `<Badge count=… max=… tone=…/>` / `<Badge dot tone=…/>`.
- **Tag** (interactive — filter/select/remove): `onClick`, `onRemove`, `selected`, `prefixIcon`.
- **Chip** (legacy static label): superseded by the Badge status form — prefer `Badge`.
- **RatingStars**: `value` 0–5 (halves ok), `dense`, `showValue`, `reviewCount`. Stars are yellow.
