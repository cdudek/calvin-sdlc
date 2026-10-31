---
title: Oxford-Class Grading Rubric for Claude Code Repo Setup
audience: claude-setup-audit skill
status: canonical
created: 2026-05-07
philosophy: Calibrated for excellence — First-Class is the standard the practice deserves.
---

# Grading Rubric — Oxford Classification

This rubric is **rigorous**. It calibrates for genuine excellence: First-Class is the target a serious team holds itself to. The lower distinctions are precise statements of where the setup stands, not consolation prizes.

The audit produces a grade in the Oxford degree-classification system.

---

## The five classes

| Grade | Range | Meaning | Action |
|---|---|---|---|
| **First** (1st) | 85–100 | Exemplary. The repo could be a reference for other teams. | Maintain. Quarterly drift audit. |
| **Upper Second** (2:1) | 70–84 | Strong but flawed. Genuinely good work that misses First by specific, addressable margins. Most public Tier-A repos sit here. | Optimisation pass. Specific fixes. |
| **Lower Second** (2:2) | 55–69 | The setup exists but isn't yet doing meaningful work. | Substantial reshape. Consider re-init. |
| **Third** (3rd) | 40–54 | Substandard. The minimum effort doesn't yet add value over no setup at all. | Re-init from scratch. |
| **Fail** | 0–39 | Not Claude-Code-ready. AI work happens despite the setup, not because of it. | Re-init. |

`First` is the standard a serious team holds itself to. `2:1` represents strong work; the gap to First is specific addressable details that the remediation list surfaces.

---

## The five dimensions

Each dimension is scored 0–20. Total = sum (0–100). The grade is determined by total **and** by floor rules (failing a dimension hard caps the overall grade).

### D1. Foundation — CLAUDE.md (20 points)

Measures the always-on context layer.

| Points | Criteria |
|---|---|
| 18–20 | Root CLAUDE.md exists, ≤150 lines, lists exact commands, has Do-NOT and Verify sections, generated files declared, pointer to deeper context. **Engineering Principles section present with all four Karpathy principles (OMR-2.13).** No AGENTS.md drift. Nested CLAUDE.md only where they earn their place. |
| 14–17 | Root CLAUDE.md exists, ≤200 lines, most sections present but one weak (e.g. no Verify gate). Or one redundant nested CLAUDE.md. |
| 10–13 | Root exists but >200 lines, OR missing critical section (commands), OR has long prose, OR contains plan/handover content. |
| 5–9 | Root exists but is essentially boilerplate / language-default restatement / generic platitudes. Or AGENTS.md present and divergent. |
| 0–4 | No root CLAUDE.md, OR multiple empty CLAUDE.md files, OR contradictory content across files. |

**Hard cap:** D1 < 10 caps overall grade at **2:2**.

### D2. Configuration — `.claude/settings.json` and hygiene (20 points)

Measures the deterministic enforcement and team-sharing layer.

| Points | Criteria |
|---|---|
| 18–20 | `settings.json` committed with `defaultMode: acceptEdits`, strong `deny` list (env, secrets, credentials), correct allow-list syntax, no personal paths. `settings.local.json` gitignored and untracked. `$schema` set. |
| 14–17 | Settings present and reasonable but missing one element (e.g. no `defaultMode`, weak deny list, or schema not set). |
| 10–13 | Settings present but contains anti-patterns: personal absolute paths, wrong Bash syntax (`pnpm install:*` for non-script commands), missing deny list. |
| 5–9 | Only `settings.local.json` exists, OR settings tracked that should be gitignored. |
| 0–4 | No settings.json, OR committed credentials, OR `settings.local.json` checked in with personal data. |

**Hard cap:** D2 < 10 (committed personal data, missing deny list) caps overall grade at **2:2**.
**Hard cap:** committed credentials anywhere → automatic **Fail**.

### D3. Enforcement — hooks (20 points)

Measures whether critical invariants are enforced, not just hoped for.

| Points | Criteria |
|---|---|
| 18–20 | Tier-1 blockers present (generated, secrets, vendor-managed) AND every project linter runs on edit for in-loop CI feedback — `omr-dev`'s plugin-level `post-edit-lint` hook covers ESLint/Stylelint; anything else needs a repo-local equivalent. Hooks are external scripts with documented headers. Narrow matchers. |
| 14–17 | Tier-1 blockers present, but a project linter the plugin hook does not run has no repo-local hook. OR all four hooks present but inline (instead of external scripts). |
| 10–13 | One Tier-1 blocker present. OR hooks exist but matchers are loose / broad. |
| 5–9 | Hooks declared in CLAUDE.md as advisory rules but not implemented as hooks. |
| 0–4 | No hooks. Critical invariants are advisory only. |

**Floor:** if the repo has no generated files, secrets, or vendor-managed files, D3 is scored on lint-on-edit coverage and any custom hooks. D3 cannot be auto-pass — even simple repos benefit from a lint hook. A JS/TS repo gets the ESLint/Stylelint half of that for free from the plugin hook; credit it, and score the remainder on the linters it does not run.

### D4. Modularity — skills, subagents, rules (20 points)

Measures whether reusable workflows are first-class.

| Points | Criteria |
|---|---|
| 18–20 | At least 2 skills, all directory-based, verb-named, with `references/` and `scripts/` where useful. Subagents exist only with explicit isolation justification. Path-scoped rules used for cross-cutting concerns. |
| 14–17 | Skills present, mostly correct, but one anti-pattern (a flat-file skill, or a noun-named skill, or one persona-zoo subagent). |
| 10–13 | Skills declared in CLAUDE.md but not in `.claude/skills/`. OR commands used where skills should be. |
| 5–9 | Persona-zoo subagents (`backend_dev`, `qa`, `cto`). OR all "skills" are actually flat command files. |
| 0–4 | No skills, no subagents, no rules. Repeatable work happens via copy-paste prompts. |

**Floor:** repos with no repeatable workflows score on absence-of-anti-patterns; max 14 if no skills exist.

### D5. Documentation and discoverability (20 points)

Measures whether a new engineer (human or AI) can find their way without prior context.

| Points | Criteria |
|---|---|
| 18–20 | `docs/` folder exists with a clear table of contents. CLAUDE.md "Where to find more" section points to nested CLAUDE.md, skills, and docs. Plans live in `.claude/plans/` with frontmatter. Audit reports archived in `.claude/audits/`. |
| 14–17 | Most pointers present but one missing (e.g. no audit history, no docs/, or no nested-CLAUDE pointer). |
| 10–13 | docs/ exists but contains stale/contradictory content. OR pointer section absent. |
| 5–9 | No discoverability layer; engineer must grep to find conventions. |
| 0–4 | No docs/, no pointers, no plans/audits archive. Setup is opaque from outside. |

---

## Hard-cap rules (apply after summation)

These cap the maximum grade regardless of total:

| Condition | Cap |
|---|---|
| Committed credentials, env files, or secrets in any tracked file | **Fail** |
| Personal absolute paths in committed `settings.json` (e.g. `/Users/<name>/...`) | **2:2** |
| `.claude/settings.local.json` tracked in git | **2:2** |
| AGENTS.md and CLAUDE.md exist with diverging content | **2:1** |
| Root CLAUDE.md > 500 lines | **2:1** |
| Empty (0-byte) CLAUDE.md committed anywhere | **2:1** |
| Persona-zoo subagents shipped (`backend_dev`, `qa`, etc., without scoped tools) | **2:1** |
| Plans/handovers in `src/**/plan.md` | **2:1** |
| Hooks exist but are not executable (`chmod -x`) | **2:1** |
| Engineering Principles section absent or missing ≥ 2 of the four named principles (OMR-2.13) | **2:1** |

---

## How the audit reports

The audit skill produces (a) a numeric score per dimension, (b) the resulting class, (c) the hard-cap rules triggered, (d) a list of specific failed rules from `omr-checklist.md`, (e) a remediation plan ordered by leverage.

Repos may not declare themselves "First" without re-running the audit and clearing every hard-cap rule and scoring 85+. Self-grading without the audit is not allowed.

---

## Why this calibration

In an environment where AI-assisted development is the default, the gap between a good Claude setup and an exceptional one compounds quickly. A 2:1 repo loses small amounts of context every session, prompts the user too often, lets generated files get edited, leaks personal config, and sees its conventions drift. The cumulative cost over six months is substantial.

A First-Class repo loses none of that. The rubric is calibrated so First-Class is a target a serious team can hold itself to — challenging but achievable through specific, named improvements.
