# Skeleton: demo code

**Sections (line range):** basic 7-36

Code of the live demos on https://uxpatterns.dev/patterns/user-feedback/skeleton. Plain HTML, CSS and JS.

## basic

```html
<div class="demo-shell grid">
  <article class="card skeleton-card">
    <div class="skeleton box image"></div>
    <div class="skeleton box title"></div>
    <div class="skeleton box line"></div>
    <div class="skeleton box line short"></div>
  </article>
  <article class="card skeleton-card">
    <div class="skeleton box image"></div>
    <div class="skeleton box title"></div>
    <div class="skeleton box line"></div>
    <div class="skeleton box line short"></div>
  </article>
</div>
```

```css
.grid { display: grid; gap: 16px; grid-template-columns: repeat(2, minmax(0, 1fr)); }
.skeleton-card { padding: 18px; display: grid; gap: 10px; }
.skeleton.box { background: linear-gradient(90deg, #e2e8f0 25%, #f1f5f9 50%, #e2e8f0 75%); background-size: 200% 100%; animation: shimmer 1.2s linear infinite; border-radius: 12px; }
.image { height: 120px; }
.title { height: 20px; width: 70%; }
.line { height: 14px; }
.short { width: 55%; }
@keyframes shimmer { from { background-position: 200% 0; } to { background-position: -200% 0; } }
```
