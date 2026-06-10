#!/usr/bin/env python
"""CLI to build the BM25 search index from data/raw/* (or another directory).

Usage:
    python scripts/build_index.py
    python scripts/build_index.py --raw-dir data/fixtures

If --raw-dir is not given and data/raw is empty (e.g. the scraper hasn't been
run or found nothing), this falls back to data/fixtures so the app always has
something to answer from.
"""

from __future__ import annotations

import argparse
import logging
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from app.config import settings  # noqa: E402
from app.ingestion.indexer import build_index_from_raw  # noqa: E402

FIXTURES_DIR = Path(__file__).resolve().parent.parent / "data" / "fixtures"


def main() -> None:
    logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(name)s: %(message)s")
    parser = argparse.ArgumentParser()
    parser.add_argument("--raw-dir", type=Path, default=None)
    args = parser.parse_args()

    raw_dir = args.raw_dir or settings.raw_data_dir
    count = build_index_from_raw(raw_dir=raw_dir)

    if count == 0 and args.raw_dir is None:
        print(f"No documents found under {raw_dir} - falling back to bundled sample data ({FIXTURES_DIR}).")
        count = build_index_from_raw(raw_dir=FIXTURES_DIR)

    print(f"Indexed {count} chunks into {settings.index_file}")


if __name__ == "__main__":
    main()
