---
title: Drift-fix plan — Tier-1 fixes per dimension
status: canonical
created: 2026-09-10
---

# Drift-fix plan (Step 8.6)

Applies to the drift-fix path: substantive CLAUDE.md, latest audit graded below
First. Work the Remediation plan at `.claude/audits/<latest>.md`.

For each Tier-1 finding:

- **D1 fixes:** rewrite root CLAUDE.md to ≤ 400 lines (OMR-1.2) using the structure in `architecture-guide.md §2.3`. Move folder-specific content to nested CLAUDE.md (Ring 1). Move cross-cutting content to `.claude/rules/*.md` with `paths:` frontmatter (Ring 2). Apply OMR-2.7 (substantive Project Overview), OMR-2.8 (Architecture/Key Patterns content), OMR-2.13 (insert the four Karpathy Engineering Principles verbatim from `claude-md-template.md §"Engineering Principles"` if missing — non-negotiable, 2:1 cap if absent), OMR-13.4 (retrieval + task-trigger annotations on Where-to-find-more pointers).
- **D2 fixes:** add `defaultMode: "acceptEdits"`, deny list (narrowed credential reads `Read(**/*credentials.*)` / `Read(**/*.credentials)` / `Read(**/credentials)` etc., `Read(.env*)`, `Read(secrets/**)`, `Bash(rm -rf *)`, force-push in any position `Bash(git push --force*)` + `Bash(git push * --force*)`, `Bash(git reset --hard*)`, `Bash(gh api*)`, etc. — see OMR-5.3 + OMR-5.3a for the full set), `$schema`. Replace any broad `Bash(<tool> *)` allow with the explicit per-verb baseline (OMR-5.4a). Remove personal absolute paths (OMR-5.5).
- **D3 fixes:** add Tier-1 blocker hooks where the repo has matching files (generated, secrets, vendor-managed). Add a `post-edit-lint` PostToolUse hook **only if the repo's linter is not ESLint/Stylelint** (see 8.4 — the plugin-level hook already covers those). `chmod +x` scripts.
- **D4 fixes:** rename flat-file skills to directory form. Rename noun-named skills to verb form. Delete persona-zoo subagents.
- **D5 fixes:** add "Where to find more" section with retrieval + task-trigger annotations. Create or curate `docs/` index. Ensure `.claude/audits/` and `.claude/plans/` exist with at least one example.

Each fix is a separate commit using Conventional Commits:
- `feat(claude): tighten settings.json with deny list and explicit allow`
- `feat(claude): add Tier-1 blocker hooks (generated, secrets, locale)`
- `refactor(claude): rewrite root CLAUDE.md to canonical structure`
- `chore(claude): retire persona-zoo subagents`
