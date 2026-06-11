from rank_bm25 import BM25Okapi

from app.config import settings
from app.qa.retriever import _search_text, _tokenize, retrieve


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


def test_search_text_includes_title():
    chunk = {"text": "Married couples get an increased threshold.", "metadata": {"title": "Standard rate cut-off point"}}

    search_text = _search_text(chunk)

    assert "cut-off" in search_text.lower()
    assert "married" in search_text.lower()


def test_title_boost_makes_body_only_chunk_score_higher():
    """A chunk whose own text shares no words with the query gets a zero BM25
    score on its own, but a positive score once the document title (which
    matches the query) is folded into its search text.
    """
    target = {
        "text": (
            "Married couples or civil partners with one income get an increased "
            "threshold of fifty one thousand euro."
        ),
        "metadata": {"title": "Tax rates and the standard rate cut-off point"},
    }
    distractors = [
        {
            "text": f"Some unrelated guidance text number {i} about claiming various tax credits and reliefs online.",
            "metadata": {"title": f"How to claim relief number {i}"},
        }
        for i in range(8)
    ]
    chunks = [target, *distractors]

    query_tokens = _tokenize("standard rate cut-off point")

    score_without_boost = BM25Okapi([_tokenize(c["text"]) for c in chunks]).get_scores(query_tokens)[0]
    score_with_boost = BM25Okapi([_tokenize(_search_text(c)) for c in chunks]).get_scores(query_tokens)[0]

    assert score_without_boost == 0
    assert score_with_boost > score_without_boost
