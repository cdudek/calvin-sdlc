---
name: design-patterns
description: >-
  Design patterns reference — SOLID, dependency injection, Gang of Four patterns and
  DRY/KISS/YAGNI for in-process OOP code. Use when someone says "SOLID", "design patterns", "dependency
  injection", "factory pattern", "strategy pattern", "singleton", "DRY", "KISS", "YAGNI",
  "refactor to pattern". Skip for distributed patterns like saga, CQRS or circuit breaker (use
  distributed-patterns) and for auditing an existing architecture (architecture-review).
allowed-tools: "Read Grep Glob Write Edit"
user_invocable: true
metadata:
  version: 1.0.0
  author: calvindudek
---

# Apply Design Patterns

Reference for applying SOLID principles, dependency injection, and Gang of Four patterns during code reviews, refactoring, and new feature design.

## How to use this skill

1. **Code review context**: When reviewing code, check for pattern violations and suggest improvements
2. **Refactoring context**: Identify which pattern solves the specific structural problem
3. **New feature context**: Choose the right pattern upfront based on the requirements

Always apply the **Rule of Three**: don't introduce a pattern until you have three concrete cases. Premature abstraction is worse than duplication.

See `references/solid-and-di.md` for SOLID principles and dependency injection.
See `references/gang-of-four.md` for Gang of Four patterns.
See `references/design-heuristics.md` for DRY/KISS/YAGNI and when NOT to apply patterns.
