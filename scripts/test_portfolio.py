import json
from pathlib import Path
import re
from tempfile import TemporaryDirectory
from unittest import TestCase
from unittest.mock import patch

import build
from build import row
from reading import md_link
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

    def test_reading_formats_share_sources_and_citation_targets(self):
        with TemporaryDirectory() as temporary:
            output = Path(temporary) / "dist"
            with patch.object(build, "DIST", output):
                build.main()
            full = (output / "llms-full.txt").read_text()
            for directory, collections in [("", ("projects", "podcasts")), ("history/", ("presentations", "videos"))]:
                html = (output / directory / "index.html").read_text()
                markdown = (output / directory / "index.html.md").read_text()
                base = build.BASE + "/" + directory
                self.assertIn('type="text/markdown" href="' + base + 'index.html.md"', html)
                self.assertIn('rel="describedby"', html)
                for collection in collections:
                    for entry in build.data(collection):
                        fragment = entry["id"]
                        self.assertEqual(html.count('id="' + fragment + '"'), 1)
                        citation = md_link(entry["title"], base + "#" + fragment)
                        self.assertIn(citation, markdown)
                        self.assertIn(citation, full)
                        for link in entry.get("links", []):
                            self.assertIn(md_link(link["text"], link["url"]), markdown)
            history = (output / "history/index.html").read_text()
            graph = json.loads(re.search(r'<script type="application/ld\+json">(.+?)</script>', history)[1])
            self.assertEqual([li["url"] for li in graph["mainEntity"]["itemListElement"]],
                             [build.BASE + "/history/#" + t["id"] for t in build.data("presentations")])
            for post in build.data("blogPosts"):
                self.assertIn(md_link("Read article", post["link"]), full)

    def test_markdown_link_escapes_feed_title_and_url_delimiters(self):
        self.assertEqual(md_link("See [draft] <b>\npost", "https://blog.zeis.de/posts/a(b)/"),
                         r"[See \[draft\] &lt;b&gt; post](https://blog.zeis.de/posts/a%28b%29/)")

    def test_month_precision_is_preserved(self):
        self.assertIn('<time datetime="2026-11">Nov 2026</time> · Release pending',
                      row({"title": "Podcast recording", "meta": "Nov 2026 · Release pending"}))
