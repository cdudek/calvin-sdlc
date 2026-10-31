# EmbeddingModel Base Templates

## base.py — ABC

```python
from __future__ import annotations

from abc import ABC, abstractmethod


class EmbeddingModel(ABC):
    """Base interface for embedding models."""

    @abstractmethod
    def embed(self, text: str) -> list[float]:
        """Generate embedding for a single text."""
        pass

    @abstractmethod
    def embed_batch(self, texts: list[str]) -> list[list[float]]:
        """Generate embeddings for multiple texts."""
        pass

    @property
    @abstractmethod
    def dimension(self) -> int:
        """Get embedding dimension."""
        pass
```

## factory.py — EmbeddingModelFactory

```python
from __future__ import annotations

from typing import Any

from .base import EmbeddingModel


class EmbeddingModelFactory:
    """Factory for creating embedding model instances."""

    @classmethod
    def create(cls, strategy: str, **kwargs: Any) -> EmbeddingModel:
        """Create embedding model based on strategy.

        Args:
            strategy: Embedding strategy ('gemini', 'openai')
            **kwargs: Strategy-specific parameters
                - 'gemini': requires 'api_key', accepts 'model', 'task_type'
                - 'openai': requires 'api_key', accepts 'model'
        """
        match strategy.lower():
            case "gemini":
                from .models.gemini import GeminiEmbeddingModel
                return GeminiEmbeddingModel(**kwargs)
            case "openai":
                from .models.openai import OpenAIEmbeddingModel
                return OpenAIEmbeddingModel(**kwargs)
            case _:
                raise ValueError(f"Unknown embedding strategy: {strategy}")
```

## embedding/__init__.py

```python
from .base import EmbeddingModel
from .factory import EmbeddingModelFactory

__all__ = ["EmbeddingModel", "EmbeddingModelFactory"]
```

## models/__init__.py

```python
__all__ = []

try:
    from .gemini import GeminiEmbeddingModel
    __all__.append("GeminiEmbeddingModel")
except ImportError:
    pass

try:
    from .openai import OpenAIEmbeddingModel
    __all__.append("OpenAIEmbeddingModel")
except ImportError:
    pass
```
