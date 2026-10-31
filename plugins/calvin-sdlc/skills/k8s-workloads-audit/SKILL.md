---
name: k8s-workloads-audit
description: Audits Kubernetes workloads for securityContext, privileged containers, NetworkPolicy segmentation, Pod Security Admission, service-account and image-pinning hygiene — from manifests or a live cluster. Use when the user says "audit the cluster", "check our k8s security", "are any pods privileged", "review these manifests", "NetworkPolicy audit", "pod security", or asks whether workloads are hardened. Also use before onboarding an app to a shared cluster.
user_invocable: true
context: fork
model: sonnet
effort: high
background: false
---

# Audit Kubernetes workloads

Finds the chain, not just the config. The 2026-08-11 OMR audit's Critical was not a single bad
field — it was `privileged: true` + `CAP_SYS_ADMIN` on a root container, on a node whose service
account held project-wide `compute.admin` + `storage.admin`. Each link was individually
unremarkable. Together they meant RCE in one app reached admin over the whole GCP project.

**Always chase the chain to its end: pod → node → cloud identity.**

## 1. Sweep the workloads

From manifests:
```bash
python3 scripts/check-workload-hygiene.py k8s/     # if the repo has the OMR gate
```

From a live cluster, dump and parse rather than eyeballing:
```bash
kubectl get deploy,sts,ds,rollouts.argoproj.io -A -o json > workloads.json
```

Then compute, per non-system namespace: `privileged`, added capabilities, `runAsNonRoot`,
`allowPrivilegeEscalation`, `readOnlyRootFilesystem`, `capabilities.drop`, `seccompProfile`,
`serviceAccountName == default`, image pinned by `@sha256`.

**Walk `initContainers` too.** A native sidecar (`restartPolicy: Always`) is declared there. In
the audit, every `cloud-sql-proxy` sidecar had `runAsNonRoot` and nothing else — and it was the
container holding the database credential. The app container was hardened; the one with the
secret was not.

## 2. The privilege chain (do this whenever anything is privileged)

`privileged: true` or `CAP_SYS_ADMIN` is a container-escape primitive. Then:

```bash
# what identity do the nodes run as?
gcloud container clusters describe <c> --zone <z> --format="value(nodeConfig.serviceAccount)"
# what can it do?
gcloud projects get-iam-policy <project> --flatten="bindings[].members" \
  --filter="bindings.members:<node-sa>" --format="value(bindings.role)"
```

**Workload Identity does not break this chain.** `GKE_METADATA` stops a *pod* reading the node
token — it does not stop a process that has already escaped into the host namespaces. Do not let
"Workload Identity is on" be used to dismiss a privileged container; state this explicitly,
because it is the first objection you will get.

A node SA should hold registry-read + logging + monitoring. `compute.admin` or `storage.admin`
on a node SA turns any escape into project takeover.

## 3. Network segmentation

```bash
kubectl get networkpolicies -A
kubectl get ns -L pod-security.kubernetes.io/enforce -L pod-security.kubernetes.io/warn
```

Two traps:

- **Enforcement may be absent even when policies exist.** Check the dataplane:
  `datapathProvider: ADVANCED_DATAPATH` (Dataplane V2 / Cilium) enforces natively, and
  `addonsConfig.networkPolicyConfig: {disabled: true}` alongside it is **correct**. On a legacy
  cluster the same `disabled: true` with **no** Dataplane V2 means nothing is enforced at all.
  Do not report the addon flag without checking the dataplane — you will be wrong either way.
- **`podSelector` matching the app's own label is NOT default-deny.** It leaves migrate/backup/
  debug pods in the namespace unrestricted. Only `podSelector: {}` covers the namespace. Also
  check `policyTypes` includes **Egress** — ingress-only policies let a compromised pod reach
  anything.

## 4. Pod Security Admission

No PSA label on a namespace means nothing structurally prevents a privileged pod. Verify a
claimed `enforce` with a server-side dry run — it must say **`forbidden`**, not `Warning`:

```bash
kubectl -n <ns> run psa-probe --image=nginx --dry-run=server -o name
```

`Warning: … would violate …` followed by `pod/psa-probe created (server dry run)` means **warn**,
not enforce. Flipping to `enforce` while a non-conformant app is running takes that app down —
sweep first, flip second.

## 5. Is the scanner actually scanning?

If an in-cluster scanner (trivy-operator etc.) is present, verify its **coverage**, not its
presence:

```bash
kubectl get vulnerabilityreports -A -o jsonpath='{range .items[*]}{.report.registry.server}{"\n"}{end}' | sort | uniq -c
```

Compare against the registries the cluster actually pulls from. Real finding: 150+ reports for
public/GKE images and **zero** for the nine private images the org built — the scanner's
ServiceAccount had no Workload Identity annotation, so every private-registry pull failed
unauthenticated. **A scanner that cannot read your registry is worse than none, because the
dashboard looks populated.** Check its logs for `DENIED` / `Unauthenticated request`.

## Reporting

- Rank by **blast radius**, not by count. One privileged container beats forty missing
  `readOnlyRootFilesystem`.
- State each finding as a chain with each link verified, and say which links you verified live
  versus inferred from manifests.
- Give a **positive-control list** too — what is already right and must not regress.
- If you compare two clusters, use the same script on both so the numbers are comparable, and
  split third-party Helm workloads from first-party ones. A fleet-wide "28% hardened" that is
  entirely upstream charts means the org's own apps are at 0%.

## Do not

- Run `kubectl exec` into production to check something a manifest already answers.
- Port-scan or probe public hosts. Reading cluster objects is an audit; unsolicited scanning is
  not.
- Report a stuck GitOps image-bump PR as a production outage without comparing the bump's target
  sha to the **live** sha *and* the app repo's master HEAD. Superseded bump PRs look identical to
  stalled ones and the difference is a 12-day incident versus nothing.
