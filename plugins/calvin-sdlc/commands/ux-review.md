---
name: ux-review
description: Fan the UI changes in a GitHub PR out across the ux-reviewer agent, a Nielsen heuristic evaluation, and a WCAG accessibility audit, dedupe into one prioritized report, then offer to post inline PR comments.
argument-hint: "[pr-number | pr-url]  (defaults to the current branch's open PR)"
---

# /calvin-sdlc:ux-review

Orchestrate a multi-lens UX review of the UI changes in a GitHub pull request.
Follow these steps in order. Keep your own commentary minimal: the deliverable is
the consolidated findings.

## 0. Pre-flight: verify required plugins
Before doing anything else, confirm every reviewer's agent/skill is available. A
dependency is "available" if it appears in this session's agent list (for the
`subagent_type`s) or skill list (for the skills). For each one that is MISSING,
print its exact install command and note that reviewer will be skipped, then
continue (a missing reviewer simply lands in "Reviewers that did not run").

Required dependencies and where they come from:
- `omr-dev-core:ux-reviewer` agent and `omr-dev-core:audit-accessibility` skill
  -> plugin `omr-dev-core`: `/plugin install omr-dev-core@omr-claude-kit`
- `prototyping-testing:heuristic-evaluation` skill -> plugin
  `prototyping-testing` (in the `designer-skills` marketplace):
  `/plugin install prototyping-testing@designer-skills`

If EVERY reviewer would be missing, STOP and show the install commands instead of
fanning out. Otherwise proceed with whatever is available.

## 1. Resolve the target PR
- If `$ARGUMENTS` is non-empty, treat it as a PR number or URL.
- Otherwise auto-detect the current branch's open PR:
  `gh pr view --json number,url,title,headRefName,baseRefName`
- If there is no open PR, STOP and tell the user.
- Capture: PR number, base branch, head branch, title, URL.

## 2. Gather the diff and filter to UI changes
- `gh pr diff <number> --name-only` for the changed-file list.
- Keep only UI-relevant files: paths under `src/app`, `src/components`,
  `src/locales`, or matching `*.tsx`, `*.jsx`, `*.vue`, `*.css`, `*.scss`,
  `*.html`. Adjust to the repo's actual layout if it differs.
- If NO UI-relevant files changed, STOP and say there is nothing for a UX review.
- `gh pr diff <number>` for the full patch (subagents will re-read it themselves).
- If the repo has design-context docs (`PRODUCT.md`, `DESIGN.md`, a design
  system, or `.claude/design-notes/`), tell the reviewers to consult them so
  findings respect the project's own design contract.

## 3. Fan out reviewers IN PARALLEL
Dispatch ALL reviewers below as subagents in a SINGLE message (multiple Agent
tool calls together). Give each: the PR number, the UI-relevant file list, and an
instruction to read the diff itself via `gh pr diff <number>`. Tell each to
return ONLY findings in the normalized schema in section 4.

1. `subagent_type: omr-dev-core:ux-reviewer` - the prompt you send it MUST begin
   with the literal line `MODE: review` on its own line (review mode is
   read-only). It gives a multi-angle critique covering visual hierarchy,
   contrast, accessibility, friction, motion, and microcopy, and internally
   folds in laws-of-ux and the design-review audit.
2. `subagent_type: general-purpose` - HEURISTIC pass. Instruct it to invoke the
   `prototyping-testing:heuristic-evaluation` skill against the changed UI
   (Nielsen's 10 heuristics, a different lens from ux-reviewer) and return
   findings in the normalized schema.
3. `subagent_type: general-purpose` - ACCESSIBILITY pass. Instruct it to invoke
   the `omr-dev-core:audit-accessibility` skill (WCAG 2.2) against the changed UI
   and return findings in the normalized schema.

If a subagent reports it cannot load its agent or skill, record that under
"Reviewers that did not run" rather than failing the command.

## 4. Normalized finding schema
Normalize every finding from every reviewer to:
```
- file: <repo-relative path>
- line: <line number or range, or null if file-level>
- severity: critical | high | medium | low
- category: hierarchy | contrast | accessibility | friction | motion | microcopy | heuristic | other
- title: <one line>
- detail: <why it matters, tied to a principle or WCAG criterion where relevant>
- suggestion: <concrete fix, or null>
- source: <which reviewer found it>
```

## 5. Dedupe + prioritize
- Merge findings on the same `(file, line)` or the same component that describe
  substantially the same issue; keep the clearest wording and union `source`.
  Accessibility and heuristic passes often surface the same problem from
  different angles, so dedupe across lenses.
- Drop anything a reviewer flagged as low-confidence or speculative.
- Sort critical -> high -> medium -> low; within a severity, group by file.

## 6. Report
Print one consolidated terminal report:
- Header line: PR number, title, `base...head`, reviewers run, and totals by
  severity.
- Findings grouped by severity, each as `path:line - [category] title`, with the
  detail and suggestion indented underneath. UX findings are often
  component-level rather than line-level; that is fine, set line to null.
- A "Reviewers that did not run" section if any.
- If there are zero findings, say so plainly.

## 7. Offer to post (never auto-post)
Ask: "Post these N findings as inline PR comments? [y/N]".
- Only on an explicit yes, post review comments to the PR with `gh`. Findings
  with a concrete `file:line` go as inline line-level comments; component- or
  file-level findings go into the review summary body grouped by file. Never
  post a single undifferentiated blob.
- Respect the repo's punctuation rules (no em-dashes) in anything you post.
- After posting, print the PR URL.
