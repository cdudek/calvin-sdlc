---
title: Legacy archive and appendix — commands and templates
status: canonical
created: 2026-09-10
---

# Legacy archive and appendix

Steps 4 and 7 of `claude-setup-apply`, for the migrate-and-regenerate path only
(any vendor file or stub CLAUDE.md detected).

## Step 4 — archive commands, `.ai-legacy/README.md`, commit

```bash
mkdir -p .ai-legacy

# Move each detected vendor file. Leading dot dropped so files aren't hidden inside the archive.
[[ -f AGENTS.md ]] && git mv AGENTS.md .ai-legacy/AGENTS.md
[[ -f agents.md ]] && git mv agents.md .ai-legacy/agents.md
[[ -f GEMINI.md ]] && git mv GEMINI.md .ai-legacy/GEMINI.md
[[ -f .cursorrules ]] && git mv .cursorrules .ai-legacy/cursorrules
[[ -f .windsurfrules ]] && git mv .windsurfrules .ai-legacy/windsurfrules
[[ -f .github/copilot-instructions.md ]] && git mv .github/copilot-instructions.md .ai-legacy/copilot-instructions.md
[[ -d .cursor/rules ]] && git mv .cursor/rules .ai-legacy/cursor-rules

# Existing CLAUDE.md (whether real file or symlink to a now-archived vendor file):
# - If real file: archive as .original
# - If broken symlink: just remove it (target is already in .ai-legacy/)
if [[ -L CLAUDE.md ]]; then
  rm CLAUDE.md
elif [[ -f CLAUDE.md ]]; then
  cp CLAUDE.md .ai-legacy/CLAUDE.md.original
  git add .ai-legacy/CLAUDE.md.original
fi
```

Write `.ai-legacy/README.md`:

```markdown
# .ai-legacy/

Archive of this repo's prior AI-context state, preserved at the time of `claude-setup-apply` run on <DATE>.

## Files

- <filename> — original `<original-path>`, <line-count> lines, read by <tool>.

## What changed

The active AI-context source of truth is now `CLAUDE.md` at the repo root. Any team-explicit directives from these archived files appear (initially) at the bottom of CLAUDE.md under `## Legacy directives (review and integrate)`. Move the bits that matter into the right sections; delete the appendix when done.

## When to delete this directory

Safe to `git rm -rf .ai-legacy/` once the team has reconciled the appendix and is confident nothing important was missed — typically within one or two weeks of normal work.
```

Commit: `chore(claude): archive prior AI-context state to .ai-legacy/ (preservation before init)`.

## Step 7 — legacy directives appendix, appended to the generated CLAUDE.md

```markdown
---

## Legacy directives (review and integrate, then delete this section)

The following are the raw contents of files that were archived to `.ai-legacy/` during init. Move any directives, commands, gotchas, conventions, or "do not" rules that the team relies on into the appropriate sections above. Once you've reconciled everything, delete this section (and optionally `.ai-legacy/` itself).

The skill does not auto-merge because the team's hard-won directives often need human judgment to land in the right section, override a default, or simply be discarded as obsolete.

### From `.ai-legacy/AGENTS.md` (was `AGENTS.md`, <N> lines)

```
<raw content of AGENTS.md, code-fenced verbatim>
```

### From `.ai-legacy/cursorrules` (was `.cursorrules`, <N> lines)

```
<raw content>
```

<...repeat per archived file...>
```
