# Image Gallery: demo code

**Sections (line range):** basic 7-31

Code of the live demos on https://uxpatterns.dev/patterns/media/image-gallery. Plain HTML, CSS and JS.

## basic

```html
<div class="demo-shell card gallery-card">
  <div class="viewer" id="gallery-viewer">Living room view</div>
  <div class="thumbs">
    <button type="button" data-view="Living room view">1</button>
    <button type="button" data-view="Kitchen detail">2</button>
    <button type="button" data-view="Bedroom layout">3</button>
  </div>
</div>
```

```css
.gallery-card { padding: 20px; display: grid; gap: 12px; }
.viewer { min-height: 220px; border-radius: 18px; background: linear-gradient(135deg, #dbeafe, #e2e8f0); display: grid; place-items: center; font-weight: 700; color: #0f172a; }
.thumbs { display: flex; gap: 8px; }
.thumbs button { width: 44px; height: 44px; border-radius: 12px; border: 1px solid #cbd5e1; background: white; }
```

```js
const viewer = document.getElementById('gallery-viewer');
document.querySelectorAll('[data-view]').forEach((button) => { button.addEventListener('click', () => { viewer.textContent = button.dataset.view; }); });
```
