# Filter Panel: demo code

**Sections (line range):** basic 7-34

Code of the live demos on https://uxpatterns.dev/patterns/data-display/filter-panel. Plain HTML, CSS and JS.

## basic

```html
<div class="demo-shell filters-demo">
  <aside class="card filter-panel">
    <h3>Filters</h3>
    <label><input type="checkbox" checked /> Mobile ready</label>
    <label><input type="checkbox" /> Accessibility notes</label>
    <label><input type="checkbox" checked /> Includes code</label>
  </aside>
  <section class="card filter-results">
    <div class="result-row"><strong>Pagination</strong><span class="badge">Navigation</span></div>
    <div class="result-row"><strong>Image Upload</strong><span class="badge">Media</span></div>
    <div class="result-row"><strong>Form Validation</strong><span class="badge">Forms</span></div>
  </section>
</div>
```

```css
.filters-demo { display: grid; gap: 16px; grid-template-columns: 240px 1fr; }
.filter-panel, .filter-results { padding: 18px; }
.filter-panel { display: grid; gap: 10px; }
.result-row { display: flex; justify-content: space-between; align-items: center; padding: 14px 0; border-bottom: 1px solid #e2e8f0; }
.result-row:last-child { border-bottom: 0; }
.badge { padding: 6px 10px; border-radius: 999px; background: #e2e8f0; font-size: 12px; }
@media (max-width: 640px) { .filters-demo { grid-template-columns: 1fr; } }
```
