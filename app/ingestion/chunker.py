from __future__ import annotations

import hashlib


def chunk_text(text: str, chunk_size: int = 1000, overlap: int = 150) -> list[str]:
    """Split text into chunks, breaking on paragraph boundaries where possible.

    Paragraphs longer than chunk_size are further split on word boundaries.
    Each chunk after the first is prefixed with a small overlap of the
    previous chunk's tail to preserve context across boundaries.
    """
    text = text.strip()
    if not text:
        return []

    paragraphs = [p.strip() for p in text.split("\n\n") if p.strip()]

    chunks: list[str] = []
    current = ""
    for para in paragraphs:
        if len(para) > chunk_size:
            if current:
                chunks.append(current)
                current = ""
            chunks.extend(_split_long_text(para, chunk_size))
            continue

        candidate = f"{current}\n\n{para}" if current else para
        if len(candidate) > chunk_size:
            chunks.append(current)
            current = para
        else:
            current = candidate

    if current:
        chunks.append(current)

    if overlap > 0 and len(chunks) > 1:
        with_overlap = [chunks[0]]
        for i in range(1, len(chunks)):
            prev_tail = chunks[i - 1][-overlap:]
            with_overlap.append(f"{prev_tail}\n\n{chunks[i]}")
        return with_overlap

    return chunks


def _split_long_text(text: str, chunk_size: int) -> list[str]:
    words = text.split()
    pieces: list[str] = []
    current = ""
    for word in words:
        candidate = f"{current} {word}".strip()
        if len(candidate) > chunk_size and current:
            pieces.append(current)
            current = word
        else:
            current = candidate
    if current:
        pieces.append(current)
    return pieces


def chunk_document(doc: dict, chunk_size: int = 1000, overlap: int = 150) -> list[dict]:
    """Turn a scraped document dict into a list of chunk dicts ready for indexing."""
    texts = chunk_text(doc.get("text", ""), chunk_size, overlap)
    base_id = hashlib.sha1(doc["url"].encode("utf-8")).hexdigest()[:12]

    chunks = []
    for i, chunk_text_value in enumerate(texts):
        chunks.append(
            {
                "id": f"{base_id}-{i}",
                "text": chunk_text_value,
                "metadata": {
                    "url": doc["url"],
                    "title": doc.get("title", ""),
                    "category": doc.get("category", ""),
                    "chunk_index": i,
                    "total_chunks": len(texts),
                },
            }
        )
    return chunks
