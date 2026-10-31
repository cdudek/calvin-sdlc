# Split Patterns (SPIDR Framework)

SPIDR is a framework for decomposing large tickets into smaller, independently deliverable pieces. Apply each lens in order — use the first one that produces a clean split.

## The Five Patterns

### Spike — Isolate Uncertainty

**When**: The ticket contains unknowns, unvalidated assumptions, or technology choices that haven't been proven.

**How**: Extract a timeboxed investigation ticket (1-2 days) that answers specific questions before implementation begins.

**Split example**:
- Original: "Add Redis-backed rate limiting to public API"
- Spike: "Spike: Evaluate Redis vs in-memory rate limiting (2-day timebox)" → produces ADR
- Implementation: "Add rate limiting middleware" (informed by spike findings)

**Signals in ticket**:
- "We need to figure out...", "TBD", "investigate"
- Technology not yet used in the codebase
- Performance requirements without benchmarks
- "Should we use X or Y?"

---

### Path — Split by User Flow

**When**: The ticket describes multiple user journeys, happy paths, or error scenarios that can be delivered incrementally.

**How**: Deliver the happy path first, then add error handling, edge cases, and alternative flows as separate tickets.

**Split example**:
- Original: "Implement user registration with email verification and social login"
- Path 1: "Add email/password registration (happy path)"
- Path 2: "Add email verification flow"
- Path 3: "Add Google OAuth registration"
- Path 4: "Add error handling for registration failures"

**Signals in ticket**:
- Multiple user scenarios described
- "Also handle the case where..."
- Acceptance criteria covering different user paths
- Multiple entry points or triggers

---

### Interface — Split by Layer

**When**: The ticket spans multiple architectural layers (API, business logic, data, UI) that can be built and tested independently.

**How**: Build the contract/interface first, then implement layers behind it. Each layer is a separate ticket.

**Split example**:
- Original: "Add reporting dashboard with data aggregation"
- Interface 1: "Define reporting API contract (types, endpoints, response shapes)"
- Interface 2: "Implement data aggregation queries"
- Interface 3: "Build dashboard UI consuming the API"

**Signals in ticket**:
- Mentions both frontend and backend work
- Spans API definition and implementation
- Includes both data transformation and presentation
- "Create the endpoint and the UI for..."

---

### Data — Split by Entity or Source

**When**: The ticket operates on multiple data entities, data sources, or requires data migration alongside feature work.

**How**: Handle one entity/source at a time, or separate migration from feature work.

**Split example**:
- Original: "Migrate user profiles to new schema and add avatar support"
- Data 1: "Write migration for user profile schema changes"
- Data 2: "Update user profile CRUD to use new schema"
- Data 3: "Add avatar upload and storage"

**Signals in ticket**:
- Multiple database tables or entities mentioned
- Data migration mixed with feature work
- Multiple data sources to integrate
- "Import data from X and Y"

---

### Rule — Split by Business Rule

**When**: The ticket implements multiple business rules or validation logic that can be added incrementally.

**How**: Implement one rule at a time, each as a separate ticket. Start with the simplest or most common rule.

**Split example**:
- Original: "Add pricing engine with volume discounts, promo codes, and tax calculation"
- Rule 1: "Implement base pricing calculation"
- Rule 2: "Add volume discount rules"
- Rule 3: "Add promo code validation and application"
- Rule 4: "Add tax calculation by region"

**Signals in ticket**:
- Multiple "if/when/unless" conditions
- Business rules listed as bullet points
- Validation logic for multiple scenarios
- "Apply X discount when Y, but not if Z"

---

## Choosing a Pattern

Apply them in order — use the first one that produces independently deliverable pieces:

1. **Spike** — Is there uncertainty? Isolate it first.
2. **Path** — Can you deliver value with just the happy path?
3. **Interface** — Can layers be built independently behind a contract?
4. **Data** — Can you handle one entity/source at a time?
5. **Rule** — Can business rules be added incrementally?

If multiple patterns apply, prefer the one that:
- Produces the smallest first deliverable (fastest feedback loop)
- Minimizes dependencies between sub-tickets
- Isolates the highest-risk piece

## Sub-Ticket Conventions

When proposing sub-tickets:
- **Title**: Verb-first, specific scope (e.g., "Add rate limiting middleware (in-memory, no Redis)")
- **Dependencies**: Explicitly state which sub-tickets block others
- **Parent**: Link all sub-tickets to the original as children, or convert the original to a tracking issue
- **No dates**: Do not add target dates. Relative sizing (S/M/L) in the report is acceptable to inform split decisions, but do not set estimates on Linear issues — the team decides
