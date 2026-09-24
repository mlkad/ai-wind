"""The API's language is request-scoped, including overlapping EN/RU runs."""
import asyncio
import re

import httpx
import pytest
from fastapi.testclient import TestClient

from app.main import app

PAYLOAD = {"forecast_date": "2026-02-22", "horizon_hours": 24, "turbine_ids": [1, 2]}
CYRILLIC = re.compile(r"[а-яё]", re.IGNORECASE)


def assert_language(body: dict, language: str) -> None:
    assert body["status"] == "completed"
    assert body["explanation_source"] == "template"
    texts = [body["explanation"], *body["warnings"]]
    for step in body["agent_steps"]:
        texts.extend([step["title"], step["message"]])
    assert all(bool(CYRILLIC.search(text)) == (language == "ru") for text in texts)


def test_default_language_is_english() -> None:
    with TestClient(app) as client:
        response = client.post("/api/forecast", json=PAYLOAD)
    assert response.status_code == 200
    assert_language(response.json(), "en")


def test_language_isolation_and_identical_predictions() -> None:
    async def requests():
        async with httpx.AsyncClient(transport=httpx.ASGITransport(app=app), base_url="http://test") as client:
            return await asyncio.gather(*(
                client.post("/api/forecast", json={**PAYLOAD, "language": language})
                for language in ["ru", "en", "ru", "en"]
            ))

    responses = asyncio.run(requests())
    for response, language in zip(responses, ["ru", "en", "ru", "en"], strict=True):
        assert response.status_code == 200
        body = response.json()
        assert_language(body, language)
        assert body["turbines"] == responses[0].json()["turbines"]
        assert body["summary"] == responses[0].json()["summary"]


def test_unsupported_language_is_rejected() -> None:
    with TestClient(app) as client:
        response = client.post("/api/forecast", json={**PAYLOAD, "language": "de"})
    assert response.status_code == 422


@pytest.mark.parametrize("language", ["en", "ru"])
def test_llm_is_configured_for_requested_language(monkeypatch, language) -> None:
    from app.api import deps
    from app.core.config import Settings

    configured = []
    monkeypatch.setattr(deps, "get_settings", lambda: Settings(openai_api_key="test-only-placeholder"))
    monkeypatch.setattr(deps, "OpenAIExplainer", lambda **kwargs: configured.append(kwargs))
    # Call the factory without its process cache; no OpenAI client or network call is created.
    deps.get_explainer.__wrapped__(language)
    assert configured[0]["language"] == language
