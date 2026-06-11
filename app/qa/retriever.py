from __future__ import annotations

import re
from pathlib import Path

from rank_bm25 import BM25Okapi

from app.config import settings
from app.ingestion.indexer import load_chunks

_TOKEN_RE = re.compile(r"[a-z0-9]+")

# Module-level cache so repeated requests don't re-tokenize/rebuild BM25 every time.
_cache: dict = {"index_file": None, "mtime": None, "chunks": [], "bm25": None}


def _tokenize(text: str) -> list[str]:
    return _TOKEN_RE.findall(text.lower())


def _search_text(chunk: dict) -> str:
    """Text used for BM25 indexing: the document title plus the chunk body.

    Repeating the title in every chunk's search text means all chunks of a
    document stay findable via title-term matches (e.g. a query for "standard
    rate cut-off point" can still surface a chunk whose own text only
    contains the figures, not that phrase).
    """
    title = chunk.get("metadata", {}).get("title", "")
    return f"{title} {chunk['text']}" if title else chunk["text"]


def _get_index(index_file: Path | None = None) -> tuple[list[dict], BM25Okapi | None]:
    index_file = index_file or settings.index_file

    mtime = index_file.stat().st_mtime if index_file.exists() else None
    if _cache["index_file"] != index_file or _cache["mtime"] != mtime:
        chunks = load_chunks(index_file)
        bm25 = BM25Okapi([_tokenize(_search_text(c)) for c in chunks]) if chunks else None
        _cache.update(index_file=index_file, mtime=mtime, chunks=chunks, bm25=bm25)

    return _cache["chunks"], _cache["bm25"]


def retrieve(
    question: str,
    top_k: int | None = None,
    category: str | None = None,
    index_file: Path | None = None,
) -> list[dict]:
    """Return the top-k most relevant chunks for a question, with metadata."""
    chunks, bm25 = _get_index(index_file)
    if bm25 is None:
        return []

    top_k = top_k or settings.retrieval_top_k
    scores = bm25.get_scores(_tokenize(question))

    candidate_indices = range(len(chunks))
    if category:
        candidate_indices = [i for i in candidate_indices if chunks[i]["metadata"].get("category") == category]

    ranked = sorted(candidate_indices, key=lambda i: scores[i], reverse=True)[:top_k]
    return [{**chunks[i], "score": float(scores[i])} for i in ranked if scores[i] > 0]
