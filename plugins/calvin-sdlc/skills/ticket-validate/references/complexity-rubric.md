# Complexity Scoring Rubric (1-5)

Score each dimension, then take the **highest individual score** as the overall complexity (not the average — one high-complexity dimension dominates).

## Dimensions

### 1. Files & Modules Touched

| Score | Criteria |
|-------|----------|
| 1 | 1-2 files in a single module |
| 2 | 3-5 files in a single module |
| 3 | 5-10 files across 2-3 modules |
| 4 | 10-20 files across 3+ modules |
| 5 | 20+ files or touches core/shared infrastructure |

### 2. Cross-Boundary Impact

| Score | Criteria |
|-------|----------|
| 1 | Changes are internal to one module, no public API changes |
| 2 | Changes affect one module's public interface |
| 3 | Changes affect shared utilities or cross-module contracts |
| 4 | Changes affect API contracts, database schemas, or config formats |
| 5 | Changes require coordinated deployment across services/repos |

### 3. Novelty

| Score | Criteria |
|-------|----------|
| 1 | Follows an existing pattern exactly (copy-paste-modify) |
| 2 | Extends an existing pattern with minor variations |
| 3 | Combines existing patterns in a new way |
| 4 | Introduces a new pattern or technology to the codebase |
| 5 | Greenfield — no existing patterns to follow, architectural decisions required |

### 4. External Dependencies

| Score | Criteria |
|-------|----------|
| 1 | No new dependencies |
| 2 | Uses existing external dependency in a new way |
| 3 | Adds a new dependency (library, service, API) |
| 4 | Requires infrastructure changes (new database, queue, cache) |
| 5 | Requires cross-team coordination or third-party integration |

### 5. Test & Verification Burden

| Score | Criteria |
|-------|----------|
| 1 | Existing tests cover the change, just update assertions |
| 2 | Need to add a few unit tests |
| 3 | Need new test fixtures, mocks, or integration test setup |
| 4 | Need E2E tests, manual verification steps, or test environment changes |
| 5 | Untestable without infrastructure (staging deploy, external service) |

## Overall Score

| Overall | Meaning | Action |
|---------|---------|--------|
| 1 | Trivial | No split needed |
| 2 | Simple | No split needed |
| 3 | Moderate | Consider splitting if multiple independent concerns |
| 4 | Complex | Split recommended — apply SPIDR |
| 5 | Very Complex | Split required — likely needs spike first |

## Example

> Ticket: "Add Redis-backed rate limiting to public API"
>
> - Files & Modules: 3 (middleware, config, tests) → **2**
> - Cross-Boundary: API contract changes (new 429 response) → **4**
> - Novelty: New pattern (no rate limiting exists) → **4**
> - External Dependencies: Redis (new infrastructure) → **4**
> - Test Burden: Integration tests with Redis needed → **4**
>
> **Overall: 4** → Split recommended
