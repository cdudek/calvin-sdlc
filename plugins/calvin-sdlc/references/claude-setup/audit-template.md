---
title: Audit Report Template
audience: claude-setup-audit skill
status: canonical
created: 2026-05-07
---

# Audit Report Template

Every audit report uses this exact structure so reports are **comparable across repos and over time**. Comparability is the whole point.

The template is a markdown file written to `.claude/audits/YYYY-MM-DDTHHMM-audit-<repo>.md`.

---

```markdown
---
type: audit
status: final
created: <YYYY-MM-DD HH:MM>
auditor: <Claude session ID or "Calvin Dudek (via Claude)">
project: <repo name>
commit: <git rev-parse HEAD>
branch: <git branch --show-current>
rubric_version: 2026-05-07
---

# Claude Code Repo Audit — <repo name>

## Verdict

**Grade: <First | Upper Second (2:1) | Lower Second (2:2) | Third | Fail>**
**Score: <total>/100**
**Hard-cap rules triggered: <count>**

> One-paragraph summary in the auditor's voice. Direct, no hedging.
> "This repo is a 2:2. The CLAUDE.md is workmanlike but does not earn its tokens. There are no hooks. The settings.json is committed but missing a deny list, and a personal absolute path was found on line 14. Three rings of the architecture are unused. The remediation list below is ordered by leverage."

---

## Score by dimension

| Dimension | Score | Notes |
|---|---|---|
| D1. Foundation (CLAUDE.md) | <0–20> | <one line> |
| D2. Configuration (settings.json + hygiene) | <0–20> | <one line> |
| D3. Enforcement (hooks) | <0–20> | <one line> |
| D4. Modularity (skills, subagents, rules) | <0–20> | <one line> |
| D5. Documentation and discoverability | <0–20> | <one line> |
| **Total** | **<0–100>** | |

---

## Hard-cap rules

> Each triggered rule, with file:line evidence.

- ❌ **<rule code>**: <description>. Evidence: `<file>:<line>`. Cap: <Fail | 2:1 | 2:2>.
- ✅ <rule code>: passed.

---

## Failed rules (from checklists/d0[1-5]-*.md)

> Every rule that did not pass, grouped by section. With file:line evidence and severity.

### R1. CLAUDE.md presence and size
- ❌ **R1.3**: Root CLAUDE.md is 217 lines (target ≤150). Evidence: `CLAUDE.md`. Severity: medium.

### R2. CLAUDE.md content quality
- ❌ **R2.4**: Generated files not declared. Evidence: `CLAUDE.md` has no Do-NOT entry for `*.generated.ts`. Severity: high.

### R5. settings.json quality
- ❌ **R5.3**: No deny list for `.env*` or secrets. Evidence: `.claude/settings.json:8`. Severity: high.
- ❌ **R5.5**: Personal absolute path detected. Evidence: `.claude/settings.json:14` references `/Users/<name>/...`. Severity: high. **Hard-cap: 2:2.**

### R6. Hooks
- ❌ **R6.3**: No `block-generated-edit` hook. Severity: high.

### R8. Subagents
- ❌ **R8.6**: Persona-zoo subagent detected: `.claude/agents/backend_dev.md`. Severity: high. **Hard-cap: 2:1.**

> ... continue for every failed rule ...

---

## Strengths

> What the repo does well. Brief, specific, with evidence. Three to seven bullets.

- Root `CLAUDE.md:5–18` is exemplary — exact commands, no prose padding.
- `add-graphql-op` skill at `.claude/skills/add-graphql-op/SKILL.md` follows the spec correctly with `references/conventions.md` co-located.
- `.gitignore:42` correctly excludes `.claude/settings.local.json`.

---

## D1 Content-Match Findings (informational; not graded)

> Comparison of what CLAUDE.md *claims* against what the repo *actually has*. These findings drive `claude-setup-migrate` Step 5 (regeneration) and `claude-setup-apply` Step 6 (fixing orphan claims). Always populated, even on First-Class repos.

### Missing from CLAUDE.md (detected in repo)

- **Top commands**: `package.json:scripts` declares 12; CLAUDE.md mentions 4. Missing: `lint`, `typecheck`, `test:watch`, `e2e:debug`, `codegen`, `bump-omrjs`, `prepare`, `format`.
- **Generated file gotcha**: detected `src/gql/**/*.generated.ts` (47 files), `src/components.d.ts`. No warning present in CLAUDE.md.
- **Lockfile / package-manager directive**: `pnpm-lock.yaml` present; CLAUDE.md mentions neither pnpm nor a "use the right package manager" directive.
- **Test framework**: `vitest.config.ts` detected; "Verify before declaring done" doesn't include a test step.

### Claimed in CLAUDE.md but NOT detected (orphan claims)

- CLAUDE.md mentions "run `make deploy`" but no `Makefile` exists. Likely stale directive — verify or remove.
- CLAUDE.md references `src/legacy/` — directory not present.

### Conflicts (claim ≠ detection)

- CLAUDE.md says Node ≥ 20; `package.json:engines.node` says `>=22.11.0`. Update CLAUDE.md.
- CLAUDE.md lists `pnpm dev` on port 3000; `vite.config.ts:server.port` is 8000.

### `docs/` link-out coverage

- `docs/development.md` — not linked from CLAUDE.md (potentially valid `@`-import target for "Build & Test Commands").
- `docs/architecture.md` — linked at `CLAUDE.md:78` ✓

---

## Remediation plan — ordered by leverage

> Every failed rule, ordered by impact-per-effort. Numbered. Each item has: action, file, expected outcome.

### Tier 1 — must fix (do today)

1. **Add deny list to `.claude/settings.json`** — adds `Read(.env*)`, `Read(secrets/**)`, the narrowed credential reads (`Read(**/*credentials.*)`, `Read(**/credentials)`, …), `Bash(rm -rf *)`. Lifts D2 by ~3 points. Removes a hard-cap risk.
2. **Remove personal absolute path from settings.json line 14** — replace with a relative path or move to `.claude/settings.local.json`. Removes the 2:2 hard cap.
3. **Add `block-generated-edit` hook** — write `.claude/hooks/block-generated-edit.sh` per `architecture-guide.md §5.3`. Lifts D3 by ~6 points.

### Tier 2 — should fix (this sprint)

4. **Trim root CLAUDE.md from 217 to ≤150 lines** — move folder-specific content to nested CLAUDE.md. Lifts D1 by ~2 points.
5. **Remove persona-zoo subagent** `.claude/agents/backend_dev.md` — it provides no advantage over default Claude. Lifts D4 by ~5 points and removes 2:1 hard cap.

### Tier 3 — nice to have (this quarter)

6. **Add a `post-edit-lint` PostToolUse hook for RuboCop** — ESLint/Stylelint already run on edit via `omr-dev`'s plugin hook; RuboCop does not. Lifts D3 by ~2 points and surfaces CI failures in-loop.

---

## Recommended next action

> The audit recommends; the user runs.

- **`claude-setup-apply`** if grade is below First-Class. The skill detects state and dispatches: bootstrap (greenfield), archive-then-regenerate (vendor files / stub CLAUDE.md / `.cursor/rules/*.mdc`), or apply Tier-1/2 fixes from the Remediation plan above (substantive CLAUDE.md with drift). Idempotent — safe to re-run.
- **No action needed** if grade ≥ First and no vendor files detected. Re-audit quarterly to catch drift.

---

## Comparability metrics

> Numbers that allow comparison to other audits and to past audits of this repo.

| Metric | Value |
|---|---|
| Root CLAUDE.md line count | <int> |
| Number of nested CLAUDE.md files | <int> |
| Total CLAUDE.md line count (all files) | <int> |
| `.claude/settings.json` size (bytes) | <int> |
| Number of hooks defined | <int> |
| Number of skills | <int> |
| Number of subagents | <int> |
| Number of rules files | <int> |
| Number of MCP servers | <int> |
| Number of hard-cap rules triggered | <int> |
| Number of failed rules total | <int> |

---

## Comparison to previous audit

> Optional. Only if a previous audit exists in `.claude/audits/`.

| Metric | Previous (<date>) | Current | Δ |
|---|---|---|---|
| Total score | 67 | 78 | +11 |
| Grade | 2:2 | 2:1 | ↑ |
| Hard-cap rules | 2 | 0 | -2 |
| Failed rules | 14 | 6 | -8 |
| Root CLAUDE.md lines | 312 | 142 | -170 |

---

## Auditor's note

> One paragraph. Honest. Strict. Not encouraging unless encouragement is earned.
> "This repo improved meaningfully since the last audit but is still 2:1. The first-loser bucket. The remediation list above is the path to First. None of the items take more than 30 minutes; the entire list is ~3 hours of work. There is no excuse for staying at 2:1."
```

---

## Rules for filling the template

1. **No grade inflation.** A 2:1 is a 2:1. Do not write "this is essentially a First" if the score is 78.
2. **Evidence or it didn't happen.** Every failed rule cites `file:line` or `file` if line-level isn't applicable.
3. **Strengths section is short.** Three to seven bullets max. If strengths fill a page, the auditor is hedging.
4. **Auditor's note is honest.** State the verdict plainly. The rubric is calibrated for genuine excellence; the note should reflect that calibration, not soften it.
5. **Remediation tiers are ordered by leverage**, not by ease. Tier 1 = highest impact-per-hour. Tier 1 sometimes contains hard things.
6. **Comparability metrics are mandatory.** Without them, audits don't compose over time.
