# Toggle: demo code

**Sections (line range):** basic 7-44

Code of the live demos on https://uxpatterns.dev/patterns/forms/toggle. Plain HTML, CSS and JS.

## basic

```html
<div class="demo-shell card toggle-card">
  <label class="switch-row">
    <span>Enable weekly digest</span>
    <span class="switch-control">
      <input type="checkbox" class="switch-input" id="toggle-switch" aria-describedby="toggle-status" />
      <span class="switch" aria-hidden="true"></span>
    </span>
  </label>
  <p id="toggle-status" class="muted" aria-live="polite">Digest is off.</p>
</div>
```

```css
.toggle-card { padding: 24px; display: grid; gap: 12px; }
.switch-row { display: flex; justify-content: space-between; align-items: center; gap: 16px; font-weight: 600; cursor: pointer; }
.switch-control { position: relative; display: inline-flex; align-items: center; justify-content: center; width: 58px; height: 34px; }
.switch-input { position: absolute; inset: 0; margin: 0; opacity: 0; cursor: pointer; }
.switch { width: 58px; height: 34px; border-radius: 999px; background: #cbd5e1; position: relative; transition: background 0.2s ease; }
.switch::after { content: ''; width: 26px; height: 26px; background: white; border-radius: 999px; position: absolute; top: 4px; left: 4px; transition: transform 0.2s ease; box-shadow: 0 1px 3px rgba(15, 23, 42, 0.2); }
.switch-input:checked + .switch { background: #0f766e; }
.switch-input:checked + .switch::after { transform: translateX(24px); }
.switch-input:focus-visible + .switch { outline: 3px solid rgba(15, 118, 110, 0.28); outline-offset: 3px; }
.switch-input:disabled + .switch { background: #e2e8f0; cursor: not-allowed; }
p { margin: 0; }
```

```js
const toggle = document.getElementById('toggle-switch');
const status = document.getElementById('toggle-status');

toggle.addEventListener('change', () => {
  status.textContent = toggle.checked ? 'Digest is on.' : 'Digest is off.';
});
```
