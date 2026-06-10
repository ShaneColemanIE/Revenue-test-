#!/usr/bin/env python
"""CLI to build the Chroma vector index from data/raw/*.

Usage:
    python scripts/build_index.py
    python scripts/build_index.py --raw-dir data/fixtures
"""

from __future__ import annotations

import argparse
import logging
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from app.config import settings  # noqa: E402
from app.ingestion.indexer import build_index_from_raw  # noqa: E402


def main() -> None:
    logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(name)s: %(message)s")
    parser = argparse.ArgumentParser()
    parser.add_argument("--raw-dir", type=Path, default=settings.raw_data_dir)
    args = parser.parse_args()

    count = build_index_from_raw(raw_dir=args.raw_dir)
    print(f"Indexed {count} chunks into {settings.index_file}")


if __name__ == "__main__":
    main()
