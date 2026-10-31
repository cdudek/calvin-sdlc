# Progress Indicator: demo code

**Sections (line range):** basic 7-41

Code of the live demos on https://uxpatterns.dev/patterns/user-feedback/progress-indicator. Plain HTML, CSS and JS.

## basic

```html
<div class="demo-shell">
  <div class="card progress-card">
    <button type="button" id="progress-trigger">Run export</button>
    <div class="progress-track"><div id="progress-fill"></div></div>
    <p id="progress-status" class="muted">0% complete</p>
  </div>
</div>
```

```css
.progress-card { padding: 24px; display: grid; gap: 14px; }
button { width: fit-content; border: 0; border-radius: 12px; padding: 12px 14px; background: #0f172a; color: white; }
.progress-track { height: 12px; border-radius: 999px; background: #e2e8f0; overflow: hidden; }
#progress-fill { width: 0; height: 100%; background: #0f766e; }
p { margin: 0; }
```

```js
const button = document.getElementById('progress-trigger');
const fill = document.getElementById('progress-fill');
const status = document.getElementById('progress-status');
button.addEventListener('click', () => {
  let value = 0;
  const timer = setInterval(() => {
    value += 10;
    fill.style.width = value + '%';
    status.textContent = value + '% complete';
    if (value >= 100) clearInterval(timer);
  }, 120);
});
```
