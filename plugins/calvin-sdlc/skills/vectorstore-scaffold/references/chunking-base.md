# Chunker Base Templates

## base.py — ABC

```python
from __future__ import annotations

from abc import ABC, abstractmethod


class Chunker(ABC):
    """Base interface for chunking strategies."""

    @abstractmethod
    def split(self, text: str) -> list[str]:
        """Split input text into semantically meaningful chunks."""
        pass
```

## factory.py — ChunkerFactory

```python
from __future__ import annotations

from typing import Any

from .base import Chunker


class ChunkerFactory:
    """Factory for creating chunking strategy instances."""

    @classmethod
    def create(cls, strategy: str, **kwargs: Any) -> Chunker:
        """Create chunker based on strategy.

        Args:
            strategy: Chunking strategy ('recursive', 'semantic')
            **kwargs: Strategy-specific parameters
                - 'recursive': size, overlap, min_chunk_size, use_tokens, token_encoding
                - 'semantic': api_key, model, breakpoint_threshold_type, breakpoint_threshold_amount
        """
        match strategy.lower():
            case "recursive":
                from .strategies.recursive import RecursiveChunkerStrategy
                return RecursiveChunkerStrategy(**kwargs)
            case "semantic":
                from .strategies.semantic import SemanticChunkerStrategy
                return SemanticChunkerStrategy(**kwargs)
            case _:
                raise ValueError(f"Unknown chunking strategy: {strategy}")
```

## chunking/__init__.py

```python
from .base import Chunker
from .factory import ChunkerFactory

__all__ = ["Chunker", "ChunkerFactory"]
```

## strategies/recursive.py — Recursive Chunker

```python
from __future__ import annotations

import logging

from langchain_text_splitters import RecursiveCharacterTextSplitter

from ..base import Chunker

logger = logging.getLogger(__name__)

try:
    import tiktoken
    TIKTOKEN_AVAILABLE = True
except ImportError:
    TIKTOKEN_AVAILABLE = False
    logger.warning("tiktoken not available. Falling back to character-based chunking.")


def _create_token_counter(encoding_name: str = "cl100k_base"):
    """Create a token counting function for a given encoding."""
    if not TIKTOKEN_AVAILABLE:
        return len
    try:
        encoding = tiktoken.get_encoding(encoding_name)
    except Exception:
        return len

    def count_tokens(text: str) -> int:
        try:
            return len(encoding.encode(text))
        except Exception:
            return len(text)

    return count_tokens


class RecursiveChunkerStrategy(Chunker):
    def __init__(
        self,
        size: int = 512,
        overlap: int = 64,
        min_chunk_size: int = 128,
        separators: list[str] | None = None,
        use_tokens: bool = True,
        token_encoding: str = "cl100k_base",
    ) -> None:
        if min_chunk_size >= size:
            raise ValueError(f"min_chunk_size ({min_chunk_size}) must be < size ({size})")
        if overlap >= size:
            raise ValueError(f"overlap ({overlap}) must be < size ({size})")

        self.use_tokens = use_tokens
        self.min_chunk_size = min_chunk_size

        if use_tokens:
            self._length_function = _create_token_counter(token_encoding)
        else:
            self._length_function = len

        self.splitter = RecursiveCharacterTextSplitter(
            chunk_size=size,
            chunk_overlap=overlap,
            separators=separators,
            length_function=self._length_function,
        )

    def split(self, text: str) -> list[str]:
        if not text or not text.strip():
            return []

        docs = self.splitter.create_documents([text])
        chunks = [doc.page_content for doc in docs]

        filtered = []
        for chunk in chunks:
            stripped = chunk.strip()
            if stripped and self._length_function(stripped) >= self.min_chunk_size:
                filtered.append(stripped)

        return filtered
```

## strategies/semantic.py — Semantic Chunker

```python
from __future__ import annotations

import logging

from ..base import Chunker

logger = logging.getLogger(__name__)


class SemanticChunkerStrategy(Chunker):
    """Semantic-based text chunking using embeddings."""

    def __init__(
        self,
        api_key: str,
        model: str = "gemini-embedding-001",
        breakpoint_threshold_type: str = "percentile",
        breakpoint_threshold_amount: float = 95,
    ) -> None:
        try:
            from langchain_google_genai import GoogleGenerativeAIEmbeddings
        except ImportError:
            raise RuntimeError("langchain-google-genai required for semantic chunking")

        try:
            from langchain_text_splitters import SemanticChunker
        except ImportError:
            try:
                from langchain_experimental.text_splitter import SemanticChunker
            except ImportError:
                raise RuntimeError("SemanticChunker not available. Use 'recursive' instead.")

        embeddings = GoogleGenerativeAIEmbeddings(model=model, google_api_key=api_key)
        self.splitter = SemanticChunker(
            embeddings=embeddings,
            breakpoint_threshold_type=breakpoint_threshold_type,
            breakpoint_threshold_amount=breakpoint_threshold_amount,
        )

    def split(self, text: str) -> list[str]:
        if not text or not text.strip():
            return []
        docs = self.splitter.create_documents([text])
        return [chunk.strip() for doc in docs if (chunk := doc.page_content.strip())]
```

## strategies/__init__.py

```python
__all__ = []

try:
    from .recursive import RecursiveChunkerStrategy
    __all__.append("RecursiveChunkerStrategy")
except ImportError:
    pass

try:
    from .semantic import SemanticChunkerStrategy
    __all__.append("SemanticChunkerStrategy")
except ImportError:
    pass
```
