---
name: code-review
description: Fan a GitHub PR out across the pr-review-toolkit agents, the code-review diff scan, and an OMR security pass, dedupe into one prioritized report, then offer to post inline PR comments.
argument-hint: "[pr-number | pr-url]  (defaults to the current branch's open PR)"
---

# /calvin-sdlc:calvin-code-review

Orchestrate a multi-reviewer code review of a GitHub pull request. Follow these
steps in order. Keep your own commentary minimal: the deliverable is the
consolidated findings, not narration.

## 0. Pre-flight: verify required plugins
Before doing anything else, confirm every reviewer's agent/skill is available. A
dependency is "available" if it appears in this session's agent list (for the
`subagent_type`s) or skill list (for the skills). For each one that is MISSING,
print its exact install command and note that reviewer will be skipped, then
continue (a missing reviewer simply lands in "Reviewers that did not run").

Required dependencies and where they come from:
- `calvin-sdlc:pr-review-toolkit-code-reviewer`, `:silent-failure-hunter`,
  `:type-design-analyzer`, `:pr-test-analyzer`, `:comment-analyzer` agents
  -> plugin `pr-review-toolkit`:
  `/plugin install pr-review-toolkit@claude-plugins-official`
- `omr-dev-core:review-security` skill -> plugin `omr-dev-core`:
  `/plugin install omr-dev-core@omr-claude-kit`
- the built-in `code-review` skill (`/code-review`) -> ships with Claude Code; if
  absent, update Claude Code.

If EVERY reviewer would be missing, STOP and show the install commands instead of
fanning out. Otherwise proceed with whatever is available.

## 1. Resolve the target PR
- If `$ARGUMENTS` is non-empty, treat it as a PR number or URL.
- Otherwise auto-detect the current branch's open PR:
  `gh pr view --json number,url,title,headRefName,baseRefName`
- If there is no open PR for the branch, STOP and tell the user (suggest opening
  one). Do not silently review uncommitted local changes unless the user
  explicitly asks.
- Capture: PR number, base branch, head branch, title, URL.

## 2. Gather the diff
- `gh pr diff <number>` for the full patch.
- `gh pr diff <number> --name-only` for the changed-file list.
- If the diff is empty, STOP and say so.

## 3. Fan out reviewers IN PARALLEL
Dispatch ALL reviewers below as subagents in a SINGLE message (multiple Agent
tool calls together) so they run concurrently. Give each subagent: the PR
number, base and head branches, the changed-file list, and an instruction to
read the diff itself via `gh pr diff <number>` (keeps each context focused).
Tell each to return ONLY findings in the normalized schema in section 4.

1. `subagent_type: calvin-sdlc:pr-review-toolkit-code-reviewer` - bugs, logic errors, and
   project-convention violations (respect the repo's CLAUDE.md).
2. `subagent_type: calvin-sdlc:silent-failure-hunter` - swallowed errors,
   inadequate error handling, inappropriate fallbacks.
3. `subagent_type: calvin-sdlc:type-design-analyzer` - type design and
   invariant expression.
4. `subagent_type: calvin-sdlc:pr-test-analyzer` - test-coverage gaps for
   the changed code.
5. `subagent_type: calvin-sdlc:comment-analyzer` - comment accuracy and
   rot in the diff.
6. `subagent_type: general-purpose` - SECURITY pass. Instruct it to invoke the
   `omr-dev-core:review-security` skill against the PR diff and return findings
   in the normalized schema. This is the runnable stand-in for the passive
   `security-guidance` hooks.
7. `subagent_type: general-purpose` - DIFF SCAN. Instruct it to run the
   `code-review` skill (the `/code-review` command) over the PR diff at high
   effort and return findings in the normalized schema.

If a subagent reports it cannot load its agent or skill, record that under
"Reviewers that did not run" in the report rather than failing the command.

## 4. Normalized finding schema
Normalize every finding from every reviewer to:
```
- file: <repo-relative path>
- line: <line number or range, or null if file-level>
- severity: critical | high | medium | low
- category: bug | security | error-handling | types | tests | comments | convention | other
- title: <one line>
- detail: <why it matters>
- suggestion: <concrete fix, or null>
- source: <which reviewer found it>
```

## 5. Dedupe + prioritize
- Merge findings on the same `(file, line)` that describe substantially the same
  issue; keep the clearest wording and union the `source` list.
- Drop anything a reviewer flagged as low-confidence or speculative.
- Sort critical -> high -> medium -> low; within a severity, group by file.

## 6. Report
Print one consolidated terminal report:
- Header line: PR number, title, `base...head`, reviewers run, and totals by
  severity.
- Findings grouped by severity, each as `path:line - [category] title`, with the
  detail and suggestion indented underneath.
- A "Reviewers that did not run" section if any.
- If there are zero findings, say so plainly.

## 7. Offer to post (never auto-post)
Ask: "Post these N findings as inline PR comments? [y/N]".
- Only on an explicit yes, post line-level review comments to the PR with `gh`
  (`gh api` review comments, or `gh pr review`), one inline comment per finding
  at its `file:line`, including category, detail, and suggestion. Follow the
  repo convention: inline line-level comments, never a single general comment.
  Findings without a line go into the review summary body.
- Respect the repo's punctuation rules (no em-dashes) in anything you post.
- After posting, print the PR URL.
