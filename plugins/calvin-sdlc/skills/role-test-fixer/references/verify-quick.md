# Quick Verify

Fast validation loop — run after each individual fix.

## Steps

1. **Lint/format checks first** — fastest feedback, catches syntax and style issues
2. **Run the specific test(s)** related to the change — confirms the fix works
3. **Fix any lint or test failures** before moving on

This is the inner loop. Run it after every change to catch issues immediately.

## After all fixes are applied

Once all individual fixes pass quick verification:

1. Run full lint pass across the project
2. Run the full test suite (or the relevant test files)
3. If causation proof is needed, follow stash-based verification (`references/stash-verify.md`)

## Verification integrity

Any script or command written to verify a fix must be falsifiable — it must be able to fail. Follow the anti-theater rules (global rule `anti-theater.md`). Before trusting a check, confirm it catches a known-bad case.
