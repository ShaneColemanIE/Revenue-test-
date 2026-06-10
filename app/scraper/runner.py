from __future__ import annotations

import json
import logging
from pathlib import Path

import yaml

from app.config import settings
from app.scraper.crawler import ConfigurableCrawler
from app.scraper.models import ScrapedDocument

logger = logging.getLogger(__name__)

SOURCES_FILE = Path(__file__).resolve().parent / "sources.yaml"


def load_sources() -> dict:
    with open(SOURCES_FILE, encoding="utf-8") as f:
        return yaml.safe_load(f)


def save_document(doc: ScrapedDocument, output_dir: Path) -> Path:
    category_dir = output_dir / doc.category
    category_dir.mkdir(parents=True, exist_ok=True)
    out_path = category_dir / f"{doc.slug}.json"
    out_path.write_text(json.dumps(doc.to_dict(), indent=2), encoding="utf-8")
    return out_path


def run_scrape(categories: list[str] | None = None, output_dir: Path | None = None) -> int:
    """Run the configured crawlers and write each scraped document as JSON.

    Returns the total number of documents written.
    """
    sources = load_sources()
    output_dir = output_dir or settings.raw_data_dir
    selected = categories or list(sources.keys())

    total = 0
    for category in selected:
        if category not in sources:
            logger.warning("Unknown category %r, skipping", category)
            continue

        logger.info("Scraping category: %s", category)
        crawler = ConfigurableCrawler(category, sources[category])
        count = 0
        for doc in crawler.run():
            save_document(doc, output_dir)
            count += 1
        logger.info("Saved %d documents for category %s", count, category)
        total += count

    return total
