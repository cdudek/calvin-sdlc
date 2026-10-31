# Config Template

## Pydantic BaseSettings Config

Adapt the `Literal` types and fields based on which providers the user chose.

```python
from __future__ import annotations

from typing import Literal

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Application configuration loaded from environment variables."""

    # --- Vectorstore ---
    vectorstore_strategy: Literal["pinecone", "qdrant"] = "qdrant"

    # Qdrant (only needed if vectorstore_strategy == "qdrant")
    qdrant_endpoint: str | None = None
    qdrant_api_key: str | None = None

    # Pinecone (only needed if vectorstore_strategy == "pinecone")
    pinecone_api_key: str | None = None
    pinecone_index_name: str = "default"

    # --- Embedding ---
    embedding_strategy: Literal["gemini", "openai"] = "gemini"
    embedding_model: str = "gemini-embedding-001"

    # Gemini
    gemini_api_key: str | None = None

    # OpenAI
    openai_api_key: str | None = None

    # --- Chunking ---
    chunking_strategy: Literal["recursive", "semantic"] = "recursive"
    chunking_size: int = 512
    chunking_overlap: int = 64
    chunking_min_chunk_size: int = 128
    chunking_use_tokens: bool = True
    chunking_token_encoding: str = "cl100k_base"

    # --- Retrieval ---
    search_k: int = 5

    model_config = SettingsConfigDict(
        env_file=".env",
        case_sensitive=False,
        extra="ignore",
    )


settings = Settings()
```

## .env.example Template

```env
# Vectorstore
VECTORSTORE_STRATEGY=qdrant

# Qdrant (if using qdrant)
QDRANT_ENDPOINT=https://your-cluster.qdrant.tech
QDRANT_API_KEY=your-qdrant-api-key

# Pinecone (if using pinecone)
# PINECONE_API_KEY=your-pinecone-api-key
# PINECONE_INDEX_NAME=your-index

# Embedding
EMBEDDING_STRATEGY=gemini
EMBEDDING_MODEL=gemini-embedding-001
GEMINI_API_KEY=your-gemini-api-key

# OpenAI (if using openai embeddings)
# OPENAI_API_KEY=your-openai-api-key

# Chunking
CHUNKING_STRATEGY=recursive
CHUNKING_SIZE=512
CHUNKING_OVERLAP=64
CHUNKING_MIN_CHUNK_SIZE=128
CHUNKING_USE_TOKENS=true

# Retrieval
SEARCH_K=5
```

## Adapting the Config

1. **Remove unused providers** — if only Qdrant, remove Pinecone fields and `"pinecone"` from Literal
2. **Make required fields non-optional** — if always using Qdrant, `qdrant_endpoint: str` (not `str | None`)
3. **Match existing config** — if project already uses pydantic-settings, merge into existing Settings class
4. **Env file location** — adjust `env_file` if project uses different `.env` path
