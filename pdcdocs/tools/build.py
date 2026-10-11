#!/usr/bin/env python3
"""Render content markdown into the static PDC documentation site."""

from pathlib import Path
import re
import markdown

ROOT = Path(__file__).resolve().parents[1]
CONTENT = ROOT / "content"

NAV = [
    ("Learn", [
        ("learn/what-is-pdc", "What PDC is"),
        ("learn/how-it-works", "How PDC works"),
        ("learn/faq", "FAQ"),
    ]),
    ("Use", [
        ("use/getting-started", "Getting started"),
        ("use/wallets", "Wallets"),
        ("use/security", "Security and privacy"),
        ("use/troubleshooting", "Troubleshooting"),
    ]),
    ("Build", [
        ("build/from-source", "Build from source"),
        ("build/rpc", "Node RPC"),
        ("build/assets", "Confidential assets"),
        ("build/aliases", "Aliases"),
        ("build/services", "Escrow, swaps, and offers"),
    ]),
    ("Mine", [
        ("mine/mining", "Mining"),
    ]),
    ("Stake", [
        ("stake/staking", "Staking"),
        ("stake/proof-of-stake", "Proof of stake"),
    ]),
    ("Code", [
        ("code/parameters", "Network parameters"),
        ("code/source-map", "Source map"),
    ]),
]

FLAT = [item for _, group in NAV for item in group]
SUMMARIES = {
    "learn/what-is-pdc": "The chain, the release, and what a transfer hides.",
    "learn/how-it-works": "Addresses, proofs, consensus, and the block reward.",
    "learn/faq": "Short answers grounded in the source tree.",
    "use/getting-started": "Install the current release, sync, and make a wallet.",
    "use/wallets": "Desktop wallet, simplewallet, and address types.",
    "use/security": "What stays private, and what you still have to protect.",
    "use/troubleshooting": "Genesis, ports, and sync.",
    "build/from-source": "Clone, dependencies, and the daemon build.",
    "build/rpc": "JSON-RPC on port 19211, bound to localhost.",
    "build/assets": "Issue a token without revealing transfer amounts.",
    "build/aliases": "Human-readable names. The fee is burned.",
    "build/services": "Escrow, ionic swaps, and marketplace offers.",
    "mine/mining": "RandomARQ, XMRig, and the stratum port.",
    "stake/staking": "Keep a synced wallet online and stake PDC.",
    "stake/proof-of-stake": "Zarcanum, coinstake age, and the PoS run limit.",
    "code/parameters": "The numbers a node boots with.",
    "code/source-map": "Where each subsystem lives in the tree.",
}


def parse(path: Path):
    text = path.read_text()
    title = path.stem
    if text.startswith("---\n"):
        _, meta, body = text.split("---", 2)
        for line in meta.strip().splitlines():
            if line.startswith("title:"):
                title = line.split(":", 1)[1].strip()
        return title, body.strip()
    return title, text.strip()


def prefix_for(slug: str) -> str:
    if slug == "index":
        return ""
    return "../" * slug.count("/")


def render_nav(current: str, prefix: str) -> str:
    parts = []
    for section, items in NAV:
        links = []
        for slug, label in items:
            href = prefix + slug + ".html"
            current_attr = ' aria-current="page"' if slug == current else ""
            links.append(f'<a href="{href}"{current_attr}>{label}</a>')
        parts.append(f'<div class="nav-group"><h2>{section}</h2>{"".join(links)}</div>')
    return "\n".join(parts)


def page(slug: str, title: str, section: str, body_html: str, toc_html: str):
    prefix = prefix_for(slug)
    canonical = "" if slug == "index" else f"{slug}.html"
    idx = next((i for i, (s, _) in enumerate(FLAT) if s == slug), None)
    pager = ""
    if idx is not None:
        prev_html = ""
        next_html = ""
        if idx > 0:
            ps, pl = FLAT[idx - 1]
            prev_html = f'<a href="{prefix}{ps}.html">← {pl}</a>'
        if idx + 1 < len(FLAT):
            ns, nl = FLAT[idx + 1]
            next_html = f'<a href="{prefix}{ns}.html">{nl} →</a>'
        pager = f'<nav class="pager">{prev_html}{next_html}</nav>'
    home = prefix + "index.html"
    html = f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>{title} · PDC Docs</title>
  <meta name="description" content="{SUMMARIES.get(slug, title)}">
  <link rel="canonical" href="https://docs.privacydatacoin.com/{canonical}">
  <link rel="icon" href="{prefix}favicon.png" type="image/png">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&family=Montserrat:wght@600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="{prefix}css/docs.css">
</head>
<body>
  <canvas class="rain" aria-hidden="true"></canvas>
  <button class="menu-btn" type="button" data-menu aria-expanded="false">Menu</button>
  <div class="backdrop" data-backdrop hidden></div>
  <aside class="sidebar">
    <a class="brand" href="{home}">
      <img class="brand-mark" src="{prefix}graphics/pdc-mark.png" width="42" height="42" alt="">
      <span><strong>PDC</strong><small>Documentation</small></span>
    </a>
    <a class="release-chip" data-doc-release href="https://github.com/PrivacyDataCoin-Project/PDC/releases/latest"><span data-doc-version>v2.4.2</span></a>
    <input class="search" type="search" placeholder="Filter topics" aria-label="Filter topics">
    {render_nav(slug, prefix)}
  </aside>
  <div class="layout">
    <main>
      <article>
        <p class="kicker">{section}</p>
        <h1>{title}</h1>
        {body_html}
        {pager}
        <p class="footer">Edition <a data-doc-release href="https://github.com/PrivacyDataCoin-Project/PDC/releases/latest"><span data-doc-version>v2.4.2</span></a> follows the latest release of <a href="https://github.com/PrivacyDataCoin-Project/PDC">PrivacyDataCoin-Project/PDC</a>. The manual is <a href="https://docs.privacydatacoin.com/">docs.privacydatacoin.com</a>. The public site is <a href="https://privacydatacoin.com/">privacydatacoin.com</a>. The block explorer is <a href="https://explorer.privacydatacoin.com/">explorer.privacydatacoin.com</a>.</p>
      </article>
    </main>
    <aside class="toc">
      <h2>On this page</h2>
      {toc_html or "<p>This page is short.</p>"}
    </aside>
  </div>
  <script src="{prefix}js/rain.js"></script>
  <script src="{prefix}js/docs.js"></script>
  <script src="{prefix}js/release.js"></script>
</body>
</html>
"""
    out = ROOT / "index.html" if slug == "index" else ROOT / f"{slug}.html"
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(html)


def main():
    converter = markdown.Markdown(extensions=["tables", "fenced_code", "sane_lists", "toc"])
    home_title, home_body = parse(CONTENT / "index.md")
    cards = ['<div class="cards">']
    for section, items in NAV:
        slug, label = items[0]
        cards.append(
            f'<a class="card" href="{slug}.html"><span>{section}</span><strong>{label}</strong><p>{SUMMARIES[slug]}</p></a>'
        )
    cards.append("</div>")
    home_html = re.sub(r"\.md(?=[\"#)])", ".html", converter.convert(home_body))
    home_toc = "<ul>" + "".join(
        f'<li><a href="{items[0][0]}.html">{section}</a></li>' for section, items in NAV
    ) + "</ul>"
    page("index", home_title, "Privacy Data Coin", home_html + "\n" + "\n".join(cards), home_toc)
    for section, items in NAV:
        for slug, _label in items:
            path = CONTENT / f"{slug}.md"
            title, body = parse(path)
            converter.reset()
            html = re.sub(r"\.md(?=[\"#)])", ".html", converter.convert(body))
            page(slug, title, section, html, converter.toc)
    print("built", 1 + len(FLAT), "pages")


if __name__ == "__main__":
    main()
