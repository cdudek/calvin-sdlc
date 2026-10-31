# Table vs List View vs Card Grid: Which Data Display Pattern Should You Use?

**Sections (line range):** Quick Answer 7-28 · Compare By Criteria 29-40 · Why Each One Wins 41-54 · Real-World Fits 55-60 · Default Recommendation 61-64 · Next Steps 65-70

> Choose the right data display pattern based on comparison needs, scanability, visual density, and device constraints.

## Quick Answer

- Use **Table** when users must compare attributes across multiple items, sort columns, or scan dense structured data.
- Use **List View** when users mainly read down a single stream and only a few key attributes matter per item.
- Use **Card Grid** when visual browsing matters more than strict side-by-side comparison.

- **Table** (patterns/data-display/table.md): Best for: Cross-item comparison is critical; Sorting and filtering matter; Many fields must stay visible together; Density matters more than visual browsing
- **List View** (patterns/data-display/list-view.md): Best for: Users scan a single vertical stream; Only a few attributes matter per item; Mobile-first readability matters; Chronological or priority order is important
- **Card Grid** (patterns/data-display/card-grid.md): Best for: Visual content is a primary part of the decision; Each item should feel self-contained; Browsing matters more than direct comparison; Responsive visual layout is a priority

### Table vs List View vs Card Grid Decision Flow

1. **Do users need to compare multiple items side by side?** Use this when people must line up attributes, sort columns, or scan across rows.
   - Yes → **Table**: Best for dense comparison, sorting, and structured analysis (patterns/data-display/table.md)
   - No → go to step 2
2. **Is visual browsing more important than strict comparison?** Think images, covers, thumbnails, and self-contained cards.
   - Yes → **Card Grid**: Best for visual discovery and self-contained item browsing (patterns/data-display/card-grid.md)
   - No → go to step 3
3. **Do users mostly scan a single stream with only a few key attributes?** Use this for inboxes, activity feeds, lightweight records, and mobile-first lists.
   - Yes → **List View**: Best for simple scanning, prioritization, and mobile readability (patterns/data-display/list-view.md)
   - No → **Use Table Instead** (consideration): If fields keep growing and comparison becomes the main job, a table will outperform a list. (patterns/data-display/table.md)

## Compare By Criteria

| Criteria | Table | List View | Card Grid |
| --- | --- | --- | --- |
| Primary job | Side-by-side comparison | Linear scanning | Visual browsing |
| Information density | High | Medium | Medium |
| Sorting and filtering fit | Strong | Medium | Weak |
| Mobile readability | Weak | Strong | Medium to strong |
| Visual emphasis | Weak | Medium | Strong |
| Cross-item comparison | Strong | Medium | Weak |
| Implementation complexity | Medium to high | Medium | Medium |

## Why Each One Wins

### Table

Table is the right choice when comparison is the job. It is strongest for operational interfaces where users sort, filter, and inspect many fields across many rows.

### List View

List view wins when users scan one item after another and only need a small number of important attributes. It is especially effective for inboxes, activity feeds, and mobile-first records.

### Card Grid

Card grid wins when each item should feel self-contained and visually browsable. It is the better fit for libraries, catalogues, galleries, and surfaces where thumbnails or covers carry meaning.

## Real-World Fits

- **Table** (patterns/data-display/table.md): Admin records, inventory management, analytics rows, CRM datasets
- **List View** (patterns/data-display/list-view.md): Activity streams, inboxes, lightweight admin records, mobile-first lists
- **Card Grid** (patterns/data-display/card-grid.md): Resource libraries, product browsing, media collections, template galleries

## Default Recommendation

If the team is unsure, start with **List View** when the dataset is small and scanning matters more than dense comparison. Move to **Table** only when column comparison becomes the real job, and choose **Card Grid** when visuals are doing substantial decision-making work.

## Next Steps

- **Read Table** (patterns/data-display/table.md): Build dense, structured data displays with sorting and filtering
- **Read List View** (patterns/data-display/list-view.md): Design readable linear lists for scanning and prioritization
- **Read Card Grid** (patterns/data-display/card-grid.md): Implement visual browse surfaces with self-contained cards
