# Deployment Patterns

## Sidecar

Attach a helper container for cross-cutting concerns (logging, TLS, service mesh proxy).

```yaml
# Kubernetes pod
spec:
  containers:
    - name: app
      image: my-service:1.0
    - name: envoy-sidecar        # handles mTLS, retries, circuit breaking
      image: envoyproxy/envoy:v1.28
    - name: log-collector         # ships logs to central aggregator
      image: fluent/fluent-bit:2.2
```

**Use when:** Add infrastructure capabilities without modifying application code.
**Skip when:** Application handles it natively, or not running containers.

---

## Ambassador

Specialized sidecar for outbound connections — handles pooling, TLS, retries to external services.

```
┌──────────────────────────────────┐
│  Pod                             │
│  App ──► Ambassador ─────────────┼──► External Database
│  (localhost:5432)  (pool, TLS)   │
└──────────────────────────────────┘
```

**Use when:** Complex external connectivity (connection limits, client certs, protocol translation).

---

## Blue-Green Deployment

Two identical environments. Deploy to inactive, verify, switch all traffic at once.

```
             ┌──────────────┐
  Traffic ──►│ Load Balancer │
             └──┬───────┬───┘
                │       │
          ┌─────┘       └─────┐
          ▼                   ▼
    ┌──────────┐        ┌──────────┐
    │  Blue    │        │  Green   │
    │  (v1.2)  │        │  (v1.3)  │
    │  ACTIVE  │        │  STANDBY │
    └──────────┘        └──────────┘
```

**Advantage:** Instant rollback — flip router back.
**Trade-off:** Double infrastructure during deployment. DB migrations must be backward-compatible.

---

## Canary Deployment

Route small percentage of traffic to new version, increase gradually if healthy.

```
    95% traffic ──► Stable (v1.2)
     5% traffic ──► Canary (v1.3)

    Monitor: error rate, latency, business metrics
    Healthy: 5% → 25% → 50% → 100%
    Unhealthy: route 100% back to stable
```

**Use when:** High-traffic services, want to limit blast radius.
**Skip when:** Traffic too low for statistical significance, lack observability.
**Implementation:** Kubernetes replica weighting, Istio percentage splits, or Argo Rollouts for automated progressive rollout.
