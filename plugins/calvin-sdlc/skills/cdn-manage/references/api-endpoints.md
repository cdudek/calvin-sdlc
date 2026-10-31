# Fastly API — Complete Endpoint Reference

## Authentication

All requests use: `Fastly-Key: $FASTLY_API_KEY`

Base URL: `https://api.fastly.com`
Real-time stats URL: `https://rt.fastly.com`

## Services

| Method | Path | Description |
|--------|------|-------------|
| GET | `/service` | List all services |
| GET | `/service/{service_id}` | Get service by ID |
| GET | `/service/{service_id}/details` | Get service with all version details |
| GET | `/service/search?name={name}` | Search service by name |
| POST | `/service` | Create service |
| PUT | `/service/{service_id}` | Update service |
| DELETE | `/service/{service_id}` | Delete service |

### Create/Update Body

```json
{
  "name": "My Service",
  "type": "vcl",
  "comment": "Production CDN"
}
```

## Versions

| Method | Path | Description |
|--------|------|-------------|
| GET | `/service/{service_id}/version` | List all versions |
| GET | `/service/{service_id}/version/{version}` | Get version details |
| POST | `/service/{service_id}/version` | Create new version |
| PUT | `/service/{service_id}/version/{version}` | Update version |
| PUT | `/service/{service_id}/version/{version}/activate` | Activate version |
| PUT | `/service/{service_id}/version/{version}/deactivate` | Deactivate version |
| PUT | `/service/{service_id}/version/{version}/clone` | Clone version |
| GET | `/service/{service_id}/version/{version}/validate` | Validate version config |
| PUT | `/service/{service_id}/version/{version}/lock` | Lock version |

## Domains

| Method | Path | Description |
|--------|------|-------------|
| GET | `/service/{service_id}/version/{version}/domain` | List domains |
| GET | `/service/{service_id}/version/{version}/domain/{name}` | Get domain |
| POST | `/service/{service_id}/version/{version}/domain` | Add domain |
| PUT | `/service/{service_id}/version/{version}/domain/{name}` | Update domain |
| DELETE | `/service/{service_id}/version/{version}/domain/{name}` | Remove domain |
| GET | `/service/{service_id}/version/{version}/domain/check_all` | Check all domains |
| GET | `/service/{service_id}/version/{version}/domain/{name}/check` | Check single domain |

### Domain Body

```json
{
  "name": "www.example.com",
  "comment": "Primary domain"
}
```

## Backends

| Method | Path | Description |
|--------|------|-------------|
| GET | `/service/{service_id}/version/{version}/backend` | List backends |
| GET | `/service/{service_id}/version/{version}/backend/{name}` | Get backend |
| POST | `/service/{service_id}/version/{version}/backend` | Create backend |
| PUT | `/service/{service_id}/version/{version}/backend/{name}` | Update backend |
| DELETE | `/service/{service_id}/version/{version}/backend/{name}` | Delete backend |

### Backend Body (key fields)

```json
{
  "name": "my_origin",
  "address": "origin.example.com",
  "port": 443,
  "use_ssl": true,
  "ssl_cert_hostname": "origin.example.com",
  "ssl_sni_hostname": "origin.example.com",
  "auto_loadbalance": false,
  "weight": 100,
  "max_conn": 200,
  "connect_timeout": 1000,
  "first_byte_timeout": 15000,
  "between_bytes_timeout": 10000,
  "shield": "amsterdam-nl",
  "healthcheck": "my_healthcheck",
  "override_host": "origin.example.com"
}
```

### Common Shield POPs

| POP | Location |
|-----|----------|
| `amsterdam-nl` | Amsterdam, NL |
| `frankfurt-de` | Frankfurt, DE |
| `london_city-uk` | London, UK |
| `paris-fr` | Paris, FR |
| `stockholm-se` | Stockholm, SE |
| `bwi-va-us` | Ashburn, VA, US |
| `dca-dc-us` | Washington, DC, US |
| `jfk-ny-us` | New York, NY, US |
| `lax-ca-us` | Los Angeles, CA, US |
| `sjc-ca-us` | San Jose, CA, US |
| `sea-wa-us` | Seattle, WA, US |
| `tokyo-jp` | Tokyo, JP |
| `singapore-sg` | Singapore, SG |

## Health Checks

| Method | Path | Description |
|--------|------|-------------|
| GET | `/service/{service_id}/version/{version}/healthcheck` | List health checks |
| GET | `/service/{service_id}/version/{version}/healthcheck/{name}` | Get health check |
| POST | `/service/{service_id}/version/{version}/healthcheck` | Create health check |
| PUT | `/service/{service_id}/version/{version}/healthcheck/{name}` | Update health check |
| DELETE | `/service/{service_id}/version/{version}/healthcheck/{name}` | Delete health check |

### Health Check Body

```json
{
  "name": "my_healthcheck",
  "host": "origin.example.com",
  "path": "/health",
  "method": "GET",
  "expected_response": 200,
  "check_interval": 15000,
  "threshold": 3,
  "window": 5,
  "initial": 3
}
```

## Cache Purging

| Method | Path | Description |
|--------|------|-------------|
| PURGE | `{url}` | Purge single URL (send to the actual URL) |
| POST | `/service/{service_id}/purge/{surrogate_key}` | Purge by surrogate key |
| POST | `/service/{service_id}/purge` | Batch purge by surrogate keys |
| POST | `/service/{service_id}/purge_all` | Purge entire service cache |

### Headers

| Header | Value | Effect |
|--------|-------|--------|
| `Fastly-Soft-Purge` | `1` | Soft purge (mark stale, not delete) |
| `Surrogate-Key` | `key1 key2` | Alternative to JSON body for batch purge |

### Batch Purge Body

```json
{
  "surrogate_keys": ["key1", "key2", "key3"]
}
```

Max 256 surrogate keys per batch request.

## Real-Time Stats

Base URL: `https://rt.fastly.com`

| Method | Path | Description |
|--------|------|-------------|
| GET | `/v1/channel/{service_id}/ts/h` | Real-time stats (120s window, 1s buckets) |
| GET | `/v1/channel/{service_id}/ts/h/limit/{max_entries}` | Limited entries |
| GET | `/v1/channel/{service_id}/ts/{start_timestamp}` | Stats from timestamp |

### Key Metrics in Response

| Field | Description |
|-------|-------------|
| `requests` | Total requests |
| `hits` | Cache hits |
| `miss` | Cache misses |
| `pass` | Pass-through (uncacheable) |
| `errors` | Error count |
| `status_2xx` | 2xx responses |
| `status_3xx` | 3xx responses |
| `status_4xx` | 4xx responses |
| `status_5xx` | 5xx responses |
| `hit_ratio` | Cache hit ratio (0.0–1.0) |
| `bandwidth` | Total bandwidth (bytes) |
| `resp_header_bytes` | Response header bytes |
| `resp_body_bytes` | Response body bytes |
| `bereq_header_bytes` | Backend request header bytes |
| `bereq_body_bytes` | Backend request body bytes |
| `miss_time` | Time to first byte on misses (ms) |

## Historical Stats

| Method | Path | Description |
|--------|------|-------------|
| GET | `/stats` | Aggregate stats across all services |
| GET | `/stats/service/{service_id}` | Stats for a service |
| GET | `/stats/service/{service_id}/field/{field}` | Single field stats |
| GET | `/stats/field/{field}` | Single field across all services |
| GET | `/stats/usage` | Usage data (requests, bandwidth) |
| GET | `/stats/usage_by_service` | Usage broken down by service |
| GET | `/stats/regions` | List available POP regions |

### Query Parameters

| Param | Description | Example |
|-------|-------------|---------|
| `from` | Start time (Unix ts or relative) | `-1d`, `-6h`, `1678886400` |
| `to` | End time | `now`, `-1h`, `1678972800` |
| `by` | Granularity | `minute`, `hour`, `day` |
| `region` | Filter by region | `usa`, `europe`, `asia` |
| `service_id` | Filter by service | (for aggregate endpoints) |

## VCL (Varnish Configuration Language)

| Method | Path | Description |
|--------|------|-------------|
| GET | `/service/{service_id}/version/{version}/vcl` | List VCL files |
| GET | `/service/{service_id}/version/{version}/vcl/{name}` | Get VCL content |
| POST | `/service/{service_id}/version/{version}/vcl` | Upload VCL |
| PUT | `/service/{service_id}/version/{version}/vcl/{name}` | Update VCL |
| DELETE | `/service/{service_id}/version/{version}/vcl/{name}` | Delete VCL |
| PUT | `/service/{service_id}/version/{version}/vcl/{name}/main` | Set as main VCL |
| GET | `/service/{service_id}/version/{version}/generated_vcl` | Get generated VCL |

### VCL Upload Body

```json
{
  "name": "main",
  "content": "sub vcl_recv { ... }",
  "main": true
}
```

## VCL Snippets

| Method | Path | Description |
|--------|------|-------------|
| GET | `/service/{service_id}/version/{version}/snippet` | List snippets |
| GET | `/service/{service_id}/version/{version}/snippet/{name}` | Get snippet |
| POST | `/service/{service_id}/version/{version}/snippet` | Create snippet |
| PUT | `/service/{service_id}/version/{version}/snippet/{name}` | Update snippet |
| DELETE | `/service/{service_id}/version/{version}/snippet/{name}` | Delete snippet |

### Snippet Body

```json
{
  "name": "set_cors_headers",
  "type": "deliver",
  "content": "set resp.http.Access-Control-Allow-Origin = \"*\";",
  "priority": 100,
  "dynamic": 0
}
```

Snippet types: `init`, `recv`, `hash`, `hit`, `miss`, `pass`, `fetch`, `error`, `deliver`, `log`, `none`

## Conditions

| Method | Path | Description |
|--------|------|-------------|
| GET | `/service/{service_id}/version/{version}/condition` | List conditions |
| POST | `/service/{service_id}/version/{version}/condition` | Create condition |
| PUT | `/service/{service_id}/version/{version}/condition/{name}` | Update condition |
| DELETE | `/service/{service_id}/version/{version}/condition/{name}` | Delete condition |

### Condition Body

```json
{
  "name": "is_image",
  "type": "REQUEST",
  "statement": "req.url ~ \"\\.(jpg|png|gif|webp)$\"",
  "priority": 10
}
```

Types: `REQUEST`, `CACHE`, `RESPONSE`, `PREFETCH`

## Headers (request/response manipulation)

| Method | Path | Description |
|--------|------|-------------|
| GET | `/service/{service_id}/version/{version}/header` | List headers |
| POST | `/service/{service_id}/version/{version}/header` | Create header |
| PUT | `/service/{service_id}/version/{version}/header/{name}` | Update header |
| DELETE | `/service/{service_id}/version/{version}/header/{name}` | Delete header |

## Logging Endpoints

All logging endpoints follow the same pattern:

```
GET    /service/{service_id}/version/{version}/logging/{type}
GET    /service/{service_id}/version/{version}/logging/{type}/{name}
POST   /service/{service_id}/version/{version}/logging/{type}
PUT    /service/{service_id}/version/{version}/logging/{type}/{name}
DELETE /service/{service_id}/version/{version}/logging/{type}/{name}
```

### Supported Log Endpoint Types

| Type | Service |
|------|---------|
| `s3` | Amazon S3 |
| `gcs` | Google Cloud Storage |
| `bigquery` | Google BigQuery |
| `azureblob` | Azure Blob Storage |
| `cloudfiles` | Rackspace Cloud Files |
| `datadog` | Datadog |
| `digitalocean` | DigitalOcean Spaces |
| `elasticsearch` | Elasticsearch |
| `ftp` | FTP |
| `heroku` | Heroku Logplex |
| `honeycomb` | Honeycomb |
| `https` | HTTPS (generic webhook) |
| `kafka` | Apache Kafka |
| `kinesis` | Amazon Kinesis |
| `logentries` | Logentries |
| `loggly` | Loggly |
| `logshuttle` | Log Shuttle |
| `newrelic` | New Relic Logs |
| `newrelicotlp` | New Relic OTLP |
| `openstack` | OpenStack |
| `papertrail` | Papertrail |
| `pubsub` | Google Pub/Sub |
| `scalyr` | Scalyr/DataSet |
| `sftp` | SFTP |
| `splunk` | Splunk |
| `sumologic` | Sumo Logic |
| `syslog` | Syslog |

### Example: BigQuery Logging Body

```json
{
  "name": "my_bq_logs",
  "project_id": "my-gcp-project",
  "dataset": "fastly_logs",
  "table": "access_logs",
  "template": "",
  "format": "{\"timestamp\":\"%{begin:%Y-%m-%dT%H:%M:%S}t\",\"client_ip\":\"%h\",\"request\":\"%r\",\"status\":%s}",
  "user": "service-account@my-gcp-project.iam.gserviceaccount.com",
  "secret_key": "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n",
  "placement": "none",
  "response_condition": ""
}
```

### Example: S3 Logging Body

```json
{
  "name": "my_s3_logs",
  "bucket_name": "my-fastly-logs",
  "access_key": "AKIAIOSFODNN7EXAMPLE",
  "secret_key": "wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY",
  "path": "/logs/",
  "period": 3600,
  "gzip_level": 9,
  "format": "%h %l %u %t \"%r\" %s %b",
  "message_type": "classic",
  "timestamp_format": "%Y-%m-%dT%H:%M:%S.000",
  "placement": "none",
  "response_condition": ""
}
```

## Dictionaries (Edge Key-Value Store)

| Method | Path | Description |
|--------|------|-------------|
| GET | `/service/{service_id}/version/{version}/dictionary` | List dictionaries |
| GET | `/service/{service_id}/version/{version}/dictionary/{name}` | Get dictionary |
| POST | `/service/{service_id}/version/{version}/dictionary` | Create dictionary |
| DELETE | `/service/{service_id}/version/{version}/dictionary/{name}` | Delete dictionary |
| GET | `/service/{service_id}/dictionary/{dict_id}/items` | List items |
| POST | `/service/{service_id}/dictionary/{dict_id}/item` | Add item |
| PUT | `/service/{service_id}/dictionary/{dict_id}/item/{key}` | Update item |
| DELETE | `/service/{service_id}/dictionary/{dict_id}/item/{key}` | Delete item |
| PATCH | `/service/{service_id}/dictionary/{dict_id}/items` | Batch update items |

### Dictionary Item Body

```json
{
  "item_key": "redirect_url",
  "item_value": "https://new.example.com"
}
```

### Batch Update Body

```json
{
  "items": [
    {"op": "upsert", "item_key": "key1", "item_value": "value1"},
    {"op": "delete", "item_key": "key2"}
  ]
}
```

## ACLs (Access Control Lists)

| Method | Path | Description |
|--------|------|-------------|
| GET | `/service/{service_id}/version/{version}/acl` | List ACLs |
| POST | `/service/{service_id}/version/{version}/acl` | Create ACL |
| DELETE | `/service/{service_id}/version/{version}/acl/{name}` | Delete ACL |
| GET | `/service/{service_id}/acl/{acl_id}/entries` | List entries |
| POST | `/service/{service_id}/acl/{acl_id}/entry` | Add entry |
| DELETE | `/service/{service_id}/acl/{acl_id}/entry/{entry_id}` | Delete entry |
| PATCH | `/service/{service_id}/acl/{acl_id}/entries` | Batch update |

### ACL Entry Body

```json
{
  "ip": "192.168.1.0",
  "subnet": 24,
  "negated": 0,
  "comment": "Office network"
}
```

## Request Settings

| Method | Path | Description |
|--------|------|-------------|
| GET | `/service/{service_id}/version/{version}/request_settings` | List |
| POST | `/service/{service_id}/version/{version}/request_settings` | Create |
| PUT | `/service/{service_id}/version/{version}/request_settings/{name}` | Update |
| DELETE | `/service/{service_id}/version/{version}/request_settings/{name}` | Delete |

## Cache Settings

| Method | Path | Description |
|--------|------|-------------|
| GET | `/service/{service_id}/version/{version}/cache_settings` | List |
| POST | `/service/{service_id}/version/{version}/cache_settings` | Create |
| PUT | `/service/{service_id}/version/{version}/cache_settings/{name}` | Update |
| DELETE | `/service/{service_id}/version/{version}/cache_settings/{name}` | Delete |

### Cache Settings Body

```json
{
  "name": "cache_images",
  "action": "cache",
  "ttl": 86400,
  "stale_ttl": 3600,
  "cache_condition": "is_image"
}
```

Actions: `cache`, `pass`, `restart`

## Response Objects

| Method | Path | Description |
|--------|------|-------------|
| GET | `/service/{service_id}/version/{version}/response_object` | List |
| POST | `/service/{service_id}/version/{version}/response_object` | Create |
| PUT | `/service/{service_id}/version/{version}/response_object/{name}` | Update |
| DELETE | `/service/{service_id}/version/{version}/response_object/{name}` | Delete |

### Response Object Body

```json
{
  "name": "maintenance_page",
  "status": 503,
  "response": "Service Unavailable",
  "content": "<html><body><h1>Under Maintenance</h1></body></html>",
  "content_type": "text/html",
  "request_condition": "is_maintenance"
}
```

## Token Management

| Method | Path | Description |
|--------|------|-------------|
| GET | `/tokens` | List all tokens for current customer |
| GET | `/tokens/self` | Get current token info |
| DELETE | `/tokens/self` | Revoke current token |
| POST | `/tokens` | Create token (username/password auth) |

## Data Centers

| Method | Path | Description |
|--------|------|-------------|
| GET | `/datacenters` | List all Fastly data centers/POPs |
