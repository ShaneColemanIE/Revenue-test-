from pathlib import Path

import pytest

from app.config import settings
from app.ingestion.indexer import build_index_from_raw

FIXTURES_DIR = Path(__file__).resolve().parent.parent / "data" / "fixtures"


@pytest.fixture()
def fixture_index(tmp_path, monkeypatch):
    """Build a real BM25 index from data/fixtures into a temp dir and point settings at it."""
    monkeypatch.setattr(settings, "index_dir", tmp_path / "index")
    monkeypatch.setattr(settings, "anthropic_api_key", "test-key")
    build_index_from_raw(raw_dir=FIXTURES_DIR, index_file=settings.index_file)
    return settings.index_file
