---
dimension: D3
title: Enforcement — hooks
---

# D3 — Enforcement

Rules governing the only deterministic primitive: hooks. CLAUDE.md is advisory; hooks are enforced. Critical invariants belong here, not in CLAUDE.md prose.

All rules are **OMR-opinion** (`OMR-6.x`). Anthropic documents the hook schema; these rules encode which hooks the team expects.

---

### OMR-6.1 — Hook scripts are external files in `.claude/hooks/`, not inline commands

- **Source**: community-pattern (oven-sh/bun, anthropics/claude-agent-sdk-python)
- **Severity**: Recommended
- **Applies to**: claude-setup-audit, claude-setup-apply

**Check:** Hooks declared in `.claude/settings.json` reference scripts under `.claude/hooks/` (e.g. `$CLAUDE_PROJECT_DIR/.claude/hooks/<name>.sh`) rather than embedding shell one-liners inline.
**Fails when:** any hook entry has inline `command` content longer than ~80 chars or contains shell logic.
**Remediation:** Extract to `.claude/hooks/<action>.sh` with `#!/usr/bin/env bash` shebang and a header comment documenting purpose + exit semantics.

### OMR-6.2 — Hook scripts are executable

- **Source**: omr-team
- **Severity**: Required
- **Applies to**: claude-setup-audit

**Check:** Every `.claude/hooks/*.sh` has `+x` permission (`stat -f %p` or equivalent).
**Fails when:** any hook script is not executable.
**Remediation:** `chmod +x .claude/hooks/*.sh`. Non-executable hooks silently fail.

### OMR-6.3 — Tier-1 blockers present where applicable

- **Source**: omr-team
- **Severity**: Required (when applicable)
- **Applies to**: claude-setup-audit, claude-setup-apply

**Check:** If the repo has matching files, the corresponding Tier-1 blocker hook exists:
- Generated files (`*.generated.ts`, `components.d.ts`, etc.) → `block-generated-edit` hook
- Secrets / env files (`.env*`, `dev_secrets.ejson`, etc.) → `block-secret-edit` hook
- Vendor-managed files (locale JSONs from Phrase, schema.graphql from a downstream API, plaintext-credential e2e configs, etc.) → `block-vendor-managed-edit` hook (or named equivalent)
**Fails when:** any applicable blocker is missing.
**Remediation:** Add the missing blocker(s). Pattern in `architecture-guide.md §5.3`. Hooks are PreToolUse on `Edit|Write|MultiEdit`, exit 2 = block with stderr message.

### OMR-6.4 — Each hook has a narrow `matcher`

- **Source**: omr-team
- **Severity**: Required
- **Applies to**: claude-setup-audit

**Check:** Every hook entry in `.claude/settings.json` has a `matcher` regex that limits which tool calls trigger it.
**Fails when:** a hook has no `matcher` OR matches `.*` (everything).
**Remediation:** Constrain to specific tools — `Edit|Write|MultiEdit` for blockers, `Bash` for command-pattern hooks. Broad matchers cause hook→tool→hook loops and slow sessions.

### OMR-6.5 — Each hook is documented (header comment)

- **Source**: omr-team
- **Severity**: Recommended
- **Applies to**: claude-setup-audit

**Check:** Every `.claude/hooks/*.sh` has a header comment block documenting: purpose, when it fires, exit-code semantics (0 = continue, 2 = block).
**Fails when:** header is missing or generic.
**Remediation:** Add the standard header. Future maintainers (and Claude) need to know why each hook exists.

### OMR-6.6 — `post-edit-lint` hook recommended even for simple repos

- **Source**: omr-team
- **Severity**: Optional
- **Applies to**: claude-setup-audit, claude-setup-apply

**Check:** The repo's linter runs on edit, non-blocking (exit 0 always), on the changed file only. Satisfied either by `omr-dev`'s plugin-level `post-edit-lint` hook — which covers ESLint and Stylelint in every repo the plugin is installed in — or by a repo-local `post-edit-lint` (or named equivalent) PostToolUse hook.
**Fails when:** the repo's linter is something the plugin hook does not run (RuboCop, `ruff`, `sqlfluff`, `terraform fmt`, `actionlint`, …) and no repo-local equivalent exists.
**Remediation:** Add a repo-local hook for that linter. Do **not** add one that re-runs ESLint/Stylelint — the plugin hook already does, and a duplicate lints every edit twice. Surfaces lint failures in-loop instead of waiting for CI.
