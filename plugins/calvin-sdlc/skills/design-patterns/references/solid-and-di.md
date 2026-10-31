# SOLID Principles & Dependency Injection

## Single Responsibility Principle (SRP)

**Rule:** A class should have exactly one reason to change — one job, one owner.

**Violation:**
```python
class UserService:
    def authenticate(self, username: str, password: str) -> bool: ...
    def send_welcome_email(self, user: User) -> None: ...
    def generate_monthly_report(self, user: User) -> Report: ...
```

**Fix:**
```python
class Authenticator:
    def authenticate(self, username: str, password: str) -> bool: ...

class WelcomeMailer:
    def send(self, user: User) -> None: ...

class UserReportGenerator:
    def generate(self, user: User) -> Report: ...
```

---

## Open/Closed Principle (OCP)

**Rule:** Open for extension, closed for modification — add new behavior without editing existing code.

**Violation:**
```python
class PriceCalculator:
    def calculate(self, order: Order) -> Decimal:
        if order.type == "standard":
            return order.subtotal * Decimal("1.19")
        elif order.type == "premium":
            return order.subtotal * Decimal("1.10")
        elif order.type == "employee":  # every new type = edit this method
            return order.subtotal * Decimal("1.0")
```

**Fix:**
```python
class PricingStrategy(ABC):
    @abstractmethod
    def calculate(self, subtotal: Decimal) -> Decimal: ...

class StandardPricing(PricingStrategy):
    def calculate(self, subtotal: Decimal) -> Decimal:
        return subtotal * Decimal("1.19")

# New types = new class, zero edits to existing code
```

---

## Liskov Substitution Principle (LSP)

**Rule:** Subtypes must be usable wherever their parent type is expected without breaking correctness.

**Test:** If the subtype changes the postconditions of any parent method, it violates LSP.

**Classic violation:** `Square extends Rectangle` where setting width silently mutates height. Fix: use a common `Shape` interface with `area()`, or make both immutable value objects.

---

## Interface Segregation Principle (ISP)

**Rule:** No client should be forced to depend on methods it does not use — prefer small, focused interfaces.

**Fix pattern:** Split fat interfaces into role-specific ones, then compose:
```python
class Coder(ABC):
    @abstractmethod
    def write_code(self) -> None: ...

class Reviewer(ABC):
    @abstractmethod
    def review_code(self) -> None: ...

class SeniorDev(Coder, Reviewer): ...
class TechLead(Coder, Reviewer, SprintManager): ...
```

---

## Dependency Inversion Principle (DIP)

**Rule:** High-level modules depend on abstractions, not on concrete low-level implementations.

**Violation:**
```python
class OrderService:
    def __init__(self):
        self.db = PostgresDatabase()       # hardcoded concrete
        self.mailer = SendGridMailer()     # hardcoded concrete
```

**Fix:**
```python
class OrderService:
    def __init__(self, db: Database, mailer: Mailer):
        self.db = db        # depends on abstraction
        self.mailer = mailer # depends on abstraction
```

---

## Dependency Injection

### Constructor Injection (preferred default)

```python
class InvoiceService:
    def __init__(self, repo: InvoiceRepository, tax_calc: TaxCalculator):
        self._repo = repo
        self._tax_calc = tax_calc

# Production
service = InvoiceService(repo=PostgresInvoiceRepository(db_pool), tax_calc=GermanTaxCalculator())

# Test
service = InvoiceService(repo=InMemoryInvoiceRepository(), tax_calc=FlatRateTaxCalculator(rate=Decimal("0.19")))
```

### Method Injection

Use when a dependency varies per call rather than per lifetime:
```python
class ReportGenerator:
    def generate(self, data: ReportData, formatter: ReportFormatter) -> str:
        return formatter.format(data)
```

### DI Container Pattern

Useful in large applications with deep dependency graphs:
```python
from dependency_injector import containers, providers

class Container(containers.DeclarativeContainer):
    config = providers.Configuration()
    db_pool = providers.Singleton(create_pool, dsn=config.database_url)
    invoice_repo = providers.Factory(PostgresInvoiceRepository, pool=db_pool)
    invoice_service = providers.Factory(InvoiceService, repo=invoice_repo, tax_calc=tax_calc)
```

### When DI Is Overkill

- **Simple scripts/CLI tools** — construct dependencies in `main()`
- **Pure functions** — nothing to inject
- **Prototype code** — hardcode until design stabilizes

**Rule of thumb:** If `main()` grows past ~30 lines of wiring, consider a container.
