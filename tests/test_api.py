from unittest.mock import patch

from fastapi.testclient import TestClient

from app.config import settings
from app.main import app

client = TestClient(app)


def test_health_reports_indexed_chunks(fixture_index):
    response = client.get("/api/health")

    assert response.status_code == 200
    body = response.json()
    assert body["status"] == "ok"
    assert body["indexed_chunks"] > 0


def test_ask_rejects_unknown_category(fixture_index):
    response = client.post("/api/ask", json={"question": "What is USC?", "category": "bogus"})

    assert response.status_code == 400


def test_ask_returns_answer_and_sources(fixture_index):
    mock_result = {
        "answer": "Mock answer [1].",
        "sources": [{"title": "USC rates", "url": "https://www.revenue.ie/en/usc.aspx", "category": "tax_rates"}],
    }
    with patch("app.api.routes.answer_question", return_value=mock_result):
        response = client.post("/api/ask", json={"question": "What is the USC rate?"})

    assert response.status_code == 200
    body = response.json()
    assert body["answer"] == "Mock answer [1]."
    assert body["sources"] == mock_result["sources"]


def test_ask_without_api_key_returns_503(fixture_index, monkeypatch):
    monkeypatch.setattr(settings, "anthropic_api_key", "")

    response = client.post("/api/ask", json={"question": "What is the USC rate?"})

    assert response.status_code == 503
    assert "ANTHROPIC_API_KEY" in response.json()["detail"]


def test_ask_rejects_empty_question(fixture_index):
    response = client.post("/api/ask", json={"question": ""})

    assert response.status_code == 422
