---
allowed-tools: "mcp__claude_ai_Linear__* Read Glob Grep Agent Bash(git log *) Bash(git blame *) Bash(ls *)"
---

# Validate Ticket (Full)

Runs the complete validation pipeline against a Linear ticket.

## Usage

```
/calvin-sdlc:ticket-validate <ticket-id>
/calvin-sdlc:ticket-validate validate <ticket-id>
```

Where `<ticket-id>` is a Linear identifier (`DAT-123`), URL, or UUID.

## Instructions

Follow the full workflow from SKILL.md Steps 0-7:

1. Parse the ticket identifier from user input
2. Launch parallel agents for Linear context gathering (2-level deep) and codebase analysis
3. Detect multi-repo scope and analyze sibling repos if available
4. Run bidirectional scope verification
5. Execute all validation checks (Definition of Ready, ambiguity, dependencies, edge cases, test gaps, breaking changes, conflicts, complexity)
6. Generate split recommendations if complexity > 3
7. Present structured report with numbered actionable proposals
8. Wait for user selection, then apply chosen changes

## Examples

```
/calvin-sdlc:ticket-validate DAT-123
```

```
/calvin-sdlc:ticket-validate https://linear.app/omr/issue/ENG-45/add-rate-limiting
```

```
/calvin-sdlc:ticket-validate validate DAT-456
```
