# Form Validation: demo code

**Sections (line range):** basic 7-41

Code of the live demos on https://uxpatterns.dev/patterns/forms/form-validation. Plain HTML, CSS and JS.

## basic

```html
<form class="demo-shell card validation-form" id="validation-form">
  <label>Email<input id="email" type="email" placeholder="you@example.com" /></label>
  <p class="helper">Use the address you want to sign in with.</p>
  <label>Password<input id="password" type="password" placeholder="At least 8 characters" /></label>
  <p id="form-status" class="helper" role="status" aria-live="polite"></p>
  <button type="submit">Create account</button>
</form>
```

```css
.validation-form { padding: 24px; display: grid; gap: 12px; }
label { display: grid; gap: 8px; font-weight: 600; }
input { border: 1px solid #cbd5e1; border-radius: 12px; padding: 12px 14px; }
button { border: 0; border-radius: 12px; padding: 12px 16px; background: #0f172a; color: white; font-weight: 700; }
.helper { margin: 0; font-size: 14px; color: #64748b; }
.error { color: #b91c1c; }
.success { color: #0f766e; }
```

```js
const form = document.getElementById('validation-form');
const status = document.getElementById('form-status');
form.addEventListener('submit', (event) => {
  event.preventDefault();
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;
  if (!email.includes('@')) { status.textContent = 'Enter a valid email address.'; status.className = 'helper error'; return; }
  if (password.length < 8) { status.textContent = 'Password must be at least 8 characters.'; status.className = 'helper error'; return; }
  status.textContent = 'Everything looks good. You can continue safely.'; status.className = 'helper success';
});
```
