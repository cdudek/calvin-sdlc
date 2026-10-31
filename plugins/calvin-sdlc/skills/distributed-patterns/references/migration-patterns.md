# Migration Patterns

## Strangler Fig Pattern

**Purpose:** Incrementally replace a monolith by routing requests to new services one feature at a time.

```
                   ┌──────────────┐
                   │   Reverse    │
  Client ────────► │   Proxy /    │
                   │  API Gateway │
                   └──┬───────┬───┘
                      │       │
            new route │       │ legacy route
                      ▼       ▼
               ┌──────────┐ ┌──────────┐
               │   New    │ │  Legacy  │
               │ Service  │ │ Monolith │
               └──────────┘ └──────────┘
```

**Steps:**
1. Place a proxy in front of the monolith
2. For each feature: build replacement service
3. Redirect that feature's routes to the new service
4. Repeat until monolith handles zero traffic

**Use when:** Working monolith too risky to rewrite at once.
**Skip when:** Monolith is small enough to rewrite in one cycle.
**Trade-off:** Slower but much lower risk. Two systems running in parallel.

---

## Branch by Abstraction

**Purpose:** Replace an internal component by introducing an abstraction layer, building the new implementation behind it, then switching.

**Steps:**
1. Create interface over existing component
2. Update all callers to use the interface (no behavior change)
3. Build new implementation behind same interface
4. Feature-flag the switch
5. Roll out gradually, remove flag and old implementation

**Use when:** Replacing internal components (switching ORMs, replacing cache layer).
**Skip when:** Component is already behind an interface, or replacement is trivial.

---

## Parallel Run / Dark Launching

**Purpose:** Run old and new implementations simultaneously, compare results, build confidence.

```python
class ParallelRunner:
    def search(self, query: str) -> SearchResults:
        old_results = self._old.search(query)
        new_results = self._new.search(query)  # dark: results discarded
        self._compare_and_log(old_results, new_results)
        return old_results  # always return the trusted result
```

**Use when:** Critical data paths (payments, search rankings) where silent regressions are unacceptable.
**Skip when:** Operation has side effects that can't be safely duplicated.
**Trade-off:** Doubles computational cost during parallel run period.
