---
name: iac-security-review
description: Reviews Terraform/OpenTofu for security defaults and dangerous plans — IAM blast radius, secure-by-default module variables, secrets in state, WIF vs service-account keys, and reading a plan for destroy/replacement before merge. Use when the user says "review this terraform", "IaC security review", "check this plan", "is this IAM too broad", "terraform security", or asks about secure defaults, service accounts, or what a plan will actually do.
user_invocable: true
---

# Review Terraform for security

Two jobs: **the defaults the code sets**, and **what the plan will actually do**. Reviewing only
the diff misses both — a module whose default is insecure ships that default to every future
caller, and a benign-looking diff can plan a destroy.

## 1. Read the plan before anything else

```bash
tofu plan -lock=false -input=false -no-color | tee plan.txt
grep -E 'Plan:|forces replacement|must be replaced|will be destroyed' plan.txt
```

- **`0 to destroy` and no `forces replacement`** is the bar for anything stateful — a database, a
  KMS key, an etcd-encryption binding, a cluster.
- A **module-level `depends_on`** defers every data source inside that module to apply time,
  turning computed values into "known after apply" and forcing spurious destroy/recreate. Prefer
  **resource-level** `depends_on`. This has produced a real spurious KMS-binding replacement.
- ⚠️ **Verify the plan output was not truncated** before trusting it. Grep the captured file for
  `lines truncated`. A wrapper that silently truncates redirected output once hid a
  `Plan: 14 to add` — the most serious finding in that audit — behind an apparently clean file.

## 2. Secure-by-default module variables

The highest-leverage review comment on a module is its **default**, because it applies to every
future caller who does not think about it.

Pattern to insist on: **default secure, opt out explicitly at the call site.**

```hcl
variable "public_ip_enabled" {
  description = "Assign a public IP. Leave false; set true only while an instance lacks private IP/PSC."
  type        = bool
  default     = false          # secure default
}
```

Callers that genuinely need the insecure setting pass it explicitly, with a comment saying why
and what retires it. The exception becomes visible in review instead of being the silent platform
default. Flipping a default without updating existing callers plans a change on live
infrastructure — check the plan says what you expect (e.g. `ssl_mode` changing but `ipv4_enabled`
**not**).

Hardcode, rather than parameterise, anything an ADR makes mandatory. A variable implies a
supported "off".

## 3. IAM blast radius

```bash
gcloud projects get-iam-policy <project> --format=json > iam.json
```

Flag, in order:

- **`roles/owner` / `roles/editor`** on any service account. The GCP default compute SA carrying
  `roles/editor` is a standing finding, not a given.
- **`projectIamAdmin` / `iam.securityAdmin` / `roleAdmin`** — these can grant themselves anything,
  so they are *equivalent to owner*. Say that plainly.
- **A CI service account that is owner-equivalent**, plus **who can assume it**. Check the WIF
  binding's `principalSet`: `attribute.repository/<org>/<repo>` means anyone who can push to that
  repo can assume it. Without a branch/environment condition, a manual-dispatch gate constrains
  the intended path but not an attacker with push access.
- **Node / runtime service accounts** holding `compute.admin` or `storage.admin` — see
  `k8s-workloads-audit` for why that converts a container escape into project takeover.

## 4. No long-lived keys

```bash
for sa in $(gcloud iam service-accounts list --project <p> --format="value(email)"); do
  n=$(gcloud iam service-accounts keys list --iam-account="$sa" --managed-by=user \
        --format="value(name)" --project <p> | wc -l)
  [ "$n" != "0" ] && echo "$sa -> $n user-managed key(s)"
done
```

A user-managed key is a password that never expires, is copyable, and leaves no per-actor audit
trail. Workload Identity Federation is the replacement. Zero keys is an achievable, checkable
state — say so when a project already has it, because it is worth protecting.

## 5. Secrets and state

- No secret **values** in `.tf` or in state. Secret Manager **containers** in Terraform with
  values seeded out-of-band is the correct pattern.
- The documented exception is a value that contains no credential (e.g. a passwordless IAM DSN).
  If a PR claims that exception, verify there is genuinely no credential component.
- Check `.gitignore` covers state files, and that no committed state file is being read as
  authoritative — stale pre-migration state files on disk have misled an audit before.

## 6. Drift is a security control

A daily read-only `plan -detailed-exitcode` that opens an issue on any diff. Without it, live
infrastructure and code diverge silently, people route around the pipeline with console changes,
and a later apply reverts someone's fix. Flag its absence as a finding in its own right.

Note the blind spot: `min_master_version` is a **floor**, so a plan is structurally blind to a
cluster that has upgraded past it. Version drift needs its own check.

## Output format

Findings ranked by blast radius, each with `file:line`, the concrete failure, and the fix. Then:

- **what the plan will do** (`N to add, N to change, N to destroy`, plus any replacement), and
- **what is already right** and must not regress.

State explicitly which findings you verified against live state and which are code-only.

## Do not

- Recommend an IP allowlist as the fix for reaching a private control plane. Identity-based access
  (Connect Gateway / IAP) is the pattern; a distributed team has no static egress IPs.
- Recommend enabling a security feature that does nothing in its default configuration — Binary
  Authorization with an `ALWAYS_ALLOW` policy, or a backup agent with no backup plan, add a live
  dependency for zero benefit. If you recommend it, say what else must land for it to matter.
- Suggest `gcloud` to fix drift in a Terraform-managed resource. That is the doom loop.
