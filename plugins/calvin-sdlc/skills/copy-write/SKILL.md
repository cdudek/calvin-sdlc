---
name: copy-write
description: Drafts net-new written communications in OMR voice using McKinsey storytelling (SCR/SCQR/SCQA) — emails, Slack messages, memos, written reports, strategy docs. Use when the user wants something written from scratch. Triggers on "write a message", "draft an email", "compose a memo", "write a report", "draft a Slack post", "write a strategy doc". Skip for tone/style review of existing copy — use tone-of-voice; pitch deck narrative — use pitch-create; rendered/branded PDF output — use pdf-create or report-create.
user_invocable: true
metadata:
  version: 0.1.0
  author: calvindudek
---

# Write Copy

Drafts communications in OMR's voice using structured storytelling frameworks. Produces ready-to-send output, not templates.

## Prerequisites

| Variable/Dependency | Required | Format | How to obtain |
|---------------------|----------|--------|---------------|
| `~/.claude/writing-style.md` | Yes | Markdown | Calvin's personal style guide |

## Instructions

> **Stub** — this skill will be fully developed in a separate session.

### Planned capabilities
- McKinsey storytelling: SCR, SCQR, SCQA frameworks
- Format detection: Slack, email, memo, report, strategy doc
- Audience-aware tone adjustment
- Cross-skill: works with `omr-core:presentation-create` and `omr-core:pdf-create`
