---
dimension: D5
title: Documentation and discoverability
---

# D5 — Documentation

Rules governing whether a new engineer (human or AI) can find their way without prior context. Covers `docs/`, "Where to find more" pointer hygiene, plan/audit history, generated-files declaration, and absence-of-anti-patterns.

All rules are **OMR-opinion** (`OMR-11.x`–`OMR-14.x`).

---

## Plans and handovers (OMR-11.x)

### OMR-11.1 — Plans live in `.claude/plans/`

- **Source**: omr-team
- **Severity**: Required
- **Applies to**: claude-setup-audit, claude-setup-migrate

**Check:** Plans live in `.claude/plans/` only — not `~/.claude/plans/` (ephemeral), not `src/**/plan.md`, not arbitrary `reports/` or `planning/` directories.
**Fails when:** plan content found outside `.claude/plans/`.
**Remediation:** Move with frontmatter. Hard-cap on this is 2:1 if found in `src/**/plan.md` per `grading-rubric.md`. Common offenders observed in OMR repos: `planning/` directory (myomr), `.ai-docs/` (reviews-agents), `reports/` (when used for plans).

### OMR-11.2 — Plan filename pattern

- **Source**: omr-team
- **Severity**: Recommended
- **Applies to**: claude-setup-audit

**Check:** Plan files match `YYYY-MM-DDTHHMM-<type>-<topic>.md`.
**Fails when:** filenames don't match the pattern.
**Remediation:** Rename. Sortable. Types: `plan`, `handover`, `roadmap`, `strategy`, `rfc`, `audit`.

### OMR-11.3 — Plan YAML frontmatter present

- **Source**: omr-team
- **Severity**: Recommended
- **Applies to**: claude-setup-audit

**Check:** Plan files have YAML frontmatter with `type`, `status`, `created`, `author`, `project`, optionally `supersedes`.
**Fails when:** frontmatter missing or incomplete.
**Remediation:** Add frontmatter per the standard.

### OMR-11.4 — Non-trivial work has a plan file before implementation

- **Source**: omr-team
- **Severity**: Recommended (advisory — not enforceable from a static audit)
- **Applies to**: claude-setup-audit (informational), Claude Code session behaviour

**Check:** This rule is advisory rather than mechanically auditable. The intent: tasks that span 3+ steps OR involve architectural decisions OR will produce more than ~150 LoC of substantive change should have a plan file in `.claude/plans/` before implementation begins.
**When to create a plan:**
- Multi-step features that span more than one work session
- Architectural decisions (which library to use, how to structure a new layer, etc.)
- Migrations that touch multiple files / require coordinated commits
- Any task where context-clear is likely between starting and finishing
**When NOT to create a plan:**
- Simple bug fixes (point at the failing test, write the patch)
- Single-file refactors of obvious shape
- Tasks where "the diff is the plan"
**Audit behaviour:** When OMR-11.4 is detectable from PR signals (e.g. a PR with > 150 LoC and 3+ commits but no corresponding `.claude/plans/<topic>.md` file), the audit reports it as informational. No grade penalty — this rule's value is process discipline, not enforcement.

### OMR-11.5 — Plan `status` is valid; no stale `active` plans

- **Source**: omr-team
- **Severity**: Recommended
- **Applies to**: claude-setup-audit

**Check:** For every `.claude/plans/*.md` file:
- `status:` frontmatter field is one of `draft`, `active`, `completed`, `superseded`, `handover`. Other values fail validation.
- If `status: active`, the file's `created:` (or `updated:` if present) is within the last 30 days. Active plans older than 30 days indicate either abandoned work or stale status that should be `completed` / `superseded`.
**Fails when:** any plan has an unrecognised status value, OR ≥ 1 `active` plan with `created:` > 30 days ago.
**Why:** Status validation prevents typos that confuse search/filter. The 30-day staleness check catches the recurring failure mode where a team starts a plan, finishes the work, and forgets to update the status — leaving the plans folder full of "active" items nobody is actually working on.
**Remediation:** Bump status to `completed` when work merges. Bump to `superseded` when a newer plan replaces the old one (and set `supersedes:` on the new file). Delete or archive plans that are genuinely abandoned.

### OMR-11.6 — Old completed plans archived (≥ 90 days)

- **Source**: omr-team
- **Severity**: Optional
- **Applies to**: claude-setup-audit

**Check:** Plans with `status: completed` older than 90 days should be moved to `.claude/plans/archive/<YYYY>/` to keep the active plans folder scannable.
**Fails when:** > 10 completed plans older than 90 days reside directly in `.claude/plans/` (rather than `archive/`).
**Why:** `.claude/plans/` should be a working folder, not a graveyard. Archived plans remain in git history; moving them to a dated `archive/` subfolder keeps the active list ergonomic.
**Remediation:** `git mv .claude/plans/2026-01-*.md .claude/plans/archive/2026/` (or similar). Single commit per archive move.

### Plan vs handover — semantic distinction

| Type | Purpose | Lifecycle | Example trigger |
|---|---|---|---|
| `plan` | Forward-looking work breakdown — what we're going to do, in what order, with what tradeoffs | `draft` → `active` → `completed` (or `superseded`) | Starting a multi-step feature; making an architectural decision |
| `handover` | Session-end snapshot — where work was paused, what's left, key context for resumption | `active` (until resumed) → `completed` (when work resumes from it) or `superseded` (by a follow-up plan) | About to clear context with work in progress; ending a long session before completion |

Both go in `.claude/plans/` with the same naming convention; the `type:` frontmatter field disambiguates. A common pattern: a session ends with a `handover`, the next session opens that handover, converts it to a `plan` with concrete next steps, marks the handover `superseded`.

---

## Generated files declared (OMR-12.x)

### OMR-12.1 — Generated file patterns listed in CLAUDE.md "Do NOT" section

- **Source**: omr-team
- **Severity**: Required (when generated files exist)
- **Applies to**: claude-setup-audit, claude-setup-apply

**Check:** If repo has files matching common generated patterns (`*.generated.ts`, `components.d.ts`, `auto-imports.d.ts`, `schema.graphql`, lockfiles), CLAUDE.md (or effective content) explicitly lists them under a "Do NOT edit" section.
**Fails when:** generated files present but undeclared.
**Remediation:** Add to "Do NOT" section. Pair with a `block-generated-edit` hook (D3) for enforcement.

### OMR-12.2 — `block-generated-edit` hook exists for those patterns

- **Source**: omr-team
- **Severity**: Recommended
- **Applies to**: claude-setup-audit, claude-setup-apply

**Check:** When generated files exist, a PreToolUse hook blocks edits to them.
**Fails when:** advisory rule in CLAUDE.md but no hook enforcement.
**Remediation:** Add the hook.

### OMR-12.3 — `.gitattributes` marks generated files (optional)

- **Source**: community-pattern (vercel/next.js, oven-sh/bun)
- **Severity**: Optional
- **Applies to**: claude-setup-audit

**Check:** `.gitattributes` includes `*.generated.ts linguist-generated=true` (or equivalent for the repo's generated patterns).
**Fails when:** generated files exist but not flagged in `.gitattributes`.
**Remediation:** Add the directive. GitHub will collapse generated files in diffs.

---

## Documentation pointer hygiene (OMR-13.x)

### OMR-13.1 — `docs/` folder exists for human-readable reference

- **Source**: omr-team
- **Severity**: Recommended
- **Applies to**: claude-setup-audit

**Check:** `docs/` directory exists with at least one substantive `.md` file.
**Fails when:** no `docs/` and no equivalent (e.g. `.claude/docs/`).
**Remediation:** Create `docs/` with at least architecture, testing, deployment notes. Link via `@`-imports from CLAUDE.md (CHECK-13).

### OMR-13.2 — Root CLAUDE.md has "Where to find more" pointer section

- **Source**: omr-team
- **Severity**: Recommended
- **Applies to**: claude-setup-audit

**Check:** CLAUDE.md has a section pointing readers to nested CLAUDE.md, `.claude/skills/`, `.claude/audits/`, and `docs/` files.
**Fails when:** no pointer section.
**Remediation:** Add. Keep it short — bullet list of paths with one-line purposes.

### OMR-13.3 — No legacy docs that contradict current CLAUDE.md guidance

- **Source**: omr-team
- **Severity**: Recommended
- **Applies to**: claude-setup-audit

**Check:** No `docs/*.md` files reference removed tooling (e.g. Cypress when migrated to Playwright), wrong folder paths, or contradict CLAUDE.md gotchas.
**Fails when:** stale docs found.
**Remediation:** Update or remove. Stale docs mislead Claude and humans equally.

### OMR-13.4 — "Where to find more" pointers annotate retrieval semantics AND task triggers

- **Source**: omr-team
- **Severity**: Recommended
- **Applies to**: claude-setup-audit, claude-setup-apply

**Check:** Every pointer in the "Where to find more" section (or equivalent) annotates **two things**:

1. **`consult for:` — what kinds of tasks should make Claude (or a human) reach for this doc.** A short list of 2–4 concrete trigger phrases (e.g. "adding GraphQL operations, picking the right client, codegen issues"). Tells the reader the doc's subject matter at task granularity, not just topic granularity.

2. **Retrieval timing — when the pointed-to content reaches Claude.** One of five canonical phrases:

| Phrase | When | Applies to |
|---|---|---|
| `auto-loaded at session start` | Always in context | Root CLAUDE.md, `@`-imports, `.claude/rules/*.md` without `paths:` frontmatter |
| `auto-loads when working in <folder>/` | When Claude reads files in that folder | Nested `<folder>/CLAUDE.md` |
| `auto-loads when touching <pattern>` | When Claude touches matching files | `.claude/rules/*.md` with `paths:` frontmatter |
| `read on demand` | When Claude judges relevant | Plain markdown links to `docs/<file>.md` |
| `manually invoked` | User triggers | Slash commands, subagents, skills with `disable-model-invocation` |

**Fails when:** ≥ 2 pointers omit either annotation. **Topic-only** pointers like `e2e/CLAUDE.md — Playwright conventions` fail — they tell you the *subject* but not when to consult OR when it loads.

**Why both annotations:**
- *Retrieval timing* tells the reader (human or Claude) whether the content is already in context or has to be fetched. Inspectable always-on surface.
- *Task triggers* tell Claude WHEN to reach for the doc — turning passive "available" into active "use when ___." The Anthropic best-practices doc says "Use specific instructions Claude can verify"; the same logic applies to pointers — a vague topic label requires the reader to guess; concrete triggers don't.

**Format (recommended):**
```
- <path> — <topic> (consult for: <trigger 1>, <trigger 2>, <trigger 3>; <retrieval phrase>)
```

**Remediation example:**
```markdown
- `e2e/CLAUDE.md` — Playwright conventions, auth flow, env config (consult for: writing/debugging e2e tests, auth flow changes, switching `E2E_ENV`; auto-loads when working in `e2e/`)
- `.claude/rules/forms.md` — DataProvider + Vuelidate patterns (consult for: building forms, wiring data fetching, `$can()` authorization; auto-loads when touching `src/{components,ui,views}/**`)
- @docs/architecture.md — GraphQL + component architecture overview (consult for: data-flow design, new feature architecture, understanding the four-client split; auto-loaded at session start)
- `docs/development.md` — extended dev/test workflows (consult for: dev environment setup, troubleshooting builds, Make/npm script details; read on demand)
- `/calvin-sdlc:claude-setup-audit` — re-grade this repo (consult for: drift checks, comparing to baseline; manually invoked)
```

### OMR-13.5 — Reference docs match the project archetype, with canonical names

- **Source**: omr-team
- **Severity**: Recommended
- **Applies to**: claude-setup-audit, claude-setup-apply

**Check:** Reference docs use the canonical OMR names and cover the archetype
(`architecture-guide.md §2.6 / §2.6a`):

- **UI / frontend app** → `DESIGN.md` + `PRODUCT.md` at root, plus `ARCHITECTURE.md` / `CONVENTIONS.md` / `TESTING.md` (root or `docs/`); the UI folder's CLAUDE.md references `DESIGN.md` + `PRODUCT.md`.
- **MCP / backend service** → `PRODUCT.md` + `docs/{architecture,security,logging}.md`; the deploy folder's CLAUDE.md references the runbook docs.
- **Infra / GitOps** → `CONVENTIONS.md` + `docs/{architecture,technical-design}.md` + runbooks; each layer folder's CLAUDE.md references `CONVENTIONS.md`.

**Fails when:** reference docs exist under ad-hoc names (`guidelines.md`, `notes.md`) instead of the canonical set; OR a subfolder CLAUDE.md doesn't point at the archetype's relevant docs; OR an archetype-expected doc the repo clearly needs is absent.
**Remediation:** Rename to the canonical set; add the missing pointer(s) in the subfolder CLAUDE.md. **Do not fabricate** a doc's content to pass — if it genuinely doesn't exist, note the gap in CLAUDE.md (an empty placeholder fails harder than an honest gap).

---

## Anti-patterns absent (OMR-14.x)

These rules check for the *absence* of known failure modes. The audit reports a finding when an anti-pattern is present.

### OMR-14.1 — No persona-zoo subagents

- **Source**: community-pattern (cross-references OMR-8.6)
- **Severity**: Required
- **Applies to**: claude-setup-audit

**Check:** No subagents named `backend_dev`, `frontend_dev`, `qa`, `cto`, `ux`, `ops`, etc. without scoped tools.
**Fails when:** any persona-zoo agent.
**Remediation:** See OMR-8.6.

### OMR-14.2 — No flat-file skills

- **Source**: community-pattern (cross-references OMR-7.6)
- **Severity**: Required
- **Applies to**: claude-setup-audit

**Check:** No `*.skill.md` flat files.
**Fails when:** any flat-file skill.
**Remediation:** See OMR-7.6.

### OMR-14.3 — No CLAUDE.md essays > 500 lines

- **Source**: omr-team
- **Severity**: Required (2:1 hard cap if violated)
- **Applies to**: claude-setup-audit

**Check:** No CLAUDE.md (root or nested) exceeds 500 lines without explicit justification.
**Fails when:** any CLAUDE.md > 500 lines.
**Remediation:** Aggressively split. 500+ lines means the file has become a dumping ground.

### OMR-14.4 — No hardcoded credentials in any tracked file

- **Source**: omr-team
- **Severity**: Required (auto-Fail hard cap)
- **Applies to**: claude-setup-audit

**Check:** Search committed files for credential-shaped strings: `API_KEY=`, `SECRET=`, `TOKEN=`, plaintext passwords in `*.json`, AWS/GCP key patterns.
**Fails when:** any hardcoded credential found in tracked files.
**Remediation:** Rotate immediately + remove from history. Triggers the auto-Fail hard cap.

### OMR-14.5 — No dead test framework folders

- **Source**: omr-team
- **Severity**: Recommended
- **Applies to**: claude-setup-audit

**Check:** No `cypress/`, `jasmine/`, `protractor/`, etc. directories from previous testing setups.
**Fails when:** dead framework dir found.
**Remediation:** Delete. Fresh-eye contributors will think they're current.

### OMR-14.6 — No untracked-empty CLAUDE.md files

- **Source**: omr-team
- **Severity**: Recommended (cross-references OMR-1.5)
- **Applies to**: claude-setup-audit

**Check:** No 0-byte CLAUDE.md files in working tree.
**Fails when:** any found.
**Remediation:** See OMR-1.5.

### OMR-14.7 — No duplicate AGENTS.md / agents.md / CLAUDE.md (md5-identical)

- **Source**: community-pattern (observed in OMR repos via repo introspection 2026-05-07)
- **Severity**: Required
- **Applies to**: claude-setup-audit, claude-setup-migrate

**Check:** Compute md5 of root `CLAUDE.md`, `AGENTS.md`, `agents.md` (case-sensitive on case-sensitive filesystems). No two files share the same md5.
**Fails when:** any pair has identical content.
**Remediation:** Pick CLAUDE.md as canonical. Either delete the duplicates or convert AGENTS.md to a one-line `@CLAUDE.md` import.
**Real-world prevalence:** 3 of 7 OMR repos surveyed have this issue (reviews-api has 3-way identical, reviews-frontend and reviews-agents have 2-way).

---

## Cross-references

For rules that span dimensions:

- **OMR-3.4** (subtree convention reach) sits in D1 but the migration triage logic for orphan files is in `migration-guide.md`.
- **CHECK-13** (`@path/to/file.md` import syntax) escalates to Required when content checks fail — that severity-escalation rule is documented in d01-foundation.md.
- **Frontend plugin recommendation** (OMR-FE.1) lives in `d04-modularity.md` because it's about which plugins should be enabled, not about documentation.
