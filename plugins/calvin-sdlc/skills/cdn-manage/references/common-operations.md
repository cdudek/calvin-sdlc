# Fastly — Common Operations

Ready-to-use curl patterns for typical workflows. Replace `{service_id}`, `{version}`, etc. with actual values.

All commands assume `$FASTLY_API_KEY` is set in the environment.

## Discovery

### List all services with active version

```bash
curl -s "https://api.fastly.com/service" \
  -H "Fastly-Key: $FASTLY_API_KEY" | \
  jq '.[] | {id, name, active_version: (.versions | map(select(.active)) | .[0].number)}'
```

### Get active version number for a service

```bash
curl -s "https://api.fastly.com/service/{service_id}/details" \
  -H "Fastly-Key: $FASTLY_API_KEY" | \
  jq '.active_version.number'
```

### Full service overview (domains, backends, logging)

```bash
SERVICE_ID="{service_id}"
VERSION=$(curl -s "https://api.fastly.com/service/$SERVICE_ID/details" \
  -H "Fastly-Key: $FASTLY_API_KEY" | jq -r '.active_version.number')

echo "=== Service: $SERVICE_ID, Active Version: $VERSION ==="

echo -e "\n--- Domains ---"
curl -s "https://api.fastly.com/service/$SERVICE_ID/version/$VERSION/domain" \
  -H "Fastly-Key: $FASTLY_API_KEY" | jq '.[] | .name'

echo -e "\n--- Backends ---"
curl -s "https://api.fastly.com/service/$SERVICE_ID/version/$VERSION/backend" \
  -H "Fastly-Key: $FASTLY_API_KEY" | jq '.[] | {name, address, port, use_ssl}'

echo -e "\n--- Health Checks ---"
curl -s "https://api.fastly.com/service/$SERVICE_ID/version/$VERSION/healthcheck" \
  -H "Fastly-Key: $FASTLY_API_KEY" | jq '.[] | {name, host, path, check_interval}'
```

## Cache Purging Workflows

### Purge a single page

```bash
curl -s -X PURGE "https://www.example.com/page-to-purge" \
  -H "Fastly-Key: $FASTLY_API_KEY" | jq .
```

### Soft purge (preferred — serves stale while revalidating)

```bash
curl -s -X PURGE "https://www.example.com/page-to-purge" \
  -H "Fastly-Key: $FASTLY_API_KEY" \
  -H "Fastly-Soft-Purge: 1" | jq .
```

### Purge all content tagged with a surrogate key

```bash
curl -s -X POST "https://api.fastly.com/service/{service_id}/purge/product-123" \
  -H "Fastly-Key: $FASTLY_API_KEY" \
  -H "Fastly-Soft-Purge: 1" | jq .
```

### Batch purge multiple surrogate keys

```bash
curl -s -X POST "https://api.fastly.com/service/{service_id}/purge" \
  -H "Fastly-Key: $FASTLY_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"surrogate_keys": ["product-123", "product-456", "category-7"]}' | jq .
```

### Purge everything (use with extreme caution)

```bash
curl -s -X POST "https://api.fastly.com/service/{service_id}/purge_all" \
  -H "Fastly-Key: $FASTLY_API_KEY" | jq .
```

## Monitoring & Stats

### Quick health check — real-time hit ratio and error rate

```bash
curl -s "https://rt.fastly.com/v1/channel/{service_id}/ts/h" \
  -H "Fastly-Key: $FASTLY_API_KEY" | \
  jq '.Data[-1].aggregated | {
    requests, hits, miss, pass, errors,
    hit_ratio, status_2xx, status_4xx, status_5xx
  }'
```

### Traffic over the last 24 hours (hourly)

```bash
curl -s "https://api.fastly.com/stats/service/{service_id}?from=-1d&to=now&by=hour" \
  -H "Fastly-Key: $FASTLY_API_KEY" | \
  jq '.data[] | {start_time, requests: .requests, hits: .hits, miss: .miss, hit_ratio: .hit_ratio, bandwidth: .bandwidth}'
```

### Weekly traffic summary (daily)

```bash
curl -s "https://api.fastly.com/stats/service/{service_id}?from=-7d&to=now&by=day" \
  -H "Fastly-Key: $FASTLY_API_KEY" | \
  jq '.data[] | {start_time, requests: .requests, hit_ratio: .hit_ratio, status_5xx: .status_5xx}'
```

### Compare hit ratios across all services

```bash
curl -s "https://api.fastly.com/stats?from=-1d&to=now&by=day" \
  -H "Fastly-Key: $FASTLY_API_KEY" | \
  jq '.data | to_entries[] | {service: .key, requests: .value[0].requests, hit_ratio: .value[0].hit_ratio}'
```

### Check error spike — last hour by minute

```bash
curl -s "https://api.fastly.com/stats/service/{service_id}?from=-1h&to=now&by=minute" \
  -H "Fastly-Key: $FASTLY_API_KEY" | \
  jq '.data[] | select(.status_5xx > 0) | {start_time, requests: .requests, status_5xx: .status_5xx, errors: .errors}'
```

## Configuration Changes

### Clone active version, make changes, activate

```bash
SERVICE_ID="{service_id}"

# 1. Get active version
ACTIVE=$(curl -s "https://api.fastly.com/service/$SERVICE_ID/details" \
  -H "Fastly-Key: $FASTLY_API_KEY" | jq -r '.active_version.number')
echo "Active version: $ACTIVE"

# 2. Clone it
NEW_VERSION=$(curl -s -X PUT "https://api.fastly.com/service/$SERVICE_ID/version/$ACTIVE/clone" \
  -H "Fastly-Key: $FASTLY_API_KEY" | jq -r '.number')
echo "New draft version: $NEW_VERSION"

# 3. Make changes (e.g., add a backend)
curl -s -X POST "https://api.fastly.com/service/$SERVICE_ID/version/$NEW_VERSION/backend" \
  -H "Fastly-Key: $FASTLY_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"name": "new_origin", "address": "origin.example.com", "port": 443, "use_ssl": true}' | jq .

# 4. Validate
curl -s "https://api.fastly.com/service/$SERVICE_ID/version/$NEW_VERSION/validate" \
  -H "Fastly-Key: $FASTLY_API_KEY" | jq .

# 5. Activate (pushes live!)
curl -s -X PUT "https://api.fastly.com/service/$SERVICE_ID/version/$NEW_VERSION/activate" \
  -H "Fastly-Key: $FASTLY_API_KEY" | jq '{number: .number, active: .active}'
```

### Add a domain to a service

```bash
# Clone, add domain, activate (same pattern as above)
curl -s -X POST "https://api.fastly.com/service/$SERVICE_ID/version/$NEW_VERSION/domain" \
  -H "Fastly-Key: $FASTLY_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"name": "new.example.com", "comment": "New domain"}' | jq .
```

### Compare two versions (diff what changed)

```bash
SERVICE_ID="{service_id}"
V1="{version_1}"
V2="{version_2}"

echo "--- Version $V1 backends ---"
curl -s "https://api.fastly.com/service/$SERVICE_ID/version/$V1/backend" \
  -H "Fastly-Key: $FASTLY_API_KEY" | jq '[.[] | .name]'

echo "--- Version $V2 backends ---"
curl -s "https://api.fastly.com/service/$SERVICE_ID/version/$V2/backend" \
  -H "Fastly-Key: $FASTLY_API_KEY" | jq '[.[] | .name]'
```

## Log Streaming

### List all logging endpoints across types

```bash
SERVICE_ID="{service_id}"
VERSION="{version}"

for type in s3 gcs bigquery datadog splunk https syslog kafka pubsub kinesis honeycomb newrelic sumologic; do
  RESULT=$(curl -s "https://api.fastly.com/service/$SERVICE_ID/version/$VERSION/logging/$type" \
    -H "Fastly-Key: $FASTLY_API_KEY")
  COUNT=$(echo "$RESULT" | jq 'length')
  if [ "$COUNT" -gt 0 ]; then
    echo "--- $type ($COUNT) ---"
    echo "$RESULT" | jq '.[] | {name, placement, response_condition}'
  fi
done
```

### Get details of a specific logging endpoint

```bash
curl -s "https://api.fastly.com/service/{service_id}/version/{version}/logging/bigquery/{name}" \
  -H "Fastly-Key: $FASTLY_API_KEY" | jq .
```

## Edge Dictionaries

### List dictionaries and their items

```bash
SERVICE_ID="{service_id}"
VERSION="{version}"

curl -s "https://api.fastly.com/service/$SERVICE_ID/version/$VERSION/dictionary" \
  -H "Fastly-Key: $FASTLY_API_KEY" | \
  jq -r '.[] | .id + " " + .name' | while read DICT_ID DICT_NAME; do
    echo "--- $DICT_NAME ($DICT_ID) ---"
    curl -s "https://api.fastly.com/service/$SERVICE_ID/dictionary/$DICT_ID/items" \
      -H "Fastly-Key: $FASTLY_API_KEY" | jq '.[] | {key: .item_key, value: .item_value}'
done
```

### Update a dictionary item (no version change needed)

```bash
curl -s -X PUT "https://api.fastly.com/service/{service_id}/dictionary/{dict_id}/item/{key}" \
  -H "Fastly-Key: $FASTLY_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"item_value": "new-value"}' | jq .
```

## Debugging

### Check what token you're using

```bash
curl -s "https://api.fastly.com/tokens/self" \
  -H "Fastly-Key: $FASTLY_API_KEY" | jq '{id, name, scope, services, expires_at}'
```

### List all Fastly POPs/data centers

```bash
curl -s "https://api.fastly.com/datacenters" \
  -H "Fastly-Key: $FASTLY_API_KEY" | jq '.[] | {code, name, group}'
```

### Validate config before activating

```bash
curl -s "https://api.fastly.com/service/{service_id}/version/{version}/validate" \
  -H "Fastly-Key: $FASTLY_API_KEY" | jq .
```

### Check rate limit status

```bash
curl -s -I "https://api.fastly.com/service" \
  -H "Fastly-Key: $FASTLY_API_KEY" 2>&1 | grep -i "fastly-ratelimit"
```
