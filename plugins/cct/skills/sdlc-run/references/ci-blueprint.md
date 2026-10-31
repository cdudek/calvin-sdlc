# CI blueprint — a pipeline that does not make the agent wait

`adopt` recommends it (step 8 of `adopt.md` "After the script") and writes it only into a repo
that has no CI of its own. Measured on one repo in one day (2026-10-31): 39 CI runs, 22 red,
about 25 minutes each; 13 of 22 PRs were docs-only yet ran the full pipeline and a preview
deploy; one code PR waited 7 hours through 7 red runs that were all E2E timeouts on a dev
server. Six rules fix that. They hold for every stack; only the commands differ, and those
are in one table: `../../e2e-test-run/references/suite-speed-and-reliability.md` section K.

| # | Rule | Where it lives |
|---|---|---|
| A1 | A docs-only PR skips build, tests and preview deploys; the one required status still reports success | this file, A1 |
| A2 | E2E and system tests run against the built artifact, never a dev server that compiles on demand | section K, column "Production target" |
| A3 | The slow suite is sharded over N jobs, each with its own database service | section K, column "Shard" |
| A4 | One retry; a pass on retry is reported, and a committed known-flaky list gets fixed | section K, column "Retry"; list format in section G |
| A5 | The full E2E suite runs only on PRs into the default branch or `project/*`, and on milestone heads | this file, A5 |
| A6 | Interior branches carry the same required status, so auto-merge waits for green | this file, A6 |

## A1 and A5 — one path check, one aggregating `check` job

Branch protection requires exactly one status, `check`. Every other job hangs off it. Do not
use workflow-level `paths-ignore`: a workflow that never starts leaves the required status
pending forever and the PR unmergeable. A job-level condition plus an aggregating job always
reports. No third-party action: `gh` is on every runner.

```yaml
on:
  pull_request:
  push:
    branches: [main] # the default branch

jobs:
  changes:
    runs-on: ubuntu-latest
    outputs:
      code: ${{ steps.f.outputs.code }}
      full: ${{ steps.f.outputs.full }}
    steps:
      - id: f
        env:
          GH_TOKEN: ${{ github.token }}
          GH_REPO: ${{ github.repository }}
          PR: ${{ github.event.pull_request.number }}
          BASE: ${{ github.base_ref }}
          HEAD: ${{ github.head_ref }}
          DEFAULT: ${{ github.event.repository.default_branch }}
        run: |
          if [ -z "$PR" ]; then
            echo "code=true" >> "$GITHUB_OUTPUT"; echo "full=true" >> "$GITHUB_OUTPUT"; exit 0
          fi
          files=$(gh pr diff "$PR" --name-only)  # fails closed on a diff too large to list
          if printf '%s\n' "$files" | grep -qvE '^(changes/|docs/|plans/|\.claude/plans/)|\.md$'; then
            echo "code=true" >> "$GITHUB_OUTPUT"
          else
            echo "code=false" >> "$GITHUB_OUTPUT"
          fi
          case "$BASE:$HEAD" in
            "$DEFAULT":*|project/*:*|*:milestone/*) echo "full=true" >> "$GITHUB_OUTPUT" ;;
            *) echo "full=false" >> "$GITHUB_OUTPUT" ;;
          esac

  lint-types-unit: # build, lint, type check, unit tests: commands per stack in your own repo
    needs: changes
    if: needs.changes.outputs.code == 'true'
    runs-on: ubuntu-latest
    steps:
      - run: echo "the stack's lint, type and unit commands"

  e2e: # one matrix leg per shard, each with its own database service; see section K
    needs: changes
    if: needs.changes.outputs.code == 'true'
    runs-on: ubuntu-latest
    strategy:
      fail-fast: false
      matrix:
        shard: [1, 2, 3, 4]
    env:
      FULL: ${{ needs.changes.outputs.full }}
    steps:
      - run: echo "full suite when FULL=true, else only the specs changed in the PR"

  preview: # deploys cost minutes and money; docs-only PRs get none
    needs: changes
    if: needs.changes.outputs.code == 'true'
    runs-on: ubuntu-latest
    steps:
      - run: echo "the preview deploy"

  check: # the only required status
    if: always()
    needs: [changes, lint-types-unit, e2e, preview]
    runs-on: ubuntu-latest
    steps:
      - env:
          CODE: ${{ needs.changes.outputs.code }}
          CHANGES: ${{ needs.changes.result }}
          RESULTS: ${{ join(needs.*.result, ' ') }}
        run: |
          [ "$CHANGES" = success ] || exit 1
          [ "$CODE" = true ] || exit 0 # docs-only: the skipped jobs are the point
          for r in $RESULTS; do [ "$r" = success ] || exit 1; done
```

- **What counts as docs-only** is the `grep` pattern: `changes/`, `docs/`, plans and any
  `*.md`. A repo adds its own non-code folders there; a file the build reads (a `docs/` folder
  that feeds the site, `README.md` embedded in a package) stays out of the pattern.
- **`full`** is true for a PR into the default branch, a PR into `project/*`, and a PR whose
  head is `milestone/*`. A feature PR into `milestone/*` is false: it gets lint, types, unit
  tests and only the specs it changed (section K, column "Touched tests").
- **A pass on retry** is reported in the job summary and does not fail a feature PR; on a
  full run (`FULL=true`) it does (`failOnFlakyTests` or the stack's equivalent). Section K.

## A6 — interior branches wear the same required status

Auto-merge waits only for the checks that protect the base branch. A feature PR into
`milestone/*` or a milestone PR into `project/*` with no protected base would merge the moment
it is armed, red or not. One ruleset covers them:

```bash
gh api repos/OWNER/REPO/rulesets -X POST --input - <<'JSON'
{
  "name": "interior-branches",
  "target": "branch",
  "enforcement": "active",
  "conditions": { "ref_name": { "include": ["refs/heads/project/*", "refs/heads/milestone/*"], "exclude": [] } },
  "bypass_actors": [{ "actor_id": 5, "actor_type": "RepositoryRole", "bypass_mode": "always" }],
  "rules": [{ "type": "required_status_checks", "parameters": { "strict_required_status_checks_policy": false, "required_status_checks": [{ "context": "check" }] } }]
}
JSON
```

- OWNER/REPO is the repository. Repo setting "Allow auto-merge" must be on.
- No `non_fast_forward` rule: the SDLC rebases `milestone/*` and `project/*` and pushes with
  lease. A required status also blocks that push, so the bypass (actor 5 is the admin role)
  must cover whoever pushes. Without a bypass, protect only `project/*`.
- `delivery: "one-go"` pushes features straight to `milestone/<slug>` and opens one PR from
  it, so nothing merges into it: protect `project/*` only. `delivery: "feature-prs"` protects both.
