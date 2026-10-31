# Loading Indicator: demo code

**Sections (line range):** basic 7-34

Code of the live demos on https://uxpatterns.dev/patterns/user-feedback/loading-indicator. Plain HTML, CSS and JS.

## basic

```html
<div class="demo-shell">
  <div class="card loading-card">
    <button type="button" id="loading-trigger">Save changes</button>
    <p id="loading-status" class="muted">Nothing is running yet.</p>
  </div>
</div>
```

```css
.loading-card { padding: 24px; display: grid; gap: 12px; }
button { border: 0; border-radius: 12px; padding: 12px 14px; background: #0f172a; color: white; position: relative; }
button.busy::after { content: ''; width: 16px; height: 16px; border: 2px solid rgba(255,255,255,0.4); border-top-color: white; border-radius: 999px; position: absolute; right: 14px; top: calc(50% - 8px); animation: spin 0.6s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }
p { margin: 0; }
```

```js
const button = document.getElementById('loading-trigger');
const status = document.getElementById('loading-status');
button.addEventListener('click', () => {
  button.disabled = true; button.classList.add('busy'); button.textContent = 'Saving'; status.textContent = 'Saving changes…';
  setTimeout(() => { button.disabled = false; button.classList.remove('busy'); button.textContent = 'Save changes'; status.textContent = 'Changes saved.'; }, 1200);
});
```
