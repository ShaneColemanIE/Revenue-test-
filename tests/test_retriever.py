from app.config import settings
from app.qa.retriever import retrieve


def test_retrieve_returns_relevant_chunk_first(fixture_index):
    results = retrieve("What is the standard rate cut-off point for a single person?")

    assert results
    assert results[0]["metadata"]["category"] == "tax_rates"
    assert "cut-off" in results[0]["text"].lower()


def test_retrieve_respects_top_k(fixture_index):
    results = retrieve("tax", top_k=2)

    assert len(results) <= 2


def test_retrieve_category_filter(fixture_index):
    results = retrieve("rate relief guidance update", category="ebrief")

    assert results
    assert all(r["metadata"]["category"] == "ebrief" for r in results)


def test_retrieve_empty_index_returns_empty_list(tmp_path, monkeypatch):
    monkeypatch.setattr(settings, "index_dir", tmp_path / "empty_index")

    assert retrieve("anything") == []


def test_retrieve_no_match_returns_empty_list(fixture_index):
    assert retrieve("xyzzy nonexistent gibberish term qwertyzzz") == []
