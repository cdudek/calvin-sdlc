# Content Management: which pattern for which job

**Patterns (line range):** accordion 7-14 · carousel 15-22 · drag-and-drop 23-30 · expandable-text 31-37 · modal 38-47 · popover 48-55 · tooltip 56-63

Content organization and management patterns. Full pattern files: `patterns/content-management/<slug>.md`.

## accordion: Accordion

Expand and collapse content sections. Build effort medium. Popularity high.
- **Also called:** collapsible panels, collapsible, disclosure, FAQ
- **Use for:** FAQs (Frequently Asked Questions); Settings and Preferences; Product Details or Features; Documentation or Guides; Navigation and Filtering
- **Not for:** All content needs simultaneous visibility; Content is too short; Frequent section switching needed; Multiple sections need simultaneous viewing; Deep nesting of multiple levels
- **Alternatives:** Tabs (navigation/tabs): when content sections are mutually exclusive and users switch frequently | Modal (content-management/modal): when content needs focused attention without page context | Expandable Text (content-management/expandable-text): when single expandable section without multiple panels

## carousel: Carousel

Display multiple items in a rotating view. Build effort high. Popularity medium.
- **Also called:** slider, slideshow, image rotator, rotating banner
- **Use for:** Featured products or services need showcasing (homepage promotions); Key messages or storytelling require highlighting (step-by-step guides); Portfolio of work or case studies needs display; Testimonials or customer reviews for presentation; Multi-step processes or tutorials guide users; News updates or event announcements get featured
- **Not for:** Critical content needs immediate user interaction; Content lacks clear relationship or narrative flow; Users must compare items side-by-side or view all options at once; Too many carousel items make navigation cumbersome; Complex content requires significant reading time
- **Alternatives:** Tabs (navigation/tabs): when content sections are distinct and users need direct access | Accordion (content-management/accordion): when vertical space is limited and content is text-heavy | Card Grid (data-display/card-grid): when all items need equal visibility and comparison

## drag-and-drop: Drag and Drop

Allow users to reorder items intuitively. Build effort high.
- **Also called:** reorder, sortable
- **Use for:** Sortable lists and priorities; Moving cards across stages; Upload or placement gestures
- **Not for:** Use explicit buttons or menus when direct manipulation would be harder to learn; Avoid gesture-heavy behavior if the surface must work well with keyboard-only use; Do not require drag or hover when a clearer alternative exists
- **Alternatives:** Kanban Board (data-display/kanban-board): when users need kanban board instead of drag and drop as the primary interaction | List View (data-display/list-view): when users need list view instead of drag and drop as the primary interaction | Image Upload (media/image-upload): when users need image upload instead of drag and drop as the primary interaction

## expandable-text: Expandable Text

Show or hide additional text content on demand. Build effort low.
- **Also called:** collapsible text, Read More/Read Less, read more, truncation
- **Use for:** Summarizing content; Reducing page clutter; Improving mobile usability; Progressive disclosure; Enhancing readability
- **Not for:** For critical information; For frequently accessed content; When full content is needed upfront

## modal: Modal

Display focused content or actions. Build effort medium. Popularity high.
- **Also called:** dialog, dialog box, overlay, popup, confirm dialog
- **Best for:** Critical confirmations and blocking actions; Focused forms or short multi-step tasks; Content that must temporarily take over attention
- **Avoid when:** The action is lightweight or purely contextual; Users still need the surrounding page while interacting; The content is long enough to deserve its own route
- **Use for:** Confirmation dialogs; Critical system messages; Forms requiring user input; Media previews; Multi-step processes; Terms and conditions
- **Not for:** Non-essential information doesn't need immediate attention; Content or interaction fits inline on the page; Same information needs frequent access; Large content requires significant scrolling; Users must interact with the main page while modal is open
- **Alternatives:** Popover (content-management/popover): when the content belongs to a trigger and should feel contextual rather than interruptive | Tooltip (content-management/tooltip): when users only need a brief explanation and there is nothing meaningful to click inside

## popover: Popover

Display focused content or actions. Build effort medium.
- **Also called:** flyout, contextual panel, dropdown panel
- **Use for:** Contextual help needs additional details about data fields; Quick actions or shortcuts like editing options or extra buttons; Compact toolbars or menus with filters or settings appearing on demand; Preview or supplementary info shows image or text previews on hover/focus
- **Not for:** Critical information must stay persistently visible; Large forms or complex interactions work better as modals; Context needs full-page takeover for clarity
- **Alternatives:** Modal (content-management/modal): when the user should stop what they are doing and focus on one required task or decision | Tooltip (content-management/tooltip): when the content is only a short explanation and does not need interaction or multiple controls

## tooltip: Tooltip

Provide additional context on hover or focus. Build effort low.
- **Also called:** hover hint, info bubble, hint, info icon
- **Use for:** Clarifying icons or abbreviations; Providing additional information; Showing helper text; Explaining disabled elements; Providing keyboard shortcuts; Providing in-depth explanations; Displaying small images, formatted text, or interactive content; Presenting additional details about data points in charts; Showing user profile previews in social apps
- **Not for:** For critical information; For content that should remain visible; When users need to interact; If the tooltip is the only means; For mobile-first interactions
- **Alternatives:** Popover (content-management/popover): when the content is still contextual but needs richer text, controls, or lightweight interaction | Modal (content-management/modal): when the information is important enough to interrupt the flow or the user must act before continuing
