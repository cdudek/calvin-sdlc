# Advanced: which pattern for which job

**Patterns (line range):** command-palette 7-14 · search-results 15-22 · wizard 23-30

Advanced and complex UI patterns. Full pattern files: `patterns/advanced/<slug>.md`.

## command-palette: Command Palette

Quick command execution interface. Build effort high.
- **Also called:** cmd+k, quick switcher, launcher
- **Use for:** Editor and workspace commands; Settings and preference shortcuts; Object or page navigation for power users
- **Not for:** Use a simpler visible navigation or single-page flow when the product surface is still small; Avoid advanced interaction patterns if the team cannot support their state complexity well; Do not introduce hidden power-user behavior before the plain path is already strong
- **Alternatives:** Search Field (forms/search-field): when users are mainly retrieving content or filtering data and the control should stay visible | Navigation Menu (navigation/navigation-menu): when users browse a stable set of destinations and do not need to type to get around

## search-results: Search Results

Display and filter search results. Build effort high.
- **Also called:** results page, SERP
- **Use for:** Docs and knowledge-base retrieval; Catalog and directory search; Internal admin and operational search
- **Not for:** Use a simpler visible navigation or single-page flow when the product surface is still small; Avoid advanced interaction patterns if the team cannot support their state complexity well; Do not introduce hidden power-user behavior before the plain path is already strong
- **Alternatives:** Search Field (forms/search-field): when users need search field instead of search results as the primary interaction | Filter Panel (data-display/filter-panel): when users need filter panel instead of search results as the primary interaction | [Pagination](/glossary/pagination) (navigation/pagination): when users need pagination instead of search results as the primary interaction

## wizard: Wizard / Stepper

Multi-step forms and processes. Build effort medium.
- **Also called:** stepper, multi-step form, onboarding flow
- **Use for:** Onboarding and setup; Checkout and application flows; Multi-step internal tooling
- **Not for:** Use a simpler visible navigation or single-page flow when the product surface is still small; Avoid advanced interaction patterns if the team cannot support their state complexity well; Do not introduce hidden power-user behavior before the plain path is already strong
- **Alternatives:** Progress Indicator (user-feedback/progress-indicator): when users need progress indicator instead of wizard / stepper as the primary interaction | Form Validation (forms/form-validation): when users need form validation instead of wizard / stepper as the primary interaction | Checkout Flow (e-commerce/checkout): when users need checkout flow instead of wizard / stepper as the primary interaction
