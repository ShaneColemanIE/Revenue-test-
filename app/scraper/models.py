from __future__ import annotations

from dataclasses import asdict, dataclass, field
from datetime import datetime, timezone


@dataclass
class ScrapedDocument:
    """A single page or PDF pulled from revenue.ie or cro.ie, reduced to clean text."""

    url: str
    title: str
    text: str
    category: str  # tax_rates | tdm | guidance | ebrief | cro
    content_type: str  # html | pdf
    fetched_at: str = field(default_factory=lambda: datetime.now(timezone.utc).isoformat())
    metadata: dict = field(default_factory=dict)

    def to_dict(self) -> dict:
        return asdict(self)

    @property
    def slug(self) -> str:
        """Filesystem-safe identifier derived from the URL path."""
        from urllib.parse import urlparse

        path = urlparse(self.url).path.strip("/")
        return path.replace("/", "__") or "index"
