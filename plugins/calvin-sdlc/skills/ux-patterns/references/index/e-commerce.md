# E-commerce: which pattern for which job

**Patterns (line range):** checkout 7-14 · product-card 15-22 · shopping-cart 23-30

E-commerce and shopping patterns. Full pattern files: `patterns/e-commerce/<slug>.md`.

## checkout: Checkout Flow

Multi-step checkout process. Build effort high.
- **Also called:** payment flow
- **Use for:** Physical goods purchase; Digital checkout and subscriptions; Guest and returning buyer flows
- **Not for:** Use a simpler purchase path when the item, buyer, and payment state are already known; Avoid forcing the full pattern when users only need a quick confirmation step; Do not optimize for conversion at the expense of price and policy clarity
- **Alternatives:** Shopping Cart (e-commerce/shopping-cart): when users need shopping cart instead of checkout flow as the primary interaction | Form Validation (forms/form-validation): when users need form validation instead of checkout flow as the primary interaction | Wizard / Stepper (advanced/wizard): when users need wizard / stepper instead of checkout flow as the primary interaction

## product-card: Product Card

Product display cards for e-commerce. Build effort medium.
- **Also called:** product tile
- **Use for:** Category and search result listings; Recommendation shelves; Quick-buy merchandising
- **Not for:** Use a simpler purchase path when the item, buyer, and payment state are already known; Avoid forcing the full pattern when users only need a quick confirmation step; Do not optimize for conversion at the expense of price and policy clarity
- **Alternatives:** Card Grid (data-display/card-grid): when users need card grid instead of product card as the primary interaction | Shopping Cart (e-commerce/shopping-cart): when users need shopping cart instead of product card as the primary interaction | Comparison Table (data-display/comparison-table): when users need comparison table instead of product card as the primary interaction

## shopping-cart: Shopping Cart

Shopping cart and item management. Build effort medium.
- **Also called:** basket, mini cart
- **Use for:** Cart review before checkout; Editing quantity and variants; Persistent carts across sessions
- **Not for:** Use a simpler purchase path when the item, buyer, and payment state are already known; Avoid forcing the full pattern when users only need a quick confirmation step; Do not optimize for conversion at the expense of price and policy clarity
- **Alternatives:** Checkout Flow (e-commerce/checkout): when users need checkout flow instead of shopping cart as the primary interaction | Product Card (e-commerce/product-card): when users need product card instead of shopping cart as the primary interaction | Notification (user-feedback/notification): when users need notification instead of shopping cart as the primary interaction
