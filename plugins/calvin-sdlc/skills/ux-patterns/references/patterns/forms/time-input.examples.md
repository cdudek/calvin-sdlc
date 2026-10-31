# Time Input: demo code

**Sections (line range):** basic 7-28

Code of the live demos on https://uxpatterns.dev/patterns/forms/time-input. Plain HTML, CSS and JS.

## basic

```html
<div class="demo-shell">
  <div class="card form-card">
    <label for="demo-input">Meeting time</label>
    <input id="demo-input" type="time" placeholder="" />
    <p class="helper">Choose a time that matches the attendee timezone.</p>
    
  </div>
</div>
```

```css
.form-card { padding: 24px; display: grid; gap: 12px; }
label { font-weight: 600; }
input, textarea, select { width: 100%; border: 1px solid #cbd5e1; border-radius: 12px; padding: 12px 14px; background: #fff; }
.helper { margin: 0; font-size: 14px; color: #64748b; }
.status { font-size: 14px; color: #0f766e; }
.error { color: #b91c1c; }
```
