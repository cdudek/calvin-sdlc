# When to Use What?

**Sections (line range):** Selection Patterns (Less than 5 options) 16-23 · Selection Patterns (5 or more options) 24-31 · Text Input Patterns 32-40 · Specialized Input Patterns 41-51 · Date & Time Patterns 52-59 · Content Management Patterns 60-69 · Navigation Patterns 70-87

> Guide for choosing the right UI pattern for your needs

This guide helps you choose the most appropriate UI pattern for your needs.

Each pattern includes:

- ✅ Best use cases
- ❌ When to avoid
- 🎯 Key features
- 🔄 Related patterns

## Selection Patterns (Less than 5 options)

| Pattern                              | Best For                                       | Avoid When                             | Key Features     | Related                                            |
| ------------------------------------ | ---------------------------------------------- | -------------------------------------- | ---------------- | -------------------------------------------------- |
| [Radio](patterns/forms/radio.md)       | ✅ Single choice<br/>✅ Visible options        | ❌ Many options<br/>❌ Multiple needed | ✅ Clear choices | [Dropdown](patterns/forms/selection-input.md)        |
| [Checkbox](patterns/forms/checkbox.md) | ✅ Multiple choices<br/>✅ Independent options | ❌ Single choice<br/>❌ Many options   | ✅ Toggle states | [Multi-select](patterns/forms/multi-select-input.md) |
| [Toggle](patterns/forms/toggle.md)     | ✅ Binary settings<br/>✅ Immediate effect     | ❌ Multiple states                     | ✅ Quick switch  | [Checkbox](patterns/forms/checkbox.md)               |

## Selection Patterns (5 or more options)

| Pattern                                            | Best For                             | Avoid When            | Key Features       | Related                                      |
| -------------------------------------------------- | ------------------------------------ | --------------------- | ------------------ | -------------------------------------------- |
| [Dropdown](patterns/forms/selection-input.md)        | ✅ Limited space<br/>✅ 5-15 options | ❌ Multiple selection | ✅ Compact         | [Radio](patterns/forms/radio.md)               |
| [Autocomplete](patterns/forms/autocomplete.md)       | ✅ Many options<br/>✅ Search needed | ❌ Few options        | ✅ Search & filter | [Search Field](patterns/forms/search-field.md) |
| [Multi-select](patterns/forms/multi-select-input.md) | ✅ Multiple items<br/>✅ Tags needed | ❌ Single choice      | ✅ Bulk selection  | [Checkbox](patterns/forms/checkbox.md)         |

## Text Input Patterns

| Pattern                                       | Best For                              | Avoid When      | Key Features    | Related                                         |
| --------------------------------------------- | ------------------------------------- | --------------- | --------------- | ----------------------------------------------- |
| [Text Field](patterns/forms/text-field.md)      | ✅ Short text<br/>✅ Single line      | ❌ Long content | ✅ Simple input | [Rich Text](patterns/forms/rich-text-editor.md)   |
| [Rich Text](patterns/forms/rich-text-editor.md) | ✅ Formatted text<br/>✅ Long content | ❌ Simple text  | ✅ Formatting   | [Text Field](patterns/forms/text-field.md)        |
| [Password](patterns/forms/password.md)          | ✅ Secure entry<br/>✅ Credentials    | ❌ Public data  | ✅ Masked input | [Code Input](patterns/forms/code-confirmation.md) |
| [Search Field](patterns/forms/search-field.md)  | ✅ Content search<br/>✅ Filtering    | ❌ Exact match  | ✅ Quick search | [Autocomplete](patterns/forms/autocomplete.md)    |

## Specialized Input Patterns

| Pattern                                         | Best For                               | Avoid When         | Key Features     | Related                                                     |
| ----------------------------------------------- | -------------------------------------- | ------------------ | ---------------- | ----------------------------------------------------------- |
| [Currency](patterns/forms/currency-input.md)      | ✅ Money values<br/>✅ Formatting      | ❌ Plain numbers   | ✅ Auto-format   | [Text Field](patterns/forms/text-field.md)                    |
| [Phone](patterns/forms/phone-number.md)           | ✅ Phone numbers<br/>✅ Formatting     | ❌ Plain text      | ✅ Validation    | [Text Field](patterns/forms/text-field.md)                    |
| [Color Picker](patterns/forms/color-picker.md)    | ✅ Color selection<br/>✅ Visual input | ❌ Text input      | ✅ Visual picker | [Dropdown](patterns/forms/selection-input.md)                 |
| [Rating](patterns/forms/rating-input.md)          | ✅ User ratings<br/>✅ Quick input     | ❌ Precise numbers | ✅ Star scale    | [Radio](patterns/forms/radio.md)                              |
| [Code Input](patterns/forms/code-confirmation.md) | ✅ 2FA/OTP<br/>✅ Verification         | ❌ Regular input   | ✅ Auto-advance  | [Password](patterns/forms/password.md)                        |
| [File Input](patterns/forms/file-input.md)        | ✅ File uploads<br/>✅ Multiple files  | ❌ Text input      | ✅ File select   | [Drag and Drop](patterns/content-management/drag-and-drop.md) |

## Date & Time Patterns

| Pattern                                    | Best For                                   | Avoid When       | Key Features    | Related                                    |
| ------------------------------------------ | ------------------------------------------ | ---------------- | --------------- | ------------------------------------------ |
| [Date Input](patterns/forms/date-input.md)   | ✅ Basic date entry<br/>✅ Known format    | ❌ Visual needed | ✅ Direct entry | [Date Picker](patterns/forms/date-picker.md) |
| [Date Picker](patterns/forms/date-picker.md) | ✅ Visual dates<br/>✅ Calendar needed     | ❌ Quick entry   | ✅ Calendar UI  | [Date Range](patterns/forms/date-range.md)   |
| [Date Range](patterns/forms/date-range.md)   | ✅ Period selection<br/>✅ Start/end dates | ❌ Single date   | ✅ Range select | [Date Picker](patterns/forms/date-picker.md) |

## Content Management Patterns

| Pattern                                                     | Best For                                    | Avoid When           | Key Features              | Related                                                 |
| ----------------------------------------------------------- | ------------------------------------------- | -------------------- | ------------------------- | ------------------------------------------------------- |
| [Accordion](patterns/content-management/accordion.md)         | ✅ Collapsible sections<br/>✅ Space saving | ❌ Always visible    | ✅ Progressive disclosure | [Modal](patterns/content-management/modal.md)             |
| [Modal](patterns/content-management/modal.md)                 | ✅ Focused tasks<br/>✅ Important actions   | ❌ Frequent access   | ✅ Focus trap             | [Tooltip](patterns/content-management/tooltip.md)         |
| [Carousel](patterns/content-management/carousel.md)           | ✅ Multiple items<br/>✅ Limited space      | ❌ Comparison needed | ✅ Progressive reveal     | [Infinite Scroll](patterns/navigation/infinite-scroll.md) |
| [Tooltip](patterns/content-management/tooltip.md)             | ✅ Extra info<br/>✅ Quick help             | ❌ Critical info     | ✅ Context help           | [Modal](patterns/content-management/modal.md)             |
| [Drag and Drop](patterns/content-management/drag-and-drop.md) | ✅ Reordering<br/>✅ Visual sorting         | ❌ Simple selection  | ✅ Direct manipulation    | [Selection Input](patterns/forms/selection-input.md)      |

## Navigation Patterns

| Pattern                                                 | Best For                                                    | Avoid When                                       | Key Features                                   | Related                                                                                                   |
| ------------------------------------------------------- | ----------------------------------------------------------- | ------------------------------------------------ | ---------------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| [Back to Top](patterns/navigation/back-to-top.md)         | ✅ Long pages<br/>✅ Quick return                           | ❌ Short content<br/>❌ Mobile-first designs     | ✅ Quick navigation<br/>✅ One-click access    | [Infinite Scroll](patterns/navigation/infinite-scroll.md)                                                   |
| [Breadcrumb](patterns/navigation/breadcrumb.md)           | ✅ Deep hierarchies<br/>✅ Complex sites<br/>✅ E-commerce  | ❌ Flat structures<br/>❌ Single-level sites     | ✅ Location awareness<br/>✅ Easy backtracking | [Navigation Menu](patterns/navigation/navigation-menu.md)                                                   |
| [Infinite Scroll](patterns/navigation/infinite-scroll.md) | ✅ Content feeds<br/>✅ Continuous flow<br/>✅ Social media | ❌ Structured content<br/>❌ Goal-oriented tasks | ✅ Auto-loading<br/>✅ Seamless browsing       | [Pagination](patterns/navigation/pagination.md)<br/>[Load More](patterns/navigation/load-more.md)             |
| [Load More](patterns/navigation/load-more.md)             | ✅ Content exploration<br/>✅ User control                  | ❌ Large datasets<br/>❌ Sequential content      | ✅ Manual loading<br/>✅ Performance friendly  | [Infinite Scroll](patterns/navigation/infinite-scroll.md)<br/>[Pagination](patterns/navigation/pagination.md) |
| [Pagination](patterns/navigation/pagination.md)           | ✅ Large datasets<br/>✅ Structured content                 | ❌ Short lists<br/>❌ Continuous reading         | ✅ Clear boundaries<br/>✅ Better orientation  | [Load More](patterns/navigation/load-more.md)<br/>[Infinite Scroll](patterns/navigation/infinite-scroll.md)   |
| [Hamburger Menu](patterns/navigation/hambuger-menu.md)    | ✅ Mobile interfaces<br/>✅ Space-saving                    | ❌ Desktop-first<br/>❌ Critical navigation      | ✅ Compact<br/>✅ Expandable                   | [Navigation Menu](patterns/navigation/navigation-menu.md)<br/>[Sidebar](patterns/navigation/sidebar.md)       |
| [Megamenu](patterns/navigation/megamenu.md)               | ✅ Large sites<br/>✅ Complex hierarchies                   | ❌ Simple navigation<br/>❌ Mobile interfaces    | ✅ Rich content<br/>✅ Category overview       | [Navigation Menu](patterns/navigation/navigation-menu.md)                                                   |
| [Navigation Menu](patterns/navigation/navigation-menu.md) | ✅ Primary navigation<br/>✅ Site structure                 | ❌ Deep hierarchies<br/>❌ Complex categories    | ✅ Clear structure<br/>✅ Easy access          | [Megamenu](patterns/navigation/megamenu.md)                                                                 |
| [Sidebar](patterns/navigation/sidebar.md)                 | ✅ Dashboard layouts<br/>✅ App interfaces                  | ❌ Content-heavy sites<br/>❌ Mobile-first       | ✅ Persistent nav<br/>✅ Context retention     | [Navigation Menu](patterns/navigation/navigation-menu.md)                                                   |
| [Tabs](patterns/navigation/tabs.md)                       | ✅ Related content<br/>✅ Switching views                   | ❌ Deep hierarchies<br/>❌ Many sections         | ✅ Content grouping<br/>✅ Quick switching     | [Navigation Menu](patterns/navigation/navigation-menu.md)                                                   |
|  |

For implementation details and best practices, visit our [Getting Started](guides/getting-started.md) guide.
