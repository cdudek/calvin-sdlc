<!--
Generic CLAUDE.md template, aligned with Anthropic's "Write an effective CLAUDE.md"
guidance (code.claude.com/docs/en/best-practices) and the file styles Anthropic engineers
ship in their own public repos (anthropic-cookbook, claude-agent-sdk-python,
claude-code-action). Reference points: those files are 27, 44, and ~85 lines respectively.

How to use:
 1. Replace `<placeholder>` values with your repo's specifics.
 2. Replace each `<!-- FILL: ... -->` block with real content. Do not commit
    the file with placeholder markers still present.
 3. Delete this header comment before committing.
 4. Length: up to ~400 lines is acceptable for production repos with real
    domain complexity. Don't exceed 400 — past that, Claude starts ignoring
    rules. Note that Anthropic's docs recommend 200; OMR raises the cap to
    400 because complex internal apps (multi-client GraphQL, custom auth,
    legacy patterns) benefit from the headroom. If you're under 100, that's
    fine — Anthropic's own production repos sit at 27–85 lines. If you're
    over 250, audit yourself: would removing each line cause Claude to make
    mistakes? If not, cut it.

Required sections (audit failures if absent or stub-only):
 - Project Overview — substantive paragraph (≥ 50 words). OMR-2.7. Required.
 - Engineering Principles — the four Karpathy principles, verbatim or near-verbatim.
   OMR-2.13. Required. Non-negotiable in every repo. Source:
   https://x.com/karpathy/status/2015883857489522876 — directly addresses the
   "LLMs make wrong assumptions, overcomplicate, do drive-by edits, and skip
   verification" failure modes.
 - Build & Test Commands — at minimum dev / build / lint / typecheck / test
 - Top Gotchas — repo-specific footguns
 - Verify before declaring done — concrete completion criteria

Recommended:
 - Project Structure — code-block list, prose with file refs, or table.
   Format is at the author's discretion. CHECK-06 grades presence.
 - Architecture / Key Patterns — when the repo has dominant patterns the agent
   encounters repeatedly. Heading name flexible; OMR-2.8 accepts informal
   variants like "How It Runs", "Key Concepts", "Things That Will Bite You".
 - Coding Conventions — only repo-specific deviations from language defaults.
 - Where to find more — pointers to nested CLAUDE.md / @-imports / docs/.

Optional (most repos can skip):
 - Tech Stack — Anthropic's own files don't have one (Claude reads
   package.json/Gemfile/etc.). Include only if there are pinned-version
   constraints an agent must respect that aren't visible in standard manifests.
-->

# <Project Name>

## Project Overview

<!-- FILL: a substantive paragraph (3-5 sentences, ~50-150 words). Cover:
     1. What the repo IS — product purpose, not just tech stack.
        Bad: "Vue 3 + Pinia + Apollo SPA."
        Good: "OMR Reviews Eventmanager is the operations-side admin app
        used by content/ops staff to schedule speaker meetings, manage
        agency profiles, and configure events feeding the public
        reviews.omr.com site."
     2. Who consumes its output — the actual users, not "developers."
     3. What an agent is typically asked to change here — the dominant
        kind of work (forms + GraphQL wiring? data pipelines? infra?).
     A tagline alone fails OMR-2.7 (Required).
-->

`<short tagline>` (one line, e.g. tech stack + product domain)

<!-- FILL: substantive paragraph here -->

## Engineering Principles

<!-- DO NOT REMOVE OR THIN THIS SECTION. OMR-2.13 (Required). Non-negotiable
     baseline for every repo. Sourced from Andrej Karpathy's observations on
     LLM coding pitfalls (https://x.com/karpathy/status/2015883857489522876),
     adapted from forrestchang/andrej-karpathy-skills (MIT). Keep the four
     principle headings verbatim — the audit checks for them by name. The
     bullet wording can be edited to match team voice; the meaning must
     survive. -->

These four principles apply to every change in this repo. They are baseline guardrails against common LLM coding pitfalls — wrong assumptions, overcomplication, drive-by edits, and unverified completion claims.

### 1. Think Before Coding

**Don't assume. Don't hide confusion. Surface tradeoffs.**

- State assumptions explicitly. If uncertain, ask — don't guess.
- If multiple interpretations exist, present them. Don't pick silently.
- If a simpler approach exists, say so. Push back when warranted.
- If something is unclear, stop. Name what's confusing. Ask.

### 2. Simplicity First

**Minimum code that solves the problem. Nothing speculative.**

- No features beyond what was asked.
- No abstractions for single-use code.
- No "flexibility" or "configurability" that wasn't requested.
- No error handling for impossible scenarios.
- If 200 lines could be 50, rewrite it.

Test: would a senior engineer call this overcomplicated? If yes, simplify.

### 3. Surgical Changes

**Touch only what you must. Clean up only your own mess.**

- Don't "improve" adjacent code, comments, or formatting.
- Don't refactor things that aren't broken.
- Match existing style, even if you'd do it differently.
- Remove imports/variables/functions YOUR changes made unused — not pre-existing dead code.
- Every changed line should trace directly to the user's request.

### 4. Goal-Driven Execution

**Define success criteria. Loop until verified.**

- Transform tasks into verifiable goals: "Add validation" → "Write tests for invalid inputs, then make them pass". "Fix the bug" → "Write a test that reproduces it, then make it pass".
- For multi-step tasks, state a brief plan: `1. <step> → verify: <check>`.
- Strong success criteria let the agent loop independently. Weak criteria ("make it work") force constant clarification.

**Tradeoff:** these bias toward caution over speed. For trivial fixes (typo, obvious one-liner), use judgment — the rigor is for non-trivial work.

## Build & Test Commands

<!-- FILL: keep this list short and project-specific. Prefer single-target
     commands over full-suite runs — agents iterate faster. Always cover
     dev / lint / typecheck / test / build at minimum. Format is at your
     discretion: bullet list, table, or code block. Anthropic's own files
     use bullet lists or shell-fenced blocks. -->

- `<dev command>` — dev server
- `<test command>` — run tests
- `<lint command>` — lint
- `<typecheck command>` — typecheck
- `<build command>` — production build

## Project Structure

<!-- FILL: top-level directories with one-line purposes. Format is at your
     discretion — Anthropic's public repos use code-block lists; tables and
     prose with inline file refs are also fine. The only failure mode is a
     BARE path enumeration like `src/{components,views,stores,...}` with no
     per-path explanation.

     Common purpose patterns by folder name (starting point; adjust to actual
     repo conventions):

     - `src/` or `app/` — application source root
     - `src/components/` — generic, reusable components used across views
     - `src/views/` or `src/pages/` — route-level components / pages
     - `src/ui/` — design-system primitives (buttons, inputs)
     - `src/stores/` — state management (Pinia / Redux / etc.)
     - `src/composables/` or `src/hooks/` — reusable logic
     - `src/services/` — domain-level services / API wrappers
     - `src/gql/` or `src/api/` — GraphQL operations / API contracts
     - `src/router/` — routing config + middleware
     - `src/policies/` — authorization rules
     - `src/plugins/` — framework plugins (i18n, error tracking)
     - `e2e/` or `test/e2e/` — end-to-end tests
     - `docs/` — human-readable references (loaded on demand)
     - `.claude/` — AI-context infrastructure (skills, rules, hooks, settings)

     If a folder's purpose isn't obvious from the name, READ A FILE INSIDE
     IT before writing the purpose. Do not guess. Aim for 8-12 of the most
     load-bearing directories — exhaustive trees are an anti-pattern.
-->

```
<dir>/  - <one-line purpose>
<dir>/  - <one-line purpose>
```

## Architecture / Key Patterns

<!-- FILL (recommended for non-trivial repos): the 3-7 dominant patterns an
     agent will encounter repeatedly. Each pattern in 1-3 lines. The heading
     name is flexible — Anthropic engineers use informal variants like
     "How It Runs", "Key Concepts", "Things That Will Bite You" — whatever
     reads naturally for the kind of pattern. OMR-2.8 accepts any heading
     whose body contains architecture-shaped content (file references,
     pattern descriptions, lifecycle/flow explanations).

     Examples worth surfacing:
     - "DataProvider pattern: components delegate fetching to a wrapper
       that handles loading/error/empty states."
     - "Composition stores with reset(): every Pinia store exports
       reset(), called on logout."
     - "Locale-prefixed routes: /de/... and /en/... always — use
       useReviewsPaths() to build URLs."
     - Or Anthropic-style prose: "Single entrypoint: src/entrypoints/run.ts
       orchestrates everything — prepare (auth, permissions, trigger
       check), install Claude Code CLI, execute Claude, cleanup."

     If you don't have a recurring pattern worth naming, delete this section.
-->

## Coding Conventions

<!-- FILL (optional): only project-specific deviations from defaults. Do NOT
     restate language standards. Examples worth listing:
     - Naming patterns (e.g. PascalCase for component files)
     - File placement rules (e.g. each component in its own directory)
     - Commit/branch/PR format (e.g. Conventional Commits with Linear ticket scope)
     - Formatter config that matters (e.g. single quotes, no semicolons)
-->

## Gotchas

<!-- FILL: numbered list of footguns. Each item ≤ 2 lines. Empty is fine on
     day one — fill as the team gets burned. Anthropic engineers often combine
     this with Do NOT under a casual heading like "Things That Will Bite You" —
     that's fine. Common categories:
     - Generated files that look editable but get overwritten
     - Vendor-managed files (translations, downstream API schemas)
     - Build/test surprises (heap allocation, port conflicts, env requirements)
     - Easy-to-confuse APIs / composables with similar names
-->

1. <gotcha>

## Do NOT

<!-- FILL: concrete negative patterns the agent must avoid. Each item one line.
     Often combined with Gotchas under a single section in Anthropic-authored
     files — split or combine as suits the repo. -->

- <pattern to avoid>

## Verify before declaring done

<!-- FILL: numbered list of exact commands the agent runs to confirm a task
     is complete. Should mirror the team's pre-commit / pre-PR routine. -->

1. `<lint command>` → 0 warnings
2. `<typecheck command>` → 0 errors
3. `<test command>` → green

## Where to find more

<!-- FILL: pointers to other context sources. EVERY pointer must annotate
     TWO things:

     1. `consult for:` — what kinds of tasks should make Claude (or a human)
        reach for this doc. 2-4 concrete task triggers, not vague topic
        labels. "adding GraphQL operations, picking the right client" beats
        "GraphQL stuff."

     2. Retrieval timing — one of five canonical phrases:
        - "auto-loaded at session start" — root CLAUDE.md, @-imports above,
          .claude/rules/*.md without `paths:` frontmatter
        - "auto-loads when working in <folder>/" — nested CLAUDE.md files
        - "auto-loads when touching <pattern>" — .claude/rules/*.md with
          `paths:` frontmatter
        - "read on demand" — plain markdown links to docs/<file>.md;
          Claude fetches when it judges them relevant
        - "manually invoked" — slash commands, skills with
          disable-model-invocation, subagents

     OMR-13.4 (Recommended) flags pointers missing either annotation.
     Format: `- <path> — <topic> (consult for: <triggers>; <retrieval>)` -->

- `<folder>/CLAUDE.md` — <topic> (consult for: <task A>, <task B>; auto-loads when working in `<folder>/`)
- `.claude/rules/<file>.md` — <topic> (consult for: <task A>, <task B>; auto-loads when touching `<paths-glob>`)
- @docs/<file>.md — <topic> (consult for: <task A>, <task B>; auto-loaded at session start)
- `docs/<file>.md` — <topic> (consult for: <task A>, <task B>; read on demand)
- `/<plugin>:<skill-name>` — <what it does> (consult for: <when>; manually invoked)
