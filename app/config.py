from pathlib import Path

from pydantic_settings import BaseSettings, SettingsConfigDict

BASE_DIR = Path(__file__).resolve().parent.parent


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    anthropic_api_key: str = ""
    anthropic_model: str = "claude-sonnet-4-6"

    index_dir: Path = BASE_DIR / "data" / "index"
    raw_data_dir: Path = BASE_DIR / "data" / "raw"
    processed_data_dir: Path = BASE_DIR / "data" / "processed"

    scraper_user_agent: str = "revenue-qa-bot/0.1 (contact: shane.coleman@ecovis.ie)"
    scraper_delay_seconds: float = 1.0
    scraper_max_pages_per_source: int = 200

    retrieval_top_k: int = 8

    @property
    def index_file(self) -> Path:
        return self.index_dir / "chunks.jsonl"


settings = Settings()
