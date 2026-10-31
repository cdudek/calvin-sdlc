# VectorStore Base Templates

## base.py — ABC + SearchResult

```python
from __future__ import annotations

from abc import ABC, abstractmethod
from dataclasses import dataclass
from typing import Any


@dataclass
class SearchResult:
    """Result from vector store search."""

    id: str
    score: float
    text: str
    metadata: dict[str, Any]


class VectorStore(ABC):
    """Pure vector store interface — no framework dependencies."""

    @abstractmethod
    def add_document(
        self,
        doc_id: str,
        text: str,
        embedding: list[float],
        metadata: dict[str, Any] | None = None,
    ) -> None:
        """Add a document to the vector store (upsert semantics)."""
        pass

    @abstractmethod
    def search(
        self,
        vector: list[float],
        k: int = 5,
        filter: dict[str, Any] | None = None,
    ) -> list[SearchResult]:
        """Search for similar documents by vector."""
        pass

    @abstractmethod
    def get(self, doc_id: str) -> SearchResult | None:
        """Get a document by ID."""
        pass

    @abstractmethod
    def delete(self, doc_id: str) -> None:
        """Delete a document by ID."""
        pass

    @abstractmethod
    def delete_all(self) -> None:
        """Delete all documents from the vector store."""
        pass
```

## factory.py — VectorStoreFactory

```python
from __future__ import annotations

from typing import Any

from .base import VectorStore


class VectorStoreFactory:
    """Factory for creating vector store instances."""

    @classmethod
    def create(cls, strategy: str, **kwargs: Any) -> VectorStore:
        """Create vector store based on strategy.

        Args:
            strategy: Vector store strategy ('pinecone', 'qdrant')
            **kwargs: Strategy-specific parameters
              - 'pinecone': requires 'index_name', 'api_key'
              - 'qdrant': requires 'index_name', optional 'vector_size' (default: 3072),
                          optional 'endpoint', 'api_key'
        """
        match strategy.lower():
            case "pinecone":
                from .stores.pinecone import PineconeVectorStore

                if "index_name" not in kwargs:
                    raise ValueError("pinecone strategy requires 'index_name'")
                return PineconeVectorStore(
                    index_name=kwargs["index_name"],
                    api_key=kwargs.get("api_key", ""),
                )
            case "qdrant":
                from .stores.qdrant import QdrantVectorStore

                if "index_name" not in kwargs:
                    raise ValueError("qdrant strategy requires 'index_name'")
                return QdrantVectorStore(
                    index_name=kwargs["index_name"],
                    vector_size=kwargs.get("vector_size", 3072),
                    endpoint=kwargs.get("endpoint"),
                    api_key=kwargs.get("api_key"),
                )
            case _:
                raise ValueError(f"Unknown vectorstore strategy: {strategy}")
```

**Note:** The factory uses lazy imports inside each case branch so provider SDKs are only imported when used. This avoids ImportError when a provider's package is not installed.

## vectorstores/__init__.py

```python
from .base import SearchResult, VectorStore
from .factory import VectorStoreFactory

__all__ = ["VectorStore", "SearchResult", "VectorStoreFactory"]
```

## stores/__init__.py

```python
__all__ = []

try:
    from .qdrant import QdrantVectorStore
    __all__.append("QdrantVectorStore")
except ImportError:
    pass

try:
    from .pinecone import PineconeVectorStore
    __all__.append("PineconeVectorStore")
except ImportError:
    pass
```
