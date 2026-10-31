---
name: claude-setup-audit
description: Use when auditing a code repository for Claude Code architecture quality. Produces an Oxford-class graded report (First / 2:1 / 2:2 / Third / Fail) covering CLAUDE.md, settings.json, hooks, skills, subagents, MCP, and discoverability. Comparable across repos and over time.
allowed-tools: Read, Grep, Glob, WebFetch, Bash(git *), Bash(find *), Bash(wc *), Bash(ls *), Bash(file *), Bash(stat *), Bash(jq *), Bash(diff *), Bash(md5 *), Bash(md5sum *)
user_invocable: true
---

# claude-setup-audit

Audits a code repository against the canonical six-rings Claude Code architecture and produces a graded report. The report is **comparable** across repos and over time — every audit uses the same template, same rubric, same metrics.

The rubric is calibrated for genuine excellence. First-Class signals truly exceptional work — achievable, but uncommon on a first audit. The lower distinctions (2:1, 2:2, Third) aren't failures: they're precise statements of where the setup stands and what specific changes would elevate it. The aim is honest, comparable feedback that holds work to the standard the practice deserves.

## When to use

- After cloning a new repo, to know what you're working with.
- Before a major Claude-Code refactor, to establish a baseline.
- After a refactor, to verify it landed.
- Quarterly, as a drift check.
- When considering whether to invest in Claude Code tooling for a repo.

## Output

A markdown report at `.claude/audits/YYYY-MM-DDTHHMM-audit-<repo>.md` following the exact template in `references/claude-setup/audit-template.md`.

## Workflow

### Step 0 — Verify checklist freshness against Anthropic docs

Skip with `--skip-freshness` for fast repeated runs.

1. `WebFetch` `https://code.claude.com/docs/en/best-practices` with the prompt: "Extract the section on writing an effective CLAUDE.md. List every section name, formatting rule, and explicit example Anthropic recommends. Note anything that has changed in tone, scope, or strictness."
2. Compare the fetched summary against `references/claude-setup/checklists/d01-foundation.md` line by line. **Scope: Required and Recommended CHECK-NN rules only.** Optional checks and OMR-* rules are explicit local additions documented as "not in the source doc" — exclude them from the freshness comparison, or they produce false drift findings on every run.
   - Confirm each Required/Recommended `CHECK-NN` still maps to a current Anthropic recommendation.
   - Flag any **new** Anthropic recommendation that has no matching `CHECK-NN`.
   - Flag any local `CHECK-NN` that Anthropic no longer mentions or has weakened.
3. Outcomes:
   - **No drift** → continue silently to Step 1.
   - **Drift detected** → prepend a `## Skill Freshness` section to the audit report listing the diff and the action: "Update `d01-foundation.md` to reflect the new guidance, then bump `last_anthropic_verification` date in the file's frontmatter."
   - **WebFetch fails** (no network, page moved, parse error) → prepend `## Skill Freshness` with: "Could not verify freshness against `<URL>` — using cached rubric. Re-run later." Continue the audit; do not abort.

The freshness section is about the **skill itself**, not the audited repo. Skip with `--skip-freshness` flag.

### Step 1 — Read the references

Always read these in order before auditing:

1. `references/claude-setup/checklists.md` — index of all dimension checklists
2. `references/claude-setup/checklists/d01-foundation.md` — D1 (Anthropic CHECK-01..15 + OMR-1.x, 2.x, 3.x)
3. `references/claude-setup/checklists/d02-configuration.md` — D2 (OMR-4.x, 5.x)
4. `references/claude-setup/checklists/d03-enforcement.md` — D3 (OMR-6.x)
5. `references/claude-setup/checklists/d04-modularity.md` — D4 (OMR-7.x..10.x, MCP, frontend plugins)
6. `references/claude-setup/checklists/d05-documentation.md` — D5 (OMR-11.x..14.x)
7. `references/claude-setup/grading-rubric.md` — scoring system, hard caps, Oxford aggregate
8. `references/claude-setup/audit-template.md` — output format
9. `references/claude-setup/architecture-guide.md` — context for borderline calls

Do not audit from memory. The rubric evolves; read it fresh each time.

**Effective content rule** (applies to all D1 content checks): match against the union of root `CLAUDE.md` + `@`-imports (depth 1) + plain markdown links to `.md` files (depth 1). Prevents false-Required fails on lean link-out architectures. Full definition in `d01-foundation.md` top section.

### Step 2 — Inventory

Run, in this order:

```bash
# Repo identity
git rev-parse HEAD
git branch --show-current
basename "$(git rev-parse --show-toplevel)"

# Top-level AI-context files (Claude + cross-vendor)
ls -la CLAUDE.md AGENTS.md agents.md GEMINI.md .cursorrules .windsurfrules CLAUDE.local.md 2>/dev/null
ls -la .github/copilot-instructions.md 2>/dev/null
ls -la .cursor/rules/*.mdc 2>/dev/null
file CLAUDE.md AGENTS.md agents.md GEMINI.md .cursorrules .windsurfrules .github/copilot-instructions.md 2>/dev/null
readlink CLAUDE.md AGENTS.md agents.md GEMINI.md .cursorrules .windsurfrules .github/copilot-instructions.md 2>/dev/null
md5 -q CLAUDE.md AGENTS.md agents.md GEMINI.md .cursorrules .windsurfrules .github/copilot-instructions.md 2>/dev/null  # md5sum on Linux

# All CLAUDE.md files
find . -name "CLAUDE.md" -not -path "./node_modules/*" -not -path "./.git/*" -exec wc -l {} +

# .claude/ contents
find .claude -type f 2>/dev/null
ls -la .claude/settings*.json 2>/dev/null

# Settings tracked status
git ls-files .claude/settings.local.json 2>/dev/null

# .gitignore content
grep -E "settings\.local\.json|CLAUDE\.local\.md|\.claude/" .gitignore 2>/dev/null

# Skills layout
find .claude/skills -name "SKILL.md" 2>/dev/null
find .claude/skills -name "*.skill.md" 2>/dev/null   # anti-pattern check

# Subagents
find .claude/agents -name "*.md" 2>/dev/null

# Hooks
find .claude/hooks -type f 2>/dev/null
ls -la .claude/hooks/*.sh 2>/dev/null

# Misplaced plans
find . -name "plan.md" -not -path "*/node_modules/*" -not -path "*/.git/*" -not -path "*/.claude/*"

# docs/ folder
ls -la docs/ 2>/dev/null

# MCP
ls -la .mcp.json 2>/dev/null
```

Record everything. Do not summarise inventory yet — just collect.

### Step 3 — Score each dimension

For each of D1–D5 in `grading-rubric.md`:

1. Score the dimension 0–20 against its criteria.
2. Cite **file:line** evidence for every deduction.
3. Note any hard-cap rules triggered.

Per-dimension checks:

#### D1. Foundation (CLAUDE.md)

##### D1.0 — Build the effective content set (run before any D1 content check)

Skip with `--no-effective-content` if you only want to grade the root file in isolation (debug mode; produces false-Required fails on lean link-out repos).

Construct the **effective content** that D1's content checks (R2.1–R2.7) operate on. This is the union of:

1. **Root `CLAUDE.md`** itself — full text.
2. **Files referenced via `@<path>` import syntax**, depth 1 (no recursion into imported files' own imports). Match the pattern `^@(\S+)$` on its own line, or inline `@<path>` references inside section bodies. Resolve `<path>` relative to the repo root.
3. **Plain markdown links** `[text](<path>)` where `<path>` ends in `.md` and resolves to a file inside the repo, depth 1. URL/external links and missing files are silently skipped.

```bash
# Cite, in evidence, which files were merged into the effective content set:
echo "Root: CLAUDE.md ($(wc -l < CLAUDE.md) lines)"
echo "@-imports (depth 1):"
grep -oE '@[A-Za-z0-9_./-]+\.md' CLAUDE.md | sort -u | while read p; do path="${p#@}"; [ -f "$path" ] && echo "  $path ($(wc -l < "$path") lines)"; done
echo "Markdown links to .md (depth 1):"
grep -oE '\]\(([^)]+\.md)\)' CLAUDE.md | sed -E 's/\]\(([^)]+)\)/\1/' | sort -u | while read p; do [ -f "$p" ] && echo "  $p ($(wc -l < "$p") lines)"; done
```

When a R2.x content check fails on the root file, **re-check against the effective content set** before recording the failure. A check passes if the corresponding section/content appears anywhere in the effective set; only fails if absent from all included files.

This prevents false-Required fails on lean link-out architectures (e.g. a 100-line root that points at `@docs/development.md` for top commands). **CHECK-02 (root size) and CHECK-15 (file count) remain root-only** — they grade the root file in isolation, since the whole purpose of effective content is to encourage the move-to-link-out pattern.

##### D1.1 — Apply content checks against effective content

- Read root `CLAUDE.md` if it exists. Count lines (root only — for CHECK-02).
- Build effective content set per D1.0 above.
- Check for the seven content rules (R2.1–R2.7) — **structural presence** (does the section exist anywhere in effective content?).
- For each nested `CLAUDE.md`, count lines, check for content duplication against root.
- For each detected vendor file (`AGENTS.md`, `agents.md`, `.cursorrules`, `.github/copilot-instructions.md`, `GEMINI.md`, `.windsurfrules`), check relationship with `CLAUDE.md` (symlink? `@CLAUDE.md` redirect? identical md5? diverging content?). Diverging vendor files are a Tier-1 finding — they cause silent guidance drift across tools.
- If any vendor file or stub CLAUDE.md is detected, the recommended next skill is **`claude-setup-apply`** (which archives them to `.ai-legacy/` and generates a fresh CLAUDE.md). The audit does not grade content match against repo signals — that's init's regeneration job.
- If `.cursor/rules/*.mdc` exist, flag them for init's archive step; audit doesn't grade them on the rubric.

#### D2. Configuration (settings.json + hygiene)

- Read `.claude/settings.json` if it exists. Validate JSON structure.
- Check `defaultMode`, `permissions.allow`, `permissions.deny`, `$schema`.
- Grep for personal absolute paths (`/Users/`, `/home/`, `C:\\Users\\`).
- Check `.gitignore` for `settings.local.json` and `CLAUDE.local.md`.
- Check tracked status: `git ls-files .claude/settings.local.json`.
- Search committed files for credential-shaped strings (`API_KEY`, `SECRET`, `TOKEN`, common AWS/GCP key patterns) — flag immediately.

#### D3. Enforcement (hooks)

- List `.claude/hooks/*` and read `settings.json` `hooks` block.
- Map declared hooks to repo properties: does the repo have generated files? secrets? vendor-managed files? For each, is a Tier-1 blocker present?
- Check `chmod +x` on hook scripts.
- Check lint-on-edit coverage: `omr-dev`'s plugin-level `post-edit-lint` hook already runs ESLint/Stylelint in every repo, so flag only linters it does not run (RuboCop, `ruff`, `sqlfluff`, `terraform fmt`, `actionlint`) that have no repo-local hook — and flag a repo-local hook that merely re-runs ESLint/Stylelint as a duplicate.

#### D4. Modularity (skills, subagents, rules)

- For each skill: directory shape (must be `<name>/SKILL.md`, never flat). Frontmatter (`name`, `description`). Verb-named?
- For each subagent: frontmatter, persona-zoo check (`backend_dev`, `cto`, `qa`, `ux`, etc. without scoped tools).
- For each `.claude/rules/*.md`: `paths:` frontmatter present where appropriate.

#### D5. Documentation and discoverability

- Does `docs/` exist? Stale files?
- Does root CLAUDE.md have a "Where to find more" pointer section?
- Does `.claude/audits/` exist? Previous audits to compare against?
- Does `.claude/plans/` exist? Misplaced plans elsewhere?

### Step 4 — Apply hard-cap rules

Walk every hard-cap condition in `grading-rubric.md`. If any trigger, cap the overall grade accordingly. Hard caps override the dimension-sum grade.

### Step 5 — Write the report

Use the **exact** template in `audit-template.md`. Fill every section:

- Frontmatter (with current commit SHA)
- Verdict (one paragraph, in the auditor's voice — direct, no hedging)
- Score by dimension table
- Hard-cap rules table (passed and failed)
- Failed rules grouped by section, with file:line evidence
- Strengths (3–7 specific bullets, no padding)
- Remediation plan ordered by leverage (Tier 1/2/3)
- **Recommended next action** — one of:
  - `claude-setup-apply` if anything below First-Class. The skill detects state and dispatches: bootstrap (greenfield), archive-then-regenerate (vendor files / stub CLAUDE.md / Cursor multi-file rules), or apply Tier-1/2 fixes from this Remediation plan (substantive CLAUDE.md with drift). Idempotent — safe to re-run.
  - **No action needed** if grade ≥ First and no vendor files detected. Re-audit quarterly to catch drift.
- Comparability metrics
- Comparison to previous audit if `.claude/audits/` has any
- Auditor's note (one paragraph, honest, strict)

Save to `.claude/audits/YYYY-MM-DDTHHMM-audit-<repo>.md`.

### Step 6 — Output the verdict to chat

Print a brief summary to the user: grade, score, count of failed rules, top three Tier-1 remediations, path to the full report. Do not paste the full report into chat — point to the file.

## Strictness rules

1. **No grade inflation.** A 78 is 2:1, period. The auditor does not write "essentially a First" for a 78.
2. **Every deduction needs file:line evidence.** No hand-wavy criticism.
3. **The auditor's voice is direct, not encouraging.** State the verdict plainly. The rubric is calibrated for excellence; the report should reflect that calibration, not soften it.
4. **Strengths section is short.** Three to seven bullets. If strengths fill a page, the auditor is hedging.
5. **No "considering it could be"** — only what is.
6. **No "for a starter repo this is decent"** — repos are graded on absolute scale, not effort.

## Engineering Principles — recognising violations

OMR-2.13 (in `d01-foundation.md`) checks that the four Karpathy principles ship in every CLAUDE.md. This section is the audit's *operational* companion: when you find a violation in a repo (in commits, PRs, or the CLAUDE.md content itself) and need to write remediation prose, name the violation concretely instead of citing the rule number. Concrete diffs argue better than abstract principles.

> Good code is code that solves today's problem simply, not tomorrow's problem prematurely.
>
> *— from `forrestchang/andrej-karpathy-skills/EXAMPLES.md` (MIT), the source repo for this material*

### Anti-patterns table

| Principle | Anti-pattern | Fix |
|---|---|---|
| Think Before Coding | Silently picks an interpretation; assumes file format, fields, or scope | List assumptions explicitly; ask when ambiguous |
| Simplicity First | Strategy pattern for a single use-case; configuration knobs nobody asked for | One function until complexity is actually needed |
| Surgical Changes | Reformats quotes / adds type hints / rewrites docstrings while fixing an unrelated bug | Only change lines that fix the reported issue |
| Goal-Driven Execution | "I'll review and improve the code" with no verification step | "Write a test for bug X → make it pass → verify no regressions" |

### Worked examples (one per principle)

**1. Think Before Coding — "Make the search faster."**

Wrong: ships 200 lines of caching + indexes + async, picking one interpretation. Right: surfaces three interpretations (latency, throughput, perceived speed) and asks which one matters. The cost of asking is one round-trip; the cost of guessing is rewriting 200 lines.

**2. Simplicity First — "Add a function to calculate discount."**

Wrong: `DiscountStrategy` (ABC) + `PercentageDiscount` + `FixedDiscount` + `DiscountConfig` + `DiscountCalculator` — ~50 lines for a one-liner. Right: `def calculate_discount(amount, percent): return amount * (percent / 100)`. When a second discount type actually appears, refactor *then*, not now.

**3. Surgical Changes — "Fix the bug where empty emails crash the validator."**

Wrong diff: fixes the bug *and* tightens email regex, *and* adds username length rules, *and* rewrites docstring style. Right diff: only the empty-email path. Test for every changed hunk: "does this trace to 'empty emails crash the validator'?" If not, it belongs in a separate PR.

**4. Goal-Driven Execution — "The sorting breaks when there are duplicate scores."**

Wrong: changes the sort key without first reproducing the bug. Right: write a failing test that reproduces the non-determinism (`assert [r['name'] for r in result[:2]] == ['Alice', 'Bob']`), then change the sort key to break ties on name, then re-run the test 10× to confirm consistency. Karpathy: *"LLMs are exceptionally good at looping until they meet specific goals. Don't tell it what to do — give it success criteria and watch it go."*

### How to use this in the audit report

When OMR-2.13 fails, or when a Tier-1/2 finding involves a behavioural pattern (drive-by refactor in a recent commit, over-abstracted module, missing test for a fix), write the remediation prose in concrete terms naming the violation, not the principle number. The reader reaches for the diff that demonstrates the pattern, not the rule that names it.

## What this skill does NOT do

- It does not fix anything. The audit recommends `claude-setup-apply` (when vendor files / stub / greenfield) or `claude-setup-apply` (when CLAUDE.md is substantive and the grade is below First).
- It does not initialise from scratch. Use `claude-setup-apply`.
- It does not grade content quality of the docs themselves (e.g. is the architecture overview good prose?). It grades structure, presence, and adherence to the rubric.

## Existing skills it subsumes

- `claude-md-management:claude-md-improver` — covers only D1 (CLAUDE.md). This audit covers all five dimensions.
- `claude-code-setup:claude-automation-recommender` — covers only D3 (hooks). This audit grades D3 holistically.

If those skills exist in the user's environment, this audit may invoke them as sub-helpers for their narrower scopes, but always produces a unified graded report.
