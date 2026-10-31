# Notification: demo code

**Sections (line range):** basic 7-33

Code of the live demos on https://uxpatterns.dev/patterns/user-feedback/notification. Plain HTML, CSS and JS.

## basic

```html
<div class="demo-shell">
  <div class="card notify-card">
    <button type="button" id="notify-trigger">Show notification</button>
    <div id="toast" class="toast" hidden role="status" aria-live="polite"><strong>Project saved.</strong> Your changes are now visible to the team.</div>
  </div>
</div>
```

```css
.notify-card { padding: 24px; display: grid; gap: 14px; }
button { width: fit-content; border: 0; border-radius: 12px; padding: 12px 14px; background: #0f172a; color: white; }
.toast { padding: 14px 16px; border-radius: 14px; background: #d1fae5; color: #065f46; }
```

```js
const button = document.getElementById('notify-trigger');
const toast = document.getElementById('toast');
button.addEventListener('click', () => {
  toast.hidden = false;
  clearTimeout(window.__toastTimeout);
  window.__toastTimeout = setTimeout(() => { toast.hidden = true; }, 2200);
});
```
