---
dimension: D1
title: Foundation — CLAUDE.md content, structure, and reach
last_anthropic_verification: 2026-04-27
---

# D1 — Foundation

Rules governing the always-on context layer: root `CLAUDE.md`, nested `<folder>/CLAUDE.md`, the AGENTS.md relationship, and how content reaches Claude (auto-load vs `@`-import vs orphaned).

This dimension contains both **Anthropic-canonical** rules (`CHECK-NN`, WebFetch-validated against `code.claude.com/docs/en/best-practices` on every audit run) and **OMR-opinion** rules (`OMR-1.x`, `OMR-2.x`, `OMR-3.x`).

## Effective content rule (applies to all D1 content checks)

Content checks below operate on **effective content** — the union of:

1. The root `CLAUDE.md` itself.
2. Files referenced via `@<path>` import syntax in `CLAUDE.md`, depth 1 (no recursion into imported files' own imports).
3. Plain markdown links `[text](<path>)` whose `<path>` ends in `.md` and resolves inside the repo, depth 1. URL/external links and missing files are silently skipped.

This supports lean link-out architectures (e.g. a 100-line `CLAUDE.md` that points to `docs/development.md`) without forcing inline duplication. **CHECK-02 and CHECK-15 are intentionally root-only** — they operate on the root `CLAUDE.md` size only, since the whole purpose is to encourage the move-to-link-out pattern.

CHECK-13 separately flags plain markdown references (vs `@`-imports) and recommends migration; see CHECK-13 below.

---

## Anthropic-canonical (`CHECK-NN`)

### CHECK-01 — Root CLAUDE.md exists

- **Source**: anthropic-doc — https://code.claude.com/docs/en/best-practices#write-an-effective-claude-md
- **Severity**: Required
- **Applies to**: claude-setup-audit, claude-setup-apply

**Check:** `<repo>/CLAUDE.md` exists.
**Fails when:** the file is absent.
**Remediation:** Add `CLAUDE.md` at the repo root using `claude-md-template.md` as a starting point.
**Note:** If this check fails, suppress CHECK-02 through CHECK-09 (consolidation rule — listing nine "missing section" findings on a non-existent file is noise).

### CHECK-02 — File is concise (≤ 250 lines)

- **Source**: anthropic-doc
- **Severity**: Recommended
- **Applies to**: claude-setup-audit

**Check:** `wc -l <repo>/CLAUDE.md` reports ≤ 250 lines. **Root-only by design** — does NOT use effective content.
**Fails when:** > 250 lines in the root `CLAUDE.md`.
**Remediation:** Move long-form detail to referenced docs (preferably via `@`-imports so the content stays auto-loaded); keep only agent-relevant pointers in `CLAUDE.md`.

### CHECK-03 — Project Overview section

- **Source**: anthropic-doc
- **Severity**: Required
- **Applies to**: claude-setup-audit, claude-setup-apply

**Check:** `CLAUDE.md` contains a heading whose text matches `/(?i)project\s+overview/` AND the section body is non-empty.
**Fails when:** no overview heading, or the section is empty / placeholder-only.
**Remediation:** One paragraph stating what the repo does and who consumes its output. Frame for agents, not humans browsing GitHub.

### CHECK-04 — Build / test / lint commands present

- **Source**: anthropic-doc
- **Severity**: Required
- **Applies to**: claude-setup-audit, claude-setup-apply

**Check:** Within effective content, at least one runnable command appears matching `\b(make|pnpm|npm|yarn|dbt|bundle|uv|pytest|cargo|go)\b\s+\S+`.
**Fails when:** no matching commands found in effective content.
**Remediation:** Add a `Build & Test Commands` table with the actual commands the agent should run — not generic placeholders. Lean root `CLAUDE.md` files satisfy this when commands live in an `@`-imported or markdown-linked `.md` file (e.g. `docs/development.md`).

### CHECK-05 — Code style / conventions section

- **Source**: anthropic-doc
- **Severity**: Recommended
- **Applies to**: claude-setup-audit

**Check:** Within effective content, a heading matching `/(?i)conventions|coding\s+style|code\s+style/` exists with non-empty body.
**Fails when:** no matching heading found in effective content, or the section is empty.
**Remediation:** Document only project-specific deviations from defaults. Do not restate language standards.

### CHECK-06 — Project structure pointers

- **Source**: anthropic-doc
- **Severity**: Recommended
- **Applies to**: claude-setup-audit

**Check:** Within effective content, a heading matching `/(?i)project\s+structure|repository\s+layout|directory\s+structure/` exists with non-empty body, OR effective content lists at least 3 paths matching `\b\S+/\b`.
**Fails when:** no structure pointers found in effective content.
**Remediation:** Add a small table of the top-level directories with one-line purposes. Avoid full `tree` dumps.

### CHECK-07 — Gotchas section

- **Source**: anthropic-doc
- **Severity**: Optional
- **Applies to**: claude-setup-audit

**Check:** Within effective content, a heading matching `/(?i)gotchas?|footguns?|caveats?|known\s+issues/` exists.
**Fails when:** no matching heading found in effective content.
**Remediation:** Add the heading. An empty list is acceptable on day one; fill it as the team gets burned.

### CHECK-08 — Dev environment requirements

- **Source**: anthropic-doc
- **Severity**: Recommended
- **Applies to**: claude-setup-audit, claude-setup-apply

**Check:** Within effective content, a heading matching `/(?i)dev\s+environment|development\s+setup|prerequisites|getting\s+started/` exists with at least one of: required tool versions, env vars, services that must run.
**Fails when:** no matching heading found in effective content, or the section is empty.
**Remediation:** State pinned versions, required env vars, and any local services the agent must start.

### CHECK-09 — Referenced commands resolve in current state

- **Source**: anthropic-doc
- **Severity**: Required
- **Applies to**: claude-setup-audit

**Check:** For each `make <target>` in `CLAUDE.md`, the target exists in `Makefile`. For each `pnpm <script>` / `npm run <script>`, the script exists in `package.json` `scripts`. For each `dbt <cmd> --select <model>`, the model name resolves in `dbt_project.yml`-declared model paths.
**Scope:** make/pnpm/dbt commands only. Other manifest types pass through without verification.
**Fails when:** at least one referenced command does not exist in the corresponding manifest.
**Remediation:** Update `CLAUDE.md` to reference live commands, or update the manifest to provide the referenced target.

### CHECK-10 — Subdir CLAUDE.md per distinct workload

- **Source**: anthropic-doc
- **Severity**: Recommended
- **Applies to**: claude-setup-audit, claude-setup-apply

**Check:** Fires only when ≥ 2 top-level subdirs each have their own primary manifest (`package.json`, `pyproject.toml`, `Gemfile`, `dbt_project.yml`, `requirements.txt`, `Makefile`, `pnpm-workspace.yaml`). For each such subdir, `<subdir>/CLAUDE.md` exists.
**Fails when:** the threshold is met but ≥ 1 candidate subdir lacks its own `CLAUDE.md`.
**Remediation:** Add a focused `CLAUDE.md` to each candidate subdir. Anthropic auto-loads child `CLAUDE.md` files when the agent works on files inside that subdir, so the root file does not need to duplicate or even reference subdir content explicitly.

### CHECK-11 — No content duplication between root and subdir CLAUDE.md

- **Source**: anthropic-doc (extension)
- **Severity**: Optional
- **Applies to**: claude-setup-audit

**Check:** Fires only when ≥ 1 subdir `CLAUDE.md` exists. For each H2 heading present in both root and subdir, compute line-overlap ratio. Pairs with overlap ratio ≥ 0.70 flag.
**Fails when:** any pair of root/subdir sections has overlap ratio ≥ 0.70.
**Remediation:** Subdir files should hold only subdir-specific content. Move shared sections (Tech Stack, Dev Environment, Project Overview) up to the root only.

### CHECK-12 — AGENTS.md and CLAUDE.md not split

- **Source**: anthropic-doc
- **Severity**: Required
- **Applies to**: claude-setup-audit, claude-setup-migrate

**Check:** No legacy `AGENTS.md` migration debt. Either (a) only `CLAUDE.md` exists, OR (b) if both exist, neither is a stub pointer to the other and content is not duplicated wholesale.
**Fails when:** only `AGENTS.md` exists at root and `CLAUDE.md` is absent — migration needed; OR both files exist AND CLAUDE.md is a stub or verbatim copy or `@AGENTS.md`-only import.
**Remediation:** Migrate AGENTS.md content into CLAUDE.md, then thin AGENTS.md to a one-line redirect or delete it. Consolidate to a single canonical CLAUDE.md.

### CHECK-13 — Cross-document references use `@path/to/file.md` syntax

- **Source**: anthropic-doc
- **Severity**: Optional — **escalates to Required** when CHECK-13 fails AND any of CHECK-04 / CHECK-05 / CHECK-06 / CHECK-07 / CHECK-08 also fails in the same run.
- **Applies to**: claude-setup-audit

**Check:** When `CLAUDE.md` mentions other markdown files in the repo, they are written as `@`-imports (`@README.md`, `@docs/foo.md`).
**Fails when:** ≥ 1 such reference is a plain mention rather than an `@`-import.
**Severity-escalation rationale:** plain markdown references co-existing with failing inline-content checks signal a broken link-out architecture. Without escalation, users see "Required: missing commands" above "Optional: plain links" and inline the missing content into `CLAUDE.md` — which then fails CHECK-02 on the next audit.
**Remediation:** Replace plain mentions with the explicit loading mechanism that matches the content's cost profile:

| Mechanism | Use for | Loading behaviour |
|---|---|---|
| `@<path>` import | Always-relevant content | Loaded into every Claude session |
| Subdir `CLAUDE.md` | Workload-specific content | Auto-loaded when agent works in that subdir |
| Skill | Sometimes-triggered workflows | Triggered on demand via slash command or natural language |

### CHECK-14 — Strict rules use `IMPORTANT:` / `YOU MUST` emphasis

- **Source**: anthropic-doc
- **Severity**: Optional
- **Applies to**: claude-setup-audit

**Check:** Within effective content, count strict imperative rules — lines containing `\b(never|always|must|do not|don't)\b` (case-insensitive). If count ≥ 5, at least one strict rule is marked with `IMPORTANT:` or `YOU MUST`.
**Fails when:** ≥ 5 strict rules exist across effective content but none use either emphasis marker.
**Remediation:** Add `IMPORTANT:` or `YOU MUST` to the rules whose adherence has historically slipped. Don't sprinkle emphasis on every rule — reserve it for the handful that actually got violated in practice.

### CHECK-15 — Skill extraction for sometimes-triggered workflows

- **Source**: anthropic-doc
- **Severity**: Optional
- **Applies to**: claude-setup-audit

**Check:** `wc -l <repo>/CLAUDE.md` reports > 150 lines AND `<repo>/.claude/skills/` does not exist OR contains no `*/SKILL.md` files. **Root-only by design.**
**Fails when:** root `CLAUDE.md` exceeds 150 lines while no skills exist under `.claude/skills/`.
**Remediation:** Extract sometimes-triggered workflows into skills under `<repo>/.claude/skills/<skill-name>/SKILL.md`. The 150-line threshold is a soft warning before CHECK-02's 250-line hard limit.

**What is NOT a skill candidate** (do not recommend extracting these — they belong in always-on `CLAUDE.md` per Anthropic's ✅-include table at https://code.claude.com/docs/en/best-practices#write-an-effective-claude-md):

- **Required developer-environment setup** — env vars the service needs to run, service-account / credential paths, required local tooling versions. Anthropic's ✅ list includes "Developer environment quirks (required env vars)" explicitly. Every agent session that touches the relevant code path needs this context; loading it on-demand defeats the purpose.
- **Foundational invariants of the service** — auth model (e.g. "this service uses Legacy app auth, NO OAuth"), API version pinning the agent must respect, integration constraints that gate every decision in the codebase.
- **Top gotchas** — repo-specific footguns the agent will hit on most sessions touching that code. The whole point is to surface them BEFORE the agent burns context discovering them the hard way.
- **The Verify gate** — top-level lint/typecheck/test commands. Required in root by OMR-2.3.

When this check fires, the right candidates are *procedural, optional workflows* — "how to add a new GraphQL operation", "how to clone a HubSpot workflow with email replacements", "how to debug a Sentry issue end-to-end". Things the agent reaches for ON SPECIFIC tasks, not on every session.

---

## OMR-opinion (`OMR-1.x`, `OMR-2.x`, `OMR-3.x`)

### OMR-1.2 — OMR line ceiling (≤ 400 lines)

- **Source**: omr-team
- **Severity**: Required (hard ceiling) / Recommended (target band)
- **Applies to**: claude-setup-audit

**Check:** `wc -l <repo>/CLAUDE.md` reports ≤ 400 lines.
**Fails when:** > 400 lines in root `CLAUDE.md`. **Required-severity fail** above 400.
**Why a different ceiling than Anthropic:** Anthropic's docs recommend ≤ 200 and CHECK-02 codifies ≤ 250. OMR raises the practical ceiling to 400 because complex internal apps (multi-client GraphQL, custom CASL-style auth, vendor-managed locales, four-way feature-flag systems, etc.) benefit from headroom that simple greenfield examples don't need. Past 400, Claude starts ignoring rules — that's the empirical break.
**Target bands** (Recommended, advisory):
- 0–100 lines: ideal for simple repos. Anthropic's own production CLAUDE.md files (`anthropic-cookbook` ~85, `claude-code-action` 44, `claude-agent-sdk-python` 27) sit here.
- 100–200 lines: typical for medium-complexity repos with real domain context.
- 200–400 lines: acceptable for large internal apps with substantial pattern surface; should be justified.
- > 400 lines: hard fail.
**Remediation when over 400:** Move folder-specific content to nested `<folder>/CLAUDE.md` (Ring 1). Move cross-cutting conventions to `.claude/rules/*.md` with `paths:` frontmatter (Ring 2). Move workflow detail to skills (Ring 3). Move long reference content to `docs/<file>.md` and `@`-import only what belongs in always-on context.

### OMR-1.5 — No empty (0-byte) CLAUDE.md anywhere

- **Source**: omr-team
- **Severity**: Required
- **Applies to**: claude-setup-audit

**Check:** No `CLAUDE.md` file in the repo (root or nested) is 0 bytes.
**Fails when:** any `find . -name "CLAUDE.md" -size 0` match.
**Remediation:** Either fill the file with substantive content or delete it. Empty CLAUDE.md confuses readers and signals neglect.

### OMR-1.6 — No untracked CLAUDE.md committed by accident

- **Source**: omr-team
- **Severity**: Recommended
- **Applies to**: claude-setup-audit

**Check:** Every CLAUDE.md file in the repo is either tracked OR explicitly gitignored.
**Fails when:** an untracked CLAUDE.md exists that isn't in `.gitignore`.
**Remediation:** Decide: commit it (team-shared) or gitignore it (personal). Untracked-but-not-gitignored is limbo.

### OMR-2.2 — Has a "Do NOT" or equivalent section

- **Source**: omr-team
- **Severity**: Recommended
- **Applies to**: claude-setup-audit, claude-setup-apply

**Check:** Within effective content, a heading matching `/(?i)do\s+not|don't|never|forbidden/` exists with non-empty body listing concrete file patterns or actions.
**Fails when:** no such heading found.
**Remediation:** Add a "Do NOT" section listing things Claude must not do, with concrete file patterns (e.g. "Edit `*.generated.ts`", "Add tests under `cypress/`").

### OMR-2.3 — Has a "Verify before declaring done" gate

- **Source**: omr-team
- **Severity**: Recommended
- **Applies to**: claude-setup-audit, claude-setup-apply

**Check:** Within effective content, a heading matching `/(?i)verify|done\s+criteria|definition\s+of\s+done|before\s+commit/` exists listing exact verification commands.
**Fails when:** no such heading.
**Remediation:** Add a numbered list of verification commands (e.g. `pnpm lint && pnpm typecheck && pnpm test`).

### OMR-2.4 — Lists generated files

- **Source**: omr-team
- **Severity**: Required (when generated files exist)
- **Applies to**: claude-setup-audit, claude-setup-apply

**Check:** If the repo has files matching common generated patterns (`*.generated.ts`, `components.d.ts`, `*.lock`, `dist/`, etc.), CLAUDE.md or its effective content explicitly lists them as do-not-edit.
**Fails when:** generated files exist but are not declared in CLAUDE.md.
**Remediation:** Add the generated patterns to the "Do NOT" section. Pair with a `block-generated-edit` hook (D3) for enforcement.

### OMR-2.5 — Does not restate language defaults

- **Source**: omr-team
- **Severity**: Recommended
- **Applies to**: claude-setup-audit

**Check:** No platitudes like "use clean code", "prefer readability", "write tests", "follow best practices" in CLAUDE.md.
**Fails when:** such generic content found.
**Remediation:** Remove. CLAUDE.md should only state project-specific deviations from defaults, not restate what every developer knows.

### OMR-2.14 — Does not duplicate managed org-policy content

- **Source**: omr-team
- **Severity**: Recommended
- **Applies to**: claude-setup-audit, claude-setup-apply

**Check:** CLAUDE.md does not restate principles/workflow already enforced by the managed org-policy CLAUDE.md (`/Library/Application Support/ClaudeCode/CLAUDE.md` on macOS), which loads first every session and cannot be excluded (`architecture-guide.md §4.1`).
**Fails when:** whole sections mirror the managed policy — e.g. generic "Planning / Verification / Task Management / Core Principles / Simplicity First / use subagents" blocks repeating org guidance verbatim.
**Remediation:** Delete the duplicated blocks. Keep only repo-specific rules plus the four Engineering Principles (OMR-2.13). If a repo-specific nuance extends an org rule, state just the nuance, not the whole rule.

### OMR-2.6 — Does not contain plan/handover content

- **Source**: omr-team
- **Severity**: Required
- **Applies to**: claude-setup-audit, claude-setup-migrate

**Check:** CLAUDE.md does not contain plan-shaped content (TODOs, "next steps", roadmap items, in-progress migration notes).
**Fails when:** such content is present in CLAUDE.md.
**Remediation:** Move plan content to `.claude/plans/<YYYY-MM-DDTHHMM>-<type>-<topic>.md` with frontmatter.

### OMR-2.7 — Project Overview is substantive (not a tagline)

- **Source**: omr-team
- **Severity**: Required
- **Applies to**: claude-setup-audit, claude-setup-apply

**Check:** The Project Overview section's body (text below the heading, excluding any leading code-fenced one-line tagline) contains a paragraph of ≥ 50 words covering: (a) what the repo IS (product purpose, not just tech stack), (b) who consumes its output, (c) what an agent is typically asked to change.
**Fails when:** Project Overview is a tagline only (≤ 1 sentence / ≤ 30 words), OR is missing (a)/(b)/(c) — typical fail mode is "Vue 3 + Pinia + Apollo SPA. Node ≥ 22." with nothing else.
**Why:** CHECK-03 grades structural presence; OMR-2.7 grades whether the overview gives an agent enough context to make coherent additions on first try. A tagline forces the agent to re-discover product context every session.
**Remediation:** Replace the tagline with a paragraph. Bad: "Vue 3 + Pinia + Apollo SPA." Good: "OMR Reviews Eventmanager is the operations-side admin app used by content/ops staff to schedule speaker meetings, manage agency profiles, and configure events feeding the public reviews.omr.com site. Built as a Vite SPA with Apollo wired to four GraphQL backends. Most agent work here is form-heavy CRUD: views, queries/mutations via the DataProvider pattern, Pinia store extensions."

### OMR-2.8 — Architecture / Key Patterns content is present (informal section name OK)

- **Source**: omr-team
- **Severity**: Recommended
- **Applies to**: claude-setup-audit

**Check:** Repos with ≥ 3 detected dominant patterns (DataProvider components, composition stores with `reset()`, locale-prefixed routes, multi-client GraphQL split, custom auth/policy DSL like `$can`) have a section in `CLAUDE.md` covering them. The section heading does NOT need to be literally "Architecture" or "Key Patterns" — Anthropic's own public repos use informal names like "How It Runs", "Key Concepts", "Things That Will Bite You". The audit accepts any heading whose body contains architecture-shaped content (file references, pattern descriptions, lifecycle/flow explanations).
**Fails when:** patterns are detectable in the codebase but absent from CLAUDE.md (and absent from effective content via `@`-imports).
**Why:** Surfaces team-specific patterns into the always-on context so agents don't re-derive them. A pattern named in CLAUDE.md is a pattern the agent reuses; one only present in the code is one the agent re-invents inconsistently. Informal names mirror how Anthropic engineers structure their own files (see `anthropics/claude-code-action/CLAUDE.md`).
**Remediation:** Add a 3-7 item section with whatever heading reads naturally. Each pattern in 1-3 lines. Examples:
```
## Architecture / Key Patterns
- **DataProvider pattern** — components delegate fetching to a wrapper that handles loading/error/empty states.
- **Composition stores with `reset()`** — every Pinia store exports `reset()`, called on logout.
```
Or Anthropic-style with prose:
```
## How It Runs
Single entrypoint: `src/entrypoints/run.ts` orchestrates everything — prepare (auth, permissions, trigger check), install Claude Code CLI, execute Claude, cleanup.
```

**Removed:** A previous OMR-2.8 (Project Structure must be a table) was rolled back in 2026-05-08 after research found Anthropic's own public repos use code-block lists or inline prose with file references, not markdown tables. Project Structure is still a recommended section (covered by CHECK-06), but the *format* is at the author's discretion. Numbering preserved — the old OMR-2.8 is now this Architecture rule.

### OMR-2.10 — Folder-specific content moved to nested CLAUDE.md

- **Source**: omr-team
- **Severity**: Recommended
- **Applies to**: claude-setup-audit, claude-setup-apply

**Check:** For any nested folder path referenced > 3 times in root `CLAUDE.md` (e.g. `src/views/Meetings/` mentioned 4× across gotchas + commands + conventions), the audit suggests extracting that content to a nested `<folder>/CLAUDE.md` (Ring 1) so it loads only when Claude works in that folder.
**Fails when:** ≥ 1 folder path appears > 3 times in root CLAUDE.md AND no `<folder>/CLAUDE.md` exists for it.
**Why:** Root CLAUDE.md tokens cost on every session. Folder-specific content should pay tokens only when relevant. A rule mentioning `src/views/Meetings/` four times is paying full token cost on every session — including sessions that never touch that folder. Nested CLAUDE.md (Ring 1) loads on demand when Claude reads files in that folder.
**Remediation:** Extract the folder-specific content to `<folder>/CLAUDE.md`. Add a short pointer in root's "Where to find more" section per OMR-13.4 (`<folder>/CLAUDE.md — <topic> (consult for: …; auto-loads when working in \`<folder>/\`)`). Confirm root no longer references the folder more than 1-2 times.
**False-positive guard:** Some folders are mentioned often *because the path is part of a top-level rule that genuinely belongs in root* (e.g. "Generated files in `src/gql/**/*.generated.ts` are auto-regenerated" appears in Top gotchas, Do NOT, and Verify — three legit references). The audit's recommendation is advisory; the human resolves whether the references are concentrated content or legitimately distributed.

### OMR-2.11 — Multi-step workflows extracted to skills

- **Source**: omr-team
- **Severity**: Recommended
- **Applies to**: claude-setup-audit, claude-setup-apply

**Check:** Sections in root `CLAUDE.md` with > 5 numbered or bulleted procedural steps describing how to accomplish a task ("to add a GraphQL operation: 1. write `.gql`, 2. run codegen, 3. import the generated type, 4. ...") are flagged for extraction to a skill at `.claude/skills/<verb-name>/SKILL.md`.
**Fails when:** ≥ 1 section matches the pattern (heading + 5+ procedural steps) AND the steps describe an OPTIONAL workflow (see exceptions below).
**Why:** Workflows are skills, not always-on context. The Anthropic best-practices guide explicitly says: "For domain knowledge or workflows that are only relevant sometimes, use skills instead. Claude loads them on demand without bloating every conversation." A 7-step "how to add a GraphQL operation" workflow burns tokens on every session — including the 90% of sessions that don't add GraphQL operations.

**Exceptions — these stay in always-on `CLAUDE.md` even when the step-count threshold trips:**

- **Required developer-environment setup** (env vars, service-account credential paths, required local tooling, BigQuery / database client config). Anthropic's ✅ table at https://code.claude.com/docs/en/best-practices#write-an-effective-claude-md explicitly lists "Developer environment quirks (required env vars)" as include-side content. Every session that touches the relevant code path needs this context; gating it behind "Use when …" defeats the purpose.
- **The Verify gate** (lint/typecheck/test sequence). Required in root by OMR-2.3 — not a workflow, a checklist.
- **Deployment / release rituals** that are mandatory for any change that ships (pre-deploy `git status` check, "never `gcloud builds submit` directly", required CI invocations). These are guardrails, not optional procedures.
- **Foundational invariants** (auth model, API version pinning, "this codebase NEVER does X"). These gate every decision; they're not workflows you reach for, they're rules you operate under.

When in doubt: ask "is this content relevant on EVERY session, or only on SPECIFIC sessions?" If every — keep in root. If specific — extract.

**Remediation:** For genuinely optional workflows, extract to `.claude/skills/<verb>/SKILL.md` (e.g. `add-graphql-op/SKILL.md`). The skill's frontmatter `description:` field matters — it determines when Claude reaches for the skill. Keep root's "Verify before declaring done" steps in root (those are top-level checklist items, not procedural workflows). For the exception categories above, do NOT recommend extraction — they belong in always-on context by design.

### OMR-2.12 — Long reference prose moved to docs/ + @-import

- **Source**: omr-team
- **Severity**: Recommended
- **Applies to**: claude-setup-audit, claude-setup-apply

**Check:** Sections in root `CLAUDE.md` with > 100 words of uninterrupted prose (no code blocks, no list markers, no sub-headings) are flagged for moving to `docs/<topic>.md` and `@`-importing only what belongs in always-on context.
**Fails when:** ≥ 1 section in root has > 100 words of pure prose.
**Why:** Long explanatory prose in root is reference content that mostly lives at the bottom of the attention window. The Anthropic exclude-list explicitly says: "Long explanations or tutorials" don't belong in CLAUDE.md. Moving them to `docs/<topic>.md` and adding an `@docs/<topic>.md` import keeps the content effectively-loaded (per the effective-content rule) but visually decoupled from the agent-actionable parts.
**Remediation:** Extract the prose to `docs/<topic>.md`. If the content is universally relevant, replace with `@docs/<topic>.md` (auto-loaded). If it's situational, replace with a markdown link `[<topic>](docs/<topic>.md)` (read on demand). Keep a 1-2 line summary in root if the topic deserves promotion.

### OMR-2.13 — Engineering Principles section present (non-negotiable)

- **Source**: omr-team (adapted from Andrej Karpathy's observations on LLM coding pitfalls — https://x.com/karpathy/status/2015883857489522876, via forrestchang/andrej-karpathy-skills, MIT)
- **Severity**: Required
- **Applies to**: claude-setup-audit, claude-setup-apply

**Check:** Within effective content, a heading matching `/(?i)engineering\s+principles|coding\s+principles|guiding\s+principles/` exists, AND its body contains all four named principles. The audit accepts either the canonical headings (`Think Before Coding`, `Simplicity First`, `Surgical Changes`, `Goal-Driven Execution`) or close paraphrases bound to the same meaning. Practical regex: `/think\s+before\s+coding/i`, `/simplicity\s+first/i`, `/surgical\s+changes/i`, `/goal[- ]driven\s+execution/i` — at least three of four name-matches plus a Principles heading is a pass; fewer is a fail.
**Fails when:**
- No `Engineering Principles` (or paraphrase) heading found in effective content, OR
- The section exists but fewer than three of the four named principles are recognisable in the body, OR
- The section is reduced to a one-line placeholder (`See <link>`) without the named principles being reachable through the effective-content rule (`@`-import or markdown link to a file that contains them).
**Why this is non-negotiable:** structural rules (CHECK-02, CHECK-06, OMR-1.2) grade *what's in the file*. They say nothing about the **behavioural floor** the file should set. The four principles target the failure modes Karpathy named — silent assumptions, premature abstraction, drive-by refactors, unverified completion — which a structurally clean CLAUDE.md can otherwise leave unaddressed. These principles apply to every repo regardless of language, stack, or domain; they are not optional team preferences.
**Remediation:** Paste the canonical block from `claude-md-template.md §"Engineering Principles"` into root `CLAUDE.md`. The four principle headings must remain verbatim (the audit name-matches them). Bullet wording can be edited to team voice as long as the meaning of each principle survives. If the team prefers to host the principles in a referenced file, use `@docs/engineering-principles.md` (auto-loaded via `@`-import) — a plain markdown link is fine too because the effective-content rule resolves it. A bare external URL pointer fails this check.
**For PR review prose:** when citing OMR-2.13, name the violation in concrete terms ("this PR fixes the bug AND reformats unrelated functions — drop the unrelated edits or split the PR") rather than the rule number. The audit skill carries an inline anti-patterns table + worked example per principle for the auditor to reference; see `claude-setup-audit/SKILL.md §"Engineering Principles — recognising violations"`.
**Hard-cap interaction:** see `grading-rubric.md` — failing OMR-2.13 caps overall grade at 2:1 even if every other dimension scores First. The rule trades a few lines of always-on tokens for a measurable reduction in the agent failure modes the principles address.

---

### OMR-3.1 — Nested CLAUDE.md ≤ 100 lines

- **Source**: omr-team
- **Severity**: Recommended
- **Applies to**: claude-setup-audit

**Check:** Each nested `<folder>/CLAUDE.md` is ≤ 100 lines.
**Fails when:** any nested CLAUDE.md exceeds 100 lines.
**Remediation:** Trim or split. Nested files cover folder-specific conventions; if it grows, split by sub-area or extract to a skill.

### OMR-3.3 — One per "hot" subfolder, not arbitrary folders

- **Source**: omr-team
- **Severity**: Recommended
- **Applies to**: claude-setup-audit

**Check:** Nested CLAUDE.md files exist in subfolders with 3+ files frequently touched (heuristic: subfolders with >10 .{ts,vue,py,etc.} files OR primary manifests).
**Fails when:** nested CLAUDE.md files exist in low-traffic folders that don't earn their place.
**Remediation:** Delete nested CLAUDE.md files in cold folders. Save the auto-load slots for places agents actually work.

### OMR-3.4 — Subtree convention reach (orphan detection)

- **Source**: community-pattern (extension of CHECK-13 mechanics)
- **Severity**: Recommended
- **Applies to**: claude-setup-audit

**Check:** Walk every subdirectory (excluding `node_modules/`, `.git/`, `.claude/`, `docs/`, `reports/`, `.github/`, `.vscode/`, `.idea/`, `.krane/`, `.code-review-graph/`, build/cache dirs) for `.md` files NOT named `CLAUDE.md` / `README.md` / `CHANGELOG.md` / `LICENSE.md`. For each match, check if the content includes conventions/gotchas/rules (keywords: "convention", "must", "should", "do not", "gotcha", "pattern", "guideline"). If yes, classify reach: (a) auto-loaded as CLAUDE.md, (b) imported via `@`-syntax in parent CLAUDE.md, or (c) **orphaned** (neither).
**Fails when:** ≥ 1 orphaned convention markdown file.
**Per-file deduction:** −2 D1 points per orphaned file (max −6). Not a hard cap — Anthropic's docs explicitly support both auto-load and `@`-import; the rule is "reach the model via a documented path", not "use the CLAUDE.md filename".
**Remediation:** Rename to `<folder>/CLAUDE.md`, OR add `@<folder>/<file>.md` import to parent CLAUDE.md. Mixed convention/roadmap files: split — convention slice → `<folder>/CLAUDE.md` (or `@`-import); roadmap slice → `.claude/plans/<date>-<topic>.md`.

---

## Deduplication notes

These OMR rules from the legacy `omr-checklist.md` are now **subsumed** by Anthropic-canonical CHECK rules and have been removed from this document:

- OMR-1.1 (Root CLAUDE.md exists) → covered by CHECK-01
- OMR-1.3 (≤ 150 lines target) → covered by CHECK-15 (skill-extraction trigger at 150 lines)
- OMR-1.4 (no AGENTS.md/CLAUDE.md divergence) → covered by CHECK-12
- OMR-2.1 (top commands present) → covered by CHECK-04
- OMR-2.7 (pointer section to nested CLAUDE.md and skills) → covered by CHECK-13
- OMR-2.8 (IMPORTANT/YOU MUST emphasis) → covered by CHECK-14
- OMR-3.2 (no duplication of root content in nested) → covered by CHECK-11
