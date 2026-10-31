# Image Upload: demo code

**Sections (line range):** basic 7-35

Code of the live demos on https://uxpatterns.dev/patterns/media/image-upload. Plain HTML, CSS and JS.

## basic

```html
<div class="demo-shell card upload-card">
  <label for="upload-input">Upload an image</label>
  <input id="upload-input" type="file" accept="image/*" />
  <div id="upload-preview" class="preview muted">PNG or JPG up to 5 MB.</div>
</div>
```

```css
.upload-card { padding: 20px; display: grid; gap: 12px; }
label { font-weight: 600; }
input { border: 1px dashed #94a3b8; border-radius: 14px; padding: 16px; background: white; }
.preview { min-height: 160px; border-radius: 14px; background: #f8fafc; display: grid; place-items: center; text-align: center; padding: 16px; }
.preview.has-image { background: linear-gradient(135deg, #dbeafe, #f8fafc); color: #0f172a; font-weight: 700; }
```

```js
const input = document.getElementById('upload-input');
const preview = document.getElementById('upload-preview');
input.addEventListener('change', () => {
  const file = input.files && input.files[0];
  if (!file) return;
  preview.classList.add('has-image');
  preview.textContent = 'Selected: ' + file.name;
});
```
