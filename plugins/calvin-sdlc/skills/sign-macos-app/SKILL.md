---
name: sign-macos-app
description: Sign, notarize and staple a macOS .app with a Developer ID certificate, locally or in GitHub Actions, using the bundled `macsign` CLI. Use this whenever someone mentions code signing, codesign, notarization, notarytool, stapling, Gatekeeper, "unidentified developer", "damaged and can't be opened", hardened runtime, entitlements, a .p12 or .p8 key, Developer ID, an ad-hoc signature, or wants to ship, distribute or release a Mac app, DMG or menu bar app to other people — even when they only say "make the download warning go away" or "can we sign this". Also use when wiring signing secrets into CI, since the safe handling of a signing certificate on a runner is the part people get wrong.
---

# Signing and notarizing a macOS app

Shipping a Mac app to anyone else means three separate things, and people
usually discover them one painful step at a time:

1. **Signing** proves who built it. An ad-hoc signature (what most build tools
   emit by default) proves nothing and carries no team identifier.
2. **Notarization** is Apple scanning the signed build and issuing a ticket.
3. **Stapling** attaches that ticket to the artifact so it validates offline.

Skip any one and the user gets "unidentified developer" or "damaged and can't
be opened" — the second message is a lie macOS tells about unsigned apps, and
it sends people hunting for a corrupt download that does not exist.

## The CLI

`scripts/macsign` does all of it. It is dependency-free bash, meant to be read
before it is trusted:

```
macsign doctor               # certificates, tools, credentials - always start here
macsign sign <App.app>       # inside-out signing with the hardened runtime
macsign verify <App.app>     # signature, runtime, ticket, Gatekeeper verdict
macsign dmg <App.app>        # build a disk image
macsign notarize <path>      # submit, wait, staple
macsign release <App.app>    # all of the above in order
macsign ci-init              # scaffold a signed GitHub Actions release
```

Install it once so any project can use it:

```bash
ln -sf ~/.claude/skills/sign-macos-app/scripts/macsign ~/.local/bin/macsign
```

## Start with doctor

Run `macsign doctor` before anything else and read its output with the user.
It answers the three questions that decide whether the rest is even possible:
is there a **Developer ID Application** certificate (an *Apple Development*
certificate cannot ship software outside the App Store), do the tools exist,
and does a notarytool profile already work.

## What only the human can do

These steps need a browser, a physical keychain export, or a password. Walk the
user through them; never try to automate them, and never ask them to paste a
secret into the conversation.

**A Developer ID certificate.** developer.apple.com → Certificates →
Developer ID Application. Requires the Account Holder or Admin role. It lands
in their login keychain.

**An App Store Connect API key for notarization.** App Store Connect → Users
and Access → Integrations → Keys → generate one with the **Developer** role.
The `.p8` downloads exactly once and cannot be re-downloaded. Then, once:

```bash
xcrun notarytool store-credentials "macsign" \
    --key ~/path/AuthKey_XXXXXXXX.p8 --key-id KEYID --issuer ISSUER-UUID
```

Prefer this over an Apple ID plus app-specific password: the key is scoped and
revocable without touching their Apple ID.

**Deleting the key afterwards.** `rm -P` the `.p8` and any `.p12` once they are
in the keychain or in CI secrets. They are bearer credentials — anyone holding
one can sign software as this developer.

## Entitlements, and why to keep them small

The hardened runtime is required for notarization, and it blocks things
interpreted apps rely on. The built-in entitlements cover the common Python
case (libffi's executable trampolines, loading your own unsigned `.so` files).
Each entitlement switches off a protection, so treat the list as a debt: if the
app launches without one, remove it. Pass a custom file with `--entitlements`.

## Order matters

A bundle's signature covers its nested code, so anything signed *after* the
outer bundle invalidates it. `macsign sign` goes libraries → helper
executables → frameworks → bundle. This is also why `--deep` is the wrong tool:
it applies the outer entitlements to nested code and silently skips things it
does not recognise. Apple deprecated it; do not reintroduce it.

## CI

`macsign ci-init` writes `.github/workflows/release-signed.yml` and prints the
exact `gh secret set` commands. Read `references/github-actions.md` before
changing that workflow — it explains the parts that are load-bearing for
security rather than for signing: the ephemeral keychain, the run-generated
keychain password, `set-key-partition-list`, the `if: always()` teardown, and
why there is no `pull_request` trigger.

The short version: a signing certificate on a CI runner must live in a
throwaway keychain that is destroyed in the same job, and no step may ever run
under `set -x`, because that prints secrets into a public build log.

## When notarization fails

Apple's rejection is always readable, and the summary line never contains the
reason:

```bash
xcrun notarytool log <submission-id> --keychain-profile macsign
```

The usual causes, in order: the hardened runtime was not enabled (`--options
runtime`), a nested binary was left unsigned, or a binary has no secure
timestamp (`--timestamp`). All three are things `macsign sign` handles; they
show up when something else in the pipeline re-signed a file afterwards.

## Verifying honestly

"It's signed" is not the claim that matters. `macsign verify` checks the four
things that actually decide whether a stranger can open the app: a Developer ID
authority, a team identifier that is set, the hardened runtime flag, a stapled
ticket, and Gatekeeper's own verdict via `spctl`. Report what it prints rather
than summarising it as "works" — the difference between `source=Notarized
Developer ID` and `source=Unnotarized Developer ID` is the difference between a
clean launch and a scary dialog.
