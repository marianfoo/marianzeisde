"""Write the latest five articles from the blog's posts-only RSS feed."""
from datetime import timezone
from email.utils import parsedate_to_datetime
import json
from pathlib import Path
from urllib.parse import urlsplit
from subprocess import check_output
from xml.etree import ElementTree

FEED = "https://blog.zeis.de/posts/index.xml"
SNAPSHOT = Path(__file__).resolve().parents[1] / "webapp/data/blogPosts.json"


def latest_posts(xml):
    entries = []
    for item in ElementTree.fromstring(xml).findall("./channel/item"):
        title = (item.findtext("title") or "").strip()
        link = (item.findtext("link") or "").strip()
        url = urlsplit(link)
        if not title or url.scheme != "https" or url.netloc != "blog.zeis.de" or not url.path.startswith("/posts/"):
            continue
        published = parsedate_to_datetime(item.findtext("pubDate"))
        if published.tzinfo is None:
            raise ValueError(f"Missing timezone for {title}")
        entries.append((published.astimezone(timezone.utc), {
            "title": title, "date": published.date().isoformat(), "link": link,
        }))

    posts = {}
    for _, post in sorted(entries, key=lambda entry: entry[0], reverse=True):
        posts.setdefault(post["link"], post)
    if len(posts) < 5:
        raise ValueError("RSS feed contains fewer than five distinct articles")
    return list(posts.values())[:5]


if __name__ == "__main__":
    xml = check_output(["curl", "--fail", "--silent", "--show-error", "--location",
                        "--retry", "2", "--max-time", "30", FEED])
    posts = latest_posts(xml)
    snapshot = json.dumps(posts, ensure_ascii=False, indent=2) + "\n"
    temporary = SNAPSHOT.with_suffix(".tmp")
    temporary.write_text(snapshot, encoding="utf-8")
    temporary.replace(SNAPSHOT)
    print(f"Latest article: {posts[0]['title']}")
