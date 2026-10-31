# Load More vs Show More vs View More vs See More: Which Button Label Should You Use?

**Sections (line range):** Quick Answer 7-13 · Compare By Criteria 14-22 · Why Each One Wins 23-42 · Common Decision Rule 43-51 · Real-World Fits 52-57 · Default Recommendation 58-61 · Related Decisions 62-67

> Choose the right progressive disclosure label for loading more items, expanding hidden content, or navigating to a broader collection.

## Quick Answer

- Use **Load More** when the button fetches or reveals the next batch of items in the same list.
- Use **Show More** when the button expands hidden content that is already part of the current page.
- Use **View More** or **See More** when the button navigates to a broader page, category, or full collection.
- Avoid mixing these labels for the same behavior. Users build expectations from the verb.

## Compare By Criteria

| Label | Best For | User Expects | Avoid When |
| --- | --- | --- | --- |
| Load More | More results in the same list | More items appear below | The button opens a new page |
| Show More | Expanding truncated content | Hidden content expands inline | The action loads a new batch |
| View More | Navigation to a larger collection | A page or section opens | The action only expands text |
| See More | Casual exploration or social feeds | More related content appears | Precision or transactional clarity matters |

## Why Each One Wins

### Load More

Load More is the clearest label for paginated batches, product grids, article archives, search results, and media galleries. It tells users the current collection will continue in place.

Use it when the page keeps its current context and the new items are appended below the existing set.

### Show More

Show More is best for expanding content that has already been loaded. It works well for collapsed descriptions, long review snippets, hidden details, and secondary attributes.

Use it when the user is revealing more of the same item, not moving through a larger result set.

### View More and See More

View More and See More are better when the action leads somewhere else. They fit cards, teasers, related-content modules, and section previews that link to a full collection.

Use a more specific label when possible, such as "View all articles" or "See all patterns."

## Common Decision Rule

Match the verb to the system behavior:

- **Load** means fetch or append.
- **Show** means expand in place.
- **View** means navigate.
- **See** means browse, but it is less precise.

## Real-World Fits

- **Load More** (patterns/navigation/load-more.md): Add the next batch of products, articles, search results, or cards
- **Expandable Text** (patterns/content-management/expandable-text.md): Reveal hidden copy, details, descriptions, or long snippets inline
- **Pagination** (patterns/navigation/pagination.md): Use numbered pages when users need precise navigation and stable URLs

## Default Recommendation

Use **Load More** for list continuation and **Show More** for inline expansion. Use **View More** only when the action navigates to a separate destination.

## Related Decisions

- [Pagination vs Infinite Scroll vs Load More](guides/pagination-vs-infinite-scroll-vs-load-more.md)
- [Pagination vs Infinite Scroll](guides/pagination-vs-infinite-scroll.md)
- [Table vs List View vs Card Grid](guides/table-vs-list-vs-cards.md)
