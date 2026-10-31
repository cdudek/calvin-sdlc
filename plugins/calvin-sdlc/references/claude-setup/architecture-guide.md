---
title: Claude Code Repo Architecture — Complete Guide
audience: humans (engineers, tech leads)
status: canonical
created: 2026-05-07
sources: see sources.md
---

# Claude Code Repo Architecture — The Complete Guide

This is the canonical, human-readable reference for setting up a code repository to be used effectively by Claude Code (the CLI). It is consumed by three skills (`claude-setup-audit`, `claude-setup-apply`, `claude-setup-apply`) and is meant to be readable on its own by any engineer onboarding to the conventions.

It is opinionated. It is grounded in Anthropic's official documentation, in cross-checked behaviour of Anthropic's own product repos (`anthropics/claude-code`, `anthropics/claude-agent-sdk-{python,typescript}`, `anthropics/claude-cookbooks`, `anthropics/skills`), and in patterns observed at Vercel, Bun, Stripe, and Shopify. Anything not grounded is flagged.

---

## 1. The mental model: six concentric rings

A Claude-Code-optimised repo organises context into six concentric rings, ordered by **how often they load**, **how much they cost**, and **how strictly they are enforced**.

```
Ring 0 — Always-on context        ./CLAUDE.md (≤200 lines)
Ring 1 — Lazy folder context      ./<folder>/CLAUDE.md (loads when Claude reads files there)
Ring 2 — Path-scoped rules        .claude/rules/*.md with paths: glob frontmatter
Ring 3 — Skills                   .claude/skills/<verb-name>/SKILL.md (loads on invocation)
Ring 4 — Subagents                .claude/agents/<role-name>.md (own context window)
Ring 5 — Hooks + settings         .claude/settings.json + .claude/hooks/*.sh
                                  (deterministic, enforced at lifecycle events)
                  ───────────
                  .mcp.json — external capabilities (servers added on demand)
```

Three axes describe each ring:

| Ring | Cost | Determinism | Use for |
|---|---|---|---|
| 0 | High (every session) | Advisory | Whole-repo invariants, top commands, gotchas |
| 1 | Low (lazy) | Advisory | Folder-specific conventions |
| 2 | Low (lazy, path-matched) | Advisory | Cross-cutting glob-scoped rules |
| 3 | Free until invoked | Advisory but auto-triggered | Repeatable workflows with steps + scripts |
| 4 | Isolated (own context) | Advisory | Heavy work that would pollute main context |
| 5 | Negligible | **Enforced** | Things that must happen regardless of model decision |

**Rule of thumb:** if something *must* happen → hook. If it's reusable knowledge → skill. If it would bloat context → subagent. If it's "always true about the repo" → CLAUDE.md.

---

## 2. CLAUDE.md — the always-on file

### 2.1. What Claude Code loads automatically

Claude Code walks the directory tree from your working directory at session start and concatenates CLAUDE.md files in this order:

1. Managed policy CLAUDE.md (org-enforced, cannot be excluded)
2. Ancestor directories' CLAUDE.md
3. Project root `./CLAUDE.md` (or `./.claude/CLAUDE.md`)
4. `./CLAUDE.local.md` (gitignored)
5. `~/.claude/CLAUDE.md` (user-wide)
6. Subdirectory CLAUDE.md files — **lazy**, loaded only when Claude reads files in that subtree

Subdirectory files are concatenated with the rest once loaded; they persist for the rest of the session.

### 2.2. Hard constraints

- **Target ≤200 lines** per file. Adherence drops sharply above this. 100–150 is the sweet spot.
- `@path/to/file` import syntax expands at load time. Max recursion depth: 5 hops. Imports do **not** save startup tokens — they only help organisation.
- CLAUDE.md is loaded as **user-message context**, not as system prompt. Therefore it is **advisory**, not enforced. For guarantees, use hooks.
- HTML block comments (`<!-- … -->`) are reportedly stripped before injection — useful for human-only annotations. Treat as unverified until tested in your harness.

### 2.3. Content that earns its tokens

Include:

- The 3–5 *commands* an engineer (and Claude) runs daily, with exact strings (`pnpm typecheck`, not "run typecheck")
- *Conventions that differ from defaults* — not "use clean code", not "prefer readability", but "we use Composition API only, no Options API"
- *Gotchas* — non-obvious behaviour, generated files, things that break when violated
- *Do-NOT* list with concrete file paths/patterns
- *Verify-before-done* checklist with exact commands
- *Where to find more* — pointers to nested CLAUDE.md, skills, docs

Exclude:

- Standard language conventions Claude already knows
- Anything Claude can infer by reading the code
- Detailed API docs (link or use a skill)
- Long prose explanations or tutorials
- Restating what the linter/formatter already enforces
- Plans, handover docs, session notes
- **Anything the managed org-policy CLAUDE.md already enforces** — it loads first, every
  session, and cannot be excluded (§4.1). Restating its principles/workflow is pure duplication
  that dilutes the repo-specific rules around it (see OMR-2.14)

### 2.4. Splitting strategy

| Scope | Mechanism |
|---|---|
| Whole repo, every session | `./CLAUDE.md` |
| One subdirectory only | `./<folder>/CLAUDE.md` (lazy) |
| Cross-cutting glob (multiple folders) | `.claude/rules/<topic>.md` with `paths:` frontmatter |
| Repeatable workflow with steps | Skill at `.claude/skills/<verb>/SKILL.md` |
| Deep reference material (architecture, API specs) | `docs/<topic>.md` (read on demand) |
| Personal preferences (sandbox URLs, test data) | `./CLAUDE.local.md` (gitignored) |

### 2.4a. Engineering Principles — non-negotiable baseline

Every CLAUDE.md ships with four behavioural principles, regardless of repo size, stack, or domain:

1. **Think Before Coding** — surface assumptions, ask when uncertain, present interpretations rather than picking silently.
2. **Simplicity First** — minimum code that solves the problem; no abstractions for single-use code; no speculative flexibility.
3. **Surgical Changes** — every changed line traces to the user's request; no drive-by refactors; match existing style.
4. **Goal-Driven Execution** — turn imperative tasks into verifiable goals; loop until success criteria pass.

These address the four Karpathy-named failure modes for LLM-assisted coding (wrong assumptions, overcomplication, orthogonal edits, unverified completion — see [Karpathy 2026](https://x.com/karpathy/status/2015883857489522876)). Structural-only rubrics don't catch them; the principles raise the behavioural floor without conflicting with structural checks.

The canonical block lives in `claude-md-template.md §"Engineering Principles"`. `claude-setup-apply` writes it inline. `claude-setup-audit` checks for it via OMR-2.13 (Required) and a hard-cap row at 2:1 in `grading-rubric.md`. Bullet wording can be re-voiced for team tone; the four principle headings must remain (the audit name-matches them).

### 2.5. AGENTS.md — OMR standardizes on CLAUDE.md

**OMR standard: ship `CLAUDE.md`, never a live `AGENTS.md`.** `AGENTS.md` is a community
convention some tools read (Cursor, Codex, certain harnesses); Claude Code reads `CLAUDE.md`.
OMR repos use one filename everywhere — root and on-demand subfolder files alike — so there is a
single source of truth and nothing to keep in sync.

- **Do:** keep all agent guidance in `CLAUDE.md`. If a repo has an `AGENTS.md`,
  `git mv AGENTS.md CLAUDE.md` and repoint every reference to it.
- **Only exception:** a non-Claude tool in the repo's own toolchain genuinely requires
  `AGENTS.md` → then make it a literal **symlink** `AGENTS.md → CLAUDE.md` (one file, two names,
  as `vercel/next.js` and `oven-sh/bun` do), never a second maintained file. A short `AGENTS.md`
  that `@`-imports `CLAUDE.md` is fragile — do not use it.

Never keep two files that can diverge.

### 2.6. Reference docs — the canonical set

Deep material doesn't belong in CLAUDE.md; it belongs in a **reference doc** that CLAUDE.md
*points to* with a plain markdown link (read on demand — **not** `@`-imported, which would drag
it into every session per §2.2). OMR standardizes the filenames so every repo is navigable the
same way. Create only the ones a repo actually needs — "whatever needs explanation" — but when
you create one, use these names and homes:

| Doc | Home | Answers |
|---|---|---|
| `PRODUCT.md` | root | *What* this is, *who* it's for, *why* it exists — the product / served capability |
| `ARCHITECTURE.md` | root or `docs/architecture.md` | *How* it's built — components, data flow, key decisions |
| `CONVENTIONS.md` | root or `docs/conventions.md` | Normative rules — naming, patterns, structure that differ from tool defaults |
| `DESIGN.md` | root | Visual + interaction system — tokens, components, states, accessibility (UI repos) |
| `TESTING.md` | root or `docs/testing.md` | How to test — runners, fixtures, e2e, what "done" means |
| `docs/designs/<date>-adr-<slug>.md` | `docs/designs/` | One file per decision — the *why*, the alternatives, the trade-off — listed in a generated `INDEX.md`; never one appended log |
| `docs/<topic>.md` | `docs/` | Anything narrower — `security.md`, `logging.md`, `data-model.md`, runbooks |

Rules:

- **Project structure stays in CLAUDE.md** (`## Project Structure`) — it's short and always-on;
  don't spin it out into a `PROJECT-STRUCTURE.md`.
- **Root CLAUDE.md links these docs; it does not inline them.** A `## Where to find more` section
  is enough (OMR-13.2/13.4), and each pointer carries `consult for:` triggers + retrieval timing.
- **Subfolder CLAUDE.md points at the docs relevant to *that* folder** (§2.6a) — that's how the
  right context reaches Claude one hop away without bloating the root.
- **Don't fabricate a doc to satisfy a checklist.** If it doesn't exist yet, CLAUDE.md may note
  the gap; an empty placeholder is worse than an honest "not written yet."

### 2.6a. Reference docs by project archetype

Match the doc set — and where each subfolder CLAUDE.md points — to the repo's shape:

**UI / frontend app (Next.js, Vue, React, Astro):**
- Root: `PRODUCT.md`, `DESIGN.md`; `ARCHITECTURE.md`, `CONVENTIONS.md`, `TESTING.md` (root or `docs/`).
- The UI folder (`src/components/`, `src/app/`, `src/ui/`) → its `CLAUDE.md` references
  **`DESIGN.md` + `PRODUCT.md`** so component work has the visual system and product intent
  one hop away.
- Data/domain folders → reference `docs/data-model.md` + `CONVENTIONS.md`.

**MCP server / backend service:**
- Root: `PRODUCT.md` (served capability + tool contracts); `docs/{architecture,security,logging}.md`.
- `k8s/` (deploy folder) → its `CLAUDE.md` references the deployment + runbook docs.
- `src/lib`, `src/tools` → reference `CONVENTIONS.md` + the tool-contract doc.

**Infra / GitOps / platform repo:**
- Root: `CONVENTIONS.md`; `docs/{architecture,technical-design}.md`; runbooks under `docs/`.
- Each layer folder (`terraform/`, `platform/`) → its `CLAUDE.md` references `CONVENTIONS.md`
  and the relevant runbook / architecture doc.

The rule is constant across archetypes: **the always-on root stays lean; each on-demand
subfolder CLAUDE.md carries pointers to the two or three docs someone working there needs.**
See OMR-13.5 (archetype doc-layout) in `checklists/d05-documentation.md`.

---

## 3. The `.claude/` directory

### 3.1. Recommended layout

```
.claude/
├── settings.json              # Team-shared (committed)
├── settings.local.json        # Personal (gitignored)
├── plans/                     # Plan + handover docs (committed)
├── audits/                    # Audit reports (committed)
├── rules/                     # Path-scoped rules
│   └── <topic>.md
├── skills/                    # Workflows
│   └── <verb-name>/
│       ├── SKILL.md
│       ├── references/        # Optional supporting docs
│       └── scripts/           # Optional helper scripts
├── agents/                    # Subagent definitions
│   └── <role-name>.md
├── hooks/                     # Hook scripts referenced from settings.json
│   └── <action-name>.sh
└── references/                # Shared reference material across skills
    └── <topic>/
```

### 3.2. Commit vs gitignore

| File | Status |
|---|---|
| `.claude/settings.json` | ✅ committed (team-shared) |
| `.claude/settings.local.json` | ❌ gitignored (auto-generated this way; force with `git rm --cached` if previously tracked) |
| `.claude/plans/`, `audits/`, `rules/`, `skills/`, `agents/`, `hooks/`, `references/` | ✅ committed |
| `CLAUDE.local.md` | ❌ gitignored |
| `.mcp.json` | ✅ committed (when project MCP servers exist) |

---

## 4. settings.json — the configuration spine

### 4.1. Precedence (highest → lowest)

Managed policy → CLI args → `.claude/settings.local.json` → `.claude/settings.json` → `~/.claude/settings.json`. Array fields like `permissions.allow` **merge**, not replace.

### 4.2. Permissions

Evaluation order: `deny` first → `ask` → `allow`. One match stops the chain.

**Bash patterns:**
- `Bash(pnpm test)` — exact match for `pnpm test` only
- `Bash(pnpm test *)` — prefix match with word boundary; matches `pnpm test foo` but not `pnpm tests`
- `Bash(pnpm test:*)` — colon form; matches script names like `pnpm test:watch`. **Does not match the bare command.**
- `Bash(pnpm *)` — broadest pnpm allow

**Critical gotcha:** Bash deny rules don't block other tools. To block reading `.env*`, use `Read(.env*)` in deny — `Bash(cat .env*)` only blocks the Bash tool.

**Allow philosophy: explicit, not broad.** A `Bash(gh *)` allow is convenient but covers `gh repo delete`, `gh release delete`, `gh secret remove`, and arbitrary `gh api -X DELETE` calls. Broad allows + a deny list of "the destructive ones we thought of" leave a long tail of operations that no human approved. The safer model is: enumerate the verbs you actually need, allow only those. Anything not listed asks for permission. Defenders read `settings.json` and know exactly the surface area.

**Recommended baseline:**

```json
{
  "$schema": "https://json.schemastore.org/claude-code-settings.json",
  "permissions": {
    "allow": [
      "Bash(<package-manager> dev)",
      "Bash(<package-manager> build)",
      "Bash(<package-manager> test)",
      "Bash(<package-manager> test:*)",
      "Bash(<package-manager> lint)",
      "Bash(<package-manager> lint:*)",
      "Bash(<package-manager> typecheck)",
      "Bash(<package-manager> format)",
      "Bash(<package-manager> format:*)",
      "Bash(<package-manager> codegen)",
      "Bash(<package-manager> generate)",
      "Bash(<package-manager> install)",
      "Bash(<package-manager> i)",
      "Bash(<package-manager> e2e)",

      "Bash(git status*)",
      "Bash(git diff*)",
      "Bash(git log*)",
      "Bash(git show*)",
      "Bash(git fetch*)",
      "Bash(git pull*)",
      "Bash(git branch*)",
      "Bash(git checkout*)",
      "Bash(git switch*)",
      "Bash(git add*)",
      "Bash(git commit*)",
      "Bash(git push)",
      "Bash(git push origin*)",
      "Bash(git push -u*)",
      "Bash(git push --set-upstream*)",
      "Bash(git stash*)",
      "Bash(git rebase*)",
      "Bash(git restore*)",
      "Bash(git mv*)",
      "Bash(git rm*)",
      "Bash(git ls-files*)",
      "Bash(git ls-tree*)",
      "Bash(git rev-parse*)",
      "Bash(git merge --squash*)",
      "Bash(git cherry-pick*)",

      "Bash(gh pr view*)",
      "Bash(gh pr list*)",
      "Bash(gh pr create*)",
      "Bash(gh pr edit*)",
      "Bash(gh pr comment*)",
      "Bash(gh pr checks*)",
      "Bash(gh pr diff*)",
      "Bash(gh pr status*)",
      "Bash(gh issue view*)",
      "Bash(gh issue list*)",
      "Bash(gh issue create*)",
      "Bash(gh issue edit*)",
      "Bash(gh issue comment*)",
      "Bash(gh repo view*)",
      "Bash(gh repo list*)",
      "Bash(gh release view*)",
      "Bash(gh release list*)",
      "Bash(gh workflow view*)",
      "Bash(gh workflow list*)",
      "Bash(gh run view*)",
      "Bash(gh run list*)",
      "Bash(gh run watch*)",
      "Bash(gh search*)",
      "Bash(gh auth status)",

      "Bash(rg *)",
      "Bash(jq *)",
      "Bash(find *)",
      "Bash(ls *)",
      "Bash(wc *)",
      "Bash(cat *)",
      "Bash(diff *)",
      "Bash(head *)",
      "Bash(tail *)"
    ],
    "deny": [
      "Read(.env*)",
      "Read(secrets/**)",
      "Read(**/*credentials.*)",
      "Read(**/*credential.*)",
      "Read(**/*.credentials)",
      "Read(**/*.credential)",
      "Read(**/credentials)",
      "Bash(rm -rf *)",
      "Bash(git push --force*)",
      "Bash(git push -f*)",
      "Bash(git push * --force*)",
      "Bash(git push * -f*)",
      "Bash(git push * --force-with-lease*)",
      "Bash(git reset --hard*)",
      "Bash(git clean -f*)",
      "Bash(git config --global*)",
      "Bash(gh pr merge * --admin*)",
      "Bash(gh pr merge --admin*)",
      "Bash(gh api*)",
      "Bash(<package-manager> publish*)"
    ]
  },
  "defaultMode": "acceptEdits"
}
```

Substitute `<package-manager>` based on detection (`pnpm`, `npm`, `yarn`, `uv`, etc.). The apply skill emits allow entries only for scripts that actually exist in `package.json:scripts` (see `claude-setup-apply` Step 8.3) — the `<package-manager>` commands above are illustrative, not a fixed list to paste verbatim.

`defaultMode: "acceptEdits"` is the single largest reduction in permission-prompt fatigue. Pair with the explicit allow list above; do not weaken it with broad wildcards.

**What's intentionally NOT in the allow:**

- `gh repo delete`, `gh release delete`, `gh secret remove`, `gh ruleset delete`, `gh repo edit --visibility` — any of these can do unrecoverable damage to a repo or org. Always require explicit human go-ahead.
- **All `gh api` calls** — denied entirely. The CLI's `--method` and `-X` flags don't form a reliable security boundary (mutating GraphQL via `gh api graphql`, query-string method overrides, and arbitrary endpoint reach all sit behind the same surface). If a workflow genuinely needs `gh api`, the developer can approve the specific call when it's prompted, or add a narrow allow in their `.claude/settings.local.json` for a specific endpoint.
- `git push --force`, `git reset --hard`, `git clean -f` — destroy work or rewrite shared history. The deny patterns cover the flag in any position (`git push --force`, `git push origin main --force`, `git push origin main -f`, `--force-with-lease`), so the common `push <remote> <branch> --force` form can't slip through the allow list. The explicit allows cover the safe push variants (`git push origin <branch>`, `git push -u`, etc.).
- `gh pr ready` — flipping a PR from draft to ready for review is the author's attestation that they've read their own diff, the same class of human-only act as ticking "Self reviewed PR". Left out of the allow so it always prompts — the only gate; the plugin's `pr-draft-gate.sh` hook was removed on 2026-09-07 because it kept prompting in sdlc-run repos, where PRs open ready on purpose.
- `gh pr merge --admin` — bypasses team review. Denied in any position (`gh pr merge 123 --admin` and `gh pr merge --admin 123` both blocked). Allow non-admin merges via `gh pr merge` if needed; admin-merge is a human decision.
- `<pm> publish` — registry publishes are irreversible.
- Anything not listed — gets a permission prompt. That's the point.

### 4.3. Environment variables

Safe to commit:

- `ANTHROPIC_DEFAULT_SONNET_MODEL`, `ANTHROPIC_DEFAULT_OPUS_MODEL` (if you want repo-pinned models)
- `CLAUDE_CODE_DISABLE_GIT_INSTRUCTIONS`
- API timeout settings

Never commit:

- `ANTHROPIC_API_KEY`, `ANTHROPIC_AUTH_TOKEN`
- `ANTHROPIC_BEDROCK_*`, `ANTHROPIC_VERTEX_*`

---

## 5. Hooks — the only enforcement primitive

### 5.1. Lifecycle events

| Event | Blocking? | Use case |
|---|---|---|
| `SessionStart` | No | Initialise env, load secrets |
| `UserPromptSubmit` | Yes | Block specific input patterns |
| `PreToolUse` | Yes (exit 2 = block) | Permission override, input validation |
| `PostToolUse` | No | Logging, formatting, codegen reminders |
| `PostToolUseFailure` | No | Error handling |
| `Stop` | Yes | Block bad outputs, pause for review |
| `SessionEnd` | No | Cleanup |

### 5.2. Patterns

- Hooks are external scripts in `.claude/hooks/`, referenced from `settings.json`. Bun and other Tier-A repos store them as scripts, not inline commands.
- Keep blocking hooks fast (<1s). Otherwise expect session lag.
- Avoid hook → tool → hook loops. Use narrow `matcher` regexes.
- JSON-out: `{"decision": "allow|deny|ask", "reason": "..."}`. Exit 2 = deterministic block.

### 5.3. The standard Tier-1 set

Three blockers every repo should have:

1. `block-generated-edit` — PreToolUse on `Edit|Write|MultiEdit` for any file matching the repo's generated-file patterns (`*.generated.ts`, `components.d.ts`, lockfiles, etc.)
2. `block-secret-edit` — PreToolUse on edits/writes of credentials, env files, secrets
3. `block-vendor-managed-edit` — PreToolUse for files managed by external systems (locale JSONs from Phrase, schema.graphql from a downstream API, etc.)

A fourth, optional but high-leverage:

4. `post-edit-lint` — PostToolUse on `Edit|Write` for source files; runs the project linter on the changed file. Surfaces CI failures in-loop. **`omr-dev` already ships this for ESLint and Stylelint** (`plugins/calvin-sdlc/hooks/post-edit-lint.sh`), so a repo only needs its own for other linters — RuboCop, `ruff`, `sqlfluff`, `terraform fmt`, `actionlint`. Non-blocking by contract: it exits 0 even on violations, because CI is what gates.

---

## 6. Skills, subagents, slash commands — the decision matrix

| Goal | Pick | Why |
|---|---|---|
| Always-on rule | CLAUDE.md / hook | Always loaded or always enforced |
| On-demand reference (style guide, API) | Skill | Description always loaded; body loads on invoke |
| Manual workflow with side effects (deploy) | Skill + `disable-model-invocation: true` | User-controlled timing |
| Background knowledge for Claude only | Skill + `user-invocable: false` | Auto-fires, can't be `/typed` |
| Heavy research (50+ file reads) | Subagent | Isolates context; only summary returns |
| 3+ independent tasks | Multiple subagents in parallel | Real concurrency |
| Specialised model/tools | Subagent with `tools:` and `model:` overrides | Locked-down worker |
| Block bad behaviour deterministically | Hook | Only enforced primitive |
| External API/DB | MCP server | Adds tools, not knowledge |

### 6.1. Skill file format

```yaml
---
name: <verb-name>
description: One sentence. Specific use-case keywords. This is what triggers Claude to invoke.
disable-model-invocation: false   # true = manual /name only
user-invocable: true              # false = Claude only, no slash
allowed-tools: Bash(pnpm *) Read Grep   # optional restriction
---

# Skill body
1. Step.
2. Step.
3. Step.
```

Supporting files in `references/` and `scripts/` load on demand when SKILL.md references them. Keep SKILL.md ≤500 lines.

### 6.2. Subagent file format

```yaml
---
name: <role-name>
description: When to dispatch. Be specific — descriptions are matched against the task.
tools: Read, Grep, Glob, Bash(pnpm test*)   # restrict aggressively
model: haiku | sonnet | opus
---

System prompt body. Defines role, expertise, output format.
```

Subagents inherit project CLAUDE.md but **not parent conversation history**. Their description must be self-contained. They cannot spawn other subagents.

### 6.3. Naming conventions

- Skills: **verb-named** — `add-graphql-op`, `scaffold-component`, `deploy-staging`
- Subagents: **role-named** — `code-reviewer`, `playwright-healer`, `security-auditor`
- Rules: **topic-named** — `forms.md`, `gql.md`, `i18n.md`
- Hooks: **action-named** — `block-locale-edit.sh`, `post-edit-lint.sh`

---

## 7. MCP servers

Configure in `.mcp.json` at the project root for team-shared servers. Use settings.json for user-scoped.

- Prefer `allowedTools: ["mcp__<server>__*"]` over blanket permission modes — saves ~50–80% context via tool deferral
- Pass credentials via env vars or HTTP headers; never hardcode
- MCP adds *capabilities*; hooks add *controls*; skills add *knowledge*. They compose.
- Decision: MCP for external services with structured APIs; Bash + skill for one-off CLI wrappers

---

## 8. Plans, handovers, context management

- Plan mode (Shift+Tab) is read-only for risky changes. Approve before edits touch disk.
- Plans live in **project `.claude/plans/`**, not `~/.claude/plans/` (ephemeral).
- Naming: `YYYY-MM-DDTHHMM-<type>-<topic>.md` with YAML frontmatter (`type`, `status`, `created`, `author`, `supersedes`).
- Persistent rules belong in CLAUDE.md, not the conversation. Conversation is lost across compaction; CLAUDE.md survives.
- At ~60% context, write a handover and start fresh. Pushing through degrades quality.

---

## 9. Worktrees

`claude --worktree <name>` creates an isolated checkout and branch. Useful when:

- Running two Claude sessions on the same repo concurrently (feature + bugfix)
- Testing risky changes without polluting the main worktree
- Letting subagents do parallel edits with `isolation: worktree`

Pair with `.worktreeinclude` (gitignore syntax) to copy env files and secrets into fresh worktrees.

---

## 10. Model selection

| Model | Use for |
|---|---|
| Opus | Architecture, security review, hard refactors, ambiguity. ~2× Sonnet cost. |
| Sonnet | Default for ~80% of coding tasks |
| Haiku | Cheap reads, parsing, simple research subagents |

Set per-subagent in frontmatter (`model: haiku`). Don't pay Opus for grep work.

---

## 11. Anti-patterns (do not ship)

1. CLAUDE.md essays >500 lines without an exotic build/runtime justification
2. Flat skill files (`<name>.skill.md`) — skills are directories with `SKILL.md`
3. Persona-zoo subagents (`backend_dev`, `qa`, `ux`, `cto`) — without scoped tools they don't outperform default Claude
4. Single-letter command names (`/t`, `/q`) — unmemorable, typo bait
5. Committing `.claude/settings.local.json` — leaks personal allow-lists with absolute paths
6. Restating ESLint/Prettier rules in CLAUDE.md
7. Hooks without timeout — blocks the session
8. AGENTS.md and CLAUDE.md as separate files with diverging content
9. Untracked-empty `CLAUDE.md` files in subdirectories
10. Plans / handovers in `src/**/plan.md` instead of `.claude/plans/`

---

## 12. Maintenance discipline

| Rule | Enforced by |
|---|---|
| 400-line cap on root CLAUDE.md (OMR-1.2) | CI workflow (see §12.1) |
| 100-line cap on nested CLAUDE.md (OMR-3.1) | CI workflow (see §12.1) |
| Skills are directories | Code review |
| Subagent must have isolation justification | PR description |
| Verb-named skills, role-named subagents | Code review |
| `.claude/settings.local.json` never committed | `.gitignore` + `git rm --cached` if seen |
| Generated files never edited | `block-generated-edit` hook |
| Quarterly drift audit | Calendar reminder; re-run `/calvin-sdlc:claude-setup-audit` |
| Misplaced content out of root (OMR-2.10/2.11/2.12) | CI workflow (see §12.1) — runs on PRs touching CLAUDE.md |

### 12.1. CI workflow — audit on CLAUDE.md edits

The audit's value compounds when it runs at edit time, not just on quarterly drift checks. Recommended GitHub Actions workflow:

```yaml
# .github/workflows/claude-setup-audit.yml
name: Claude Setup Audit
on:
  pull_request:
    paths:
      - 'CLAUDE.md'
      - '**/CLAUDE.md'
      - '.claude/**'
      - '.github/copilot-instructions.md'
      - 'AGENTS.md'

jobs:
  audit:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Run claude-setup-audit
        env:
          ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
        run: |
          # Headless Claude with the omr-dev plugin loaded
          claude -p "Run /calvin-sdlc:claude-setup-audit. Post the verdict + Tier-1 findings as a PR comment. Fail the workflow if the grade drops below the latest committed audit at .claude/audits/."
```

What it gives you:

- **PRs that touch CLAUDE.md get audited automatically.** A reviewer doesn't have to ask "did you check this didn't break anything?"
- **OMR-2.10 / 2.11 / 2.12 fire at edit time.** Someone adding folder-specific gotchas to root gets a PR comment suggesting Ring 1 extraction, not a quarterly drift report 3 months later.
- **Grade regression blocks the PR** (configurable — soft-warn or hard-fail). A repo at First shouldn't slide back to 2:1 without explicit acknowledgment.

What it costs:

- Each audit run takes ~30–60 seconds of Claude work via the SDK. Fine for PRs.
- Requires Claude Code SDK / headless mode in CI, with `ANTHROPIC_API_KEY` as a repo secret.

**Lighter alternative** if a full Claude-in-CI setup isn't worth it: PR template checkbox — "[ ] If you edited CLAUDE.md, ran `/calvin-sdlc:claude-setup-audit` locally and addressed Tier-1 findings."

---

## 13. Sources

See `sources.md`. Every claim cites either Anthropic docs or a verified Tier-A/B repo.
