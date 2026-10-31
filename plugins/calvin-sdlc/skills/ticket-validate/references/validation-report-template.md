# Validation Report Template

Use this structure for the full validation report output.

---

```
## Validation Report: <TICKET-ID> — <title>

**Status**: <state> | **Priority**: <priority> | **Team**: <team> | **Assignee**: <assignee or "Unassigned">
**Project**: <project or "None"> | **Labels**: <labels>

---

### Linear Context (2-level deep)

| Relation | Ticket | Title | State | Relevance |
|----------|--------|-------|-------|-----------|
| parent | XXX-00 | ... | ... | ... |
| blocks | XXX-01 | ... | ... | ... |
| blocked-by | XXX-02 | ... | ... | ... |
| related | XXX-03 | ... | ... | ... |
| child | XXX-04 | ... | ... | ... |

[Notable findings from related tickets — conflicts, duplicates, transitive blockers]

---

### Codebase Impact

**Primary files** (directly referenced or affected):

| File | Role | Recent Churn | Has Tests |
|------|------|-------------|-----------|
| `src/module/file.ts` | ... | X commits in 30d | Yes/No |

**Blast radius** (callers, importers, dependents):

| File | Relationship | Impact |
|------|-------------|--------|
| `src/other/caller.ts` | Calls `targetFunction()` | Needs signature update |

**Multi-repo scope**: <"Single repo" or list of affected repos>

---

### Bidirectional Scope Verification

#### Ticket scope vs code reality

| Finding | Direction | Detail |
|---------|-----------|--------|
| WARN | Ticket too narrow | Ticket mentions X but callers Y and Z also need changes |
| WARN | New work unacknowledged | Ticket references module that doesn't exist yet |
| INFO | Scope matches | File X exists and matches ticket description |
| WARN | Ticket too vague | "Update the API" actually touches N files across M modules |

---

### Definition of Ready Compliance

| Check | Status | Notes |
|-------|--------|-------|
| Title (verb-first, specific) | PASS/FAIL | ... |
| Description (context + rationale) | PASS/FAIL | ... |
| Acceptance Criteria (testable) | PASS/FAIL | ... |
| Priority set | PASS/FAIL | ... |
| Assignment | PASS/FAIL | ... |
| Labels | PASS/FAIL | ... |
| Estimate (if team uses estimates) | PASS/FAIL/N/A | ... |

**Ambiguous language found**: [list flagged phrases or "None"]

---

### Dependencies

| Source | Dependency | Tracked in Linear? | Action Needed |
|--------|-----------|-------------------|---------------|
| Description mentions "after auth refactor" | XXX-20 | No | Add blocking relation |
| Code imports `@shared/utils` | Shared package | N/A | Verify compatibility |

---

### Edge Cases & Risks

- [Edge case 1 — not mentioned in ticket]
- [Edge case 2 — error path not covered by acceptance criteria]
- [Breaking change — migration/API contract/config change]

### Test Gap Analysis

| Affected Area | Test Coverage | Risk |
|--------------|--------------|------|
| `src/module/` | 85% (unit) | Low |
| `src/other/` | 0% (no tests) | HIGH — ticket will modify untested code |

---

### Complexity Score: X/5

[Brief justification per rubric dimension — see complexity-rubric.md]

### Split Recommendation

<"Not needed — scope is appropriate" or SPIDR analysis with suggested sub-tickets>

---

## Proposed Changes

1. ...
2. ...
3. ...

Which changes should I apply? (e.g., "1,2,4" or "all")
```
