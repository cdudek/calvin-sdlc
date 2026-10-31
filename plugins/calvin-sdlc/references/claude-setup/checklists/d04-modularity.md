---
dimension: D4
title: Modularity — skills, subagents, rules, commands, MCP
---

# D4 — Modularity

Rules governing whether reusable workflows are first-class. Covers skills, subagents, path-scoped rules, slash commands, and MCP server hygiene.

All rules are **OMR-opinion** or **community-pattern** (`OMR-7.x`–`OMR-10.x`). Anthropic documents the schemas; these rules encode the team's judgment on what to build, what to avoid, and how to name.

---

## Skills (OMR-7.x)

### OMR-7.1 — Each skill is a directory with `SKILL.md`, not a flat `.md`

- **Source**: community-pattern (anthropics/skills canonical reference)
- **Severity**: Required
- **Applies to**: claude-setup-audit

**Check:** All skills under `.claude/skills/` follow the pattern `<skill-name>/SKILL.md` — never `<name>.skill.md` flat.
**Fails when:** any flat-file skill exists.
**Remediation:** Convert to directory form. Allows co-located `references/`, `scripts/`, etc.

### OMR-7.2 — `SKILL.md` has frontmatter with `name` and `description`

- **Source**: anthropic-doc — https://code.claude.com/docs/en/skills
- **Severity**: Required
- **Applies to**: claude-setup-audit

**Check:** Every `SKILL.md` starts with YAML frontmatter containing `name:` (matches directory name) and `description:`.
**Fails when:** frontmatter missing or fields incomplete.
**Remediation:** Add the frontmatter. Description drives auto-invocation triggers.

### OMR-7.3 — `description` is specific (use-case keywords, not persona)

- **Source**: omr-team
- **Severity**: Recommended
- **Applies to**: claude-setup-audit

**Check:** `description` field contains action keywords ("audit", "scaffold", "deploy") and use-case context, not just "X helper" or "for X tasks".
**Fails when:** generic, persona-shaped, or single-word descriptions.
**Remediation:** Rewrite as "Use when <user phrase>. Does <action>. Returns <outcome>." pattern.

### OMR-7.4 — Skill name is verb-form

- **Source**: community-pattern (vercel/ai, anthropics/claude-cookbooks)
- **Severity**: Recommended
- **Applies to**: claude-setup-audit

**Check:** Skill name starts with an action verb (`add-`, `scaffold-`, `audit-`, `optimize-`, `init-`, `verify-`), not a noun (`gql`, `tests`, `auth`).
**Fails when:** noun-form names.
**Remediation:** Rename to verb-form. `gql` → `add-graphql-op`. `auth` → `set-up-auth`.

### OMR-7.5 — `SKILL.md` ≤ 500 lines

- **Source**: omr-team
- **Severity**: Recommended
- **Applies to**: claude-setup-audit

**Check:** `wc -l SKILL.md` ≤ 500.
**Fails when:** > 500 lines.
**Remediation:** Move detail to `references/`. SKILL.md is the workflow contract, not the manual.

### OMR-7.6 — No flat-file skills

- **Source**: omr-team
- **Severity**: Required
- **Applies to**: claude-setup-audit

**Check:** No `*.skill.md` files exist.
**Fails when:** any flat-file skill found.
**Remediation:** Convert to `<name>/SKILL.md` directory form.

### OMR-7.7 — Helper scripts live in `scripts/` subdirectory

- **Source**: community-pattern (anthropics/claude-cookbooks)
- **Severity**: Optional
- **Applies to**: claude-setup-audit

**Check:** Skill helper scripts (shell, Python, etc.) live in `<skill>/scripts/` rather than at the skill root.
**Fails when:** loose `.sh` / `.py` files at skill root.
**Remediation:** Move to `scripts/`. Co-located with the skill but visually distinct from `SKILL.md`.

---

## Subagents (OMR-8.x)

### OMR-8.1 — Subagent has frontmatter

- **Source**: anthropic-doc — https://code.claude.com/docs/en/sub-agents
- **Severity**: Required
- **Applies to**: claude-setup-audit

**Check:** Every `.claude/agents/<name>.md` has YAML frontmatter with `name`, `description`, optionally `tools` and `model`.
**Fails when:** missing.
**Remediation:** Add the frontmatter.

### OMR-8.2 — `description` is task-specific, not persona

- **Source**: omr-team
- **Severity**: Required
- **Applies to**: claude-setup-audit

**Check:** Subagent description references a specific task (e.g. "Security reviewer for auth flows"), not a generic persona ("Backend developer").
**Fails when:** persona-shaped descriptions.
**Remediation:** Rewrite. Personas don't trigger correctly; task descriptions do.

### OMR-8.3 — `tools` restricted to what's needed

- **Source**: omr-team
- **Severity**: Recommended
- **Applies to**: claude-setup-audit

**Check:** Read-only research subagents declare `tools: Read, Grep, Glob`; mutating subagents include the specific tools they need (not blanket `*`).
**Fails when:** subagent grants tool access beyond its actual scope.
**Remediation:** Tighten the `tools` list.

### OMR-8.4 — Clear context-isolation justification

- **Source**: omr-team
- **Severity**: Required
- **Applies to**: claude-setup-audit

**Check:** Each subagent has a stated reason for being a subagent rather than a skill (heavy log digestion, parallel work, isolated investigation, etc.). Reason in PR description, code comment, or skill description.
**Fails when:** subagent exists without isolation justification.
**Remediation:** Either add the justification OR convert to a skill (skills are the default).

### OMR-8.5 — Subagent name is role-form

- **Source**: omr-team
- **Severity**: Recommended
- **Applies to**: claude-setup-audit

**Check:** Subagent name reads as a role (`code-reviewer`, `playwright-healer`, `security-auditor`), not a verb (`review-code`, `heal-tests`).
**Fails when:** verb-form subagent names.
**Remediation:** Rename. Subagents are roles dispatched to do work; skills are workflows you invoke.

### OMR-8.6 — No persona-zoo agents

- **Source**: community-pattern (failure mode observed in many open-source repos)
- **Severity**: Required (2:1 hard cap if violated)
- **Applies to**: claude-setup-audit

**Check:** No subagents named `backend_dev`, `frontend_dev`, `qa`, `cto`, `ux`, `ops`, `dba`, `architect` (or similar persona names) without scoped tools.
**Fails when:** any such persona-zoo agent exists.
**Remediation:** Delete. Persona-shaped agents without scoped tools don't outperform default Claude. They're cargo-cult. Replace with task-specific subagents that have a clear isolation reason.

---

## Slash commands (OMR-9.x)

### OMR-9.1 — Commands used only for short, parameterised one-shots

- **Source**: omr-team
- **Severity**: Recommended
- **Applies to**: claude-setup-audit

**Check:** `.claude/commands/*.md` files exist only for genuinely short, single-shell-command workflows. Anything multi-step is a skill.
**Fails when:** commands contain multi-step workflows that should be skills.
**Remediation:** Convert to skills. Skills win on name collision; legacy commands keep working but new work goes in skills.

### OMR-9.2 — No single-letter or unmemorable command names

- **Source**: omr-team
- **Severity**: Recommended
- **Applies to**: claude-setup-audit

**Check:** No command files named `t.md`, `q.md`, `qf.md`, etc.
**Fails when:** any such name found.
**Remediation:** Rename to descriptive form.

### OMR-9.3 — Skill-command name collision acknowledged

- **Source**: anthropic-doc
- **Severity**: Optional
- **Applies to**: claude-setup-audit

**Check:** No skill and command share a name unless the skill is the canonical implementation and the command is a deprecated stub.
**Fails when:** name-collision without intent.
**Remediation:** Rename one. Skills win on collision per Anthropic docs.

---

## Path-scoped rules (OMR-10.x)

### OMR-10.1 — Rules use `paths:` frontmatter where appropriate

- **Source**: anthropic-doc
- **Severity**: Recommended
- **Applies to**: claude-setup-audit

**Check:** Rules in `.claude/rules/*.md` that apply to a specific subtree have `paths:` frontmatter (glob array). Rules without `paths:` load every session.
**Fails when:** subtree-specific rules load globally.
**Remediation:** Add `paths:` frontmatter. Saves auto-load tokens.

### OMR-10.2 — Rule files topic-named (not verb)

- **Source**: omr-team
- **Severity**: Recommended
- **Applies to**: claude-setup-audit

**Check:** Rule files named after topic (`forms.md`, `gql.md`, `i18n.md`), not verb (`use-forms.md`).
**Fails when:** verb-form rule names.
**Remediation:** Rename. Rules are topical context, not actions.

---

## MCP (OMR-MCP.x)

### OMR-MCP.1 — `.mcp.json` exists if any project MCP servers are used

- **Source**: anthropic-doc
- **Severity**: Required (when applicable)
- **Applies to**: claude-setup-audit

**Check:** If MCP servers are configured anywhere for this project (in user settings, plugin), they have a project-level `.mcp.json` if intended for team use.
**Fails when:** team-shared MCP usage without `.mcp.json`.
**Remediation:** Add `.mcp.json` at repo root with project-scope server definitions.

### OMR-MCP.2 — Credentials passed via env vars, not hardcoded

- **Source**: anthropic-doc, omr-team
- **Severity**: Required
- **Applies to**: claude-setup-audit

**Check:** `.mcp.json` server entries don't contain raw API keys / tokens; secrets reference `${VAR_NAME}` or are passed via headers from env.
**Fails when:** any hardcoded credential.
**Remediation:** Move to env. Triggers auto-Fail if found in committed `.mcp.json`.

### OMR-MCP.3 — `allowedTools` preferred over blanket permission

- **Source**: anthropic-doc — https://code.claude.com/docs/en/agent-sdk/mcp
- **Severity**: Recommended
- **Applies to**: claude-setup-audit

**Check:** Settings restrict MCP tools by name (`allowedTools: ["mcp__<server>__*"]`) rather than granting blanket permission.
**Fails when:** MCP tools loaded without scoped allowlist.
**Remediation:** Add `allowedTools`. ~50–80% context savings via tool-search deferral.

---

## Frontend project plugin recommendations (OMR-FE)

### OMR-FE.1 — Frontend projects should enable design plugins

- **Source**: omr-team
- **Severity**: Recommended (informational)
- **Applies to**: claude-setup-audit, claude-setup-apply

**Check:** If `package.json` `dependencies` or `devDependencies` includes any of: `vue`, `nuxt`, `next`, `react`, `astro`, `svelte`, `solid`, `qwik`, the recommended frontend plugins are installed at user or project scope.

Detection patterns (from `package.json`):

| Framework | Marker dependency |
|---|---|
| Vue | `vue` |
| Nuxt | `nuxt` |
| Next.js | `next` |
| React (no framework) | `react` (without `next`) |
| Astro | `astro` |
| Svelte / SvelteKit | `svelte` |
| SolidJS | `solid-js` |
| Qwik | `@builder.io/qwik` |

**Recommended plugins to enable for any frontend project:**
- `frontend-design` — production-grade frontend interface generation
- `ui-design` — color system, type system, layout grid, responsive design
- `ux-strategy` — competitive analysis, problem framing, north-star vision
- `interaction-design` — gesture patterns, animation, error handling, loading states

**Optional plugins per use case:**
- `design-systems` — component spec, design tokens, theming, pattern library
- `design-research` — usability tests, journey maps, personas
- `designer-toolkit` — case studies, design rationale, design system adoption

**Fails when:** frontend project detected but none of the recommended plugins surface in `claude /plugin list` (or equivalent).
**Remediation:** Install via the plugin manager. Note: skills cannot auto-install plugins from inside another skill — Claude Code requires user action via the marketplace. The audit surfaces the recommendation; the user runs the install.

In `claude-setup-apply` (greenfield bootstrap), output the recommendation list as part of the init summary so the user installs at setup time.
