# Share Dialog: demo code

**Sections (line range):** basic 7-29

Code of the live demos on https://uxpatterns.dev/patterns/social/share-dialog. Plain HTML, CSS and JS.

## basic

```html
<div class="demo-shell card share-card">
  <button type="button" id="share-copy">Copy link</button>
  <div id="share-status" class="muted">Copy the current page or open a platform-native share flow.</div>
</div>
```

```css
.share-card { padding: 24px; display: grid; gap: 12px; }
button { width: fit-content; border: 0; border-radius: 12px; padding: 12px 14px; background: #0f172a; color: white; }
#share-status { min-height: 22px; }
```

```js
const button = document.getElementById('share-copy');
const status = document.getElementById('share-status');
button.addEventListener('click', async () => {
  try { await navigator.clipboard.writeText('https://uxpatterns.dev/patterns/share-dialog'); status.textContent = 'Link copied to clipboard.'; } catch { status.textContent = 'Copy simulated for this demo.'; }
});
```
