#!/usr/bin/env python
"""CLI to scrape revenue.ie content into data/raw/<category>/*.json.

Usage:
    python scripts/scrape.py                  # scrape all categories
    python scripts/scrape.py tax_rates ebrief  # scrape specific categories

Requires network access to www.revenue.ie. See README for notes on
verifying seed URLs in app/scraper/sources.yaml before running a full scrape.
"""

from __future__ import annotations

import logging
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from app.scraper.runner import run_scrape  # noqa: E402


def main() -> None:
    logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(name)s: %(message)s")
    categories = sys.argv[1:] or None
    total = run_scrape(categories=categories)
    print(f"Done. Wrote {total} documents to data/raw/")


if __name__ == "__main__":
    main()
