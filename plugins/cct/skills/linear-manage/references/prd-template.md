# PRD Template

**Linear object:** Document (attached to a Project)
**Source:** this file. The Linear workspace held a template of the same name until 2026-09-12; it was deleted,
so there is no live version to fetch.
The Requirements section carries the EARS grammar, which the deleted Linear version never had.

**Requirements are EARS with `F`/`N` numbers, inside the MoSCoW buckets.** Gherkin is optional and
usually belongs in the issues this PRD spawns, not here. Grammar:
`../sdlc-run/references/requirements-grammar.md`.

## MCP Steps

```
save_project:         # ensure the project exists first
  name: "<project>"
  team: "<team>"

create_document:
  title: "PRD: <Product / Feature Name>"
  project: "<project>"
  icon: ":page_facing_up:"
```

Then `update_document` with the body. Create minimal first, update second — long bodies on create
are the most common source of Linear 500s.

## Template

```markdown
# PRD: [Product / Feature Name]

## Executive Summary

### Vision

> One sentence describing the future state this enables. Customer benefit, not internal metrics.

[What this makes possible for customers]

### Why customers care

[The value proposition, in their words]

### Success metrics

| Metric | Current | Target | How measured | When measured |
|---|---|---|---|---|
| [North star] | [Baseline] | [Goal] | [Method] | [Cadence] |
| [Supporting] | [Baseline] | [Goal] | [Method] | [Cadence] |

## Problem and Solution

### Problem statement

[The problem]

**Evidence the problem exists:**

- [Data point, with source]
- [Customer quote or support theme]
- [Usage metric showing the pain]

**Impact:**

- Who is affected: [segment and scale]
- Current cost: [quantified]

**Cost of not solving:**

- [What happens if we do nothing]
- [Competitive or retention risk]

### Solution approach

[Brief description of the solution]

**User flows:** [link to the flow or wireframe — a Figma URL, not a local path]

### Guiding principles

- [e.g. "Ship weekly iterations over one big release"]
- [e.g. "User trust over feature velocity"]

## Strategic Context

**Business goals:** [the OKR or company goal this serves]
**Market opportunity:** [TAM / SAM / SOM, or the segment size with a source]
**Competitive landscape:** [who else solves this, and how]
**Why now:** [what changed that makes this the right quarter]

## Users

| User type | Current pain point | What they will do with this |
|---|---|---|
| [Persona] | [Problem] | [Use] |

## Requirements

> One EARS sentence per line, each with a number. The number is the handle the issues, the tests
> and the Definition of Done all use. Replace every adjective with a number.
> Mark anything unresolved as [NEEDS CLARIFICATION: <question>] — never guess it.

### Must have (required for launch)

- [ ] **F1** When [trigger], the system shall [response].
- [ ] **F2** If [error condition], then the system shall [response].
- [ ] **N1** The system shall [non-functional property with a number, e.g. answer in under 200 ms at p95].

### Should have (important)

- [ ] **F3** While [state], the system shall [response].

### Could have (if time allows)

- [ ] **F4** Where [feature is included], the system shall [response].

### Won't have (not this version)

- [Explicitly excluded, so the boundary is on the record]
- [Future consideration]

## Launch Plan

### Dependencies and blockers

**Dependencies:**

- [ ] [Team or system]: [what we need from them, by when]

**Potential blockers:**

- [Risk that could delay or stop launch]

### MVP scope

[What must be in v1]

**Target launch:** [date, or the quarter with the decision point that fixes it]

### Success criteria

- [ ] [Measurable launch criterion]
- [ ] [Pre-launch requirement]

### Key risks and mitigations

| Risk | Probability | Impact | Mitigation | Owner |
|---|---|---|---|---|
| [Risk] | H/M/L | H/M/L | [Plan] | [Who] |

## Open Questions

> Unresolved decisions and areas still needing discovery. Anything that blocks a requirement
> belongs inline as [NEEDS CLARIFICATION: question] instead, next to the requirement it blocks.

- [ ] [Question]

---

**Status:** [Draft | Approved]
**Author:** [Name]
**Last updated:** [YYYY-MM-DD]
**Related:** [research, designs, RFC, ADR]

---

# Optional sections

> Add only when the product actually needs them.

## Key use cases / Jobs to be done

**[Scenario name]**

- **When:** [situation or trigger]
- **I need to:** [goal]
- **So I can:** [outcome]

## Product components

#### [Component name]

- **Purpose:** [what it does]
- **Must-have features:** [list]
- **Success metric:** [how we measure it]

## Phasing and roadmap

### Phase 1: [Name]

**Goal:** [what we learn or prove] · **Scope:** [what we build] · **Success:** [metric target]
```

## Why MoSCoW and EARS together

MoSCoW answers "does this ship in v1"; EARS answers "what exactly must be true". They are different
questions and a template that only asks one of them produces either a prioritised list of vague
wishes, or a precise specification with no launch boundary.

The `Won't have` bucket is not filler. An explicitly excluded item is the cheapest scope control
there is — it is the one an engineer can point at six weeks later.

## Where the grammar is enforced

This PRD is where `F1`, `F2`, `N1` are born. Every issue this PRD spawns cites those numbers, and
the Definition of Done in each issue checks its own. That chain is the only traceability in the kit,
and it breaks the moment someone writes a requirement without a number.
