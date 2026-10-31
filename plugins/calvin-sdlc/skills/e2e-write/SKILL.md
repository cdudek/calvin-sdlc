---
name: e2e-write
description: Writes, runs and repairs the automated end-to-end tests that click through a product like a customer would. It lists the product's customer journeys by audience when that list (e2e/journeys.md) is missing, explores a page live, writes Playwright tests that are proven to fail when the feature breaks, and repairs tests that broke after a product change without loosening what they check. Use whenever someone wants tests written or extended — "write e2e tests for this page", "cover this feature end to end", "cover the critical journeys", "draft our journeys.md", "the e2e suite is red, heal it", "/e2e". For how tests should be written use calvin-sdlc:e2e-test-run; from a Linear ticket use calvin-sdlc:e2e-from-ticket-write; for one test that passes and fails at random use calvin-sdlc:flaky-test-fix.
allowed-tools: "Bash(npx playwright *) Bash(command -v *) Bash(git diff *) Bash(ls *) Bash(bash */e2e-test-run/scripts/*) Read Edit Write Glob Grep Agent Skill"
user_invocable: true
metadata:
  version: 2.0.0
  author: calvindudek
---

# Author E2E (planner → generator → healer)

The repeatable E2E workflow: the classic planner → generator → healer concept, where the
browser **driver for exploration is the agent-browser CLI** (not Playwright MCP) and the
committed artifact is **plain deterministic `@playwright/test` with NO runtime LLM**.
Concept mapping: `journeys` drafts the inventory, `author` is planner + generator, `run`/`check`
is execution, `heal` is the healer.

This skill is the **orchestrator**: it dispatches the three agents shipped with this plugin
(`e2e-planner`, `e2e-generator`, `e2e-healer`). Dispatch on the first word of the argument.

## Prerequisites

| Variable / Dependency | Required | Format | How to obtain |
|-----------------------|----------|--------|---------------|
| `agent-browser` CLI | For `author`/`heal` only | on PATH | `npm i -g agent-browser && agent-browser install` (Node 24+) |
| `@playwright/test` | Yes | project devDependency | the target project's package.json |
| Running dev server | For `author`/`heal` | project dev command | seeded/dev DB per project docs |

`run`/`check` need no agent-browser — they are plain Playwright. For CLI usage details see
`/calvin-sdlc:browser-automate`.

**The rules live in the e2e standard's references folder**, at
`${CLAUDE_PLUGIN_ROOT}/skills/e2e-test-run/references/`: `strategy.md` (what is worth testing,
journeys, states, budget, quarantine, the AI rules), `locator-policy.md` (how a spec binds to
the page), `waiting.md` (how it synchronises) and `suite-speed-and-reliability.md` (fixtures,
suite execution and known traps). The three agents read them before they
write anything. **Resolve that folder to an absolute path once (`ls` it) and put it in every
dispatch prompt**, because an agent's Read tool does not expand the variable. Do not restate
the rules here and do not argue with them in a prompt. `/calvin-sdlc:e2e-test-run` owns that policy plus Playwright
setup, config and debugging; this skill owns the loop. If you are asking *how should this be
written*, you want that skill. If you are asking *write it*, you are in the right place.

## Before anything

Read the target project's `e2e/journeys.md` (what is worth testing, by whom it is owned),
`e2e/personas.md` (who signs in, via which helper) and its testing
docs — spec layout, DB hygiene rules and the copy catalogue are project-specific and the
agents must be told where to find them. If `e2e/personas.md` is absent, say so and offer:

```bash
bash ${CLAUDE_PLUGIN_ROOT}/skills/e2e-test-run/scripts/install-lint.sh <repo-root>
```

which writes it along with the lint preset, the copy-catalogue rule and the `t()` fixture.

Hard constraints (apply to every mode):
- No runtime LLM in committed specs; agent-browser for exploration, not Playwright MCP.
- Shared seeded DBs stay clean: mutations are self-cleaning (`finally`) or non-destructive.
- Specs must be re-runnable on a used DB (no emptiness assertions on accumulating data).
- Content-based assertions over HTTP status; web-first assertions; no hard sleeps.
- **No spec contains a user-visible string** — it resolves one from the copy catalogue.
- **Nothing here edits application source.** A missing test id is reported, not added. The
  one exception is the generator's defect check: one line changed, one spec run, reverted
  and verified clean, on a file with no uncommitted work.
- **Every spec serves a journey** in `e2e/journeys.md` with a tier and an owner, and every
  new scenario is seen to fail with its defect put back.

## `journeys`

Drafts or refreshes `e2e/journeys.md`, the list of claims the suite makes, before any spec is
written. Use it when the file is missing, when a repo first adopts the standard, or at a
milestone to catch drift.

1. Dispatch the **`e2e-planner`** agent with the task "draft the journey inventory" and the
   references folder. It follows
   `../e2e-test-run/references/strategy.md` section 2.7: audiences and personas from the
   product's roles, journeys per audience, every existing spec mapped to a journey, a harness
   or "not a journey", a recommended score and tier per journey, and its lifecycle and screen
   states with the covered ones marked.
2. Show the person the T1 list, the uncovered T1 states and the specs that landed nowhere.
   Owners and tiers stay marked as recommendations until the person confirms them.
3. Commit the confirmed first draft in its own PR. After that, rows change in the same PR as
   the feature that changes them (strategy.md section 2.8). The uncovered T1 states are the
   next `author` runs.

## `author <surface>` / `author --plan <path>`

For fixture design and authoring traps, read
`../e2e-test-run/references/suite-speed-and-reliability.md` section D and I.1, I.2, I.5 and
I.6: deterministic data, entrance motion, native shortcut coverage, evidence output and
background sweep completion. Include this reference in the generator's dispatch prompt.

1. Confirm `command -v agent-browser` (else surface the install hint — never silently skip).
2. With `--plan <path>` (a confirmed plan, for example from `e2e-from-ticket-write`), skip to
   step 3. Otherwise dispatch the **`e2e-planner`** agent on `<surface>` → it explores via
   agent-browser and writes a markdown plan (e.g. `e2e/plans/<surface>.md`).
   - `INVENTORY MISSING`: run `journeys` first, get the person's confirmation, then start
     `author` again.
   - The path is T3: stop, recommend the lower-level test and write no spec.
3. Dispatch the **`e2e-generator`** agent with that plan → it live-verifies selectors,
   writes + runs the spec until green, then proves each scenario fails with its defect
   introduced.
4. Dispatch a **fresh-context reviewer** (a general-purpose agent that did not write the
   spec) with the plan and the spec: does each assertion check what the plan says, could it
   pass with the feature broken, does it assert anything the plan did not ask for. Fix what
   it finds.
5. Report the new spec path, the run result, and the defect each scenario caught.

For several surfaces, run the planner passes in parallel, then dispatch each generator as
its plan lands (no barrier).

## `run <path>` / `check`

Plain Playwright, no agents: `npx playwright test [path] --reporter=line` (or the project's
runner script). For failures, read `test-results/**/error-context.md` and summarize.

## `heal [paths]`

Dispatch the **`e2e-healer`** agent (optionally scoped to failing spec paths). It runs the
suite, triages each failure (regression, intentional change, test debt), repairs only test
debt and cited intentional changes, and leaves regressions red. It ends with
`assertion-guard.sh`, which fails a net drop in assertions or any new skip, fixme or only.
