"""Render the portfolio for GitHub Pages using only the Python standard library."""
from datetime import date
from html import escape
import json
from pathlib import Path
import shutil
from string import Template

ROOT = Path(__file__).resolve().parents[1]
WEB = ROOT / "webapp"
DIST = ROOT / "dist"
TEMPLATES = ROOT / "templates"
BASE = "https://zeis.de"


def data(name):
    return json.loads((WEB / "data" / f"{name}.json").read_text(encoding="utf-8"))


def template(path, **fields):
    return Template(path.read_text(encoding="utf-8")).substitute(fields)


def detail(item):
    text = item.get("description")
    return f'<span class="detail">{escape(text)}</span>' if text else ""


def meta(item):
    if "date" in item:
        day = date.fromisoformat(item["date"])
        return f'<time class="date" datetime="{day}">{day.day} {day:%b %Y}</time>'
    if item.get("meta"):
        return f'<span class="date">{escape(item["meta"])}</span>'
    return ""


def row(item):
    title = escape(item["title"])
    if "link" in item:
        return (f'<li><a class="row" href="{escape(item["link"])}">{meta(item)}'
                f'<span class="label">{title}</span>{detail(item)}</a></li>')
    links = item.get("links", [])
    resources = ""
    if links:
        anchors = [
            f'<a href="{escape(link["url"])}" aria-label="{escape(link["text"])} — {title}">{escape(link["text"])}</a>'
            for link in links
        ]
        resources = '<div class="resources">' + " ".join(anchors) + "</div>"
    return f'<li class="entry">{meta(item)}<h3>{title}</h3>{detail(item)}{resources}</li>'


def rows(items):
    return "\n".join(row(item) for item in items)


def page(path, title, description, content, extra_head="", lang="en", og_type="website"):
    filename = DIST / path.strip("/") / "index.html"
    filename.parent.mkdir(parents=True, exist_ok=True)
    filename.write_text(template(
        TEMPLATES / "layout.html", lang=lang, title=escape(title), description=escape(description),
        canonical=BASE + path, content=content, extra_head=extra_head, og_type=og_type, year=date.today().year,
    ), encoding="utf-8")


def main():
    projects, contacts = data("projects"), data("contactInfo")
    talks, videos, posts = data("presentations"), data("videos"), data("blogPosts")
    if len(posts) != 5 or len({post["link"] for post in posts}) != 5:
        raise ValueError("Expected exactly five distinct blog posts")

    if DIST.exists():
        shutil.rmtree(DIST)
    DIST.mkdir()
    for directory in ("assets", "css", "skyzo", "data"):
        shutil.copytree(WEB / directory, DIST / directory)
    for file in ("index-cdn.html", "favicon.ico", "robots.txt", "llms.txt"):
        shutil.copy(WEB / file, DIST / file)

    profile = {
        "@context": "https://schema.org", "@type": "ProfilePage", "url": BASE + "/",
        "mainEntity": {
            "@type": "Person", "@id": BASE + "/#marian-zeis", "name": "Marian Zeis",
            "url": BASE + "/", "jobTitle": "Independent SAP developer and consultant",
            "image": BASE + "/data/profile.jpg", "knowsAbout": [
                "ARC-1", "Model Context Protocol", "SAP BTP", "ABAP", "SAPUI5", "SAP Fiori elements",
            ],
            "sameAs": [c["link"] for c in contacts if c["title"] in
                       {"GitHub", "LinkedIn", "SAP Community", "YouTube", "Bluesky", "Mastodon"}],
        },
    }
    legacy_route = """<script>
    function resolveLegalNotice() {
      if (["#impressum", "#/impressum"].includes(location.hash)) location.replace("/impressum/");
    }
    resolveLegalNotice();
    addEventListener("hashchange", resolveLegalNotice);
  </script>"""
    analytics = '<script defer src="/assets/analytics.js"></script>'
    podcasts = data("podcasts")
    recordings = [
        {"title": talk["title"], "meta": talk["meta"], "link": link["url"]}
        for talk in talks for link in talk["links"] if link.get("kind") == "video"
    ]
    homepage = template(
        WEB / "index.html", projects=rows(p for p in projects if p.get("featured")),
        more_projects=rows(p for p in projects if not p.get("featured")),
        recent_talks=rows(t for t in talks if t.get("featured")), posts=rows(posts),
        podcasts=rows(podcasts[:5]), older_podcasts=rows(podcasts[5:]),
        videos=rows(recordings[:3] + [v for v in videos if v.get("featured")]), contacts=rows(contacts),
    )
    page("/", "Marian Zeis | SAP development, ARC-1 & MCP servers",
         "Independent SAP developer Marian Zeis builds ARC-1 and open-source MCP servers for ABAP. Explore his projects, articles, talks and podcasts.",
         homepage, f'{legacy_route}\n<script type="application/ld+json">{json.dumps(profile)}</script>\n{analytics}', og_type="profile")

    by_year = {}
    for talk in talks:
        by_year.setdefault(talk["year"], []).append(talk)
    sections = []
    year_links = []
    for year in sorted(by_year, reverse=True):
        label = str(year)
        anchor = f"year-{year}"
        sections.append(f'<section class="panel" id="{anchor}"><h2>{label}</h2><ul class="rows">{rows(by_year[year])}</ul></section>')
        year_links.append(f'<a href="#{anchor}">{label}</a>')
    page("/history/", "Talks & professional history | Marian Zeis",
         "Marian Zeis’s talks, slides and recordings from SAP TechEd, UI5con, Devtoberfest and SAP Inside Track, plus his professional experience.",
         template(TEMPLATES / "history.html", years="\n".join(sections), year_links=" ".join(year_links),
                  recordings=rows(recordings), demos=rows(videos), experience=rows(data("experience"))), analytics)
    page("/impressum/", "Impressum / Legal notice | IT Consulting Marian Zeis",
         "Anbieterkennzeichnung und Kontakt für IT Consulting Marian Zeis in Mainleus.",
         (TEMPLATES / "impressum.html").read_text(encoding="utf-8"), lang="de")

    paths = ["/", "/history/", "/impressum/", "/skyzo/", "/skyzo/datenschutz.html", "/skyzo/nutzungsbedingungen.html"]
    urls = "\n".join(f"  <url><loc>{BASE}{path}</loc></url>" for path in paths)
    (DIST / "sitemap.xml").write_text(
        f'<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n{urls}\n</urlset>\n',
        encoding="utf-8",
    )


if __name__ == "__main__":
    main()
