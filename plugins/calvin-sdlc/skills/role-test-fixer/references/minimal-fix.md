# Minimal Fix

Apply the smallest change that makes the failing test pass.

## Rules

- Change only what's necessary to fix the identified root cause
- Don't refactor, clean up, or improve surrounding code
- Don't add comments explaining what was broken — the commit message handles that
- Don't add unrelated improvements, even if they're obvious
- One fix per concern — don't bundle unrelated changes

## Why

Every additional change is a potential regression. The fix should be reviewable in seconds: "this was broken, this line fixes it."
