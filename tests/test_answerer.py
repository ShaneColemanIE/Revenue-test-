from unittest.mock import patch

import pytest

from app.config import settings
from app.qa import answerer


def test_answer_question_with_no_index_returns_placeholder(tmp_path, monkeypatch):
    monkeypatch.setattr(settings, "index_dir", tmp_path / "empty_index")

    result = answerer.answer_question("What is USC?")

    assert result == {"answer": answerer.NO_CONTEXT_ANSWER, "sources": []}


def test_answer_question_calls_claude_with_retrieved_context(fixture_index):
    with patch.object(answerer, "_call_claude", return_value="Mock answer [1].") as mock_call:
        result = answerer.answer_question("What is the USC rate?", category="tax_rates")

    assert result["answer"] == "Mock answer [1]."
    assert result["sources"]
    assert all(source["category"] == "tax_rates" for source in result["sources"])

    user_message = mock_call.call_args[0][0]
    assert "USC" in user_message
    assert "[1]" in user_message


def test_answer_question_deduplicates_sources_by_url(fixture_index):
    with patch.object(answerer, "_call_claude", return_value="Mock answer."):
        result = answerer.answer_question("tax rates and credits")

    urls = [source["url"] for source in result["sources"]]
    assert len(urls) == len(set(urls))


def test_call_claude_requires_api_key(monkeypatch):
    monkeypatch.setattr(settings, "anthropic_api_key", "")

    with pytest.raises(RuntimeError, match="ANTHROPIC_API_KEY"):
        answerer._call_claude("hello")
