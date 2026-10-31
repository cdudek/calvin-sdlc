---
name: ux-audit
description: Whole-app UX audit. Runs the app, screenshots every screen and state, checks every screen through every lens (Nielsen, Shneiderman, the 30 Laws of UX, Maze, six plain questions, the full checklist, WCAG 2.2, writing and vocabulary), with three independent heuristic evaluators, one of them Codex. Produces an uncapped findings document, the as-built and proposed sitemap, a glossary proposal and proposed interaction guidelines. Use when the user asks to audit, review or check the whole app, or whether it all fits together.
user_invocable: true
allowed-tools: "Bash(python3 */review/scripts/*)"
metadata:
  version: 1.0.0
  author: calvindudek
---

# calvin-sdlc:ux-audit

**Arguments:** `[extra builds: PR numbers or URLs]  [focus]`

Findings first, decisions later. The audit documents; it never changes the app, user data or a
real device.

Shared files are in `references/`, two levels up from this skill's base directory:
`lenses.md`, `laws-of-ux.md`, `checklist.md`, `writing.md`, `finding-format.md`,
`rule-areas.md`, `visual-pass.md`. Nielsen's ten and the dark-pattern checklist are this skill's own
`references/usability-heuristics.md` — the kit's only copy, also read by `calvin-sdlc:ux-review`.
Conflicts are settled with the shared `references/conflicts.md` (the precedence ladder), and the
findings document lists every exception (`EX-<n>`) the audit relied on. Every agent returns JSON
in the shape of the shared `references/findings.schema.json`; `$F` below is
`../review/scripts/findings.py`, which validates, merges and renders it. Do not type the
findings document by hand.

## Prerequisites

| Need | For | Without it |
|---|---|---|
| Python 3.10+ | Findings and visual checks | Report BLOCKED |
| Image-reading tool | Open the screenshots | Report BLOCKED for visual review |

## 0. Preconditions

- Read `docs/ux/setup.md`. If it is missing, run `calvin-sdlc:ux-init` first.
- Read the owner's-words file, the audience file, the design system, the glossary, and the
  latest decisions and guidelines. Find the `ux` ADRs through `<designsDir>/INDEX.md`, the old
  decision log only where it remains, the exceptions register and `PRODUCT.md` as
  `references/visual-pass.md` specifies.
- The builds to audit: main, plus every PR in the arguments or in `setup.md`. Build each extra
  PR in its own worktree, following the repo's worktree rules. Never touch the main checkout.

## 1. Write the briefing, and get it approved

Write `docs/ux/audits/<YYYY-MM-DD>/briefing.md`. It is the one brief every agent gets.

1. **Deliverables, in order:** findings; then the as-built and proposed sitemap; the glossary
   proposal; the proposed interaction guidelines with the enforcement map; and older UX documents
   marked `status: superseded` with a pointer (never deleted). The decision document comes after
   the owner has read the findings (`calvin-sdlc:ux-decision`).
2. **The owner's words it answers:** quote every relevant request verbatim with its date.
3. **Scope:** every screen and state from `setup.md`, every build, the window sizes, the safety
   rules (what is read only, what may only be written against fakes).
4. **The checks.** C1–C22 below, every lens in `lenses.md`, every point of `checklist.md`
   adapted to the platform, every rule area in `rule-areas.md`, every flow.
5. **The team** (section 2) and **the finding format** (`finding-format.md`).

Show the briefing to the user and ask what is missing or wrong. Do not start agents until they
say go. A briefing change is cheap; a wasted audit is not.

### The checks

| # | Check | Produces |
|---|---|---|
| C1 | **Do the concepts fit together?** Every object and every action: where it appears, what it is called, how it looks and behaves on each screen. | One table per object and action, one row per screen; every differing row is a finding |
| C2 | **Hierarchy per screen:** its job, what users do most, whether visual weight matches. | Primary, secondary, tertiary as built and as they should be |
| C3 | **Sitemap against the object model:** run `calvin-sdlc:ux-sitemap-create as-built`; its checks SM-1 to SM-12 cover dead ends, orphans, one thing reachable or named two ways, no way back. | The as-built sitemap, checked against the glossary and product docs; its findings join the merge |
| C4 | **Jobs to be done:** every job, which screens, how many steps, where it breaks. | Job × screen: works · clumsy · broken · impossible |
| C5 | **List → detail → back, and unsaved work:** every way in and out, the back control, previous/next, unsaved work on every exit. | A table of every way in and out |
| C6 | **Page layout:** where navigation, header, toolbar, body and bottom bars sit on every screen. | A block diagram per screen; every departure is a finding |
| C7 | **Every control, instance by instance:** each control type (the project names them) in every place: look, size, label, keys. | One table per control type |
| C8 | **Tables and lists:** click, double-click, Enter, rename, row actions, multi-select, checkboxes, empty rows, cursor. | One row per list |
| C9 | **Where things open:** every popover, sheet, dialog, menu and page change: trigger, fit, stacking, buttons, Esc and Enter. | One row per surface |
| C10 | **Levels of detail:** what each dense view shows and what the user would want to show or hide. | Per view: shown today, could be switched |
| C11 | **Writing for the audience** (`writing.md`). | One finding per string or pattern |
| C12 | **One vocabulary:** term × place for every object, action and state; misspellings; outdated text. | The table; every clash a finding; the glossary proposal |
| C13 | **Visual design system:** fonts, sizes, colours, spacing, radii, icons, component look against the design system and siblings. | Findings with screenshots side by side |
| C14 | **Window sizes:** every main screen at every size in `setup.md`. | Screenshots and findings |
| C15 | **Every earlier request re-checked:** met · partly · not met, with what is on screen now. | One row per request, quoting it |
| C16 | **Every state:** empty, loading, error, not found, disconnected, and the product's own. | Screen × state table |
| C17 | **The keyboard:** every shortcut per screen; clashes; keys firing in text fields or dialogs; hints that lie; pointer-only actions. | Key × screen map and findings |
| C18 | **Pattern research:** for every decision-shaped finding, how the products in `setup.md` do it. | One line per product in supporting notes |
| C19 | **One interaction grammar:** today's behaviour in every rule area of `rule-areas.md`, across every build, and a proposed rule for each, with exceptions and flows. | Proposed interaction guidelines |
| C20 | **The rendered result:** the ten visual categories, typography specifics and performance-as-design in `references/visual-audit.md`, plus the AI-slop blacklist — would a designer at a respected studio ship this? | One finding per category, per screen |
| C21 | **Page-class rules:** classify each screen as marketing, app UI or hybrid and audit it against that class's hard rules in `references/visual-audit.md`. | One finding per breach |
| C22 | **Laws of UX, all thirty:** every check in `laws-of-ux.md` on every screen and state, each law marked pass, fail or not applicable with its evidence. | The coverage table per evaluator; one finding per failed check, citing its id |

## 2. The team

**Before spawning:** build every build once (main and each PR, in its own worktree), so agents
only launch built apps and never rebuild the same folder at the same time. Write one
`common.md` for all agents: the briefing path, the builds and their folders, how to launch with
the harness, the safety rules, the inputs, where output goes. Keep agents' notes and
screenshots **outside the repo** (a scratch audit folder, `<scratch>` below, under `${TMPDIR:-/tmp}/omr-ux/audit/`) until the merge, so the independent
evaluators cannot read them by accident.

Spawn all agents in one message so they run in parallel. Every agent gets `common.md`, its
checks, `finding-format.md`, and its own output file `<scratch>/passes/a<n>.json`, with the
prompt shape of the shared `references/dispatch.md` section 4: JSON only, every clean criterion in
`passed`, every unchecked one in `did_not_run` with the reason, and `$F validate` run on the file
before it returns. Screenshots go to one shared `shots/`
folder, file names prefixed with the agent number. Every agent runs the app itself with the test
data and fakes from `setup.md`. **Only one agent may talk to a real device**, and only to read:
two apps talking to one device at once can corrupt its replies.
Every agent opens each image it judges with the image-reading tool and returns its observations
and convention verdicts from `references/visual-pass.md` with its evidence.

| Agent | Checks |
|---|---|
| 1 Concepts and structure | C1, C2, C3, C4, C18. Later, phase 2: C19 synthesis (run `calvin-sdlc:ux-guidelines draft`), flows, enforcement map, proposed sitemap (`calvin-sdlc:ux-sitemap-create proposed`) |
| 2 Navigation, layout, surfaces, states | C5, C6, C9, C16; C19 areas: navigation and return, side panels and detail pages, dialogs menus and popovers, feedback, progress and long operations, local work and external writes, connection to external systems, remembered state, first run and help, motion; checklist: navigation |
| 3 Controls, tables, detail, visual, sizes | C7, C8, C10, C13, C14; C19 areas: editing, saving and unsaved work, confirmation and undo, lists and selection, forms and validation, search and filters, undo across the app, copy and paste, drag and drop, media playback; checklist: forms, responsive, performance |
| 4 Words, vocabulary, keys, earlier requests | C11, C12, C15, C17; C19 areas: keyboard and focus, platform conventions; the glossary proposal; checklist: content |
| 5 Accessibility | WCAG 2.2 through `calvin-sdlc:accessibility-audit` when available; checklist: accessibility; the accessibility rules the guidelines must include |
| 6, 7 Heuristic evaluators | Every lens in `lenses.md` on the whole app, independently, including C22 (each accounts for every law in its own file, which must pass `$F validate <file> --expect L1-L30,B1-B14`; the merge keeps every disagreement); they do not read earlier audits |
| 8 Heuristic evaluator: Codex | The same, run in the background with `codex exec -s workspace-write -C <its scratch folder> --skip-git-repo-check -o <scratch>/passes/a8.json "<prompt>"` from a script file, the prompt carrying the schema path and the JSON-only instruction. The prompt forbids reading other agents' notes and writing anywhere but its scratch folder. If the configured model needs a newer CLI than installed, run `npx -y @openai/codex@<latest> exec …` instead. If Codex cannot launch the app, it evaluates the code and says so up front. |

Every rule area in `rule-areas.md` has exactly one owner in this table; check that before
spawning.

**Independence.** Evaluators 6, 7 and 8 do not see each other's notes, the other agents'
findings or the proposed guidelines until all three have submitted. Agent 1's C19 synthesis runs
after every other agent has finished, using their evidence, with wording and keyboard input from
agent 4 and accessibility input from agent 5.

If an agent or skill cannot load, record it under `did_not_run` in the audit's own
`<scratch>/passes/00-audit.json` (scope, method, and what did not run) and carry on. An agent
that ran without its skill sets `degraded`, and the findings document prints a banner.

## 3. Merge

- After the independent evaluators finish, the run owner follows `references/visual-pass.md`:
  open every shared image, write `<scratch>/visual.json`, reconcile every visual issue against
  the repo's conventions, and write `<scratch>/passes/visual.json`. Then run
  `python3 "${CLAUDE_SKILL_DIR}/../review/scripts/visual-check.py" "<scratch>" --repo "$PWD"`.
  Failure means the review did not run: repair it or report BLOCKED before any merge.
  Repeat after any new capture; preserve the ledger with the findings.
- `python3 "$F" validate <scratch>/passes/*.json`. An agent whose file fails is sent back once
  with the errors; if it fails again, it goes under `did_not_run` in `00-audit.json`. Evidence
  rules are enforced here: `seen`, `code` and `measured` need evidence, so anything without it
  is re-filed as `assumption` by its agent, and codes belong in `id` and `location`, never in
  `summary` or `current`. A missing or invalid `visual.json` findings pass blocks the audit;
  never drop it from the merge.
- `python3 "$F" merge <scratch>/passes/*.json --skill calvin-sdlc:ux-audit -o <scratch>/merged.json`. It
  removes exact duplicates only (same id, same place), lists every source so findings seen by
  two or three evaluators show it, and never splits or drops. Settle every disagreement it lists
  in `notes` with `conflicts.md` by correcting the agent's file, then merge again.
- `python3 "$F" render <scratch>/merged.json -o docs/ux/audits/<YYYY-MM-DD>/findings.md
  --title "UX audit <YYYY-MM-DD>" --order location`: numbered F001 upward, grouped by place,
  with the method line of every agent, a degraded banner when one ran without its skill, totals
  by impact and by verification, then Passed, Not applicable and Did not run. Copy
  `merged.json` beside it as `findings.json`, so the next audit can be compared with this one.
- Then send agent 1 into phase 2 with every agent's file: it runs `calvin-sdlc:ux-guidelines draft`, which
  writes the proposed rules into `docs/ux/interaction-guidelines.md` (every rule
  `status: proposed`), the flows and the enforcement map, and runs
  `calvin-sdlc:ux-sitemap-create proposed`, which writes `docs/ux/sitemap.md` and `sitemap.json` (as
  built, proposed, changes, redirects). Agent 4's glossary proposal goes to `docs/ux/glossary-proposal.md`.
- Mark older UX documents `status: superseded` with a pointer.

## 4. Report

Tell the user: the counts, the ten most severe findings in one line each, what did not run, and
where the files are. Offer `calvin-sdlc:ux-decision` as the next step. Never start implementing.
