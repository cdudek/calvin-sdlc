**Icon** — wrapper over [Lucide](https://lucide.dev), OMR's icon system. Renders a `currentColor` stroke icon so it inherits text colour; recolour with a `text-icon-*` class or the `color` prop.

```jsx
<Icon name="arrow-right" size={18} />
<span className="text-icon-primary"><Icon name="star" /></span>
```

Requires the Lucide UMD script on the page:
`<script src="https://unpkg.com/lucide@0.544.0/dist/umd/lucide.js"></script>`

Names are Lucide names (kebab or Pascal). For brand/social glyphs (X, LinkedIn, Spotify…) OMR ships custom SVGs — see `assets/social/`.
