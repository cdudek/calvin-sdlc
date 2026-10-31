---
allowed-tools: "mcp__claude_ai_Linear__* Read Glob Grep Bash(ls *)"
---

# Quick Check (Definition of Ready Only)

Fast Definition of Ready pass — validates ticket structure and quality without deep codebase analysis. Designed for grooming sessions where speed matters.

## Usage

```
/calvin-sdlc:ticket-validate quick-check <ticket-id>
```

## Instructions

### Step 1 — Fetch ticket

Use `get_issue` to fetch the ticket. No relation traversal — single ticket only.

### Step 2 — Definition of Ready Compliance Check

Evaluate the ticket against these criteria:

| Criterion | Pass | Fail |
|-----------|------|------|
| **Title** | Starts with a verb, describes the outcome | Vague or noun-only title |
| **Description** | Contains context, rationale, or technical detail | Empty or single sentence |
| **Acceptance Criteria** | At least 2 testable criteria with Given/When/Then or clear pass/fail conditions | Missing, vague, or untestable |
| **Priority** | Set | Unset |
| **Assignee or Team** | At least one assigned | Neither assigned |
| **Labels** | At least one type label | No labels |
| **Estimate** | Set (if team uses estimates) | Missing (if team uses estimates) |

### Step 3 — Ambiguous Language Scan

Flag these weasel words/phrases in the description and acceptance criteria:
- "appropriate", "properly", "correctly", "as needed", "various", "etc."
- "should be fine", "simple", "straightforward", "obvious"
- "handle edge cases", "make it robust", "ensure quality"
- "similar to X" (without specifying which aspects)
- Passive voice hiding who/what does the action

### Step 4 — Quick Scope Sniff

Do a fast `Grep` for any file paths, function names, or module names mentioned in the ticket. Report:
- Which references exist in the codebase
- Which don't exist (new work)
- Skip the full dependency graph — that's for the full validation

### Step 5 — Report

Print a compact report:

```
## Quick Check: <TICKET-ID> — <title>

### Definition of Ready Score: X/N (N = applicable checks)

| Check | Status | Notes |
|-------|--------|-------|
| Title | PASS/FAIL | ... |
| Description | PASS/FAIL | ... |
| Acceptance Criteria | PASS/FAIL | ... |
| Priority | PASS/FAIL | ... |
| Assignment | PASS/FAIL | ... |
| Labels | PASS/FAIL | ... |
| Estimate | PASS/FAIL/N/A | ... |

### Ambiguous Language
- [list of flagged phrases with suggested replacements]

### Scope References
- Found: `src/auth.ts`, `src/middleware/rate-limit.ts`
- Not found: `src/redis-cache.ts` (new work)

### Verdict: READY / NEEDS WORK
[1-2 sentence summary]
```

Do NOT present actionable proposals or apply changes — this is read-only.

## Examples

```
/calvin-sdlc:ticket-validate quick-check DAT-123
```

```
/calvin-sdlc:ticket-validate quick-check ENG-45
```
