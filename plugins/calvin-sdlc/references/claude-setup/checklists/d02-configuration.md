---
dimension: D2
title: Configuration — settings.json + hygiene
---

# D2 — Configuration

Rules governing the deterministic enforcement and team-sharing layer: `.claude/settings.json`, gitignore hygiene, permission allow/deny lists, env vars, and the no-personal-data invariant.

All rules in this dimension are **OMR-opinion** (`OMR-4.x`, `OMR-5.x`). Anthropic's docs describe `settings.json` schema but don't prescribe content; these rules encode the team's judgment.

---

### OMR-4.1 — `.claude/settings.local.json` is gitignored AND not tracked

- **Source**: omr-team
- **Severity**: Required
- **Applies to**: claude-setup-audit, claude-setup-apply

**Check:** `.gitignore` contains `.claude/settings.local.json` AND `git ls-files .claude/settings.local.json` returns nothing.
**Fails when:** the file is tracked OR not gitignored.
**Remediation:** Add to `.gitignore`. If currently tracked, run `git rm --cached .claude/settings.local.json` (keeps the file on disk, removes from index). The file is personal — leaks personal allow-lists with absolute machine paths if committed.

### OMR-4.2 — `.claude/settings.json` exists if hooks or permissions are configured

- **Source**: omr-team
- **Severity**: Recommended
- **Applies to**: claude-setup-audit

**Check:** If `.claude/hooks/` exists or the team has any permission expectations, `.claude/settings.json` is committed.
**Fails when:** hooks exist but settings.json doesn't tie them in, or expected permissions aren't configured.
**Remediation:** Create `.claude/settings.json` with `defaultMode`, `permissions`, and `hooks` blocks per `architecture-guide.md §4.2`.

### OMR-4.3 — `.claude/plans/` exists if any planning is happening

- **Source**: omr-team
- **Severity**: Optional
- **Applies to**: claude-setup-audit

**Check:** If the repo has any planning artefacts (handover docs, RFCs, strategy notes), they live in `.claude/plans/`.
**Fails when:** plan-shaped content found outside `.claude/plans/`.
**Remediation:** Move planning content to `.claude/plans/<YYYY-MM-DDTHHMM>-<type>-<topic>.md` with frontmatter.

### OMR-4.4 — No `plan.md` or `handover.md` outside `.claude/plans/`

- **Source**: omr-team
- **Severity**: Recommended
- **Applies to**: claude-setup-audit, claude-setup-migrate

**Check:** No files matching `plan.md`, `handover.md`, `roadmap.md`, `tasks.md` exist outside `.claude/plans/` (excluding `node_modules/`, `.git/`, `docs/`, `reports/`).
**Fails when:** any such file found in `src/**`, `e2e/**`, etc.
**Remediation:** Move to `.claude/plans/<YYYY-MM-DDTHHMM>-<type>-<topic>.md` with frontmatter.

### OMR-4.5 — No empty subdirectories in `.claude/`

- **Source**: omr-team
- **Severity**: Optional
- **Applies to**: claude-setup-audit

**Check:** `.claude/skills/`, `.claude/agents/`, `.claude/rules/`, `.claude/hooks/` either contain content OR don't exist.
**Fails when:** any of these dirs exist but are empty.
**Remediation:** Either populate the directory or remove it. Empty subdirs signal abandoned scaffolding.

---

### OMR-5.1 — `settings.json` has `$schema` reference

- **Source**: omr-team
- **Severity**: Recommended
- **Applies to**: claude-setup-audit, claude-setup-apply

**Check:** `.claude/settings.json` includes `"$schema": "https://json.schemastore.org/claude-code-settings.json"`.
**Fails when:** missing.
**Remediation:** Add the `$schema` field. Enables editor validation and autocomplete.

### OMR-5.2 — `defaultMode: "acceptEdits"` set (or explicit reason not to)

- **Source**: omr-team
- **Severity**: Recommended
- **Applies to**: claude-setup-audit, claude-setup-apply

**Check:** `.claude/settings.json` has `"defaultMode": "acceptEdits"`.
**Fails when:** missing or set to `"default"` / `"plan"` without a documented reason.
**Remediation:** Add `"defaultMode": "acceptEdits"`. Single largest reduction in permission-prompt fatigue. Pair with strong `deny` rules (OMR-5.3) for safety.

### OMR-5.3 — `permissions.deny` blocks credentials and secrets

- **Source**: omr-team
- **Severity**: Required
- **Applies to**: claude-setup-audit, claude-setup-apply

**Check:** `.claude/settings.json` `permissions.deny` includes (at minimum) `Read(.env*)`, `Read(secrets/**)`, `Bash(rm -rf *)`, and credential-read coverage. Canonical credential denies are the narrowed set `Read(**/*credentials.*)`, `Read(**/*credential.*)`, `Read(**/*.credentials)`, `Read(**/*.credential)`, `Read(**/credentials)` (per `architecture-guide.md §4.2`); the legacy broad `Read(**/*credentials*)` also satisfies the check.
**Fails when:** `Read(.env*)`, `Read(secrets/**)`, or `Bash(rm -rf *)` is missing, OR there is no credential-read deny in any form, OR no `deny` list at all.
**Remediation:** Add the deny rules. Prefer the narrowed credential set — the broad `Read(**/*credentials*)` overmatches directories like `src/credentials-app/`. Bash deny rules don't block Read — must use `Read(...)` form to block reads of sensitive files.

### OMR-5.3a — `permissions.deny` blocks irreversible git/gh operations

- **Source**: omr-team
- **Severity**: Required
- **Applies to**: claude-setup-audit, claude-setup-apply

**Check:** `.claude/settings.json` `permissions.deny` includes patterns blocking force-push, hard reset, global git config, and admin-merge:
- `Bash(git push --force*)`, `Bash(git push -f*)`, **and the positional forms** `Bash(git push * --force*)`, `Bash(git push * -f*)`, `Bash(git push * --force-with-lease*)` (the flag-first patterns alone do NOT match `git push origin main --force`, which then falls through to a `git push origin*` allow)
- `Bash(git reset --hard*)`
- `Bash(git clean -f*)`
- `Bash(git config --global*)`
- `Bash(gh pr merge * --admin*)` **and** `Bash(gh pr merge --admin*)` (the `* --admin` form alone misses admin-first `gh pr merge --admin 123`)
- `Bash(gh api*)` (raw GitHub API — bypasses every gh subcommand boundary; can mutate via GraphQL or arbitrary endpoints)
- `Bash(<package-manager> publish*)` (registry publish — irreversible)

**Fails when:** any of these are missing AND the corresponding broad allow exists (e.g. `Bash(git *)`/`Bash(gh *)`/`Bash(pnpm *)` without these denies).
**Why:** broad wildcard allows like `Bash(gh *)` cover destructive commands. Either narrow the allow (preferred — see OMR-5.4a) or list each destructive op in deny. Deny wins over allow in resolution.
**Remediation:** Add the missing deny patterns. Best practice is OMR-5.4a (explicit narrow allow) which makes most of these unnecessary, since unlisted commands ask for permission by default.

### OMR-5.4a — `permissions.allow` is explicit, not broad-wildcard

- **Source**: omr-team
- **Severity**: Recommended (Required if the repo touches production secrets/infrastructure)
- **Applies to**: claude-setup-audit, claude-setup-apply

**Check:** `permissions.allow` does NOT contain broad wildcard entries that cover destructive operations:
- ❌ `Bash(gh *)` — covers `gh repo delete`, `gh release delete`, `gh secret remove`, `gh ruleset delete`, `gh api -X DELETE`, etc.
- ❌ `Bash(git *)` — covers `git push --force`, `git reset --hard`, `git clean -fd`, `git config --global`
- ❌ `Bash(<pm> *)` — covers `<pm> publish` and any future destructive scripts
- ❌ `Bash(gh pr *)` / `Bash(gh pr:*)` — subtler, but sweeps in `gh pr merge` and `gh pr ready`, the human-only act of declaring a PR reviewable
- ✅ Explicit per-verb allows: `Bash(gh pr view*)`, `Bash(gh pr create*)`, `Bash(git push origin*)`, `Bash(<pm> test)`, etc. — but never `Bash(gh pr ready*)`; see `architecture-guide.md §4.2`

**Fails when:** any allow entry uses a top-level wildcard (`Bash(<tool> *)`) for tools whose surface includes destructive commands (gh, git, pnpm/npm/yarn/uv).
**Why:** broad allows cover everything you didn't think of, including future commands the tool may add. Explicit allows make the security surface readable — anyone reading `settings.json` knows exactly the operations that proceed without prompts.
**Remediation:** Replace each broad allow with explicit per-verb entries. See `architecture-guide.md §4.2` for the canonical baseline. Per-developer additions go in `.claude/settings.local.json` (gitignored).

### OMR-5.4 — `permissions.allow` uses correct pattern syntax

- **Source**: omr-team
- **Severity**: Recommended
- **Applies to**: claude-setup-audit

**Check:** `.claude/settings.json` `permissions.allow` patterns follow correct prefix-with-word-boundary syntax. `Bash(pnpm install)` matches the bare command; `Bash(pnpm install *)` matches with arguments; `Bash(pnpm test:*)` matches script names with colons. `Bash(pnpm install:*)` does NOT match the bare `pnpm install` command — common gotcha.
**Fails when:** allow patterns use the colon form for non-script commands (matches nothing) or the bare form for script-named variants.
**Remediation:** Audit each allow pattern against actual commands the repo uses.

### OMR-5.5 — No personal absolute paths in committed `settings.json`

- **Source**: omr-team
- **Severity**: Required
- **Applies to**: claude-setup-audit

**Check:** Committed `.claude/settings.json` does not contain `/Users/<name>/`, `/home/<name>/`, or `C:\\Users\\<name>\\` patterns.
**Fails when:** any such path found.
**Remediation:** Move to `.claude/settings.local.json` (gitignored), or use `$CLAUDE_PROJECT_DIR` / `$HOME` env-var expansion.

### OMR-5.6 — No model API keys or auth tokens in `env` block

- **Source**: omr-team
- **Severity**: Required (auto-Fail hard cap if violated)
- **Applies to**: claude-setup-audit

**Check:** Committed `.claude/settings.json` `env` block does not contain `ANTHROPIC_API_KEY`, `ANTHROPIC_AUTH_TOKEN`, or any AWS/GCP/Bedrock/Vertex auth values.
**Fails when:** any such key is present.
**Remediation:** Move to environment / shell / CI secrets. Triggers the auto-Fail hard cap (committed credentials in any tracked file).
