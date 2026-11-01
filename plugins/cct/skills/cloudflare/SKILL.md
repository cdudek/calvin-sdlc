---
name: cloudflare
description: Runs the Cloudflare API and wrangler against Calvin's Cloudflare account with the token from ~/.zshrc, without ever reading or printing it. Use whenever the user mentions Cloudflare, a zone or nameservers on Cloudflare, Cloudflare DNS records, proxying a site, SSL modes, Workers or wrangler, Pages, R2, cache or page rules, Origin or Transform rules, the CF-IPCountry country header, or asks to list, inspect, create or change anything in Cloudflare. Skip for AWS Route53 or CloudFront (use the aws skill) and for Vercel or Google Cloud.
---

# Cloudflare

Every Cloudflare call goes through the wrapper in this skill's base directory, never bare `curl` with a token and never bare `wrangler`:

```bash
<base>/scripts/cf GET /zones                                   # the v4 API; METHOD /path [json-body | @file.json]
<base>/scripts/cf GET "/accounts/{account}/workers/scripts"    # {account} becomes the account ID
<base>/scripts/cf wrangler deploy                              # wrangler with the token and account in its env
```

The wrapper reads `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` from `~/.zshrc` through an interactive zsh, sends the token as a header from stdin (so it never appears in `ps` or an error), and prints the raw JSON response. Pipe it to `jq` to keep output small: every response has `.success`, `.errors`, `.result`.

## Start of every session

```bash
<base>/scripts/cf GET "/accounts/{account}/tokens/verify" | jq '{ok:.success, status:.result.status}'
<base>/scripts/cf GET /zones | jq -c '[.result[] | {name, id, status, plan:.plan.name}]'
```

The first shows the token works; the second lists the zones it can see and their ids, which every zone call needs. If the wrapper says "not exported", the user adds the two exports to `~/.zshrc`. If a call returns `Authentication error` or code 10000, the token lacks that permission: name the permission, do not look for another token.

## Rules

- **Never read `~/.zshrc`, never print the token.** No `cat`, `grep`, `env`, `printenv`, `echo $CLOUDFLARE_*`, `wrangler whoami --json` dumps of secrets, or `set -x` around the wrapper. The account and zone ids are not secret.
- **Read freely:** every `GET`, `wrangler whoami`, `wrangler deployments list`, `wrangler tail`.
- **Ask before any write:** `POST`, `PUT`, `PATCH`, `DELETE`, `wrangler deploy`, `wrangler secret put`, a nameserver change, an SSL mode, a rule. State the exact call, the record or setting before and after, and its effect, then wait for a yes. DNS and SSL changes can take a site or its mail offline, which is why they wait for the user.
- **Never delete** a zone, a DNS record, a Worker or a bucket unless the user named that exact resource in the same turn. Never touch MX, SPF, DKIM, DMARC or `_amazonses` records as a side effect of other work.
- **Before a DNS change, save the zone first:** `GET /zones/ZONE/dns_records/export` into the change's evidence, so the change can be undone record for record.

## Common calls

Zones and DNS (`ZONE` is the zone id from `/zones`):

```bash
<base>/scripts/cf GET "/zones?name=example.com" | jq -r '.result[0].id'
<base>/scripts/cf GET "/zones/ZONE/dns_records?per_page=500" | jq -c '.result[] | {type, name, content, proxied, ttl}'
<base>/scripts/cf GET /zones/ZONE/dns_records/export > zone-before.txt
<base>/scripts/cf POST /zones/ZONE/dns_records '{"type":"CNAME","name":"www","content":"origin.example.net","proxied":true,"ttl":1}'
<base>/scripts/cf PATCH /zones/ZONE/dns_records/RECORD '{"proxied":false}'
<base>/scripts/cf POST "/zones" '{"name":"example.com","account":{"id":"ACCOUNT"},"type":"full"}'   # adding a zone returns the two nameservers the registrar must use
```

Zone settings:

```bash
<base>/scripts/cf GET /zones/ZONE/settings/ssl | jq -r .result.value              # off | flexible | full | strict
<base>/scripts/cf PATCH /zones/ZONE/settings/ssl '{"value":"strict"}'
<base>/scripts/cf PATCH /zones/ZONE/settings/always_use_https '{"value":"on"}'
```

Rules (rulesets API; one entrypoint ruleset per phase and zone):

```bash
<base>/scripts/cf GET /zones/ZONE/rulesets/phases/http_request_origin/entrypoint | jq '.result.rules'          # Origin rules
<base>/scripts/cf GET /zones/ZONE/rulesets/phases/http_request_late_transform/entrypoint | jq '.result.rules'   # request header transforms
<base>/scripts/cf PUT /zones/ZONE/rulesets/phases/http_request_cache_settings/entrypoint @cache-bypass.json     # replaces the whole phase: read it first
```

Workers, from a folder with a `wrangler.toml`:

```bash
<base>/scripts/cf wrangler deploy
<base>/scripts/cf wrangler tail WORKER_NAME
<base>/scripts/cf GET "/accounts/{account}/workers/scripts" | jq -r '.result[].id'
```

## The visitor's country

On a proxied hostname (orange cloud), Cloudflare adds `CF-IPCountry` (ISO 3166 alpha-2, `XX` unknown, `T1` Tor) to every request it forwards; the IP geolocation setting is on by default. Check it with `GET /zones/ZONE/settings/ip_geolocation`. The origin should trust the header only when the request came through Cloudflare, so an origin that is also reachable directly (a `*.run.app` URL) must not use it for anything that matters beyond a display label.

## Cloud Run behind Cloudflare

Cloud Run answers only for its own `*.run.app` host and for hosts it has a domain mapping for. So a proxied record for a custom host must either point at `ghs.googlehosted.com` with the domain mapping kept (Cloudflare passes the original Host; SSL mode `full`, because the mapping's Google certificate renews through that same record and can fail while proxied), or point at the `*.run.app` host with the Host header rewritten to it (an Origin rule's host header override is Enterprise only, so on other plans a small Worker does the rewrite). Say which of the two the change uses before proposing it.

## In scripts

A script calls the wrapper with `subprocess` or `execFile` so the token stays inside it. Never copy the token into a `.env`, a `wrangler.toml` or code; Workers secrets go in with `<base>/scripts/cf wrangler secret put NAME`, which reads the value from stdin.
