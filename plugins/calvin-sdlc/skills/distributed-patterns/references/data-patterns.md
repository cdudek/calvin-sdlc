# Data Patterns

## Database per Service

Each microservice owns its data store exclusively. Foundational to service autonomy.

**Rule:** Services expose data through APIs, not shared tables. If Service B needs Service A's data, it calls A's API or subscribes to A's events. Never query another service's database directly.

**Trade-off:** Cross-service queries require API calls or data replication. Lose ACID across services → Saga pattern.

---

## Saga Pattern

Manage distributed transactions as a sequence of local transactions, each with a compensating action.

### Choreography (event-based)

Each service listens for events and decides what to do. No coordinator.

```
Order ──order.created──► Inventory ──stock.reserved──► Payment ──payment.charged──► ✓
```

**Advantage:** Simple, no single point of failure.
**Disadvantage:** Hard to reason about full flow, debugging difficult.

### Orchestration (coordinator-based)

Central saga orchestrator directs each step and handles failures.

```python
class PlaceOrderSaga:
    async def execute(self, order: Order) -> SagaResult:
        try:
            await self.inventory.reserve(order.items)
            await self.payment.charge(order.payment_method, order.total)
            await self.shipping.schedule(order)
            return SagaResult.success(order)
        except PaymentError:
            await self.inventory.release(order.items)  # compensate
            return SagaResult.failure("Payment failed")
```

**Advantage:** Full flow visible in one place, easier to debug.
**Disadvantage:** Orchestrator is coordination bottleneck.

---

## CQRS — Command Query Responsibility Segregation

Separate models for reading and writing. Write model for business logic, read model for query performance.

```
Commands ──► Write Model ──events──► Projector ──► Read Store (denormalized)
                                                        │
Queries ◄───────────────────────────────────────────────┘
```

**Use when:** Read/write patterns are dramatically different, high read-to-write ratio.
**Skip when:** Simple CRUD where read and write models are identical.
**Trade-off:** Eventual consistency between stores, two models to maintain.

---

## Event Sourcing

Store state as append-only events. Current state derived by replaying.

```python
@dataclass(frozen=True)
class MoneyDeposited:
    account_id: str
    amount: Decimal

class BankAccount:
    def __init__(self, events: list[Event]):
        self.balance = Decimal("0")
        for event in events:
            match event:
                case MoneyDeposited(amount=amount):
                    self.balance += amount
```

**Use when:** Audit trail required (finance, compliance), temporal queries, multiple read models.
**Skip when:** Simple CRUD, no audit requirements. Dramatically increases complexity.

---

## Outbox Pattern

Reliable event publishing alongside database writes — solves the dual-write problem.

```
┌─────────────────────────────────────┐
│  Single Database Transaction        │
│  1. INSERT INTO orders (...)        │
│  2. INSERT INTO outbox (event, ...) │
│  COMMIT                             │
└─────────────────────────────────────┘
        │
        ▼
  Outbox Relay (polls or CDC) ──► Message Broker
```

**Use when:** "At least once" delivery for events corresponding to DB writes.
**Implementation hint:** Use Debezium (CDC) to tail the outbox table for near-real-time publishing.
