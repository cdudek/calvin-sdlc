---
name: architecture-review
description: >
  Architecture review — evaluates coupling, cohesion, service boundaries, scaling risks, and single
  points of failure of an existing system. Structured audit with severity ratings.
  Use when user says "architecture review", "review architecture", "system design review",
  "scaling concerns", "service boundaries", "technical debt audit", "audit our architecture",
  or asks to evaluate a system's architecture.
  Skip for: designing new distributed patterns — use distributed-patterns.
  Skip for: choosing/applying OOP design patterns — use design-patterns.
  Skip for: PR/code review — use pr-review.
allowed-tools: "Read Grep Glob Bash(git *)"
user_invocable: true
metadata:
  version: 0.1.0
  author: calvindudek
effort: high
---

# Review Architecture

Evaluate a system's architecture for coupling, cohesion, scaling risks, and structural issues.

> **Stub** — this skill will be fully developed in a separate session.

### Planned capabilities
- Codebase exploration → dependency mapping → component identification
- Coupling/cohesion analysis with concrete metrics
- Service boundary evaluation (too big? too small? wrong cuts?)
- Single points of failure identification
- Scaling bottleneck analysis
- Structured findings report with severity ratings (critical/high/medium/low)
- Recommendations with effort estimates
- Cross-skill: works with `calvin-sdlc:c4-diagram-create` to visualize findings
