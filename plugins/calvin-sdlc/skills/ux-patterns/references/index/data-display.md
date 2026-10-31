# Data Display: which pattern for which job

**Patterns (line range):** calendar 7-14 · card-grid 15-22 · chart 23-30 · comparison-table 31-38 · dashboard 39-46 · filter-panel 47-54 · kanban-board 55-62 · list-view 63-69 · statistics 70-77 · table 78-87 · timeline 88-95 · tree-view 96-103

Data visualization and display components. Full pattern files: `patterns/data-display/<slug>.md`.

## calendar: Calendar View

Display dates and events in calendar format. Build effort high.
- **Also called:** scheduler, agenda
- **Use for:** Booking and scheduling; Team availability; Events and release planning
- **Not for:** Use a simpler view when users only need one or two values and not the full layout; Avoid this pattern when the task is creation or editing rather than interpretation; Do not force the same view onto mobile if another representation would be clearer
- **Alternatives:** Timeline (data-display/timeline): when users need timeline instead of calendar view as the primary interaction | List View (data-display/list-view): when users need list view instead of calendar view as the primary interaction | Filter Panel (data-display/filter-panel): when users need filter panel instead of calendar view as the primary interaction

## card-grid: Card Grid

Display content in a responsive card layout. Build effort medium.
- **Also called:** cards, tiles
- **Use for:** Content libraries and resources; Catalog browsing; Dashboard modules or boards
- **Not for:** Use a simpler view when users only need one or two values and not the full layout; Avoid this pattern when the task is creation or editing rather than interpretation; Do not force the same view onto mobile if another representation would be clearer
- **Alternatives:** List View (data-display/list-view): when users mainly scan a simple vertical stream and only a few attributes matter per item | Data Table (data-display/table): when users must compare structured fields across many items and rely on sorting or filtering | Product Card (e-commerce/product-card): when the card itself needs domain-specific commerce details like pricing, ratings, stock, and purchase actions

## chart: Charts & Graphs

Visualize data with graphs and charts. Build effort high.
- **Also called:** graph, data viz
- **Use for:** Analytics and reporting; Status and trend monitoring; Decision support dashboards
- **Not for:** Use a simpler view when users only need one or two values and not the full layout; Avoid this pattern when the task is creation or editing rather than interpretation; Do not force the same view onto mobile if another representation would be clearer
- **Alternatives:** Statistics Display (data-display/statistics): when users need statistics display instead of charts & graphs as the primary interaction | Dashboard Layout (data-display/dashboard): when users need dashboard layout instead of charts & graphs as the primary interaction | Data Table (data-display/table): when users need data table instead of charts & graphs as the primary interaction

## comparison-table: Comparison Table

Compare features and options side-by-side. Build effort medium.
- **Also called:** pricing table, feature matrix
- **Use for:** Plan and feature comparison; Vendor or tool evaluation; Product selection
- **Not for:** Use a simpler view when users only need one or two values and not the full layout; Avoid this pattern when the task is creation or editing rather than interpretation; Do not force the same view onto mobile if another representation would be clearer
- **Alternatives:** Data Table (data-display/table): when users need data table instead of comparison table as the primary interaction | Product Card (e-commerce/product-card): when users need product card instead of comparison table as the primary interaction | List View (data-display/list-view): when users need list view instead of comparison table as the primary interaction

## dashboard: Dashboard Layout

Comprehensive dashboard layouts. Build effort high.
- **Also called:** overview, KPIs
- **Use for:** Executive overviews; Operational monitoring; Personal workspace summaries
- **Not for:** Use a simpler view when users only need one or two values and not the full layout; Avoid this pattern when the task is creation or editing rather than interpretation; Do not force the same view onto mobile if another representation would be clearer
- **Alternatives:** Statistics Display (data-display/statistics): when users need statistics display instead of dashboard layout as the primary interaction | Charts & Graphs (data-display/chart): when users need charts & graphs instead of dashboard layout as the primary interaction | Filter Panel (data-display/filter-panel): when users need filter panel instead of dashboard layout as the primary interaction

## filter-panel: Filter Panel

Filter and refine data displays. Build effort medium.
- **Also called:** facets, faceted search, filters
- **Use for:** Search and catalog refinement; Analytics scoping; Table and list narrowing
- **Not for:** Use a simpler view when users only need one or two values and not the full layout; Avoid this pattern when the task is creation or editing rather than interpretation; Do not force the same view onto mobile if another representation would be clearer
- **Alternatives:** Search Results (advanced/search-results): when users need search results instead of filter panel as the primary interaction | [Pagination](/glossary/pagination) (navigation/pagination): when users need pagination instead of filter panel as the primary interaction | List View (data-display/list-view): when users need list view instead of filter panel as the primary interaction

## kanban-board: Kanban Board

Organize tasks in columns and swimlanes. Build effort high.
- **Also called:** board, columns
- **Use for:** Task and issue tracking; Content production workflows; Service-delivery queues
- **Not for:** Use a simpler view when users only need one or two values and not the full layout; Avoid this pattern when the task is creation or editing rather than interpretation; Do not force the same view onto mobile if another representation would be clearer
- **Alternatives:** Drag and Drop (content-management/drag-and-drop): when users need drag and drop instead of kanban board as the primary interaction | List View (data-display/list-view): when users need list view instead of kanban board as the primary interaction | Dashboard Layout (data-display/dashboard): when users need dashboard layout instead of kanban board as the primary interaction

## list-view: List View

Display data in vertical lists. Build effort medium.
- **Use for:** Activity and inbox lists; Admin records with a few fields; Mobile-first data browsing
- **Not for:** Use a simpler view when users only need one or two values and not the full layout; Avoid this pattern when the task is creation or editing rather than interpretation; Do not force the same view onto mobile if another representation would be clearer
- **Alternatives:** Data Table (data-display/table): when users need to compare several attributes across many rows or rely on sorting and filtering | Card Grid (data-display/card-grid): when visual browsing matters more than single-column scanning and each item should feel self-contained

## statistics: Statistics Display

Display key metrics and statistics. Build effort low.
- **Also called:** KPI tiles, stat cards, metrics
- **Use for:** Headline KPI strips; Status cards in dashboards; Summary metrics on landing pages
- **Not for:** Use a simpler view when users only need one or two values and not the full layout; Avoid this pattern when the task is creation or editing rather than interpretation; Do not force the same view onto mobile if another representation would be clearer
- **Alternatives:** Charts & Graphs (data-display/chart): when users need charts & graphs instead of statistics display as the primary interaction | Dashboard Layout (data-display/dashboard): when users need dashboard layout instead of statistics display as the primary interaction | Comparison Table (data-display/comparison-table): when users need comparison table instead of statistics display as the primary interaction

## table: Data Table

Display structured data in rows and columns. Build effort high. Popularity high.
- **Also called:** data grids, data grid, datatable
- **Best for:** Dense records where side-by-side comparison is the job; Data that benefits from sorting and column scanning; Operational interfaces like admin, analytics, and inventory
- **Avoid when:** Mobile reading or visual browsing is the main use case; Each item needs strong imagery or self-contained context; Users mostly scan one record at a time
- **Use for:** To display structured, tabular data with multiple properties; When users need to compare data across multiple items; To enable sorting, filtering, and searching of datasets; For displaying financial data, inventory, user lists, or analytics; When data relationships are best understood in a grid format; To support bulk actions on multiple items; For export-ready data presentation
- **Not for:** For simple lists with minimal properties (use List View instead) → list-view; When data has complex hierarchical relationships (consider Tree View) → tree-view; For content-heavy items (use Card Grid or detailed views) → card-grid; On small mobile screens without responsive alternatives; When real-time updates are critical (consider live data streams); For unstructured or narrative content (use Expandable Text) → expandable-text
- **Alternatives:** Card Grid (data-display/card-grid): when visual content is more important than data comparison | List View (data-display/list-view): when displaying simple items with few properties | Dashboard (data-display/dashboard): when showing data overview with multiple visualizations

## timeline: Timeline

Display chronological events and activities. Build effort medium.
- **Also called:** history, changelog
- **Use for:** Activity history and audits; Project milestones; Release and incident narratives
- **Not for:** Use a simpler view when users only need one or two values and not the full layout; Avoid this pattern when the task is creation or editing rather than interpretation; Do not force the same view onto mobile if another representation would be clearer
- **Alternatives:** Calendar View (data-display/calendar): when users need calendar view instead of timeline as the primary interaction | Activity Feed (social/activity-feed): when users need activity feed instead of timeline as the primary interaction | List View (data-display/list-view): when users need list view instead of timeline as the primary interaction

## tree-view: Tree View

Display hierarchical data structures. Build effort high.
- **Also called:** hierarchy, folder tree, nested list
- **Use for:** File and folder navigation; Category management; Nested selection and permissions
- **Not for:** Use a simpler view when users only need one or two values and not the full layout; Avoid this pattern when the task is creation or editing rather than interpretation; Do not force the same view onto mobile if another representation would be clearer
- **Alternatives:** Navigation Menu (navigation/navigation-menu): when users need navigation menu instead of tree view as the primary interaction | List View (data-display/list-view): when users need list view instead of tree view as the primary interaction | Data Table (data-display/table): when users need data table instead of tree view as the primary interaction
