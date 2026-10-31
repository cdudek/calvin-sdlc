# List View: demo code

**Sections (line range):** basic 7-47

Code of the live demos on https://uxpatterns.dev/patterns/data-display/list-view. Plain HTML, CSS and JS.

## basic

```html
<div class="demo-shell">
  <div class="card list-card">
    <ul class="list">
      <li>
        <div>
          <strong>Accessibility review</strong>
          <p class="muted">Open issues and fixes from the latest audit.</p>
        </div>
        <span class="badge">Today</span>
      </li>
      <li>
        <div>
          <strong>Design handoff checklist</strong>
          <p class="muted">Documentation work still waiting on engineering review.</p>
        </div>
        <span class="badge">Tomorrow</span>
      </li>
      <li>
        <div>
          <strong>Pattern release notes</strong>
          <p class="muted">Summary of what changed in the latest library update.</p>
        </div>
        <span class="badge">Friday</span>
      </li>
    </ul>
  </div>
</div>
```

```css
.list-card { padding: 8px 0; }
.list { list-style: none; margin: 0; padding: 0; }
li { display: flex; gap: 16px; justify-content: space-between; align-items: start; padding: 18px 20px; border-bottom: 1px solid #e2e8f0; }
li:last-child { border-bottom: 0; }
p { margin: 6px 0 0; font-size: 14px; line-height: 1.5; }
.badge { padding: 6px 10px; border-radius: 999px; background: #e2e8f0; font-size: 12px; font-weight: 600; }
```
