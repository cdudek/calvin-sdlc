---
name: e2e-audit
description: Audits a repo's Playwright e2e suite for speed, flakiness, isolation and locator quality, and returns one ranked report where every finding links to its fix recipe. Reads the Playwright config, checks the kit lint, scans specs for anti-patterns (fixed sleeps, networkidle, positional locators, CSS selectors, force clicks), checks test isolation and git history, and reads slow and flaky specs from CI logs. Read-only. Use when the user says "audit our e2e tests", "why is the e2e suite slow", "flaky playwright suite", "e2e test quality", "are our playwright tests any good", "review our e2e setup", or "e2e health check".
allowed-tools: "Read Grep Glob Bash(python3 */e2e-audit/scripts/*) Bash(gh *) Bash(git *)"
user_invocable: true
context: fork
model: sonnet
effort: high
background: false
---

# E2E audit

A read-only audit of one repo's Playwright suite. It changes nothing. It produces one ranked
report; fixing is a separate step (`calvin-sdlc:flaky-test-fix` for flakes, `calvin-sdlc:e2e-write` for
new specs, `calvin-sdlc:e2e-test-run` for the policy).

## Prerequisites

| Dependency | Required | How to obtain |
|---|---|---|
| `python3` | Yes (step 3) | stdlib only, no packages |
| `gh` CLI, authenticated | No (step 6) | `brew install gh && gh auth login`; without it step 6 is skipped with a note |

## Procedure

Run the steps in order. Collect evidence as `file:line` plus a count; a finding with no
evidence is not reported. `<repo>` is the repo root the user named, else the current directory.

### 1. Config

Read `playwright.config.*` (also check `e2e/` and `tests/` for a second one). Record:

- `workers`, `fullyParallel`: `workers: 1` or `fullyParallel: false` is a throughput cap.
- `retries` for CI and local. More than 1 on CI hides races.
- `failOnFlakyTests` (Playwright 1.52+): absent means a test that passes on retry stays green.
- Timeouts: `timeout`, `expect.timeout`, `actionTimeout`, `navigationTimeout`. Raised values
  are a smell, not a fix.
- `projects`: the browser matrix. Every extra browser multiplies the run.
- `webServer`: `reuseExistingServer`, and whether the command is a dev server or a build.
- `trace`, `video`, `screenshot` set to `on` for every test is a cost.
- Gate commands: grep `package.json` scripts, `sdlc.json` `checks` and `.github/workflows`
  for `--repeat-each`. Repeating the whole suite is a finding; a gate repeats only changed
  specs plus `e2e/flaky-specs.txt`, and that file should exist when a gate repeats.

### 2. Lint

Is the kit lint installed? Look for `eslint.config.e2e.mjs` and the `no-catalogue-copy` rule
(`eslint-rules/no-catalogue-copy.js`) in the repo, and for the lint script in `package.json`
and CI. Missing means nothing mechanical stops the patterns in step 3 from coming back.
Install: `bash plugins/calvin-sdlc/skills/e2e-test-run/scripts/install-lint.sh <repo-root>`.

### 3. Scan

```bash
python3 ${CLAUDE_SKILL_DIR}/scripts/scan.py <repo>
```

Output is `-#-#- SUMMARY -#-#-` (`- key: value` rows) and a `SAMPLES` block with up to 5
`file:line` samples per pattern. Exit 2 means a bad path. Read the samples before ranking.
Counts are heuristic (line-based regexes); confirm a sample by reading its file before you
quote it.

| Key | Reading |
|---|---|
| `waitForTimeout`, `networkidle`, `force_true` | banned waits and hidden overlays |
| `nth`, `first_last`, `css_locator` | positional or structural binding |
| `getByText_literal` | user-visible string in a spec |
| `expect_await` | read-then-compare, samples once |
| `conditional_in_test` | a test that takes different paths is not deterministic |
| `skip_fixme` | coverage quietly turned off |
| `date_without_clock` | real time in a spec with no `page.clock` |
| `getByTestId`, `getByRole` | positive signal; report the ratio against the positional count |

### 4. Isolation

Read the fixtures and a sample of specs (not all). Check:

- **Login state.** One shared `storageState` for every test, or a declared persona per
  spec? A form login inside a spec is a finding.
- **Shared data.** Do tests read rows another test wrote, use fixed names, or depend on seed
  order? Look for teardown that is not in a fixture or `finally`.
- **Tenancy.** Is `workers: 1` forced by one shared database or tenant? Per-worker tenants
  keyed on `workerInfo.parallelIndex` are the fix.
- **Fixture.** Does `globalSetup` clone a production-sized or real-user dataset instead of
  building a small synthetic one? Do specs rewrite tracked files (screenshots, evidence),
  dirtying the tree a gate needs clean?
- **External services.** Grep `page.route`, `routeFromHAR`, `context.route`. Third-party
  providers, payment gateways and captchas should be faked at the boundary; the app's own API
  should not be.
- **Clock.** Grep `page.clock`. Timers, expiry and countdowns without it are flaky by design.

### 5. Growth

```bash
git log --since="12 months ago" --diff-filter=A --name-only --format=%as -- '*.spec.ts' '*.spec.js' '*.test.ts'
```

Bucket the added spec files by month and compare with CI duration (step 6). Spec count
growing while workers stay flat means wall time grows linearly; say so with the numbers.

### 6. Slow and flaky specs

If `gh` is missing or unauthenticated, print `step 6 skipped: gh not available` and continue.
Otherwise:

```bash
gh run list --workflow <e2e workflow> --limit 30 --json databaseId,conclusion,createdAt,updatedAt
gh run view <id> --log
```

Find the e2e workflow from `.github/workflows`. From the logs take: total wall time trend,
the slowest tests from the list reporter, tests marked flaky or retried, and tests that hit
their timeout (each costs the whole timeout). Failed-then-green reruns of the same commit are
flakes. Sort by time lost, not by count.

### 7. Report

One report, ranked. No finding without evidence.

```text
E2E audit: <repo>
Summary: <specs> specs, <tests> tests, CI wall time <t>, <n> findings (<x> high)

1. [high] <title>
   Evidence: <file:line samples>, count <n>
   Why it matters: <one sentence, with cost if known>
   Fix: <relative link into ../e2e-test-run/references/...>
```

Severity: **high** = causes flakes or blocks parallelism (fixed sleeps, `workers: 1`, shared
rows, retries above 1 with no `failOnFlakyTests`, unbounded timeouts); **medium** = makes the
suite brittle or slow (positional or CSS locators, `networkidle`, `force`, real clocks, no lint);
**low** = hygiene (`first_last` on unique elements, skipped tests with no owner).

Fix recipes, one per finding class:

| Finding | Recipe |
|---|---|
| `waitForTimeout`, `networkidle`, `expect_await`, `force_true`, raised timeouts | [waiting.md](../e2e-test-run/references/waiting.md) section 10 (banned and what to use instead) |
| Retries, `failOnFlakyTests`, flakes found in CI | [waiting.md](../e2e-test-run/references/waiting.md) section 11, then [strategy.md](../e2e-test-run/references/strategy.md) section 7 |
| `date_without_clock`, mocked-vs-real services | [waiting.md](../e2e-test-run/references/waiting.md) sections 6 and 7 |
| `nth`, `first_last`, `css_locator`, `getByText_literal` | [locator-policy.md](../e2e-test-run/references/locator-policy.md) sections 2, 3 and 5 |
| Lint not installed | [locator-policy.md](../e2e-test-run/references/locator-policy.md) section 8 |
| Shared login, shared rows, `workers: 1` | [strategy.md](../e2e-test-run/references/strategy.md) section 6, then [suite-speed-and-reliability.md](../e2e-test-run/references/suite-speed-and-reliability.md) section H |
| Slow suite, timeouts that exhaust, machine load, fixture cost, tracked evidence files | [suite-speed-and-reliability.md](../e2e-test-run/references/suite-speed-and-reliability.md) sections A to F and I |
| Whole-suite `--repeat-each`, no flaky list | [suite-speed-and-reliability.md](../e2e-test-run/references/suite-speed-and-reliability.md) section G |
| `skip_fixme`, quarantine | [strategy.md](../e2e-test-run/references/strategy.md) section 7 |
| `conditional_in_test` | [strategy.md](../e2e-test-run/references/strategy.md) section 6 (each test makes the world it needs) |

## Guardrails

- Read-only. Never edit specs, config or CI, and never run the suite.
- Never raise a timeout, add a retry or skip a test as a recommended fix; those are the
  findings, not the cures (repair boundaries:
  [suite-speed-and-reliability.md](../e2e-test-run/references/suite-speed-and-reliability.md)
  section J).
- Quote `file:line` evidence only for lines you have read.
