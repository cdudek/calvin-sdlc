# Pagination vs Infinite Scroll: When to Use Each Pattern

**Sections (line range):** Pagination vs Infinite Scroll Decision Flow 16-33 · Performance Impact 34-47 · Next steps 48-54

> Choose the right content loading pattern based on your user needs and content type

Choosing between pagination and infinite scroll is a crucial decision that
impacts your users' experience. Each pattern has its strengths and
trade-offs, making the choice highly dependent on your specific use case.

Use our interactive decision flow below to guide your choice based on
factors like content type, user behavior, and technical requirements. Follow
the path that best matches your needs to find the recommended pattern for
your application.

### Pagination vs Infinite Scroll Decision Flow

1. **What is your primary content type?** Consider how users typically consume your content
   - Structured Content → go to step 2
   - Social/Feed Content → go to step 3
2. **Is SEO critical for your content?** Consider if content needs to be easily discoverable and indexed
   - Yes → **Pagination**: Best for structured, searchable content with clear navigation (patterns/navigation/pagination.md)
   - No → **Performance Considerations** (consideration): Memory usage, loading states, and scroll position management (patterns/navigation/pagination.md)
3. **Do users need to bookmark/share specific items?** Consider if users need to return to specific content
   - No → go to step 4
   - Yes → **Pagination**: Best for structured, searchable content with clear navigation (patterns/navigation/pagination.md)
4. **Is mobile the primary platform?** Consider touch interfaces and screen size
   - Yes → **Infinite Scroll**: Ideal for continuous browsing and discovery (patterns/navigation/infinite-scroll.md)
   - No → **Consider Hybrid Approach** (consideration): Load More button with limited infinite scroll (patterns/navigation/infinite-scroll.md)

- **Pagination** (patterns/navigation/pagination.md): Best for: SEO is critical; Users need to bookmark specific pages; Content is structured and searchable; Memory usage is a concern
- **Infinite Scroll** (patterns/navigation/infinite-scroll.md): Best for: Content is discovery-focused; Mobile is the primary platform; User engagement is key; Content flow should be seamless

### Performance Impact

- **Initial Load:** Time taken to load and display the first set of content
- **Memory Usage:** RAM consumption during normal usage

- **Pagination**: Initial Load 80 (green): Faster; Memory Usage 90 (green): Efficient
- **Infinite Scroll**: Initial Load 60 (yellow): Moderate; Memory Usage 40 (red): Heavy

- **Pagination**
  - **Google Search Results**. description: Classic pagination for search results. imageUrl: https://uxpatterns.dev/examples/google-search-pagination.webp
  - **Amazon Product Listings**. description: E-commerce product navigation. imageUrl: https://uxpatterns.dev/examples/amazon-pagination.webp
- **Infinite Scroll**
  - **Pinterest Board**. description: Visual content discovery. imageUrl: https://uxpatterns.dev/examples/pinterest-infinite.gif

## Next steps

Ready to implement your chosen pattern? Check out our detailed implementation guides:

- **Pagination Pattern** (patterns/navigation/pagination.md): Implementation details and best practices
- **Infinite Scroll Pattern** (patterns/navigation/infinite-scroll.md): Implementation details and best practices
