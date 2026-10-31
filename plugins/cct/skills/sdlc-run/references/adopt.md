# adopt — install the chain into a repo

**Re-run it whenever the kit moves.** `adopt` copies hooks, workflows, the verify scripts
and the guardrail test into the repo, because CI runs them on a GitHub runner where no
plugin is installed. The copies are what actually enforce the rules, and they do not update
themselves. `adopt` stamps `kitTemplates` in `sdlc.json` with a fingerprint of the templates
it copied; `status.sh` compares it against the installed kit and prints `templates=stale`.
Chain step 0 reads that line, so a stale repo is refreshed before any change starts.

**The repo's formatter wins.** After writing, `adopt` runs the repo's own
`node_modules/.bin/prettier --write` over the `.ts` · `.js` · `.json` · `.yml` · `.md` files
it just wrote. The templates cannot match every repo's printWidth and quote style, and a repo
with a `prettier --check` gate rejects an unformatted file the moment you commit it. No
prettier installed, nothing happens.

    python3 ${CLAUDE_SKILL_DIR}/scripts/adopt.py [--dry-run] [--preset node|python] [--ticket KEY-123]

Run from the repo root, on a branch. Idempotent: rerun after editing `sdlc.json`, or after a
kit update. Read the three sections; relay **MANUAL** to the user.

| Generated every run (edit the source, not the file) | Created once, then kept |
|---|---|
| `.claude/hooks/*.sh` (6) | `sdlc.json` (from the preset) |
| the SDLC entries in `.claude/settings.json` | `REVIEW.md` |
| `.github/workflows/{claude-review,claude,ci-triage}.yml` (only while `claude` is not `false`) | `CLAUDE.md` section (appended once) |
| `scripts/{verify_gate,sdlc_status,design_index,marks}.py` | the "Repo-specific" tail of `docs/sdlc.md` |
| `docs/sdlc.md` above the marker | the first change folder |
| the guardrail test | `.github/ISSUE_TEMPLATE/{feature,bug,spike,simple-task}.md` + `config.yml` |
|  | `.github/PULL_REQUEST_TEMPLATE.md` |
|  | anything in `sdlc.json` `keep` |

**Merging.** The PR into the default branch runs `checks.milestone` and, unless `claude` is
`false`, the Claude review. It merges under the repo's own branch protection: arm
`gh pr merge <n> --squash --auto` and it lands on green. Interior PRs are unchanged.

The four issue templates mirror the Linear templates in `cct:linear-manage`, so an issue reads
the same whichever tracker it started in. They are kept once written — a team that adds a field to
its own bug form does not lose it on the next run. The PR template carries the requirement-to-proof
table, which is what makes `F1` traceable from `facts.md` through the test to the merge.

## Migrations it performs

- `goals/<date>-<slug>/` (the earlier layout) → `changes/archive/<date>-<KEY>-<slug>/`
  with `goal.md` folded into `plan.md › ## Done`, `goal:` → `change:`, `archived_at` added.
  Then you: check the Done section reads well.
- `.claude/plans/*` → `docs/history/plans/` (git mv). Handovers from now on live in the
  change folder.
- `docs/ux/decisions.md`, the log `cct:ux-decision` used to append to → one ADR per decision
  under `designsDir` (nested by `<year>/<year-month>/` when the folder already is), with
  `supersedes` and `superseded_by` read from its "Replaced on … by …" notes. The log becomes
  a pointer. Then `INDEX.md` is written. Then you: link every reference under MANUAL
  (`link by hand: …`) and split any round that still holds several decisions in one file.
- The retired merge-tier files (classifier script, its workflow and config, and a
  `CODEOWNERS` adopt generated, which its first line says) → removed with `git rm`; their
  keys leave `sdlc.json` and the merge sentence in the CLAUDE.md section is rewritten. Each
  removal is a WROTE line (`RETIRED_TIER_*` in `scripts/adopt.py`). A hand-written
  `CODEOWNERS` stays.

## After the script

1. Read `sdlc.json` with the user: `linear.team` / `project`, `verify`, `verifyStop`,
   `planGate`, `testGlobs`, `prototypeDirs`, `feedback`, `blocked`, `claude`, `keep`.
2. Add the tools target (`toolsCommand`) — Makefile `sdlc-tools` or package.json
   `sdlc:tools`; the commands are in `docs/sdlc.md` "Install once per machine".
3. The first change (`changes/<today>-<KEY>-adopt-sdlc/`, no key when you adopt without a
   ticket): fill intent/facts/plan from this adoption; gate the plan;
   archive it when the PR is green.
4. Run `verify` and the guardrail test. Stage everything (`git ls-files` is part of the
   test). Commit `feat(sdlc): adopt the chain`.
5. GitHub, by the user: secret `ANTHROPIC_API_KEY` (org, only while `claude` is on); a
   ruleset on the default branch (below).
6. Arm auto-merge on the adoption PR like on any other PR.
7. The CLAUDE.md section it appended states the process and `/goal`.

## Ruleset on the default branch

| Setting | Value | Why |
|---|---|---|
| `required_status_checks` | CI + `merge-gate` (`merge-gate` only while `claude` is on) | one Important review finding = red |
| `strict_required_status_checks_policy` | false | strict makes every other open PR `BEHIND` after each merge, and auto-merge never rebases |
| `required_review_thread_resolution` | false | Claude posts nits as threads; nits are advisory, Importants already block |

What replaces strict: deploy triggers on `workflow_run` after CI succeeds on the default
branch, so a PR green on a stale base never ships an image.

## A repo that already ran the old `goals/` skill

Same steps. `adopt` migrates the folders; delete the repo-local `.claude/skills/sdlc/`
(the kit skill replaces it) and list hand-tuned workflows in `keep` so they survive.

## The tracker

When `sdlc.json` names no `tracker` (and has no `linear.team`), run
`python3 ${CLAUDE_SKILL_DIR}/scripts/tracker.py detect --linear-mcp yes|no`, ask the one dialog
from `references/trackers.md` with its recommendation first, write the answer into `sdlc.json`,
and walk that tool's setup guide before the first change.

