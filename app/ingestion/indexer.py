from __future__ import annotations

import json
import logging
from collections.abc import Iterable, Iterator
from pathlib import Path

from app.config import settings
from app.ingestion.chunker import chunk_document

logger = logging.getLogger(__name__)


def load_documents_from_raw(raw_dir: Path) -> Iterator[dict]:
    for json_file in sorted(raw_dir.rglob("*.json")):
        try:
            yield json.loads(json_file.read_text(encoding="utf-8"))
        except (OSError, json.JSONDecodeError):
            logger.exception("Failed to load %s", json_file)


def build_index_from_raw(
    raw_dir: Path | None = None,
    index_file: Path | None = None,
    chunk_size: int = 1000,
    overlap: int = 150,
) -> int:
    """Chunk every document under raw_dir and write them to a JSONL index file.

    Returns the number of chunks written.
    """
    raw_dir = raw_dir or settings.raw_data_dir
    index_file = index_file or settings.index_file
    index_file.parent.mkdir(parents=True, exist_ok=True)

    total = 0
    with open(index_file, "w", encoding="utf-8") as f:
        for doc in load_documents_from_raw(raw_dir):
            for chunk in chunk_document(doc, chunk_size=chunk_size, overlap=overlap):
                f.write(json.dumps(chunk) + "\n")
                total += 1

    return total


def load_chunks(index_file: Path | None = None) -> list[dict]:
    index_file = index_file or settings.index_file
    if not index_file.exists():
        return []

    chunks = []
    with open(index_file, encoding="utf-8") as f:
        for line in f:
            line = line.strip()
            if line:
                chunks.append(json.loads(line))
    return chunks


def count_chunks(index_file: Path | None = None) -> int:
    return len(load_chunks(index_file))


def index_documents(documents: Iterable[dict], index_file: Path | None = None, **chunk_kwargs) -> int:
    """Append-style helper used by tests: chunk given documents and write them out."""
    index_file = index_file or settings.index_file
    index_file.parent.mkdir(parents=True, exist_ok=True)

    total = 0
    with open(index_file, "w", encoding="utf-8") as f:
        for doc in documents:
            for chunk in chunk_document(doc, **chunk_kwargs):
                f.write(json.dumps(chunk) + "\n")
                total += 1
    return total
