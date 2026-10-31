---
name: ux-patterns
description: "UI pattern library: 92 interface patterns from uxpatterns.dev (forms, navigation, data display, content management, user feedback, authentication, AI interfaces, e-commerce, social, media, advanced) plus head-to-head comparison guides. Each pattern covers use cases, when to use and when not, alternatives with pros and cons, benefits, drawbacks, anatomy and component structure, variations, best practices for content, accessibility, visual design, layout and positioning, common mistakes and anti-patterns, keyboard interaction, micro-interactions, tracking, localization, testing checklists and FAQ. Use when someone asks which UI pattern fits a job, modal vs drawer, popover vs tooltip, pagination vs infinite scroll, table vs list vs cards, how to design or build a pattern such as autocomplete, multi-select, date picker, toast, wizard, command palette or AI chat, what its accessibility and keyboard behaviour should be, what its anti-patterns are, or wants a UI checked against pattern best practices."
---

# UX Patterns

Everything [uxpatterns.dev](https://uxpatterns.dev) shows, as Markdown: every pattern with its
facts (also called, best for, avoid when, compare with), every comparison guide and decision
flow, the glossary, and the code of every live demo. Patterns only, no component library.

**All paths below are relative to `references/`** in this skill's directory
(`~/.claude/skills/ux-patterns/references/`).

## Retrieve, never bulk-load

A pattern file is 3,000 to 9,000 tokens. Load the smallest piece that answers the question.

| The question | Read |
|---|---|
| Which pattern fits this job? | The index below is often enough. Otherwise the category's chooser `index/<category>.md` (use for, not for, alternatives): line 3 maps each pattern to its lines, read only those. Then the matching guide, if one exists |
| X or Y? | The guide that compares them (list at the bottom). Across categories: `guides/when-to-use-what.md`. Pagination, infinite scroll or load more: `pagination-vs-infinite-scroll-vs-load-more` first, it covers all three. No guide for your pair (snackbar vs dialog)? Read both patterns' Use Cases and their facts blocks |
| How do I design or build X? | `patterns/<category>/<slug>.md`, sections only (see below) |
| Show me working code | `patterns/<category>/<slug>.examples.md`: the live demos as HTML, CSS and JS, one `##` per demo. 1 to 30 KB, so read one demo by its line range |
| Is this UI right? (review) | For each pattern on screen: Best Practices, Common Mistakes & Anti-Patterns, Accessibility. Testing Guidelines is the checklist |
| What does this term mean? | `glossary.md`, anchor = slug |
| Don't know the slug | Synonyms are in [brackets] in the index below. Else `grep -ril "<keyword>" references/index/`, then `references/patterns/` |
| A variation of a pattern (toast is a variation of `notification`) | `grep -n -i "<variation>" <pattern file>`: Variations, Best Practices and Examples name it; Common Mistakes may only be generic |

**Reading one section:** line 3 of every pattern, demo, guide and chooser file is its map,
`**Sections (line range):** Overview 14-21 · Use Cases 22-56 (When to use 24-36, …) · …`.
In a pattern file, lines 1 to the start of Overview hold the summary, description, complexity,
accessibility risk, build effort and the facts list: **Also called, Best for, Avoid when,
Compare with, Demo code**. That block alone answers most "should I use X" questions. Then
`Read` with `offset` = first line and `limit` = range length for each section you need. Use
Cases and Best Practices list their subsections in brackets, so "Alternatives" or
"Accessibility" is one small read. Guides and anything under about 4 KB: read whole.

## Which section answers what

| Asked about | Section |
|---|---|
| Best for, avoid when, also called, compare with, complexity | The block above Overview |
| Use cases, when to use, when not | Use Cases |
| Alternatives, pros and cons | Use Cases → "Alternatives to …" |
| Benefits / drawbacks | Benefits / Drawbacks |
| Anatomy, component structure, required parts | Anatomy (contains Component Structure and a summary table) |
| Variations, examples | Variations, Examples. Runnable code: the `.examples.md` file |
| Do's and don'ts: content, visual design, layout and positioning | Best Practices (subsections per area) |
| Accessibility, ARIA | Best Practices → Accessibility subsection, plus the top-level Accessibility section where there is one |
| Keyboard interaction | The top-level Accessibility keyboard table where there is one, else Best Practices → Accessibility. Testing Guidelines → Accessibility Testing has the keyboard checks. Fastest: `grep -n -i "arrow\|keyboard" <file>` |
| Mistakes, anti-patterns | Common Mistakes & Anti-Patterns |
| Motion | Micro-Interactions & Animations |
| Analytics events | Tracking |
| i18n, RTL, copy keys | Localization |
| Speed budgets | Performance, Performance Metrics |
| QA checklist | Testing Guidelines |
| Tokens, SEO, security, state, API | Design Tokens, SEO Considerations, Security Considerations, State Management, API Integration (where the pattern has them) |
| Quick answers | Frequently Asked Questions / FAQ |

Not every pattern has every section. The section map says which ones it has.

## Rules

- **Answer from the file and name it** (`patterns/forms/multi-select-input.md`, section). Say
  when the library has nothing on a question instead of filling the gap from memory.
- **The examples are web: HTML, ARIA, CSS.** For iOS, Android or another platform, carry over
  the principle, not the markup.
- **WAI-ARIA Authoring Practices wins.** Where a file's ARIA differs from the
  [APG](https://www.w3.org/WAI/ARIA/apg/patterns/) (for example which element carries
  `role="combobox"`), follow the APG and say that you did.
- **One chooser index at a time.** Read a second category's index only when the job really
  spans both.

## Keeping it current

Built from `thedaviddias/ux-patterns-for-developers` by `scripts/build.mjs`. To refresh:

```bash
git clone --depth 1 https://github.com/thedaviddias/ux-patterns-for-developers /tmp/uxp
node ~/.claude/skills/ux-patterns/scripts/build.mjs /tmp/uxp
```

The script rewrites `references/` and the index below. It fails if a pattern goes missing, a
link dangles, a line map is off, a component is left unconverted, or any six-word run of source
text is absent from the output (about 28,000 runs). Never edit `references/` or the index by hand.

## Pattern index

Category → chooser file → `slug` [synonyms] and what it's for. `hambuger-menu` is the upstream
spelling. The pattern file is
`patterns/<category>/<slug>.md`.

<!-- PATTERN INDEX START -->
**Forms** (`index/forms.md`): `autocomplete` [autosuggest, typeahead, combobox, suggestions] suggest options as users type · `button` [CTA] trigger actions and submit forms · `checkbox` [tick box, selection box] enable single or multiple selections · `code-confirmation` [OTP input, PIN, verification code] verify codes with segmented input · `color-picker` select colors with visual feedback · `currency-input` [money, amount] enter and format monetary values · `date-input` enter dates in a structured text format · `date-picker` [calendar input] select dates from a calendar interface · `date-range` [from-to dates] select a range between two dates · `file-input` [upload, dropzone] upload and handle files · `form-validation` [inline errors, error messages] validate and provide feedback · `multi-select-input` [tags picker, recipients, multi-select dropdown] choose multiple items from a list · `password` [show/hide, strength meter] secure password entry with feedback · `phone-number` [tel input] format and validate phone numbers · `radio` [radio buttons, single choice] select a single option from a group · `rating-input` [stars] rate something with a number of stars · `rich-text-editor` [WYSIWYG] edit and format text content · `search-field` [search input, search bar, search box] search through content efficiently · `selection-input` [dropdown, select] choose from predefined options · `signature-pad` allow users to sign their name · `slider` [range input] select values from a range · `tag-input` [chips input, tokens] enter and format tags · `text-field` [input] enter and edit text content · `textarea` [multi-line input] multi-line text input for longer content · `time-input` [time picker] enter time in a structured format · `toggle` [switch] switch between two states

**Navigation** (`index/navigation.md`): `back-to-top` [scroll to top] quickly navigate back to the top of the page · `breadcrumb` help users understand their current location · `hambuger-menu` [hamburger menu (upstream spelling), off-canvas, mobile nav] display a menu icon for mobile devices · `infinite-scroll` [continuous scrolling] loads additional content automatically as users scroll down · `link` create accessible and interactive links · `load-more` [show more] load additional content on user demand · `megamenu` [mega menu] display a large number of links in a single menu · `navigation-menu` [nav bar, header nav, top nav] organize and structure site navigation · `pagination` [pager] navigate through multiple pages of content · `sidebar` [side nav, drawer] organize and structure site navigation · `tabs` [tab bar, segmented control] switch between different views

**Data Display** (`index/data-display.md`): `calendar` [scheduler, agenda] display dates and events in calendar format · `card-grid` [cards, tiles] display content in a responsive card layout · `chart` [graph, data viz] visualize data with graphs and charts · `comparison-table` [pricing table, feature matrix] compare features and options side-by-side · `dashboard` [overview, KPIs] comprehensive dashboard layouts · `filter-panel` [facets, faceted search, filters] filter and refine data displays · `kanban-board` [board, columns] organize tasks in columns and swimlanes · `list-view` display data in vertical lists · `statistics` [KPI tiles, stat cards, metrics] display key metrics and statistics · `table` [data grids, data grid, datatable] display structured data in rows and columns · `timeline` [history, changelog] display chronological events and activities · `tree-view` [hierarchy, folder tree, nested list] display hierarchical data structures

**Content Management** (`index/content-management.md`): `accordion` [collapsible panels, collapsible, disclosure, FAQ] expand and collapse content sections · `carousel` [slider, slideshow, image rotator, rotating banner] display multiple items in a rotating view · `drag-and-drop` [reorder, sortable] allow users to reorder items intuitively · `expandable-text` [collapsible text, Read More/Read Less, read more, truncation] show or hide additional text content on demand · `modal` [dialog, dialog box, overlay, popup, confirm dialog] display focused content or actions · `popover` [flyout, contextual panel, dropdown panel] display focused content or actions · `tooltip` [hover hint, info bubble, hint, info icon] provide additional context on hover or focus

**User Feedback** (`index/user-feedback.md`): `cookie-consent` [cookie banner, GDPR banner] inform users about the use of cookies · `empty-states` [blank state, zero state] guide users when no content is available · `loading-indicator` [loader, loading, spinner] show users that content is being loaded · `notification` [toast, snackbar, alert, banner] inform users about important updates · `progress-indicator` [progress bar] show completion status of an operation · `skeleton` [skeleton screen, placeholder loading] show users that content is being loaded

**Authentication** (`index/authentication.md`): `account-settings` [preferences, settings page] user account configuration and preferences · `login` [sign in] user authentication and sign-in forms · `password-reset` [forgot password] password recovery and reset flows · `signup` [registration, sign up] user registration and account creation · `social-login` [SSO, OAuth, sign in with Google] oauth and social media authentication · `two-factor` [2FA, MFA, OTP] two-factor authentication setup and verification · `user-profile` [profile page] user profile and account management

**E-commerce** (`index/e-commerce.md`): `checkout` [payment flow] multi-step checkout process · `product-card` [product tile] product display cards for e-commerce · `shopping-cart` [basket, mini cart] shopping cart and item management

**Media** (`index/media.md`): `image-gallery` [lightbox, photo grid] display and browse image collections · `image-upload` [avatar upload, cropper] upload and preview images · `video-player` video playback with controls

**Social** (`index/social.md`): `activity-feed` [news feed] social activity and updates stream · `comment-system` [comments, threads, replies] user comments and discussion threads · `like-button` [reactions] like and reaction buttons · `share-dialog` [share sheet] social sharing functionality

**AI Intelligence** (`index/ai-intelligence.md`): `ai-chat` [chatbot, assistant, conversational UI] conversational ai chat interfaces · `ai-error-states` [AI failure, refusal] handling ai-specific errors · `ai-loading-states` [thinking indicator] loading states for ai operations · `ai-suggestions` [inline completion, smart suggestions] ai-powered autocomplete and suggestions · `context-window` [context limit] managing ai conversation context · `model-selector` [model picker] ai model selection interface · `prompt-input` [chat composer, message box] enhanced text inputs for ai prompts · `response-feedback` [thumbs up/down] feedback mechanisms for ai responses · `streaming-response` [typing effect, token streaming] real-time ai response streaming · `token-counter` [usage meter] display token usage and limits

**Advanced** (`index/advanced.md`): `command-palette` [cmd+k, quick switcher, launcher] quick command execution interface · `search-results` [results page, SERP] display and filter search results · `wizard` [stepper, multi-step form, onboarding flow] multi-step forms and processes

**Guides** (`guides/<slug>.md`): `choosing-input-types` · `input-selection-guide` · `load-more-vs-show-more-vs-view-more` · `modal-vs-drawer` · `modal-vs-popover-guide` · `pagination-vs-infinite-scroll-vs-load-more` · `pagination-vs-infinite-scroll` · `search-field-vs-command-palette` · `table-vs-list-vs-cards` · `tooltip-vs-popover` · `when-to-use-what` · `getting-started` · `books`
<!-- PATTERN INDEX END -->
