# Conventional Commits

Fallback convention when the repo has no `.github/COMMIT_CONVENTION.md`. Based on https://www.conventionalcommits.org/en/v1.0.0/.

## Format

```
<type>(<optional scope>): <description>

[optional body]

[optional footer(s)]
```

## Types

| Type | When to use | SemVer impact |
|------|-------------|---------------|
| `feat` | New feature or capability | MINOR |
| `fix` | Bug fix | PATCH |
| `docs` | Documentation only | — |
| `style` | Formatting, whitespace (no logic change) | — |
| `refactor` | Code restructuring (no behavior change) | — |
| `perf` | Performance improvement | — |
| `test` | Adding or updating tests | — |
| `build` | Build system or dependencies | — |
| `ci` | CI configuration | — |
| `chore` | Maintenance tasks | — |

## Rules

1. **Type is required** — always start with a type noun
2. **Scope is optional** — in parentheses after type: `feat(auth): ...`
3. **Description** — short summary after colon+space, imperative mood ("add" not "added")
4. **Body** — separated from description by one blank line, explains what and why
5. **Footers** — separated from body by one blank line, use `token: value` format
6. **Breaking changes** — indicate with `!` after type/scope: `feat!: remove login endpoint` or with a `BREAKING CHANGE:` footer

## Good Commit Messages

```
feat(auth): add JWT-based authentication

Implement token generation and validation middleware
for protected API routes.

Refs: #123
```

```
fix(api): handle null response from payment gateway

The gateway occasionally returns null instead of an error
object when the service is degraded. Added null check with
appropriate error propagation.
```

```
chore: update eslint to v9

Migrated from .eslintrc to flat config format.
```

```
feat!: drop support for Node 16

BREAKING CHANGE: Minimum supported Node version is now 18.
```

## Common Mistakes to Avoid

- Don't capitalize the description: `feat: Add login` → `feat: add login`
- Don't end with a period: `fix: resolve timeout.` → `fix: resolve timeout`
- Don't use past tense: `feat: added search` → `feat: add search`
- Don't be vague: `fix: fix stuff` → `fix(auth): resolve token expiration race condition`
