---
title: Checklists — overview and index
status: canonical
created: 2026-05-07
---

# Checklists

The audit, init, update, and migrate skills all read from a shared checklist organised by **dimension** (D1–D5). Each dimension is one file under `checklists/`. Rules in each file have explicit `source` attribution so the freshness check (Step 0 of `claude-setup-audit`) knows which rules can be validated against Anthropic's published docs.

## Index

| File | Dimension | Owns | Rule prefixes |
|---|---|---|---|
| [`checklists/d01-foundation.md`](checklists/d01-foundation.md) | D1 — Foundation | CLAUDE.md content, structure, nested files, subtree-reach | `CHECK-NN` (Anthropic) + `OMR-1.x`, `OMR-2.x`, `OMR-3.x` |
| [`checklists/d02-configuration.md`](checklists/d02-configuration.md) | D2 — Configuration | `.claude/settings.json`, gitignore, permissions, env | `OMR-4.x`, `OMR-5.x` |
| [`checklists/d03-enforcement.md`](checklists/d03-enforcement.md) | D3 — Enforcement | hooks (the only deterministic primitive) | `OMR-6.x` |
| [`checklists/d04-modularity.md`](checklists/d04-modularity.md) | D4 — Modularity | skills, subagents, slash commands, path-scoped rules, MCP, frontend plugin recommendations | `OMR-7.x`, `OMR-8.x`, `OMR-9.x`, `OMR-10.x`, `OMR-MCP.x`, `OMR-FE.x` |
| [`checklists/d05-documentation.md`](checklists/d05-documentation.md) | D5 — Documentation | `docs/`, plan/audit history, generated-files declaration, anti-patterns absent | `OMR-11.x`, `OMR-12.x`, `OMR-13.x`, `OMR-14.x` |

## Rule ID conventions

| Prefix | Source | Owner | Example |
|---|---|---|---|
| `CHECK-NN` | Anthropic-canonical — verifiable against `code.claude.com/docs` or the engineering blog | WebFetch upstream validation on every audit run | `CHECK-13` (`@`-import syntax) |
| `OMR-<D>.<N>` | OMR team-opinion — community pattern (3+ Tier-A repos) or internal consensus | OMR engineering | `OMR-3.04` (subtree convention reach) |

Both prefixes coexist in the same dimension files, in the same order: Anthropic-canonical rules first, OMR-opinion rules below.

## Severity vocabulary (per-rule)

- **Required** — Anthropic explicitly recommends OR critical security/safety. Failing this is a real bug.
- **Recommended** — common practice; named in Anthropic doc as a pattern, or strong team consensus.
- **Optional** — agent-readiness improvement; widely adopted but not in source doc.

This is **per-rule** severity. The Oxford aggregate grade (First / 2:1 / 2:2 / Third / Fail) is **audit-level** and lives in `grading-rubric.md`. The two are orthogonal.

## Effective content rule

For all D1 content checks (CHECK-04, CHECK-05, CHECK-06, CHECK-07, CHECK-08, CHECK-14, OMR-2.2, OMR-2.3, OMR-2.4): operate on **effective content** — the union of root `CLAUDE.md`, `@`-imports (depth 1), and plain markdown links to `.md` files (depth 1). This prevents false-Required fails on lean link-out architectures. See `d01-foundation.md` top section for full definition.

## How the skills use these checklists

- **`claude-setup-audit`** — reads all five dimension files, evaluates every rule, produces a graded report
- **`claude-setup-apply`** — reads only rules where `applies_to` includes `claude-setup-apply` (typically Required + setup-relevant Recommended), uses them as the bootstrap target
- **`claude-setup-apply`** — reads all rules; applies remediations for failed rules in an existing setup (no legacy migration)
- **`claude-setup-migrate`** — reads rules where `applies_to` includes `claude-setup-migrate` plus the procedural phases in `migration-guide.md`

## Anti-Theater Rule

Per the global anti-theater principle: every rule in every dimension file must be **able to fail**. Before adding or editing a rule, demonstrate the failure path on a deliberately broken repo. If a rule fires the same way on a known-good and known-bad repo, it is theater — fix or remove it.
