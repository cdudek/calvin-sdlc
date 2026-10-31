# Tooltip vs Popover: Which Overlay Pattern Should You Use?

**Sections (line range):** Quick Answer 7-12 · Compare By Criteria 13-25 · Why Each One Wins 26-39 · Common Decision Rule 40-45 · Real-World Fits 46-51 · Default Recommendation 52-55 · Related Decisions 56-61

> Choose between tooltip and popover patterns based on content length, interaction needs, trigger behavior, and accessibility risk.

## Quick Answer

- Use **Tooltip** when the user only needs a short, non-critical explanation for a control, icon, label, or compact UI element.
- Use **Popover** when the user needs contextual content, actions, controls, links, or anything they may need to read at their own pace.
- If users need to click, copy, choose, scroll, or focus something inside the overlay, it should be a **Popover**, not a tooltip.

## Compare By Criteria

| Criteria | Tooltip | Popover |
| --- | --- | --- |
| Primary job | Brief explanation | Contextual content or actions |
| Interaction inside the surface | No | Yes |
| Content length | A phrase or short sentence | Short panel, compact form, menu, or details |
| Trigger behavior | Hover and focus | Click, tap, or explicit trigger |
| Dismissal model | Usually automatic | Explicit or outside-click dismissal |
| Mobile reliability | Weak | Medium to strong |
| Accessibility risk | Medium if overused | Medium if focus is not managed |
| Best default for important content | Weak | Strong |

## Why Each One Wins

### Tooltip

Tooltip wins when the UI needs a small assist without changing the task. It works well for icon-only buttons, abbreviated labels, disabled-control explanations, and compact hints that do not need to be searched, selected, or interacted with.

Keep tooltip content short. If the explanation needs more than one short sentence, the pattern is usually carrying too much responsibility.

### Popover

Popover wins when the user needs to do something with the content. It can hold actions, filters, formatting controls, preview details, lightweight forms, or a short explanation with supporting links.

Popover is also the safer choice on touch screens because the user intentionally opens it and can dismiss it predictably.

## Common Decision Rule

Ask one question: **Can the user complete the job if the overlay disappears immediately?**

If yes, Tooltip can work. If no, use Popover.

## Real-World Fits

- **Tooltip** (patterns/content-management/tooltip.md): Explain an icon, reveal a keyboard shortcut, clarify a short field label
- **Popover** (patterns/content-management/popover.md): Show row actions, compact filters, inline settings, or contextual details
- **Modal** (patterns/content-management/modal.md): Use when the interaction must interrupt the page and trap focus

## Default Recommendation

Default to **Popover** when content is important, interactive, or longer than a short hint. Use **Tooltip** only for optional explanation that does not block task completion.

## Related Decisions

- [Modal vs Popover vs Tooltip](guides/modal-vs-popover-guide.md)
- [Modal vs Drawer](guides/modal-vs-drawer.md)
- [Search Field vs Command Palette](guides/search-field-vs-command-palette.md)
