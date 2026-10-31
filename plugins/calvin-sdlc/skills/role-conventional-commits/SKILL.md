---
name: role-conventional-commits
description: "Shared Conventional Commits format reference — type table, header/body/footer rules, and examples. Not a slash command — auto-installed as a dependency."
allowed-tools: "Read"
user_invocable: false
metadata:
  version: 1.0.0
  author: mpapis
---

# Conventional Commits — Shared Format

Single source of truth for Conventional Commits formatting across skills that produce commit messages. Currently consumed by `pr-create` and `squash`; other commit-producing skills should reference this as the canonical format.

## When to use

Reference `references/format.md` whenever a skill needs to produce or validate a Conventional Commits-style header, body, or footer.

Skills that synthesize a single message from multiple commits (e.g., `squash`) layer their synthesis rules on top of this format — they reference `format.md` for the header/body/footer rules, then add their own composition logic.
