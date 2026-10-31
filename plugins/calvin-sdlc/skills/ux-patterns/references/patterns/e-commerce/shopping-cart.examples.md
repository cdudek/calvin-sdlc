# Shopping Cart: demo code

**Sections (line range):** basic 7-30

Code of the live demos on https://uxpatterns.dev/patterns/e-commerce/shopping-cart. Plain HTML, CSS and JS.

## basic

```html
<div class="demo-shell cart-demo">
  <section class="card cart-items">
    <div class="cart-row"><strong>Trail Runner</strong><span>$89</span></div>
    <div class="cart-row"><strong>Carry Kit</strong><span>$39</span></div>
    <button type="button">Continue to checkout</button>
  </section>
  <aside class="card summary">
    <strong>Summary</strong>
    <p class="muted">Subtotal $128 · Shipping free</p>
  </aside>
</div>
```

```css
.cart-demo { display: grid; gap: 16px; grid-template-columns: 1.6fr 1fr; }
.cart-items, .summary { padding: 20px; display: grid; gap: 14px; }
.cart-row { display: flex; justify-content: space-between; gap: 12px; padding-bottom: 12px; border-bottom: 1px solid #e2e8f0; }
button { border: 0; border-radius: 12px; padding: 12px 14px; background: #0f172a; color: white; }
@media (max-width: 720px) { .cart-demo { grid-template-columns: 1fr; } }
```
