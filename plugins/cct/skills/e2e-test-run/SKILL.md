---
name: e2e-test-run
description: OMR's rulebook for end-to-end tests, the automated checks that click through the product like a customer would. It answers which customer journeys deserve one, how a test should find buttons and text so wording or design changes do not break it, how to wait without slowing or flaking, which states (empty, error, refused, expired) to cover, and how AI agents may write and repair tests. Includes Playwright setup and the lint rules that enforce it. It explains and sets up; it writes no tests. Use whenever someone asks "what should we e2e test", "which journeys are critical", "how should this Playwright test be written", "which locator", "how do I wait for this", "why does every copy or design change break our tests", "how do we avoid flaky tests", "set up Playwright" or "what is journeys.md". To write, run or repair tests use cct:e2e-write; from a Linear ticket use cct:e2e-from-ticket-write; to diagnose one flaky test use cct:flaky-test-fix.
allowed-tools: "Bash(npx:*) Bash(npm:*) Bash(node:*) Bash(bash */e2e-test-run/scripts/*) Read Grep Glob"
user_invocable: true
metadata:
  version: 2.0.0
  author: calvindudek
---

# The OMR e2e standard

An end-to-end test is the most expensive test we write and the one most likely to fail for
a reason unrelated to the product. It earns its place only by proving something no cheaper
test can: that the real build, database, auth, routing and browser work together for a
person doing something that matters. Everything in this skill follows from that.

This skill is the reference. The agents in `cct:e2e-write` read the same files before
they write anything, so an answer given from here and a spec written by an agent agree.

## Which file answers which question

Read only the one you need. Each rule lives in exactly one file; a rule in two files is
wrong in one of them within a month.

| The question | Read |
|---|---|
| Is this worth an e2e test? Which journeys are critical? What goes in `e2e/journeys.md`, and what if it is missing? Which states must a journey cover? How big may the suite get? Flaky tests and quarantine? Where tests run? Rules for AI agents? | `references/strategy.md` |
| Which locator? How do I keep copy out of a spec? Personas and sign-in? | `references/locator-policy.md` |
| How do I wait for something? Timers, network, hydration, downloads, polling? | `references/waiting.md` |
| Installing Playwright, config, auth setup, CI, debugging, upstream tools | `references/setup-and-tools.md` |
| Why is the suite slow or unreliable? Measurement, control runs, fixtures, load, gate repeats, known traps and repair boundaries | `references/suite-speed-and-reliability.md` |

## In one sentence

Test the few journeys that would cost money, consent, access or data if they broke, assert
what the person can perceive rather than how it is built, wait for facts rather than time,
and never let the agent that changes a test decide what the test expects. The reasons are
the five beliefs in `references/strategy.md` section 1.

## When the repo has no journey inventory

Treat a missing `e2e/journeys.md` as the first thing to fix, before any new spec. Draft it,
grouped by audience and persona, with a recommended tier and a state list for every
journey, and hand it to a person to confirm owners and tiers. `references/strategy.md`
section 2 says how; `cct:e2e-write journeys` does it. From then on every feature adds
or updates its journey row in the same PR that changes the behaviour.

## Installing the standard in a repo

```bash
bash ${CLAUDE_SKILL_DIR}/scripts/install-lint.sh <repo-root>
```

Writes the lint preset, the copy-catalogue rule, the `t()` copy helper, the token helper and
the persona and journey templates. It detects the spec directory and the copy catalogue,
never overwrites an existing file, and prints what is left to do by hand.

Then gate pull requests on the assertion guard, which fails a diff that removes assertions
or adds `.skip`, `.fixme` or `.only`:

```bash
bash ${CLAUDE_SKILL_DIR}/scripts/assertion-guard.sh origin/main e2e
```

## Two upstream tools OMR does not use, and why

**Playwright's own test agents** (`npx playwright init-agents`) scaffold a second planner,
generator and healer beside ours. Their healer prompt says to "do the most reasonable thing
possible to pass the test" and to mark a test `test.fixme()` when it believes the test is
correct and keeps failing, which is exactly the case most likely to be a real bug. Its edit
tool is unscoped. Its generator works from the accessibility snapshot, so it binds every
assertion to visible English copy. Borrow the planner's plan format; use nothing else.

**Playwright MCP** streams the full accessibility tree into context on every step: about
114K tokens per task against about 27K for a CLI, by Playwright's own measure. OMR explores
pages with the `agent-browser` CLI (`cct:browser-automate`). The committed spec is plain
`@playwright/test` either way, so this is a cost decision. If you are debugging by hand and
MCP is already connected, use it; do not build a skill or agent on it.
