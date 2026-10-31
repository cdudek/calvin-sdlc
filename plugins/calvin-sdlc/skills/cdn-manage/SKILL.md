---
name: cdn-manage
description: Lightweight CLI interface for the Fastly CDN API. Manages services, domains, backends, cache purging, real-time and historical stats, configuration versioning, and log streaming endpoints. Use when user mentions "Fastly", "CDN", "cache", "purge", "purge cache", "surrogate key", "edge", "POP", "cache hit rate", "Fastly service", "Fastly stats", "Fastly domains", "Fastly backends", "log streaming", or asks about CDN configuration, cache invalidation, or edge delivery.
allowed-tools: "Bash(curl:*)"
user_invocable: true
metadata:
  version: 1.0.0
  author: calvindudek
---

# Fastly CDN Skill

## Important

- **API docs:** https://www.fastly.com/documentation/reference/api/
- **Authentication:** All API calls use `Fastly-Key: $FASTLY_API_KEY` header
- **Base URL:** `https://api.fastly.com`
- **Stats URL:** `https://rt.fastly.com` (real-time stats only)
- Before ANY operation, verify the API key is set: `echo ${FASTLY_API_KEY:+configured}`
- **If not set**, stop and tell the user to add `export FASTLY_API_KEY='your-token-here'` to their shell profile

## Safety Rules

- **Read operations (GET):** Run freely, no confirmation needed
- **Cache purge (single URL / surrogate key):** Run after stating what will be purged
- **Purge ALL:** Always confirm with the user before executing — this clears the entire service cache
- **Configuration writes (create/update/delete domains, backends):** State the change and confirm
- **Version activation:** Always confirm — this pushes config changes live to production

## Core Concepts

### Versioning Workflow

Fastly configuration is version-controlled. You cannot modify active config directly:

1. **Clone** the active version to create a new draft
2. **Modify** domains, backends, VCL, etc. on the draft version
3. **Activate** the new version to push changes live

```bash
# Clone active version (returns new version number)
curl -s -X PUT "https://api.fastly.com/service/{service_id}/version/{active_version}/clone" \
  -H "Fastly-Key: $FASTLY_API_KEY" | jq '.number'

# Activate a version
curl -s -X PUT "https://api.fastly.com/service/{service_id}/version/{version}/activate" \
  -H "Fastly-Key: $FASTLY_API_KEY" | jq '.number'
```

### Service IDs

Most operations require a `service_id`. List services first to find it:

```bash
curl -s "https://api.fastly.com/service" \
  -H "Fastly-Key: $FASTLY_API_KEY" | jq '.[] | {id, name, type}'
```

## Operations Quick Reference

### 1. Services

```bash
# List all services
curl -s "https://api.fastly.com/service" \
  -H "Fastly-Key: $FASTLY_API_KEY" | jq '.[] | {id, name, type, active_version: .versions[-1].number}'

# Get service details
curl -s "https://api.fastly.com/service/{service_id}/details" \
  -H "Fastly-Key: $FASTLY_API_KEY" | jq .

# Search by name
curl -s "https://api.fastly.com/service/search?name={name}" \
  -H "Fastly-Key: $FASTLY_API_KEY" | jq .
```

### 2. Cache Purging

```bash
# Purge single URL
curl -s -X PURGE "https://www.example.com/path/to/resource" \
  -H "Fastly-Key: $FASTLY_API_KEY"

# Soft purge single URL (marks stale, serves stale while revalidating)
curl -s -X PURGE "https://www.example.com/path/to/resource" \
  -H "Fastly-Key: $FASTLY_API_KEY" \
  -H "Fastly-Soft-Purge: 1"

# Purge by surrogate key
curl -s -X POST "https://api.fastly.com/service/{service_id}/purge/{surrogate_key}" \
  -H "Fastly-Key: $FASTLY_API_KEY"

# Soft purge by surrogate key
curl -s -X POST "https://api.fastly.com/service/{service_id}/purge/{surrogate_key}" \
  -H "Fastly-Key: $FASTLY_API_KEY" \
  -H "Fastly-Soft-Purge: 1"

# Batch purge by surrogate keys (max 256 keys)
curl -s -X POST "https://api.fastly.com/service/{service_id}/purge" \
  -H "Fastly-Key: $FASTLY_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"surrogate_keys": ["key1", "key2", "key3"]}'

# Purge ALL (requires user confirmation!)
curl -s -X POST "https://api.fastly.com/service/{service_id}/purge_all" \
  -H "Fastly-Key: $FASTLY_API_KEY"
```

**Best practice:** Prefer soft purges and surrogate keys over URL purges or purge-all.

### 3. Real-Time Stats

```bash
# Aggregate stats (last 120 seconds, 1s buckets)
curl -s "https://rt.fastly.com/v1/channel/{service_id}/ts/h" \
  -H "Fastly-Key: $FASTLY_API_KEY" | jq '.Data[-1].aggregated'

# Key metrics in aggregated response:
# - requests, hits, miss, errors, status_2xx/3xx/4xx/5xx
# - hit_ratio, bandwidth, resp_header_bytes, resp_body_bytes
```

### 4. Historical Stats

```bash
# Stats for a service (default: last day)
curl -s "https://api.fastly.com/stats/service/{service_id}?from=-1d&to=now&by=hour" \
  -H "Fastly-Key: $FASTLY_API_KEY" | jq '.data'

# Aggregate across all services
curl -s "https://api.fastly.com/stats?from=-7d&to=now&by=day" \
  -H "Fastly-Key: $FASTLY_API_KEY" | jq '.data'

# Field stats (specific metrics only)
curl -s "https://api.fastly.com/stats/field/hit_ratio?from=-1d&to=now&by=hour&service_id={service_id}" \
  -H "Fastly-Key: $FASTLY_API_KEY" | jq '.data'
```

Time params: `from` and `to` accept Unix timestamps or relative values like `-1d`, `-6h`, `-30m`. Granularity `by`: `minute`, `hour`, `day`.

### 5. Domains

```bash
# List domains for a version
curl -s "https://api.fastly.com/service/{service_id}/version/{version}/domain" \
  -H "Fastly-Key: $FASTLY_API_KEY" | jq '.[] | {name, comment}'

# Check all domains
curl -s "https://api.fastly.com/service/{service_id}/version/{version}/domain/check_all" \
  -H "Fastly-Key: $FASTLY_API_KEY" | jq .

# Add domain (on draft version)
curl -s -X POST "https://api.fastly.com/service/{service_id}/version/{version}/domain" \
  -H "Fastly-Key: $FASTLY_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"name": "www.example.com", "comment": "Primary domain"}'

# Delete domain
curl -s -X DELETE "https://api.fastly.com/service/{service_id}/version/{version}/domain/{domain_name}" \
  -H "Fastly-Key: $FASTLY_API_KEY"
```

### 6. Backends

```bash
# List backends for a version
curl -s "https://api.fastly.com/service/{service_id}/version/{version}/backend" \
  -H "Fastly-Key: $FASTLY_API_KEY" | jq '.[] | {name, address, port, ssl_cert_hostname}'

# Add backend (on draft version)
curl -s -X POST "https://api.fastly.com/service/{service_id}/version/{version}/backend" \
  -H "Fastly-Key: $FASTLY_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"name": "my_origin", "address": "origin.example.com", "port": 443, "use_ssl": true, "ssl_cert_hostname": "origin.example.com"}'

# Update backend
curl -s -X PUT "https://api.fastly.com/service/{service_id}/version/{version}/backend/{backend_name}" \
  -H "Fastly-Key: $FASTLY_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"address": "new-origin.example.com"}'

# Delete backend
curl -s -X DELETE "https://api.fastly.com/service/{service_id}/version/{version}/backend/{backend_name}" \
  -H "Fastly-Key: $FASTLY_API_KEY"
```

### 7. Log Streaming

```bash
# List all logging endpoints for a version (checks multiple types)
for type in s3 gcs bigquery datadog splunk https syslog; do
  echo "--- $type ---"
  curl -s "https://api.fastly.com/service/{service_id}/version/{version}/logging/$type" \
    -H "Fastly-Key: $FASTLY_API_KEY" | jq '.[] | {name, format}'
done

# Get specific logging endpoint
curl -s "https://api.fastly.com/service/{service_id}/version/{version}/logging/{type}/{name}" \
  -H "Fastly-Key: $FASTLY_API_KEY" | jq .
```

Common log endpoint types: `s3`, `gcs`, `bigquery`, `datadog`, `splunk`, `https`, `syslog`, `cloudfiles`, `ftp`, `heroku`, `honeycomb`, `kafka`, `kinesis`, `logentries`, `loggly`, `logshuttle`, `newrelic`, `openstack`, `papertrail`, `pubsub`, `sumologic`.

## Rate Limits

| Operation | Limit |
|-----------|-------|
| Read (GET, HEAD) | 6,000 req/min |
| Write (POST, PUT, DELETE) | 1,000 req/hr |
| Purge (URL/surrogate key) | 100,000 purges/hr |
| Batch surrogate keys | Max 256 keys per request |

Response headers `Fastly-RateLimit-Remaining` and `Fastly-RateLimit-Reset` track your usage. On `429`, wait until the reset timestamp.

## Error Handling

- **401:** Invalid or expired API key. Check `$FASTLY_API_KEY`.
- **403:** Token lacks required scope. Check token permissions in the Fastly UI.
- **404:** Service, version, or resource not found. Verify the service_id and version number.
- **409:** Conflict — usually trying to modify a locked (active) version. Clone it first.
- **429:** Rate limited. Check `Fastly-RateLimit-Reset` header.

Always print full response on errors: `jq .` the output to see Fastly's error messages.

Consult `references/api-endpoints.md` for the complete endpoint reference with all resource types and parameters.
Consult `references/common-operations.md` for ready-to-use curl patterns for typical workflows.
