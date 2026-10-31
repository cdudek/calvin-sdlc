# Reproduce Before Fixing

Reproduce the bug before touching code — this is always step 1.

## Steps

### 1. Write a failing test

Write a test that captures the **correct** expected behavior. Before writing:
- Read the specification, doc, or existing test patterns to understand what "correct" means
- For ordering: verify the expected order independently (alphabetical, chronological, etc.)
- For values: derive expectations from the spec, not from the current (broken) code

### 2. Run the test — STOP here until you see it fail

**Do not proceed to the fix until you have run the test and seen it fail.** This is a hard gate, not a suggestion.

- Run the test
- Read the output
- Confirm the failure matches the bug you're fixing (not a test bug, not a setup error)
- If the test passes: investigate before continuing. Apply this 3-step check:
  1. **Negate the key assertion** — if negated test also passes, the test is tautological. Rewrite it.
  2. **Sabotage the code under test** (e.g., wrong return value) — if original test still passes, it doesn't reach the right code path. Rewrite it.
  3. **If both negation and sabotage cause failure** — the code already handles this case. The test validates existing behavior. Report this and proceed without a code fix.

### 3. Only then proceed to the fix

The failing test output is your proof that the bug exists. Now you may edit production code.

## Checkpoint violations

If you find yourself editing production code without a failing test run in your history, STOP. You have skipped the gate. Go back to step 1.

## Why

A fix without reproduction is a guess. The failing test becomes the proof that:
- The bug existed (test fails before the fix)
- The fix works (test passes after the fix)
- The bug doesn't regress (test stays in the suite)

If you cannot reproduce the bug, report this clearly and ask for guidance. Do not guess at a fix.
