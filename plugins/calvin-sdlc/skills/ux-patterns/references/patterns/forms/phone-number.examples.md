# Phone Number: demo code

**Sections (line range):** basic 7-36

Code of the live demos on https://uxpatterns.dev/patterns/forms/phone-number. Plain HTML, CSS and JS.

## basic

```html
<div class="demo-shell">
  <div class="card form-card">
    <label for="demo-input">Mobile number</label>
    <input id="demo-input" type="tel" placeholder="+1 (555) 123-4567" />
    <p class="helper">Include the country code when numbers may come from different regions.</p>
    
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

```js
const input = document.getElementById('demo-input');
input.addEventListener('blur', () => {
  const digits = input.value.replace(/\D/g, '');
  if (digits.length === 10) input.value = '+1 ' + digits.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
});
```
