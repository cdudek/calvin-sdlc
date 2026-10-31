---
name: ux-validate
description: 'Decide whether a design spec is ready (three independent reviewers: Nielsen heuristics, every Laws of UX check, and a screen critique against the audience and job stories, plus a definition of ready and one owner gate), or whether the built UI matches its approved spec, state by state at 100 and 150 percent. Writes validation.md or qa.md with a verdict in the spec folder. Use when the user says "validate the spec", "is the design ready", "design QA", "compare the build with the prototype", or when calvin-sdlc:ux-design reaches its validation loop.'
user_invocable: true
allowed-tools: "Bash(python3 */review/scripts/*)"
metadata:
  version: 1.0.0
  author: calvindudek
---

# calvin-sdlc:ux-validate

**Arguments:** `spec <change>` or `build <change>`, where `<change>` is a change id, a change
folder or a spec folder.

Validate one spec folder and write a verdict file into it.

Shared files are in `references/`, two levels up from this skill's base directory.

## Prerequisites

| Need | For | Without it |
|---|---|---|
| Python 3.10+ and an image-reading tool | Prototype gate and build QA | Report `not-ready` or `fail` |

## Read first

1. Read `docs/ux/setup.md`. Missing: stop and run `calvin-sdlc:ux-init`.
2. Resolve the spec folder and the mode with the shared `references/spec-folder.md`. No spec
   folder exists: stop and say `calvin-sdlc:ux-design` makes one.
3. Read the size and skips for the mode: `decisions.json` in sdlc mode, the frontmatter of
   `<spec>/brief.md` in standalone mode. Never require a key the mode does not have.
4. Read the asks (`intent.md` `## Asks`, or the brief's `## Owner Asks`), `facts.md` when present,
   and every file in the spec folder.
5. Read shared files as needed: `finding-format.md`, `laws-of-ux.md`, `lenses.md`,
   `checklist.md`, `writing.md`, and `usability-heuristics.md` from `calvin-sdlc:ux-audit` (its
   `references/`).
6. Whenever images exist, follow the shared `references/visual-pass.md`: open each with the
   image-reading tool, write the ledger and validate each issue against the repo's conventions.
   Before reporting, run
   `python3 "${CLAUDE_SKILL_DIR}/../review/scripts/visual-check.py" "$run" --repo "$PWD"`.
   Failure means the review did not run: spec is `not-ready`, build is `fail`.
   The text-only spec loop and recorded prototype skips claim no visual compliance.

## Modes

### spec

Use `references/spec.md`. Write `<spec>/validation.md`.

The `validation` skip is set: do not run. Say the skip and its reason in one line.

### build

Use `references/build.md`. Write `<spec>/qa.md`.

The `prototype` skip is set, or the size is `none`: do not run. Say the skip and its reason in one
line.

## Ask once

Ask open questions once, in one batch, each with a recommended answer. Never ask the user to
resolve what the spec already decides.

## Severity

- 0-4 for spec findings (Nielsen's scale).
- P0-P3 for build QA findings.
- Both are names for the kit's one scale: `finding-format.md` maps 4 and P0 to Critical, 3 and
  P1 to High, 2 and P2 to Medium, 1 and P3 to Low. Reuse its format where it fits.
