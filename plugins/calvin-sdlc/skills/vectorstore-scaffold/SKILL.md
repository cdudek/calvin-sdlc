---
name: vectorstore-scaffold
description: Scaffolds provider-agnostic vectorstore patterns — abstract base classes, factories, implementations, chunking, embedding, and config using the proven pattern from vectorstore-sync-outline. Use when user says "scaffold vectorstore", "add RAG", "vector store pattern", "embedding abstraction", "chunking strategy", "create vectorstore", "add Qdrant", "add Pinecone", "add embedding model", "provider-agnostic", "factory pattern", or asks to set up vector store infrastructure for a new project.
allowed-tools: "Bash(python3:*)"
user_invocable: true
metadata:
  version: 1.0.0
  author: calvindudek
  source-project: vectorstore-sync-outline
---

# Vectorstore Pattern Scaffolding Skill

Scaffold a provider-agnostic vector store architecture with swappable vectorstore, embedding, and chunking backends. Based on the proven pattern from `vectorstore-sync-outline`.

## Architecture Overview

```
src/
├── config.py                    # Pydantic BaseSettings (env var config)
├── chunking/
│   ├── __init__.py
│   ├── base.py                  # Chunker ABC
│   ├── factory.py               # ChunkerFactory
│   └── strategies/
│       ├── __init__.py
│       ├── recursive.py         # Token/char-based recursive splitting
│       └── semantic.py          # Embedding-based semantic splitting
├── embedding/
│   ├── __init__.py
│   ├── base.py                  # EmbeddingModel ABC
│   ├── factory.py               # EmbeddingModelFactory
│   └── models/
│       ├── __init__.py
│       ├── gemini.py            # Google Gemini embeddings
│       └── openai.py            # OpenAI embeddings
└── vectorstores/
    ├── __init__.py
    ├── base.py                  # VectorStore ABC + SearchResult
    ├── factory.py               # VectorStoreFactory
    └── stores/
        ├── __init__.py
        ├── qdrant.py            # Qdrant implementation
        └── pinecone.py          # Pinecone implementation
```

## Workflow

### Step 1: Gather Requirements

Ask the user:
1. **Where should the vectorstore code live?** (e.g., `src/`, `app/`, `lib/`)
2. **Which vector store providers?** Pick at least one:
   - Qdrant (cloud or local) — env: `QDRANT_ENDPOINT`, `QDRANT_API_KEY`
   - Pinecone — env: `PINECONE_API_KEY`, `PINECONE_INDEX_NAME`
3. **Which embedding providers?** Pick at least one:
   - Google Gemini (`gemini-embedding-001`, 3072 dimensions) — env: `GEMINI_API_KEY`
   - OpenAI (`text-embedding-3-small`, 1536 dimensions) — env: `OPENAI_API_KEY`
4. **Which chunking strategies?**
   - Recursive (token or character-based) — recommended default
   - Semantic (embedding-based boundary detection) — optional
5. **Package manager?** `uv`, `pip`, `poetry`
6. **Existing config system?** If they already use pydantic-settings, merge into existing Settings class

### Step 2: Scaffold Base Abstractions

Always scaffold all three ABCs — they are the foundation. Create in this order:

1. **VectorStore ABC** (`vectorstores/base.py`) — SearchResult dataclass + ABC
2. **EmbeddingModel ABC** (`embedding/base.py`) — embed, embed_batch, dimension
3. **Chunker ABC** (`chunking/base.py`) — split(text) -> list[str]

Consult `references/vectorstore-base.md`, `references/embedding-base.md`, and `references/chunking-base.md` for the exact templates.

### Step 3: Create Factories

Each module gets a factory that maps strategy strings to implementations:

```python
class SomeFactory:
    @classmethod
    def create(cls, strategy: str, **kwargs) -> SomeABC:
        match strategy.lower():
            case "provider_a":
                from .providers.a import ProviderA  # Lazy import
                return ProviderA(**kwargs)
            case _:
                raise ValueError(f"Unknown strategy: {strategy}")
```

### Step 4: Implement Chosen Providers

Only implement the providers the user selected. See `references/provider-implementations.md` for complete templates.

### Step 5: Create Config

Scaffold a Pydantic BaseSettings config grouping settings by component. See `references/config-template.md`.

### Step 6: Wire `__init__.py` Exports

```python
# vectorstores/__init__.py
from .base import SearchResult, VectorStore
from .factory import VectorStoreFactory
__all__ = ["VectorStore", "SearchResult", "VectorStoreFactory"]

# embedding/__init__.py
from .base import EmbeddingModel
from .factory import EmbeddingModelFactory
__all__ = ["EmbeddingModel", "EmbeddingModelFactory"]

# chunking/__init__.py
from .base import Chunker
from .factory import ChunkerFactory
__all__ = ["Chunker", "ChunkerFactory"]
```

### Step 7: Add Dependencies

| Provider | Package | Install |
|----------|---------|---------|
| Qdrant | `qdrant-client` | `uv add qdrant-client` |
| Pinecone | `pinecone` | `uv add pinecone` |
| Gemini Embeddings | `langchain-google-genai` | `uv add langchain-google-genai` |
| OpenAI Embeddings | `openai` | `uv add openai` |
| Recursive Chunking | `langchain-text-splitters`, `tiktoken` | `uv add langchain-text-splitters tiktoken` |
| Semantic Chunking | `langchain-text-splitters` | `uv add langchain-text-splitters` |
| Config | `pydantic-settings` | `uv add pydantic-settings` |

Always also add: `pydantic>=2.0`

### Step 8: Create `.env.example`

Generate a `.env.example` with all required env vars based on chosen providers.

## Design Principles

1. **ABCs first** — every component is accessed through its abstract interface
2. **Factories for construction** — callers never import concrete classes
3. **Strategy string from config** — providers swappable without code changes
4. **Upsert semantics** — `add_document()` creates or updates
5. **Metadata filtering** — `search()` and `delete()` support metadata filter dicts
6. **Clean None handling** — strip None values from metadata before storing
7. **Deterministic IDs** — for Qdrant, use UUID5 from string IDs
8. **Lazy imports** — implementations only import their SDK at class level

## Adding a New Provider

1. Create `stores/new_provider.py` (or `models/` or `strategies/`)
2. Implement the ABC
3. Add a `case` to the factory's `match` statement
4. Add the strategy string to the config's `Literal` type
5. Update `__init__.py` exports

No other code changes required — all callers go through the factory.

## Reference Files

- `references/vectorstore-base.md` — VectorStore ABC, SearchResult, VectorStoreFactory
- `references/embedding-base.md` — EmbeddingModel ABC, EmbeddingModelFactory
- `references/chunking-base.md` — Chunker ABC, ChunkerFactory, RecursiveChunker, SemanticChunker
- `references/config-template.md` — Pydantic BaseSettings config + .env.example
- `references/provider-implementations.md` — Qdrant, Pinecone, Gemini, OpenAI implementations
