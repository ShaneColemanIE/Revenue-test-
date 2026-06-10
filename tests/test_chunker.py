from app.ingestion.chunker import chunk_document, chunk_text


def test_chunk_text_empty():
    assert chunk_text("") == []
    assert chunk_text("   ") == []


def test_chunk_text_single_short_paragraph_is_one_chunk():
    text = "Hello world."
    assert chunk_text(text, chunk_size=1000) == ["Hello world."]


def test_chunk_text_splits_on_paragraph_boundaries():
    para1 = "A" * 600
    para2 = "B" * 600
    text = f"{para1}\n\n{para2}"

    chunks = chunk_text(text, chunk_size=1000, overlap=0)

    assert chunks == [para1, para2]


def test_chunk_text_adds_overlap_between_chunks():
    para1 = "A" * 600
    para2 = "B" * 600
    text = f"{para1}\n\n{para2}"

    chunks = chunk_text(text, chunk_size=1000, overlap=50)

    assert chunks[0] == para1
    assert chunks[1].startswith(para1[-50:])
    assert chunks[1].endswith(para2)


def test_chunk_text_splits_long_paragraph_on_words():
    text = " ".join(["word"] * 500)

    chunks = chunk_text(text, chunk_size=100, overlap=0)

    assert len(chunks) > 1
    assert all(len(c) <= 100 for c in chunks)
    assert " ".join(chunks) == text


def test_chunk_document_includes_metadata_and_ids():
    doc = {
        "url": "https://www.revenue.ie/en/example/page.aspx",
        "title": "Example Page",
        "category": "guidance",
        "text": "Paragraph one.\n\nParagraph two.",
    }

    chunks = chunk_document(doc, chunk_size=1000, overlap=0)

    assert len(chunks) == 1
    chunk = chunks[0]
    assert chunk["text"] == "Paragraph one.\n\nParagraph two."
    assert chunk["metadata"] == {
        "url": doc["url"],
        "title": doc["title"],
        "category": doc["category"],
        "chunk_index": 0,
        "total_chunks": 1,
    }
    assert chunk["id"]


def test_chunk_document_ids_are_stable_for_same_url():
    doc = {"url": "https://www.revenue.ie/en/example/page.aspx", "title": "T", "category": "guidance", "text": "Text."}

    chunks_a = chunk_document(doc)
    chunks_b = chunk_document(doc)

    assert chunks_a[0]["id"] == chunks_b[0]["id"]
