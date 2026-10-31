# Gang of Four Patterns — Most Commonly Used

## Creational Patterns

### Factory Method

**Purpose:** Define an interface for creating an object, let subclasses/functions decide which class to instantiate.

```python
def create_notification(channel: str) -> Notification:
    match channel:
        case "email": return EmailNotification()
        case "sms": return SMSNotification()
        case _: raise ValueError(f"Unknown channel: {channel}")
```

**Use when:** Object creation logic is complex or varies by context. **Skip when:** Only one implementation exists.

### Abstract Factory

**Purpose:** Create families of related objects without specifying concrete classes.

**Use when:** You need a consistent family of related objects (e.g., payment provider with client + webhook handler + refund processor). **Skip when:** Objects in the family are unrelated.

### Builder

**Purpose:** Construct complex objects step by step with fluent API.

```python
query = (
    QueryBuilder("orders")
    .where("status = 'active'")
    .order_by("created_at DESC")
    .limit(50)
    .build()
)
```

**Use when:** Object has many optional parameters. **Skip when:** Few required parameters, no optional ones.

### Singleton

**Purpose:** Ensure exactly one instance exists.

**Almost always prefer DI instead:**
```python
# Module-level singleton via DI — testable, explicit
pool = ConnectionPool(dsn=settings.database_url)  # created once in main()
service = OrderService(pool=pool)                  # injected explicitly
```

**Use when:** Connection pools, hardware interfaces. **Skip when:** You can pass it as a constructor parameter (which is almost always).

---

## Structural Patterns

### Adapter

**Purpose:** Convert incompatible interface to expected interface.

```typescript
class MixpanelAdapter implements AnalyticsTracker {
  constructor(private sdk: MixpanelSDK) {}
  trackEvent(name: string, properties: Record<string, unknown>): void {
    this.sdk.track(name, properties);
  }
}
```

**Use when:** Integrating third-party/legacy code. **Skip when:** You control both interfaces.

### Facade

**Purpose:** Simplified interface to a complex subsystem.

```python
class OrderFacade:
    def place_order(self, cart: Cart, payment: PaymentMethod) -> Order:
        """One call hides 4 subsystems."""
        self._inventory.reserve(cart.items)
        charge = self._payment.charge(payment, cart.total)
        shipment = self._shipping.create_shipment(cart.items, cart.address)
        self._notifier.send_confirmation(order)
        return order
```

**Use when:** Clients need a simple entry point. **Skip when:** Clients need fine-grained control.

### Decorator

**Purpose:** Attach behavior dynamically without altering the interface. Stack multiple decorators.

```python
# Stack: caching + logging around a basic HTTP client
client = CachingHttpClient(
    LoggingHttpClient(BasicHttpClient(), logger),
    cache,
)
```

**Use when:** Composable behaviors (logging, caching, retry, auth). **Skip when:** Behavior is always required — put it in the base class.

### Composite

**Purpose:** Tree structures where leaves and branches share the same interface.

**Use when:** Part-whole hierarchies (menus, file systems, pricing rules, UI components). **Skip when:** Structure is flat.

---

## Behavioral Patterns

### Strategy

**Purpose:** Interchangeable algorithms at runtime. (This IS the Open/Closed Principle in action.)

```python
class ShippingStrategy(ABC):
    @abstractmethod
    def calculate_cost(self, weight_kg: float, destination: str) -> Decimal: ...

class DHLShipping(ShippingStrategy): ...
class UPSShipping(ShippingStrategy): ...
```

### Observer

**Purpose:** One-to-many notification — when one object changes, all dependents are notified.

```python
bus = EventBus()
bus.subscribe("order.placed", inventory_service.reserve_stock)
bus.subscribe("order.placed", analytics.track_purchase)
bus.subscribe("order.placed", mailer.send_confirmation)
bus.publish("order.placed", order)
```

**Use when:** Multiple reactions to state changes. **Skip when:** One observer or order matters critically.

### Command

**Purpose:** Encapsulate a request as an object — enables undo, queuing, logging.

```python
class TransferFundsCommand(Command):
    def execute(self) -> None:
        self._from.debit(self._amount)
        self._to.credit(self._amount)

    def undo(self) -> None:
        self._to.debit(self._amount)
        self._from.credit(self._amount)
```

**Use when:** Undo/redo, command queuing, transaction logging. **Skip when:** Simple action that doesn't need reversal.

### Template Method

**Purpose:** Fixed algorithm skeleton, subclasses override individual steps.

```python
class DataImporter(ABC):
    def run(self, source: str) -> ImportResult:
        raw = self.fetch(source)
        valid = self.validate(raw)
        transformed = self.transform(valid)
        return self.load(transformed)

    @abstractmethod
    def fetch(self, source: str) -> RawData: ...
    @abstractmethod
    def validate(self, data: RawData) -> ValidData: ...
```

**Use when:** Shared algorithm structure, different step implementations. **Skip when:** Algorithm structure itself varies — use Strategy.

### Iterator

**Purpose:** Sequential access without exposing underlying structure. Especially useful for lazy/paginated access.

```python
class PaginatedAPIIterator:
    def __next__(self) -> dict:
        if not self._buffer:
            self._fetch_next_page()
        return self._buffer.pop(0)

for record in PaginatedAPIIterator(client, "/api/orders"):
    process(record)
```
