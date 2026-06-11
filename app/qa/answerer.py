from __future__ import annotations

import anthropic

from app.config import settings
from app.qa.prompts import SYSTEM_PROMPT, build_user_message
from app.qa.retriever import retrieve

NO_CONTEXT_ANSWER = (
    "I don't have any indexed revenue.ie or cro.ie content yet, so I can't answer that. "
    "Run the scraper and index-builder first (see README), then ask again."
)


def _call_claude(user_message: str) -> str:
    if not settings.anthropic_api_key:
        raise RuntimeError("ANTHROPIC_API_KEY is not set. Add it to your .env file.")

    client = anthropic.Anthropic(api_key=settings.anthropic_api_key)
    message = client.messages.create(
        model=settings.anthropic_model,
        max_tokens=1024,
        system=SYSTEM_PROMPT,
        messages=[{"role": "user", "content": user_message}],
    )
    return "".join(block.text for block in message.content if block.type == "text")


def _unique_sources(chunks: list[dict]) -> list[dict]:
    seen: set[str] = set()
    sources = []
    for chunk in chunks:
        meta = chunk["metadata"]
        url = meta.get("url", "")
        if url in seen:
            continue
        seen.add(url)
        sources.append({"title": meta.get("title", ""), "url": url, "category": meta.get("category", "")})
    return sources


def answer_question(question: str, top_k: int | None = None, category: str | None = None) -> dict:
    """Retrieve relevant chunks and ask Claude to answer, grounded in those chunks."""
    chunks = retrieve(question, top_k=top_k, category=category)
    if not chunks:
        return {"answer": NO_CONTEXT_ANSWER, "sources": []}

    user_message = build_user_message(question, chunks)
    answer_text = _call_claude(user_message)

    return {"answer": answer_text, "sources": _unique_sources(chunks)}
