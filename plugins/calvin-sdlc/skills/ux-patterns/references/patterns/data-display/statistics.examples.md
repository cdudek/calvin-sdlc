# Statistics Display: demo code

**Sections (line range):** basic 7-36

Code of the live demos on https://uxpatterns.dev/patterns/data-display/statistics. Plain HTML, CSS and JS.

## basic

```html
<div class="demo-shell grid">
  <article class="card tile">
    <div class="thumb">📈</div>
    <h3>92%</h3>
    <p class="muted">Completion rate for the new onboarding flow.</p>
  </article>
  <article class="card tile">
    <div class="thumb">⏱</div>
    <h3>1.4m</h3>
    <p class="muted">Average time to publish a new pattern page.</p>
  </article>
  <article class="card tile">
    <div class="thumb">🧩</div>
    <h3>37</h3>
    <p class="muted">Patterns with interactive demos available today.</p>
  </article>
</div>
```

```css
.grid { display: grid; gap: 16px; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); }
.tile { padding: 18px; display: grid; gap: 10px; }
.thumb { width: 48px; height: 48px; border-radius: 14px; background: #e2e8f0; display: grid; place-items: center; font-size: 22px; }
h3 { margin: 0; font-size: 18px; }
p { margin: 0; line-height: 1.5; }
```
