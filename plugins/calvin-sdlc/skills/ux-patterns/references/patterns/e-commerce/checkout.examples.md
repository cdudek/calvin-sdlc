# Checkout Flow: demo code

**Sections (line range):** basic 7-33

Code of the live demos on https://uxpatterns.dev/patterns/e-commerce/checkout. Plain HTML, CSS and JS.

## basic

```html
<div class="demo-shell checkout-demo">
  <section class="card checkout-flow">
    <ol class="steps"><li class="active">Shipping</li><li>Payment</li><li>Review</li></ol>
    <div class="section-block"><strong>Shipping address</strong><p class="muted">123 Pattern Street, Toronto</p></div>
    <button type="button">Continue to payment</button>
  </section>
  <aside class="card summary">
    <strong>Order summary</strong>
    <p class="muted">2 items · Free shipping · Total $128</p>
  </aside>
</div>
```

```css
.checkout-demo { display: grid; gap: 16px; grid-template-columns: 1.6fr 1fr; }
.checkout-flow, .summary { padding: 20px; display: grid; gap: 14px; }
.steps { display: flex; gap: 8px; list-style: none; padding: 0; margin: 0; }
.steps li { padding: 8px 12px; border-radius: 999px; background: #e2e8f0; font-size: 13px; }
.steps li.active { background: #0f172a; color: white; }
.section-block { padding: 14px; border-radius: 12px; background: #f8fafc; }
button { border: 0; border-radius: 12px; padding: 12px 14px; background: #0f172a; color: white; }
@media (max-width: 720px) { .checkout-demo { grid-template-columns: 1fr; } }
```
