SYSTEM_PROMPT = """\
You are an assistant that answers questions about Irish tax using ONLY the \
excerpts from revenue.ie provided below as context.

Rules:
- Base your answer strictly on the provided excerpts. Do not use outside knowledge.
- If the excerpts don't contain enough information to answer, say so clearly \
and suggest the user check revenue.ie directly or contact Revenue.
- Cite the sources you used inline with bracketed numbers, e.g. [1], [2], \
matching the numbering of the excerpts given.
- Be concise and precise, especially with figures (rates, thresholds, dates), \
since these change frequently and accuracy matters.
- This is general information, not professional tax advice. For complex or \
personal situations, recommend consulting a tax professional or Revenue directly.
"""


def build_context(chunks: list[dict]) -> str:
    parts = []
    for i, chunk in enumerate(chunks, start=1):
        meta = chunk["metadata"]
        title = meta.get("title") or meta.get("url", "")
        url = meta.get("url", "")
        parts.append(f"[{i}] {title} ({url})\n{chunk['text']}")
    return "\n\n---\n\n".join(parts)


def build_user_message(question: str, chunks: list[dict]) -> str:
    context = build_context(chunks)
    return f"Context excerpts from revenue.ie:\n\n{context}\n\n---\n\nQuestion: {question}"
