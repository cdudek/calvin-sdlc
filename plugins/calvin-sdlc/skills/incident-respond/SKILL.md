---
name: incident-respond
description: Guides structured incident response — declaration, severity classification, communication, timeline tracking, and postmortem generation. Use when user says "incident", "outage", "production down", "service degraded", "postmortem", "post-mortem", "RCA", "root cause analysis", "SEV-1", "SEV-2", or reports a production issue that needs coordinated response.
allowed-tools: "Bash(gh *) Bash(gcloud *)"
user_invocable: true
metadata:
  version: 1.0.0
  author: calvindudek
effort: high
---

# Incident Response

Guides structured incident handling from detection through postmortem. Provides communication templates, timeline tracking, and postmortem generation.

## Instructions

### Step 1: Declare the Incident

Ask the user:
1. **What's happening?** (symptoms observed)
2. **What's affected?** (users, services, data)
3. **When did it start?** (or when was it noticed)
4. **Severity?** (see classification below)

### Step 2: Classify Severity

| Severity | Impact | Response | Example |
|----------|--------|----------|---------|
| **SEV-1 (Critical)** | Core product unusable, data loss, security breach | All hands, immediate response | Main site down, payment processing broken, data leak |
| **SEV-2 (High)** | Major feature broken, significant user impact | Dedicated responder, within 1 hour | Search broken, login intermittent, event registration failing |
| **SEV-3 (Medium)** | Minor feature degraded, workaround exists | Next business day | Dashboard slow, export failing for one format, cosmetic errors |
| **SEV-4 (Low)** | Minimal impact, internal tooling | Scheduled fix | Internal admin tool glitch, non-critical monitoring gap |

### Step 3: Draft Initial Communication

Provide a Slack message for the incident channel. Follow this structure:

```
Incident Declared: [Title]
Severity: SEV-[1-4]
Impact: [Who/what is affected]
Started: [Time] (UTC)
Status: Investigating
Lead: [Name]

What we know:
- [Symptom 1]
- [Symptom 2]

Next update: [Time] (every 30 min for SEV-1/2, every 2 hours for SEV-3/4)
```

### Step 4: Track Timeline

Maintain a running timeline. Each entry:

```
[HH:MM UTC] [Action taken or finding]
```

Example:
```
[14:02 UTC] Alert fired: API latency > 5s on /api/v1/events
[14:05 UTC] Confirmed: 503 errors spiking on event registration endpoint
[14:08 UTC] Identified: Database connection pool exhausted on primary
[14:12 UTC] Mitigation: Increased pool size from 20 to 50, restarting service
[14:18 UTC] Service recovering, error rate dropping
[14:25 UTC] Resolved: Error rate back to baseline
```

### Step 5: Draft Status Updates

For ongoing incidents, provide update templates:

```
Incident Update: [Title]
Status: [Investigating | Identified | Mitigating | Resolved]
Duration: [X minutes/hours]

Update:
- [What changed since last update]

Current action:
- [What we're doing now]

Next update: [Time]
```

### Step 6: Resolve

When the incident is resolved:

```
Incident Resolved: [Title]
Duration: [Total time]
Resolution: [What fixed it]

Summary: [1-2 sentence summary]

Postmortem will follow within [48 hours for SEV-1/2, 1 week for SEV-3].
```

### Step 7: Generate Postmortem

Use the postmortem template from `references/postmortem-template.md`.

Fill in:
- **Timeline** — from the tracked events in Step 4
- **Root Cause** — identify why the defect was possible, not just what triggered it. Dig at least two levels deep.
- **Impact** — quantified where possible (users affected, duration, revenue impact)
- **Action Items** — specific, assignable, with owners and due dates
- **Lessons Learned** — what went well, what didn't, what was lucky

### Step 8: Create Follow-Up Tickets

For each action item, create a Linear issue (if Linear MCP is available) or GitHub issue:

- Title: start with "Post-incident:" for traceability
- Link back to the postmortem document
- Assign an owner and set priority based on severity

## Communication Principles

- **Be honest** — say what you know and what you don't. Never speculate in public updates.
- **Be specific** — "API latency is 5x baseline" not "things are slow"
- **Be timely** — update on schedule even if there's no new information. Say "no update, still investigating"
- **Separate impact from cause** — communicate user impact immediately, root cause when confirmed
- **No blame** — focus on systems and processes, not individuals

## Examples

### Example 1: Production outage
User says: "the main site is down"
Actions:
1. Classify as SEV-1
2. Draft Slack notification
3. Start timeline
4. Guide investigation (check monitoring, logs, recent deploys)
5. Draft resolution message when fixed
6. Generate postmortem
Result: Structured incident response with full documentation

### Example 2: Postmortem for past incident
User says: "write a postmortem for the database outage last Tuesday"
Actions:
1. Ask for timeline details, root cause, impact
2. Fill in postmortem template
3. Suggest action items
4. Create follow-up tickets
Result: Complete postmortem document

### Example 3: Severity assessment
User says: "search is returning wrong results, is this an incident?"
Actions:
1. Assess impact: how many users, how wrong are results, is there a workaround
2. Classify severity (likely SEV-2 or SEV-3)
3. Recommend whether to declare a formal incident or handle as a bug
Result: Clear recommendation with rationale

## Error Handling

### Linear MCP not available
Solution: Create follow-up tickets as GitHub issues using `gh issue create` instead.

### User unsure about severity
Solution: Default to one level higher than you think. It's easier to downgrade than to escalate late.

### Incomplete information for postmortem
Solution: Mark sections as "[TBD - needs input from {team/person}]" and note what's missing.
