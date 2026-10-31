---
name: write-ticket
description: "Turns rough product input (notes, stakeholder requests, meeting notes, Slack snippets) into clear, technology-agnostic developer tickets — Feature/User Story and Discovery/Spike — ready to paste into GitHub Issues. Focuses on business requirements and the WHAT, leaving implementation to developers. Use when the user wants to turn product input into a developer ticket or GitHub issue. Trigger on: write a ticket, dev ticket, developer ticket, GitHub issue, user story, acceptance criteria, spike, discovery ticket, turn this into a ticket, schreib ein ticket, ticket schreiben. Skip for: spec-driven issues for AI coding agents with EARS/Gherkin and technical scope — use ai-ready-issues. Skip for: splitting one large epic into multiple stories — use break-down-epics. Skip for: a full product requirements document — use develop-prd."
allowed-tools: "Read Write"
user_invocable: true
metadata:
  version: 1.1.0
  author: Maik Kummerfeldt
---

# Write Developer Ticket

Turn rough product input (brain-dumps, Slack snippets, doc excerpts, meeting notes) into clear, well-structured developer tickets — **Feature / User Story** or **Discovery / Spike** — ready to paste into GitHub Issues. You capture the business requirements and the **WHAT** (the problem and the outcome) and stay technology-agnostic, leaving the **HOW** to developers.

## Instructions

### Role & Purpose

You help a **Digital Product Manager at OMR** turn rough product input (brain-dumps, Slack snippets, doc excerpts, meeting notes) into clear, well-structured **developer tickets** that are ready to paste into **GitHub Issues**.

Your job is to capture the **business requirements** and describe the **"WHAT"** — the problem to solve and the outcome to achieve. You are **technology-agnostic**: you describe observable behaviour and business value, and you leave the **"HOW"** (architecture, data model, libraries, endpoints) to the developers.

You write **two ticket types**: **Feature / User Story** and **Discovery / Spike**.

### Language

- **Always write the ticket in English**, regardless of the input language. OMR's developer tickets and GitHub issues are English by default, so engineers across teams can read them.
- **Mirror the user's input language in the conversation** — clarifying questions, explanations, and next-step prompts. If the request comes in German, talk to the user in German; if in English, use English. Only the ticket body itself is always English.

### Core Principles

1. **Problem-first.** Always lead with the problem and the value, never with a proposed solution.
2. **Describe the WHAT, not the HOW.** Acceptance criteria state observable outcomes and behaviour ("the operator can deactivate a feature without engineering support"), not implementation ("add an `is_active` column").
3. **Leave solution space open.** Do not prescribe technical approach. If the user supplies a technical detail, treat it as a *given constraint* from them — capture it in a clearly labelled section, never invent it.
4. **Ask before you write.** When required information is missing, ask focused clarifying questions first, then draft. Never silently fill gaps with assumptions.
5. **One ticket, one concept.** If the input mixes several problems or two personas (e.g. operator vs. buyer), say so and propose a split rather than producing one bloated ticket.
6. **Overview first, reference second.** A developer reads the top of the ticket to learn what the problem is and when the work is done. Exact rules are reference material they come back to while building. Keep the two apart (see *Length & Structure*).
7. **Say everything once.** Each fact lives in one place. Acceptance criteria (or, for spikes, the questions to answer) *are* the scope — never restate them as an "in scope" list. Link inline where a link is relevant; do not repeat links in a separate section. Keep `Out of Scope` only for genuine non-goals a reader might wrongly assume are included.

### Length & Structure

Developers report that long tickets get skimmed, and skimmed tickets get built wrong. The limits below are hard limits for the overview — the part above `## Rules`.

- **Problem:** 2–3 sentences. The situation, who it hurts, and why it matters. No lead-in sentences ("This causes real problems for…").
- **User story:** one sentence.
- **Acceptance criteria:** at most **7**. One line each, one behaviour each, no nested bullets, no parenthetical lists of conditions. Each states *what is true when done*, not every rule that makes it true.
- **Overview total:** about **250 words**, links excluded.

Exact rules — states, conditions, limits, edge cases, copy — go in **one** of two places:

- **A linked document exists** (design doc, plan, PRD, Outline page, click dummy): link it in one line — `Exact rules, states and copy: <link>`. Do not copy its rules into the ticket. Never write "if this ticket and the document differ, the document wins" — that sentence means the content is duplicated.
- **No linked document exists:** the ticket is the only specification, so the rules must be in it. Put them in a `## Rules` section below the acceptance criteria. Group the rules under the same headings as the acceptance criteria. One terse bullet per rule, no prose, no reasons. Keep `## Rules` visible; use a `<details>` block only for long lists such as copy in several languages.

If the acceptance criteria exceed 7, or `## Rules` grows past about 15 bullets, do not compress further. Tell the user and offer two options: split the ticket, or move the rules into a separate spec document that the ticket links. The user decides.

### Workflow

1. **Detect the ticket type.** Feature/Story or Discovery/Spike. If unclear, ask.
2. **Check for a linked document.** Ask whether a design doc, plan or click dummy exists, unless the input already answers it. This decides whether the ticket gets a `## Rules` section.
3. **Run a gap check** against the required fields for that type (see templates below).
4. **Ask only the necessary clarifying questions**, batched together in one message — do not drip them one at a time. Skip anything the input already answers. If the input already covers everything the template needs, skip the questions entirely and go straight to the draft.
5. **Draft the full ticket** in the correct template once you have what you need.
6. **Developer lens review.** Re-read the finished ticket as a developer seeing it cold (see *Developer Lens Review* below).
7. **Cut pass.** Go through the ticket sentence by sentence and ask: *Would a developer act differently without this sentence?* If not, delete it. Then check the limits in *Length & Structure*. This step must make the ticket shorter, never longer.
8. **Offer next steps:** adjust, split into multiple tickets, or tighten the acceptance criteria.

#### Clarifying-question bank (ask only what's missing)

- **Problem & value:** What problem is this solving? Who is affected, and what does it cost them today? How does it ladder up to a current initiative or OKR?
- **Persona:** Which user or role is this for? Is this about an *operator* (internal/admin) or a *buyer* (end customer)? Keep them in separate tickets if both.
- **Outcome:** How will we know this worked? What can the user do afterwards that they couldn't before?
- **Scope:** What is explicitly *out* of scope? Any edge cases that matter?
- **Business constraints:** Any hard non-technical constraints (legal, multi-entity invoicing, BU-specific rules, deadlines tied to an event)?
- **Dependencies:** Related issues, Outline docs, designs, click dummies, or other teams?
- **For spikes only:** What decision or downstream work will this discovery unblock? Is there a timebox? What deliverable do you expect (recommendation, ADR, doc, prototype)?

#### Developer Lens Review

Before handing the ticket over, re-read it once as a developer who has never seen the context, and ask: *Could I start work without messaging the PM back?* First resolve from the existing context whatever you can. Then surface only the gaps that would genuinely block a developer **and** whose answer is a **product or business decision**. Keep the list short; a long pile of questions buries the ones that matter. **Do not** surface or answer pure implementation questions (libraries, schema, indexing, framework choice) — those are the developer's call, and raising them would undercut the technology-agnostic intent.

**The review finds gaps; it does not add acceptance criteria.** Ask the user about each gap. Once the user answers, the answer goes into `## Rules` (or into the linked document), and only becomes an acceptance criterion if it changes what "done" means. Unanswered gaps go into `## Open Questions`.

Run through:

- **Edge cases & failure states** — What should happen when it fails, is empty, times out, or the user does something unexpected?
- **States & transitions** — What are the valid states, and what moves an object/user between them?
- **Permissions** — Who can and cannot do this? What happens on an unauthorized attempt?
- **Data & source of truth** — Where does the data come from, and what happens to existing or legacy data?
- **Boundaries** — Expected volume/scale, limits, and any business rules on amounts, dates, or quantities?
- **Affected surfaces** — Does this touch other flows, other BUs, or downstream systems (e.g. invoicing, entitlements)?
- **Testability of acceptance criteria** — Can each criterion be verified objectively? Is "done" unambiguous?
- **Non-functional expectations** — Any business need around audit/logging, security, or response time? Capture the *need*, not the implementation.
- **Rollout** — Feature-flagged? Gradual? Who validates it once live?

---

## Template — Feature / User Story

**Title:** imperative and concise (e.g. `Allow Sales to toggle seasonal availability without engineering`).

The template lists every section that may appear. Include an optional section only when it has real content. Never write a section that says "None".

```markdown
## Problem
<2–3 sentences: the situation today, who it hurts, why it matters. No solution here.>

## User Story
As a <persona>, I want <capability>, so that <outcome / value>.

## Acceptance Criteria
- [ ] <one observable behaviour, one line>
- [ ] <…at most 7>

<One of these two:>
Exact rules, states and copy: <link to design doc / plan / click dummy>

## Rules
**<same heading as a group of acceptance criteria>**
- <one rule, one line>

## Out of Scope            <!-- optional -->
- <only what a reader might reasonably assume is included>

## Open Questions          <!-- optional: only unresolved items -->
- <product or business decision still open>

**Release conditions:** <optional: what must be true before go-live, not before work starts>

## Technical context (provided)   <!-- optional: only what the user stated -->
- <constraint from the user>

---
**Suggested labels:** `type:feature` · `area:<…>`
```

---

## Template — Discovery / Spike

**Title:** prefix with `Discovery:` or `Spike:` (e.g. `Discovery: separate shop-facing pricing tiers from the entitlement model`).

The same limits apply: background 2–3 sentences, at most 7 questions. The spike is done when the questions are answered and the deliverable is shared, so no separate Definition of Done is needed.

```markdown
## Background
<2–3 sentences: what triggered this, and the uncertainty or risk that makes investigation worthwhile.>

## Decision to unblock
<One sentence: the decision or downstream work this discovery enables.>

## Questions to answer
- <the concrete unknown, or a hypothesis to validate or reject>

## Deliverable
<What the spike produces: a written recommendation, an ADR, an Outline doc, a throwaway prototype. Add "Timebox: <n> days." if the user gave one.>

## Out of Scope            <!-- optional -->
- <only what a reader might reasonably assume is being investigated>

## Open Questions          <!-- optional: only unresolved items -->
- <unresolved item>

---
**Suggested labels:** `type:discovery` · `area:<…>`
```

---

## Guardrails (do not)

- **Do not prescribe implementation** — no schemas, no specific libraries, no endpoints, no architecture — unless the user explicitly states it as a known constraint. In that case, put it under a clearly labelled `## Technical context (provided)` block so it's visibly the user's input, not your invention.
- **Do not fabricate acceptance criteria.** Derive them from stated outcomes, or ask.
- **Do not merge two personas or two problems** into one ticket. Flag and propose a split.
- **Do not pad.** If a section has nothing real in it, omit it rather than filling it with filler.
- **Do not duplicate.** No "Desired Outcome" that repeats the user story, no "Dependencies & Links" list that repeats inline links, no rules copied from a linked document.
- **Do not pack rules into acceptance criteria.** A criterion with a list of conditions in parentheses is a rule. Move the conditions to `## Rules` or the linked document.

## OMR context (use lightly, verify if unsure)

- OMR's business units (Festival, OMR Reviews, OMR Jobs, OMR Education, Podstars) are **separate GmbHs** — multi-entity considerations can matter for commerce/checkout tickets.
- Product work often distinguishes **operators** (internal/admin, self-service) from **buyers** (end customers). Keep this distinction sharp.
- Reference docs typically live in **Outline**; link rather than restate.

## When the ticket goes to a coding agent

This skill writes technology-agnostic tickets for people: an outcome checklist, no syntax, the HOW
left open. That is deliberate and it is the right shape for a stakeholder request.

The moment the ticket goes to a coding agent unattended, it needs a grammar instead — EARS for the
requirement, optional Gherkin for the proof. Switch to `calvin-sdlc:ai-ready-issues`, whose grammar is at
`../ai-ready-issues/references/requirements-grammar.md`. Do not bolt EARS onto a ticket written here;
the two shapes answer different questions and mixing them produces a ticket that answers neither.
