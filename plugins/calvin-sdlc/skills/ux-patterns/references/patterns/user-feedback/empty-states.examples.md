# Empty States: demo code

**Sections (line range):** basic 7-26

Code of the live demos on https://uxpatterns.dev/patterns/user-feedback/empty-states. Plain HTML, CSS and JS.

## basic

```html
<div class="demo-shell">
  <section class="card empty-card">
    <div class="icon">📭</div>
    <h2>No projects yet</h2>
    <p class="muted">Create your first project to start collecting feedback and review notes.</p>
    <button type="button">Create project</button>
  </section>
</div>
```

```css
.empty-card { padding: 32px; display: grid; gap: 12px; justify-items: start; }
.icon { width: 56px; height: 56px; border-radius: 18px; background: #dbeafe; display: grid; place-items: center; font-size: 28px; }
button { border: 0; border-radius: 12px; padding: 10px 14px; background: #0f172a; color: white; }
h2, p { margin: 0; }
```
