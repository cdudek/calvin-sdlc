# CI blueprint — a pipeline that does not make the agent wait

`adopt` recommends it (step 8 of `adopt.md` "After the script") and writes it only into a repo
that has no CI of its own. Measured on one repo in one day (2026-10-31): 39 CI runs, 22 red,
about 25 minutes each; 13 of 22 PRs were docs-only yet ran the full pipeline and a preview
deploy; one code PR waited 7 hours through 7 red runs that were all E2E timeouts on a dev
server. Six rules fix that. They hold for every stack; only the commands differ, and those
are in one table: `../../e2e-test-run/references/suite-speed-and-reliability.md` section K.

| # | Rule | Where it lives |
|---|---|---|
| A1 | Each step (lint, unit, build, e2e, deploy) runs only when a changed path needs it; a docs change runs nothing and the one required status still reports success | this file, A1 |
| A2 | E2E and system tests run against the built artifact, never a dev server that compiles on demand | section K, column "Production target" |
| A3 | The slow suite is sharded over N jobs, each with its own database service | section K, column "Shard" |
| A4 | One retry; a pass on retry is reported, and a committed known-flaky list gets fixed | section K, column "Retry"; list format in section G |
| A5 | Within the `e2e` step: the full suite runs only on PRs into the default branch or `project/*`, and on milestone heads; other PRs run the touched specs | this file, A5 |
| A6 | Interior branches carry the same required status, so auto-merge waits for green | this file, A6 |

## A1 and A5 — one `changes` job sets a flag per step, `check` stays the one required status

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
      lint: ${{ steps.f.outputs.lint }}
      unit: ${{ steps.f.outputs.unit }}
      build: ${{ steps.f.outputs.build }}
      e2e: ${{ steps.f.outputs.e2e }}
      deploy: ${{ steps.f.outputs.deploy }}
      full: ${{ steps.f.outputs.full }}
    steps:
      - uses: actions/checkout@v4 # first-party; only sdlc.json is needed
        with:
          sparse-checkout: sdlc.json
          sparse-checkout-cone-mode: false
      - id: f
        env:
          GH_TOKEN: ${{ github.token }}
          GH_REPO: ${{ github.repository }}
          PR: ${{ github.event.pull_request.number }}
          BASE: ${{ github.base_ref }}
          HEAD: ${{ github.head_ref }}
          DEFAULT: ${{ github.event.repository.default_branch }}
        run: |
          set -f # keep the globs literal
          # The lists live in sdlc.json "ciPaths" (shell globs; * also crosses /). jq is on every runner.
          list() { jq -r "(.ciPaths$1 // []) | join(\" \")" sdlc.json; }
          hit() { for g in $2; do case "$1" in $g) return 0 ;; esac; done; return 1; }
          STEPS="lint unit build e2e deploy"
          DOCS=$(list .docs); ALL=$(list .all)
          for s in $STEPS; do
            eval "inc_$s=\"\$(list .$s.include)\" exc_$s=\"\$(list .$s.exclude)\""
            eval "$s=false"
          done
          everything() { for s in $STEPS; do eval "$s=true"; done; }
          if [ -z "$PR" ]; then
            everything # push to the default branch
          else
            for f in $(gh pr diff "$PR" --name-only); do # fails closed on a diff too large to list
              hit "$f" "$DOCS" && continue
              if hit "$f" "$ALL"; then everything; continue; fi
              known=false
              for s in $STEPS; do
                eval "inc=\"\$inc_$s\" exc=\"\$exc_$s\""
                # on a step when it matches the include and not the exclude
                if hit "$f" "$inc"; then known=true; hit "$f" "$exc" || eval "$s=true"; fi
              done
              # a file no include knows is code you forgot to list: run everything
              $known || everything
            done
          fi
          for s in $STEPS; do eval "echo $s=\$$s" >> "$GITHUB_OUTPUT"; done
          case "$BASE:$HEAD" in
            "$DEFAULT":*|project/*:*|*:milestone/*) echo "full=true" >> "$GITHUB_OUTPUT" ;;
            *) echo "full=false" >> "$GITHUB_OUTPUT" ;;
          esac

  lint:
    needs: changes
    if: needs.changes.outputs.lint == 'true'
    runs-on: ubuntu-latest
    steps:
      - run: echo "lint and type check; commands per stack: section K"

  unit:
    needs: changes
    if: needs.changes.outputs.unit == 'true'
    runs-on: ubuntu-latest
    steps:
      - run: echo "unit tests; commands per stack: section K"

  build:
    needs: changes
    if: needs.changes.outputs.build == 'true'
    runs-on: ubuntu-latest
    steps:
      - run: echo "the production build (section K, column Production target)"

  e2e: # one matrix leg per shard, each with its own database service; see section K
    needs: changes
    if: needs.changes.outputs.e2e == 'true'
    runs-on: ubuntu-latest
    strategy:
      fail-fast: false
      matrix:
        shard: [1, 2, 3, 4]
    env:
      FULL: ${{ needs.changes.outputs.full }}
    steps:
      - run: echo "full suite when FULL=true, else only the specs changed in the PR (A5)"

  deploy: # preview or staging: costs minutes and money
    needs: changes
    if: needs.changes.outputs.deploy == 'true'
    runs-on: ubuntu-latest
    steps:
      - run: echo "the preview or staging deploy"

  check: # the only required status
    if: always()
    needs: [changes, lint, unit, build, e2e, deploy]
    runs-on: ubuntu-latest
    steps:
      - env:
          RESULTS: ${{ join(needs.*.result, ' ') }}
        run: |
          # skipped is fine: a flag said the step was not needed. failure or cancelled is not.
          case " $RESULTS " in *" failure "*|*" cancelled "*) exit 1 ;; esac
```

- **A change that touches only docs runs nothing.** Every flag is false, every job skips and
  `check` still reports success. `ciPaths.docs` is the one list a repo edits for that: `*.md`,
  `docs/*`, `changes/*`, plans.
- **A YAML counts as docs only if nothing reads it:** no build, test, deploy or app code
  loads it. A YAML a script or the app does read is code. Always code, never in `ciPaths.docs`:
  `.github/workflows/**`, app and framework config, OpenAPI specs the code generates from,
  k8s, helm and terraform YAML, `sdlc.json`, lockfiles. A `docs/` folder that feeds the site and
  a `README.md` embedded in a package are read by the build: take them out of `ciPaths.docs`.
- **`ciPaths.all`** (lockfiles, CI workflows, `sdlc.json`) triggers every step. A file that
  matches no step's `include`, and is not in `docs` or `all`, also triggers every step, so a
  forgotten path costs minutes, never a missed check. A file that matches an `include` and the
  same step's `exclude` simply skips that step.
- **`full`** is A5 and gates only the E2E scope: true for a PR into the default branch, a PR
  into `project/*`, and a PR whose head is `milestone/*`. A feature PR into `milestone/*` is
  false: its `e2e` job (when the flag is on) runs only the specs it changed (section K,
  column "Touched tests").
- **A pass on retry** is reported in the job summary and does not fail a feature PR; on a
  full run (`FULL=true`) it does (`failOnFlakyTests` or the stack's equivalent). Section K.

### `ciPaths` in sdlc.json: the one list per repo

`sdlc.json` (not under `checks`, so a repo edits it without the lock) holds the lists. The
`changes` job above reads them with `jq`; the agents read the same lists to pick "touched
tests" (`../../e2e-test-run/references/suite-speed-and-reliability.md` section K). Shell
globs, `*` also crosses `/`.

```json
"ciPaths": {
  "docs": ["changes/*", "docs/*", "plans/*", ".claude/plans/*", "*.md"],
  "all": [".github/workflows/*", "sdlc.json", "package-lock.json", "pnpm-lock.yaml"],
  "lint": { "include": ["src/*", "app/*", "e2e/*", "test/*", "*.test.*"], "exclude": ["public/*", "*.png", "*.svg", "*/generated/*"] },
  "unit": { "include": ["src/*", "app/*", "test/*", "*.test.*"], "exclude": ["e2e/*", "*.css", "public/*"] },
  "build": { "include": ["src/*", "app/*", "public/*", "Dockerfile"], "exclude": ["e2e/*", "test/*", "*.test.*"] },
  "e2e": { "include": ["src/*", "app/*", "public/*", "e2e/*"], "exclude": ["test/*", "*.test.*"] },
  "deploy": { "include": ["src/*", "app/*", "public/*", "Dockerfile", "deploy/*"], "exclude": ["e2e/*", "test/*", "*.test.*"] }
}
```

- **A step runs** for a file that matches its `include` and not its `exclude`.
- **Defaults per stack** (TypeScript, Python, Rust, Rails, Kotlin, Scala) are in
  `templates/ci-paths.json`; `adopt` copies the stack's block into `sdlc.json` once and never
  overwrites it. Edit the folder names to the repo's own.
- **Excludes that are safe:** tests of the other kind (E2E out of unit, unit out of E2E and
  build), assets (`*.css`, images, `public/*`) out of lint and unit, generated code and the
  schema dump out of lint. **Never excluded:** migrations (`db/migrate/*`) trigger unit, e2e
  and deploy; a lockfile or workflow is `all`.

What the defaults encode:

| Stack | Changed path | Steps |
|---|---|---|
| TypeScript, JavaScript | `src/**`, `app/**`, `public/**` | lint unit build e2e deploy |
| | `*.test.*`, `__tests__/**` | lint unit |
| | `e2e/**`, `playwright.config.*` | lint e2e |
| | `Dockerfile`, `deploy/**`, `next.config.*` | build e2e deploy |
| Python | `src/**`, `app/**` | lint unit build e2e deploy |
| | `tests/**` | lint unit |
| | `e2e/**` | e2e |
| | `pyproject.toml`, `Dockerfile` | build deploy |
| Rust | `src/**`, `crates/**` | lint unit build e2e deploy |
| | `tests/**`, `benches/**` | lint unit |
| | `Cargo.toml`, `build.rs`, `Dockerfile` | build e2e deploy |
| Ruby, Rails | `app/models/**`, `app/controllers/**`, `app/services/**`, `lib/**` | lint unit build e2e deploy |
| | `app/views/**` | lint e2e |
| | `app/assets/**`, `app/javascript/**` | lint build e2e deploy |
| | `db/migrate/**`, `db/schema.rb` | unit e2e deploy |
| | `spec/**` (not `spec/system/**`) | lint unit |
| | `spec/system/**` | lint e2e |
| Kotlin | `src/main/**` | lint unit build e2e deploy |
| | `src/test/**` | lint unit |
| | `build.gradle*`, `Dockerfile`, `src/main/resources/**` | build e2e deploy |
| Scala | `src/main/**` | lint unit build e2e deploy |
| | `src/test/**` | lint unit |
| | `build.sbt`, `project/*.sbt`, `Dockerfile` | build e2e deploy |


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
