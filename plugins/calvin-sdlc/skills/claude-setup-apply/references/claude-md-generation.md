---
title: Generated CLAUDE.md — section sources, forms and hard rules
status: canonical
created: 2026-09-10
---

# Generated CLAUDE.md — section-by-section

Step 6 of `claude-setup-apply`. Scaffold is
`references/claude-setup/claude-md-template.md`; sections are populated from the
Step 3 repo-signal inventory.

| Section | Source | Form |
|---|---|---|
| **Project Overview** (Required, OMR-2.7) | `package.json:description` + `package.json:name` + repo basename + top deps + README first paragraph | A paragraph of ≥ 50 words covering: (a) what the repo IS (product purpose, not just tech stack), (b) who consumes its output, (c) what an agent is typically asked to change. A tagline ALONE fails the audit. If product context can't be inferred, write what you have plus a `<!-- TODO: confirm product purpose with team -->` marker. Source from README's first sentence(s) when present; never invent. |
| **Engineering Principles** (Required, OMR-2.13) | Canonical block in `claude-md-template.md §"Engineering Principles"` — pasted verbatim. Non-negotiable in every generated CLAUDE.md regardless of stack, repo size, or domain. | The four Karpathy principles — `Think Before Coding`, `Simplicity First`, `Surgical Changes`, `Goal-Driven Execution` — each with their summary sentence and bullets. The four principle headings stay verbatim (the audit name-matches them); bullet wording can be re-voiced to team tone. Do not thin to a one-line "see link" pointer — that fails OMR-2.13. ~30–40 lines of always-on content; this is a deliberate trade for behavioural-floor enforcement. |
| **Build & Test Commands** | `package.json:scripts` filtered to user-facing daily commands (skip `pre*` / `post*` lifecycle hooks); 5–8 commands prioritised dev/build/test/lint/typecheck/codegen | Bulleted list, code-block, or table. Anthropic engineers use whichever reads cleanest — bullet lists are most common. |
| **Project Structure** (Recommended, CHECK-06) | top-level dirs + the folder→purpose mapping in `claude-md-template.md` | **Format flexible** — code-block list, table, or prose with inline file refs. Anthropic's own repos use code-block lists most often. Aim for 8–12 of the most load-bearing dirs, NOT exhaustive. The only failure mode is a bare path enumeration with no per-path purpose. For ambiguously named folders, read one file inside before writing the purpose; mark unsure entries with `<!-- TODO: confirm -->`. |
| **Architecture / Key Patterns** (Recommended, OMR-2.8) | grep for patterns: `defineProps<` in `<script setup>`, presence of `*DataProvider.vue`, `useGql\|createApolloClient`, `i18n\|useI18n`, `$can\(`, Pinia stores with `reset()` | If ≥ 3 dominant patterns detected, document them. **Heading name flexible** — Anthropic engineers use informal variants like "How It Runs", "Key Concepts", "Things That Will Bite You". OMR-2.8 accepts any heading whose body contains architecture-shaped content. If < 3 patterns detected, omit the section. |
| **Top gotchas** | Generated files detected → "X are auto-regenerated, do not edit"; lockfile detected → "Use the right package manager"; `.phraseapp.yml` etc. → corresponding gotcha | Numbered list, each item ≤ 2 lines. Anthropic often combines this with Do NOT under a casual name. |
| **Do NOT** | Concrete patterns from repo signals (no editing generated files, no committing `.env`, etc.) | Bulleted list. Combine with Gotchas under one heading if it reads better. |
| **Verify before declaring done** | The lint + typecheck + test commands actually present in `package.json` | Numbered list of exact commands. |
| **Coding Conventions** | Empty by default — populated only by team-explicit directives the user reconciles in Step 7 | Optional. Only project-specific deviations from language defaults. |
| **Where to find more** | `@`-imports for `docs/<file>.md` matched to section topics. Plus pointer to `.ai-legacy/` if it exists. | Bulleted list. **Each pointer annotates two things** (OMR-13.4): (a) `consult for:` — 2-4 concrete task triggers (not topic labels — "adding GraphQL operations, picking the right client" beats "GraphQL stuff"), and (b) retrieval timing using one of five canonical phrases ("auto-loaded at session start", "auto-loads when working in `<folder>/`", "auto-loads when touching `<pattern>`", "read on demand", "manually invoked"). Format: `- <path> — <topic> (consult for: <triggers>; <retrieval>)`. Topic-only pointers fail the audit. |

**Optional sections (most repos can skip — Anthropic's own files don't include them):**

- **Tech Stack** — skip unless there are pinned-version constraints an agent must respect that aren't visible from `package.json`/`Gemfile`/etc. Claude reads the manifest; restating it costs tokens for no gain.

**Hard rules:**

1. **Project Overview MUST be a paragraph, not a tagline** (OMR-2.7). If you can't infer enough product context, write what you have AND add a `<!-- TODO: confirm product purpose with team -->` marker. The team would rather see a TODO than a 1-line file.
2. **Engineering Principles section is non-negotiable** (OMR-2.13). The four Karpathy principles ship in every generated CLAUDE.md regardless of repo. The four principle headings stay verbatim. Do NOT skip this section to save lines, even on minimal repos — the principles are the behavioural floor that structural rules don't cover. Missing or thinned to a pointer-only stub caps the next audit at 2:1.
3. **Don't produce a bare path enumeration** (`src/{components,views,stores,...}`) for Project Structure — every path needs a per-path purpose. Format is your choice.
4. **Length: up to ~400 lines acceptable, hard ceiling 400.** Anthropic's docs recommend 200 and their own public repos sit at 27–85. OMR raises the practical cap to 400 because complex internal apps (multi-client GraphQL, custom auth, legacy patterns) benefit from the headroom. If a repo is already under 100, don't pad it — Anthropic's example in their docs is 7 lines and that's the spirit for simple repos. If you're approaching 400, audit yourself: would removing each line cause Claude to make mistakes? If not, cut it.
