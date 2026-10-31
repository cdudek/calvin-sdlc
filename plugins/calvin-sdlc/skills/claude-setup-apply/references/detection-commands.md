---
title: Repo and AI-context detection commands
status: canonical
created: 2026-09-10
---

# Detection commands

The full Step 3 inventory block of `claude-setup-apply`. Run it top to bottom; the
`Repo signals` group drives the generated CLAUDE.md in Step 6.

```bash
# Identity
basename "$(git rev-parse --show-toplevel)"
git branch --show-current

# Language / toolchain
ls package.json pyproject.toml go.mod Cargo.toml Gemfile pom.xml composer.json 2>/dev/null

# Existing AI-context state
ls -la CLAUDE.md AGENTS.md agents.md GEMINI.md .cursorrules .windsurfrules CLAUDE.local.md 2>/dev/null
ls -la .github/copilot-instructions.md 2>/dev/null
ls -la .cursor/rules/*.mdc 2>/dev/null
file CLAUDE.md AGENTS.md agents.md GEMINI.md .cursorrules .windsurfrules .github/copilot-instructions.md 2>/dev/null
readlink CLAUDE.md AGENTS.md agents.md GEMINI.md .cursorrules .windsurfrules .github/copilot-instructions.md 2>/dev/null

# Repo signals — drive the generated CLAUDE.md in Step 5
jq -r '.scripts // {} | keys[]' package.json 2>/dev/null     # Top commands
jq -r '.engines // {}' package.json 2>/dev/null               # Node version
jq -r '.dependencies // {} | keys[]' package.json 2>/dev/null | head -10   # Tech stack
ls *.lock package-lock.json yarn.lock pnpm-lock.yaml uv.lock poetry.lock Gemfile.lock 2>/dev/null   # Package manager
find . -maxdepth 4 -type f \( -name "*.generated.ts" -o -name "*.gen.go" -o -name "schema.graphql" -o -name "components.d.ts" -o -name "*.pb.go" \) -not -path "*/node_modules/*" -not -path "*/.git/*" 2>/dev/null | head -10   # Generated files
grep -lE "vitest|jest|mocha|pytest|rspec|playwright" package.json pyproject.toml 2>/dev/null   # Test framework
ls .env.example .env*.example 2>/dev/null   # Secrets handling
ls -la docs/ 2>/dev/null
```
