# Provider Implementations

Complete implementation templates for each supported provider.

## Qdrant — stores/qdrant.py

```python
"""Qdrant vector store implementation."""

from __future__ import annotations

import logging
import uuid
from typing import Any

from qdrant_client import QdrantClient
from qdrant_client.models import (
    Distance,
    FieldCondition,
    Filter,
    MatchValue,
    PointStruct,
    VectorParams,
)

from ..base import SearchResult, VectorStore

logger = logging.getLogger(__name__)

QDRANT_ID_NAMESPACE = uuid.UUID("6ba7b810-9dad-11d1-80b4-00c04fd430c8")


def string_to_uuid(string_id: str) -> uuid.UUID:
    """Convert a string ID to a deterministic UUID using UUID5."""
    return uuid.uuid5(QDRANT_ID_NAMESPACE, string_id)


class QdrantVectorStore(VectorStore):
    """Qdrant vector store implementation."""

    def __init__(
        self,
        index_name: str,
        vector_size: int = 3072,
        endpoint: str | None = None,
        api_key: str | None = None,
    ) -> None:
        if endpoint:
            self.client = QdrantClient(url=endpoint, api_key=api_key)
        else:
            self.client = QdrantClient(host="localhost", port=6333)

        self.collection_name = index_name
        self.vector_size = vector_size
        self._ensure_collection()

    def _ensure_collection(self) -> None:
        collections = self.client.get_collections().collections
        if self.collection_name not in [c.name for c in collections]:
            self.client.create_collection(
                collection_name=self.collection_name,
                vectors_config=VectorParams(size=self.vector_size, distance=Distance.COSINE),
            )

    def add_document(
        self, doc_id: str, text: str, embedding: list[float],
        metadata: dict[str, Any] | None = None,
    ) -> None:
        clean_metadata = {k: v for k, v in (metadata or {}).items() if v is not None}
        point = PointStruct(
            id=string_to_uuid(doc_id),
            vector=embedding,
            payload={"content": text, "metadata": clean_metadata},
        )
        self.client.upsert(collection_name=self.collection_name, points=[point])

    def search(
        self, vector: list[float], k: int = 5,
        filter: dict[str, Any] | None = None,
    ) -> list[SearchResult]:
        qdrant_filter = None
        if filter:
            conditions = [
                FieldCondition(key=f"metadata.{key}", match=MatchValue(value=value))
                for key, value in filter.items()
            ]
            qdrant_filter = Filter(must=conditions)

        response = self.client.query_points(
            collection_name=self.collection_name,
            query=vector, limit=k,
            query_filter=qdrant_filter, with_payload=True,
        )
        return [
            SearchResult(
                id=str(p.id), score=float(getattr(p, "score", 0.0)),
                text=p.payload.get("content", ""),
                metadata=p.payload.get("metadata", {}),
            )
            for p in response.points
        ]

    def get(self, doc_id: str) -> SearchResult | None:
        result = self.client.retrieve(
            collection_name=self.collection_name, ids=[string_to_uuid(doc_id)],
        )
        if not result:
            return None
        p = result[0]
        payload = p.payload or {}
        return SearchResult(
            id=str(p.id), score=0.0,
            text=payload.get("content", ""),
            metadata=payload.get("metadata", {}),
        )

    def delete(self, doc_id: str) -> None:
        self.client.delete(
            collection_name=self.collection_name,
            points_selector=[string_to_uuid(doc_id)],
        )

    def delete_all(self) -> None:
        self.client.delete_collection(collection_name=self.collection_name)
        self._ensure_collection()
```

**Key Qdrant notes:**
- Qdrant requires UUID point IDs — use `uuid.uuid5()` for deterministic string-to-UUID mapping
- Metadata stored in `payload.metadata` to separate from content
- `query_points` replaced older `search` API in recent qdrant-client versions
- Cloud: pass `url` + `api_key`. Local: `host` + `port`

## Pinecone — stores/pinecone.py

```python
"""Pinecone vector store implementation."""

from __future__ import annotations

import logging
from typing import Any

from pinecone import Pinecone

from ..base import SearchResult, VectorStore

logger = logging.getLogger(__name__)


class PineconeVectorStore(VectorStore):
    """Pinecone vector store implementation."""

    def __init__(self, index_name: str, api_key: str) -> None:
        pc = Pinecone(api_key=api_key)
        self.index = pc.Index(index_name)
        self.index_name = index_name

    def add_document(
        self, doc_id: str, text: str, embedding: list[float],
        metadata: dict[str, Any] | None = None,
    ) -> None:
        clean_metadata = {"content": text}
        if metadata:
            clean_metadata.update({k: v for k, v in metadata.items() if v is not None})
        self.index.upsert(vectors=[{"id": doc_id, "values": embedding, "metadata": clean_metadata}])

    def search(
        self, vector: list[float], k: int = 5,
        filter: dict[str, Any] | None = None,
    ) -> list[SearchResult]:
        results = self.index.query(
            vector=vector, top_k=k, include_metadata=True, filter=filter,
        )
        return [
            SearchResult(
                id=m.id, score=m.score or 0.0,
                text=(m.metadata or {}).get("content", ""),
                metadata={k: v for k, v in (m.metadata or {}).items() if k != "content"},
            )
            for m in (results.matches or [])
        ]

    def get(self, doc_id: str) -> SearchResult | None:
        results = self.index.fetch(ids=[doc_id])
        if doc_id not in results.vectors:
            return None
        vec = results.vectors[doc_id]
        md = vec.metadata or {}
        return SearchResult(
            id=doc_id, score=0.0,
            text=md.get("content", ""),
            metadata={k: v for k, v in md.items() if k != "content"},
        )

    def delete(self, doc_id: str) -> None:
        self.index.delete(ids=[doc_id])

    def delete_all(self) -> None:
        self.index.delete(delete_all=True)
```

**Key Pinecone notes:**
- Content stored in metadata (no separate payload)
- Filter `content` out of returned metadata to avoid duplication
- Index must be pre-created (use Pinecone console or `pc.create_index()`)
- Metadata values cannot be None — always filter before storing
- String IDs natively (no UUID conversion needed)

## Gemini Embeddings — models/gemini.py

```python
"""Google Gemini embedding model."""

from __future__ import annotations

import logging

from langchain_google_genai import GoogleGenerativeAIEmbeddings

from ..base import EmbeddingModel

logger = logging.getLogger(__name__)


class GeminiEmbeddingModel(EmbeddingModel):
    """Google Gemini embedding model via LangChain."""

    DIMENSIONS = {
        "gemini-embedding-001": 3072,
        "embedding-001": 768,
    }

    def __init__(
        self,
        api_key: str,
        model: str = "gemini-embedding-001",
        task_type: str = "retrieval_document",
    ) -> None:
        self._embeddings = GoogleGenerativeAIEmbeddings(
            model=model, google_api_key=api_key, task_type=task_type,
        )
        self._dimension = self.DIMENSIONS.get(model, 3072)

    def embed(self, text: str) -> list[float]:
        return self._embeddings.embed_query(text)

    def embed_batch(self, texts: list[str]) -> list[list[float]]:
        return self._embeddings.embed_documents(texts)

    @property
    def dimension(self) -> int:
        return self._dimension
```

## OpenAI Embeddings — models/openai.py

```python
"""OpenAI embedding model."""

from __future__ import annotations

import logging

from openai import OpenAI

from ..base import EmbeddingModel

logger = logging.getLogger(__name__)


class OpenAIEmbeddingModel(EmbeddingModel):
    """OpenAI embedding model using the official SDK."""

    DIMENSIONS = {
        "text-embedding-3-small": 1536,
        "text-embedding-3-large": 3072,
        "text-embedding-ada-002": 1536,
    }

    def __init__(
        self,
        api_key: str,
        model: str = "text-embedding-3-small",
    ) -> None:
        self._client = OpenAI(api_key=api_key)
        self._model = model
        self._dimension = self.DIMENSIONS.get(model, 1536)

    def embed(self, text: str) -> list[float]:
        response = self._client.embeddings.create(input=[text], model=self._model)
        return response.data[0].embedding

    def embed_batch(self, texts: list[str]) -> list[list[float]]:
        response = self._client.embeddings.create(input=texts, model=self._model)
        return [item.embedding for item in sorted(response.data, key=lambda x: x.index)]

    @property
    def dimension(self) -> int:
        return self._dimension
```

**OpenAI notes:**
- `embed_batch` sorts by `index` to maintain input order (API may reorder)
- `text-embedding-3-small` (1536d) is the cost-effective default
- `text-embedding-3-large` (3072d) for higher quality
- Max batch size is 2048 texts per request
