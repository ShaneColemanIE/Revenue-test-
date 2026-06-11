# Irish Revenue Q&A

A small app that scrapes content from [revenue.ie](https://www.revenue.ie) (tax
rates & thresholds, Tax and Duty Manuals, general guidance, and eBriefs) and
[cro.ie](https://www.cro.ie) (Companies Registration Office guidance on
registering and running companies and business names), indexes it for search,
and answers questions about it using Claude with citations back to the source
pages.

**This is general information, not professional tax advice.** Answers are
generated from scraped content that may be incomplete or out of date. Always
verify anything important on revenue.ie or with a tax professional.

> **New to this / no coding experience?** See [DEPLOY.md](DEPLOY.md) for a
> step-by-step guide to getting a live website with a shareable link.

## How it works

```
scrape → data/raw/<category>/*.json → build index → data/index/chunks.jsonl → BM25 search → Claude → answer + sources
```

1. **Scraper** (`app/scraper/`) crawls revenue.ie and cro.ie pages/PDFs
   configured in `app/scraper/sources.yaml`, extracts clean text (via
   `trafilatura` for HTML and `pypdf` for PDFs), and writes one JSON file per
   page to `data/raw/`.
2. **Indexer** (`app/ingestion/`) chunks each document and writes them to
   `data/index/chunks.jsonl`.
3. **Retriever** (`app/qa/retriever.py`) uses BM25 (keyword-based ranking,
   pure Python, no model downloads) to find the most relevant chunks for a
   question.
4. **Answerer** (`app/qa/answerer.py`) sends the question plus retrieved
   chunks to Claude, which answers grounded in that context and cites sources.
5. **API + UI** (`app/api/`, `app/web/`) - FastAPI backend with a small chat
   frontend.

## Setup

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
# edit .env and set ANTHROPIC_API_KEY
```

## 1. Scrape revenue.ie and cro.ie

Requires network access to www.revenue.ie and www.cro.ie (this won't work
from a sandbox without internet access).

```bash
python scripts/scrape.py                  # all categories
python scripts/scrape.py tax_rates ebrief # specific categories only
python scripts/scrape.py cro              # CRO company-registration guidance
```

This writes JSON files to `data/raw/<category>/`.

> **Before running a full scrape**, spot-check a few seed URLs in
> `app/scraper/sources.yaml` in a browser. Both sites restructure their URLs
> periodically; the crawler logs and skips any URL that 404s but won't find
> replacements automatically. The crawler respects `robots.txt` and waits
> `SCRAPER_DELAY_SECONDS` between requests (default 1s) - please keep a
> reasonable delay since these are public services' websites.

## 2. Build the search index

```bash
python scripts/build_index.py
```

This reads everything under `data/raw/` and writes `data/index/chunks.jsonl`.
Re-run this any time you re-scrape.

To try the app immediately without scraping, build the index from the bundled
sample data instead:

```bash
python scripts/build_index.py --raw-dir data/fixtures
```

(`data/fixtures/` contains a handful of hand-written sample pages - one per
category - for development and testing. They are **not** real scraped content.)

## 3. Run the app

```bash
uvicorn app.main:app --reload
```

Open http://localhost:8000 to ask questions in the browser, or use the API
directly:

```bash
curl -X POST http://localhost:8000/api/ask \
  -H "Content-Type: application/json" \
  -d '{"question": "What is the standard rate cut-off point for a single person?"}'
```

Optional request fields:
- `top_k` (1-20): number of chunks to retrieve (default 6)
- `category`: restrict retrieval to one of `tax_rates`, `tdm`, `guidance`, `ebrief`, `cro`

`GET /api/health` reports how many chunks are currently indexed.

## Tests

```bash
pytest
```

Tests run against the fixture data in `data/fixtures/` and mock the Claude API
call, so they don't need `ANTHROPIC_API_KEY` or network access.

## Project layout

```
app/
  scraper/      crawler, content extraction, sources.yaml seed config
  ingestion/    chunking + index building
  qa/           BM25 retriever, Claude prompt + answerer
  api/          FastAPI routes & schemas
  web/          static chat frontend
  config.py     settings (env-driven)
scripts/
  scrape.py       run the crawler
  build_index.py  (re)build the search index
data/
  raw/          scraped JSON documents (gitignored)
  index/        chunks.jsonl search index (gitignored)
  fixtures/     sample documents for dev/testing
tests/
```
