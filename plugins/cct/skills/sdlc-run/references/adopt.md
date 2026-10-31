# adopt — install the chain into a repo

**Re-run it whenever the kit moves.** `adopt` copies hooks, workflows, the tiers classifier
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

    python3 ${CLAUDE_SKILL_DIR}/scripts/adopt.py [--dry-run] [--preset node|python] [--ticket KEY-123] --tiers yes|no

**Ask first, every time.** Before each run, on the first adopt and on every upgrade, ask the
engineer in one `AskUserQuestion`: "Use Ship/Show/Ask merge tiers in this repo?" Say what
`sdlc.json` `tiers` is now, if it is set. Options, the kit default first and marked
(Recommended): "Yes" (a code owner approves risky PRs before merge, the co-owner sees the rest
after) and "No" (every PR auto-merges on green; right for a repo with one owner). Pass the
answer as `--tiers yes|no`; adopt writes it to `sdlc.json` and adds or removes the tier files.
The kit default is `TIERS_DEFAULT` in `scripts/adopt.py`; it is also what a missing key means.

Run from the repo root, on a branch. Idempotent: rerun after editing `sdlc.json` or
`tiers.json`, or after a kit update. Read the three sections; relay **MANUAL** to the user.

| Generated every run (edit the source, not the file) | Created once, then kept |
|---|---|
| `.claude/hooks/*.sh` (6) | `sdlc.json` (from the preset) |
| the SDLC entries in `.claude/settings.json` | `.github/tiers.json` (preset defaults; only while `tiers` is not `false`) |
| `.github/CODEOWNERS` (from `codeowners` × `ask`; removed when nobody is named or `tiers` is `false`) | `REVIEW.md` |
| `.github/workflows/{ship-show-ask,claude-review,claude,ci-triage}.yml` (the first only while `tiers` is not `false`, the last three only while `claude` is not `false`) | `CLAUDE.md` section (appended once) |
| `scripts/ship_show_ask.py` (only while `tiers` is not `false`) | the "Repo-specific" tail of `docs/sdlc.md` |
| `docs/sdlc.md` above the marker | the first change folder |
| the guardrail test | `.github/ISSUE_TEMPLATE/{feature,bug,spike,simple-task}.md` + `config.yml` |
|  | `.github/PULL_REQUEST_TEMPLATE.md` |
|  | anything in `sdlc.json` `keep` |

**One owner? Answer "No" (`tiers: false`).** Ship/Show/Ask needs a second person to
ask and to show. With one owner, `adopt` writes none of the four tier files and removes any
that exist (`git rm`). `docs/sdlc.md` then says "auto-merge on green" instead of the tiers,
and MANUAL drops the App secrets, `SDLC_COOWNER`, the Slack token and the CODEOWNERS ruleset
note. You arm `gh pr merge <n> --squash --auto` on each PR yourself. `claude` is a separate
switch: `tiers: false` keeps the Claude review.

The four issue templates mirror the Linear templates in `omr-dev:linear-manage`, so an issue reads
the same whichever tracker it started in. They are kept once written — a team that adds a field to
its own bug form does not lose it on the next run. The PR template carries the requirement-to-proof
table, which is what makes `F1` traceable from `facts.md` through the test to the merge.

## Migrations it performs

- `goals/<date>-<slug>/` (the earlier layout) → `changes/archive/<date>-<KEY>-<slug>/`
  with `goal.md` folded into `plan.md › ## Done`, `goal:` → `change:`, `archived_at` added.
  Then you: check the Done section reads well.
- `.claude/plans/*` → `docs/history/plans/` (git mv). Handovers from now on live in the
  change folder.
- `docs/ux/decisions.md`, the log `omr-ux:decision` used to append to → one ADR per decision
  under `designsDir` (nested by `<year>/<year-month>/` when the folder already is), with
  `supersedes` and `superseded_by` read from its "Replaced on … by …" notes. The log becomes
  a pointer. Then `INDEX.md` is written. Then you: link every reference under MANUAL
  (`link by hand: …`) and split any round that still holds several decisions in one file.

## After the script

1. Read `sdlc.json` with the user: `linear.team` / `project`, `verify`, `verifyStop`,
   `planGate`, `testGlobs`, `prototypeDirs`, `feedback`, `blocked`, `codeowners`, `tiers`,
   `claude`, `keep`. Read `.github/tiers.json` (skip it with
   `tiers: false`): the `ask` globs must name what really hurts here (migrations, integrations that write, cluster, workflows, deps, the rules).
2. Add the tools target (`toolsCommand`) — Makefile `sdlc-tools` or package.json
   `sdlc:tools`; the commands are in `docs/sdlc.md` "Install once per machine".
3. The first change (`changes/<today>-<KEY>-adopt-sdlc/`, no key when you adopt without a
   ticket): fill intent/facts/plan from this adoption; gate the plan;
   archive it when the PR is green.
4. Run `verify` and the guardrail test. Stage everything (`git ls-files` is part of the
   test). Commit `feat(sdlc): adopt the chain`.
5. GitHub, by the user: secrets `ANTHROPIC_API_KEY` (org), `CODE_MANAGER_APP_CLIENT_ID`,
   `CODE_MANAGER_APP_PRIVATE_KEY`; variable `SDLC_COOWNER`; optional
   `SDLC_SLACK_BOT_TOKEN`; ruleset on the default branch per `references/tiers.md`. With
   `tiers: false` only `ANTHROPIC_API_KEY` and the ruleset's required checks.
6. The adoption PR is `ask` (`.github/**`, `.claude/**`): a human merges it. With
   `tiers: false`, arm auto-merge on it like on any other PR.
7. The CLAUDE.md section it appended states the process and `/goal`; if the repo's
   CLAUDE.md said "ask before merging", change it to "the tier decides".
8. **CI.** `adopt` never edits the repo's own `ci.yml`. Compare it with `references/ci-blueprint.md`
   and recommend each gap to the engineer: every step gated on the PR's changed paths (docs run nothing) behind one `check` status,
   E2E against the built artifact, sharded, one retry, full E2E only where A5 says, and a
   ruleset that gives `project/*` (and `milestone/*` with `delivery: "feature-prs"`) the same
   required `check`. A repo with no CI gets the blueprint written. Only the `node` and
   `python` presets exist; for Ruby, Rails, Rust, Kotlin or Scala pick the nearest preset and
   replace `checks.*` and `tests` with the row from
   `../e2e-test-run/references/suite-speed-and-reliability.md` section K.

## A repo that already ran the old `goals/` skill

Same steps. `adopt` migrates the folders; delete the repo-local `.claude/skills/sdlc/`
(the kit skill replaces it) and list hand-tuned workflows in `keep` so they survive.

## The tracker

When `sdlc.json` names no `tracker` (and has no `linear.team`), run
`python3 ${CLAUDE_SKILL_DIR}/scripts/tracker.py detect --linear-mcp yes|no`, ask the one dialog
from `references/trackers.md` with its recommendation first, write the answer into `sdlc.json`,
and walk that tool's setup guide before the first change.

