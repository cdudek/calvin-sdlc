# Resilience Patterns

## Circuit Breaker

Prevent cascading failures by stopping requests to a failing downstream service.

```
CLOSED ──(failures exceed threshold)──► OPEN
   ▲                                      │
   │                              (timeout expires)
   │                                      ▼
   └────(probe succeeds)──────── HALF-OPEN
                                   │
                          (probe fails)──► OPEN
```

```python
class CircuitBreaker:
    def call(self, func, *args, **kwargs):
        if self._state == "open":
            if time.time() - self._last_failure > self._recovery_timeout:
                self._state = "half-open"
            else:
                raise CircuitOpenError("Failing fast")
        try:
            result = func(*args, **kwargs)
            self._on_success()
            return result
        except Exception:
            self._on_failure()
            raise
```

**Use when:** Any synchronous call to external/downstream service.
**Skip when:** Async messaging (queues have their own backpressure).

---

## Bulkhead

Isolate components so failure in one doesn't exhaust shared resources.

```python
class BulkheadedService:
    def __init__(self):
        self._payment_pool = ThreadPoolExecutor(max_workers=10)
        self._inventory_pool = ThreadPoolExecutor(max_workers=5)
        self._search_pool = ThreadPoolExecutor(max_workers=20)
```

If payment service is slow, it exhausts only its 10 threads — inventory and search remain unaffected.

**Use when:** Multiple downstream dependencies.
**Trade-off:** Lower overall utilization in happy path.

---

## Retry with Exponential Backoff + Jitter

```python
def retry_with_backoff(func, max_retries=3, base_delay=1.0, max_delay=30.0):
    for attempt in range(max_retries + 1):
        try:
            return func()
        except TransientError:
            if attempt == max_retries:
                raise
            delay = min(base_delay * (2 ** attempt), max_delay)
            jitter_delay = random.uniform(0, delay)  # full jitter
            time.sleep(jitter_delay)
```

**Why jitter:** Without it, 1000 clients all retry at t=1, t=2, t=4 — synchronized spikes. Jitter spreads retries.

**Use when:** Transient failures, idempotent operations.
**Skip when:** Non-idempotent ops (without idempotency keys), permanent failures (4xx), auth failures.

---

## Timeout + Deadline Propagation

Set max wait times and propagate remaining budget across service calls.

```python
# Service A sets 5-second deadline
ctx = RequestContext(deadline=now() + timedelta(seconds=5))

# Service A → B, passing remaining time
response_b = service_b.call(data, timeout_ms=ctx.remaining_ms)

# Service B → C with whatever time is left
# If 0 remaining, B returns immediately without calling C
```

**gRPC:** Built-in deadline propagation via metadata.
**REST:** Pass as header `X-Request-Deadline: 2024-01-15T10:00:05Z`.

**Tune timeouts** based on p99 latency, not averages. Too short = false failures. Too long = resource exhaustion.
