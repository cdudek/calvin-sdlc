# Navigation: which pattern for which job

**Patterns (line range):** back-to-top 7-14 · breadcrumb 15-21 · hambuger-menu 22-29 · infinite-scroll 30-37 · link 38-44 · load-more 45-52 · megamenu 53-60 · navigation-menu 61-68 · pagination 69-78 · sidebar 79-86 · tabs 87-94

Navigation components and patterns. Full pattern files: `patterns/navigation/<slug>.md`.

## back-to-top: Back to Top

Quickly navigate back to the top of the page. Build effort low. Popularity medium.
- **Also called:** scroll to top
- **Use for:** Long or content-heavy pages where users scroll far down; Quick navigation back to headers or navigation menus is essential; Blogs, documentation pages, or e-commerce category listings need extensive scrolling
- **Not for:** Very short pages with minimal or unnecessary scrolling; Your layout already has persistent bottom navigation or sticky top menus; Pages without infinite scrolling where scrolling isn't an issue
- **Alternatives:** Infinite Scroll (navigation/infinite-scroll): when content should load continuously without user action | [Pagination](/glossary/pagination) (navigation/pagination): when users need to navigate through discrete pages of content | Breadcrumb (navigation/breadcrumb): when showing hierarchical navigation path

## breadcrumb: Breadcrumb

Help users understand their current location. Build effort medium. Popularity medium.
- **Use for:** Websites have multiple hierarchical levels (categories, sub-categories); Large or complex sites where users land on deep pages from search engines; Systems rely on nested file or document organization (file explorers, project management tools); E-commerce stores use layered product categories
- **Not for:** Single-level websites have flat structure; Landing pages or homepages don't need them; Small websites use simple navigation; Hierarchy already shows through other navigation elements; Single-page applications use modal-based navigation
- **Alternatives:** Tabs (navigation/tabs): when content is organized in parallel sections at the same level | [Pagination](/glossary/pagination) (navigation/pagination): when navigating through sequential content pages | Back to Top (navigation/back-to-top): when users need quick return to page start

## hambuger-menu: Hamburger Menu

Display a menu icon for mobile devices. Build effort medium. Popularity high.
- **Also called:** hamburger menu (upstream spelling), off-canvas, mobile nav
- **Use for:** Mobile or responsive websites where horizontal space is limited; Sites with extensive navigation that cannot fit in a single row on smaller screens; Progressive web apps that mimic native mobile app patterns; Responsive redesigns of desktop navigation menus; Admin dashboards or complex apps with many navigation items
- **Not for:** Sites with only 3-4 navigation items that fit comfortably in a visible bar; Desktop-only applications where screen space is abundant; Kiosk or large-screen interfaces where discoverability is critical; Pages where the primary user task depends on navigation visibility (e.g., comparison tools); When your analytics show users rarely find or use the hidden menu
- **Alternatives:** Navigation Menu (navigation/navigation-menu): when navigation items are few enough to always display | Sidebar (navigation/sidebar): when persistent vertical navigation is needed for complex apps | Tabs (navigation/tabs): when switching between parallel content sections at the same level

## infinite-scroll: Infinite scroll

Loads additional content automatically as users scroll down. Build effort high. Popularity trending.
- **Also called:** continuous scrolling
- **Use for:** Social media feeds; News and blog sites; E-commerce product listings; Search results; Media galleries
- **Not for:** When users need to find specific content quickly; For structured navigation; If performance is a concern; For content requiring user actions; When reaching the footer is important
- **Alternatives:** Pagination (navigation/pagination): when users need precise navigation, stable URLs, or an easy way to return to a known spot | Load More (navigation/load-more): when users should keep control over when more items appear without switching pages

## link: Link

Create accessible and interactive links. Build effort low. Popularity high.
- **Use for:** Navigating to a different page within the same site; Linking to external websites or resources; Jumping to a section within the current page (anchor links); Downloading a file (PDFs, images, documents); Linking to email addresses (`mailto:`) or phone numbers (`tel:`)
- **Not for:** Triggering an in-page action (use a `<button>` instead); Submitting a form (use `<button type="submit">`); Toggling UI state like opening a modal or expanding an accordion; When the action doesn't have a meaningful URL destination; As a wrapper around large interactive areas (use a card pattern with a single anchor)
- **Alternatives:** Button (forms/button): when the action doesn't navigate to a URL but triggers an in-page behavior | Breadcrumb (navigation/breadcrumb): when showing hierarchical location with navigable path segments | Navigation Menu (navigation/navigation-menu): when organizing a collection of links into structured site navigation

## load-more: Load More

Load additional content on user demand. Build effort medium. Popularity high.
- **Also called:** show more
- **Use for:** Large lists of content need pagination (news feeds, product listings); Page performance improves by loading only a subset of data initially; Users browse progressively instead of needing all content at once; You want an alternative to infinite scrolling with more user control
- **Not for:** The full content list is small enough to load upfront without performance issues; Users need to compare multiple items at once (pagination works better here) → pagination; Real-time updates or continuous data streaming is required
- **Alternatives:** Pagination (navigation/pagination): when users need exact page jumps, stable URLs, or clearer orientation through large result sets | Infinite Scroll (navigation/infinite-scroll): when the experience is truly feed-like and uninterrupted consumption matters more than control

## megamenu: Megamenu

Display a large number of links in a single menu. Build effort high. Popularity medium.
- **Also called:** mega menu
- **Use for:** E-commerce sites with dozens of product categories and subcategories; Enterprise platforms with many features organized by domain; University or government sites with extensive departmental navigation; News portals with numerous editorial sections and subsections; SaaS products with complex feature sets needing organized access
- **Not for:** Sites with fewer than 10-15 total navigation links (a simple dropdown suffices); Mobile-only applications where screen width is insufficient; Single-purpose landing pages with minimal navigation needs; Sites where simplicity and speed-of-access are paramount over breadth; When analytics show users prefer search over browsing categories
- **Alternatives:** Navigation Menu (navigation/navigation-menu): when navigation items are few enough for simple dropdowns | Sidebar (navigation/sidebar): when persistent vertical navigation is needed for deep structures | Hamburger Menu (navigation/hambuger-menu): when navigation needs to be hidden behind a toggle on all screen sizes

## navigation-menu: Navigation Menu

Organize and structure site navigation. Build effort medium. Popularity high.
- **Also called:** nav bar, header nav, top nav
- **Use for:** Every multi-page website needs a primary navigation structure; Web applications with distinct feature sections or views; Marketing sites with product, pricing, about, and contact pages; Documentation sites with category-level navigation; Intranets and portals with department-level sections
- **Not for:** Single-page sites with no distinct sections (use anchor links or scroll instead); Deeply nested hierarchies where a sidebar or megamenu is more appropriate; Mobile-only apps where a bottom tab bar follows platform conventions; Wizard or checkout flows where linear step navigation replaces free navigation
- **Alternatives:** Sidebar (navigation/sidebar): when the app has deep navigation requiring a persistent vertical structure | Tabs (navigation/tabs): when switching between parallel content views at the same hierarchy level | Breadcrumb (navigation/breadcrumb): when showing hierarchical location as a secondary navigation aid

## pagination: Pagination

Navigate through multiple pages of content. Build effort medium. Popularity high.
- **Also called:** pager
- **Best for:** Search results and archives where orientation matters; Large datasets that need shareable URLs or recovery; Interfaces where users compare items across sessions
- **Avoid when:** Browsing should feel uninterrupted and feed-like; Users rarely need exact page jumps; Mobile-first discovery matters more than precise location
- **Use for:** Content lists; Page performance; User clarity; Sequential content
- **Not for:** All content fits better on a single page (short lists or summaries); Infinite scroll or "load more" patterns suit the experience better → infinite-scroll, load-more; Users need continuous comparison between items on different pages
- **Alternatives:** Load More (navigation/load-more): when users browse in batches and should decide when the next set of results appears | Infinite Scroll (navigation/infinite-scroll): when discovery should feel uninterrupted and precise recovery matters less than momentum

## sidebar: Sidebar

Organize and structure site navigation. Build effort medium. Popularity high.
- **Also called:** side nav, drawer
- **Use for:** Admin dashboards with multiple feature areas and settings; Documentation sites with chapter and section navigation; Email clients, project management tools, and SaaS applications; File management interfaces with folder trees; Analytics platforms with report categories
- **Not for:** Marketing or brochure websites where a horizontal nav is more conventional; Sites with fewer than 5-6 navigation items (a simple top bar is sufficient); Mobile-only applications where a bottom tab bar is the platform convention; Full-screen content experiences (reading apps, media players) where the sidebar competes with content
- **Alternatives:** Navigation Menu (navigation/navigation-menu): when navigation is simple enough for a horizontal top bar | Hamburger Menu (navigation/hambuger-menu): when navigation should be hidden by default to maximize content space | Tabs (navigation/tabs): when switching between parallel views at the same level without hierarchy

## tabs: Tabs

Switch between different views. Build effort medium. Popularity high.
- **Also called:** tab bar, segmented control
- **Use for:** Product pages with Description, Specifications, and Reviews sections; Settings pages with General, Security, Notifications, and Billing tabs; Dashboard widgets with different data views (Chart, Table, Summary); Code editors showing different files or language previews (HTML, CSS, JS); User profiles with Activity, Projects, and Settings sections
- **Not for:** Content that users need to see simultaneously for comparison (use side-by-side layout); Sequential steps that must be completed in order (use a wizard or stepper) → wizard; Navigation between entirely different pages (use a navigation menu) → navigation-menu; When there are only 2 options (consider a toggle or segmented control instead); When there are more than 7-8 tabs (consider a sidebar or vertical navigation)
- **Alternatives:** Accordion (content-management/accordion): when content sections vary significantly in length or users may want multiple sections open | Navigation Menu (navigation/navigation-menu): when switching between entirely different pages rather than in-page content | Sidebar (navigation/sidebar): when many sections need persistent vertical navigation with hierarchy
