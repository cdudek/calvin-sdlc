---
title: Migration Guide — From Legacy AI-Context (any vendor) to Claude Code Architecture
audience: claude-setup-migrate, claude-setup-apply, claude-setup-apply skills
status: canonical
created: 2026-05-07
last_updated: 2026-05-07 (vendor-scope expansion — adds .cursorrules, .github/copilot-instructions.md, GEMINI.md, .windsurfrules alongside AGENTS.md)
philosophy: Strict. Asks before destructive actions. No BS, no hand-holding past the point of usefulness.
---

# Migration Guide — Strict, No-BS

This guide takes a repository from any prior AI-context state — `AGENTS.md`, `.cursorrules`, `.github/copilot-instructions.md`, `GEMINI.md`, `.windsurfrules`, scattered `docs/<misc>.md`, `.cursor/rules/*.mdc` — to the canonical six-rings architecture defined in `architecture-guide.md`.

It is **strict**: each step has a precise check; if the check fails, stop and resolve before continuing. It does **not** include "consider whether…" or "you might want to…" softenings. Either do the step or skip it for a stated reason.

It is **interactive per vendor file** for disposition (single-vendor, symlink/redirect, or keep-diverging), and **per content cluster** for custom-content reconciliation. Everything else proceeds without confirmation in auto mode.

> **Skill-first reading order**: `claude-setup-migrate/SKILL.md` defines the operational sequence (Steps 1–11 with prompts and exact commands). This guide is the deeper specification — read it for rationale and edge-case handling. Where the two diverge, the SKILL is authoritative for what to *do*; the guide is authoritative for *why*.

---

## Phase 0 — Preconditions (no asks)

| Step | Action | Verify |
|---|---|---|
| 0.1 | Working tree clean: `git status` returns no uncommitted changes | `git status --short` empty |
| 0.2 | On a working branch (not main/master/develop): `git checkout -b chore/claude-migration` | `git branch --show-current` ≠ main branch |
| 0.3 | Repo has a primary language detected (Node, Python, Go, etc.) | `package.json`, `pyproject.toml`, `go.mod`, etc. exists |

If any precondition fails, abort with the failing reason. Do not proceed.

---

## Phase 1 — Detect existing AI-context state

Inventory every file Claude or another AI tool might be reading today.

```bash
# Run all of these and record the output
ls -la CLAUDE.md AGENTS.md agents.md GEMINI.md .cursorrules .windsurfrules 2>/dev/null
ls -la .github/copilot-instructions.md 2>/dev/null
ls -la .cursor/rules/*.mdc 2>/dev/null
find . -name "CLAUDE.md" -not -path "./node_modules/*" -not -path "./.git/*"
find . -name "AGENTS.md" -not -path "./node_modules/*" -not -path "./.git/*"
ls -la .claude/ 2>/dev/null
ls docs/ 2>/dev/null
md5 -q CLAUDE.md AGENTS.md agents.md GEMINI.md .cursorrules .windsurfrules .github/copilot-instructions.md 2>/dev/null
```

Classify each file:

- **Vendor file (plaintext, single-content)** — any of `AGENTS.md`, `.cursorrules`, `.github/copilot-instructions.md`, `GEMINI.md`, `.windsurfrules`. Migrate Step 5 handles disposition (single-vendor / symlink / keep-diverging) per file. Identical-content groups consolidated in Step 4.
- **Vendor file (multi-file with frontmatter)** — `.cursor/rules/*.mdc`. Flagged for manual conversion in Step 5.5; not auto-migrated.
- **Misplaced** — any `plan.md` / `handover.md` outside `.claude/plans/`. Step 8.
- **Empty** — 0-byte files (typically untracked).
- **Stale** — `docs/<name>.md` files referenced nowhere, last modified >12 months ago. `claude-setup-apply` Step 6 prompts for deletion.
- **Keep** — files actively useful and current. Step 9 auto-links matching docs into CLAUDE.md.

---

## Phase 2 — AGENTS.md handling (INTERACTIVE — ASK)

This is one of two interactive points. **Always ask the user.** Do not decide this autonomously.

### Step 2.1 — Detect

Check for AGENTS.md in the repo root and any subdirectory.

If none found, skip to Phase 3.

### Step 2.2 — Inspect the relationship

Run:

```bash
ls -la AGENTS.md CLAUDE.md
file AGENTS.md
diff -q AGENTS.md CLAUDE.md 2>/dev/null
readlink AGENTS.md 2>/dev/null
```

There are five possible states:

| State | Description | Detection |
|---|---|---|
| **A** | AGENTS.md only (no CLAUDE.md) | `CLAUDE.md` absent |
| **B** | AGENTS.md is a symlink to CLAUDE.md | `readlink AGENTS.md` returns `CLAUDE.md` |
| **C** | AGENTS.md and CLAUDE.md are identical files | `diff -q AGENTS.md CLAUDE.md` returns no diff |
| **D** | AGENTS.md and CLAUDE.md exist with different content | `diff -q` returns a diff |
| **E** | AGENTS.md is empty | `wc -c AGENTS.md` returns 0 |

### Step 2.3 — Default to CLAUDE.md (OMR standard)

Per `architecture-guide.md §2.5`, **OMR standardizes on `CLAUDE.md` — there is no live
`AGENTS.md`.** Do not ask the user which stance they want; apply the standard:

- **States A–E (any `AGENTS.md` present):** migrate to single-vendor `CLAUDE.md`. If `AGENTS.md`
  holds unique content, merge it into `CLAUDE.md` first (Step 2.4, Option 1), then delete
  `AGENTS.md` and repoint references.
- **Only pause to confirm** if a non-Claude tool in *this repo's own toolchain* genuinely
  requires an `AGENTS.md` (rare). If so, the answer is a literal **symlink**
  `AGENTS.md → CLAUDE.md` (Step 2.4, Option 2) — never a second maintained file.

Report the migration in the hand-off; don't block on a stance question that OMR has already
decided.

### Step 2.4 — Execute the chosen stance

**Option 1 — Single-vendor:**

```bash
# If AGENTS.md is a symlink AND user confirmed removal:
rm AGENTS.md

# If AGENTS.md is a regular file:
# Step 1: ensure all unique content is preserved into CLAUDE.md
diff AGENTS.md CLAUDE.md
# Step 2: merge any AGENTS.md-only content into CLAUDE.md (interactive — see Phase 5)
# Step 3: delete
git rm AGENTS.md
```

**Option 2 — Symlink:**

```bash
# Pre-condition: CLAUDE.md exists with the canonical content
git rm AGENTS.md  # if it was tracked separately
ln -s CLAUDE.md AGENTS.md
git add AGENTS.md  # tracks the symlink
```

**Option 3 — Both diverging:**

Document this choice in `.claude/audits/<date>-migration.md`. Record the rationale. Set a calendar reminder for quarterly drift check.

---

## Phase 3 — Empty / misplaced files (no asks)

| Step | Action |
|---|---|
| 3.1 | For every empty CLAUDE.md found in Phase 1: `rm <file>` if untracked, else `git rm <file>` |
| 3.2 | For every misplaced plan/handover (`src/**/plan.md`, etc.): move to `.claude/plans/<YYYY-MM-DDTHHMM>-<type>-<topic>.md`, add YAML frontmatter, commit |
| 3.3 | Stage these moves as a separate commit: `chore(claude): hygiene — remove empty CLAUDE.md, relocate plans` |

---

## Phase 4 — Bootstrap `.claude/` if absent (no asks)

| Step | Action |
|---|---|
| 4.1 | `mkdir -p .claude/plans .claude/audits .claude/hooks` |
| 4.2 | Create `.claude/settings.json` with the baseline from `architecture-guide.md §4.2` |
| 4.3 | Append `.claude/settings.local.json` to `.gitignore` if not already present |
| 4.4 | Append `CLAUDE.local.md` to `.gitignore` if not already present |
| 4.5 | If `.claude/settings.local.json` is currently tracked: `git rm --cached .claude/settings.local.json` (keep the file on disk) |

---

## Phase 5 — Reconcile docs/ and existing content (INTERACTIVE — ASK)

Second interactive point. The repo's `docs/` folder typically contains a mix of:

- Up-to-date architecture references (keep)
- Out-of-date stubs from previous initiatives (delete)
- Setup instructions that belong in CLAUDE.md (extract)
- Public-facing API docs (keep, mark as not-auto-loaded)

### Step 5.1 — List candidates

```bash
ls -la docs/
find docs/ -name "*.md" -exec wc -l {} +
```

### Step 5.2 — Classify (no ask)

For each `.md` file in `docs/`, classify:

- **Architecture / human reference** — keep (e.g. `docs/architecture.md`, `docs/testing.md`)
- **Public API / external-facing** — keep, mark with frontmatter `audience: external`
- **Setup / onboarding** — extract relevant facts to CLAUDE.md, then delete
- **Stale** — delete (no references in code, last modified > 12 months)
- **Unsure** — flag for user

### Step 5.3 — Ask (REQUIRED)

For every file classified as "unsure" or "stale", confirm with the user:

> The following files are candidates for deletion. Confirm each:
>
> - `docs/old-deploy.md` (last modified 2024-03, no inbound references) — delete? **(y/n)**
> - `docs/legacy-feature.md` (last modified 2023-09) — delete? **(y/n)**
>
> Or paste the file paths you want to keep, separated by newlines.

Do not delete without explicit confirmation per file.

### Step 5.4 — Execute

`git rm` confirmed deletions. Add a "Where to find more" pointer section to root CLAUDE.md listing the kept docs.

---

## Phase 6 — Build the six rings (no asks)

Now assemble the architecture. Each step writes a specific file.

| Step | File | Source content |
|---|---|---|
| 6.1 | `./CLAUDE.md` (Ring 0) | Synthesise from existing AGENTS.md content + project conventions. ≤200 lines. |
| 6.2 | `<hot-folder>/CLAUDE.md` (Ring 1) | Only for "hot" folders (3+ files frequently touched). ≤100 lines each. |
| 6.3 | `.claude/rules/<topic>.md` (Ring 2) | For cross-cutting glob-scoped conventions. With `paths:` frontmatter. |
| 6.4 | `.claude/skills/<verb>/SKILL.md` (Ring 3) | One per repeatable workflow. |
| 6.5 | `.claude/agents/<role>.md` (Ring 4) | Only with explicit isolation justification. |
| 6.6 | `.claude/hooks/<action>.sh` + `settings.json` (Ring 5) | Tier-1 blockers, plus `post-edit-lint` **only for linters `omr-dev`'s plugin hook doesn't run** (it covers ESLint/Stylelint). |

If any of 6.4–6.6 don't yet have a clear use case, **skip** them. Empty rings are fine. Forced rings are not.

---

## Phase 7 — Verification (no asks)

Run the audit:

```
/claude-setup-audit
```

The audit produces a graded report. Do not ship the migration PR with a grade below First (85+). If the grade is 2:1 or below, return to the failing dimension and remediate.

| Step | Check |
|---|---|
| 7.1 | Audit grade: **First** (85+) |
| 7.2 | All hard-cap rules: passed |
| 7.3 | `git status`: only intended migration changes |
| 7.4 | `pnpm lint && pnpm typecheck` (or project equivalent): green |
| 7.5 | Open a fresh Claude Code session, ask three questions that should be answered from CLAUDE.md alone. All three answer correctly. |

---

## Phase 8 — Commit and PR (no asks)

Standard sequence:

```bash
git add -A
git commit -m "chore(claude): migrate to canonical six-rings architecture"
gh pr create --title "chore(claude): rebuild AI-context architecture" --body "..."
```

Reference the audit report in the PR body. Archive it at `.claude/audits/<date>-pre-migration.md` and `.claude/audits/<date>-post-migration.md` for future drift comparison.

---

## What this guide does NOT do

- It does not "improve" content beyond mechanical migration. Content quality is a separate concern; the optimize skill handles that.
- It does not handle plugin marketplace promotion. If a skill becomes shareable, that's a separate workflow.
- It does not skip the AGENTS.md ask. Do not be tempted to delete autonomously even when "obvious".
- It does not preserve content "just in case". If a file is stale and the user confirms, it is deleted.
