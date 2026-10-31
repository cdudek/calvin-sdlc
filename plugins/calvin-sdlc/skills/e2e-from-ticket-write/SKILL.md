---
name: e2e-from-ticket-write
description: The ticket-driven front door to e2e-write — turns a Linear ticket into a confirmed Markdown test plan in the planner's format, then hands off to the e2e-planner/e2e-generator to live-verify and generate. Use when user says "e2e from ticket", "scaffold e2e tests from a ticket", "write e2e for REV-123", "ticket to test plan", or gives a Linear ticket and asks for e2e coverage.
allowed-tools: "Bash(gh *) Bash(command -v *) Read Write Edit Grep Glob Agent Skill"
user_invocable: true
metadata:
  version: 1.2.0
  author: DawidJakubas
---

# E2E from ticket (ticket → plan → e2e-write)

The **ticket-driven entry** to the deterministic E2E workflow. It turns a Linear ticket into a
confirmed Markdown test plan, then hands the plan to the existing agents to generate the spec.

This skill does **NOT** re-implement planning, generation, or healing — those are the three
agents shipped with this plugin (`e2e-planner`, `e2e-generator`, `e2e-healer`), orchestrated by
`/calvin-sdlc:e2e-write`. This skill only adds the missing **ticket → plan** door that
`e2e-write` (surface-driven) lacks. Concept: `e2e-write <surface>` explores a live surface;
this explores a **ticket** and produces the same plan artifact the generator consumes.

## Prerequisites

| Dependency | Required | How to obtain |
|------------|----------|---------------|
| Linear MCP | Yes | connected Linear connector (`get_issue`, `list_comments`) — load via ToolSearch |
| `/calvin-sdlc:e2e-write` | Yes (for the hand-off) | this plugin |
| `agent-browser` CLI + running dev server | For the generate hand-off only | `npm i -g agent-browser && agent-browser install` (Node 24+); project dev command |
| `gh` CLI | Only for the PR/shipped-code fallback | `brew install gh && gh auth login` |

## Before anything

Read the target project's e2e conventions (`e2e/AGENTS.md` / `e2e/TESTING.md`, existing specs):
the auth/persona seam, the data seam (`testData` fixture / factory), spec layout, env tags, and
locale for copy assertions. The plan must speak the project's conventions, not invent new ones.

## Workflow

1. **Parse the ticket input** — accept `REV-123`, a Linear URL, or a UUID. Fetch via Linear MCP
   `get_issue` (with `includeRelations: true`) + `list_comments`. Retry 2-3x on transient 500s.
2. **Extract acceptance criteria / user stories.** If the description is thin but a merged PR or
   a shipped component exists (check the ticket's linked PRs, or `gh` for the branch/PR), fall
   back to that as the source of truth for behavior.
3. **Detect the target repo + its e2e conventions** (per "Before anything"). Identify the
   persona each scenario needs (logged-out / logged-in / admin) against the project's auth seam.
4. **Map each criterion → scenario:** persona, steps, expected result (the **copy key**, with the resolved string in brackets for a human; the
   locator policy bans raw copy in a spec), **explicit per-scenario data needs** (the hand-off point to the project's
   `testData` seam — never hardcode entity IDs), and env tags (`@staging` / `@production`).
5. **Place it in a journey.** Name the journey id from `e2e/journeys.md` the ticket changes,
   its tier, owner and states, or score a new one (`../e2e-test-run/references/strategy.md`
   section 2). A new feature adds its journey row, or its states to an existing journey, in
   the same PR (section 2.8). A T3 result means the ticket gets component or unit tests, not
   e2e: say so and stop. Plan a scenario per new lifecycle transition and per refusal on
   money, consent or access, and name the **defect to put back** per scenario.
6. **Write the plan** as Markdown at the project's plan location (e.g. `e2e/plans/<surface>.md`)
   in the same format `e2e-planner` emits. **Get explicit user confirmation. Write no spec here.**
7. **Hand off to generation** — with the confirmed plan, dispatch the **`e2e-generator`** agent
   (or run `/calvin-sdlc:e2e-write author --plan <path>`): it live-verifies selectors via
   agent-browser and writes the deterministic spec until green. Red specs later go through
   `e2e-write heal`.

## Hard constraints

- **Plan-only.** This skill stops at a confirmed Markdown plan; it never writes `.spec.ts`.
- **Reuse, don't duplicate.** Generation and healing are `e2e-generator` / `e2e-healer` — do not
  re-implement them here.
- **Data via the seam.** Every scenario's data needs are enumerated for the project's `testData`
  seam; committed specs never hardcode entity IDs and carry no runtime LLM.

For Playwright best practices and the generate/heal loop, see the sibling skills
`/calvin-sdlc:e2e-write` and `/calvin-sdlc:e2e-test-run` (do not duplicate
their content here). For the agent-browser CLI, see `/calvin-sdlc:browser-automate`.
