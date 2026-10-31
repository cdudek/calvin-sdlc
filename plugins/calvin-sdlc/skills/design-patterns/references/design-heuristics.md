# Design Heuristics: DRY, KISS, YAGNI

## DRY — Don't Repeat Yourself

**Rule:** Every piece of knowledge should have a single, authoritative representation.

**Common violations:**
- Copy-pasting validation logic across endpoints instead of shared validator
- Duplicating SQL queries instead of shared query builder
- Hardcoding the same magic number in multiple files

**Caveat:** Premature DRY is worse than duplication. Two pieces of code that look similar but serve different business purposes should NOT be merged. Wait for the **Rule of Three** — extract when you have three duplicates.

---

## KISS — Keep It Simple, Stupid

**Rule:** The simplest solution that works correctly is the best solution.

**Common violations:**
- Microservice architecture for a team of 3
- Event bus when direct function calls work
- Abstract factory hierarchy with one implementation
- Wrapping a library "just in case" you switch

---

## YAGNI — You Aren't Gonna Need It

**Rule:** Do not build functionality until it is actually needed.

**Common violations:**
- Plugin system for a tool with one integration
- Multi-tenant architecture before a second tenant
- Configuration options no one asked for
- API with 20 optional parameters for "flexibility"

---

## When NOT to Apply Patterns

| Signal | Do this instead |
|--------|----------------|
| Only one implementation | Just use the concrete class |
| Two similar code blocks | Tolerate duplication (Rule of Three) |
| Simple CRUD | Direct function calls, no architecture |
| Prototype/spike | Hardcode everything, refactor later |
| Team of 1-3 | Monolith, not microservices |
| No foreseeable variation | Constructor, not Factory |
| One observer | Direct method call, not Observer |

**The relationship:** DRY reduces duplication, KISS reduces complexity, YAGNI reduces scope. Together they fight accidental complexity.
