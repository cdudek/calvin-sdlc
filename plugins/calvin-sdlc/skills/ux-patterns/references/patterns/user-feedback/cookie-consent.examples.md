# Cookie Consent: demo code

**Sections (line range):** basic 7-29

Code of the live demos on https://uxpatterns.dev/patterns/user-feedback/cookie-consent. Plain HTML, CSS and JS.

## basic

```html
<div class="demo-shell">
  <section class="card consent-banner">
    <p><strong>We use cookies</strong> to measure usage and remember preferences. You can accept all cookies or manage optional categories.</p>
    <div class="actions">
      <button type="button">Accept all</button>
      <button type="button">Reject non-essential</button>
      <button type="button" class="secondary">Customize</button>
    </div>
  </section>
</div>
```

```css
.consent-banner { padding: 20px; display: grid; gap: 14px; }
.actions { display: flex; gap: 8px; flex-wrap: wrap; }
button { border: 0; border-radius: 12px; padding: 10px 14px; background: #0f172a; color: white; }
.secondary { background: white; color: #0f172a; border: 1px solid #cbd5e1; }
p { margin: 0; line-height: 1.5; }
```
