---
name: ux-review
description: Multi-lens UX review of the interface changes in one GitHub PR. Finds the product's design documents (interaction guidelines, glossary, design system, decisions) and reports any that are missing; always runs a Laws of UX pass that marks all 30 laws pass, fail or not applicable with evidence and cct:ux-conformance against whatever documents exist, and picks the other passes by the shape of the change (the ux-reviewer agent, Nielsen heuristics, WCAG 2.2, the shared lenses, responsive, e2e coverage, sitemap diff); screenshots every changed screen and control open; every pass returns JSON in one schema, and scripts merge it into one report in the shared finding format, compared with the PR's previous review round; offers to post inline PR comments. Use when the user asks for a UX review of a PR or branch.
user_invocable: true
allowed-tools: "Bash(python3 */review/scripts/*)"
metadata:
  version: 1.0.0
  author: calvindudek
---

# cct:ux-review

**Arguments:** `[pr-number | pr-url]  (defaults to the current branch's open PR)`

The same lenses and the same finding format as `cct:ux-audit`, scoped to one PR. Keep your own
commentary minimal: the deliverable is the consolidated findings.

Shared files are in `references/`, two levels up from this skill's base directory:
`lenses.md`, `laws-of-ux.md`, `checklist.md`, `writing.md`, `finding-format.md`,
`conflicts.md`, `dispatch.md`, `visual-pass.md` and `findings.schema.json`. `$F` below is this skill's
`scripts/findings.py`, which validates, merges, renders and compares the passes' JSON. Read
`docs/ux/setup.md` if the repo has one (run `cct:ux-init` later if it does not; the review still
works without it).

## Prerequisites

| Need | For | Without it |
|---|---|---|
| Python 3.10+ | Findings and visual checks | Report BLOCKED |
| Image-reading tool | Open the screenshots | Report BLOCKED for visual review |

## 1. Resolve the PR

- Arguments: a PR number or URL. Otherwise the current branch's open PR:
  `gh pr view --json number,url,title,headRefName,baseRefName`. None: stop and say so.
- `gh pr diff <n> --name-only`; keep interface files (components, screens, styles, strings,
  locales; adjust to the repo layout). None: stop, nothing to review.
- The PR's change has a spec folder (its change folder's `spec/`, or a `docs/ux/specs/` folder
  the PR or its ticket names; see the shared `references/spec-folder.md`): include
  `cct:ux-validate build <change>` and run it when `qa.md` is missing there, as the `spec` pass.
  Its findings join the merge in step 5, and the reviewers check against the spec instead of
  re-deriving the target from the diff.
- The PR adds, moves or removes a route: run `cct:ux-sitemap-create diff base:<base ref>` as the
  `sitemap` pass; its findings join the merge, including every moved address with no redirect.
- Make the run folder, outside the repo, and note the previous round of this PR first:

  ```bash
  base="${TMPDIR:-/tmp}/omr-ux/review/<owner>-<repo>-<n>"
  prev=$(ls -1d "$base"/*/ 2>/dev/null | sort | tail -n 1)
  run="$base/$(date +%Y%m%d-%H%M%S)"; mkdir -p "$run/passes"
  ```

## 2. Find the design documents

A review that never looked for the rules cannot say the change follows them. Look for each
document below, every time, before any reviewer starts. Take the path from `setup.md` when it
names one; otherwise search the usual places (`docs/ux/`, `docs/`, the repo root) and a router
file such as `INTERACTION.md` that points at them.

| Document | Usual names |
|---|---|
| Interaction guidelines | `docs/ux/interaction-guidelines.md`, `INTERACTION.md` and what it routes to |
| Glossary | `docs/ux/glossary.md`, `glossary*.md`, a glossary section in the copy catalogue |
| Design system | `DESIGN.md`, a design-system package or token file the repo depends on |
| Decisions | `<designsDir>/INDEX.md` (default `docs/designs`) and the ADRs tagged `ux` it lists; `docs/ux/decisions.md` only where the old log remains |
| Exceptions | `docs/ux/exceptions.md`, or the configured exception register |
| Product and audience | `PRODUCT.md`, `AUDIENCE.md`, `docs/ux/setup.md` |

Record each one as **found** (with its path) or **missing**, in `$run/passes/documents.json`
as dispatch.md section 5 says (`DOC-guidelines`, `DOC-glossary`, `DOC-design-system`,
`DOC-decisions`, `DOC-exceptions`, `DOC-product`). A missing document is a finding on every review until it
exists, not a reason to skip a pass: every pass still runs against what exists and lists the
checks it could not run without it under `did_not_run`. Hand the table to every reviewer.

## 3. See it running

Build the PR's head in its own worktree (the repo's worktree rules) with the test data and fakes
from `setup.md`. Screenshot every changed screen, and every changed dialog, menu, popover or
select **open**, into `$run/shots/`. Run the shared `references/visual-pass.md`: open every image
with the image-reading tool, write `$run/visual.json`, and validate each issue against the
repo's conventions. Write the retained findings to `$run/passes/visual.json`.
Never run against real user data or real devices.
If the app cannot be run, say so in the report and review from code. Without `setup.md` there
are no known-safe fakes: read the repo's e2e setup for a harness that isolates user data; if
there is none, review from code only and never launch against real data or devices.
Code-only output is BLOCKED for visual review; it cannot claim the screenshots comply.

## 4. Pick the passes, then run them in parallel

Read the shared `references/dispatch.md`. The always-run set (`documents`, `visual`, `conformance`,
`laws`) runs on every review; the matrix adds passes by the shape of the change, and a change
you are unsure about runs everything. Write `$run/passes/00-review.json` as dispatch.md section
5 says, listing every pass not picked under `did_not_run` with `not dispatched: <row>`.

Dispatch the picked passes in one message, each with the prompt shape of dispatch.md section 4:
its pass name, the PR number, the interface file list, the screenshots folder, the documents
table, `finding-format.md`, the instruction to read the diff itself with `gh pr diff <n>`, and
its output path `$run/passes/<pass>.json`. The orchestrator owns `visual`; it is not dispatched
again. Every other pass opens any image it judges and sends new images and issues back to that
ledger before merge.

- `ux-reviewer`: `cct:ux-reviewer`; the prompt MUST begin with the line `MODE: review`. If
  the agent is not available, the pass runs anyway from `lenses.md` with `degraded` set.
- `heuristics`, `accessibility`, `lenses`, `responsive`: a `general-purpose` agent each, running
  what dispatch.md section 1 names for it.
- `laws`: every check of every law in `laws-of-ux.md` on every changed screen and state, with
  the evidence behind each verdict (a screenshot, a `file:line`, a count or a timing). A failed
  check is a finding with its check id (`L12.3`) as `id`. The file must pass
  `python3 "$F" validate <file> --expect L1-L30,B1-B14`.
- `conformance`: `cct:ux-conformance <n>` with the screenshots folder and the documents table.
- `e2e-coverage`: read-only, no server. One finding per new or substantially changed surface
  that no e2e spec exercises, with `cct:e2e-write <surface>` as the recommendation. It
  never writes tests.
- `sitemap`: route changes only; `cct:ux-sitemap-create diff base:<base ref>`, its checks
  (`SM-<n>`, `RC-<n>`) written as JSON findings.

## 5. Merge by script

Do not type the report by hand. Every step below is a command; the markdown is its output.

1. Reconcile every pass's visual issues through `references/visual-pass.md`, then run
   `python3 "${CLAUDE_SKILL_DIR}/scripts/visual-check.py" "$run" --repo "$PWD"`.
   Failure means **the review did not run**: fix and rerun or report BLOCKED. Never continue
   to a clean report. Then `python3 "$F" validate "$run"/passes/*.json`. A pass whose file is
   missing or fails is re-dispatched once with the errors; if it fails again, add it to `00-review.json` under
   `did_not_run` with the reason and move its file out of `passes/`. The mandatory `visual`
   pass is never dropped: a missing or invalid findings file blocks the review.
2. `python3 "$F" merge "$run"/passes/*.json --skill cct:ux-review -o "$run/merged.json"`. It
   merges only the same id at the same location, lists every source, and never splits or drops.
3. Read the merge's `notes`. Every disagreement it lists (impact, verified, passed in one pass
   but failed in another) and every conflict between rules is settled with
   `references/conflicts.md`: correct the pass file (its `impact`, or a `conflict` line and the
   exception in `exceptions_used`), then run steps 1 and 2 again.
4. `python3 "$F" render "$run/merged.json" -o "$run/findings.md" --title "UX review: PR <n>"`,
   adding `--previous "$prev/merged.json"` when the previous round's file exists. The header then
   carries Regressed, New, Persistent, Fixed (and Not re-checked) against that round.

## 6. Report

The report is `$run/findings.md` as rendered: the method line of every pass, a degraded banner
when a pass ran without its agent, the scope, totals by impact and by verification, the
comparison with the previous round, the findings in `finding-format.md`'s shape sorted Critical
to Design choice, then Passed, Not applicable, Did not run, the exceptions relied on, and the
notes (where each found design document lives). Missing design documents are findings with a
`DOC-` id. Show it unchanged; when it is long, give the path, the totals, the comparison line and
the Critical and High findings in one line each. Zero findings: the rendered text names every
pass that looked; never shorten that to "no issues".

## 7. Offer to post (never auto-post)

Ask: "Post these N findings as inline PR comments?" Only on an explicit yes:
- read the findings from `$run/merged.json`, never from the markdown;
- a finding whose `location` is `file:line` becomes an inline comment: summary, impact, current
  experience, recommendation, decision needed;
- screen-level findings go into the review summary, grouped by screen;
- follow the repo's punctuation and voice rules;
- print the PR URL afterwards.
