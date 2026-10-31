# calvin-sdlc

Calvin's AI-native software development lifecycle as one Claude Code plugin. Everything the SDLC runs is copied in, so the plugin works without the OMR AI Kit, superpowers, ponytail, plannotator, impeccable or the review toolkits installed.

This repo is a Claude Code marketplace with one plugin, `calvin-sdlc`, in `plugins/calvin-sdlc/`.

## Install

From GitHub (the repo is private, so `gh auth login` or a git credential for github.com must work first):

```bash
claude plugin marketplace add cdudek/calvin-sdlc
claude plugin install calvin-sdlc@calvin-sdlc
```

From a local checkout:

```bash
git clone git@github.com:cdudek/calvin-sdlc.git ~/projects/calvin-sdlc
claude plugin marketplace add ~/projects/calvin-sdlc
claude plugin install calvin-sdlc@calvin-sdlc
```

Inside a session the same works as `/plugin marketplace add cdudek/calvin-sdlc` and `/plugin install calvin-sdlc@calvin-sdlc`. Restart Claude Code afterwards so the hooks load.

Update later with `claude plugin marketplace update calvin-sdlc` and `claude plugin update calvin-sdlc@calvin-sdlc`.

### Turn off the plugins it replaces

This plugin carries copies of omr-dev, omr-ux, superpowers, ponytail, plannotator's skills, impeccable, pr-review-toolkit, code-review, feature-dev, code-simplifier, frontend-design, security-guidance, show-me, ui-ux-pro-max and the designer-skills plugins. If those stay enabled too, every skill shows up twice and hooks run twice (worktree creation, the superpowers session start, the security review). Disable the originals:

```bash
for p in omr-dev@omr-ai-kit omr-ux@omr-ai-kit superpowers@claude-plugins-official ponytail@ponytail impeccable@impeccable pr-review-toolkit@claude-plugins-official code-review@claude-plugins-official feature-dev@claude-plugins-official code-simplifier@claude-plugins-official frontend-design@claude-plugins-official security-guidance@claude-plugins-official show-me@show-me ui-ux-pro-max@ui-ux-pro-max-skill calvin@calvin-kit; do claude plugin disable "$p"; done
```

The designer-skills plugins (`design-ops`, `design-research`, `ui-design` and the rest under `@designer-skills`) are copied too; disable them the same way if they are installed.

Remove the `WorktreeCreate` and `WorktreeRemove` entries from `~/.claude/settings.json` as well, since the plugin registers the same hooks.

### Tools the skills call

The skills shell out to these. Install them once per machine:

```bash
brew install gh jq node python uv
npm install -g @openai/codex agent-browser
curl -fsSL https://plannotator.ai/install.sh | bash
```

- `gh`: pull requests, merge state, auto-merge, releases.
- `codex`: second-opinion reviews in pr-review, Codex image generation in designs-explore and ux-design. Log in with `codex login`.
- `agent-browser`: drives the browser for E2E planning, UX screenshots and responsive checks.
- `plannotator`: the plan and annotation review UI. Its hooks run on EnterPlanMode and ExitPlanMode; without the CLI those hooks just fail quietly.
- Playwright MCP comes with the plugin (`.mcp.json`).

## What is inside

- **The SDLC:** `sdlc-run` (adopt, status, intent → UX plan → facts → tech plan → one /goal build per milestone → milestone PR), with `builder`, `verifier`, `review-fix-loop`, `pr-review`, `address-feedback`, `pr-create`, `squash`, `release-cut`, E2E skills and agents, `security-review`, `codex-run`.
- **UX:** the ux suite renamed with a `ux-` prefix (`ux-init`, `ux-audit`, `ux-design`, `ux-validate`, `ux-review`, `ux-conformance`, `ux-guidelines`, `ux-decision`, `ux-sitemap-create`, `ux-run`) plus `ux-laws-apply`, `designs-explore`, `variants-create`, `design-consult`, `design-system-apply`, `microcopy-write`, `accessibility-audit`, `responsive-audit`, impeccable, ui-ux-pro-max, `ux-patterns`, `ux-heuristics` and the designer-skills library.
- **Engineering habits:** superpowers (brainstorming, writing-plans, TDD, systematic debugging, verification before completion, worktrees) and ponytail (smallest complete change, review, audit).
- **New projects:** `project-kickoff` writes the context, brand guide and design system before the first line of app code.
- **Docs:** `docs/stack.md` (the stack), `docs/working-rules.md` (how Calvin works with agents), `docs/skill-map.md` (where every skill came from), `docs/omr-dev-guide.md`.
- **Blueprint:** `blueprint/` holds the Dockerfile, GitHub Actions, deploy docs and release config from the HeyDiff repos, for Next.js on Cloud Run, Electron, WXT and a HeroUI design-system kit.
- **Examples:** `examples/heydiff/` holds a real context repo, brand guide exports, UX docs and the brand guide PDF to copy the shape from.

Every skill is called as `calvin-sdlc:<name>`, for example `/calvin-sdlc:sdlc-run` or `/calvin-sdlc:ux-review`.

## Rebuild from the sources

`scripts/build.py` regenerates `plugins/calvin-sdlc/` from the installed plugins, the OMR AI Kit checkout and the HeyDiff repos, then lays `overlay/` (the hand-written files) on top. Edit hand-written files in `overlay/`, never in `plugins/calvin-sdlc/`.

```bash
python3 scripts/build.py
```

Licences of the copied public plugins are kept in `plugins/calvin-sdlc/licenses/`.
