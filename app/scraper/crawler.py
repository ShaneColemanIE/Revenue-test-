from __future__ import annotations

import logging
from collections import deque
from collections.abc import Iterator
from urllib.parse import urldefrag, urljoin, urlparse

from bs4 import BeautifulSoup

from app.scraper.base import BaseScraper
from app.scraper.models import ScrapedDocument

logger = logging.getLogger(__name__)


class ConfigurableCrawler(BaseScraper):
    """Crawls a category of revenue.ie pages according to a sources.yaml entry."""

    def __init__(self, category: str, config: dict) -> None:
        super().__init__()
        self.category = category
        self.seeds: list[str] = config.get("seeds", [])
        self.follow_links: bool = config.get("follow_links", False)
        self.url_prefixes: list[str] = config.get("url_prefixes", [])
        self.max_depth: int = config.get("max_depth", 0)
        self.allowed_domains: set[str] = set(config.get("allowed_domains", ["www.revenue.ie"]))

    def _should_follow(self, url: str) -> bool:
        parsed = urlparse(url)
        if parsed.scheme not in ("http", "https"):
            return False
        if parsed.netloc not in self.allowed_domains:
            return False
        if self.url_prefixes and not any(parsed.path.startswith(p) for p in self.url_prefixes):
            return False
        return True

    @staticmethod
    def _normalize(url: str) -> str:
        url, _fragment = urldefrag(url)
        return url

    @staticmethod
    def _extract_links(html: str, base_url: str) -> list[str]:
        soup = BeautifulSoup(html, "lxml")
        links = []
        for tag in soup.find_all("a", href=True):
            href = tag["href"].strip()
            if not href or href.startswith(("mailto:", "tel:", "javascript:")):
                continue
            links.append(urljoin(base_url, href))
        return links

    def run(self) -> Iterator[ScrapedDocument]:
        visited: set[str] = set()
        queue: deque[tuple[str, int]] = deque((self._normalize(s), 0) for s in self.seeds)
        yielded = 0

        while queue and yielded < self.max_pages:
            url, depth = queue.popleft()
            if url in visited:
                continue
            visited.add(url)

            try:
                response = self.fetch(url)
            except Exception as exc:
                logger.warning("Skipping %s: %s", url, exc)
                continue

            links: list[str] = []
            if self.is_pdf(url, response):
                title, text = self.extract_pdf_content(response.content)
                content_type = "pdf"
            else:
                html = response.text
                title, text = self.extract_html_content(html, url)
                content_type = "html"
                if self.follow_links and depth < self.max_depth:
                    links = self._extract_links(html, url)

            if text:
                yield ScrapedDocument(
                    url=url,
                    title=title or url,
                    text=text,
                    category=self.category,
                    content_type=content_type,
                )
                yielded += 1
            else:
                logger.info("No extractable text for %s", url)

            for link in links:
                link = self._normalize(link)
                if link not in visited and self._should_follow(link):
                    queue.append((link, depth + 1))
