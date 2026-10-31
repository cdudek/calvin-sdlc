---
name: distributed-patterns
description: >-
  Microservice and distributed system patterns — Strangler Fig, Saga, CQRS, event sourcing,
  circuit breakers, API gateway, BFF and deployment strategies. Use when someone says "microservice",
  "distributed system", "saga pattern", "circuit breaker", "CQRS", "event sourcing", "canary",
  "blue-green", "outbox", "message queue", or breaking up a monolith. Skip for in-process
  OOP/SOLID/GoF patterns (design-patterns) and architecture audits (architecture-review).
allowed-tools: "Read Grep Glob Write Edit"
user_invocable: true
metadata:
  version: 1.0.0
  author: calvindudek
---

# Design Distributed Systems

Reference for microservice architecture, distributed system patterns, and migration strategies.

## How to use this skill

1. **Migration context**: Planning a monolith-to-microservices migration — start with `references/migration-patterns.md`
2. **New system design**: Choosing communication, data, and deployment patterns — see all references
3. **Incident/resilience context**: Adding fault tolerance — see `references/resilience-patterns.md`

Always ask: **"Does this need to be distributed?"** A well-structured monolith beats a poorly designed microservice architecture. Only distribute when you have a concrete scaling, deployment, or team autonomy need.

See `references/migration-patterns.md` for Strangler Fig, Branch by Abstraction, Parallel Run.
See `references/communication-patterns.md` for sync/async, API Gateway, BFF.
See `references/data-patterns.md` for Database per Service, Saga, CQRS, Event Sourcing, Outbox.
See `references/resilience-patterns.md` for Circuit Breaker, Bulkhead, Retry, Timeouts.
See `references/deployment-patterns.md` for Sidecar, Blue-Green, Canary.
