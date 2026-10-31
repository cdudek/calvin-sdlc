---
name: address-feedback
description: >-
  Investigates, triages and fixes code feedback test-first, from GitHub PRs (worktree, CI, merge
  base, push, per-thread resolve), from prior review findings in the conversation, or from
  free-text instructions. Use when someone says "address feedback", "fix review comments", "continue PR",
  "resume PR", "PR is failing CI", "rebase and fix", "resolve review threads", or a PR number that
  needs work. Skip for opening a new PR — use pr-create.
allowed-tools: "Bash(gh *) Bash(git *) Bash(bash */address-feedback/scripts/*) Bash(bash */github-manage/scripts/*) Read Write Edit Grep Glob Agent EnterWorktree ExitWorktree mcp__claude_ai_Linear__save_issue mcp__linear__save_issue mcp__claude_ai_Linear__list_teams mcp__linear__list_teams mcp__claude_ai_Linear__list_issue_labels mcp__linear__list_issue_labels"
user_invocable: true
metadata:
  version: 1.1.0
  author: mpapis
---

# Address Feedback

Investigates and addresses code feedback from any source — PR reviews + CI, conversation context, or free text. Triages into an actionable summary, then executes fixes using Phase RED/GREEN.

Each subcommand selects the references it needs. The `pr` subcommand additionally handles worktree entry, CI failure classification, staleness (merge base, since the PR already exists), PR finalize (push + body update), and per-thread resolve/comment actions on GitHub (with confidence proposals + user override). The `chat`, `message`, and `fix-set` subcommands always run in-place in the current directory. The `fix-set` subcommand is **autonomous** — it consumes a pre-triaged fix set from a pr-review run (`$STATE_DIR/fix-set.json`), so it skips the user-selection gate and never files Linear tickets (deferred items become DISCUSS).


## Routing

The user input is: $ARGUMENTS

Read the first word as the subcommand and route to its file, passing the rest on as arguments.

| Subcommand | Does |
|---|---|
| `chat` | No arguments expected — reads findings from the current conversation context → `references/commands/chat.md` |
| `fix-set` | The user input is: $ARGUMENTS → `references/commands/fix-set.md` |
| `message` | The user input is: $ARGUMENTS → `references/commands/message.md` |
| `pr` | The user input is: $ARGUMENTS → `references/commands/pr.md` |

No subcommand, or one that is not in the table: say
`Usage: /calvin-sdlc:address-feedback <chat | fix-set | message | pr>`
and ask which one they meant. Never guess — the subcommands do different things.

## Triage Action Verbs

Universal action verbs and PR-specific verbs (FLAKY → Linear, MERGE) are defined in `../role-review-vocabulary/SKILL.md` (see Action Verbs and Triage Classification Rules sections).

**MERGE on stale branches:** the `pr` subcommand always operates on an existing PR, so when the branch is behind base it uses a merge commit (standard — avoids force-pushing a branch with an open PR).

## Commands

| Command | Description | Arguments | Worktree | CI / staleness | Push + threads |
|---------|-------------|-----------|----------|----------------|----------------|
| `/address-feedback pr` | Gather PR feedback + CI + staleness, investigate, triage, execute, propose thread actions, finalize, apply thread actions | `<pr_number>` | enters | yes | yes |
| `/address-feedback chat` | Parse conversation context findings, triage, execute | none | in-place | no | no |
| `/address-feedback message` | Free text input as feedback, investigate, triage, execute | `<text>` | in-place | no | no |
| `/address-feedback fix-set` | Autonomously address a pre-triaged fix set from a pr-review run — no user gate, no Linear | `<state_dir>` | in-place | no | no |
