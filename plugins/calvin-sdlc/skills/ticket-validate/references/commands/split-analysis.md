---
allowed-tools: "mcp__claude_ai_Linear__* Read Glob Grep Agent Bash(git log *) Bash(ls *)"
---

# Split Analysis

Focused decomposition analysis for tickets that are too large. Applies the SPIDR framework and proposes concrete sub-tickets.

## Usage

```
/calvin-sdlc:ticket-validate split-analysis <ticket-id>
```

## Instructions

### Step 1 — Gather context

1. `get_issue` with `includeRelations: true` — fetch the ticket with full description and relations
2. If ticket belongs to a project: `get_project` for project context
3. Parse description for technical references, then Glob/Grep/Read to understand scope

### Step 2 — Complexity Assessment

Apply the complexity rubric from `references/complexity-rubric.md`:
- Count affected files and modules
- Check cross-module boundaries
- Assess novelty (existing patterns vs greenfield)
- Check external dependencies
- Evaluate test coverage needs

### Step 3 — Apply SPIDR Framework

Using patterns from `references/split-patterns.md`, analyze the ticket through each lens:
- **Spike** — is there uncertainty that needs a timeboxed investigation first?
- **Path** — can the work be split by user flow or happy path vs error paths?
- **Interface** — can the work be split by API layer vs implementation?
- **Data** — can the work be split by data source, entity, or migration step?
- **Rule** — can business rules be implemented incrementally?

### Step 4 — Propose Sub-Tickets

For each recommended split, provide:
- Suggested title (verb-first)
- Scope description (2-3 sentences)
- Dependencies between sub-tickets
- Recommended sequence

### Step 5 — Report

```
## Split Analysis: <TICKET-ID> — <title>

### Complexity Score: X/5
[Brief justification]

### Blast Radius
- Files: N files across M modules
- [list key files/modules]

### Recommended Split (SPIDR: <pattern used>)

| # | Sub-Ticket | Scope | Depends On | Size |
|---|-----------|-------|------------|----------|
| 1 | "Spike: ..." | ... | — | ... |
| 2 | "Add ..." | ... | #1 | ... |
| 3 | "Integrate ..." | ... | #2 | ... |

### Rationale
[Why this split pattern, what alternatives were considered]

## Proposed Changes

1. Create sub-ticket: "Spike: ..."
2. Create sub-ticket: "Add ..."
3. Create sub-ticket: "Integrate ..."
4. Update parent ticket: convert to tracking issue
...

Which changes should I apply? (e.g., "1,2,3" or "all")
```

### Step 6 — Apply Selected Changes

Same apply flow as the full validation — see SKILL.md Step 7.

## Examples

```
/calvin-sdlc:ticket-validate split-analysis DAT-123
```

```
/calvin-sdlc:ticket-validate split-analysis ENG-45
```
