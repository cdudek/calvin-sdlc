# Postmortem Template

Use this template after any SEV-1 or SEV-2 incident. Optional for SEV-3.

---

## Postmortem: [Incident Title]

**Date:** [YYYY-MM-DD]
**Severity:** SEV-[1-4]
**Duration:** [Start time] - [End time] ([total duration])
**Authors:** [Who wrote this postmortem]
**Status:** [Draft | Final]

---

### Summary

[2-3 sentences: what happened, what was the impact, how was it resolved]

### Impact

| Metric | Value |
|--------|-------|
| Duration | [X hours Y minutes] |
| Users affected | [number or percentage] |
| Revenue impact | [estimated, if applicable] |
| Data loss | [none / describe] |
| SLA breach | [yes/no] |

### Timeline (UTC)

| Time | Event |
|------|-------|
| HH:MM | [Detection: how was the issue noticed] |
| HH:MM | [First response action] |
| HH:MM | [Key investigation finding] |
| HH:MM | [Mitigation applied] |
| HH:MM | [Resolution confirmed] |

### Root Cause

[Describe the actual underlying cause. Not "the server crashed" but why it crashed. Go at least two levels deep.]

### Contributing Factors

- [Factor 1: e.g., missing monitoring for connection pool]
- [Factor 2: e.g., recent deploy increased query volume]
- [Factor 3: e.g., no automatic scaling configured]

### Resolution

[What specifically fixed the issue. Include commands, config changes, or code changes if relevant.]

### What Went Well

- [Thing 1: e.g., alert fired within 2 minutes]
- [Thing 2: e.g., clear runbook existed for this failure mode]

### What Went Wrong

- [Thing 1: e.g., took 15 minutes to identify root cause due to missing logs]
- [Thing 2: e.g., no rollback procedure was documented]

### Where We Got Lucky

- [Thing 1: e.g., happened during low-traffic hours]
- [Thing 2: e.g., engineer who built the system happened to be online]

### Action Items

| Action | Owner | Priority | Due | Ticket |
|--------|-------|----------|-----|--------|
| [Specific action] | [Name] | [P1/P2/P3] | [Date] | [Link] |
| [Specific action] | [Name] | [P1/P2/P3] | [Date] | [Link] |
| [Specific action] | [Name] | [P1/P2/P3] | [Date] | [Link] |

### Lessons Learned

[What should change about our systems, processes, or practices to prevent this class of incident? Focus on systemic improvements, not individual actions.]
