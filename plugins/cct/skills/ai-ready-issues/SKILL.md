---
name: ai-ready-issues
description: >
  Use when authoring software issues, tickets, backlog items, RFCs-as-tasks, or Linear/Jira/GitHub
  work items meant to be implemented by AI coding agents (or humans). Produces self-contained,
  spec-driven issues with EARS requirements, Gherkin acceptance criteria, context-engineered scope,
  Always/Ask/Never guardrails, and a machine-checkable Definition of Done. Triggers: "write an
  issue", "create a ticket", "create issues", "break this down into issues/tickets", "backlog",
  "Linear issue", "agent-ready issues", "spec-driven". Skip for technology-agnostic,
  business-facing developer tickets (Feature/User Story or Discovery/Spike) that describe the WHAT
  and leave implementation open — use write-ticket.
user_invocable: true
metadata:
  version: 1.0.0
  author: Maik Kummerfeldt
---

# Writing AI-Ready Issues (2026 standard)

The OMR standard for authoring implementation issues that an AI coding agent can pick up and finish
**autonomously and correctly on the first try**. Reflects the 2026 state of the art: spec-driven
development (GitHub Spec Kit, Amazon Kiro), EARS requirements + Gherkin acceptance, Anthropic
context engineering, and CI-enforced guardrails.

## Why this exists (read once)

An AI agent implementing an issue has **no shoulder to tap**. It cannot ask a colleague what "fast"
means or where the spec lives. The issue *is* its entire world. So an agent-ready issue must be:

- **Self-contained** — it carries, or links via a *resolvable* URL to, everything needed. The agent
  should be able to implement it without prior conversation context.
- **Spec-first** — define *what* and *why* before *how*. The spec is the primary artifact; the code
  is its expression. (Spec Kit, Kiro, Anthropic all converge on `Spec → Plan → Tasks → Implement`.)
- **Verifiable** — "done" is a command that passes and scenarios that go green, not an opinion.
- **Right-sized** — small enough that the agent's context stays well under the degradation zone
  (recall drops as context fills — keep issues focused; one coherent unit of work each).

## Hard rules (NEVER break these)

1. **NEVER reference a local / unhosted document path.** A `docs/FOO.md`, `ARCHITECTURE.md §3`, or
   any repo-relative *doc* path resolves to **nothing** in Linear/Jira/GitHub — the reader is
   outside the repo. Provide context by, in priority order:
   1. **Inlining** the load-bearing constraints directly in the issue (self-contained even if links die).
   2. A **resolvable URL** — a GitHub permalink pinned to a commit/tag
      (`https://github.com/<org>/<repo>/blob/<sha>/FILE.md#section`) or a hosted doc / Linear document.
   - **Repo *code* paths** (`src/ui/button.tsx`) are allowed **only** inside the labelled
     *"Implementation anchors (in-repo)"* section, as guidance for the coding agent working in the
     checkout — never as the sole pointer to required *spec* context.
2. **NEVER write vague acceptance criteria.** Replace adjectives with numbers: not "fast" but
   "p95 < 200ms"; not "a large file" but "≥ 50k rows". Vague = the agent invents its own target.
3. **NEVER omit the unhappy paths.** Empty input, duplicates, permission denied, timeouts — define
   them, or the agent invents the behaviour.
4. **NEVER tell the agent to modify tests to make them pass**, or to touch unrelated modules, or to
   add dependencies without approval.
5. **NEVER use unsanctioned shortcuts** the repo bans (e.g. OMR's arbitrary-value Tailwind ban).

## The template (9 sections, in order)

Drop this into the issue body. Keep it tight — favour inlined essentials + one resolvable link over
walls of pasted code.

```markdown
# <Imperative title — "Add Dutch-auction countdown to lead detail">

## 1. Context & Why
2–4 sentences: the user/business outcome and why it matters. "What & why", not "how".

## 2. Source of Truth (inline first, then resolvable links — NO local paths)
- <Inlined load-bearing constraint 1>
- <Inlined load-bearing constraint 2>
- Full spec → <GitHub permalink pinned to a commit, or hosted/Linear doc>

## 3. Requirements (EARS — one behaviour per line)
- Ubiquitous: The system shall <response>.
- Event:      When <trigger>, the system shall <response>.
- State:      While <state>, the system shall <response>.
- Optional:   Where <feature present>, the system shall <response>.
- Unwanted:   If <error/condition>, then the system shall <response>.

## 4. Acceptance Criteria (Gherkin — incl. unhappy paths)
Scenario: <name>
  Given <context with concrete data>
  When  <action>
  Then  <observable, numeric outcome>

## 5. Scope & Out-of-Scope
- In:  <bullets>
- Out: <bullets — prevents scope drift & over-building>

## 6. Implementation anchors (in-repo — for the coding agent)
File paths, modules, data models, key constraints. Strong heuristics, NOT a dictated algorithm.

## 7. Guardrails (Always / Ask / Never)
- Always: <run typecheck/lint/test; follow repo conventions; …>
- Ask:    <before irreversible/risky steps; before adding deps>
- Never:  <modify tests to pass; touch unrelated modules; reference local doc paths; arbitrary values>

## 8. Definition of Done (machine-checkable)
- [ ] Tests written first (TDD), committed failing, then green — tests unchanged.
- [ ] `<exact verify commands>` pass (e.g. `pnpm typecheck && pnpm lint && pnpm test`).
- [ ] All Gherkin scenarios (incl. unhappy paths) pass.
- [ ] Acceptance criteria in §4 satisfied.

## 9. Open Questions
- [NEEDS CLARIFICATION: <question>]  ← the agent must NOT guess these; resolve before implementing.
```

## The grammar lives in one file

EARS patterns, the Gherkin pairing, `[NEEDS CLARIFICATION: ...]` and the rule for which document
gets which grammar: `references/requirements-grammar.md`. Read it before writing section 3 or 4.

It is the single owner. `cct:sdlc-run`, `cct:linear-manage` and `cct:write-ticket` all
point at that same file. Never copy a pattern table into another skill — the copy drifts, and then
two skills teach two grammars.

## Context engineering (right altitude)

- Aim for **specific enough to guide, flexible enough to leave the algorithm to the agent.** Avoid
  both over-vague ("make it nice") and over-specified (a dictated line-by-line implementation).
- **More context is not safer.** Agent recall degrades as context fills. Include the *smallest set
  of high-signal tokens*: the relevant constraints, the data model, 1–2 canonical examples, and an
  explicit out-of-scope list. **Link** the full spec rather than pasting it — but **inline** the
  load-bearing constraints so the issue survives a dead link.

## Guardrails: Always / Ask / Never

Put behavioural boundaries in §7. **But anything irreversible or security-relevant must be enforced
outside the issue text** — instructions in a ticket can be ignored or "prompted away". Back the
load-bearing ones with **CI / branch protection / permissions** (e.g. required status checks, a
protected `master`, append-only DB grants). The issue states the boundary; CI enforces it.

## Definition of Done & TDD

DoD must be **observable and runnable**, not subjective. Prefer the TDD loop (Anthropic's strongest
agent pattern): write tests first → confirm they fail → commit them as a checkpoint → implement to
green **without editing the tests**. Always list the **exact verify commands** the agent must run
and pass.

## Worked example

```markdown
# Build interaction primitives: button state matrix, toasts, global loading bar

## 1. Context & Why
Every surface needs consistent, accessible feedback primitives. Trust is the conversion; honest,
predictable interaction states are load-bearing. (Backlog: ds-interaction, Must, PRD §7.15.)

## 2. Source of Truth (inline first)
- Button states (inlined): default / hover / active / focus-visible / loading / disabled. Focus =
  2px purple ring (the only sanctioned ring). Reduced-motion disables transitions.
- Loading bar (inlined): 4px, fixed top, full-width, indeterminate, OMR Action Purple; slides DOWN
  on navigation start, UP on completion; under prefers-reduced-motion = opacity fade only, never positional.
- Toasts (inlined): subtle status fill + matching dark ink + matching-tier border; success role=status,
  error role=alert; never white text on a bright fill.
- Full spec → https://github.com/ramp106/reviews-projects-marketplace/blob/<sha>/FRONTEND-GUIDELINES.md#5

## 3. Requirements (EARS)
- The system shall expose a Button supporting default/hover/active/focus-visible/loading/disabled.
- When a route transition starts, the system shall show a 4px top indeterminate bar sliding down.
- When a route transition completes, the system shall slide the bar up and unmount it.
- While prefers-reduced-motion is set, the system shall animate the bar by opacity only.
- If an async action succeeds outside the user's focus, the system shall show a success toast.

## 4. Acceptance Criteria (Gherkin)
Scenario: Loading bar respects reduced motion
  Given the OS sets prefers-reduced-motion: reduce
  When a navigation starts
  Then the bar appears via opacity only, with no positional slide
Scenario: Button shows loading without layout shift
  Given a primary Button
  When it enters the loading state
  Then a spinner shows, the label is retained, width is unchanged, and aria-busy="true"

## 5. Scope & Out-of-Scope
- In:  Button, Toaster, TopLoadingBar primitives + their states.
- Out: page-level data wiring; skeletons (separate issue); the dark sidebar (separate issue).

## 6. Implementation anchors (in-repo)
src/ui/{button,toaster,top-loading-bar}.tsx · tokens via Tailwind v4 @theme · shadcn Sonner for toasts.

## 7. Guardrails (Always / Ask / Never)
- Always: token-only styling; respect prefers-reduced-motion; run typecheck/lint/test + axe.
- Ask:    before adding any new dependency.
- Never:  arbitrary Tailwind values; outline:none without a visible replacement; reference local doc paths.

## 8. Definition of Done
- [ ] TDD: tests written first, committed failing, then green (unchanged).
- [ ] `pnpm typecheck && pnpm lint && pnpm test` pass.
- [ ] All Gherkin scenarios pass; axe reports 0 violations on a demo page.

## 9. Open Questions
- [NEEDS CLARIFICATION: toast stack max + auto-dismiss durations (success vs error)?]
```

## Linear specifics

- **Workspace conventions go in Linear "Agent Guidance" once** — which repo, how to reference issues
  in commits/PRs, the review process — not repeated in every issue.
- **Links in Linear must be resolvable URLs** (GitHub permalinks / hosted docs / Linear documents).
  Never paste a local path. Inline the essentials so the issue stands alone.
- Use structured **labels / project / milestone** fields so agents can query work.
- Assigning an issue to an agent **delegates** it; a human stays the owner/assignee of record.
- Follow the OMR Linear reliability pattern: **create minimal (title + team), then update** with the
  full body in a second call; retry 2–3× on 500s.

## Sources

- Anthropic — Effective context engineering for AI agents · Claude Code best practices (TDD).
- GitHub Spec Kit (Constitution → Specify → Plan → Tasks; `[NEEDS CLARIFICATION]`).
- Amazon Kiro (requirements.md/design.md/tasks.md; EARS).
- Alistair Mavin — EARS. · Cucumber/Fowler — Gherkin / Given-When-Then.
- Linear — AI Agents docs / Agent Interaction Guidelines.
