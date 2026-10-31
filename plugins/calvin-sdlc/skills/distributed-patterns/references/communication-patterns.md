# Communication Patterns

## Synchronous

| Protocol | Use when | Skip when |
|----------|----------|-----------|
| **REST** | CRUD, public APIs, broad compatibility | High-throughput inter-service, need streaming |
| **gRPC** | Service-to-service, performance matters (5-10x smaller than JSON), streaming | Browser clients, simple CRUD |
| **GraphQL** | Multiple clients need different data shapes, eliminate over/under-fetching | Simple APIs, file uploads, caching-heavy |

## Asynchronous

### Event-Driven Architecture

```
Order Service ──publish──► [order.placed] ──consume──► Inventory Service
                                          ──consume──► Notification Service
                                          ──consume──► Analytics Service
```

**Use when:** Multiple downstream reactions, loose coupling, eventual consistency acceptable.
**Skip when:** Need immediate synchronous response.

### Message Queues (Point-to-Point)

One producer, exactly one consumer processes each message. Examples: RabbitMQ, Amazon SQS.
**Use when:** Task distribution, job processing, exactly-once processing.

### Pub/Sub (Fan-Out)

One producer, multiple subscribers each get a copy. Examples: Kafka, Google Pub/Sub, SNS.
**Use when:** Multiple services react to the same event independently.

---

## API Gateway

Single entry point handling auth, rate limiting, routing, TLS termination.

```
  Mobile App ──────►│                   │──► User Service
  Web App ─────────►│   API Gateway     │──► Order Service
  Partner API ─────►│  (Kong / Envoy)   │──► Product Service
                    │                   │──► Search Service
```

**Use when:** Multiple backend services, shield clients from topology.
**Skip when:** Single backend — gateway adds unnecessary latency.
**Trade-off:** Simplifies clients but introduces single point of failure.

---

## Backend for Frontend (BFF)

Separate backend per frontend type, each tailored to that client's needs.

```
  Mobile App ──► Mobile BFF ──► Microservices
  Web SPA    ──► Web BFF    ──► Microservices
```

**Use when:** Clients need significantly different data shapes.
**Skip when:** All clients consume the same data in the same shape.
