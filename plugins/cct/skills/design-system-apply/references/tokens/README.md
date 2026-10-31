# Token CSS for prototype mode

Byte-identical mirror of `plugins/cct/skills/brand/tokens/` (the canonical copy). Each plugin
installs into its own cache directory, so `omr-dev` cannot read a file inside `omr-core` at runtime.
Two copies plus `scripts/check-requirements-grammar.py` comparing them is the arrangement that works.

Edit the canonical files in the brand skill, then `cp` them here. CI fails if a pair diverges.

| File | Holds |
|---|---|
| `fonts.css` | `@font-face` for OMR One from `static.omr.com` |
| `primitives.css` | Layer 1 palette, never referenced directly |
| `colors.css` | Layer 2 semantic colour tokens, light values on `:root` |
| `colors-dark.css` | Dark values under `[data-theme="dark"]`, opt-in |
| `typography.css` | `txt-*` fluid type scale |
| `layout.css` | Spacing, radius scale and radius roles |
| `utilities.css` | Semantic colour, state-layer and focus utilities |
| `base.css` | Resets and body defaults |
