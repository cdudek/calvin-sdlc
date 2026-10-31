---
name: gcp-posture-audit
description: Audits a GCP project and its GKE clusters against the six ways one foothold becomes every host — exposed control planes, flat networks, long-lived credentials, plaintext secrets, shared root, and over-privileged AI/dev tooling. Use when the user says "security audit", "audit our GCP", "how exposed are we", "cluster security posture", "are we hardened", or references a breach/ransomware post-mortem. Produces a ranked, evidence-backed report.
user_invocable: true
context: fork
model: sonnet
effort: high
background: false
---

# Audit GCP + GKE posture

Structured around the six doors from the *"Don't Give the Robot Root"* post-mortem (JuroBot,
Hamburg 2026-08): one red door gets an attacker in; five others turn one foothold into every
host. The framing works because it ranks by **blast radius**, not by CVE count.

**Read-only. Never apply, never exec into production, never probe hosts from outside.**

## The six doors → what to check

| Door | Check |
|---|---|
| 🔴 Exposed internal service | admin control planes on public ingress; public API-server endpoint |
| Flat network | NetworkPolicy count + whether anything enforces them |
| Password SSH → long-lived creds | user-managed SA keys; SA-key auth in CI instead of WIF |
| Plaintext secrets | etcd encryption state; secrets in images; secrets in CI as build args |
| Shared root | containers as uid 0; `privileged`; namespace `default` service accounts |
| Root-level AI tools | what identity agents borrow — see below |

## Commands

```bash
# Cluster posture — wrap long output to avoid silent truncation by shell wrappers
gcloud container clusters describe <c> --zone <z> --project <p> --format=json > cluster.json
```

Read from it: `privateClusterConfig.enablePrivateEndpoint`, `masterAuthorizedNetworksConfig`,
`databaseEncryption.state` (`DECRYPTED` = every k8s Secret is base64 in etcd),
`releaseChannel`, `shieldedNodes`, `networkConfig.datapathProvider`, per-pool `autoUpgrade`,
`workloadMetadataConfig`, and each pool's `serviceAccount` + `oauthScopes`.

```bash
# What can the node identity do? This is where an escape lands.
gcloud projects get-iam-policy <p> --flatten="bindings[].members" \
  --filter="bindings.members:<node-sa>" --format="value(bindings.role)"

# Long-lived keys anywhere?
gcloud iam service-accounts list --project <p> --format="value(email)"   # then keys list --managed-by=user

# Public ingress with no auth
kubectl get ingress -A -o custom-columns='NS:.metadata.namespace,HOST:.spec.rules[*].host,MW:.metadata.annotations.traefik\.ingress\.kubernetes\.io/router\.middlewares'

# Databases
gcloud sql instances list --project <p> \
  --format="table(name,settings.ipConfiguration.ipv4Enabled,settings.ipConfiguration.sslMode,settings.backupConfiguration.enabled)"
```

## Precision rules — each of these was nearly a wrong finding

- **"Unauthenticated" vs "no ingress-level auth."** Admin UIs published to the internet usually
  still have their own login. Say *"highest-value control planes, public, on a cluster with no
  network segmentation — one auth-bypass CVE is fleet-wide."* Calling them unauthenticated is
  wrong and gets the real finding dismissed in the first five minutes.
- **Workload Identity does not neutralise a privileged container.** It blocks *pods* from the
  node token, not a process that escaped to the host namespace.
- **`networkPolicyConfig: disabled` may be correct.** With Dataplane V2 the Calico addon is
  supposed to be off. Check `datapathProvider` before reporting.
- **A public IP with an empty authorized-networks list is not reachable.** Report it as
  unnecessary surface, not as an open database.
- **Distinguish first-party from third-party.** A fleet "28% hardened" that is entirely upstream
  Helm charts means the org's own workloads are at 0%. Report both numbers.
- **Check whether the scanner covers your own images**, not just that a scanner exists.
- **Verify before escalating.** Compare a suspicious stale artifact against live state before
  calling it an incident.

## The AI-tooling door — the one people skip

The post-mortem's actual lesson is not "don't install Cursor on a prod box":

1. **No coding agent on a production host.** If a deploy path needs one, that path is the bug.
2. **An agent's blast radius is the identity it borrows.** An agent on a laptop inherits that
   human's `gcloud` ADC. If a person can reach production without a second factor, so can any
   agent they run. Scope humans accordingly — that *is* the control.
3. **CI agents:** `pull_request`, never `pull_request_target`, on any workflow reading fork code.
   Third-party actions pinned to a commit SHA. Explicit read-only `--allowedTools`, never a
   blanket `Bash`. Prefer org-owned actions — an action from a personal account puts one
   individual in a production repo's trust chain.
4. **Agent-facing gateways (MCP servers) are production services** — dedicated runtime identity,
   never a shared or primitive-role SA. Its permissions are the blast radius of every prompt.

Say plainly if the audit itself was performed by an agent using the operator's credentials. It
demonstrates the point better than any recommendation.

## Report structure

1. **Bottom line** — how many doors are open, and the single worst *chain* (not config).
2. **Severity table** — Critical/High/Medium, ranked by blast radius.
3. **Per-finding** — evidence (real command output), the chain with each link verified, the fix.
4. **Positive controls** — what is right and must not regress. Credit is what makes the report
   credible.
5. **Recommendations** ordered by risk-removed ÷ effort, naming the one *structural* fix that
   makes a class of findings unrepeatable rather than re-fixed.
6. **Reproduction commands**, so anyone can re-run it.

Tables must be phrased so **✓ = good** on every row. A table mixing "has non-root ✗" with "has
creds in ENV ✓" is unreadable and *will* be misread by an exec.

## Do not

- Probe, scan, or fuzz any host — including your own org's — without a stated engagement.
- Present a config list as an audit. If you cannot name the chain from foothold to impact, you
  have a checklist, not a finding.
