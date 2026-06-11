from __future__ import annotations

import io
import logging
import time
import urllib.robotparser
from urllib.parse import urlparse

import requests
import trafilatura
from pypdf import PdfReader
from tenacity import retry, retry_if_exception_type, stop_after_attempt, wait_exponential

from app.config import settings

logger = logging.getLogger(__name__)


class FetchError(Exception):
    """Raised when a URL cannot be fetched after retries."""


class BaseScraper:
    """Shared HTTP, robots.txt, and content-extraction helpers for all scrapers."""

    def __init__(self) -> None:
        self.session = requests.Session()
        self.session.headers.update({"User-Agent": settings.scraper_user_agent})
        self.delay_seconds = settings.scraper_delay_seconds
        self.max_pages = settings.scraper_max_pages_per_source
        self._robots_cache: dict[str, urllib.robotparser.RobotFileParser] = {}

    # ------------------------------------------------------------------
    # robots.txt
    # ------------------------------------------------------------------
    def _robots_for(self, url: str) -> urllib.robotparser.RobotFileParser:
        parsed = urlparse(url)
        origin = f"{parsed.scheme}://{parsed.netloc}"
        if origin not in self._robots_cache:
            parser = urllib.robotparser.RobotFileParser()
            parser.set_url(f"{origin}/robots.txt")
            # Fetch with our own session (proper User-Agent) rather than
            # RobotFileParser.read()'s bare urllib.request, which some sites'
            # WAFs reject with a 403 - and urllib.robotparser treats a 401/403
            # as "disallow everything", masking a bot-blocked robots.txt
            # fetch as a deliberate site-wide disallow.
            try:
                response = self.session.get(f"{origin}/robots.txt", timeout=10)
                if response.status_code == 200:
                    parser.parse(response.text.splitlines())
                else:
                    parser.allow_all = True
            except Exception:
                logger.warning("Could not fetch robots.txt for %s; assuming allowed", origin)
                parser.allow_all = True
            self._robots_cache[origin] = parser
        return self._robots_cache[origin]

    def allowed_by_robots(self, url: str) -> bool:
        parser = self._robots_for(url)
        try:
            return parser.can_fetch(settings.scraper_user_agent, url)
        except Exception:
            return True

    # ------------------------------------------------------------------
    # HTTP
    # ------------------------------------------------------------------
    @retry(
        retry=retry_if_exception_type((requests.exceptions.RequestException, FetchError)),
        stop=stop_after_attempt(3),
        wait=wait_exponential(multiplier=1, min=1, max=10),
        reraise=True,
    )
    def fetch(self, url: str) -> requests.Response:
        if not self.allowed_by_robots(url):
            raise FetchError(f"Disallowed by robots.txt: {url}")

        time.sleep(self.delay_seconds)
        response = self.session.get(url, timeout=30)
        if response.status_code >= 500:
            raise FetchError(f"Server error {response.status_code} for {url}")
        response.raise_for_status()
        return response

    # ------------------------------------------------------------------
    # Content extraction
    # ------------------------------------------------------------------
    @staticmethod
    def extract_html_content(html: str, url: str) -> tuple[str, str]:
        """Return (title, main_text) extracted from an HTML page, stripping nav/boilerplate."""
        if not html or not html.strip():
            return "", ""

        try:
            result = trafilatura.bare_extraction(
                html,
                url=url,
                include_comments=False,
                include_tables=True,
                favor_recall=True,
            )
        except Exception:
            logger.exception("trafilatura failed to extract content from %s", url)
            return "", ""

        if not result:
            return "", ""
        title = result.get("title") or ""
        text = result.get("text") or ""
        return title.strip(), text.strip()

    @staticmethod
    def extract_pdf_content(content: bytes) -> tuple[str, str]:
        """Return (title, text) extracted from PDF bytes."""
        reader = PdfReader(io.BytesIO(content))
        title = ""
        if reader.metadata and reader.metadata.title:
            title = str(reader.metadata.title).strip()

        pages_text = []
        for page in reader.pages:
            try:
                pages_text.append(page.extract_text() or "")
            except Exception:
                logger.exception("Failed to extract text from a PDF page")
        text = "\n\n".join(p.strip() for p in pages_text if p.strip())
        return title, text.strip()

    @staticmethod
    def is_pdf(url: str, response: requests.Response) -> bool:
        content_type = response.headers.get("Content-Type", "")
        return "application/pdf" in content_type or url.lower().endswith(".pdf")
