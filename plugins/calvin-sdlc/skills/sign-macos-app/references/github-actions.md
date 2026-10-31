# Signing in GitHub Actions without leaking the certificate

A Developer ID certificate is a bearer credential: whoever holds the `.p12`
and its password can ship software as you, and revoking it invalidates every
build you have already shipped. That is why the workflow template is shaped
the way it is.

## The five secrets

| Secret | What it is | How to set it |
|---|---|---|
| `MACOS_CERT_P12_BASE64` | certificate + private key | `base64 -i DeveloperID.p12 \| gh secret set MACOS_CERT_P12_BASE64` |
| `MACOS_CERT_PASSWORD` | the `.p12` export password | `gh secret set MACOS_CERT_PASSWORD` (prompts, no echo) |
| `AC_API_KEY_P8_BASE64` | App Store Connect key | `base64 -i AuthKey_XXXX.p8 \| gh secret set AC_API_KEY_P8_BASE64` |
| `AC_API_KEY_ID` | 10-character key id | `gh secret set AC_API_KEY_ID` |
| `AC_API_ISSUER_ID` | issuer UUID | `gh secret set AC_API_ISSUER_ID` |

Pipe from a file or let `gh` prompt. Never pass a secret as a command
argument: arguments land in shell history and are visible to every process on
the machine through `ps`.

The **team id** is not a secret — it is embedded in every binary you ship.
Keep it as a repository variable if you need it.

## Why each part of the workflow exists

**No `pull_request` trigger.** Secrets are not exposed to fork PRs, but a
workflow that *tries* to sign on PRs invites someone to move the trigger later.
Tag pushes only.

**An ephemeral keychain.** `security create-keychain` in `$RUNNER_TEMP`, not
the login keychain. GitHub's macOS runners are ephemeral VMs, but a certificate
imported into a default keychain is visible to every subsequent step in the
job, including third-party actions.

**A keychain password generated in the run.** `openssl rand -base64 32`,
masked with `::add-mask::`. There is nothing to leak from the repository
settings, and nothing to rotate.

**`security set-key-partition-list`.** Without it, `codesign` blocks on a GUI
prompt asking permission to use the key — which no runner can answer, so the
job hangs until it times out. This is the single most common reason CI signing
"just stops".

**`rm -P` on the decoded files.** The `.p12` and `.p8` exist on disk only
between decode and import.

**`if: always()` teardown.** A failed build must not leave a certificate in a
keychain.

**Never `set -x`.** Build logs on a public repository are public. `set -euo
pipefail` gives you the failure behaviour you want; `-x` prints the values of
the variables holding your secrets.

## Alternative: don't put the certificate in CI at all

If you sign rarely, the lowest-risk option is to keep the certificate on one
machine: run `macsign release` locally, then upload the notarized DMG with
`gh release upload`. No secret ever leaves the laptop, and there is no CI
surface to get wrong. CI signing is worth the setup when releases are frequent
or more than one person cuts them.

## Self-hosted runners

Don't. A self-hosted runner that imports a signing certificate gives every
workflow — including ones added by a future contributor — a path to it. If you
must, use a dedicated machine, a separate certificate, and a runner group
restricted to protected branches.
