# Search Field vs Command Palette: Which Pattern Should You Use?

**Sections (line range):** Quick Answer 7-24 · Compare By Criteria 25-36 · Why Each One Wins 37-46 · Real-World Fits 47-51 · Default Recommendation 52-55 · Next Steps 56-60

> Choose between visible search and a keyboard-first command surface based on user intent, product complexity, and discoverability.

## Quick Answer

- Use **Search Field** when the main job is finding existing content, filtering data, or giving users a visible retrieval control.
- Use **Command Palette** when the product needs a keyboard-first launcher for actions, destinations, recent items, and power-user workflows.
- If the product surface is still simple, start with **Search Field** and only add a command palette once the action space is large enough to justify it.

- **Search Field** (patterns/forms/search-field.md): Best for: Users are retrieving existing content or filtering a dataset; The control should stay visible and obvious; Discovery matters more than expert speed; Results should feel like content, not commands
- **Command Palette** (patterns/advanced/command-palette.md): Best for: Users need actions, navigation, and shortcuts in one place; The product already has enough complexity to justify a power surface; Keyboard-first speed matters; Queries should trigger commands, pages, or recent items

### Search Field vs Command Palette Decision Flow

1. **Is the primary job finding existing content or filtering a list?** Use this for site search, scoped dataset filtering, and retrieval tasks.
   - Yes → **Search Field**: Best for visible retrieval, filtering, and content-first search experiences. (patterns/forms/search-field.md)
   - No → go to step 2
2. **Does the product need a keyboard-first launcher for actions and navigation?** Think commands, destinations, recent items, and power-user speed.
   - Yes → **Command Palette**: Best for action-heavy interfaces where search doubles as a launcher. (patterns/advanced/command-palette.md)
   - No → **Start With Search Field** (consideration): If the surface is still simple, prefer a visible search input before introducing a hidden power-user layer. (patterns/forms/search-field.md)

## Compare By Criteria

| Criteria | Search Field | Command Palette |
| --- | --- | --- |
| Primary job | Retrieve content | Trigger actions and navigation |
| Discoverability | Strong | Weak to medium |
| Keyboard-first speed | Medium | Strong |
| Works for novice users | Strong | Medium |
| Product complexity tolerance | Low to medium | High |
| Search result type | Content or records | Commands, pages, recent items |
| Implementation complexity | Medium | High |

## Why Each One Wins

### Search Field

Search field is the right choice when the product needs a visible, obvious way to retrieve content or narrow a dataset. It is easier to discover, easier to teach, and better for broad audiences than a hidden expert surface.

### Command Palette

Command palette wins when the interface has grown beyond a simple navigation model. It compresses commands, destinations, and recent items into a single keyboard-first entry point for frequent users who care about speed.

## Real-World Fits

- **Search Field** (patterns/forms/search-field.md): Site search, table filtering, documentation search, customer directory lookup
- **Command Palette** (patterns/advanced/command-palette.md): Workspace apps, editors, admin tools, action-heavy dashboards

## Default Recommendation

If the team is undecided, ship **Search Field** first. It solves the more universal problem, sets clear expectations for users, and avoids introducing a power-user mechanic before the product actually needs it.

## Next Steps

- **Read Search Field** (patterns/forms/search-field.md): Implementation guidance for visible retrieval and filtering
- **Read Command Palette** (patterns/advanced/command-palette.md): Build a command surface for actions, destinations, and shortcuts
