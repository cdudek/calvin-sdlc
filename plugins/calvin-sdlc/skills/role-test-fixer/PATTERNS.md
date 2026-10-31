# Problem-Solving Workflow

**Constraint (applies throughout):** [Protect tests](../role-code-analysis/references/protect-tests.md) — tests are sacrosanct, change only as last resort. This governs all steps below.

Analysis steps (from `role-code-analysis` — subset: understand, diagnose, evaluate):

1. **Understand intent** — parse the problem, not the literal suggestion → [../role-code-analysis/references/understand-intent.md](../role-code-analysis/references/understand-intent.md)
2. **Root cause analysis** — find why the defect was possible → [../role-code-analysis/references/root-cause-analysis.md](../role-code-analysis/references/root-cause-analysis.md)
3. **Evaluate approaches** — outline options for non-trivial fixes → [../role-code-analysis/references/evaluate-approaches.md](../role-code-analysis/references/evaluate-approaches.md)

Fix steps (red-green sequence — step 4 is a hard gate: test must fail before touching code):

4. **Reproduce** — write a failing test, **run it, see it fail** before touching production code → [references/reproduce.md](references/reproduce.md)
5. **Fix minimally** — smallest change that resolves the issue → [references/minimal-fix.md](references/minimal-fix.md)
6. **Quick verify** — lint and focused tests as fast validation → [references/verify-quick.md](references/verify-quick.md)
7. **Prove causation** — stash-based confirmation that the fix works → [references/stash-verify.md](references/stash-verify.md)
8. **Revert on failure** — stage proven work, discard failed experiments → [references/revert-on-failure.md](references/revert-on-failure.md)
