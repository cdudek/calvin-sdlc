---
name: ticket-validate
description: Validates a Linear ticket's assumptions against the checked-out codebase before development begins. Catches bad scope, missing dependencies, hidden complexity, and oversized tickets. Use when user mentions "validate ticket", "check ticket", "validate issue", "ticket assumptions", "pre-development check", "Definition of Ready", "definition of ready", or provides a Linear ticket ID/URL and asks to verify it against the code.
allowed-tools: "mcp__claude_ai_Linear__* mcp__linear__* Read Glob Grep Agent Bash(git log *) Bash(git blame *) Bash(ls *)"
user_invocable: true
metadata:
  version: 1.0.0
  author: calvindudek
---

# Validate Ticket Skill

Fetches a Linear ticket and validates its assumptions against the checked-out codebase. Catches bad scope, missing dependencies, hidden complexity, and oversized tickets before a developer picks up the ticket.

After validation, proposes actionable changes as a numbered list. The user selects which to apply, and the skill executes them via Linear MCP.


## Routing

The user input is: $ARGUMENTS

Read the first word as the subcommand and route to its file, passing the rest on as arguments.

| Subcommand | Does |
|---|---|
| `quick-check` | Fast Definition of Ready pass — validates ticket structure and quality without deep codebase analysis. Designe → `references/commands/quick-check.md` |
| `split-analysis` | Focused decomposition analysis for tickets that are too large. Applies the SPIDR framework and proposes concre → `references/commands/split-analysis.md` |
| `validate` | Runs the complete validation pipeline against a Linear ticket → `references/commands/validate.md` |

No subcommand, or one that is not in the table: say
`Usage: /calvin-sdlc:ticket-validate <quick-check | split-analysis | validate>`
and ask which one they meant. Never guess — the subcommands do different things.

## Core Principles

1. **Bidirectional scope verification** — compare what the ticket says vs what the code actually requires, in both directions
2. **Code is truth** — the codebase is the authoritative source; ticket descriptions are claims to verify
3. **Actionable output** — every finding must lead to a concrete proposal (update ticket, add criteria, create sub-ticket, add relation)
4. **Depth-limited traversal** — max 2 levels of Linear relations, ~10 related tickets. Prevent runaway MCP calls.
5. **No file output** — report prints to conversation only

## Sub-Commands

| Command | Purpose | When to use |
|---------|---------|-------------|
| `/calvin-sdlc:ticket-validate` or `/calvin-sdlc:ticket-validate validate` | Full validation | Default — complete analysis before starting work |
| `/calvin-sdlc:ticket-validate quick-check` | Fast Definition of Ready pass | Grooming sessions, quick triage |
| `/calvin-sdlc:ticket-validate split-analysis` | Focused decomposition | When you already know the ticket is too big |

## Instructions

### Step 0 — Parse Input

Accept any of:
- Linear identifier: `DAT-123`, `ENG-45`
- Linear URL: `https://linear.app/omr/issue/DAT-123/...`
- UUID: `a1b2c3d4-...`

Extract the ticket identifier. If ambiguous, ask the user.

### Step 1 — Parallel Data Gathering

Launch **two agents simultaneously**:

#### Agent A — Linear Context (2-level deep)
1. `get_issue` with `includeRelations: true` — fetch the target ticket (title, description, state, priority, labels, assignee, project, relations)
2. If the ticket has no relations, skip to step 4 and note "No relations found — consider whether dependencies should be added" in the report
3. For each relation (blocks, blocked-by, related, parent, children) — fetch those tickets too (level 1)
4. For each level-1 ticket's relations — fetch one more level (level 2), capped at ~10 total tickets
5. If the ticket belongs to a project: `get_project` for project context
6. `list_comments` on the target ticket for additional context
7. Collect: all descriptions, acceptance criteria, comments, relation types, states

#### Agent B — Codebase Analysis
1. Parse the ticket description for technical references: file paths, module names, function names, API endpoints, config keys, database tables, service names
2. For each reference found:
   - `Glob` to find matching files
   - `Grep` to find usage patterns
   - `Read` key files to understand structure
3. Walk the dependency graph: imports, callers, callees, shared data structures, config files, test files, migration files
4. `git log` on affected files for recent churn and contributors
5. Check for test coverage in affected areas

### Step 2 — Multi-Repo Detection

If the ticket or code references other repos/services:
1. Check `../` for sibling repo clones
2. If found: spawn additional agents scoped to each sibling repo
3. If not found: note as "not available — clone to `../repo-name` to include in analysis"
4. Report findings grouped by repo

### Step 3 — Bidirectional Scope Verification

Apply the core analysis rule:

| Direction | What to check | Example finding |
|-----------|--------------|-----------------|
| **Ticket says X, code shows X+Y+Z** | Ticket scope too narrow | "Ticket mentions `auth.ts` but callers in `middleware/` and `routes/` also need changes" |
| **Ticket says X+Y+Z, code only has X** | Y and Z don't exist yet — flag as new work | "Ticket references `redis-cache` module but it doesn't exist — this is greenfield work" |
| **Ticket is vague** | Expand to concrete files/modules | "Ticket says 'update the API' — this actually touches 12 files across 3 modules" |
| **Ticket is hyper-specific** | Check blast radius | "Ticket targets `line 47 of foo.ts` but 8 callers of that function also need updates" |

### Step 4 — Validation Checks

Run all checks from the report template (`references/validation-report-template.md`):

1. **Definition of Ready Compliance** — acceptance criteria exist, are testable, non-ambiguous
2. **Ambiguous Language** — flag weasel words: "appropriate", "properly", "as needed", "various", "etc.", "should be fine", "simple"
3. **Dependency Detection** — compare explicit Linear relations vs dependencies inferred from code
4. **Edge Cases** — surface unmentioned error paths, null handling, concurrency, boundaries
5. **Test Gap Analysis** — check if affected areas have test coverage
6. **Breaking Changes** — flag migrations, API contract changes, config changes
7. **Related Ticket Conflicts** — check if other in-progress tickets modify the same code areas
8. **Complexity Score** — apply rubric from `references/complexity-rubric.md`

### Step 5 — Split Recommendations

If complexity > 3, or multi-repo, or blast radius significantly exceeds ticket scope:
- Apply SPIDR framework from `references/split-patterns.md`
- Suggest concrete sub-tickets with titles and scope descriptions

### Step 6 — Report + Proposals

Print the structured validation report (see `references/validation-report-template.md`), then present numbered actionable changes:

```
## Proposed Changes

1. Update ticket description: add missing scope for `src/middleware/auth.ts`
2. Add acceptance criterion: "Rate limiter returns 429 with Retry-After header"
3. Add blocking relation: DAT-120 blocks this ticket
4. Create sub-ticket: "Spike: Evaluate Redis vs in-memory rate limiting"
...

Which changes should I apply? (e.g., "1,2,4" or "all")
```

### Step 7 — Apply Selected Changes

- **"all"** → apply all proposals
- **single number** → apply that one
- **subset (e.g., "1,3,5")** → apply those, then re-evaluate remaining proposals (some may no longer make sense), present updated list for another round
- Linear write calls (`save_issue`, `save_comment`, etc.) go through the normal Claude Code permission system — do NOT add an extra approval layer

When applying:
- **Update ticket description**: `save_issue` with updated description
- **Add acceptance criterion**: `save_issue` appending to description
- **Add relation**: `save_issue` with `blocks`, `blockedBy`, or `relatedTo` arrays (append-only — existing relations are never removed)
- **Create sub-ticket**: `save_issue` for new issue, then `save_issue` on the new issue with `parentId` to link as child
- **Remove stale reference**: `save_issue` with updated description

## Error Handling

### Ticket not found
Cause: Invalid identifier or no access.
Solution: Ask the user to verify the ticket ID. Check if the Linear MCP is connected.

### MCP 500 errors
Cause: Linear MCP flakiness.
Solution: Retry 2-3 times. If persistent, run codebase-only analysis and note that Linear context is incomplete.

### Empty or missing description
Cause: Draft ticket or placeholder with no description content.
Solution: Fail the Definition of Ready check immediately. Report: "Ticket has no description — it is not ready for validation. Add a description with context, requirements, and acceptance criteria, then re-run." Skip codebase analysis entirely.

### No technical references found in ticket
Cause: Ticket is purely business-level with no code references.
Solution: Use the ticket title and description keywords to grep the codebase. Report what you find and note "ticket contains no explicit technical references — these were inferred from keywords."

### Sibling repo not cloned
Cause: Cross-repo ticket but repo not available locally.
Solution: Note in report: "Referenced repo `X` not found at `../X`. Clone it to include in analysis."
