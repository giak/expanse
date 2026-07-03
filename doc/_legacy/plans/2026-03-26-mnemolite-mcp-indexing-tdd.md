# Mnemolite MCP Indexing E2E Test Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Créer une suite de tests d'intégration E2E pour le pipeline MCP `index_project` qui valide de bout en bout : scan → chunk → embed → store → search.

**Architecture:** Tests d'intégration avec PostgreSQL réel (Docker) + fixtures de test .py/.md. Un test principal `test_index_project_full_pipeline` + tests de régression pour les bugs connus.

**Tech Stack:** pytest, PostgreSQL (Docker), Redis, DualEmbeddingService

---

## Prerequisites

### Verify Docker is running
```bash
docker compose ps
```
Expected: 5 services up (api, db, redis, worker, openobserve)

### Verify test database is accessible
```bash
docker exec mnemo-postgres psql -U mnemo -d mnemolite -c "SELECT 1;"
```
Expected: `1 row`

---

## Task 1: Create Fixtures for Integration Tests

**Files:**
- Create: `tests/integration/test_mcp_indexing_e2e/conftest.py`
- Create: `tests/integration/test_mcp_indexing_e2e/fixtures/sample.py`
- Create: `tests/integration/test_mcp_indexing_e2e/fixtures/sample.md`

**Step 1: Create conftest.py with fixtures**

```python
import pytest
import asyncio
import os
from pathlib import Path
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.pool import NullPool

@pytest.fixture(scope="session")
def db_url():
    """Get database URL from environment."""
    return os.getenv(
        "DATABASE_URL",
        "postgresql+asyncpg://mnemo:mnemopass@localhost:5432/mnemolite"
    )

@pytest.fixture(scope="session")
def engine(db_url):
    """Create async engine for tests."""
    engine = create_async_engine(db_url, poolclass=NullPool)
    yield engine
    await engine.dispose()

@pytest.fixture
async def db_session(engine):
    """Create a new session for each test."""
    async with AsyncSession(engine) as session:
        yield session

@pytest.fixture
def test_fixtures_dir():
    """Get path to test fixtures."""
    return Path(__file__).parent / "fixtures"

@pytest.fixture
def test_repository():
    """Unique repository name for test isolation."""
    return f"test_mcp_indexing_{os.getpid()}_{id(object())}"
```

**Step 2: Create sample.py fixture**

```python
# Sample Python file for testing
def hello_world():
    """Simple hello world function."""
    print("Hello, World!")
    return "Hello, World!"

class Calculator:
    """A simple calculator class."""
    
    def add(self, a: int, b: int) -> int:
        """Add two numbers."""
        return a + b
    
    def subtract(self, a: int, b: int) -> int:
        """Subtract b from a."""
        return a - b
    
async def async_function():
    """Async function for testing."""
    await asyncio.sleep(0.1)
    return "async result"
```

**Step 3: Create sample.md fixture**

```markdown
# Sample Document

## Introduction

This is a sample markdown file for testing the indexing pipeline.

## Section 1

Content for section 1 with some code:

```python
def example():
    pass
```

## Section 2

More content in section 2.

### Subsection 2.1

Deeper content.
```

**Step 4: Verify fixtures exist**

```bash
ls tests/integration/test_mcp_indexing_e2e/fixtures/
```
Expected: `sample.py`, `sample.md`

**Step 5: Commit**

```bash
git add tests/integration/test_mcp_indexing_e2e/
git commit -m "test: add fixtures for MCP indexing E2E tests"
```

---

## Task 2: Write Test for Full Pipeline E2E

**Files:**
- Create: `tests/integration/test_mcp_indexing_e2e/test_full_pipeline.py`

**Step 1: Write test for full pipeline**

```python
"""
E2E tests for MCP indexing pipeline.

Tests:
- index_project: scan → chunk → embed → store
- search_code: verify indexed chunks are searchable
- reindex_file: verify updates replace old chunks
"""

import pytest
from pathlib import Path
from services.code_indexing_service import CodeIndexingService, FileInput, IndexingOptions
from services.code_chunking_service import CodeChunkingService
from services.metadata_extractor_service import MetadataExtractorService
from services.dual_embedding_service import DualEmbeddingService
from services.graph_construction_service import GraphConstructionService
from db.repositories.code_chunk_repository import CodeChunkRepository
from services.caches.cascade_cache import CascadeCache
from services.caches.code_chunk_cache import CodeChunkCache
from sqlalchemy import text

@pytest.mark.asyncio
async def test_index_project_stores_chunks_in_db(
    engine, test_fixtures_dir, test_repository
):
    """Test that index_project stores chunks in PostgreSQL."""
    # Setup
    chunking_service = CodeChunkingService(max_workers=2)
    metadata_service = MetadataExtractorService()
    embedding_service = DualEmbeddingService()
    await embedding_service.preload_models()
    graph_service = GraphConstructionService(engine=engine)
    chunk_repository = CodeChunkRepository(engine=engine)
    l1_cache = CodeChunkCache(max_size_mb=10)
    chunk_cache = CascadeCache(l1_cache=l1_cache, l2_cache=None)
    
    indexing_service = CodeIndexingService(
        engine=engine,
        chunking_service=chunking_service,
        metadata_service=metadata_service,
        embedding_service=embedding_service,
        graph_service=graph_service,
        chunk_repository=chunk_repository,
        chunk_cache=chunk_cache
    )
    
    # Read test file
    sample_file = test_fixtures_dir / "sample.py"
    content = sample_file.read_text()
    
    # Index file
    file_input = FileInput(
        path=str(sample_file),
        content=content,
        language="python"
    )
    
    result = await indexing_service._index_file(
        file_input=file_input,
        options=IndexingOptions(
            extract_metadata=True,
            generate_embeddings=True,
            build_graph=False,
            repository=test_repository,
            repository_root=str(test_fixtures_dir)
        )
    )
    
    # Verify
    assert result.success, f"Indexing failed: {result.error}"
    assert result.chunks_created > 0, "No chunks created"
    
    # Verify chunks are in DB
    async with engine.connect() as conn:
        result_db = await conn.execute(
            text("""
                SELECT COUNT(*) FROM code_chunks 
                WHERE repository = :repo
            """),
            {"repo": test_repository}
        )
        count = result_db.scalar()
        assert count == result.chunks_created, \
            f"DB has {count} chunks, expected {result.chunks_created}"
```

**Step 2: Run test**

```bash
docker exec mnemo-api pytest tests/integration/test_mcp_indexing_e2e/test_full_pipeline.py::test_index_project_stores_chunks_in_db -v
```
Expected: PASS (if embeddings loaded) or FAIL (if embedding service issue)

**Step 3: Commit**

```bash
git add tests/integration/test_mcp_indexing_e2e/test_full_pipeline.py
git commit -m "test: add full pipeline E2E test"
```

---

## Task 3: Write Regression Test for Embedding Service Mismatch

**Files:**
- Create: `tests/integration/test_mcp_indexing_e2e/test_embedding_mismatch.py`

**Step 1: Write test for SentenceTransformerEmbeddingService fallback**

```python
"""
Regression test for embedding service interface mismatch.

Bug: SentenceTransformerEmbeddingService uses generate_embedding(text, text_type=)
      but CodeIndexingService calls generate_embedding(text, domain=)
      This caused TypeError and rollback of transactions.

Fix: DualEmbeddingService used in MCP server + legacy bridge in CodeIndexingService.
"""

import pytest
from unittest.mock import AsyncMock
from services.code_indexing_service import CodeIndexingService
from models.code_chunk_models import CodeChunk, ChunkType

@pytest.mark.asyncio
async def test_legacy_embedding_service_bridge(engine):
    """Test that legacy embedding service interface works via bridge."""
    # Create mock with SentenceTransformerEmbeddingService interface
    mock_embedding = AsyncMock()
    mock_embedding.generate_embedding = AsyncMock(
        side_effect=TypeError(
            "generate_embedding() got an unexpected keyword argument 'domain'"
        )
    )
    
    indexing_service = CodeIndexingService(
        engine=engine,
        chunking_service=AsyncMock(),
        metadata_service=AsyncMock(),
        embedding_service=mock_embedding,
        graph_service=AsyncMock(),
        chunk_repository=AsyncMock(),
    )
    
    chunk = CodeChunk(
        file_path="test.py",
        language="python",
        chunk_type=ChunkType.FUNCTION,
        name="test_func",
        source_code="def test(): pass",
        start_line=1,
        end_line=2,
        metadata={}
    )
    
    # Should not raise - bridge handles the error
    result = await indexing_service._generate_embeddings_for_chunk(chunk)
    
    # Result should be dict with None values (bridge failed but didn't crash)
    assert isinstance(result, dict)
    assert "text" in result
    assert "code" in result

@pytest.mark.asyncio
async def test_dual_embedding_service_works(engine):
    """Test that DualEmbeddingService works directly."""
    embedding_service = DualEmbeddingService()
    await embedding_service.preload_models()
    
    result = await embedding_service.generate_embedding(
        text="test function",
        domain="TEXT"
    )
    
    assert isinstance(result, dict)
    assert "text" in result
    assert result["text"] is not None
    assert len(result["text"]) > 0
```

**Step 2: Run test**

```bash
docker exec mnemo-api pytest tests/integration/test_mcp_indexing_e2e/test_embedding_mismatch.py -v
```
Expected: PASS

**Step 3: Commit**

```bash
git add tests/integration/test_mcp_indexing_e2e/test_embedding_mismatch.py
git commit -m "test: add regression test for embedding service mismatch"
```

---

## Task 4: Write Test for Markdown Indexing

**Files:**
- Modify: `tests/integration/test_mcp_indexing_e2e/test_full_pipeline.py`

**Step 1: Add markdown indexing test**

```python
@pytest.mark.asyncio
async def test_index_markdown_file(engine, test_fixtures_dir, test_repository):
    """Test that markdown files are indexed correctly."""
    # Setup (same as before)
    chunking_service = CodeChunkingService(max_workers=2)
    metadata_service = MetadataExtractorService()
    embedding_service = DualEmbeddingService()
    await embedding_service.preload_models()
    graph_service = GraphConstructionService(engine=engine)
    chunk_repository = CodeChunkRepository(engine=engine)
    l1_cache = CodeChunkCache(max_size_mb=10)
    chunk_cache = CascadeCache(l1_cache=l1_cache, l2_cache=None)
    
    indexing_service = CodeIndexingService(
        engine=engine,
        chunking_service=chunking_service,
        metadata_service=metadata_service,
        embedding_service=embedding_service,
        graph_service=graph_service,
        chunk_repository=chunk_repository,
        chunk_cache=chunk_cache
    )
    
    # Read markdown file
    sample_md = test_fixtures_dir / "sample.md"
    content = sample_md.read_text()
    
    # Index file
    file_input = FileInput(
        path=str(sample_md),
        content=content,
        language="markdown"
    )
    
    result = await indexing_service._index_file(
        file_input=file_input,
        options=IndexingOptions(
            extract_metadata=True,
            generate_embeddings=True,
            build_graph=False,
            repository=test_repository,
            repository_root=str(test_fixtures_dir)
        )
    )
    
    # Verify
    assert result.success, f"Indexing failed: {result.error}"
    assert result.chunks_created >= 3, \
        f"Expected >= 3 chunks (intro + section1 + section2), got {result.chunks_created}"
    
    # Verify chunks in DB have correct language
    async with engine.connect() as conn:
        result_db = await conn.execute(
            text("""
                SELECT DISTINCT language FROM code_chunks 
                WHERE repository = :repo
            """),
            {"repo": test_repository}
        )
        languages = [row[0] for row in result_db.fetchall()]
        assert "markdown" in languages, "Markdown chunks not found"
```

**Step 2: Run test**

```bash
docker exec mnemo-api pytest tests/integration/test_mcp_indexing_e2e/test_full_pipeline.py::test_index_markdown_file -v
```
Expected: PASS

**Step 3: Commit**

```bash
git add tests/integration/test_mcp_indexing_e2e/test_full_pipeline.py
git commit -m "test: add markdown indexing test"
```

---

## Task 5: Write Test for Search After Indexing

**Files:**
- Modify: `tests/integration/test_mcp_indexing_e2e/test_full_pipeline.py`

**Step 1: Add search verification test**

```python
@pytest.mark.asyncio
async def test_indexed_chunks_are_searchable(
    engine, test_fixtures_dir, test_repository
):
    """Test that indexed chunks can be found via search."""
    # First, index a file
    # ... (setup same as previous tests)
    
    sample_file = test_fixtures_dir / "sample.py"
    content = sample_file.read_text()
    
    # Index with explicit repository
    file_input = FileInput(
        path=str(sample_file),
        content=content,
        language="python"
    )
    
    result = await indexing_service._index_file(
        file_input=file_input,
        options=IndexingOptions(
            extract_metadata=True,
            generate_embeddings=True,
            build_graph=False,
            repository=test_repository,
            repository_root=str(test_fixtures_dir)
        )
    )
    
    assert result.success
    
    # Now search for the indexed content
    async with engine.connect() as conn:
        # Search for "Calculator" class
        search_result = await conn.execute(
            text("""
                SELECT name, source_code 
                FROM code_chunks 
                WHERE repository = :repo
                AND source_code ILIKE '%Calculator%'
                LIMIT 5
            """),
            {"repo": test_repository}
        )
        rows = search_result.fetchall()
        
        assert len(rows) > 0, "Calculator class not found in search"
        assert any("Calculator" in row[0] for row in rows), \
            "Calculator class not in chunk names"
```

**Step 2: Run test**

```bash
docker exec mnemo-api pytest tests/integration/test_mcp_indexing_e2e/test_full_pipeline.py::test_indexed_chunks_are_searchable -v
```
Expected: PASS

**Step 3: Commit**

```bash
git add tests/integration/test_mcp_indexing_e2e/test_full_pipeline.py
git commit -m "test: add search verification test"
```

---

## Task 6: Write Test for Reindex File

**Files:**
- Create: `tests/integration/test_mcp_indexing_e2e/test_reindex.py`

**Step 1: Write reindex test**

```python
"""
Tests for reindex_file functionality.

Verifies that:
- Reindexing updates existing chunks
- Old chunks are removed
- New chunks are created
"""

import pytest
from pathlib import Path
import tempfile
from services.code_indexing_service import CodeIndexingService, FileInput, IndexingOptions
from services.code_chunking_service import CodeChunkingService
from sqlalchemy import text

@pytest.mark.asyncio
async def test_reindex_updates_chunks(engine, test_repository):
    """Test that reindexing a file updates its chunks."""
    # Create temp file
    with tempfile.NamedTemporaryFile(
        mode='w', suffix='.py', delete=False
    ) as f:
        f.write("def original(): pass\n")
        temp_path = f.name
    
    try:
        # Initial indexing
        # ... setup indexing service ...
        
        content = Path(temp_path).read_text()
        file_input = FileInput(
            path=temp_path,
            content=content,
            language="python"
        )
        
        result1 = await indexing_service._index_file(
            file_input=file_input,
            options=IndexingOptions(
                repository=test_repository,
                repository_root=tempfile.gettempdir()
            )
        )
        
        initial_count = result1.chunks_created
        
        # Update file content
        Path(temp_path).write_text("def updated(): pass\n")
        content = Path(temp_path).read_text()
        file_input = FileInput(
            path=temp_path,
            content=content,
            language="python"
        )
        
        # Reindex
        result2 = await indexing_service._index_file(
            file_input=file_input,
            options=IndexingOptions(
                repository=test_repository,
                repository_root=tempfile.gettempdir()
            )
        )
        
        # Verify: count should be same or less
        async with engine.connect() as conn:
            count_result = await conn.execute(
                text("""
                    SELECT COUNT(*) FROM code_chunks 
                    WHERE repository = :repo AND file_path = :path
                """),
                {"repo": test_repository, "path": temp_path}
            )
            final_count = count_result.scalar()
            
            assert final_count <= initial_count + 1, \
                "Reindex should not increase chunk count significantly"
            
            # Verify content is updated
            search_result = await conn.execute(
                text("""
                    SELECT source_code FROM code_chunks 
                    WHERE repository = :repo AND file_path = :path
                """),
                {"repo": test_repository, "path": temp_path}
            )
            rows = search_result.fetchall()
            assert any("updated" in row[0] for row in rows), \
                "Reindexed content not found"
    
    finally:
        Path(temp_path).unlink(missing_ok=True)
```

**Step 2: Run test**

```bash
docker exec mnemo-api pytest tests/integration/test_mcp_indexing_e2e/test_reindex.py -v
```
Expected: PASS

**Step 3: Commit**

```bash
git add tests/integration/test_mcp_indexing_e2e/test_reindex.py
git commit -m "test: add reindex file test"
```

---

## Task 7: Write Test for Batch Insert Fallback

**Files:**
- Create: `tests/integration/test_mcp_indexing_e2e/test_batch_insert.py`

**Step 1: Write batch insert test**

```python
"""
Tests for batch insert with fallback to sequential.

Bug: When batch insert fails, fallback to sequential inserts
     doesn't use transaction - partial insert possible.

This test verifies the fallback behavior.
"""

import pytest
from unittest.mock import AsyncMock, patch
from sqlalchemy import text

@pytest.mark.asyncio
async def test_batch_insert_fallback(engine, test_repository):
    """Test that batch insert fallback works correctly."""
    # Setup with mock that fails batch insert
    mock_repo = AsyncMock()
    mock_repo.batch_insert_chunks = AsyncMock(
        side_effect=Exception("Batch insert failed")
    )
    mock_repo.insert_chunk = AsyncMock()  # Fallback should use this
    
    indexing_service = CodeIndexingService(
        engine=engine,
        chunking_service=CodeChunkingService(),
        metadata_service=MetadataExtractorService(),
        embedding_service=create_mock_embedding(),
        graph_service=AsyncMock(),
        chunk_repository=mock_repo,
        chunk_cache=CascadeCache(
            l1_cache=CodeChunkCache(),
            l2_cache=None
        )
    )
    
    # This should trigger fallback to sequential insert
    file_input = FileInput(
        path="test.py",
        content="def test(): pass",
        language="python"
    )
    
    result = await indexing_service._index_file(
        file_input=file_input,
        options=IndexingOptions(repository=test_repository)
    )
    
    # Verify sequential insert was attempted
    assert mock_repo.insert_chunk.called, \
        "Fallback to sequential insert not called"
```

**Step 2: Run test**

```bash
docker exec mnemo-api pytest tests/integration/test_mcp_indexing_e2e/test_batch_insert.py -v
```
Expected: PASS (with mock)

**Step 3: Commit**

```bash
git add tests/integration/test_mcp_indexing_e2e/test_batch_insert.py
git commit -m "test: add batch insert fallback test"
```

---

## Task 8: Run Full Test Suite + Regression Check

**Step 1: Run new tests**

```bash
docker exec mnemo-api pytest tests/integration/test_mcp_indexing_e2e/ -v
```
Expected: All PASS

**Step 2: Run existing Expanse tests (regression)**

```bash
docker exec mnemo-api pytest tests/test_expanse_indexing.py -v
docker exec mnemo-api pytest tests/test_expanse_integration.py -v
```
Expected: All 10 tests PASS

**Step 3: Run all tests (if time permits)**

```bash
docker exec mnemo-api pytest tests/ --ignore=tests/integration/test_parallel_pipeline.py -x -v
```
Expected: No new failures

---

## Task 9: Final Verification

**Step 1: Check test count**

```bash
docker exec mnemo-api pytest tests/integration/test_mcp_indexing_e2e/ --collect-only
```
Expected: ~8-10 tests

**Step 2: Check coverage (if pytest-cov installed)**

```bash
docker exec mnemo-api pytest tests/integration/test_mcp_indexing_e2e/ --cov=services.code_indexing_service --cov-report=term-missing
```
Expected: Improved coverage for `code_indexing_service.py`

**Step 3: Commit all tests**

```bash
git add -A
git commit -m "test: complete MCP indexing E2E test suite"
```

---

## Summary

After this plan:
- **New tests**: 8-10 tests in `tests/integration/test_mcp_indexing_e2e/`
- **Coverage**: `code_indexing_service.py` + embedding pipeline covered
- **Regression**: Existing Expanse tests still pass
- **Total test count**: ~255 tests
