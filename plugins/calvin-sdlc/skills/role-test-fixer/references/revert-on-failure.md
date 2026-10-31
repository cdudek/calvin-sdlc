# Revert on Failure

Stage proven fixes immediately. Discard failed experiments cleanly.

## Workflow

1. **After each verified fix:** stage the specific files immediately
   ```
   git add <specific-files>
   ```

2. **If a fix attempt fails:** discard unstaged changes to return to last proven state
   ```
   git restore .
   ```
   Staged changes are preserved — only unstaged experiments are discarded.

3. **Never layer fix attempt #2 on top of broken fix attempt #1.** Restore to clean state first.

4. **When all fixes are done:** if your own instructions say not to commit, leave the proven files staged and uncommitted for the caller. Otherwise commit once with a clean message describing all changes.

5. **Nuclear option** — discard everything (staged + unstaged) only when you need a full reset:
   ```
   git restore --staged --worktree .
   ```

## Why

This prevents the common failure mode of accumulating broken state across multiple fix attempts. Each attempt starts clean, and proven work is never lost.
