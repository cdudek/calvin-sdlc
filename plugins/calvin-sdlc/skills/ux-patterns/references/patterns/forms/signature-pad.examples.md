# Signature Pad: demo code

**Sections (line range):** basic 7-40

Code of the live demos on https://uxpatterns.dev/patterns/forms/signature-pad. Plain HTML, CSS and JS.

## basic

```html
<div class="demo-shell card signature-card">
  <p><strong>Acknowledge and sign</strong></p>
  <canvas id="signature-canvas" width="620" height="200"></canvas>
  <div class="actions">
    <button type="button" id="signature-clear">Clear</button>
    <span id="signature-status" class="muted">Draw inside the box.</span>
  </div>
</div>
```

```css
.signature-card { padding: 20px; display: grid; gap: 14px; }
canvas { width: 100%; border: 2px dashed #94a3b8; border-radius: 14px; background: white; }
.actions { display: flex; justify-content: space-between; align-items: center; gap: 12px; }
button { border: 1px solid #cbd5e1; background: white; border-radius: 10px; padding: 10px 14px; }
p { margin: 0; }
```

```js
const canvas = document.getElementById('signature-canvas');
const ctx = canvas.getContext('2d');
const status = document.getElementById('signature-status');
let drawing = false;
ctx.lineWidth = 2.5;
ctx.lineCap = 'round';
canvas.addEventListener('pointerdown', (event) => { drawing = true; ctx.beginPath(); ctx.moveTo(event.offsetX, event.offsetY); });
canvas.addEventListener('pointermove', (event) => { if (!drawing) return; ctx.lineTo(event.offsetX, event.offsetY); ctx.stroke(); status.textContent = 'Signature captured.'; });
window.addEventListener('pointerup', () => { drawing = false; });
document.getElementById('signature-clear').addEventListener('click', () => { ctx.clearRect(0, 0, canvas.width, canvas.height); status.textContent = 'Draw inside the box.'; });
```
