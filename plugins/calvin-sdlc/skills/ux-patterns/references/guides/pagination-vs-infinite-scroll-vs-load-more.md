# Pagination vs Infinite Scroll vs Load More: Which Pattern Should You Use?

**Sections (line range):** Quick Answer 7-28 · Compare By Criteria 29-41 · Why Each One Wins 42-55 · Real-World Fits 56-61 · Default Recommendation 62-65 · Next Steps 66-71

> Choose the right content loading pattern based on user intent, navigation needs, SEO, and implementation trade-offs.

## Quick Answer

- Use **Pagination** when users need precision: page jumps, stable URLs, revisiting earlier results, or stronger SEO support.
- Use **Infinite Scroll** when the product is optimized for continuous discovery and the main goal is uninterrupted browsing momentum.
- Use **Load More** when you want progressive disclosure without giving up user control, footer access, or implementation sanity.

- **Pagination** (patterns/navigation/pagination.md): Best for: Users need precise jumps and stable URLs; SEO and shareability matter; People compare results or revisit earlier items; Orientation matters more than immersion
- **Infinite Scroll** (patterns/navigation/infinite-scroll.md): Best for: Browsing should feel uninterrupted; Discovery and engagement are the primary job; Mobile-heavy consumption matters; Users rarely need a known stopping point
- **Load More** (patterns/navigation/load-more.md): Best for: You want progressive disclosure with user control; Footer access still matters; Users browse, but not as passively as a feed; You need a safer default than infinite scroll

### Pagination vs Infinite Scroll vs Load More Decision Flow

1. **Do users need to jump to a known position?** Use this when page numbers, stable URLs, or return visits matter.
   - Yes → **Pagination**: Best for search results, directories, and interfaces with strong orientation needs. (patterns/navigation/pagination.md)
   - No → go to step 2
2. **Is passive, uninterrupted browsing the primary behavior?** Think feeds, endless discovery, and scroll-first consumption.
   - Yes → **Infinite Scroll**: Best for feed-like experiences where flow matters more than precise control. (patterns/navigation/infinite-scroll.md)
   - No → go to step 3
3. **Do users benefit from choosing when to fetch the next batch?** Useful when you want progressive disclosure without removing control.
   - Yes → **Load More**: Best balanced default for browse-heavy interfaces that still need control and footer access. (patterns/navigation/load-more.md)
   - No → **Pagination**: Best for search results, directories, and interfaces with strong orientation needs. (patterns/navigation/pagination.md)

## Compare By Criteria

| Criteria | Pagination | Infinite Scroll | Load More |
| --- | --- | --- | --- |
| Primary job | Precise navigation | Seamless consumption | Controlled browsing |
| User control | Strong | Weak | Strong |
| Orientation and recovery | Strong | Weak | Medium |
| SEO and shareable URLs | Strong | Weak | Medium |
| Footer access | Strong | Weak | Strong |
| Mobile feel | Medium | Strong | Strong |
| Performance risk over time | Medium | High | Medium |
| Implementation complexity | Medium | High | Medium |

## Why Each One Wins

### Pagination

Pagination is the right choice when users need to move with intent rather than drift through content. It is the strongest option for search results, directories, archives, and any interface where people compare items or come back later.

### Infinite Scroll

Infinite scroll wins when interruption is the enemy. It is most effective in feeds, inspiration surfaces, and media-heavy browsing where the next item matters more than the exact position in the list.

### Load More

Load more is the most practical default when you want discovery without losing control. It works especially well for ecommerce grids, article listings, and gallery-like experiences where users browse in batches instead of pages.

## Real-World Fits

- **Pagination** (patterns/navigation/pagination.md): Search results, admin tables, job boards, documentation archives
- **Infinite Scroll** (patterns/navigation/infinite-scroll.md): Social feeds, inspiration galleries, media discovery, mobile-first browsing
- **Load More** (patterns/navigation/load-more.md): Ecommerce collections, article archives, browse-heavy results pages

## Default Recommendation

If the team does not have a strong reason to choose either extreme, start with **Load More**. It is usually the safest middle ground because it preserves control, reduces implementation complexity versus infinite scroll, and avoids some of pagination's navigation overhead for casual browsing.

## Next Steps

- **Read Pagination** (patterns/navigation/pagination.md): Implementation details and best practices for structured navigation
- **Read Infinite Scroll** (patterns/navigation/infinite-scroll.md): Performance, accessibility, and recovery guidance for endless feeds
- **Read Load More** (patterns/navigation/load-more.md): Build a controlled progressive loading experience
