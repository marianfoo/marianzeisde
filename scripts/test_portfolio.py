from unittest import TestCase

from build import row
from update_blog import latest_posts


def article(number, link=None):
    url = link or f"https://blog.zeis.de/posts/{number}/"
    return (f"<item><title>Article {number}</title><pubDate>{number:02} Nov 2026 12:00:00 +0100</pubDate>"
            f"<link>{url}</link></item>")


def feed(items):
    return f"<rss><channel>{''.join(items)}</channel></rss>"


class PortfolioTests(TestCase):
    def test_five_newest_distinct_articles(self):
        items = [article(n) for n in range(1, 8)]
        items += [article(7), article(8, "https://blog.zeis.de/tags/sap/"),
                  article(9, "https://example.org/posts/9/")]
        posts = latest_posts(feed(items))
        self.assertEqual([p["title"] for p in posts], [f"Article {n}" for n in (7, 6, 5, 4, 3)])
        self.assertEqual(posts[0]["date"], "2026-11-07")

    def test_short_feed_stops_publication(self):
        with self.assertRaises(ValueError):
            latest_posts(feed([article(1)]))

    def test_article_markup_is_escaped(self):
        html = row({"title": "ABAP < UI5 & MCP", "link": "https://blog.zeis.de/posts/test/"})
        self.assertIn("ABAP &lt; UI5 &amp; MCP", html)
