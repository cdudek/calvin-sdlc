---
name: claude-setup-apply
description: Use when reconciling a repo's Claude Code setup to the canonical state. Idempotent. Auto-invokes `claude-setup-audit` if no recent audit exists, then dispatches bootstrap (greenfield), archive-and-regenerate (vendor files / stub), or apply Tier-1/2 fixes (substantive with drift).
allowed-tools: Read, Write, Edit, Grep, Glob, Bash(git *), Bash(find *), Bash(ls *), Bash(mv *), Bash(rm *), Bash(mkdir *), Bash(chmod *), Bash(jq *), Bash(file *), Bash(wc *), Bash(cat *)
user_invocable: true
---

# claude-setup-apply

Reconciles a repository's Claude Code architecture to the canonical state. Idempotent — run anytime, no side effects on already-current repos.

The mantra is **archive then generate** for migration cases, **fix from audit findings** for drift cases. The skill detects state and dispatches:

| Detected state | What `apply` does |
|---|---|
| **Greenfield** (no CLAUDE.md, no vendor files, no `.claude/`) | Bootstrap from scratch — generate CLAUDE.md from repo signals, build `.claude/` skeleton with hooks + settings. |
| **Vendor files / stub CLAUDE.md** (AGENTS.md, .cursorrules, copilot-instructions, GEMINI.md, .windsurfrules, ≤5-line CLAUDE.md, .cursor/rules/*.mdc) | Archive prior state to `.ai-legacy/` (committed for traceability — nothing is lost), generate fresh CLAUDE.md from repo signals, append a `## Legacy directives (review and integrate)` section so the human reconciles team-explicit rules into the right sections. |
| **Substantive CLAUDE.md, audit grade < First** | Read latest audit's Remediation plan from `.claude/audits/`, apply Tier-1/2 fixes (the rings: settings.json tightening, hook installation, root CLAUDE.md trim/restructure, persona-zoo subagent retirement, etc.). Refuses to declare done below First. |
| **Substantive CLAUDE.md, audit grade ≥ First** | No-op. Print "already at <grade>; nothing to apply." Optional template-refresh pass for new template additions (e.g. retrieval-semantics annotations) if `--refresh` flag passed. |

For migration cases (vendor files / stubs), the skill doesn't try to extract, classify, or auto-merge legacy content — that's where complexity hides bugs. The legacy raw content goes into a CLAUDE.md appendix and the human reconciles. Trade-off: a few minutes of human work for a lot less skill complexity.

## When to use

- Greenfield repo: no `CLAUDE.md`, no vendor files, no `.claude/`.
- Repo with vendor files only: `AGENTS.md`, `.cursorrules`, `.github/copilot-instructions.md`, `GEMINI.md`, `.windsurfrules`, with or without a stub `CLAUDE.md` symlink.
- Repo with stub CLAUDE.md (≤ 5 lines) or boilerplate from `claude /init`.
- Repo with substantive CLAUDE.md but a recent audit graded it below First — apply the Tier-1/2 fixes from the Remediation plan.
- Drift recheck: rerun apply quarterly (or after a template/skill update lands in `omr-ai-kit`) to bring the repo current.

## When NOT to use

- Repo was previously audited and graded First-Class with no recent drift — apply is a no-op. Run `claude-setup-audit` first to confirm.

## Workflow

### Step 1 — Read the references

In order:

1. `references/claude-setup/architecture-guide.md` — content templates
2. `references/claude-setup/checklists.md` — index of dimension checklists (D1–D5)
3. `references/claude-setup/checklists/d01-foundation.md` — CLAUDE.md content rules
4. `references/claude-setup/checklists/d02-configuration.md` — settings.json + hygiene
5. `references/claude-setup/checklists/d03-enforcement.md` — hooks
6. `references/claude-setup/checklists/d04-modularity.md` — skills, subagents, rules, MCP
7. `references/claude-setup/checklists/d05-documentation.md` — discoverability
8. `references/claude-setup/grading-rubric.md` — what First-Class looks like
9. `references/claude-setup/claude-md-template.md` — generated-CLAUDE.md scaffold

Read these four on demand, not every run:

| File | Read it when |
|---|---|
| `references/detection-commands.md` | Step 3, every run — the inventory commands to paste. |
| `references/legacy-archive.md` | Step 4 and Step 7, migrate-and-regenerate path only — archive commands, `.ai-legacy/README.md`, legacy-appendix template. |
| `references/claude-md-generation.md` | Step 6, before writing CLAUDE.md — per-section source and form, optional sections, hard rules. |
| `references/drift-fix-plan.md` | Step 8.6, drift-fix path only — the D1–D5 Tier-1 fixes and their commit messages. |

### Step 2 — Pre-flight (no asks)

- Working tree clean: `git status --short` empty.
- On a working branch (not main/master/develop). If on main, prompt to create `chore/claude-apply`.
- Repo has a primary language detected.

### Step 2.5 — Ensure recent audit exists (auto-invokes `claude-setup-audit` if needed)

Apply needs a current grade + Remediation plan to dispatch correctly. Same pattern as `terraform apply` running `plan` internally: don't make the user remember to run audit first.

- Check `.claude/audits/` for an audit file dated within the last 24 hours against the current commit SHA.
- **If a recent audit exists**: read it; use its scenario classification + Remediation plan to drive the dispatch table.
- **If no recent audit exists**: invoke `claude-setup-audit` now. The audit writes its report to `.claude/audits/YYYY-MM-DDTHHMM-audit-<repo>.md`. Apply then reads the just-written file and proceeds.
- **If `--skip-audit` flag is passed**: skip the audit; assume greenfield-or-migration (apply will detect from raw repo signals in Step 3 and dispatch from there). Drift-fix path is unavailable without an audit, so this flag is only meaningful for greenfield/migration runs.

After this step: a Remediation plan + scenario classification are available for the dispatch decision below.

**No-op condition**: substantive CLAUDE.md, audit graded ≥ First, no vendor files → print "already at <grade>; nothing to apply" and exit. Pass `--refresh` to opt into a template-refresh pass for new template additions.

### Step 3 — Detect repo properties + AI-context state

Run the detection block in `references/detection-commands.md` — repo identity, language/toolchain, existing AI-context state (vendor files, symlinks, `file`/`readlink` checks), and the repo signals (scripts, engines, deps, package manager, generated files, test framework, secrets handling, `docs/`) that drive Step 6.

Determine which path applies:

| Detected | Path |
|---|---|
| Greenfield (no vendor files, no CLAUDE.md) | Bootstrap: skip Step 4 (archive); go to Step 5 (enforcement scope ask); Step 6 (generate); skip Step 7 (legacy appendix); Step 8 (build rings) |
| Any vendor file or stub CLAUDE.md | Migrate-and-regenerate: run all steps 4–8 — archive prior state, generate, append legacy section, build rings |
| Substantive CLAUDE.md + recent audit grade < First | Drift-fix: skip Steps 4–7; jump to Step 8.x (apply Tier-1/2 fixes from `.claude/audits/<latest>.md` Remediation plan). Refuses to declare done below First. |
| Substantive CLAUDE.md + recent audit grade ≥ First | No-op: print summary and exit. With `--refresh`: re-run Step 6's CLAUDE.md generation against the latest template, diff against current, prompt user to accept template additions section-by-section. |

### Step 4 — Archive prior AI-context state to `.ai-legacy/` (no asks)

If any vendor file or stub CLAUDE.md was detected:

Run the archive commands, write `.ai-legacy/README.md`, and commit — all three verbatim in `references/legacy-archive.md`, section `Step 4`. A real `CLAUDE.md` is archived as `.original`; a broken symlink is just removed. Nothing is overwritten before the archive commit lands.

### Step 5 — Ask: enforcement scope (INTERACTIVE — ASK, brief)

> Which Tier-1 hook blockers should I install? Select any that apply:
>
> - **Generated files** — block edits to `*.generated.ts`, `schema.graphql`, lockfiles, `components.d.ts`, etc. (recommended if generated files were detected)
> - **Secrets/env** — block edits and reads of `.env*`, `secrets/**`, and credential files (`*.credentials`, `credentials.*`, or a bare `credentials` file — not directories that merely contain the word) (always recommended)
> - **Vendor-managed files** — block edits to files managed by external systems (translation services, downstream API schemas) (recommended if applicable)
>
> Reply with which apply, or "all" / "secrets only" / "skip".

### Step 6 — Generate the new CLAUDE.md (no asks)

Use `references/claude-setup/claude-md-template.md` as the scaffold. Populate sections from repo signals (Step 3 inventory). **Match the size and tone of Anthropic's own public-repo CLAUDE.md files** (`anthropics/anthropic-cookbook` ~85 lines, `anthropics/claude-code-action` 44 lines, `anthropics/claude-agent-sdk-python` 27 lines). Target ~50–100 lines. Hard ceiling 200.

Section-by-section sources and forms, the optional sections, and the four hard rules (Project Overview must be a paragraph — OMR-2.7; Engineering Principles non-negotiable — OMR-2.13; no bare path enumeration for Project Structure; length up to ~400 lines, hard ceiling 400) are in `references/claude-md-generation.md`. Read it before writing the file.

### Step 7 — Append legacy directives appendix (no asks)

If `.ai-legacy/` exists from Step 4, append to the generated CLAUDE.md:

The appendix template — heading, the two paragraphs explaining why nothing is auto-merged, and the per-archived-file code-fenced sections — is in `references/legacy-archive.md`, section `Step 7`.

The user reads through the appendix, picks what matters, integrates manually into the right sections, then deletes the appendix in a follow-up commit.

### Step 8 — Build the rest of the rings (no further asks)

#### 8.1 — Bootstrap `.claude/` skeleton

```bash
mkdir -p .claude/{plans,audits,hooks,skills,agents,rules,references}
```

#### 8.2 — `.gitignore` updates

Append (if missing):

```
.claude/settings.local.json
CLAUDE.local.md
```

#### 8.3 — `.claude/settings.json` (Ring 5)

Write the canonical baseline defined in `architecture-guide.md §4.2` — that block (allow list, deny list, `$schema`, `defaultMode: "acceptEdits"`) is the single source of truth; do not re-inline or paraphrase it here. **Do not use broad wildcard allows like `Bash(gh *)`** — they cover destructive commands like `gh repo delete`, `gh release delete`, `gh secret remove`, etc. The team can always extend the allow list per-developer in `.claude/settings.local.json` (gitignored).

Apply-specific substitutions when writing the file:

- Substitute `<package-manager>` based on detection (`pnpm`, `npm`, `yarn`, `uv`, etc.).
- The §4.2 script entries are a candidate menu — emit only those present in Step 3's `jq -r '.scripts // {} | keys[]'` inventory; drop the rest (a dead `Bash(<pm> build)` is allow-surface noise). No `scripts` block → emit none and add a `<!-- TODO: add build/test/lint allow entries once scripts exist -->` marker in CLAUDE.md instead.
- If the repo has additional safe commands (`<pm> bump-omrjs`, `<pm> playwright:*`, etc.), append them to allow. Per-developer additions go in `.claude/settings.local.json`.

#### 8.4 — Tier-1 hooks (Ring 5)

For each scope chosen in Step 5, write the corresponding hook script under `.claude/hooks/` and add the entry to `settings.json` `hooks.PreToolUse[]`:

- `block-generated-edit.sh` — pattern-matches generated files detected in Step 3.
- `block-secret-edit.sh` — blocks edits/writes to `.env*`, `secrets/**`, and credential files. Use `case` globs `*credentials.*|*credential.*|*.credentials|*.credential|*/credentials|credentials` (matches a file *named* `credentials`, not a `credentials-*` directory — mirrors the narrowed `Read()` denies in 8.3).
- `block-vendor-managed-edit.sh` — only if vendor-managed files apply.

All scripts: `#!/usr/bin/env bash` + `set -e`; read JSON from stdin; extract `tool_input.file_path` via `jq`; `case` on path, on match print to stderr and `exit 2`. `chmod +x` after writing.

**`post-edit-lint` — check before you write one.** `omr-dev` ships a plugin-level `post-edit-lint` hook (PostToolUse on `Edit|Write`) that already runs the repo's own ESLint and Stylelint on the touched file, non-blocking. If the repo's linters are ESLint/Stylelint, that covers it — writing a per-repo duplicate just double-lints every edit. Write a repo-local `post-edit-lint.sh` only for the linters the plugin hook does not run: RuboCop, `ruff`, `sqlfluff`, `terraform fmt`, `actionlint`, `mypy`, etc. Same contract either way — runs on the changed file only, always exits 0.

#### 8.5 — Placeholders (no content, just discoverability)

- `.claude/skills/.gitkeep`, `.claude/agents/.gitkeep`, `.claude/rules/.gitkeep` (empty dir tracking)
- `.claude/plans/README.md` — one-paragraph note: "Plans named YYYY-MM-DDTHHMM-<type>-<topic>.md with YAML frontmatter."
- `.claude/audits/README.md` — one-paragraph note: "Audit reports from `claude-setup-audit`."

Commit: `feat(claude): generate CLAUDE.md, .claude/ skeleton, settings, and Tier-1 hooks`.

#### 8.6 — Drift-fix path (substantive CLAUDE.md, audit grade < First)

Skip 8.1–8.5 if the repo already has `.claude/{settings.json,hooks/}` from a prior apply run. In drift-fix mode, the work is **applying Tier-1/2 fixes from the latest audit's Remediation plan** at `.claude/audits/<latest>.md`.

For each Tier-1 finding, apply the per-dimension fixes (D1 root CLAUDE.md and rules, D2 settings.json, D3 hooks, D4 skills and subagents, D5 discoverability) and the Conventional Commit message that goes with each — all verbatim in `references/drift-fix-plan.md`.

For Tier-2 findings, address after Tier-1 lands. Tier-3 are coordinated follow-ups (e.g. credential rotation) — out of scope for a single apply run.

### Step 9 — Verify (no asks)

- Run `claude-setup-audit` against the new setup.
- Expected grade: **First (85+)** *if* the user has not yet reconciled the legacy appendix. The appendix's verbatim content is technically content; D1 grading should still pass on structure. If grade is < First, identify the gap.
- Run project lint/typecheck. Both green.
- Open the bootstrap PR.

### Step 10 — Hand off

Print a summary to chat:

- Files archived (count + `.ai-legacy/` path)
- New CLAUDE.md generated (line count, sections populated)
- Hooks installed
- Audit grade and score
- **Reconciliation reminder** (if `.ai-legacy/` was created): "Review `## Legacy directives (review and integrate)` at the bottom of CLAUDE.md. Move what matters into the right sections, then delete the appendix in a follow-up commit."
- Suggested next steps: write a Ring 1 nested CLAUDE.md for the busiest folder; write the first skill once a workflow stabilises.

## Strictness rules

1. **Archive before generate — nothing is lost.** Step 4 commits the archive before Step 6 writes the new CLAUDE.md. The legacy appendix in Step 7 ensures team directives are visible in the working file, not buried in `.ai-legacy/`.
2. **No auto-merge of legacy directives.** The skill appends raw content; the user reconciles. This trades a few minutes of human work for a lot of skill complexity that would otherwise be needed to extract, classify, and resolve conflicts.
3. **No content fabrication.** Top commands, gotchas, do-nots come from inspecting the repo. The skill does not invent conventions.
4. **Refuses to declare done below First.** Initial bootstrap should pass First on structural grading. If it doesn't, the bootstrap was incomplete.
5. **No `.gitkeep` for non-empty dirs.** Placeholder files only where needed for git tracking of empty dirs.

## What this skill does NOT do

- It does not extract directives from legacy files programmatically. The legacy appendix is raw content; the user moves what matters.
- It does not promote skills to a plugin marketplace. That's a separate workflow.
- It does not modify CI/CD configuration.
- It does not run `claude /init` (the built-in CLI command). That is a separate, narrower flow.
- It does not auto-convert Cursor multi-file rules (`.cursor/rules/*.mdc`). They're archived; manual `paths:` translation to `.claude/rules/*.md` is a follow-up.
