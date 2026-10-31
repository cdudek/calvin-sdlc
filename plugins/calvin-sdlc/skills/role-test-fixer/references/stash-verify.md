# Stash-Based Verification

This protocol proves the fix addresses the actual failure. It is mandatory.

## Steps

### 1. Stash the fix
```
git stash --include-untracked
```

This ensures new files (fixtures, factories, helpers) created as part of the fix are also stashed. Plain `git stash` only captures tracked modifications.

### 2. Confirm the test fails without the fix
Run the same test with the same seed (if used). **It should fail.**

If it passes: try 2-3 more runs. If it consistently passes without the fix, the flakiness may be non-deterministic. Report this to the user — the fix may still be correct but unprovable via stash test.

### 3. Restore the fix
```
git stash pop
```

### 4. Confirm the test passes with the fix
Run the same test again. **It should pass.**

If it fails: the fix is incomplete. Go back to the diagnosis step.

### 5. Run broader tests
Run the full test file (not just the single test) to ensure no regressions. Use the ecosystem-specific file-level command.

Report any new failures.

## Low Reproduction Rate

If the reproduction rate from calibration was < 80%, a single stash/unstash cycle may not be conclusive. In that case:
- Run the test N times without the fix (stashed), count failures
- Run the test N times with the fix (popped), count failures
- Compare rates — a statistically meaningful improvement confirms the fix
- Report both rates to the user

## Why this protocol works

Stash-verify is inherently falsifiable: step 2 expects failure, step 4 expects success. If both produce the same result, the verification has failed — report this honestly. Never skip step 2 or treat its outcome as predetermined.
