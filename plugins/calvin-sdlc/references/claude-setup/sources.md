---
title: Sources — Claude Code Architecture References
audience: all skills
status: canonical
created: 2026-05-07
---

# Sources

Every claim in this skill bundle traces to one of the sources below. If a claim cannot be sourced, it is marked **UNVERIFIED** in-line and treated as opinion.

---

## Anthropic — official Claude Code documentation

- Memory & CLAUDE.md: https://code.claude.com/docs/en/memory
- Skills: https://code.claude.com/docs/en/skills
- Subagents: https://code.claude.com/docs/en/sub-agents
- Hooks: https://code.claude.com/docs/en/hooks
- Settings: https://code.claude.com/docs/en/settings
- Permissions: https://code.claude.com/docs/en/permissions
- MCP: https://code.claude.com/docs/en/mcp
- Output styles: https://code.claude.com/docs/en/output-styles
- Common workflows: https://code.claude.com/docs/en/common-workflows
- Best practices: https://code.claude.com/docs/en/best-practices
- Worktrees: https://code.claude.com/docs/en/worktrees
- Agent SDK — MCP: https://code.claude.com/docs/en/agent-sdk/mcp
- Agent SDK — Subagents: https://code.claude.com/docs/en/agent-sdk/subagents
- Context window management: https://code.claude.com/docs/en/context-window
- How Claude Code works: https://code.claude.com/docs/en/how-claude-code-works

## Anthropic — engineering / blog

- Claude Code best practices (engineering blog): https://www.anthropic.com/engineering/claude-code-best-practices
- Building Claude Code (engineering blog series): see https://www.anthropic.com/engineering

## Anthropic — verified product repos (Tier-A reference setups)

Verified via `gh api repos/<owner>/<repo>/contents/...` on 2026-05-07.

- `anthropics/claude-code` — Anthropic's own product repo. Minimal `.claude/` (commands only). No CLAUDE.md. Strong evidence against bloat. https://github.com/anthropics/claude-code
- `anthropics/claude-agent-sdk-python` — **canonical `settings.json` reference**. Has `agents/test-agent.md`, `commands/{commit, generate-changelog, label-issue}.md`. https://github.com/anthropics/claude-agent-sdk-python
- `anthropics/claude-agent-sdk-typescript` — minimal. Just `commands/label-issue.md`. https://github.com/anthropics/claude-agent-sdk-typescript
- `anthropics/claude-cookbooks` — skill with co-located helper script (`scripts/validate_notebook.py`) + `references/style_guide.md`. https://github.com/anthropics/claude-cookbooks
- `anthropics/skills` — canonical Skills library. Two-field SKILL.md frontmatter (`name` + `description`) is THE format. https://github.com/anthropics/skills
- `anthropics/financial-services` — plugin marketplace (`.claude-plugin/`); one-source-many-wrappers via `scripts/sync-agent-skills.py`. https://github.com/anthropics/financial-services

## Tier-B reference setups (high-quality external repos)

- `obra/superpowers` — Jesse Vincent (Anthropic). 14 skills, `SessionStart` hook, anti-slop preamble. https://github.com/obra/superpowers
- `vercel/next.js` — `CLAUDE.md` symlink to `AGENTS.md` (literally same file). README-cascade rule. https://github.com/vercel/next.js
- `vercel/ai` — verb-named workflow skills (`add-provider-package`, `update-provider-models`). https://github.com/vercel/ai
- `oven-sh/bun` — **hooks as JS scripts** (`pre-bash-zig-build.js`, `post-edit-zig-format.js`). Uses `$CLAUDE_PROJECT_DIR`. https://github.com/oven-sh/bun
- `stripe/stripe-node` — generated-code guard pattern: *"Files containing 'File generated from our OpenAPI spec' at the top are generated; do not edit."* https://github.com/stripe/stripe-node
- `Shopify/cli` — short CLAUDE.md that `@`-imports `.cursor/rules/*` files (delegation pattern). https://github.com/Shopify/cli
- `shadcn-ui/ui` — `outputStyle: Explanatory` in settings. Distributable skill bundle pattern. https://github.com/shadcn-ui/ui

## Engineering principles (behavioural floor)

The four Karpathy principles baked into every generated CLAUDE.md (OMR-2.13) and named in `architecture-guide.md §2.4a`.

- Andrej Karpathy, original observation thread on LLM coding pitfalls: https://x.com/karpathy/status/2015883857489522876
- `forrestchang/andrej-karpathy-skills` (MIT) — distilled the thread into the four-principle structure (Think Before Coding / Simplicity First / Surgical Changes / Goal-Driven Execution) used in our template. The repo's `EXAMPLES.md` is the source for the inline anti-patterns table + worked examples that live in `claude-setup-audit/SKILL.md §"Engineering Principles — recognising violations"`. Verified 2026-05-10. https://github.com/forrestchang/andrej-karpathy-skills

## Specs

- AGENTS.md community spec: https://agents.md
- JSON Schema for Claude Code settings: https://json.schemastore.org/claude-code-settings.json

## Existing skills referenced (use these where they fit)

- `claude-md-management:claude-md-improver` — narrow CLAUDE.md auditor and improver.
- `claude-code-setup:claude-automation-recommender` — narrow hooks/automations recommender.
- `init` — built-in Claude Code CLI command for first-time CLAUDE.md scaffolding.

The three skills in this bundle (audit / optimize / init) are designed to **subsume** these narrow tools and produce comparable, graded reports across the full architecture.

---

## Deliberately excluded as evidence

These were checked and rejected:

- `cloudflare/workers-sdk` — no `.claude/`, no AGENTS.md.
- `withastro/astro` — only AGENTS.md, no CLAUDE.md.
- `tailwindlabs/tailwindcss` — none of CLAUDE.md, AGENTS.md, `.claude/`.
- `sourcegraph/sourcegraph` — 404 on the relevant paths at audit time.

---

## Audit log

If sources change, update this file and re-run audits to ensure they remain valid.

| Date | Change |
|---|---|
| 2026-05-07 | Initial bundle. Anthropic docs verified, Tier-A/B repos verified via `gh api`. |
| 2026-05-10 | Added Karpathy four-principles source (OMR-2.13). Verified `forrestchang/andrej-karpathy-skills` repo + linked X post. |
