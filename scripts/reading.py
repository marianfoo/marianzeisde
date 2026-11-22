"""Build citation-friendly Markdown from the same public entries as the HTML."""
import re
from urllib.parse import quote


def md_text(value):
    # A feed title may contain line breaks, brackets or literal HTML.
    value = " ".join(value.split()).replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")
    return re.sub(r"([\\\[\]*_`])", r"\\\1", value)


def md_link(label, url):
    # Preserve existing percent-encoded URLs. Parentheses can end a Markdown link.
    target = quote(url, safe=":/?#@!$&'*+,;=%~")
    return f"[{md_text(label)}]({target})"


def entries(items, page_url, source_label):
    blocks = []
    for item in items:
        heading = md_text(item["title"])
        if "id" in item:
            heading = md_link(item["title"], page_url + "#" + item["id"])
        lines = ["### " + heading]
        for field in ("date", "meta", "description"):
            if item.get(field):
                lines.append(md_text(item[field]))
        sources = [md_link(link["text"], link["url"]) for link in item.get("links", [])]
        if "link" in item:
            sources.insert(0, md_link(source_label, item["link"]))
        if sources:
            lines.append(" · ".join(sources))
        blocks.append("\n\n".join(lines))
    return "\n\n".join(blocks)


def section(title, items, page_url, source_label="Source"):
    return "## " + title + "\n\n" + entries(items, page_url, source_label)


def write_reading_files(dist, base, portfolio, by_year, featured_videos):
    person = portfolio["profile"]
    home_url = base + "/"
    history_url = base + "/history/"
    home_sections = [
        "# " + md_text(person["name"]),
        md_link("Portfolio on zeis.de", home_url),
        f'{person["role"]} based in {person["location"]}. I run {person["company"]}.',
        person["communityRole"] + ". My work focuses on " + ", ".join(person["focus"]) + ".",
        section("Projects", portfolio["projects"], home_url, "Project"),
        section("Latest blog posts", portfolio["blogPosts"], home_url, "Read article"),
        section("Podcast appearances", portfolio["podcasts"], home_url),
        section("Contact and public profiles", portfolio["contactInfo"], home_url, "Contact or profile"),
    ]
    archive_sections = [
        "# Marian Zeis — talks and professional history",
        md_link("Talk archive on zeis.de", history_url),
        "My talks, panels and live demos, with the original slides, recordings and event programs where available.",
    ]
    for year in sorted(by_year, reverse=True):
        archive_sections.append(section(str(year), by_year[year], history_url))
    archive_sections.extend([
        section("Demos and community broadcasts", portfolio["videos"], history_url, "Watch or open demo"),
        section("Professional experience", portfolio["experience"], history_url),
    ])

    talks = [talk for group in by_year.values() for talk in group if talk.get("featured")]
    home = home_sections + [
        section("Featured talks", talks, history_url),
        section("Videos and demos", featured_videos, history_url, "Watch or open demo"),
        md_link("All talks, recordings, demos and professional experience", history_url + "index.html.md"),
    ]
    (dist / "index.html.md").write_text("\n\n".join(home) + "\n", encoding="utf-8")
    (dist / "history/index.html.md").write_text("\n\n".join(archive_sections) + "\n", encoding="utf-8")
    (dist / "llms-full.txt").write_text("\n\n".join(home_sections + archive_sections) + "\n", encoding="utf-8")
