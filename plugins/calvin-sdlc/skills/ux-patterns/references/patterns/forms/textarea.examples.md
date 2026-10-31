# Textarea: demo code

**Sections (line range):** basic 7-29

Code of the live demos on https://uxpatterns.dev/patterns/forms/textarea. Plain HTML, CSS and JS.

## basic

```html
<div class="demo-shell card textarea-card">
  <label for="textarea-input">Project summary</label>
  <textarea id="textarea-input" rows="6" maxlength="180" placeholder="Describe the work, blockers, and next step."></textarea>
  <p id="textarea-status" class="muted">0 / 180 characters</p>
</div>
```

```css
.textarea-card { padding: 24px; display: grid; gap: 12px; }
label { font-weight: 600; }
textarea { resize: vertical; border: 1px solid #cbd5e1; border-radius: 12px; padding: 12px 14px; line-height: 1.5; }
p { margin: 0; }
```

```js
const input = document.getElementById('textarea-input');
const status = document.getElementById('textarea-status');
input.addEventListener('input', () => { status.textContent = input.value.length + ' / 180 characters'; });
```
