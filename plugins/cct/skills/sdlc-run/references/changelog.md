# sdlc-run changelog

One entry per version, newest first. `adopt --upgrade` reads it: the headlines go into the
version warning, the **Mechanical** lines are what `adopt` does for you (it adds missing keys
with the stack's defaults and never overwrites a value), the **Manual** lines are printed for
the engineer. A version with no migration lines needs nothing but a re-run of `adopt`.

## 3.4.1 — the milestone close: one builder runs the local pipeline

- The goal text and stages.md give unit tests, the full E2E suite, the fix round and the gate to one `cct:builder` subagent that spawns no agents; the supervisor dispatches the reviews and the validation (a subagent cannot start its own).
- Manual: a `/goal` already running keeps its old condition; start the next one from the new `templates/goal/run.txt`.

## 3.4.0 — one milestone, one push, one PR: enforced, not described

- Mechanical: a new hook `.claude/hooks/pr-gate.sh` (PreToolUse on Bash). It refuses a PR into `project/*` or `milestone/*` from anything but a milestone branch, a push or PR of a milestone head without `VERIFY PASS milestone` on it (records-only commits after the PASS are fine), any push to `project/*` after its creation, any push to the default branch, and inside `/goal` any other PR or push. `decisions.json` `prExceptions` holds the engineer's words for a one-off exception.
- Mechanical: `verify_gate.py milestone` fails with `check=parent-sync` while `origin/<default>` (and `origin/project/<slug>` in a project) has commits the milestone lacks. Each milestone starts with a local merge of both, its row 0, never a `chore/merge-main-*` PR.
- Mechanical: the goal texts hand each milestone close to one subagent that runs the pipeline locally; the supervisor builds the next independent milestone meanwhile. Stage 6p no longer rebases or pushes `project/<slug>`; a blocking 6p finding becomes one more milestone.
- Manual: `adopt --upgrade --apply --replace .claude/hooks/pr-gate.sh`, `--replace .claude/settings.json` (registers it), `--replace scripts/verify_gate.py` and the goal texts. A run already in flight picks the hook up at once; restart Claude Code so the settings load.
- Manual: if branch protection on `project/*` requires PRs, keep it: nothing in the chain pushes there any more.

## 3.3.1 — `adopt --upgrade` never overwrites or moves anything

- Mechanical: nothing new. `--upgrade` adds missing `sdlc.json` keys, stamps `sdlcVersion` and writes no other file, moves no folder.
- Manual: every file that differs from the kit's copy is listed as `review diff`; read it with `adopt --upgrade --replace <file>` and replace it with `--apply --replace <file>`. A plain `adopt` still refreshes every kit-owned copy.

## 3.3.0 — the CI workflow ships as a template, ciPaths by file type, versioned repos

- Mechanical: `sdlc.json` gets `sdlcVersion`, `ciCommands` (per stack, from `templates/ci-commands.json`) and, inside an existing `ciPaths`, the missing `code`, `config` and `specs` (no value you set is touched).
- Mechanical: a repo with no CI gets `.github/workflows/ci.yml` from `templates/ci/github-actions.yml`.
- Manual: a repo that has its own CI copies the `changes` and `check` jobs from `templates/ci/github-actions.yml`, or replaces its `ci.yml` with the template.
- Manual: a changed file that is neither code nor config now runs nothing, so check `ciPaths.code` and `ciPaths.config` name the repo's own folders and file types; `ciPaths.docs` is now only the "never runs anything" list.

## 3.2.0 — CI step paths live in sdlc.json

- Mechanical: `sdlc.json` gets `ciPaths` (the stack's defaults, from `templates/ci-paths.json`).
- Manual: the repo's `changes` job reads `ciPaths` with `jq` instead of env strings.

## 3.1.2 — milestone work stays in the milestone PR

- Fixes, test and flaky-spec repairs, CI timeout tweaks and records are commits on `milestone/<slug>`, never their own PR. Re-run `adopt` to refresh the goal texts.

## 3.1.1 — CI blueprint gates every step on changed paths

- Manual: gate each CI job on the files a PR changes behind one aggregating `check` status (`references/ci-blueprint.md`).

## 3.1.0 — records ride along, no idle on CI, per-stack CI blueprint

- Records (plans, handovers, gate lines, validation, findings) ship in their milestone's PR; agents run only the tests they touched; `references/ci-blueprint.md` and the per-stack command table (`e2e-test-run` section K) arrive. Re-run `adopt` to refresh the goal texts.

## 3.0.0 — the milestone process

- Milestones, projects, one `/goal`, `done.json`, `lock.json`, `verify_gate.py`, `docs/designs/`.
- Manual: a change in flight from v2 finishes on its own process (`references/chain.md`, History).
