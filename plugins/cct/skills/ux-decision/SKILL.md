---
name: ux-decision
description: Turn UX findings and proposed interaction rules into decisions the owner can make without reading anything else. Shared rules first, five related decisions at a time; each can be accepted, swapped for the alternative, deferred, or answered in the owner's own words; routine fixes grouped for one review. Records every answer. Use after cct:ux-audit, or when the user says "let's decide", "go through the decisions".
user_invocable: true
metadata:
  version: 1.0.0
  author: calvindudek
---

# cct:ux-decision

**Arguments:** `[next | routine | page]`

The owner decides; the skill makes each decision easy and records it.

Shared files are in `references/`, two levels up from this skill's base directory:
`finding-format.md`, `rule-areas.md`, `writing.md`. Read `docs/ux/setup.md` first.

## 1. Build the decision list

From the latest `findings.md` and the proposed rules in the interaction guidelines:

1. **Shared rules first.** Every proposed rule becomes one decision, shown once with every screen
   it affects. Findings that the rule settles are grouped under it, not deleted or merged.
2. **Then screen-specific choices** that no rule settles.
3. **Routine fixes** (corrections with no real choice) go into one separate group for one review.
   A change in behaviour is never routine.
4. **Order:** by what each decision unblocks. Groups of five related decisions. The first group
   says in one or two sentences why it comes first.

Write it to `docs/ux/decisions-<YYYY-MM-DD>.md` (or where `setup.md` says).

## 2. Every decision, self-contained

```markdown
### <Plain-language title>
- **Today:** what happens now, with a concrete example and the exact words on screen.
- **Recommended:** the change, concretely: what the user will see and do.
- **Why it helps you:** the benefit to the owner's actual workflow.
- **Downside:** the main tradeoff. **Alternative:** only if meaningfully different, shown just as
  concretely.
- **Before / after:** a screenshot and a labelled "Proposal" mockup, or the exact text before and
  after.
- **Applies to:** every screen it touches (for a shared rule).
- **Question:** one specific question the owner can answer.
- **Verified:** which parts are seen on screen, read in code, assumed, or a preference.
- **You said:** the owner's earlier words, quoted with date, or "no earlier request found".
<details><summary>Supporting notes</summary>Finding numbers · codes · file:line · other products.</details>
```

Never justify a recommendation only because it is already built or matches a reference product.
Never ask "modal or drawer?" without showing what each means for the task.

## 3. Go through it with the owner

- Show the five decisions of the current group, in full, in the conversation or on the decision
  page.
- Ask with `AskUserQuestion`, at most four questions per call, so a group of five takes two calls.
  Each question offers: **Accept the recommendation** · **Choose the alternative** (only when
  there is one) · **Defer**. "Other" lets the owner answer in their own words.
- Routine fixes: one question for the whole group ("Apply all", "Show me the list first", "Hold"),
  with the list visible.
- After each group, write **one file per answered decision**, never a row in a log:
  `<designsDir>/<YYYY-MM-DD>-adr-<slug>.md` (`designsDir` from `sdlc.json`, else `docs/designs`;
  nest by `<year>/<year-month>/` when that folder already does). Frontmatter: `title`,
  `type: adr`, `status: accepted`, `created`, `decided_by: owner`, `tags: [ux, <area>]`, and
  `supersedes: [<id>]` when it replaces an earlier decision — then set that file's
  `status: superseded` and `superseded_by`. Body: the decision as shown, then the answer
  verbatim. A deferred decision gets no file; it stays in the round's list. Then run
  `python3 scripts/design_index.py write` when the repo has it, and `cct:ux-guidelines record`.
  One file per decision is what lets the next agent read `INDEX.md` and open one file: the
  appended log it replaces had reached 2,910 lines in omr-leadhub within 19 days.
- Stop after each group and wait. Never answer for the owner, and never treat silence or an
  earlier message as acceptance.

## 4. The decision page (optional, `page`)

When the owner wants a page: publish the decision document as an artifact, following
`references/decision-page.md` point by point. Load the
`artifact-design` skill first, and `artifact-capabilities` if answers are collected on the page.
Keep the same content and order, one group at a time, with the supporting notes folded away.
Update the same URL each time (from `setup.md`).
