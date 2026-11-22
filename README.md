# IT Consulting Marian Zeis

Source for [zeis.de](https://zeis.de/), hosted on GitHub Pages. The portfolio renders to static HTML. Its profile, projects, talks, podcasts and article links are available without JavaScript.

## Run locally

Use Python 3.9+ to build and preview the site.

```sh
python3 scripts/build.py
python3 -m http.server 8080 --directory dist
```

Open [localhost:8080](http://localhost:8080/). The build uses the checked-in article snapshot. To refresh it, run `python3 scripts/update_blog.py` before building (requires curl). Run the regression tests with `python3 -m unittest discover -s scripts`.

## Content and publication

- Edit project, talk, podcast, video and profile entries in `webapp/data/`. The `featured` flag selects projects and talks for the homepage. A talk resource with `"kind": "video"` also appears in the recording index. The homepage shows the three newest talk recordings and any standalone demos marked `featured`. Keep talks and podcasts in reverse chronological order.
- The homepage template is `webapp/index.html`. The shared layout, history and legal notice templates are in `templates/`. Skyzo has standalone pages under `webapp/skyzo/`.
- The build uses the same portfolio entries for HTML, the Markdown alternatives at `/index.html.md` and `/history/index.html.md`, and the combined `/llms-full.txt`. The reading index is `/llms.txt`. Keep existing entry IDs when editing titles so links to individual talks, projects, demos and podcast appearances continue to work.
- The Pages workflow builds on pushes to `main`, on manual dispatch and daily at 05:17 UTC. It fetches the posts-only RSS feed from blog.zeis.de, deduplicates by URL, orders by publication time and renders the latest five entries into the HTML. A failed refresh stops publication, so the previous deployment stays online.
- The daily check skips publication when the homepage is unchanged. A monthly workflow renewal keeps the schedule active during long gaps between repository changes.
- PostHog uses the portfolio’s existing EU project. Skyzo uses its own static pages and styling.

## Assets

The original Poppins and Source Sans 3 typefaces are served locally as Latin WOFF2 files under the SIL Open Font License. The list chevron is the original Horizon (v5) slim-arrow-right from SAP’s `@ui5/webcomponents-icons` 2.29.0. The SVG is used directly in CSS. Licenses are shipped in `webapp/assets/licenses/`.
