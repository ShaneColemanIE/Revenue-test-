from unittest.mock import Mock, patch

from app.scraper.base import BaseScraper
from app.scraper.crawler import ConfigurableCrawler

SAMPLE_HTML = """
<html>
<head><title>Tax rates and the standard rate cut-off point</title></head>
<body>
<nav>Home | Jobs and pensions | Self-assessment | Contact us</nav>
<article>
<h1>Tax rates and the standard rate cut-off point</h1>
<p>There are two tax rates in Ireland for personal income: a standard rate
and a higher rate. The standard rate applies up to your standard rate
cut-off point.</p>
<p>For a single person, the standard rate cut-off point is EUR 42,000 for
the 2025 tax year. Income up to this amount is taxed at 20 percent, and any
income above this amount is taxed at 40 percent.</p>
</article>
<footer>Copyright Office of the Revenue Commissioners</footer>
</body>
</html>
"""


def test_extract_html_content_strips_boilerplate():
    title, text = BaseScraper.extract_html_content(SAMPLE_HTML, "https://www.revenue.ie/en/example.aspx")

    assert "standard rate cut-off point" in text
    assert "42,000" in text
    assert "Home | Jobs and pensions" not in text
    assert "Copyright Office of the Revenue Commissioners" not in text


def test_extract_html_content_handles_empty_html():
    title, text = BaseScraper.extract_html_content("", "https://www.revenue.ie/en/empty.aspx")

    assert title == ""
    assert text == ""


def _make_crawler(**overrides):
    config = {
        "seeds": ["https://www.revenue.ie/en/tax-professionals/tdm/index.aspx"],
        "follow_links": True,
        "url_prefixes": ["/en/tax-professionals/tdm/"],
        "max_depth": 2,
        "allowed_domains": ["www.revenue.ie"],
    }
    config.update(overrides)
    return ConfigurableCrawler("tdm", config)


def test_should_follow_respects_url_prefix():
    crawler = _make_crawler()

    assert crawler._should_follow("https://www.revenue.ie/en/tax-professionals/tdm/part-04/04-01-01.pdf")
    assert not crawler._should_follow("https://www.revenue.ie/en/some-other-section/index.aspx")


def test_should_follow_respects_allowed_domains():
    crawler = _make_crawler()

    assert not crawler._should_follow("https://example.com/en/tax-professionals/tdm/index.aspx")


def test_should_follow_rejects_non_http_schemes():
    crawler = _make_crawler()

    assert not crawler._should_follow("javascript:void(0)")
    assert not crawler._should_follow("mailto:info@revenue.ie")


def test_normalize_strips_url_fragment():
    assert ConfigurableCrawler._normalize("https://www.revenue.ie/en/page.aspx#section-2") == (
        "https://www.revenue.ie/en/page.aspx"
    )


def test_allowed_by_robots_treats_blocked_robots_txt_as_allowed():
    """A 403/non-200 fetching robots.txt (e.g. a WAF blocking the request)
    should not be treated as a site-wide disallow."""
    scraper = BaseScraper()

    with patch.object(scraper.session, "get", return_value=Mock(status_code=403, text="")):
        assert scraper.allowed_by_robots("https://www.cro.ie/")


def test_allowed_by_robots_respects_real_robots_txt():
    scraper = BaseScraper()
    robots_txt = "User-agent: *\nDisallow: /private/\n"

    with patch.object(scraper.session, "get", return_value=Mock(status_code=200, text=robots_txt)):
        assert scraper.allowed_by_robots("https://www.example.com/public/page")
        assert not scraper.allowed_by_robots("https://www.example.com/private/page")


def test_extract_links_resolves_and_filters():
    html = (
        '<a href="/en/tax-professionals/tdm/part-04/04-01-01.pdf">Part 4</a>'
        '<a href="mailto:info@revenue.ie">Email us</a>'
        '<a href="https://www.revenue.ie/en/tax-professionals/tdm/index.aspx#top">Back to top</a>'
    )

    links = ConfigurableCrawler._extract_links(html, "https://www.revenue.ie/en/tax-professionals/tdm/index.aspx")

    assert "https://www.revenue.ie/en/tax-professionals/tdm/part-04/04-01-01.pdf" in links
    assert not any(link.startswith("mailto:") for link in links)
    assert "https://www.revenue.ie/en/tax-professionals/tdm/index.aspx#top" in links
